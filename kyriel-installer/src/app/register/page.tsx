"use client"

import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { Terminal, Lock, User, Mail, ArrowLeft, ArrowRight, ShieldCheck } from 'lucide-react'
import Link from 'next/link'

export default function RegisterPage() {
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPass, setConfirmPass] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)
  const { register } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setSuccess('')
    if (password !== confirmPass) { setError('Password tidak cocok bro.'); return }
    if (password.length < 6) { setError('Password minimal 6 karakter.'); return }
    setLoading(true)
    try {
      const res = await register(username, email, password)
      if (res.error) setError(res.error)
      else { setSuccess('Akun berhasil dibuat! Redirecting...'); setTimeout(() => window.location.href = '/', 2000) }
    } catch { setError('Gagal konek. Cek network lu.') }
    finally { setLoading(false) }
  }

  return (
    <div className="min-h-screen grid-bg flex items-center justify-center px-4 relative overflow-hidden safe-bottom">
      <div className="absolute top-10 right-10 w-48 md:w-72 h-48 md:h-72 bg-kyriel-cyan/10 rounded-full blur-3xl animate-pulse-slow" />
      <div className="absolute bottom-10 left-10 w-64 md:w-96 h-64 md:h-96 bg-kyriel-accent/10 rounded-full blur-3xl animate-pulse-slow" />

      <div className="w-full max-w-sm md:max-w-md relative z-10">
        <div className="text-center mb-6 md:mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 md:w-16 md:h-16 rounded-2xl bg-gradient-to-br from-kyriel-cyan to-kyriel-purple mb-4 shadow-lg shadow-kyriel-cyan/20">
            <Terminal className="w-7 h-7 md:w-8 md:h-8 text-white" />
          </div>
          <h1 className="text-2xl md:text-3xl font-bold glow-cyan mb-2">
            KYRIEL<span className="text-kyriel-accent">INSTALLER</span>
          </h1>
          <p className="text-gray-500 text-xs md:text-sm">Buat akun baru buat deploy</p>
        </div>

        <div className="bg-kyriel-card border border-white/10 rounded-2xl p-5 md:p-8 backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-5 md:mb-6">
            <ShieldCheck className="w-4 h-4 md:w-5 md:h-5 text-kyriel-cyan" />
            <h2 className="text-lg md:text-xl font-bold">Register</h2>
          </div>

          {error && <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs md:text-sm">{error}</div>}
          {success && <div className="mb-4 p-3 rounded-lg bg-kyriel-success/10 border border-kyriel-success/20 text-kyriel-success text-xs md:text-sm">{success}</div>}

          <form onSubmit={handleSubmit} className="space-y-3 md:space-y-4">
            <div>
              <label className="block text-xs md:text-sm text-gray-400 mb-1.5 md:mb-2">Username</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input type="text" value={username} onChange={e => setUsername(e.target.value)} className="input-dark pl-10" placeholder="username123" required minLength={3} />
              </div>
            </div>
            <div>
              <label className="block text-xs md:text-sm text-gray-400 mb-1.5 md:mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input type="email" value={email} onChange={e => setEmail(e.target.value)} className="input-dark pl-10" placeholder="boss@example.com" required />
              </div>
            </div>
            <div>
              <label className="block text-xs md:text-sm text-gray-400 mb-1.5 md:mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="input-dark pl-10" placeholder="••••••••" required minLength={6} />
              </div>
            </div>
            <div>
              <label className="block text-xs md:text-sm text-gray-400 mb-1.5 md:mb-2">Konfirmasi Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input type="password" value={confirmPass} onChange={e => setConfirmPass(e.target.value)} className="input-dark pl-10" placeholder="••••••••" required />
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 text-sm md:text-base">
              {loading ? <span className="animate-pulse">Creating account...</span> : <>Register <ArrowRight className="w-4 h-4" /></>}
            </button>
          </form>

          <div className="mt-5 md:mt-6 text-center">
            <p className="text-xs md:text-sm text-gray-500">Udah punya akun? <Link href="/" className="text-kyriel-cyan hover:underline">Login disini</Link></p>
          </div>
        </div>

        <div className="text-center mt-4 md:mt-6">
          <Link href="/" className="inline-flex items-center gap-2 text-xs md:text-sm text-gray-500 hover:text-white transition-colors">
            <ArrowLeft className="w-3.5 h-3.5 md:w-4 md:h-4" />Back to Login
          </Link>
        </div>
      </div>
    </div>
  )
}
