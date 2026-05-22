import { useVideos } from '../../hooks/useVideos'
import Layout from '../../components/layout/Layout'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts'
import { format, subMonths, startOfMonth, endOfMonth } from 'date-fns'
import { PIPELINE_STAGES, stageColor, formatMinutes } from '../../lib/utils'
import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { Video, TrendingUp, CheckCircle2, Send, BarChart3, Users, Clock, Layers, RefreshCw } from 'lucide-react'

const MEDALS = ['🥇', '🥈', '🥉']

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

  const kpis = [
    { label: 'Total Uploaded',        value: allVideos.length,       color: '#0284C7', bg: '#EFF6FF', icon: Video,        glow: 'rgba(2,132,199,0.2)',    trend: '+12%' },
    { label: 'In Progress Now',        value: inProgress,             color: '#F59E0B', bg: '#FFFBEB', icon: Layers,       glow: 'rgba(245,158,11,0.2)',   trend: null },
    { label: 'Completed This Month',   value: completedThisMonth,     color: '#6366F1', bg: '#EEF2FF', icon: CheckCircle2, glow: 'rgba(99,102,241,0.2)',   trend: '+8%' },
    { label: 'Published This Month',   value: publishedThisMonth,     color: '#10B981', bg: '#ECFDF5', icon: Send,         glow: 'rgba(16,185,129,0.2)',   trend: '+24%' },
  ]

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

  const editedVideos    = allVideos.filter(v => v.actual_edit_time_minutes)
  const avgEditMins     = editedVideos.length ? Math.round(editedVideos.reduce((s, v) => s + (v.actual_edit_time_minutes || 0), 0) / editedVideos.length) : 0
  const queueDepth      = allVideos.filter(v => ['Raw Uploaded', 'In Editor Queue', 'Editing In Progress'].includes(v.status)).length
  const completionRate  = allVideos.length ? Math.round((allVideos.filter(v => ['Editing Complete', 'Published'].includes(v.status)).length / allVideos.length) * 100) : 0

  const leaderboard = profiles.map(p => {
    const pVideos  = allVideos.filter(v => v.counselor_id === p.id)
    const completed = pVideos.filter(v => ['Editing Complete', 'Published', 'Scheduled', 'Pending Social Review'].includes(v.status)).length
    const inProg    = pVideos.filter(v => ['In Editor Queue', 'Editing In Progress'].includes(v.status)).length
    return { ...p, total: pVideos.length, completed, inProgress: inProg }
  }).sort((a, b) => b.total - a.total)

  const editorMetrics = [
    { label: 'Avg edit time / video',       value: formatMinutes(avgEditMins), color: '#6366F1', bg: '#EEF2FF', icon: Clock },
    { label: 'Queue depth',                 value: queueDepth,                 color: '#F59E0B', bg: '#FFFBEB', icon: Layers },
    { label: 'Completion rate this month',  value: `${completionRate}%`,       color: '#10B981', bg: '#ECFDF5', icon: TrendingUp },
  ]

  return (
    <Layout title="CEO Overview">
      <div className="fade-in space-y-6">

        {/* ── Hero ── */}
        <div className="relative rounded-2xl overflow-hidden p-6 md:p-8"
          style={{ background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 40%, #0C4A6E 75%, #0369A1 100%)' }}>
          <div className="absolute inset-0 opacity-[0.06]"
            style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '24px 24px' }} />
          <div className="absolute -top-16 -right-16 w-64 h-64 rounded-full opacity-15"
            style={{ background: 'radial-gradient(circle, #38BDF8, transparent)' }} />
          <div className="absolute -bottom-10 left-1/4 w-48 h-48 rounded-full opacity-10"
            style={{ background: 'radial-gradient(circle, #0EA5E9, transparent)' }} />

          <div className="relative flex flex-col sm:flex-row sm:items-start justify-between gap-5">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                style={{ background: 'rgba(255,255,255,0.12)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.2)' }}>
                <BarChart3 size={22} className="text-white" />
              </div>
              <div>
                <p style={{ fontFamily: 'Poppins', fontWeight: 400, fontSize: 13, color: 'rgba(255,255,255,0.5)', margin: 0 }}>Executive Overview</p>
                <h1 style={{ fontFamily: 'Montserrat', fontWeight: 900, fontSize: 26, color: '#fff', margin: '4px 0 8px' }}>
                  Content Pipeline
                </h1>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2.5 py-1 rounded-lg"
                    style={{ background: 'rgba(255,255,255,0.1)', fontFamily: 'Poppins', fontWeight: 600, fontSize: 11, color: 'rgba(255,255,255,0.85)' }}>
                    🎬 {allVideos.length} total videos
                  </span>
                  <span className="px-2.5 py-1 rounded-lg"
                    style={{ background: 'rgba(255,255,255,0.1)', fontFamily: 'Poppins', fontWeight: 600, fontSize: 11, color: 'rgba(255,255,255,0.85)' }}>
                    👥 {profiles.length} counselors
                  </span>
                  <span className="px-2.5 py-1 rounded-lg"
                    style={{ background: completionRate >= 50 ? 'rgba(16,185,129,0.22)' : 'rgba(245,158,11,0.22)', border: `1px solid ${completionRate >= 50 ? 'rgba(16,185,129,0.45)' : 'rgba(245,158,11,0.45)'}`, fontFamily: 'Poppins', fontWeight: 600, fontSize: 11, color: completionRate >= 50 ? '#D1FAE5' : '#FEF3C7' }}>
                    📊 {completionRate}% completion rate
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0 px-3 py-2 rounded-xl"
              style={{ background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.15)' }}>
              <RefreshCw size={11} style={{ color: 'rgba(255,255,255,0.45)' }} />
              <span style={{ fontFamily: 'Poppins', fontWeight: 500, fontSize: 11, color: 'rgba(255,255,255,0.45)' }}>Updated {lastUpdated}</span>
            </div>
          </div>
        </div>

        {/* ── KPI cards ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 stagger-children">
          {kpis.map((k, i) => (
            <div key={k.label} className="stat-card p-5 fade-in" style={{ animationDelay: `${i * 65}ms` }}>
              <div className="absolute top-0 left-5 right-5 h-0.5 rounded-full" style={{ background: `linear-gradient(90deg, ${k.color}, transparent)` }} />
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: k.bg, boxShadow: `0 4px 12px ${k.glow}` }}>
                  <k.icon size={17} style={{ color: k.color }} />
                </div>
                {k.trend && (
                  <span className="flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-bold mt-1"
                    style={{ background: '#DCFCE7', color: '#15803D', fontFamily: 'Poppins' }}>
                    <TrendingUp size={9} /> {k.trend}
                  </span>
                )}
              </div>
              <p style={{ fontFamily: 'Montserrat', fontWeight: 900, fontSize: 32, color: k.color, margin: 0, lineHeight: 1 }}>{k.value}</p>
              <p style={{ fontFamily: 'Poppins', fontWeight: 500, fontSize: 11, color: '#64748B', marginTop: 5 }}>{k.label}</p>
            </div>
          ))}
        </div>

        {/* ── Charts row ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

          {/* Area chart — upload volume */}
          <div className="cd-card p-5">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: '#EFF6FF' }}>
                <TrendingUp size={14} style={{ color: '#0284C7' }} />
              </div>
              <div>
                <h2 style={{ fontFamily: 'Montserrat', fontWeight: 800, fontSize: 14, color: '#0F172A', margin: 0 }}>Upload Volume</h2>
                <p style={{ fontFamily: 'Poppins', fontWeight: 400, fontSize: 11, color: '#94A3B8', margin: 0 }}>Last 6 months</p>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={190}>
              <AreaChart data={uploadVolumeData}>
                <defs>
                  <linearGradient id="uploadGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%"   stopColor="#0284C7" stopOpacity={0.25} />
                    <stop offset="100%" stopColor="#0284C7" stopOpacity={0.02} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="month" stroke="#F1F5F9" tick={{ fontFamily: 'Poppins', fontSize: 11, fill: '#94A3B8' }} />
                <YAxis stroke="#F1F5F9" tick={{ fontFamily: 'Poppins', fontSize: 11, fill: '#94A3B8' }} allowDecimals={false} />
                <Tooltip
                  contentStyle={{ background: '#0F172A', border: 'none', borderRadius: 10, fontFamily: 'Poppins', fontSize: 12, boxShadow: '0 8px 24px rgba(0,0,0,0.2)' }}
                  labelStyle={{ color: '#38BDF8', fontWeight: 600, marginBottom: 4 }}
                  itemStyle={{ color: '#fff' }}
                  cursor={{ stroke: '#0284C7', strokeWidth: 1, strokeDasharray: '4 4' }}
                />
                <Area type="monotone" dataKey="count" stroke="#0284C7" strokeWidth={2.5} fill="url(#uploadGrad)" dot={{ fill: '#0284C7', r: 4, strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Editor performance metrics */}
          <div className="cd-card p-5">
            <div className="flex items-center gap-2.5 mb-5">
              <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: '#EEF2FF' }}>
                <Users size={14} style={{ color: '#6366F1' }} />
              </div>
              <div>
                <h2 style={{ fontFamily: 'Montserrat', fontWeight: 800, fontSize: 14, color: '#0F172A', margin: 0 }}>Editor Performance</h2>
                <p style={{ fontFamily: 'Poppins', fontWeight: 400, fontSize: 11, color: '#94A3B8', margin: 0 }}>Current metrics</p>
              </div>
            </div>
            <div className="space-y-3">
              {editorMetrics.map((m, i) => (
                <div key={m.label} className="flex items-center justify-between p-3.5 rounded-xl fade-in"
                  style={{ background: '#F8FAFC', border: '1px solid #F1F5F9', animationDelay: `${i * 60}ms` }}>
                  <div className="flex items-center gap-3">
                    <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: m.bg }}>
                      <m.icon size={12} style={{ color: m.color }} />
                    </div>
                    <span style={{ fontFamily: 'Poppins', fontWeight: 500, fontSize: 13, color: '#475569' }}>{m.label}</span>
                  </div>
                  <span style={{ fontFamily: 'Montserrat', fontWeight: 800, fontSize: 16, color: m.color }}>{m.value}</span>
                </div>
              ))}
            </div>
            {/* Completion bar */}
            <div className="mt-4 p-3.5 rounded-xl" style={{ background: '#F8FAFC', border: '1px solid #F1F5F9' }}>
              <div className="flex justify-between items-center mb-2">
                <span style={{ fontFamily: 'Poppins', fontWeight: 500, fontSize: 12, color: '#475569' }}>Overall completion rate</span>
                <span style={{ fontFamily: 'Montserrat', fontWeight: 800, fontSize: 14, color: '#10B981' }}>{completionRate}%</span>
              </div>
              <div className="h-2 rounded-full overflow-hidden" style={{ background: '#E2E8F0' }}>
                <div className="h-full rounded-full transition-all duration-1000"
                  style={{ width: `${completionRate}%`, background: 'linear-gradient(90deg, #10B981, #34D399)' }} />
              </div>
            </div>
          </div>
        </div>

        {/* ── Pipeline funnel ── */}
        <div className="cd-card p-5">
          <div className="flex items-center gap-2.5 mb-5">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: '#FFFBEB' }}>
              <Layers size={14} style={{ color: '#F59E0B' }} />
            </div>
            <div>
              <h2 style={{ fontFamily: 'Montserrat', fontWeight: 800, fontSize: 14, color: '#0F172A', margin: 0 }}>Pipeline Distribution</h2>
              <p style={{ fontFamily: 'Poppins', fontWeight: 400, fontSize: 11, color: '#94A3B8', margin: 0 }}>Current stage breakdown across all videos</p>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={funnelData} barSize={20}>
              <XAxis dataKey="stage" stroke="#F1F5F9" tick={{ fontFamily: 'Poppins', fontSize: 9, fill: '#94A3B8' }} />
              <YAxis stroke="#F1F5F9" tick={{ fontFamily: 'Poppins', fontSize: 10, fill: '#94A3B8' }} allowDecimals={false} />
              <Tooltip
                contentStyle={{ background: '#0F172A', border: 'none', borderRadius: 10, fontFamily: 'Poppins', fontSize: 12, boxShadow: '0 8px 24px rgba(0,0,0,0.2)' }}
                labelStyle={{ color: '#94A3B8', fontWeight: 600, marginBottom: 4 }}
                itemStyle={{ color: '#fff' }}
                cursor={{ fill: 'rgba(245,158,11,0.07)' }}
              />
              <Bar dataKey="count" fill="#F59E0B" radius={[5, 5, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* ── Counselor leaderboard ── */}
        <div className="cd-card overflow-hidden">
          <div className="px-5 py-4 flex items-center gap-3" style={{ borderBottom: '1px solid #F1F5F9', background: '#FAFAFA' }}>
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: '#FEF3C7' }}>
              <Users size={14} style={{ color: '#B45309' }} />
            </div>
            <div>
              <h2 style={{ fontFamily: 'Montserrat', fontWeight: 800, fontSize: 14, color: '#0F172A', margin: 0 }}>Counselor Leaderboard</h2>
              <p style={{ fontFamily: 'Poppins', fontWeight: 400, fontSize: 11, color: '#94A3B8', marginTop: 1 }}>Ranked by total video uploads</p>
            </div>
          </div>

          {leaderboard.length === 0 ? (
            <div className="p-10 text-center">
              <p style={{ fontFamily: 'Poppins', fontSize: 13, color: '#94A3B8' }}>No counselor data yet</p>
            </div>
          ) : (
            <div className="divide-y" style={{ borderColor: '#F8FAFC' }}>
              {leaderboard.map((c, i) => {
                const pct = c.total ? Math.round((c.completed / c.total) * 100) : 0
                return (
                  <div key={c.id} className="px-5 py-3.5 flex items-center gap-4 hover:bg-slate-50 transition-colors duration-150 fade-in"
                    style={{ animationDelay: `${i * 40}ms` }}>
                    {/* Rank */}
                    <div className="w-8 text-center flex-shrink-0">
                      {i < 3 ? (
                        <span style={{ fontSize: 18 }}>{MEDALS[i]}</span>
                      ) : (
                        <span style={{ fontFamily: 'Montserrat', fontWeight: 800, fontSize: 13, color: '#94A3B8' }}>#{i + 1}</span>
                      )}
                    </div>
                    {/* Avatar */}
                    <div className="w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0"
                      style={{ background: i === 0 ? '#FEF3C7' : i === 1 ? '#F1F5F9' : i === 2 ? '#FFF7ED' : '#F8FAFC', border: `1px solid ${i === 0 ? '#FDE68A' : '#E2E8F0'}` }}>
                      <span style={{ fontFamily: 'Montserrat', fontWeight: 800, fontSize: 11, color: i === 0 ? '#B45309' : '#475569' }}>
                        {c.full_name?.split(' ').map((n: string) => n[0]).join('').slice(0, 2)}
                      </span>
                    </div>
                    {/* Name + bar */}
                    <div className="flex-1 min-w-0">
                      <p style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: 13, color: '#0F172A', margin: 0 }} className="truncate">{c.full_name}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex-1 h-1.5 rounded-full overflow-hidden" style={{ background: '#F1F5F9' }}>
                          <div className="h-full rounded-full transition-all duration-700"
                            style={{ width: `${pct}%`, background: pct >= 75 ? 'linear-gradient(90deg,#10B981,#34D399)' : pct >= 40 ? 'linear-gradient(90deg,#0284C7,#38BDF8)' : 'linear-gradient(90deg,#F59E0B,#FCD34D)' }} />
                        </div>
                        <span style={{ fontFamily: 'Poppins', fontSize: 10, color: '#94A3B8', flexShrink: 0 }}>{pct}%</span>
                      </div>
                    </div>
                    {/* Stats */}
                    <div className="flex items-center gap-4 flex-shrink-0 text-right">
                      <div>
                        <p style={{ fontFamily: 'Montserrat', fontWeight: 800, fontSize: 16, color: '#0284C7', margin: 0 }}>{c.total}</p>
                        <p style={{ fontFamily: 'Poppins', fontSize: 9, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.06em', margin: 0 }}>Total</p>
                      </div>
                      <div>
                        <p style={{ fontFamily: 'Montserrat', fontWeight: 800, fontSize: 16, color: '#10B981', margin: 0 }}>{c.completed}</p>
                        <p style={{ fontFamily: 'Poppins', fontSize: 9, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.06em', margin: 0 }}>Done</p>
                      </div>
                      <div>
                        <p style={{ fontFamily: 'Montserrat', fontWeight: 800, fontSize: 16, color: '#F59E0B', margin: 0 }}>{c.inProgress}</p>
                        <p style={{ fontFamily: 'Poppins', fontSize: 9, color: '#94A3B8', textTransform: 'uppercase', letterSpacing: '0.06em', margin: 0 }}>Active</p>
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
