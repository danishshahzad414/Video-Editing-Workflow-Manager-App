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
    if (e === '—') return '#94A3B8'
    const n = parseFloat(e)
    return n > 5 ? '#10B981' : n >= 2 ? '#F59E0B' : '#EF4444'
  }

  return (
    <Layout title="Performance">
      <div className="fade-in space-y-5">
        {/* Filters */}
        <div className="cd-card p-4 flex gap-4 flex-wrap items-center">
          <div className="flex gap-1.5 flex-wrap">
            {PLATFORMS.map(p => (
              <button key={p} onClick={() => setPlatFilter(prev => prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p])} className="px-3 py-1 rounded-full text-xs transition-all" style={{ background: platFilter.includes(p) ? PLATFORM_COLORS[p] : '#F1F5F9', color: platFilter.includes(p) ? '#fff' : '#475569', fontFamily: 'Plus Jakarta Sans', fontWeight: 600, border: '1px solid #E2E8F0' }}>{p}</button>
            ))}
          </div>
          <input type="date" className="cd-input" style={{ height: 36, width: 150, fontSize: 12 }} value={dateFrom} onChange={e => setDateFrom(e.target.value)} />
          <span className="text-xs" style={{ fontFamily: 'Plus Jakarta Sans', color: '#94A3B8' }}>to</span>
          <input type="date" className="cd-input" style={{ height: 36, width: 150, fontSize: 12 }} value={dateTo} onChange={e => setDateTo(e.target.value)} />
        </div>

        {/* KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 stagger-children">
          {[
            { label: 'Total Views', value: totalViews.toLocaleString(), color: '#0284C7' },
            { label: 'Total Likes', value: totalLikes.toLocaleString(), color: '#6366F1' },
            { label: 'Avg Engagement', value: `${avgEng.toFixed(1)}%`, color: '#10B981' },
            { label: 'Best Performing', value: bestPerf ? (bestPerf.video as any)?.title?.slice(0, 20) + '…' : '—', color: '#F59E0B' },
          ].map(k => (
            <div key={k.label} className="stat-card p-4 text-center fade-in">
              <p className="font-bold mb-1 truncate" style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 800, fontSize: 20, color: k.color }}>{k.value}</p>
              <p className="text-xs" style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 500, color: '#475569' }}>{k.label}</p>
            </div>
          ))}
        </div>

        {/* Line chart */}
        {chartData.length > 0 && (
          <div className="cd-card p-5">
            <h2 className="text-base mb-4" style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 800, color: '#0F172A' }}>Views Over Time</h2>
            <ResponsiveContainer width="100%" height={280}>
              <LineChart data={chartData}>
                <XAxis dataKey="date" stroke="#E2E8F0" tick={{ fontFamily: 'Plus Jakarta Sans', fontSize: 10, fill: '#94A3B8' }} />
                <YAxis stroke="#E2E8F0" tick={{ fontFamily: 'Plus Jakarta Sans', fontSize: 10, fill: '#94A3B8' }} />
                <Tooltip contentStyle={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 8, fontFamily: 'Plus Jakarta Sans' }} labelStyle={{ color: '#0F172A' }} itemStyle={{ color: '#0F172A' }} />
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
                <tr style={{ background: '#F8FAFC' }}>
                  {['Title', 'Platform', 'Published', 'Views', 'Likes', 'Comments', 'Engagement %', 'Notes'].map(h => (
                    <th key={h} className="px-4 py-2.5 text-left section-label">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={8} className="px-4 py-12 text-center" style={{ fontFamily: 'Plus Jakarta Sans', color: '#94A3B8' }}>No performance data yet</td></tr>
                ) : filtered.map((p, i) => {
                  const ed = editing[p.id] || {}
                  const views = ed.views ?? p.views
                  const likes = ed.likes ?? p.likes
                  const comments = ed.comments ?? p.comments
                  const notes = ed.notes ?? p.notes ?? ''
                  const eng = calcEngagement(views, likes, comments)

                  return (
                    <tr key={p.id} className="table-row-hover" style={{ borderBottom: '1px solid #F1F5F9', background: i % 2 === 0 ? 'transparent' : '#FAFAFA' }}>
                      <td className="px-4 py-3 text-xs max-w-36 truncate" style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 500, color: '#0F172A' }}>{(p.video as any)?.title || '—'}</td>
                      <td className="px-4 py-3 text-xs" style={{ fontFamily: 'Plus Jakarta Sans', color: '#475569' }}>{p.platform}</td>
                      <td className="px-4 py-3 text-xs" style={{ fontFamily: 'Plus Jakarta Sans', color: '#475569' }}>{formatDate(p.published_date)}</td>
                      {['views', 'likes', 'comments'].map(field => (
                        <td key={field} className="px-4 py-3">
                          <input
                            type="number" min={0}
                            value={ed[field] ?? (p as any)[field]}
                            onChange={e => startEdit(p, field, Number(e.target.value))}
                            onBlur={() => { if (editing[p.id]) saveEdit(p.id) }}
                            className="w-20 text-center text-xs rounded px-1"
                            style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', color: '#0F172A', height: 28, fontFamily: 'Plus Jakarta Sans', fontWeight: 500, outline: 'none' }}
                          />
                        </td>
                      ))}
                      <td className="px-4 py-3 text-xs font-semibold" style={{ color: engColor(eng), fontFamily: 'Plus Jakarta Sans' }}>{eng}</td>
                      <td className="px-4 py-3">
                        <input
                          value={notes}
                          onChange={e => startEdit(p, 'notes', e.target.value)}
                          onBlur={() => { if (editing[p.id]) saveEdit(p.id) }}
                          placeholder="Notes..."
                          className="w-full text-xs px-2 rounded"
                          style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', color: '#475569', height: 28, fontFamily: 'Plus Jakarta Sans', outline: 'none' }}
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
