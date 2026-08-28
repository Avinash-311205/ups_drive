import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import HRSidebar from '../../components/HRSidebar'
import { apiRequest } from '../../services/apiService'

export default function EmployeeDetailsPage(){
  const { id } = useParams()
  const [emp, setEmp] = useState(null)
  const [tasks, setTasks] = useState([])
  useEffect(() => {
    Promise.all([apiRequest(`/employees/${id}`), apiRequest(`/tasks/${id}`)])
      .then(([employee, employeeTasks]) => { setEmp(employee); setTasks(employeeTasks) })
      .catch(() => setEmp(false))
  }, [id])
  if(emp === false) return <div>Employee not found</div>
  if(!emp) return <div className="p-6">Loading employee...</div>
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1">
        <HRSidebar />
        <main className="p-6 flex-1">
          <h3 className="font-semibold text-xl">{emp.name}</h3>
          <div className="muted">Employee ID: {emp.id} • {emp.department}</div>

          <div className="grid md:grid-cols-4 gap-4 mt-4">
            <div className="card p-4">📋 Tasks<div className="font-bold">{emp.task_count} Pending</div></div>
            <div className="card p-4">🏖 Leave<div className="font-bold">{emp.remaining_leave} Days Remaining</div></div>
            <div className="card p-4">📚 Learning<div className="font-bold">{emp.learning_count} Pending</div></div>
            <div className="card p-4">🎁 Assets<div className="font-bold">Not available</div></div>
          </div>

          <div className="mt-4 card p-4">
            <div className="font-semibold">Assigned Tasks</div>
            {tasks.map(task => <div key={task.id} className="border-t border-border py-2">{task.title} <span className="muted">{task.status}</span></div>)}
          </div>
        </main>
      </div>
    </div>
  )
}
