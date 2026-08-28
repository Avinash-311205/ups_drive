import React, {useState} from 'react'
import Navbar from '../../components/Navbar'
import HRSidebar from '../../components/HRSidebar'
import { apiRequest } from '../../services/apiService'

export default function LeaveRequestsPage(){
  const [requests,setRequests] = useState([])
  const [error,setError] = useState('')

  React.useEffect(()=>{
    apiRequest('/leave').then(setRequests).catch(e=>setError(e.message))
  },[])

  async function handleChangeStatus(id,newStatus){
    try {
      await apiRequest(`/leave/${id}/status`, {method:'PATCH', body:JSON.stringify({status:newStatus})})
      setRequests(requests.map(r=> r.id===id ? {...r,status:newStatus} : r))
    } catch (statusError) {
      setError(statusError.message)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1">
        <HRSidebar />
        <main className="p-6 flex-1">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-xl">Leave Requests</h3>
              <div className="muted">Review and manage leave requests</div>
            </div>
          </div>

          <div className="card mt-4 p-4 overflow-auto">
            {error && <div className="text-red-400 mb-3">{error}</div>}
            <table className="w-full text-left">
              <thead>
                <tr className="text-sm muted"><th>Employee</th><th>Type</th><th>Start</th><th>End</th><th>Days</th><th>Reason</th><th>Status</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {requests.map(r=> (
                  <tr key={r.id} className="border-t border-border">
                    <td className="py-2">{r.employee_name}</td>
                    <td>Leave</td>
                    <td>{r.start_date}</td>
                    <td>{r.end_date}</td>
                    <td>{Math.ceil((new Date(r.end_date)-new Date(r.start_date))/86400000)+1}</td>
                    <td>{r.reason}</td>
                    <td>{r.status}</td>
                    <td className="flex gap-2">
                      <button className="p-1 rounded text-white px-3" style={{background:'#16a34a'}} onClick={()=>handleChangeStatus(r.id,'Approved')}>APPROVE</button>
                      <button className="p-1 rounded text-white px-3" style={{background:'#dc2626'}} onClick={()=>handleChangeStatus(r.id,'Rejected')}>REJECT</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </main>
      </div>
    </div>
  )
}