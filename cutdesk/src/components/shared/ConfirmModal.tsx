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
        className="rounded-xl p-8 w-full max-w-md"
        style={{ background: '#003D52', border: '1px solid rgba(0,162,207,0.15)' }}
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-full flex items-center justify-center" style={{ background: danger ? 'rgba(239,68,68,0.15)' : 'rgba(0,162,207,0.15)' }}>
            <AlertTriangle size={20} style={{ color: danger ? '#EF4444' : '#00A2CF' }} />
          </div>
          <h2 className="text-white text-lg" style={{ fontFamily: 'Montserrat', fontWeight: 800 }}>{title}</h2>
        </div>
        <p className="text-white/70 mb-6" style={{ fontFamily: 'Poppins', fontWeight: 500, fontSize: 14 }}>{message}</p>
        <div className="flex justify-end gap-3">
          <button className="btn-secondary" onClick={onCancel} disabled={loading}>{cancelLabel}</button>
          <button
            onClick={onConfirm}
            disabled={loading}
            style={{
              background: danger ? '#EF4444' : '#00A2CF',
              color: '#fff', padding: '12px 20px', borderRadius: 8,
              fontFamily: 'Montserrat', fontWeight: 700, fontSize: 14,
              border: 'none', cursor: 'pointer', opacity: loading ? 0.5 : 1,
            }}
          >
            {loading ? 'Processing...' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
