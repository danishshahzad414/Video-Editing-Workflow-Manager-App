import { AlertTriangle } from 'lucide-react'

interface Props {
  title: string
  message: string
  confirmLabel?: string
  cancelLabel?: string
  danger?: boolean
  onConfirm: () => void
  onCancel: () => void
  loading?: boolean
}

export default function ConfirmModal({
  title, message, confirmLabel = 'Confirm', cancelLabel = 'Cancel',
  danger = true, onConfirm, onCancel, loading
}: Props) {
  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div
        className="rounded-2xl p-8 w-full max-w-md scale-in"
        style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', boxShadow: '0 20px 60px rgba(0,0,0,0.12)' }}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: danger ? '#FEE2E2' : '#EFF6FF' }}>
            <AlertTriangle size={20} style={{ color: danger ? '#EF4444' : '#0284C7' }} />
          </div>
          <h2 style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 800, fontSize: 18, color: '#0F172A', margin: 0 }}>{title}</h2>
        </div>
        <p className="mb-6" style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 500, fontSize: 14, color: '#475569' }}>{message}</p>
        <div className="flex justify-end gap-3">
          <button className="btn-secondary" onClick={onCancel} disabled={loading}>{cancelLabel}</button>
          <button
            onClick={onConfirm}
            disabled={loading}
            style={{
              background: danger ? 'linear-gradient(135deg, #EF4444, #F87171)' : 'linear-gradient(135deg, #0284C7, #0EA5E9)',
              color: '#fff', padding: '11px 20px', borderRadius: 10,
              fontFamily: 'Plus Jakarta Sans', fontWeight: 600, fontSize: 14,
              border: 'none', cursor: 'pointer', opacity: loading ? 0.5 : 1,
              boxShadow: danger ? '0 2px 8px rgba(239,68,68,0.25)' : '0 2px 8px rgba(2,132,199,0.3)',
            }}
          >
            {loading ? 'Processing...' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
