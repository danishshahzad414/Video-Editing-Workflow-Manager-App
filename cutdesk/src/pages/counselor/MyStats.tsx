import { useVideos } from '../../hooks/useVideos'
import Layout from '../../components/layout/Layout'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { format, subMonths, startOfMonth, endOfMonth } from 'date-fns'
import { formatDate } from '../../lib/utils'
import StatusBadge from '../../components/shared/StatusBadge'

export default function MyStats() {
  const { data: videos = [] } = useVideos()

  const totalUploaded = videos.length
  const inEditing = videos.filter(v => ['In Editor Queue', 'Editing In Progress'].includes(v.status)).length
  const published = videos.filter(v => v.status === 'Published').length
  const withRevisions = videos.filter(v => v.revision_rounds > 0).length
  const revisionRate = totalUploaded ? Math.round((withRevisions / totalUploaded) * 100) : 0

  // Monthly upload chart
  const months = Array.from({ length: 6 }, (_, i) => {
    const d = subMonths(new Date(), 5 - i)
    const start = startOfMonth(d)
    const end = endOfMonth(d)
    const count = videos.filter(v => {
      const date = new Date(v.created_at)
      return date >= start && date <= end
    }).length
    return { month: format(d, 'MMM'), count }
  })

  const kpis = [
    { label: 'Total Uploaded', value: totalUploaded, color: '#0284C7' },
    { label: 'In Editing', value: inEditing, color: '#6366F1' },
    { label: 'Published', value: published, color: '#10B981' },
    { label: 'Revision Rate', value: `${revisionRate}%`, color: '#F59E0B' },
  ]

  const recent = [...videos].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 10)

  return (
    <Layout title="My Stats">
      <div className="max-w-3xl mx-auto fade-in space-y-6">
        {/* KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 stagger-children">
          {kpis.map(k => (
            <div key={k.label} className="stat-card p-4 text-center fade-in">
              <p className="text-2xl mb-1" style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 800, color: k.color }}>{k.value}</p>
              <p className="text-xs" style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 500, color: '#475569' }}>{k.label}</p>
            </div>
          ))}
        </div>

        {/* Monthly chart */}
        <div className="cd-card p-5">
          <h2 className="text-base mb-4" style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 800, color: '#0F172A' }}>Monthly Upload Volume</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={months}>
              <XAxis dataKey="month" stroke="#E2E8F0" tick={{ fontFamily: 'Plus Jakarta Sans', fontSize: 12, fill: '#94A3B8' }} />
              <YAxis stroke="#E2E8F0" tick={{ fontFamily: 'Plus Jakarta Sans', fontSize: 12, fill: '#94A3B8' }} allowDecimals={false} />
              <Tooltip contentStyle={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 8, fontFamily: 'Plus Jakarta Sans' }} labelStyle={{ color: '#0F172A' }} itemStyle={{ color: '#0F172A' }} cursor={{ fill: 'rgba(2,132,199,0.05)' }} />
              <Bar dataKey="count" fill="#0284C7" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Video history table */}
        <div className="cd-card overflow-hidden">
          <div className="px-5 py-4" style={{ borderBottom: '1px solid #E2E8F0' }}>
            <h2 className="text-base" style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 800, color: '#0F172A' }}>Video History</h2>
          </div>
          <table className="w-full">
            <thead>
              <tr style={{ background: '#F8FAFC' }}>
                {['Title', 'Category', 'Uploaded', 'Status', 'Days'].map(h => (
                  <th key={h} className="px-4 py-2.5 text-left section-label">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recent.map((v, i) => (
                <tr key={v.id} className="table-row-hover" style={{ borderBottom: '1px solid #F1F5F9', background: i % 2 === 0 ? 'transparent' : '#FAFAFA' }}>
                  <td className="px-4 py-3 text-sm truncate max-w-xs" style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 500, color: '#0F172A' }}>{v.title}</td>
                  <td className="px-4 py-3 text-xs" style={{ fontFamily: 'Plus Jakarta Sans', color: '#475569' }}>{v.category}</td>
                  <td className="px-4 py-3 text-xs" style={{ fontFamily: 'Plus Jakarta Sans', color: '#475569' }}>{formatDate(v.created_at)}</td>
                  <td className="px-4 py-3"><StatusBadge status={v.status} size="sm" /></td>
                  <td className="px-4 py-3 text-xs" style={{ fontFamily: 'Plus Jakarta Sans', color: '#94A3B8' }}>{Math.floor((Date.now() - new Date(v.created_at).getTime()) / 86400000)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  )
}
