import React, { useEffect, useState } from 'react'
import Navbar from '../../components/Navbar'
import HRSidebar from '../../components/HRSidebar'
import DashboardStatCard from '../../components/DashboardStatCard'
import { apiRequest } from '../../services/apiService'
import { Link } from 'react-router-dom'

export default function HRDashboardHome(){
  const [employees, setEmployees] = useState([])
  const [tasks, setTasks] = useState([])
  const [leaveRequests, setLeaveRequests] = useState([])
  useEffect(() => {
    Promise.all([apiRequest('/employees'), apiRequest('/tasks'), apiRequest('/leave')])
      .then(([employeeData, taskData, leaveData]) => {
        setEmployees(employeeData)
        setTasks(taskData)
        setLeaveRequests(leaveData)
      })
      .catch(() => {})
  }, [])
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1">
        <HRSidebar />
        <main className="p-6 flex-1">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold">Hello, HR 👋</h2>
              <div className="muted">Here is your workforce overview.</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mt-4">
            <DashboardStatCard title="👥 Total Employees" value={employees.length} subtitle="Active Employees" onClick={()=>window.location.href='/hr/employees'} />
            <DashboardStatCard title="📋 Active Tasks" value={tasks.length} subtitle="Tasks In Progress" onClick={()=>window.location.href='/hr/tasks'} />
            <DashboardStatCard title="⏰ Tasks Due Today" value={2} subtitle="Require Attention" onClick={()=>window.location.href='/hr/tasks'} />
            <DashboardStatCard title="🏖 Pending Leave Requests" value={leaveRequests.filter(l=>l.status==='Pending').length} subtitle="Awaiting Approval" onClick={()=>window.location.href='/hr/leave-requests'} />
            <DashboardStatCard title="🎫 Open Support Tickets" value="View" subtitle="Require Attention" onClick={()=>window.location.href='/hr/support-tickets'} />
          </div>

          <div className="grid md:grid-cols-2 gap-4 mt-6">
            <div className="card p-4">
              <div className="font-semibold mb-2">Recent Tasks</div>
              <div className="muted text-sm">List of recent tasks (mock)</div>
              <div className="mt-3">
                {tasks.slice(0,5).map(t=> (
                  <div key={t.id} className="p-2 border-b border-border">
                    <div className="font-semibold">{t.title}</div>
                    <div className="muted text-sm">Assigned: {t.assigned} • {t.priority} • {t.status}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="card p-4">
              <div className="font-semibold mb-2">Pending Leave Requests</div>
                {leaveRequests.filter(l=>l.status==='Pending').map(l=> (
                <div key={l.id} className="p-2 border-b border-border flex items-center justify-between">
                  <div>
                    <div className="font-semibold">{l.employee}</div>
                    <div className="muted text-sm">{l.type} • {l.start} – {l.end}</div>
                  </div>
                  <div className="flex gap-2">
                    <button className="p-1 rounded text-white" style={{background:'#16a34a'}} onClick={()=>{
                      if(window.confirm(`Please review ${l.employee}'s leave in Leave Requests page. Proceed to Leave Requests?`)){
                        window.location.href = '/hr/leave-requests'
                      }
                    }}>APPROVE</button>
                    <button className="p-1 rounded text-white" style={{background:'#dc2626'}} onClick={()=>{
                      if(window.confirm('Reject this leave request?')){
                        l.status = 'Rejected'
                        alert('Leave request rejected (mock)')
                      }
                    }}>REJECT</button>
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
