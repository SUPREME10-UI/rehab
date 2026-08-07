import { useState } from 'react'
import './App.css'

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: '◧' },
  { id: 'patients', label: 'Patient Management', icon: '◔' },
  { id: 'assessment', label: 'Assessment', icon: '◈' },
  { id: 'planning', label: 'Treatment Planning', icon: '◌' },
  { id: 'sessions', label: 'Therapy Sessions', icon: '◎' },
  { id: 'exercises', label: 'Exercise Library', icon: '◍' },
  { id: 'portal', label: 'Patient Portal', icon: '◑' },
]

const stats = [
  { title: 'Total Patients', value: '248', hint: '+12 this week' },
  { title: 'Occupancy', value: '84%', hint: '12 beds available' },
  { title: 'Avg. Recovery Score', value: '71%', hint: 'up 8% from last month' },
  { title: 'Pending Assessments', value: '19', hint: '3 high priority' },
]

const patients = [
  { name: 'Eleanor Vance', diagnosis: 'Stroke recovery', status: 'Inpatient', progress: '78%' },
  { name: 'Marcus Thorne', diagnosis: 'Orthopedic rehab', status: 'Outpatient', progress: '66%' },
  { name: 'Sarah Jenkins', diagnosis: 'Neurological therapy', status: 'Inpatient', progress: '82%' },
]

const exercises = [
  { name: 'Sit-to-Stand Transfer', focus: 'Mobility', duration: '10 min' },
  { name: 'Standing Heel Raises', focus: 'Balance', duration: '8 min' },
  { name: 'Shoulder Band Press', focus: 'Strength', duration: '12 min' },
]

function App() {
  const [activeView, setActiveView] = useState('dashboard')
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const currentModule = navItems.find((item) => item.id === activeView) ?? navItems[0]

  return (
    <div className="app-shell">
      <div className={`mobile-overlay ${sidebarOpen ? 'open' : ''}`} onClick={() => setSidebarOpen(false)} />

      <aside className={`sidebar ${sidebarOpen ? 'open' : ''}`}>
        <div className="brand-block">
          <div className="brand-icon">✚</div>
          <div>
            <h2>RHMS</h2>
            <p>Clinical Portal</p>
          </div>
        </div>

        <button className="primary-action">New Admission</button>

        <nav className="nav-list">
          {navItems.map((item) => (
            <button
              key={item.id}
              className={`nav-item ${activeView === item.id ? 'active' : ''}`}
              onClick={() => {
                setActiveView(item.id)
                setSidebarOpen(false)
              }}
            >
              <span>{item.icon}</span>
              {item.label}
            </button>
          ))}
        </nav>

        <div className="sidebar-footer">
          <p>Care team</p>
          <strong>Dr. Lena Ortiz</strong>
          <span>Lead Rehabilitation Specialist</span>
        </div>
      </aside>

      <div className="main-panel">
        <header className="topbar">
          <div className="topbar-left">
            <button className="icon-button mobile-only" onClick={() => setSidebarOpen(true)}>
              ☰
            </button>
            <div>
              <p className="eyebrow">Rehab Management</p>
              <h1>{currentModule.label}</h1>
            </div>
          </div>

          <div className="topbar-right">
            <label className="search-box">
              <span>⌕</span>
              <input type="text" placeholder="Search patients or notes" />
            </label>
            <button className="icon-button">🔔</button>
            <button className="profile-pill">
              <div className="avatar">LO</div>
              <span>Profile</span>
            </button>
          </div>
        </header>

        <main className="content-area">
          {activeView === 'dashboard' && (
            <>
              <section className="hero-card">
                <div>
                  <p className="hero-badge">Today at a glance</p>
                  <h2>Recovery plans are trending positively across the unit.</h2>
                  <p>Monitor patient progress, upcoming sessions, and therapy coverage from one calm clinical workspace.</p>
                </div>
                <div className="hero-metrics">
                  <div>
                    <strong>14</strong>
                    <span>Appointments</span>
                  </div>
                  <div>
                    <strong>92%</strong>
                    <span>Care plan compliance</span>
                  </div>
                </div>
              </section>

              <section className="stats-grid">
                {stats.map((stat) => (
                  <article key={stat.title} className="stat-card">
                    <p>{stat.title}</p>
                    <strong>{stat.value}</strong>
                    <span>{stat.hint}</span>
                  </article>
                ))}
              </section>

              <section className="content-grid">
                <article className="panel panel-large">
                  <div className="panel-header">
                    <div>
                      <p className="eyebrow">Patient overview</p>
                      <h3>Active recovery journeys</h3>
                    </div>
                    <button className="text-button">View all</button>
                  </div>

                  <table>
                    <thead>
                      <tr>
                        <th>Patient</th>
                        <th>Diagnosis</th>
                        <th>Status</th>
                        <th>Progress</th>
                      </tr>
                    </thead>
                    <tbody>
                      {patients.map((patient) => (
                        <tr key={patient.name}>
                          <td>{patient.name}</td>
                          <td>{patient.diagnosis}</td>
                          <td>
                            <span className={`status-pill ${patient.status === 'Inpatient' ? 'inpatient' : 'outpatient'}`}>
                              {patient.status}
                            </span>
                          </td>
                          <td>{patient.progress}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </article>

                <article className="panel">
                  <div className="panel-header">
                    <div>
                      <p className="eyebrow">Care distribution</p>
                      <h3>Therapy mix</h3>
                    </div>
                  </div>
                  <div className="bar-list">
                    <div className="bar-row">
                      <label>Physical therapy</label>
                      <div className="bar-track"><span style={{ width: '72%' }} /></div>
                    </div>
                    <div className="bar-row">
                      <label>Occupational therapy</label>
                      <div className="bar-track"><span style={{ width: '58%' }} /></div>
                    </div>
                    <div className="bar-row">
                      <label>Speech therapy</label>
                      <div className="bar-track"><span style={{ width: '41%' }} /></div>
                    </div>
                  </div>
                </article>
              </section>
            </>
          )}

          {activeView === 'patients' && (
            <section className="panel">
              <div className="panel-header">
                <div>
                  <p className="eyebrow">Patient management</p>
                  <h3>Directory and care status</h3>
                </div>
                <button className="primary-action small">Add patient</button>
              </div>
              <div className="card-list">
                {patients.map((patient) => (
                  <article key={patient.name} className="mini-card">
                    <div>
                      <h4>{patient.name}</h4>
                      <p>{patient.diagnosis}</p>
                    </div>
                    <div className="mini-meta">
                      <span className={`status-pill ${patient.status === 'Inpatient' ? 'inpatient' : 'outpatient'}`}>{patient.status}</span>
                      <strong>{patient.progress}</strong>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}

          {activeView === 'assessment' && (
            <section className="panel full-width">
              <div className="panel-header">
                <div>
                  <p className="eyebrow">Assessment</p>
                  <h3>Comprehensive rehab evaluation</h3>
                </div>
                <button className="primary-action small">Complete assessment</button>
              </div>

              <div className="form-grid">
                <label>
                  Mobility level
                  <select defaultValue="Independent with supervision">
                    <option>Independent with supervision</option>
                    <option>Requires minimal assistance</option>
                    <option>Needs contact guard</option>
                  </select>
                </label>
                <label>
                  Pain score
                  <input type="range" defaultValue="4" min="0" max="10" />
                </label>
                <label>
                  Functional goal
                  <textarea defaultValue="Patient will improve transfer safety and ambulate 150 feet with a walker." rows="3" />
                </label>
              </div>
            </section>
          )}

          {activeView === 'planning' && (
            <section className="panel full-width">
              <div className="panel-header">
                <div>
                  <p className="eyebrow">Treatment planning</p>
                  <h3>Personalized therapy roadmap</h3>
                </div>
              </div>
              <div className="card-list">
                <article className="mini-card plan-card">
                  <div>
                    <h4>Phase 1: Mobility</h4>
                    <p>Daily transfers, gait support, and balance drills.</p>
                  </div>
                  <strong>5x weekly</strong>
                </article>
                <article className="mini-card plan-card">
                  <div>
                    <h4>Phase 2: Strength</h4>
                    <p>Resistance-based sessions and endurance building.</p>
                  </div>
                  <strong>3x weekly</strong>
                </article>
              </div>
            </section>
          )}

          {activeView === 'sessions' && (
            <section className="panel full-width">
              <div className="panel-header">
                <div>
                  <p className="eyebrow">Therapy sessions</p>
                  <h3>Session log and patient response</h3>
                </div>
              </div>
              <div className="card-list">
                <article className="mini-card">
                  <div>
                    <h4>Morning PT</h4>
                    <p>Completed 12 minutes of gait training with steady response.</p>
                  </div>
                  <strong>Completed</strong>
                </article>
                <article className="mini-card">
                  <div>
                    <h4>Afternoon OT</h4>
                    <p>Improved dressing sequence and upper body coordination.</p>
                  </div>
                  <strong>Scheduled</strong>
                </article>
              </div>
            </section>
          )}

          {activeView === 'exercises' && (
            <section className="panel full-width">
              <div className="panel-header">
                <div>
                  <p className="eyebrow">Exercise library</p>
                  <h3>Evidence-based rehabilitation activities</h3>
                </div>
              </div>
              <div className="card-list">
                {exercises.map((exercise) => (
                  <article key={exercise.name} className="mini-card">
                    <div>
                      <h4>{exercise.name}</h4>
                      <p>{exercise.focus}</p>
                    </div>
                    <strong>{exercise.duration}</strong>
                  </article>
                ))}
              </div>
            </section>
          )}

          {activeView === 'portal' && (
            <section className="panel full-width">
              <div className="panel-header">
                <div>
                  <p className="eyebrow">Patient portal</p>
                  <h3>Recovery progress at a glance</h3>
                </div>
              </div>
              <div className="hero-card portal-card">
                <div>
                  <p className="hero-badge">Patient update</p>
                  <h2>Your mobility score improved by 15% this week.</h2>
                  <p>Keep following your plan and attend the next coaching session on Friday.</p>
                </div>
                <div className="hero-metrics">
                  <div>
                    <strong>4</strong>
                    <span>Sessions left</span>
                  </div>
                  <div>
                    <strong>87%</strong>
                    <span>Daily plan adherence</span>
                  </div>
                </div>
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  )
}

export default App
