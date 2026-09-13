import { useState, useMemo } from 'react'
import { Award, Building2, CheckCircle2, Filter, AlertTriangle, Sparkles } from 'lucide-react'
import IssueCard from '../components/IssueCard'

export default function TeacherView({ issues, currentUser, onAffected, onStatus, onAssign, onAddNote, onEndorse, onDelete }) {
  const [filterType, setFilterType] = useState('pending') // 'pending' | 'endorsed' | 'all-academic'

  // Academic issues: Classroom, Wi-Fi, Electrical, AC
  const academicIssues = useMemo(() => {
    return issues.filter(i => 
      ['Classroom Equipment', 'Wi-Fi / Network', 'Air Conditioning / Ventilation', 'Electrical'].includes(i.category) ||
      (i.location && (i.location.toLowerCase().includes('lab') || i.location.toLowerCase().includes('room') || i.location.toLowerCase().includes('block')))
    )
  }, [issues])

  const displayedIssues = useMemo(() => {
    if (filterType === 'pending') {
      return academicIssues.filter(i => !i.teacherEndorsed && i.status !== 'RESOLVED' && i.status !== 'CLOSED')
    }
    if (filterType === 'endorsed') {
      return academicIssues.filter(i => i.teacherEndorsed)
    }
    return academicIssues
  }, [academicIssues, filterType])

  const pendingCount = academicIssues.filter(i => !i.teacherEndorsed && i.status !== 'RESOLVED' && i.status !== 'CLOSED').length
  const endorsedCount = academicIssues.filter(i => i.teacherEndorsed).length

  return (
    <div className="teacherWatchPage">
      <section className="pageTitle">
        <span className="eyebrow">FACULTY ACADEMIC OVERSIGHT</span>
        <h1>Classroom, Labs & Faculty Endorsements</h1>
        <p>
          Review academic infrastructure issues reported across lecture halls and laboratories.
          Endorse student issues to fast-track maintenance dispatch before classes or examinations.
        </p>
      </section>

      {/* Overview Stat Cards */}
      <div className="facultyStatsGrid">
        <div className="facultyStatCard">
          <div className="facultyStatIcon pending">
            <AlertTriangle size={22} />
          </div>
          <div>
            <strong>{pendingCount}</strong>
            <span>Awaiting Faculty Endorsement</span>
          </div>
        </div>

        <div className="facultyStatCard">
          <div className="facultyStatIcon endorsed">
            <Award size={22} />
          </div>
          <div>
            <strong>{endorsedCount}</strong>
            <span>Faculty Endorsed & Escalated</span>
          </div>
        </div>

        <div className="facultyStatCard">
          <div className="facultyStatIcon total">
            <Building2 size={22} />
          </div>
          <div>
            <strong>{academicIssues.length}</strong>
            <span>Total Academic Facility Tickets</span>
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="filterToolbar">
        <div className="filterTabs">
          <button
            className={`filterTab ${filterType === 'pending' ? 'active' : ''}`}
            onClick={() => setFilterType('pending')}
          >
            Awaiting Endorsement ({pendingCount})
          </button>
          <button
            className={`filterTab ${filterType === 'endorsed' ? 'active' : ''}`}
            onClick={() => setFilterType('endorsed')}
          >
            Faculty Endorsed ({endorsedCount})
          </button>
          <button
            className={`filterTab ${filterType === 'all-academic' ? 'active' : ''}`}
            onClick={() => setFilterType('all-academic')}
          >
            All Academic Facilities ({academicIssues.length})
          </button>
        </div>
      </div>

      {/* Issues Grid */}
      {displayedIssues.length > 0 ? (
        <div className="issueGrid">
          {displayedIssues.map(issue => (
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
      ) : (
        <div className="emptyState card">
          <CheckCircle2 size={40} color="#13a56f" />
          <h3>All academic facilities clear</h3>
          <p>
            {filterType === 'pending'
              ? 'No pending student tickets in lecture halls or labs require endorsement at this time.'
              : 'No issues match the selected filter.'}
          </p>
        </div>
      )}
    </div>
  )
}
