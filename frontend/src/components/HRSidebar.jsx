import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Home, Users, ClipboardList, BookOpen, Calendar, LifeBuoy, FileText, Gift } from 'lucide-react'

const items = [
  {to:'/hr',label:'Dashboard',icon:Home},
  {to:'/hr/employees',label:'Employees',icon:Users},
  {to:'/hr/tasks',label:'Task Management',icon:ClipboardList},
  {to:'/hr/learning',label:'Learning Management',icon:BookOpen},
  {to:'/hr/leave-requests',label:'Leave Requests',icon:Calendar},
  {to:'/hr/support-tickets',label:'Support Tickets',icon:LifeBuoy},
  {to:'/hr/knowledge',label:'Knowledge Base',icon:FileText},
  {to:'/hr/assets',label:'Asset Management',icon:Gift}
]

export default function HRSidebar(){
  const loc = useLocation()
  return (
    <div className="w-64 p-4 bg-black3 h-full hidden md:block">
      <nav className="flex flex-col gap-1">
        {items.map(i=>{
          const Icon = i.icon
          const active = loc.pathname === i.to || loc.pathname.startsWith(i.to + '/')
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
