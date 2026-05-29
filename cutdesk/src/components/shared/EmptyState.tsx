import { type ReactNode } from 'react'
import { type LucideIcon } from 'lucide-react'

interface Props {
  icon: LucideIcon
  title: string
  description?: string
  action?: ReactNode
}

export default function EmptyState({ icon: Icon, title, description, action }: Props) {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-4 text-center">
      <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: '#F1F5F9', border: '1px solid #E2E8F0' }}>
        <Icon size={32} className="text-slate-300" />
      </div>
      <div>
        <p className="text-base mb-1" style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 600, color: '#475569' }}>{title}</p>
        {description && <p className="text-sm" style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 500, color: '#94A3B8' }}>{description}</p>}
      </div>
      {action}
    </div>
  )
}
