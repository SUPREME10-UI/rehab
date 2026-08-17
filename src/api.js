// ============================================================================
// RehabConnect Frontend API Client
// Handles REST calls to backend server with JSON payloads and error fallbacks
// ============================================================================

const API_BASE = '/api'

async function request(endpoint, options = {}) {
  const url = `${API_BASE}${endpoint}`
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {})
  }

  try {
    const res = await fetch(url, {
      ...options,
      headers
    })

    const data = await res.json().catch(() => ({}))

    if (!res.ok) {
      throw new Error(data.error || `HTTP error ${res.status}: ${res.statusText}`)
    }

    return data
  } catch (err) {
    console.error(`[API Error] ${endpoint}:`, err.message)
    throw err
  }
}

export const api = {
  // Health
  checkHealth: () => request('/health'),

  // Auth
  login: (email, password, role) => request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password, role })
  }),

  register: (payload) => request('/auth/register', {
    method: 'POST',
    body: JSON.stringify(payload)
  }),

  getCurrentUser: (userId = 1) => request(`/auth/me?userId=${userId}`),

  // Patients
  getPatients: () => request('/patients'),
  getPatientDetail: (id = 1) => request(`/patients/${id}`),
  updatePatientProfile: (id, updates) => request(`/patients/${id}`, {
    method: 'PUT',
    body: JSON.stringify(updates)
  }),

  // Appointments
  getAppointments: (params = {}) => {
    const query = new URLSearchParams(params).toString()
    return request(`/appointments${query ? `?${query}` : ''}`)
  },

  bookAppointment: (payload) => request('/appointments/book', {
    method: 'POST',
    body: JSON.stringify(payload)
  }),

  updateAppointmentStatus: (id, status) => request(`/appointments/${id}/status`, {
    method: 'PATCH',
    body: JSON.stringify({ status })
  }),

  // Exercises
  getExercises: () => request('/exercises'),
  getPrescribedExercises: (patientId = 1) => request(`/exercises/prescribed?patientId=${patientId}`),
  completeExercise: (patientExerciseId, completed = true) => request('/exercises/complete', {
    method: 'POST',
    body: JSON.stringify({ patientExerciseId, completed })
  }),
  prescribeExercise: (payload) => request('/exercises/prescribe', {
    method: 'POST',
    body: JSON.stringify(payload)
  }),

  // Clinical Notes & Inquiries
  getClinicalNotes: (patientId = 1) => request(`/clinical/notes?patientId=${patientId}`),
  addClinicalNote: (payload) => request('/clinical/notes', {
    method: 'POST',
    body: JSON.stringify(payload)
  }),

  submitInquiry: (payload) => request('/clinical/inquiries', {
    method: 'POST',
    body: JSON.stringify(payload)
  }),
  getInquiries: () => request('/clinical/inquiries')
}

export default api
