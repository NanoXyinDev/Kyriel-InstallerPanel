import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) { return twMerge(clsx(inputs)) }
export function generateId(): string { return Math.random().toString(36).substring(2,15)+Math.random().toString(36).substring(2,15) }
export function delay(ms: number): Promise<void> { return new Promise(r=>setTimeout(r,ms)) }
export function formatTime(date: string|Date): string { return new Date(date).toLocaleTimeString('id-ID',{hour:'2-digit',minute:'2-digit'}) }
