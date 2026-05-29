import { useState, useEffect } from 'react'
import { X, Settings } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../lib/supabase'
import toast from 'react-hot-toast'

interface Props {
  onClose: () => void
}

export default function SettingsModal({ onClose }: Props) {
  const { profile } = useAuth()
  const [prefs, setPrefs] = useState({
    email_address: '',
    whatsapp_number: '',
    email_status_change: true,
    email_editor_comment: true,
    email_published: true,
    whatsapp_revision: false,
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (!profile) return
    supabase.from('user_notification_preferences').select('*').eq('user_id', profile.id).single()
      .then(({ data }) => {
        if (data) {
          setPrefs({
            email_address: data.email_address || '',
            whatsapp_number: data.whatsapp_number || '',
            email_status_change: data.email_notifications?.status_change ?? true,
            email_editor_comment: data.email_notifications?.editor_comment ?? true,
            email_published: data.email_notifications?.published ?? true,
            whatsapp_revision: data.whatsapp_notifications?.revision_requested ?? false,
          })
        }
      })
  }, [profile?.id])

  async function handleSave() {
    if (!profile) return
    setLoading(true)
    const { error } = await supabase.from('user_notification_preferences').upsert({
      user_id: profile.id,
      email_address: prefs.email_address,
      whatsapp_number: prefs.whatsapp_number,
      email_notifications: {
        status_change: prefs.email_status_change,
        editor_comment: prefs.email_editor_comment,
        published: prefs.email_published,
      },
      whatsapp_notifications: { revision_requested: prefs.whatsapp_revision },
      updated_at: new Date().toISOString(),
    }, { onConflict: 'user_id' })
    setLoading(false)
    if (error) { toast.error('Failed to save preferences'); return }
    toast.success('Preferences saved!')
    onClose()
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="rounded-2xl overflow-hidden w-full max-w-md scale-in" style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', boxShadow: '0 20px 60px rgba(0,0,0,0.12)' }} onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4" style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
          <div className="flex items-center gap-2">
            <Settings size={18} className="text-slate-600" />
            <h2 style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 800, fontSize: 16, color: '#0F172A', margin: 0 }}>Notification Preferences</h2>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors"><X size={18} /></button>
        </div>
        <div className="p-6 space-y-5">
          <div>
            <label className="section-label mb-2 block">Contact Info</label>
            <input className="cd-input mb-3" placeholder="Email address" value={prefs.email_address} onChange={e => setPrefs(p => ({ ...p, email_address: e.target.value }))} />
            <input className="cd-input" placeholder="WhatsApp number (with country code)" value={prefs.whatsapp_number} onChange={e => setPrefs(p => ({ ...p, whatsapp_number: e.target.value }))} />
          </div>
          <div>
            <label className="section-label mb-3 block">Email Notifications</label>
            {[
              { key: 'email_status_change', label: 'Status changes' },
              { key: 'email_editor_comment', label: 'Editor comments' },
              { key: 'email_published', label: 'Video published' },
            ].map(({ key, label }) => (
              <label key={key} className="flex items-center gap-3 mb-3 cursor-pointer">
                <div
                  className="w-10 h-6 rounded-full relative transition-colors"
                  style={{ background: (prefs as any)[key] ? '#0284C7' : '#E2E8F0', cursor: 'pointer' }}
                  onClick={() => setPrefs(p => ({ ...p, [key]: !(p as any)[key] }))}
                >
                  <div className="w-4 h-4 bg-white rounded-full absolute top-1 transition-all shadow-sm" style={{ left: (prefs as any)[key] ? 22 : 4 }} />
                </div>
                <span style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 500, fontSize: 13, color: '#475569' }}>{label}</span>
              </label>
            ))}
          </div>
          <div>
            <label className="section-label mb-3 block">WhatsApp Notifications</label>
            <label className="flex items-center gap-3 cursor-pointer">
              <div
                className="w-10 h-6 rounded-full relative transition-colors"
                style={{ background: prefs.whatsapp_revision ? '#0284C7' : '#E2E8F0', cursor: 'pointer' }}
                onClick={() => setPrefs(p => ({ ...p, whatsapp_revision: !p.whatsapp_revision }))}
              >
                <div className="w-4 h-4 bg-white rounded-full absolute top-1 transition-all shadow-sm" style={{ left: prefs.whatsapp_revision ? 22 : 4 }} />
              </div>
              <span style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 500, fontSize: 13, color: '#475569' }}>Revision requested</span>
            </label>
          </div>
        </div>
        <div className="flex justify-end gap-3 px-6 pb-6">
          <button className="btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn-primary" onClick={handleSave} disabled={loading}>{loading ? 'Saving...' : 'Save Preferences'}</button>
        </div>
      </div>
    </div>
  )
}
