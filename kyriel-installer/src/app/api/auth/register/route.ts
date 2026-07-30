import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { getUserByUsername, getUserByEmail, createUser } from '@/lib/github-db'
import { checkRateLimit, getIP, getSecurityHeaders } from '@/lib/anti-ddos'

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

    const { username, email, password } = await req.json()

    if (!username || !email || !password) {
      return NextResponse.json(
        { error: 'Semua field wajib diisi.' },
        { status: 400, headers: getSecurityHeaders() }
      )
    }

    if (username.length < 3) {
      return NextResponse.json(
        { error: 'Username minimal 3 karakter.' },
        { status: 400, headers: getSecurityHeaders() }
      )
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password minimal 6 karakter.' },
        { status: 400, headers: getSecurityHeaders() }
      )
    }

    const existingUser = await getUserByUsername(username)
    if (existingUser) {
      return NextResponse.json(
        { error: 'Username udah dipake bro.' },
        { status: 409, headers: getSecurityHeaders() }
      )
    }

    const existingEmail = await getUserByEmail(email)
    if (existingEmail) {
      return NextResponse.json(
        { error: 'Email udah terdaftar.' },
        { status: 409, headers: getSecurityHeaders() }
      )
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const user = await createUser({
      username,
      email,
      password: hashedPassword,
      role: 'user'
    })

    return NextResponse.json(
      {
        success: true,
        user: {
          id: user.id,
          username: user.username,
          email: user.email,
          role: user.role
        }
      },
      { status: 201, headers: getSecurityHeaders() }
    )
  } catch {
    return NextResponse.json(
      { error: 'Internal server error.' },
      { status: 500, headers: getSecurityHeaders() }
    )
  }
}
