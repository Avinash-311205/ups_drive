import React, {useState} from 'react'
import { register } from '../services/authService'

export default function RegisterPage(){
  const [form,setForm] = useState({name:'',email:'',password:'',department:''})
  const [error,setError] = useState('')
  async function submit(e){
    e.preventDefault()
    setError('')
    try {
      await register(form)
      window.location.href = '/'
    } catch (registerError) {
      setError(registerError.message)
    }
  }
  return (
    <div className="min-h-screen flex items-center justify-center">
      <form onSubmit={submit} className="w-full max-w-md card p-8">
        <div className="flex flex-col items-center gap-3 mb-4">
          <div className="w-16 h-16 rounded-full bg-gold flex items-center justify-center text-black font-bold">EDA</div>
          <h1 className="text-2xl font-semibold">Register</h1>
          <div className="muted">Create an employee account</div>
        </div>
        <div className="space-y-3">
          <input required value={form.name} onChange={e=>setForm({...form,name:e.target.value})} placeholder="Full name" className="p-2 bg-black3 rounded border border-border w-full" />
          <input required value={form.email} onChange={e=>setForm({...form,email:e.target.value})} placeholder="Email" className="p-2 bg-black3 rounded border border-border w-full" />
          <input required type="password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} placeholder="Password" className="p-2 bg-black3 rounded border border-border w-full" />
          <input value={form.department} onChange={e=>setForm({...form,department:e.target.value})} placeholder="Department" className="p-2 bg-black3 rounded border border-border w-full" />
          {error && <div className="text-red-400 text-sm">{error}</div>}
          <div className="flex gap-2 justify-end">
            <button type="submit" className="gold-btn p-2 rounded">Register</button>
          </div>
        </div>
      </form>
    </div>
  )
}
