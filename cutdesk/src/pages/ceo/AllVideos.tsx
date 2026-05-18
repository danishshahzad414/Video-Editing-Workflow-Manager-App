import { useState, useMemo } from 'react'
import { useVideos } from '../../hooks/useVideos'
import { PIPELINE_STAGES, stageColor, formatDate } from '../../lib/utils'
import Layout from '../../components/layout/Layout'
import VideoDetailModal from '../../components/shared/VideoDetailModal'
import StatusBadge from '../../components/shared/StatusBadge'

export default function CEOAllVideos() {
  const { data: allVideos = [] } = useVideos()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string[]>([])
  const [selected, setSelected] = useState<any>(null)

  const filtered = useMemo(() => {
    return allVideos.filter(v => {
      const matchSearch = !search || [v.title, (v.counselor as any)?.full_name, v.category].some(f => f?.toLowerCase().includes(search.toLowerCase()))
      const matchStatus = statusFilter.length === 0 || statusFilter.includes(v.status)
      return matchSearch && matchStatus
    })
  }, [allVideos, search, statusFilter])

  function toggleStatus(s: string) {
    setStatusFilter(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s])
  }

  return (
    <Layout title="All Videos">
      <div className="fade-in space-y-4">
        <div className="cd-card p-4 space-y-3">
          <input className="cd-input" style={{ height: 36, fontSize: 13 }} placeholder="Search videos..." value={search} onChange={e => setSearch(e.target.value)} />
          <div className="flex gap-1.5 flex-wrap">
            {PIPELINE_STAGES.map(s => (
              <button key={s} onClick={() => toggleStatus(s)} className="text-xs px-3 py-1 rounded-full transition-all" style={{ background: statusFilter.includes(s) ? stageColor(s) : 'rgba(255,255,255,0.08)', color: '#fff', fontFamily: 'Poppins', fontWeight: 600 }}>{s}</button>
            ))}
          </div>
        </div>

        <div className="cd-card overflow-hidden">
          <div className="px-5 py-3 border-b border-[rgba(0,162,207,0.15)]">
            <p className="text-white/50 text-xs" style={{ fontFamily: 'Poppins' }}>{filtered.length} videos (read-only)</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead>
                <tr style={{ background: 'rgba(0,162,207,0.05)' }}>
                  {['Title', 'Counselor', 'Category', 'Status', 'Uploaded'].map(h => (
                    <th key={h} className="px-4 py-2.5 text-left section-label">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={5} className="px-4 py-12 text-center text-white/30" style={{ fontFamily: 'Poppins' }}>No videos match</td></tr>
                ) : filtered.map((v, i) => (
                  <tr key={v.id} onClick={() => setSelected(v)} className="cursor-pointer hover:bg-[rgba(0,162,207,0.04)]" style={{ borderBottom: '1px solid rgba(0,162,207,0.06)', background: i % 2 === 0 ? 'transparent' : 'rgba(0,61,82,0.3)' }}>
                    <td className="px-4 py-3 text-white text-sm max-w-xs truncate" style={{ fontFamily: 'Poppins', fontWeight: 500 }}>{v.title}</td>
                    <td className="px-4 py-3 text-white/60 text-xs" style={{ fontFamily: 'Poppins' }}>{(v.counselor as any)?.full_name}</td>
                    <td className="px-4 py-3 text-white/60 text-xs" style={{ fontFamily: 'Poppins' }}>{v.category}</td>
                    <td className="px-4 py-3"><StatusBadge status={v.status} size="sm" /></td>
                    <td className="px-4 py-3 text-white/50 text-xs" style={{ fontFamily: 'Poppins' }}>{formatDate(v.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      {selected && <VideoDetailModal video={selected} onClose={() => setSelected(null)} />}
    </Layout>
  )
}
