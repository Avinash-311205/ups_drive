import React from 'react'

export default function DashboardCard({title,children,onClick}){
  return (
    <div onClick={onClick} className="card p-5 rounded-lg hover:-translate-y-1 transition-transform cursor-pointer">
      <div className="flex items-center justify-between">
        <div className="font-semibold">{title}</div>
      </div>
      <div className="mt-3 text-sm muted">{children}</div>
    </div>
  )
}
