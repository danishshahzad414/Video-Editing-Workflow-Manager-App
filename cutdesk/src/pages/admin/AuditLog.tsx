import Layout from '../../components/layout/Layout'
import { ScrollText, UserCheck, Key, UserPlus, UserX, LogIn, LogOut, Settings } from 'lucide-react'

type AuditEvent = {
  id: string; type: 'login' | 'logout' | 'role_change' | 'password_reset' | 'account_created' | 'account_disabled' | 'settings_change'
  actor: string; target?: string; detail: string; timestamp: string
}

const TYPE_META: Record<AuditEvent['type'], { label: string; icon: any; color: string; bg: string }> = {
  login:            { label: 'Login',           icon: LogIn,      color: '#059669', bg: '#ECFDF5' },
  logout:           { label: 'Logout',          icon: LogOut,     color: '#64748B', bg: '#F1F5F9' },
  role_change:      { label: 'Role Changed',    icon: UserCheck,  color: '#0284C7', bg: '#EFF6FF' },
  password_reset:   { label: 'Password Reset',  icon: Key,        color: '#7C3AED', bg: '#F3E8FF' },
  account_created:  { label: 'Account Created', icon: UserPlus,   color: '#10B981', bg: '#D1FAE5' },
  account_disabled: { label: 'Account Disabled',icon: UserX,      color: '#EF4444', bg: '#FEE2E2' },
  settings_change:  { label: 'Settings Changed',icon: Settings,   color: '#B45309', bg: '#FEF3C7' },
}

const MOCK_AUDIT: AuditEvent[] = [
  { id: 'a1',  type: 'login',            actor: 'Super Admin',  detail: 'Logged in from Chrome / Windows',                    timestamp: new Date(Date.now() - 1000*60*5).toISOString() },
  { id: 'a2',  type: 'account_created',  actor: 'Super Admin',  target: 'James Wilson',  detail: 'Created editor account',    timestamp: new Date(Date.now() - 1000*60*20).toISOString() },
  { id: 'a3',  type: 'role_change',      actor: 'Super Admin',  target: 'Mia Torres',    detail: 'Role changed: counselor → social_manager', timestamp: new Date(Date.now() - 1000*60*60).toISOString() },
  { id: 'a4',  type: 'password_reset',   actor: 'Super Admin',  target: 'Sarah Chen',    detail: 'Password reset issued',     timestamp: new Date(Date.now() - 1000*60*90).toISOString() },
  { id: 'a5',  type: 'login',            actor: 'Michael Park', detail: 'Logged in from Safari / macOS',                      timestamp: new Date(Date.now() - 1000*60*120).toISOString() },
  { id: 'a6',  type: 'settings_change',  actor: 'Super Admin',  detail: 'Updated session timeout: 4h → 8h',                  timestamp: new Date(Date.now() - 1000*60*180).toISOString() },
  { id: 'a7',  type: 'account_disabled', actor: 'Super Admin',  target: 'David Kim',     detail: 'Account temporarily disabled', timestamp: new Date(Date.now() - 1000*60*60*3).toISOString() },
  { id: 'a8',  type: 'login',            actor: 'Mia Torres',   detail: 'Logged in from Chrome / Windows',                   timestamp: new Date(Date.now() - 1000*60*60*4).toISOString() },
  { id: 'a9',  type: 'password_reset',   actor: 'Super Admin',  target: 'Emma Roberts',  detail: 'Password reset issued',    timestamp: new Date(Date.now() - 1000*60*60*5).toISOString() },
  { id: 'a10', type: 'account_created',  actor: 'Super Admin',  target: 'Alex Johnson',  detail: 'Created counselor account', timestamp: new Date(Date.now() - 1000*60*60*24).toISOString() },
  { id: 'a11', type: 'logout',           actor: 'Michael Park', detail: 'Session ended',                                      timestamp: new Date(Date.now() - 1000*60*60*25).toISOString() },
  { id: 'a12', type: 'role_change',      actor: 'Super Admin',  target: 'Rachel Lee',    detail: 'Role changed: editor → counselor', timestamp: new Date(Date.now() - 1000*60*60*48).toISOString() },
]

function relativeTime(iso: string) {
  const diff = Date.now() - new Date(iso).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1)  return 'just now'
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}

export default function AdminAuditLog() {
  return (
    <Layout title="Audit Log">
      <div className="fade-in max-w-4xl mx-auto space-y-5">

        {/* Header */}
        <div>
          <h1 style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 900, fontSize: 20, color: '#0F172A' }}>Audit Log</h1>
          <p style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 400, fontSize: 13, color: '#94A3B8', marginTop: 2 }}>
            All account-level events — logins, role changes, password resets, and more
          </p>
        </div>

        {/* Summary chips */}
        <div className="flex gap-2 flex-wrap">
          {Object.entries(TYPE_META).map(([type, meta]) => {
            const count = MOCK_AUDIT.filter(a => a.type === type).length
            if (!count) return null
            return (
              <div key={type} className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl" style={{ background: meta.bg, border: `1px solid ${meta.color}22` }}>
                <meta.icon size={11} style={{ color: meta.color }} />
                <span style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 600, fontSize: 11, color: meta.color }}>{meta.label}: {count}</span>
              </div>
            )
          })}
        </div>

        {/* Timeline */}
        <div className="cd-card overflow-hidden">
          <div className="px-5 py-3 flex items-center gap-2" style={{ borderBottom: '1px solid #F1F5F9', background: '#FAFAFA' }}>
            <ScrollText size={14} className="text-slate-400" />
            <span style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 600, fontSize: 12, color: '#64748B' }}>{MOCK_AUDIT.length} events</span>
          </div>

          <div className="divide-y" style={{ borderColor: '#F8FAFC' }}>
            {MOCK_AUDIT.map((event, i) => {
              const meta = TYPE_META[event.type]
              return (
                <div key={event.id} className="flex items-start gap-4 px-5 py-4 fade-in hover:bg-slate-50 transition-colors duration-200" style={{ animationDelay: `${i * 30}ms` }}>
                  {/* Icon */}
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: meta.bg }}>
                    <meta.icon size={13} style={{ color: meta.color }} />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold" style={{ background: meta.bg, color: meta.color, fontFamily: 'Plus Jakarta Sans' }}>
                        {meta.label}
                      </span>
                      <span style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 600, fontSize: 12, color: '#0F172A' }}>
                        {event.actor}
                        {event.target && <span style={{ color: '#94A3B8', fontWeight: 400 }}> → {event.target}</span>}
                      </span>
                    </div>
                    <p style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 400, fontSize: 12, color: '#64748B', margin: '2px 0 0' }}>{event.detail}</p>
                  </div>

                  {/* Time */}
                  <div className="text-right flex-shrink-0">
                    <p style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 600, fontSize: 11, color: '#94A3B8', margin: 0 }}>{relativeTime(event.timestamp)}</p>
                    <p style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 400, fontSize: 10, color: '#CBD5E1', margin: '1px 0 0' }}>
                      {new Date(event.timestamp).toLocaleTimeString('en-AU', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </Layout>
  )
}
