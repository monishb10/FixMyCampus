import { useState } from 'react'
import { ShieldCheck, X, Trash2, Check, UserCheck, MessageSquare } from 'lucide-react'
import { DEPARTMENTS, STATUS_CHOICES } from '../services/roles'

export default function AdminActionModal({ issue, onClose, onUpdateStatus, onAssign, onAddNote, onDelete }) {
  const [status, setStatus] = useState(issue.status || 'REPORTED')
  const [department, setDepartment] = useState(issue.assignedTo || '')
  const [adminNote, setAdminNote] = useState(issue.adminNotes || '')
  const [saving, setSaving] = useState(false)
  const [showConfirmDelete, setShowConfirmDelete] = useState(false)

  async function handleSave(e) {
    e.preventDefault()
    setSaving(true)
    try {
      if (status !== issue.status) {
        await onUpdateStatus(issue.ticketCode, status)
      }
      if (department !== (issue.assignedTo || '')) {
        await onAssign(issue.ticketCode, department)
      }
      if (adminNote !== (issue.adminNotes || '')) {
        await onAddNote(issue.ticketCode, adminNote)
      }
      onClose()
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    setSaving(true)
    try {
      await onDelete(issue.ticketCode)
      onClose()
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="modalOverlay" onClick={onClose}>
      <div className="modalCard adminActionModal" onClick={e => e.stopPropagation()}>
        <div className="modalHeader">
          <div className="modalTitle">
            <ShieldCheck size={20} color="#e34b55" />
            <h3>Operations Management: {issue.ticketCode}</h3>
          </div>
          <button className="modalCloseBtn" onClick={onClose}><X size={18} /></button>
        </div>

        <div className="modalContent">
          <div className="ticketSummary">
            <strong>{issue.title}</strong>
            <small>{issue.location} • Reported by {issue.reporterName} ({issue.reporterRole || 'STUDENT'})</small>
          </div>

          <form onSubmit={handleSave}>
            <div className="twoCol">
              <label>
                Workflow Status:
                <select value={status} onChange={e => setStatus(e.target.value)}>
                  {STATUS_CHOICES.map(s => (
                    <option key={s} value={s}>{s.replace('_', ' ')}</option>
                  ))}
                </select>
              </label>

              <label>
                Assign Department / Team:
                <select value={department} onChange={e => setDepartment(e.target.value)}>
                  <option value="">-- Unassigned --</option>
                  {DEPARTMENTS.map(d => (
                    <option key={d} value={d}>{d}</option>
                  ))}
                </select>
              </label>
            </div>

            <label>
              Admin & Technician Notes / Progress Remarks:
              <textarea
                rows="3"
                value={adminNote}
                onChange={e => setAdminNote(e.target.value)}
                placeholder="e.g. Technician dispatched with replacement part; ETA 2 hours..."
              />
            </label>

            <div className="modalActions adminActionsRow">
              <button
                type="button"
                className="dangerBtn"
                onClick={() => setShowConfirmDelete(true)}
              >
                <Trash2 size={16} /> Delete Ticket
              </button>

              <div className="rightButtons">
                <button type="button" className="secondaryBtn" onClick={onClose}>Cancel</button>
                <button type="submit" className="primary" disabled={saving}>
                  <Check size={16} /> {saving ? 'Saving...' : 'Save Updates'}
                </button>
              </div>
            </div>
          </form>

          {showConfirmDelete && (
            <div className="deleteConfirmOverlay">
              <div className="deleteConfirmBox">
                <h4>Confirm Ticket Deletion</h4>
                <p>Are you sure you want to permanently delete ticket <strong>{issue.ticketCode}</strong>? This action cannot be undone.</p>
                <div className="confirmActions">
                  <button className="secondaryBtn" onClick={() => setShowConfirmDelete(false)}>Cancel</button>
                  <button className="dangerBtn" onClick={handleDelete} disabled={saving}>
                    {saving ? 'Deleting...' : 'Yes, Delete Permanently'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
