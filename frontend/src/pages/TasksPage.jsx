import React,{useState, useMemo, useEffect} from 'react'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import { apiRequest } from '../services/apiService'
import { getCurrentUser } from '../services/authService'

export default function TasksPage(){
  const [query,setQuery] = useState('')
  const [priority,setPriority] = useState('All')
  const [status,setStatus] = useState('All')
  const [tasks,setTasks] = useState([])
  const user = getCurrentUser()

  useEffect(() => {
    if (user) apiRequest(`/tasks/${user.id}`).then(setTasks).catch(() => {})
  }, [user?.id])

  const filtered = useMemo(()=>{
    return tasks.filter(t=>{
      if(query && !t.title.toLowerCase().includes(query.toLowerCase()) && !(t.description || '').toLowerCase().includes(query.toLowerCase())) return false
      if(priority !== 'All'){
        if(priority === 'Important' && t.priority !== 'High') return false
        if(['High','Medium','Low'].includes(priority) && t.priority !== priority) return false
      }
      if(status !== 'All'){
        if(status === 'Completed' && t.status !== 'Completed') return false
        if(status === 'Not Completed' && t.status === 'Completed') return false
      }
      return true
    })
  },[query,priority,status])

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="p-6 flex-1">
          <h3 className="font-semibold text-xl">My Tasks</h3>
          <div className="mt-4 card p-4">
            <div className="flex items-center justify-between mb-3">
              <input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search tasks" className="p-2 bg-black3 rounded border border-border" />
              <div className="flex gap-2">
                <select value={priority} onChange={e=>setPriority(e.target.value)} className="bg-black3 p-2 rounded border border-border">
                  <option value="All">All Priorities</option>
                  <option value="Important">Important</option>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
                <select value={status} onChange={e=>setStatus(e.target.value)} className="bg-black3 p-2 rounded border border-border">
                  <option value="All">All Status</option>
                  <option value="Completed">Completed</option>
                  <option value="Not Completed">Not Completed</option>
                </select>
              </div>
            </div>
            <div>
              {filtered.map(t=> (
                <div key={t.id} className="p-3 border-b border-border flex items-center justify-between">
                  <div>
                    <div className="font-semibold">{t.title}</div>
                    <div className="text-sm muted">{t.description}</div>
                  </div>
                  <div className="text-right">
                    <div className="muted">{t.deadline}</div>
                    <div className="mt-1">{t.priority==='High'? <span className="text-red-400">🔴 High</span>: t.priority==='Medium'? <span className="text-gold">🟡 Medium</span>: <span className="text-green-400">🟢 Low</span>}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}
