import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Home, ClipboardList, Calendar, BookOpen, FileText, LifeBuoy } from 'lucide-react'

const items = [
  {to:'/',label:'Dashboard',icon:Home},
  {to:'/tasks',label:'My Tasks',icon:ClipboardList},
  {to:'/leave',label:'Leave',icon:Calendar},
  {to:'/learning',label:'Learning',icon:BookOpen},
  {to:'/documents',label:'Documents & Assets',icon:FileText},
  {to:'/support',label:'Support Tickets',icon:LifeBuoy}
]

export default function Sidebar(){
  const loc = useLocation()
  return (
    <div className="w-64 p-4 bg-black3 h-full hidden md:block">
      <nav className="flex flex-col gap-1">
        {items.map(i=>{
          const Icon = i.icon
          const active = loc.pathname === i.to
          return (
            <Link key={i.to} to={i.to} className={`flex items-center gap-3 p-3 rounded ${active? 'bg-gray-800 border-l-4 border-gold':''} hover:bg-gray-900`}>
              <Icon className={active? 'text-gold':'text-white'} />
              <span className={`flex-1 ${active? 'text-white':'muted'}`}>{i.label}</span>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
