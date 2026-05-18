import { useState } from 'react'
import { useActivityLog } from '../../hooks/useActivityLog'
import { formatDateTime, stageColor } from '../../lib/utils'
import Layout from '../../components/layout/Layout'

export default function CEOActivityLog() {
  const { data: log = [] } = useActivityLog()
  const [search, setSearch] = useState('')

  const filtered = log.filter(e => {
    return !search || [e.action, (e.video as any)?.title, (e.user as any)?.full_name, e.notes].some(f => f?.toLowerCase().includes(search.toLowerCase()))
  })

  return (
    <Layout title="Activity Log">
      <div className="fade-in space-y-4">
        <div className="cd-card p-4">
          <input className="cd-input" style={{ height: 36, fontSize: 13 }} placeholder="Search activity..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>

        <div className="cd-card overflow-hidden">
          <table className="w-full">
            <thead>
              <tr style={{ background: 'rgba(0,162,207,0.05)' }}>
                {['User', 'Action', 'Video', 'From', 'To', 'Timestamp'].map(h => (
                  <th key={h} className="px-4 py-2.5 text-left section-label">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={6} className="px-4 py-12 text-center text-white/30" style={{ fontFamily: 'Poppins' }}>No activity</td></tr>
              ) : filtered.map((entry, i) => (
                <tr key={entry.id} style={{ borderBottom: '1px solid rgba(0,162,207,0.06)', background: i % 2 === 0 ? 'transparent' : 'rgba(0,61,82,0.3)' }}>
                  <td className="px-4 py-3 text-white text-xs font-semibold" style={{ fontFamily: 'Poppins', fontWeight: 600 }}>{(entry.user as any)?.full_name || '—'}</td>
                  <td className="px-4 py-3 text-white/70 text-xs" style={{ fontFamily: 'Poppins' }}>{entry.action}</td>
                  <td className="px-4 py-3 text-white/60 text-xs max-w-xs truncate" style={{ fontFamily: 'Poppins' }}>{(entry.video as any)?.title || '—'}</td>
                  <td className="px-4 py-3">{entry.from_status && <span style={{ background: stageColor(entry.from_status), color: '#fff', fontFamily: 'Poppins', fontWeight: 600, fontSize: 9, padding: '2px 5px', borderRadius: 3, textTransform: 'uppercase' }}>{entry.from_status}</span>}</td>
                  <td className="px-4 py-3">{entry.to_status && <span style={{ background: stageColor(entry.to_status), color: '#fff', fontFamily: 'Poppins', fontWeight: 600, fontSize: 9, padding: '2px 5px', borderRadius: 3, textTransform: 'uppercase' }}>{entry.to_status}</span>}</td>
                  <td className="px-4 py-3 text-white/40 text-xs" style={{ fontFamily: 'Poppins' }}>{formatDateTime(entry.created_at)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </Layout>
  )
}
