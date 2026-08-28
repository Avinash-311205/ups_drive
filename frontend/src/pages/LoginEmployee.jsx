import React, {useState} from 'react'
import { loginAsEmployee } from '../services/authService'

export default function LoginEmployee(){
  const [email,setEmail] = useState('')
  const [password,setPassword] = useState('')
  const [error,setError] = useState('')
  async function handleLogin(){
    if(!email || !password){
      alert('Please enter email and password')
      return
    }
    setError('')
    try {
      await loginAsEmployee({email,password})
      window.location.href = '/'
    } catch (loginError) {
      setError(loginError.message)
    }
  }
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md card p-8">
        <div className="flex flex-col items-center gap-3 mb-4">
          <div className="w-16 h-16 rounded-full bg-gold flex items-center justify-center text-black font-bold">EDA</div>
          <h1 className="text-2xl font-semibold">Employee Login / Register</h1>
          <div className="muted">Enter your details to continue as Employee</div>
        </div>
        <div className="space-y-3">
          <input placeholder="Email" type="email" value={email} onChange={e=>setEmail(e.target.value)} className="p-2 bg-black3 rounded border border-border w-full" />
          <input placeholder="Password" type="password" value={password} onChange={e=>setPassword(e.target.value)} className="p-2 bg-black3 rounded border border-border w-full" />
          {error && <div className="text-red-400 text-sm">{error}</div>}
          <button className="w-full gold-btn p-3 rounded" onClick={handleLogin}>Continue as Employee</button>
        </div>
      </div>
    </div>
  )
}
