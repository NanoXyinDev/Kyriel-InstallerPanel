"use client"

import { useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import { Terminal, Lock, User, ArrowRight, Shield, Zap, Globe } from 'lucide-react'
import Link from 'next/link'

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await login(username, password)
      if (res.error) {
        setError(res.error)
      } else {
        window.location.href = '/dashboard'
      }
    } catch {
      setError('Connection failed. Check your network.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen grid-bg flex items-center justify-center px-4 relative overflow-hidden">
      {/* Background effects */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-kyriel-accent/10 rounded-full blur-3xl animate-pulse-slow" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-kyriel-purple/10 rounded-full blur-3xl animate-pulse-slow" />

      <div className="w-full max-w-md relative z-10">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-kyriel-accent to-kyriel-purple mb-4 shadow-lg shadow-kyriel-accent/20">
            <Terminal className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold glow-text mb-2">
            KYRIEL<span className="text-kyriel-cyan">INSTALLER</span>
          </h1>
          <p className="text-gray-500 text-sm">Deploy themes & protect your server</p>
        </div>

        {/* Login Card */}
        <div className="bg-kyriel-card border border-white/10 rounded-2xl p-8 backdrop-blur-sm">
          <div className="flex items-center gap-2 mb-6">
            <Lock className="w-5 h-5 text-kyriel-accent" />
            <h2 className="text-xl font-bold">Login</h2>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Username</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="text"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  className="input-dark pl-10"
                  placeholder="Enter username"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm text-gray-400 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="input-dark pl-10"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <span className="animate-pulse">Authenticating...</span>
              ) : (
                <>
                  Login <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Belum punya akun?{' '}
              <Link href="/register" className="text-kyriel-accent hover:underline">
                Register disini
              </Link>
            </p>
          </div>
        </div>

        {/* Features */}
        <div className="grid grid-cols-3 gap-3 mt-6">
          <div className="bg-kyriel-card/50 border border-white/5 rounded-xl p-3 text-center">
            <Shield className="w-5 h-5 text-kyriel-success mx-auto mb-1" />
            <span className="text-xs text-gray-400">Anti-DDoS</span>
          </div>
          <div className="bg-kyriel-card/50 border border-white/5 rounded-xl p-3 text-center">
            <Zap className="w-5 h-5 text-kyriel-warning mx-auto mb-1" />
            <span className="text-xs text-gray-400">Fast Deploy</span>
          </div>
          <div className="bg-kyriel-card/50 border border-white/5 rounded-xl p-3 text-center">
            <Globe className="w-5 h-5 text-kyriel-cyan mx-auto mb-1" />
            <span className="text-xs text-gray-400">VPS Ready</span>
          </div>
        </div>

        {/* Owner */}
        <div className="text-center mt-6">
          <a 
            href="https://t.me/XyrooXellz" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-kyriel-cyan transition-colors"
          >
            <Globe className="w-4 h-4" />
            Owner: @XyrooXellz
          </a>
        </div>
      </div>
    </div>
  )
}
