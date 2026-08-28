import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import DashboardCard from '../components/DashboardCard'
import { apiRequest } from '../services/apiService'
import { getCurrentUser } from '../services/authService'

export default function EmployeeDashboard(){
  const user = getCurrentUser()
  const [tasks, setTasks] = useState([])
  const [leaveSummary, setLeaveSummary] = useState(null)

  useEffect(() => {
    if (!user) return
    Promise.all([apiRequest(`/tasks/${user.id}`), apiRequest(`/leave/${user.id}`)])
      .then(([employeeTasks, balance]) => { setTasks(employeeTasks); setLeaveSummary(balance) })
      .catch(() => {})
  }, [user?.id])

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="p-6 flex-1 space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold">Hello, {user?.name || 'Employee'} 👋</h2>
              <div className="muted">Here is your work overview for today.</div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <DashboardCard title="📋 My Tasks" onClick={()=>window.location.href='/tasks'}>
              <div className="text-lg font-bold">{tasks.length} Pending Tasks</div>
              <div className="muted">2 Due Today</div>
            </DashboardCard>

            <DashboardCard title="🏖 Leave" onClick={()=>window.location.href='/leave'}>
              <div className="text-lg font-bold">{leaveSummary?.remaining_leave ?? '-'} Days Remaining</div>
            </DashboardCard>

            <DashboardCard title="📚 Learning" onClick={()=>window.location.href='/learning'}>
              <div className="text-lg font-bold">View your learning assignments</div>
            </DashboardCard>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="card p-4">
              <div className="font-semibold mb-2">🔥 Urgent Tasks</div>
              {tasks.filter(t=>t.priority==='High').map(t=>(
                <div key={t.id} className="p-2 border-b border-border">
                  <div className="font-semibold">{t.title}</div>
                  <div className="text-sm muted">{t.deadline} • {t.status}</div>
                </div>
              ))}
            </div>

            <div className="card p-4">
              <div className="font-semibold mb-2">🤖 Employee AI Assistant</div>
              <div className="muted">UPmate is available at the bottom-right on every page.</div>
            </div>
          </div>

        </main>
      </div>
    </div>
  )
}
