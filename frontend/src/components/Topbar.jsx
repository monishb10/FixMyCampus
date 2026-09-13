import { Bell, Search, LogOut, ShieldCheck, Briefcase, GraduationCap } from 'lucide-react'

export default function Topbar({
  query,
  setQuery,
  currentUser,
  announcementsCount,
  onOpenAnnouncements,
  onLogout,
}) {
  const isTeacher = currentUser?.role === 'TEACHER'
  const isAdmin = currentUser?.role === 'ADMIN'

  return (
    <header className="topbar">
      <div className="searchBox">
        <Search size={18} />
        <input
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Search tickets, categories, locations, or facilities..."
        />
      </div>

      <div className="topActions">
        {/* Campus Announcements Bell */}
        <button
          className="iconButton noticeBellBtn"
          onClick={onOpenAnnouncements}
          title="Campus Broadcasts & Maintenance Alerts"
        >
          <Bell size={19} />
          {announcementsCount > 0 && (
            <span className="notifBadge">{announcementsCount}</span>
          )}
        </button>

        {/* User Profile Card */}
        <div className="profile">
          <div
            className="avatar"
            style={{ backgroundColor: `${currentUser?.color || '#225cff'}20`, color: currentUser?.color || '#225cff' }}
          >
            {currentUser?.avatar || 'MB'}
          </div>
          <div className="profileInfo">
            <strong>{currentUser?.name || 'Monish B'}</strong>
            <span className="roleTag" style={{ color: currentUser?.color || '#225cff' }}>
              {currentUser?.badge || 'Student'} • {currentUser?.department || 'CSE'}
            </span>
          </div>
        </div>

        {/* Logout Button */}
        <button
          className="logoutBtn"
          onClick={onLogout}
          title="Sign out of FixMyCampus"
        >
          <LogOut size={16} />
          <span>Sign Out</span>
        </button>
      </div>
    </header>
  )
}
