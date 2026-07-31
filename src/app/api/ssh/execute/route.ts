export const runtime = 'nodejs'

import { NextRequest, NextResponse } from 'next/server'
import { executeBackground } from '../../../../lib/ssh-client'
import { checkRateLimit, getIP, getSecurityHeaders } from '../../../../lib/anti-ddos'

export async function POST(req: NextRequest) {
  try {
    const ip = getIP(req)
    const rate = checkRateLimit(ip)
    if (!rate.allowed) return NextResponse.json({ error: 'Rate limit exceeded.' }, { status: 429, headers: getSecurityHeaders() })
    const { host, port, username, password, command, logFile } = await req.json()
    if (!host || !username || !password || !command) return NextResponse.json({ error: 'Missing parameters.' }, { status: 400, headers: getSecurityHeaders() })
    const result = await executeBackground({ host, port: port || 22, username, password }, command, logFile || `/tmp/kyriel-install-${Date.now()}.log`)
    const pid = result.output.match(/PID:(\d+)/)?.[1] || null
    return NextResponse.json({ success: result.success, pid, output: result.output, error: result.error }, { headers: getSecurityHeaders() })
  } catch (err: any) {
    return NextResponse.json({ success: false, error: err.message || 'Execution failed' }, { status: 500, headers: getSecurityHeaders() })
  }
}
