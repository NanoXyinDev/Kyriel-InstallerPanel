import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { getUserByUsername, updateUser } from '@/lib/github-db'
import { checkRateLimit, getIP, getSecurityHeaders } from '@/lib/anti-ddos'

const JWT_SECRET = process.env.JWT_SECRET || 'kyriel-secret-key-2024'

export async function POST(req: NextRequest) {
  try {
    const ip = getIP(req)
    const rate = checkRateLimit(ip)
    if (!rate.allowed) {
      return NextResponse.json(
        { error: 'Rate limit exceeded. Try again later.' },
        { status: 429, headers: getSecurityHeaders() }
      )
    }

    const { username, password } = await req.json()

    if (!username || !password) {
      return NextResponse.json(
        { error: 'Username dan password wajib diisi.' },
        { status: 400, headers: getSecurityHeaders() }
      )
    }

    const user = await getUserByUsername(username)
    if (!user) {
      return NextResponse.json(
        { error: 'Username atau password salah.' },
        { status: 401, headers: getSecurityHeaders() }
      )
    }

    const valid = await bcrypt.compare(password, user.password)
    if (!valid) {
      return NextResponse.json(
        { error: 'Username atau password salah.' },
        { status: 401, headers: getSecurityHeaders() }
      )
    }

    await updateUser(user.id, { lastLogin: new Date().toISOString() })

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    )

    return NextResponse.json(
      {
        token,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role
        }
      },
      { headers: getSecurityHeaders() }
    )
  } catch {
    return NextResponse.json(
      { error: 'Internal server error.' },
      { status: 500, headers: getSecurityHeaders() }
    )
  }
}
