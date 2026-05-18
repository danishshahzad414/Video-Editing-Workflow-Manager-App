import { useState, useEffect } from 'react'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../lib/supabase'
import { PLATFORMS, PLATFORM_COLORS, formatDate, calcEngagement } from '../../lib/utils'
import Layout from '../../components/layout/Layout'
import { LineChart, Line, XAxis, YAxis, Tooltip, Legend, ResponsiveContainer } from 'recharts'
import toast from 'react-hot-toast'

interface Perf {
  id: string; video_id: string; platform: string; published_date: string
  views: number; likes: number; comments: number; notes: string | null; updated_at: string
  video?: { title: string }
}

export default function Performance() {
  const { profile } = useAuth()
  const [perfs, setPerfs] = useState<Perf[]>([])
  const [editing, setEditing] = useState<Record<string, any>>({})
  const [platFilter, setPlatFilter] = useState<string[]>([])
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')

  useEffect(() => { fetchPerfs() }, [])

  async function fetchPerfs() {
    const { data } = await supabase.from('post_performance').select('*, video:videos!post_performance_video_id_fkey(title)').order('published_date', { ascending: false })
    setPerfs(data as Perf[] || [])
  }

  async function saveEdit(id: string) {
    const updates = editing[id]
    if (!updates) return
    await supabase.from('post_performance').update({ ...updates, updated_by: profile!.id, updated_at: new Date().toISOString() }).eq('id', id)
    setEditing(prev => { const copy = { ...prev }; delete copy[id]; return copy })
    fetchPerfs()
    toast.success('Performance updated!')
  }

  function startEdit(p: Perf, field: string, value: any) {
    setEditing(prev => ({ ...prev, [p.id]: { ...(prev[p.id] || {}), [field]: value } }))
  }

  const filtered = perfs.filter(p => {
    const matchPlat = platFilter.length === 0 || platFilter.includes(p.platform)
    const matchFrom = !dateFrom || p.published_date >= dateFrom
    const matchTo = !dateTo || p.published_date <= dateTo
    return matchPlat && matchFrom && matchTo
  })

  const totalViews = filtered.reduce((s, p) => s + (p.views || 0), 0)
  const totalLikes = filtered.reduce((s, p) => s + (p.likes || 0), 0)
  const avgEng = filtered.length ? filtered.reduce((s, p) => s + (p.views ? ((p.likes + p.comments) / p.views) * 100 : 0), 0) / filtered.length : 0
  const bestPerf = filtered.reduce<Perf | null>((best, p) => {
    if (!p.views) return best
    const eng = ((p.likes + p.comments) / p.views) * 100
    if (!best || !best.views || eng > ((best.likes + best.comments) / best.views) * 100) return p
    return best
  }, null)

  // Chart data grouped by date and platform
  const chartDates = [...new Set(filtered.map(p => p.published_date))].sort()
  const chartData = chartDates.map(date => {
    const point: any = { date }
    for (const plat of PLATFORMS) {
      const match = filtered.find(p => p.published_date === date && p.platform === plat)
      point[plat] = match?.views || 0
    }
    return point
  })

  function engColor(e: string) {
    if (e === '—') return 'rgba(245,248,250,0.3)'
    const n = parseFloat(e)
    return n > 5 ? '#10B981' : n >= 2 ? '#F59E0B' : '#EF4444'
  }

  return (
    <Layout title="Performance">
      <div className="fade-in space-y-5">
        {/* Filters */}
        <div className="cd-card p-4 flex gap-4 flex-wrap items-center">
          <div className="flex gap-1.5">
            {PLATFORMS.map(p => (
              <button key={p} onClick={() => setPlatFilter(prev => prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p])} className="px-3 py-1 rounded-full text-xs" style={{ background: platFilter.includes(p) ? PLATFORM_COLORS[p] : 'rgba(255,255,255,0.08)', color: '#fff', fontFamily: 'Poppins', fontWeight: 600 }}>{p}</button>
            ))}
          </div>
          <input type="date" className="cd-input" style={{ height: 36, width: 150, fontSize: 12 }} value={dateFrom} onChange={e => setDateFrom(e.target.value)} />
          <span className="text-white/30 text-xs" style={{ fontFamily: 'Poppins' }}>to</span>
          <input type="date" className="cd-input" style={{ height: 36, width: 150, fontSize: 12 }} value={dateTo} onChange={e => setDateTo(e.target.value)} />
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: 'Total Views', value: totalViews.toLocaleString() },
            { label: 'Total Likes', value: totalLikes.toLocaleString() },
            { label: 'Avg Engagement', value: `${avgEng.toFixed(1)}%` },
            { label: 'Best Performing', value: bestPerf ? (bestPerf.video as any)?.title?.slice(0, 20) + '…' : '—' },
          ].map(k => (
            <div key={k.label} className="cd-card p-4 text-center">
              <p className="text-[#00A2CF] font-bold mb-1 truncate" style={{ fontFamily: 'Montserrat', fontWeight: 800, fontSize: 20 }}>{k.value}</p>
              <p className="text-white/50 text-xs" style={{ fontFamily: 'Poppins', fontWeight: 500 }}>{k.label}</p>
            </div>
          ))}
        </div>

        {/* Line chart */}
        {chartData.length > 0 && (
          <div className="cd-card p-5">
            <h2 className="text-white text-sm mb-4" style={{ fontFamily: 'Montserrat', fontWeight: 800 }}>Views Over Time</h2>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={chartData}>
                <XAxis dataKey="date" stroke="rgba(245,248,250,0.2)" tick={{ fontFamily: 'Poppins', fontSize: 10, fill: 'rgba(245,248,250,0.4)' }} />
                <YAxis stroke="rgba(245,248,250,0.2)" tick={{ fontFamily: 'Poppins', fontSize: 10, fill: 'rgba(245,248,250,0.4)' }} />
                <Tooltip contentStyle={{ background: '#003D52', border: '1px solid rgba(0,162,207,0.2)', borderRadius: 8, fontFamily: 'Poppins' }} />
                <Legend />
                {PLATFORMS.filter(p => platFilter.length === 0 || platFilter.includes(p)).map(p => (
                  <Line key={p} type="monotone" dataKey={p} stroke={PLATFORM_COLORS[p]} strokeWidth={2} dot={false} />
                ))}
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}

        {/* Table */}
        <div className="cd-card overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead>
                <tr style={{ background: 'rgba(0,162,207,0.05)' }}>
                  {['Title', 'Platform', 'Published', 'Views', 'Likes', 'Comments', 'Engagement %', 'Notes'].map(h => (
                    <th key={h} className="px-4 py-2.5 text-left section-label">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={8} className="px-4 py-12 text-center text-white/30" style={{ fontFamily: 'Poppins' }}>No performance data yet</td></tr>
                ) : filtered.map((p, i) => {
                  const ed = editing[p.id] || {}
                  const views = ed.views ?? p.views
                  const likes = ed.likes ?? p.likes
                  const comments = ed.comments ?? p.comments
                  const notes = ed.notes ?? p.notes ?? ''
                  const eng = calcEngagement(views, likes, comments)

                  return (
                    <tr key={p.id} style={{ borderBottom: '1px solid rgba(0,162,207,0.06)', background: i % 2 === 0 ? 'transparent' : 'rgba(0,61,82,0.3)' }}>
                      <td className="px-4 py-3 text-white text-xs max-w-36 truncate" style={{ fontFamily: 'Poppins', fontWeight: 500 }}>{(p.video as any)?.title || '—'}</td>
                      <td className="px-4 py-3 text-white/60 text-xs" style={{ fontFamily: 'Poppins' }}>{p.platform}</td>
                      <td className="px-4 py-3 text-white/60 text-xs" style={{ fontFamily: 'Poppins' }}>{formatDate(p.published_date)}</td>
                      {['views', 'likes', 'comments'].map(field => (
                        <td key={field} className="px-4 py-3">
                          <input
                            type="number" min={0}
                            value={ed[field] ?? (p as any)[field]}
                            onChange={e => startEdit(p, field, Number(e.target.value))}
                            onBlur={() => { if (editing[p.id]) saveEdit(p.id) }}
                            className="w-20 text-center text-xs rounded px-1"
                            style={{ background: 'rgba(0,162,207,0.1)', border: 'none', color: '#fff', height: 28, fontFamily: 'Poppins', fontWeight: 500 }}
                          />
                        </td>
                      ))}
                      <td className="px-4 py-3 text-xs font-semibold" style={{ color: engColor(eng), fontFamily: 'Poppins' }}>{eng}</td>
                      <td className="px-4 py-3">
                        <input
                          value={notes}
                          onChange={e => startEdit(p, 'notes', e.target.value)}
                          onBlur={() => { if (editing[p.id]) saveEdit(p.id) }}
                          placeholder="Notes..."
                          className="w-full text-xs px-2 rounded"
                          style={{ background: 'rgba(0,162,207,0.05)', border: '1px solid rgba(0,162,207,0.1)', color: 'rgba(245,248,250,0.6)', height: 28, fontFamily: 'Poppins', outline: 'none' }}
                        />
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </Layout>
  )
}
