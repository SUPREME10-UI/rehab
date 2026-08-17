import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import './App.css'
import rehabBg1 from './assets/rehab-bg-1.png'
import Home from './Home'

// =============================================================================
// CustomSelect — Modal-style dropdown component
// =============================================================================
function CustomSelect({ name, value, onChange, options, style, className, placeholder }) {
  const [open, setOpen] = useState(false)
  const ref = useRef(null)

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const selected = options.find((o) => String(o.value) === String(value))
  const displayLabel = selected ? selected.label : (placeholder || 'Select…')

  const handleSelect = (optValue) => {
    // Simulate a synthetic event for compatibility with existing onChange handlers
    const syntheticEvent = { target: { name, value: optValue } }
    onChange(syntheticEvent)
    setOpen(false)
  }

  return (
    <div
      ref={ref}
      className={`cselect-wrapper ${className || ''}`}
      style={style}
    >
      {/* Trigger button */}
      <button
        type="button"
        className={`cselect-trigger ${open ? 'open' : ''}`}
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
      >
        <span className="cselect-label">{displayLabel}</span>
        <span className={`cselect-chevron material-symbols-outlined ${open ? 'rotated' : ''}`}>
          expand_more
        </span>
      </button>

      {/* Modal dropdown panel */}
      {open && (
        <>
          {/* Backdrop for small dropdowns (transparent) */}
          <div className="cselect-backdrop" onClick={() => setOpen(false)} />
          <div className="cselect-panel" role="listbox">
            <div className="cselect-panel-inner">
              {options.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  role="option"
                  aria-selected={String(opt.value) === String(value)}
                  className={`cselect-option ${String(opt.value) === String(value) ? 'selected' : ''}`}
                  onClick={() => handleSelect(opt.value)}
                >
                  <span className="cselect-option-label">{opt.label}</span>
                  {String(opt.value) === String(value) && (
                    <span className="material-symbols-outlined cselect-check">check</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

// Initial Mock Data
const clientAppointments = [
  {
    id: 1, title: 'Physical Therapy — Gait & Balance', dateDay: '12', dateMonth: 'OCT',
    time: '10:00 AM – 11:00 AM', provider: 'Dr. A. Smith, PT', location: 'Therapy Room 204',
    status: 'Upcoming', type: 'Physical Therapy', telehealth: false, duration: '60 min',
    notes: 'Focus on stride length and balance training. Bring your knee brace.',
    avatar: 'AS', avatarColor: '#1d4ed8'
  },
  {
    id: 2, title: 'Occupational Therapy — Daily Living', dateDay: '15', dateMonth: 'OCT',
    time: '02:00 PM – 03:00 PM', provider: 'Sarah L., OT', location: 'ADL Suite B',
    status: 'Upcoming', type: 'Occupational Therapy', telehealth: false, duration: '60 min',
    notes: 'ADL activity training: dressing, bathing, and stair safety techniques.',
    avatar: 'SL', avatarColor: '#16a34a'
  },
  {
    id: 3, title: 'Physiatrist Progress Review', dateDay: '18', dateMonth: 'OCT',
    time: '11:30 AM – 12:15 PM', provider: 'Dr. Lena Ortiz, MD', location: 'Clinical Suite 102',
    status: 'Upcoming', type: 'Consultation', telehealth: true, duration: '45 min',
    notes: 'Monthly goal milestone review. Telehealth — join via the patient app link.',
    avatar: 'LO', avatarColor: '#7c3aed'
  }
]

const clientSessionHistory = [
  {
    id: 101, title: 'Physical Therapy — Knee ROM', dateDay: '05', dateMonth: 'OCT',
    time: '10:00 AM – 11:00 AM', provider: 'Dr. A. Smith, PT',
    status: 'Completed', type: 'Physical Therapy', duration: '60 min',
    sessionNote: 'Patient achieved 110° active knee flexion. Progressing well. Continue heel slides.',
    avatar: 'AS', avatarColor: '#1d4ed8'
  },
  {
    id: 102, title: 'Occupational Therapy — Grip Strength', dateDay: '02', dateMonth: 'OCT',
    time: '01:00 PM – 02:00 PM', provider: 'Sarah L., OT',
    status: 'Completed', type: 'Occupational Therapy', duration: '60 min',
    sessionNote: 'TheraBand grip exercises completed. Grip force improved by 12% this session.',
    avatar: 'SL', avatarColor: '#16a34a'
  },
  {
    id: 103, title: 'Physiatrist Initial Assessment', dateDay: '28', dateMonth: 'SEP',
    time: '11:00 AM – 12:00 PM', provider: 'Dr. Lena Ortiz, MD',
    status: 'Completed', type: 'Consultation', duration: '60 min',
    sessionNote: 'Baseline FIM score established. Recovery roadmap and discharge goals set.',
    avatar: 'LO', avatarColor: '#7c3aed'
  }
]

const clientGoals = [
  { id: 1, title: 'Unassisted Walking (50m)', summary: 'Ambulate 50 meters safely without a cane or walker.', progress: 80, category: 'Mobility' },
  { id: 2, title: 'Knee Flexion (120°)', summary: 'Achieve 120 degrees of active right knee flexion during therapy.', progress: 65, category: 'Range of Motion' },
  { id: 3, title: 'Pain Index Reduction', summary: 'Maintain daily post-activity pain score below 3/10.', progress: 90, category: 'Comfort' }
]

const clientExercises = [
  { id: 1, name: 'Heel Slides', focus: 'Knee ROM', sets: 3, reps: 10, duration: '10 min', tag: 'Phase 1', icon: 'directions_walk', target: 'Quadriceps & Knee Joint', rest: '45s', difficulty: 'Beginner', description: 'Gently slide your heel towards your buttocks while keeping foot flat on table.' },
  { id: 2, name: 'Quad Sets', focus: 'Isometric Strength', sets: 2, reps: 15, duration: '8 min', tag: 'Phase 1', icon: 'fitness_center', target: 'Vastus Medialis (VMO)', rest: '30s', difficulty: 'Beginner', description: 'Tighten thigh muscle, pushing the back of your knee down flat into the bed.' },
  { id: 3, name: 'Straight Leg Raise', focus: 'Hip & Core Strength', sets: 3, reps: 10, duration: '12 min', tag: 'Phase 2', icon: 'accessibility_new', target: 'Hip Flexors & Core', rest: '60s', difficulty: 'Intermediate', description: 'Raise leg to 45 degrees, holding for 2 seconds before slowly lowering.' },
  { id: 4, name: 'Single-Leg Balance Drills', focus: 'Proprioception', sets: 3, reps: '30s hold', duration: '10 min', tag: 'Phase 2', icon: 'self_improvement', target: 'Ankle & Hip Stabilizers', rest: '60s', difficulty: 'Intermediate', description: 'Stand on affected leg with slight knee bend while maintaining stable posture.' }
]

const adminSchedule = [
  { id: 1, time: '09:00 AM', title: 'Gait Training & Hydrotherapy', patient: 'Eleanor Vance', therapist: 'J. Doe, PT', room: 'Rm 204', type: 'Physical Therapy', status: 'Confirmed', duration: '60 min', notes: 'Patient requires walker assist. Focus on stride length and balance on hydrotherapy treadmill.' },
  { id: 2, time: '10:30 AM', title: 'Cognitive & Speech Evaluation', patient: 'Marcus Thorne', therapist: 'S. Williams, SLP', room: 'Rm 112', type: 'Speech Therapy', status: 'Confirmed', duration: '45 min', notes: 'Initial post-stroke speech assessment. Administer ASHA functional assessment battery.' },
  { id: 3, time: '11:15 AM', title: 'FIM Re-assessment Session', patient: 'Lisa Park', therapist: 'Dr. L. Ortiz, PT', room: 'Rm 208', type: 'Assessment', status: 'Pending', duration: '30 min', notes: 'Monthly FIM re-evaluation. Compare against baseline scores from admission.' },
  { id: 4, time: '01:00 PM', title: 'Upper Extremity Resistance Drills', patient: 'Sarah Jenkins', therapist: 'A. Lee, OT', room: 'Lounge B', type: 'Occupational Therapy', status: 'Confirmed', duration: '60 min', notes: 'TheraBand exercises and grip strengthening. Target: 80% ROM by next week.' },
  { id: 5, time: '02:30 PM', title: 'Spinal Mobility & Transfer Training', patient: 'David Chen', therapist: 'Dr. L. Ortiz, PT', room: 'Rehab Gym', type: 'Physical Therapy', status: 'Confirmed', duration: '60 min', notes: 'Log-roll technique and sit-to-stand transfers. Precaution: no flexion > 90 degrees.' },
  { id: 6, time: '03:30 PM', title: 'Discharge Planning Consultation', patient: 'Robert Kim', therapist: 'S. Williams, SLP', room: 'Conference Rm', type: 'Consultation', status: 'Cancelled', duration: '30 min', notes: 'Family meeting to review home modification needs and outpatient referral options.' },
  { id: 7, time: '04:00 PM', title: 'Pain Management & TENS Therapy', patient: 'Eleanor Vance', therapist: 'A. Lee, OT', room: 'Rm 204', type: 'Occupational Therapy', status: 'Confirmed', duration: '45 min', notes: 'TENS electrode placement at lumbar L4-L5. Patient reports 6/10 pain baseline.' }
]

const SESSION_TYPE_COLORS = {
  'Physical Therapy': { bg: '#eff6ff', color: '#1d4ed8', dot: '#2563eb' },
  'Speech Therapy': { bg: '#fef3c7', color: '#b45309', dot: '#d97706' },
  'Occupational Therapy': { bg: '#f0fdf4', color: '#16a34a', dot: '#22c55e' },
  'Assessment': { bg: '#f5f3ff', color: '#7c3aed', dot: '#8b5cf6' },
  'Consultation': { bg: '#fdf4ff', color: '#9d174d', dot: '#ec4899' },
}

function App() {
  // Check URL params for routing
  const searchParams = new URLSearchParams(window.location.search)
  const authParam = searchParams.get('auth')
  
  const [currentView, setCurrentView] = useState(authParam ? 'portal' : 'home')

  // Auth & User Session State — Default to Clinical Practitioner Admin Session
  const [sessionUser, setSessionUser] = useState({
    role: 'admin',
    name: 'Dr. Lena Ortiz, PT',
    email: 'dortiz@rhms.org',
    specialization: 'Lead Physical Therapist',
    facility: 'St. Jude Rehab Center'
  })
  const [authMode, setAuthMode] = useState('signup') // 'signup' | 'login'
  const [portalRole, setPortalRole] = useState('admin') // 'client' | 'admin'
  const [activeTab, setActiveTab] = useState('dashboard')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Settings Live Functional State
  const [patientProfileForm, setPatientProfileForm] = useState({
    name: 'Sarah Jenkins',
    email: 'sarah.j@example.com',
    phone: '+1 (555) 012-3456',
    condition: 'Post-Op ACL Reconstruction'
  })

  const [adminProfileForm, setAdminProfileForm] = useState({
    name: 'Dr. Lena Ortiz, PT',
    email: 'dortiz@rhms.org',
    phone: '+1 (555) 987-6543',
    facility: 'St. Jude Rehab Center',
    specialization: 'Lead Physical Therapist'
  })

  const [patientNotifs, setPatientNotifs] = useState({
    sessionReminders: true,
    exerciseReminders: true,
    goalUpdates: true,
    therapistMessages: true,
    weeklyReports: false
  })

  const [adminNotifs, setAdminNotifs] = useState({
    newPatientAlerts: true,
    scheduleChanges: true,
    assessmentDue: true,
    teamMessages: true,
    dailyFacilitySummary: false
  })

  const [accessibilitySettings, setAccessibilitySettings] = useState({
    largeText: false,
    highContrast: false,
    darkMode: false,
    soundEffects: true
  })

  const [adminClinicalConfigs, setAdminClinicalConfigs] = useState({
    painAlert: true,
    autoFim: true,
    rescheduleApprove: true,
    physiatristSignoff: true,
    complianceAlert: false
  })

  // Toast Notification state
  const [toastMessage, setToastMessage] = useState(null)
  const triggerToast = (text, type = 'success') => {
    setToastMessage({ text, type })
    setTimeout(() => setToastMessage(null), 3200)
  }

  // Modals state
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [passwordForm, setPasswordForm] = useState({ current: '', newPass: '', confirmPass: '' })

  const [show2faModal, setShow2faModal] = useState(false)
  const [twoFaStep, setTwoFaStep] = useState(1)
  const [twoFaCode, setTwoFaCode] = useState('')
  const [twoFaActive, setTwoFaActive] = useState(false)
  const [lastEhrSync, setLastEhrSync] = useState('Connected & Syncing (FHIR v4)')

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

  // Stepper & Assessment Form Page States
  const [assessmentStep, setAssessmentStep] = useState(1)

  const [vitalsHistory, setVitalsHistory] = useState({
    bp: '120/80',
    hr: '74',
    rr: '16',
    spo2: '98',
    temp: '98.6',
    medicalHistory: 'Hypertension (managed), Left Total Knee Arthroplasty (2021), Type 2 Diabetes.',
    allergies: 'Penicillin (Rash), Latex (Mild)',
    precautions: 'High Fall Risk, Weight-Bearing As Tolerated (WBAT) Right Lower Extremity.'
  })

  // ROM & Musculoskeletal Assessment State
  const [romAssessment, setRomAssessment] = useState({
    kneeFlexion: 110,
    hipFlexion: '105°',
    mmtScore: '4/5 (Good)',
    painScore: 3,
    painLocation: 'Anterior Right Knee, intermittent aching post-ambulation',
    edema: '1+ Mild Pitting Edema at right ankle',
    shortTermGoal: 'Patient will perform sit-to-stand transfers with minimal assist (FIM 4) within 2 weeks.',
    longTermGoal: 'Patient will ambulate 150ft independently with rolling walker within 6 weeks.',
    clinicalNotes: 'Steady functional progress noted. Patient demonstrates improved motor planning during leg raises and transfer practice.'
  })

  const [dischargePlan, setDischargePlan] = useState({
    dischargeDestination: 'Home with Home Health Physical Therapy',
    targetDate: '2026-11-15',
    caregiverSupport: 'Spouse trained & available for transfer assistance at home',
    equipmentNeeded: 'Rolling Walker, Raised Toilet Seat, Shower Chair'
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

  // Schedule Filter & Session Detail Popup State
  const [showScheduleFilter, setShowScheduleFilter] = useState(false)
  const [scheduleFilters, setScheduleFilters] = useState({
    therapist: 'All',
    type: 'All',
    status: 'All',
    search: ''
  })
  const [showSessionDetail, setShowSessionDetail] = useState(false)
  const [selectedSession, setSelectedSession] = useState(null)

  const uniqueTherapists = ['All', ...Array.from(new Set(adminSchedule.map(s => s.therapist)))]
  const uniqueTypes = ['All', ...Array.from(new Set(adminSchedule.map(s => s.type)))]

  const filteredSchedule = adminSchedule.filter(item => {
    const matchTherapist = scheduleFilters.therapist === 'All' || item.therapist === scheduleFilters.therapist
    const matchType = scheduleFilters.type === 'All' || item.type === scheduleFilters.type
    const matchStatus = scheduleFilters.status === 'All' || item.status === scheduleFilters.status
    const matchSearch = scheduleFilters.search === '' ||
      item.patient.toLowerCase().includes(scheduleFilters.search.toLowerCase()) ||
      item.title.toLowerCase().includes(scheduleFilters.search.toLowerCase())
    return matchTherapist && matchType && matchStatus && matchSearch
  })

  const activeFilterCount = [
    scheduleFilters.therapist !== 'All',
    scheduleFilters.type !== 'All',
    scheduleFilters.status !== 'All',
    scheduleFilters.search !== ''
  ].filter(Boolean).length

  // Patient Portal Interactive State
  const [completedExerciseIds, setCompletedExerciseIds] = useState([1])
  const [showRescheduleModal, setShowRescheduleModal] = useState(false)
  const [selectedRescheduleAppt, setSelectedRescheduleAppt] = useState(null)
  const [rescheduleSuccess, setRescheduleSuccess] = useState(false)
  const [showExerciseDetailModal, setShowExerciseDetailModal] = useState(false)
  const [selectedExerciseDetail, setSelectedExerciseDetail] = useState(null)
  const [clientDailyPain, setClientDailyPain] = useState(3)

  const toggleExerciseComplete = (id) => {
    setCompletedExerciseIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    )
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
    setAuthMode('login')
    setCurrentView('home')
  }

  const currentPatient = adminPatients.find((p) => p.id === selectedPatientId) || adminPatients[0]

  // Evaluation completion modal state
  const [showEvalModal, setShowEvalModal] = useState(false)
  const [evalDraftSaved, setEvalDraftSaved] = useState(false)

  const handleSaveDraft = () => {
    setEvalDraftSaved(true)
    setTimeout(() => setEvalDraftSaved(false), 2500)
  }

  const handlePrintAssessment = () => {
    window.print()
  }

  // --------------------------------------------------------------------------
  // RENDER: Public Landing Page
  // --------------------------------------------------------------------------
  if (currentView === 'home') {
    return (
      <Home
        onOpenPortal={() => {
          setPortalRole('client')
          setCurrentView('portal')
        }}
        onLoginClick={(role) => {
          setPortalRole(role || 'client')
          setSessionUser(null)
          setAuthMode('login')
          setCurrentView('portal')
        }}
      />
    )
  }

  // --------------------------------------------------------------------------
  // RENDER: Unauthenticated Auth Landing Page
  // --------------------------------------------------------------------------
  if (!sessionUser) {
    const isClientPortal = portalRole === 'client'

    return (
      <div className="auth-wrapper">
        <aside
          className="auth-hero-section"
          style={{
            backgroundImage: `linear-gradient(180deg, rgba(11, 19, 41, 0.75), rgba(15, 82, 186, 0.30)), url('${rehabBg1}')`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat',
            backgroundBlendMode: 'overlay'
          }}
        >
          <div className="auth-hero-brand">
            <div className="brand-logo-glow" style={{ padding: '4px' }}>
              <img src="/images/logo.png" alt="RehabConnect Logo" style={{ width: '38px', height: '38px', borderRadius: '50%', objectFit: 'cover' }} />
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

        </aside>

        <main className="auth-form-section">
          <div className="auth-form-container animate-fade-in">
            <button
              type="button"
              onClick={() => setCurrentView('home')}
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                background: 'transparent',
                border: 'none',
                color: '#003c90',
                fontSize: '0.85rem',
                fontWeight: 600,
                cursor: 'pointer',
                marginBottom: '16px',
                padding: '0'
              }}
            >
              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>arrow_back</span>
              Back to Home
            </button>
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
                        <CustomSelect
                          name="condition"
                          value={clientForm.condition}
                          onChange={handleClientChange}
                          options={[
                            { value: 'Post-Op ACL Reconstruction', label: 'Post-Op ACL Reconstruction' },
                            { value: 'Stroke Recovery (Hemiparesis)', label: 'Stroke Recovery (Hemiparesis)' },
                            { value: 'Post-Op Total Hip Replacement', label: 'Post-Op Total Hip Replacement' },
                            { value: 'Spinal Cord Injury Rehabilitation', label: 'Spinal Cord Injury Rehabilitation' },
                            { value: "Parkinson's Motor Function Training", label: "Parkinson's Motor Function Training" },
                          ]}
                        />
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
                        <CustomSelect
                          name="specialization"
                          value={adminForm.specialization}
                          onChange={handleAdminChange}
                          options={[
                            { value: 'Physical Therapy', label: 'Physical Therapy (PT)' },
                            { value: 'Occupational Therapy', label: 'Occupational Therapy (OT)' },
                            { value: 'Speech Language Pathology', label: 'Speech Language Pathology (SLP)' },
                            { value: 'Neurological Rehabilitation', label: 'Neurological Rehabilitation' },
                            { value: 'Clinical Administrator', label: 'Clinical Administrator / Director' },
                          ]}
                        />
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

              {!isClientPortal && (
                <div style={{ marginTop: '16px', paddingTop: '12px', borderTop: '1.5px dashed #e2e8f0' }}>
                  <button
                    type="button"
                    style={{ background: 'none', border: 'none', color: '#0f52ba', fontSize: '0.8rem', cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                    onClick={() => navigateToRole('client')}
                  >
                    <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>arrow_back</span>
                    Return to Patient Portal Link (`/`)
                  </button>
                </div>
              )}
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

  // Data Export Handlers
  const handleDownloadPatientData = () => {
    const data = {
      user: sessionUser,
      dailyPainLog: clientDailyPain,
      completedExercises: completedExerciseIds,
      appointments: clientAppointments,
      sessionHistory: clientSessionHistory,
      exportTimestamp: new Date().toISOString()
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `clinical_recovery_data_${sessionUser.name.replace(/\s+/g, '_')}.json`
    a.click()
    URL.revokeObjectURL(url)
    triggerToast('Health records exported as JSON file!')
  }

  const handleExportHipaaLogs = () => {
    const csvContent = "Timestamp,User,Action,Resource,Status,SecurityLevel\n" +
      `${new Date().toISOString()},${sessionUser.email},READ_PATIENT_RECORD,PT-88234,SUCCESS,AES-256-ENCRYPTED\n` +
      `${new Date().toISOString()},${sessionUser.email},FIM_ASSESSMENT_UPDATE,PT-88236,SUCCESS,AES-256-ENCRYPTED\n` +
      `${new Date().toISOString()},${sessionUser.email},EHR_FHIR_SYNC,EPIC_EMR,SUCCESS,AES-256-ENCRYPTED\n`
    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `hipaa_clinical_audit_log_${Date.now()}.csv`
    a.click()
    URL.revokeObjectURL(url)
    triggerToast('Encrypted HIPAA audit logs exported as CSV!')
  }

  return (
    <div className={`portal-layout ${accessibilitySettings.largeText ? 'large-text-app' : ''} ${accessibilitySettings.highContrast ? 'high-contrast-app' : ''} ${accessibilitySettings.darkMode ? 'dark-mode-app' : ''}`}>
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div style={{
          position: 'fixed', top: '20px', right: '20px', zIndex: 999999,
          background: toastMessage.type === 'error' ? '#fef2f2' : '#f0fdf4',
          color: toastMessage.type === 'error' ? '#dc2626' : '#15803d',
          border: `1.5px solid ${toastMessage.type === 'error' ? '#fecaca' : '#bbf7d0'}`,
          borderRadius: '50px', padding: '12px 24px', boxShadow: '0 10px 30px rgba(0,0,0,0.15)',
          display: 'flex', alignItems: 'center', gap: '10px', fontWeight: 800, fontSize: '0.88rem',
          animation: 'fadeSlideIn 0.25s ease'
        }}>
          <span className="material-symbols-outlined">{toastMessage.type === 'error' ? 'error' : 'check_circle'}</span>
          <span>{toastMessage.text}</span>
        </div>
      )}

      {/* Change Password Modal */}
      {showPasswordModal && createPortal(
        <div className="eval-modal-overlay" onClick={() => setShowPasswordModal(false)}>
          <div className="eval-modal-card" onClick={e => e.stopPropagation()} style={{ maxWidth: '440px' }}>
            <div className="eval-modal-icon-ring" style={{ background: '#f5f3ff', color: '#7c3aed' }}>
              <span className="material-symbols-outlined">lock</span>
            </div>
            <h2 className="eval-modal-title">Change Password</h2>
            <p className="eval-modal-patient" style={{ marginBottom: '20px' }}>Update your clinical portal security credentials</p>

            <form onSubmit={(e) => {
              e.preventDefault()
              if (passwordForm.newPass !== passwordForm.confirmPass) {
                triggerToast('New passwords do not match!', 'error')
                return
              }
              if (passwordForm.newPass.length < 6) {
                triggerToast('Password must be at least 6 characters.', 'error')
                return
              }
              setShowPasswordModal(false)
              setPasswordForm({ current: '', newPass: '', confirmPass: '' })
              triggerToast('Password updated successfully!')
            }}>
              <div className="form-group" style={{ marginBottom: '14px', textAlign: 'left' }}>
                <label style={{ fontSize: '0.78rem', fontWeight: 700 }}>Current Password</label>
                <input type="password" required className="modern-input" value={passwordForm.current} onChange={e => setPasswordForm(p => ({ ...p, current: e.target.value }))} placeholder="••••••••" />
              </div>
              <div className="form-group" style={{ marginBottom: '14px', textAlign: 'left' }}>
                <label style={{ fontSize: '0.78rem', fontWeight: 700 }}>New Password</label>
                <input type="password" required className="modern-input" value={passwordForm.newPass} onChange={e => setPasswordForm(p => ({ ...p, newPass: e.target.value }))} placeholder="At least 6 characters" />
              </div>
              <div className="form-group" style={{ marginBottom: '20px', textAlign: 'left' }}>
                <label style={{ fontSize: '0.78rem', fontWeight: 700 }}>Confirm New Password</label>
                <input type="password" required className="modern-input" value={passwordForm.confirmPass} onChange={e => setPasswordForm(p => ({ ...p, confirmPass: e.target.value }))} placeholder="Re-enter new password" />
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="button" className="btn-signout" style={{ flex: 1 }} onClick={() => setShowPasswordModal(false)}>Cancel</button>
                <button type="submit" className="modern-submit-btn" style={{ flex: 2, marginTop: 0 }}>Update Password</button>
              </div>
            </form>
          </div>
        </div>,
        document.body
      )}

      {/* 2FA Verification Modal */}
      {show2faModal && createPortal(
        <div className="eval-modal-overlay" onClick={() => setShow2faModal(false)}>
          <div className="eval-modal-card" onClick={e => e.stopPropagation()} style={{ maxWidth: '440px' }}>
            <div className="eval-modal-icon-ring" style={{ background: '#e0f2fe', color: '#0284c7' }}>
              <span className="material-symbols-outlined">security</span>
            </div>
            <h2 className="eval-modal-title">{twoFaActive ? 'Manage Two-Factor Auth' : 'Enable 2-Factor Authentication'}</h2>
            <p className="eval-modal-patient" style={{ marginBottom: '16px' }}>Secure your rehabilitation account with TOTP 2FA</p>

            {twoFaActive ? (
              <div>
                <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '12px', padding: '16px', marginBottom: '20px', textAlign: 'center' }}>
                  <span className="material-symbols-outlined" style={{ fontSize: '32px', color: '#16a34a', display: 'block', marginBottom: '6px' }}>verified_user</span>
                  <strong style={{ color: '#166534', fontSize: '0.95rem' }}>Two-Factor Authentication is Active</strong>
                  <p style={{ fontSize: '0.78rem', color: '#15803d', marginTop: '4px', margin: 0 }}>Your account is protected with authenticator code verification.</p>
                </div>
                <button className="btn-signout" style={{ width: '100%', color: '#dc2626', borderColor: '#fecaca', background: '#fef2f2' }} onClick={() => { setTwoFaActive(false); setShow2faModal(false); triggerToast('Two-Factor Authentication disabled.') }}>
                  Disable 2FA Security
                </button>
              </div>
            ) : (
              <div>
                <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '14px', padding: '16px', textAlign: 'center', marginBottom: '16px' }}>
                  <div style={{ width: '120px', height: '120px', background: '#fff', border: '2px solid #0f172a', margin: '0 auto 12px auto', borderRadius: '12px', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '64px', color: '#0f172a' }}>qr_code_2</span>
                  </div>
                  <p style={{ fontSize: '0.78rem', color: '#64748b', margin: 0 }}>Scan QR code using Google Authenticator or Duo, then enter the 6-digit code below.</p>
                </div>
                <div className="form-group" style={{ marginBottom: '20px', textAlign: 'left' }}>
                  <label style={{ fontSize: '0.78rem', fontWeight: 700 }}>6-Digit Verification Code</label>
                  <input type="text" className="modern-input" value={twoFaCode} onChange={e => setTwoFaCode(e.target.value)} placeholder="e.g. 123456" maxLength={6} style={{ textAlign: 'center', letterSpacing: '0.2em', fontSize: '1.1rem', fontWeight: 800 }} />
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                  <button type="button" className="btn-signout" style={{ flex: 1 }} onClick={() => setShow2faModal(false)}>Cancel</button>
                  <button type="button" className="modern-submit-btn" style={{ flex: 2, marginTop: 0 }} onClick={() => {
                    if (twoFaCode.length < 6) {
                      triggerToast('Please enter a 6-digit verification code.', 'error')
                      return
                    }
                    setTwoFaActive(true)
                    setShow2faModal(false)
                    setTwoFaCode('')
                    triggerToast('Two-Factor Authentication activated successfully!')
                  }}>
                    Verify & Activate 2FA
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>,
        document.body
      )}

      {/* Mobile Drawer Backdrop */}
      {mobileMenuOpen && (
        <div className="mobile-sidebar-backdrop" onClick={() => setMobileMenuOpen(false)} />
      )}

      {/* Shared Dark Sidebar Navigation */}
      <aside className={`portal-sidebar ${mobileMenuOpen ? 'mobile-open' : ''}`}>
        <div
          className="sidebar-header"
          style={{ cursor: 'pointer' }}
          onClick={() => setCurrentView('home')}
          title="Return to RehabConnect Home"
        >
          <div className="sidebar-brand-icon" style={{ background: 'transparent' }}>
            <img src="/images/logo.png" alt="RehabConnect Logo" style={{ width: '36px', height: '36px', borderRadius: '50%', objectFit: 'cover' }} />
          </div>
          <div className="sidebar-brand-text">
            <h2>RehabConnect</h2>
            <p>{isClient ? 'Patient Portal' : 'Clinical Portal'}</p>
          </div>
          <button
            className="mobile-close-sidebar-btn"
            onClick={(e) => { e.stopPropagation(); setMobileMenuOpen(false); }}
          >
            <span className="material-symbols-outlined">close</span>
          </button>
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
                onClick={() => { setActiveTab('dashboard'); setMobileMenuOpen(false) }}
              >
                <span className="material-symbols-outlined">clinical_notes</span>
                My Clinical Recovery
              </button>
              <button
                className={`nav-link-item ${activeTab === 'goals' ? 'active' : ''}`}
                onClick={() => { setActiveTab('goals'); setMobileMenuOpen(false) }}
              >
                <span className="material-symbols-outlined">flag</span>
                Rehab Goals & FIM
              </button>
              <button
                className={`nav-link-item ${activeTab === 'appointments' ? 'active' : ''}`}
                onClick={() => { setActiveTab('appointments'); setMobileMenuOpen(false) }}
              >
                <span className="material-symbols-outlined">calendar_today</span>
                Clinical Sessions
              </button>
              <button
                className={`nav-link-item ${activeTab === 'exercises' ? 'active' : ''}`}
                onClick={() => { setActiveTab('exercises'); setMobileMenuOpen(false) }}
              >
                <span className="material-symbols-outlined">medical_services</span>
                Prescribed Protocols
              </button>
              <div style={{ borderTop: '1px solid #e2e8f0', margin: '10px 0' }} />
              <button
                className={`nav-link-item ${activeTab === 'settings' ? 'active' : ''}`}
                onClick={() => { setActiveTab('settings'); setMobileMenuOpen(false) }}
              >
                <span className="material-symbols-outlined">settings</span>
                Settings
              </button>
            </>
          ) : (
            <>
              <button
                className={`nav-link-item ${activeTab === 'add-patient' ? 'active' : ''}`}
                onClick={() => { setActiveTab('add-patient'); setMobileMenuOpen(false) }}
              >
                <span className="material-symbols-outlined">person_add</span>
                New Admission
              </button>
              <button
                className={`nav-link-item ${activeTab === 'dashboard' ? 'active' : ''}`}
                onClick={() => { setActiveTab('dashboard'); setMobileMenuOpen(false) }}
              >
                <span className="material-symbols-outlined">dashboard</span>
                Facility Overview
              </button>
              <button
                className={`nav-link-item ${activeTab === 'patients' ? 'active' : ''}`}
                onClick={() => { setActiveTab('patients'); setMobileMenuOpen(false) }}
              >
                <span className="material-symbols-outlined">groups</span>
                Patient Directory
              </button>
              <button
                className={`nav-link-item ${activeTab === 'assessment' ? 'active' : ''}`}
                onClick={() => { setActiveTab('assessment'); setMobileMenuOpen(false) }}
              >
                <span className="material-symbols-outlined">assessment</span>
                FIM & Assessments
              </button>
              <button
                className={`nav-link-item ${activeTab === 'schedule' ? 'active' : ''}`}
                onClick={() => { setActiveTab('schedule'); setMobileMenuOpen(false) }}
              >
                <span className="material-symbols-outlined">calendar_today</span>
                Facility Schedule
              </button>
              <div style={{ borderTop: '1px solid #e2e8f0', margin: '10px 0' }} />
              <button
                className={`nav-link-item ${activeTab === 'settings' ? 'active' : ''}`}
                onClick={() => { setActiveTab('settings'); setMobileMenuOpen(false) }}
              >
                <span className="material-symbols-outlined">settings</span>
                Settings
              </button>
            </>
          )}
        </nav>

        {isClient && (
          <div className="sidebar-cta">
            <button className="btn-sidebar-cta" onClick={() => { setMobileMenuOpen(false); alert('Messaging Care Team...') }}>
              <span className="material-symbols-outlined">chat</span>
              Contact Care Team
            </button>
          </div>
        )}
      </aside>

      {/* Main Panel */}
      <main className="portal-main">
        {/* Topbar Header */}
        <header className="portal-topbar">
          <div className="topbar-title-group" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              className="mobile-hamburger-btn"
              onClick={() => setMobileMenuOpen(prev => !prev)}
              aria-label="Toggle Navigation Menu"
            >
              <span className="material-symbols-outlined">menu</span>
            </button>
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
              {/* ── Patient Modal: Reschedule Appointment ── */}
              {showRescheduleModal && selectedRescheduleAppt && createPortal(
                <div
                  style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    width: '100vw', height: '100vh', zIndex: 99999,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: 'rgba(15,23,42,0.65)', backdropFilter: 'blur(8px)',
                    padding: '16px', boxSizing: 'border-box'
                  }}
                  onClick={() => setShowRescheduleModal(false)}
                >
                  <div
                    style={{
                      background: '#ffffff', borderRadius: '24px', padding: '32px',
                      width: '100%', maxWidth: '480px', maxHeight: '85vh', overflowY: 'auto',
                      boxShadow: '0 24px 64px rgba(15,52,186,0.25)', animation: 'fadeSlideIn 0.25s ease'
                    }}
                    onClick={e => e.stopPropagation()}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                      <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>Request Session Reschedule</h3>
                      <button
                        onClick={() => setShowRescheduleModal(false)}
                        style={{ background: '#f1f5f9', border: 'none', borderRadius: '50%', width: '36px', height: '36px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: '18px', color: '#64748b' }}>close</span>
                      </button>
                    </div>

                    {rescheduleSuccess ? (
                      <div style={{ textAlign: 'center', padding: '24px 12px' }}>
                        <span className="material-symbols-outlined" style={{ fontSize: '54px', color: '#16a34a', marginBottom: '12px' }}>check_circle</span>
                        <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>Reschedule Request Sent!</h4>
                        <p style={{ fontSize: '0.88rem', color: '#64748b', marginTop: '6px', lineHeight: 1.5 }}>
                          Your therapist <strong>{selectedRescheduleAppt.provider}</strong> has been notified. We will confirm your new session time shortly via app notification.
                        </p>
                        <button
                          onClick={() => { setShowRescheduleModal(false); setRescheduleSuccess(false) }}
                          style={{ marginTop: '20px', padding: '10px 24px', borderRadius: '50px', border: 'none', background: 'linear-gradient(135deg,#0f52ba,#2563eb)', color: '#fff', fontWeight: 800, cursor: 'pointer' }}
                        >
                          Close Window
                        </button>
                      </div>
                    ) : (
                      <form onSubmit={(e) => { e.preventDefault(); setRescheduleSuccess(true) }}>
                        <div style={{ background: '#f8fafc', borderRadius: '12px', padding: '14px 16px', marginBottom: '20px', border: '1px solid #e2e8f0' }}>
                          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0f52ba', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Current Session</span>
                          <h4 style={{ fontSize: '0.98rem', fontWeight: 800, color: '#0f172a', marginTop: '4px' }}>{selectedRescheduleAppt.title}</h4>
                          <p style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '2px' }}>{selectedRescheduleAppt.time} • {selectedRescheduleAppt.provider}</p>
                        </div>

                        <div className="form-group" style={{ marginBottom: '16px' }}>
                          <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '6px' }}>Preferred New Date</label>
                          <input type="date" className="modern-input" required defaultValue="2026-10-20" />
                        </div>

                        <div className="form-group" style={{ marginBottom: '16px' }}>
                          <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '6px' }}>Preferred Time Slot</label>
                          <CustomSelect
                            name="rescheduleTime"
                            value="morning"
                            onChange={() => { }}
                            options={[
                              { value: 'morning', label: 'Morning (09:00 AM - 12:00 PM)' },
                              { value: 'afternoon', label: 'Afternoon (01:00 PM - 04:00 PM)' },
                              { value: 'evening', label: 'Late Afternoon (04:00 PM - 06:00 PM)' }
                            ]}
                          />
                        </div>

                        <div className="form-group" style={{ marginBottom: '24px' }}>
                          <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '6px' }}>Reason for Reschedule (Optional)</label>
                          <textarea className="modern-input" rows="3" placeholder="e.g. Schedule conflict, feeling fatigued..." style={{ resize: 'vertical' }} />
                        </div>

                        <div style={{ display: 'flex', gap: '12px' }}>
                          <button type="button" onClick={() => setShowRescheduleModal(false)} className="btn-signout" style={{ flex: 1 }}>
                            Cancel
                          </button>
                          <button type="submit" className="modern-submit-btn" style={{ flex: 2, marginTop: 0 }}>
                            Submit Request
                          </button>
                        </div>
                      </form>
                    )}
                  </div>
                </div>,
                document.body
              )}

              {/* ── Patient Modal: Exercise Details & Log ── */}
              {showExerciseDetailModal && selectedExerciseDetail && createPortal(
                <div
                  style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    width: '100vw', height: '100vh', zIndex: 99999,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: 'rgba(15,23,42,0.65)', backdropFilter: 'blur(8px)',
                    padding: '16px', boxSizing: 'border-box'
                  }}
                  onClick={() => setShowExerciseDetailModal(false)}
                >
                  <div
                    style={{
                      background: '#ffffff', borderRadius: '24px', padding: '32px',
                      width: '100%', maxWidth: '520px', maxHeight: '85vh', overflowY: 'auto',
                      boxShadow: '0 24px 64px rgba(15,52,186,0.25)', animation: 'fadeSlideIn 0.25s ease'
                    }}
                    onClick={e => e.stopPropagation()}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                      <div>
                        <span style={{ background: '#e0f2fe', color: '#0369a1', padding: '3px 10px', borderRadius: '50px', fontSize: '0.72rem', fontWeight: 800 }}>
                          {selectedExerciseDetail.focus}
                        </span>
                        <h3 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0f172a', marginTop: '6px' }}>{selectedExerciseDetail.name}</h3>
                      </div>
                      <button
                        onClick={() => setShowExerciseDetailModal(false)}
                        style={{ background: '#f1f5f9', border: 'none', borderRadius: '50%', width: '36px', height: '36px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: '18px', color: '#64748b' }}>close</span>
                      </button>
                    </div>

                    {/* Step guidance */}
                    {/* Step guidance */}
                    <div style={{ background: '#f8fafc', borderRadius: '16px', padding: '20px', border: '1px solid #e2e8f0', marginBottom: '20px' }}>
                      <h4 style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0f52ba', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '10px' }}>
                        Prescribed Prescription
                      </h4>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', textAlign: 'center', marginBottom: '16px' }}>
                        <div style={{ background: '#fff', borderRadius: '10px', padding: '10px', border: '1px solid #e2e8f0' }}>
                          <span style={{ fontSize: '0.7rem', color: '#64748b', display: 'block', fontWeight: 700 }}>SETS</span>
                          <strong style={{ fontSize: '1.1rem', color: '#0f172a' }}>{selectedExerciseDetail.sets}</strong>
                        </div>
                        <div style={{ background: '#fff', borderRadius: '10px', padding: '10px', border: '1px solid #e2e8f0' }}>
                          <span style={{ fontSize: '0.7rem', color: '#64748b', display: 'block', fontWeight: 700 }}>REPS</span>
                          <strong style={{ fontSize: '1.1rem', color: '#0f172a' }}>{selectedExerciseDetail.reps}</strong>
                        </div>
                        <div style={{ background: '#fff', borderRadius: '10px', padding: '10px', border: '1px solid #e2e8f0' }}>
                          <span style={{ fontSize: '0.7rem', color: '#64748b', display: 'block', fontWeight: 700 }}>EST. TIME</span>
                          <strong style={{ fontSize: '1.1rem', color: '#0f172a' }}>{selectedExerciseDetail.duration}</strong>
                        </div>
                      </div>

                      <h4 style={{ fontSize: '0.85rem', fontWeight: 800, color: '#374151', marginBottom: '8px' }}>Execution Instructions:</h4>
                      <ol style={{ fontSize: '0.85rem', color: '#475569', paddingLeft: '18px', lineHeight: 1.6, margin: 0 }}>
                        <li>Lie flat on your back on a firm surface with legs straight.</li>
                        <li>Slowly slide your heel toward your buttocks, bending your knee as far as comfortable.</li>
                        <li>Hold at the peak bend for 3 seconds, keeping your foot flat.</li>
                        <li>Slowly return to starting position. Repeat for prescribed repetitions.</li>
                      </ol>
                    </div>

                    <div style={{ display: 'flex', gap: '12px' }}>
                      <button
                        onClick={() => {
                          toggleExerciseComplete(selectedExerciseDetail.id)
                          setShowExerciseDetailModal(false)
                        }}
                        style={{
                          flex: 1, padding: '12px 0', borderRadius: '50px', border: 'none',
                          background: completedExerciseIds.includes(selectedExerciseDetail.id) ? '#dcfce7' : 'linear-gradient(135deg,#0f52ba,#2563eb)',
                          color: completedExerciseIds.includes(selectedExerciseDetail.id) ? '#16a34a' : '#fff',
                          fontWeight: 800, fontSize: '0.9rem', cursor: 'pointer'
                        }}
                      >
                        {completedExerciseIds.includes(selectedExerciseDetail.id) ? '✓ Completed Today' : 'Mark Completed Today'}
                      </button>
                    </div>
                  </div>
                </div>,
                document.body
              )}

              {/* ── PATIENT TAB 1: MY CLINICAL RECOVERY ── */}
              {activeTab === 'dashboard' && (
                <>
                  {/* Hero Banner — Clinical Recovery Portal */}
                  <section className="portal-hero-banner" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)', borderRadius: '24px', padding: '28px 32px' }}>
                    <div className="hero-banner-content">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px', flexWrap: 'wrap' }}>
                        <span style={{ background: 'rgba(255,255,255,0.18)', padding: '4px 14px', borderRadius: '50px', fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.07em', color: '#fff' }}>
                          Clinical Rehab Day 24
                        </span>
                        <span style={{ background: 'rgba(34,197,94,0.25)', color: '#4ade80', padding: '4px 14px', borderRadius: '50px', fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                          Phase 2: Active ROM & Weight Bearing
                        </span>
                      </div>
                      <h2 style={{ fontSize: '1.7rem', fontWeight: 900, color: '#ffffff', margin: 0 }}>Welcome back, {sessionUser.name.split(' ')[0]} 👋</h2>
                      <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.9rem', marginTop: '6px', marginBottom: 0 }}>
                        Post-Op ACL Reconstruction (Right Knee) &nbsp;·&nbsp; Lead Physiatrist: <strong>Dr. Lena Ortiz, MD</strong> &nbsp;·&nbsp; PT Specialist: <strong>Dr. A. Smith, PT</strong>
                      </p>
                    </div>
                    <div className="hero-stats-pills">
                      <div className="stat-pill-glass">
                        <strong>110°</strong>
                        <span>Active ROM (Flexion)</span>
                      </div>
                      <div className="stat-pill-glass">
                        <strong>104<span style={{ fontSize: '0.8rem', fontWeight: 600 }}>/126</span></strong>
                        <span>Total FIM Score</span>
                      </div>
                      <div className="stat-pill-glass">
                        <strong>{clientDailyPain}/10</strong>
                        <span>VAS Pain Index</span>
                      </div>
                      <div className="stat-pill-glass">
                        <strong>🔥 6</strong>
                        <span>Protocol Streak</span>
                      </div>
                    </div>
                  </section>

                  {/* Quick Action Cards — Clinical Shortcuts */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', padding: '0 0 4px 0' }}>
                    {[
                      { icon: 'medical_services', label: 'Prescribed Protocols', sublabel: `${completedExerciseIds.length}/${clientExercises.length} completed today`, tab: 'exercises', color: '#0f52ba', bg: '#eff6ff' },
                      { icon: 'calendar_today', label: 'Clinical Sessions', sublabel: `${clientAppointments.length} upcoming appointments`, tab: 'appointments', color: '#7c3aed', bg: '#f5f3ff' },
                      { icon: 'flag', label: 'Rehab Goals & FIM', sublabel: '78% milestones achieved', tab: 'goals', color: '#059669', bg: '#ecfdf5' },
                      { icon: 'monitor_heart', label: 'Pain & ROM Telemetry', sublabel: `Logged: ${clientDailyPain}/10 VAS today`, tab: null, color: '#dc2626', bg: '#fef2f2' },
                    ].map(card => (
                      <div
                        key={card.label}
                        onClick={() => card.tab && setActiveTab(card.tab)}
                        style={{ background: card.bg, borderRadius: '16px', padding: '18px', border: `1.5px solid ${card.color}22`, cursor: card.tab ? 'pointer' : 'default', transition: 'transform 0.15s, box-shadow 0.15s', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
                        onMouseEnter={e => { if (card.tab) { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.1)' } }}
                        onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)' }}
                      >
                        <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: card.color, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '10px' }}>
                          <span className="material-symbols-outlined" style={{ fontSize: '20px', color: '#fff' }}>{card.icon}</span>
                        </div>
                        <div style={{ fontSize: '0.78rem', fontWeight: 800, color: card.color, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{card.label}</div>
                        <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0f172a', marginTop: '2px' }}>{card.sublabel}</div>
                        {card.tab && <div style={{ fontSize: '0.72rem', color: card.color, fontWeight: 700, marginTop: '8px' }}>Open section →</div>}
                      </div>
                    ))}
                  </div>

                  {/* Bento Grid */}
                  <div className="bento-grid">
                    {/* Enhanced Progress Chart */}
                    <div className="bento-card col-span-7">
                      <div className="card-header">
                        <div className="card-header-left">
                          <h3>My Recovery Progress</h3>
                          <p>Weekly Mobility Score — 4-Week Trend</p>
                        </div>
                        <span className="trend-tag positive">
                          <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>trending_up</span> +15%
                        </span>
                      </div>

                      {/* Dual metric legend */}
                      <div style={{ display: 'flex', gap: '16px', marginBottom: '12px', paddingLeft: '4px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: 'linear-gradient(135deg,#0f52ba,#2563eb)' }} />
                          <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>Mobility Score %</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: 'linear-gradient(135deg,#16a34a,#22c55e)' }} />
                          <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>Exercise Completion %</span>
                        </div>
                      </div>

                      <div className="chart-container-box">
                        <div className="bar-chart-flex">
                          {[
                            { label: 'Week 1', mob: 40, ex: 50 },
                            { label: 'Week 2', mob: 55, ex: 62 },
                            { label: 'Week 3', mob: 70, ex: 75 },
                            { label: 'Week 4', mob: 82, ex: 88 },
                          ].map(w => (
                            <div key={w.label} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flex: 1, gap: '4px' }}>
                              <div style={{ display: 'flex', gap: '4px', alignItems: 'flex-end', height: '160px', width: '100%', justifyContent: 'center' }}>
                                <div style={{ width: '28%', height: `${w.mob}%`, background: 'linear-gradient(180deg,#2563eb,#0f52ba)', borderRadius: '6px 6px 0 0', position: 'relative', transition: 'height 0.5s ease' }}>
                                  <span style={{ position: 'absolute', top: '-20px', left: '50%', transform: 'translateX(-50%)', fontSize: '0.62rem', color: '#1d4ed8', fontWeight: 800, whiteSpace: 'nowrap' }}>{w.mob}%</span>
                                </div>
                                <div style={{ width: '28%', height: `${w.ex}%`, background: 'linear-gradient(180deg,#22c55e,#16a34a)', borderRadius: '6px 6px 0 0', position: 'relative', transition: 'height 0.5s ease' }}>
                                  <span style={{ position: 'absolute', top: '-20px', left: '50%', transform: 'translateX(-50%)', fontSize: '0.62rem', color: '#16a34a', fontWeight: 800, whiteSpace: 'nowrap' }}>{w.ex}%</span>
                                </div>
                              </div>
                              <span style={{ fontSize: '0.72rem', color: '#94a3b8', fontWeight: 600 }}>{w.label}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Pain Tracker + Stats Side Panel */}
                    <div className="bento-card col-span-5" style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      {/* Pain Tracker */}
                      <div>
                        <div className="card-header" style={{ marginBottom: '14px' }}>
                          <div className="card-header-left">
                            <h3>Today's Pain Level</h3>
                            <p>Tap a number to log your current pain</p>
                          </div>
                          <span style={{ fontSize: '1.4rem', fontWeight: 900, color: clientDailyPain <= 3 ? '#16a34a' : clientDailyPain <= 6 ? '#f59e0b' : '#dc2626' }}>
                            {clientDailyPain}/10
                          </span>
                        </div>
                        <div style={{ display: 'flex', gap: '6px', justifyContent: 'space-between' }}>
                          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                            <button
                              key={n}
                              onClick={() => setClientDailyPain(n)}
                              style={{
                                width: '32px', height: '32px', borderRadius: '8px', border: 'none',
                                background: n === clientDailyPain
                                  ? (n <= 3 ? '#16a34a' : n <= 6 ? '#f59e0b' : '#dc2626')
                                  : '#f1f5f9',
                                color: n === clientDailyPain ? '#fff' : '#64748b',
                                fontSize: '0.78rem', fontWeight: 800, cursor: 'pointer',
                                transition: 'all 0.15s'
                              }}
                            >{n}</button>
                          ))}
                        </div>
                        <div style={{ marginTop: '8px', fontSize: '0.75rem', color: '#64748b', display: 'flex', justifyContent: 'space-between' }}>
                          <span style={{ color: '#16a34a', fontWeight: 700 }}>No Pain</span>
                          <span style={{ color: '#f59e0b', fontWeight: 700 }}>Moderate</span>
                          <span style={{ color: '#dc2626', fontWeight: 700 }}>Severe</span>
                        </div>
                      </div>

                      {/* Stats row */}
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                        {[
                          { label: 'Days in Program', value: '24', icon: 'calendar_month', color: '#0f52ba', bg: '#eff6ff' },
                          { label: 'Sessions Done', value: `${clientSessionHistory.length}`, icon: 'check_circle', color: '#16a34a', bg: '#f0fdf4' },
                          { label: 'Goals Achieved', value: '78%', icon: 'flag', color: '#7c3aed', bg: '#f5f3ff' },
                          { label: 'Day Streak 🔥', value: '6', icon: 'local_fire_department', color: '#ea580c', bg: '#fff7ed' },
                        ].map(s => (
                          <div key={s.label} style={{ background: s.bg, borderRadius: '12px', padding: '12px', border: `1px solid ${s.color}22` }}>
                            <span className="material-symbols-outlined" style={{ fontSize: '18px', color: s.color }}>{s.icon}</span>
                            <div style={{ fontSize: '1.2rem', fontWeight: 900, color: s.color, lineHeight: 1, marginTop: '4px' }}>{s.value}</div>
                            <div style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 600, marginTop: '2px' }}>{s.label}</div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Prescribed Rehabilitation Protocols (Interactive Clinical Tracker) */}
                    <div className="bento-card col-span-5">
                      <div className="card-header">
                        <div className="card-header-left">
                          <h3>Prescribed Therapy Protocols</h3>
                          <p>{completedExerciseIds.length} of {clientExercises.length} daily protocols completed</p>
                        </div>
                        <button
                          onClick={() => setActiveTab('exercises')}
                          style={{ background: 'none', border: 'none', color: '#0f52ba', fontWeight: 800, fontSize: '0.8rem', cursor: 'pointer' }}
                        >
                          View Protocol Guide →
                        </button>
                      </div>

                      {/* Progress ring visual */}
                      <div style={{ display: 'flex', alignItems: 'center', gap: '14px', background: '#f8fafc', borderRadius: '14px', padding: '14px', marginBottom: '14px', border: '1px solid #e2e8f0' }}>
                        <svg width="52" height="52" viewBox="0 0 52 52">
                          <circle cx="26" cy="26" r="22" fill="none" stroke="#e2e8f0" strokeWidth="5" />
                          <circle cx="26" cy="26" r="22" fill="none" stroke="#0f52ba" strokeWidth="5"
                            strokeDasharray={`${2 * Math.PI * 22}`}
                            strokeDashoffset={`${2 * Math.PI * 22 * (1 - completedExerciseIds.length / clientExercises.length)}`}
                            strokeLinecap="round"
                            transform="rotate(-90 26 26)"
                            style={{ transition: 'stroke-dashoffset 0.4s ease' }}
                          />
                          <text x="26" y="30" textAnchor="middle" fontSize="11" fontWeight="800" fill="#0f172a">
                            {Math.round((completedExerciseIds.length / clientExercises.length) * 100)}%
                          </text>
                        </svg>
                        <div>
                          <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0f172a' }}>
                            {completedExerciseIds.length === clientExercises.length ? '🎉 All Protocols Completed!' : `${clientExercises.length - completedExerciseIds.length} protocols remaining today`}
                          </div>
                          <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>6-Day Rehabilitation Compliance Streak</div>
                        </div>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        {clientExercises.map((ex) => {
                          const isDone = completedExerciseIds.includes(ex.id)
                          return (
                            <div
                              key={ex.id}
                              style={{
                                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                                background: isDone ? '#f0fdf4' : '#f8fafc', padding: '12px 14px',
                                borderRadius: '12px', border: `1px solid ${isDone ? '#bbf7d0' : '#e2e8f0'}`,
                                transition: 'all 0.15s'
                              }}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                <button
                                  onClick={() => toggleExerciseComplete(ex.id)}
                                  style={{
                                    width: '26px', height: '26px', borderRadius: '50%',
                                    border: isDone ? 'none' : '2px solid #cbd5e1',
                                    background: isDone ? '#16a34a' : '#fff',
                                    color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    cursor: 'pointer', flexShrink: 0, transition: 'all 0.15s'
                                  }}
                                >
                                  {isDone && <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>check</span>}
                                </button>
                                <div>
                                  <h4 style={{ fontSize: '0.88rem', fontWeight: 700, color: isDone ? '#166534' : '#0f172a', textDecoration: isDone ? 'line-through' : 'none', margin: 0 }}>{ex.name}</h4>
                                  <span style={{ fontSize: '0.73rem', color: '#64748b' }}>{ex.sets} sets × {ex.reps} • {ex.duration}</span>
                                </div>
                              </div>
                              <button
                                onClick={() => { setSelectedExerciseDetail(ex); setShowExerciseDetailModal(true) }}
                                style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', display: 'flex', alignItems: 'center', padding: '4px' }}
                              >
                                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>info</span>
                              </button>
                            </div>
                          )
                        })}
                      </div>
                    </div>

                    {/* Treatment Goals Preview */}
                    <div className="bento-card col-span-7">
                      <div className="card-header">
                        <div className="card-header-left">
                          <h3>Active Treatment Goals</h3>
                          <p>Milestones set by lead physiatrist Dr. Lena Ortiz</p>
                        </div>
                        <button
                          onClick={() => setActiveTab('goals')}
                          style={{ background: 'none', border: 'none', color: '#0f52ba', fontWeight: 800, fontSize: '0.8rem', cursor: 'pointer' }}
                        >
                          Full Details →
                        </button>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                        {clientGoals.map((goal) => {
                          const catColors = { Mobility: '#0f52ba', 'Range of Motion': '#7c3aed', Comfort: '#16a34a' }
                          const cc = catColors[goal.category] || '#475569'
                          return (
                            <div key={goal.id} style={{ background: '#f8fafc', borderRadius: '14px', padding: '16px', border: '1px solid #e2e8f0' }}>
                              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                  <span style={{ background: `${cc}18`, color: cc, borderRadius: '50px', padding: '2px 10px', fontSize: '0.68rem', fontWeight: 800 }}>{goal.category}</span>
                                  <h4 style={{ fontSize: '0.92rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>{goal.title}</h4>
                                </div>
                                <span style={{ fontSize: '0.88rem', fontWeight: 800, color: cc }}>{goal.progress}%</span>
                              </div>
                              <p style={{ fontSize: '0.78rem', color: '#64748b', margin: '0 0 10px 0', lineHeight: 1.5 }}>{goal.summary}</p>
                              <div style={{ background: '#e2e8f0', borderRadius: '50px', height: '7px', overflow: 'hidden' }}>
                                <div style={{ width: `${goal.progress}%`, height: '100%', background: `linear-gradient(90deg, ${cc}, ${cc}88)`, borderRadius: '50px', transition: 'width 0.5s ease' }} />
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>

                    {/* Next Session Countdown Card */}
                    <div className="bento-card col-span-12" style={{ background: 'linear-gradient(135deg,#0f172a,#1e3a5f)', color: '#fff', padding: '24px 28px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '18px' }}>
                          <div style={{ width: '56px', height: '56px', borderRadius: '14px', background: '#1d4ed8', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', boxShadow: '0 6px 20px rgba(29,78,216,0.5)' }}>
                            <strong style={{ fontSize: '1.3rem', fontWeight: 900, lineHeight: 1 }}>{clientAppointments[0].dateDay}</strong>
                            <span style={{ fontSize: '0.62rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{clientAppointments[0].dateMonth}</span>
                          </div>
                          <div>
                            <span style={{ background: 'rgba(255,255,255,0.15)', padding: '3px 12px', borderRadius: '50px', fontSize: '0.68rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.07em', display: 'inline-block', marginBottom: '6px' }}>
                              Next Session
                            </span>
                            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#fff', margin: 0 }}>{clientAppointments[0].title}</h3>
                            <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.82rem', marginTop: '3px' }}>
                              {clientAppointments[0].time} · {clientAppointments[0].provider} · {clientAppointments[0].location}
                            </p>
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: '10px' }}>
                          <button
                            onClick={() => setActiveTab('appointments')}
                            style={{ padding: '10px 20px', borderRadius: '50px', border: '1.5px solid rgba(255,255,255,0.3)', background: 'transparent', color: '#fff', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer' }}
                          >
                            View All Sessions
                          </button>
                          <button
                            onClick={() => alert(`Online check-in confirmed for: ${clientAppointments[0].title}`)}
                            style={{ padding: '10px 22px', borderRadius: '50px', border: 'none', background: 'linear-gradient(135deg,#1d4ed8,#0f52ba)', color: '#fff', fontSize: '0.82rem', fontWeight: 800, cursor: 'pointer', boxShadow: '0 4px 14px rgba(29,78,216,0.5)', display: 'flex', alignItems: 'center', gap: '6px' }}
                          >
                            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>check_circle</span>
                            Check In Now
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* ── PATIENT TAB 2: TREATMENT GOALS & DISCHARGE PLAN ── */}
              {activeTab === 'goals' && (
                <div className="bento-grid">
                  {/* Overall Target Card */}
                  <div className="bento-card col-span-12" style={{ background: 'linear-gradient(135deg,#0f52ba,#1d4ed8)', color: '#fff', padding: '28px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
                      <div>
                        <span style={{ background: 'rgba(255,255,255,0.2)', padding: '4px 14px', borderRadius: '50px', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                          Personalized Recovery Plan
                        </span>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 900, marginTop: '10px', color: '#fff' }}>Post-Op ACL Reconstruction Roadmap</h2>
                        <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.88rem', marginTop: '4px' }}>Lead Physiatrist: <strong>Dr. Lena Ortiz, MD</strong> | Est. Discharge Target: <strong>Nov 15, 2026</strong></p>
                      </div>
                      <div style={{ textAlign: 'right', background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(6px)', padding: '16px 24px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.2)' }}>
                        <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.8)', fontWeight: 700 }}>Overall Milestones Met</span>
                        <h3 style={{ fontSize: '2rem', fontWeight: 900, color: '#fff', margin: 0 }}>78%</h3>
                      </div>
                    </div>
                  </div>

                  {/* Active Goals List */}
                  <div className="bento-card col-span-8">
                    <div className="card-header">
                      <div className="card-header-left">
                        <h3>Active Rehabilitation Goals</h3>
                        <p>Track your physical milestones and progress towards independent mobility</p>
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                      {clientGoals.map((goal) => (
                        <div key={goal.id} style={{ background: '#f8fafc', borderRadius: '16px', padding: '20px', border: '1px solid #e2e8f0' }}>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <span style={{ background: '#e0f2fe', color: '#0369a1', borderRadius: '50px', padding: '2px 10px', fontSize: '0.72rem', fontWeight: 800 }}>{goal.category}</span>
                              <h4 style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>{goal.title}</h4>
                            </div>
                            <strong style={{ fontSize: '0.95rem', color: '#0f52ba', fontWeight: 800 }}>{goal.progress}%</strong>
                          </div>
                          <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '12px' }}>{goal.summary}</p>

                          <div className="progress-track-bg" style={{ height: '8px', marginBottom: '14px' }}>
                            <div className="progress-fill-bar" style={{ width: `${goal.progress}%`, background: goal.progress >= 80 ? 'linear-gradient(90deg,#16a34a,#22c55e)' : 'linear-gradient(90deg,#0f52ba,#00b4d8)' }} />
                          </div>

                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.78rem', color: '#64748b' }}>
                            <span>Lead Clinical Note: "Patient showing strong quadriceps activation."</span>
                            <button
                              onClick={() => alert(`Progress note requested for "${goal.title}". Your therapist will review at next session.`)}
                              style={{ background: '#fff', border: '1px solid #cbd5e1', borderRadius: '50px', padding: '4px 12px', fontSize: '0.75rem', fontWeight: 700, color: '#374151', cursor: 'pointer' }}
                            >
                              Request Goal Review
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Discharge Plan Summary Card */}
                  <div className="bento-card col-span-4">
                    <div className="card-header">
                      <div className="card-header-left">
                        <h3>Discharge Plan Readiness</h3>
                        <p>Requirements for safe home transition</p>
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {[
                        { title: 'Discharge Destination', val: 'Home with Home Health PT', status: 'Approved' },
                        { title: 'Caregiver Support', val: 'Spouse trained for assistance', status: 'Ready' },
                        { title: 'DME Equipment Needed', val: 'Rolling Walker & Shower Chair', status: 'Delivered' },
                        { title: 'Outpatient PT Referral', val: 'St. Jude Outpatient Clinic', status: 'Scheduled' }
                      ].map((item) => (
                        <div key={item.title} style={{ background: '#f8fafc', borderRadius: '12px', padding: '14px', border: '1px solid #e2e8f0' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '4px' }}>
                            <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase' }}>{item.title}</span>
                            <span style={{ background: '#dcfce7', color: '#16a34a', borderRadius: '50px', padding: '2px 8px', fontSize: '0.7rem', fontWeight: 800 }}>{item.status}</span>
                          </div>
                          <strong style={{ fontSize: '0.85rem', color: '#0f172a' }}>{item.val}</strong>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ── PATIENT TAB 3: THERAPY SESSIONS & SCHEDULE ── */}
              {activeTab === 'appointments' && (
                <div className="bento-grid">
                  {/* Page Header Banner */}
                  <div className="bento-card col-span-12" style={{ background: 'linear-gradient(135deg,#0f172a,#1e3a5f)', color: '#fff', padding: '28px 32px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
                      <div>
                        <span style={{ background: 'rgba(255,255,255,0.15)', padding: '4px 14px', borderRadius: '50px', fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                          My Care Calendar
                        </span>
                        <h2 style={{ fontSize: '1.55rem', fontWeight: 900, marginTop: '10px', color: '#fff' }}>Therapy Sessions & Schedule</h2>
                        <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.88rem', marginTop: '4px' }}>
                          Manage upcoming appointments, view session history, and communicate with your care team.
                        </p>
                      </div>
                      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                        {[
                          { label: 'Upcoming', count: clientAppointments.length, icon: 'event', bg: 'rgba(255,255,255,0.15)' },
                          { label: 'Completed', count: clientSessionHistory.length, icon: 'check_circle', bg: 'rgba(34,197,94,0.2)' },
                        ].map(stat => (
                          <div key={stat.label} style={{ background: stat.bg, backdropFilter: 'blur(8px)', borderRadius: '14px', padding: '14px 20px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.15)', minWidth: '100px' }}>
                            <span className="material-symbols-outlined" style={{ fontSize: '20px', color: 'rgba(255,255,255,0.9)', display: 'block', marginBottom: '4px' }}>{stat.icon}</span>
                            <strong style={{ fontSize: '1.4rem', fontWeight: 900, color: '#fff', display: 'block', lineHeight: 1 }}>{stat.count}</strong>
                            <span style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.75)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{stat.label}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Upcoming Sessions */}
                  <div className="bento-card col-span-12" style={{ padding: '28px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '22px' }}>
                      <div>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>Upcoming Appointments</h3>
                        <p style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '2px' }}>Your next {clientAppointments.length} scheduled therapy sessions</p>
                      </div>
                      <span style={{ background: '#eff6ff', color: '#2563eb', borderRadius: '50px', padding: '4px 14px', fontSize: '0.75rem', fontWeight: 800 }}>
                        {clientAppointments.length} Upcoming
                      </span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      {clientAppointments.map((appt, idx) => {
                        const typeColorMap = {
                          'Physical Therapy': { bg: '#eff6ff', color: '#1d4ed8', border: '#bfdbfe' },
                          'Occupational Therapy': { bg: '#f0fdf4', color: '#15803d', border: '#bbf7d0' },
                          'Consultation': { bg: '#f5f3ff', color: '#7c3aed', border: '#ddd6fe' },
                        }
                        const tc = typeColorMap[appt.type] || { bg: '#f8fafc', color: '#475569', border: '#e2e8f0' }
                        return (
                          <div
                            key={appt.id}
                            style={{
                              background: '#ffffff', borderRadius: '20px', border: `1.5px solid ${tc.border}`,
                              overflow: 'hidden', boxShadow: '0 2px 12px rgba(15,23,42,0.06)'
                            }}
                          >

                            <div style={{ padding: '20px 24px', display: 'flex', gap: '20px', alignItems: 'flex-start', flexWrap: 'wrap' }}>
                              {/* Date Badge */}
                              <div style={{
                                width: '72px', height: '72px', borderRadius: '16px', flexShrink: 0,
                                background: `linear-gradient(135deg, ${appt.avatarColor}, ${appt.avatarColor}cc)`,
                                color: '#fff', display: 'flex', flexDirection: 'column',
                                alignItems: 'center', justifyContent: 'center', boxShadow: `0 6px 20px ${appt.avatarColor}40`
                              }}>
                                <strong style={{ fontSize: '1.5rem', fontWeight: 900, lineHeight: 1 }}>{appt.dateDay}</strong>
                                <span style={{ fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', marginTop: '2px', letterSpacing: '0.05em' }}>{appt.dateMonth}</span>
                              </div>

                              {/* Info block */}
                              <div style={{ flex: 1, minWidth: '200px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '6px' }}>
                                  <span style={{ background: tc.bg, color: tc.color, borderRadius: '50px', padding: '3px 12px', fontSize: '0.7rem', fontWeight: 800, border: `1px solid ${tc.border}` }}>
                                    {appt.type}
                                  </span>
                                  {appt.telehealth && (
                                    <span style={{ background: '#fef3c7', color: '#b45309', borderRadius: '50px', padding: '3px 12px', fontSize: '0.7rem', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '4px', border: '1px solid #fde68a' }}>
                                      <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>videocam</span>
                                      Telehealth
                                    </span>
                                  )}
                                  {!appt.telehealth && (
                                    <span style={{ background: '#f0fdf4', color: '#166534', borderRadius: '50px', padding: '3px 12px', fontSize: '0.7rem', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '4px', border: '1px solid #bbf7d0' }}>
                                      <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>location_on</span>
                                      In-Person
                                    </span>
                                  )}
                                  {idx === 0 && (
                                    <span style={{ background: '#fef2f2', color: '#dc2626', borderRadius: '50px', padding: '3px 12px', fontSize: '0.7rem', fontWeight: 800, border: '1px solid #fecaca' }}>
                                      Next Up
                                    </span>
                                  )}
                                </div>
                                <h4 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', margin: '0 0 8px 0' }}>{appt.title}</h4>
                                <div style={{ display: 'flex', gap: '18px', fontSize: '0.82rem', color: '#64748b', flexWrap: 'wrap' }}>
                                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                                    <span className="material-symbols-outlined" style={{ fontSize: '15px', color: appt.avatarColor }}>schedule</span>
                                    {appt.time}
                                  </span>
                                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                                    <span className="material-symbols-outlined" style={{ fontSize: '15px', color: appt.avatarColor }}>timer</span>
                                    {appt.duration}
                                  </span>
                                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}>
                                    <span className="material-symbols-outlined" style={{ fontSize: '15px', color: appt.avatarColor }}>meeting_room</span>
                                    {appt.location}
                                  </span>
                                </div>

                                {/* Therapist row */}
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '14px', padding: '10px 14px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                                  <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: appt.avatarColor, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.7rem', fontWeight: 800, flexShrink: 0 }}>
                                    {appt.avatar}
                                  </div>
                                  <div style={{ flex: 1 }}>
                                    <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#0f172a' }}>{appt.provider}</div>
                                    <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Your {appt.type} Specialist</div>
                                  </div>
                                </div>

                                {/* Prep note */}
                                <div style={{ marginTop: '12px', padding: '10px 14px', background: `${tc.bg}`, borderRadius: '10px', border: `1px solid ${tc.border}` }}>
                                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
                                    <span className="material-symbols-outlined" style={{ fontSize: '15px', color: tc.color, marginTop: '1px', flexShrink: 0 }}>info</span>
                                    <p style={{ fontSize: '0.78rem', color: tc.color, margin: 0, fontWeight: 600, lineHeight: 1.5 }}>{appt.notes}</p>
                                  </div>
                                </div>
                              </div>

                              {/* Action buttons */}
                              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', flexShrink: 0, minWidth: '150px' }}>
                                <button
                                  onClick={() => { setSelectedRescheduleAppt(appt); setShowRescheduleModal(true) }}
                                  style={{ padding: '10px 18px', borderRadius: '50px', border: '1.5px solid #cbd5e1', background: '#fff', color: '#475569', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', whiteSpace: 'nowrap' }}
                                >
                                  <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>edit_calendar</span>
                                  Reschedule
                                </button>
                                <button
                                  onClick={() => alert(`Online check-in confirmed for: ${appt.title}`)}
                                  style={{ padding: '10px 18px', borderRadius: '50px', border: 'none', background: `linear-gradient(135deg, ${appt.avatarColor}, ${appt.avatarColor}bb)`, color: '#fff', fontSize: '0.82rem', fontWeight: 800, cursor: 'pointer', boxShadow: `0 4px 14px ${appt.avatarColor}44`, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', whiteSpace: 'nowrap' }}
                                >
                                  <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>{appt.telehealth ? 'videocam' : 'check_circle'}</span>
                                  {appt.telehealth ? 'Join Session' : 'Check In'}
                                </button>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {/* Session History */}
                  <div className="bento-card col-span-12" style={{ padding: '28px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '22px' }}>
                      <div>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>Session History</h3>
                        <p style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '2px' }}>Past completed therapy sessions and therapist notes</p>
                      </div>
                      <span style={{ background: '#f0fdf4', color: '#16a34a', borderRadius: '50px', padding: '4px 14px', fontSize: '0.75rem', fontWeight: 800 }}>
                        {clientSessionHistory.length} Completed
                      </span>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                      {clientSessionHistory.map((session) => {
                        const typeColorMap = {
                          'Physical Therapy': { bg: '#eff6ff', color: '#1d4ed8', border: '#bfdbfe' },
                          'Occupational Therapy': { bg: '#f0fdf4', color: '#15803d', border: '#bbf7d0' },
                          'Consultation': { bg: '#f5f3ff', color: '#7c3aed', border: '#ddd6fe' },
                        }
                        const tc = typeColorMap[session.type] || { bg: '#f8fafc', color: '#475569', border: '#e2e8f0' }
                        return (
                          <div
                            key={session.id}
                            style={{ background: '#f8fafc', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '18px 22px', display: 'flex', gap: '16px', alignItems: 'flex-start' }}
                          >
                            {/* Date */}
                            <div style={{ width: '56px', height: '56px', borderRadius: '12px', background: '#e2e8f0', color: '#475569', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                              <strong style={{ fontSize: '1.1rem', fontWeight: 900, lineHeight: 1 }}>{session.dateDay}</strong>
                              <span style={{ fontSize: '0.65rem', fontWeight: 800, textTransform: 'uppercase', marginTop: '1px' }}>{session.dateMonth}</span>
                            </div>

                            {/* Content */}
                            <div style={{ flex: 1 }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '5px' }}>
                                <span style={{ background: tc.bg, color: tc.color, borderRadius: '50px', padding: '2px 10px', fontSize: '0.68rem', fontWeight: 800, border: `1px solid ${tc.border}` }}>{session.type}</span>
                                <span style={{ background: '#f0fdf4', color: '#15803d', borderRadius: '50px', padding: '2px 10px', fontSize: '0.68rem', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                                  <span className="material-symbols-outlined" style={{ fontSize: '12px' }}>check_circle</span>
                                  Completed
                                </span>
                              </div>
                              <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f172a', margin: '0 0 4px 0' }}>{session.title}</h4>
                              <div style={{ display: 'flex', gap: '14px', fontSize: '0.78rem', color: '#64748b', marginBottom: '10px', flexWrap: 'wrap' }}>
                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                  <span className="material-symbols-outlined" style={{ fontSize: '13px', color: session.avatarColor }}>schedule</span>
                                  {session.time}
                                </span>
                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                  <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: session.avatarColor, color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.55rem', fontWeight: 800 }}>{session.avatar}</div>
                                  {session.provider}
                                </span>
                              </div>
                              {/* Therapist note */}
                              <div style={{ background: '#fff', borderRadius: '10px', padding: '10px 14px', border: '1px solid #e2e8f0' }}>
                                <div style={{ display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
                                  <span className="material-symbols-outlined" style={{ fontSize: '14px', color: '#64748b', marginTop: '1px', flexShrink: 0 }}>clinical_notes</span>
                                  <p style={{ fontSize: '0.78rem', color: '#374151', margin: 0, lineHeight: 1.5, fontStyle: 'italic' }}>"{session.sessionNote}"</p>
                                </div>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* ── PATIENT TAB 4: PRESCRIBED REHAB PROTOCOLS ── */}
              {activeTab === 'exercises' && (
                <div className="bento-grid">
                  {/* Enhanced Clinical Header */}
                  <div className="bento-card col-span-12" style={{ background: 'linear-gradient(135deg,#0f172a,#1e3a5f)', color: '#fff', padding: '28px 32px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px' }}>
                      <div>
                        <span style={{ background: 'rgba(255,255,255,0.15)', padding: '4px 14px', borderRadius: '50px', fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.07em' }}>Clinical Therapy Protocols</span>
                        <h2 style={{ fontSize: '1.55rem', fontWeight: 900, marginTop: '10px', color: '#fff' }}>Prescribed Rehabilitation Exercises</h2>
                        <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.88rem', marginTop: '4px' }}>
                          Therapeutic protocol prescribed by <strong>Dr. A. Smith, PT</strong> for Post-Op ACL Rehabilitation & Joint Range of Motion.
                        </p>
                      </div>
                      <div style={{ display: 'flex', gap: '12px' }}>
                        {[
                          { label: 'Protocols Today', value: `${completedExerciseIds.length}/${clientExercises.length}`, icon: 'check_circle', bg: 'rgba(34,197,94,0.2)' },
                          { label: 'Adherence', value: '🔥 6-Day', icon: 'local_fire_department', bg: 'rgba(234,88,12,0.2)' },
                          { label: 'Compliance', value: '85%', icon: 'trending_up', bg: 'rgba(255,255,255,0.15)' },
                        ].map(s => (
                          <div key={s.label} style={{ background: s.bg, backdropFilter: 'blur(8px)', borderRadius: '14px', padding: '14px 18px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.15)', minWidth: '85px' }}>
                            <span className="material-symbols-outlined" style={{ fontSize: '18px', color: 'rgba(255,255,255,0.9)', display: 'block', marginBottom: '3px' }}>{s.icon}</span>
                            <strong style={{ fontSize: '1.2rem', fontWeight: 900, color: '#fff', display: 'block', lineHeight: 1 }}>{s.value}</strong>
                            <span style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.7)', fontWeight: 700, textTransform: 'uppercase' }}>{s.label}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* 7-Day Streak Calendar */}
                  <div className="bento-card col-span-7" style={{ padding: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
                      <div>
                        <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>Weekly Progress Tracker</h3>
                        <p style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '2px' }}>Your exercise completion over the last 7 days</p>
                      </div>
                      <span style={{ background: '#fff7ed', color: '#ea580c', borderRadius: '50px', padding: '4px 14px', fontSize: '0.75rem', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>🔥 6-Day Streak</span>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: '8px' }}>
                      {[
                        { day: 'Mon', done: 4, total: 4 },
                        { day: 'Tue', done: 4, total: 4 },
                        { day: 'Wed', done: 3, total: 4 },
                        { day: 'Thu', done: 4, total: 4 },
                        { day: 'Fri', done: 4, total: 4 },
                        { day: 'Sat', done: 3, total: 4 },
                        { day: 'Sun', done: completedExerciseIds.length, total: clientExercises.length },
                      ].map((d, i) => {
                        const pct = Math.round((d.done / d.total) * 100)
                        const isToday = i === 6
                        const full = pct === 100
                        return (
                          <div key={d.day} style={{ background: isToday ? '#eff6ff' : '#f8fafc', borderRadius: '14px', padding: '14px 8px', textAlign: 'center', border: isToday ? '2px solid #2563eb' : '1.5px solid #e2e8f0', position: 'relative' }}>
                            {isToday && <div style={{ position: 'absolute', top: '-8px', left: '50%', transform: 'translateX(-50%)', background: '#2563eb', color: '#fff', padding: '1px 8px', borderRadius: '50px', fontSize: '0.6rem', fontWeight: 800 }}>TODAY</div>}
                            <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700, marginBottom: '8px' }}>{d.day}</div>
                            <svg width="36" height="36" viewBox="0 0 36 36">
                              <circle cx="18" cy="18" r="15" fill="none" stroke="#e2e8f0" strokeWidth="3.5" />
                              <circle cx="18" cy="18" r="15" fill="none" stroke={full ? '#16a34a' : '#2563eb'} strokeWidth="3.5" strokeDasharray={`${2 * Math.PI * 15}`} strokeDashoffset={`${2 * Math.PI * 15 * (1 - pct / 100)}`} strokeLinecap="round" transform="rotate(-90 18 18)" />
                              {full ? <text x="18" y="22" textAnchor="middle" fontSize="12" fill="#16a34a">✓</text> : <text x="18" y="22" textAnchor="middle" fontSize="9" fontWeight="800" fill="#0f172a">{pct}%</text>}
                            </svg>
                            <div style={{ fontSize: '0.65rem', color: full ? '#16a34a' : '#64748b', fontWeight: 700, marginTop: '6px' }}>{d.done}/{d.total}</div>
                          </div>
                        )
                      })}
                    </div>
                  </div>

                  {/* Today's Progress Summary */}
                  <div className="bento-card col-span-5" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                    <div>
                      <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', margin: '0 0 4px 0' }}>Today's Progress</h3>
                      <p style={{ fontSize: '0.82rem', color: '#64748b', margin: 0 }}>Track your daily exercise completion</p>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '24px', padding: '16px 0' }}>
                      <svg width="100" height="100" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="42" fill="none" stroke="#e2e8f0" strokeWidth="8" />
                        <circle cx="50" cy="50" r="42" fill="none" stroke={completedExerciseIds.length === clientExercises.length ? '#16a34a' : '#0f52ba'} strokeWidth="8" strokeDasharray={`${2 * Math.PI * 42}`} strokeDashoffset={`${2 * Math.PI * 42 * (1 - completedExerciseIds.length / clientExercises.length)}`} strokeLinecap="round" transform="rotate(-90 50 50)" style={{ transition: 'stroke-dashoffset 0.5s ease' }} />
                        <text x="50" y="46" textAnchor="middle" fontSize="20" fontWeight="900" fill="#0f172a">{Math.round((completedExerciseIds.length / clientExercises.length) * 100)}%</text>
                        <text x="50" y="62" textAnchor="middle" fontSize="9" fill="#64748b" fontWeight="600">Complete</text>
                      </svg>
                      <div>
                        <div style={{ fontSize: '2rem', fontWeight: 900, color: '#0f172a', lineHeight: 1 }}>{completedExerciseIds.length}<span style={{ fontSize: '1rem', color: '#64748b' }}>/{clientExercises.length}</span></div>
                        <div style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '4px' }}>exercises done</div>
                        <div style={{ fontSize: '0.85rem', fontWeight: 800, color: completedExerciseIds.length === clientExercises.length ? '#16a34a' : '#0f52ba', marginTop: '8px' }}>{completedExerciseIds.length === clientExercises.length ? '🎉 All Done!' : `${clientExercises.length - completedExerciseIds.length} remaining`}</div>
                      </div>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px' }}>
                      {[
                        { label: 'Avg / Day', value: '3.7', color: '#0f52ba', bg: '#eff6ff' },
                        { label: 'Best Day', value: '4/4', color: '#16a34a', bg: '#f0fdf4' },
                        { label: 'Total Reps', value: '280', color: '#7c3aed', bg: '#f5f3ff' },
                      ].map(s => (
                        <div key={s.label} style={{ background: s.bg, borderRadius: '10px', padding: '10px', textAlign: 'center', border: `1px solid ${s.color}22` }}>
                          <div style={{ fontSize: '1.1rem', fontWeight: 900, color: s.color }}>{s.value}</div>
                          <div style={{ fontSize: '0.65rem', color: '#64748b', fontWeight: 700, marginTop: '2px', textTransform: 'uppercase' }}>{s.label}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Exercise Grid Cards */}
                  {clientExercises.map((ex) => {
                    const isDone = completedExerciseIds.includes(ex.id)
                    return (
                      <div
                        key={ex.id}
                        className="bento-card col-span-6"
                        style={{
                          background: isDone ? 'linear-gradient(180deg,#f0fdf4 0%, #ffffff 100%)' : '#ffffff',
                          border: `1.5px solid ${isDone ? '#bbf7d0' : '#e2e8f0'}`,
                          borderRadius: '20px',
                          padding: '24px',
                          display: 'flex',
                          flexDirection: 'column',
                          justify: 'space-between',
                          gap: '16px',
                          transition: 'all 0.25s ease',
                          boxShadow: isDone ? '0 4px 20px rgba(34,197,94,0.08)' : '0 2px 12px rgba(15,23,42,0.04)'
                        }}
                      >
                        {/* Top Header Row */}
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '8px', marginBottom: '10px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <div style={{
                                width: '38px', height: '38px', borderRadius: '12px',
                                background: isDone ? '#dcfce7' : '#eff6ff',
                                color: isDone ? '#16a34a' : '#0f52ba',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                flexShrink: 0
                              }}>
                                <span className="material-symbols-outlined" style={{ fontSize: '20px' }}>{ex.icon || 'fitness_center'}</span>
                              </div>
                              <div>
                                <span style={{ background: '#e0f2fe', color: '#0369a1', borderRadius: '50px', padding: '2px 10px', fontSize: '0.68rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                                  {ex.focus}
                                </span>
                                <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: isDone ? '#166534' : '#0f172a', margin: '4px 0 0 0' }}>{ex.name}</h3>
                              </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <span style={{ background: '#f1f5f9', color: '#64748b', padding: '4px 10px', borderRadius: '50px', fontSize: '0.72rem', fontWeight: 700 }}>
                                {ex.tag}
                              </span>
                              {isDone ? (
                                <span style={{ background: '#dcfce7', color: '#15803d', borderRadius: '50px', padding: '4px 12px', fontSize: '0.72rem', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                  <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>check_circle</span>
                                  Completed
                                </span>
                              ) : (
                                <span style={{ background: '#fff7ed', color: '#c2410c', borderRadius: '50px', padding: '4px 12px', fontSize: '0.72rem', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                  <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>schedule</span>
                                  Pending
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Exercise Brief Description & Target */}
                          <p style={{ fontSize: '0.82rem', color: '#475569', margin: '6px 0 12px 0', lineHeight: 1.45 }}>
                            {ex.description}
                          </p>

                          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', fontSize: '0.75rem', color: '#64748b', marginBottom: '14px' }}>
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: '#f8fafc', padding: '4px 10px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                              <span className="material-symbols-outlined" style={{ fontSize: '14px', color: '#0f52ba' }}>my_location</span>
                              Target: <strong style={{ color: '#0f172a' }}>{ex.target}</strong>
                            </span>
                            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: '#f8fafc', padding: '4px 10px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                              <span className="material-symbols-outlined" style={{ fontSize: '14px', color: '#0f52ba' }}>timer</span>
                              Rest: <strong style={{ color: '#0f172a' }}>{ex.rest}</strong>
                            </span>
                          </div>

                          {/* Exercise Spec Details Pills */}
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', textAlign: 'center', marginBottom: '14px' }}>
                            <div style={{ background: isDone ? '#dcfce7' : '#f8fafc', borderRadius: '12px', padding: '10px', border: `1px solid ${isDone ? '#bbf7d0' : '#e2e8f0'}` }}>
                              <span style={{ fontSize: '0.66rem', color: '#64748b', display: 'block', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>SETS</span>
                              <strong style={{ fontSize: '1.1rem', color: '#0f172a', fontWeight: 900 }}>{ex.sets}</strong>
                            </div>
                            <div style={{ background: isDone ? '#dcfce7' : '#f8fafc', borderRadius: '12px', padding: '10px', border: `1px solid ${isDone ? '#bbf7d0' : '#e2e8f0'}` }}>
                              <span style={{ fontSize: '0.66rem', color: '#64748b', display: 'block', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>REPS</span>
                              <strong style={{ fontSize: '1.1rem', color: '#0f172a', fontWeight: 900 }}>{ex.reps}</strong>
                            </div>
                            <div style={{ background: isDone ? '#dcfce7' : '#f8fafc', borderRadius: '12px', padding: '10px', border: `1px solid ${isDone ? '#bbf7d0' : '#e2e8f0'}` }}>
                              <span style={{ fontSize: '0.66rem', color: '#64748b', display: 'block', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>EST. TIME</span>
                              <strong style={{ fontSize: '1.1rem', color: '#0f172a', fontWeight: 900 }}>{ex.duration}</strong>
                            </div>
                          </div>

                          {/* In-Card Completion Progress Bar */}
                          <div style={{ marginBottom: '14px' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', fontWeight: 700, color: '#64748b', marginBottom: '4px' }}>
                              <span>Protocol Target</span>
                              <span style={{ color: isDone ? '#16a34a' : '#0f52ba' }}>{isDone ? '100% Prescribed Target Met' : '0% Completed Today'}</span>
                            </div>
                            <div style={{ background: '#e2e8f0', borderRadius: '50px', height: '6px', overflow: 'hidden' }}>
                              <div style={{ width: isDone ? '100%' : '0%', height: '100%', background: isDone ? 'linear-gradient(90deg,#16a34a,#22c55e)' : '#0f52ba', transition: 'width 0.4s ease' }} />
                            </div>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                          <button
                            onClick={() => { setSelectedExerciseDetail(ex); setShowExerciseDetailModal(true) }}
                            style={{
                              padding: '10px 16px', borderRadius: '50px', border: '1.5px solid #cbd5e1',
                              background: '#fff', color: '#475569', fontSize: '0.8rem', fontWeight: 700,
                              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap'
                            }}
                          >
                            <span className="material-symbols-outlined" style={{ fontSize: '16px', color: '#0f52ba' }}>clinical_notes</span>
                            Protocol Guide
                          </button>
                          <button
                            onClick={() => alert(`Symptom note logged for ${ex.name}. Your physical therapist Dr. A. Smith has been notified.`)}
                            style={{
                              padding: '10px 14px', borderRadius: '50px', border: '1.5px solid #fecaca',
                              background: '#fef2f2', color: '#dc2626', fontSize: '0.8rem', fontWeight: 700,
                              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', whiteSpace: 'nowrap'
                            }}
                            title="Report pain or difficulty during this exercise"
                          >
                            <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>warning</span>
                            Report Pain
                          </button>
                          <button
                            onClick={() => toggleExerciseComplete(ex.id)}
                            style={{
                              flex: 1, padding: '10px 18px', borderRadius: '50px', border: 'none',
                              background: isDone ? '#16a34a' : 'linear-gradient(135deg,#0f52ba,#2563eb)',
                              color: '#fff', fontWeight: 800, fontSize: '0.82rem', cursor: 'pointer',
                              boxShadow: isDone ? 'none' : '0 4px 14px rgba(15,82,186,0.3)',
                              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
                              whiteSpace: 'nowrap'
                            }}
                          >
                            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>
                              {isDone ? 'check_circle' : 'play_circle'}
                            </span>
                            {isDone ? '✓ Protocol Completed' : 'Mark Completed'}
                          </button>
                        </div>
                      </div>
                    )
                  })}

                  {/* Exercise History Log */}
                  <div className="bento-card col-span-12" style={{ padding: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px' }}>
                      <div>
                        <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>Exercise Session History</h3>
                        <p style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '2px' }}>Your recent daily exercise completion log</p>
                      </div>
                      <span style={{ background: '#f0fdf4', color: '#16a34a', borderRadius: '50px', padding: '4px 14px', fontSize: '0.75rem', fontWeight: 800 }}>Last 7 Days</span>
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {[
                        { date: 'Sat, Oct 11', done: 3, total: 4, pain: 2, note: 'Skipped Single-Leg Balance — ankle felt sore' },
                        { date: 'Fri, Oct 10', done: 4, total: 4, pain: 3, note: 'Full routine completed. Felt strong.' },
                        { date: 'Thu, Oct 9', done: 4, total: 4, pain: 2, note: 'Great session! Increased heel slide reps to 12.' },
                        { date: 'Wed, Oct 8', done: 3, total: 4, pain: 4, note: 'Knee swelling — reduced intensity on quad sets.' },
                        { date: 'Tue, Oct 7', done: 4, total: 4, pain: 3, note: 'All exercises completed on schedule.' },
                      ].map((log, i) => {
                        const pct = Math.round((log.done / log.total) * 100)
                        const full = pct === 100
                        return (
                          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '16px', padding: '14px 16px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                            <div style={{ minWidth: '90px' }}>
                              <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#0f172a' }}>{log.date}</div>
                              <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: '2px' }}>Pain: {log.pain}/10</div>
                            </div>
                            <div style={{ width: '80px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <div style={{ flex: 1, height: '6px', borderRadius: '50px', background: '#e2e8f0', overflow: 'hidden' }}>
                                <div style={{ width: `${pct}%`, height: '100%', background: full ? '#16a34a' : '#2563eb', borderRadius: '50px' }} />
                              </div>
                              <span style={{ fontSize: '0.72rem', fontWeight: 800, color: full ? '#16a34a' : '#2563eb' }}>{log.done}/{log.total}</span>
                            </div>
                            <div style={{ flex: 1, fontSize: '0.78rem', color: '#475569', fontStyle: 'italic' }}>"{log.note}"</div>
                            {full && <span style={{ background: '#f0fdf4', color: '#16a34a', borderRadius: '50px', padding: '3px 10px', fontSize: '0.68rem', fontWeight: 800, whiteSpace: 'nowrap' }}>✓ Complete</span>}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* ── PATIENT/ADMIN SETTINGS TAB ── */}
              {/* ── PATIENT SETTINGS TAB ── */}
              {activeTab === 'settings' && (
                <div className="bento-grid">
                  <div className="bento-card col-span-12" style={{ padding: '28px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', borderBottom: '1px solid #e2e8f0', paddingBottom: '16px' }}>
                      <div>
                        <h2 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#0f172a', margin: '0 0 4px 0' }}>Patient Account & Recovery Settings</h2>
                        <p style={{ fontSize: '0.85rem', color: '#64748b', margin: 0 }}>Manage your personal medical profile, notifications, display preferences, and account security.</p>
                      </div>
                      <span style={{ background: '#e0f2fe', color: '#0369a1', borderRadius: '50px', padding: '4px 14px', fontSize: '0.75rem', fontWeight: 800 }}>
                        Patient ID: {sessionUser.patientId || 'PT-88236'}
                      </span>
                    </div>

                    {/* Profile Section Form */}
                    <div style={{ marginBottom: '28px' }}>
                      <h3 style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0f52ba', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '14px' }}>Profile Information</h3>
                      <form
                        onSubmit={(e) => {
                          e.preventDefault()
                          setSessionUser(prev => ({
                            ...prev,
                            name: patientProfileForm.name,
                            email: patientProfileForm.email,
                            condition: patientProfileForm.condition
                          }))
                          triggerToast('Patient profile settings saved successfully!')
                        }}
                        style={{ background: '#f8fafc', borderRadius: '16px', padding: '22px', border: '1px solid #e2e8f0' }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
                          <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: 'linear-gradient(135deg,#0f52ba,#2563eb)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.2rem', fontWeight: 900, flexShrink: 0 }}>
                            {patientProfileForm.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <div style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a' }}>{patientProfileForm.name}</div>
                            <div style={{ fontSize: '0.82rem', color: '#64748b' }}>{patientProfileForm.email}</div>
                            <div style={{ fontSize: '0.75rem', color: '#0f52ba', fontWeight: 700, marginTop: '2px' }}>{patientProfileForm.condition}</div>
                          </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px', marginBottom: '16px' }}>
                          <div>
                            <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '4px' }}>Full Name</label>
                            <input className="modern-input" value={patientProfileForm.name} onChange={e => setPatientProfileForm(p => ({ ...p, name: e.target.value }))} required />
                          </div>
                          <div>
                            <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '4px' }}>Email Address</label>
                            <input type="email" className="modern-input" value={patientProfileForm.email} onChange={e => setPatientProfileForm(p => ({ ...p, email: e.target.value }))} required />
                          </div>
                          <div>
                            <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '4px' }}>Primary Condition / Diagnosis</label>
                            <input className="modern-input" value={patientProfileForm.condition} onChange={e => setPatientProfileForm(p => ({ ...p, condition: e.target.value }))} required />
                          </div>
                          <div>
                            <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '4px' }}>Phone Number</label>
                            <input className="modern-input" value={patientProfileForm.phone} onChange={e => setPatientProfileForm(p => ({ ...p, phone: e.target.value }))} required />
                          </div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                          <button type="submit" className="modern-submit-btn" style={{ width: 'auto', padding: '10px 24px', marginTop: 0 }}>
                            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>save</span>
                            Save Profile Changes
                          </button>
                        </div>
                      </form>
                    </div>

                    {/* Notification Preferences */}
                    <div style={{ marginBottom: '28px' }}>
                      <h3 style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0f52ba', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '14px' }}>Notification Preferences</h3>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {[
                          { key: 'sessionReminders', label: 'Therapy Session Reminders', desc: 'Get SMS & push notifications 1 hour before scheduled sessions' },
                          { key: 'exerciseReminders', label: 'Daily Exercise Protocols', desc: 'Reminder at 09:00 AM to complete prescribed home routine' },
                          { key: 'goalUpdates', label: 'Milestone Progress Alerts', desc: 'Notifications when you reach a Range of Motion or FIM milestone' },
                          { key: 'therapistMessages', label: 'Care Team Notes & Messages', desc: 'Instant alerts when Dr. Lena Ortiz or Dr. Smith updates clinical notes' },
                          { key: 'weeklyReports', label: 'Weekly Recovery Summary Email', desc: 'Receive a summary of weekly mobility gains every Sunday evening' },
                        ].map(notif => {
                          const isChecked = !!patientNotifs[notif.key]
                          return (
                            <div key={notif.key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                              <div>
                                <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#0f172a' }}>{notif.label}</div>
                                <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '1px' }}>{notif.desc}</div>
                              </div>
                              <div
                                onClick={() => {
                                  setPatientNotifs(prev => ({ ...prev, [notif.key]: !prev[notif.key] }))
                                  triggerToast(`Notification "${notif.label}" ${!isChecked ? 'enabled' : 'disabled'}.`)
                                }}
                                style={{ width: '44px', height: '24px', borderRadius: '50px', background: isChecked ? '#0f52ba' : '#cbd5e1', padding: '3px', cursor: 'pointer', transition: 'background 0.2s', flexShrink: 0 }}
                              >
                                <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.2)', transition: 'transform 0.2s', transform: isChecked ? 'translateX(20px)' : 'translateX(0)' }} />
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>

                    {/* Accessibility & Display Settings */}
                    <div style={{ marginBottom: '28px' }}>
                      <h3 style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0f52ba', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '14px' }}>Accessibility & Display Settings</h3>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                        {[
                          { key: 'largeText', icon: 'text_increase', label: 'Large Font Mode', desc: 'Increase text size across the rehabilitation workspace' },
                          { key: 'highContrast', icon: 'contrast', label: 'High Contrast UI', desc: 'Sharpen color contrast for high visibility' },
                          { key: 'darkMode', icon: 'dark_mode', label: 'Dark Mode Interface', desc: 'Switch to high-contrast dark visual theme' },
                          { key: 'soundEffects', icon: 'volume_up', label: 'Audio Completion Cues', desc: 'Play audible tone when completing exercise sets' },
                        ].map(opt => {
                          const isChecked = !!accessibilitySettings[opt.key]
                          return (
                            <div key={opt.key} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 16px', background: isChecked ? '#eff6ff' : '#f8fafc', borderRadius: '14px', border: `1.5px solid ${isChecked ? '#bfdbfe' : '#e2e8f0'}` }}>
                              <div style={{ width: '38px', height: '38px', borderRadius: '10px', background: isChecked ? '#0f52ba' : '#e2e8f0', color: isChecked ? '#fff' : '#475569', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, transition: 'all 0.2s' }}>
                                <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>{opt.icon}</span>
                              </div>
                              <div style={{ flex: 1 }}>
                                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a' }}>{opt.label}</div>
                                <div style={{ fontSize: '0.72rem', color: '#64748b' }}>{opt.desc}</div>
                              </div>
                              <div
                                onClick={() => {
                                  setAccessibilitySettings(prev => ({ ...prev, [opt.key]: !prev[opt.key] }))
                                  triggerToast(`${opt.label} ${!isChecked ? 'turned ON' : 'turned OFF'}.`)
                                }}
                                style={{ width: '44px', height: '24px', borderRadius: '50px', background: isChecked ? '#0f52ba' : '#cbd5e1', padding: '3px', cursor: 'pointer', transition: 'background 0.2s', flexShrink: 0 }}
                              >
                                <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.2)', transition: 'transform 0.2s', transform: isChecked ? 'translateX(20px)' : 'translateX(0)' }} />
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>

                    {/* Privacy & Security */}
                    <div style={{ marginBottom: '28px' }}>
                      <h3 style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0f52ba', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '14px' }}>Privacy & Account Security</h3>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                        <div
                          onClick={() => setShowPasswordModal(true)}
                          style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 18px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0', cursor: 'pointer', transition: 'all 0.15s' }}
                          onMouseEnter={e => e.currentTarget.style.borderColor = '#0f52ba'}
                          onMouseLeave={e => e.currentTarget.style.borderColor = '#e2e8f0'}
                        >
                          <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#f5f3ff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <span className="material-symbols-outlined" style={{ fontSize: '18px', color: '#7c3aed' }}>lock</span>
                          </div>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a' }}>Change Password</div>
                            <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Update your login password and security key</div>
                          </div>
                          <span style={{ fontSize: '0.75rem', color: '#0f52ba', fontWeight: 700 }}>Update →</span>
                        </div>

                        <div
                          onClick={() => setShow2faModal(true)}
                          style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '14px 18px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0', cursor: 'pointer', transition: 'all 0.15s' }}
                          onMouseEnter={e => e.currentTarget.style.borderColor = '#0f52ba'}
                          onMouseLeave={e => e.currentTarget.style.borderColor = '#e2e8f0'}
                        >
                          <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: '#e0f2fe', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <span className="material-symbols-outlined" style={{ fontSize: '18px', color: '#0284c7' }}>security</span>
                          </div>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a' }}>Two-Factor Authentication (2FA)</div>
                            <div style={{ fontSize: '0.72rem', color: '#64748b' }}>Add extra security via Google Authenticator TOTP</div>
                          </div>
                          <span style={{ background: twoFaActive ? '#dcfce7' : '#f1f5f9', color: twoFaActive ? '#16a34a' : '#475569', padding: '3px 10px', borderRadius: '50px', fontSize: '0.72rem', fontWeight: 800 }}>
                            {twoFaActive ? '✓ Active' : 'Enable'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Danger Zone */}
                    <div>
                      <h3 style={{ fontSize: '0.85rem', fontWeight: 800, color: '#dc2626', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: '14px' }}>Danger Zone</h3>
                      <div style={{ display: 'flex', gap: '12px' }}>
                        <button onClick={handleSignOut} style={{ padding: '10px 22px', borderRadius: '50px', border: '1.5px solid #fecaca', background: '#fef2f2', color: '#dc2626', fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>logout</span> Sign Out
                        </button>
                        <button onClick={() => alert('Account deletion requires care team authorization. Please contact Dr. Lena Ortiz.')} style={{ padding: '10px 22px', borderRadius: '50px', border: '1.5px solid #fecaca', background: '#fff', color: '#dc2626', fontSize: '0.85rem', fontWeight: 700, cursor: 'pointer' }}>Delete Account</button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
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
                    {/* New Admission Quick Header Banner on Top of Facility Overview */}
                    <div className="bento-card col-span-12" style={{ background: 'linear-gradient(135deg, #0f52ba 0%, #1e3a5f 100%)', color: '#ffffff', padding: '22px 28px', borderRadius: '20px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                          <div style={{ width: '46px', height: '46px', borderRadius: '14px', background: 'rgba(255, 255, 255, 0.15)', backdropFilter: 'blur(8px)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <span className="material-symbols-outlined" style={{ fontSize: '26px', color: '#ffffff' }}>person_add</span>
                          </div>
                          <div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '3px' }}>
                              <span style={{ background: 'rgba(255, 255, 255, 0.2)', color: '#ffffff', padding: '2px 10px', borderRadius: '50px', fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                Admission Intake Active
                              </span>
                              <span style={{ color: 'rgba(255, 255, 255, 0.75)', fontSize: '0.78rem', fontWeight: 600 }}>• 3 pending intakes today</span>
                            </div>
                            <h3 style={{ fontSize: '1.35rem', fontWeight: 900, margin: 0, color: '#ffffff' }}>New Patient Admission & Intake</h3>
                            <p style={{ fontSize: '0.85rem', color: 'rgba(255, 255, 255, 0.8)', marginTop: '2px', marginBottom: 0 }}>
                              Register incoming patients, assign primary care therapists, and initiate initial FIM baseline assessments.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

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
                      <button
                        className="btn-view-all-modern"
                        style={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '8px',
                          padding: '10px 22px',
                          borderRadius: '50px',
                          border: 'none',
                          background: 'linear-gradient(135deg, #0f52ba 0%, #00b4d8 100%)',
                          color: '#ffffff',
                          fontSize: '0.9rem',
                          fontWeight: '800',
                          cursor: 'pointer',
                          boxShadow: '0 4px 16px rgba(15, 82, 186, 0.4)'
                        }}
                        onClick={() => setActiveTab('patients')}
                      >
                        <span className="material-symbols-outlined">groups</span>
                        <span>View All Patients</span>
                        <span className="material-symbols-outlined">arrow_forward</span>
                      </button>
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
                            <th>Actions</th>
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
                              <td>
                                <button
                                  className="btn-action-assess"
                                  style={{
                                    display: 'inline-flex',
                                    alignItems: 'center',
                                    gap: '6px',
                                    padding: '8px 16px',
                                    borderRadius: '50px',
                                    border: 'none',
                                    background: 'linear-gradient(135deg, #0f52ba 0%, #2563eb 100%)',
                                    color: '#ffffff',
                                    fontSize: '0.82rem',
                                    fontWeight: '800',
                                    cursor: 'pointer',
                                    boxShadow: '0 3px 12px rgba(15, 82, 186, 0.35)',
                                    whiteSpace: 'nowrap'
                                  }}
                                  onClick={() => {
                                    setSelectedPatientId(pt.id)
                                    setActiveTab('assessment')
                                  }}
                                >
                                  <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>assignment</span>
                                  <span>Assess FIM</span>
                                </button>
                              </td>
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
                                className="btn-action-assess"
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '6px',
                                  padding: '8px 16px',
                                  borderRadius: '50px',
                                  border: 'none',
                                  background: 'linear-gradient(135deg, #0f52ba 0%, #2563eb 100%)',
                                  color: '#ffffff',
                                  fontSize: '0.82rem',
                                  fontWeight: '800',
                                  cursor: 'pointer',
                                  boxShadow: '0 3px 12px rgba(15, 82, 186, 0.35)',
                                  whiteSpace: 'nowrap'
                                }}
                                onClick={() => {
                                  setSelectedPatientId(pt.id)
                                  setActiveTab('assessment')
                                }}
                              >
                                <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>assignment</span>
                                <span>Assess FIM</span>
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

                  {/* Evaluation Complete Modal */}
                  {showEvalModal && (
                    <div className="eval-modal-overlay" onClick={() => setShowEvalModal(false)}>
                      <div className="eval-modal-card" onClick={(e) => e.stopPropagation()}>
                        {/* Success icon */}
                        <div className="eval-modal-icon-ring">
                          <span className="material-symbols-outlined">verified</span>
                        </div>

                        <div className="eval-modal-badge">Evaluation Complete</div>
                        <h2 className="eval-modal-title">Assessment Finalised</h2>
                        <p className="eval-modal-patient">{currentPatient.name} &nbsp;·&nbsp; {currentPatient.id}</p>
                        <p className="eval-modal-diagnosis">{currentPatient.diagnosis}</p>

                        {/* Score tiles */}
                        <div className="eval-modal-scores">
                          <div className="eval-score-tile">
                            <span className="eval-score-val">{totalFimScore}<span className="eval-score-denom">/126</span></span>
                            <span className="eval-score-lbl">Total FIM Score</span>
                          </div>
                          <div className="eval-score-tile">
                            <span className="eval-score-val">{motorSubscore}<span className="eval-score-denom">/91</span></span>
                            <span className="eval-score-lbl">Motor Domain</span>
                          </div>
                          <div className="eval-score-tile">
                            <span className="eval-score-val">{cognitiveSubscore}<span className="eval-score-denom">/35</span></span>
                            <span className="eval-score-lbl">Cognitive Domain</span>
                          </div>
                        </div>

                        {/* Classification chip */}
                        <div className={`eval-modal-class-chip ${
                          totalFimScore >= 90 ? 'chip-green' : totalFimScore >= 60 ? 'chip-amber' : 'chip-red'
                        }`}>
                          <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>
                            {totalFimScore >= 90 ? 'trending_up' : totalFimScore >= 60 ? 'trending_flat' : 'trending_down'}
                          </span>
                          {totalFimScore >= 90 ? 'Modified Independence' : totalFimScore >= 60 ? 'Moderate Dependence' : 'Complete Dependence'}
                        </div>

                        <p className="eval-modal-meta">
                          Evaluated by &nbsp;<strong>{sessionUser.name}</strong>&nbsp; on &nbsp;<strong>{new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</strong>
                        </p>

                        {/* Action buttons */}
                        <div className="eval-modal-actions">
                          <button
                            className="eval-modal-btn-print"
                            onClick={() => { setShowEvalModal(false); window.print() }}
                          >
                            <span className="material-symbols-outlined">print</span>
                            Print Report
                          </button>
                          <button
                            className="eval-modal-btn-close"
                            onClick={() => { setShowEvalModal(false); setActiveTab('patients') }}
                          >
                            <span className="material-symbols-outlined">arrow_forward</span>
                            Back to Directory
                          </button>
                        </div>

                        {/* Close X */}
                        <button className="eval-modal-x" onClick={() => setShowEvalModal(false)}>
                          <span className="material-symbols-outlined">close</span>
                        </button>
                      </div>
                    </div>
                  )}
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
                        <CustomSelect
                          name="selectedPatient"
                          style={{ width: '240px' }}
                          value={selectedPatientId}
                          onChange={(e) => setSelectedPatientId(e.target.value)}
                          options={adminPatients.map((p) => ({ value: p.id, label: `${p.name} (${p.id})` }))}
                        />

                         <button className={`btn-signout ${evalDraftSaved ? 'draft-saved' : ''}`} onClick={handleSaveDraft}>
                           <span className="material-symbols-outlined">{evalDraftSaved ? 'check' : 'save'}</span>
                           {evalDraftSaved ? 'Saved!' : 'Save Draft'}
                         </button>

                         <button className="btn-signout" onClick={handlePrintAssessment} title="Print Assessment">
                           <span className="material-symbols-outlined">print</span>
                           Print
                         </button>

                         <button className="modern-submit-btn" style={{ width: 'auto', padding: '8px 16px', marginTop: 0 }} onClick={() => setShowEvalModal(true)}>
                           <span className="material-symbols-outlined">check_circle</span>
                           Complete Evaluation
                         </button>
                      </div>
                    </div>
                  </div>

                  {/* Stepper Header (Clickable Step Tabs) */}
                  <div className="assessment-stepper-bar">
                    <div
                      className={`stepper-step-item ${assessmentStep > 1 ? 'completed' : ''} ${assessmentStep === 1 ? 'active' : ''}`}
                      onClick={() => setAssessmentStep(1)}
                      style={{ cursor: 'pointer' }}
                    >
                      <div className="step-bubble">{assessmentStep > 1 ? '✓' : '1'}</div>
                      <span className="step-label">1. Vitals & Medical History</span>
                    </div>

                    <div
                      className={`stepper-step-item ${assessmentStep > 2 ? 'completed' : ''} ${assessmentStep === 2 ? 'active' : ''}`}
                      onClick={() => setAssessmentStep(2)}
                      style={{ cursor: 'pointer' }}
                    >
                      <div className="step-bubble">{assessmentStep > 2 ? '✓' : '2'}</div>
                      <span className="step-label">2. Functional Independence (FIM)</span>
                    </div>

                    <div
                      className={`stepper-step-item ${assessmentStep > 3 ? 'completed' : ''} ${assessmentStep === 3 ? 'active' : ''}`}
                      onClick={() => setAssessmentStep(3)}
                      style={{ cursor: 'pointer' }}
                    >
                      <div className="step-bubble">{assessmentStep > 3 ? '✓' : '3'}</div>
                      <span className="step-label">3. Musculoskeletal & ROM</span>
                    </div>

                    <div
                      className={`stepper-step-item ${assessmentStep === 4 ? 'active' : ''}`}
                      onClick={() => setAssessmentStep(4)}
                      style={{ cursor: 'pointer' }}
                    >
                      <div className="step-bubble">4</div>
                      <span className="step-label">4. Goals & Discharge Plan</span>
                    </div>
                  </div>

                  {/* ================================================================== */}
                  {/* STEP 1: VITALS & MEDICAL HISTORY PAGE                              */}
                  {/* ================================================================== */}
                  {assessmentStep === 1 && (
                    <div className="bento-card col-span-12 animate-fade-in" style={{ padding: '28px' }}>
                      <div className="card-header" style={{ marginBottom: '24px' }}>
                        <div className="card-header-left">
                          <h3 style={{ fontSize: '1.3rem', fontWeight: 800 }}>Step 1: Patient Vitals & Clinical History</h3>
                          <p>Record baseline physiological indicators, intake medical history, allergies, and physical therapy precautions.</p>
                        </div>
                      </div>

                      {/* Vital Signs Grid */}
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '16px', marginBottom: '24px' }}>
                        <div className="form-group">
                          <label style={{ fontSize: '0.82rem', fontWeight: 700 }}>Blood Pressure (mmHg)</label>
                          <div className="input-with-icon">
                            <span className="material-symbols-outlined">favorite</span>
                            <input
                              type="text"
                              className="modern-input"
                              value={vitalsHistory.bp}
                              onChange={(e) => setVitalsHistory((p) => ({ ...p, bp: e.target.value }))}
                              placeholder="120/80"
                            />
                          </div>
                        </div>

                        <div className="form-group">
                          <label style={{ fontSize: '0.82rem', fontWeight: 700 }}>Heart Rate (bpm)</label>
                          <div className="input-with-icon">
                            <span className="material-symbols-outlined">pulse_alert</span>
                            <input
                              type="text"
                              className="modern-input"
                              value={vitalsHistory.hr}
                              onChange={(e) => setVitalsHistory((p) => ({ ...p, hr: e.target.value }))}
                              placeholder="74"
                            />
                          </div>
                        </div>

                        <div className="form-group">
                          <label style={{ fontSize: '0.82rem', fontWeight: 700 }}>Respiratory Rate (br/min)</label>
                          <div className="input-with-icon">
                            <span className="material-symbols-outlined">air</span>
                            <input
                              type="text"
                              className="modern-input"
                              value={vitalsHistory.rr}
                              onChange={(e) => setVitalsHistory((p) => ({ ...p, rr: e.target.value }))}
                              placeholder="16"
                            />
                          </div>
                        </div>

                        <div className="form-group">
                          <label style={{ fontSize: '0.82rem', fontWeight: 700 }}>SpO2 Oxygen (%)</label>
                          <div className="input-with-icon">
                            <span className="material-symbols-outlined">vital_signs</span>
                            <input
                              type="text"
                              className="modern-input"
                              value={vitalsHistory.spo2}
                              onChange={(e) => setVitalsHistory((p) => ({ ...p, spo2: e.target.value }))}
                              placeholder="98"
                            />
                          </div>
                        </div>

                        <div className="form-group">
                          <label style={{ fontSize: '0.82rem', fontWeight: 700 }}>Temperature (°F)</label>
                          <div className="input-with-icon">
                            <span className="material-symbols-outlined">device_thermostat</span>
                            <input
                              type="text"
                              className="modern-input"
                              value={vitalsHistory.temp}
                              onChange={(e) => setVitalsHistory((p) => ({ ...p, temp: e.target.value }))}
                              placeholder="98.6"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Text inputs grid */}
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px', marginBottom: '24px' }}>
                        <div className="form-group">
                          <label style={{ fontSize: '0.85rem', fontWeight: 700 }}>Past Medical History & Primary Diagnosis Notes</label>
                          <textarea
                            className="modern-select no-icon"
                            rows="4"
                            style={{ fontSize: '0.85rem', lineHeight: '1.5' }}
                            value={vitalsHistory.medicalHistory}
                            onChange={(e) => setVitalsHistory((p) => ({ ...p, medicalHistory: e.target.value }))}
                          />
                        </div>

                        <div className="form-group">
                          <label style={{ fontSize: '0.85rem', fontWeight: 700 }}>Known Allergies & Clinical Contraindications</label>
                          <textarea
                            className="modern-select no-icon"
                            rows="4"
                            style={{ fontSize: '0.85rem', lineHeight: '1.5' }}
                            value={vitalsHistory.allergies}
                            onChange={(e) => setVitalsHistory((p) => ({ ...p, allergies: e.target.value }))}
                          />
                        </div>
                      </div>

                      <div className="form-group">
                        <label style={{ fontSize: '0.85rem', fontWeight: 700 }}>Physical Therapy Precautions & Mobility Restrictions</label>
                        <textarea
                          className="modern-select no-icon"
                          rows="3"
                          style={{ fontSize: '0.85rem', lineHeight: '1.5' }}
                          value={vitalsHistory.precautions}
                          onChange={(e) => setVitalsHistory((p) => ({ ...p, precautions: e.target.value }))}
                        />
                      </div>

                      {/* Step 1 Footer Navigation */}
                      <div className="form-step-nav-bar">
                        <div />
                        <button className="modern-submit-btn" style={{ width: 'auto', padding: '10px 24px', marginTop: 0 }} onClick={() => setAssessmentStep(2)}>
                          <span>Next: Functional Independence (FIM)</span>
                          <span className="material-symbols-outlined">arrow_forward</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* ================================================================== */}
                  {/* STEP 2: FUNCTIONAL INDEPENDENCE (FIM) PAGE                        */}
                  {/* ================================================================== */}
                  {assessmentStep === 2 && (
                    <div className="animate-fade-in">
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
                      <div className="bento-card col-span-12" style={{ marginBottom: '24px', padding: '28px' }}>
                        <div className="card-header" style={{ marginBottom: '20px' }}>
                          <div className="card-header-left">
                            <h3 style={{ fontSize: '1.3rem', fontWeight: 800 }}>Step 2: 18-Item FIM Scoring Rating Scale</h3>
                            <p>Rate patient functional performance across Self-Care, Mobility, and Cognitive domains (1 = Total Assist, 7 = Complete Independence)</p>
                          </div>
                        </div>

                        {/* Domain 1: Self-Care */}
                        <div style={{ marginBottom: '28px' }}>
                          <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0f52ba', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px', paddingBottom: '6px', borderBottom: '2px solid #e0f2fe' }}>
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
                              <CustomSelect name="eating" value={fimScores.eating} onChange={(e) => handleFimChange('eating', e.target.value)} options={[1,2,3,4,5,6,7].map(s=>({value:s,label:`${s}`}))} style={{ minWidth: '90px' }} />
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
                              <CustomSelect name="grooming" value={fimScores.grooming} onChange={(e) => handleFimChange('grooming', e.target.value)} options={[1,2,3,4,5,6,7].map(s=>({value:s,label:`${s}`}))} style={{ minWidth: '90px' }} />
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
                              <CustomSelect name="bathing" value={fimScores.bathing} onChange={(e) => handleFimChange('bathing', e.target.value)} options={[1,2,3,4,5,6,7].map(s=>({value:s,label:`${s}`}))} style={{ minWidth: '90px' }} />
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
                              <CustomSelect name="dressingUpper" value={fimScores.dressingUpper} onChange={(e) => handleFimChange('dressingUpper', e.target.value)} options={[1,2,3,4,5,6,7].map(s=>({value:s,label:`${s}`}))} style={{ minWidth: '90px' }} />
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
                              <CustomSelect name="dressingLower" value={fimScores.dressingLower} onChange={(e) => handleFimChange('dressingLower', e.target.value)} options={[1,2,3,4,5,6,7].map(s=>({value:s,label:`${s}`}))} style={{ minWidth: '90px' }} />
                            </div>
                          </div>
                        </div>

                        {/* Domain 2: Transfers & Mobility */}
                        <div style={{ marginBottom: '28px' }}>
                          <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0f52ba', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px', paddingBottom: '6px', borderBottom: '2px solid #e0f2fe' }}>
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
                              <CustomSelect name="transfersBed" value={fimScores.transfersBed} onChange={(e) => handleFimChange('transfersBed', e.target.value)} options={[1,2,3,4,5,6,7].map(s=>({value:s,label:`${s}`}))} style={{ minWidth: '90px' }} />
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
                              <CustomSelect name="transfersToilet" value={fimScores.transfersToilet} onChange={(e) => handleFimChange('transfersToilet', e.target.value)} options={[1,2,3,4,5,6,7].map(s=>({value:s,label:`${s}`}))} style={{ minWidth: '90px' }} />
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
                              <CustomSelect name="locomotionWalk" value={fimScores.locomotionWalk} onChange={(e) => handleFimChange('locomotionWalk', e.target.value)} options={[1,2,3,4,5,6,7].map(s=>({value:s,label:`${s}`}))} style={{ minWidth: '90px' }} />
                            </div>
                          </div>
                        </div>

                        {/* Domain 3: Cognition & Communication */}
                        <div>
                          <h4 style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0f52ba', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '12px', paddingBottom: '6px', borderBottom: '2px solid #e0f2fe' }}>
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
                              <CustomSelect name="comprehension" value={fimScores.comprehension} onChange={(e) => handleFimChange('comprehension', e.target.value)} options={[1,2,3,4,5,6,7].map(s=>({value:s,label:`${s}`}))} style={{ minWidth: '90px' }} />
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
                              <CustomSelect name="problemSolving" value={fimScores.problemSolving} onChange={(e) => handleFimChange('problemSolving', e.target.value)} options={[1,2,3,4,5,6,7].map(s=>({value:s,label:`${s}`}))} style={{ minWidth: '90px' }} />
                            </div>
                          </div>
                        </div>

                        {/* Step 2 Footer Navigation */}
                        <div className="form-step-nav-bar">
                          <button className="btn-signout" onClick={() => setAssessmentStep(1)}>
                            <span className="material-symbols-outlined">arrow_back</span>
                            <span>Back: Vitals & History</span>
                          </button>
                          <button className="modern-submit-btn" style={{ width: 'auto', padding: '10px 24px', marginTop: 0 }} onClick={() => setAssessmentStep(3)}>
                            <span>Next: Musculoskeletal & ROM</span>
                            <span className="material-symbols-outlined">arrow_forward</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* ================================================================== */}
                  {/* STEP 3: MUSCULOSKELETAL & ROM PAGE                                */}
                  {/* ================================================================== */}
                  {assessmentStep === 3 && (
                    <div className="bento-card col-span-12 animate-fade-in" style={{ padding: '28px' }}>
                      <div className="card-header" style={{ marginBottom: '24px' }}>
                        <div className="card-header-left">
                          <h3 style={{ fontSize: '1.3rem', fontWeight: 800 }}>Step 3: Musculoskeletal & Range of Motion (ROM)</h3>
                          <p>Measure joint angles, manual muscle strength (MMT), pain levels, and physical edema ratings.</p>
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px', marginBottom: '24px' }}>
                        {/* Knee & Hip Flexion */}
                        <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '20px' }}>
                          <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f52ba', marginBottom: '16px' }}>Joint Range of Motion</h4>

                          <div className="form-group" style={{ marginBottom: '20px' }}>
                            <label style={{ fontSize: '0.85rem', fontWeight: 700 }}>Active Knee Flexion Angle (°): <strong>{romAssessment.kneeFlexion}°</strong></label>
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
                            <label style={{ fontSize: '0.85rem', fontWeight: 700 }}>Hip Flexion Angle (°)</label>
                            <div className="input-with-icon">
                              <span className="material-symbols-outlined">accessibility_new</span>
                              <input
                                type="text"
                                className="modern-input"
                                value={romAssessment.hipFlexion}
                                onChange={(e) => setRomAssessment((p) => ({ ...p, hipFlexion: e.target.value }))}
                                placeholder="e.g. 105°"
                              />
                            </div>
                          </div>
                        </div>

                        {/* MMT & Pain Score Card */}
                        <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '16px', padding: '20px' }}>
                          <h4 style={{ fontSize: '0.95rem', fontWeight: 800, color: '#0f52ba', marginBottom: '16px' }}>Muscle Strength & Pain Assessment</h4>

                          <div className="form-group" style={{ marginBottom: '20px' }}>
                            <label style={{ fontSize: '0.85rem', fontWeight: 700 }}>Current Pain Level (0-10 Scale): <strong>{romAssessment.painScore} / 10</strong></label>
                            <input
                              type="range"
                              min="0"
                              max="10"
                              className="fim-range-slider"
                              style={{ accentColor: romAssessment.painScore > 6 ? '#ef4444' : '#f59e0b' }}
                              value={romAssessment.painScore}
                              onChange={(e) => setRomAssessment((prev) => ({ ...prev, painScore: Number(e.target.value) }))}
                            />
                            <span style={{ fontSize: '0.78rem', color: romAssessment.painScore > 6 ? '#dc2626' : '#059669', fontWeight: 600, marginTop: '4px', display: 'block' }}>
                              {romAssessment.painScore <= 3 ? 'Mild Pain (Controlled)' : romAssessment.painScore <= 6 ? 'Moderate Pain (Monitored)' : 'Severe Pain (Requires Review)'}
                            </span>
                          </div>

                          <div className="form-group">
                            <label style={{ fontSize: '0.85rem', fontWeight: 700 }}>Manual Muscle Testing (MMT Grade)</label>
                            <div className="input-with-icon">
                              <span className="material-symbols-outlined">fitness_center</span>
                              <input
                                type="text"
                                className="modern-input"
                                value={romAssessment.mmtScore}
                                onChange={(e) => setRomAssessment((p) => ({ ...p, mmtScore: e.target.value }))}
                                placeholder="e.g. 4/5 (Good)"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Pain Location & Edema */}
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px', marginBottom: '24px' }}>
                        <div className="form-group">
                          <label style={{ fontSize: '0.85rem', fontWeight: 700 }}>Pain Location & Characteristics</label>
                          <textarea
                            className="modern-select no-icon"
                            rows="3"
                            style={{ fontSize: '0.85rem' }}
                            value={romAssessment.painLocation}
                            onChange={(e) => setRomAssessment((p) => ({ ...p, painLocation: e.target.value }))}
                          />
                        </div>

                        <div className="form-group">
                          <label style={{ fontSize: '0.85rem', fontWeight: 700 }}>Edema & Swelling Observation</label>
                          <textarea
                            className="modern-select no-icon"
                            rows="3"
                            style={{ fontSize: '0.85rem' }}
                            value={romAssessment.edema}
                            onChange={(e) => setRomAssessment((p) => ({ ...p, edema: e.target.value }))}
                          />
                        </div>
                      </div>

                      {/* Step 3 Footer Navigation */}
                      <div className="form-step-nav-bar">
                        <button className="btn-signout" onClick={() => setAssessmentStep(2)}>
                          <span className="material-symbols-outlined">arrow_back</span>
                          <span>Back: FIM Scores</span>
                        </button>
                        <button className="modern-submit-btn" style={{ width: 'auto', padding: '10px 24px', marginTop: 0 }} onClick={() => setAssessmentStep(4)}>
                          <span>Next: Goals & Discharge Plan</span>
                          <span className="material-symbols-outlined">arrow_forward</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {/* ================================================================== */}
                  {/* STEP 4: GOALS & DISCHARGE PLAN PAGE                                */}
                  {/* ================================================================== */}
                  {assessmentStep === 4 && (
                    <div className="bento-card col-span-12 animate-fade-in" style={{ padding: '28px' }}>
                      <div className="card-header" style={{ marginBottom: '24px' }}>
                        <div className="card-header-left">
                          <h3 style={{ fontSize: '1.3rem', fontWeight: 800 }}>Step 4: Goals & Discharge Plan</h3>
                          <p>Define short-term and long-term milestones, target discharge destination, and clinical physiatrist summary.</p>
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px', marginBottom: '24px' }}>
                        <div className="form-group">
                          <label style={{ fontSize: '0.85rem', fontWeight: 700 }}>Short-Term Goal (2 Weeks)</label>
                          <textarea
                            className="modern-select no-icon"
                            rows="3"
                            style={{ fontSize: '0.85rem' }}
                            value={romAssessment.shortTermGoal}
                            onChange={(e) => setRomAssessment((prev) => ({ ...prev, shortTermGoal: e.target.value }))}
                          />
                        </div>

                        <div className="form-group">
                          <label style={{ fontSize: '0.85rem', fontWeight: 700 }}>Long-Term Goal (6 Weeks)</label>
                          <textarea
                            className="modern-select no-icon"
                            rows="3"
                            style={{ fontSize: '0.85rem' }}
                            value={romAssessment.longTermGoal}
                            onChange={(e) => setRomAssessment((prev) => ({ ...prev, longTermGoal: e.target.value }))}
                          />
                        </div>
                      </div>

                      {/* Discharge Details */}
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '24px' }}>
                        <div className="form-group">
                          <label style={{ fontSize: '0.82rem', fontWeight: 700 }}>Discharge Destination</label>
                          <div className="input-with-icon">
                            <span className="material-symbols-outlined">home</span>
                            <input
                              type="text"
                              className="modern-input"
                              value={dischargePlan.dischargeDestination}
                              onChange={(e) => setDischargePlan((p) => ({ ...p, dischargeDestination: e.target.value }))}
                            />
                          </div>
                        </div>

                        <div className="form-group">
                          <label style={{ fontSize: '0.82rem', fontWeight: 700 }}>Target Discharge Date</label>
                          <div className="input-with-icon">
                            <span className="material-symbols-outlined">event</span>
                            <input
                              type="date"
                              className="modern-input"
                              value={dischargePlan.targetDate}
                              onChange={(e) => setDischargePlan((p) => ({ ...p, targetDate: e.target.value }))}
                            />
                          </div>
                        </div>
                      </div>

                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px', marginBottom: '24px' }}>
                        <div className="form-group">
                          <label style={{ fontSize: '0.85rem', fontWeight: 700 }}>Caregiver & Family Support Status</label>
                          <textarea
                            className="modern-select no-icon"
                            rows="2"
                            style={{ fontSize: '0.85rem' }}
                            value={dischargePlan.caregiverSupport}
                            onChange={(e) => setDischargePlan((p) => ({ ...p, caregiverSupport: e.target.value }))}
                          />
                        </div>

                        <div className="form-group">
                          <label style={{ fontSize: '0.85rem', fontWeight: 700 }}>Durable Medical Equipment (DME) Needed</label>
                          <textarea
                            className="modern-select no-icon"
                            rows="2"
                            style={{ fontSize: '0.85rem' }}
                            value={dischargePlan.equipmentNeeded}
                            onChange={(e) => setDischargePlan((p) => ({ ...p, equipmentNeeded: e.target.value }))}
                          />
                        </div>
                      </div>

                      <div className="form-group" style={{ marginBottom: '24px' }}>
                        <label style={{ fontSize: '0.85rem', fontWeight: 700 }}>Physiatrist Summary & Clinical Notes</label>
                        <textarea
                          className="modern-select no-icon"
                          rows="3"
                          style={{ fontSize: '0.85rem' }}
                          value={romAssessment.clinicalNotes}
                          onChange={(e) => setRomAssessment((prev) => ({ ...prev, clinicalNotes: e.target.value }))}
                        />
                      </div>

                      {/* Step 4 Footer Navigation */}
                      <div className="form-step-nav-bar">
                        <button className="btn-signout" onClick={() => setAssessmentStep(3)}>
                          <span className="material-symbols-outlined">arrow_back</span>
                          <span>Back: Musculoskeletal & ROM</span>
                        </button>
                        <button className="modern-submit-btn" style={{ width: 'auto', padding: '10px 28px', marginTop: 0 }} onClick={() => setShowEvalModal(true)}>
                          <span className="material-symbols-outlined">check_circle</span>
                          <span>Complete Evaluation</span>
                        </button>
                      </div>
                    </div>
                  )}
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
                             <CustomSelect
                              name="status"
                              value={newPatientForm.status}
                              onChange={handleNewPatientChange}
                              options={[
                                { value: 'Inpatient', label: 'Inpatient' },
                                { value: 'Outpatient', label: 'Outpatient' },
                                { value: 'Critical', label: 'Critical' },
                                { value: 'Discharged', label: 'Discharged' },
                              ]}
                            />
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
                <div className="col-span-12" style={{ position: 'relative' }}>

                  {/* ── Filter Modal Popup ── */}
                  {showScheduleFilter && createPortal(
                    <div
                      style={{
                        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                        width: '100vw', height: '100vh', zIndex: 99999,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        background: 'rgba(15,23,42,0.65)', backdropFilter: 'blur(8px)',
                        padding: '16px', boxSizing: 'border-box'
                      }}
                      onClick={() => setShowScheduleFilter(false)}
                    >
                      <div
                        style={{
                          background: '#ffffff', borderRadius: '24px', padding: '32px',
                          width: '100%', maxWidth: '480px', maxHeight: '85vh', overflowY: 'auto',
                          boxShadow: '0 24px 64px rgba(15,52,186,0.25)',
                          animation: 'fadeSlideIn 0.25s ease'
                        }}
                        onClick={e => e.stopPropagation()}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                          <div>
                            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>Filter Schedule</h3>
                            <p style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '2px' }}>Narrow down sessions by therapist, type, or status</p>
                          </div>
                          <button
                            onClick={() => setShowScheduleFilter(false)}
                            style={{ background: '#f1f5f9', border: 'none', borderRadius: '50%', width: '36px', height: '36px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                          >
                            <span className="material-symbols-outlined" style={{ fontSize: '18px', color: '#64748b' }}>close</span>
                          </button>
                        </div>

                        {/* Search */}
                        <div style={{ marginBottom: '16px' }}>
                          <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '8px' }}>Search Patient / Session</label>
                          <div style={{ position: 'relative' }}>
                            <span className="material-symbols-outlined" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', fontSize: '18px', color: '#94a3b8' }}>search</span>
                            <input
                              type="text"
                              placeholder="e.g. Eleanor Vance, Gait Training..."
                              value={scheduleFilters.search}
                              onChange={e => setScheduleFilters(f => ({ ...f, search: e.target.value }))}
                              style={{ width: '100%', padding: '10px 14px 10px 40px', borderRadius: '10px', border: '1.5px solid #e2e8f0', fontSize: '0.88rem', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit', transition: 'border 0.15s' }}
                              onFocus={e => e.target.style.borderColor = '#0f52ba'}
                              onBlur={e => e.target.style.borderColor = '#e2e8f0'}
                            />
                          </div>
                        </div>

                        {/* Therapist Filter */}
                        <div style={{ marginBottom: '16px' }}>
                          <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '8px' }}>Therapist / Practitioner</label>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                            {uniqueTherapists.map(t => (
                              <button
                                key={t}
                                onClick={() => setScheduleFilters(f => ({ ...f, therapist: t }))}
                                style={{
                                  padding: '6px 14px', borderRadius: '50px', border: '1.5px solid',
                                  borderColor: scheduleFilters.therapist === t ? '#0f52ba' : '#e2e8f0',
                                  background: scheduleFilters.therapist === t ? 'linear-gradient(135deg,#0f52ba,#2563eb)' : '#f8fafc',
                                  color: scheduleFilters.therapist === t ? '#fff' : '#374151',
                                  fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer', transition: 'all 0.15s'
                                }}
                              >
                                {t}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Type Filter */}
                        <div style={{ marginBottom: '16px' }}>
                          <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '8px' }}>Session Type</label>
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                            {uniqueTypes.map(t => (
                              <button
                                key={t}
                                onClick={() => setScheduleFilters(f => ({ ...f, type: t }))}
                                style={{
                                  padding: '6px 14px', borderRadius: '50px', border: '1.5px solid',
                                  borderColor: scheduleFilters.type === t ? '#7c3aed' : '#e2e8f0',
                                  background: scheduleFilters.type === t ? 'linear-gradient(135deg,#7c3aed,#8b5cf6)' : '#f8fafc',
                                  color: scheduleFilters.type === t ? '#fff' : '#374151',
                                  fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer', transition: 'all 0.15s'
                                }}
                              >
                                {t}
                              </button>
                            ))}
                          </div>
                        </div>

                        {/* Status Filter */}
                        <div style={{ marginBottom: '28px' }}>
                          <label style={{ fontSize: '0.78rem', fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '8px' }}>Session Status</label>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            {['All', 'Confirmed', 'Pending', 'Cancelled'].map(s => {
                              const col = s === 'Confirmed' ? '#16a34a' : s === 'Pending' ? '#d97706' : s === 'Cancelled' ? '#dc2626' : '#0f52ba'
                              const active = scheduleFilters.status === s
                              return (
                                <button
                                  key={s}
                                  onClick={() => setScheduleFilters(f => ({ ...f, status: s }))}
                                  style={{
                                    padding: '6px 14px', borderRadius: '50px', border: `1.5px solid ${active ? col : '#e2e8f0'}`,
                                    background: active ? col : '#f8fafc',
                                    color: active ? '#fff' : '#374151',
                                    fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer', transition: 'all 0.15s'
                                  }}
                                >
                                  {s}
                                </button>
                              )
                            })}
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div style={{ display: 'flex', gap: '12px' }}>
                          <button
                            onClick={() => { setScheduleFilters({ therapist: 'All', type: 'All', status: 'All', search: '' }) }}
                            style={{ flex: 1, padding: '10px 0', borderRadius: '10px', border: '1.5px solid #e2e8f0', background: '#f8fafc', color: '#64748b', fontWeight: 700, fontSize: '0.88rem', cursor: 'pointer' }}
                          >
                            Clear All Filters
                          </button>
                          <button
                            onClick={() => setShowScheduleFilter(false)}
                            style={{ flex: 2, padding: '10px 0', borderRadius: '10px', border: 'none', background: 'linear-gradient(135deg,#0f52ba,#00b4d8)', color: '#fff', fontWeight: 800, fontSize: '0.9rem', cursor: 'pointer', boxShadow: '0 4px 14px rgba(15,82,186,0.3)' }}
                          >
                            Apply & View Results ({filteredSchedule.length})
                          </button>
                        </div>
                      </div>
                    </div>,
                    document.body
                  )}

                  {/* ── Session Detail Popup ── */}
                  {showSessionDetail && selectedSession && createPortal(
                    <div
                      style={{
                        position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                        width: '100vw', height: '100vh', zIndex: 99999,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        background: 'rgba(15,23,42,0.65)', backdropFilter: 'blur(8px)',
                        padding: '16px', boxSizing: 'border-box'
                      }}
                      onClick={() => setShowSessionDetail(false)}
                    >
                      <div
                        style={{
                          background: '#ffffff', borderRadius: '24px', padding: '0',
                          width: '100%', maxWidth: '520px', maxHeight: '85vh', overflowY: 'auto',
                          boxShadow: '0 32px 80px rgba(15,52,186,0.25)',
                          animation: 'fadeSlideIn 0.25s ease'
                        }}
                        onClick={e => e.stopPropagation()}
                      >
                        {/* Header Banner */}
                        <div style={{
                          background: SESSION_TYPE_COLORS[selectedSession.type]?.bg || '#f8fafc',
                          borderBottom: `3px solid ${SESSION_TYPE_COLORS[selectedSession.type]?.dot || '#0f52ba'}`,
                          padding: '28px 28px 20px'
                        }}>
                          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                            <div>
                              <span style={{
                                display: 'inline-flex', alignItems: 'center', gap: '6px',
                                background: SESSION_TYPE_COLORS[selectedSession.type]?.dot || '#0f52ba',
                                color: '#fff', borderRadius: '50px', padding: '4px 12px',
                                fontSize: '0.72rem', fontWeight: 800, letterSpacing: '0.05em', marginBottom: '10px'
                              }}>
                                <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>medical_services</span>
                                {selectedSession.type}
                              </span>
                              <h2 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0f172a', lineHeight: 1.3 }}>{selectedSession.title}</h2>
                            </div>
                            <button
                              onClick={() => setShowSessionDetail(false)}
                              style={{ background: 'rgba(255,255,255,0.8)', border: 'none', borderRadius: '50%', width: '36px', height: '36px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}
                            >
                              <span className="material-symbols-outlined" style={{ fontSize: '18px', color: '#374151' }}>close</span>
                            </button>
                          </div>
                        </div>

                        {/* Details Grid */}
                        <div style={{ padding: '24px 28px' }}>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '20px' }}>
                            {[
                              { icon: 'schedule', label: 'Time', value: selectedSession.time },
                              { icon: 'timelapse', label: 'Duration', value: selectedSession.duration },
                              { icon: 'person', label: 'Patient', value: selectedSession.patient },
                              { icon: 'stethoscope', label: 'Practitioner', value: selectedSession.therapist },
                              { icon: 'meeting_room', label: 'Room / Location', value: selectedSession.room },
                              { icon: 'check_circle', label: 'Status', value: selectedSession.status },
                            ].map(({ icon, label, value }) => (
                              <div key={label} style={{ background: '#f8fafc', borderRadius: '12px', padding: '14px 16px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                                  <span className="material-symbols-outlined" style={{ fontSize: '16px', color: '#0f52ba' }}>{icon}</span>
                                  <span style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</span>
                                </div>
                                <p style={{
                                  fontSize: '0.9rem', fontWeight: 700, color:
                                    value === 'Confirmed' ? '#16a34a' : value === 'Cancelled' ? '#dc2626' : value === 'Pending' ? '#d97706' : '#0f172a'
                                }}>{value}</p>
                              </div>
                            ))}
                          </div>

                          {/* Clinical Notes */}
                          <div style={{ background: '#f0f5ff', borderRadius: '12px', padding: '16px', border: '1px solid #cbd5e1', marginBottom: '20px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
                              <span className="material-symbols-outlined" style={{ fontSize: '16px', color: '#0f52ba' }}>clinical_notes</span>
                              <span style={{ fontSize: '0.78rem', fontWeight: 800, color: '#0f52ba', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Clinical Notes</span>
                            </div>
                            <p style={{ fontSize: '0.88rem', color: '#1e3a5f', lineHeight: 1.6 }}>{selectedSession.notes}</p>
                          </div>

                          {/* Action Buttons */}
                          <div style={{ display: 'flex', gap: '10px' }}>
                            <button
                              onClick={() => { setSelectedSession(s => ({ ...s, status: 'Confirmed' })) }}
                              style={{ flex: 1, padding: '10px 0', borderRadius: '10px', border: 'none', background: '#dcfce7', color: '#16a34a', fontWeight: 800, fontSize: '0.85rem', cursor: 'pointer' }}
                            >
                              <span className="material-symbols-outlined" style={{ fontSize: '16px', verticalAlign: 'middle', marginRight: '4px' }}>check_circle</span>
                              Confirm
                            </button>
                            <button
                              onClick={() => { setSelectedSession(s => ({ ...s, status: 'Cancelled' })) }}
                              style={{ flex: 1, padding: '10px 0', borderRadius: '10px', border: 'none', background: '#fee2e2', color: '#dc2626', fontWeight: 800, fontSize: '0.85rem', cursor: 'pointer' }}
                            >
                              <span className="material-symbols-outlined" style={{ fontSize: '16px', verticalAlign: 'middle', marginRight: '4px' }}>cancel</span>
                              Cancel
                            </button>
                            <button
                              onClick={() => { setSelectedPatientId(selectedSession.patient); setActiveTab('assessment'); setShowSessionDetail(false) }}
                              style={{ flex: 1, padding: '10px 0', borderRadius: '10px', border: 'none', background: 'linear-gradient(135deg,#0f52ba,#2563eb)', color: '#fff', fontWeight: 800, fontSize: '0.85rem', cursor: 'pointer' }}
                            >
                              <span className="material-symbols-outlined" style={{ fontSize: '16px', verticalAlign: 'middle', marginRight: '4px' }}>assignment</span>
                              Assess FIM
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>,
                    document.body
                  )}

                  {/* ── Schedule Header Card ── */}
                  <div className="bento-card col-span-12" style={{ marginBottom: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
                      <div>
                        <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>Full Facility Therapy Schedule</h3>
                        <p style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '2px' }}>
                          Showing <strong>{filteredSchedule.length}</strong> of <strong>{adminSchedule.length}</strong> sessions today
                          {activeFilterCount > 0 && <span style={{ marginLeft: '8px', background: '#0f52ba', color: '#fff', borderRadius: '50px', padding: '2px 8px', fontSize: '0.72rem', fontWeight: 800 }}>{activeFilterCount} filter{activeFilterCount > 1 ? 's' : ''} active</span>}
                        </p>
                      </div>
                      <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                        {activeFilterCount > 0 && (
                          <button
                            onClick={() => setScheduleFilters({ therapist: 'All', type: 'All', status: 'All', search: '' })}
                            style={{ padding: '8px 16px', borderRadius: '50px', border: '1.5px solid #e2e8f0', background: '#f8fafc', color: '#64748b', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                          >
                            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>filter_list_off</span>
                            Clear Filters
                          </button>
                        )}
                        <button
                          onClick={() => setShowScheduleFilter(true)}
                          style={{
                            display: 'inline-flex', alignItems: 'center', gap: '8px',
                            padding: '10px 22px', borderRadius: '50px', border: 'none',
                            background: activeFilterCount > 0
                              ? 'linear-gradient(135deg,#7c3aed,#8b5cf6)'
                              : 'linear-gradient(135deg,#0f52ba,#00b4d8)',
                            color: '#fff', fontSize: '0.9rem', fontWeight: 800, cursor: 'pointer',
                            boxShadow: '0 4px 14px rgba(15,82,186,0.35)'
                          }}
                        >
                          <span className="material-symbols-outlined">filter_list</span>
                          Filter Schedule
                          {activeFilterCount > 0 && <span style={{ background: 'rgba(255,255,255,0.25)', borderRadius: '50%', width: '20px', height: '20px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.72rem', fontWeight: 900 }}>{activeFilterCount}</span>}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* ── Schedule Session Cards ── */}
                  {filteredSchedule.length === 0 ? (
                    <div className="bento-card col-span-12" style={{ textAlign: 'center', padding: '48px', color: '#94a3b8' }}>
                      <span className="material-symbols-outlined" style={{ fontSize: '48px', display: 'block', marginBottom: '12px' }}>event_busy</span>
                      <h4 style={{ fontWeight: 700, color: '#64748b' }}>No sessions match your filters</h4>
                      <p style={{ fontSize: '0.85rem', marginTop: '4px' }}>Try adjusting or clearing the active filters</p>
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {filteredSchedule.map((item) => {
                        const typeStyle = SESSION_TYPE_COLORS[item.type] || { bg: '#f8fafc', color: '#374151', dot: '#94a3b8' }
                        const statusColor = item.status === 'Confirmed' ? '#16a34a' : item.status === 'Cancelled' ? '#dc2626' : '#d97706'
                        const statusBg = item.status === 'Confirmed' ? '#dcfce7' : item.status === 'Cancelled' ? '#fee2e2' : '#fef3c7'
                        return (
                          <div
                            key={item.id}
                            className="bento-card col-span-12"
                            style={{
                              padding: '20px 24px', cursor: 'pointer', transition: 'all 0.2s ease',
                              display: 'flex', gap: '20px', alignItems: 'center'
                            }}
                            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(15,82,186,0.12)' }}
                            onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '' }}
                            onClick={() => { setSelectedSession(item); setShowSessionDetail(true) }}
                          >
                            {/* Time Badge */}
                            <div style={{
                              minWidth: '72px', textAlign: 'center', background: '#f8fafc',
                              borderRadius: '12px', padding: '12px 8px', flexShrink: 0
                            }}>
                              <strong style={{ display: 'block', fontSize: '1.15rem', color: '#0f172a', fontFamily: 'var(--font-mono)' }}>
                                {item.time.split(' ')[0]}
                              </strong>
                              <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700 }}>{item.time.split(' ')[1]}</span>
                            </div>

                            {/* Session Info */}
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', flexWrap: 'wrap' }}>
                                <h4 style={{ fontSize: '0.98rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>{item.title}</h4>
                                <span style={{ background: typeStyle.bg, color: typeStyle.color, borderRadius: '50px', padding: '2px 10px', fontSize: '0.72rem', fontWeight: 800 }}>{item.type}</span>
                              </div>
                              <div style={{ display: 'flex', gap: '16px', fontSize: '0.82rem', color: '#64748b', flexWrap: 'wrap' }}>
                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                  <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>person</span>
                                  {item.patient}
                                </span>
                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                  <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>stethoscope</span>
                                  {item.therapist}
                                </span>
                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                  <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>meeting_room</span>
                                  {item.room}
                                </span>
                                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                                  <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>timelapse</span>
                                  {item.duration}
                                </span>
                              </div>
                            </div>

                            {/* Status + Arrow */}
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexShrink: 0 }}>
                              <span style={{ background: statusBg, color: statusColor, borderRadius: '50px', padding: '5px 14px', fontSize: '0.78rem', fontWeight: 800 }}>
                                {item.status}
                              </span>
                              <span className="material-symbols-outlined" style={{ fontSize: '20px', color: '#cbd5e1' }}>chevron_right</span>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 5: CLINICAL ADMIN & FACILITY SETTINGS */}
              {activeTab === 'settings' && (
                <div className="bento-grid">
                  {/* Admin Settings Banner */}
                  <div className="bento-card col-span-12" style={{ background: 'linear-gradient(135deg,#0f172a,#1e3a5f)', color: '#fff', padding: '28px 32px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px' }}>
                      <div>
                        <span style={{ background: 'rgba(255,255,255,0.15)', padding: '4px 14px', borderRadius: '50px', fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                          Clinical Administration
                        </span>
                        <h2 style={{ fontSize: '1.55rem', fontWeight: 900, marginTop: '10px', color: '#fff' }}>Facility & Practitioner Settings</h2>
                        <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.88rem', marginTop: '4px' }}>
                          Configure facility protocols, practitioner credentials, EHR integrations, and security policies.
                        </p>
                      </div>
                      <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                        {[
                          { label: 'Licensed Beds', value: '120', icon: 'local_hospital', bg: 'rgba(255,255,255,0.15)' },
                          { label: 'Active Staff', value: '15 PT/OT', icon: 'badge', bg: 'rgba(34,197,94,0.2)' },
                          { label: 'EHR Status', value: 'Syncing', icon: 'sync', bg: 'rgba(59,130,246,0.2)' },
                        ].map(s => (
                          <div key={s.label} style={{ background: s.bg, backdropFilter: 'blur(8px)', borderRadius: '14px', padding: '14px 18px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.15)', minWidth: '95px' }}>
                            <span className="material-symbols-outlined" style={{ fontSize: '18px', color: 'rgba(255,255,255,0.9)', display: 'block', marginBottom: '3px' }}>{s.icon}</span>
                            <strong style={{ fontSize: '1.15rem', fontWeight: 900, color: '#fff', display: 'block', lineHeight: 1 }}>{s.value}</strong>
                            <span style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.7)', fontWeight: 700, textTransform: 'uppercase' }}>{s.label}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Main Settings Card Container */}
                  <div className="bento-card col-span-12" style={{ padding: '28px' }}>
                    <div style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '16px', marginBottom: '24px' }}>
                      <h2 style={{ fontSize: '1.3rem', fontWeight: 900, color: '#0f172a', margin: 0 }}>Practitioner Profile & Facility Preferences</h2>
                      <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '4px' }}>Logged in as lead clinical admin <strong>{sessionUser.name}</strong> ({sessionUser.specialization})</p>
                    </div>

                    {/* Section 1: Practitioner Credentials */}
                    <div style={{ marginBottom: '32px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                        <span className="material-symbols-outlined" style={{ fontSize: '20px', color: '#0f52ba' }}>badge</span>
                        <h3 style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0f52ba', textTransform: 'uppercase', letterSpacing: '0.07em', margin: 0 }}>Practitioner Credentials & Profile</h3>
                      </div>
                      <form
                        onSubmit={(e) => {
                          e.preventDefault()
                          setSessionUser(prev => ({
                            ...prev,
                            name: adminProfileForm.name,
                            email: adminProfileForm.email,
                            facility: adminProfileForm.facility,
                            specialization: adminProfileForm.specialization
                          }))
                          triggerToast('Practitioner credentials & profile saved successfully!')
                        }}
                        style={{ background: '#f8fafc', borderRadius: '18px', padding: '22px', border: '1px solid #e2e8f0' }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '18px', marginBottom: '20px' }}>
                          <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'linear-gradient(135deg,#0f52ba,#2563eb)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', fontWeight: 900, flexShrink: 0, boxShadow: '0 4px 14px rgba(15,82,186,0.3)' }}>
                            {adminProfileForm.name.split(' ').map(n => n[0]).join('')}
                          </div>
                          <div>
                            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>{adminProfileForm.name}</div>
                            <div style={{ fontSize: '0.85rem', color: '#64748b' }}>{adminProfileForm.specialization} · NPI #1982349012</div>
                            <div style={{ display: 'flex', gap: '8px', marginTop: '6px' }}>
                              <span style={{ background: '#e0f2fe', color: '#0369a1', borderRadius: '50px', padding: '2px 10px', fontSize: '0.72rem', fontWeight: 800 }}>Lead Practitioner</span>
                              <span style={{ background: '#f0fdf4', color: '#16a34a', borderRadius: '50px', padding: '2px 10px', fontSize: '0.72rem', fontWeight: 800 }}>Active License</span>
                            </div>
                          </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '14px', marginBottom: '16px' }}>
                          <div>
                            <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '4px' }}>Practitioner Name</label>
                            <input className="modern-input" value={adminProfileForm.name} onChange={e => setAdminProfileForm(a => ({ ...a, name: e.target.value }))} required />
                          </div>
                          <div>
                            <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '4px' }}>Clinical Email</label>
                            <input type="email" className="modern-input" value={adminProfileForm.email} onChange={e => setAdminProfileForm(a => ({ ...a, email: e.target.value }))} required />
                          </div>
                          <div>
                            <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '4px' }}>Facility Name</label>
                            <input className="modern-input" value={adminProfileForm.facility} onChange={e => setAdminProfileForm(a => ({ ...a, facility: e.target.value }))} required />
                          </div>
                          <div>
                            <label style={{ fontSize: '0.72rem', fontWeight: 700, color: '#374151', textTransform: 'uppercase', letterSpacing: '0.05em', display: 'block', marginBottom: '4px' }}>Specialization / Role</label>
                            <input className="modern-input" value={adminProfileForm.specialization} onChange={e => setAdminProfileForm(a => ({ ...a, specialization: e.target.value }))} required />
                          </div>
                        </div>

                        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                          <button type="submit" className="modern-submit-btn" style={{ width: 'auto', padding: '10px 24px', marginTop: 0 }}>
                            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>save</span>
                            Save Practitioner Credentials
                          </button>
                        </div>
                      </form>
                    </div>

                    {/* Section 2: Clinical Protocol & Thresholds */}
                    <div style={{ marginBottom: '32px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                        <span className="material-symbols-outlined" style={{ fontSize: '20px', color: '#0f52ba' }}>tune</span>
                        <h3 style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0f52ba', textTransform: 'uppercase', letterSpacing: '0.07em', margin: 0 }}>Clinical Protocols & Alert Thresholds</h3>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                        {[
                          { key: 'painAlert', label: 'Pain Score Alert Trigger', desc: 'Alert attending therapist immediately if post-session pain exceeds 6/10' },
                          { key: 'autoFim', label: 'Auto-Schedule FIM Re-assessments', desc: 'Trigger FIM evaluation prompts automatically every 30 days of stay' },
                          { key: 'rescheduleApprove', label: 'Patient Reschedule Approval', desc: 'Require clinical staff confirmation before patient reschedule requests take effect' },
                          { key: 'physiatristSignoff', label: 'Discharge Summary Physiatrist Sign-Off', desc: 'Require digital signature from Lead Physiatrist prior to patient discharge' },
                          { key: 'complianceAlert', label: 'Home Exercise Compliance Alerts', desc: 'Notify care team if patient skips prescribed exercises 2+ days consecutively' },
                        ].map(config => {
                          const isChecked = !!adminClinicalConfigs[config.key]
                          return (
                            <div key={config.key} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 18px', background: '#f8fafc', borderRadius: '14px', border: '1px solid #e2e8f0' }}>
                              <div>
                                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f172a' }}>{config.label}</div>
                                <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '2px' }}>{config.desc}</div>
                              </div>
                              <div
                                onClick={() => {
                                  setAdminClinicalConfigs(prev => ({ ...prev, [config.key]: !prev[config.key] }))
                                  triggerToast(`Clinical protocol "${config.label}" ${!isChecked ? 'activated' : 'deactivated'}.`)
                                }}
                                style={{ width: '44px', height: '24px', borderRadius: '50px', background: isChecked ? '#0f52ba' : '#cbd5e1', padding: '3px', cursor: 'pointer', transition: 'background 0.2s', flexShrink: 0 }}
                              >
                                <div style={{ width: '18px', height: '18px', borderRadius: '50%', background: '#fff', boxShadow: '0 1px 3px rgba(0,0,0,0.2)', transition: 'transform 0.2s', transform: isChecked ? 'translateX(20px)' : 'translateX(0)' }} />
                              </div>
                            </div>
                          )
                        })}
                      </div>
                    </div>

                    {/* Section 3: EHR / EMR Integration & Data Export */}
                    <div style={{ marginBottom: '32px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                        <span className="material-symbols-outlined" style={{ fontSize: '20px', color: '#0f52ba' }}>dns</span>
                        <h3 style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0f52ba', textTransform: 'uppercase', letterSpacing: '0.07em', margin: 0 }}>EHR / EMR Integrations & HIPAA Compliance</h3>
                      </div>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px' }}>
                        <div style={{ background: '#f8fafc', borderRadius: '16px', padding: '18px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                            <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: '#eff6ff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                              <span className="material-symbols-outlined" style={{ fontSize: '22px', color: '#0f52ba' }}>cloud_done</span>
                            </div>
                            <div>
                              <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0f172a' }}>Epic Systems EMR Sync</div>
                              <div style={{ fontSize: '0.75rem', color: '#16a34a', fontWeight: 700, marginTop: '2px' }}>{lastEhrSync}</div>
                            </div>
                          </div>
                          <button
                            onClick={() => {
                              setLastEhrSync('Syncing FHIR v4 API...')
                              setTimeout(() => {
                                setLastEhrSync('Connected & Live (Just now)')
                                triggerToast('Epic Systems EHR FHIR v4 handshake verified!')
                              }, 1200)
                            }}
                            style={{ background: '#fff', border: '1.5px solid #0f52ba', borderRadius: '50px', padding: '6px 14px', fontSize: '0.75rem', fontWeight: 800, color: '#0f52ba', cursor: 'pointer' }}
                          >
                            Re-sync API
                          </button>
                        </div>

                        <div style={{ background: '#f8fafc', borderRadius: '16px', padding: '18px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                            <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: '#f5f3ff', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                              <span className="material-symbols-outlined" style={{ fontSize: '22px', color: '#7c3aed' }}>security</span>
                            </div>
                            <div>
                              <div style={{ fontSize: '0.9rem', fontWeight: 800, color: '#0f172a' }}>HIPAA Audit Trail</div>
                              <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '2px' }}>Encrypted AES-256 Logs</div>
                            </div>
                          </div>
                          <button onClick={handleExportHipaaLogs} style={{ background: '#fff', border: '1.5px solid #cbd5e1', borderRadius: '50px', padding: '6px 14px', fontSize: '0.75rem', fontWeight: 800, color: '#475569', cursor: 'pointer' }}>Export Logs CSV</button>
                        </div>
                      </div>
                    </div>
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
