import { useVideos } from '../../hooks/useVideos'
import Layout from '../../components/layout/Layout'
import { format, startOfWeek, addDays, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns'
import { useState } from 'react'
import { stageColor } from '../../lib/utils'

type View = 'weekly' | 'monthly'

export default function SMMCalendar() {
  const { data: allVideos = [] } = useVideos()
  const [view, setView] = useState<View>('weekly')

  const scheduled = allVideos.filter(v => ['Scheduled', 'Published'].includes(v.status))
  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 })

  function videosForDay(dayStr: string) {
    return scheduled.filter(v => v.estimated_completion_date === dayStr)
  }

  function renderWeekly() {
    const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i))
    return (
      <div className="grid grid-cols-7 gap-2">
        {days.map(day => {
          const str = format(day, 'yyyy-MM-dd')
          const vids = videosForDay(str)
          return (
            <div key={str} className="cd-card min-h-32">
              <div className="px-2 py-1.5" style={{ borderBottom: '1px solid #E2E8F0' }}>
                <p className="text-xs font-semibold" style={{ fontFamily: 'Poppins', fontWeight: 700, color: '#475569' }}>{format(day, 'EEE')}</p>
                <p className="text-[10px]" style={{ fontFamily: 'Poppins', color: '#94A3B8' }}>{format(day, 'MM/dd')}</p>
              </div>
              <div className="p-1.5 space-y-1">
                {vids.map(v => (
                  <div key={v.id} className="px-2 py-1 rounded text-[10px] truncate" style={{ background: stageColor(v.status), color: '#fff', fontFamily: 'Poppins', fontWeight: 600 }}>
                    {v.title.slice(0, 14)}
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  function renderMonthly() {
    const mStart = startOfMonth(new Date())
    const mEnd = endOfMonth(new Date())
    const days = eachDayOfInterval({ start: mStart, end: mEnd })
    return (
      <div className="grid grid-cols-7 gap-1">
        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => (
          <div key={d} className="text-center section-label py-2">{d}</div>
        ))}
        {Array.from({ length: (mStart.getDay() || 7) - 1 }).map((_, i) => <div key={`empty-${i}`} />)}
        {days.map(day => {
          const str = format(day, 'yyyy-MM-dd')
          const vids = videosForDay(str)
          return (
            <div key={str} className="cd-card p-1.5 min-h-16">
              <p className="text-[10px] mb-1" style={{ fontFamily: 'Poppins', color: '#94A3B8' }}>{format(day, 'd')}</p>
              {vids.map(v => (
                <div key={v.id} className="px-1.5 py-0.5 rounded text-[9px] mb-0.5 truncate" style={{ background: stageColor(v.status), color: '#fff', fontFamily: 'Poppins' }}>{v.title.slice(0, 12)}</div>
              ))}
            </div>
          )
        })}
      </div>
    )
  }

  return (
    <Layout title="Publishing Calendar">
      <div className="fade-in space-y-4">
        <div className="flex gap-2">
          {(['weekly', 'monthly'] as View[]).map(v => (
            <button key={v} onClick={() => setView(v)} className="px-4 py-2 rounded-lg text-xs capitalize transition-all" style={{ background: view === v ? '#0284C7' : '#F1F5F9', color: view === v ? '#fff' : '#475569', fontFamily: 'Poppins', fontWeight: 600, border: '1px solid #E2E8F0' }}>{v}</button>
          ))}
        </div>
        {view === 'weekly' ? renderWeekly() : renderMonthly()}
      </div>
    </Layout>
  )
}
