import { useState } from 'react'
import { MapPin, Users, Award, Camera, ShieldCheck, CheckCircle2, ChevronRight, Settings } from 'lucide-react'
import ImageModal from './ImageModal'
import EndorseModal from './EndorseModal'
import AdminActionModal from './AdminActionModal'

const statusLabel = status => status?.replaceAll('_', ' ')

export default function IssueCard({
  issue,
  currentUser,
  onAffected,
  onStatus,
  onAssign,
  onAddNote,
  onEndorse,
  onDelete,
}) {
  const [showImageModal, setShowImageModal] = useState(false)
  const [showEndorseModal, setShowEndorseModal] = useState(false)
  const [showAdminModal, setShowAdminModal] = useState(false)

  const isTeacher = currentUser?.role === 'TEACHER'
  const isAdmin = currentUser?.role === 'ADMIN'
  const isStudent = currentUser?.role === 'STUDENT'
  const isReporter = currentUser?.email && currentUser.email.toLowerCase() === (issue.reporterEmail || '').toLowerCase()

  const choices = ['REPORTED', 'UNDER_REVIEW', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED', 'VERIFIED', 'CLOSED']

  return (
    <>
      <article className={`issueCard card ${issue.teacherEndorsed ? 'cardEndorsed' : ''} ${issue.priority === 'CRITICAL' ? 'cardCritical' : ''}`}>
        <div className="issueCardTop">
          <div className="badgeCluster">
            <span className={`priority ${issue.priority?.toLowerCase()}`}>{issue.priority}</span>
            <span className="ticket">{issue.ticketCode}</span>
            {issue.reporterRole === 'TEACHER' && (
              <span className="facultyPriorityTag">🧑‍🏫 Faculty Report</span>
            )}
          </div>
          <span className={`statusPill status-${issue.status?.toLowerCase()}`}>
            {statusLabel(issue.status)}
          </span>
        </div>

        {/* Photo evidence thumbnail */}
        {issue.imageUrl && (
          <div className="issueImageThumbnailWrapper" onClick={() => setShowImageModal(true)}>
            <img src={issue.imageUrl} alt={issue.title} className="issueThumbnail" />
            <div className="thumbnailOverlay">
              <Camera size={14} />
              <span>View Photo Evidence</span>
            </div>
          </div>
        )}

        <h3 className="issueTitle">{issue.title}</h3>
        <p className="issueDesc">{issue.description}</p>

        {/* Faculty Endorsement Banner */}
        {issue.teacherEndorsed && (
          <div className="endorsementBanner">
            <Award size={15} color="#8b5cf6" />
            <div>
              <strong>Faculty Endorsed</strong>
              {issue.endorsementNote && <p>{issue.endorsementNote}</p>}
            </div>
          </div>
        )}

        {/* Admin / Technician Note Banner */}
        {issue.adminNotes && (
          <div className="adminNoteBanner">
            <ShieldCheck size={15} color="#13a56f" />
            <div>
              <strong>Maintenance Update:</strong>
              <p>{issue.adminNotes}</p>
            </div>
          </div>
        )}

        {/* Metadata Details */}
        <div className="issueMeta">
          <span><MapPin size={14} />{issue.location}</span>
          <span><Users size={14} />{issue.affectedCount} affected</span>
          {issue.assignedTo && (
            <span className="assignedTag">🔧 {issue.assignedTo}</span>
          )}
        </div>

        {/* Footer with Role Specific Actions */}
        <div className="issueFooter">
          <span className="categoryChip">{issue.category}</span>

          <div className="actionGroup">
            {/* Admin Controls */}
            {isAdmin ? (
              <div className="adminQuickActions">
                <select
                  value={issue.status}
                  onChange={e => onStatus(issue.ticketCode, e.target.value)}
                  className="statusSelect"
                >
                  {choices.map(s => <option key={s} value={s}>{s.replace('_', ' ')}</option>)}
                </select>
                <button
                  className="secondaryBtn manageBtn"
                  onClick={() => setShowAdminModal(true)}
                  title="Manage assignment, notes & delete"
                >
                  <Settings size={14} /> Manage
                </button>
              </div>
            ) : isTeacher ? (
              /* Teacher Controls */
              <div className="teacherActions">
                {!issue.teacherEndorsed ? (
                  <button
                    className="endorseActionBtn"
                    onClick={() => setShowEndorseModal(true)}
                    title="Endorse this issue to elevate campus maintenance priority"
                  >
                    <Award size={14} /> Endorse Issue
                  </button>
                ) : (
                  <span className="endorsedCheckTag">✓ Endorsed</span>
                )}
                <button className="textButton" onClick={() => onAffected(issue.ticketCode)}>
                  I’m affected too ({issue.affectedCount})
                </button>
              </div>
            ) : (
              /* Student Controls */
              <div className="studentActions">
                {issue.status === 'RESOLVED' && isReporter ? (
                  <button
                    className="verifyBtn"
                    onClick={() => onStatus(issue.ticketCode, 'VERIFIED')}
                  >
                    <CheckCircle2 size={14} /> Verify Resolution
                  </button>
                ) : (
                  <button className="textButton" onClick={() => onAffected(issue.ticketCode)}>
                    I’m affected too ({issue.affectedCount})
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </article>

      {/* Lightbox photo viewer */}
      {showImageModal && (
        <ImageModal
          src={issue.imageUrl}
          title={`${issue.ticketCode}: ${issue.title}`}
          onClose={() => setShowImageModal(false)}
        />
      )}

      {/* Teacher Endorse Modal */}
      {showEndorseModal && (
        <EndorseModal
          issue={issue}
          teacher={currentUser}
          onClose={() => setShowEndorseModal(false)}
          onEndorse={onEndorse}
        />
      )}

      {/* Admin Action Modal */}
      {showAdminModal && (
        <AdminActionModal
          issue={issue}
          onClose={() => setShowAdminModal(false)}
          onUpdateStatus={onStatus}
          onAssign={onAssign}
          onAddNote={onAddNote}
          onDelete={onDelete}
        />
      )}
    </>
  )
}
