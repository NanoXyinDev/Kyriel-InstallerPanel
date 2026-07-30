"use client"

import { useEffect } from 'react'

export default function AntiInspect() {
  useEffect(() => {
    const blockContext = (e: MouseEvent) => { e.preventDefault(); return false }
    document.addEventListener('contextmenu', blockContext, true)

    const blockKeys = (e: KeyboardEvent) => {
      if (e.key === 'F12') { e.preventDefault(); return false }
      if (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) {
        e.preventDefault(); return false
      }
      if (e.ctrlKey && e.key === 'u') { e.preventDefault(); return false }
      if (e.ctrlKey && e.key === 's') { e.preventDefault(); return false }
      if (e.ctrlKey && e.key === 'p') { e.preventDefault(); return false }
    }
    document.addEventListener('keydown', blockKeys, true)

    const threshold = 160
    const detectDevTools = () => {
      const widthThreshold = window.outerWidth - window.innerWidth > threshold
      const heightThreshold = window.outerHeight - window.innerHeight > threshold
      if (widthThreshold || heightThreshold) {
        document.body.innerHTML = '<div style="background:#000;color:#ff3366;font-family:monospace;text-align:center;padding:100px;font-size:20px">[ KYRIEL PROTECT ]<br>DevTools Detected.<br>Access Denied.</div>'
      }
    }
    const interval = setInterval(detectDevTools, 500)

    const originalLog = console.log
    const originalWarn = console.warn
    const originalError = console.error
    console.log = function() { originalLog.apply(console, ['[KYRIEL] blocked']) }
    console.warn = function() { originalWarn.apply(console, ['[KYRIEL] blocked']) }
    console.error = function() { originalError.apply(console, ['[KYRIEL] blocked']) }

    return () => {
      document.removeEventListener('contextmenu', blockContext, true)
      document.removeEventListener('keydown', blockKeys, true)
      clearInterval(interval)
      console.log = originalLog
      console.warn = originalWarn
      console.error = originalError
    }
  }, [])

  return null
}
