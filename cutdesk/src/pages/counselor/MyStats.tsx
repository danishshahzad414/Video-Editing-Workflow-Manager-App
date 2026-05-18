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
    { label: 'Total Uploaded', value: totalUploaded },
    { label: 'In Editing', value: inEditing },
    { label: 'Published', value: published },
    { label: 'Revision Rate', value: `${revisionRate}%` },
  ]

  const recent = [...videos].sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()).slice(0, 10)

  return (
    <Layout title="My Stats">
      <div className="max-w-3xl mx-auto fade-in space-y-6">
        {/* KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {kpis.map(k => (
            <div key={k.label} className="cd-card p-4 text-center">
              <p className="text-[#00A2CF] text-2xl mb-1" style={{ fontFamily: 'Montserrat', fontWeight: 800 }}>{k.value}</p>
              <p className="text-white/50 text-xs" style={{ fontFamily: 'Poppins', fontWeight: 500 }}>{k.label}</p>
            </div>
          ))}
        </div>

        {/* Monthly chart */}
        <div className="cd-card p-5">
          <h2 className="text-white text-base mb-4" style={{ fontFamily: 'Montserrat', fontWeight: 800 }}>Monthly Upload Volume</h2>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={months}>
              <XAxis dataKey="month" stroke="rgba(245,248,250,0.3)" tick={{ fontFamily: 'Poppins', fontSize: 12, fill: 'rgba(245,248,250,0.5)' }} />
              <YAxis stroke="rgba(245,248,250,0.3)" tick={{ fontFamily: 'Poppins', fontSize: 12, fill: 'rgba(245,248,250,0.5)' }} allowDecimals={false} />
              <Tooltip contentStyle={{ background: '#003D52', border: '1px solid rgba(0,162,207,0.2)', borderRadius: 8, fontFamily: 'Poppins' }} cursor={{ fill: 'rgba(0,162,207,0.05)' }} />
              <Bar dataKey="count" fill="#00A2CF" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Video history table */}
        <div className="cd-card overflow-hidden">
          <div className="px-5 py-4 border-b border-[rgba(0,162,207,0.15)]">
            <h2 className="text-white text-base" style={{ fontFamily: 'Montserrat', fontWeight: 800 }}>Video History</h2>
          </div>
          <table className="w-full">
            <thead>
              <tr style={{ background: 'rgba(0,162,207,0.05)' }}>
                {['Title', 'Category', 'Uploaded', 'Status', 'Days'].map(h => (
                  <th key={h} className="px-4 py-2.5 text-left section-label">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {recent.map((v, i) => (
                <tr key={v.id} style={{ background: i % 2 === 0 ? 'transparent' : 'rgba(0,61,82,0.4)' }}>
                  <td className="px-4 py-3 text-white text-sm truncate max-w-xs" style={{ fontFamily: 'Poppins', fontWeight: 500 }}>{v.title}</td>
                  <td className="px-4 py-3 text-white/60 text-xs" style={{ fontFamily: 'Poppins' }}>{v.category}</td>
                  <td className="px-4 py-3 text-white/60 text-xs" style={{ fontFamily: 'Poppins' }}>{formatDate(v.created_at)}</td>
                  <td className="px-4 py-3"><StatusBadge status={v.status} size="sm" /></td>
                  <td className="px-4 py-3 text-white/60 text-xs" style={{ fontFamily: 'Poppins' }}>{Math.floor((Date.now() - new Date(v.created_at).getTime()) / 86400000)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  )
}
