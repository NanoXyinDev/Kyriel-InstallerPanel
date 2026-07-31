# KYRIEL INSTALLER v3.0

Real SSH Pterodactyl & Theme Installer Panel dengan live build log, global chat, dan proteksi anti-DDoS.

## Fitur

- **Real SSH Connection** - Beneran connect ke VPS via SSH2, jalanin command install
- **Pterodactyl Installer** - Install panel + wings pake `bash <(curl -s https://pterodactyl-installer.se)`
- **12+ Pterodactyl Themes** - Enigma, Billing, Nookure, DarkNite, Stellar, Flux, CyberPanel, Nova, Prism, Aurora, Quantum, Nebula
- **Live Build Log** - Real-time log dari server VPS via polling
- **Sistem Login & Register** - JWT auth + bcrypt
- **Global Chat** - Real-time chat antar user via GitHub JSON database
- **Anti Inspect Element** - Block F12, right-click, devtools
- **Anti Screenshot** - Blur pas window kehilangan focus
- **Anti DDoS** - Rate limiting + IP blocking
- **Database GitHub Repo** - users.json, logs.json, chat.json di repo
- **Responsive** - Mobile & desktop stabil
- **Dark Cyberpunk UI**

## Deploy ke Vercel

1. Push repo ke GitHub
2. Buka vercel.com → Import Project
3. Environment Variables:
   - `JWT_SECRET` = random string panjang
4. Deploy!

## Setup Database

Database pake file JSON di repo GitHub. Token GitHub udah di-encode base64 di `src/lib/github-db.ts`.
Pastikan ada file `users.json`, `logs.json`, `chat.json` di root repo.

## Tech Stack

- Next.js 14.2.28 + React 18 + TypeScript
- Tailwind CSS
- ssh2 (real SSH client)
- bcryptjs + jsonwebtoken
- Lucide Icons

## Owner

Telegram: [@XyrooXellz](https://t.me/XyrooXellz)

---

**KYRIEL INSTALLER** - "I just give the tools, whether they're used right or not is your business, boss."
