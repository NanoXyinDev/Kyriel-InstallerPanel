import type { Metadata } from 'next'
import './globals.css'
import AntiInspect from '@/components/AntiInspect'
import ScreenProtect from '@/components/ScreenProtect'

export const metadata: Metadata = {
  title: 'KYRIEL INSTALLER - Deploy Anything',
  description: 'Premium Pterodactyl & theme installer with real SSH, live build logs, and DDoS protection. Built by @XyrooXellz',
  keywords: 'pterodactyl, installer, theme, vps, deploy, ssh, kyriel',
  authors: [{ name: 'XyrooXellz', url: 'https://t.me/XyrooXellz' }],
  robots: 'noindex, nofollow',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id">
      <head><meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover" /></head>
      <body className="antialiased">
        <AntiInspect /><ScreenProtect />
        <div className="scanlines" /><div className="noise" />
        {children}
      </body>
    </html>
  )
}
