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
      <Icon size={64} className="text-white/20" />
      <div>
        <p className="text-white/60 text-base mb-1" style={{ fontFamily: 'Poppins', fontWeight: 600 }}>{title}</p>
        {description && <p className="text-white/40 text-sm" style={{ fontFamily: 'Poppins', fontWeight: 500 }}>{description}</p>}
      </div>
      {action}
    </div>
  )
}
