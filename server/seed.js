// ============================================================================
// RehabConnect Comprehensive Seed Data
// ============================================================================

export function seedDatabase(db) {
  const insertUser = db.prepare(`
    INSERT INTO users (id, email, password_hash, name, role, phone, avatar, avatar_color, title)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `)

  const insertPatient = db.prepare(`
    INSERT INTO patients (id, user_id, dob, gender, blood_type, emergency_contact_name, emergency_contact_phone, primary_condition, admission_date, recovery_stage, mobility_score, pain_level, target_goal, assigned_therapist_id)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `)

  const insertAppointment = db.prepare(`
    INSERT INTO appointments (patient_id, therapist_id, title, date_day, date_month, full_date, time, location, type, telehealth, duration, status, notes)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `)

  const insertExercise = db.prepare(`
    INSERT INTO exercises (id, title, target_area, category, difficulty, description, instructions, video_url, default_sets, default_reps, default_duration_secs)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `)

  const insertPatientExercise = db.prepare(`
    INSERT INTO patient_exercises (patient_id, exercise_id, prescribed_by, sets, reps, duration_secs, frequency, completed_today)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `)

  const insertClinicalNote = db.prepare(`
    INSERT INTO clinical_notes (patient_id, author_id, note_type, title, content, fim_score, pain_level, date)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?)
  `)

  const insertInquiry = db.prepare(`
    INSERT INTO program_inquiries (full_name, email, phone, program_track, message, status)
    VALUES (?, ?, ?, ?, ?, ?)
  `)

  // Wrap in a transaction for speed
  const transaction = db.transaction(() => {
    // ------------------------------------------------------------------------
    // 1. Users (Clinicians, Patients, Admins)
    // ------------------------------------------------------------------------
    insertUser.run(1, 'patient@rehabconnect.org', 'demo123', 'Johnathan Doe', 'client', '+1 (555) 234-5678', 'JD', '#0f52ba', 'Patient — Stroke Rehab')
    insertUser.run(2, 'dr.smith@rehabconnect.org', 'demo123', 'Dr. Arthur Smith, DPT', 'staff', '+1 (555) 345-6789', 'AS', '#1d4ed8', 'Lead Physical Therapist (OCS)')
    insertUser.run(3, 'sarah.ot@rehabconnect.org', 'demo123', 'Sarah Lin, OTR/L', 'staff', '+1 (555) 456-7890', 'SL', '#16a34a', 'Senior Occupational Therapist')
    insertUser.run(4, 'dr.vance@rehabconnect.org', 'demo123', 'Dr. Elena Vance, MD', 'staff', '+1 (555) 567-8901', 'EV', '#9333ea', 'Chief Physiatrist')
    insertUser.run(5, 'admin@rehabconnect.org', 'demo123', 'Admin Supervisor', 'admin', '+1 (555) 678-9012', 'AD', '#dc2626', 'Clinical Operations Director')

    // ------------------------------------------------------------------------
    // 2. Patient Profiles
    // ------------------------------------------------------------------------
    insertPatient.run(
      1,
      1,
      '1982-06-14',
      'Male',
      'O+',
      'Emily Doe (Spouse)',
      '+1 (555) 998-1122',
      'Ischemic Stroke — Left Hemiparesis & Gait Rehabilitation',
      '2024-07-15',
      'Stage 3: Active Neuroplasticity & Gait Training',
      78, // mobility score %
      3,  // pain level 1-10
      'Independent community walking without cane and full ADL independence',
      2   // Dr. Arthur Smith
    )

    // ------------------------------------------------------------------------
    // 3. Exercise Catalog
    // ------------------------------------------------------------------------
    insertExercise.run(
      1,
      'Seated Knee Extensions & Quad Sets',
      'Lower Extremity',
      'Strength & Range',
      'Beginner',
      'Strengthens the quadriceps muscles to support knee stability and improve stance phase during gait.',
      'Sit tall in a sturdy chair. Slowly straighten your left leg out until fully extended. Hold for 3 seconds, then lower gently.',
      'https://example.com/videos/quad-sets',
      3, 12, 45
    )

    insertExercise.run(
      2,
      'Standing Weight Shifts & Balance Training',
      'Core & Balance',
      'Neuromuscular',
      'Intermediate',
      'Promotes symmetrical weight bearing and activates stabilizing postural reflexes.',
      'Stand with feet shoulder-width apart holding a stable parallel bar or table. Gently shift 60% of weight to the affected side, pause for 5 seconds.',
      'https://example.com/videos/balance-shifts',
      3, 10, 60
    )

    insertExercise.run(
      3,
      'Ankle Dorsiflexion with Resistance Band',
      'Ankle & Foot',
      'Motor Control',
      'Beginner',
      'Combats foot drop and promotes toe clearance during forward walking swing phase.',
      'Loop an elastic resistance band around the forefoot. Pull foot upward towards your shin against resistance.',
      'https://example.com/videos/dorsiflexion',
      3, 15, 45
    )

    insertExercise.run(
      4,
      'Bed Mobility & Bridge Hip Extensions',
      'Glutes & Pelvis',
      'Bed Mobility',
      'Intermediate',
      'Develops pelvic stability and hip extension strength necessary for sit-to-stand transfers.',
      'Lie on your back with knees bent. Tighten core and lift hips until thighs align with torso. Hold 3 seconds.',
      'https://example.com/videos/glute-bridges',
      3, 10, 60
    )

    insertExercise.run(
      5,
      'Upper Extremity Wall Crawls & Reaching',
      'Shoulder & Arm',
      'Range of Motion',
      'Beginner',
      'Restores active shoulder abduction and prevents adhesive capsulitis in hemiparetic limbs.',
      'Face a wall. Place fingertips at chest height and slowly walk fingers upward as high as comfortable without pain.',
      'https://example.com/videos/wall-crawls',
      2, 10, 60
    )

    // ------------------------------------------------------------------------
    // 4. Prescribed Protocols for Patient 1
    // ------------------------------------------------------------------------
    insertPatientExercise.run(1, 1, 2, 3, 12, 45, 'Daily (Morning)', 1)
    insertPatientExercise.run(1, 2, 2, 3, 10, 60, 'Daily (Midday)', 1)
    insertPatientExercise.run(1, 3, 2, 3, 15, 45, 'Daily (Evening)', 0)
    insertPatientExercise.run(1, 4, 2, 3, 10, 60, '3x / Week', 0)

    // ------------------------------------------------------------------------
    // 5. Appointments for Patient 1
    // ------------------------------------------------------------------------
    insertAppointment.run(
      1,
      2,
      'Physical Therapy — Gait & Robotic Exoskeleton Retraining',
      '18',
      'AUG',
      '2024-08-18',
      '10:00 AM – 11:00 AM',
      'Robotics Suite 102',
      'Physical Therapy',
      0,
      '60 min',
      'Upcoming',
      'Focus on stride cadence and robotic body-weight supported walking. Bring orthotic AFO.'
    )

    insertAppointment.run(
      1,
      3,
      'Occupational Therapy — Fine Motor & ADL Retraining',
      '20',
      'AUG',
      '2024-08-20',
      '02:00 PM – 03:00 PM',
      'ADL Suite B',
      'Occupational Therapy',
      0,
      '60 min',
      'Upcoming',
      'Adaptive equipment evaluation for dressing, meal prep, and dynamic reaching tasks.'
    )

    insertAppointment.run(
      1,
      4,
      'Physiatry Telehealth Consultation & Medication Review',
      '25',
      'AUG',
      '2024-08-25',
      '03:30 PM – 04:15 PM',
      'Virtual Telehealth Room 3',
      'Physiatry Review',
      1,
      '45 min',
      'Upcoming',
      'Review spasticity management, baclofen adjustment, and 6-week functional milestone progress.'
    )

    insertAppointment.run(
      1,
      2,
      'Initial Neurological Baseline Evaluation',
      '15',
      'JUL',
      '2024-07-15',
      '09:00 AM – 10:30 AM',
      'Clinic Assessment Center',
      'Evaluation',
      0,
      '90 min',
      'Completed',
      'Baseline FIM score 62. Moderate left hemiparesis. Ambulation requires quad cane and contact guard.'
    )

    // ------------------------------------------------------------------------
    // 6. Clinical Notes
    // ------------------------------------------------------------------------
    insertClinicalNote.run(
      1,
      2,
      'Progress Note',
      'Week 4 Gait Speed & Cadence Evaluation',
      'Patient demonstrated notable improvement in left ankle active dorsiflexion. 10-Meter Walk Test score improved from 0.42 m/s to 0.71 m/s. Able to step over 2-inch obstacles with minimal supervision.',
      82,
      2,
      '2024-08-10'
    )

    insertClinicalNote.run(
      1,
      3,
      'OT Weekly Evaluation',
      'Upper Extremity Dexterity & Grasp Power',
      'Box & Block test score increased by 14 blocks in 60 seconds. Patient successfully prepared morning tea using adaptive kettle and non-slip mat independently.',
      78,
      3,
      '2024-08-05'
    )

    // ------------------------------------------------------------------------
    // 7. Initial Program Inquiries
    // ------------------------------------------------------------------------
    insertInquiry.run(
      'Eleanor Vance (Parent)',
      'eleanor.v@example.com',
      '+1 (555) 887-2233',
      'pediatric',
      'Looking for pediatric physical therapy assessment for my 4-year-old son with mild cerebral palsy.',
      'New'
    )

    insertInquiry.run(
      'Marcus Brody',
      'm.brody@example.com',
      '+1 (555) 774-9911',
      'adult',
      'Recovering from ACL reconstruction surgery 3 weeks ago. Need sport-specific return-to-play rehabilitation.',
      'Contacted'
    )
  })

  transaction()
}
