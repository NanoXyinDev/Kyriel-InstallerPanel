"use client"
import { useState } from 'react'
import { Terminal, Play, Server } from 'lucide-react'

export default function InstallPanel() {
  const [theme, setTheme] = useState('')
  const [vpsIp, setVpsIp] = useState('')
  const [vpsUser, setVpsUser] = useState('root')
  const [vpsPass, setVpsPass] = useState('')
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState('')

  const handleInstall = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/install', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify({ theme, vpsIp, vpsUser }),
      })
      const data = await res.json()
      setResult(data.logId || data.error || 'OK')
    } catch {
      setResult('Failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-kyriel-card border border-white/5 rounded-xl p-4 md:p-6 space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs text-gray-400 mb-1">Theme</label>
          <input value={theme} onChange={(e) => setTheme(e.target.value)} className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-sm" placeholder="e.g. billing-theme" />
        </div>
        <div>
          <label className="block text-xs text-gray-400 mb-1">VPS IP</label>
          <input value={vpsIp} onChange={(e) => setVpsIp(e.target.value)} className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-sm" placeholder="192.168.1.1" />
        </div>
        <div>
          <label className="block text-xs text-gray-400 mb-1">VPS User</label>
          <input value={vpsUser} onChange={(e) => setVpsUser(e.target.value)} className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-sm" />
        </div>
        <div>
          <label className="block text-xs text-gray-400 mb-1">VPS Password</label>
          <input type="password" value={vpsPass} onChange={(e) => setVpsPass(e.target.value)} className="w-full bg-black/30 border border-white/10 rounded-lg px-3 py-2 text-sm" />
        </div>
      </div>
      <button onClick={handleInstall} disabled={loading} className="w-full bg-kyriel-accent hover:bg-kyriel-accent/90 text-black font-semibold py-2.5 rounded-lg flex items-center justify-center gap-2 transition-colors disabled:opacity-50">
        <Play className="w-4 h-4" /> {loading ? 'Installing...' : 'Start Install'}
      </button>
      {result && <div className="text-xs font-mono text-gray-400 bg-black/30 p-3 rounded-lg"><Terminal className="w-3 h-3 inline mr-1" />{result}</div>}
    </div>
  )
}
