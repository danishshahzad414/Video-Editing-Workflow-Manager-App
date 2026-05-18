import { stageColor } from '../../lib/utils'

interface Props {
  status: string
  size?: 'sm' | 'md'
}

export default function StatusBadge({ status, size = 'md' }: Props) {
  const color = stageColor(status)

  return (
    <span
      style={{
        background: color,
        color: '#fff',
        fontFamily: 'Poppins',
        fontWeight: 600,
        fontSize: size === 'sm' ? 10 : 11,
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
        padding: size === 'sm' ? '2px 6px' : '3px 8px',
        borderRadius: 4,
        display: 'inline-block',
        whiteSpace: 'nowrap',
      }}
    >
      {status}
    </span>
  )
}
