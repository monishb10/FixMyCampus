import { useState, useMemo } from 'react'
import {
  ShieldCheck,
  Users,
  Building2,
  AlertTriangle,
  Megaphone,
  CheckCircle2,
  Settings,
  Filter,
} from 'lucide-react'
import IssueCard from '../components/IssueCard'
import { DEPARTMENTS, STATUS_CHOICES } from '../services/roles'

export default function Admin({
  stats,
  issues,
  currentUser,
  onStatus,
  onAssign,
  onAddNote,
  onEndorse,
  onDelete,
  onOpenAnnouncements,
}) {
  const [filterCategory, setFilterCategory] = useState('ALL')
  const [filterStatus, setFilterStatus] = useState('ALL')
  const [filterUnassignedOnly, setFilterUnassignedOnly] = useState(false)

  const cats = Object.entries(stats?.byCategory || {})
  const max = Math.max(1, ...cats.map(([, v]) => v))

  const filteredIssues = useMemo(() => {
    return issues.filter(i => {
      if (filterCategory !== 'ALL' && i.category !== filterCategory) return false
      if (filterStatus !== 'ALL' && i.status !== filterStatus) return false
      if (filterUnassignedOnly && i.assignedTo) return false
      return true
    })
  }, [issues, filterCategory, filterStatus, filterUnassignedOnly])

  const unassignedCount = issues.filter(i => !i.assignedTo && i.status !== 'RESOLVED' && i.status !== 'CLOSED').length

  return (
    <div className="adminDashboardPage">
      <section className="pageTitle">
        <div className="titleWithAction">
          <div>
            <span className="eyebrow">CAMPUS OPERATIONS HEADQUARTERS</span>
            <h1>Facilities & Maintenance Command</h1>
            <p>
              Assign tickets to specialized teams, update workflow statuses, inspect photo evidence, and post emergency notices.
            </p>
          </div>
          <button className="primary" onClick={onOpenAnnouncements}>
            <Megaphone size={16} /> Campus Notices & Alerts
          </button>
        </div>
      </section>

      {/* Top Operations KPI Grid */}
      <div className="adminGrid">
        <section className="card analyticsCard">
          <div className="cardHeader">
            <h3>Issue Distribution by Category</h3>
            <span className="statSub">{stats?.totalIssues ?? 0} total tickets</span>
          </div>
          <div className="categoryBars">
            {cats.map(([c, v]) => (
              <div className="barRow" key={c}>
                <span>{c}</span>
                <div>
                  <i style={{ width: `${(v / max) * 100}%` }} />
                </div>
                <strong>{v}</strong>
              </div>
            ))}
          </div>
        </section>

        <section className="card summaryCard">
          <div className="summaryMetrics">
            <div>
              <span>Campus Resolution Rate</span>
              <strong>{stats?.resolutionRate ?? 0}%</strong>
              <p>
                {stats?.resolvedIssues ?? 0} resolved of {stats?.totalIssues ?? 0} tickets
              </p>
              <div className="progress">
                <i style={{ width: `${stats?.resolutionRate ?? 0}%` }} />
              </div>
            </div>

            <div className="unassignedAlertBox">
              <AlertTriangle size={18} color={unassignedCount > 0 ? '#f39b31' : '#13a56f'} />
              <div>
                <strong>{unassignedCount} Unassigned Tickets</strong>
                <p>Issues awaiting maintenance team dispatch</p>
              </div>
              {unassignedCount > 0 && (
                <button
                  type="button"
                  className="quickFilterBtn"
                  onClick={() => setFilterUnassignedOnly(!filterUnassignedOnly)}
                >
                  {filterUnassignedOnly ? 'Show All' : 'Filter Unassigned'}
                </button>
              )}
            </div>
          </div>
        </section>
      </div>

      {/* Operations Filter Bar */}
      <section className="sectionHead">
        <div>
          <span className="eyebrow">TICKET LIFECYCLE MANAGEMENT</span>
          <h2>Active Maintenance Queue ({filteredIssues.length})</h2>
        </div>

        <div className="adminFilters">
          <select
            value={filterStatus}
            onChange={e => setFilterStatus(e.target.value)}
            className="filterSelect"
          >
            <option value="ALL">All Statuses</option>
            {STATUS_CHOICES.map(s => (
              <option key={s} value={s}>{s.replace('_', ' ')}</option>
            ))}
          </select>

          <select
            value={filterCategory}
            onChange={e => setFilterCategory(e.target.value)}
            className="filterSelect"
          >
            <option value="ALL">All Categories</option>
            {cats.map(([c]) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </section>

      {/* Tickets Grid */}
      {filteredIssues.length > 0 ? (
        <div className="issueGrid">
          {filteredIssues.map(issue => (
            <IssueCard
              key={issue.id}
              issue={issue}
              currentUser={currentUser}
              onAffected={onStatus}
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
          <h3>No tickets match criteria</h3>
          <p>Try clearing filters to see all campus maintenance items.</p>
        </div>
      )}
    </div>
  )
}
