import { ShieldAlert, ArrowLeft } from 'lucide-react'

export default function AccessDenied({ requiredRole, currentRole, onGoHome }) {
  return (
    <div className="accessDeniedCard card">
      <div className="accessDeniedIcon">
        <ShieldAlert size={44} color="#ef4444" />
      </div>
      <h2>Access Restricted</h2>
      <p>
        This section is reserved for <strong>{requiredRole}</strong> users.
        You are currently logged in as a <strong>{currentRole}</strong>.
      </p>
      <div className="accessDeniedActions">
        <button className="primary" onClick={onGoHome}>
          <ArrowLeft size={16} /> Return to Dashboard
        </button>
      </div>
    </div>
  )
}
