"use client"

import { useEffect, useState, useRef } from 'react'
import { useAuth } from '@/hooks/useAuth'
import Navbar from '@/components/Navbar'
import { Send, Users, MessageCircle, Clock } from 'lucide-react'
import { formatTime } from '@/lib/utils'

interface ChatMessage {
  id: string
  username: string
  message: string
  createdAt: string
}

export default function ChatPage() {
  const { user, loading } = useAuth()
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState('')
  const [sending, setSending] = useState(false)
  const [onlineCount, setOnlineCount] = useState(1)
  const scrollRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => { if (!loading && !user) window.location.href = '/' }, [user, loading])

  // Poll messages
  useEffect(() => {
    if (!user) return
    const fetchMessages = async () => {
      try {
        const res = await fetch('/api/chat')
        const data = await res.json()
        if (data.messages) setMessages(data.messages)
      } catch {}
    }
    fetchMessages()
    const interval = setInterval(fetchMessages, 3000)
    return () => clearInterval(interval)
  }, [user])

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }, [messages])

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!input.trim() || !user || sending) return
    setSending(true)
    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('kyriel-token')}` },
        body: JSON.stringify({ message: input.trim() })
      })
      const data = await res.json()
      if (data.message) {
        setMessages(prev => [...prev, data.message])
        setInput('')
      }
    } catch {}
    setSending(false)
    inputRef.current?.focus()
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="text-kyriel-accent animate-pulse font-mono">Loading...</div></div>
  if (!user) return null

  return (
    <div className="min-h-screen bg-kyriel-dark safe-bottom">
      <Navbar />
      <main className="pt-16 lg:pt-20 pb-20 lg:pb-12 px-3 md:px-4 lg:px-8 max-w-7xl mx-auto h-screen flex flex-col">
        {/* Chat Header */}
        <div className="flex items-center justify-between py-3 md:py-4 border-b border-white/5 mb-3 md:mb-4">
          <div className="flex items-center gap-2 md:gap-3">
            <div className="w-8 h-8 md:w-10 md:h-10 rounded-xl bg-gradient-to-br from-kyriel-accent to-kyriel-purple flex items-center justify-center">
              <MessageCircle className="w-4 h-4 md:w-5 md:h-5 text-white" />
            </div>
            <div>
              <h1 className="text-base md:text-lg font-bold">Global Chat</h1>
              <p className="text-[10px] md:text-xs text-gray-500">Real-time community chat</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 md:gap-2 px-2 md:px-3 py-1 md:py-1.5 rounded-lg bg-white/5 border border-white/10">
            <Users className="w-3.5 h-3.5 md:w-4 md:h-4 text-kyriel-cyan" />
            <span className="text-xs md:text-sm text-gray-300">{onlineCount} online</span>
          </div>
        </div>

        {/* Messages */}
        <div ref={scrollRef} className="flex-1 overflow-y-auto space-y-3 md:space-y-4 px-1 md:px-2 pb-4">
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full text-gray-600">
              <MessageCircle className="w-10 h-10 md:w-12 md:h-12 mb-3 opacity-30" />
              <p className="text-sm md:text-base">Belum ada pesan</p>
              <p className="text-xs md:text-sm">Jadi yang pertama chat bro!</p>
            </div>
          )}
          {messages.map((msg, i) => {
            const isOwn = msg.username === user.username
            const showTime = i === 0 || new Date(msg.createdAt).getTime() - new Date(messages[i-1].createdAt).getTime() > 300000
            return (
              <div key={msg.id} className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}>
                <div className="flex flex-col max-w-[85%] sm:max-w-[75%] md:max-w-[70%]">
                  {showTime && (
                    <div className="flex items-center justify-center gap-1 my-2 md:my-3">
                      <Clock className="w-3 h-3 text-gray-600" />
                      <span className="text-[10px] md:text-xs text-gray-600">{formatTime(msg.createdAt)}</span>
                    </div>
                  )}
                  <div className="flex items-end gap-1.5 md:gap-2">
                    {!isOwn && (
                      <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-gradient-to-br from-kyriel-cyan to-kyriel-purple flex items-center justify-center shrink-0 text-[10px] md:text-xs font-bold text-white">
                        {msg.username.charAt(0).toUpperCase()}
                      </div>
                    )}
                    <div className="flex flex-col">
                      {!isOwn && <span className="text-[10px] md:text-xs text-gray-500 mb-0.5 md:mb-1 ml-1">{msg.username}</span>}
                      <div className={`chat-bubble ${isOwn ? 'chat-bubble-own' : 'chat-bubble-other'}`}>
                        {msg.message}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>

        {/* Input */}
        <form onSubmit={sendMessage} className="mt-3 md:mt-4 flex gap-2 md:gap-3">
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={e => setInput(e.target.value)}
            placeholder="Ketik pesan..."
            className="input-dark flex-1"
            maxLength={500}
          />
          <button
            type="submit"
            disabled={sending || !input.trim()}
            className="btn-primary px-3 md:px-5 flex items-center gap-1.5 md:gap-2 disabled:opacity-50"
          >
            <Send className="w-4 h-4" />
            <span className="hidden sm:inline text-sm">Kirim</span>
          </button>
        </form>
      </main>
    </div>
  )
}
