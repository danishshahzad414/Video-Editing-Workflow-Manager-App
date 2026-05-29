import { useState } from 'react'
import { X, CheckSquare, Square, Upload } from 'lucide-react'

const CHECKLIST_ITEMS = [
  'Good lighting — my face is clearly visible',
  'Clear audio — no background noise or echo',
  'Stable camera — not shaky or moving',
  'I am looking at the camera throughout',
  'File is under 500MB',
]

interface Props {
  onProceed: () => void
  onClose: () => void
}

export default function PreUploadChecklist({ onProceed, onClose }: Props) {
  const [checked, setChecked] = useState<boolean[]>(new Array(CHECKLIST_ITEMS.length).fill(false))

  function toggle(i: number) {
    setChecked(prev => prev.map((v, idx) => idx === i ? !v : v))
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="scale-in rounded-2xl overflow-hidden w-full"
        style={{ maxWidth: 480, background: '#FFFFFF', border: '1px solid rgba(0,0,0,0.07)', boxShadow: '0 24px 64px rgba(0,0,0,0.14)' }}
        onClick={e => e.stopPropagation()}>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4" style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg,#0284C7,#06B6D4)' }}>
              <CheckSquare size={16} className="text-white" />
            </div>
            <div>
              <h2 style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 800, fontSize: 16, color: '#111827', margin: 0 }}>Before You Upload</h2>
              <p style={{ fontFamily: 'Plus Jakarta Sans', fontSize: 11, color: '#94A3B8', margin: 0 }}>Quick quality checklist</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-slate-100 transition-colors" style={{ color: '#94A3B8', border: '1px solid rgba(0,0,0,0.08)' }}>
            <X size={15} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          <p style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 400, fontSize: 13, color: '#64748B', margin: '0 0 16px' }}>
            Tick any items that apply — then proceed whenever you're ready.
          </p>
          <div className="space-y-2.5">
            {CHECKLIST_ITEMS.map((item, i) => (
              <button
                key={i}
                onClick={() => toggle(i)}
                className="w-full flex items-center gap-3 p-3 rounded-xl text-left transition-all duration-150"
                style={{
                  background: checked[i] ? '#EFF6FF' : '#F8FAFC',
                  border: `1.5px solid ${checked[i] ? '#BAE6FD' : 'rgba(0,0,0,0.07)'}`,
                }}
              >
                {checked[i]
                  ? <CheckSquare size={18} style={{ color: '#0284C7', flexShrink: 0 }} />
                  : <Square size={18} style={{ color: '#CBD5E1', flexShrink: 0 }} />
                }
                <span style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 500, fontSize: 13, color: checked[i] ? '#0369A1' : '#475569' }}>
                  {item}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Footer — button always enabled */}
        <div className="flex justify-end gap-3 px-6 pb-6">
          <button className="btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn-primary" onClick={onProceed}>
            <Upload size={14} /> Proceed to Upload
          </button>
        </div>
      </div>
    </div>
  )
}
