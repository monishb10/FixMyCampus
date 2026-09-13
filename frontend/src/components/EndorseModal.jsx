import { useState } from 'react'
import { Award, X, Sparkles, Send } from 'lucide-react'

export default function EndorseModal({ issue, teacher, onClose, onEndorse }) {
  const [note, setNote] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const quickNotes = [
    'Critical lab equipment blocking scheduled practical evaluation.',
    'Classroom presentation system unusable for morning lectures.',
    'High-traffic student pathway safety hazard.',
    'Verified condition in person; urgent maintenance requested.',
  ]

  async function handleSubmit(e) {
    e.preventDefault()
    setSubmitting(true)
    try {
      await onEndorse(issue.ticketCode, teacher.name, note || 'Endorsed by faculty for urgent attention')
      onClose()
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="modalOverlay" onClick={onClose}>
      <div className="modalCard" onClick={e => e.stopPropagation()}>
        <div className="modalHeader">
          <div className="modalTitle">
            <Award size={20} color="#8b5cf6" />
            <h3>Faculty Endorsement & Escalation</h3>
          </div>
          <button className="modalCloseBtn" onClick={onClose}><X size={18} /></button>
        </div>

        <div className="modalContent">
          <div className="ticketSummary">
            <span className="ticketCode">{issue.ticketCode}</span>
            <strong>{issue.title}</strong>
            <small>{issue.location} • {issue.category}</small>
          </div>

          <p className="endorseExplainer">
            As a faculty member, your endorsement adds administrative weight, boosting the ticket’s priority score and alerting maintenance dispatch.
          </p>

          <div className="quickNotesGroup">
            <span>Quick reasons:</span>
            <div className="quickNoteChips">
              {quickNotes.map((qn, i) => (
                <button
                  key={i}
                  type="button"
                  className="chipBtn"
                  onClick={() => setNote(qn)}
                >
                  {qn}
                </button>
              ))}
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            <label>
              Faculty Remarks / Justification:
              <textarea
                rows="3"
                value={note}
                onChange={e => setNote(e.target.value)}
                placeholder="Explain the academic impact or facility urgency..."
                required
              />
            </label>

            <div className="modalActions">
              <button type="button" className="secondaryBtn" onClick={onClose}>Cancel</button>
              <button type="submit" className="primary endorseBtn" disabled={submitting}>
                <Sparkles size={16} />
                {submitting ? 'Escalating...' : 'Submit Faculty Endorsement'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
