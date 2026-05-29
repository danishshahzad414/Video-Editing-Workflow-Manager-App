interface Props {
  priority: 'Urgent' | 'Normal' | 'Low'
}

export default function PriorityBadge({ priority }: Props) {
  if (priority === 'Normal') return null
  const color = priority === 'Urgent' ? '#EF4444' : '#6B7280'

  return (
    <span
      style={{
        background: color,
        color: '#fff',
        fontFamily: 'Plus Jakarta Sans',
        fontWeight: 600,
        fontSize: 10,
        textTransform: 'uppercase',
        letterSpacing: '0.08em',
        padding: '2px 6px',
        borderRadius: 4,
        display: 'inline-block',
      }}
    >
      {priority}
    </span>
  )
}
