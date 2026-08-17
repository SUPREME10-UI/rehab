import { Router } from 'express'
import db from '../db.js'

const router = Router()

// GET /api/appointments
router.get('/', (req, res) => {
  try {
    const { patientId, therapistId, status } = req.query
    
    let query = `
      SELECT a.*, 
             u.name as patient_name, u.email as patient_email,
             doc.name as therapist_name, doc.title as therapist_title, doc.avatar_color as therapist_color
      FROM appointments a
      JOIN patients p ON a.patient_id = p.id
      JOIN users u ON p.user_id = u.id
      JOIN users doc ON a.therapist_id = doc.id
      WHERE 1=1
    `
    const params = []

    if (patientId) {
      query += ' AND a.patient_id = ?'
      params.push(patientId)
    }

    if (therapistId) {
      query += ' AND a.therapist_id = ?'
      params.push(therapistId)
    }

    if (status) {
      query += ' AND a.status = ?'
      params.push(status)
    }

    query += ' ORDER BY a.id DESC'

    const appointments = db.prepare(query).all(...params)
    return res.json({ appointments })
  } catch (err) {
    console.error('[Appointments Error]', err)
    return res.status(500).json({ error: 'Failed to fetch appointments' })
  }
})

// POST /api/appointments/book
router.post('/book', (req, res) => {
  try {
    const {
      patientId = 1,
      therapistId = 2,
      title,
      dateDay,
      dateMonth,
      fullDate,
      time,
      location = 'Main Rehab Center Room 102',
      type = 'Physical Therapy',
      telehealth = 0,
      duration = '60 min',
      notes = ''
    } = req.body

    if (!title || !time) {
      return res.status(400).json({ error: 'Session title and time are required' })
    }

    const today = new Date()
    const finalDate = fullDate || today.toISOString().split('T')[0]
    const finalDay = dateDay || String(today.getDate())
    const finalMonth = dateMonth || today.toLocaleString('default', { month: 'short' }).toUpperCase()

    const insert = db.prepare(`
      INSERT INTO appointments (patient_id, therapist_id, title, date_day, date_month, full_date, time, location, type, telehealth, duration, status, notes)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Upcoming', ?)
    `)

    const result = insert.run(
      patientId,
      therapistId,
      title,
      finalDay,
      finalMonth,
      finalDate,
      time,
      location,
      type,
      telehealth ? 1 : 0,
      duration,
      notes
    )

    const booked = db.prepare(`
      SELECT a.*, doc.name as therapist_name, doc.title as therapist_title
      FROM appointments a
      JOIN users doc ON a.therapist_id = doc.id
      WHERE a.id = ?
    `).get(result.lastInsertRowid)

    return res.status(201).json({ success: true, appointment: booked })
  } catch (err) {
    console.error('[Book Appointment Error]', err)
    return res.status(500).json({ error: 'Failed to book appointment' })
  }
})

// PATCH /api/appointments/:id/status
router.patch('/:id/status', (req, res) => {
  try {
    const { status } = req.body
    if (!status || !['Upcoming', 'Completed', 'Cancelled'].includes(status)) {
      return res.status(400).json({ error: 'Valid status required (Upcoming, Completed, Cancelled)' })
    }

    db.prepare('UPDATE appointments SET status = ? WHERE id = ?').run(status, req.params.id)
    const updated = db.prepare('SELECT * FROM appointments WHERE id = ?').get(req.params.id)
    
    return res.json({ success: true, appointment: updated })
  } catch (err) {
    console.error('[Update Appointment Status Error]', err)
    return res.status(500).json({ error: 'Failed to update appointment status' })
  }
})

export default router
