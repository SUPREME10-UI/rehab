import { useState, useEffect } from 'react'
import './App.css'

// Initial Mock Data
const clientAppointments = [
  { id: 1, title: 'Physical Therapy (Gait & Balance)', dateDay: '12', dateMonth: 'OCT', time: '10:00 AM - 11:00 AM', provider: 'Dr. A. Smith, PT', location: 'Therapy Room 204' },
  { id: 2, title: 'Occupational Therapy (Daily Living)', dateDay: '15', dateMonth: 'OCT', time: '02:00 PM - 03:00 PM', provider: 'Sarah Jenkins, OT', location: 'ADL Suite B' },
  { id: 3, title: 'Physiatrist Progress Review', dateDay: '18', dateMonth: 'OCT', time: '11:30 AM - 12:15 PM', provider: 'Dr. Lena Ortiz, MD', location: 'Clinical Suite 102' }
]

const clientGoals = [
  { id: 1, title: 'Unassisted Walking (50m)', summary: 'Ambulate 50 meters safely without a cane or walker.', progress: 80, category: 'Mobility' },
  { id: 2, title: 'Knee Flexion (120°)', summary: 'Achieve 120 degrees of active right knee flexion during therapy.', progress: 65, category: 'Range of Motion' },
  { id: 3, title: 'Pain Index Reduction', summary: 'Maintain daily post-activity pain score below 3/10.', progress: 90, category: 'Comfort' }
]

const clientExercises = [
  { id: 1, name: 'Heel Slides', focus: 'Knee ROM', sets: 3, reps: 10, duration: '10 min', tag: 'Phase 1' },
  { id: 2, name: 'Quad Sets', focus: 'Isometric Strength', sets: 2, reps: 15, duration: '8 min', tag: 'Phase 1' },
  { id: 3, name: 'Straight Leg Raise', focus: 'Hip & Core Strength', sets: 3, reps: 10, duration: '12 min', tag: 'Phase 2' },
  { id: 4, name: 'Single-Leg Balance Drills', focus: 'Proprioception', sets: 3, reps: '30s hold', duration: '10 min', tag: 'Phase 2' }
]

const adminSchedule = [
  { time: '09:00 AM', title: 'Gait Training & Hydrotherapy', patient: 'Eleanor Vance', therapist: 'J. Doe, PT', room: 'Rm 204' },
  { time: '10:30 AM', title: 'Cognitive & Speech Evaluation', patient: 'Marcus Thorne', therapist: 'S. Williams, SLP', room: 'Rm 112' },
  { time: '01:00 PM', title: 'Upper Extremity Resistance Drills', patient: 'Sarah Jenkins', therapist: 'A. Lee, OT', room: 'Lounge B' },
  { time: '02:30 PM', title: 'Spinal Mobility & Transfer Training', patient: 'David Chen', therapist: 'Dr. L. Ortiz, MD', room: 'Rehab Gym' }
]

function App() {
  // Auth & User Session State
  const [sessionUser, setSessionUser] = useState(null)
  const [authMode, setAuthMode] = useState('signup') // 'signup' | 'login'
  const [portalRole, setPortalRole] = useState('client') // 'client' | 'admin'
  const [activeTab, setActiveTab] = useState('dashboard')

  const [adminPatients, setAdminPatients] = useState([
    { id: 'PT-88234', name: 'Eleanor Vance', age: 66, dob: '12/04/1958', diagnosis: 'Right MCA CVA (Stroke)', therapist: 'Dr. Sarah Chen', status: 'Inpatient', score: '78/126' },
    { id: 'PT-88235', name: 'Marcus Thorne', age: 54, dob: '05/18/1970', diagnosis: 'Ischemic Stroke (Right Hemiparesis)', therapist: 'Dr. James Wilson', status: 'Critical', score: '62/126' },
    { id: 'PT-88236', name: 'Sarah Jenkins', age: 42, dob: '08/22/1982', diagnosis: 'Post-Op ACL Reconstruction', therapist: 'Dr. A. Smith', status: 'Outpatient', score: '94/126' },
    { id: 'PT-88237', name: 'David Chen', age: 38, dob: '11/03/1986', diagnosis: 'Spinal Cord Injury (T4 Incomplete)', therapist: 'Dr. Lena Ortiz', status: 'Inpatient', score: '54/126' },
    { id: 'PT-88238', name: 'Anita Lin', age: 59, dob: '03/14/1965', diagnosis: 'Traumatic Brain Injury Recovery', therapist: 'Dr. Sarah Chen', status: 'Outpatient', score: '102/126' }
  ])

  const [newPatientForm, setNewPatientForm] = useState({
    name: '',
    age: '',
    dob: '',
    diagnosis: '',
    therapist: '',
    status: 'Inpatient'
  })

  const handleNewPatientChange = (e) => {
    const { name, value } = e.target
    setNewPatientForm(prev => ({ ...prev, [name]: value }))
  }

  const handleAddPatient = (e) => {
    e.preventDefault()
    const newPatient = {
      id: `PT-${Math.floor(Math.random() * 90000) + 10000}`,
      ...newPatientForm,
      score: '0/126'
    }
    setAdminPatients([...adminPatients, newPatient])
    setNewPatientForm({ name: '', age: '', dob: '', diagnosis: '', therapist: '', status: 'Inpatient' })
    setActiveTab('patients')
  }

  // FIM Assessment Items State (Default scores adding up to 78/126)
  const [fimScores, setFimScores] = useState({
    eating: 5,
    grooming: 5,
    bathing: 4,
    dressingUpper: 4,
    dressingLower: 3,
    toileting: 4,
    bladder: 5,
    bowel: 5,
    transfersBed: 3,
    transfersToilet: 4,
    transfersTub: 3,
    locomotionWalk: 4,
    stairs: 3,
    comprehension: 6,
    expression: 6,
    social: 5,
    problemSolving: 5,
    memory: 4
  })

  // Selected Patient for Assessment
  const [selectedPatientId, setSelectedPatientId] = useState('PT-88234')

  // ROM & Musculoskeletal Assessment State
  const [romAssessment, setRomAssessment] = useState({
    kneeFlexion: 110,
    painScore: 3,
    shortTermGoal: 'Patient will perform sit-to-stand transfers with minimal assist (FIM 4) within 2 weeks.',
    longTermGoal: 'Patient will ambulate 150ft independently with rolling walker within 6 weeks.',
    clinicalNotes: 'Steady functional progress noted. Patient demonstrates improved motor planning during leg raises and transfer practice.'
  })

  // Calculate Live Dynamic FIM Scores
  const totalFimScore = Object.values(fimScores).reduce((acc, score) => acc + Number(score), 0)
  const motorSubscore = [
    fimScores.eating, fimScores.grooming, fimScores.bathing, fimScores.dressingUpper, fimScores.dressingLower,
    fimScores.toileting, fimScores.bladder, fimScores.bowel, fimScores.transfersBed, fimScores.transfersToilet,
    fimScores.transfersTub, fimScores.locomotionWalk, fimScores.stairs
  ].reduce((a, b) => a + Number(b), 0)
  const cognitiveSubscore = [
    fimScores.comprehension, fimScores.expression, fimScores.social, fimScores.problemSolving, fimScores.memory
  ].reduce((a, b) => a + Number(b), 0)

  const handleFimChange = (key, val) => {
    setFimScores((prev) => ({ ...prev, [key]: Number(val) }))
  }

  const getFimDescription = (score) => {
    switch (Number(score)) {
      case 7: return '7 - Complete Independence'
      case 6: return '6 - Modified Independence'
      case 5: return '5 - Supervision / Setup'
      case 4: return '4 - Minimal Assist (75%+)'
      case 3: return '3 - Moderate Assist (50%+)'
      case 2: return '2 - Maximal Assist (25%+)'
      case 1: return '1 - Total Assist (<25%)'
      default: return `Score: ${score}`
    }
  }

  // Route Detection Effect
  useEffect(() => {
    const checkRoute = () => {
      const path = window.location.pathname.toLowerCase()
      const search = window.location.search.toLowerCase()
      const hash = window.location.hash.toLowerCase()

      if (path.includes('/admin') || search.includes('admin') || hash.includes('admin')) {
        setPortalRole('admin')
      } else {
        setPortalRole('client')
      }
    }

    checkRoute()
    window.addEventListener('popstate', checkRoute)
    return () => window.removeEventListener('popstate', checkRoute)
  }, [])

  const navigateToRole = (role) => {
    setPortalRole(role)
    const newPath = role === 'admin' ? '/admin' : '/'
    window.history.pushState({}, '', newPath)
  }

  // Signup Form Fields State
  const [clientForm, setClientForm] = useState({
    fullName: '',
    email: '',
    password: '',
    phone: '',
    dob: '',
    condition: 'Post-Op ACL Reconstruction',
    emergencyContact: '',
    patientId: 'PT-88240'
  })

  const [adminForm, setAdminForm] = useState({
    fullName: '',
    email: '',
    password: '',
    phone: '',
    specialization: 'Physical Therapy',
    facility: 'St. Jude Rehabilitation Center',
    licenseId: 'LIC-99420'
  })

  const [loginForm, setLoginForm] = useState({
    email: '',
    password: ''
  })

  const handleClientChange = (e) => {
    const { name, value } = e.target
    setClientForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleAdminChange = (e) => {
    const { name, value } = e.target
    setAdminForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleLoginChange = (e) => {
    const { name, value } = e.target
    setLoginForm((prev) => ({ ...prev, [name]: value }))
  }

  const handleSignupSubmit = (e) => {
    e.preventDefault()
    if (portalRole === 'client') {
      setSessionUser({
        role: 'client',
        name: clientForm.fullName || 'Sarah Jenkins',
        email: clientForm.email || 'sarah.j@example.com',
        phone: clientForm.phone || '(555) 234-5678',
        condition: clientForm.condition,
        patientId: clientForm.patientId
      })
    } else {
      setSessionUser({
        role: 'admin',
        name: adminForm.fullName || 'Dr. Lena Ortiz, PT',
        email: adminForm.email || 'dortiz@rhms.org',
        specialization: adminForm.specialization,
        facility: adminForm.facility,
        licenseId: adminForm.licenseId
      })
    }
    setActiveTab('dashboard')
  }

  const handleLoginSubmit = (e) => {
    e.preventDefault()
    if (portalRole === 'client') {
      setSessionUser({
        role: 'client',
        name: 'Sarah Jenkins',
        email: loginForm.email || 'sarah.j@example.com',
        condition: 'Post-Op ACL Reconstruction',
        patientId: 'PT-88236'
      })
    } else {
      setSessionUser({
        role: 'admin',
        name: 'Dr. Lena Ortiz, PT',
        email: loginForm.email || 'dortiz@rhms.org',
        specialization: 'Lead Physical Therapist',
        facility: 'St. Jude Rehab Center'
      })
    }
    setActiveTab('dashboard')
  }

  const handleSignOut = () => {
    setSessionUser(null)
    setAuthMode('signup')
  }

  const currentPatient = adminPatients.find((p) => p.id === selectedPatientId) || adminPatients[0]

  // --------------------------------------------------------------------------
  // RENDER: Unauthenticated Auth Landing Page
  // --------------------------------------------------------------------------
  if (!sessionUser) {
    const isClientPortal = portalRole === 'client'

    return (
      <div className="auth-wrapper">
        <aside className="auth-hero-section">
          <div className="auth-hero-brand">
            <div className="brand-logo-glow">
              <span className="material-symbols-outlined" style={{ fontSize: '28px' }}>medical_services</span>
            </div>
            <div className="brand-text">
              <h1>RHMS</h1>
              <p>{isClientPortal ? 'Patient Recovery Portal' : 'Clinical Administrator Portal'}</p>
            </div>
          </div>

          <div className="auth-hero-body animate-fade-in">
            <div className="hero-pill-badge">
              <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>verified_user</span>
              {isClientPortal ? 'Patient Recovery Network' : 'Secure Clinical Staff Portal'}
            </div>
            <h2>{isClientPortal ? 'Empowering Your Recovery Journey.' : 'Comprehensive Clinical Facility Operations.'}</h2>
            <p>
              {isClientPortal
                ? 'Register to access your personalized rehabilitation plan, track daily exercise routines, and monitor functional progress.'
                : 'Secure portal for clinical practitioners, physical therapists, and hospital administrators.'}
            </p>

            <div className="hero-feature-cards">
              <div className="feature-mini-card">
                <div className="icon-box">
                  <span className="material-symbols-outlined">trending_up</span>
                </div>
                <h4>{isClientPortal ? 'Progress Tracking' : 'Facility Metrics'}</h4>
                <p>{isClientPortal ? 'Real-time mobility & pain trends.' : 'Bed occupancy & patient directory.'}</p>
              </div>
              <div className="feature-mini-card">
                <div className="icon-box">
                  <span className="material-symbols-outlined">shield_person</span>
                </div>
                <h4>Protected Access</h4>
                <p>HIPAA compliant & secure platform.</p>
              </div>
            </div>
          </div>

          <div className="auth-hero-footer">
            <span className="material-symbols-outlined">lock</span>
            HIPAA Compliant & Encrypted Clinical Data Storage
          </div>
        </aside>

        <main className="auth-form-section">
          <div className="auth-form-container animate-fade-in">
            <div className="auth-header">
              {isClientPortal ? (
                <>
                  <h2>{authMode === 'signup' ? 'Patient Registration' : 'Patient Logon'}</h2>
                  <p>
                    {authMode === 'signup'
                      ? 'Fill out your recovery profile details to create your account.'
                      : 'Enter your account details to access your patient portal.'}
                  </p>
                </>
              ) : (
                <>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#fee2e2', color: '#b91c1e', padding: '4px 10px', borderRadius: '20px', fontSize: '0.78rem', fontWeight: 700, marginBottom: '10px' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>lock</span>
                    Restricted Clinical Staff Area
                  </div>
                  <h2>{authMode === 'signup' ? 'Practitioner Registration' : 'Clinical Portal Logon'}</h2>
                  <p>Enter your professional staff credentials to access the facility portal.</p>
                </>
              )}
            </div>

            {authMode === 'signup' ? (
              <form onSubmit={handleSignupSubmit} className="modern-form">
                {isClientPortal ? (
                  <>
                    <div className="form-group">
                      <label>Full Name</label>
                      <div className="input-with-icon">
                        <span className="material-symbols-outlined">person</span>
                        <input
                          type="text"
                          name="fullName"
                          className="modern-input"
                          placeholder="e.g. Sarah Jenkins"
                          value={clientForm.fullName}
                          onChange={handleClientChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="form-row-2">
                      <div className="form-group">
                        <label>Email Address</label>
                        <div className="input-with-icon">
                          <span className="material-symbols-outlined">mail</span>
                          <input
                            type="email"
                            name="email"
                            className="modern-input"
                            placeholder="sarah@example.com"
                            value={clientForm.email}
                            onChange={handleClientChange}
                            required
                          />
                        </div>
                      </div>

                      <div className="form-group">
                        <label>Phone Number</label>
                        <div className="input-with-icon">
                          <span className="material-symbols-outlined">call</span>
                          <input
                            type="tel"
                            name="phone"
                            className="modern-input"
                            placeholder="(555) 234-5678"
                            value={clientForm.phone}
                            onChange={handleClientChange}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="form-row-2">
                      <div className="form-group">
                        <label>Password</label>
                        <div className="input-with-icon">
                          <span className="material-symbols-outlined">key</span>
                          <input
                            type="password"
                            name="password"
                            className="modern-input"
                            placeholder="••••••••"
                            value={clientForm.password}
                            onChange={handleClientChange}
                            required
                          />
                        </div>
                      </div>

                      <div className="form-group">
                        <label>Date of Birth</label>
                        <div className="input-with-icon">
                          <span className="material-symbols-outlined">calendar_today</span>
                          <input
                            type="date"
                            name="dob"
                            className="modern-input"
                            value={clientForm.dob}
                            onChange={handleClientChange}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Rehabilitation Diagnosis / Condition</label>
                      <div className="input-with-icon">
                        <span className="material-symbols-outlined">healing</span>
                        <select
                          name="condition"
                          className="modern-select"
                          value={clientForm.condition}
                          onChange={handleClientChange}
                        >
                          <option value="Post-Op ACL Reconstruction">Post-Op ACL Reconstruction</option>
                          <option value="Stroke Recovery (Hemiparesis)">Stroke Recovery (Hemiparesis)</option>
                          <option value="Post-Op Total Hip Replacement">Post-Op Total Hip Replacement</option>
                          <option value="Spinal Cord Injury Rehabilitation">Spinal Cord Injury Rehabilitation</option>
                          <option value="Parkinson's Motor Function Training">Parkinson's Motor Function Training</option>
                        </select>
                      </div>
                    </div>

                    <div className="form-row-2">
                      <div className="form-group">
                        <label>Emergency Contact</label>
                        <div className="input-with-icon">
                          <span className="material-symbols-outlined">emergency</span>
                          <input
                            type="text"
                            name="emergencyContact"
                            className="modern-input"
                            placeholder="Contact name & phone"
                            value={clientForm.emergencyContact}
                            onChange={handleClientChange}
                          />
                        </div>
                      </div>

                      <div className="form-group">
                        <label>Patient ID (Auto-generated)</label>
                        <div className="input-with-icon">
                          <span className="material-symbols-outlined">badge</span>
                          <input
                            type="text"
                            name="patientId"
                            className="modern-input"
                            value={clientForm.patientId}
                            onChange={handleClientChange}
                            readOnly
                          />
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                    <div className="form-group">
                      <label>Full Name & Credentials</label>
                      <div className="input-with-icon">
                        <span className="material-symbols-outlined">person</span>
                        <input
                          type="text"
                          name="fullName"
                          className="modern-input"
                          placeholder="e.g. Dr. Lena Ortiz, PT, DPT"
                          value={adminForm.fullName}
                          onChange={handleAdminChange}
                          required
                        />
                      </div>
                    </div>

                    <div className="form-row-2">
                      <div className="form-group">
                        <label>Work Email</label>
                        <div className="input-with-icon">
                          <span className="material-symbols-outlined">mail</span>
                          <input
                            type="email"
                            name="email"
                            className="modern-input"
                            placeholder="dortiz@rhms.org"
                            value={adminForm.email}
                            onChange={handleAdminChange}
                            required
                          />
                        </div>
                      </div>

                      <div className="form-group">
                        <label>Password</label>
                        <div className="input-with-icon">
                          <span className="material-symbols-outlined">key</span>
                          <input
                            type="password"
                            name="password"
                            className="modern-input"
                            placeholder="••••••••"
                            value={adminForm.password}
                            onChange={handleAdminChange}
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Clinical Specialization</label>
                      <div className="input-with-icon">
                        <span className="material-symbols-outlined">stethoscope</span>
                        <select
                          name="specialization"
                          className="modern-select"
                          value={adminForm.specialization}
                          onChange={handleAdminChange}
                        >
                          <option value="Physical Therapy">Physical Therapy (PT)</option>
                          <option value="Occupational Therapy">Occupational Therapy (OT)</option>
                          <option value="Speech Language Pathology">Speech Language Pathology (SLP)</option>
                          <option value="Neurological Rehabilitation">Neurological Rehabilitation</option>
                          <option value="Clinical Administrator">Clinical Administrator / Director</option>
                        </select>
                      </div>
                    </div>

                    <div className="form-row-2">
                      <div className="form-group">
                        <label>Hospital / Facility Name</label>
                        <div className="input-with-icon">
                          <span className="material-symbols-outlined">domain</span>
                          <input
                            type="text"
                            name="facility"
                            className="modern-input"
                            placeholder="St. Jude Rehab Center"
                            value={adminForm.facility}
                            onChange={handleAdminChange}
                          />
                        </div>
                      </div>

                      <div className="form-group">
                        <label>Practitioner License #</label>
                        <div className="input-with-icon">
                          <span className="material-symbols-outlined">id_card</span>
                          <input
                            type="text"
                            name="licenseId"
                            className="modern-input"
                            value={adminForm.licenseId}
                            onChange={handleAdminChange}
                          />
                        </div>
                      </div>
                    </div>
                  </>
                )}

                <button type="submit" className="modern-submit-btn">
                  <span>{isClientPortal ? 'Complete Registration & Enter Portal' : 'Authorize & Open Clinical Portal'}</span>
                  <span className="material-symbols-outlined">arrow_forward</span>
                </button>
              </form>
            ) : (
              <form onSubmit={handleLoginSubmit} className="modern-form">
                <div className="form-group">
                  <label>Email Address</label>
                  <div className="input-with-icon">
                    <span className="material-symbols-outlined">mail</span>
                    <input
                      type="email"
                      name="email"
                      className="modern-input"
                      placeholder="you@example.com"
                      value={loginForm.email}
                      onChange={handleLoginChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label>Password</label>
                  <div className="input-with-icon">
                    <span className="material-symbols-outlined">key</span>
                    <input
                      type="password"
                      name="password"
                      className="modern-input"
                      placeholder="••••••••"
                      value={loginForm.password}
                      onChange={handleLoginChange}
                      required
                    />
                  </div>
                </div>

                <button type="submit" className="modern-submit-btn">
                  <span>Log In to {isClientPortal ? 'Patient Portal' : 'Clinical Portal'}</span>
                  <span className="material-symbols-outlined">login</span>
                </button>
              </form>
            )}

            <div className="auth-switch-footer">
              <p>
                {authMode === 'signup' ? 'Already registered?' : 'Need a new account?'}
                <button type="button" className="auth-switch-btn" onClick={() => setAuthMode(authMode === 'signup' ? 'login' : 'signup')}>
                  {authMode === 'signup' ? 'Log In' : 'Sign Up'}
                </button>
              </p>

              <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1.5px dashed #e2e8f0' }}>
                {isClientPortal ? (
                  <button
                    type="button"
                    style={{ background: 'none', border: 'none', color: '#64748b', fontSize: '0.8rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                    onClick={() => navigateToRole('admin')}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>lock</span>
                    Go to Clinical Admin Link (`/admin`)
                  </button>
                ) : (
                  <button
                    type="button"
                    style={{ background: 'none', border: 'none', color: '#0f52ba', fontSize: '0.8rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                    onClick={() => navigateToRole('client')}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>arrow_back</span>
                    Return to Patient Portal Link (`/`)
                  </button>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    )
  }

  // --------------------------------------------------------------------------
  // RENDER: Authenticated App Shell (CLIENT PORTAL vs ADMIN PORTAL)
  // --------------------------------------------------------------------------
  const isClient = sessionUser.role === 'client'

  return (
    <div className="portal-layout">
      {/* Shared Dark Sidebar Navigation */}
      <aside className="portal-sidebar">
        <div className="sidebar-header">
          <div className="sidebar-brand-icon">
            <span className="material-symbols-outlined">medical_services</span>
          </div>
          <div className="sidebar-brand-text">
            <h2>RHMS</h2>
            <p>{isClient ? 'Patient Portal' : 'Clinical Portal'}</p>
          </div>
        </div>

        <div className="sidebar-user-pill">
          <div className="sidebar-user-avatar">
            {sessionUser.name.split(' ').map((n) => n[0]).join('').slice(0, 2)}
          </div>
          <div className="sidebar-user-info">
            <p>{isClient ? 'Patient Account' : 'Clinical Staff'}</p>
            <h4>{sessionUser.name}</h4>
          </div>
        </div>

        <nav className="sidebar-nav">
          {isClient ? (
            <>
              <button
                className={`nav-link-item ${activeTab === 'dashboard' ? 'active' : ''}`}
                onClick={() => setActiveTab('dashboard')}
              >
                <span className="material-symbols-outlined">dashboard</span>
                My Recovery Overview
              </button>
              <button
                className={`nav-link-item ${activeTab === 'goals' ? 'active' : ''}`}
                onClick={() => setActiveTab('goals')}
              >
                <span className="material-symbols-outlined">flag</span>
                Treatment Goals
              </button>
              <button
                className={`nav-link-item ${activeTab === 'appointments' ? 'active' : ''}`}
                onClick={() => setActiveTab('appointments')}
              >
                <span className="material-symbols-outlined">event_available</span>
                Therapy Sessions
              </button>
              <button
                className={`nav-link-item ${activeTab === 'exercises' ? 'active' : ''}`}
                onClick={() => setActiveTab('exercises')}
              >
                <span className="material-symbols-outlined">fitness_center</span>
                Home Exercises
              </button>
            </>
          ) : (
            <>
              <button
                className={`nav-link-item ${activeTab === 'dashboard' ? 'active' : ''}`}
                onClick={() => setActiveTab('dashboard')}
              >
                <span className="material-symbols-outlined">dashboard</span>
                Facility Overview
              </button>
              <button
                className={`nav-link-item ${activeTab === 'patients' ? 'active' : ''}`}
                onClick={() => setActiveTab('patients')}
              >
                <span className="material-symbols-outlined">groups</span>
                Patient Directory
              </button>
              <button
                className={`nav-link-item ${activeTab === 'assessment' ? 'active' : ''}`}
                onClick={() => setActiveTab('assessment')}
              >
                <span className="material-symbols-outlined">assessment</span>
                FIM & Assessments
              </button>
              <button
                className={`nav-link-item ${activeTab === 'schedule' ? 'active' : ''}`}
                onClick={() => setActiveTab('schedule')}
              >
                <span className="material-symbols-outlined">calendar_today</span>
                Facility Schedule
              </button>
            </>
          )}
        </nav>

        <div className="sidebar-cta">
          <button className="btn-sidebar-cta" onClick={() => alert(isClient ? 'Messaging Care Team...' : 'Adding New Admission...')}>
            <span className="material-symbols-outlined">{isClient ? 'chat' : 'add'}</span>
            {isClient ? 'Contact Care Team' : 'New Admission'}
          </button>
        </div>
      </aside>

      {/* Main Panel */}
      <main className="portal-main">
        {/* Topbar Header */}
        <header className="portal-topbar">
          <div className="topbar-title-group">
            <h2>{isClient ? 'Patient Recovery Workspace' : 'Clinical Facility Management'}</h2>
          </div>

          <div className="topbar-actions">
            <span className={`role-badge-pill ${isClient ? 'client' : 'admin'}`}>
              <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>
                {isClient ? 'person' : 'clinical_notes'}
              </span>
              {isClient ? 'Patient' : 'Clinical Administrator'}
            </span>

            <button className="icon-btn-rounded" title="Notifications">
              <span className="material-symbols-outlined">notifications</span>
            </button>

            <button className="btn-signout" onClick={handleSignOut} title="Sign Out">
              <span className="material-symbols-outlined">logout</span>
              Sign Out
            </button>
          </div>
        </header>

        {/* Content Canvas */}
        <div className="portal-content animate-fade-in">
          {/* ================================================================== */}
          {/* CLIENT PORTAL VIEWS                                               */}
          {/* ================================================================== */}
          {isClient && (
            <>
              {/* Hero Banner */}
              <section className="portal-hero-banner">
                <div className="hero-banner-content">
                  <h2>Welcome back, {sessionUser.name.split(' ')[0]}!</h2>
                  <p>
                    You are currently on Day 24 of your <strong>{sessionUser.condition}</strong> program. Your mobility scores are up 15% this week.
                  </p>
                </div>
                <div className="hero-stats-pills">
                  <div className="stat-pill-glass">
                    <strong>80%</strong>
                    <span>Mobility Target</span>
                  </div>
                  <div className="stat-pill-glass">
                    <strong>3/10</strong>
                    <span>Avg Pain Index</span>
                  </div>
                </div>
              </section>

              {/* Bento Grid */}
              <div className="bento-grid">
                {/* My Progress Bar Chart Card */}
                <div className="bento-card col-span-7">
                  <div className="card-header">
                    <div className="card-header-left">
                      <h3>My Recovery Progress</h3>
                      <p>Weekly Mobility Index vs Pain Score Trend</p>
                    </div>
                    <span className="trend-tag positive">
                      <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>trending_up</span> +15%
                    </span>
                  </div>

                  <div className="chart-container-box">
                    <div className="bar-chart-flex">
                      <div className="bar-col">
                        <div className="bar-fill" style={{ height: '40%' }}>
                          <span className="bar-tooltip">W1: 40%</span>
                        </div>
                        <span className="bar-label">Week 1</span>
                      </div>
                      <div className="bar-col">
                        <div className="bar-fill" style={{ height: '55%' }}>
                          <span className="bar-tooltip">W2: 55%</span>
                        </div>
                        <span className="bar-label">Week 2</span>
                      </div>
                      <div className="bar-col">
                        <div className="bar-fill" style={{ height: '70%' }}>
                          <span className="bar-tooltip">W3: 70%</span>
                        </div>
                        <span className="bar-label">Week 3</span>
                      </div>
                      <div className="bar-col">
                        <div className="bar-fill" style={{ height: '82%' }}>
                          <span className="bar-tooltip">W4: 82%</span>
                        </div>
                        <span className="bar-label">Week 4 (Current)</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Upcoming Therapy Sessions Card */}
                <div className="bento-card col-span-5">
                  <div className="card-header">
                    <div className="card-header-left">
                      <h3>Upcoming Therapy</h3>
                      <p>Scheduled sessions with your care team</p>
                    </div>
                  </div>

                  <div className="timeline-list">
                    {clientAppointments.map((item) => (
                      <div key={item.id} className="timeline-item-row">
                        <div className="timeline-date-badge">
                          <strong>{item.dateDay}</strong>
                          <span>{item.dateMonth}</span>
                        </div>
                        <div className="timeline-info">
                          <h4>{item.title}</h4>
                          <p>{item.time} • {item.provider}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Treatment Goals Card */}
                <div className="bento-card col-span-7">
                  <div className="card-header">
                    <div className="card-header-left">
                      <h3>Active Treatment Goals</h3>
                      <p>Milestones set by your lead physiatrist</p>
                    </div>
                  </div>

                  {clientGoals.map((goal) => (
                    <div key={goal.id} className="goal-item-card">
                      <div className="goal-top-row">
                        <h4>{goal.title}</h4>
                        <span>{goal.progress}% Completed</span>
                      </div>
                      <p>{goal.summary}</p>
                      <div className="progress-track-bg">
                        <div className="progress-fill-bar" style={{ width: `${goal.progress}%` }} />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Exercise Routine Card */}
                <div className="bento-card col-span-5">
                  <div className="card-header">
                    <div className="card-header-left">
                      <h3>Assigned Home Routine</h3>
                      <p>Daily prescribed mobility exercises</p>
                    </div>
                  </div>

                  <div className="timeline-list">
                    {clientExercises.slice(0, 3).map((ex) => (
                      <div key={ex.id} className="timeline-item-row">
                        <div className="timeline-date-badge" style={{ background: '#e0f2fe', color: '#0369a1' }}>
                          <span className="material-symbols-outlined">fitness_center</span>
                        </div>
                        <div className="timeline-info">
                          <h4>{ex.name}</h4>
                          <p>{ex.sets} sets × {ex.reps} • {ex.duration}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </>
          )}

          {/* ================================================================== */}
          {/* ADMIN PORTAL VIEWS (Tab Specific)                                 */}
          {/* ================================================================== */}
          {!isClient && (
            <>
              {/* TAB 1: FACILITY OVERVIEW DASHBOARD */}
              {activeTab === 'dashboard' && (
                <>
                  <div className="bento-grid">
                    <div className="metric-card-tile col-span-3">
                      <div className="metric-top">
                        <span className="title">Total Active Patients</span>
                        <div className="metric-icon-wrap" style={{ background: '#e0f2fe', color: '#0284c7' }}>
                          <span className="material-symbols-outlined">groups</span>
                        </div>
                      </div>
                      <div className="metric-value-group">
                        <strong>142</strong>
                        <span className="trend-tag positive">+4% this week</span>
                      </div>
                    </div>

                    <div className="metric-card-tile col-span-3">
                      <div className="metric-top">
                        <span className="title">Active Therapy Sessions</span>
                        <div className="metric-icon-wrap" style={{ background: '#ccfbf1', color: '#0d9488' }}>
                          <span className="material-symbols-outlined">vital_signs</span>
                        </div>
                      </div>
                      <div className="metric-value-group">
                        <strong>38</strong>
                        <span className="trend-tag positive">In session now</span>
                      </div>
                    </div>

                    <div className="metric-card-tile col-span-3">
                      <div className="metric-top">
                        <span className="title">Facility Bed Occupancy</span>
                        <div className="metric-icon-wrap" style={{ background: '#fee2e2', color: '#dc2626' }}>
                          <span className="material-symbols-outlined">bed</span>
                        </div>
                      </div>
                      <div className="metric-value-group">
                        <strong>86%</strong>
                        <span className="trend-tag warning">Near Capacity</span>
                      </div>
                    </div>

                    <div className="metric-card-tile col-span-3">
                      <div className="metric-top">
                        <span className="title">Appointments Today</span>
                        <div className="metric-icon-wrap" style={{ background: '#f3e8ff', color: '#9333ea' }}>
                          <span className="material-symbols-outlined">event_available</span>
                        </div>
                      </div>
                      <div className="metric-value-group">
                        <strong>124</strong>
                        <span className="trend-tag positive">48 remaining</span>
                      </div>
                    </div>
                  </div>

                  <div className="bento-card col-span-12">
                    <div className="card-header">
                      <div className="card-header-left">
                        <h3>Recent Patient Directory</h3>
                        <p>Monitor patient status, assigned therapists, and FIM scores</p>
                      </div>
                      <button className="text-button" onClick={() => setActiveTab('patients')}>View All Patients</button>
                    </div>

                    <div className="table-responsive">
                      <table className="modern-table">
                        <thead>
                          <tr>
                            <th>Patient ID</th>
                            <th>Patient Name</th>
                            <th>Primary Diagnosis</th>
                            <th>Assigned Therapist</th>
                            <th>Status</th>
                            <th>FIM Score</th>
                          </tr>
                        </thead>
                        <tbody>
                          {adminPatients.map((pt) => (
                            <tr key={pt.id}>
                              <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{pt.id}</td>
                              <td style={{ fontWeight: 700 }}>{pt.name}</td>
                              <td>{pt.diagnosis}</td>
                              <td>{pt.therapist}</td>
                              <td>
                                <span className={`status-badge ${pt.status.toLowerCase()}`}>
                                  {pt.status}
                                </span>
                              </td>
                              <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700 }}>{pt.score}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="bento-card col-span-12">
                    <div className="card-header">
                      <div className="card-header-left">
                        <h3>Today's Clinical Schedule</h3>
                        <p>Real-time therapy room allocations and practitioner assignments</p>
                      </div>
                    </div>

                    <div className="timeline-list">
                      {adminSchedule.map((item, idx) => (
                        <div key={idx} className="timeline-item-row">
                          <div className="timeline-date-badge">
                            <strong>{item.time.split(' ')[0]}</strong>
                            <span>{item.time.split(' ')[1]}</span>
                          </div>
                          <div className="timeline-info" style={{ flex: 1 }}>
                            <h4>{item.title} — {item.room}</h4>
                            <p>Patient: <strong>{item.patient}</strong> | Therapist: <strong>{item.therapist}</strong></p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* TAB 2: PATIENT DIRECTORY */}
              {activeTab === 'patients' && (
                <div className="bento-card col-span-12">
                  <div className="card-header">
                    <div className="card-header-left">
                      <h3>Full Patient Directory</h3>
                      <p>Manage patient records, admission statuses, and assigned care teams</p>
                    </div>
                    <button className="modern-submit-btn" style={{ width: 'auto', padding: '8px 16px', marginTop: 0 }} onClick={() => setActiveTab('add-patient')}>
                      <span className="material-symbols-outlined">person_add</span>
                      Add Patient
                    </button>
                  </div>

                  <div className="table-responsive">
                    <table className="modern-table">
                      <thead>
                        <tr>
                          <th>Patient ID</th>
                          <th>Patient Name</th>
                          <th>DOB / Age</th>
                          <th>Primary Diagnosis</th>
                          <th>Assigned Therapist</th>
                          <th>Status</th>
                          <th>FIM Score</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {adminPatients.map((pt) => (
                          <tr key={pt.id}>
                            <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 600 }}>{pt.id}</td>
                            <td style={{ fontWeight: 700 }}>{pt.name}</td>
                            <td>{pt.dob} ({pt.age} yrs)</td>
                            <td>{pt.diagnosis}</td>
                            <td>{pt.therapist}</td>
                            <td>
                              <span className={`status-badge ${pt.status.toLowerCase()}`}>
                                {pt.status}
                              </span>
                            </td>
                            <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700 }}>{pt.score}</td>
                            <td>
                              <button
                                className="text-button"
                                onClick={() => {
                                  setSelectedPatientId(pt.id)
                                  setActiveTab('assessment')
                                }}
                              >
                                Assess FIM
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 3: COMPREHENSIVE FIM & ASSESSMENT STUDIO */}
              {activeTab === 'assessment' && (
                <div className="animate-fade-in">
                  {/* Assessment Patient Context Bar */}
                  <div className="bento-card" style={{ marginBottom: '20px', padding: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '4px' }}>
                          <span style={{ background: '#d9e2ff', color: '#003c90', padding: '3px 8px', borderRadius: '4px', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>
                            Evaluation In Progress
                          </span>
                          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: '#64748b' }}>{currentPatient.id}</span>
                        </div>
                        <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a' }}>Comprehensive Rehabilitation Assessment</h2>
                        <p style={{ fontSize: '0.9rem', color: '#64748b', marginTop: '2px' }}>
                          Patient: <strong>{currentPatient.name}</strong> | DOB: <strong>{currentPatient.dob}</strong> | Diagnosis: <strong>{currentPatient.diagnosis}</strong>
                        </p>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <select
                          className="modern-select"
                          style={{ width: '220px', padding: '8px 12px' }}
                          value={selectedPatientId}
                          onChange={(e) => setSelectedPatientId(e.target.value)}
                        >
                          {adminPatients.map((p) => (
                            <option key={p.id} value={p.id}>{p.name} ({p.id})</option>
                          ))}
                        </select>

                        <button className="btn-signout" onClick={() => alert('Assessment Draft Saved!')}>
                          <span className="material-symbols-outlined">save</span>
                          Save Draft
                        </button>

                        <button className="modern-submit-btn" style={{ width: 'auto', padding: '8px 16px', marginTop: 0 }} onClick={() => alert(`Assessment Completed for ${currentPatient.name}! Final Score: ${totalFimScore}/126`)}>
                          <span className="material-symbols-outlined">check_circle</span>
                          Complete Evaluation
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Stepper Header */}
                  <div className="assessment-stepper-bar">
                    <div className="stepper-step-item completed">
                      <div className="step-bubble">✓</div>
                      <span className="step-label">1. Vitals & Medical History</span>
                    </div>

                    <div className="stepper-step-item active">
                      <div className="step-bubble">2</div>
                      <span className="step-label">2. Functional Independence (FIM)</span>
                    </div>

                    <div className="stepper-step-item">
                      <div className="step-bubble">3</div>
                      <span className="step-label">3. Musculoskeletal & ROM</span>
                    </div>

                    <div className="stepper-step-item">
                      <div className="step-bubble">4</div>
                      <span className="step-label">4. Goals & Discharge Plan</span>
                    </div>
                  </div>

                  {/* FIM Live Score Banner Card */}
                  <div className="fim-score-hero-card">
                    <div>
                      <span style={{ fontSize: '0.8rem', fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: '#94a3b8' }}>
                        Functional Independence Measure (FIM) Score Studio
                      </span>
                      <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginTop: '4px' }}>
                        Live Calculated Assessment: <span style={{ color: '#38bdf8' }}>{totalFimScore} / 126</span>
                      </h3>
                      <p style={{ fontSize: '0.88rem', color: '#cbd5e1', marginTop: '4px' }}>
                        Motor Subscore: <strong>{motorSubscore} / 91</strong> | Cognitive Subscore: <strong>{cognitiveSubscore} / 35</strong>
                      </p>
                    </div>

                    <div style={{ textAlign: 'right' }}>
                      <div className="fim-score-number">{totalFimScore} <span style={{ fontSize: '1.2rem', color: '#94a3b8' }}>/ 126</span></div>
                      <span style={{ background: totalFimScore >= 90 ? '#10b981' : totalFimScore >= 60 ? '#f59e0b' : '#ef4444', color: 'white', padding: '3px 10px', borderRadius: '12px', fontSize: '0.75rem', fontWeight: 700, display: 'inline-block', marginTop: '6px' }}>
                        {totalFimScore >= 90 ? 'Modified Independence' : totalFimScore >= 60 ? 'Moderate Dependence' : 'Complete Dependence'}
                      </span>
                    </div>
                  </div>

                  {/* FIM Domains Rating Table */}
                  <div className="bento-grid" style={{ marginBottom: '24px' }}>
                    <div className="bento-card col-span-8">
                      <div className="card-header">
                        <div className="card-header-left">
                          <h3>18-Item FIM Scoring Rating Scale</h3>
                          <p>Rate patient performance on 1-7 Functional Scale (1 = Total Assist, 7 = Independence)</p>
                        </div>
                      </div>

                      {/* Domain 1: Self-Care */}
                      <div style={{ marginBottom: '20px' }}>
                        <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0f52ba', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px', paddingBottom: '4px', borderBottom: '2px solid #e0f2fe' }}>
                          A. Self-Care Domain
                        </h4>

                        <div className="fim-item-row">
                          <div>
                            <strong style={{ fontSize: '0.9rem', color: '#0f172a' }}>1. Eating</strong>
                            <p style={{ fontSize: '0.78rem', color: '#64748b' }}>Utensil management & swallowing</p>
                          </div>
                          <div>
                            <input
                              type="range"
                              min="1"
                              max="7"
                              className="fim-range-slider"
                              value={fimScores.eating}
                              onChange={(e) => handleFimChange('eating', e.target.value)}
                            />
                            <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>{getFimDescription(fimScores.eating)}</span>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <select className="modern-select" style={{ padding: '4px 8px', fontSize: '0.85rem' }} value={fimScores.eating} onChange={(e) => handleFimChange('eating', e.target.value)}>
                              {[1, 2, 3, 4, 5, 6, 7].map((s) => <option key={s} value={s}>{s}</option>)}
                            </select>
                          </div>
                        </div>

                        <div className="fim-item-row">
                          <div>
                            <strong style={{ fontSize: '0.9rem', color: '#0f172a' }}>2. Grooming</strong>
                            <p style={{ fontSize: '0.78rem', color: '#64748b' }}>Washing hands/face, teeth brushing</p>
                          </div>
                          <div>
                            <input
                              type="range"
                              min="1"
                              max="7"
                              className="fim-range-slider"
                              value={fimScores.grooming}
                              onChange={(e) => handleFimChange('grooming', e.target.value)}
                            />
                            <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>{getFimDescription(fimScores.grooming)}</span>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <select className="modern-select" style={{ padding: '4px 8px', fontSize: '0.85rem' }} value={fimScores.grooming} onChange={(e) => handleFimChange('grooming', e.target.value)}>
                              {[1, 2, 3, 4, 5, 6, 7].map((s) => <option key={s} value={s}>{s}</option>)}
                            </select>
                          </div>
                        </div>

                        <div className="fim-item-row">
                          <div>
                            <strong style={{ fontSize: '0.9rem', color: '#0f172a' }}>3. Bathing</strong>
                            <p style={{ fontSize: '0.78rem', color: '#64748b' }}>Washing body neck-down</p>
                          </div>
                          <div>
                            <input
                              type="range"
                              min="1"
                              max="7"
                              className="fim-range-slider"
                              value={fimScores.bathing}
                              onChange={(e) => handleFimChange('bathing', e.target.value)}
                            />
                            <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>{getFimDescription(fimScores.bathing)}</span>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <select className="modern-select" style={{ padding: '4px 8px', fontSize: '0.85rem' }} value={fimScores.bathing} onChange={(e) => handleFimChange('bathing', e.target.value)}>
                              {[1, 2, 3, 4, 5, 6, 7].map((s) => <option key={s} value={s}>{s}</option>)}
                            </select>
                          </div>
                        </div>

                        <div className="fim-item-row">
                          <div>
                            <strong style={{ fontSize: '0.9rem', color: '#0f172a' }}>4. Dressing Upper Body</strong>
                            <p style={{ fontSize: '0.78rem', color: '#64748b' }}>Shirt, pullover, prosthesis</p>
                          </div>
                          <div>
                            <input
                              type="range"
                              min="1"
                              max="7"
                              className="fim-range-slider"
                              value={fimScores.dressingUpper}
                              onChange={(e) => handleFimChange('dressingUpper', e.target.value)}
                            />
                            <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>{getFimDescription(fimScores.dressingUpper)}</span>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <select className="modern-select" style={{ padding: '4px 8px', fontSize: '0.85rem' }} value={fimScores.dressingUpper} onChange={(e) => handleFimChange('dressingUpper', e.target.value)}>
                              {[1, 2, 3, 4, 5, 6, 7].map((s) => <option key={s} value={s}>{s}</option>)}
                            </select>
                          </div>
                        </div>

                        <div className="fim-item-row">
                          <div>
                            <strong style={{ fontSize: '0.9rem', color: '#0f172a' }}>5. Dressing Lower Body</strong>
                            <p style={{ fontSize: '0.78rem', color: '#64748b' }}>Pants, socks, shoes</p>
                          </div>
                          <div>
                            <input
                              type="range"
                              min="1"
                              max="7"
                              className="fim-range-slider"
                              value={fimScores.dressingLower}
                              onChange={(e) => handleFimChange('dressingLower', e.target.value)}
                            />
                            <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>{getFimDescription(fimScores.dressingLower)}</span>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <select className="modern-select" style={{ padding: '4px 8px', fontSize: '0.85rem' }} value={fimScores.dressingLower} onChange={(e) => handleFimChange('dressingLower', e.target.value)}>
                              {[1, 2, 3, 4, 5, 6, 7].map((s) => <option key={s} value={s}>{s}</option>)}
                            </select>
                          </div>
                        </div>
                      </div>

                      {/* Domain 2: Transfers & Mobility */}
                      <div style={{ marginBottom: '20px' }}>
                        <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0f52ba', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px', paddingBottom: '4px', borderBottom: '2px solid #e0f2fe' }}>
                          B. Transfers & Mobility Domain
                        </h4>

                        <div className="fim-item-row">
                          <div>
                            <strong style={{ fontSize: '0.9rem', color: '#0f172a' }}>6. Bed / Chair / Wheelchair Transfer</strong>
                            <p style={{ fontSize: '0.78rem', color: '#64748b' }}>Sit-to-stand, wheelchair transfer</p>
                          </div>
                          <div>
                            <input
                              type="range"
                              min="1"
                              max="7"
                              className="fim-range-slider"
                              value={fimScores.transfersBed}
                              onChange={(e) => handleFimChange('transfersBed', e.target.value)}
                            />
                            <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>{getFimDescription(fimScores.transfersBed)}</span>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <select className="modern-select" style={{ padding: '4px 8px', fontSize: '0.85rem' }} value={fimScores.transfersBed} onChange={(e) => handleFimChange('transfersBed', e.target.value)}>
                              {[1, 2, 3, 4, 5, 6, 7].map((s) => <option key={s} value={s}>{s}</option>)}
                            </select>
                          </div>
                        </div>

                        <div className="fim-item-row">
                          <div>
                            <strong style={{ fontSize: '0.9rem', color: '#0f172a' }}>7. Toilet Transfer</strong>
                            <p style={{ fontSize: '0.78rem', color: '#64748b' }}>On & off commode</p>
                          </div>
                          <div>
                            <input
                              type="range"
                              min="1"
                              max="7"
                              className="fim-range-slider"
                              value={fimScores.transfersToilet}
                              onChange={(e) => handleFimChange('transfersToilet', e.target.value)}
                            />
                            <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>{getFimDescription(fimScores.transfersToilet)}</span>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <select className="modern-select" style={{ padding: '4px 8px', fontSize: '0.85rem' }} value={fimScores.transfersToilet} onChange={(e) => handleFimChange('transfersToilet', e.target.value)}>
                              {[1, 2, 3, 4, 5, 6, 7].map((s) => <option key={s} value={s}>{s}</option>)}
                            </select>
                          </div>
                        </div>

                        <div className="fim-item-row">
                          <div>
                            <strong style={{ fontSize: '0.9rem', color: '#0f172a' }}>8. Locomotion: Walk / Wheelchair</strong>
                            <p style={{ fontSize: '0.78rem', color: '#64748b' }}>50 meters level surface</p>
                          </div>
                          <div>
                            <input
                              type="range"
                              min="1"
                              max="7"
                              className="fim-range-slider"
                              value={fimScores.locomotionWalk}
                              onChange={(e) => handleFimChange('locomotionWalk', e.target.value)}
                            />
                            <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>{getFimDescription(fimScores.locomotionWalk)}</span>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <select className="modern-select" style={{ padding: '4px 8px', fontSize: '0.85rem' }} value={fimScores.locomotionWalk} onChange={(e) => handleFimChange('locomotionWalk', e.target.value)}>
                              {[1, 2, 3, 4, 5, 6, 7].map((s) => <option key={s} value={s}>{s}</option>)}
                            </select>
                          </div>
                        </div>
                      </div>

                      {/* Domain 3: Cognition & Communication */}
                      <div>
                        <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0f52ba', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '8px', paddingBottom: '4px', borderBottom: '2px solid #e0f2fe' }}>
                          C. Cognitive & Communication Domain
                        </h4>

                        <div className="fim-item-row">
                          <div>
                            <strong style={{ fontSize: '0.9rem', color: '#0f172a' }}>9. Comprehension</strong>
                            <p style={{ fontSize: '0.78rem', color: '#64748b' }}>Auditory / visual understanding</p>
                          </div>
                          <div>
                            <input
                              type="range"
                              min="1"
                              max="7"
                              className="fim-range-slider"
                              value={fimScores.comprehension}
                              onChange={(e) => handleFimChange('comprehension', e.target.value)}
                            />
                            <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>{getFimDescription(fimScores.comprehension)}</span>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <select className="modern-select" style={{ padding: '4px 8px', fontSize: '0.85rem' }} value={fimScores.comprehension} onChange={(e) => handleFimChange('comprehension', e.target.value)}>
                              {[1, 2, 3, 4, 5, 6, 7].map((s) => <option key={s} value={s}>{s}</option>)}
                            </select>
                          </div>
                        </div>

                        <div className="fim-item-row">
                          <div>
                            <strong style={{ fontSize: '0.9rem', color: '#0f172a' }}>10. Problem Solving</strong>
                            <p style={{ fontSize: '0.78rem', color: '#64748b' }}>Daily decision making & safety</p>
                          </div>
                          <div>
                            <input
                              type="range"
                              min="1"
                              max="7"
                              className="fim-range-slider"
                              value={fimScores.problemSolving}
                              onChange={(e) => handleFimChange('problemSolving', e.target.value)}
                            />
                            <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>{getFimDescription(fimScores.problemSolving)}</span>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <select className="modern-select" style={{ padding: '4px 8px', fontSize: '0.85rem' }} value={fimScores.problemSolving} onChange={(e) => handleFimChange('problemSolving', e.target.value)}>
                              {[1, 2, 3, 4, 5, 6, 7].map((s) => <option key={s} value={s}>{s}</option>)}
                            </select>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Right Column: Musculoskeletal ROM & Treatment Goals */}
                    <div className="col-span-4" style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                      {/* ROM & Pain Score Card */}
                      <div className="bento-card">
                        <div className="card-header">
                          <div className="card-header-left">
                            <h3>Musculoskeletal & ROM</h3>
                            <p>Active Range of Motion & Pain Rating</p>
                          </div>
                        </div>

                        <div className="form-group" style={{ marginBottom: '16px' }}>
                          <label>Active Knee Flexion Angle (°): <strong>{romAssessment.kneeFlexion}°</strong></label>
                          <input
                            type="range"
                            min="0"
                            max="150"
                            className="fim-range-slider"
                            value={romAssessment.kneeFlexion}
                            onChange={(e) => setRomAssessment((prev) => ({ ...prev, kneeFlexion: Number(e.target.value) }))}
                          />
                          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: '#94a3b8', marginTop: '4px' }}>
                            <span>0° (Extension)</span>
                            <span>120° (Goal)</span>
                            <span>150° (Full)</span>
                          </div>
                        </div>

                        <div className="form-group">
                          <label>Current Pain Level (0-10 Scale): <strong>{romAssessment.painScore} / 10</strong></label>
                          <input
                            type="range"
                            min="0"
                            max="10"
                            className="fim-range-slider"
                            style={{ accentColor: romAssessment.painScore > 6 ? '#ef4444' : '#f59e0b' }}
                            value={romAssessment.painScore}
                            onChange={(e) => setRomAssessment((prev) => ({ ...prev, painScore: Number(e.target.value) }))}
                          />
                          <span style={{ fontSize: '0.78rem', color: romAssessment.painScore > 6 ? '#dc2626' : '#059669', fontWeight: 600, marginTop: '4px' }}>
                            {romAssessment.painScore <= 3 ? 'Mild Pain (Controlled)' : romAssessment.painScore <= 6 ? 'Moderate Pain (Monitored)' : 'Severe Pain (Requires Review)'}
                          </span>
                        </div>
                      </div>

                      {/* Goals & Clinical Notes Editor Card */}
                      <div className="bento-card" style={{ flex: 1 }}>
                        <div className="card-header">
                          <div className="card-header-left">
                            <h3>Treatment Plan Goals</h3>
                            <p>Formulate rehabilitation milestones</p>
                          </div>
                        </div>

                        <div className="form-group" style={{ marginBottom: '14px' }}>
                          <label>Short-Term Goal (2 Weeks)</label>
                          <textarea
                            className="modern-select no-icon"
                            rows="2"
                            style={{ minHeight: '60px', fontSize: '0.85rem' }}
                            value={romAssessment.shortTermGoal}
                            onChange={(e) => setRomAssessment((prev) => ({ ...prev, shortTermGoal: e.target.value }))}
                          />
                        </div>

                        <div className="form-group" style={{ marginBottom: '14px' }}>
                          <label>Long-Term Goal (6 Weeks)</label>
                          <textarea
                            className="modern-select no-icon"
                            rows="2"
                            style={{ minHeight: '60px', fontSize: '0.85rem' }}
                            value={romAssessment.longTermGoal}
                            onChange={(e) => setRomAssessment((prev) => ({ ...prev, longTermGoal: e.target.value }))}
                          />
                        </div>

                        <div className="form-group">
                          <label>Physiatrist Clinical Notes</label>
                          <textarea
                            className="modern-select no-icon"
                            rows="3"
                            style={{ minHeight: '70px', fontSize: '0.85rem' }}
                            value={romAssessment.clinicalNotes}
                            onChange={(e) => setRomAssessment((prev) => ({ ...prev, clinicalNotes: e.target.value }))}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 5: ADD PATIENT FORM */}
              {activeTab === 'add-patient' && (
                <div className="animate-fade-in">
                  {/* Page Header */}
                  <div className="bento-card" style={{ marginBottom: '20px', padding: '24px 28px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#e0f2fe', color: '#0284c7', padding: '4px 12px', borderRadius: '20px', fontSize: '0.78rem', fontWeight: 700, marginBottom: '10px' }}>
                          <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>person_add</span>
                          New Patient Admission
                        </div>
                        <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#0f172a' }}>Register New Patient</h2>
                        <p style={{ fontSize: '0.9rem', color: '#64748b', marginTop: '4px' }}>
                          Fill in the patient's clinical details to create a new admission record.
                        </p>
                      </div>
                      <button
                        className="btn-signout"
                        onClick={() => setActiveTab('patients')}
                      >
                        <span className="material-symbols-outlined">arrow_back</span>
                        Back to Directory
                      </button>
                    </div>
                  </div>

                  {/* Add Patient Form */}
                  <div className="bento-card col-span-12">
                    <div className="card-header" style={{ marginBottom: '24px' }}>
                      <div className="card-header-left">
                        <h3>Patient Information</h3>
                        <p>Enter the patient's demographic and clinical intake information</p>
                      </div>
                    </div>

                    <form onSubmit={handleAddPatient} className="modern-form" style={{ maxWidth: '900px' }}>
                      {/* Row 1: Name & DOB */}
                      <div className="form-row-2">
                        <div className="form-group">
                          <label>Full Name</label>
                          <div className="input-with-icon">
                            <span className="material-symbols-outlined">person</span>
                            <input
                              type="text"
                              name="name"
                              className="modern-input"
                              placeholder="e.g. Eleanor Vance"
                              value={newPatientForm.name}
                              onChange={handleNewPatientChange}
                              required
                            />
                          </div>
                        </div>
                        <div className="form-group">
                          <label>Date of Birth</label>
                          <div className="input-with-icon">
                            <span className="material-symbols-outlined">calendar_today</span>
                            <input
                              type="text"
                              name="dob"
                              className="modern-input"
                              placeholder="MM/DD/YYYY"
                              value={newPatientForm.dob}
                              onChange={handleNewPatientChange}
                              required
                            />
                          </div>
                        </div>
                      </div>

                      {/* Row 2: Age & Status */}
                      <div className="form-row-2">
                        <div className="form-group">
                          <label>Age (years)</label>
                          <div className="input-with-icon">
                            <span className="material-symbols-outlined">cake</span>
                            <input
                              type="number"
                              name="age"
                              className="modern-input"
                              placeholder="e.g. 54"
                              value={newPatientForm.age}
                              onChange={handleNewPatientChange}
                              required
                            />
                          </div>
                        </div>
                        <div className="form-group">
                          <label>Admission Status</label>
                          <div className="input-with-icon">
                            <span className="material-symbols-outlined">bed</span>
                            <select
                              name="status"
                              className="modern-select"
                              value={newPatientForm.status}
                              onChange={handleNewPatientChange}
                            >
                              <option value="Inpatient">Inpatient</option>
                              <option value="Outpatient">Outpatient</option>
                              <option value="Critical">Critical</option>
                              <option value="Discharged">Discharged</option>
                            </select>
                          </div>
                        </div>
                      </div>

                      {/* Row 3: Diagnosis */}
                      <div className="form-group">
                        <label>Primary Diagnosis / Condition</label>
                        <div className="input-with-icon">
                          <span className="material-symbols-outlined">healing</span>
                          <input
                            type="text"
                            name="diagnosis"
                            className="modern-input"
                            placeholder="e.g. Post-Op Total Hip Replacement"
                            value={newPatientForm.diagnosis}
                            onChange={handleNewPatientChange}
                            required
                          />
                        </div>
                      </div>

                      {/* Row 4: Assigned Therapist */}
                      <div className="form-group">
                        <label>Assigned Lead Therapist</label>
                        <div className="input-with-icon">
                          <span className="material-symbols-outlined">stethoscope</span>
                          <input
                            type="text"
                            name="therapist"
                            className="modern-input"
                            placeholder="e.g. Dr. Sarah Chen, PT"
                            value={newPatientForm.therapist}
                            onChange={handleNewPatientChange}
                            required
                          />
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div style={{ display: 'flex', gap: '12px', marginTop: '28px' }}>
                        <button type="submit" className="modern-submit-btn" style={{ width: 'auto', padding: '12px 28px', marginTop: 0 }}>
                          <span className="material-symbols-outlined">person_add</span>
                          Register Patient & Add to Directory
                        </button>
                        <button
                          type="button"
                          className="btn-signout"
                          onClick={() => setActiveTab('patients')}
                        >
                          Cancel
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              )}

              {/* TAB 4: FACILITY SCHEDULE */}
              {activeTab === 'schedule' && (
                <div className="bento-card col-span-12">
                  <div className="card-header">
                    <div className="card-header-left">
                      <h3>Full Facility Therapy Schedule</h3>
                      <p>View practitioner room allocations and daily clinical appointments</p>
                    </div>
                    <button className="btn-signout" onClick={() => alert('Filter Schedule...')}>
                      <span className="material-symbols-outlined">filter_list</span> Filter Schedule
                    </button>
                  </div>

                  <div className="timeline-list">
                    {adminSchedule.map((item, idx) => (
                      <div key={idx} className="timeline-item-row" style={{ padding: '16px' }}>
                        <div className="timeline-date-badge" style={{ width: '70px', height: '60px' }}>
                          <strong style={{ fontSize: '1.25rem' }}>{item.time.split(' ')[0]}</strong>
                          <span>{item.time.split(' ')[1]}</span>
                        </div>
                        <div className="timeline-info" style={{ flex: 1 }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <h4 style={{ fontSize: '1rem', fontWeight: 800 }}>{item.title}</h4>
                            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: '#0f52ba', fontWeight: 700 }}>{item.room}</span>
                          </div>
                          <p style={{ marginTop: '4px' }}>
                            Patient: <strong>{item.patient}</strong> | Practitioner: <strong>{item.therapist}</strong>
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  )
}

export default App
