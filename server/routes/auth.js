import { Router } from 'express'
import db from '../db.js'

const router = Router()

// POST /api/auth/login
router.post('/login', (req, res) => {
  try {
    const { email, password, role } = req.body
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' })
    }

    let query = 'SELECT * FROM users WHERE email = ? AND password_hash = ?'
    const params = [email, password]

    if (role) {
      query += ' AND role = ?'
      params.push(role)
    }

    const user = db.prepare(query).get(...params)

    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials or user not found' })
    }

    // If client, fetch patient details
    let patientData = null
    if (user.role === 'client') {
      patientData = db.prepare('SELECT * FROM patients WHERE user_id = ?').get(user.id)
    }

    const { password_hash, ...safeUser } = user
    return res.json({
      success: true,
      user: safeUser,
      patient: patientData,
      token: `demo-jwt-token-${user.id}-${Date.now()}`
    })
  } catch (err) {
    console.error('[Auth Error]', err)
    return res.status(500).json({ error: 'Internal server error during login' })
  }
})

// POST /api/auth/register
router.post('/register', (req, res) => {
  try {
    const { email, password, name, role = 'client', phone, condition } = req.body

    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Email, password, and full name are required' })
    }

    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email)
    if (existing) {
      return res.status(409).json({ error: 'An account with this email already exists' })
    }

    const avatarInitials = name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()
    
    const insertUser = db.prepare(`
      INSERT INTO users (email, password_hash, name, role, phone, avatar, avatar_color, title)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `)

    const result = insertUser.run(
      email,
      password,
      name,
      role,
      phone || '',
      avatarInitials,
      '#0f52ba',
      role === 'client' ? 'Registered Patient' : 'Clinical Staff'
    )

    const newUserId = result.lastInsertRowid

    // If client, create default patient record
    let patientRecord = null
    if (role === 'client') {
      const insertPatient = db.prepare(`
        INSERT INTO patients (user_id, primary_condition, recovery_stage, mobility_score, pain_level, target_goal)
        VALUES (?, ?, 'Intake / Initial Assessment', 50, 5, 'Restore full mobility & independence')
      `)
      const pResult = insertPatient.run(newUserId, condition || 'General Rehabilitation')
      patientRecord = db.prepare('SELECT * FROM patients WHERE id = ?').get(pResult.lastInsertRowid)
    }

    const newUser = db.prepare('SELECT id, email, name, role, phone, avatar, avatar_color, title FROM users WHERE id = ?').get(newUserId)

    return res.status(201).json({
      success: true,
      user: newUser,
      patient: patientRecord,
      token: `demo-jwt-token-${newUserId}-${Date.now()}`
    })
  } catch (err) {
    console.error('[Register Error]', err)
    return res.status(500).json({ error: 'Internal server error during registration' })
  }
})

// GET /api/auth/me
router.get('/me', (req, res) => {
  const userId = req.query.userId || 1
  const user = db.prepare('SELECT id, email, name, role, phone, avatar, avatar_color, title FROM users WHERE id = ?').get(userId)
  
  if (!user) {
    return res.status(404).json({ error: 'User not found' })
  }

  let patientData = null
  if (user.role === 'client') {
    patientData = db.prepare('SELECT * FROM patients WHERE user_id = ?').get(user.id)
  }

  return res.json({ user, patient: patientData })
})

export default router
