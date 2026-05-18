import { useEffect, useState } from 'react'
import { useVideos } from '../../hooks/useVideos'
import { supabase } from '../../lib/supabase'
import Layout from '../../components/layout/Layout'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { format, subMonths, startOfMonth, endOfMonth } from 'date-fns'

export default function CEOCounselors() {
  const { data: allVideos = [] } = useVideos()
  const [counselors, setCounselors] = useState<any[]>([])
  const [selected, setSelected] = useState<string | null>(null)

  useEffect(() => {
    supabase.from('profiles').select('id, full_name, email').eq('role', 'counselor').then(({ data }) => setCounselors(data || []))
  }, [])

  function getCounselorStats(id: string) {
    const vids = allVideos.filter(v => v.counselor_id === id)
    const withRevisions = vids.filter(v => v.revision_rounds > 0).length
    const revisionRate = vids.length ? Math.round((withRevisions / vids.length) * 100) : 0
    const inProgress = vids.filter(v => ['In Editor Queue', 'Editing In Progress'].includes(v.status)).length
    const monthlyData = Array.from({ length: 6 }, (_, i) => {
      const d = subMonths(new Date(), 5 - i)
      const start = startOfMonth(d)
      const end = endOfMonth(d)
      const count = vids.filter(v => new Date(v.created_at) >= start && new Date(v.created_at) <= end).length
      return { month: format(d, 'MMM'), count }
    })
    return { total: vids.length, revisionRate, inProgress, monthlyData }
  }

  const sel = selected ? counselors.find(c => c.id === selected) : null
  const stats = sel ? getCounselorStats(sel.id) : null

  return (
    <Layout title="Counselors">
      <div className="fade-in grid grid-cols-1 lg:grid-cols-3 gap-5">
        {/* List */}
        <div className="cd-card overflow-hidden">
          <div className="px-4 py-3 border-b border-[rgba(0,162,207,0.15)]">
            <h2 className="text-white text-sm" style={{ fontFamily: 'Montserrat', fontWeight: 800 }}>All Counselors ({counselors.length})</h2>
          </div>
          <div className="divide-y divide-[rgba(0,162,207,0.06)]">
            {counselors.map(c => {
              const s = getCounselorStats(c.id)
              return (
                <button key={c.id} onClick={() => setSelected(c.id)} className="w-full flex items-center gap-3 px-4 py-3 text-left transition-colors" style={{ background: selected === c.id ? 'rgba(0,162,207,0.1)' : 'transparent' }}>
                  <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center" style={{ background: '#00A2CF' }}>
                    <span style={{ fontFamily: 'Montserrat', fontWeight: 700, fontSize: 12, color: '#fff' }}>{c.full_name?.charAt(0)}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-xs font-semibold truncate" style={{ fontFamily: 'Poppins', fontWeight: 600 }}>{c.full_name}</p>
                    <p className="text-white/40 text-[10px]" style={{ fontFamily: 'Poppins' }}>{s.total} videos · {s.revisionRate}% revision rate</p>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Detail */}
        <div className="lg:col-span-2">
          {!sel ? (
            <div className="cd-card p-8 flex items-center justify-center h-full text-white/30" style={{ fontFamily: 'Poppins' }}>Select a counselor to view details</div>
          ) : (
            <div className="space-y-4">
              <div className="cd-card p-5">
                <h2 className="text-white text-base mb-4" style={{ fontFamily: 'Montserrat', fontWeight: 800 }}>{sel.full_name}</h2>
                <div className="grid grid-cols-3 gap-3 mb-5">
                  {[['Videos', stats!.total], ['In Progress', stats!.inProgress], ['Revision Rate', `${stats!.revisionRate}%`]].map(([l, v]) => (
                    <div key={l as string} className="text-center p-3 rounded-xl" style={{ background: 'rgba(0,162,207,0.06)', border: '1px solid rgba(0,162,207,0.1)' }}>
                      <p className="text-[#00A2CF] font-bold text-xl" style={{ fontFamily: 'Montserrat', fontWeight: 800 }}>{v}</p>
                      <p className="text-white/50 text-xs" style={{ fontFamily: 'Poppins' }}>{l}</p>
                    </div>
                  ))}
                </div>
                <h3 className="text-white text-sm mb-3" style={{ fontFamily: 'Montserrat', fontWeight: 800 }}>Monthly Uploads</h3>
                <ResponsiveContainer width="100%" height={150}>
                  <BarChart data={stats!.monthlyData}>
                    <XAxis dataKey="month" stroke="transparent" tick={{ fontFamily: 'Poppins', fontSize: 10, fill: 'rgba(245,248,250,0.4)' }} />
                    <YAxis hide allowDecimals={false} />
                    <Tooltip contentStyle={{ background: '#003D52', border: '1px solid rgba(0,162,207,0.2)', borderRadius: 8, fontFamily: 'Poppins' }} />
                    <Bar dataKey="count" fill="#00A2CF" radius={[3, 3, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>
      </div>
    </Layout>
  )
}
