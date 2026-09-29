import { NavLink, Navigate, Route, Routes } from 'react-router-dom'
import logo from '../../../docs/octofitapp-small.png'
import './App.css'

const sections = [
  { label: 'Overview', path: '/' },
  { label: 'Activities', path: '/activities' },
  { label: 'Teams', path: '/teams' },
  { label: 'Leaderboard', path: '/leaderboard' },
  { label: 'Workouts', path: '/workouts' },
]

function SectionPage({ title }) {
  return (
    <main className="container py-5">
      <p className="section-kicker mb-2">OCTOFIT TRACKER</p>
      <h1 className="section-title mb-0">{title}</h1>
    </main>
  )
}

function App() {
  return (
    <div className="app-shell min-vh-100">
      <header className="border-bottom bg-white">
        <div className="container d-flex flex-column flex-lg-row align-items-lg-center justify-content-between gap-3 py-3">
          <NavLink className="brand d-flex align-items-center gap-2 text-decoration-none" to="/">
            <img src={logo} alt="" />
            <span>OctoFit</span>
          </NavLink>
          <nav className="nav nav-pills flex-nowrap overflow-auto" aria-label="Main navigation">
            {sections.map(({ label, path }) => (
              <NavLink
                className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
                end={path === '/'}
                key={path}
                to={path}
              >
                {label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>
      <Routes>
        {sections.map(({ label, path }) => (
          <Route element={<SectionPage title={label} />} key={path} path={path} />
        ))}
        <Route element={<Navigate replace to="/" />} path="*" />
      </Routes>
    </div>
  )
}

export default App
