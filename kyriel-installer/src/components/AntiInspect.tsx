"use client"

import { useEffect } from 'react'

export default function AntiInspect() {
  useEffect(() => {
    // anti right click
    const blockContext = (e: MouseEvent) => {
      e.preventDefault()
      return false
    }
    document.addEventListener('contextmenu', blockContext, true)

    // anti key shortcuts
    const blockKeys = (e: KeyboardEvent) => {
      // F12
      if (e.key === 'F12') { e.preventDefault(); return false }
      // Ctrl+Shift+I/J/C/U
      if (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) {
        e.preventDefault(); return false
      }
      // Ctrl+U
      if (e.ctrlKey && e.key === 'u') { e.preventDefault(); return false }
      // Ctrl+S
      if (e.ctrlKey && e.key === 's') { e.preventDefault(); return false }
      // Ctrl+P
      if (e.ctrlKey && e.key === 'p') { e.preventDefault(); return false }
    }
    document.addEventListener('keydown', blockKeys, true)

    // anti devtools detection
    const threshold = 160
    const detectDevTools = () => {
      const widthThreshold = window.outerWidth - window.innerWidth > threshold
      const heightThreshold = window.outerHeight - window.innerHeight > threshold
      if (widthThreshold || heightThreshold) {
        document.body.innerHTML = '<div style="background:#000;color:#ff3366;font-family:monospace;text-align:center;padding:100px;font-size:24px">[ KYRIEL PROTECT ]<br>DevTools Detected. Access Denied.</div>'
      }
    }
    const interval = setInterval(detectDevTools, 500)

    // debugger trap
    const trap = () => {
      setTimeout(() => {
        debugger
        trap()
      }, 100)
    }
    // trap() // uncomment kalo mau hardcore

    // anti console
    const originalLog = console.log
    const originalWarn = console.warn
    const originalError = console.error
    console.log = function() { originalLog.apply(console, ['[KYRIEL] blocked']) }
    console.warn = function() { originalWarn.apply(console, ['[KYRIEL] blocked']) }
    console.error = function() { originalError.apply(console, ['[KYRIEL] blocked']) }

    // anti inspect element via selection
    document.addEventListener('selectstart', (e) => {
      if ((e.target as HTMLElement).tagName === 'INPUT' || (e.target as HTMLElement).tagName === 'TEXTAREA') return
      // e.preventDefault() // bisa diaktifin kalo mau hardcore
    })

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
