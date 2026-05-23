import { useState, useEffect } from 'react'
import { useVideos } from '../../hooks/useVideos'
import { useActivityLog } from '../../hooks/useActivityLog'
import Layout from '../../components/layout/Layout'
import VideoCard from '../../components/shared/VideoCard'
import VideoDetailModal from '../../components/shared/VideoDetailModal'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { format, subWeeks, startOfWeek, endOfWeek, isWithinInterval } from 'date-fns'
import { formatMinutes, timeAgo } from '../../lib/utils'
import { Inbox, List, PlayCircle, TrendingUp, Activity } from 'lucide-react'

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

type Tab = 'Inbox' | 'My Queue' | 'In Progress'

export default function EditorDashboard() {
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

  const editedVids  = allVideos.filter(v => v.actual_edit_time_minutes)
  const avgEditMins = editedVids.length
    ? Math.round(editedVids.reduce((s, v) => s + (v.actual_edit_time_minutes || 0), 0) / editedVids.length)
    : 0

  const oldestPending = [...rawUploaded].sort((a, b) =>
    new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  )[0]

  const totalActive = inQueue.length + inProgress.length

  const weeklyData = Array.from({ length: 8 }, (_, i) => {
    const s = startOfWeek(subWeeks(new Date(), 7 - i))
    const e = endOfWeek(subWeeks(new Date(), 7 - i))
    return {
      week: format(s, 'MM/dd'),
      count: allVideos.filter(v =>
        ['Editing Complete', 'Published'].includes(v.status) &&
        isWithinInterval(new Date(v.updated_at), { start: s, end: e })
      ).length,
    }
  })

  const tabs = [
    { key: 'Inbox'       as Tab, icon: Inbox,      videos: rawUploaded, label: 'Inbox' },
    { key: 'My Queue'    as Tab, icon: List,        videos: inQueue,     label: 'My Queue' },
    { key: 'In Progress' as Tab, icon: PlayCircle,  videos: inProgress,  label: 'In Progress' },
  ]

  return (
    <Layout title="Editor Dashboard">
      <div className="fade-in space-y-5">

        {/* ── Page header ── */}
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 style={{ fontFamily: 'Montserrat', fontWeight: 900, fontSize: 22, color: '#111827', margin: 0 }}>
              Edit Suite
            </h1>
            <p style={{ fontFamily: 'Poppins', fontWeight: 400, fontSize: 13, color: '#94A3B8', margin: '3px 0 0' }}>
              {totalActive > 0
                ? `${totalActive} video${totalActive > 1 ? 's' : ''} active · ${completedThisWeek} done this week`
                : `Queue clear · ${completedThisWeek} completed this week`}
            </p>
          </div>
          {totalActive > 0 && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl flex-shrink-0"
              style={{ background: '#FFFBEB', border: '1px solid #FDE68A' }}>
              <div className="w-1.5 h-1.5 rounded-full pulse-dot" style={{ background: '#F59E0B' }} />
              <span style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: 12, color: '#B45309' }}>
                {totalActive} Active
              </span>
            </div>
          )}
        </div>

        {/* ── Stats strip ── */}
        <div className="stats-strip stagger-children" style={{ gridTemplateColumns: 'repeat(5, 1fr)' }}>
          {[
            { label: 'In Queue',       render: () => <Num n={inQueue.length} /> },
            { label: 'Editing Now',    render: () => <Num n={inProgress.length} /> },
            { label: 'Done This Week', render: () => <Num n={completedThisWeek} /> },
            { label: 'Avg Edit Time',  render: () => <span style={{ fontSize: 18 }}>{formatMinutes(avgEditMins)}</span> },
            {
              label: 'Oldest Pending',
              render: () => (
                <span className="stat-num-sm">
                  {oldestPending?.title
                    ? oldestPending.title.slice(0, 18) + (oldestPending.title.length > 18 ? '…' : '')
                    : '—'}
                </span>
              ),
            },
          ].map((s, i) => (
            <div key={s.label} className="stats-strip-item fade-in" style={{ animationDelay: `${i * 40}ms` }}>
              <span className="stat-lbl">{s.label}</span>
              <p className="stat-num">{s.render()}</p>
            </div>
          ))}
        </div>

        {/* ── Main layout ── */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">

          {/* Video tabs — left 60% */}
          <div className="lg:col-span-3 cd-card overflow-hidden">
            {/* Tab bar */}
            <div className="flex" style={{ borderBottom: '1px solid rgba(0,0,0,0.06)', background: '#FAFBFD' }}>
              {tabs.map(t => {
                const active = tab === t.key
                return (
                  <button
                    key={t.key}
                    onClick={() => setTab(t.key)}
                    className="flex-1 flex items-center justify-center gap-1.5 py-3 relative transition-colors duration-150"
                    style={{
                      fontFamily: 'Poppins',
                      fontWeight: active ? 700 : 500,
                      fontSize: 12,
                      color: active ? '#0284C7' : '#9CA3AF',
                      background: 'transparent',
                      border: 'none',
                      borderBottom: `2px solid ${active ? '#0284C7' : 'transparent'}`,
                      cursor: 'pointer',
                    }}>
                    <t.icon size={12} />
                    {t.key}
                    {t.videos.length > 0 && (
                      <span className="w-4 h-4 rounded-full flex items-center justify-center"
                        style={{
                          background: active ? '#EFF6FF' : '#F1F5F9',
                          color: active ? '#0284C7' : '#9CA3AF',
                          fontFamily: 'Poppins', fontWeight: 700, fontSize: 9,
                        }}>
                        {t.videos.length}
                      </span>
                    )}
                  </button>
                )
              })}
            </div>

            {/* Video list */}
            <div className="divide-y max-h-[380px] overflow-y-auto" style={{ borderColor: 'rgba(0,0,0,0.04)' }}>
              {(tab === 'Inbox' ? rawUploaded : tab === 'My Queue' ? inQueue : inProgress).length === 0 ? (
                <div className="empty-state">
                  <div className="empty-state-icon"><Inbox size={20} style={{ color: '#9CA3AF' }} /></div>
                  <p className="empty-state-title" style={{ fontSize: 14 }}>Nothing here</p>
                </div>
              ) : (
                (tab === 'Inbox' ? rawUploaded : tab === 'My Queue' ? inQueue : inProgress)
                  .slice(0, 8).map(v => (
                    <div key={v.id} className="interactive-row px-4">
                      <VideoCard video={v} onClick={() => setSelectedVideo(v)} />
                    </div>
                  ))
              )}
            </div>
          </div>

          {/* Right panel — 40% */}
          <div className="lg:col-span-2 space-y-4">

            {/* Completions chart */}
            <div className="cd-card overflow-hidden">
              <div className="section-header">
                <div className="section-header-icon" style={{ background: '#EFF6FF' }}>
                  <TrendingUp size={13} style={{ color: '#0284C7' }} />
                </div>
                <span className="page-section-title">Completions / Week</span>
              </div>
              <div className="p-4">
                <ResponsiveContainer width="100%" height={130}>
                  <BarChart data={weeklyData} barSize={11}>
                    <XAxis dataKey="week" stroke="transparent" tick={{ fontFamily: 'Poppins', fontSize: 9, fill: '#9CA3AF' }} />
                    <YAxis hide allowDecimals={false} />
                    <Tooltip
                      contentStyle={{ background: '#111827', border: 'none', borderRadius: 8, fontFamily: 'Poppins', fontSize: 11, boxShadow: '0 8px 24px rgba(0,0,0,0.25)' }}
                      labelStyle={{ color: '#9CA3AF', marginBottom: 3 }}
                      itemStyle={{ color: '#fff' }}
                      cursor={{ fill: 'rgba(2,132,199,0.06)' }}
                    />
                    <Bar dataKey="count" fill="#0284C7" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Recent activity */}
            <div className="cd-card overflow-hidden">
              <div className="section-header">
                <div className="section-header-icon" style={{ background: '#F1F5F9' }}>
                  <Activity size={13} style={{ color: '#6B7280' }} />
                </div>
                <span className="page-section-title">Recent Activity</span>
              </div>
              {activityLog.length === 0 ? (
                <p className="p-5 text-center" style={{ fontFamily: 'Poppins', fontSize: 12, color: '#9CA3AF' }}>No recent activity</p>
              ) : (
                <div className="divide-y" style={{ borderColor: 'rgba(0,0,0,0.04)' }}>
                  {activityLog.slice(0, 5).map((entry, i) => (
                    <div key={entry.id}
                      className="flex items-center justify-between gap-3 px-4 py-3 hover:bg-slate-50 transition-colors fade-in"
                      style={{ animationDelay: `${i * 30}ms` }}>
                      <p style={{ fontFamily: 'Poppins', fontWeight: 500, fontSize: 12, color: '#374151', margin: 0 }} className="truncate">
                        {entry.action}
                      </p>
                      <p style={{ fontFamily: 'Poppins', fontSize: 10, color: '#9CA3AF', flexShrink: 0, margin: 0 }}>
                        {timeAgo(entry.created_at)}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {selectedVideo && <VideoDetailModal video={selectedVideo} onClose={() => setSelectedVideo(null)} />}
    </Layout>
  )
}
