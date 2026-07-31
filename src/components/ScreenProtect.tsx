"use client"
import { useEffect } from 'react'
export default function ScreenProtect() {
  useEffect(() => {
    // Screen protection logic (screenshot prevention, etc.)
    const style = document.createElement('style')
    style.innerHTML = `
      @media print {
        body { display: none !important; }
      }
    `
    document.head.appendChild(style)
    return () => { document.head.removeChild(style) }
  }, [])
  return null
}
