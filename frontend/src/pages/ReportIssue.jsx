import { useState, useEffect } from 'react'
import { AlertTriangle, Send, Sparkles, ShieldCheck, CheckCircle2, Award } from 'lucide-react'
import PhotoUpload from '../components/PhotoUpload'
import { DEPARTMENTS } from '../services/roles'

export default function ReportIssue({ onSubmit, currentUser }) {
  const isTeacher = currentUser?.role === 'TEACHER'
  const isAdmin = currentUser?.role === 'ADMIN'

  const [form, setForm] = useState({
    title: '',
    description: '',
    category: isTeacher ? 'Classroom Equipment' : 'Wi-Fi / Network',
    location: '',
    reporterName: currentUser?.name || 'Monish B',
    reporterEmail: currentUser?.email || 'monish@student.edu',
    reporterRole: currentUser?.role || 'STUDENT',
    severity: isTeacher ? 4 : 3,
    safetyRisk: false,
    imageUrl: '',
    assignedTo: '',
  })

  const [message, setMessage] = useState('')
  const [createdTicket, setCreatedTicket] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  // Sync reporter info if currentUser changes
  useEffect(() => {
    if (currentUser) {
      setForm(f => ({
        ...f,
        reporterName: currentUser.name,
        reporterEmail: currentUser.email,
        reporterRole: currentUser.role,
        category: currentUser.role === 'TEACHER' ? 'Classroom Equipment' : f.category,
        severity: currentUser.role === 'TEACHER' ? 4 : f.severity,
      }))
    }
  }, [currentUser])

  const update = (key, value) => setForm(f => ({ ...f, [key]: value }))

  async function submit(e) {
    e.preventDefault()
    setMessage('')
    setCreatedTicket(null)
    setSubmitting(true)

    try {
      const payload = {
        title: form.title.trim(),
        description: form.description.trim(),
        category: form.category,
        location: form.location.trim(),
        reporterName: form.reporterName.trim(),
        reporterEmail: form.reporterEmail.trim(),
        reporterRole: form.reporterRole,
        severity: Number(form.severity),
        safetyRisk: form.safetyRisk,
        imageUrl: form.imageUrl || null,
      }

      const issue = await onSubmit(payload)
      setCreatedTicket(issue)
      setMessage(`Ticket ${issue.ticketCode} logged successfully with priority: ${issue.priority}.`)
      
      // Reset form but keep reporter info
      setForm(prev => ({
        ...prev,
        title: '',
        description: '',
        location: '',
        severity: isTeacher ? 4 : 3,
        safetyRisk: false,
        imageUrl: '',
        assignedTo: '',
      }))
    } catch (err) {
      setMessage(`Failed to submit report: ${err.message}`)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="formLayout">
      <section className="card formCard">
        <div className="formHeader">
          <span className="eyebrow">
            {isTeacher ? 'FACULTY INFRASTRUCTURE REPORT' : isAdmin ? 'OPERATIONS TICKET LOG' : 'CAMPUS ISSUE REPORT'}
          </span>
          <h1>{isTeacher ? 'Report classroom / lab problem' : 'Report an issue'}</h1>
          <p>
            {isTeacher
              ? 'Faculty reports receive elevated priority dispatch to minimize disruption to classes, laboratory sessions, and exams.'
              : 'Maintenance staff uses your details and photo evidence to pinpoint and resolve campus infrastructure problems.'}
          </p>
        </div>

        {isTeacher && (
          <div className="facultyPriorityNotice">
            <Award size={18} color="#8b5cf6" />
            <div>
              <strong>Faculty Priority Mode Active</strong>
              <p>Reports submitted under faculty role are automatically marked with high priority and fast-track dispatch.</p>
            </div>
          </div>
        )}

        {isAdmin && (
          <div className="adminModeNotice">
            <ShieldCheck size={18} color="#e34b55" />
            <div>
              <strong>Administrative Ticket Intake</strong>
              <p>Create an official issue on behalf of campus departments or facilities inspection.</p>
            </div>
          </div>
        )}

        <form onSubmit={submit}>
          <label>
            Issue title
            <input
              required
              value={form.title}
              onChange={e => update('title', e.target.value)}
              placeholder={isTeacher ? 'e.g. Projector HDMI port damaged in Lab 3' : 'e.g. Water leaking near staircase landing'}
            />
          </label>

          <div className="twoCol">
            <label>
              Category
              <select value={form.category} onChange={e => update('category', e.target.value)}>
                {[
                  'Wi-Fi / Network',
                  'Water / Plumbing',
                  'Electrical',
                  'Classroom Equipment',
                  'Air Conditioning / Ventilation',
                  'Cleaning & Sanitation',
                  'Furniture & Seating',
                  'Safety / Security',
                  'Canteen / Cafeteria',
                ].map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </label>

            <label>
              Location
              <input
                required
                value={form.location}
                onChange={e => update('location', e.target.value)}
                placeholder="e.g. Block B - Room B204 / AI Lab"
              />
            </label>
          </div>

          <label>
            Detailed description
            <textarea
              required
              rows="4"
              value={form.description}
              onChange={e => update('description', e.target.value)}
              placeholder="Explain what is malfunctioning, when you noticed it, and how it impacts students/lectures..."
            />
          </label>

          <div className="twoCol">
            <label>
              Severity Rating: {form.severity}/5
              <input
                className="range"
                type="range"
                min="1"
                max="5"
                value={form.severity}
                onChange={e => update('severity', e.target.value)}
              />
              <span className="rangeHelper">
                {form.severity <= 2 ? 'Minor inconvenience' : form.severity <= 4 ? 'Disrupting daily activities' : 'Emergency / completely unusable'}
              </span>
            </label>

            <label className="checkLabel">
              <input
                type="checkbox"
                checked={form.safetyRisk}
                onChange={e => update('safetyRisk', e.target.checked)}
              />
              <span>
                <strong>Safety hazard or risk</strong>
                <small>Slippery floor, loose wiring, sparking, shattered glass, water leak near electrics</small>
              </span>
            </label>
          </div>

          {/* REAL PHOTO UPLOAD COMPONENT */}
          <div className="formFieldGroup">
            <label className="fieldLabel">
              <span>Photo Evidence</span>
              <small className="fieldHint">Attach an image of the problem for fast diagnosis</small>
            </label>
            <PhotoUpload
              imageUrl={form.imageUrl}
              onImageChange={(url) => update('imageUrl', url)}
            />
          </div>

          {/* Reporter Identification */}
          <div className="twoCol reporterPreview">
            <label>
              Reporting as:
              <input disabled value={`${currentUser?.name} (${currentUser?.badge || 'Student'})`} />
            </label>
            <label>
              Email address:
              <input disabled value={currentUser?.email || ''} />
            </label>
          </div>

          {message && (
            <div className={`formMessage ${createdTicket ? 'success' : 'error'}`}>
              {createdTicket && <CheckCircle2 size={16} />}
              <span>{message}</span>
            </div>
          )}

          <button className="primary submitBtn" disabled={submitting}>
            <Send size={17} />
            <span>{submitting ? 'Submitting Report...' : isTeacher ? 'Submit Faculty Priority Ticket' : 'Submit Campus Report'}</span>
          </button>
        </form>
      </section>

      <aside className="card guideCard">
        <AlertTriangle size={28} />
        <h3>How it works</h3>
        <ol>
          <li><strong>Unique FMC Ticket:</strong> Your report is instantly assigned a tracking number and logged in the database.</li>
          <li><strong>Real Photo Evidence:</strong> Photos are analyzed by maintenance supervisors to allocate correct spare parts and tools.</li>
          <li><strong>Smart Priority Calculation:</strong> Severity + Safety Risk + Reporter Role + Student Impact determine dispatch priority.</li>
          <li><strong>Live Status Lifecycle:</strong> Track progress from <em>Reported</em> to <em>In Progress</em> to <em>Resolved</em>.</li>
          <li><strong>Resolution Verification:</strong> Students and faculty can verify the fix in person.</li>
        </ol>

        <div className="campusHelpBox">
          <Sparkles size={16} color="#7ca3ff" />
          <small>Need urgent safety response? Call Campus Security Dispatch at <strong>Ext. 101</strong>.</small>
        </div>
      </aside>
    </div>
  )
}
