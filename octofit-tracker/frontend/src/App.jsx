import { NavLink, Navigate, Route, Routes } from 'react-router-dom'
import logo from '../../../docs/octofitapp-small.png'
import Activities from './components/Activities.jsx'
import Leaderboard from './components/Leaderboard.jsx'
import Teams from './components/Teams.jsx'
import Users from './components/Users.jsx'
import Workouts from './components/Workouts.jsx'
import { formatDate, PageHeading } from './components/shared.jsx'
import { useCollection } from './hooks/useCollection.js'
import './App.css'

const sections = [
  { label: 'Overview', path: '/' },
  { label: 'Users', path: '/users' },
  { label: 'Activities', path: '/activities' },
  { label: 'Teams', path: '/teams' },
  { label: 'Leaderboard', path: '/leaderboard' },
  { label: 'Workouts', path: '/workouts' },
]

function Overview() {
  const users = useCollection('users')
  const teams = useCollection('teams')
  const activities = useCollection('activities')
  const workouts = useCollection('workouts')

  const metrics = [
    { label: 'Members', value: users.records.length, loading: users.isLoading },
    { label: 'Teams', value: teams.records.length, loading: teams.isLoading },
    { label: 'Activities', value: activities.records.length, loading: activities.isLoading },
    { label: 'Workouts', value: workouts.records.length, loading: workouts.isLoading },
  ]

  return (
    <main className="page container-fluid">
      <PageHeading
        description="A live view of member activity and team progress."
        eyebrow="OCTOFIT TRACKER"
        title="Overview"
      />
      <section aria-label="Tracker totals" className="metric-strip">
        {metrics.map(({ label, value, loading }) => (
          <div className="metric-item" key={label}>
            <span>{label}</span>
            <strong>{loading ? '—' : value}</strong>
          </div>
        ))}
      </section>
      <section className="overview-activity">
        <div className="subsection-heading">
          <div>
            <p className="page-eyebrow">LATEST ENTRIES</p>
            <h2>Recent activity</h2>
          </div>
          <NavLink className="inline-link" to="/activities">All activities</NavLink>
        </div>
        {activities.isLoading ? (
          <p className="collection-message" role="status">Loading recent activity...</p>
        ) : activities.error ? (
          <p className="collection-message collection-error" role="alert">{activities.error}</p>
        ) : activities.records.length === 0 ? (
          <p className="collection-message">No activities have been logged yet.</p>
        ) : (
          <ul className="activity-feed">
            {activities.records.slice(0, 4).map((activity, index) => (
              <li key={activity._id || activity.id || `${activity.type}-${index}`}>
                <span className="feed-marker" aria-hidden="true" />
                <span className="feed-type">{activity.type || 'Activity'}</span>
                <span className="feed-duration">{activity.durationMinutes ?? '—'} min</span>
                <time className="feed-date" dateTime={activity.completedAt || undefined}>
                  {formatDate(activity.completedAt)}
                </time>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  )
}

function App() {
  return (
    <div className="app-shell min-vh-100">
      <header className="site-header">
        <div className="site-header-inner container-fluid">
          <NavLink className="brand" to="/">
            <img src={logo} alt="" />
            <span>OctoFit <small>TRACKER</small></span>
          </NavLink>
          <nav className="primary-nav" aria-label="Main navigation">
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
        <Route element={<Overview />} path="/" />
        <Route element={<Users />} path="/users" />
        <Route element={<Activities />} path="/activities" />
        <Route element={<Teams />} path="/teams" />
        <Route element={<Leaderboard />} path="/leaderboard" />
        <Route element={<Workouts />} path="/workouts" />
        <Route element={<Navigate replace to="/" />} path="*" />
      </Routes>
    </div>
  )
}

export default App
