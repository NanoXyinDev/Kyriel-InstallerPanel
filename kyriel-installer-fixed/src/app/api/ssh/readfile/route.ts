export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'
import { readFile } from '../../../../lib/ssh-client'
import { checkRateLimit, getIP, getSecurityHeaders } from '../../../../lib/anti-ddos'

export async function POST(req: NextRequest) {
  try {
    const ip = getIP(req)
    const rate = checkRateLimit(ip)
    if (!rate.allowed) return NextResponse.json({ error: 'Rate limit exceeded.' }, { status: 429, headers: getSecurityHeaders() })
    const { host, port, username, password, logFile } = await req.json()
    if (!host || !username || !password || !logFile) return NextResponse.json({ error: 'Missing parameters.' }, { status: 400, headers: getSecurityHeaders() })
    const output = await readFile({ host, port: port || 22, username, password }, logFile)
    return NextResponse.json({ output }, { headers: getSecurityHeaders() })
  } catch (err: any) {
    return NextResponse.json({ output: '', error: err.message }, { status: 500, headers: getSecurityHeaders() })
  }
}
