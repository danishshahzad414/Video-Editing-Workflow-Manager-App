interface Props {
  status: string
  size?: 'sm' | 'md'
}

const STATUS_STYLES: Record<string, { bg: string; color: string }> = {
  'Raw Uploaded':       { bg: '#DBEAFE', color: '#1D4ED8' },
  'In Editor Queue':    { bg: '#E0F2FE', color: '#0369A1' },
  'Editing In Progress':{ bg: '#FEF3C7', color: '#B45309' },
  'Revision Requested': { bg: '#FEE2E2', color: '#B91C1C' },
  'Re-record Submitted':{ bg: '#EDE9FE', color: '#7C3AED' },
  'Editing Complete':   { bg: '#D1FAE5', color: '#065F46' },
  'Pending Social Review':{ bg: '#CFFAFE', color: '#0E7490' },
  'Scheduled':          { bg: '#E0E7FF', color: '#3730A3' },
  'Published':          { bg: '#DCFCE7', color: '#15803D' },
  'Archived':           { bg: '#F1F5F9', color: '#64748B' },
}

export default function StatusBadge({ status, size = 'md' }: Props) {
  const style = STATUS_STYLES[status] || { bg: '#F1F5F9', color: '#64748B' }

  return (
    <span
      style={{
        background: style.bg,
        color: style.color,
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
