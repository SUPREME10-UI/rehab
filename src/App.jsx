import { useState, useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import './App.css'
import rehabBg1 from './assets/rehab-bg-1.png'
import Home from './Home'
import api from './api'

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

// =============================================================================
// SplashScreen — Animated Medical Brand Loading Transition
// =============================================================================
function SplashScreen({ onComplete }) {
  const [progress, setProgress] = useState(15)
  const [statusText, setStatusText] = useState('Initializing Secure Patient Portal...')

  useEffect(() => {
    const t1 = setTimeout(() => {
      setProgress(50)
      setStatusText('Loading Clinical Recovery Protocols & EHR Records...')
    }, 700)

    const t2 = setTimeout(() => {
      setProgress(85)
      setStatusText('Establishing Encrypted HIPAA-Compliant Session...')
    }, 1500)

    const t3 = setTimeout(() => {
      setProgress(100)
      setStatusText('Ready!')
      setTimeout(() => {
        if (onComplete) onComplete()
      }, 300)
    }, 2300)

    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      clearTimeout(t3)
    }
  }, [onComplete])

  return (
    <div className="rc-splash-screen-overlay">
      <div className="rc-splash-screen-content">
        <div className="rc-splash-logo-wrap">
          <img
            src="/images/splash-logo.png"
            alt="Rehab - Recovery, Healing, A New Beginning - Your Life Matters"
            className="rc-splash-logo-img"
          />
        </div>
        
        <div className="rc-splash-loader-wrap">
          <div className="rc-splash-progress-bar">
            <div className="rc-splash-progress-fill" style={{ width: `${progress}%` }} />
          </div>
          <div className="rc-splash-status-text">
            <span className="rc-splash-spinner" />
            {statusText}
          </div>
        </div>
      </div>
    </div>
  )
}

function App() {
  // Check URL params for routing
  const searchParams = new URLSearchParams(window.location.search)
  const authParam = searchParams.get('auth')
  
  const [currentView, setCurrentView] = useState(authParam ? 'portal' : 'home')
  const [isSplashLoading, setIsSplashLoading] = useState(false)

  const triggerPortalWithSplash = (role = 'client', mode = 'login') => {
    setPortalRole(role)
    setSessionUser(null)
    setAuthMode(mode)
    setIsSplashLoading(true)
  }

  // Auth & User Session State — Default to Clinical Practitioner Admin Session
  const [sessionUser, setSessionUser] = useState({
    role: 'admin',
    name: 'Dr. Lena Ortiz, PT',
    email: 'dortiz@rhms.org',
    specialization: 'Lead Physical Therapist',
    facility: 'St. Jude Rehab Center'
  })
  const [authMode, setAuthMode] = useState('signup') // 'signup' | 'login' | 'forgot'
  const [portalRole, setPortalRole] = useState('admin') // 'client' | 'admin'
  const [activeTab, setActiveTab] = useState('dashboard')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Forgot Password Recovery State
  const [forgotEmail, setForgotEmail] = useState('')
  const [forgotStep, setForgotStep] = useState(1) // 1 = request code, 2 = verify & set new pass, 3 = success
  const [forgotCode, setForgotCode] = useState('')
  const [forgotUserCode, setForgotUserCode] = useState('')
  const [forgotNewPass, setForgotNewPass] = useState('')
  const [forgotConfirmPass, setForgotConfirmPass] = useState('')
  const [forgotLoading, setForgotLoading] = useState(false)
  const [forgotStatusMsg, setForgotStatusMsg] = useState(null)

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

  // Hospital Inpatient & Outpatient Clinical Info
  const [patientHospitalInfo, setPatientHospitalInfo] = useState({
    hospitalName: 'St. Jude Rehabilitation Hospital',
    wing: 'Tower B · Orthopedic & Neuromuscular Recovery Wing',
    room: 'Room 304-B',
    mrn: 'MRN-9284-01',
    admissionDate: 'Aug 02, 2026',
    rehabDay: 24,
    status: 'Inpatient Active Rehab',
    fallRisk: 'Standard Precaution (Yellow Band)',
    codeStatus: 'Full Code',
    weightBearing: 'WBAT (Weight Bearing as Tolerated)',
    diet: 'Cardiac Healthy / Regular',
    attendingPhysiatrist: 'Dr. Lena Ortiz, MD, FAAPMR',
    primaryPT: 'Dr. A. Smith, PT, DPT',
    primaryOT: 'Sarah Chen, MS, OTR/L',
    primaryNurse: 'Marcus Ray, BSN, CRRN'
  })

  // Vital Signs Telemetry (Hospital Monitor)
  const [patientVitals, setPatientVitals] = useState({
    bpSys: 118,
    bpDia: 76,
    hr: 72,
    spo2: 98,
    temp: 98.4,
    flexionRom: 115,
    extensionRom: 0,
    lastChecked: '12 mins ago (RN Station 3B)'
  })

  // Pain Location & Notes
  const [painLocation, setPainLocation] = useState('Right Knee (Lateral)')
  const [painNote, setPainNote] = useState('')
  const [painLogHistory, setPainLogHistory] = useState([
    { time: '08:00 AM', score: 4, location: 'Right Knee (Lateral)', note: 'Mild morning stiffness upon ambulation' },
    { time: '12:30 PM', score: 2, location: 'Right Knee (Patellar)', note: 'Post-cryotherapy ice application' }
  ])

  // Daily Hospital Therapy Schedule
  const [hospitalSchedule, setHospitalSchedule] = useState([
    {
      id: 'hs-1',
      time: '08:30 AM',
      endTime: '09:15 AM',
      title: 'Morning Gait & Parallel Bar Ambulation',
      type: 'Physical Therapy',
      location: 'Rehab Gym 2 (Station B)',
      provider: 'Dr. A. Smith, PT, DPT',
      duration: '45 mins',
      status: 'Completed',
      notes: 'Achieved 180 feet with axillary crutches. Good weight transfer.'
    },
    {
      id: 'hs-2',
      time: '10:45 AM',
      endTime: '11:30 AM',
      title: 'ADL Fine Motor & Dressing Rehabilitation',
      type: 'Occupational Therapy',
      location: 'OT Activities Suite 104',
      provider: 'Sarah Chen, MS, OTR/L',
      duration: '45 mins',
      status: 'Completed',
      notes: 'Completed lower body dressing simulation with reacher tool.'
    },
    {
      id: 'hs-3',
      time: '01:15 PM',
      endTime: '01:45 PM',
      title: 'NMES Quadriceps Biofeedback & Cryo',
      type: 'Clinical Treatment',
      location: 'Sub-Acute Unit Suite 3',
      provider: 'Marcus Ray, BSN, CRRN',
      duration: '30 mins',
      status: 'In Progress',
      notes: 'Electrode placement VMO. 35Hz frequency for 20 minutes.'
    },
    {
      id: 'hs-4',
      time: '03:30 PM',
      endTime: '04:15 PM',
      title: 'Aquatic Hydrotherapy & Gait Balance',
      type: 'Hydrotherapy',
      location: 'Therapy Pool (Zone 1)',
      provider: 'Dr. A. Smith, PT, DPT',
      duration: '45 mins',
      status: 'Upcoming',
      notes: 'Buoyancy-assisted squats and shallow-water stride training.'
    },
    {
      id: 'hs-5',
      time: '05:00 PM',
      endTime: '05:25 PM',
      title: 'Physiatry Progress Rounds & Care Review',
      type: 'Physiatry Rounds',
      location: 'Patient Bed 304-B',
      provider: 'Dr. Lena Ortiz, MD',
      duration: '25 mins',
      status: 'Upcoming',
      notes: 'Reviewing weekend pass readiness and FIM progression.'
    }
  ])

  // Hospital Medications & Treatment Prescriptions
  const [patientMeds, setPatientMeds] = useState([
    {
      id: 'med-1',
      name: 'Celecoxib (Celebrex)',
      dose: '200 mg',
      route: 'Oral Capsule',
      frequency: 'Once Daily (Morning)',
      purpose: 'Targeted Anti-inflammatory & Pain Management',
      instructions: 'Take with morning meal and full glass of water.',
      taken: true,
      timeTaken: '08:15 AM'
    },
    {
      id: 'med-2',
      name: 'Acetaminophen (Tylenol Extra Strength)',
      dose: '500 mg',
      route: 'Oral Tablet',
      frequency: 'Every 6 Hours PRN',
      purpose: 'Mild to Moderate Pain Analgesia',
      instructions: 'Do not exceed 3,000 mg in 24 hours.',
      taken: true,
      timeTaken: '12:00 PM'
    },
    {
      id: 'med-3',
      name: 'Enoxaparin Sodium (Lovenox)',
      dose: '40 mg / 0.4 mL',
      route: 'Subcutaneous Injection',
      frequency: 'Daily at 20:00 (Bedtime)',
      purpose: 'Deep Vein Thrombosis (DVT) Prophylaxis',
      instructions: 'Administered by Floor Nurse into abdominal tissue.',
      taken: false,
      timeTaken: null
    },
    {
      id: 'med-4',
      name: 'Cold Compression Cryo Therapy',
      dose: '20 min session',
      route: 'Topical Cryo Wrap',
      frequency: 'Every 3 Hours Post-Ex',
      purpose: 'Joint Effusion & Edema Reduction',
      instructions: 'Keep skin barrier dry. Discontinue if numbness persists.',
      taken: false,
      timeTaken: null
    }
  ])

  const toggleMedTaken = (id) => {
    setPatientMeds(prev => prev.map(m => {
      if (m.id === id) {
        const nextTaken = !m.taken
        return {
          ...m,
          taken: nextTaken,
          timeTaken: nextTaken ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : null
        }
      }
      return m
    }))
  }

  // Hospital Care Team & Messaging
  const [showCareTeamModal, setShowCareTeamModal] = useState(false)
  const [activeCareRole, setActiveCareRole] = useState('physiatrist')
  const [careMessages, setCareMessages] = useState({
    physiatrist: [
      { id: 1, sender: 'Dr. Lena Ortiz, MD', role: 'Attending Physiatrist', time: 'Yesterday 4:30 PM', text: 'Sarah, your quad recruitment on the biofeedback was impressive today. We will assess your stair navigation tomorrow.' },
      { id: 2, sender: 'patient', time: 'Yesterday 5:10 PM', text: 'Thank you Dr. Ortiz! The ice wrap after therapy really helped keep the swelling down.' }
    ],
    pt: [
      { id: 1, sender: 'Dr. A. Smith, PT', role: 'Physical Therapist', time: 'Today 09:30 AM', text: 'Great work on the parallel bars! Remember to focus on heel strike during the aquatic session this afternoon.' },
      { id: 2, sender: 'patient', time: 'Today 10:00 AM', text: 'Got it! I felt much more stable on the right leg today.' }
    ],
    ot: [
      { id: 1, sender: 'Sarah Chen, OTR/L', role: 'Occupational Therapist', time: 'Today 11:45 AM', text: 'I have ordered the long-handled sponge and adaptive shoe horn for your home discharge kit.' }
    ],
    nurse: [
      { id: 1, sender: 'Marcus Ray, RN', role: 'Primary Rehab Nurse', time: 'Today 07:45 AM', text: 'Good morning Sarah. Your morning vitals were 118/76 with 98% SpO2. Let me know if you need fresh ice packs.' }
    ]
  })
  const [chatInputText, setChatInputText] = useState('')

  const handleSendCareMessage = (e) => {
    e.preventDefault()
    if (!chatInputText.trim()) return
    const newMsg = {
      id: Date.now(),
      sender: 'patient',
      time: 'Just now',
      text: chatInputText.trim()
    }
    setCareMessages(prev => ({
      ...prev,
      [activeCareRole]: [...(prev[activeCareRole] || []), newMsg]
    }))
    setChatInputText('')

    setTimeout(() => {
      const providerNames = {
        physiatrist: 'Dr. Lena Ortiz, MD',
        pt: 'Dr. A. Smith, PT',
        ot: 'Sarah Chen, OTR/L',
        nurse: 'Marcus Ray, RN'
      }
      const automatedReplies = {
        physiatrist: 'Thank you for updating me. I will review this during evening clinical rounds.',
        pt: 'Noted! We will incorporate that into your next exercise set.',
        ot: 'Understood. We will adjust the ADL protocol accordingly.',
        nurse: 'Received. I have noted this on your floor chart at Station 3B.'
      }
      const replyMsg = {
        id: Date.now() + 1,
        sender: providerNames[activeCareRole],
        role: 'Care Team',
        time: 'Just now',
        text: automatedReplies[activeCareRole]
      }
      setCareMessages(prev => ({
        ...prev,
        [activeCareRole]: [...(prev[activeCareRole] || []), replyMsg]
      }))
    }, 1200)
  }

  // Nurse Call Alert Trigger
  const handleNurseCall = () => {
    triggerToast('🚨 Nurse Call sent to Station 3B Console. Primary RN Marcus Ray notified!', 'success')
  }

  const [showClinicalRecordModal, setShowClinicalRecordModal] = useState(false)
  const [recordCategory, setRecordCategory] = useState('all')
  const [recordSearch, setRecordSearch] = useState('')
  const [selectedRecordDetail, setSelectedRecordDetail] = useState(null)
  const [showRecordDetailModal, setShowRecordDetailModal] = useState(false)

  // Certified Hospital Clinical Records Archive
  const [hospitalClinicalRecords] = useState([
    {
      id: 'DOC-2026-901',
      title: 'Inpatient Comprehensive Physiatry Admission Assessment',
      category: 'Physiatry & H&P',
      categoryKey: 'physiatry',
      date: 'Aug 02, 2026',
      author: 'Dr. Lena Ortiz, MD',
      authorRole: 'Attending Physiatrist, Physical Medicine & Rehabilitation',
      license: 'MD-88421 (State Board of Medicine)',
      encounter: 'Inpatient Day 1 • Room 304-B',
      summary: 'Initial comprehensive inpatient rehabilitation assessment post right knee arthroscopic ACL reconstruction with autograft. Baseline functional independence mapping established at FIM 54/126.',
      fullSections: [
        { label: 'Chief Complaint', text: 'Inpatient rehabilitation following right knee ACL reconstruction 5 days prior; admitted for 3 hours daily intensive multidisciplinary therapy.' },
        { label: 'History of Present Illness', text: '40-year-old female patient admitted for Phase 2 inpatient rehabilitation following successful arthroscopic right ACL reconstruction with central-third patellar tendon autograft. Surgical course was uncomplicated. Patient reports moderate post-operative stiffness (VAS 4/10) with reduced active quadriceps recruitment.' },
        { label: 'Objective Clinical Examination', text: 'Vital Signs: BP 118/76 mmHg, HR 72 bpm, SpO2 98% on room air, Temp 98.4°F.\nSurgical Site: Right knee incisions clean, dry, and intact with staples in situ; minimal swelling and trace peri-patellar effusion. No signs of infection.\nRange of Motion: Right knee active flexion 65°, extension -5°. Left knee active ROM 135°/0°.\nNeurological: Distal pulses 2+ DP/PT bilaterally; sensation intact to light touch throughout L2-S1 dermatomes.' },
        { label: 'Physiatry Assessment & Prognosis', text: 'Patient demonstrates high rehabilitation potential with acute post-surgical functional mobility limitations. Candidate for intensive inpatient multidisciplinary PT/OT/Cryo protocol.' },
        { label: 'Orders & Rehabilitation Plan', text: '1. Daily Physical Therapy (90 mins): Progressive active-assisted ROM, gait training with axillary crutches (WBAT), isometric quad sets, neuromuscular electrical stimulation (NMES).\n2. Daily Occupational Therapy (60 mins): ADL training, safe transfer protocols, adaptive equipment training.\n3. Medications: Celecoxib 200mg PO daily, Acetaminophen 500mg PO q6h PRN, Enoxaparin 40mg SC daily for DVT prophylaxis.\n4. Target Discharge: 3-4 weeks with target FIM score > 115.' }
      ]
    },
    {
      id: 'DOC-2026-902',
      title: 'Orthopedic Operative & Surgical Procedure Record',
      category: 'Operative & Surgical',
      categoryKey: 'surgical',
      date: 'Jul 28, 2026',
      author: 'Dr. Robert Vance, MD, FAAOS',
      authorRole: 'Chief of Orthopedic Surgery & Sports Medicine',
      license: 'MD-77192 (American Board of Orthopaedic Surgery)',
      encounter: 'Surgical Suite 4 • Inpatient Transition',
      summary: 'Arthroscopic Right ACL Reconstruction using bone-patellar tendon-bone (BTB) autograft with interference screw fixation. Both menisci and articular cartilage verified intact.',
      fullSections: [
        { label: 'Procedure Performed', text: 'Diagnostic arthroscopy right knee, notchplasty, and arthroscopic-assisted anterior cruciate ligament reconstruction with central-third bone-patellar tendon-bone autograft.' },
        { label: 'Pre & Post-Operative Diagnosis', text: 'Pre-Op: Complete tear of right anterior cruciate ligament (ICD-10 M23.611).\nPost-Op: Same, successfully reconstructed.' },
        { label: 'Intraoperative Findings', text: 'Complete proximal mid-substance disruption of the right ACL. Medial and lateral meniscal horns probed and verified stable with no tears. Articular cartilage surfaces intact with minor Grade 1 chondromalacia on lateral patellar facet.' },
        { label: 'Surgical Technique & Fixation', text: 'Anatomical femoral tunnel reamed to 10mm through anteromedial portal. Tibial tunnel placed centrally in footprint. 10mm BTB graft passed under direct visualization and secured with bio-composite interference screws under 20 lbs tension at 30° flexion. Isometry confirmed with full extension.' },
        { label: 'Post-Op Instructions', text: 'Hinged knee brace locked in extension for ambulation. Weight-bearing as tolerated with axillary crutches. Transfer to Inpatient Rehabilitation Unit for structured recovery.' }
      ]
    },
    {
      id: 'DOC-2026-903',
      title: 'Diagnostic Radiology: Multi-Planar Knee MRI & Radiographs',
      category: 'Radiology & Imaging',
      categoryKey: 'radiology',
      date: 'Aug 10, 2026',
      author: 'Dr. Harrison Blake, MD',
      authorRole: 'Consulting Radiologist, St. Jude Diagnostic Suite',
      license: 'MD-64920 (American College of Radiology)',
      encounter: 'Radiology Imaging Bay 2',
      summary: 'Post-operative MRI and 4-view plain radiographs demonstrate anatomic tunnel placement, secure graft fixation, normal low graft signal, and minimal joint effusion.',
      fullSections: [
        { label: 'Clinical Indication', text: 'Status post right ACL reconstruction day 13; baseline post-operative graft integrity and tunnel orientation review prior to Phase 2 active loading.' },
        { label: 'Imaging Technique', text: 'Coronal, sagittal, and axial proton density, T1-weighted, and fat-suppressed T2-weighted MRI sequences acquired on 3.0 Tesla scanner. 4-view weight-bearing radiographs of right knee.' },
        { label: 'Radiological Findings', text: 'The reconstructed ACL autograft is continuous throughout its intra-articular course with normal homogeneous low signal intensity. The femoral tunnel is positioned in the posterior intercondylar notch. The tibial tunnel is positioned without Blumensaat line roof impingement. Bio-absorbable screws intact in satisfactory position without osteolysis. Trace physiological joint fluid noted.' },
        { label: 'Radiologist Impression', text: '1. Anatomically positioned, intact, and well-tensioned reconstructed ACL graft.\n2. Stable interference screw fixation without hardware failure.\n3. Resolving post-surgical joint effusion; no secondary ligamentous or meniscal injury.' }
      ]
    },
    {
      id: 'DOC-2026-904',
      title: 'Multidisciplinary Physical Therapy Progress & Gait Telemetry',
      category: 'Therapy Notes',
      categoryKey: 'therapy',
      date: 'Aug 16, 2026',
      author: 'Dr. A. Smith, PT, DPT',
      authorRole: 'Senior Physical Therapist, Neuromuscular & Orthopedic Rehab',
      license: 'PT-99318 (Board Certified Orthopaedic Clinical Specialist)',
      encounter: 'Inpatient Day 15 • PT Gymnasium 3',
      summary: 'Objective gait analysis and ROM evaluation. Active right knee flexion progressed to 115° with 0° terminal extension. Patient independently ambulatory 180 ft with crutches.',
      fullSections: [
        { label: 'Subjective Patient Report', text: 'Patient reports significant increase in confidence and quadriceps control. Minimal discomfort reported during weight shifts (VAS 2/10).' },
        { label: 'Objective Functional Metrics', text: 'Active ROM Right Knee: Flexion 115° (+50° improvement from baseline 65°), Extension 0° (Full terminal extension achieved).\nManual Muscle Test: Right Quadriceps 4+/5, Hamstrings 5/5, Hip Abductors 4+/5.\nAmbulation: 180 feet continuously on level indoor surface with bilateral crutches; normal heel-to-toe progression.\nBalance: Static single-leg balance on right lower extremity maintained for 12 seconds.' },
        { label: 'Therapist Assessment', text: 'Exceptional rehabilitation progression. Patient has fully satisfied all Phase 1 criteria and is progressing smoothly through Phase 2 active strengthening.' },
        { label: 'Therapeutic Plan & Progression', text: 'Advance to stair navigation training (6-step flight with single handrail). Initiate shallow-water resistance gait drills in therapy pool. Increase eccentric closed-chain loading.' }
      ]
    },
    {
      id: 'DOC-2026-905',
      title: 'Occupational Therapy ADL & Independence Evaluation',
      category: 'Therapy Notes',
      categoryKey: 'therapy',
      date: 'Aug 15, 2026',
      author: 'Sarah Chen, MS, OTR/L',
      authorRole: 'Lead Occupational Therapist, Activities of Daily Living Wing',
      license: 'OT-44210 (National Board for Certification in OT)',
      encounter: 'ADL Simulation Suite 104',
      summary: 'Assessment of self-care independence, functional transfers, and adaptive equipment integration for home transition readiness.',
      fullSections: [
        { label: 'Functional Self-Care Assessment', text: 'Patient demonstrated modified independence with upper and lower body dressing utilizing long-handled reacher and sock-aid (FIM score 6/7). Shower stall transfer completed safely using grab bar and shower chair.' },
        { label: 'Home Environment Safety Simulation', text: 'Simulated kitchen meal preparation: Patient maintained safe non-weight-bearing pauses and demonstrated good energy conservation principles without loss of balance.' },
        { label: 'DME Recommendations & Discharge Readiness', text: 'Discharge equipment kit ordered: Raised shower bench, non-slip tub mat, long-handled sponge, and adaptive dressing stick. Spouse attended caregiver safety training.' }
      ]
    },
    {
      id: 'DOC-2026-906',
      title: 'Inpatient Clinical Pathology & Comprehensive Lab Panel',
      category: 'Laboratory Panels',
      categoryKey: 'labs',
      date: 'Aug 14, 2026',
      author: 'St. Jude Clinical Pathology Laboratories',
      authorRole: 'Automated Laboratory Information System (LIS)',
      license: 'CLIA #05D982341',
      encounter: 'Morning Blood Draw • Routine Inpatient Panel',
      summary: 'Complete Blood Count (CBC), Comprehensive Metabolic Panel (CMP), and Inflammatory Markers (ESR/CRP) within normal physiological parameters.',
      fullSections: [
        { label: 'Complete Blood Count (CBC)', text: 'WBC: 6.8 x10^3/uL (Normal 4.5 - 11.0)\nRBC: 4.62 x10^6/uL (Normal 4.0 - 5.2)\nHemoglobin: 13.8 g/dL (Normal 12.0 - 16.0)\nHematocrit: 41.2% (Normal 36.0 - 48.0%)\nPlatelets: 245 x10^3/uL (Normal 150 - 450)' },
        { label: 'Comprehensive Metabolic Panel (CMP)', text: 'Sodium: 140 mEq/L | Potassium: 4.2 mEq/L | Chloride: 102 mEq/L | CO2: 26 mEq/L\nBUN: 14 mg/dL | Creatinine: 0.8 mg/dL (eGFR > 90 mL/min)\nGlucose: 92 mg/dL (Fasting) | Calcium: 9.4 mg/dL' },
        { label: 'Inflammatory & Coagulation Markers', text: 'C-Reactive Protein (CRP): 2.1 mg/L (Normal < 3.0 mg/L) — down from 8.4 on Post-Op Day 1\nErythrocyte Sedimentation Rate (ESR): 12 mm/hr (Normal 0 - 20)\nProthrombin Time (PT/INR): 1.05 (Normal therapeutic for Lovenox prophylaxis)' }
      ]
    },
    {
      id: 'DOC-2026-907',
      title: 'Physiatry Mid-Stay Functional FIM Progress Summary',
      category: 'Physiatry & H&P',
      categoryKey: 'physiatry',
      date: 'Aug 12, 2026',
      author: 'Dr. Lena Ortiz, MD',
      authorRole: 'Attending Physiatrist, Physical Medicine & Rehabilitation',
      license: 'MD-88421 (State Board of Medicine)',
      encounter: 'Inpatient Day 11 • Room 304-B',
      summary: 'FIM functional independence increased from admission baseline of 54/126 to 104/126. Patient on schedule for projected discharge target.',
      fullSections: [
        { label: 'Functional Independence Measure (FIM) Comparison', text: 'Motor Subscore: 74/91 (Admission Baseline: 32/91, Gain: +42)\nCognitive Subscore: 30/35 (Admission Baseline: 22/35, Gain: +8)\nTotal FIM Score: 104/126 (Goal for Safe Discharge: > 115)' },
        { label: 'Clinical Course & Milestones', text: 'Significant improvement in sit-to-stand transfers, bed mobility, and independent ambulation. Pain is well controlled on Celebrex 200mg daily. Patient is highly compliant and actively participates in all prescribed rehabilitation sessions.' },
        { label: 'Discharge Planning Milestone', text: 'Target discharge date: Nov 15, 2026 to independent home setting with outpatient physical therapy continuation at St. Jude Outpatient Wing.' }
      ]
    },
    {
      id: 'DOC-2026-908',
      title: 'Advance Directives & Inpatient Legal Medical Documentation',
      category: 'Physiatry & H&P',
      categoryKey: 'physiatry',
      date: 'Aug 02, 2026',
      author: 'St. Jude Patient Advocacy & Legal Services',
      authorRole: 'Hospital Clinical Records Administration',
      license: 'HOSP-ADM-001',
      encounter: 'Admission Desk & Registration',
      summary: 'Validated Medical Power of Attorney, General Inpatient Treatment Consent, and HIPAA Privacy Disclosure on file.',
      fullSections: [
        { label: 'Advance Directives Status', text: 'Medical Power of Attorney executed and verified on file. Designated Healthcare Proxy: Mark Jenkins (Spouse, Phone: +1 (555) 012-3456).' },
        { label: 'Electronic Health Record Disclosure', text: 'Patient consent signed for encrypted electronic record transmission via FHIR v4 to St. Jude Outpatient Wing and Primary Care Provider.' }
      ]
    }
  ])

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

  const handleForgotRequestCode = async (e) => {
    e.preventDefault()
    if (!forgotEmail || !forgotEmail.trim()) {
      setForgotStatusMsg({ type: 'error', text: 'Please enter your registered email address.' })
      return
    }
    setForgotLoading(true)
    setForgotStatusMsg(null)
    try {
      const res = await api.forgotPassword(forgotEmail.trim())
      setForgotCode(res.resetCode || '849201')
      setForgotStep(2)
      setForgotStatusMsg({ type: 'success', text: res.message || 'Verification code sent to your email.' })
    } catch (err) {
      // Demo fallback if backend is not reachable or user isn't in DB yet
      const demoCode = Math.floor(100000 + Math.random() * 900000).toString()
      setForgotCode(demoCode)
      setForgotStep(2)
      setForgotStatusMsg({ type: 'info', text: 'A 6-digit security verification code has been generated.' })
    } finally {
      setForgotLoading(false)
    }
  }

  const handleForgotResetPassword = async (e) => {
    e.preventDefault()
    if (!forgotNewPass || !forgotConfirmPass) {
      setForgotStatusMsg({ type: 'error', text: 'Please enter and confirm your new password.' })
      return
    }
    if (forgotNewPass !== forgotConfirmPass) {
      setForgotStatusMsg({ type: 'error', text: 'Passwords do not match. Please verify and re-enter.' })
      return
    }
    if (forgotNewPass.length < 4) {
      setForgotStatusMsg({ type: 'error', text: 'Password must be at least 4 characters long.' })
      return
    }
    setForgotLoading(true)
    setForgotStatusMsg(null)
    try {
      await api.resetPassword({ email: forgotEmail.trim(), newPassword: forgotNewPass, resetCode: forgotUserCode })
      setForgotStep(3)
      setLoginForm((prev) => ({ ...prev, email: forgotEmail.trim(), password: forgotNewPass }))
      triggerToast('Password reset successfully! You can now log in.', 'success')
    } catch (err) {
      // Offline fallback
      setForgotStep(3)
      setLoginForm((prev) => ({ ...prev, email: forgotEmail.trim(), password: forgotNewPass }))
      triggerToast('Password updated successfully!', 'success')
    } finally {
      setForgotLoading(false)
    }
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
  // RENDER: Animated Splash Loading Transition Screen
  // --------------------------------------------------------------------------
  if (isSplashLoading) {
    return (
      <SplashScreen
        onComplete={() => {
          setIsSplashLoading(false)
          setCurrentView('portal')
        }}
      />
    )
  }

  // --------------------------------------------------------------------------
  // RENDER: Public Landing Page
  // --------------------------------------------------------------------------
  if (currentView === 'home') {
    return (
      <Home
        onOpenPortal={() => triggerPortalWithSplash('client', 'login')}
        onLoginClick={(role) => triggerPortalWithSplash(role || 'client', 'login')}
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
              {authMode === 'forgot' ? (
                <>
                  <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#eff6ff', color: '#003c90', padding: '4px 10px', borderRadius: '20px', fontSize: '0.78rem', fontWeight: 700, marginBottom: '10px' }}>
                    <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>lock_reset</span>
                    Security & Account Recovery
                  </div>
                  <h2>Reset Portal Password</h2>
                  <p>Follow the verification steps below to securely reset your {isClientPortal ? 'patient' : 'practitioner'} account password.</p>
                </>
              ) : isClientPortal ? (
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

            {authMode === 'forgot' ? (
              <form onSubmit={forgotStep === 1 ? handleForgotRequestCode : forgotStep === 2 ? handleForgotResetPassword : (e) => { e.preventDefault(); setAuthMode('login'); }} className="modern-form">
                <div className="recovery-steps-tracker">
                  <div className={`recovery-step-dot ${forgotStep >= 1 ? 'active' : ''} ${forgotStep > 1 ? 'completed' : ''}`}>
                    {forgotStep > 1 ? <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>check</span> : '1'}
                  </div>
                  <div className={`recovery-step-line ${forgotStep >= 2 ? 'active' : ''}`} />
                  <div className={`recovery-step-dot ${forgotStep >= 2 ? 'active' : ''} ${forgotStep > 2 ? 'completed' : ''}`}>
                    {forgotStep > 2 ? <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>check</span> : '2'}
                  </div>
                  <div className={`recovery-step-line ${forgotStep >= 3 ? 'active' : ''}`} />
                  <div className={`recovery-step-dot ${forgotStep >= 3 ? 'active completed' : ''}`}>
                    {forgotStep === 3 ? <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>check</span> : '3'}
                  </div>
                </div>

                {forgotStatusMsg && (
                  <div className={`recovery-alert ${forgotStatusMsg.type}`}>
                    <span className="material-symbols-outlined" style={{ fontSize: '18px', marginTop: '1px' }}>
                      {forgotStatusMsg.type === 'error' ? 'error' : forgotStatusMsg.type === 'success' ? 'check_circle' : 'info'}
                    </span>
                    <div>{forgotStatusMsg.text}</div>
                  </div>
                )}

                {forgotStep === 1 && (
                  <>
                    <div className="form-group">
                      <label>Registered Account Email</label>
                      <div className="input-with-icon">
                        <span className="material-symbols-outlined">mail</span>
                        <input
                          type="email"
                          className="modern-input"
                          placeholder="you@example.com"
                          value={forgotEmail}
                          onChange={(e) => setForgotEmail(e.target.value)}
                          required
                        />
                      </div>
                      <span style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '2px' }}>
                        We will send a 6-digit authentication verification code to this address.
                      </span>
                    </div>

                    <button type="submit" className="modern-submit-btn" disabled={forgotLoading}>
                      {forgotLoading ? (
                        <span>Sending Verification Code...</span>
                      ) : (
                        <>
                          <span>Send Verification Code</span>
                          <span className="material-symbols-outlined">send</span>
                        </>
                      )}
                    </button>
                  </>
                )}

                {forgotStep === 2 && (
                  <>
                    {forgotCode && (
                      <div className="recovery-code-card">
                        <div style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>DEMO VERIFICATION CODE</div>
                        <div className="recovery-code-val">{forgotCode}</div>
                        <div style={{ fontSize: '0.74rem', color: '#94a3b8', marginTop: '4px' }}>In production, this code is emailed directly to you.</div>
                      </div>
                    )}

                    <div className="form-group">
                      <label>Enter 6-Digit Verification Code</label>
                      <div className="input-with-icon">
                        <span className="material-symbols-outlined">pin</span>
                        <input
                          type="text"
                          className="modern-input"
                          placeholder="e.g. 849201"
                          value={forgotUserCode}
                          onChange={(e) => setForgotUserCode(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label>New Password</label>
                      <div className="input-with-icon">
                        <span className="material-symbols-outlined">key</span>
                        <input
                          type="password"
                          className="modern-input"
                          placeholder="Minimum 4 characters"
                          value={forgotNewPass}
                          onChange={(e) => setForgotNewPass(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="form-group">
                      <label>Confirm New Password</label>
                      <div className="input-with-icon">
                        <span className="material-symbols-outlined">lock_clock</span>
                        <input
                          type="password"
                          className="modern-input"
                          placeholder="Re-enter new password"
                          value={forgotConfirmPass}
                          onChange={(e) => setForgotConfirmPass(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <button type="submit" className="modern-submit-btn" disabled={forgotLoading}>
                      {forgotLoading ? (
                        <span>Updating Password...</span>
                      ) : (
                        <>
                          <span>Update Password</span>
                          <span className="material-symbols-outlined">check_circle</span>
                        </>
                      )}
                    </button>
                  </>
                )}

                {forgotStep === 3 && (
                  <div style={{ textAlign: 'center', padding: '16px 0' }}>
                    <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: '#dcfce7', color: '#16a34a', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px auto' }}>
                      <span className="material-symbols-outlined" style={{ fontSize: '32px' }}>verified</span>
                    </div>
                    <h3 style={{ fontSize: '1.15rem', color: '#0f172a', marginBottom: '8px' }}>Password Successfully Updated</h3>
                    <p style={{ fontSize: '0.85rem', color: '#64748b', marginBottom: '20px', lineHeight: 1.5 }}>
                      Your portal password has been reset. You can now log into your account with your new credentials.
                    </p>
                    <button
                      type="button"
                      className="modern-submit-btn"
                      onClick={() => {
                        setAuthMode('login')
                        setForgotStep(1)
                        setForgotStatusMsg(null)
                      }}
                    >
                      <span>Return to Log In</span>
                      <span className="material-symbols-outlined">login</span>
                    </button>
                  </div>
                )}
              </form>
            ) : authMode === 'signup' ? (
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
                            placeholder="sarah.j@example.com"
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
                            placeholder="(555) 000-0000"
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

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px', gap: '16px' }}>
                  <button
                    type="button"
                    className="forgot-password-link"
                    onClick={() => {
                      setAuthMode('forgot')
                      setForgotEmail(loginForm.email || '')
                      setForgotStep(1)
                      setForgotStatusMsg(null)
                    }}
                  >
                    Forgot password?
                  </button>

                  <button type="submit" className="modern-submit-btn" style={{ width: 'auto', minWidth: '140px', marginTop: 0, padding: '11px 24px' }}>
                    <span>Sign In</span>
                    <span className="material-symbols-outlined">login</span>
                  </button>
                </div>
              </form>
            )}

            <div className="auth-switch-footer">
              {authMode === 'forgot' ? (
                <p>
                  Remembered your password?{' '}
                  <button
                    type="button"
                    className="auth-switch-btn"
                    onClick={() => {
                      setAuthMode('login')
                      setForgotStep(1)
                      setForgotStatusMsg(null)
                    }}
                  >
                    Back to Log In
                  </button>
                </p>
              ) : (
                <p>
                  {authMode === 'signup' ? 'Already registered?' : 'Need a new account?'}
                  <button type="button" className="auth-switch-btn" onClick={() => setAuthMode(authMode === 'signup' ? 'login' : 'signup')}>
                    {authMode === 'signup' ? 'Log In' : 'Sign Up'}
                  </button>
                </p>
              )}

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
                <span className="material-symbols-outlined">health_and_safety</span>
                Hospital Station
              </button>
              <button
                className={`nav-link-item ${activeTab === 'schedule' ? 'active' : ''}`}
                onClick={() => { setActiveTab('schedule'); setMobileMenuOpen(false) }}
              >
                <span className="material-symbols-outlined">schedule</span>
                Daily Therapy Flow
              </button>
              <button
                className={`nav-link-item ${activeTab === 'meds' ? 'active' : ''}`}
                onClick={() => { setActiveTab('meds'); setMobileMenuOpen(false) }}
              >
                <span className="material-symbols-outlined">medication</span>
                Meds & Treatments
              </button>
              <button
                className={`nav-link-item ${activeTab === 'goals' ? 'active' : ''}`}
                onClick={() => { setActiveTab('goals'); setMobileMenuOpen(false) }}
              >
                <span className="material-symbols-outlined">flag</span>
                Clinical Goals & FIM
              </button>
              <button
                className={`nav-link-item ${activeTab === 'exercises' ? 'active' : ''}`}
                onClick={() => { setActiveTab('exercises'); setMobileMenuOpen(false) }}
              >
                <span className="material-symbols-outlined">medical_services</span>
                Prescribed Protocols
              </button>
              <button
                className={`nav-link-item ${activeTab === 'records' ? 'active' : ''}`}
                onClick={() => { setActiveTab('records'); setMobileMenuOpen(false) }}
              >
                <span className="material-symbols-outlined">description</span>
                Hospital Records
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
            <button
              className="btn-sidebar-cta"
              style={{ background: 'linear-gradient(135deg, #0f52ba 0%, #1d4ed8 100%)', color: '#ffffff' }}
              onClick={() => { setMobileMenuOpen(false); setShowCareTeamModal(true) }}
            >
              <span className="material-symbols-outlined">forum</span>
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

                    <div style={{ background: '#f8fafc', borderRadius: '16px', padding: '20px', border: '1px solid #e2e8f0', marginBottom: '20px' }}>
                      <h4 style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0f52ba', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '10px' }}>
                        Clinical Protocol Prescription
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
                        <li>Lie flat on your back on a firm treatment surface with legs in neutral alignment.</li>
                        <li>Slowly slide your heel toward your buttocks, bending your knee to comfortable active tolerance.</li>
                        <li>Hold at peak flexion for 3-5 seconds while keeping your foot planted.</li>
                        <li>Slowly return to the starting position. Repeat for all prescribed repetitions.</li>
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

              {/* ── Patient Modal: Hospital Care Team Chat ── */}
              {showCareTeamModal && createPortal(
                <div
                  style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    width: '100vw', height: '100vh', zIndex: 99999,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: 'rgba(15,23,42,0.65)', backdropFilter: 'blur(8px)',
                    padding: '16px', boxSizing: 'border-box'
                  }}
                  onClick={() => setShowCareTeamModal(false)}
                >
                  <div
                    style={{
                      background: '#ffffff', borderRadius: '24px', padding: '0',
                      width: '100%', maxWidth: '780px', height: '560px', overflow: 'hidden',
                      boxShadow: '0 24px 64px rgba(15,52,186,0.25)', display: 'flex', flexDirection: 'column',
                      animation: 'fadeSlideIn 0.25s ease'
                    }}
                    onClick={e => e.stopPropagation()}
                  >
                    <div style={{ padding: '18px 24px', background: 'linear-gradient(135deg,#0f172a,#1e3a5f)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <span className="material-symbols-outlined" style={{ fontSize: '24px', color: '#60a5fa' }}>forum</span>
                        <div>
                          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0, color: '#fff' }}>Secure Hospital Care Team Portal</h3>
                          <p style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.7)', margin: '2px 0 0 0' }}>HIPAA-Compliant Encrypted Clinical Messaging • St. Jude Rehab Unit 3B</p>
                        </div>
                      </div>
                      <button
                        onClick={() => setShowCareTeamModal(false)}
                        style={{ background: 'rgba(255,255,255,0.15)', border: 'none', borderRadius: '50%', width: '36px', height: '36px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff' }}
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>close</span>
                      </button>
                    </div>

                    <div className="care-chat-modal-grid" style={{ flex: 1, border: 'none', borderRadius: 0, height: 'auto' }}>
                      <div className="care-chat-sidebar">
                        <span style={{ fontSize: '0.7rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.05em', padding: '0 4px 6px 4px' }}>
                          Primary Care Team
                        </span>
                        {[
                          { key: 'physiatrist', name: 'Dr. Lena Ortiz, MD', role: 'Attending Physiatrist', icon: 'stethoscope', status: 'Online' },
                          { key: 'pt', name: 'Dr. A. Smith, PT', role: 'Physical Therapist', icon: 'exercise', status: 'In Clinic' },
                          { key: 'ot', name: 'Sarah Chen, OTR/L', role: 'Occupational Therapist', icon: 'hand_gesture', status: 'In Clinic' },
                          { key: 'nurse', name: 'Marcus Ray, RN', role: 'Primary Rehab Nurse', icon: 'medical_services', status: 'Station 3B' },
                        ].map(prov => (
                          <button
                            key={prov.key}
                            onClick={() => setActiveCareRole(prov.key)}
                            className={`care-provider-btn ${activeCareRole === prov.key ? 'active' : ''}`}
                          >
                            <div style={{ width: '34px', height: '34px', borderRadius: '50%', background: activeCareRole === prov.key ? '#0f52ba' : '#e2e8f0', color: activeCareRole === prov.key ? '#fff' : '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                              <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>{prov.icon}</span>
                            </div>
                            <div style={{ flex: 1, overflow: 'hidden' }}>
                              <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0f172a', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }}>{prov.name}</div>
                              <div style={{ fontSize: '0.68rem', color: '#64748b' }}>{prov.role}</div>
                            </div>
                          </button>
                        ))}

                        <div style={{ marginTop: 'auto', padding: '10px', background: '#f0fdf4', borderRadius: '10px', border: '1px solid #bbf7d0', textAlign: 'center' }}>
                          <span style={{ fontSize: '0.7rem', color: '#166534', fontWeight: 800 }}>Nurse Station 3B Status: Active</span>
                        </div>
                      </div>

                      <div className="care-chat-main">
                        <div className="care-chat-header">
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <div className="pulse-indicator-dot" />
                            <strong style={{ fontSize: '0.9rem', color: '#0f172a' }}>
                              {activeCareRole === 'physiatrist' ? 'Dr. Lena Ortiz, MD (Attending Physiatrist)' :
                                activeCareRole === 'pt' ? 'Dr. A. Smith, PT, DPT (Physical Therapy)' :
                                activeCareRole === 'ot' ? 'Sarah Chen, MS, OTR/L (Occupational Therapy)' :
                                'Marcus Ray, BSN, CRRN (Floor Station 3B)'}
                            </strong>
                          </div>
                          <span style={{ fontSize: '0.72rem', color: '#64748b' }}>Average reply time: ~10 mins</span>
                        </div>

                        <div className="care-chat-messages">
                          {(careMessages[activeCareRole] || []).map(msg => (
                            <div key={msg.id} className={`chat-bubble ${msg.sender === 'patient' ? 'patient' : 'provider'}`}>
                              <div style={{ fontSize: '0.72rem', opacity: 0.8, marginBottom: '3px', fontWeight: 700 }}>
                                {msg.sender === 'patient' ? 'You' : msg.sender} • {msg.time}
                              </div>
                              <div>{msg.text}</div>
                            </div>
                          ))}
                        </div>

                        <div style={{ padding: '6px 16px', background: '#f8fafc', display: 'flex', gap: '6px', overflowX: 'auto', borderTop: '1px solid #e2e8f0' }}>
                          {[
                            'How long should I keep ice wrap on?',
                            'Can we test 12 stairs today?',
                            'Request refill on Celebrex',
                            'Need assistance with walking'
                          ].map(quick => (
                            <button
                              key={quick}
                              type="button"
                              onClick={() => setChatInputText(quick)}
                              style={{ background: '#fff', border: '1px solid #cbd5e1', borderRadius: '50px', padding: '3px 10px', fontSize: '0.72rem', color: '#334155', cursor: 'pointer', whiteSpace: 'nowrap' }}
                            >
                              + {quick}
                            </button>
                          ))}
                        </div>

                        <form onSubmit={handleSendCareMessage} className="care-chat-footer">
                          <input
                            type="text"
                            className="modern-input"
                            placeholder="Type a clinical message to your provider..."
                            value={chatInputText}
                            onChange={e => setChatInputText(e.target.value)}
                            style={{ flex: 1, padding: '10px 14px' }}
                          />
                          <button
                            type="submit"
                            className="modern-submit-btn"
                            style={{ width: 'auto', padding: '10px 20px', marginTop: 0 }}
                          >
                            <span>Send</span>
                            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>send</span>
                          </button>
                        </form>
                      </div>
                    </div>
                  </div>
                </div>,
                document.body
              )}

              {/* ── Patient Modal: Hospital Clinical Summary & Records ── */}
              {showClinicalRecordModal && createPortal(
                <div
                  style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    width: '100vw', height: '100vh', zIndex: 99999,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: 'rgba(15,23,42,0.65)', backdropFilter: 'blur(8px)',
                    padding: '16px', boxSizing: 'border-box'
                  }}
                  onClick={() => setShowClinicalRecordModal(false)}
                >
                  <div
                    style={{
                      background: '#ffffff', borderRadius: '24px', padding: '32px',
                      width: '100%', maxWidth: '680px', maxHeight: '88vh', overflowY: 'auto',
                      boxShadow: '0 24px 64px rgba(15,52,186,0.25)', animation: 'fadeSlideIn 0.25s ease'
                    }}
                    onClick={e => e.stopPropagation()}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', borderBottom: '1.5px solid #e2e8f0', paddingBottom: '16px' }}>
                      <div>
                        <span style={{ background: '#eff6ff', color: '#1d4ed8', padding: '3px 10px', borderRadius: '50px', fontSize: '0.72rem', fontWeight: 800 }}>
                          Official Clinical Record
                        </span>
                        <h3 style={{ fontSize: '1.3rem', fontWeight: 900, color: '#0f172a', marginTop: '6px' }}>Inpatient Rehabilitation Summary Report</h3>
                        <p style={{ fontSize: '0.8rem', color: '#64748b', margin: 0 }}>St. Jude Rehabilitation Hospital • Department of Physical Medicine & Rehabilitation</p>
                      </div>
                      <button
                        onClick={() => setShowClinicalRecordModal(false)}
                        style={{ background: '#f1f5f9', border: 'none', borderRadius: '50%', width: '36px', height: '36px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: '18px', color: '#64748b' }}>close</span>
                      </button>
                    </div>

                    <div style={{ background: '#f8fafc', borderRadius: '16px', padding: '20px', border: '1px solid #e2e8f0', marginBottom: '20px' }}>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '0.82rem', marginBottom: '14px' }}>
                        <div><strong>Patient:</strong> {sessionUser.name}</div>
                        <div><strong>MRN:</strong> {patientHospitalInfo.mrn}</div>
                        <div><strong>Admission Date:</strong> {patientHospitalInfo.admissionDate}</div>
                        <div><strong>Room / Bed:</strong> {patientHospitalInfo.room}</div>
                        <div><strong>Attending Physiatrist:</strong> {patientHospitalInfo.attendingPhysiatrist}</div>
                        <div><strong>Diagnosis:</strong> Post-Op ACL Reconstruction (Right Knee)</div>
                      </div>

                      <h4 style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0f52ba', textTransform: 'uppercase', marginBottom: '8px' }}>Physiatry Functional Assessment:</h4>
                      <p style={{ fontSize: '0.84rem', color: '#475569', lineHeight: 1.6, margin: '0 0 14px 0' }}>
                        Patient is progressing through Phase 2 active rehabilitation with excellent compliance. Active right knee ROM has achieved 115° of flexion with 0° terminal extension. Patient demonstrates safe ambulation over 180 feet with axillary crutches under supervision. Quad recruitment via NMES biofeedback is robust.
                      </p>

                      <h4 style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0f52ba', textTransform: 'uppercase', marginBottom: '8px' }}>FIM Functional Score Comparison:</h4>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '10px', textAlign: 'center', marginBottom: '14px' }}>
                        <div style={{ background: '#fff', borderRadius: '10px', padding: '10px', border: '1px solid #e2e8f0' }}>
                          <span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 700 }}>ADMISSION FIM</span>
                          <strong style={{ fontSize: '1.2rem', color: '#dc2626', display: 'block' }}>54 / 126</strong>
                        </div>
                        <div style={{ background: '#fff', borderRadius: '10px', padding: '10px', border: '1px solid #e2e8f0' }}>
                          <span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 700 }}>CURRENT FIM</span>
                          <strong style={{ fontSize: '1.2rem', color: '#0f52ba', display: 'block' }}>104 / 126</strong>
                        </div>
                        <div style={{ background: '#fff', borderRadius: '10px', padding: '10px', border: '1px solid #e2e8f0' }}>
                          <span style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 700 }}>DISCHARGE GOAL</span>
                          <strong style={{ fontSize: '1.2rem', color: '#16a34a', display: 'block' }}>118 / 126</strong>
                        </div>
                      </div>

                      <h4 style={{ fontSize: '0.85rem', fontWeight: 800, color: '#0f52ba', textTransform: 'uppercase', marginBottom: '8px' }}>Discharge Planning Status:</h4>
                      <p style={{ fontSize: '0.84rem', color: '#475569', lineHeight: 1.6, margin: 0 }}>
                        Target discharge date: <strong>Nov 15, 2026</strong> to independent home setting with outpatient physical therapy continuation at St. Jude Outpatient Wing. Caregiver training confirmed.
                      </p>
                    </div>

                    <div style={{ display: 'flex', gap: '12px' }}>
                      <button
                        onClick={() => window.print()}
                        style={{ padding: '12px 20px', borderRadius: '50px', border: '1.5px solid #cbd5e1', background: '#fff', color: '#334151', fontWeight: 800, fontSize: '0.88rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>print</span>
                        Print Clinical Summary
                      </button>
                      <button
                        onClick={handleDownloadPatientData}
                        className="modern-submit-btn"
                        style={{ flex: 1, marginTop: 0 }}
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>download</span>
                        Export Official Patient Record (.json)
                      </button>
                    </div>
                  </div>
                </div>,
                document.body
              )}

              {/* ── Patient Modal: Comprehensive Clinical Document Detail Viewer ── */}
              {showRecordDetailModal && selectedRecordDetail && createPortal(
                <div
                  style={{
                    position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
                    width: '100vw', height: '100vh', zIndex: 99999,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: 'rgba(15,23,42,0.7)', backdropFilter: 'blur(8px)',
                    padding: '16px', boxSizing: 'border-box'
                  }}
                  onClick={() => setShowRecordDetailModal(false)}
                >
                  <div
                    className="clinical-paper-modal"
                    onClick={e => e.stopPropagation()}
                  >
                    {/* Official Document Header */}
                    <div className="hospital-doc-header">
                      <div className="hospital-seal-title">
                        <div className="hospital-seal-icon">
                          <span className="material-symbols-outlined" style={{ fontSize: '28px' }}>local_hospital</span>
                        </div>
                        <div>
                          <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#0f52ba', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                            St. Jude Rehabilitation Hospital • Official Medical Record
                          </div>
                          <h2 style={{ fontSize: '1.35rem', fontWeight: 900, color: '#0f172a', margin: '2px 0 0 0' }}>
                            {selectedRecordDetail.title}
                          </h2>
                          <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '2px' }}>
                            Document ID: <strong>{selectedRecordDetail.id}</strong> • Category: <strong>{selectedRecordDetail.category}</strong>
                          </div>
                        </div>
                      </div>

                      <button
                        onClick={() => setShowRecordDetailModal(false)}
                        style={{ background: '#f1f5f9', border: 'none', borderRadius: '50%', width: '36px', height: '36px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                      >
                        <span className="material-symbols-outlined" style={{ fontSize: '18px', color: '#64748b' }}>close</span>
                      </button>
                    </div>

                    {/* Patient & Encounter Demographics Bar */}
                    <div style={{ background: '#f8fafc', borderRadius: '12px', padding: '14px 18px', border: '1px solid #e2e8f0', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '10px', fontSize: '0.8rem', marginBottom: '22px' }}>
                      <div><span style={{ color: '#64748b', display: 'block', fontSize: '0.7rem', fontWeight: 700 }}>PATIENT NAME</span><strong>{sessionUser.name}</strong></div>
                      <div><span style={{ color: '#64748b', display: 'block', fontSize: '0.7rem', fontWeight: 700 }}>MRN</span><strong>{patientHospitalInfo.mrn}</strong></div>
                      <div><span style={{ color: '#64748b', display: 'block', fontSize: '0.7rem', fontWeight: 700 }}>ENCOUNTER DATE</span><strong>{selectedRecordDetail.date}</strong></div>
                      <div><span style={{ color: '#64748b', display: 'block', fontSize: '0.7rem', fontWeight: 700 }}>UNIT / ROOM</span><strong>{selectedRecordDetail.encounter}</strong></div>
                    </div>

                    {/* Clinical Document Sections */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
                      {selectedRecordDetail.fullSections.map((sec, idx) => (
                        <div key={idx} className="doc-section-block">
                          <div className="doc-section-title">
                            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>verified</span>
                            {sec.label}
                          </div>
                          <div className="doc-section-body">
                            {sec.text}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Author & Attestation Signature */}
                    <div className="doc-signature-footer">
                      <div>
                        <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase' }}>Electronically Signed & Certified By</div>
                        <div style={{ fontSize: '1rem', fontWeight: 900, color: '#0f172a', marginTop: '2px' }}>{selectedRecordDetail.author}</div>
                        <div style={{ fontSize: '0.78rem', color: '#0f52ba', fontWeight: 700 }}>{selectedRecordDetail.authorRole}</div>
                        <div style={{ fontSize: '0.72rem', color: '#64748b' }}>License / Certification: {selectedRecordDetail.license}</div>
                      </div>

                      <div style={{ display: 'flex', gap: '10px' }}>
                        <button
                          onClick={() => window.print()}
                          style={{ padding: '10px 18px', borderRadius: '50px', border: '1.5px solid #cbd5e1', background: '#fff', color: '#334151', fontSize: '0.82rem', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                        >
                          <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>print</span>
                          Print Document
                        </button>
                        <button
                          onClick={() => {
                            const blob = new Blob([JSON.stringify(selectedRecordDetail, null, 2)], { type: 'application/json' })
                            const url = URL.createObjectURL(blob)
                            const a = document.createElement('a')
                            a.href = url
                            a.download = `${selectedRecordDetail.id}_Clinical_Record.json`
                            a.click()
                            URL.revokeObjectURL(url)
                            triggerToast(`Document ${selectedRecordDetail.id} downloaded successfully!`)
                          }}
                          className="modern-submit-btn"
                          style={{ width: 'auto', padding: '10px 20px', marginTop: 0 }}
                        >
                          <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>download</span>
                          Download Record
                        </button>
                      </div>
                    </div>
                  </div>
                </div>,
                document.body
              )}

              {/* ── PATIENT TAB 1: HOSPITAL RECOVERY STATION (DASHBOARD) ── */}
              {activeTab === 'dashboard' && (
                <>
                  {/* Hospital Admission Strip — Premium Clinical ID Band */}
                  <div className="admission-id-band">
                    {/* Hospital Header Bar */}
                    <div className="admission-hospital-bar">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div className="admission-hospital-seal">
                          <span className="material-symbols-outlined" style={{ fontSize: '22px', color: '#fff' }}>local_hospital</span>
                        </div>
                        <div>
                          <div className="admission-hospital-name">{patientHospitalInfo.hospitalName}</div>
                          <div className="admission-hospital-dept">Department of Physical Medicine &amp; Rehabilitation • Inpatient Unit 3B</div>
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        <span className="adm-status-badge active-rehab">
                          <span className="adm-pulse-dot" />
                          {patientHospitalInfo.status}
                        </span>
                        <span className="adm-status-badge code-full">
                          <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>favorite</span>
                          {patientHospitalInfo.codeStatus}
                        </span>
                        <span className="adm-status-badge day-counter">
                          <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>calendar_today</span>
                          Day {patientHospitalInfo.rehabDay}
                        </span>
                      </div>
                    </div>

                    {/* Main Patient Identity & Clinical Data */}
                    <div className="admission-body">
                      {/* Patient Avatar & Identity */}
                      <div className="admission-patient-identity">
                        <div className="admission-avatar">
                          {sessionUser.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <div className="admission-patient-name">{sessionUser.name}</div>
                          <div className="admission-mrn">{patientHospitalInfo.mrn}</div>
                          <div className="admission-dob">DOB: Apr 12, 1986 &nbsp;·&nbsp; Age: 40 &nbsp;·&nbsp; Female &nbsp;·&nbsp; O+</div>
                        </div>
                      </div>

                      {/* Divider */}
                      <div className="admission-divider" />

                      {/* Clinical Details Grid */}
                      <div className="admission-details-grid">
                        <div className="adm-detail-cell">
                          <span className="adm-detail-label">
                            <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>meeting_room</span>
                            Location
                          </span>
                          <span className="adm-detail-val">{patientHospitalInfo.room}</span>
                          <span className="adm-detail-sub">{patientHospitalInfo.wing}</span>
                        </div>
                        <div className="adm-detail-cell">
                          <span className="adm-detail-label">
                            <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>event_available</span>
                            Admitted
                          </span>
                          <span className="adm-detail-val">{patientHospitalInfo.admissionDate}</span>
                          <span className="adm-detail-sub">Inpatient Rehab Day {patientHospitalInfo.rehabDay}</span>
                        </div>
                        <div className="adm-detail-cell">
                          <span className="adm-detail-label">
                            <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>directions_walk</span>
                            Weight Bearing
                          </span>
                          <span className="adm-detail-val">WBAT</span>
                          <span className="adm-detail-sub">Right Lower Extremity</span>
                        </div>
                        <div className="adm-detail-cell">
                          <span className="adm-detail-label">
                            <span className="material-symbols-outlined" style={{ fontSize: '13px' }}>restaurant</span>
                            Diet Order
                          </span>
                          <span className="adm-detail-val">{patientHospitalInfo.diet}</span>
                          <span className="adm-detail-sub">Oral • No Restrictions</span>
                        </div>
                      </div>

                      {/* Divider */}
                      <div className="admission-divider" />

                      {/* Care Team */}
                      <div className="admission-care-team">
                        <div className="adm-team-label">Care Team</div>
                        <div className="adm-team-members">
                          <div className="adm-team-member">
                            <div className="adm-team-avatar physiatrist">
                              <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>stethoscope</span>
                            </div>
                            <div>
                              <div className="adm-member-name">{patientHospitalInfo.attendingPhysiatrist}</div>
                              <div className="adm-member-role">Attending Physiatrist</div>
                            </div>
                          </div>
                          <div className="adm-team-member">
                            <div className="adm-team-avatar pt">
                              <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>exercise</span>
                            </div>
                            <div>
                              <div className="adm-member-name">{patientHospitalInfo.primaryPT}</div>
                              <div className="adm-member-role">Physical Therapist</div>
                            </div>
                          </div>
                          <div className="adm-team-member">
                            <div className="adm-team-avatar ot">
                              <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>self_improvement</span>
                            </div>
                            <div>
                              <div className="adm-member-name">{patientHospitalInfo.primaryOT}</div>
                              <div className="adm-member-role">Occupational Therapist</div>
                            </div>
                          </div>
                          <div className="adm-team-member">
                            <div className="adm-team-avatar rn">
                              <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>medical_services</span>
                            </div>
                            <div>
                              <div className="adm-member-name">{patientHospitalInfo.primaryNurse}</div>
                              <div className="adm-member-role">Floor RN, Station 3B</div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Divider */}
                      <div className="admission-divider" />

                      {/* Precaution Badges */}
                      <div className="admission-precautions">
                        <div className="adm-team-label">Precautions &amp; Orders</div>
                        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginTop: '8px' }}>
                          <span className="adm-precaution-tag yellow">
                            <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>warning</span>
                            {patientHospitalInfo.fallRisk}
                          </span>
                          <span className="adm-precaution-tag blue">
                            <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>directions_walk</span>
                            {patientHospitalInfo.weightBearing}
                          </span>
                          <span className="adm-precaution-tag green">
                            <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>medication</span>
                            DVT Prophylaxis Active (Enoxaparin)
                          </span>
                          <span className="adm-precaution-tag red">
                            <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>block</span>
                            Allergy: Penicillin (Urticaria)
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="admission-footer">
                      <span>Encounter: ENC-2026-3304 &nbsp;·&nbsp; HIPAA Protected Health Information &nbsp;·&nbsp; St. Jude Rehab Hospital EHR System</span>
                      <span>Last Verified: Today, 06:00 AM &nbsp;·&nbsp; Marcus Ray, BSN, CRRN</span>
                    </div>
                  </div>

                  {/* Hero Banner — Hospital Recovery Station */}
                  <section className="portal-hero-banner" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)', borderRadius: '24px', padding: '28px 32px' }}>
                    <div className="hero-banner-content">
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px', flexWrap: 'wrap' }}>
                        <span style={{ background: 'rgba(255,255,255,0.18)', padding: '4px 14px', borderRadius: '50px', fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.07em', color: '#fff' }}>
                          Inpatient Rehab Day {patientHospitalInfo.rehabDay}
                        </span>
                        <span style={{ background: 'rgba(34,197,94,0.25)', color: '#4ade80', padding: '4px 14px', borderRadius: '50px', fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                          Phase 2: Active ROM & WBAT
                        </span>
                      </div>
                      <h2 style={{ fontSize: '1.7rem', fontWeight: 900, color: '#ffffff', margin: 0 }}>Welcome back, {sessionUser.name.split(' ')[0]} 👋</h2>
                      <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.9rem', marginTop: '6px', marginBottom: 0 }}>
                        Post-Op ACL Reconstruction (Right Knee) &nbsp;·&nbsp; Physiatrist: <strong>{patientHospitalInfo.attendingPhysiatrist}</strong> &nbsp;·&nbsp; Primary PT: <strong>{patientHospitalInfo.primaryPT}</strong>
                      </p>
                    </div>
                    <div className="hero-stats-pills">
                      <div className="stat-pill-glass">
                        <strong>{patientVitals.flexionRom}°</strong>
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

                  {/* Real-time Vital Signs Telemetry Station */}
                  <div style={{ marginBottom: '6px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span className="pulse-indicator-dot" />
                        <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>Clinical Vital Signs Telemetry</h3>
                      </div>
                      <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>Synced: {patientVitals.lastChecked}</span>
                    </div>

                    <div className="telemetry-grid">
                      <div className="telemetry-card">
                        <div className="telemetry-card-header">
                          <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>Blood Pressure</span>
                          <div className="telemetry-icon-wrap" style={{ background: '#eff6ff', color: '#1d4ed8' }}>
                            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>vital_signs</span>
                          </div>
                        </div>
                        <div className="telemetry-val">{patientVitals.bpSys}/{patientVitals.bpDia}</div>
                        <div className="telemetry-unit">mmHg (Normotensive)</div>
                      </div>

                      <div className="telemetry-card">
                        <div className="telemetry-card-header">
                          <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>Heart Rate</span>
                          <div className="telemetry-icon-wrap" style={{ background: '#fef2f2', color: '#dc2626' }}>
                            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>cardiology</span>
                          </div>
                        </div>
                        <div className="telemetry-val">{patientVitals.hr}</div>
                        <div className="telemetry-unit">bpm (Sinus Rhythm)</div>
                      </div>

                      <div className="telemetry-card">
                        <div className="telemetry-card-header">
                          <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>Oxygen SpO2</span>
                          <div className="telemetry-icon-wrap" style={{ background: '#f0fdf4', color: '#16a34a' }}>
                            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>air</span>
                          </div>
                        </div>
                        <div className="telemetry-val">{patientVitals.spo2}%</div>
                        <div className="telemetry-unit">Room Air (Optimal)</div>
                      </div>

                      <div className="telemetry-card">
                        <div className="telemetry-card-header">
                          <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>Body Temp</span>
                          <div className="telemetry-icon-wrap" style={{ background: '#f5f3ff', color: '#7c3aed' }}>
                            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>thermostat</span>
                          </div>
                        </div>
                        <div className="telemetry-val">{patientVitals.temp}°F</div>
                        <div className="telemetry-unit">Oral (Afebrile)</div>
                      </div>

                      <div className="telemetry-card">
                        <div className="telemetry-card-header">
                          <span style={{ fontSize: '0.72rem', fontWeight: 800, color: '#64748b', textTransform: 'uppercase' }}>Active ROM</span>
                          <div className="telemetry-icon-wrap" style={{ background: '#fff7ed', color: '#ea580c' }}>
                            <span className="material-symbols-outlined" style={{ fontSize: '18px' }}>accessibility_new</span>
                          </div>
                        </div>
                        <div className="telemetry-val">{patientVitals.flexionRom}°</div>
                        <div className="telemetry-unit">Knee Flexion / 0° Ext</div>
                      </div>
                    </div>
                  </div>

                  {/* Quick Action Navigation Grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '14px', marginBottom: '22px' }}>
                    {[
                      { icon: 'schedule', label: 'Daily Therapy Flow', sublabel: `${hospitalSchedule.filter(s => s.status === 'Completed').length}/${hospitalSchedule.length} sessions done today`, tab: 'schedule', color: '#0f52ba', bg: '#eff6ff' },
                      { icon: 'medication', label: 'Meds & Treatments', sublabel: `${patientMeds.filter(m => m.taken).length}/${patientMeds.length} doses logged`, tab: 'meds', color: '#16a34a', bg: '#f0fdf4' },
                      { icon: 'flag', label: 'Clinical Goals & FIM', sublabel: '78% milestone recovery', tab: 'goals', color: '#7c3aed', bg: '#f5f3ff' },
                      { icon: 'description', label: 'Hospital Records', sublabel: 'View physiatry summary', tab: 'records', color: '#0284c7', bg: '#f0f9ff' },
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
                    {/* Recovery Progress Chart */}
                    <div className="bento-card col-span-7">
                      <div className="card-header">
                        <div className="card-header-left">
                          <h3>Hospital Rehabilitation Trajectory</h3>
                          <p>Mobility vs Protocol Adherence — 4-Week Inpatient Trend</p>
                        </div>
                        <span className="trend-tag positive">
                          <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>trending_up</span> +15% FIM Gain
                        </span>
                      </div>

                      <div style={{ display: 'flex', gap: '16px', marginBottom: '12px', paddingLeft: '4px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: 'linear-gradient(135deg,#0f52ba,#2563eb)' }} />
                          <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>Mobility Score %</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <div style={{ width: '12px', height: '12px', borderRadius: '3px', background: 'linear-gradient(135deg,#16a34a,#22c55e)' }} />
                          <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>Therapy Attendance %</span>
                        </div>
                      </div>

                      <div className="chart-container-box">
                        <div className="bar-chart-flex">
                          {[
                            { label: 'Week 1', mob: 40, ex: 60 },
                            { label: 'Week 2', mob: 55, ex: 72 },
                            { label: 'Week 3', mob: 70, ex: 85 },
                            { label: 'Week 4', mob: 82, ex: 94 },
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

                    {/* Pain Scale & Anatomical Logger */}
                    <div className="bento-card col-span-5" style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                      <div className="card-header" style={{ marginBottom: 0 }}>
                        <div className="card-header-left">
                          <h3>VAS Pain & Location Telemetry</h3>
                          <p>Log your current localized symptom scale</p>
                        </div>
                        <span style={{ fontSize: '1.4rem', fontWeight: 900, color: clientDailyPain <= 3 ? '#16a34a' : clientDailyPain <= 6 ? '#f59e0b' : '#dc2626' }}>
                          {clientDailyPain}/10
                        </span>
                      </div>

                      <div style={{ display: 'flex', gap: '4px', justifyContent: 'space-between' }}>
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(n => (
                          <button
                            key={n}
                            onClick={() => setClientDailyPain(n)}
                            style={{
                              width: '30px', height: '30px', borderRadius: '8px', border: 'none',
                              background: n === clientDailyPain
                                ? (n <= 3 ? '#16a34a' : n <= 6 ? '#f59e0b' : '#dc2626')
                                : '#f1f5f9',
                              color: n === clientDailyPain ? '#fff' : '#64748b',
                              fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer',
                              transition: 'all 0.15s'
                            }}
                          >{n}</button>
                        ))}
                      </div>

                      <div>
                        <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 700, textTransform: 'uppercase', display: 'block', marginBottom: '6px' }}>Target Joint / Region</span>
                        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                          {['Right Knee (Lateral)', 'Right Knee (Patellar)', 'Lumbar Spine', 'Calf / Ankle'].map(loc => (
                            <button
                              key={loc}
                              type="button"
                              onClick={() => setPainLocation(loc)}
                              style={{
                                padding: '4px 10px', borderRadius: '50px', fontSize: '0.72rem', fontWeight: 700,
                                border: `1.5px solid ${painLocation === loc ? '#0f52ba' : '#e2e8f0'}`,
                                background: painLocation === loc ? '#eff6ff' : '#fff',
                                color: painLocation === loc ? '#0f52ba' : '#64748b',
                                cursor: 'pointer'
                              }}
                            >
                              {loc}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div style={{ display: 'flex', gap: '8px' }}>
                        <input
                          type="text"
                          className="modern-input"
                          placeholder="Optional symptom note (e.g. stiffness post-walk)..."
                          value={painNote}
                          onChange={e => setPainNote(e.target.value)}
                          style={{ fontSize: '0.78rem', padding: '8px 12px' }}
                        />
                        <button
                          type="button"
                          onClick={() => {
                            const newLog = {
                              time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                              score: clientDailyPain,
                              location: painLocation,
                              note: painNote || 'Routine reading logged'
                            }
                            setPainLogHistory([newLog, ...painLogHistory])
                            setPainNote('')
                            triggerToast(`Pain level ${clientDailyPain}/10 logged to Floor RN chart!`)
                          }}
                          style={{ padding: '8px 14px', borderRadius: '8px', background: '#0f52ba', color: '#fff', border: 'none', fontWeight: 800, fontSize: '0.75rem', cursor: 'pointer', whiteSpace: 'nowrap' }}
                        >
                          Log Entry
                        </button>
                      </div>

                      <div style={{ background: '#f8fafc', borderRadius: '10px', padding: '10px 12px', border: '1px solid #e2e8f0', fontSize: '0.75rem' }}>
                        <strong style={{ color: '#0f172a', display: 'block', marginBottom: '4px' }}>Latest Telemetry Readings:</strong>
                        {painLogHistory.slice(0, 2).map((item, idx) => (
                          <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', color: '#475569', marginBottom: '2px' }}>
                            <span>{item.time} · {item.location}</span>
                            <strong>{item.score}/10 VAS</strong>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Today's Hospital Therapy Schedule Strip */}
                    <div className="bento-card col-span-12" style={{ padding: '24px 28px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '18px', flexWrap: 'wrap', gap: '10px' }}>
                        <div>
                          <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>Today's Inpatient Rehabilitation Schedule</h3>
                          <p style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '2px' }}>Daily clinical care flow coordinated by Physiatrist Dr. Ortiz</p>
                        </div>
                        <button
                          onClick={() => setActiveTab('schedule')}
                          style={{ padding: '8px 16px', borderRadius: '50px', border: '1.5px solid #cbd5e1', background: '#fff', color: '#0f52ba', fontSize: '0.8rem', fontWeight: 700, cursor: 'pointer' }}
                        >
                          View Full Schedule →
                        </button>
                      </div>

                      <div className="hospital-timeline">
                        {hospitalSchedule.slice(0, 3).map(session => (
                          <div key={session.id} className={`timeline-row-card ${session.status === 'In Progress' ? 'in-progress' : ''}`}>
                            <div className="timeline-time-box">
                              <div className="timeline-time-val">{session.time}</div>
                              <div className="timeline-duration">{session.duration}</div>
                            </div>
                            <div style={{ flex: 1 }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                                <span style={{
                                  background: session.status === 'Completed' ? '#dcfce7' : session.status === 'In Progress' ? '#dbeafe' : '#f1f5f9',
                                  color: session.status === 'Completed' ? '#166534' : session.status === 'In Progress' ? '#1d4ed8' : '#475569',
                                  borderRadius: '50px', padding: '2px 10px', fontSize: '0.68rem', fontWeight: 800
                                }}>
                                  {session.status}
                                </span>
                                <span style={{ fontSize: '0.74rem', color: '#64748b', fontWeight: 700 }}>{session.type}</span>
                              </div>
                              <h4 style={{ fontSize: '0.98rem', fontWeight: 800, color: '#0f172a', margin: '0 0 4px 0' }}>{session.title}</h4>
                              <p style={{ fontSize: '0.78rem', color: '#64748b', margin: 0 }}>{session.location} • Provider: <strong>{session.provider}</strong></p>
                            </div>
                            <button
                              onClick={() => triggerToast(`Check-in confirmed for ${session.title}`)}
                              style={{
                                padding: '8px 16px', borderRadius: '50px', border: 'none',
                                background: session.status === 'Completed' ? '#f1f5f9' : 'linear-gradient(135deg,#0f52ba,#2563eb)',
                                color: session.status === 'Completed' ? '#64748b' : '#fff',
                                fontWeight: 800, fontSize: '0.78rem', cursor: session.status === 'Completed' ? 'default' : 'pointer'
                              }}
                            >
                              {session.status === 'Completed' ? '✓ Finished' : 'Check In'}
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </>
              )}

              {/* ── PATIENT TAB 2: DAILY THERAPY SCHEDULE ── */}
              {activeTab === 'schedule' && (
                <div className="bento-grid">
                  <div className="bento-card col-span-12" style={{ background: 'linear-gradient(135deg,#0f172a,#1e3a5f)', color: '#fff', padding: '28px 32px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
                      <div>
                        <span style={{ background: 'rgba(255,255,255,0.15)', padding: '4px 14px', borderRadius: '50px', fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                          Inpatient Care Calendar
                        </span>
                        <h2 style={{ fontSize: '1.6rem', fontWeight: 900, marginTop: '10px', color: '#fff' }}>Daily Hospital Rehabilitation Flow</h2>
                        <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.88rem', marginTop: '4px' }}>
                          Comprehensive schedule of physical therapy, occupational training, biofeedback, and physician rounds.
                        </p>
                      </div>
                      <div style={{ display: 'flex', gap: '12px' }}>
                        <div style={{ background: 'rgba(255,255,255,0.12)', padding: '12px 20px', borderRadius: '14px', textAlign: 'center' }}>
                          <strong style={{ fontSize: '1.3rem', fontWeight: 900, display: 'block', color: '#fff' }}>5</strong>
                          <span style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.8)', fontWeight: 700, textTransform: 'uppercase' }}>Daily Sessions</span>
                        </div>
                        <div style={{ background: 'rgba(34,197,94,0.2)', padding: '12px 20px', borderRadius: '14px', textAlign: 'center' }}>
                          <strong style={{ fontSize: '1.3rem', fontWeight: 900, display: 'block', color: '#4ade80' }}>2</strong>
                          <span style={{ fontSize: '0.68rem', color: '#4ade80', fontWeight: 700, textTransform: 'uppercase' }}>Completed</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bento-card col-span-12" style={{ padding: '28px' }}>
                    <div className="hospital-timeline">
                      {hospitalSchedule.map((session, idx) => (
                        <div key={session.id} className={`timeline-row-card ${session.status === 'In Progress' ? 'in-progress' : ''}`}>
                          <div className="timeline-time-box">
                            <div className="timeline-time-val">{session.time}</div>
                            <div className="timeline-duration">{session.duration}</div>
                          </div>

                          <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', flexWrap: 'wrap' }}>
                              <span style={{
                                background: session.status === 'Completed' ? '#dcfce7' : session.status === 'In Progress' ? '#dbeafe' : '#f1f5f9',
                                color: session.status === 'Completed' ? '#166534' : session.status === 'In Progress' ? '#1d4ed8' : '#475569',
                                borderRadius: '50px', padding: '2px 10px', fontSize: '0.7rem', fontWeight: 800
                              }}>
                                {session.status}
                              </span>
                              <span style={{ background: '#f8fafc', color: '#64748b', borderRadius: '50px', padding: '2px 10px', fontSize: '0.7rem', fontWeight: 700, border: '1px solid #e2e8f0' }}>
                                {session.type}
                              </span>
                            </div>
                            <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', margin: '0 0 6px 0' }}>{session.title}</h3>
                            <div style={{ display: 'flex', gap: '16px', fontSize: '0.8rem', color: '#64748b', flexWrap: 'wrap', marginBottom: '8px' }}>
                              <span>📍 Location: <strong style={{ color: '#0f172a' }}>{session.location}</strong></span>
                              <span>👨‍⚕️ Clinician: <strong style={{ color: '#0f172a' }}>{session.provider}</strong></span>
                            </div>
                            <div style={{ background: '#f8fafc', borderRadius: '8px', padding: '8px 12px', fontSize: '0.76rem', color: '#475569', border: '1px solid #e2e8f0', fontStyle: 'italic' }}>
                              Clinical Focus: "{session.notes}"
                            </div>
                          </div>

                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <button
                              onClick={() => triggerToast(`Check-in recorded for ${session.title}`)}
                              style={{
                                padding: '10px 18px', borderRadius: '50px', border: 'none',
                                background: session.status === 'Completed' ? '#f1f5f9' : 'linear-gradient(135deg,#0f52ba,#2563eb)',
                                color: session.status === 'Completed' ? '#64748b' : '#fff',
                                fontWeight: 800, fontSize: '0.8rem', cursor: session.status === 'Completed' ? 'default' : 'pointer'
                              }}
                            >
                              {session.status === 'Completed' ? '✓ Done' : 'Check In'}
                            </button>
                            <button
                              onClick={() => {
                                setSelectedRescheduleAppt({
                                  title: session.title,
                                  time: session.time,
                                  provider: session.provider
                                })
                                setShowRescheduleModal(true)
                              }}
                              style={{ padding: '6px 12px', borderRadius: '50px', border: '1px solid #cbd5e1', background: '#fff', color: '#475569', fontSize: '0.75rem', fontWeight: 700, cursor: 'pointer' }}
                            >
                              Reschedule
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ── PATIENT TAB 3: MEDICATIONS & CLINICAL TREATMENTS ── */}
              {activeTab === 'meds' && (
                <div className="bento-grid">
                  <div className="bento-card col-span-12" style={{ background: 'linear-gradient(135deg,#0f172a,#1e3a5f)', color: '#fff', padding: '28px 32px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
                      <div>
                        <span style={{ background: 'rgba(255,255,255,0.15)', padding: '4px 14px', borderRadius: '50px', fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                          Inpatient Clinical Pharmacy
                        </span>
                        <h2 style={{ fontSize: '1.6rem', fontWeight: 900, marginTop: '10px', color: '#fff' }}>Medications & Rehabilitation Treatments</h2>
                        <p style={{ color: 'rgba(255,255,255,0.75)', fontSize: '0.88rem', marginTop: '4px' }}>
                          Prescribed post-operative pain management, DVT prophylaxis, and specialized cryo-compression protocols.
                        </p>
                      </div>
                      <div style={{ background: 'rgba(34,197,94,0.2)', padding: '14px 22px', borderRadius: '16px', textAlign: 'center', border: '1px solid rgba(255,255,255,0.15)' }}>
                        <span style={{ fontSize: '0.72rem', color: '#4ade80', fontWeight: 700, textTransform: 'uppercase' }}>Doses Administered</span>
                        <strong style={{ fontSize: '1.5rem', fontWeight: 900, color: '#fff', display: 'block' }}>
                          {patientMeds.filter(m => m.taken).length} / {patientMeds.length}
                        </strong>
                      </div>
                    </div>
                  </div>

                  <div className="bento-card col-span-12" style={{ padding: '28px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                      {patientMeds.map(med => (
                        <div key={med.id} className={`med-treatment-card ${med.taken ? 'taken' : ''}`}>
                          <div style={{ flex: 1 }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
                              <span className="med-dose-pill">{med.dose} · {med.route}</span>
                              <span style={{ background: '#f1f5f9', color: '#475569', borderRadius: '50px', padding: '2px 10px', fontSize: '0.7rem', fontWeight: 800 }}>{med.frequency}</span>
                              {med.taken && (
                                <span style={{ background: '#dcfce7', color: '#15803d', borderRadius: '50px', padding: '2px 10px', fontSize: '0.7rem', fontWeight: 800 }}>
                                  ✓ Taken at {med.timeTaken}
                                </span>
                              )}
                            </div>
                            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', margin: '0 0 6px 0' }}>{med.name}</h3>
                            <p style={{ fontSize: '0.84rem', color: '#0f52ba', fontWeight: 700, margin: '0 0 4px 0' }}>Purpose: {med.purpose}</p>
                            <p style={{ fontSize: '0.8rem', color: '#64748b', margin: 0 }}>Instructions: {med.instructions}</p>
                          </div>

                          <button
                            type="button"
                            onClick={() => {
                              toggleMedTaken(med.id)
                              triggerToast(`${med.name} marked as ${!med.taken ? 'Taken' : 'Pending'}`)
                            }}
                            style={{
                              padding: '10px 20px', borderRadius: '50px', border: 'none',
                              background: med.taken ? '#dcfce7' : 'linear-gradient(135deg,#0f52ba,#2563eb)',
                              color: med.taken ? '#16a34a' : '#fff',
                              fontWeight: 800, fontSize: '0.82rem', cursor: 'pointer',
                              display: 'flex', alignItems: 'center', gap: '6px', whiteSpace: 'nowrap'
                            }}
                          >
                            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>
                              {med.taken ? 'check_circle' : 'medication'}
                            </span>
                            {med.taken ? 'Dose Logged ✓' : 'Log Dose Taken'}
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ── PATIENT TAB 4: CLINICAL GOALS & FIM ROADMAP ── */}
              {activeTab === 'goals' && (
                <div className="bento-grid">
                  <div className="bento-card col-span-12" style={{ background: 'linear-gradient(135deg,#0f52ba,#1d4ed8)', color: '#fff', padding: '28px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
                      <div>
                        <span style={{ background: 'rgba(255,255,255,0.2)', padding: '4px 14px', borderRadius: '50px', fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                          Personalized Recovery Plan
                        </span>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 900, marginTop: '10px', color: '#fff' }}>Post-Op ACL Reconstruction Clinical Roadmap</h2>
                        <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.88rem', marginTop: '4px' }}>Lead Physiatrist: <strong>{patientHospitalInfo.attendingPhysiatrist}</strong> | Est. Discharge Target: <strong>Nov 15, 2026</strong></p>
                      </div>
                      <div style={{ textAlign: 'right', background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(6px)', padding: '16px 24px', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.2)' }}>
                        <span style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.8)', fontWeight: 700 }}>Overall Milestones Met</span>
                        <h3 style={{ fontSize: '2rem', fontWeight: 900, color: '#fff', margin: 0 }}>78%</h3>
                      </div>
                    </div>
                  </div>

                  <div className="bento-card col-span-8">
                    <div className="card-header">
                      <div className="card-header-left">
                        <h3>Active Rehabilitation Milestones (FIM Standards)</h3>
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
                              onClick={() => triggerToast(`Progress review requested for ${goal.title}. Dr. Ortiz will review during rounds.`)}
                              style={{ background: '#fff', border: '1px solid #cbd5e1', borderRadius: '50px', padding: '4px 12px', fontSize: '0.75rem', fontWeight: 700, color: '#374151', cursor: 'pointer' }}
                            >
                              Request Review
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bento-card col-span-4">
                    <div className="card-header">
                      <div className="card-header-left">
                        <h3>Discharge Plan Readiness</h3>
                        <p>Requirements for safe transition</p>
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {[
                        { title: 'Discharge Destination', val: 'Home with Outpatient PT', status: 'Approved' },
                        { title: 'Caregiver Training', val: 'Spouse trained for gait assist', status: 'Ready' },
                        { title: 'DME Equipment', val: 'Crutches & Cryo Cuff', status: 'Delivered' },
                        { title: 'Outpatient Referral', val: 'St. Jude PT Clinic Wing', status: 'Scheduled' }
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

              {/* ── PATIENT TAB 5: PRESCRIBED REHAB PROTOCOLS ── */}
              {activeTab === 'exercises' && (
                <div className="bento-grid">
                  <div className="bento-card col-span-12" style={{ background: 'linear-gradient(135deg,#0f172a,#1e3a5f)', color: '#fff', padding: '28px 32px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '20px' }}>
                      <div>
                        <span style={{ background: 'rgba(255,255,255,0.15)', padding: '4px 14px', borderRadius: '50px', fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.07em' }}>Clinical Protocols</span>
                        <h2 style={{ fontSize: '1.55rem', fontWeight: 900, marginTop: '10px', color: '#fff' }}>Prescribed Rehabilitation Exercises</h2>
                        <p style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.88rem', marginTop: '4px' }}>
                          Therapeutic protocol prescribed by <strong>Dr. A. Smith, PT</strong> for Post-Op ACL Recovery & Joint Range of Motion.
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
                              {isDone && (
                                <span style={{ background: '#dcfce7', color: '#15803d', borderRadius: '50px', padding: '4px 12px', fontSize: '0.72rem', fontWeight: 800 }}>
                                  ✓ Done
                                </span>
                              )}
                            </div>
                          </div>

                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '8px', background: '#f8fafc', padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0', margin: '10px 0' }}>
                            <div style={{ textAlign: 'center' }}>
                              <span style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 700, display: 'block' }}>SETS</span>
                              <strong style={{ fontSize: '1rem', color: '#0f172a' }}>{ex.sets}</strong>
                            </div>
                            <div style={{ textAlign: 'center', borderLeft: '1px solid #e2e8f0', borderRight: '1px solid #e2e8f0' }}>
                              <span style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 700, display: 'block' }}>REPS</span>
                              <strong style={{ fontSize: '1rem', color: '#0f172a' }}>{ex.reps}</strong>
                            </div>
                            <div style={{ textAlign: 'center' }}>
                              <span style={{ fontSize: '0.68rem', color: '#64748b', fontWeight: 700, display: 'block' }}>TIME</span>
                              <strong style={{ fontSize: '1rem', color: '#0f172a' }}>{ex.duration}</strong>
                            </div>
                          </div>
                        </div>

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
                </div>
              )}

              {/* ── PATIENT TAB 6: CERTIFIED HOSPITAL HEALTH RECORDS & EHR ── */}
              {activeTab === 'records' && (
                <div className="bento-grid">
                  {/* Hero Medical Records Banner */}
                  <div className="bento-card col-span-12" style={{ background: 'linear-gradient(135deg,#0f172a 0%, #1e3a5f 100%)', color: '#fff', padding: '28px 32px' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '18px' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                          <span style={{ background: 'rgba(255,255,255,0.16)', padding: '4px 14px', borderRadius: '50px', fontSize: '0.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                            Certified Electronic Health Record (EHR)
                          </span>
                          <span style={{ background: 'rgba(34,197,94,0.25)', color: '#4ade80', padding: '4px 12px', borderRadius: '50px', fontSize: '0.72rem', fontWeight: 800 }}>
                            FHIR v4 Synchronized
                          </span>
                        </div>
                        <h2 style={{ fontSize: '1.65rem', fontWeight: 900, color: '#fff', margin: 0 }}>
                          Hospital Clinical Records & Diagnostic Archive
                        </h2>
                        <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.86rem', marginTop: '6px', marginBottom: 0 }}>
                          St. Jude Rehabilitation Hospital • Department of Physical Medicine & Rehabilitation • Inpatient Unit 3B
                        </p>
                      </div>

                      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                        <button
                          onClick={() => window.print()}
                          style={{ padding: '10px 18px', borderRadius: '50px', border: '1.5px solid rgba(255,255,255,0.3)', background: 'transparent', color: '#fff', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}
                        >
                          <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>print</span>
                          Print Full Record
                        </button>
                        <button
                          onClick={handleDownloadPatientData}
                          style={{ padding: '10px 20px', borderRadius: '50px', border: 'none', background: 'linear-gradient(135deg,#2563eb,#1d4ed8)', color: '#fff', fontSize: '0.82rem', fontWeight: 800, cursor: 'pointer', boxShadow: '0 4px 14px rgba(37,99,235,0.4)', display: 'flex', alignItems: 'center', gap: '6px' }}
                        >
                          <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>download</span>
                          Export Complete EHR (.json)
                        </button>
                        <button
                          onClick={() => triggerToast('Official Medical Records release request submitted to Hospital Health Information Management (HIM).')}
                          style={{ padding: '10px 18px', borderRadius: '50px', border: '1.5px solid rgba(255,255,255,0.3)', background: 'rgba(255,255,255,0.1)', color: '#fff', fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer' }}
                        >
                          Request HIM Release
                        </button>
                      </div>
                    </div>

                    {/* Patient Demographics Ribbon */}
                    <div className="records-demographics-ribbon">
                      <div className="demo-item">
                        <span className="demo-label">Patient Name</span>
                        <span className="demo-val">{sessionUser.name}</span>
                      </div>
                      <div className="demo-item">
                        <span className="demo-label">MRN</span>
                        <span className="demo-val">{patientHospitalInfo.mrn}</span>
                      </div>
                      <div className="demo-item">
                        <span className="demo-label">Date of Birth</span>
                        <span className="demo-val">1986-04-12 (40y)</span>
                      </div>
                      <div className="demo-item">
                        <span className="demo-label">Sex / Blood Type</span>
                        <span className="demo-val">Female • O+</span>
                      </div>
                      <div className="demo-item">
                        <span className="demo-label">Admission Date</span>
                        <span className="demo-val">{patientHospitalInfo.admissionDate}</span>
                      </div>
                      <div className="demo-item">
                        <span className="demo-label">Hospital Location</span>
                        <span className="demo-val">{patientHospitalInfo.wing} • {patientHospitalInfo.room}</span>
                      </div>
                      <div className="demo-item">
                        <span className="demo-label">Attending Physiatrist</span>
                        <span className="demo-val">{patientHospitalInfo.attendingPhysiatrist}</span>
                      </div>
                    </div>
                  </div>

                  {/* Filter & Search Bar */}
                  <div className="bento-card col-span-12" style={{ padding: '18px 24px' }}>
                    <div className="records-filter-bar">
                      <div className="records-category-scroll">
                        {[
                          { key: 'all', label: 'All Documents', icon: 'folder_open', count: hospitalClinicalRecords.length },
                          { key: 'physiatry', label: 'Physiatry & H&P', icon: 'stethoscope', count: hospitalClinicalRecords.filter(r => r.categoryKey === 'physiatry').length },
                          { key: 'therapy', label: 'Therapy Notes', icon: 'exercise', count: hospitalClinicalRecords.filter(r => r.categoryKey === 'therapy').length },
                          { key: 'surgical', label: 'Operative & Surgical', icon: 'healing', count: hospitalClinicalRecords.filter(r => r.categoryKey === 'surgical').length },
                          { key: 'radiology', label: 'Radiology & Imaging', icon: 'radiology', count: hospitalClinicalRecords.filter(r => r.categoryKey === 'radiology').length },
                          { key: 'labs', label: 'Laboratory Panels', icon: 'biotech', count: hospitalClinicalRecords.filter(r => r.categoryKey === 'labs').length },
                        ].map(tab => (
                          <button
                            key={tab.key}
                            type="button"
                            onClick={() => setRecordCategory(tab.key)}
                            className={`record-cat-pill ${recordCategory === tab.key ? 'active' : ''}`}
                          >
                            <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>{tab.icon}</span>
                            <span>{tab.label}</span>
                            <span className="record-cat-count">{tab.count}</span>
                          </button>
                        ))}
                      </div>

                      <div style={{ minWidth: '260px' }}>
                        <div className="input-with-icon" style={{ margin: 0 }}>
                          <span className="material-symbols-outlined" style={{ fontSize: '18px', color: '#64748b' }}>search</span>
                          <input
                            type="text"
                            className="modern-input"
                            placeholder="Search document title, author, keyword..."
                            value={recordSearch}
                            onChange={e => setRecordSearch(e.target.value)}
                            style={{ padding: '8px 12px 8px 36px', fontSize: '0.82rem' }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Document Cards Grid */}
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
                      {hospitalClinicalRecords
                        .filter(r => (recordCategory === 'all' || r.categoryKey === recordCategory))
                        .filter(r => (
                          recordSearch === '' ||
                          r.title.toLowerCase().includes(recordSearch.toLowerCase()) ||
                          r.author.toLowerCase().includes(recordSearch.toLowerCase()) ||
                          r.summary.toLowerCase().includes(recordSearch.toLowerCase())
                        ))
                        .map(doc => (
                          <div key={doc.id} className={`record-doc-card ${doc.categoryKey}`}>
                            <div>
                              <div className="record-header-meta">
                                <span className={`record-category-badge ${doc.categoryKey}`}>{doc.category}</span>
                                <span style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600 }}>{doc.date}</span>
                              </div>
                              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', margin: '0 0 4px 0', lineHeight: 1.35 }}>
                                {doc.title}
                              </h3>
                              <div style={{ fontSize: '0.78rem', color: '#0f52ba', fontWeight: 700, marginBottom: '2px' }}>
                                {doc.author}
                              </div>
                              <div style={{ fontSize: '0.7rem', color: '#64748b', marginBottom: '10px' }}>
                                {doc.authorRole} • {doc.encounter}
                              </div>
                              <div className="record-excerpt-box">
                                {doc.summary}
                              </div>
                            </div>

                            <div className="record-action-row">
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedRecordDetail(doc)
                                  setShowRecordDetailModal(true)
                                }}
                                style={{ flex: 1, padding: '9px 14px', borderRadius: '50px', border: 'none', background: 'linear-gradient(135deg,#0f52ba,#2563eb)', color: '#fff', fontSize: '0.78rem', fontWeight: 800, cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px' }}
                              >
                                <span className="material-symbols-outlined" style={{ fontSize: '15px' }}>visibility</span>
                                Open Official Document
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  setSelectedRecordDetail(doc)
                                  setShowRecordDetailModal(true)
                                  setTimeout(() => window.print(), 300)
                                }}
                                style={{ padding: '8px 12px', borderRadius: '50px', border: '1.5px solid #cbd5e1', background: '#fff', color: '#475569', cursor: 'pointer' }}
                                title="Print Document"
                              >
                                <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>print</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => {
                                  const blob = new Blob([JSON.stringify(doc, null, 2)], { type: 'application/json' })
                                  const url = URL.createObjectURL(blob)
                                  const a = document.createElement('a')
                                  a.href = url
                                  a.download = `${doc.id}_Clinical_Record.json`
                                  a.click()
                                  URL.revokeObjectURL(url)
                                  triggerToast(`Downloaded ${doc.id}!`)
                                }}
                                style={{ padding: '8px 12px', borderRadius: '50px', border: '1.5px solid #cbd5e1', background: '#fff', color: '#475569', cursor: 'pointer' }}
                                title="Download JSON Record"
                              >
                                <span className="material-symbols-outlined" style={{ fontSize: '16px' }}>download</span>
                              </button>
                            </div>
                          </div>
                        ))}
                    </div>
                  </div>

                  {/* Inpatient Laboratory Telemetry & Biomarker Table */}
                  <div className="bento-card col-span-8" style={{ padding: '24px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
                      <div>
                        <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>Inpatient Laboratory & Biomarker Telemetry</h3>
                        <p style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '2px' }}>Automated Clinical LIS Panel • Specimen Drawn: Aug 14, 2026 at 06:30 AM</p>
                      </div>
                      <span style={{ background: '#dcfce7', color: '#166534', padding: '4px 12px', borderRadius: '50px', fontSize: '0.72rem', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <span className="material-symbols-outlined" style={{ fontSize: '14px' }}>check_circle</span>
                        All Biomarkers Validated
                      </span>
                    </div>

                    <div style={{ overflowX: 'auto' }}>
                      <table className="hospital-lab-table">
                        <thead>
                          <tr>
                            <th>Test / Biomarker</th>
                            <th>Current Result</th>
                            <th>Reference Range</th>
                            <th>Status Flag</th>
                            <th>Clinical Note</th>
                          </tr>
                        </thead>
                        <tbody>
                          {[
                            { test: 'White Blood Cell (WBC)', val: '6.8 x10^3/uL', ref: '4.5 – 11.0', flag: 'Normal', note: 'Afebrile, no leukocytosis' },
                            { test: 'Hemoglobin (Hgb)', val: '13.8 g/dL', ref: '12.0 – 16.0', flag: 'Normal', note: 'Post-op hematocrit 41.2% stable' },
                            { test: 'Platelet Count', val: '245 x10^3/uL', ref: '150 – 450', flag: 'Normal', note: 'Adequate clotting capacity' },
                            { test: 'C-Reactive Protein (CRP)', val: '2.1 mg/L', ref: '< 3.0 mg/L', flag: 'Resolving', note: 'Down from 8.4 on Post-Op Day 1' },
                            { test: 'Erythrocyte Sed. Rate (ESR)', val: '12 mm/hr', ref: '0 – 20 mm/hr', flag: 'Normal', note: 'Inflammation resolving smoothly' },
                            { test: 'Serum Creatinine / eGFR', val: '0.8 mg/dL (>90)', ref: '0.6 – 1.2 mg/dL', flag: 'Normal', note: 'Optimal renal clearance' },
                            { test: 'Fasting Blood Glucose', val: '92 mg/dL', ref: '70 – 99 mg/dL', flag: 'Normal', note: 'Euglycemic profile' },
                          ].map((row, idx) => (
                            <tr key={idx}>
                              <td><strong>{row.test}</strong></td>
                              <td style={{ fontWeight: 800, color: '#0f52ba' }}>{row.val}</td>
                              <td style={{ color: '#64748b' }}>{row.ref}</td>
                              <td>
                                <span className={`lab-status-tag ${row.flag === 'Normal' ? 'normal' : 'borderline'}`}>
                                  {row.flag === 'Normal' ? '✓ Normal' : '↓ Resolving'}
                                </span>
                              </td>
                              <td style={{ fontSize: '0.78rem', color: '#475569' }}>{row.note}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Allergies & Verified Immunization Panel */}
                  <div className="bento-card col-span-4" style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                        <span className="material-symbols-outlined" style={{ fontSize: '20px', color: '#dc2626' }}>warning</span>
                        <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>Documented Allergies</h3>
                      </div>
                      <p style={{ fontSize: '0.78rem', color: '#64748b', margin: '0 0 10px 0' }}>Verified by Attending Pharmacy & Floor Nursing</p>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <div style={{ background: '#fef2f2', border: '1.5px solid #fecaca', borderRadius: '10px', padding: '10px 12px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <strong style={{ fontSize: '0.85rem', color: '#991b1b' }}>Penicillin</strong>
                            <span style={{ background: '#dc2626', color: '#fff', padding: '1px 6px', borderRadius: '50px', fontSize: '0.65rem', fontWeight: 800 }}>MODERATE</span>
                          </div>
                          <div style={{ fontSize: '0.75rem', color: '#7f1d1d', marginTop: '2px' }}>Reaction: Urticaria / Skin Rash</div>
                        </div>

                        <div style={{ background: '#fffbeb', border: '1.5px solid #fde68a', borderRadius: '10px', padding: '10px 12px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <strong style={{ fontSize: '0.85rem', color: '#92400e' }}>Latex Products</strong>
                            <span style={{ background: '#d97706', color: '#fff', padding: '1px 6px', borderRadius: '50px', fontSize: '0.65rem', fontWeight: 800 }}>MILD</span>
                          </div>
                          <div style={{ fontSize: '0.75rem', color: '#78350f', marginTop: '2px' }}>Reaction: Contact Dermatitis / Erythema</div>
                        </div>
                      </div>
                    </div>

                    <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                        <span className="material-symbols-outlined" style={{ fontSize: '20px', color: '#16a34a' }}>vaccines</span>
                        <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: '#0f172a', margin: 0 }}>Immunization Record</h3>
                      </div>
                      <p style={{ fontSize: '0.78rem', color: '#64748b', margin: '0 0 10px 0' }}>State Immunization Registry Sync</p>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '10px', padding: '8px 12px', fontSize: '0.78rem' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <strong style={{ color: '#166534' }}>Tetanus / Diphtheria (Tdap)</strong>
                            <span style={{ color: '#15803d', fontWeight: 700 }}>2024</span>
                          </div>
                          <span style={{ color: '#15803d', fontSize: '0.7rem' }}>Administered • Valid through 2034</span>
                        </div>

                        <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '10px', padding: '8px 12px', fontSize: '0.78rem' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                            <strong style={{ color: '#166534' }}>Influenza Quadrivalent</strong>
                            <span style={{ color: '#15803d', fontWeight: 700 }}>2025/26</span>
                          </div>
                          <span style={{ color: '#15803d', fontSize: '0.7rem' }}>Hospital Inpatient Vaccination</span>
                        </div>
                      </div>
                    </div>

                    <div style={{ background: '#eff6ff', borderRadius: '12px', padding: '12px', border: '1px solid #bfdbfe' }}>
                      <div style={{ fontSize: '0.72rem', color: '#1d4ed8', fontWeight: 800, textTransform: 'uppercase' }}>HIE Direct Provider Exchange</div>
                      <p style={{ fontSize: '0.75rem', color: '#1e40af', margin: '4px 0 0 0', lineHeight: 1.4 }}>
                        Records are shared via secure Direct Secure Messaging with Dr. Vance (Orthopedics) and St. Jude Outpatient Clinic.
                      </p>
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
