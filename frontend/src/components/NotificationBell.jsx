import React, {useState} from 'react'
import { Bell } from 'lucide-react'
import { notifications } from '../services/mockServices'

export default function NotificationBell(){
  const unread = notifications.filter(n=>!n.read).length
  const [open,setOpen] = useState(false)
  return (
    <div className="relative">
      <button onClick={()=>setOpen(!open)} className="p-2 rounded hover:bg-gray-800">
        <Bell className="text-white" />
        {unread>0 && <span className="absolute -top-1 -right-1 bg-gold text-black rounded-full text-xs px-1">{unread}</span>}
      </button>
      {open && (
        <div className="absolute right-0 mt-2 w-80 card p-3">
          <div className="font-semibold mb-2">Notifications</div>
          {notifications.map(n=> (
            <div key={n.id} className={`p-2 rounded hover:bg-gray-900 ${n.read? 'opacity-70':''}`}>
              <div className="text-sm font-semibold">{n.title}</div>
              <div className="text-xs muted">{n.message}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
