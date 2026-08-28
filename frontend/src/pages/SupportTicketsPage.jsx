import React, {useState} from 'react'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import { supportTickets } from '../services/mockServices'

export default function SupportTicketsPage(){
  const [tickets,setTickets] = useState(supportTickets)
  const [form,setForm] = useState({issue:'',description:''})

  function createTicket(e){
    e.preventDefault()
    const id = `IT-${Math.floor(1000 + Math.random()*9000)}`
    const newT = {id,employee:'You',issue:form.issue,description:form.description,created:new Date().toLocaleString(),status:'Open'}
    supportTickets.push(newT)
    setTickets([...supportTickets])
    setForm({issue:'',description:''})
    alert('Support ticket created: '+id)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="p-6 flex-1">
          <h3 className="font-semibold text-xl">Support Tickets</h3>
          <div className="mt-4 grid md:grid-cols-2 gap-4">
            <div className="card p-4">
              <h4 className="font-semibold mb-2">Raise a Support Ticket</h4>
              <form onSubmit={createTicket} className="space-y-2">
                <input required value={form.issue} onChange={e=>setForm({...form,issue:e.target.value})} placeholder="Issue title" className="p-2 bg-black3 rounded border border-border w-full" />
                <textarea required value={form.description} onChange={e=>setForm({...form,description:e.target.value})} placeholder="Describe the issue" className="p-2 bg-black3 rounded border border-border w-full" />
                <button className="gold-btn p-2 rounded" type="submit">Submit Ticket</button>
              </form>
            </div>

            <div className="card p-4">
              <h4 className="font-semibold mb-2">My Tickets</h4>
              {tickets.map(t=>(
                <div key={t.id} className="p-3 border-b border-border">
                  <div className="font-semibold">{t.issue}</div>
                  <div className="muted text-sm">{t.id} • {t.created}</div>
                  <div className="mt-1">Status: {t.status}{t.status==='Completed' && <span className="ml-2 text-green-400"> • Token Submitted</span>}</div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
