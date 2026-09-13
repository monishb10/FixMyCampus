import { AlertTriangle, CheckCircle2, CircleDot, Users, Sparkles } from 'lucide-react'
import StatCard from '../components/StatCard'
import IssueCard from '../components/IssueCard'

export default function Dashboard({
  stats,
  issues,
  currentUser,
  onAffected,
  onStatus,
  onAssign,
  onAddNote,
  onEndorse,
  onDelete,
  goReport,
}) {
  const isTeacher = currentUser?.role === 'TEACHER'
  const isAdmin = currentUser?.role === 'ADMIN'

  return (
    <>
      <section className="hero card">
        <div>
          <span className="eyebrow">
            {isTeacher ? 'FACULTY INFRASTRUCTURE WATCH' : isAdmin ? 'CAMPUS OPERATIONS HUB' : 'CAMPUS CARE CENTER'}
          </span>
          <h1>
            {isTeacher ? (
              <>Keep labs & classrooms <em>fully operational.</em></>
            ) : isAdmin ? (
              <>Real-time maintenance <em>command & control.</em></>
            ) : (
              <>See a problem? <em>Make it visible.</em></>
            )}
          </h1>
          <p>
            {isTeacher
              ? 'Report lecture equipment failures with Faculty Priority, review classroom readiness, and endorse student reports to expedite repairs.'
              : isAdmin
              ? 'Assign technical departments, track repair lifecycles, and broadcast campus-wide maintenance notices.'
              : 'Report campus infrastructure issues with photo evidence, follow progress in real-time, and upvote community concerns.'}
          </p>
          <div className="heroActions">
            <button className="primary" onClick={goReport}>
              {isTeacher ? 'Log Faculty Priority Issue' : isAdmin ? 'Log Maintenance Ticket' : 'Report an Issue with Photo'}
            </button>
            <span>Active mode: <strong>{currentUser?.name}</strong> ({currentUser?.badge})</span>
          </div>
        </div>
        <div className="heroVisual">
          <div className="pulseRing">
            <span>{stats?.resolutionRate ?? 0}%</span>
            <small>resolution rate</small>
          </div>
        </div>
      </section>

      <div className="statsGrid">
        <StatCard icon={CircleDot} label="Active issues" value={stats?.activeIssues} note="Across campus" />
        <StatCard icon={AlertTriangle} label="Critical issues" value={stats?.criticalIssues} note="Urgent safety/academic" />
        <StatCard icon={CheckCircle2} label="Resolved" value={stats?.resolvedIssues} note="Completed fixes" />
        <StatCard icon={Users} label="People affected" value={stats?.peopleAffected} note="Community impact" />
      </div>

      <section className="sectionHead">
        <div>
          <span className="eyebrow">CAMPUS FEED</span>
          <h2>Issues needing attention</h2>
        </div>
      </section>

      <div className="issueGrid">
        {issues.slice(0, 4).map(issue => (
          <IssueCard
            key={issue.id}
            issue={issue}
            currentUser={currentUser}
            onAffected={onAffected}
            onStatus={onStatus}
            onAssign={onAssign}
            onAddNote={onAddNote}
            onEndorse={onEndorse}
            onDelete={onDelete}
          />
        ))}
      </div>
    </>
  )
}
