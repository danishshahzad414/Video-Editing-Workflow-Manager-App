import { useEffect, useState } from 'react'
import Layout from '../../components/layout/Layout'
import { DEMO_MODE, DEMO_PROFILES } from '../../lib/mockData'
import { Shield, Users, Key, Settings, Activity, CheckCircle, AlertTriangle, Database, Globe, Lock, ArrowRight } from 'lucide-react'

const ALL_USERS = Object.values(DEMO_PROFILES)

const ROLE_META: Record<string, { label: string; color: string; bg: string }> = {
  super_admin:    { label: 'Super Admin',    color: '#7C3AED', bg: '#F3E8FF' },
  ceo:            { label: 'CEO',            color: '#B45309', bg: '#FEF3C7' },
  editor:         { label: 'Video Editor',   color: '#0369A1', bg: '#E0F2FE' },
  social_manager: { label: 'Social Manager', color: '#6D28D9', bg: '#EDE9FE' },
  counselor:      { label: 'Counselor',      color: '#065F46', bg: '#D1FAE5' },
}

const SYSTEM_STATUS = [
  { label: 'Authentication', status: 'operational', icon: Lock },
  { label: 'Database',       status: DEMO_MODE ? 'demo' : 'operational', icon: Database },
  { label: 'File Storage',   status: DEMO_MODE ? 'demo' : 'operational', icon: Globe },
  { label: 'Notifications',  status: 'operational', icon: Activity },
]

const QUICK_ACTIONS = [
  { label: 'Manage Users',    desc: 'Add, edit or disable accounts', href: '/admin/users',    icon: Users,    color: '#0284C7', bg: '#EFF6FF' },
  { label: 'Reset Passwords', desc: 'Send password reset links',     href: '/admin/users',    icon: Key,      color: '#7C3AED', bg: '#F3E8FF' },
  { label: 'Portal Settings', desc: 'Configure system preferences',  href: '/admin/settings', icon: Settings, color: '#059669', bg: '#ECFDF5' },
  { label: 'Audit Log',       desc: 'View all account-level events', href: '/admin/audit',    icon: Activity, color: '#B45309', bg: '#FEF3C7' },
]

function Num({ n }: { n: number }) {
  const [v, setV] = useState(0)
  useEffect(() => {
    if (!n) { setV(0); return }
    const dur = 650, start = Date.now()
    const tick = setInterval(() => {
      const p = Math.min((Date.now() - start) / dur, 1)
      setV(Math.round((1 - Math.pow(1 - p, 3)) * n))
      if (p >= 1) clearInterval(tick)
    }, 16)
    return () => clearInterval(tick)
  }, [n])
  return <>{v}</>
}

export default function AdminDashboard() {
  const usersByRole = ALL_USERS.reduce((acc, u) => {
    acc[u.role] = (acc[u.role] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const totalRoles   = Object.keys(usersByRole).length
  const systemOnline = SYSTEM_STATUS.filter(s => s.status === 'operational').length

  return (
    <Layout title="Admin Console">
      <div className="fade-in space-y-5 max-w-5xl mx-auto">

        {/* ── Page header ── */}
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 style={{ fontFamily: 'Montserrat', fontWeight: 900, fontSize: 22, color: '#111827', margin: 0 }}>
              Super Admin Console
            </h1>
            <p style={{ fontFamily: 'Poppins', fontWeight: 400, fontSize: 13, color: '#94A3B8', margin: '3px 0 0' }}>
              {ALL_USERS.length} accounts · {totalRoles} roles · portal management
            </p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl flex-shrink-0"
            style={{ background: DEMO_MODE ? '#FFFBEB' : '#ECFDF5', border: `1px solid ${DEMO_MODE ? '#FDE68A' : '#BBF7D0'}` }}>
            <div className="w-1.5 h-1.5 rounded-full pulse-dot" style={{ background: DEMO_MODE ? '#F59E0B' : '#10B981' }} />
            <span style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: 12, color: DEMO_MODE ? '#B45309' : '#059669' }}>
              {DEMO_MODE ? 'Demo Mode' : 'Live System'}
            </span>
          </div>
        </div>

        {/* ── Stats strip ── */}
        <div className="stats-strip stagger-children" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
          {[
            { label: 'Total Accounts',   render: () => <Num n={ALL_USERS.length} /> },
            { label: 'Active Roles',     render: () => <Num n={totalRoles} /> },
            { label: 'Systems Online',   render: () => <Num n={systemOnline} /> },
            { label: 'Portal Version',   render: () => <span style={{ fontSize: 18 }}>v1.0</span> },
          ].map((s, i) => (
            <div key={s.label} className="stats-strip-item fade-in" style={{ animationDelay: `${i * 40}ms` }}>
              <span className="stat-lbl">{s.label}</span>
              <p className="stat-num">{s.render()}</p>
            </div>
          ))}
        </div>

        {/* ── Quick actions ── */}
        <div>
          <h2 style={{ fontFamily: 'Montserrat', fontWeight: 800, fontSize: 14, color: '#111827', marginBottom: 12 }}>Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 stagger-children">
            {QUICK_ACTIONS.map((a, i) => (
              <a key={a.label} href={a.href}
                className="cd-card p-4 flex flex-col gap-3 group"
                style={{ cursor: 'pointer', textDecoration: 'none', animationDelay: `${i * 45}ms` }}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform duration-200 group-hover:scale-110"
                  style={{ background: a.bg }}>
                  <a.icon size={17} style={{ color: a.color }} />
                </div>
                <div>
                  <p style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: 13, color: '#111827', margin: 0 }}>{a.label}</p>
                  <p style={{ fontFamily: 'Poppins', fontWeight: 400, fontSize: 11, color: '#94A3B8', margin: '2px 0 0' }}>{a.desc}</p>
                </div>
                <div className="mt-auto flex items-center gap-1 transition-all duration-150 group-hover:gap-2" style={{ color: a.color }}>
                  <span style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: 11 }}>Open</span>
                  <ArrowRight size={11} />
                </div>
              </a>
            ))}
          </div>
        </div>

        {/* ── Bottom row ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

          {/* Accounts by role */}
          <div className="cd-card overflow-hidden">
            <div className="section-header" style={{ borderBottom: '1px solid rgba(0,0,0,0.05)', background: '#FAFBFD' }}>
              <div className="section-header-icon" style={{ background: '#F3E8FF' }}>
                <Shield size={13} style={{ color: '#7C3AED' }} />
              </div>
              <span className="page-section-title flex-1">Accounts by Role</span>
              <span style={{ fontFamily: 'Poppins', fontWeight: 400, fontSize: 12, color: '#94A3B8' }}>{ALL_USERS.length} total</span>
            </div>
            <div className="p-5 space-y-3">
              {Object.entries(usersByRole).map(([role, count]) => {
                const meta = ROLE_META[role] || { label: role, color: '#64748B', bg: '#F1F5F9' }
                const pct  = Math.round((count / ALL_USERS.length) * 100)
                return (
                  <div key={role} className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <span className="px-2.5 py-0.5 rounded-lg text-xs font-semibold"
                        style={{ background: meta.bg, color: meta.color, fontFamily: 'Poppins' }}>
                        {meta.label}
                      </span>
                      <span style={{ fontFamily: 'Montserrat', fontWeight: 700, fontSize: 13, color: '#111827' }}>
                        {count} user{count > 1 ? 's' : ''}
                      </span>
                    </div>
                    <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(0,0,0,0.07)' }}>
                      <div className="h-full rounded-full" style={{ width: `${pct}%`, background: meta.color, transition: 'width 800ms var(--butter)' }} />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* System status */}
          <div className="cd-card overflow-hidden">
            <div className="section-header" style={{ borderBottom: '1px solid rgba(0,0,0,0.05)', background: '#FAFBFD' }}>
              <div className="section-header-icon" style={{ background: '#ECFDF5' }}>
                <Activity size={13} style={{ color: '#059669' }} />
              </div>
              <span className="page-section-title flex-1">System Status</span>
              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg"
                style={{ background: DEMO_MODE ? '#FEF3C7' : '#DCFCE7', border: `1px solid ${DEMO_MODE ? '#FDE68A' : '#BBF7D0'}` }}>
                {DEMO_MODE
                  ? <AlertTriangle size={10} style={{ color: '#B45309' }} />
                  : <CheckCircle size={10} style={{ color: '#15803D' }} />}
                <span style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: 10, color: DEMO_MODE ? '#B45309' : '#15803D' }}>
                  {DEMO_MODE ? 'Demo' : 'All Operational'}
                </span>
              </span>
            </div>
            <div className="p-5 space-y-2">
              {SYSTEM_STATUS.map((s, i) => (
                <div key={s.label}
                  className="flex items-center justify-between p-3 rounded-xl fade-in"
                  style={{ background: '#F8FAFC', border: '1px solid rgba(0,0,0,0.04)', animationDelay: `${i * 40}ms` }}>
                  <div className="flex items-center gap-2.5">
                    <s.icon size={13} style={{ color: '#9CA3AF' }} />
                    <span style={{ fontFamily: 'Poppins', fontWeight: 500, fontSize: 13, color: '#475569' }}>{s.label}</span>
                  </div>
                  <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-md"
                    style={{ background: s.status === 'demo' ? '#FEF3C7' : '#DCFCE7' }}>
                    <div className="w-1.5 h-1.5 rounded-full pulse-dot"
                      style={{ background: s.status === 'demo' ? '#F59E0B' : '#22C55E' }} />
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
