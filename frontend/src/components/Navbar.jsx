import React from 'react'
import NotificationBell from './NotificationBell'
import ProfileDropdown from './ProfileDropdown'

export default function Navbar(){
  return (
    <div className="flex items-center justify-between px-6 py-3 bg-black2 border-b" style={{borderColor:'#1a1a1a'}}>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gold rounded flex items-center justify-center text-black font-bold">EDA</div>
        <div>
          <div className="font-semibold">EMPLOYEE DIGITAL ASSISTANT</div>
          <div className="text-sm muted">Your unified workplace assistant</div>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <NotificationBell />
        <ProfileDropdown />
      </div>
    </div>
  )
}
