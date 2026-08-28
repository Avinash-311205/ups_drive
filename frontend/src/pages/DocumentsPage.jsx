import React, {useState} from 'react'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'
import { documents, assets } from '../services/mockServices'

export default function DocumentsPage(){
  const [viewDoc,setViewDoc] = useState(null)
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="p-6 flex-1">
          <h3 className="font-semibold text-xl">My Documents & Assets</h3>
          <div className="grid md:grid-cols-2 gap-4 mt-4">
            <div className="card p-4">
              <div className="font-semibold mb-2">📄 Company Documents</div>
              {documents.map(d=> (
                <div key={d.id} className="flex items-center justify-between p-2 border-b border-border">
                  <div>{d.name}</div>
                  <div className="flex gap-2">
                    <button className="p-1 border border-border rounded" onClick={()=>setViewDoc(d)}>View</button>
                    <a className="p-1 border border-border rounded" href="/leave_policy.pdf" download>Download</a>
                  </div>
                </div>
              ))}
            </div>

            <div className="card p-4">
              <div className="font-semibold mb-2">🎁 Company Assets / Goodies</div>
              {assets.map(a=> (
                <div key={a.id} className="flex items-center justify-between p-2 border-b border-border">
                  <div>{a.name}</div>
                  <div className="muted">{a.status}</div>
                </div>
              ))}
            </div>
          </div>
          {viewDoc && (
            <div className="fixed inset-0 flex items-center justify-center z-40">
              <div className="w-full max-w-3xl h-[80vh] card p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="font-semibold">{viewDoc.name}</div>
                  <div><button className="p-1 rounded border border-border" onClick={()=>setViewDoc(null)}>Close</button></div>
                </div>
                <div className="h-full bg-black2 rounded overflow-auto">
                  <iframe src="/leave_policy.pdf" className="w-full h-full" title={viewDoc.name}></iframe>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}
