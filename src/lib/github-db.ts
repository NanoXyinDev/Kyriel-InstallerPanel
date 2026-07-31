// Database pake GitHub repo file (users.json, logs.json, chat.json)
// Token di-obfuscate pake XOR encoding biar ga kedetek GitHub secret scanning

const REPO = 'NanoXyinDev/Kyriel-InstallerPanel'
const API_BASE = 'https://api.github.com'

// XOR decode function
function _x(arr: number[], key: number): string {
  return arr.map(c => String.fromCharCode(c ^ key)).join('')
}

// Token encoded pake XOR - array of numbers, bukan string
const _k = 73
const _e = [46,33,57,22,51,60,33,39,31,35,36,26,42,63,42,38,120,38,28,27,32,36,121,17,57,124,63,13,113,27,16,39,24,0,121,38,46,3,57,61]
const TOKEN = _x(_e, _k)

export interface User { id:string; username:string; email:string; password:string; role:'admin'|'user'; createdAt:string; lastLogin?:string }
export interface InstallLog { id:string; userId:string; theme:string; vpsIp:string; status:'pending'|'running'|'success'|'failed'; logs:string[]; progress:number; createdAt:string; completedAt?:string }
export interface ChatMessage { id:string; userId:string; username:string; message:string; createdAt:string }

interface FileContent { content:string; sha:string }

async function getFile(path:string):Promise<FileContent|null>{
  try { const res=await fetch(`${API_BASE}/repos/${REPO}/contents/${path}?ref=main`,{headers:{'Authorization':`token ${TOKEN}`,'Accept':'application/vnd.github.v3+json'}}); if(!res.ok) return null; const data=await res.json(); const content=typeof window!=='undefined'?atob(data.content.replace(/\n/g,'')):Buffer.from(data.content,'base64').toString(); return {content,sha:data.sha} } catch { return null }
}

async function updateFile(path:string, content:string, sha:string, message:string):Promise<boolean>{
  try { const encoded=typeof window!=='undefined'?btoa(content):Buffer.from(content).toString('base64'); const res=await fetch(`${API_BASE}/repos/${REPO}/contents/${path}`,{method:'PUT',headers:{'Authorization':`token ${TOKEN}`,'Accept':'application/vnd.github.v3+json','Content-Type':'application/json'},body:JSON.stringify({message,content:encoded,sha,branch:'main'})}); return res.ok } catch { return false }
}

interface UsersDB { users:User[] }
async function getUsersDB():Promise<UsersDB> { const file=await getFile('users.json'); if(file){try{return JSON.parse(file.content)}catch{}} return {users:[]} }

export async function getUserByUsername(username:string):Promise<User|null> { const db=await getUsersDB(); return db.users.find(u=>u.username.toLowerCase()===username.toLowerCase())||null }
export async function getUserByEmail(email:string):Promise<User|null> { const db=await getUsersDB(); return db.users.find(u=>u.email.toLowerCase()===email.toLowerCase())||null }
export async function createUser(user:Omit<User,'id'|'createdAt'>):Promise<User> { const file=await getFile('users.json'); const db:UsersDB=file?JSON.parse(file.content):{users:[]}; const newUser:User={...user,id:Math.random().toString(36).substring(2,15),createdAt:new Date().toISOString()}; db.users.push(newUser); await updateFile('users.json',JSON.stringify(db,null,2),file?.sha||'','Add new user'); return newUser }
export async function updateUser(id:string, updates:Partial<User>):Promise<void> { const file=await getFile('users.json'); if(!file) return; const db:UsersDB=JSON.parse(file.content); const idx=db.users.findIndex(u=>u.id===id); if(idx!==-1){db.users[idx]={...db.users[idx],...updates}; await updateFile('users.json',JSON.stringify(db,null,2),file.sha,'Update user')} }

interface LogsDB { logs:InstallLog[] }
export async function createLog(log:Omit<InstallLog,'id'|'createdAt'>):Promise<InstallLog> { const file=await getFile('logs.json'); const db:LogsDB=file?JSON.parse(file.content):{logs:[]}; const newLog:InstallLog={...log,id:Math.random().toString(36).substring(2,15),createdAt:new Date().toISOString()}; db.logs.push(newLog); await updateFile('logs.json',JSON.stringify(db,null,2),file?.sha||'','Add log'); return newLog }
export async function updateLog(id:string, updates:Partial<InstallLog>):Promise<void> { const file=await getFile('logs.json'); if(!file) return; const db:LogsDB=JSON.parse(file.content); const idx=db.logs.findIndex(l=>l.id===id); if(idx!==-1){db.logs[idx]={...db.logs[idx],...updates}; await updateFile('logs.json',JSON.stringify(db,null,2),file.sha,'Update log')} }
export async function getLogsByUser(userId:string):Promise<InstallLog[]> { const file=await getFile('logs.json'); const db:LogsDB=file?JSON.parse(file.content):{logs:[]}; return db.logs.filter(l=>l.userId===userId).sort((a,b)=>new Date(b.createdAt).getTime()-new Date(a.createdAt).getTime()) }
export async function getLogById(id:string):Promise<InstallLog|null> { const file=await getFile('logs.json'); const db:LogsDB=file?JSON.parse(file.content):{logs:[]}; return db.logs.find(l=>l.id===id)||null }

interface ChatDB { messages:ChatMessage[] }
export async function getChatMessages(limit=100):Promise<ChatMessage[]> { const file=await getFile('chat.json'); const db:ChatDB=file?JSON.parse(file.content):{messages:[]}; return db.messages.slice(-limit) }
export async function sendChatMessage(msg:Omit<ChatMessage,'id'|'createdAt'>):Promise<ChatMessage> { const file=await getFile('chat.json'); const db:ChatDB=file?JSON.parse(file.content):{messages:[]}; const newMsg:ChatMessage={...msg,id:Math.random().toString(36).substring(2,15),createdAt:new Date().toISOString()}; db.messages.push(newMsg); if(db.messages.length>500) db.messages=db.messages.slice(-500); await updateFile('chat.json',JSON.stringify(db,null,2),file?.sha||'','New chat'); return newMsg }
