import React, {useState} from 'react'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import { learning } from '../services/mockServices'

export default function LearningPage(){
  const [selected,setSelected] = useState(null)
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="p-6 flex-1">
          <h3 className="font-semibold text-xl">My Learning</h3>
          <div className="grid md:grid-cols-3 gap-4 mt-4">
            {learning.map(l=> (
              <div key={l.id} className="card p-4 cursor-pointer" onClick={()=>setSelected(l)}>
                <div className="font-semibold">{l.name}</div>
                <div className="muted text-sm">Progress: {l.progress}%</div>
                <div className="muted text-sm">Deadline: {l.deadline}</div>
                <div className="mt-3">
                  <button className="p-2 rounded border border-border">Open</button>
                </div>
              </div>
            ))}
          </div>
          {selected && (
            <div className="fixed inset-0 flex items-center justify-center z-40">
              <div className="w-full max-w-2xl card p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-semibold">{selected.name}</h4>
                    <div className="muted">Deadline: {selected.deadline} • Status: {selected.status}</div>
                  </div>
                  <div><button className="p-2 rounded border border-border" onClick={()=>setSelected(null)}>Close</button></div>
                </div>
                <div className="mt-4">
                  <p className="muted">Course description (mock): This course covers {selected.name} and required steps to complete.</p>
                  <div className="mt-3">Progress: <strong>{selected.progress}%</strong></div>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
