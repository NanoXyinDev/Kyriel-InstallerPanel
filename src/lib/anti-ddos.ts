import { NextRequest } from 'next/server'
interface RateLimitEntry { count:number; resetAt:number; blocked:boolean; blockUntil:number }
const store = new Map<string, RateLimitEntry>()
const MAX_REQUESTS=30, WINDOW_MS=60000, BLOCK_DURATION=300000, MAX_BLOCK=3
const blockCounts = new Map<string,number>()

export function checkRateLimit(ip:string):{allowed:boolean;remaining:number;resetAt:number}{
  const now=Date.now(), entry=store.get(ip)
  if(entry?.blocked && now<entry.blockUntil) return {allowed:false,remaining:0,resetAt:entry.blockUntil}
  if(entry?.blocked && now>=entry.blockUntil){ entry.blocked=false; entry.count=0; entry.resetAt=now+WINDOW_MS }
  if(!entry || now>entry.resetAt){ store.set(ip,{count:1,resetAt:now+WINDOW_MS,blocked:false,blockUntil:0}); return {allowed:true,remaining:MAX_REQUESTS-1,resetAt:now+WINDOW_MS} }
  entry.count++
  if(entry.count>MAX_REQUESTS){ const bc=(blockCounts.get(ip)||0)+1; blockCounts.set(ip,bc); const bt=bc>=MAX_BLOCK?86400000:BLOCK_DURATION; entry.blocked=true; entry.blockUntil=now+bt; return {allowed:false,remaining:0,resetAt:entry.blockUntil} }
  return {allowed:true,remaining:MAX_REQUESTS-entry.count,resetAt:entry.resetAt}
}
export function getSecurityHeaders() { return { 'X-RateLimit-Policy':'30req/min', 'X-DDoS-Protection':'active', 'X-Request-ID':Math.random().toString(36).substring(2,15) } }
export function getIP(req:NextRequest):string { const f=req.headers.get('x-forwarded-for'); if(f) return f.split(',')[0].trim(); const r=req.headers.get('x-real-ip'); if(r) return r; return 'unknown' }
