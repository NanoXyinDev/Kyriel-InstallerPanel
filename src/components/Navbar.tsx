"use client"
import { useAuth } from '@/hooks/useAuth'
import { Terminal, Shield, LogOut, User, MessageCircle, Home } from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function Navbar() {
  const { user, logout } = useAuth()
  const pathname = usePathname()
  if (!user) return null
  const navItems = [
    { href: '/dashboard', label: 'Dashboard', icon: Home },
    { href: '/chat', label: 'Chat', icon: MessageCircle },
  ]
  const isActive = (href: string) => pathname === href

  return (
    <>
      <nav className="hidden lg:block fixed top-0 left-0 right-0 z-50 bg-kyriel-dark/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/dashboard" className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-kyriel-accent to-kyriel-purple flex items-center justify-center">
                <Terminal className="w-4 h-4 text-white" />
              </div>
              <span className="text-lg font-bold glow-text">KYRIEL<span className="text-kyriel-cyan">INSTALLER</span></span>
            </Link>
            <div className="flex items-center gap-4">
              {navItems.map(item => (
                <Link key={item.href} href={item.href} className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-all ${isActive(item.href)?'bg-kyriel-accent/20 text-kyriel-accent':'text-gray-400 hover:text-white hover:bg-white/5'}`}>
                  <item.icon className="w-4 h-4" />{item.label}
                </Link>
              ))}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 border border-white/10">
                <Shield className="w-4 h-4 text-kyriel-success" />
                <span className="text-xs text-kyriel-success font-mono">PROTECTED</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5">
                <User className="w-4 h-4 text-kyriel-cyan" />
                <span className="text-sm text-gray-300">{user.username}</span>
                {user.role === 'admin' && <span className="text-xs bg-kyriel-accent/20 text-kyriel-accent px-1.5 py-0.5 rounded">ADMIN</span>}
              </div>
              <button onClick={logout} className="btn-secondary flex items-center gap-2 text-sm py-2">
                <LogOut className="w-4 h-4" />Keluar
              </button>
            </div>
          </div>
        </div>
      </nav>

      <nav className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-kyriel-dark/90 backdrop-blur-md border-b border-white/5">
        <div className="flex items-center justify-between h-14 px-4">
          <Link href="/dashboard" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-kyriel-accent to-kyriel-purple flex items-center justify-center">
              <Terminal className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-sm font-bold glow-text">KYRIEL<span className="text-kyriel-cyan">INSTALLER</span></span>
          </Link>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5 px-2 py-1 rounded-lg bg-white/5">
              <User className="w-3.5 h-3.5 text-kyriel-cyan" />
              <span className="text-xs text-gray-300">{user.username}</span>
            </div>
          </div>
        </div>
      </nav>

      <div className="mobile-nav lg:hidden">
        {navItems.map(item => (
          <Link key={item.href} href={item.href} className={`flex flex-col items-center gap-1 py-1 px-3 rounded-lg transition-all ${isActive(item.href)?'text-kyriel-accent':'text-gray-500'}`}>
            <item.icon className="w-5 h-5" /><span className="text-[10px]">{item.label}</span>
          </Link>
        ))}
        <button onClick={logout} className="flex flex-col items-center gap-1 py-1 px-3 rounded-lg text-gray-500">
          <LogOut className="w-5 h-5" /><span className="text-[10px]">Keluar</span>
        </button>
      </div>
    </>
  )
}
