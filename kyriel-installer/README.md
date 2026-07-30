# KYRIEL INSTALLER v2.0

Web app install panel keren buat deploy theme ke VPS dengan live build log, sistem login/register, global chat, dan proteksi anti-DDoS.

## Fitur

- **18+ Theme Terkenal** - WordPress, React, Vue, PHP, Shopify, Ghost
- **Live Build Log** - Real-time terminal output pas install
- **Sistem Login & Register** - JWT auth + bcrypt, rate limited
- **Global Chat** - Real-time chat antar user
- **Anti Inspect Element** - Block F12, right-click, devtools
- **Anti Screenshot** - Blur pas window kehilangan focus
- **Anti DDoS** - Rate limiting + IP blocking
- **Database GitHub Repo** - users.json, logs.json, chat.json di repo
- **Responsive** - Mobile & desktop stabil
- **Dark Cyberpunk UI** - Gradient, glow effects, scanlines

## Deploy ke Vercel

1. Push repo ini ke GitHub
2. Buka vercel.com → Import Project
3. Environment Variables:
   - `JWT_SECRET` - random string buat token
4. Deploy!

## Setup Database

Database pake file JSON di repo GitHub (users.json, logs.json, chat.json). Token GitHub udah di-encode base64 di `src/lib/github-db.ts`.

## Tech Stack

- Next.js 14 + React 18 + TypeScript
- Tailwind CSS
- Lucide Icons
- bcryptjs + jsonwebtoken

## Owner

Telegram: [@XyrooXellz](https://t.me/XyrooXellz)

---

**KYRIEL INSTALLER** - "I just give the tools, whether they're used right or not is your business, boss."
