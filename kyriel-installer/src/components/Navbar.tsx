"use client"

import { useAuth } from '@/hooks/useAuth'
import { Terminal, Shield, LogOut, User, Zap } from 'lucide-react'
import Link from 'next/link'

export default function Navbar() {
  const { user, logout } = useAuth()

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-kyriel-dark/80 backdrop-blur-md border-b border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link href="/dashboard" className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-kyriel-accent to-kyriel-purple flex items-center justify-center">
              <Terminal className="w-4 h-4 text-white" />
            </div>
            <span className="text-lg font-bold glow-text">
              KYRIEL<span className="text-kyriel-cyan">INSTALLER</span>
            </span>
          </Link>

          <div className="flex items-center gap-4">
            {user ? (
              <>
                <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
                  <Shield className="w-4 h-4 text-kyriel-success" />
                  <span className="text-xs text-kyriel-success font-mono">PROTECTED</span>
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5">
                  <User className="w-4 h-4 text-kyriel-cyan" />
                  <span className="text-sm text-gray-300">{user.username}</span>
                  {user.role === 'admin' && (
                    <span className="text-xs bg-kyriel-accent/20 text-kyriel-accent px-1.5 py-0.5 rounded">ADMIN</span>
                  )}
                </div>
                <button onClick={logout} className="btn-secondary flex items-center gap-2 text-sm py-2">
                  <LogOut className="w-4 h-4" />
                  <span className="hidden sm:inline">Keluar</span>
                </button>
              </>
            ) : (
              <Link href="/" className="btn-primary flex items-center gap-2 text-sm">
                <Zap className="w-4 h-4" />
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
