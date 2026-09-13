import { useState, useMemo } from 'react'
import { Filter, Layers, CheckCircle2 } from 'lucide-react'
import IssueCard from '../components/IssueCard'

export default function Issues({
  issues,
  currentUser,
  onAffected,
  onStatus,
  onAssign,
  onAddNote,
  onEndorse,
  onDelete,
}) {
  const [selectedCategory, setSelectedCategory] = useState('ALL')
  const [selectedPriority, setSelectedPriority] = useState('ALL')

  const categories = ['ALL', 'Wi-Fi / Network', 'Water / Plumbing', 'Electrical', 'Classroom Equipment', 'Air Conditioning / Ventilation', 'Cleaning & Sanitation', 'Furniture & Seating', 'Safety / Security']
  const priorities = ['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW']

  const filtered = useMemo(() => {
    return issues.filter(i => {
      if (selectedCategory !== 'ALL' && i.category !== selectedCategory) return false
      if (selectedPriority !== 'ALL' && i.priority !== selectedPriority) return false
      return true
    })
  }, [issues, selectedCategory, selectedPriority])

  return (
    <>
      <section className="pageTitle">
        <span className="eyebrow">CAMPUS-WIDE DIRECTORY</span>
        <h1>Campus issues feed</h1>
        <p>Transparent real-time issue tracking and community impact for students, faculty, and maintenance teams.</p>
      </section>

      <div className="feedFilterBar">
        <div className="filterGroup">
          <label>Category:</label>
          <select value={selectedCategory} onChange={e => setSelectedCategory(e.target.value)}>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        <div className="filterGroup">
          <label>Priority:</label>
          <select value={selectedPriority} onChange={e => setSelectedPriority(e.target.value)}>
            {priorities.map(p => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>

        <span className="feedCount">Showing {filtered.length} of {issues.length} tickets</span>
      </div>

      {filtered.length > 0 ? (
        <div className="issueGrid">
          {filtered.map(i => (
            <IssueCard
              key={i.id}
              issue={i}
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
          <CheckCircle2 size={36} color="#13a56f" />
          <h3>No matching issues found</h3>
          <p>No campus issues match your active category and priority filters.</p>
        </div>
      )}
    </>
  )
}
