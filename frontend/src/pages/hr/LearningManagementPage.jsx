import React, {useState} from 'react'
import Navbar from '../../components/Navbar'
import HRSidebar from '../../components/HRSidebar'
import { learning, employees } from '../../services/mockServices'

export default function LearningManagementPage(){
  const [list,setList] = useState([...learning])
  const [open,setOpen] = useState(false)
  const [course,setCourse] = useState(learning.length?learning[0].name:'')
  const [assignee,setAssignee] = useState(employees.length?employees[0].name:'')

  function handleAssign(){
    if(!course || !assignee){ alert('Choose course and employee'); return }
    const id = list.length + 1
    const newAssign = {id,name:course,progress:0,status:'Assigned',deadline:'TBD'}
    learning.push(newAssign)
    setList([...learning])
    setOpen(false)
    alert('Learning assigned (mock)')
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1">
        <HRSidebar />
        <main className="p-6 flex-1">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-xl">Learning Management</h3>
              <div className="muted">Assign and monitor learning activities</div>
            </div>
            <div>
              <button className="gold-btn p-2 rounded" onClick={()=>setOpen(true)}>+ ASSIGN LEARNING</button>
            </div>
          </div>

          <div className="card mt-4 p-4 overflow-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-sm muted"><th>Course Name</th><th>Employee</th><th>Progress</th><th>Deadline</th><th>Status</th></tr>
              </thead>
              <tbody>
                {list.map(l=> (
                  <tr key={l.id} className="border-t border-border">
                    <td className="py-2">{l.name}</td>
                    <td>{assignee}</td>
                    <td>{l.progress}%</td>
                    <td>{l.deadline}</td>
                    <td>{l.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {open && (
            <div className="fixed inset-0 flex items-center justify-center z-40">
              <div className="w-full max-w-md card p-4">
                <h4 className="font-semibold">Assign Learning to Employee</h4>
                <div className="grid gap-2 mt-3">
                  <select value={course} onChange={e=>setCourse(e.target.value)} className="p-2 bg-black3 border border-border rounded">
                    {learning.map(l=> <option key={l.id} value={l.name}>{l.name}</option>)}
                  </select>
                  <select value={assignee} onChange={e=>setAssignee(e.target.value)} className="p-2 bg-black3 border border-border rounded">
                    {employees.map(emp=> <option key={emp.id} value={emp.name}>{emp.name} ({emp.department})</option>)}
                  </select>
                  <div className="flex gap-2 justify-end mt-2">
                    <button className="p-2 rounded border border-border" onClick={()=>setOpen(false)}>Cancel</button>
                    <button className="gold-btn p-2 rounded" onClick={handleAssign}>Assign</button>
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
