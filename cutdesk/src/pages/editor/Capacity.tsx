import { useState } from 'react'
import { CalendarDays } from 'lucide-react'
import { useVideos, useUpdateVideo } from '../../hooks/useVideos'
import { format, startOfWeek, addDays } from 'date-fns'
import Layout from '../../components/layout/Layout'

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export default function Capacity() {
  const { data: allVideos = [] } = useVideos()
  const updateVideo = useUpdateVideo()
  const [availHours, setAvailHours] = useState<number>(() => {
    const saved = localStorage.getItem('editor_weekly_hours')
    return saved ? Number(saved) : 40
  })
  const [dateInputs, setDateInputs] = useState<Record<string, string>>({})

  const queueVideos = allVideos.filter(v => ['In Editor Queue', 'Editing In Progress'].includes(v.status))
  const avgEditMins = allVideos.filter(v => v.actual_edit_time_minutes).length
    ? allVideos.filter(v => v.actual_edit_time_minutes).reduce((s, v) => s + (v.actual_edit_time_minutes || 0), 0) / allVideos.filter(v => v.actual_edit_time_minutes).length
    : 45

  const estTotalHours = Math.round((queueVideos.length * avgEditMins) / 60)
  const isOverloaded = estTotalHours > availHours

  function handleAvailChange(val: number) {
    setAvailHours(val)
    localStorage.setItem('editor_weekly_hours', String(val))
  }

  const weekStart = startOfWeek(new Date(), { weekStartsOn: 1 })
  const weekDays = DAYS.map((_, i) => addDays(weekStart, i))

  const scheduled = queueVideos.filter(v => v.estimated_completion_date)
  const unscheduled = queueVideos.filter(v => !v.estimated_completion_date)

  function videosForDay(day: Date) {
    const dayStr = format(day, 'yyyy-MM-dd')
    return scheduled.filter(v => v.estimated_completion_date === dayStr)
  }

  async function setDueDate(videoId: string, date: string) {
    await updateVideo.mutateAsync({ id: videoId, estimated_completion_date: date || null })
  }

  return (
    <Layout title="Capacity Planner">
      <div className="fade-in space-y-5">
        {/* Summary bar */}
        <div className="cd-card p-4 flex items-center gap-6 flex-wrap">
          <div className="flex items-center gap-2">
            <CalendarDays size={18} className="text-sky-500" />
            <span className="text-sm" style={{ fontFamily: 'Poppins', fontWeight: 600, color: '#0F172A' }}>This week:</span>
            <span className="text-sm" style={{ fontFamily: 'Poppins', color: '#475569' }}>{queueVideos.length} videos in queue</span>
          </div>
          <div className="h-4 w-px" style={{ background: '#E2E8F0' }} />
          <span className="text-sm" style={{ fontFamily: 'Poppins', color: '#475569' }}>Est. time: {estTotalHours}h</span>
          <div className="h-4 w-px" style={{ background: '#E2E8F0' }} />
          <div className="flex items-center gap-2">
            <span className="text-sm" style={{ fontFamily: 'Poppins', color: '#475569' }}>Available:</span>
            <input
              type="number" min={1} max={168} value={availHours}
              onChange={e => handleAvailChange(Number(e.target.value))}
              className="w-16 text-center text-sm rounded-lg"
              style={{ background: '#F1F5F9', border: '1.5px solid #E2E8F0', color: '#0F172A', height: 32, fontFamily: 'Poppins', fontWeight: 600 }}
            />
            <span className="text-sm" style={{ fontFamily: 'Poppins', color: '#475569' }}>h</span>
          </div>
          <div className="h-4 w-px" style={{ background: '#E2E8F0' }} />
          <span className={`text-sm font-semibold flex items-center gap-1.5 ${isOverloaded ? 'text-amber-500' : 'text-emerald-600'}`} style={{ fontFamily: 'Poppins', fontWeight: 600 }}>
            {isOverloaded ? '⚠ Overloaded' : '✓ On Track'}
          </span>
        </div>

        {/* Weekly grid */}
        <div className="grid grid-cols-7 gap-2">
          {weekDays.map((day, i) => {
            const dayVideos = videosForDay(day)
            const dayHours = Math.round((dayVideos.length * avgEditMins) / 60)
            const isHeavy = dayHours > 8

            return (
              <div key={i} className="cd-card overflow-hidden">
                <div className="px-3 py-2" style={{ borderBottom: '1px solid #F1F5F9', background: isHeavy ? '#FFFBEB' : '#F8FAFC' }}>
                  <p className="text-xs font-bold" style={{ fontFamily: 'Poppins', fontWeight: 700, color: isHeavy ? '#B45309' : '#475569' }}>
                    {DAYS[i]} {isHeavy && '⚠'}
                  </p>
                  <p className="text-[10px]" style={{ fontFamily: 'Poppins', color: '#94A3B8' }}>{format(day, 'MM/dd')}</p>
                </div>
                <div className="p-2 space-y-1.5">
                  {dayVideos.map(v => (
                    <div key={v.id} className="px-2 py-1 rounded text-xs truncate" style={{ background: '#EFF6FF', color: '#0284C7', fontFamily: 'Poppins', fontWeight: 500 }}>
                      {v.title.slice(0, 18)}{v.title.length > 18 ? '…' : ''}
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>

        {/* Unscheduled */}
        {unscheduled.length > 0 && (
          <div className="cd-card overflow-hidden">
            <div className="px-5 py-3" style={{ borderBottom: '1px solid #E2E8F0' }}>
              <h2 className="text-sm" style={{ fontFamily: 'Montserrat', fontWeight: 800, color: '#0F172A' }}>Unscheduled Videos ({unscheduled.length})</h2>
            </div>
            <div className="p-4 space-y-2">
              {unscheduled.map(v => (
                <div key={v.id} className="flex items-center gap-4">
                  <p className="flex-1 text-sm truncate" style={{ fontFamily: 'Poppins', fontWeight: 500, color: '#0F172A' }}>{v.title}</p>
                  <div className="flex items-center gap-2">
                    <input
                      type="date"
                      value={dateInputs[v.id] || ''}
                      onChange={e => setDateInputs(prev => ({ ...prev, [v.id]: e.target.value }))}
                      className="cd-input"
                      style={{ height: 36, width: 160, fontSize: 12 }}
                    />
                    <button
                      className="btn-primary text-xs py-2 px-3"
                      onClick={() => { if (dateInputs[v.id]) setDueDate(v.id, dateInputs[v.id]) }}
                      disabled={!dateInputs[v.id]}
                    >
                      Set Due Date
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Layout>
  )
}
