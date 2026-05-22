import { useState } from 'react'
import { useVideos } from '../../hooks/useVideos'
import { useActivityLog } from '../../hooks/useActivityLog'
import { useAuth } from '../../context/AuthContext'
import Layout from '../../components/layout/Layout'
import VideoCard from '../../components/shared/VideoCard'
import VideoDetailModal from '../../components/shared/VideoDetailModal'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { format, subWeeks, startOfWeek, endOfWeek, isWithinInterval } from 'date-fns'
import { formatMinutes, timeAgo } from '../../lib/utils'
import { Inbox, List, PlayCircle, Clock, CheckCircle2, TrendingUp, Activity, Zap, Scissors } from 'lucide-react'

type Tab = 'Inbox' | 'My Queue' | 'In Progress'

export default function EditorDashboard() {
  const { profile } = useAuth()
  const { data: allVideos = [] } = useVideos()
  const { data: activityLog = [] } = useActivityLog()
  const [tab, setTab] = useState<Tab>('Inbox')
  const [selectedVideo, setSelectedVideo] = useState<any>(null)

  const inQueue     = allVideos.filter(v => v.status === 'In Editor Queue')
  const inProgress  = allVideos.filter(v => v.status === 'Editing In Progress')
  const rawUploaded = allVideos.filter(v => v.status === 'Raw Uploaded')

  const thisWeekStart = startOfWeek(new Date())
  const thisWeekEnd   = endOfWeek(new Date())
  const completedThisWeek = allVideos.filter(v =>
    ['Editing Complete', 'Published'].includes(v.status) &&
    isWithinInterval(new Date(v.updated_at), { start: thisWeekStart, end: thisWeekEnd })
  ).length

  const editedVids = allVideos.filter(v => v.actual_edit_time_minutes)
  const avgEditMins = editedVids.length
    ? Math.round(editedVids.reduce((s, v) => s + (v.actual_edit_time_minutes || 0), 0) / editedVids.length)
    : 0

  const oldestPending = [...rawUploaded].sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())[0]
  const totalActive   = inQueue.length + inProgress.length
  const firstName     = profile?.full_name?.split(' ')[0] || 'Editor'

  const kpis = [
    { label: 'In Queue',       value: inQueue.length,          color: '#0284C7', bg: '#EFF6FF', icon: Inbox },
    { label: 'In Progress',    value: inProgress.length,       color: '#F59E0B', bg: '#FFFBEB', icon: PlayCircle },
    { label: 'Done This Week', value: completedThisWeek,       color: '#10B981', bg: '#ECFDF5', icon: CheckCircle2 },
    { label: 'Avg Edit Time',  value: formatMinutes(avgEditMins), color: '#6366F1', bg: '#EEF2FF', icon: Clock },
    {
      label: 'Oldest Pending',
      value: oldestPending?.title ? oldestPending.title.slice(0, 16) + (oldestPending.title.length > 16 ? '…' : '') : '—',
      color: '#EF4444', bg: '#FFF1F2', icon: Zap,
    },
  ]

  const weeklyCompletions = Array.from({ length: 8 }, (_, i) => {
    const s = startOfWeek(subWeeks(new Date(), 7 - i))
    const e = endOfWeek(subWeeks(new Date(), 7 - i))
    const count = allVideos.filter(v =>
      ['Editing Complete', 'Published'].includes(v.status) &&
      isWithinInterval(new Date(v.updated_at), { start: s, end: e })
    ).length
    return { week: format(s, 'MM/dd'), count }
  })

  const tabConfig = [
    { key: 'Inbox'       as Tab, icon: Inbox,      videos: rawUploaded, color: '#0284C7', activeGlow: 'rgba(2,132,199,0.35)' },
    { key: 'My Queue'    as Tab, icon: List,        videos: inQueue,     color: '#F59E0B', activeGlow: 'rgba(245,158,11,0.35)' },
    { key: 'In Progress' as Tab, icon: PlayCircle,  videos: inProgress,  color: '#10B981', activeGlow: 'rgba(16,185,129,0.35)' },
  ]

  const tabVideos: Record<Tab, any[]> = {
    'Inbox':       rawUploaded,
    'My Queue':    inQueue,
    'In Progress': inProgress,
  }

  return (
    <Layout title="Editor Dashboard">
      <div className="fade-in space-y-6">

        {/* ── Hero ── */}
        <div className="relative rounded-2xl overflow-hidden p-6 md:p-8"
          style={{ background: 'linear-gradient(135deg, #1E1B4B 0%, #312E81 40%, #4338CA 75%, #4F46E5 100%)' }}>
          <div className="absolute inset-0 opacity-[0.07]"
            style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '22px 22px' }} />
          <div className="absolute -top-14 -right-14 w-56 h-56 rounded-full opacity-20"
            style={{ background: 'radial-gradient(circle, #818CF8, transparent)' }} />
          <div className="absolute -bottom-8 -left-8 w-36 h-36 rounded-full opacity-10"
            style={{ background: 'radial-gradient(circle, #A5B4FC, transparent)' }} />

          <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-5">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.25)' }}>
                <Scissors size={22} className="text-white" />
              </div>
              <div>
                <p style={{ fontFamily: 'Poppins', fontWeight: 400, fontSize: 13, color: 'rgba(255,255,255,0.55)', margin: 0 }}>Welcome back</p>
                <h1 style={{ fontFamily: 'Montserrat', fontWeight: 900, fontSize: 24, color: '#fff', margin: '2px 0 8px' }}>
                  {firstName}'s Edit Suite
                </h1>
                <div className="flex items-center gap-2 flex-wrap">
                  {totalActive > 0 ? (
                    <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg"
                      style={{ background: 'rgba(251,191,36,0.22)', border: '1px solid rgba(251,191,36,0.45)' }}>
                      <div className="w-1.5 h-1.5 rounded-full pulse-dot" style={{ background: '#FBBF24' }} />
                      <span style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: 11, color: '#FEF3C7' }}>{totalActive} Active</span>
                    </span>
                  ) : (
                    <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg"
                      style={{ background: 'rgba(16,185,129,0.22)', border: '1px solid rgba(16,185,129,0.45)' }}>
                      <div className="w-1.5 h-1.5 rounded-full pulse-dot" style={{ background: '#10B981' }} />
                      <span style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: 11, color: '#D1FAE5' }}>Queue Clear</span>
                    </span>
                  )}
                  <span className="px-2.5 py-1 rounded-lg"
                    style={{ background: 'rgba(255,255,255,0.12)', fontFamily: 'Poppins', fontWeight: 600, fontSize: 11, color: 'rgba(255,255,255,0.85)' }}>
                    ✓ {completedThisWeek} done this week
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ── KPI row ── */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 stagger-children">
          {kpis.map((k, i) => (
            <div key={k.label} className="stat-card p-4 fade-in" style={{ animationDelay: `${i * 55}ms` }}>
              <div className="absolute top-0 left-4 right-4 h-0.5 rounded-full" style={{ background: `linear-gradient(90deg, ${k.color}, transparent)` }} />
              <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-3" style={{ background: k.bg }}>
                <k.icon size={14} style={{ color: k.color }} />
              </div>
              <p className="truncate" style={{ fontFamily: 'Montserrat', fontWeight: 900, fontSize: k.label === 'Oldest Pending' ? 11 : 24, color: k.color, margin: 0 }}>{k.value}</p>
              <p style={{ fontFamily: 'Poppins', fontWeight: 500, fontSize: 10, color: '#64748B', marginTop: 3 }}>{k.label}</p>
            </div>
          ))}
        </div>

        {/* ── 60/40 layout ── */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">

          {/* Left 60% — tabs + video list */}
          <div className="lg:col-span-3 cd-card overflow-hidden">
            {/* Pill tab bar */}
            <div className="flex gap-1.5 p-2.5" style={{ borderBottom: '1px solid #F1F5F9', background: '#FAFAFA' }}>
              {tabConfig.map(t => {
                const active = tab === t.key
                return (
                  <button
                    key={t.key}
                    onClick={() => setTab(t.key)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold transition-all duration-200"
                    style={{
                      fontFamily: 'Poppins', fontWeight: 600, fontSize: 12,
                      background: active ? t.color : 'transparent',
                      color: active ? '#fff' : '#94A3B8',
                      boxShadow: active ? `0 3px 10px ${t.activeGlow}` : 'none',
                      transform: active ? 'translateY(-1px)' : 'none',
                    }}>
                    <t.icon size={11} />
                    {t.key}
                    {t.videos.length > 0 && (
                      <span className="w-4 h-4 rounded-full flex items-center justify-center text-[9px]"
                        style={{ background: active ? 'rgba(255,255,255,0.25)' : '#E2E8F0', color: active ? '#fff' : '#64748B', fontFamily: 'Poppins', fontWeight: 700 }}>
                        {t.videos.length}
                      </span>
                    )}
                  </button>
                )
              })}
            </div>

            <div className="divide-y max-h-96 overflow-y-auto" style={{ borderColor: '#F8FAFC' }}>
              {tabVideos[tab].length === 0 ? (
                <div className="p-12 flex flex-col items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: '#F1F5F9' }}>
                    <Inbox size={20} className="text-slate-400" />
                  </div>
                  <p style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: 13, color: '#94A3B8' }}>Nothing here right now</p>
                </div>
              ) : (
                tabVideos[tab].slice(0, 8).map(v => (
                  <div key={v.id} className="interactive-row px-4">
                    <VideoCard video={v} onClick={() => setSelectedVideo(v)} />
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Right 40% */}
          <div className="lg:col-span-2 space-y-4">
            {/* Completions chart */}
            <div className="cd-card p-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: '#EEF2FF' }}>
                  <TrendingUp size={13} style={{ color: '#6366F1' }} />
                </div>
                <h3 style={{ fontFamily: 'Montserrat', fontWeight: 800, fontSize: 13, color: '#0F172A', margin: 0 }}>Completions / Week</h3>
              </div>
              <ResponsiveContainer width="100%" height={140}>
                <BarChart data={weeklyCompletions} barSize={13}>
                  <XAxis dataKey="week" stroke="transparent" tick={{ fontFamily: 'Poppins', fontSize: 9, fill: '#94A3B8' }} />
                  <YAxis hide allowDecimals={false} />
                  <Tooltip
                    contentStyle={{ background: '#1E1B4B', border: 'none', borderRadius: 10, fontFamily: 'Poppins', fontSize: 11, boxShadow: '0 8px 24px rgba(0,0,0,0.2)' }}
                    labelStyle={{ color: '#A5B4FC', fontWeight: 600, marginBottom: 4 }}
                    itemStyle={{ color: '#fff' }}
                    cursor={{ fill: 'rgba(99,102,241,0.07)' }}
                  />
                  <Bar dataKey="count" fill="#6366F1" radius={[5, 5, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Recent activity */}
            <div className="cd-card p-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: '#F1F5F9' }}>
                  <Activity size={13} className="text-slate-400" />
                </div>
                <h3 style={{ fontFamily: 'Montserrat', fontWeight: 800, fontSize: 13, color: '#0F172A', margin: 0 }}>Recent Activity</h3>
              </div>
              <div className="space-y-2">
                {activityLog.length === 0 ? (
                  <p style={{ fontFamily: 'Poppins', fontSize: 12, color: '#94A3B8', textAlign: 'center', padding: '16px 0' }}>No recent activity</p>
                ) : activityLog.slice(0, 5).map((entry, i) => (
                  <div key={entry.id} className="flex items-center justify-between gap-2 p-2.5 rounded-xl fade-in"
                    style={{ background: '#F8FAFC', border: '1px solid #F1F5F9', animationDelay: `${i * 40}ms` }}>
                    <p style={{ fontFamily: 'Poppins', fontWeight: 500, fontSize: 11, color: '#475569', margin: 0 }} className="truncate">{entry.action}</p>
                    <p style={{ fontFamily: 'Poppins', fontSize: 10, color: '#94A3B8', flexShrink: 0, margin: 0 }}>{timeAgo(entry.created_at)}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {selectedVideo && <VideoDetailModal video={selectedVideo} onClose={() => setSelectedVideo(null)} />}
    </Layout>
  )
}
