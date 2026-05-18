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
      className="flex items-center gap-4 rounded-xl px-4 py-3 cursor-pointer transition-all duration-200"
      style={{
        background: '#FFFFFF',
        border: '1px solid #E2E8F0',
        borderLeft: `4px solid ${borderColor}`,
        boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
        transform: 'translateY(0)',
      }}
      onMouseEnter={e => {
        ;(e.currentTarget as HTMLElement).style.background = '#F8FAFC'
        ;(e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)'
        ;(e.currentTarget as HTMLElement).style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)'
      }}
      onMouseLeave={e => {
        ;(e.currentTarget as HTMLElement).style.background = '#FFFFFF'
        ;(e.currentTarget as HTMLElement).style.transform = 'translateY(0)'
        ;(e.currentTarget as HTMLElement).style.boxShadow = '0 1px 3px rgba(0,0,0,0.06)'
      }}
    >
      {/* Thumbnail */}
      <div className="w-20 h-14 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: '#F1F5F9', border: '1px solid #E2E8F0' }}>
        <Film size={20} className="text-slate-400" />
      </div>

      {/* Title zone */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="text-slate-800 text-sm truncate" style={{ fontFamily: 'Montserrat', fontWeight: 700, fontSize: 15 }}>
            {video.title}
          </p>
          {video.is_urgent && (
            <AlertCircle size={14} className="text-red-500 flex-shrink-0" />
          )}
        </div>
        <p className="text-slate-500 text-xs mt-0.5" style={{ fontFamily: 'Poppins', fontWeight: 500 }}>
          {(video.counselor as any)?.full_name || ''} · {video.category}
        </p>
        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
          <StatusBadge status={video.status} size="sm" />
          <PriorityBadge priority={video.priority} />
        </div>
      </div>

      {/* Right */}
      <div className="flex flex-col items-end gap-1.5 flex-shrink-0 text-right" onClick={e => e.stopPropagation()}>
        <span style={{ fontFamily: 'Poppins', fontWeight: 500, fontSize: 11, color: '#94A3B8' }}>
          {timeAgo(video.created_at)}
        </span>
        <span style={{ fontFamily: 'Poppins', fontWeight: 500, fontSize: 11, color: '#94A3B8' }}>
          Step {stageIdx + 1} of {PIPELINE_STAGES.length}
        </span>
        {actionSlot && <div className="mt-1">{actionSlot}</div>}
      </div>
    </div>
  )
}
