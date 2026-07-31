"use client"
import { useEffect, useState } from 'react'
import { useAuth } from '@/hooks/useAuth'
import Navbar from '@/components/Navbar'
import InstallPanel from '@/components/InstallPanel'
import { Shield, Zap, Server, Clock, Activity, Users, Globe, Lock } from 'lucide-react'

interface Stats { totalInstalls: number; activeServers: number; protectedSites: number; avgDeployTime: string }

export default function DashboardPage() {
  const { user, loading } = useAuth()
  const [stats] = useState<Stats>({ totalInstalls: 1247, activeServers: 89, protectedSites: 156, avgDeployTime: '2m 34s' })
  useEffect(() => { if (!loading && !user) window.location.href = '/' }, [user, loading])
  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="text-kyriel-accent animate-pulse font-mono">Loading...</div></div>
  if (!user) return null

  return (
    <div className="min-h-screen bg-kyriel-dark safe-bottom">
      <Navbar />
      <main className="pt-16 lg:pt-20 pb-20 lg:pb-12 px-3 md:px-4 lg:px-8 max-w-7xl mx-auto">
        <div className="mb-4 md:mb-8">
          <h1 className="text-lg md:text-2xl font-bold mb-1">Welcome back, <span className="text-kyriel-accent">{user.username}</span></h1>
          <p className="text-gray-500 text-xs md:text-sm">Real SSH Pterodactyl & Theme Installer. VPS-ready.</p>
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 md:gap-4 mb-4 md:mb-8">
          <div className="bg-kyriel-card border border-white/5 rounded-xl p-3 md:p-5 card-hover">
            <div className="flex items-center justify-between mb-2 md:mb-3"><Zap className="w-4 h-4 md:w-5 md:h-5 text-kyriel-accent" /><span className="text-[10px] md:text-xs text-kyriel-success bg-kyriel-success/10 px-1.5 md:px-2 py-0.5 rounded">+12%</span></div>
            <div className="text-xl md:text-2xl font-bold">{stats.totalInstalls}</div>
            <div className="text-[10px] md:text-xs text-gray-500 mt-1">Total Installs</div>
          </div>
          <div className="bg-kyriel-card border border-white/5 rounded-xl p-3 md:p-5 card-hover">
            <div className="flex items-center justify-between mb-2 md:mb-3"><Server className="w-4 h-4 md:w-5 md:h-5 text-kyriel-cyan" /><span className="text-[10px] md:text-xs text-kyriel-success bg-kyriel-success/10 px-1.5 md:px-2 py-0.5 rounded">+5%</span></div>
            <div className="text-xl md:text-2xl font-bold">{stats.activeServers}</div>
            <div className="text-[10px] md:text-xs text-gray-500 mt-1">Active Servers</div>
          </div>
          <div className="bg-kyriel-card border border-white/5 rounded-xl p-3 md:p-5 card-hover">
            <div className="flex items-center justify-between mb-2 md:mb-3"><Shield className="w-4 h-4 md:w-5 md:h-5 text-kyriel-success" /><span className="text-[10px] md:text-xs text-kyriel-success bg-kyriel-success/10 px-1.5 md:px-2 py-0.5 rounded">+8%</span></div>
            <div className="text-xl md:text-2xl font-bold">{stats.protectedSites}</div>
            <div className="text-[10px] md:text-xs text-gray-500 mt-1">Protected Sites</div>
          </div>
          <div className="bg-kyriel-card border border-white/5 rounded-xl p-3 md:p-5 card-hover">
            <div className="flex items-center justify-between mb-2 md:mb-3"><Clock className="w-4 h-4 md:w-5 md:h-5 text-kyriel-warning" /><span className="text-[10px] md:text-xs text-kyriel-success bg-kyriel-success/10 px-1.5 md:px-2 py-0.5 rounded">-15%</span></div>
            <div className="text-xl md:text-2xl font-bold">{stats.avgDeployTime}</div>
            <div className="text-[10px] md:text-xs text-gray-500 mt-1">Avg Deploy Time</div>
          </div>
        </div>
        <div className="bg-gradient-to-r from-kyriel-accent/10 to-kyriel-purple/10 border border-kyriel-accent/20 rounded-xl p-4 md:p-5 mb-4 md:mb-8 flex flex-col sm:flex-row items-start sm:items-center gap-3 md:gap-4">
          <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-kyriel-accent/20 flex items-center justify-center shrink-0"><Lock className="w-5 h-5 md:w-6 md:h-6 text-kyriel-accent" /></div>
          <div className="flex-1">
            <h3 className="font-bold text-white text-sm md:text-base mb-1">Real SSH Installer</h3>
            <p className="text-xs md:text-sm text-gray-400">Beneran connect ke VPS via SSH, jalanin command install Pterodactyl atau theme. Live log dari server.</p>
          </div>
          <div className="hidden sm:flex items-center gap-2 px-3 md:px-4 py-2 rounded-lg bg-kyriel-success/10 border border-kyriel-success/30">
            <Activity className="w-3.5 h-3.5 md:w-4 md:h-4 text-kyriel-success animate-pulse" />
            <span className="text-xs md:text-sm text-kyriel-success font-mono">LIVE</span>
          </div>
        </div>
        <div className="mb-4 md:mb-8">
          <div className="flex items-center gap-2 mb-3 md:mb-4">
            <Globe className="w-4 h-4 md:w-5 md:h-5 text-kyriel-cyan" />
            <h2 className="text-lg md:text-xl font-bold">Installer Panel</h2>
          </div>
          <InstallPanel />
        </div>
        <div className="border-t border-white/5 pt-4 md:pt-6 flex flex-col sm:flex-row justify-between items-center gap-3 md:gap-4">
          <div className="flex items-center gap-2 text-xs md:text-sm text-gray-500">
            <Users className="w-3.5 h-3.5 md:w-4 md:h-4" />
            <span>Built by <a href="https://t.me/XyrooXellz" target="_blank" rel="noopener noreferrer" className="text-kyriel-cyan hover:underline">@XyrooXellz</a></span>
          </div>
          <div className="flex items-center gap-3 md:gap-4 text-[10px] md:text-xs text-gray-600">
            <span className="flex items-center gap-1"><span className="status-dot status-online" />System Online</span>
            <span>v3.0.0</span>
            <span>KYRIEL INSTALLER</span>
          </div>
        </div>
      </main>
    </div>
  )
}
