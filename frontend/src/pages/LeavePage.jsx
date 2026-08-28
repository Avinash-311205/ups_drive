import React, {useState} from 'react'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import { apiRequest } from '../services/apiService'
import { getCurrentUser } from '../services/authService'

export default function LeavePage(){
  const [open,setOpen] = useState(false)
  const [viewPolicy,setViewPolicy] = useState(false)
  const [balance,setBalance] = useState(null)
  const [form,setForm] = useState({start_date:'',end_date:'',reason:''})
  const [error,setError] = useState('')
  const today = new Date().toISOString().slice(0, 10)

  React.useEffect(()=>{
    const user = getCurrentUser()
    apiRequest(`/leave/${user.id}`).then(setBalance).catch(e=>setError(e.message))
  },[])

  async function submitLeave(){
    setError('')
    if (!form.start_date || !form.end_date || form.start_date < today || form.end_date < form.start_date) {
      setError('Invalid date: leave must start today or later, and end on or after the start date')
      return
    }
    try {
      await apiRequest('/leave/apply', {method:'POST', body:JSON.stringify(form)})
      setOpen(false)
      setForm({start_date:'',end_date:'',reason:''})
      alert('Leave request submitted')
    } catch (submitError) {
      setError(submitError.message)
    }
  }
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="p-6 flex-1">
          <h3 className="font-semibold text-xl">Leave</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
            <div className="card p-4">
              <div className="muted">Total Leave</div>
              <div className="font-bold text-2xl">{balance?.total_leave ?? '-'} Days</div>
            </div>
            <div className="card p-4">
              <div className="muted">Used Leave</div>
              <div className="font-bold text-2xl">{balance?.used_leave ?? '-'} Days</div>
            </div>
            <div className="card p-4">
              <div className="muted">Remaining Leave</div>
              <div className="font-bold text-2xl">{balance?.remaining_leave ?? '-'} Days</div>
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <button className="gold-btn p-2 rounded" onClick={()=>setOpen(true)}>Apply for Leave</button>
            <button className="p-2 rounded border border-border" onClick={()=>setViewPolicy(true)}>View Leave Policy</button>
          </div>
          {error && <div className="text-red-400 mt-3">{error}</div>}

          {open && (
            <div className="fixed inset-0 flex items-center justify-center">
              <div className="w-full max-w-lg card p-6">
                <h4 className="font-semibold">Apply for Leave</h4>
                <div className="grid grid-cols-1 gap-2 mt-3">
                  <select className="p-2 bg-black3 border border-border rounded">
                    <option>Annual Leave</option>
                    <option>Sick Leave</option>
                    <option>Casual Leave</option>
                    <option>Maternity Leave</option>
                    <option>Paternity Leave</option>
                    <option>Bereavement Leave</option>
                    <option>Unpaid Leave</option>
                    <option>Compensatory Off</option>
                  </select>
                  <input type="date" min={today} value={form.start_date} onChange={e=>setForm({...form,start_date:e.target.value})} className="p-2 bg-black3 border border-border rounded" />
                  <input type="date" min={form.start_date || today} value={form.end_date} onChange={e=>setForm({...form,end_date:e.target.value})} className="p-2 bg-black3 border border-border rounded" />
                  <textarea value={form.reason} onChange={e=>setForm({...form,reason:e.target.value})} className="p-2 bg-black3 border border-border rounded" placeholder="Reason" />
                  <div className="flex gap-2 justify-end">
                    <button className="p-2 rounded border border-border" onClick={()=>setOpen(false)}>Cancel</button>
                    <button className="gold-btn p-2 rounded" onClick={submitLeave}>Submit Leave Request</button>
                  </div>
                </div>
              </div>
            </div>
          )}
          {viewPolicy && (
            <div className="fixed inset-0 flex items-center justify-center z-40">
              <div className="w-full max-w-3xl h-[80vh] card p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-semibold">Leave Policy</div>
                  <div><button className="p-1 rounded border border-border" onClick={()=>setViewPolicy(false)}>Close</button></div>
                </div>
                <div className="h-full bg-black2 rounded overflow-auto">
                  <iframe src="/leave_policy.pdf" className="w-full h-full" title="Leave Policy"></iframe>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
