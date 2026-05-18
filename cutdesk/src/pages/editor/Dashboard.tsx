import { useState } from 'react'
import { useVideos } from '../../hooks/useVideos'
import { useActivityLog } from '../../hooks/useActivityLog'
import Layout from '../../components/layout/Layout'
import VideoCard from '../../components/shared/VideoCard'
import VideoDetailModal from '../../components/shared/VideoDetailModal'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { format, subWeeks, startOfWeek, endOfWeek, isWithinInterval } from 'date-fns'
import { formatMinutes, timeAgo } from '../../lib/utils'

type Tab = 'Inbox' | 'My Queue' | 'In Progress'

export default function EditorDashboard() {
  const { data: allVideos = [] } = useVideos()
  const { data: activityLog = [] } = useActivityLog()
  const [tab, setTab] = useState<Tab>('Inbox')
  const [selectedVideo, setSelectedVideo] = useState<any>(null)

  const inQueue = allVideos.filter(v => v.status === 'In Editor Queue')
  const inProgress = allVideos.filter(v => v.status === 'Editing In Progress')
  const rawUploaded = allVideos.filter(v => v.status === 'Raw Uploaded')

  const thisWeekStart = startOfWeek(new Date())
  const thisWeekEnd = endOfWeek(new Date())
  const completedThisWeek = allVideos.filter(v =>
    ['Editing Complete', 'Published'].includes(v.status) &&
    isWithinInterval(new Date(v.updated_at), { start: thisWeekStart, end: thisWeekEnd })
  ).length

  const avgEditMins = allVideos.filter(v => v.actual_edit_time_minutes).length
    ? Math.round(allVideos.filter(v => v.actual_edit_time_minutes).reduce((s, v) => s + (v.actual_edit_time_minutes || 0), 0) / allVideos.filter(v => v.actual_edit_time_minutes).length)
    : 0

  const oldestPending = [...rawUploaded].sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())[0]

  const kpis = [
    { label: 'In Queue', value: inQueue.length },
    { label: 'In Progress', value: inProgress.length },
    { label: 'Completed This Week', value: completedThisWeek },
    { label: 'Avg Edit Time', value: formatMinutes(avgEditMins) },
    { label: 'Oldest Pending', value: oldestPending?.title ? oldestPending.title.slice(0, 20) + (oldestPending.title.length > 20 ? '…' : '') : '—' },
  ]

  const weeklyCompletions = Array.from({ length: 8 }, (_, i) => {
    const weekStart = startOfWeek(subWeeks(new Date(), 7 - i))
    const weekEnd = endOfWeek(subWeeks(new Date(), 7 - i))
    const count = allVideos.filter(v =>
      ['Editing Complete', 'Published'].includes(v.status) &&
      isWithinInterval(new Date(v.updated_at), { start: weekStart, end: weekEnd })
    ).length
    return { week: format(weekStart, 'MM/dd'), count }
  })

  const tabVideos: Record<Tab, any[]> = {
    'Inbox': rawUploaded,
    'My Queue': inQueue,
    'In Progress': inProgress,
  }

  return (
    <Layout title="Editor Dashboard">
      <div className="fade-in">
        {/* KPI row */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
          {kpis.map(k => (
            <div key={k.label} className="cd-card p-4 text-center">
              <p className="text-[#00A2CF] font-bold mb-1 truncate" style={{ fontFamily: 'Montserrat', fontWeight: 800, fontSize: k.label === 'Oldest Pending' ? 12 : 22 }}>{k.value}</p>
              <p className="text-white/50 text-xs" style={{ fontFamily: 'Poppins', fontWeight: 500 }}>{k.label}</p>
            </div>
          ))}
        </div>

        {/* 60/40 layout */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
          {/* Left 60% */}
          <div className="lg:col-span-3 cd-card overflow-hidden">
            <div className="flex border-b border-[rgba(0,162,207,0.15)]">
              {(['Inbox', 'My Queue', 'In Progress'] as Tab[]).map(t => (
                <button
                  key={t}
                  onClick={() => setTab(t)}
                  className="flex-1 py-3 text-xs border-b-2 transition-colors relative"
                  style={{ fontFamily: 'Poppins', fontWeight: 600, borderColor: tab === t ? '#00A2CF' : 'transparent', color: tab === t ? '#00A2CF' : 'rgba(245,248,250,0.4)' }}
                >
                  {t}
                  {tabVideos[t].length > 0 && (
                    <span className="absolute top-2 right-2 w-4 h-4 rounded-full text-[9px] flex items-center justify-center" style={{ background: '#00A2CF', color: '#fff', fontFamily: 'Poppins', fontWeight: 700 }}>
                      {tabVideos[t].length}
                    </span>
                  )}
                </button>
              ))}
            </div>
            <div className="p-4 space-y-2 max-h-96 overflow-y-auto">
              {tabVideos[tab].length === 0 ? (
                <p className="text-white/30 text-sm text-center py-8" style={{ fontFamily: 'Poppins' }}>Nothing here</p>
              ) : (
                tabVideos[tab].slice(0, 8).map(v => (
                  <VideoCard key={v.id} video={v} onClick={() => setSelectedVideo(v)} />
                ))
              )}
            </div>
          </div>

          {/* Right 40% */}
          <div className="lg:col-span-2 space-y-4">
            <div className="cd-card p-4">
              <h3 className="text-white text-sm mb-3" style={{ fontFamily: 'Montserrat', fontWeight: 800 }}>Completions Per Week</h3>
              <ResponsiveContainer width="100%" height={150}>
                <BarChart data={weeklyCompletions}>
                  <XAxis dataKey="week" stroke="transparent" tick={{ fontFamily: 'Poppins', fontSize: 10, fill: 'rgba(245,248,250,0.3)' }} />
                  <YAxis hide allowDecimals={false} />
                  <Tooltip contentStyle={{ background: '#003D52', border: '1px solid rgba(0,162,207,0.2)', borderRadius: 8, fontFamily: 'Poppins', fontSize: 12 }} />
                  <Bar dataKey="count" fill="#00A2CF" radius={[3, 3, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="cd-card p-4">
              <h3 className="text-white text-sm mb-3" style={{ fontFamily: 'Montserrat', fontWeight: 800 }}>Recent Activity</h3>
              <div className="space-y-2">
                {activityLog.slice(0, 5).map(entry => (
                  <div key={entry.id} className="flex justify-between gap-2">
                    <p className="text-white/60 text-xs truncate" style={{ fontFamily: 'Poppins', fontWeight: 500 }}>{entry.action}</p>
                    <p className="text-white/30 text-xs flex-shrink-0" style={{ fontFamily: 'Poppins' }}>{timeAgo(entry.created_at)}</p>
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
