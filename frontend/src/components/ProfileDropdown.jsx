import React, {useState} from 'react'
import { mockUser } from '../services/mockServices'
import { logout, getCurrentUser } from '../services/authService'

export default function ProfileDropdown(){
  const [open,setOpen] = useState(false)
  const user = getCurrentUser() || mockUser
  const initials = (user.name || 'User').split(' ').map(part => part[0]).join('').slice(0, 2).toUpperCase()
  return (
    <div className="relative">
      <button onClick={()=>setOpen(!open)} className="flex items-center gap-2 p-1 rounded hover:bg-gray-800">
        <div className="w-9 h-9 rounded-full bg-gray-700 flex items-center justify-center">{initials}</div>
      </button>
      {open && (()=>{
        const u = user
        return (
          <div className="absolute right-0 mt-2 w-56 card p-3">
            <div className="font-semibold">{u.name}</div>
            <div className="text-xs muted">{u.email || u.id || ''} • {u.role || u.department || ''}</div>
            <div className="mt-3 border-t pt-2 flex flex-col gap-2">
              <button className="text-left hover:text-gold">My Profile</button>
              <button className="text-left hover:text-gold">Settings</button>
              <button className="text-left hover:text-gold" onClick={()=>{logout(); window.location.href='/login'}}>Logout</button>
            </div>
          </div>
        )
      })()}
    </div>
  )
}
