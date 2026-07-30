"use client"

import { useState, useEffect, useCallback } from 'react'

interface User {
  id: string
  username: string
  email: string
  role: string
}

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('kyriel-token')
    if (token) {
      fetch('/api/auth/me', { headers: { 'Authorization': `Bearer ${token}` } })
        .then(r => r.json())
        .then(data => {
          if (data.user) setUser(data.user)
          else localStorage.removeItem('kyriel-token')
        })
        .catch(() => localStorage.removeItem('kyriel-token'))
        .finally(() => setLoading(false))
    } else {
      setLoading(false)
    }
  }, [])

  const login = useCallback(async (username: string, password: string) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password })
    })
    const data = await res.json()
    if (data.token) {
      localStorage.setItem('kyriel-token', data.token)
      setUser(data.user)
    }
    return data
  }, [])

  const register = useCallback(async (username: string, email: string, password: string) => {
    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password })
    })
    return res.json()
  }, [])

  const logout = useCallback(() => {
    localStorage.removeItem('kyriel-token')
    setUser(null)
    window.location.href = '/'
  }, [])

  return { user, loading, login, register, logout }
}
