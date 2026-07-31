"use client"
import Link from 'next/link'
import { Terminal, LogOut } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

export default function Navbar() {
  const { user, logout } = useAuth()
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-kyriel-card/80 backdrop-blur-md border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-2">
          <Terminal className="w-5 h-5 text-kyriel-accent" />
          <span className="font-bold text-sm">KYRIEL</span>
        </Link>
        <div className="flex items-center gap-4">
          <span className="text-xs text-gray-400 hidden sm:inline">{user?.username}</span>
          <button onClick={logout} className="p-2 rounded-lg hover:bg-white/5 transition-colors">
            <LogOut className="w-4 h-4 text-gray-400" />
          </button>
        </div>
      </div>
    </nav>
  )
}
