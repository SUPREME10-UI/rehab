import Database from 'better-sqlite3'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { seedDatabase } from './seed.js'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const DATA_DIR = path.join(__dirname, 'data')
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true })
}

const DB_PATH = path.join(DATA_DIR, 'rehab.db')
const db = new Database(DB_PATH)

// Enable WAL mode & foreign keys for high performance and integrity
db.pragma('journal_mode = WAL')
db.pragma('foreign_keys = ON')

export function initDatabase() {
  console.log(`[Database] Connecting to SQLite at: ${DB_PATH}`)
  
  const schemaPath = path.join(__dirname, 'schema.sql')
  if (fs.existsSync(schemaPath)) {
    const schemaSql = fs.readFileSync(schemaPath, 'utf8')
    db.exec(schemaSql)
    console.log('[Database] Schema initialized successfully.')
  }

  // Seed default data if database is fresh
  const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get()
  if (userCount.count === 0) {
    console.log('[Database] Fresh database detected. Seeding initial data...')
    seedDatabase(db)
    console.log('[Database] Initial data seeded successfully.')
  }
}

export default db
