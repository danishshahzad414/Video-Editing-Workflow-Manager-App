import { useState } from 'react'
import { useActivityLog } from '../../hooks/useActivityLog'
import { formatDateTime, stageColor } from '../../lib/utils'
import Layout from '../../components/layout/Layout'

export default function EditorActivityLog() {
  const { data: log = [] } = useActivityLog()
  const [userFilter, setUserFilter] = useState('')
  const [search, setSearch] = useState('')

  const filtered = log.filter(e => {
    const matchUser = !userFilter || (e.user as any)?.full_name?.toLowerCase().includes(userFilter.toLowerCase())
    const matchSearch = !search || [e.action, (e.video as any)?.title, (e.user as any)?.full_name, e.notes].some(f => f?.toLowerCase().includes(search.toLowerCase()))
    return matchUser && matchSearch
  })

  return (
    <Layout title="Activity Log">
      <div className="fade-in space-y-4">
        <div className="cd-card p-4 flex gap-3 flex-wrap">
          <input className="cd-input flex-1" style={{ minWidth: 200, height: 36, fontSize: 13 }} placeholder="Search activity..." value={search} onChange={e => setSearch(e.target.value)} />
          <input className="cd-input" style={{ width: 200, height: 36, fontSize: 13 }} placeholder="Filter by user..." value={userFilter} onChange={e => setUserFilter(e.target.value)} />
        </div>

        <div className="cd-card overflow-hidden">
          <table className="w-full">
            <thead>
              <tr style={{ background: '#F8FAFC' }}>
                {['User', 'Action', 'Video', 'From Status', 'To Status', 'Timestamp'].map(h => (
                  <th key={h} className="px-4 py-2.5 text-left section-label">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={6} className="px-4 py-12 text-center" style={{ fontFamily: 'Poppins', color: '#94A3B8' }}>No activity found</td></tr>
              ) : filtered.map((entry, i) => (
                <tr key={entry.id} className="table-row-hover" style={{ borderBottom: '1px solid #F1F5F9', background: i % 2 === 0 ? 'transparent' : '#FAFAFA' }}>
                  <td className="px-4 py-3 text-xs font-semibold" style={{ fontFamily: 'Poppins', fontWeight: 600, color: '#0F172A' }}>{(entry.user as any)?.full_name || '—'}</td>
                  <td className="px-4 py-3 text-xs" style={{ fontFamily: 'Poppins', color: '#475569' }}>{entry.action}</td>
                  <td className="px-4 py-3 text-xs max-w-xs truncate" style={{ fontFamily: 'Poppins', color: '#475569' }}>{(entry.video as any)?.title || '—'}</td>
                  <td className="px-4 py-3">
                    {entry.from_status && <span className="text-[10px] px-2 py-0.5 rounded" style={{ background: stageColor(entry.from_status), color: '#fff', fontFamily: 'Poppins', fontWeight: 600 }}>{entry.from_status}</span>}
                  </td>
                  <td className="px-4 py-3">
                    {entry.to_status && <span className="text-[10px] px-2 py-0.5 rounded" style={{ background: stageColor(entry.to_status), color: '#fff', fontFamily: 'Poppins', fontWeight: 600 }}>{entry.to_status}</span>}
                  </td>
                  <td className="px-4 py-3 text-xs" style={{ fontFamily: 'Poppins', color: '#94A3B8' }}>{formatDateTime(entry.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  )
}
