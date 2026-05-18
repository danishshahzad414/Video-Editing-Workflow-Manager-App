import { useVideos } from '../../hooks/useVideos'
import Layout from '../../components/layout/Layout'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { format, subWeeks, startOfWeek, endOfWeek, isWithinInterval } from 'date-fns'
import { formatMinutes } from '../../lib/utils'

export default function CEOEditorStats() {
  const { data: allVideos = [] } = useVideos()

  const editedVideos = allVideos.filter(v => v.actual_edit_time_minutes)
  const avgEditMins = editedVideos.length
    ? Math.round(editedVideos.reduce((s, v) => s + (v.actual_edit_time_minutes || 0), 0) / editedVideos.length)
    : 0

  const totalVideos = allVideos.length
  const completedVideos = allVideos.filter(v => ['Editing Complete', 'Published'].includes(v.status)).length
  const completionRate = totalVideos ? Math.round((completedVideos / totalVideos) * 100) : 0

  const revisionVideos = allVideos.filter(v => v.revision_rounds > 0)
  const revisionRate = totalVideos ? Math.round((revisionVideos.length / totalVideos) * 100) : 0

  const queueDepth = allVideos.filter(v => ['Raw Uploaded', 'In Editor Queue', 'Editing In Progress'].includes(v.status)).length

  const weeklyQueue = Array.from({ length: 8 }, (_, i) => {
    const ws = startOfWeek(subWeeks(new Date(), 7 - i))
    const we = endOfWeek(subWeeks(new Date(), 7 - i))
    const count = allVideos.filter(v => ['In Editor Queue', 'Editing In Progress'].includes(v.status) && isWithinInterval(new Date(v.updated_at), { start: ws, end: we })).length
    return { week: format(ws, 'MM/dd'), count }
  })

  return (
    <Layout title="Editor Stats">
      <div className="fade-in space-y-5">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 stagger-children">
          {[
            { label: 'Avg Edit Time', value: formatMinutes(avgEditMins) },
            { label: 'Completion Rate', value: `${completionRate}%` },
            { label: 'Current Queue Depth', value: queueDepth },
            { label: 'Revision Request Rate', value: `${revisionRate}%` },
          ].map(k => (
            <div key={k.label} className="stat-card p-4 text-center fade-in">
              <p style={{ fontFamily: 'Montserrat', fontWeight: 800, fontSize: 28, color: '#0284C7', marginBottom: 4 }}>{k.value}</p>
              <p style={{ fontFamily: 'Poppins', fontWeight: 500, fontSize: 12, color: '#475569' }}>{k.label}</p>
            </div>
          ))}
        </div>

        <div className="cd-card p-5">
          <h2 className="text-sm mb-4" style={{ fontFamily: 'Montserrat', fontWeight: 800, color: '#0F172A' }}>Queue Depth Over Time (8 Weeks)</h2>
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={weeklyQueue}>
              <XAxis dataKey="week" stroke="#E2E8F0" tick={{ fontFamily: 'Poppins', fontSize: 10, fill: '#94A3B8' }} />
              <YAxis stroke="#E2E8F0" tick={{ fontFamily: 'Poppins', fontSize: 10, fill: '#94A3B8' }} allowDecimals={false} />
              <Tooltip contentStyle={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 8, fontFamily: 'Poppins' }} labelStyle={{ color: '#0F172A' }} itemStyle={{ color: '#0F172A' }} />
              <Bar dataKey="count" fill="#0284C7" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </Layout>
  )
}
