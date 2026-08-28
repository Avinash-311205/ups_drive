import React from 'react'

export default function DashboardStatCard({title,value,subtitle,onClick}){
  return (
    <div onClick={onClick} className="card p-4 rounded cursor-pointer hover:-translate-y-1 transition-transform">
      <div className="text-sm muted">{title}</div>
      <div className="font-bold text-2xl">{value}</div>
      <div className="text-sm muted">{subtitle}</div>
    </div>
  )
}
