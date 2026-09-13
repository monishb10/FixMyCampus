import {
  BarChart3,
  Building2,
  ClipboardPlus,
  LayoutDashboard,
  ShieldCheck,
  Award,
  Clock,
  Megaphone,
  GraduationCap,
  Briefcase,
  LogOut,
} from 'lucide-react'

export default function Sidebar({ page, setPage, currentUser, onOpenAnnouncements, onLogout }) {
  const role = (currentUser?.role || 'STUDENT').toUpperCase()

  const getNavItems = () => {
    switch (role) {
      case 'TEACHER':
        return [
          { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
          { id: 'report', icon: ClipboardPlus, label: 'Faculty Report (Priority)' },
          { id: 'issues', icon: Building2, label: 'Campus Issues' },
          { id: 'teacher-watch', icon: Award, label: 'Faculty Labs & Endorse' },
        ]
      case 'ADMIN':
        return [
          { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
          { id: 'admin', icon: BarChart3, label: 'Operations Console' },
          { id: 'issues', icon: Building2, label: 'All Campus Issues' },
          { id: 'report', icon: ClipboardPlus, label: 'Log New Ticket' },
        ]
      case 'STUDENT':
      default:
        return [
          { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
          { id: 'report', icon: ClipboardPlus, label: 'Report Issue' },
          { id: 'issues', icon: Building2, label: 'Campus Issues' },
          { id: 'my-reports', icon: Clock, label: 'My Reports' },
        ]
    }
  }

  const items = getNavItems()

  return (
    <aside className="sidebar">
      <div className="brand">
        <div className="brandMark">
          <ShieldCheck size={24} />
        </div>
        <div>
          <strong>FixMyCampus</strong>
          <span>Smart Operations</span>
        </div>
      </div>

      <nav>
        {items.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            className={page === id ? 'active' : ''}
            onClick={() => setPage(id)}
          >
            <Icon size={19} />
            <span>{label}</span>
          </button>
        ))}
      </nav>

      <div className="sidebarRoleCard">
        <div className="roleCardHeader">
          {role === 'TEACHER' && <Briefcase size={16} color="#c084fc" />}
          {role === 'ADMIN' && <ShieldCheck size={16} color="#f87171" />}
          {role === 'STUDENT' && <GraduationCap size={16} color="#60a5fa" />}
          <strong>{currentUser?.badge || 'Student'} Mode</strong>
        </div>
        <p className="roleDescription">{currentUser?.description}</p>
        
        <div className="sidebarCardActions">
          <button
            type="button"
            className="sidebarNoticeBtn"
            onClick={onOpenAnnouncements}
          >
            <Megaphone size={14} /> Campus Notices
          </button>
          <button
            type="button"
            className="sidebarLogoutBtn"
            onClick={onLogout}
            title="Sign out of your account"
          >
            <LogOut size={13} /> Sign Out
          </button>
        </div>
      </div>
    </aside>
  )
}
