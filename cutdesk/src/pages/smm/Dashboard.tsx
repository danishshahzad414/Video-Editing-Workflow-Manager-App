import { useVideos } from '../../hooks/useVideos'
import Layout from '../../components/layout/Layout'
import { format, startOfWeek, addDays, startOfMonth, endOfMonth } from 'date-fns'
import { stageColor } from '../../lib/utils'

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export default function SMMDashboard() {
  const { data: allVideos = [] } = useVideos()

  const readyToPublish = allVideos.filter(v => ['Editing Complete', 'Pending Social Review'].includes(v.status)).length
  const monthStart = startOfMonth(new Date())
  const monthEnd = endOfMonth(new Date())
  const publishedThisMonth = allVideos.filter(v => v.status === 'Published' && new Date(v.updated_at) >= monthStart && new Date(v.updated_at) <= monthEnd).length
  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 })
  const scheduledThisWeek = allVideos.filter(v => v.status === 'Scheduled').length

  const kpis = [
    { label: 'Ready to Publish', value: readyToPublish, color: '#00A2CF' },
    { label: 'Scheduled This Week', value: scheduledThisWeek, color: '#6366F1' },
    { label: 'Published This Month', value: publishedThisMonth, color: '#22C55E' },
    { label: 'Platforms Active', value: 5, color: '#F59E0B' },
  ]

  const weekDays = DAYS.map((_, i) => addDays(weekStart, i))

  return (
    <Layout title="SMM Dashboard">
      <div className="fade-in space-y-6">
        {/* KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {kpis.map(k => (
            <div key={k.label} className="cd-card p-4 text-center">
              <p className="text-2xl font-bold mb-1" style={{ fontFamily: 'Montserrat', fontWeight: 800, color: k.color }}>{k.value}</p>
              <p className="text-white/50 text-xs" style={{ fontFamily: 'Poppins', fontWeight: 500 }}>{k.label}</p>
            </div>
          ))}
        </div>

        {/* Weekly calendar */}
        <div className="cd-card overflow-hidden">
          <div className="px-5 py-3 border-b border-[rgba(0,162,207,0.15)]">
            <h2 className="text-white text-base" style={{ fontFamily: 'Montserrat', fontWeight: 800 }}>Publishing Calendar — This Week</h2>
          </div>
          <div className="p-4 grid grid-cols-7 gap-2">
            {weekDays.map((day, i) => {
              const dayStr = format(day, 'yyyy-MM-dd')
              const dayVideos = allVideos.filter(v => v.status === 'Scheduled' && v.estimated_completion_date === dayStr)
              return (
                <div key={i} className="min-h-24">
                  <p className="text-white/50 text-xs mb-2 text-center" style={{ fontFamily: 'Poppins', fontWeight: 600 }}>
                    {DAYS[i]}<br />
                    <span className="text-white/30">{format(day, 'MM/dd')}</span>
                  </p>
                  {dayVideos.map(v => (
                    <div key={v.id} className="px-2 py-1 rounded text-[10px] mb-1 truncate" style={{ background: stageColor(v.status), color: '#fff', fontFamily: 'Poppins', fontWeight: 600 }}>
                      {v.title.slice(0, 16)}
                    </div>
                  ))}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </Layout>
  )
}
