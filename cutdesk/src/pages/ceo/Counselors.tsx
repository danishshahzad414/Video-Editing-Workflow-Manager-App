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
          <div className="px-4 py-3" style={{ borderBottom: '1px solid #E2E8F0' }}>
            <h2 className="text-sm" style={{ fontFamily: 'Montserrat', fontWeight: 800, color: '#0F172A' }}>All Counselors ({counselors.length})</h2>
          </div>
          <div style={{ borderTop: '1px solid #F1F5F9' }}>
            {counselors.map(c => {
              const s = getCounselorStats(c.id)
              return (
                <button key={c.id} onClick={() => setSelected(c.id)} className="w-full flex items-center gap-3 px-4 py-3 text-left transition-colors" style={{ background: selected === c.id ? '#EFF6FF' : 'transparent', borderBottom: '1px solid #F1F5F9' }}>
                  <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #0284C7, #06B6D4)' }}>
                    <span style={{ fontFamily: 'Montserrat', fontWeight: 700, fontSize: 12, color: '#fff' }}>{c.full_name?.charAt(0)}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-semibold truncate" style={{ fontFamily: 'Poppins', fontWeight: 600, color: '#0F172A' }}>{c.full_name}</p>
                    <p className="text-[10px]" style={{ fontFamily: 'Poppins', color: '#94A3B8' }}>{s.total} videos · {s.revisionRate}% revision rate</p>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* Detail */}
        <div className="lg:col-span-2">
          {!sel ? (
            <div className="cd-card p-8 flex items-center justify-center h-full" style={{ fontFamily: 'Poppins', color: '#94A3B8' }}>Select a counselor to view details</div>
          ) : (
            <div className="space-y-4">
              <div className="cd-card p-5">
                <h2 className="text-base mb-4" style={{ fontFamily: 'Montserrat', fontWeight: 800, color: '#0F172A' }}>{sel.full_name}</h2>
                <div className="grid grid-cols-3 gap-3 mb-5">
                  {[['Videos', stats!.total], ['In Progress', stats!.inProgress], ['Revision Rate', `${stats!.revisionRate}%`]].map(([l, v]) => (
                    <div key={l as string} className="stat-card text-center p-3">
                      <p style={{ fontFamily: 'Montserrat', fontWeight: 800, fontSize: 22, color: '#0284C7', marginBottom: 4 }}>{v}</p>
                      <p className="text-xs" style={{ fontFamily: 'Poppins', color: '#475569' }}>{l}</p>
                    </div>
                  ))}
                </div>
                <h3 className="text-sm mb-3" style={{ fontFamily: 'Montserrat', fontWeight: 800, color: '#0F172A' }}>Monthly Uploads</h3>
                <ResponsiveContainer width="100%" height={150}>
                  <BarChart data={stats!.monthlyData}>
                    <XAxis dataKey="month" stroke="transparent" tick={{ fontFamily: 'Poppins', fontSize: 10, fill: '#94A3B8' }} />
                    <YAxis hide allowDecimals={false} />
                    <Tooltip contentStyle={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: 8, fontFamily: 'Poppins' }} labelStyle={{ color: '#0F172A' }} itemStyle={{ color: '#0F172A' }} />
                    <Bar dataKey="count" fill="#0284C7" radius={[3, 3, 0, 0]} />
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
