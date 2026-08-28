import React, {useState} from 'react'
import Navbar from '../../components/Navbar'
import HRSidebar from '../../components/HRSidebar'
import { Link } from 'react-router-dom'
import { apiRequest } from '../../services/apiService'

export default function EmployeesPage(){
  const [list,setList] = useState([])
  const [open,setOpen] = useState(false)
  const [name,setName] = useState('')
  const [email,setEmail] = useState('')
  const [department,setDepartment] = useState('General')
  const [password,setPassword] = useState('password123')
  const [error,setError] = useState('')

  React.useEffect(()=>{
    apiRequest('/employees').then(setList).catch(e=>setError(e.message))
  },[])

  async function handleAdd(){
    if(!name || !email || !password){ alert('Enter name, email and password'); return }
    try {
      await apiRequest('/employees', {method:'POST', body:JSON.stringify({name,email,password})})
      setList(await apiRequest('/employees'))
      setOpen(false)
      setName(''); setEmail(''); setPassword('password123')
    } catch (addError) {
      setError(addError.message)
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
              <h3 className="font-semibold text-xl">Employees</h3>
              <div className="muted">Manage employee records</div>
            </div>
            <div>
              <button className="p-2 gold-btn rounded" onClick={()=>setOpen(true)}>+ ADD EMPLOYEE</button>
            </div>
          </div>

          <div className="card mt-4 p-4 overflow-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="text-sm muted">
                  <th>Name</th><th>Employee ID</th><th>Department</th><th>Email</th><th>Assigned Tasks</th><th>Status</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {list.map(e=>(
                  <tr key={e.id} className="border-t border-border">
                    <td className="py-2">{e.name}</td>
                    <td>{e.id}</td>
                    <td>General</td>
                    <td>{e.email}</td>
                    <td>{e.task_count || 0} Tasks</td>
                    <td>Active</td>
                    <td><Link to={`/hr/employees/${e.id}`} className="text-gold">VIEW</Link></td>
                  </tr>
                ))}
              </tbody>
            </table>
            {error && <div className="text-red-400 mt-3">{error}</div>}
          </div>
        </main>
      </div>
      {open && (
        <div className="fixed inset-0 flex items-center justify-center z-40">
          <div className="w-full max-w-md card p-4">
            <h4 className="font-semibold">Add Employee</h4>
            <div className="grid gap-2 mt-3">
              <input placeholder="Full Name" value={name} onChange={e=>setName(e.target.value)} className="p-2 bg-black3 border border-border rounded" />
              <input placeholder="Email" value={email} onChange={e=>setEmail(e.target.value)} className="p-2 bg-black3 border border-border rounded" />
              <input placeholder="Department" value={department} onChange={e=>setDepartment(e.target.value)} className="p-2 bg-black3 border border-border rounded" />
              <input placeholder="Temporary password" type="password" value={password} onChange={e=>setPassword(e.target.value)} className="p-2 bg-black3 border border-border rounded" />
              <div className="flex gap-2 justify-end mt-2">
                <button className="p-2 rounded border border-border" onClick={()=>setOpen(false)}>Cancel</button>
                <button className="gold-btn p-2 rounded" onClick={handleAdd}>Add Employee</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
