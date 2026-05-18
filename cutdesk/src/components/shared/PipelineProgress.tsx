import { PIPELINE_STAGES, stageColor, getStageIndex } from '../../lib/utils'
import { Check } from 'lucide-react'

interface Props {
  currentStatus: string
  compact?: boolean
}

export default function PipelineProgress({ currentStatus, compact }: Props) {
  const currentIdx = getStageIndex(currentStatus)

  if (compact) {
    return (
      <span style={{ fontFamily: 'Poppins', fontWeight: 500, fontSize: 11, color: 'rgba(245,248,250,0.5)' }}>
        Step {currentIdx + 1} of {PIPELINE_STAGES.length}
      </span>
    )
  }

  return (
    <div className="space-y-0">
      {PIPELINE_STAGES.map((stage, idx) => {
        const isDone = idx < currentIdx
        const isCurrent = idx === currentIdx
        const isUpcoming = idx > currentIdx
        const color = isDone ? '#00A2CF' : isCurrent ? stageColor(stage) : '#374151'

        return (
          <div key={stage} className="flex items-start gap-3">
            <div className="flex flex-col items-center" style={{ width: 24 }}>
              <div
                className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                style={{ background: color, border: isCurrent ? `2px solid ${stageColor(stage)}` : 'none' }}
              >
                {isDone
                  ? <Check size={12} className="text-white" />
                  : <span style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: 9, color: isUpcoming ? 'rgba(255,255,255,0.4)' : '#fff' }}>{idx + 1}</span>
                }
              </div>
              {idx < PIPELINE_STAGES.length - 1 && (
                <div className="w-0.5 h-6" style={{ background: idx < currentIdx ? '#00A2CF' : 'rgba(255,255,255,0.1)' }} />
              )}
            </div>
            <div className="pb-5 pt-0.5">
              <p style={{
                fontFamily: 'Poppins',
                fontWeight: isCurrent ? 600 : 500,
                fontSize: 12,
                color: isUpcoming ? 'rgba(245,248,250,0.4)' : isCurrent ? stageColor(stage) : 'rgba(245,248,250,0.7)',
              }}>
                {stage}
                {isCurrent && <span className="ml-2 inline-block w-2 h-2 rounded-full pulse-dot" style={{ background: stageColor(stage) }} />}
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
