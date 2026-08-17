import { Router } from 'express'
import db from '../db.js'

const router = Router()

// GET /api/exercises
router.get('/', (req, res) => {
  try {
    const exercises = db.prepare('SELECT * FROM exercises ORDER BY id ASC').all()
    return res.json({ exercises })
  } catch (err) {
    console.error('[Exercises Error]', err)
    return res.status(500).json({ error: 'Failed to fetch exercise library' })
  }
})

// GET /api/exercises/prescribed
router.get('/prescribed', (req, res) => {
  try {
    const patientId = req.query.patientId || 1
    const protocols = db.prepare(`
      SELECT pe.*, e.title, e.target_area, e.category, e.difficulty, e.description, e.instructions, e.video_url,
             doc.name as prescribed_by_name
      FROM patient_exercises pe
      JOIN exercises e ON pe.exercise_id = e.id
      LEFT JOIN users doc ON pe.prescribed_by = doc.id
      WHERE pe.patient_id = ?
      ORDER BY pe.id ASC
    `).all(patientId)

    return res.json({ prescribedExercises: protocols })
  } catch (err) {
    console.error('[Prescribed Exercises Error]', err)
    return res.status(500).json({ error: 'Failed to fetch prescribed protocols' })
  }
})

// POST /api/exercises/complete
router.post('/complete', (req, res) => {
  try {
    const { patientExerciseId, completed = true } = req.body
    if (!patientExerciseId) {
      return res.status(400).json({ error: 'patientExerciseId is required' })
    }

    const val = completed ? 1 : 0
    const now = completed ? new Date().toISOString() : null

    db.prepare(`
      UPDATE patient_exercises 
      SET completed_today = ?, last_completed_at = ?
      WHERE id = ?
    `).run(val, now, patientExerciseId)

    const updated = db.prepare(`
      SELECT pe.*, e.title 
      FROM patient_exercises pe
      JOIN exercises e ON pe.exercise_id = e.id
      WHERE pe.id = ?
    `).get(patientExerciseId)

    return res.json({ success: true, protocol: updated })
  } catch (err) {
    console.error('[Complete Exercise Error]', err)
    return res.status(500).json({ error: 'Failed to update exercise completion' })
  }
})

// POST /api/exercises/prescribe (Clinician assigns routine)
router.post('/prescribe', (req, res) => {
  try {
    const { patientId, exerciseId, prescribedBy = 2, sets = 3, reps = 10, durationSecs = 60, frequency = 'Daily' } = req.body

    if (!patientId || !exerciseId) {
      return res.status(400).json({ error: 'patientId and exerciseId are required' })
    }

    const result = db.prepare(`
      INSERT INTO patient_exercises (patient_id, exercise_id, prescribed_by, sets, reps, duration_secs, frequency, completed_today)
      VALUES (?, ?, ?, ?, ?, ?, ?, 0)
    `).run(patientId, exerciseId, prescribedBy, sets, reps, durationSecs, frequency)

    const assigned = db.prepare(`
      SELECT pe.*, e.title, e.target_area 
      FROM patient_exercises pe
      JOIN exercises e ON pe.exercise_id = e.id
      WHERE pe.id = ?
    `).get(result.lastInsertRowid)

    return res.status(201).json({ success: true, protocol: assigned })
  } catch (err) {
    console.error('[Prescribe Error]', err)
    return res.status(500).json({ error: 'Failed to prescribe exercise' })
  }
})

export default router
