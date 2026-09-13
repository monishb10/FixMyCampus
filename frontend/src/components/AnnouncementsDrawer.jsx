import { useState } from 'react'
import { Bell, Megaphone, Plus, Trash2, X, AlertCircle } from 'lucide-react'

export default function AnnouncementsDrawer({ announcements, currentUser, onClose, onAddAnnouncement, onDeleteAnnouncement }) {
  const [showAddForm, setShowAddForm] = useState(false)
  const [title, setTitle] = useState('')
  const [message, setMessage] = useState('')
  const [category, setCategory] = useState('Maintenance')
  const [targetRole, setTargetRole] = useState('ALL')
  const [submitting, setSubmitting] = useState(false)

  const isAdmin = currentUser?.role === 'ADMIN'

  async function handleCreate(e) {
    e.preventDefault()
    setSubmitting(true)
    try {
      await onAddAnnouncement({
        title,
        message,
        category,
        targetRole,
        createdBy: currentUser?.name || 'Campus Admin',
      })
      setTitle('')
      setMessage('')
      setShowAddForm(false)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="modalOverlay" onClick={onClose}>
      <div className="announcementsDrawer" onClick={e => e.stopPropagation()}>
        <div className="drawerHeader">
          <div className="drawerTitle">
            <Megaphone size={20} color="#225cff" />
            <div>
              <h3>Campus Broadcasts & Alerts</h3>
              <span>Official maintenance & facility updates</span>
            </div>
          </div>
          <button className="modalCloseBtn" onClick={onClose}><X size={19} /></button>
        </div>

        <div className="drawerBody">
          {isAdmin && !showAddForm && (
            <button className="primary addNoticeBtn" onClick={() => setShowAddForm(true)}>
              <Plus size={16} /> Broadcast New Notice
            </button>
          )}

          {showAddForm && (
            <form className="announcementForm card" onSubmit={handleCreate}>
              <h4>Post Campus Announcement</h4>
              <label>
                Title
                <input
                  required
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  placeholder="e.g. Water Tank Maintenance in Block B"
                />
              </label>

              <div className="twoCol">
                <label>
                  Category
                  <select value={category} onChange={e => setCategory(e.target.value)}>
                    <option>Maintenance</option>
                    <option>IT / Network</option>
                    <option>Electrical</option>
                    <option>Urgent Safety Notice</option>
                    <option>General</option>
                  </select>
                </label>

                <label>
                  Target Audience
                  <select value={targetRole} onChange={e => setTargetRole(e.target.value)}>
                    <option value="ALL">All Campus (Students & Staff)</option>
                    <option value="STUDENTS">Students Only</option>
                    <option value="TEACHERS">Faculty / Teachers Only</option>
                  </select>
                </label>
              </div>

              <label>
                Notice Message
                <textarea
                  required
                  rows="3"
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  placeholder="Provide timing, affected blocks, and instructions..."
                />
              </label>

              <div className="formRowButtons">
                <button type="button" className="secondaryBtn" onClick={() => setShowAddForm(false)}>Cancel</button>
                <button type="submit" className="primary" disabled={submitting}>
                  {submitting ? 'Posting...' : 'Publish Announcement'}
                </button>
              </div>
            </form>
          )}

          <div className="announcementList">
            {announcements && announcements.length > 0 ? (
              announcements.map((a) => (
                <article key={a.id} className="announcementCard">
                  <div className="announcementTop">
                    <span className="noticeCategory">{a.category}</span>
                    <span className="noticeTarget">{a.targetRole === 'ALL' ? 'All Campus' : a.targetRole}</span>
                    {isAdmin && (
                      <button
                        className="deleteNoticeBtn"
                        title="Delete announcement"
                        onClick={() => onDeleteAnnouncement(a.id)}
                      >
                        <Trash2 size={14} />
                      </button>
                    )}
                  </div>
                  <h4>{a.title}</h4>
                  <p>{a.message}</p>
                  <div className="announcementFooter">
                    <span>Issued by {a.createdBy}</span>
                  </div>
                </article>
              ))
            ) : (
              <div className="emptyNotices">
                <AlertCircle size={32} color="#9aa5b9" />
                <p>No active campus announcements right now.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
