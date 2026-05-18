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
              <tr style={{ background: '#F8FAFC' }}>
                {['User', 'Action', 'Video', 'From', 'To', 'Timestamp'].map(h => (
                  <th key={h} className="px-4 py-2.5 text-left section-label">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={6} className="px-4 py-12 text-center" style={{ fontFamily: 'Poppins', color: '#94A3B8' }}>No activity</td></tr>
              ) : filtered.map((entry, i) => (
                <tr key={entry.id} className="table-row-hover" style={{ borderBottom: '1px solid #F1F5F9', background: i % 2 === 0 ? 'transparent' : '#FAFAFA' }}>
                  <td className="px-4 py-3 text-xs font-semibold" style={{ fontFamily: 'Poppins', fontWeight: 600, color: '#0F172A' }}>{(entry.user as any)?.full_name || '—'}</td>
                  <td className="px-4 py-3 text-xs" style={{ fontFamily: 'Poppins', color: '#475569' }}>{entry.action}</td>
                  <td className="px-4 py-3 text-xs max-w-xs truncate" style={{ fontFamily: 'Poppins', color: '#475569' }}>{(entry.video as any)?.title || '—'}</td>
                  <td className="px-4 py-3">{entry.from_status && <StatusPill status={entry.from_status} />}</td>
                  <td className="px-4 py-3">{entry.to_status && <StatusPill status={entry.to_status} />}</td>
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

function StatusPill({ status }: { status: string }) {
  return (
    <span style={{ background: stageColor(status), color: '#fff', fontFamily: 'Poppins', fontWeight: 600, fontSize: 9, padding: '2px 5px', borderRadius: 3, textTransform: 'uppercase' }}>
      {status}
    </span>
  )
}
