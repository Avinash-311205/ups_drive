import React,{useState,useEffect} from 'react'
import Navbar from '../../components/Navbar'
import HRSidebar from '../../components/HRSidebar'
import { apiRequest } from '../../services/apiService'

export default function TaskManagementPage(){
  const [taskList,setTaskList] = useState([])
  const [open,setOpen] = useState(false)
  const [title,setTitle] = useState('')
  const [desc,setDesc] = useState('')
  const [priority,setPriority] = useState('Medium')
  const [assignee,setAssignee] = useState('')
  const [employees,setEmployees] = useState([])
  const [error,setError] = useState('')

  useEffect(() => {
    Promise.all([apiRequest('/tasks'), apiRequest('/employees')])
      .then(([taskData, employeeData]) => { setTaskList(taskData); setEmployees(employeeData); setAssignee(employeeData[0]?.id || '') })
      .catch(loadError => setError(loadError.message))
  }, [])

  function handleAssign(){
    if(!title || !assignee){ alert('Enter title and assignee'); return }
    const id = taskList.length + 1
    apiRequest('/tasks', {method:'POST', body:JSON.stringify({employee_id:assignee,title,description:desc,priority})})
      .then(async () => { setTaskList(await apiRequest('/tasks')); setOpen(false); setTitle(''); setDesc('') })
      .catch(assignError => setError(assignError.message))
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1">
        <HRSidebar />
        <main className="p-6 flex-1">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-xl">Task Management</h3>
              <div className="muted">Assign and manage tasks</div>
            </div>
            <div>
              <button className="gold-btn p-2 rounded" onClick={()=>setOpen(true)}>+ ASSIGN NEW TASK</button>
            </div>
          </div>

          <div className="card mt-4 p-4 overflow-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-sm muted"><th>Task</th><th>Assigned Employee</th><th>Priority</th><th>Deadline</th><th>Status</th><th>Actions</th></tr>
              </thead>
              <tbody>
                {taskList.map(t=> (
                  <tr key={t.id} className="border-t border-border">
                    <td className="py-2">{t.title}</td>
                    <td>{t.assigned}</td>
                                        <td>{t.employee_name}</td>
                    <td>{t.priority}</td>
                    <td>{t.deadline}</td>
                    <td>{t.status}</td>
                    <td><button className="p-1 rounded border border-border" onClick={()=>alert('Open task detail (mock)')}>VIEW</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {open && (
            <div className="fixed inset-0 flex items-center justify-center z-40">
              <div className="w-full max-w-md card p-4">
                <h4 className="font-semibold">Assign New Task</h4>
                <div className="grid gap-2 mt-3">
                  <input placeholder="Task Title" value={title} onChange={e=>setTitle(e.target.value)} className="p-2 bg-black3 border border-border rounded" />
                  <textarea placeholder="Description" value={desc} onChange={e=>setDesc(e.target.value)} className="p-2 bg-black3 border border-border rounded" />
                  <select value={priority} onChange={e=>setPriority(e.target.value)} className="p-2 bg-black3 border border-border rounded">
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                  </select>
                  <select value={assignee} onChange={e=>setAssignee(e.target.value)} className="p-2 bg-black3 border border-border rounded">
                    <optgroup label="Employees">
                      {employees.map(emp=> <option key={emp.id} value={emp.name}>{emp.name} ({emp.department})</option>)}
                                          {employees.map(emp=> <option key={emp.id} value={emp.id}>{emp.name}</option>)}
                              {error && <div className="text-red-400 mt-3">{error}</div>}
                    </optgroup>
                    <optgroup label="HR">
                      <option value="HR Team">HR Team</option>
                    </optgroup>
                  </select>
                  <div className="flex gap-2 justify-end mt-2">
                    <button className="p-2 rounded border border-border" onClick={()=>setOpen(false)}>Cancel</button>
                    <button className="gold-btn p-2 rounded" onClick={handleAssign}>Assign Task</button>
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
