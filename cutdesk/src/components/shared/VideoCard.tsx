import { Film, AlertCircle } from 'lucide-react'
import { type Video } from '../../hooks/useVideos'
import { stageColor, getStageIndex, PIPELINE_STAGES, timeAgo } from '../../lib/utils'
import StatusBadge from './StatusBadge'
import PriorityBadge from './PriorityBadge'

interface Props {
  video: Video
  onClick: () => void
  actionSlot?: React.ReactNode
}

export default function VideoCard({ video, onClick, actionSlot }: Props) {
  const borderColor = stageColor(video.status)
  const stageIdx = getStageIndex(video.status)

  return (
    <div
      onClick={onClick}
      className="flex items-center gap-4 rounded-2xl px-4 py-3.5 cursor-pointer transition-all duration-200"
      style={{
        background: '#FFFFFF',
        border: '1px solid rgba(0,0,0,0.065)',
        borderLeft: `3px solid ${borderColor}`,
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.9), 0 1px 3px rgba(0,0,0,0.05), 0 4px 12px rgba(0,0,0,0.06)',
        transform: 'translateY(0)',
      }}
      onMouseEnter={e => {
        ;(e.currentTarget as HTMLElement).style.background = '#F5F9FF'
        ;(e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'
        ;(e.currentTarget as HTMLElement).style.boxShadow = 'inset 0 1px 0 rgba(255,255,255,0.9), 0 4px 16px rgba(0,0,0,0.09), 0 0 0 1px rgba(2,132,199,0.07)'
      }}
      onMouseLeave={e => {
        ;(e.currentTarget as HTMLElement).style.background = '#FFFFFF'
        ;(e.currentTarget as HTMLElement).style.transform = 'translateY(0)'
        ;(e.currentTarget as HTMLElement).style.boxShadow = 'inset 0 1px 0 rgba(255,255,255,0.9), 0 1px 3px rgba(0,0,0,0.05), 0 4px 12px rgba(0,0,0,0.06)'
      }}
    >
      {/* Thumbnail */}
      <div className="w-20 h-14 rounded-xl flex items-center justify-center flex-shrink-0 relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #EEF2FF 0%, #E0F2FE 100%)', border: '1px solid rgba(0,0,0,0.06)' }}>
        <Film size={18} style={{ color: '#93C5FD', filter: 'drop-shadow(0 1px 3px rgba(2,132,199,0.3))' }} />
      </div>

      {/* Title zone */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="text-slate-800 text-sm truncate" style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 700, fontSize: 15 }}>
            {video.title}
          </p>
          {video.is_urgent && (
            <AlertCircle size={14} className="text-red-500 flex-shrink-0" />
          )}
        </div>
        <p className="text-slate-500 text-xs mt-0.5" style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 500 }}>
          {(video.counselor as any)?.full_name || ''} · {video.category}
        </p>
        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
          <StatusBadge status={video.status} size="sm" />
          <PriorityBadge priority={video.priority} />
        </div>
      </div>

      {/* Right */}
      <div className="flex flex-col items-end gap-1.5 flex-shrink-0 text-right" onClick={e => e.stopPropagation()}>
        <span style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 500, fontSize: 11, color: '#94A3B8' }}>
          {timeAgo(video.created_at)}
        </span>
        <span style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 500, fontSize: 11, color: '#94A3B8' }}>
          Step {stageIdx + 1} of {PIPELINE_STAGES.length}
        </span>
        {actionSlot && <div className="mt-1">{actionSlot}</div>}
      </div>
    </div>
  )
}
