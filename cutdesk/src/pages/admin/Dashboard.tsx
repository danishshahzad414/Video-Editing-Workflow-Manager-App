import { useVideos } from '../../hooks/useVideos'
import Layout from '../../components/layout/Layout'
import { DEMO_MODE, DEMO_PROFILES, MOCK_VIDEOS, MOCK_SCRIPTS, MOCK_ACTIVITY } from '../../lib/mockData'
import { useActivityLog } from '../../hooks/useActivityLog'
import { useState } from 'react'
import { Users, Video, FileEdit, Activity, Shield, TrendingUp, AlertCircle, CheckCircle } from 'lucide-react'
import { formatDate } from '../../lib/utils'

const ROLE_COLOR: Record<string, { bg: string; color: string; label: string }> = {
  super_admin: { bg: '#F3E8FF', color: '#7C3AED', label: 'Super Admin' },
  ceo:         { bg: '#FEF3C7', color: '#B45309', label: 'CEO' },
  editor:      { bg: '#E0F2FE', color: '#0369A1', label: 'Editor' },
  social_manager: { bg: '#EDE9FE', color: '#6D28D9', label: 'Social Manager' },
  counselor:   { bg: '#D1FAE5', color: '#065F46', label: 'Counselor' },
}

const ALL_DEMO_USERS = Object.values(DEMO_PROFILES)

export default function AdminDashboard() {
  const { data: allVideos = [] } = useVideos()
  const { data: activityLog = [] } = useActivityLog()
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'pipeline'>('overview')

  const videos   = DEMO_MODE ? MOCK_VIDEOS : allVideos
  const activity = DEMO_MODE ? MOCK_ACTIVITY : activityLog
  const scripts  = DEMO_MODE ? MOCK_SCRIPTS : []

  const totalUsers     = ALL_DEMO_USERS.length
  const totalVideos    = videos.length
  const totalScripts   = scripts.length
  const publishedCount = videos.filter(v => v.status === 'Published').length
  const urgentCount    = videos.filter(v => v.is_urgent || v.priority === 'Urgent').length
  const inProgressCount = videos.filter(v => v.status === 'Editing In Progress').length

  const kpis = [
    { label: 'Total Users',       value: totalUsers,     icon: Users,      color: '#8B5CF6', bg: '#F3E8FF' },
    { label: 'Total Videos',      value: totalVideos,    icon: Video,      color: '#0284C7', bg: '#EFF6FF' },
    { label: 'Scripts',           value: totalScripts,   icon: FileEdit,   color: '#10B981', bg: '#D1FAE5' },
    { label: 'Published',         value: publishedCount, icon: CheckCircle,color: '#059669', bg: '#ECFDF5' },
    { label: 'Urgent',            value: urgentCount,    icon: AlertCircle,color: '#EF4444', bg: '#FEE2E2' },
    { label: 'Editing Now',       value: inProgressCount,icon: TrendingUp, color: '#F59E0B', bg: '#FFFBEB' },
  ]

  const usersByRole = ALL_DEMO_USERS.reduce((acc, u) => {
    acc[u.role] = (acc[u.role] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const videoByStatus = videos.reduce((acc, v) => {
    acc[v.status] = (acc[v.status] || 0) + 1
    return acc
  }, {} as Record<string, number>)

  const tabs = [
    { id: 'overview', label: 'Overview',   icon: Shield },
    { id: 'users',    label: 'All Users',  icon: Users },
    { id: 'pipeline', label: 'Pipeline',   icon: Activity },
  ] as const

  return (
    <Layout title="Super Admin">
      <div className="fade-in space-y-6 max-w-6xl mx-auto">

        {/* Admin banner */}
        <div className="rounded-2xl p-5 flex items-center gap-4 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #4C1D95, #7C3AED, #8B5CF6)', boxShadow: '0 8px 32px rgba(124,58,237,0.35)' }}>
          <div className="absolute inset-0 opacity-10" style={{ background: 'radial-gradient(circle at 80% 50%, #A78BFA, transparent 60%)' }} />
          <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 relative" style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)' }}>
            <Shield size={24} className="text-white" />
          </div>
          <div className="relative">
            <h2 style={{ fontFamily: 'Montserrat', fontWeight: 900, fontSize: 20, color: '#fff', margin: 0 }}>Super Admin Console</h2>
            <p style={{ fontFamily: 'Poppins', fontWeight: 400, fontSize: 13, color: 'rgba(255,255,255,0.7)', margin: 0 }}>Full system access — all roles, all data, all controls</p>
          </div>
          {DEMO_MODE && (
            <div className="ml-auto flex-shrink-0 px-3 py-1.5 rounded-xl relative" style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)' }}>
              <span style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: 11, color: '#fff' }}>⚡ Demo Mode</span>
            </div>
          )}
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 stagger-children">
          {kpis.map(k => (
            <div key={k.label} className="stat-card p-4 text-center">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center mx-auto mb-2" style={{ background: k.bg }}>
                <k.icon size={17} style={{ color: k.color }} />
              </div>
              <p style={{ fontFamily: 'Montserrat', fontWeight: 900, fontSize: 24, color: k.color, margin: 0 }}>{k.value}</p>
              <p style={{ fontFamily: 'Poppins', fontWeight: 500, fontSize: 11, color: '#64748B', margin: 0 }}>{k.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 p-1 rounded-xl w-fit" style={{ background: '#F1F5F9', border: '1px solid #E2E8F0' }}>
          {tabs.map(t => (
            <button
              key={t.id}
              onClick={() => setActiveTab(t.id)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs transition-all duration-200"
              style={{
                background: activeTab === t.id ? '#7C3AED' : 'transparent',
                color: activeTab === t.id ? '#fff' : '#64748B',
                fontFamily: 'Poppins', fontWeight: 600,
                boxShadow: activeTab === t.id ? '0 2px 8px rgba(124,58,237,0.35)' : 'none',
              }}
            >
              <t.icon size={13} /> {t.label}
            </button>
          ))}
        </div>

        {/* Overview tab */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 stagger-children">

            {/* Users by role */}
            <div className="cd-card p-5">
              <h3 style={{ fontFamily: 'Montserrat', fontWeight: 800, fontSize: 15, color: '#0F172A', marginBottom: 16 }}>Users by Role</h3>
              <div className="space-y-3">
                {Object.entries(usersByRole).map(([role, count]) => {
                  const rc = ROLE_COLOR[role] || { bg: '#F1F5F9', color: '#64748B', label: role }
                  const pct = Math.round((count / totalUsers) * 100)
                  return (
                    <div key={role}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="px-2 py-0.5 rounded-md text-xs font-semibold" style={{ background: rc.bg, color: rc.color, fontFamily: 'Poppins' }}>{rc.label}</span>
                        <span style={{ fontFamily: 'Montserrat', fontWeight: 700, fontSize: 14, color: '#0F172A' }}>{count}</span>
                      </div>
                      <div className="h-1.5 rounded-full overflow-hidden" style={{ background: '#F1F5F9' }}>
                        <div className="h-full rounded-full transition-all duration-700" style={{ width: `${pct}%`, background: rc.color }} />
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Videos by status */}
            <div className="cd-card p-5">
              <h3 style={{ fontFamily: 'Montserrat', fontWeight: 800, fontSize: 15, color: '#0F172A', marginBottom: 16 }}>Videos by Status</h3>
              <div className="space-y-2">
                {Object.entries(videoByStatus).slice(0, 8).map(([status, count]) => (
                  <div key={status} className="flex items-center justify-between py-1.5 px-3 rounded-lg" style={{ background: '#F8FAFC' }}>
                    <span style={{ fontFamily: 'Poppins', fontWeight: 500, fontSize: 12, color: '#475569' }}>{status}</span>
                    <span className="px-2 py-0.5 rounded-md text-xs font-bold" style={{ background: '#EFF6FF', color: '#0284C7', fontFamily: 'Montserrat' }}>{count}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent activity */}
            <div className="cd-card p-5 lg:col-span-2">
              <h3 style={{ fontFamily: 'Montserrat', fontWeight: 800, fontSize: 15, color: '#0F172A', marginBottom: 16 }}>Recent Activity</h3>
              <div className="space-y-2">
                {activity.slice(0, 8).map((a: any) => (
                  <div key={a.id} className="flex items-start gap-3 p-3 rounded-xl interactive-row" style={{ background: '#F8FAFC' }}>
                    <div className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5" style={{ background: '#EFF6FF' }}>
                      <Activity size={13} className="text-sky-500" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: 12, color: '#0F172A', margin: 0 }}>{a.action}</p>
                      <p style={{ fontFamily: 'Poppins', fontWeight: 400, fontSize: 11, color: '#94A3B8', margin: 0 }}>
                        {a.user?.full_name} · {a.video?.title}
                      </p>
                    </div>
                    <span style={{ fontFamily: 'Poppins', fontWeight: 400, fontSize: 10, color: '#94A3B8', flexShrink: 0 }}>
                      {formatDate(a.created_at)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Users tab */}
        {activeTab === 'users' && (
          <div className="cd-card overflow-hidden stagger-children">
            <div className="px-5 py-3 flex items-center justify-between" style={{ borderBottom: '1px solid #E2E8F0', background: '#FAFAFA' }}>
              <h3 style={{ fontFamily: 'Montserrat', fontWeight: 800, fontSize: 15, color: '#0F172A', margin: 0 }}>All System Users ({ALL_DEMO_USERS.length})</h3>
            </div>
            <div className="divide-y" style={{ borderColor: '#F1F5F9' }}>
              {ALL_DEMO_USERS.map((user, i) => {
                const rc = ROLE_COLOR[user.role] || { bg: '#F1F5F9', color: '#64748B', label: user.role }
                const initials = user.full_name.split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase()
                return (
                  <div key={user.id} className="flex items-center gap-4 px-5 py-3.5 interactive-row fade-in" style={{ animationDelay: `${i * 40}ms` }}>
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: rc.bg }}>
                      <span style={{ fontFamily: 'Montserrat', fontWeight: 800, fontSize: 13, color: rc.color }}>{initials}</span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: 13, color: '#0F172A', margin: 0 }}>{user.full_name}</p>
                      <p style={{ fontFamily: 'Poppins', fontWeight: 400, fontSize: 11, color: '#94A3B8', margin: 0 }}>{user.email}</p>
                    </div>
                    <span className="px-2.5 py-1 rounded-lg text-xs font-semibold flex-shrink-0" style={{ background: rc.bg, color: rc.color, fontFamily: 'Poppins' }}>{rc.label}</span>
                    <span style={{ fontFamily: 'Poppins', fontWeight: 400, fontSize: 10, color: '#CBD5E1', flexShrink: 0 }}>{user.id}</span>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* Pipeline tab */}
        {activeTab === 'pipeline' && (
          <div className="cd-card overflow-hidden">
            <div className="px-5 py-3" style={{ borderBottom: '1px solid #E2E8F0', background: '#FAFAFA' }}>
              <h3 style={{ fontFamily: 'Montserrat', fontWeight: 800, fontSize: 15, color: '#0F172A', margin: 0 }}>Full Video Pipeline ({videos.length} videos)</h3>
            </div>
            <div className="divide-y" style={{ borderColor: '#F1F5F9' }}>
              {videos.map((v: any, i: number) => {
                const priorityColor = v.priority === 'Urgent' ? '#EF4444' : v.priority === 'Low' ? '#94A3B8' : '#0284C7'
                return (
                  <div key={v.id} className="flex items-center gap-3 px-5 py-3 interactive-row fade-in" style={{ animationDelay: `${i * 25}ms` }}>
                    <div className="w-1.5 h-8 rounded-full flex-shrink-0" style={{ background: priorityColor }} />
                    <div className="flex-1 min-w-0">
                      <p style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: 12, color: '#0F172A', margin: 0 }} className="truncate">{v.title}</p>
                      <p style={{ fontFamily: 'Poppins', fontWeight: 400, fontSize: 11, color: '#94A3B8', margin: 0 }}>
                        {v.counselor?.full_name} · {v.category}
                      </p>
                    </div>
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold flex-shrink-0" style={{ background: '#F1F5F9', color: '#475569', fontFamily: 'Poppins' }}>{v.status}</span>
                    {v.is_urgent && <span className="px-1.5 py-0.5 rounded text-[10px] font-bold flex-shrink-0" style={{ background: '#FEE2E2', color: '#EF4444', fontFamily: 'Poppins' }}>URGENT</span>}
                  </div>
                )
              })}
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}
