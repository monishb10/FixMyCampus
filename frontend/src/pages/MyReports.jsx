import { useState, useMemo } from 'react'
import { Clock, CheckCircle2, AlertCircle, Camera, ChevronRight, MapPin, Users, PlusCircle } from 'lucide-react'
import ImageModal from '../components/ImageModal'

export default function MyReports({ issues, currentUser, onStatus, goReport }) {
  const [selectedPhoto, setSelectedPhoto] = useState(null)

  const myIssues = useMemo(() => {
    if (!currentUser?.email) return []
    const userEmail = currentUser.email.toLowerCase()
    return issues.filter(i => (i.reporterEmail || '').toLowerCase() === userEmail)
  }, [issues, currentUser])

  const stages = ['REPORTED', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED', 'VERIFIED']

  function getStageIndex(status) {
    if (status === 'UNDER_REVIEW') return 0
    if (status === 'CLOSED') return 4
    const idx = stages.indexOf(status)
    return idx >= 0 ? idx : 0
  }

  return (
    <div className="myReportsPage">
      <section className="pageTitle">
        <div className="titleWithAction">
          <div>
            <span className="eyebrow">MY CAMPUS REPORTS</span>
            <h1>Track your reported issues</h1>
            <p>
              Monitor the live progress of issues submitted by <strong>{currentUser?.name}</strong> ({currentUser?.email}).
            </p>
          </div>
          <button className="primary" onClick={goReport}>
            <PlusCircle size={16} /> Log Another Issue
          </button>
        </div>
      </section>

      {myIssues.length > 0 ? (
        <div className="myReportsList">
          {myIssues.map((issue) => {
            const currentIdx = getStageIndex(issue.status)
            return (
              <article key={issue.id} className="card reportTrackerCard">
                <div className="trackerHeader">
                  <div className="trackerTitle">
                    <span className={`priority ${issue.priority?.toLowerCase()}`}>{issue.priority}</span>
                    <span className="ticket">{issue.ticketCode}</span>
                    <h3>{issue.title}</h3>
                  </div>
                  <span className={`statusPill status-${issue.status?.toLowerCase()}`}>
                    {issue.status?.replace('_', ' ')}
                  </span>
                </div>

                <p className="trackerDesc">{issue.description}</p>

                <div className="trackerMeta">
                  <span><MapPin size={14} /> {issue.location}</span>
                  <span><Users size={14} /> {issue.affectedCount} impacted</span>
                  <span className="categoryChip">{issue.category}</span>
                  {issue.assignedTo && (
                    <span className="assignedTag">🔧 Assigned to {issue.assignedTo}</span>
                  )}
                </div>

                {/* Photo Evidence if uploaded */}
                {issue.imageUrl && (
                  <div className="trackerPhotoRow">
                    <div className="photoThumbSmall" onClick={() => setSelectedPhoto(issue.imageUrl)}>
                      <img src={issue.imageUrl} alt="Uploaded evidence" />
                      <div className="thumbOverlay">
                        <Camera size={13} /> View Photo
                      </div>
                    </div>
                    <span className="photoLabel">Evidence photo attached to ticket</span>
                  </div>
                )}

                {/* Admin Note if maintenance left a remark */}
                {issue.adminNotes && (
                  <div className="adminNoteBanner">
                    <CheckCircle2 size={15} color="#13a56f" />
                    <div>
                      <strong>Update from Campus Maintenance:</strong>
                      <p>{issue.adminNotes}</p>
                    </div>
                  </div>
                )}

                {/* Progress Step Indicator */}
                <div className="progressSteps">
                  {stages.map((stg, idx) => {
                    const isPassed = currentIdx >= idx
                    const isCurrent = currentIdx === idx
                    return (
                      <div key={stg} className={`stepItem ${isPassed ? 'passed' : ''} ${isCurrent ? 'current' : ''}`}>
                        <div className="stepDot">{isPassed ? '✓' : idx + 1}</div>
                        <span className="stepLabel">{stg.replace('_', ' ')}</span>
                      </div>
                    )
                  })}
                </div>

                {/* Verification action for resolved tickets */}
                {issue.status === 'RESOLVED' && (
                  <div className="verificationActionBox">
                    <div>
                      <strong>Maintenance marked this issue as resolved.</strong>
                      <p>Have you verified this in person? Confirm resolution to close out the ticket.</p>
                    </div>
                    <button
                      className="primary verifyBtn"
                      onClick={() => onStatus(issue.ticketCode, 'VERIFIED')}
                    >
                      <CheckCircle2 size={16} /> Verify & Confirm Resolved
                    </button>
                  </div>
                )}
              </article>
            )
          })}
        </div>
      ) : (
        <div className="emptyState card">
          <AlertCircle size={44} color="#94a3b8" />
          <h3>No reports submitted yet</h3>
          <p>You have not logged any campus issues under {currentUser?.email} yet.</p>
          <button className="primary" onClick={goReport} style={{ marginTop: '16px' }}>
            <PlusCircle size={16} /> Report an Issue Now
          </button>
        </div>
      )}

      {selectedPhoto && (
        <ImageModal
          src={selectedPhoto}
          title="Submitted Photo Evidence"
          onClose={() => setSelectedPhoto(null)}
        />
      )}
    </div>
  )
}
