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
        background: '#003D52',
        border: '1px solid rgba(0,162,207,0.15)',
        borderLeft: `4px solid ${borderColor}`,
        transform: 'translateY(0)',
      }}
      onMouseEnter={e => {
        ;(e.currentTarget as HTMLElement).style.background = 'rgba(0,162,207,0.06)'
        ;(e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)'
      }}
      onMouseLeave={e => {
        ;(e.currentTarget as HTMLElement).style.background = '#003D52'
        ;(e.currentTarget as HTMLElement).style.transform = 'translateY(0)'
      }}
    >
      {/* Thumbnail */}
      <div className="w-20 h-14 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: '#006386' }}>
        <Film size={20} className="text-white/60" />
      </div>

      {/* Title zone */}
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <p className="text-white text-sm truncate" style={{ fontFamily: 'Montserrat', fontWeight: 700, fontSize: 15 }}>
            {video.title}
          </p>
          {video.is_urgent && (
            <AlertCircle size={14} className="text-red-400 flex-shrink-0" />
          )}
        </div>
        <p className="text-white/50 text-xs mt-0.5" style={{ fontFamily: 'Poppins', fontWeight: 500 }}>
          {(video.counselor as any)?.full_name || ''} · {video.category}
        </p>
        <div className="flex items-center gap-2 mt-1.5 flex-wrap">
          <StatusBadge status={video.status} size="sm" />
          <PriorityBadge priority={video.priority} />
        </div>
      </div>

      {/* Right */}
      <div className="flex flex-col items-end gap-1.5 flex-shrink-0 text-right" onClick={e => e.stopPropagation()}>
        <span style={{ fontFamily: 'Poppins', fontWeight: 500, fontSize: 11, color: 'rgba(245,248,250,0.4)' }}>
          {timeAgo(video.created_at)}
        </span>
        <span style={{ fontFamily: 'Poppins', fontWeight: 500, fontSize: 11, color: 'rgba(245,248,250,0.4)' }}>
          Step {stageIdx + 1} of {PIPELINE_STAGES.length}
        </span>
        {actionSlot && <div className="mt-1">{actionSlot}</div>}
      </div>
    </div>
  )
}
