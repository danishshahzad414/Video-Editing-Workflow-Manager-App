import { useState } from 'react'
import Layout from '../../components/layout/Layout'
import { DEMO_MODE } from '../../lib/mockData'
import { Settings, Globe, Bell, Shield, Palette, Database, CheckCircle } from 'lucide-react'
import toast from 'react-hot-toast'

export default function AdminSettings() {
  const [portalName, setPortalName] = useState('CutDesk')
  const [orgName, setOrgName] = useState('The Migration')
  const [timezone, setTimezone] = useState('Australia/Melbourne')
  const [notifEmail, setNotifEmail] = useState(true)
  const [notifInApp, setNotifInApp] = useState(true)
  const [sessionTimeout, setSessionTimeout] = useState('8h')
  const [saved, setSaved] = useState(false)

  function handleSave() {
    setSaved(true)
    toast.success('Settings saved!')
    setTimeout(() => setSaved(false), 2500)
  }

  return (
    <Layout title="Portal Settings">
      <div className="fade-in max-w-3xl mx-auto space-y-5">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 style={{ fontFamily: 'Montserrat', fontWeight: 900, fontSize: 20, color: '#0F172A' }}>Portal Settings</h1>
            <p style={{ fontFamily: 'Poppins', fontWeight: 400, fontSize: 13, color: '#94A3B8', marginTop: 2 }}>
              Configure system-wide preferences and behaviour
            </p>
          </div>
          <button
            className="btn-primary"
            onClick={handleSave}
            style={{ background: saved ? 'linear-gradient(135deg, #059669, #10B981)' : undefined }}
          >
            {saved ? <><CheckCircle size={14} /> Saved!</> : <><Settings size={14} /> Save Settings</>}
          </button>
        </div>

        {DEMO_MODE && (
          <div className="flex items-start gap-3 p-4 rounded-xl" style={{ background: '#FEF3C7', border: '1px solid #FDE68A' }}>
            <span style={{ fontSize: 14 }}>⚡</span>
            <p style={{ fontFamily: 'Poppins', fontWeight: 500, fontSize: 12, color: '#92400E', margin: 0 }}>
              <strong>Demo Mode:</strong> Settings are shown for preview only and won't persist between sessions. Connect Supabase to enable real configuration storage.
            </p>
          </div>
        )}

        {/* Portal Identity */}
        <div className="cd-card p-5 space-y-4">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: '#EFF6FF' }}>
              <Globe size={15} style={{ color: '#0284C7' }} />
            </div>
            <h2 style={{ fontFamily: 'Montserrat', fontWeight: 800, fontSize: 14, color: '#0F172A' }}>Portal Identity</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="section-label mb-2 block">Portal Name</label>
              <input className="cd-input" value={portalName} onChange={e => setPortalName(e.target.value)} />
            </div>
            <div>
              <label className="section-label mb-2 block">Organisation Name</label>
              <input className="cd-input" value={orgName} onChange={e => setOrgName(e.target.value)} />
            </div>
            <div>
              <label className="section-label mb-2 block">Default Timezone</label>
              <select className="cd-select" value={timezone} onChange={e => setTimezone(e.target.value)}>
                <option value="Australia/Melbourne">Australia/Melbourne (AEST)</option>
                <option value="Australia/Sydney">Australia/Sydney (AEST)</option>
                <option value="UTC">UTC</option>
                <option value="America/New_York">America/New York (EST)</option>
                <option value="Europe/London">Europe/London (GMT)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Notifications */}
        <div className="cd-card p-5 space-y-4">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: '#F3E8FF' }}>
              <Bell size={15} style={{ color: '#7C3AED' }} />
            </div>
            <h2 style={{ fontFamily: 'Montserrat', fontWeight: 800, fontSize: 14, color: '#0F172A' }}>Notifications</h2>
          </div>
          {[
            { label: 'In-App Notifications', desc: 'Show notification bell alerts inside the portal', value: notifInApp, set: setNotifInApp },
            { label: 'Email Notifications',  desc: 'Send email alerts for status changes and assignments', value: notifEmail, set: setNotifEmail },
          ].map(item => (
            <div key={item.label} className="flex items-center justify-between p-3 rounded-xl" style={{ background: '#F8FAFC', border: '1px solid #F1F5F9' }}>
              <div>
                <p style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: 13, color: '#0F172A', margin: 0 }}>{item.label}</p>
                <p style={{ fontFamily: 'Poppins', fontWeight: 400, fontSize: 11, color: '#94A3B8', margin: 0 }}>{item.desc}</p>
              </div>
              <button
                className="w-11 h-6 rounded-full relative flex-shrink-0 transition-all duration-300"
                style={{ background: item.value ? '#7C3AED' : '#E2E8F0' }}
                onClick={() => item.set(!item.value)}
              >
                <div className="w-4 h-4 bg-white rounded-full absolute top-1 transition-all duration-300 shadow-sm"
                  style={{ left: item.value ? 26 : 4 }} />
              </button>
            </div>
          ))}
        </div>

        {/* Security */}
        <div className="cd-card p-5 space-y-4">
          <div className="flex items-center gap-3 mb-1">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: '#FEE2E2' }}>
              <Shield size={15} style={{ color: '#EF4444' }} />
            </div>
            <h2 style={{ fontFamily: 'Montserrat', fontWeight: 800, fontSize: 14, color: '#0F172A' }}>Security</h2>
          </div>
          <div>
            <label className="section-label mb-2 block">Session Timeout</label>
            <select className="cd-select" value={sessionTimeout} onChange={e => setSessionTimeout(e.target.value)} style={{ maxWidth: 240 }}>
              <option value="1h">1 hour</option>
              <option value="4h">4 hours</option>
              <option value="8h">8 hours (recommended)</option>
              <option value="24h">24 hours</option>
              <option value="never">Never (not recommended)</option>
            </select>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <button className="btn-secondary" onClick={() => toast.success('Password policy updated! (Demo)')}>
              <Shield size={14} /> Update Password Policy
            </button>
            <button className="btn-secondary" onClick={() => toast.success('All sessions cleared! (Demo)')}>
              <Shield size={14} /> Clear All Sessions
            </button>
          </div>
        </div>

        {/* System Info */}
        <div className="cd-card p-5">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: '#ECFDF5' }}>
              <Database size={15} style={{ color: '#059669' }} />
            </div>
            <h2 style={{ fontFamily: 'Montserrat', fontWeight: 800, fontSize: 14, color: '#0F172A' }}>System Information</h2>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {[
              { label: 'Portal Version', value: '1.0.0' },
              { label: 'Mode',           value: DEMO_MODE ? '⚡ Demo' : '🟢 Live' },
              { label: 'Database',       value: DEMO_MODE ? 'Mock Data' : 'Supabase' },
              { label: 'File Storage',   value: DEMO_MODE ? 'Simulated' : 'Google Drive' },
              { label: 'Auth Provider',  value: DEMO_MODE ? 'Local Demo' : 'Supabase Auth' },
              { label: 'Frontend',       value: 'React + Vite' },
            ].map(item => (
              <div key={item.label} className="p-3 rounded-xl" style={{ background: '#F8FAFC', border: '1px solid #F1F5F9' }}>
                <p style={{ fontFamily: 'Poppins', fontWeight: 400, fontSize: 10, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>{item.label}</p>
                <p style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: 13, color: '#0F172A', margin: '2px 0 0' }}>{item.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Branding placeholder */}
        <div className="cd-card p-5">
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: '#FEF3C7' }}>
              <Palette size={15} style={{ color: '#B45309' }} />
            </div>
            <h2 style={{ fontFamily: 'Montserrat', fontWeight: 800, fontSize: 14, color: '#0F172A' }}>Branding</h2>
          </div>
          <div className="p-4 rounded-xl text-center" style={{ background: '#FFFBEB', border: '1.5px dashed #FDE68A' }}>
            <p style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: 13, color: '#B45309', margin: 0 }}>Logo & Colour Customisation</p>
            <p style={{ fontFamily: 'Poppins', fontWeight: 400, fontSize: 11, color: '#D97706', margin: '4px 0 0' }}>Coming in v1.1 — custom logo upload, accent colours and sidebar themes</p>
          </div>
        </div>
      </div>
    </Layout>
  )
}
