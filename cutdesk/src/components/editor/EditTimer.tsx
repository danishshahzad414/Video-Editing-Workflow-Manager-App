import { useState, useEffect, useRef } from 'react'
import { Play, Pause, Square } from 'lucide-react'
import { formatTimer } from '../../lib/utils'

interface TimerState {
  elapsed: number
  running: boolean
  startedAt: number | null
}

interface Props {
  videoId: string
  onStop: (minutes: number) => void
}

export default function EditTimer({ videoId, onStop }: Props) {
  const key = `timer_${videoId}`
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  function loadState(): TimerState {
    try {
      const raw = localStorage.getItem(key)
      if (raw) {
        const s: TimerState = JSON.parse(raw)
        if (s.running && s.startedAt) {
          s.elapsed += Math.floor((Date.now() - s.startedAt) / 1000)
          s.startedAt = Date.now()
        }
        return s
      }
    } catch {}
    return { elapsed: 0, running: false, startedAt: null }
  }

  const [state, setState] = useState<TimerState>(loadState)

  function saveState(s: TimerState) {
    localStorage.setItem(key, JSON.stringify(s))
  }

  useEffect(() => {
    if (state.running) {
      intervalRef.current = setInterval(() => {
        setState(prev => {
          const updated = { ...prev, elapsed: prev.elapsed + 1 }
          saveState(updated)
          return updated
        })
      }, 1000)
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [state.running])

  function start() {
    const s = { elapsed: state.elapsed, running: true, startedAt: Date.now() }
    saveState(s)
    setState(s)
  }

  function pause() {
    const s = { elapsed: state.elapsed, running: false, startedAt: null }
    saveState(s)
    setState(s)
  }

  function stop() {
    const minutes = Math.ceil(state.elapsed / 60)
    const s = { elapsed: 0, running: false, startedAt: null }
    saveState(s)
    setState(s)
    onStop(minutes)
    localStorage.removeItem(key)
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-white font-mono text-sm px-3 py-1 rounded-lg" style={{ background: 'rgba(0,162,207,0.15)', fontFamily: 'monospace', letterSpacing: '0.05em' }}>
        {formatTimer(state.elapsed)}
      </span>
      {!state.running ? (
        <button onClick={start} className="p-1.5 rounded-lg text-[#10B981] hover:bg-[rgba(16,185,129,0.15)] transition-colors" title="Start">
          <Play size={14} />
        </button>
      ) : (
        <button onClick={pause} className="p-1.5 rounded-lg text-amber-400 hover:bg-[rgba(245,158,11,0.15)] transition-colors" title="Pause">
          <Pause size={14} />
        </button>
      )}
      <button onClick={stop} className="p-1.5 rounded-lg text-red-400 hover:bg-[rgba(239,68,68,0.15)] transition-colors" title="Stop & Log">
        <Square size={14} />
      </button>
    </div>
  )
}
