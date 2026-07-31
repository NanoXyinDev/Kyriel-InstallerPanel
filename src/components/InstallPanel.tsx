"use client"

import { useState, useEffect, useRef } from 'react'
import { Download, Globe, Shield, Server, Check, Clock, Star, Play, Square, Copy, RefreshCw } from 'lucide-react'
import LiveLog from './LiveLog'

interface PteroTheme {
  id: string
  name: string
  author: string
  description: string
  installCmd: string
  category: string
  rating: number
  downloads: number
}

const PTERO_THEMES: PteroTheme[] = [
  { id: 'enigma', name: 'Enigma Theme', author: 'EnigmaDev', description: 'Dark modern theme with sidebar customization, user profiles, and animated UI.', installCmd: 'cd /var/www/pterodactyl && bash <(curl -s https://raw.githubusercontent.com/rainx0/enigma/main/install.sh)', category: 'Premium', rating: 4.9, downloads: 45000 },
  { id: 'billing', name: 'Billing Theme', author: 'FuryDev', description: 'Complete billing integration theme with payment gateways and invoice system.', installCmd: 'cd /var/www/pterodactyl && bash <(curl -s https://raw.githubusercontent.com/furydev/billing-theme/main/install.sh)', category: 'Premium', rating: 4.8, downloads: 32000 },
  { id: 'nookure', name: 'Nookure Theme', author: 'Nookure', description: 'Clean minimalist theme with dark/light mode toggle and custom dashboards.', installCmd: 'cd /var/www/pterodactyl && bash <(curl -s https://raw.githubusercontent.com/nookure/pterodactyl-theme/main/install.sh)', category: 'Free', rating: 4.6, downloads: 28000 },
  { id: 'darknite', name: 'DarkNite', author: 'DarkTeam', description: 'Ultra dark theme with neon accents, custom icons, and smooth transitions.', installCmd: 'cd /var/www/pterodactyl && bash <(curl -s https://raw.githubusercontent.com/darkteam/darknite/main/install.sh)', category: 'Free', rating: 4.5, downloads: 21000 },
  { id: 'stellar', name: 'Stellar Panel', author: 'StellarDev', description: 'Space-themed panel with starfield background and futuristic UI elements.', installCmd: 'cd /var/www/pterodactyl && bash <(curl -s https://raw.githubusercontent.com/stellardev/ptero-theme/main/install.sh)', category: 'Premium', rating: 4.7, downloads: 18000 },
  { id: 'flux', name: 'Flux UI', author: 'FluxTeam', description: 'Material design inspired theme with card layouts and smooth animations.', installCmd: 'cd /var/www/pterodactyl && bash <(curl -s https://raw.githubusercontent.com/fluxteam/flux-ui/main/install.sh)', category: 'Free', rating: 4.4, downloads: 15000 },
  { id: 'cyber', name: 'CyberPanel', author: 'CyberDev', description: 'Cyberpunk themed panel with glitch effects, neon borders, and terminal vibes.', installCmd: 'cd /var/www/pterodactyl && bash <(curl -s https://raw.githubusercontent.com/cyberdev/cyberpanel/main/install.sh)', category: 'Premium', rating: 4.8, downloads: 12000 },
  { id: 'nova', name: 'Nova Theme', author: 'NovaTeam', description: 'Lightweight fast theme optimized for mobile with responsive grid layouts.', installCmd: 'cd /var/www/pterodactyl && bash <(curl -s https://raw.githubusercontent.com/novateam/nova-theme/main/install.sh)', category: 'Free', rating: 4.3, downloads: 9500 },
  { id: 'prism', name: 'Prism UI', author: 'PrismDev', description: 'Glassmorphism theme with blur effects, gradients, and modern typography.', installCmd: 'cd /var/www/pterodactyl && bash <(curl -s https://raw.githubusercontent.com/prismdev/prism-ui/main/install.sh)', category: 'Premium', rating: 4.6, downloads: 8200 },
  { id: 'aurora', name: 'Aurora Theme', author: 'AuroraTeam', description: 'Northern lights inspired color scheme with smooth aurora animations.', installCmd: 'cd /var/www/pterodactyl && bash <(curl -s https://raw.githubusercontent.com/aurorateam/aurora-theme/main/install.sh)', category: 'Free', rating: 4.5, downloads: 7000 },
  { id: 'quantum', name: 'Quantum Panel', author: 'QuantumDev', description: 'High-tech theme with particle effects, real-time stats, and dark palette.', installCmd: 'cd /var/www/pterodactyl && bash <(curl -s https://raw.githubusercontent.com/quantumdev/quantum-panel/main/install.sh)', category: 'Premium', rating: 4.7, downloads: 6500 },
  { id: 'nebula', name: 'Nebula Theme', author: 'NebulaTeam', description: 'Deep space theme with nebula backgrounds and constellation patterns.', installCmd: 'cd /var/www/pterodactyl && bash <(curl -s https://raw.githubusercontent.com/nebulateam/nebula-theme/main/install.sh)', category: 'Free', rating: 4.4, downloads: 5400 },
]

interface LogEntry { id: string; timestamp: string; type: 'info' | 'success' | 'warning' | 'error' | 'cmd'; message: string }

export default function InstallPanel() {
  const [mode, setMode] = useState<'ptero' | 'theme'>('ptero')
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null)
  const [vpsIp, setVpsIp] = useState('')
  const [vpsPort, setVpsPort] = useState('22')
  const [vpsUser, setVpsUser] = useState('root')
  const [vpsPass, setVpsPass] = useState('')
  const [fqdn, setFqdn] = useState('')
  const [email, setEmail] = useState('')
  const [ssl, setSsl] = useState(true)
  const [installType, setInstallType] = useState<'0' | '1' | '2'>('2')
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [isRunning, setIsRunning] = useState(false)
  const [progress, setProgress] = useState(0)
  const [status, setStatus] = useState<'idle' | 'connecting' | 'installing' | 'done' | 'error'>('idle')
  const [copyCommand, setCopyCommand] = useState('')
  const pollRef = useRef<NodeJS.Timeout | null>(null)

  const addLog = (message: string, type: LogEntry['type'] = 'info') => {
    const now = new Date()
    const ts = `${now.getHours().toString().padStart(2,'0')}:${now.getMinutes().toString().padStart(2,'0')}:${now.getSeconds().toString().padStart(2,'0')}`
    setLogs(prev => [...prev, { id: Math.random().toString(36).substring(2,8), timestamp: ts, type, message }])
  }

  const clearLogs = () => { setLogs([]); setProgress(0); setStatus('idle') }

  const generatePteroCommand = () => {
    const answers = `${installType}\n${fqdn || vpsIp}\n${ssl ? 'y' : 'n'}\n${email || 'admin@example.com'}\n`
    return `printf '${answers}' | bash <(curl -s https://pterodactyl-installer.se)`
  }

  const generateThemeCommand = () => {
    const theme = PTERO_THEMES.find(t => t.id === selectedTheme)
    if (!theme) return ''
    return theme.installCmd
  }

  const startInstall = async () => {
    if (!vpsIp || !vpsPass) { addLog('VPS IP dan Password wajib diisi!', 'error'); return }
    if (mode === 'ptero' && !fqdn) { addLog('FQDN wajib diisi untuk install Pterodactyl!', 'error'); return }
    if (mode === 'theme' && !selectedTheme) { addLog('Pilih theme dulu bro!', 'error'); return }

    setIsRunning(true)
    setStatus('connecting')
    setProgress(5)
    setLogs([])

    addLog(`Connecting to ${vpsIp}:${vpsPort || 22}...`, 'cmd')

    try {
      // Step 1: Test SSH connection
      const testRes = await fetch('/api/ssh/test', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('kyriel-token')}` },
        body: JSON.stringify({ host: vpsIp, port: parseInt(vpsPort) || 22, username: vpsUser, password: vpsPass })
      })
      const testData = await testRes.json()

      if (!testData.success) {
        addLog(`SSH Connection Failed: ${testData.message}`, 'error')
        setStatus('error')
        setIsRunning(false)
        return
      }

      addLog(`SSH Connected. ${testData.message}`, 'success')
      setProgress(10)
      setStatus('installing')

      // Step 2: Start background install
      const logFile = `/tmp/kyriel-install-${Date.now()}.log`
      const command = mode === 'ptero' ? generatePteroCommand() : generateThemeCommand()

      addLog(`Starting ${mode === 'ptero' ? 'Pterodactyl' : 'Theme'} installation...`, 'cmd')
      addLog(`Command: ${command.substring(0, 80)}...`, 'info')
      setProgress(15)

      const startRes = await fetch('/api/ssh/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('kyriel-token')}` },
        body: JSON.stringify({ host: vpsIp, port: parseInt(vpsPort) || 22, username: vpsUser, password: vpsPass, command, logFile })
      })
      const startData = await startRes.json()

      if (!startData.success) {
        addLog(`Failed to start install: ${startData.error}`, 'error')
        setStatus('error')
        setIsRunning(false)
        return
      }

      addLog(`Install started in background. PID: ${startData.pid || 'unknown'}`, 'success')
      addLog(`Log file: ${logFile}`, 'info')
      setProgress(20)

      // Step 3: Poll for logs
      let pollCount = 0
      const maxPolls = 120 // 10 minutes (poll every 5 seconds)

      pollRef.current = setInterval(async () => {
        pollCount++
        try {
          const pollRes = await fetch('/api/ssh/log', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('kyriel-token')}` },
            body: JSON.stringify({ host: vpsIp, port: parseInt(vpsPort) || 22, username: vpsUser, password: vpsPass, logFile })
          })
          const pollData = await pollRes.json()

          if (pollData.output) {
            const lines = pollData.output.split('\n').filter((l: string) => l.trim())
            lines.forEach((line: string) => {
              const lower = line.toLowerCase()
              let type: LogEntry['type'] = 'info'
              if (lower.includes('error') || lower.includes('failed')) type = 'error'
              else if (lower.includes('success') || lower.includes('complete') || lower.includes('done')) type = 'success'
              else if (lower.includes('warning')) type = 'warning'
              else if (lower.includes('installing') || lower.includes('downloading')) type = 'cmd'
              addLog(line, type)
            })
          }

          // Update progress based on keywords
          const lastLog = pollData.output || ''
          if (lastLog.includes('Installing panel')) setProgress(30)
          if (lastLog.includes('Installing wings')) setProgress(50)
          if (lastLog.includes('Configuring')) setProgress(70)
          if (lastLog.includes('Installation completed')) { setProgress(100); setStatus('done'); setIsRunning(false); if (pollRef.current) clearInterval(pollRef.current) }
          if (lastLog.includes('Theme installed')) { setProgress(100); setStatus('done'); setIsRunning(false); if (pollRef.current) clearInterval(pollRef.current) }

          if (pollCount >= maxPolls) {
            addLog('Polling timeout reached. Check VPS manually.', 'warning')
            setIsRunning(false)
            if (pollRef.current) clearInterval(pollRef.current)
          }
        } catch (err) {
          addLog(`Poll error: ${err}`, 'error')
        }
      }, 5000)

    } catch (err) {
      addLog(`Error: ${err}`, 'error')
      setStatus('error')
      setIsRunning(false)
    }
  }

  const stopInstall = () => {
    if (pollRef.current) { clearInterval(pollRef.current); pollRef.current = null }
    setIsRunning(false)
    addLog('Installation monitoring stopped.', 'warning')
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    addLog('Command copied to clipboard!', 'success')
  }

  const formatDownloads = (n: number) => {
    if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M'
    if (n >= 1000) return (n / 1000).toFixed(0) + 'K'
    return n.toString()
  }

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Mode Switch */}
      <div className="flex gap-2">
        <button onClick={() => setMode('ptero')} className={`flex-1 py-2.5 md:py-3 rounded-xl text-sm md:text-base font-semibold transition-all ${mode==='ptero'?'bg-kyriel-accent text-white':'bg-white/5 text-gray-400 hover:bg-white/10'}`}>
          <Server className="w-4 h-4 md:w-5 md:h-5 inline mr-2" />Install Pterodactyl
        </button>
        <button onClick={() => setMode('theme')} className={`flex-1 py-2.5 md:py-3 rounded-xl text-sm md:text-base font-semibold transition-all ${mode==='theme'?'bg-kyriel-purple text-white':'bg-white/5 text-gray-400 hover:bg-white/10'}`}>
          <Download className="w-4 h-4 md:w-5 md:h-5 inline mr-2" />Install Theme
        </button>
      </div>

      {/* VPS Config */}
      <div className="bg-kyriel-card border border-white/10 rounded-xl p-4 md:p-6 space-y-4 animate-slide-up">
        <h3 className="text-base md:text-lg font-bold flex items-center gap-2">
          <Server className="w-4 h-4 md:w-5 md:h-5 text-kyriel-cyan" />VPS Configuration
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
          <div>
            <label className="block text-xs md:text-sm text-gray-400 mb-1.5">IP Address</label>
            <input type="text" placeholder="192.168.1.1" value={vpsIp} onChange={e=>setVpsIp(e.target.value)} className="input-dark" />
          </div>
          <div>
            <label className="block text-xs md:text-sm text-gray-400 mb-1.5">SSH Port</label>
            <input type="text" placeholder="22" value={vpsPort} onChange={e=>setVpsPort(e.target.value)} className="input-dark" />
          </div>
          <div>
            <label className="block text-xs md:text-sm text-gray-400 mb-1.5">Username</label>
            <input type="text" value={vpsUser} onChange={e=>setVpsUser(e.target.value)} className="input-dark" />
          </div>
          <div>
            <label className="block text-xs md:text-sm text-gray-400 mb-1.5">Password</label>
            <input type="password" placeholder="••••••••" value={vpsPass} onChange={e=>setVpsPass(e.target.value)} className="input-dark" />
          </div>
        </div>
      </div>

      {/* Pterodactyl Options */}
      {mode === 'ptero' && (
        <div className="bg-kyriel-card border border-white/10 rounded-xl p-4 md:p-6 space-y-4 animate-slide-up">
          <h3 className="text-base md:text-lg font-bold flex items-center gap-2">
            <Globe className="w-4 h-4 md:w-5 md:h-5 text-kyriel-accent" />Pterodactyl Options
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
            <div>
              <label className="block text-xs md:text-sm text-gray-400 mb-1.5">FQDN / Domain</label>
              <input type="text" placeholder="panel.example.com" value={fqdn} onChange={e=>setFqdn(e.target.value)} className="input-dark" />
            </div>
            <div>
              <label className="block text-xs md:text-sm text-gray-400 mb-1.5">Email</label>
              <input type="email" placeholder="admin@example.com" value={email} onChange={e=>setEmail(e.target.value)} className="input-dark" />
            </div>
          </div>
          <div className="flex flex-wrap gap-2 md:gap-3">
            <button onClick={()=>setInstallType('0')} className={`px-3 md:px-4 py-2 rounded-lg text-xs md:text-sm transition-all touch-target ${installType==='0'?'bg-kyriel-accent text-white':'bg-white/5 text-gray-400 border border-white/10'}`}>Panel Only</button>
            <button onClick={()=>setInstallType('1')} className={`px-3 md:px-4 py-2 rounded-lg text-xs md:text-sm transition-all touch-target ${installType==='1'?'bg-kyriel-accent text-white':'bg-white/5 text-gray-400 border border-white/10'}`}>Wings Only</button>
            <button onClick={()=>setInstallType('2')} className={`px-3 md:px-4 py-2 rounded-lg text-xs md:text-sm transition-all touch-target ${installType==='2'?'bg-kyriel-accent text-white':'bg-white/5 text-gray-400 border border-white/10'}`}>Panel + Wings</button>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={()=>setSsl(!ssl)} className={`w-10 h-5 rounded-full transition-all ${ssl?'bg-kyriel-success':'bg-gray-600'} relative`}>
              <span className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-all ${ssl?'left-5':'left-0.5'}`} />
            </button>
            <span className="text-xs md:text-sm text-gray-400">Enable SSL (Let's Encrypt)</span>
          </div>
          <div className="bg-black/30 rounded-lg p-3 md:p-4 font-mono text-[10px] md:text-xs text-gray-400 overflow-x-auto">
            <div className="flex justify-between items-center mb-2">
              <span className="text-kyriel-cyan">Generated Command:</span>
              <button onClick={()=>copyToClipboard(generatePteroCommand())} className="text-kyriel-accent hover:text-white transition-colors"><Copy className="w-3.5 h-3.5" /></button>
            </div>
            <code className="break-all">{generatePteroCommand()}</code>
          </div>
        </div>
      )}

      {/* Theme Selection */}
      {mode === 'theme' && (
        <div className="space-y-3 md:space-y-4">
          <h3 className="text-base md:text-lg font-bold flex items-center gap-2">
            <Download className="w-4 h-4 md:w-5 md:h-5 text-kyriel-purple" />Pilih Theme
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
            {PTERO_THEMES.map(theme => (
              <div key={theme.id} onClick={()=>!isRunning && setSelectedTheme(theme.id)} className={`card-hover rounded-xl p-4 md:p-5 cursor-pointer relative overflow-hidden ${selectedTheme===theme.id?'border-kyriel-purple bg-kyriel-purple/5':'bg-kyriel-card border-white/5'}`}>
                {selectedTheme===theme.id && <div className="absolute top-3 right-3 w-5 h-5 md:w-6 md:h-6 rounded-full bg-kyriel-purple flex items-center justify-center"><Check className="w-3 h-3 md:w-4 md:h-4 text-white" /></div>}
                <div className="flex items-start justify-between mb-2">
                  <div>
                    <h3 className="font-bold text-white text-sm md:text-base">{theme.name}</h3>
                    <span className="text-xs text-kyriel-cyan">by {theme.author}</span>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded ${theme.category==='Premium'?'bg-kyriel-accent/20 text-kyriel-accent':'bg-kyriel-success/20 text-kyriel-success'}`}>{theme.category}</span>
                </div>
                <p className="text-xs md:text-sm text-gray-400 mb-3 line-clamp-2">{theme.description}</p>
                <div className="flex items-center gap-3 text-xs text-gray-500">
                  <span className="flex items-center gap-1"><Star className="w-3 h-3 text-kyriel-warning" />{theme.rating}</span>
                  <span className="flex items-center gap-1"><Download className="w-3 h-3" />{formatDownloads(theme.downloads)}</span>
                </div>
              </div>
            ))}
          </div>
          {selectedTheme && (
            <div className="bg-black/30 rounded-lg p-3 md:p-4 font-mono text-[10px] md:text-xs text-gray-400 overflow-x-auto">
              <div className="flex justify-between items-center mb-2">
                <span className="text-kyriel-purple">Install Command:</span>
                <button onClick={()=>copyToClipboard(generateThemeCommand())} className="text-kyriel-accent hover:text-white transition-colors"><Copy className="w-3.5 h-3.5" /></button>
              </div>
              <code className="break-all">{generateThemeCommand()}</code>
            </div>
          )}
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        {!isRunning ? (
          <button onClick={startInstall} disabled={!vpsIp || !vpsPass || (mode==='ptero' && !fqdn) || (mode==='theme' && !selectedTheme)} className="btn-primary flex-1 flex items-center justify-center gap-2 disabled:opacity-50 text-sm md:text-base">
            <Play className="w-4 h-4" />{mode==='ptero'?'Install Pterodactyl':'Install Theme'}
          </button>
        ) : (
          <button onClick={stopInstall} className="btn-secondary flex-1 flex items-center justify-center gap-2 text-sm md:text-base border-red-500/30 text-red-400 hover:bg-red-500/10">
            <Square className="w-4 h-4" />Stop Monitoring
          </button>
        )}
        <button onClick={clearLogs} className="btn-secondary flex items-center justify-center gap-2 text-sm md:text-base">
          <RefreshCw className="w-4 h-4" />Clear
        </button>
      </div>

      {/* Status Badge */}
      {status !== 'idle' && (
        <div className={`flex items-center gap-2 px-3 md:px-4 py-2 rounded-lg text-xs md:text-sm font-medium ${
          status==='done'?'bg-kyriel-success/10 text-kyriel-success border border-kyriel-success/30':
          status==='error'?'bg-red-500/10 text-red-400 border border-red-500/30':
          status==='connecting'?'bg-kyriel-warning/10 text-kyriel-warning border border-kyriel-warning/30':
          'bg-kyriel-cyan/10 text-kyriel-cyan border border-kyriel-cyan/30'
        }`}>
          <span className={`w-2 h-2 rounded-full animate-pulse ${status==='done'?'bg-kyriel-success':status==='error'?'bg-red-400':'bg-kyriel-cyan'}`} />
          {status==='done'?'Installation Complete':status==='error'?'Installation Failed':status==='connecting'?'Connecting...':'Installing...'}
        </div>
      )}

      <LiveLog logs={logs} isRunning={isRunning} progress={progress} onClear={clearLogs} />
    </div>
  )
}
