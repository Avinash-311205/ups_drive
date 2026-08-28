import React, {useState} from 'react'
import Navbar from '../../components/Navbar'
import HRSidebar from '../../components/HRSidebar'
import { supportTickets } from '../../services/mockServices'

export default function SupportTicketsPageHR(){
  const [tickets,setTickets] = useState(supportTickets)
  const [active,setActive] = useState(null)
  const [response,setResponse] = useState('')

  function openTicket(t){ setActive(t); setResponse('') }
  function submitResponse(){
    if(!active) return
    active.response = response
    active.status = 'Completed'
    // reflect in global mock
    const idx = supportTickets.findIndex(s=>s.id===active.id)
    if(idx>=0) supportTickets[idx] = active
    setTickets([...supportTickets])
    alert('Response submitted and ticket marked Completed')
    setActive(null)
  }
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1">
        <HRSidebar />
        <main className="p-6 flex-1">
          <h3 className="font-semibold text-xl">Support Tickets</h3>
          <div className="card mt-4 p-4">
            <table className="w-full text-left">
              <thead><tr className="muted text-sm"><th>Ticket ID</th><th>Employee</th><th>Issue</th><th>Created</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                {tickets.map(t=> (
                  <tr key={t.id} className="border-t border-border">
                    <td className="py-2">{t.id}</td>
                    <td>{t.employee}</td>
                    <td>{t.issue}</td>
                    <td>{t.created}</td>
                    <td>{t.status}</td>
                    <td><button className="p-1 rounded border border-border" onClick={()=>openTicket(t)}>OPEN</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {active && (
            <div className="fixed inset-0 flex items-center justify-center z-40">
              <div className="w-full max-w-2xl card p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-semibold">{active.issue}</div>
                    <div className="muted text-sm">{active.id} • {active.employee}</div>
                  </div>
                  <div><button className="p-1 rounded border border-border" onClick={()=>setActive(null)}>Close</button></div>
                </div>
                <div className="mt-4">
                  <div className="muted">Conversation / Response</div>
                  <textarea value={response} onChange={e=>setResponse(e.target.value)} className="w-full p-2 bg-black3 rounded border border-border mt-2" rows={6} />
                  <div className="flex gap-2 justify-end mt-2">
                    <button className="p-2 rounded border border-border" onClick={()=>setActive(null)}>Cancel</button>
                    <button className="gold-btn p-2 rounded" onClick={submitResponse}>Submit Response</button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
