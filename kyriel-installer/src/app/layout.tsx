import type { Metadata } from 'next'
import './globals.css'
import AntiInspect from '@/components/AntiInspect'
import ScreenProtect from '@/components/ScreenProtect'

export const metadata: Metadata = {
  title: 'KYRIEL INSTALLER - Deploy Anything',
  description: 'Premium theme installer panel with DDoS protection, live build logs, and VPS management. Built by @XyrooXellz',
  keywords: 'installer, theme, wordpress, vps, deploy, kyriel',
  authors: [{ name: 'XyrooXellz', url: 'https://t.me/XyrooXellz' }],
  robots: 'noindex, nofollow',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="id">
      <body className="antialiased">
        <AntiInspect />
        <ScreenProtect />
        <div className="scanlines" />
        <div className="noise" />
        {children}
      </body>
    </html>
  )
}
