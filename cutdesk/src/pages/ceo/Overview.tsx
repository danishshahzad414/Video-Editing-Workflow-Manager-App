import { useVideos } from '../../hooks/useVideos'
import Layout from '../../components/layout/Layout'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts'
import { format, subMonths, startOfMonth, endOfMonth } from 'date-fns'
import { PIPELINE_STAGES, stageColor, formatMinutes } from '../../lib/utils'
import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'

export default function CEOOverview() {
  const { data: allVideos = [] } = useVideos()
  const [profiles, setProfiles] = useState<any[]>([])
  const [lastUpdated] = useState(new Date().toLocaleString())

  useEffect(() => {
    supabase.from('profiles').select('id, full_name, role').eq('role', 'counselor').then(({ data }) => setProfiles(data || []))
  }, [])

  const thisMonthStart = startOfMonth(new Date())
  const inProgress = allVideos.filter(v => ['In Editor Queue', 'Editing In Progress', 'Re-record Submitted'].includes(v.status)).length
  const completedThisMonth = allVideos.filter(v => ['Editing Complete', 'Pending Social Review', 'Scheduled', 'Published'].includes(v.status) && new Date(v.updated_at) >= thisMonthStart).length
  const publishedThisMonth = allVideos.filter(v => v.status === 'Published' && new Date(v.updated_at) >= thisMonthStart).length

  const kpis = [
    { label: 'Total Uploaded All Time', value: allVideos.length },
    { label: 'In Progress Now', value: inProgress },
    { label: 'Completed This Month', value: completedThisMonth },
    { label: 'Published This Month', value: publishedThisMonth },
  ]

  // Upload volume chart (last 6 months)
  const uploadVolumeData = Array.from({ length: 6 }, (_, i) => {
    const d = subMonths(new Date(), 5 - i)
    const start = startOfMonth(d)
    const end = endOfMonth(d)
    const count = allVideos.filter(v => new Date(v.created_at) >= start && new Date(v.created_at) <= end).length
    return { month: format(d, 'MMM'), count }
  })

  // Pipeline funnel
  const funnelData = PIPELINE_STAGES.map(stage => ({
    stage: stage.length > 12 ? stage.slice(0, 12) + '…' : stage,
    count: allVideos.filter(v => v.status === stage).length,
    color: stageColor(stage),
  }))

  // Editor metrics
  const editedVideos = allVideos.filter(v => v.actual_edit_time_minutes)
  const avgEditMins = editedVideos.length ? Math.round(editedVideos.reduce((s, v) => s + (v.actual_edit_time_minutes || 0), 0) / editedVideos.length) : 0
  const queueDepth = allVideos.filter(v => ['Raw Uploaded', 'In Editor Queue', 'Editing In Progress'].includes(v.status)).length
  const completionRate = allVideos.length ? Math.round((allVideos.filter(v => ['Editing Complete', 'Published'].includes(v.status)).length / allVideos.length) * 100) : 0

  // Counselor leaderboard
  const leaderboard = profiles.map(p => {
    const pVideos = allVideos.filter(v => v.counselor_id === p.id)
    const completed = pVideos.filter(v => ['Editing Complete', 'Published', 'Scheduled', 'Pending Social Review'].includes(v.status)).length
    const inProg = pVideos.filter(v => ['In Editor Queue', 'Editing In Progress'].includes(v.status)).length
    return { ...p, total: pVideos.length, completed, inProgress: inProg }
  }).sort((a, b) => b.total - a.total)

  return (
    <Layout title="CEO Overview">
      <div className="fade-in space-y-6">
        {/* Last updated */}
        <div className="flex justify-end">
          <span className="text-white/30 text-xs" style={{ fontFamily: 'Poppins' }}>Last updated: {lastUpdated}</span>
        </div>

        {/* KPI cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {kpis.map(k => (
            <div key={k.label} className="cd-card p-5 text-center">
              <p className="text-[#00A2CF] text-3xl font-bold mb-1" style={{ fontFamily: 'Montserrat', fontWeight: 800 }}>{k.value}</p>
              <p className="text-white/50 text-xs" style={{ fontFamily: 'Poppins', fontWeight: 500 }}>{k.label}</p>
            </div>
          ))}
        </div>

        {/* Two col: chart + editor metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
          <div className="cd-card p-5">
            <h2 className="text-white text-sm mb-4" style={{ fontFamily: 'Montserrat', fontWeight: 800 }}>Upload Volume (Last 6 Months)</h2>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={uploadVolumeData}>
                <XAxis dataKey="month" stroke="rgba(245,248,250,0.2)" tick={{ fontFamily: 'Poppins', fontSize: 11, fill: 'rgba(245,248,250,0.4)' }} />
                <YAxis stroke="rgba(245,248,250,0.2)" tick={{ fontFamily: 'Poppins', fontSize: 11, fill: 'rgba(245,248,250,0.4)' }} allowDecimals={false} />
                <Tooltip contentStyle={{ background: '#003D52', border: '1px solid rgba(0,162,207,0.2)', borderRadius: 8, fontFamily: 'Poppins' }} />
                <Line type="monotone" dataKey="count" stroke="#00A2CF" strokeWidth={2} dot={{ fill: '#00A2CF', r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
          <div className="cd-card p-5">
            <h2 className="text-white text-sm mb-4" style={{ fontFamily: 'Montserrat', fontWeight: 800 }}>Editor Performance</h2>
            <div className="space-y-3">
              {[
                { label: 'Avg edit time per video', value: formatMinutes(avgEditMins) },
                { label: 'Queue depth', value: queueDepth },
                { label: 'Completion rate this month', value: `${completionRate}%` },
              ].map(m => (
                <div key={m.label} className="flex justify-between items-center p-3 rounded-lg" style={{ background: 'rgba(0,162,207,0.05)', border: '1px solid rgba(0,162,207,0.1)' }}>
                  <span className="text-white/60 text-sm" style={{ fontFamily: 'Poppins', fontWeight: 500 }}>{m.label}</span>
                  <span className="text-[#00A2CF] font-bold" style={{ fontFamily: 'Montserrat', fontWeight: 800 }}>{m.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Pipeline funnel */}
        <div className="cd-card p-5">
          <h2 className="text-white text-sm mb-4" style={{ fontFamily: 'Montserrat', fontWeight: 800 }}>Pipeline Funnel — Current Distribution</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={funnelData}>
              <XAxis dataKey="stage" stroke="rgba(245,248,250,0.2)" tick={{ fontFamily: 'Poppins', fontSize: 9, fill: 'rgba(245,248,250,0.4)' }} />
              <YAxis stroke="rgba(245,248,250,0.2)" tick={{ fontFamily: 'Poppins', fontSize: 10, fill: 'rgba(245,248,250,0.4)' }} allowDecimals={false} />
              <Tooltip contentStyle={{ background: '#003D52', border: '1px solid rgba(0,162,207,0.2)', borderRadius: 8, fontFamily: 'Poppins' }} />
              <Bar dataKey="count" radius={[4, 4, 0, 0]} fill="#00A2CF" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Counselor leaderboard */}
        <div className="cd-card overflow-hidden">
          <div className="px-5 py-3 border-b border-[rgba(0,162,207,0.15)]">
            <h2 className="text-white text-sm" style={{ fontFamily: 'Montserrat', fontWeight: 800 }}>Counselor Leaderboard</h2>
          </div>
          <table className="w-full">
            <thead>
              <tr style={{ background: 'rgba(0,162,207,0.05)' }}>
                {['Counselor', 'Total Uploaded', 'Completed', 'In Progress', 'Throughput'].map(h => (
                  <th key={h} className="px-4 py-2.5 text-left section-label">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {leaderboard.map((c, i) => (
                <tr key={c.id} style={{ borderBottom: '1px solid rgba(0,162,207,0.06)', background: i % 2 === 0 ? 'transparent' : 'rgba(0,61,82,0.3)' }}>
                  <td className="px-4 py-3 text-white text-sm font-semibold" style={{ fontFamily: 'Poppins', fontWeight: 600 }}>{c.full_name}</td>
                  <td className="px-4 py-3 text-white/60 text-sm" style={{ fontFamily: 'Poppins' }}>{c.total}</td>
                  <td className="px-4 py-3 text-[#10B981] text-sm font-semibold" style={{ fontFamily: 'Poppins', fontWeight: 600 }}>{c.completed}</td>
                  <td className="px-4 py-3 text-[#F59E0B] text-sm" style={{ fontFamily: 'Poppins' }}>{c.inProgress}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.1)' }}>
                        <div className="h-full rounded-full" style={{ width: `${c.total ? Math.round((c.completed / Math.max(c.total, 1)) * 100) : 0}%`, background: '#00A2CF' }} />
                      </div>
                      <span className="text-white/50 text-xs" style={{ fontFamily: 'Poppins' }}>{c.total ? Math.round((c.completed / Math.max(c.total, 1)) * 100) : 0}%</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  )
}
