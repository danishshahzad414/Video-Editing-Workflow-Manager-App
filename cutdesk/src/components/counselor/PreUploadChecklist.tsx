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
  const allChecked = checked.every(Boolean)

  function toggle(i: number) {
    setChecked(prev => prev.map((v, idx) => idx === i ? !v : v))
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="rounded-xl overflow-hidden w-full max-w-lg" style={{ background: '#003D52', border: '1px solid rgba(0,162,207,0.15)' }} onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4" style={{ background: '#006386' }}>
          <h2 className="text-white text-lg" style={{ fontFamily: 'Montserrat', fontWeight: 800 }}>Before You Upload</h2>
          <button onClick={onClose} className="text-white/60 hover:text-white"><X size={18} /></button>
        </div>
        <div className="p-6">
          <p className="text-white/60 text-sm mb-5" style={{ fontFamily: 'Poppins', fontWeight: 500 }}>
            Please confirm all items below before uploading your video. This helps reduce revision rounds.
          </p>
          <div className="space-y-3">
            {CHECKLIST_ITEMS.map((item, i) => (
              <button
                key={i}
                onClick={() => toggle(i)}
                className="w-full flex items-center gap-3 p-3 rounded-lg text-left transition-colors"
                style={{ background: checked[i] ? 'rgba(0,162,207,0.1)' : 'rgba(255,255,255,0.03)', border: `1px solid ${checked[i] ? 'rgba(0,162,207,0.3)' : 'rgba(255,255,255,0.06)'}` }}
              >
                {checked[i]
                  ? <CheckSquare size={20} className="text-[#00A2CF] flex-shrink-0" />
                  : <Square size={20} className="text-white/30 flex-shrink-0" />
                }
                <span style={{ fontFamily: 'Poppins', fontWeight: 500, fontSize: 14, color: checked[i] ? '#fff' : 'rgba(255,255,255,0.6)' }}>
                  {item}
                </span>
              </button>
            ))}
          </div>
        </div>
        <div className="flex justify-end gap-3 px-6 pb-6">
          <button className="btn-secondary" onClick={onClose}>Cancel</button>
          <button
            className="btn-primary"
            onClick={onProceed}
            disabled={!allChecked}
            title={!allChecked ? 'Check all items to proceed' : undefined}
          >
            <Upload size={16} /> Proceed to Upload
          </button>
        </div>
      </div>
    </div>
  )
}
