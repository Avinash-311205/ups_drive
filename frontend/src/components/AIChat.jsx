import React, {useState, useRef, useEffect} from 'react'
import ChatMessage from './ChatMessage'
import { askAssistant } from '../services/aiService'

const DEFAULT_GREETING = `👋 Hi, I’m UPmate! Your workplace assistant. How can I help you today?\n\nI can help you manage tasks, check your leave balance, prioritize learning, answer HR policy questions, and assist with IT support.`

export default function AIChat({openInitially=false}){
  const [open,setOpen] = useState(openInitially)
  const [messages,setMessages] = useState([])
  const [text,setText] = useState('')
  const [loading,setLoading] = useState(false)
  const boxRef = useRef()

  useEffect(()=>{ if(boxRef.current) boxRef.current.scrollTop = boxRef.current.scrollHeight },[messages])

  useEffect(()=>{
    // when opened and empty, show default greeting from UPmate
    if(open && messages.length===0){
      setMessages([{from:'ai',text:DEFAULT_GREETING,ts:new Date().toLocaleTimeString()}])
    }
  },[open])

  async function send(){
    const message = text.trim()
    if(!message || loading) return
    const userMsg = {from:'user',text:message,ts:new Date().toLocaleTimeString()}
    setMessages(m=>[...m,userMsg])
    setText('')
    setLoading(true)
    try {
      const response = await askAssistant(message)
      setMessages(m=>[...m,{from:'ai',text:response,ts:new Date().toLocaleTimeString()}])
    } catch (error) {
      setMessages(m=>[...m,{from:'ai',text:error.message,ts:new Date().toLocaleTimeString()}])
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed right-6 bottom-6 w-96 z-50">
      <div className="flex justify-end">
        <button onClick={()=>setOpen(!open)} className="gold-btn p-3 rounded-full shadow-lg flex items-center gap-2" title="Open UPmate">UPmate</button>
      </div>
      {open && (
        <div className="mt-3 card p-3 flex flex-col" style={{height:460}}>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-gold rounded-full flex items-center justify-center text-black font-semibold">UP</div>
            <div>
              <div className="font-semibold">UPmate</div>
              <div className="text-xs muted">Your workplace assistant</div>
            </div>
          </div>
          <div ref={boxRef} className="flex-1 overflow-auto p-2 space-y-2 bg-black2 rounded">
            {messages.length===0 && <div className="muted">Ask me anything about your work.</div>}
            {messages.map((m,i)=><ChatMessage key={i} message={m} />)}
          </div>
          <div className="mt-2 flex gap-2">
            <input value={text} onChange={e=>setText(e.target.value)} placeholder="Ask about tasks, leave, learning..." className="flex-1 p-2 bg-black3 rounded border border-border" />
            <button onClick={send} disabled={loading} className="gold-btn px-4 rounded">{loading ? '...' : 'Send'}</button>
          </div>
        </div>
      )}
    </div>
  )
}
