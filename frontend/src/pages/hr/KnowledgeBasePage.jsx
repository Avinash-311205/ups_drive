import Navbar from '../../components/Navbar'
import React, {useState} from 'react'
import HRSidebar from '../../components/HRSidebar'
import { kbDocuments } from '../../services/mockServices'

export default function KnowledgeBasePage(){
  const [docs,setDocs] = useState(kbDocuments)
  const [file,setFile] = useState(null)

  function onChange(e){
    const f = e.target.files[0]
    if(!f) return
    const rec = {id: docs.length+1, name: f.name, category: 'General', uploaded: new Date().toISOString().split('T')[0], status: 'Active'}
    docs.push(rec)
    setDocs([...docs])
    setFile(null)
    e.target.value = null
    alert('Document uploaded (mock)')
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1">
        <HRSidebar />
        <main className="p-6 flex-1">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-semibold text-xl">Company Knowledge Base</h3>
              <div className="muted">Manage company documents</div>
            </div>
            <div>
              <label className="gold-btn p-2 rounded cursor-pointer">
                + UPLOAD DOCUMENT
                <input type="file" onChange={onChange} className="hidden" />
              </label>
            </div>
          </div>
          <div className="card mt-4 p-4">
            <table className="w-full text-left">
              <thead><tr className="muted text-sm"><th>Document Name</th><th>Category</th><th>Upload Date</th><th>Status</th><th>Actions</th></tr></thead>
              <tbody>
                {docs.map(d=> (
                  <tr key={d.id} className="border-t border-border">
                    <td className="py-2">{d.name}</td>
                    <td>{d.category}</td>
                    <td>{d.uploaded}</td>
                    <td>{d.status}</td>
                    <td><button className="p-1 rounded border border-border" onClick={()=>alert('View (mock)')}>VIEW</button></td>
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
