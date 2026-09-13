import { Bot, MessageCircle, Send, X } from 'lucide-react'
import { useState } from 'react'
import { api } from '../services/api'

export default function Chatbot() {
  const [open, setOpen] = useState(false)
  const [input, setInput] = useState('')
  const [busy, setBusy] = useState(false)
  const [messages, setMessages] = useState([
    { role: 'bot', text: 'Hi! I’m CampusBot. Ask about reporting, priority, critical issues, or a ticket like FMC-1002.' }
  ])

  async function send() {
    const text = input.trim()
    if (!text || busy) return
    setMessages(m => [...m, { role: 'user', text }])
    setInput('')
    setBusy(true)
    try {
      const data = await api.chat(text)
      setMessages(m => [...m, { role: 'bot', text: data.reply }])
    } catch (e) {
      setMessages(m => [...m, { role: 'bot', text: `I couldn't reach the backend. ${e.message}` }])
    } finally { setBusy(false) }
  }

  return (
    <>
      <button className="chatFab" onClick={() => setOpen(!open)}>{open ? <X/> : <MessageCircle/>}</button>
      {open && <section className="chatPanel">
        <div className="chatHeader"><div className="botAvatar"><Bot size={20}/></div><div><strong>CampusBot</strong><span><i/> Online campus assistant</span></div></div>
        <div className="chatMessages">
          {messages.map((m, i) => <div key={i} className={`message ${m.role}`}>{m.text}</div>)}
          {busy && <div className="message bot">Thinking…</div>}
        </div>
        <div className="chatInput"><input value={input} onChange={e=>setInput(e.target.value)} onKeyDown={e=>e.key==='Enter'&&send()} placeholder="Ask CampusBot..."/><button onClick={send}><Send size={18}/></button></div>
      </section>}
    </>
  )
}
