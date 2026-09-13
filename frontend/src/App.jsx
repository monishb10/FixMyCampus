import { useEffect, useMemo, useState } from 'react'
import Sidebar from './components/Sidebar'
import Topbar from './components/Topbar'
import Chatbot from './components/Chatbot'
import AnnouncementsDrawer from './components/AnnouncementsDrawer'
import AccessDenied from './components/AccessDenied'
import AuthPage from './pages/AuthPage'
import Dashboard from './pages/Dashboard'
import ReportIssue from './pages/ReportIssue'
import Issues from './pages/Issues'
import Admin from './pages/Admin'
import TeacherView from './pages/TeacherView'
import MyReports from './pages/MyReports'
import { api } from './services/api'
import { enrichUserProfile } from './services/roles'

export default function App() {
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const saved = localStorage.getItem('fixmycampus_auth_user')
      if (saved) {
        return enrichUserProfile(JSON.parse(saved))
      }
    } catch (e) {
      console.error('Failed to load user from localStorage:', e)
    }
    return null
  })

  const [page, setPage] = useState('dashboard')
  const [issues, setIssues] = useState([])
  const [stats, setStats] = useState(null)
  const [announcements, setAnnouncements] = useState([])
  const [showAnnouncements, setShowAnnouncements] = useState(false)
  const [query, setQuery] = useState('')
  const [error, setError] = useState('')

  async function refresh() {
    try {
      const [i, s, a] = await Promise.all([
        api.getIssues(),
        api.getStats(),
        api.getAnnouncements().catch(() => []),
      ])
      setIssues(i)
      setStats(s)
      setAnnouncements(a)
      setError('')
    } catch (e) {
      setError(`Backend connection error: ${e.message}`)
    }
  }

  useEffect(() => {
    if (currentUser) {
      refresh()
    }
  }, [currentUser])

  function handleLoginSuccess(user) {
    const enriched = enrichUserProfile(user)
    setCurrentUser(enriched)
    localStorage.setItem('fixmycampus_auth_user', JSON.stringify(user))
    setPage('dashboard')
  }

  function handleLogout() {
    localStorage.removeItem('fixmycampus_auth_user')
    setCurrentUser(null)
    setPage('dashboard')
  }

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim()
    if (!q) return issues
    return issues.filter(i =>
      [i.ticketCode, i.title, i.category, i.location, i.status, i.priority, i.reporterName, i.assignedTo]
        .some(v => String(v || '').toLowerCase().includes(q))
    )
  }, [issues, query])

  async function createIssue(data) {
    const res = await api.createIssue(data)
    await refresh()
    return res
  }

  async function affected(code) {
    await api.markAffected(code)
    await refresh()
  }

  async function status(code, next) {
    await api.updateStatus(code, next)
    await refresh()
  }

  async function assign(code, department) {
    await api.assignIssue(code, department)
    await refresh()
  }

  async function addNote(code, adminNote) {
    await api.addAdminNote(code, adminNote)
    await refresh()
  }

  async function endorse(code, facultyName, note) {
    await api.endorseIssue(code, facultyName, note)
    await refresh()
  }

  async function removeIssue(code) {
    await api.deleteIssue(code)
    await refresh()
  }

  async function addAnnouncement(data) {
    await api.createAnnouncement(data)
    await refresh()
  }

  async function removeAnnouncement(id) {
    await api.deleteAnnouncement(id)
    await refresh()
  }

  // IF NOT AUTHENTICATED: SHOW LOGIN / REGISTER PAGE
  if (!currentUser) {
    return <AuthPage onLoginSuccess={handleLoginSuccess} />
  }

  const role = currentUser.role

  return (
    <div className={`appShell role-${role.toLowerCase()}`}>
      <Sidebar
        page={page}
        setPage={setPage}
        currentUser={currentUser}
        onOpenAnnouncements={() => setShowAnnouncements(true)}
        onLogout={handleLogout}
      />

      <div className="mainShell">
        <Topbar
          query={query}
          setQuery={setQuery}
          currentUser={currentUser}
          announcementsCount={announcements.length}
          onOpenAnnouncements={() => setShowAnnouncements(true)}
          onLogout={handleLogout}
        />

        <main>
          {error && (
            <div className="errorBanner">
              {error} — ensure Spring Boot backend is running on port 8080.
            </div>
          )}

          {page === 'dashboard' && (
            <Dashboard
              stats={stats}
              issues={filtered}
              currentUser={currentUser}
              onAffected={affected}
              onStatus={status}
              onAssign={assign}
              onAddNote={addNote}
              onEndorse={endorse}
              onDelete={removeIssue}
              goReport={() => setPage('report')}
            />
          )}

          {page === 'report' && (
            <ReportIssue
              onSubmit={createIssue}
              currentUser={currentUser}
            />
          )}

          {page === 'issues' && (
            <Issues
              issues={filtered}
              currentUser={currentUser}
              onAffected={affected}
              onStatus={status}
              onAssign={assign}
              onAddNote={addNote}
              onEndorse={endorse}
              onDelete={removeIssue}
            />
          )}

          {/* ROLE PROTECTED: Admin Operations Console */}
          {page === 'admin' && (
            role === 'ADMIN' ? (
              <Admin
                stats={stats}
                issues={filtered}
                currentUser={currentUser}
                onStatus={status}
                onAssign={assign}
                onAddNote={addNote}
                onEndorse={endorse}
                onDelete={removeIssue}
                onOpenAnnouncements={() => setShowAnnouncements(true)}
              />
            ) : (
              <AccessDenied
                requiredRole="Administrator"
                currentRole={currentUser.badge}
                onGoHome={() => setPage('dashboard')}
              />
            )
          )}

          {/* ROLE PROTECTED: Teacher Classroom & Lab Watch */}
          {page === 'teacher-watch' && (
            role === 'TEACHER' ? (
              <TeacherView
                issues={filtered}
                currentUser={currentUser}
                onAffected={affected}
                onStatus={status}
                onAssign={assign}
                onAddNote={addNote}
                onEndorse={endorse}
                onDelete={removeIssue}
              />
            ) : (
              <AccessDenied
                requiredRole="Faculty / Teacher"
                currentRole={currentUser.badge}
                onGoHome={() => setPage('dashboard')}
              />
            )
          )}

          {/* Student & Teacher My Reports View */}
          {page === 'my-reports' && (
            <MyReports
              issues={filtered}
              currentUser={currentUser}
              onStatus={status}
              goReport={() => setPage('report')}
            />
          )}
        </main>
      </div>

      <Chatbot />

      {showAnnouncements && (
        <AnnouncementsDrawer
          announcements={announcements}
          currentUser={currentUser}
          onClose={() => setShowAnnouncements(false)}
          onAddAnnouncement={addAnnouncement}
          onDeleteAnnouncement={removeAnnouncement}
        />
      )}
    </div>
  )
}
