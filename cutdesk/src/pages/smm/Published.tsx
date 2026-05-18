import { useEffect, useState } from 'react'
import { CheckCircle } from 'lucide-react'
import { useVideos } from '../../hooks/useVideos'
import { supabase } from '../../lib/supabase'
import { formatDate } from '../../lib/utils'
import Layout from '../../components/layout/Layout'
import EmptyState from '../../components/shared/EmptyState'

interface PubDetail {
  id: string; video_id: string; platforms: string[]; scheduled_at: string | null; published_at: string | null; post_urls: Record<string, string> | null
}

export default function Published() {
  const { data: allVideos = [] } = useVideos()
  const [pubDetails, setPubDetails] = useState<Record<string, PubDetail>>({})

  const publishedVideos = allVideos.filter(v => v.status === 'Published')

  useEffect(() => {
    if (!publishedVideos.length) return
    supabase.from('publishing_details').select('*').in('video_id', publishedVideos.map(v => v.id)).then(({ data }) => {
      const map: Record<string, PubDetail> = {}
      for (const d of data || []) map[d.video_id] = d
      setPubDetails(map)
    })
  }, [publishedVideos.length])

  return (
    <Layout title="Published">
      <div className="max-w-3xl mx-auto fade-in">
        {publishedVideos.length === 0 ? (
          <EmptyState icon={CheckCircle} title="No published videos yet" description="Published videos will appear here" />
        ) : (
          <div className="cd-card overflow-hidden">
            <table className="w-full">
              <thead>
                <tr style={{ background: '#F8FAFC' }}>
                  {['Title', 'Platform(s)', 'Publish Date', 'Post URL'].map(h => (
                    <th key={h} className="px-4 py-2.5 text-left section-label">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {publishedVideos.map((v, i) => {
                  const pub = pubDetails[v.id]
                  return (
                    <tr key={v.id} style={{ borderBottom: '1px solid #F1F5F9', background: i % 2 === 0 ? 'transparent' : '#FAFAFA' }}>
                      <td className="px-4 py-3 text-sm max-w-xs truncate" style={{ fontFamily: 'Poppins', fontWeight: 500, color: '#0F172A' }}>{v.title}</td>
                      <td className="px-4 py-3 text-xs" style={{ fontFamily: 'Poppins', color: '#475569' }}>{pub?.platforms?.join(', ') || '—'}</td>
                      <td className="px-4 py-3 text-xs" style={{ fontFamily: 'Poppins', color: '#475569' }}>{pub?.published_at ? formatDate(pub.published_at) : formatDate(v.updated_at)}</td>
                      <td className="px-4 py-3 text-xs" style={{ fontFamily: 'Poppins' }}>
                        {pub?.post_urls ? Object.values(pub.post_urls).slice(0, 1).map((url, j) => (
                          <a key={j} href={url as string} target="_blank" rel="noreferrer" className="hover:underline truncate block max-w-32" style={{ color: '#0284C7' }}>View post</a>
                        )) : <span style={{ color: '#94A3B8' }}>—</span>}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </Layout>
  )
}
