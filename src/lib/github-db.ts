// TODO: Replace with real database (Prisma, Supabase, GitHub Gist API, etc.)
// This is a stub using in-memory storage for demo purposes.

export interface User {
  id: string
  username: string
  email: string
  password: string
  role: string
  lastLogin?: string
}

export interface ChatMessage {
  id: string
  userId: string
  username: string
  message: string
  createdAt: string
}

export interface InstallLog {
  id: string
  userId: string
  theme: string
  vpsIp: string
  status: string
  logs: string[]
  progress: number
  createdAt: string
}

const users: User[] = []
const messages: ChatMessage[] = []
const logs: InstallLog[] = []

export async function getUserByUsername(username: string): Promise<User | null> {
  return users.find((u) => u.username === username) || null
}

export async function getUserByEmail(email: string): Promise<User | null> {
  return users.find((u) => u.email === email) || null
}

export async function createUser(data: Omit<User, 'id'>): Promise<User> {
  const user: User = { ...data, id: crypto.randomUUID() }
  users.push(user)
  return user
}

export async function updateUser(id: string, data: Partial<User>): Promise<User | null> {
  const idx = users.findIndex((u) => u.id === id)
  if (idx === -1) return null
  users[idx] = { ...users[idx], ...data }
  return users[idx]
}

export async function getChatMessages(limit = 100): Promise<ChatMessage[]> {
  return messages.slice(-limit)
}

export async function sendChatMessage(data: Omit<ChatMessage, 'id' | 'createdAt'>): Promise<ChatMessage> {
  const msg: ChatMessage = { ...data, id: crypto.randomUUID(), createdAt: new Date().toISOString() }
  messages.push(msg)
  return msg
}

export async function createLog(data: Omit<InstallLog, 'id' | 'createdAt'>): Promise<InstallLog> {
  const log: InstallLog = { ...data, id: crypto.randomUUID(), createdAt: new Date().toISOString() }
  logs.push(log)
  return log
}

export async function getLogsByUser(userId: string): Promise<InstallLog[]> {
  return logs.filter((l) => l.userId === userId)
}

export async function getLogById(id: string): Promise<InstallLog | null> {
  return logs.find((l) => l.id === id) || null
}
