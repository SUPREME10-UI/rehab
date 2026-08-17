-- ============================================================================
-- RehabConnect Relational Database Schema
-- SQLite Version
-- ============================================================================

-- 1. USERS: Authentication and roles (client / staff / admin)
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'client' CHECK(role IN ('client', 'staff', 'admin')),
  phone TEXT,
  avatar TEXT,
  avatar_color TEXT DEFAULT '#0f52ba',
  title TEXT, -- e.g. "Physical Therapist", "Patient"
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 2. PATIENTS: Detailed clinical records for client accounts
CREATE TABLE IF NOT EXISTS patients (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER UNIQUE NOT NULL,
  dob TEXT,
  gender TEXT,
  blood_type TEXT,
  emergency_contact_name TEXT,
  emergency_contact_phone TEXT,
  primary_condition TEXT,
  admission_date TEXT,
  recovery_stage TEXT DEFAULT 'Active Therapy',
  mobility_score INTEGER DEFAULT 65, -- %
  pain_level INTEGER DEFAULT 4, -- 1-10
  target_goal TEXT,
  assigned_therapist_id INTEGER,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (assigned_therapist_id) REFERENCES users(id)
);

-- 3. APPOINTMENTS: Scheduled therapy sessions and evaluations
CREATE TABLE IF NOT EXISTS appointments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  patient_id INTEGER NOT NULL,
  therapist_id INTEGER NOT NULL,
  title TEXT NOT NULL,
  date_day TEXT NOT NULL, -- e.g. "15"
  date_month TEXT NOT NULL, -- e.g. "OCT"
  full_date TEXT NOT NULL, -- "YYYY-MM-DD"
  time TEXT NOT NULL, -- e.g. "10:00 AM – 11:00 AM"
  location TEXT NOT NULL, -- e.g. "Therapy Room 204"
  type TEXT NOT NULL, -- e.g. "Physical Therapy", "Occupational Therapy"
  telehealth INTEGER DEFAULT 0, -- 0 = false, 1 = true
  duration TEXT DEFAULT '60 min',
  status TEXT DEFAULT 'Upcoming' CHECK(status IN ('Upcoming', 'Completed', 'Cancelled')),
  notes TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
  FOREIGN KEY (therapist_id) REFERENCES users(id)
);

-- 4. EXERCISES: Master exercise library
CREATE TABLE IF NOT EXISTS exercises (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  title TEXT NOT NULL,
  target_area TEXT NOT NULL,
  category TEXT NOT NULL,
  difficulty TEXT DEFAULT 'Intermediate',
  description TEXT,
  instructions TEXT,
  video_url TEXT,
  default_sets INTEGER DEFAULT 3,
  default_reps INTEGER DEFAULT 10,
  default_duration_secs INTEGER DEFAULT 60,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 5. PATIENT_EXERCISES: Prescribed therapy routines per patient
CREATE TABLE IF NOT EXISTS patient_exercises (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  patient_id INTEGER NOT NULL,
  exercise_id INTEGER NOT NULL,
  prescribed_by INTEGER,
  sets INTEGER DEFAULT 3,
  reps INTEGER DEFAULT 10,
  duration_secs INTEGER DEFAULT 60,
  frequency TEXT DEFAULT 'Daily',
  completed_today INTEGER DEFAULT 0,
  last_completed_at DATETIME,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
  FOREIGN KEY (exercise_id) REFERENCES exercises(id) ON DELETE CASCADE,
  FOREIGN KEY (prescribed_by) REFERENCES users(id)
);

-- 6. CLINICAL_NOTES & EVALUATIONS: Practitioner progress notes and FIM score logs
CREATE TABLE IF NOT EXISTS clinical_notes (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  patient_id INTEGER NOT NULL,
  author_id INTEGER NOT NULL,
  note_type TEXT DEFAULT 'Progress Note',
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  fim_score INTEGER, -- Functional Independence Measure (18-126)
  pain_level INTEGER, -- 1-10
  date TEXT NOT NULL,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (patient_id) REFERENCES patients(id) ON DELETE CASCADE,
  FOREIGN KEY (author_id) REFERENCES users(id)
);

-- 7. PROGRAM_INQUIRIES: Landing page consultations & specialty track inquiries
CREATE TABLE IF NOT EXISTS program_inquiries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  program_track TEXT NOT NULL, -- 'pediatric', 'adult', 'geriatric', 'general'
  message TEXT,
  status TEXT DEFAULT 'New' CHECK(status IN ('New', 'Contacted', 'Scheduled', 'Archived')),
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
