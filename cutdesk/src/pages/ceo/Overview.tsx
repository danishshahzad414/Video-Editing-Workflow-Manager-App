import { useVideos } from '../../hooks/useVideos'
import Layout from '../../components/layout/Layout'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts'
import { format, subMonths, startOfMonth, endOfMonth } from 'date-fns'
import { PIPELINE_STAGES, stageColor, formatMinutes } from '../../lib/utils'
import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { TrendingUp, Users, Clock, Layers, RefreshCw } from 'lucide-react'

const MEDALS = ['🥇', '🥈', '🥉']

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

export default function CEOOverview() {
  const { data: allVideos = [] } = useVideos()
  const [profiles, setProfiles] = useState<any[]>([])
  const [lastUpdated] = useState(new Date().toLocaleString('en-AU', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: 'short' }))

  useEffect(() => {
    supabase.from('profiles').select('id, full_name, role').eq('role', 'counselor').then(({ data }) => setProfiles(data || []))
  }, [])

  const thisMonthStart      = startOfMonth(new Date())
  const inProgress          = allVideos.filter(v => ['In Editor Queue', 'Editing In Progress', 'Re-record Submitted'].includes(v.status)).length
  const completedThisMonth  = allVideos.filter(v => ['Editing Complete', 'Pending Social Review', 'Scheduled', 'Published'].includes(v.status) && new Date(v.updated_at) >= thisMonthStart).length
  const publishedThisMonth  = allVideos.filter(v => v.status === 'Published' && new Date(v.updated_at) >= thisMonthStart).length

  const editedVideos   = allVideos.filter(v => v.actual_edit_time_minutes)
  const avgEditMins    = editedVideos.length ? Math.round(editedVideos.reduce((s, v) => s + (v.actual_edit_time_minutes || 0), 0) / editedVideos.length) : 0
  const queueDepth     = allVideos.filter(v => ['Raw Uploaded', 'In Editor Queue', 'Editing In Progress'].includes(v.status)).length
  const completionRate = allVideos.length ? Math.round((allVideos.filter(v => ['Editing Complete', 'Published'].includes(v.status)).length / allVideos.length) * 100) : 0

  const uploadVolumeData = Array.from({ length: 6 }, (_, i) => {
    const d     = subMonths(new Date(), 5 - i)
    const start = startOfMonth(d)
    const end   = endOfMonth(d)
    const count = allVideos.filter(v => new Date(v.created_at) >= start && new Date(v.created_at) <= end).length
    return { month: format(d, 'MMM'), count }
  })

  const funnelData = PIPELINE_STAGES.map(stage => ({
    stage: stage.length > 14 ? stage.slice(0, 14) + '…' : stage,
    count: allVideos.filter(v => v.status === stage).length,
    color: stageColor(stage),
  }))

  const leaderboard = profiles.map(p => {
    const pVideos   = allVideos.filter(v => v.counselor_id === p.id)
    const completed = pVideos.filter(v => ['Editing Complete', 'Published', 'Scheduled', 'Pending Social Review'].includes(v.status)).length
    const inProg    = pVideos.filter(v => ['In Editor Queue', 'Editing In Progress'].includes(v.status)).length
    return { ...p, total: pVideos.length, completed, inProgress: inProg }
  }).sort((a, b) => b.total - a.total)

  return (
    <Layout title="CEO Overview">
      <div className="fade-in space-y-5">

        {/* ── Page header ── */}
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 style={{ fontFamily: 'Montserrat', fontWeight: 900, fontSize: 22, color: '#111827', margin: 0 }}>
              Content Pipeline
            </h1>
            <p style={{ fontFamily: 'Poppins', fontWeight: 400, fontSize: 13, color: '#94A3B8', margin: '3px 0 0' }}>
              {allVideos.length} total videos · {profiles.length} counselors · {completionRate}% completion rate
            </p>
          </div>
          <div className="flex items-center gap-1.5 flex-shrink-0"
            style={{ fontFamily: 'Poppins', fontWeight: 400, fontSize: 11, color: '#94A3B8' }}>
            <RefreshCw size={10} />
            {lastUpdated}
          </div>
        </div>

        {/* ── Stats strip ── */}
        <div className="stats-strip stagger-children" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
          {[
            { label: 'Total Videos',          render: () => <Num n={allVideos.length} /> },
            { label: 'In Progress Now',        render: () => <Num n={inProgress} /> },
            { label: 'Completed This Month',   render: () => <Num n={completedThisMonth} /> },
            { label: 'Published This Month',   render: () => <Num n={publishedThisMonth} /> },
          ].map((s, i) => (
            <div key={s.label} className="stats-strip-item fade-in" style={{ animationDelay: `${i * 40}ms` }}>
              <span className="stat-lbl">{s.label}</span>
              <p className="stat-num">{s.render()}</p>
            </div>
          ))}
        </div>

        {/* ── Charts row ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

          {/* Area chart — upload volume */}
          <div className="cd-card overflow-hidden">
            <div className="section-header">
              <div className="section-header-icon" style={{ background: '#EFF6FF' }}>
                <TrendingUp size={13} style={{ color: '#0284C7' }} />
              </div>
              <div>
                <span className="page-section-title">Upload Volume</span>
                <p style={{ fontFamily: 'Poppins', fontWeight: 400, fontSize: 11, color: '#94A3B8', margin: 0 }}>Last 6 months</p>
              </div>
            </div>
            <div className="p-4">
              <ResponsiveContainer width="100%" height={170}>
                <AreaChart data={uploadVolumeData}>
                  <defs>
                    <linearGradient id="uploadGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%"   stopColor="#0284C7" stopOpacity={0.2} />
                      <stop offset="100%" stopColor="#0284C7" stopOpacity={0.01} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="month" stroke="transparent" tick={{ fontFamily: 'Poppins', fontSize: 11, fill: '#9CA3AF' }} />
                  <YAxis stroke="transparent" tick={{ fontFamily: 'Poppins', fontSize: 11, fill: '#9CA3AF' }} allowDecimals={false} />
                  <Tooltip
                    contentStyle={{ background: '#111827', border: 'none', borderRadius: 8, fontFamily: 'Poppins', fontSize: 11, boxShadow: '0 8px 24px rgba(0,0,0,0.25)' }}
                    labelStyle={{ color: '#38BDF8', fontWeight: 600, marginBottom: 3 }}
                    itemStyle={{ color: '#fff' }}
                    cursor={{ stroke: '#0284C7', strokeWidth: 1, strokeDasharray: '4 4' }}
                  />
                  <Area type="monotone" dataKey="count" stroke="#0284C7" strokeWidth={2.5} fill="url(#uploadGrad)"
                    dot={{ fill: '#0284C7', r: 3, strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 5 }} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Editor performance */}
          <div className="cd-card overflow-hidden">
            <div className="section-header">
              <div className="section-header-icon" style={{ background: '#EEF2FF' }}>
                <Users size={13} style={{ color: '#6366F1' }} />
              </div>
              <div>
                <span className="page-section-title">Editor Performance</span>
                <p style={{ fontFamily: 'Poppins', fontWeight: 400, fontSize: 11, color: '#94A3B8', margin: 0 }}>Current metrics</p>
              </div>
            </div>
            <div className="p-4 space-y-3">
              {[
                { label: 'Avg edit time / video',      value: formatMinutes(avgEditMins), color: '#6366F1', bg: '#EEF2FF', icon: Clock },
                { label: 'Queue depth',                value: queueDepth,                 color: '#F59E0B', bg: '#FFFBEB', icon: Layers },
                { label: 'Completion rate this month', value: `${completionRate}%`,        color: '#10B981', bg: '#ECFDF5', icon: TrendingUp },
              ].map((m, i) => (
                <div key={m.label} className="flex items-center justify-between p-3 rounded-xl fade-in"
                  style={{ background: '#F8FAFC', border: '1px solid rgba(0,0,0,0.04)', animationDelay: `${i * 50}ms` }}>
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: m.bg }}>
                      <m.icon size={12} style={{ color: m.color }} />
                    </div>
                    <span style={{ fontFamily: 'Poppins', fontWeight: 500, fontSize: 12, color: '#475569' }}>{m.label}</span>
                  </div>
                  <span style={{ fontFamily: 'Montserrat', fontWeight: 800, fontSize: 16, color: m.color }}>{m.value}</span>
                </div>
              ))}
              {/* Completion bar */}
              <div className="p-3 rounded-xl" style={{ background: '#F8FAFC', border: '1px solid rgba(0,0,0,0.04)' }}>
                <div className="flex justify-between items-center mb-2">
                  <span style={{ fontFamily: 'Poppins', fontWeight: 500, fontSize: 11, color: '#6B7280' }}>Overall completion rate</span>
                  <span style={{ fontFamily: 'Montserrat', fontWeight: 800, fontSize: 13, color: '#10B981' }}>{completionRate}%</span>
                </div>
                <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(0,0,0,0.07)' }}>
                  <div className="h-full rounded-full transition-all duration-1000"
                    style={{ width: `${completionRate}%`, background: 'linear-gradient(90deg, #10B981, #34D399)' }} />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── Pipeline funnel ── */}
        <div className="cd-card overflow-hidden">
          <div className="section-header">
            <div className="section-header-icon" style={{ background: '#FFFBEB' }}>
              <Layers size={13} style={{ color: '#F59E0B' }} />
            </div>
            <div>
              <span className="page-section-title">Pipeline Distribution</span>
              <p style={{ fontFamily: 'Poppins', fontWeight: 400, fontSize: 11, color: '#94A3B8', margin: 0 }}>Current stage breakdown across all videos</p>
            </div>
          </div>
          <div className="p-4">
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={funnelData} barSize={16}>
                <XAxis dataKey="stage" stroke="transparent" tick={{ fontFamily: 'Poppins', fontSize: 9, fill: '#9CA3AF' }} />
                <YAxis stroke="transparent" tick={{ fontFamily: 'Poppins', fontSize: 10, fill: '#9CA3AF' }} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ background: '#111827', border: 'none', borderRadius: 8, fontFamily: 'Poppins', fontSize: 11, boxShadow: '0 8px 24px rgba(0,0,0,0.25)' }}
                  labelStyle={{ color: '#9CA3AF', fontWeight: 600, marginBottom: 3 }}
                  itemStyle={{ color: '#fff' }}
                  cursor={{ fill: 'rgba(245,158,11,0.06)' }}
                />
                <Bar dataKey="count" fill="#F59E0B" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* ── Counselor leaderboard ── */}
        <div className="cd-card overflow-hidden">
          <div className="section-header" style={{ borderBottom: '1px solid rgba(0,0,0,0.05)', background: '#FAFBFD' }}>
            <div className="section-header-icon" style={{ background: '#FEF3C7' }}>
              <Users size={13} style={{ color: '#B45309' }} />
            </div>
            <span className="page-section-title flex-1">Counselor Leaderboard</span>
            <span style={{ fontFamily: 'Poppins', fontWeight: 400, fontSize: 12, color: '#94A3B8' }}>Ranked by uploads</span>
          </div>

          {leaderboard.length === 0 ? (
            <div className="empty-state">
              <p className="empty-state-title" style={{ fontSize: 14 }}>No counselor data yet</p>
            </div>
          ) : (
            <div className="divide-y" style={{ borderColor: 'rgba(0,0,0,0.04)' }}>
              {leaderboard.map((c, i) => {
                const pct = c.total ? Math.round((c.completed / c.total) * 100) : 0
                return (
                  <div key={c.id} className="px-5 py-3.5 flex items-center gap-4 hover:bg-slate-50 transition-colors duration-150 fade-in"
                    style={{ animationDelay: `${i * 35}ms` }}>
                    {/* Rank */}
                    <div className="w-8 text-center flex-shrink-0">
                      {i < 3 ? (
                        <span style={{ fontSize: 18 }}>{MEDALS[i]}</span>
                      ) : (
                        <span style={{ fontFamily: 'Montserrat', fontWeight: 800, fontSize: 13, color: '#94A3B8' }}>#{i + 1}</span>
                      )}
                    </div>
                    {/* Avatar initials */}
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: i === 0 ? '#FEF3C7' : i === 1 ? '#F1F5F9' : i === 2 ? '#FFF7ED' : '#F8FAFC', border: `1px solid ${i === 0 ? '#FDE68A' : 'rgba(0,0,0,0.07)'}` }}>
                      <span style={{ fontFamily: 'Montserrat', fontWeight: 800, fontSize: 11, color: i === 0 ? '#B45309' : '#475569' }}>
                        {c.full_name?.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                      </span>
                    </div>
                    {/* Name + progress bar */}
                    <div className="flex-1 min-w-0">
                      <p style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: 13, color: '#111827', margin: 0 }} className="truncate">{c.full_name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(0,0,0,0.07)' }}>
                          <div className="h-full rounded-full transition-all duration-700"
                            style={{ width: `${pct}%`, background: pct >= 75 ? 'linear-gradient(90deg,#10B981,#34D399)' : pct >= 40 ? 'linear-gradient(90deg,#0284C7,#38BDF8)' : 'linear-gradient(90deg,#F59E0B,#FCD34D)' }} />
                        </div>
                        <span style={{ fontFamily: 'Poppins', fontSize: 10, color: '#9CA3AF', flexShrink: 0 }}>{pct}%</span>
                      </div>
                    </div>
                    {/* Stats */}
                    <div className="flex items-center gap-4 flex-shrink-0 text-right">
                      <div>
                        <p style={{ fontFamily: 'Montserrat', fontWeight: 800, fontSize: 16, color: '#0284C7', margin: 0 }}>{c.total}</p>
                        <p style={{ fontFamily: 'Poppins', fontSize: 9, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.06em', margin: 0 }}>Total</p>
                      </div>
                      <div>
                        <p style={{ fontFamily: 'Montserrat', fontWeight: 800, fontSize: 16, color: '#10B981', margin: 0 }}>{c.completed}</p>
                        <p style={{ fontFamily: 'Poppins', fontSize: 9, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.06em', margin: 0 }}>Done</p>
                      </div>
                      <div>
                        <p style={{ fontFamily: 'Montserrat', fontWeight: 800, fontSize: 16, color: '#F59E0B', margin: 0 }}>{c.inProgress}</p>
                        <p style={{ fontFamily: 'Poppins', fontSize: 9, color: '#9CA3AF', textTransform: 'uppercase', letterSpacing: '0.06em', margin: 0 }}>Active</p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}
