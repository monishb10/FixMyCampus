export default function StatCard({ label, value, note, icon: Icon }) {
  return (
    <div className="statCard card">
      <div className="statIcon"><Icon size={20}/></div>
      <div><span>{label}</span><strong>{value ?? '—'}</strong><small>{note}</small></div>
    </div>
  )
}
