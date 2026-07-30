"use client"

import { useState, useEffect, useRef } from 'react'
import { Terminal, Copy, Trash2 } from 'lucide-react'

interface LogEntry {
  id: string
  timestamp: string
  type: 'info' | 'success' | 'warning' | 'error' | 'cmd'
  message: string
}

interface LiveLogProps {
  logs: LogEntry[]
  isRunning: boolean
  progress: number
  onClear?: () => void
}

export default function LiveLog({ logs, isRunning, progress, onClear }: LiveLogProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [logs])

  const copyLogs = () => {
    const text = logs.map(l => `[${l.timestamp}] ${l.message}`).join('\n')
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const getColor = (type: string) => {
    switch (type) {
      case 'success': return 'text-kyriel-success'
      case 'error': return 'text-red-400'
      case 'warning': return 'text-kyriel-warning'
      case 'cmd': return 'text-kyriel-cyan'
      default: return 'text-gray-400'
    }
  }

  return (
    <div className="terminal overflow-hidden">
      <div className="terminal-header flex justify-between">
        <div className="flex items-center gap-2">
          <div className="terminal-dot bg-red-500" />
          <div className="terminal-dot bg-yellow-500" />
          <div className="terminal-dot bg-green-500" />
          <span className="ml-2 text-xs text-gray-500 font-mono">kyriel@build:~$</span>
        </div>
        <div className="flex items-center gap-2">
          {isRunning && (
            <span className="flex items-center gap-1 text-xs text-kyriel-success">
              <span className="w-2 h-2 bg-kyriel-success rounded-full animate-pulse" />
              LIVE
            </span>
          )}
          <button onClick={copyLogs} className="text-gray-500 hover:text-white transition-colors">
            <Copy className="w-3.5 h-3.5" />
          </button>
          {onClear && (
            <button onClick={onClear} className="text-gray-500 hover:text-red-400 transition-colors">
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {progress > 0 && (
        <div className="px-4 pt-3">
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>Progress</span>
            <span>{progress}%</span>
          </div>
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>
      )}

      <div 
        ref={scrollRef}
        className="p-4 h-80 overflow-y-auto font-mono text-xs space-y-1"
      >
        {logs.length === 0 ? (
          <div className="text-gray-600 flex items-center gap-2">
            <Terminal className="w-4 h-4" />
            Waiting for build command...
          </div>
        ) : (
          logs.map((log) => (
            <div key={log.id} className="flex gap-2">
              <span className="text-gray-600 shrink-0">[{log.timestamp}]</span>
              <span className={getColor(log.type)}>{log.message}</span>
            </div>
          ))
        )}
        {isRunning && (
          <div className="text-kyriel-cyan animate-pulse">_</div>
        )}
      </div>

      {copied && (
        <div className="absolute bottom-4 right-4 bg-kyriel-success text-black text-xs px-3 py-1 rounded font-bold">
          Copied!
        </div>
      )}
    </div>
  )
}
