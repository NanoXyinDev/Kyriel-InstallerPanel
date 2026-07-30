# KYRIEL INSTALLER

Web app install panel keren buat deploy theme ke VPS dengan live build log, sistem login/register, dan proteksi anti-DDoS.

## Fitur

- **18+ Theme Terkenal** - WordPress, React, Vue, PHP, Shopify, Ghost
- **Live Build Log** - Real-time terminal output pas install
- **Sistem Login & Register** - JWT auth + bcrypt
- **Anti Inspect Element** - Block F12, right-click, devtools
- **Anti Screenshot** - Blur pas window kehilangan focus
- **Anti DDoS** - Rate limiting + IP blocking
- **Database GitHub Gist** - Atau fallback ke localStorage
- **Dark Cyberpunk UI** - Gradient, glow effects, scanlines

## Deploy ke Vercel

1. Fork repo ini ke GitHub lu
2. Buka [vercel.com](https://vercel.com) → Import Project
3. Pilih repo `kyriel-installer`
4. Environment Variables (optional):
   - `JWT_SECRET` - random string buat token
   - `GITHUB_TOKEN` - GitHub personal access token (buat database)
   - `GIST_ID` - ID gist buat nyimpen data
5. Deploy!

## Setup Database GitHub Gist

1. Buat gist baru di GitHub, isi file `kyriel-db.json` dengan `{}`
2. Ambil Gist ID dari URL
3. Generate Personal Access Token dengan scope `gist`
4. Masukin ke environment variables Vercel

## Tech Stack

- Next.js 14 + React 18
- TypeScript
- Tailwind CSS
- Lucide Icons
- bcryptjs + jsonwebtoken

## Owner

Telegram: [@XyrooXellz](https://t.me/XyrooXellz)

---

**KYRIEL INSTALLER** - "I just give the tools, whether they're used right or not is your business, boss."
