"use client"

import { useEffect } from 'react'

export default function ScreenProtect() {
  useEffect(() => {
    const overlay = document.createElement('div')
    overlay.style.cssText = `
      position: fixed; top: 0; left: 0;
      width: 100vw; height: 100vh;
      pointer-events: none; z-index: 9995;
      background: repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,51,102,0.01) 10px, rgba(255,51,102,0.01) 20px);
    `
    document.body.appendChild(overlay)

    const detectPrintScreen = (e: KeyboardEvent) => {
      if (e.key === 'PrintScreen' || e.key === 'Snapshot') {
        e.preventDefault()
        navigator.clipboard.writeText('[KYRIEL] Screenshot blocked')
        alert('[KYRIEL PROTECT] Screenshot detected and blocked.')
      }
    }
    document.addEventListener('keydown', detectPrintScreen)

    const blurOnLeave = () => { document.body.style.filter = 'blur(5px)' }
    const unblurOnEnter = () => { document.body.style.filter = 'none' }
    window.addEventListener('blur', blurOnLeave)
    window.addEventListener('focus', unblurOnEnter)

    return () => {
      overlay.remove()
      document.removeEventListener('keydown', detectPrintScreen)
      window.removeEventListener('blur', blurOnLeave)
      window.removeEventListener('focus', unblurOnEnter)
    }
  }, [])

  return null
}
