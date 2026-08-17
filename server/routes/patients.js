import { Router } from 'express'
import db from '../db.js'

const router = Router()

// GET /api/patients
router.get('/', (req, res) => {
  try {
    const patients = db.prepare(`
      SELECT p.*, u.name, u.email, u.phone, u.avatar, u.avatar_color,
             doc.name as therapist_name, doc.title as therapist_title
      FROM patients p
      JOIN users u ON p.user_id = u.id
      LEFT JOIN users doc ON p.assigned_therapist_id = doc.id
      ORDER BY p.id DESC
    `).all()

    return res.json({ patients })
  } catch (err) {
    console.error('[Patients Error]', err)
    return res.status(500).json({ error: 'Failed to fetch patients list' })
  }
})

// GET /api/patients/:id
router.get('/:id', (req, res) => {
  try {
    const patient = db.prepare(`
      SELECT p.*, u.name, u.email, u.phone, u.avatar, u.avatar_color,
             doc.name as therapist_name, doc.title as therapist_title
      FROM patients p
      JOIN users u ON p.user_id = u.id
      LEFT JOIN users doc ON p.assigned_therapist_id = doc.id
      WHERE p.id = ? OR p.user_id = ?
    `).get(req.params.id, req.params.id)

    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' })
    }

    const appointments = db.prepare('SELECT * FROM appointments WHERE patient_id = ? ORDER BY id DESC').all(patient.id)
    const notes = db.prepare('SELECT * FROM clinical_notes WHERE patient_id = ? ORDER BY id DESC').all(patient.id)
    const exercises = db.prepare(`
      SELECT pe.*, e.title, e.target_area, e.category, e.difficulty, e.instructions, e.video_url
      FROM patient_exercises pe
      JOIN exercises e ON pe.exercise_id = e.id
      WHERE pe.patient_id = ?
    `).all(patient.id)

    return res.json({
      patient,
      appointments,
      clinicalNotes: notes,
      prescribedExercises: exercises
    })
  } catch (err) {
    console.error('[Patient Detail Error]', err)
    return res.status(500).json({ error: 'Failed to fetch patient detail' })
  }
})

// PUT /api/patients/:id
router.put('/:id', (req, res) => {
  try {
    const { mobility_score, pain_level, recovery_stage, target_goal } = req.body
    
    const update = db.prepare(`
      UPDATE patients 
      SET mobility_score = COALESCE(?, mobility_score),
          pain_level = COALESCE(?, pain_level),
          recovery_stage = COALESCE(?, recovery_stage),
          target_goal = COALESCE(?, target_goal)
      WHERE id = ? OR user_id = ?
    `)

    update.run(mobility_score, pain_level, recovery_stage, target_goal, req.params.id, req.params.id)

    const updated = db.prepare('SELECT * FROM patients WHERE id = ? OR user_id = ?').get(req.params.id, req.params.id)
    return res.json({ success: true, patient: updated })
  } catch (err) {
    console.error('[Update Patient Error]', err)
    return res.status(500).json({ error: 'Failed to update patient profile' })
  }
})

export default router
