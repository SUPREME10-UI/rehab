import { Router } from 'express'
import db from '../db.js'

const router = Router()

// GET /api/clinical/notes
router.get('/notes', (req, res) => {
  try {
    const patientId = req.query.patientId || 1
    const notes = db.prepare(`
      SELECT n.*, doc.name as author_name, doc.title as author_title
      FROM clinical_notes n
      JOIN users doc ON n.author_id = doc.id
      WHERE n.patient_id = ?
      ORDER BY n.id DESC
    `).all(patientId)

    return res.json({ clinicalNotes: notes })
  } catch (err) {
    console.error('[Clinical Notes Error]', err)
    return res.status(500).json({ error: 'Failed to fetch clinical notes' })
  }
})

// POST /api/clinical/notes
router.post('/notes', (req, res) => {
  try {
    const { patientId = 1, authorId = 2, noteType = 'Progress Note', title, content, fimScore, painLevel } = req.body

    if (!title || !content) {
      return res.status(400).json({ error: 'Note title and content are required' })
    }

    const todayDate = new Date().toISOString().split('T')[0]

    const result = db.prepare(`
      INSERT INTO clinical_notes (patient_id, author_id, note_type, title, content, fim_score, pain_level, date)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `).run(patientId, authorId, noteType, title, content, fimScore || null, painLevel || null, todayDate)

    const note = db.prepare(`
      SELECT n.*, doc.name as author_name, doc.title as author_title
      FROM clinical_notes n
      JOIN users doc ON n.author_id = doc.id
      WHERE n.id = ?
    `).get(result.lastInsertRowid)

    return res.status(201).json({ success: true, note })
  } catch (err) {
    console.error('[Add Clinical Note Error]', err)
    return res.status(500).json({ error: 'Failed to add clinical note' })
  }
})

// GET /api/clinical/inquiries (Admin review)
router.get('/inquiries', (req, res) => {
  try {
    const inquiries = db.prepare('SELECT * FROM program_inquiries ORDER BY id DESC').all()
    return res.json({ inquiries })
  } catch (err) {
    console.error('[Inquiries Error]', err)
    return res.status(500).json({ error: 'Failed to fetch inquiries' })
  }
})

// POST /api/clinical/inquiries (Landing page submission)
router.post('/inquiries', (req, res) => {
  try {
    const { fullName, email, phone, programTrack = 'general', message } = req.body

    if (!fullName || !email) {
      return res.status(400).json({ error: 'Full name and email address are required' })
    }

    const result = db.prepare(`
      INSERT INTO program_inquiries (full_name, email, phone, program_track, message, status)
      VALUES (?, ?, ?, ?, ?, 'New')
    `).run(fullName, email, phone || '', programTrack, message || '')

    const inquiry = db.prepare('SELECT * FROM program_inquiries WHERE id = ?').get(result.lastInsertRowid)

    return res.status(201).json({ success: true, inquiry })
  } catch (err) {
    console.error('[Submit Inquiry Error]', err)
    return res.status(500).json({ error: 'Failed to submit program inquiry' })
  }
})

export default router
