import express from 'express'
import cors from 'cors'
import { initDatabase } from './db.js'

// Import route modules
import authRoutes from './routes/auth.js'
import patientsRoutes from './routes/patients.js'
import appointmentsRoutes from './routes/appointments.js'
import exercisesRoutes from './routes/exercises.js'
import clinicalRoutes from './routes/clinical.js'

const app = express()
const PORT = process.env.PORT || 5000

// Initialize SQLite database schema and seed data
initDatabase()

// Middleware
app.use(cors())
app.use(express.json())

// Request Logger (Development)
app.use((req, res, next) => {
  const start = Date.now()
  res.on('finish', () => {
    const duration = Date.now() - start
    console.log(`[API] ${req.method} ${req.originalUrl} -> ${res.statusCode} (${duration}ms)`)
  })
  next()
})

// Health Check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    service: 'RehabConnect Relational API',
    database: 'SQLite (WAL Mode)',
    timestamp: new Date().toISOString()
  })
})

// Register Routes
app.use('/api/auth', authRoutes)
app.use('/api/patients', patientsRoutes)
app.use('/api/appointments', appointmentsRoutes)
app.use('/api/exercises', exercisesRoutes)
app.use('/api/clinical', clinicalRoutes)

// 404 Fallback for unhandled API routes
app.use('/api', (req, res) => {
  res.status(404).json({ error: `Endpoint ${req.originalUrl} not found` })
})

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[Unhandled Server Error]', err)
  res.status(500).json({ error: 'An internal server error occurred', details: err.message })
})

app.listen(PORT, () => {
  console.log(`====================================================`)
  console.log(`🏥 RehabConnect REST API Server running on:`)
  console.log(`   👉 http://localhost:${PORT}`)
  console.log(`   👉 http://localhost:${PORT}/api/health`)
  console.log(`====================================================`)
})
