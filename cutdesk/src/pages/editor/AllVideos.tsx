import { useState, useMemo } from 'react'
import { Download } from 'lucide-react'
import { useVideos } from '../../hooks/useVideos'
import { PIPELINE_STAGES, stageColor, formatDate } from '../../lib/utils'
import Layout from '../../components/layout/Layout'
import VideoDetailModal from '../../components/shared/VideoDetailModal'
import StatusBadge from '../../components/shared/StatusBadge'
import PriorityBadge from '../../components/shared/PriorityBadge'

export default function EditorAllVideos() {
  const { data: allVideos = [] } = useVideos()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<string[]>([])
  const [categoryFilter] = useState<string[]>([])
  const [priorityFilter, setPriorityFilter] = useState<string[]>([])
  const [selected, setSelected] = useState<any>(null)

  const filtered = useMemo(() => {
    return allVideos.filter(v => {
      const matchSearch = !search || [v.title, (v.counselor as any)?.full_name, v.category, v.notes_for_editor].some(f => f?.toLowerCase().includes(search.toLowerCase()))
      const matchStatus = statusFilter.length === 0 || statusFilter.includes(v.status)
      const matchCat = categoryFilter.length === 0 || categoryFilter.includes(v.category)
      const matchPriority = priorityFilter.length === 0 || priorityFilter.includes(v.priority)
      return matchSearch && matchStatus && matchCat && matchPriority
    })
  }, [allVideos, search, statusFilter, categoryFilter, priorityFilter])

  function toggleFilter<T>(arr: T[], val: T, set: (a: T[]) => void) {
    set(arr.includes(val) ? arr.filter(x => x !== val) : [...arr, val])
  }

  function exportCSV() {
    const headers = ['ID', 'Title', 'Counselor', 'Category', 'Status', 'Priority', 'Revision Rounds', 'Edit Time (mins)', 'Uploaded', 'Updated']
    const rows = filtered.map(v => [
      v.id, v.title, (v.counselor as any)?.full_name, v.category, v.status, v.priority,
      v.revision_rounds, v.actual_edit_time_minutes || '', formatDate(v.created_at), formatDate(v.updated_at),
    ])
    const csv = [headers, ...rows].map(r => r.map(c => `"${c}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `cutdesk-videos-${Date.now()}.csv`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <Layout title="All Videos">
      <div className="fade-in space-y-4">
        {/* Filters */}
        <div className="cd-card p-4 space-y-3">
          <div className="flex gap-3 flex-wrap">
            <input
              className="cd-input flex-1"
              style={{ minWidth: 200, height: 36, fontSize: 13 }}
              placeholder="Search videos..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <button className="btn-primary text-xs py-2 px-4" onClick={exportCSV}>
              <Download size={14} /> Export CSV
            </button>
          </div>

          <div>
            <p className="section-label mb-2">Status</p>
            <div className="flex gap-1.5 flex-wrap">
              {PIPELINE_STAGES.map(s => (
                <button key={s} onClick={() => toggleFilter(statusFilter, s, setStatusFilter)} className="text-xs px-3 py-1 rounded-full transition-all" style={{ background: statusFilter.includes(s) ? stageColor(s) : '#F1F5F9', color: statusFilter.includes(s) ? '#fff' : '#475569', fontFamily: 'Poppins', fontWeight: 600, border: '1px solid #E2E8F0' }}>{s}</button>
              ))}
            </div>
          </div>

          <div className="flex gap-4 flex-wrap">
            <div>
              <p className="section-label mb-2">Priority</p>
              <div className="flex gap-1.5">
                {['Urgent', 'Normal', 'Low'].map(p => (
                  <button key={p} onClick={() => toggleFilter(priorityFilter, p, setPriorityFilter)} className="text-xs px-3 py-1 rounded-full transition-all" style={{ background: priorityFilter.includes(p) ? '#0284C7' : '#F1F5F9', color: priorityFilter.includes(p) ? '#fff' : '#475569', fontFamily: 'Poppins', fontWeight: 600, border: '1px solid #E2E8F0' }}>{p}</button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="cd-card overflow-hidden">
          <div className="px-5 py-3" style={{ borderBottom: '1px solid #E2E8F0' }}>
            <p className="text-xs" style={{ fontFamily: 'Poppins', color: '#94A3B8' }}>{filtered.length} videos</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px]">
              <thead>
                <tr style={{ background: '#F8FAFC' }}>
                  {['Title', 'Counselor', 'Category', 'Status', 'Priority', 'Revisions', 'Uploaded'].map(h => (
                    <th key={h} className="px-4 py-2.5 text-left section-label">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={7} className="px-4 py-12 text-center" style={{ fontFamily: 'Poppins', color: '#94A3B8' }}>No videos match your filters</td></tr>
                ) : filtered.map((v, i) => (
                  <tr
                    key={v.id}
                    onClick={() => setSelected(v)}
                    className="cursor-pointer table-row-hover"
                    style={{ borderBottom: '1px solid #F1F5F9', background: i % 2 === 0 ? 'transparent' : '#FAFAFA' }}
                  >
                    <td className="px-4 py-3 text-sm max-w-xs truncate" style={{ fontFamily: 'Poppins', fontWeight: 500, color: '#0F172A' }}>{v.title}</td>
                    <td className="px-4 py-3 text-xs" style={{ fontFamily: 'Poppins', color: '#475569' }}>{(v.counselor as any)?.full_name}</td>
                    <td className="px-4 py-3 text-xs" style={{ fontFamily: 'Poppins', color: '#475569' }}>{v.category}</td>
                    <td className="px-4 py-3"><StatusBadge status={v.status} size="sm" /></td>
                    <td className="px-4 py-3"><PriorityBadge priority={v.priority} /></td>
                    <td className="px-4 py-3 text-xs text-center" style={{ fontFamily: 'Poppins' }}>
                      <span style={{ background: v.revision_rounds > 0 ? (v.revision_rounds >= 2 ? '#FEE2E2' : '#FEF3C7') : 'transparent', padding: '2px 6px', borderRadius: 4, color: v.revision_rounds > 0 ? (v.revision_rounds >= 2 ? '#EF4444' : '#F59E0B') : '#94A3B8' }}>
                        {v.revision_rounds}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-xs" style={{ fontFamily: 'Poppins', color: '#94A3B8' }}>{formatDate(v.created_at)}</td>
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
