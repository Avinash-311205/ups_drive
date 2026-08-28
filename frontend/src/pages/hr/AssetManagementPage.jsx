import React, {useState} from 'react'
import Navbar from '../../components/Navbar'
import HRSidebar from '../../components/HRSidebar'
import { companyAssets, employees } from '../../services/mockServices'

export default function AssetManagementPage(){
  const [assets,setAssets] = useState(companyAssets)
  const [open,setOpen] = useState(false)
  const [form,setForm] = useState({employee:'',asset:'Laptop',category:'Work Equipment'})

  function assign(){
    const rec = {id: assets.length+1, employee: form.employee, asset: form.asset, category: form.category, assigned: new Date().toISOString().split('T')[0], status:'Assigned'}
    assets.push(rec)
    setAssets([...assets])
    setOpen(false)
    alert('Asset assigned (mock)')
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1">
        <HRSidebar />
        <main className="p-6 flex-1">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-xl">Company Assets & Goodies</h3>
              <div className="muted">Assign and track assets</div>
            </div>
            <div>
              <button className="gold-btn p-2 rounded" onClick={()=>setOpen(true)}>+ ASSIGN ASSET</button>
            </div>
          </div>

          <div className="card mt-4 p-4">
            <table className="w-full text-left">
              <thead><tr className="muted text-sm"><th>Employee</th><th>Asset</th><th>Category</th><th>Assigned Date</th><th>Status</th></tr></thead>
              <tbody>
                {assets.map(a=> (
                  <tr key={a.id} className="border-t border-border">
                    <td className="py-2">{a.employee}</td>
                    <td>{a.asset}</td>
                    <td>{a.category}</td>
                    <td>{a.assigned}</td>
                    <td>{a.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {open && (
            <div className="fixed inset-0 flex items-center justify-center z-40">
              <div className="w-full max-w-lg card p-4">
                <h4 className="font-semibold">Assign Asset</h4>
                <div className="mt-3 grid gap-2">
                  <select value={form.employee} onChange={e=>setForm({...form,employee:e.target.value})} className="p-2 bg-black3 border border-border rounded">
                    <option value="">Select Employee</option>
                    {employees.map(emp=>(<option key={emp.id} value={emp.name}>{emp.name} • {emp.id}</option>))}
                  </select>
                  <select value={form.asset} onChange={e=>setForm({...form,asset:e.target.value})} className="p-2 bg-black3 border border-border rounded">
                    <option> Laptop</option>
                    <option> Mouse</option>
                    <option> Headphones</option>
                  </select>
                  <select value={form.category} onChange={e=>setForm({...form,category:e.target.value})} className="p-2 bg-black3 border border-border rounded">
                    <option>Work Equipment</option>
                    <option>Company Goodies</option>
                    <option>Identification</option>
                  </select>
                  <div className="flex gap-2 justify-end">
                    <button className="p-2 rounded border border-border" onClick={()=>setOpen(false)}>Cancel</button>
                    <button className="gold-btn p-2 rounded" onClick={assign}>Assign</button>
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
