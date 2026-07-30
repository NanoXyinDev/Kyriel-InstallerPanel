// db pake github gist - setup env: GITHUB_TOKEN & GIST_ID
// kalo belom setup, fallback ke localStorage biar ga error

const GITHUB_TOKEN = process.env.GITHUB_TOKEN || ''
const GIST_ID = process.env.GIST_ID || ''
const API_BASE = 'https://api.github.com'

export interface User {
  id: string
  username: string
  email: string
  password: string
  role: 'admin' | 'user'
  createdAt: string
  lastLogin?: string
}

export interface InstallLog {
  id: string
  userId: string
  theme: string
  vpsIp: string
  status: 'pending' | 'running' | 'success' | 'failed'
  logs: string[]
  progress: number
  createdAt: string
  completedAt?: string
}

// cek kalo github db aktif
function isGitHubActive(): boolean {
  return GITHUB_TOKEN.length > 0 && GIST_ID.length > 0
}

// fetch gist
async function fetchGist(): Promise<any> {
  if (!isGitHubActive()) return null
  try {
    const res = await fetch(`${API_BASE}/gists/${GIST_ID}`, {
      headers: {
        'Authorization': `token ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    })
    if (!res.ok) throw new Error('gist fetch failed')
    return await res.json()
  } catch {
    return null
  }
}

// update gist
async function updateGist(content: any): Promise<boolean> {
  if (!isGitHubActive()) return false
  try {
    const res = await fetch(`${API_BASE}/gists/${GIST_ID}`, {
      method: 'PATCH',
      headers: {
        'Authorization': `token ${GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        files: {
          'kyriel-db.json': {
            content: JSON.stringify(content, null, 2)
          }
        }
      })
    })
    return res.ok
  } catch {
    return false
  }
}

// get db content
async function getDB(): Promise<{ users: User[]; logs: InstallLog[] }> {
  // coba github dulu
  if (isGitHubActive()) {
    const gist = await fetchGist()
    if (gist?.files?.['kyriel-db.json']?.content) {
      try {
        return JSON.parse(gist.files['kyriel-db.json'].content)
      } catch {}
    }
  }
  // fallback localStorage (client side only)
  if (typeof window !== 'undefined') {
    const raw = localStorage.getItem('kyriel-db')
    if (raw) {
      try { return JSON.parse(raw) } catch {}
    }
  }
  return { users: [], logs: [] }
}

// save db
async function saveDB(db: { users: User[]; logs: InstallLog[] }): Promise<void> {
  const saved = await updateGist(db)
  if (!saved && typeof window !== 'undefined') {
    localStorage.setItem('kyriel-db', JSON.stringify(db))
  }
}

// --- USER CRUD ---
export async function getUserByUsername(username: string): Promise<User | null> {
  const db = await getDB()
  return db.users.find(u => u.username.toLowerCase() === username.toLowerCase()) || null
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const db = await getDB()
  return db.users.find(u => u.email.toLowerCase() === email.toLowerCase()) || null
}

export async function createUser(user: Omit<User, 'id' | 'createdAt'>): Promise<User> {
  const db = await getDB()
  const newUser: User = {
    ...user,
    id: Math.random().toString(36).substring(2, 15),
    createdAt: new Date().toISOString()
  }
  db.users.push(newUser)
  await saveDB(db)
  return newUser
}

export async function updateUser(id: string, updates: Partial<User>): Promise<void> {
  const db = await getDB()
  const idx = db.users.findIndex(u => u.id === id)
  if (idx !== -1) {
    db.users[idx] = { ...db.users[idx], ...updates }
    await saveDB(db)
  }
}

// --- LOG CRUD ---
export async function createLog(log: Omit<InstallLog, 'id' | 'createdAt'>): Promise<InstallLog> {
  const db = await getDB()
  const newLog: InstallLog = {
    ...log,
    id: Math.random().toString(36).substring(2, 15),
    createdAt: new Date().toISOString()
  }
  db.logs.push(newLog)
  await saveDB(db)
  return newLog
}

export async function updateLog(id: string, updates: Partial<InstallLog>): Promise<void> {
  const db = await getDB()
  const idx = db.logs.findIndex(l => l.id === id)
  if (idx !== -1) {
    db.logs[idx] = { ...db.logs[idx], ...updates }
    await saveDB(db)
  }
}

export async function getLogsByUser(userId: string): Promise<InstallLog[]> {
  const db = await getDB()
  return db.logs.filter(l => l.userId === userId).sort((a, b) => 
    new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  )
}

export async function getLogById(id: string): Promise<InstallLog | null> {
  const db = await getDB()
  return db.logs.find(l => l.id === id) || null
}
