"use client"

import { useState } from 'react'
import { Download, Globe, Shield, Server, Check, Clock, Star } from 'lucide-react'
import LiveLog from './LiveLog'

interface Theme {
  id: string
  name: string
  category: string
  version: string
  size: string
  rating: number
  downloads: number
  description: string
  tags: string[]
}

const THEMES: Theme[] = [
  {
    id: 'wp-astra',
    name: 'Astra Pro',
    category: 'WordPress',
    version: '4.6.2',
    size: '2.4 MB',
    rating: 4.8,
    downloads: 1200000,
    description: 'Theme WordPress paling ringan dan customizable. Support Elementor, Beaver Builder, dll.',
    tags: ['lightweight', 'elementor', 'woocommerce']
  },
  {
    id: 'wp-divi',
    name: 'Divi Theme',
    category: 'WordPress',
    version: '4.23.1',
    size: '8.1 MB',
    rating: 4.7,
    downloads: 980000,
    description: 'Theme + builder all-in-one. 200+ layout pack, visual editing, split testing.',
    tags: ['builder', 'visual', 'premium']
  },
  {
    id: 'wp-flatsome',
    name: 'Flatsome',
    category: 'WordPress',
    version: '3.18.2',
    size: '5.3 MB',
    rating: 4.9,
    downloads: 750000,
    description: 'Theme WooCommerce paling laris. UX builder, catalog mode, AJAX cart.',
    tags: ['woocommerce', 'ecommerce', 'ajax']
  },
  {
    id: 'wp-woodmart',
    name: 'WoodMart',
    category: 'WordPress',
    version: '7.4.1',
    size: '6.2 MB',
    rating: 4.6,
    downloads: 420000,
    description: 'Multi-purpose WooCommerce theme. AJAX filters, quick shop, header builder.',
    tags: ['woocommerce', 'ajax', 'multipurpose']
  },
  {
    id: 'wp-avada',
    name: 'Avada',
    category: 'WordPress',
    version: '7.11.4',
    size: '12.5 MB',
    rating: 4.5,
    downloads: 890000,
    description: 'Theme #1 best selling sepanjang masa. Fusion builder, 100+ demo site.',
    tags: ['bestseller', 'fusion-builder', 'demo']
  },
  {
    id: 'wp-betheme',
    name: 'Betheme',
    category: 'WordPress',
    version: '27.3.1',
    size: '9.8 MB',
    rating: 4.4,
    downloads: 310000,
    description: '650+ pre-built websites. Muffin builder, WooCommerce ready, RTL support.',
    tags: ['prebuilt', 'muffin', 'rtl']
  },
  {
    id: 'wp-jupiter',
    name: 'JupiterX',
    category: 'WordPress',
    version: '4.0.2',
    size: '7.1 MB',
    rating: 4.3,
    downloads: 180000,
    description: 'Theme modern dengan Elementor. 400+ templates, shop customizer.',
    tags: ['elementor', 'modern', 'templates']
  },
  {
    id: 'wp-porto',
    name: 'Porto',
    category: 'WordPress',
    version: '6.7.0',
    size: '4.9 MB',
    rating: 4.7,
    downloads: 290000,
    description: 'Super fast WooCommerce theme. 130+ demos, speed optimized, GDPR ready.',
    tags: ['fast', 'gdpr', 'demo']
  },
  {
    id: 'wp-salient',
    name: 'Salient',
    category: 'WordPress',
    version: '16.0.1',
    size: '11.2 MB',
    rating: 4.6,
    downloads: 220000,
    description: 'High performance theme. Front-end editor, nectar slider, advanced typography.',
    tags: ['performance', 'slider', 'typography']
  },
  {
    id: 'wp-xtheme',
    name: 'X Theme',
    category: 'WordPress',
    version: '10.4.2',
    size: '10.5 MB',
    rating: 4.2,
    downloads: 350000,
    description: 'Theme dengan 4 stack design berbeda. Cornerstone page builder included.',
    tags: ['stacks', 'cornerstone', 'versatile']
  },
  {
    id: 'wp-the7',
    name: 'The7',
    category: 'WordPress',
    version: '11.12.0',
    size: '8.7 MB',
    rating: 4.5,
    downloads: 270000,
    description: 'Theme website builder paling customizable. 1000+ theme options, WPBakery.',
    tags: ['customizable', 'wpbakery', 'options']
  },
  {
    id: 'wp-enfold',
    name: 'Enfold',
    category: 'WordPress',
    version: '5.6.2',
    size: '6.8 MB',
    rating: 4.4,
    downloads: 330000,
    description: 'Clean responsive theme. Avia layout builder, template builder, 2D+3D layerslider.',
    tags: ['responsive', 'avia', 'slider']
  },
  {
    id: 'react-nextui',
    name: 'NextUI Dashboard',
    category: 'React',
    version: '2.1.0',
    size: '3.2 MB',
    rating: 4.6,
    downloads: 85000,
    description: 'Dashboard admin modern pake NextUI + React. Dark mode, charts, tables.',
    tags: ['react', 'dashboard', 'dark']
  },
  {
    id: 'react-mui',
    name: 'Material Dashboard Pro',
    category: 'React',
    version: '3.0.1',
    size: '4.5 MB',
    rating: 4.5,
    downloads: 120000,
    description: 'Dashboard premium pake Material-UI. 200+ components, 40+ pages.',
    tags: ['material-ui', 'premium', 'components']
  },
  {
    id: 'vue-vuetify',
    name: 'Vuetify Admin',
    category: 'Vue',
    version: '2.4.0',
    size: '3.8 MB',
    rating: 4.3,
    downloads: 65000,
    description: 'Admin panel pake Vue 3 + Vuetify. CRUD generator, i18n, dark mode.',
    tags: ['vue3', 'vuetify', 'crud']
  },
  {
    id: 'php-laravel',
    name: 'Laravel Spark',
    category: 'PHP',
    version: '4.0.0',
    size: '5.1 MB',
    rating: 4.7,
    downloads: 95000,
    description: 'SaaS starter kit untuk Laravel. Billing, teams, 2FA, API ready.',
    tags: ['laravel', 'saas', 'billing']
  },
  {
    id: 'shopify-dawn',
    name: 'Dawn Premium',
    category: 'Shopify',
    version: '12.0.0',
    size: '3.5 MB',
    rating: 4.4,
    downloads: 180000,
    description: 'Theme Shopify OS 2.0 enhanced. Sections everywhere, quick view, sticky cart.',
    tags: ['shopify', 'os2', 'sections']
  },
  {
    id: 'ghost-casper',
    name: 'Casper Pro',
    category: 'Ghost',
    version: '5.2.1',
    size: '1.8 MB',
    rating: 4.5,
    downloads: 45000,
    description: 'Theme blog Ghost yang dimodif. Membership, newsletter, dark mode.',
    tags: ['ghost', 'blog', 'membership']
  }
]

interface LogEntry {
  id: string
  timestamp: string
  type: 'info' | 'success' | 'warning' | 'error' | 'cmd'
  message: string
}

export default function InstallPanel() {
  const [selectedTheme, setSelectedTheme] = useState<string | null>(null)
  const [vpsIp, setVpsIp] = useState('')
  const [vpsUser, setVpsUser] = useState('root')
  const [vpsPass, setVpsPass] = useState('')
  const [installDDOS, setInstallDDOS] = useState(true)
  const [logs, setLogs] = useState<LogEntry[]>([])
  const [isRunning, setIsRunning] = useState(false)
  const [progress, setProgress] = useState(0)
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')

  const filteredThemes = THEMES.filter(t => {
    const matchFilter = filter === 'all' || t.category.toLowerCase() === filter.toLowerCase()
    const matchSearch = t.name.toLowerCase().includes(search.toLowerCase()) || 
                        t.tags.some(tag => tag.toLowerCase().includes(search.toLowerCase()))
    return matchFilter && matchSearch
  })

  const categories = ['all', ...Array.from(new Set(THEMES.map(t => t.category)))]

  const addLog = (message: string, type: LogEntry['type'] = 'info') => {
    const now = new Date()
    const timestamp = `${now.getHours().toString().padStart(2,'0')}:${now.getMinutes().toString().padStart(2,'0')}:${now.getSeconds().toString().padStart(2,'0')}`
    setLogs(prev => [...prev, {
      id: Math.random().toString(36).substring(2, 8),
      timestamp,
      type,
      message
    }])
  }

  const runInstall = async () => {
    if (!selectedTheme || !vpsIp) return

    const theme = THEMES.find(t => t.id === selectedTheme)
    if (!theme) return

    setIsRunning(true)
    setProgress(0)
    setLogs([])

    // simulasi install step by step
    const steps = [
      { msg: `Connecting to VPS ${vpsIp}...`, type: 'cmd' as const, delay: 800, prog: 5 },
      { msg: `SSH handshake established with ${vpsIp}:22`, type: 'success' as const, delay: 600, prog: 10 },
      { msg: `Authenticating user ${vpsUser}...`, type: 'info' as const, delay: 700, prog: 15 },
      { msg: 'Authentication successful. Access granted.', type: 'success' as const, delay: 500, prog: 20 },
      { msg: 'Checking system requirements...', type: 'info' as const, delay: 800, prog: 25 },
      { msg: 'OS: Ubuntu 22.04 LTS | RAM: 4GB | Disk: 50GB', type: 'info' as const, delay: 400, prog: 30 },
      { msg: 'System requirements met. Proceeding...', type: 'success' as const, delay: 500, prog: 35 },
      { msg: `Downloading ${theme.name} v${theme.version}...`, type: 'cmd' as const, delay: 1200, prog: 45 },
      { msg: `Download complete. Size: ${theme.size}`, type: 'success' as const, delay: 600, prog: 55 },
      { msg: 'Verifying package integrity (SHA-256)...', type: 'info' as const, delay: 800, prog: 60 },
      { msg: 'Checksum verified. Package is valid.', type: 'success' as const, delay: 500, prog: 65 },
      { msg: 'Extracting files to /var/www/html...', type: 'cmd' as const, delay: 1000, prog: 75 },
      { msg: 'Extraction complete. Setting permissions...', type: 'success' as const, delay: 600, prog: 80 },
    ]

    if (installDDOS) {
      steps.push(
        { msg: 'Installing DDoS Protection module...', type: 'cmd' as const, delay: 1000, prog: 85 },
        { msg: 'Configuring rate limiting rules...', type: 'info' as const, delay: 700, prog: 88 },
        { msg: 'Setting up Cloudflare integration...', type: 'info' as const, delay: 800, prog: 90 },
        { msg: 'DDoS Protection activated.', type: 'success' as const, delay: 500, prog: 92 }
      )
    }

    steps.push(
      { msg: 'Running post-install configuration...', type: 'cmd' as const, delay: 800, prog: 95 },
      { msg: 'Clearing cache and optimizing...', type: 'info' as const, delay: 600, prog: 98 },
      { msg: `Installation of ${theme.name} completed successfully!`, type: 'success' as const, delay: 500, prog: 100 }
    )

    for (const step of steps) {
      await new Promise(r => setTimeout(r, step.delay))
      addLog(step.msg, step.type)
      setProgress(step.prog)
    }

    setIsRunning(false)
  }

  const formatDownloads = (n: number) => {
    if (n >= 1000000) return (n / 1000000).toFixed(1) + 'M'
    if (n >= 1000) return (n / 1000).toFixed(0) + 'K'
    return n.toString()
  }

  return (
    <div className="space-y-6">
      {/* Search & Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <input
          type="text"
          placeholder="Cari theme..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="input-dark flex-1"
        />
        <div className="flex gap-2 overflow-x-auto pb-2 sm:pb-0">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                filter === cat 
                  ? 'bg-kyriel-accent text-white' 
                  : 'bg-white/5 text-gray-400 hover:bg-white/10'
              }`}
            >
              {cat === 'all' ? 'Semua' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Theme Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredThemes.map(theme => (
          <div
            key={theme.id}
            onClick={() => !isRunning && setSelectedTheme(theme.id)}
            className={`card-hover rounded-xl p-5 cursor-pointer relative overflow-hidden ${
              selectedTheme === theme.id 
                ? 'border-kyriel-accent bg-kyriel-accent/5' 
                : 'bg-kyriel-card border-white/5'
            }`}
          >
            {selectedTheme === theme.id && (
              <div className="absolute top-3 right-3 w-6 h-6 rounded-full bg-kyriel-accent flex items-center justify-center">
                <Check className="w-4 h-4 text-white" />
              </div>
            )}

            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-bold text-white">{theme.name}</h3>
                <span className="text-xs text-kyriel-cyan">{theme.category}</span>
              </div>
              <span className="text-xs bg-white/5 px-2 py-1 rounded text-gray-400">v{theme.version}</span>
            </div>

            <p className="text-sm text-gray-400 mb-4 line-clamp-2">{theme.description}</p>

            <div className="flex items-center gap-4 text-xs text-gray-500">
              <span className="flex items-center gap-1">
                <Star className="w-3 h-3 text-kyriel-warning" />
                {theme.rating}
              </span>
              <span className="flex items-center gap-1">
                <Download className="w-3 h-3" />
                {formatDownloads(theme.downloads)}
              </span>
              <span className="flex items-center gap-1">
                <Server className="w-3 h-3" />
                {theme.size}
              </span>
            </div>

            <div className="flex flex-wrap gap-1 mt-3">
              {theme.tags.map(tag => (
                <span key={tag} className="text-xs bg-white/5 text-gray-400 px-2 py-0.5 rounded">
                  #{tag}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* VPS Config */}
      {selectedTheme && (
        <div className="bg-kyriel-card border border-white/10 rounded-xl p-6 space-y-4">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <Server className="w-5 h-5 text-kyriel-cyan" />
            Konfigurasi VPS
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">IP VPS</label>
              <input
                type="text"
                placeholder="192.168.1.1"
                value={vpsIp}
                onChange={e => setVpsIp(e.target.value)}
                className="input-dark"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Username SSH</label>
              <input
                type="text"
                value={vpsUser}
                onChange={e => setVpsUser(e.target.value)}
                className="input-dark"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Password SSH</label>
              <input
                type="password"
                placeholder="••••••••"
                value={vpsPass}
                onChange={e => setVpsPass(e.target.value)}
                className="input-dark"
              />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setInstallDDOS(!installDDOS)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all ${
                installDDOS 
                  ? 'bg-kyriel-success/10 text-kyriel-success border border-kyriel-success/30' 
                  : 'bg-white/5 text-gray-400 border border-white/10'
              }`}
            >
              <Shield className="w-4 h-4" />
              Install Anti-DDoS Protection
            </button>
            <button
              onClick={() => setInstallDDOS(!installDDOS)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-all ${
                !installDDOS 
                  ? 'bg-kyriel-warning/10 text-kyriel-warning border border-kyriel-warning/30' 
                  : 'bg-white/5 text-gray-400 border border-white/10'
              }`}
            >
              <Globe className="w-4 h-4" />
              Standard Install
            </button>
          </div>

          <button
            onClick={runInstall}
            disabled={isRunning || !vpsIp}
            className="btn-primary w-full flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isRunning ? (
              <>
                <Clock className="w-4 h-4 animate-spin" />
                Installing {THEMES.find(t => t.id === selectedTheme)?.name}...
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                Install Sekarang
              </>
            )}
          </button>
        </div>
      )}

      {/* Live Log */}
      <LiveLog 
        logs={logs} 
        isRunning={isRunning} 
        progress={progress}
        onClear={() => setLogs([])}
      />
    </div>
  )
}
