import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { createLog } from '../../../lib/github-db'
import { checkRateLimit, getIP, getSecurityHeaders } from '../../../lib/anti-ddos'

const JWT_SECRET = process.env.JWT_SECRET || 'kyriel-secret-key-2024'

export async function POST(req: NextRequest) {
  try {
    const ip = getIP(req)
    const rate = checkRateLimit(ip)
    if (!rate.allowed) return NextResponse.json({ error: 'Rate limit exceeded.' }, { status: 429, headers: getSecurityHeaders() })
    const auth = req.headers.get('authorization')
    if (!auth || !auth.startsWith('Bearer ')) return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: getSecurityHeaders() })
    const token = auth.split(' ')[1]
    const decoded = jwt.verify(token, JWT_SECRET) as any
    const { theme, vpsIp, vpsUser, installDDOS } = await req.json()
    if (!theme || !vpsIp) return NextResponse.json({ error: 'Theme dan VPS IP wajib diisi.' }, { status: 400, headers: getSecurityHeaders() })
    const log = await createLog({ userId: decoded.id, theme, vpsIp, status: 'pending', logs: ['Install request received.'], progress: 0 })
    return NextResponse.json({ success: true, logId: log.id }, { headers: getSecurityHeaders() })
  } catch {
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500, headers: getSecurityHeaders() })
  }
}
