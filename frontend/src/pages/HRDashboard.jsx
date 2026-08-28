import React from 'react'
import Navbar from '../components/Navbar'
import Sidebar from '../components/Sidebar'

export default function HRDashboard(){
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex flex-1">
        <Sidebar />
        <main className="p-6 flex-1">
          <h3 className="font-semibold text-xl">HR / Admin Dashboard</h3>
          <div className="grid md:grid-cols-4 gap-4 mt-4">
            <div className="card p-4">Total Employees<div className="font-bold text-2xl mt-2">128</div></div>
            <div className="card p-4">Active Tasks<div className="font-bold text-2xl mt-2">34</div></div>
            <div className="card p-4">Tasks Due Today<div className="font-bold text-2xl mt-2">6</div></div>
            <div className="card p-4">Open Support Tickets<div className="font-bold text-2xl mt-2">4</div></div>
          </div>

          <div className="mt-6 card p-4">
            <div className="font-semibold mb-2">Employee Management</div>
            <div className="text-sm muted">List of employees (mock)</div>
          </div>
        </main>
      </div>
    </div>
  )
}
