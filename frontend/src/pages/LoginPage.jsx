import React from 'react'
import { useNavigate } from 'react-router-dom'

export default function LoginPage(){
  const navigate = useNavigate()
  return (
    <div className="min-h-screen flex items-center justify-center bg-black2">
      <div className="w-full max-w-4xl p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card p-8 cursor-pointer hover:shadow-lg" onClick={()=>navigate('/login/employee')}>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gold flex items-center justify-center text-black font-bold">E</div>
            <div>
              <h2 className="text-xl font-semibold">Employee</h2>
              <div className="muted">Access your tasks, leave, learning and UPmate assistant.</div>
            </div>
          </div>
        </div>

        <div className="card p-8 cursor-pointer hover:shadow-lg" onClick={()=>navigate('/login/hr')}>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-gold flex items-center justify-center text-black font-bold">HR</div>
            <div>
              <h2 className="text-xl font-semibold">HR / Admin</h2>
              <div className="muted">Manage employees, tasks, learning and policies.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
