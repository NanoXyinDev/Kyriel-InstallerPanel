import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { getUserByUsername } from '../../../../lib/github-db'
import { getSecurityHeaders } from '../../../../lib/anti-ddos'

const JWT_SECRET = process.env.JWT_SECRET || 'kyriel-secret-key-2024'

export async function GET(req: NextRequest) {
  try {
    const auth = req.headers.get('authorization')
    if (!auth || !auth.startsWith('Bearer ')) return NextResponse.json({ error: 'Unauthorized' }, { status: 401, headers: getSecurityHeaders() })
    const token = auth.split(' ')[1]
    const decoded = jwt.verify(token, JWT_SECRET) as any
    const user = await getUserByUsername(decoded.username)
    if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404, headers: getSecurityHeaders() })
    return NextResponse.json({ user: { id: user.id, username: user.username, email: user.email, role: user.role } }, { headers: getSecurityHeaders() })
  } catch {
    return NextResponse.json({ error: 'Invalid token' }, { status: 401, headers: getSecurityHeaders() })
  }
}
