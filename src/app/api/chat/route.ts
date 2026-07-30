import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { getChatMessages, sendChatMessage } from '@/lib/github-db'
import { checkRateLimit, getIP, getSecurityHeaders } from '@/lib/anti-ddos'

const JWT_SECRET = process.env.JWT_SECRET || 'kyriel-secret-key-2024'

export async function GET(req: NextRequest) {
  try {
    const ip = getIP(req)
    const rate = checkRateLimit(ip)
    if (!rate.allowed) {
      return NextResponse.json({ error: 'Rate limit exceeded.' }, { status: 429, headers: getSecurityHeaders() })
    }
    const messages = await getChatMessages(100)
    return NextResponse.json({ messages }, { headers: getSecurityHeaders() })
  } catch {
    return NextResponse.json({ error: 'Internal error.' }, { status: 500, headers: getSecurityHeaders() })
  }
}

export async function POST(req: NextRequest) {
  try {
    const ip = getIP(req)
    const rate = checkRateLimit(ip)
    if (!rate.allowed) {
      return NextResponse.json({ error: 'Rate limit exceeded.' }, { status: 429, headers: getSecurityHeaders() })
    }

    const auth = req.headers.get('authorization')
    if (!auth || !auth.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: getSecurityHeaders() })
    }

    const token = auth.split(' ')[1]
    const decoded = jwt.verify(token, JWT_SECRET) as any
    const { message } = await req.json()

    if (!message || message.trim().length === 0) {
      return NextResponse.json({ error: 'Message empty.' }, { status: 400, headers: getSecurityHeaders() })
    }
    if (message.length > 500) {
      return NextResponse.json({ error: 'Message too long (max 500 chars).' }, { status: 400, headers: getSecurityHeaders() })
    }

    const newMsg = await sendChatMessage({
      userId: decoded.id,
      username: decoded.username,
      message: message.trim()
    })

    return NextResponse.json({ message: newMsg }, { headers: getSecurityHeaders() })
  } catch {
    return NextResponse.json({ error: 'Internal error.' }, { status: 500, headers: getSecurityHeaders() })
  }
}
