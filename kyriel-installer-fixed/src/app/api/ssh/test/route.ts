export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'
import { testConnection } from '../../../../lib/ssh-client'
import { checkRateLimit, getIP, getSecurityHeaders } from '../../../../lib/anti-ddos'

export async function POST(req: NextRequest) {
  try {
    const ip = getIP(req)
    const rate = checkRateLimit(ip)
    if (!rate.allowed) return NextResponse.json({ error: 'Rate limit exceeded.' }, { status: 429, headers: getSecurityHeaders() })
    const { host, port, username, password } = await req.json()
    if (!host || !username || !password) return NextResponse.json({ error: 'Missing credentials.' }, { status: 400, headers: getSecurityHeaders() })
    const result = await testConnection({ host, port: port || 22, username, password })
    return NextResponse.json(result, { headers: getSecurityHeaders() })
  } catch (err: any) {
    return NextResponse.json({ success: false, message: err.message || 'SSH test failed' }, { status: 500, headers: getSecurityHeaders() })
  }
}
