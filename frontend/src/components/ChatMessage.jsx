import React from 'react'

export default function ChatMessage({message}){
  const isAI = message.from === 'ai'
  return (
    <div className={`p-2 rounded ${isAI? 'bg-black3 border border-gold text-white':'bg-gray-800 text-white'}`}>
      <div className="text-sm">{message.text}</div>
      <div className="text-xs muted mt-1">{message.ts}</div>
    </div>
  )
}
