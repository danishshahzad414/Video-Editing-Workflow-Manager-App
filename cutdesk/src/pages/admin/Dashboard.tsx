import Layout from '../../components/layout/Layout'
import { DEMO_MODE, DEMO_PROFILES } from '../../lib/mockData'
import { Shield, Users, Key, Settings, Activity, CheckCircle, AlertTriangle, Database, Globe, Lock } from 'lucide-react'

const ALL_USERS = Object.values(DEMO_PROFILES)

const ROLE_META: Record<string, { label: string; color: string; bg: string }> = {
  super_admin:    { label: 'Super Admin',     color: '#7C3AED', bg: '#F3E8FF' },
  ceo:            { label: 'CEO',             color: '#B45309', bg: '#FEF3C7' },
  editor:         { label: 'Video Editor',    color: '#0369A1', bg: '#E0F2FE' },
  social_manager: { label: 'Social Manager',  color: '#6D28D9', bg: '#EDE9FE' },
  counselor:      { label: 'Counselor',       color: '#065F46', bg: '#D1FAE5' },
}

const SYSTEM_STATUS = [
  { label: 'Authentication',    status: 'operational', icon: Lock },
  { label: 'Database',          status: DEMO_MODE ? 'demo' : 'operational', icon: Database },
  { label: 'File Storage',      status: DEMO_MODE ? 'demo' : 'operational', icon: Globe },
  { label: 'Notifications',     status: 'operational', icon: Activity },
]

const QUICK_ACTIONS = [
  { label: 'Manage Users',    desc: 'Add, edit or disable accounts', href: '/admin/users',    icon: Users,    color: '#0284C7', bg: '#EFF6FF' },
  { label: 'Reset Passwords', desc: 'Send password reset links',     href: '/admin/users',    icon: Key,      color: '#7C3AED', bg: '#F3E8FF' },
  { label: 'Portal Settings', desc: 'Configure system preferences',  href: '/admin/settings', icon: Settings, color: '#059669', bg: '#ECFDF5' },
  { label: 'Audit Log',       desc: 'View all account-level events', href: '/admin/audit',    icon: Activity, color: '#B45309', bg: '#FEF3C7' },
]

export default function AdminDashboard() {
  const usersByRole = ALL_USERS.reduce((acc, u) => {
    acc[u.role] = (acc[u.role] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  return (
    <Layout title="Admin Console">
      <div className="fade-in space-y-6 max-w-5xl mx-auto">

        {/* Hero banner */}
        <div className="relative rounded-2xl overflow-hidden p-6 md:p-8" style={{ background: 'linear-gradient(135deg, #2E1065 0%, #4C1D95 50%, #6D28D9 100%)' }}>
          {/* Decorative orbs */}
          <div className="absolute -top-12 -right-12 w-48 h-48 rounded-full opacity-20" style={{ background: 'radial-gradient(circle, #A78BFA, transparent)' }} />
          <div className="absolute -bottom-8 -left-8 w-40 h-40 rounded-full opacity-15" style={{ background: 'radial-gradient(circle, #7C3AED, transparent)' }} />
          <div className="absolute top-0 left-0 right-0 bottom-0 opacity-5" style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '24px 24px' }} />

          <div className="relative flex flex-col sm:flex-row items-start sm:items-center gap-5">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.25)' }}>
              <Shield size={26} className="text-white" />
            </div>
            <div className="flex-1">
              <h1 style={{ fontFamily: 'Montserrat', fontWeight: 900, fontSize: 22, color: '#fff', margin: 0 }}>Super Admin Console</h1>
              <p style={{ fontFamily: 'Poppins', fontWeight: 400, fontSize: 13, color: 'rgba(255,255,255,0.65)', marginTop: 4 }}>
                Portal management — user accounts, roles, settings and system control
              </p>
            </div>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl flex-shrink-0" style={{ background: DEMO_MODE ? 'rgba(251,191,36,0.2)' : 'rgba(16,185,129,0.2)', border: `1px solid ${DEMO_MODE ? 'rgba(251,191,36,0.4)' : 'rgba(16,185,129,0.4)'}` }}>
              <div className="w-1.5 h-1.5 rounded-full pulse-dot" style={{ background: DEMO_MODE ? '#FBBF24' : '#10B981' }} />
              <span style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: 11, color: DEMO_MODE ? '#FDE68A' : '#6EE7B7' }}>
                {DEMO_MODE ? 'Demo Mode' : 'Live System'}
              </span>
            </div>
          </div>

          {/* Summary chips */}
          <div className="relative flex gap-3 mt-6 flex-wrap">
            {[
              { label: `${ALL_USERS.length} Accounts`, icon: '👤' },
              { label: `${Object.keys(usersByRole).length} Roles`, icon: '🔑' },
              { label: 'v1.0.0 Portal', icon: '⚡' },
            ].map(chip => (
              <div key={chip.label} className="flex items-center gap-2 px-3 py-1.5 rounded-lg" style={{ background: 'rgba(255,255,255,0.1)', backdropFilter: 'blur(8px)' }}>
                <span style={{ fontSize: 12 }}>{chip.icon}</span>
                <span style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: 11, color: 'rgba(255,255,255,0.85)' }}>{chip.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div>
          <h2 style={{ fontFamily: 'Montserrat', fontWeight: 800, fontSize: 15, color: '#0F172A', marginBottom: 14 }}>Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 stagger-children">
            {QUICK_ACTIONS.map(a => (
              <a key={a.label} href={a.href}
                className="cd-card p-4 flex flex-col gap-3 no-underline group"
                style={{ cursor: 'pointer', textDecoration: 'none' }}
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-110" style={{ background: a.bg }}>
                  <a.icon size={18} style={{ color: a.color }} />
                </div>
                <div>
                  <p style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: 13, color: '#0F172A', margin: 0 }}>{a.label}</p>
                  <p style={{ fontFamily: 'Poppins', fontWeight: 400, fontSize: 11, color: '#94A3B8', margin: '2px 0 0' }}>{a.desc}</p>
                </div>
                <div className="mt-auto flex items-center gap-1 transition-all duration-200 group-hover:gap-2" style={{ color: a.color }}>
                  <span style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: 11 }}>Open</span>
                  <span style={{ fontSize: 12 }}>→</span>
                </div>
              </a>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

          {/* Accounts by Role */}
          <div className="cd-card p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 style={{ fontFamily: 'Montserrat', fontWeight: 800, fontSize: 15, color: '#0F172A' }}>Accounts by Role</h2>
              <span style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: 11, color: '#94A3B8' }}>{ALL_USERS.length} total</span>
            </div>
            <div className="space-y-3">
              {Object.entries(usersByRole).map(([role, count]) => {
                const meta = ROLE_META[role] || { label: role, color: '#64748B', bg: '#F1F5F9' }
                const pct = Math.round((count / ALL_USERS.length) * 100)
                return (
                  <div key={role} className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-lg text-xs font-semibold" style={{ background: meta.bg, color: meta.color, fontFamily: 'Poppins' }}>{meta.label}</span>
                      <span style={{ fontFamily: 'Montserrat', fontWeight: 700, fontSize: 13, color: '#0F172A' }}>{count} user{count > 1 ? 's' : ''}</span>
                    </div>
                    <div className="h-1.5 rounded-full overflow-hidden" style={{ background: '#F1F5F9' }}>
                      <div className="h-full rounded-full" style={{ width: `${pct}%`, background: meta.color, transition: 'width 800ms var(--butter)' }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* System Status */}
          <div className="cd-card p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 style={{ fontFamily: 'Montserrat', fontWeight: 800, fontSize: 15, color: '#0F172A' }}>System Status</h2>
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg" style={{ background: DEMO_MODE ? '#FEF3C7' : '#DCFCE7', border: `1px solid ${DEMO_MODE ? '#FDE68A' : '#BBF7D0'}` }}>
                {DEMO_MODE
                  ? <AlertTriangle size={11} style={{ color: '#B45309' }} />
                  : <CheckCircle size={11} style={{ color: '#15803D' }} />
                }
                <span style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: 10, color: DEMO_MODE ? '#B45309' : '#15803D' }}>
                  {DEMO_MODE ? 'Demo' : 'All Systems Operational'}
                </span>
              </span>
            </div>
            <div className="space-y-2">
              {SYSTEM_STATUS.map(s => (
                <div key={s.label} className="flex items-center justify-between p-3 rounded-xl" style={{ background: '#F8FAFC', border: '1px solid #F1F5F9' }}>
                  <div className="flex items-center gap-2.5">
                    <s.icon size={14} className="text-slate-400" />
                    <span style={{ fontFamily: 'Poppins', fontWeight: 500, fontSize: 13, color: '#475569' }}>{s.label}</span>
                  </div>
                  <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-md" style={{ background: s.status === 'demo' ? '#FEF3C7' : '#DCFCE7' }}>
                    <div className="w-1.5 h-1.5 rounded-full pulse-dot" style={{ background: s.status === 'demo' ? '#F59E0B' : '#22C55E' }} />
                    <span style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: 10, color: s.status === 'demo' ? '#B45309' : '#15803D', textTransform: 'capitalize' }}>
                      {s.status === 'demo' ? 'Demo' : 'Online'}
                    </span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
