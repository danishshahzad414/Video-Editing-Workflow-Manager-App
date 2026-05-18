import { useState } from 'react'
import { Video } from 'lucide-react'
import { useVideos } from '../../hooks/useVideos'
import Layout from '../../components/layout/Layout'
import VideoCard from '../../components/shared/VideoCard'
import VideoDetailModal from '../../components/shared/VideoDetailModal'
import EmptyState from '../../components/shared/EmptyState'

const FILTERS = ['All', 'In Editing', 'Completed', 'Revision Needed'] as const
type Filter = typeof FILTERS[number]

function applyFilter(videos: any[], filter: Filter) {
  if (filter === 'All') return videos
  if (filter === 'In Editing') return videos.filter(v => ['In Editor Queue', 'Editing In Progress', 'Re-record Submitted'].includes(v.status))
  if (filter === 'Completed') return videos.filter(v => ['Editing Complete', 'Pending Social Review', 'Scheduled', 'Published'].includes(v.status))
  if (filter === 'Revision Needed') return videos.filter(v => v.status === 'Revision Requested')
  return videos
}

export default function MyVideos() {
  const { data: videos = [], isLoading } = useVideos()
  const [filter, setFilter] = useState<Filter>('All')
  const [selected, setSelected] = useState<any>(null)

  const filtered = applyFilter(videos, filter)

  return (
    <Layout title="My Videos">
      <div className="max-w-3xl mx-auto fade-in">
        {/* Filter tabs */}
        <div className="flex gap-1 mb-5 p-1 rounded-xl w-fit" style={{ background: '#F1F5F9', border: '1px solid #E2E8F0' }}>
          {FILTERS.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className="px-4 py-2 rounded-lg text-xs transition-all"
              style={{
                background: filter === f ? '#0284C7' : 'transparent',
                color: filter === f ? '#fff' : '#475569',
                fontFamily: 'Poppins', fontWeight: 600,
              }}
            >
              {f}
            </button>
          ))}
        </div>

        {isLoading ? (
          <div className="text-sm text-center py-12" style={{ fontFamily: 'Poppins', color: '#94A3B8' }}>Loading...</div>
        ) : filtered.length === 0 ? (
          <EmptyState icon={Video} title="No videos here" description="Videos will appear here once you upload them" />
        ) : (
          <div className="space-y-2">
            {filtered.map(video => (
              <VideoCard key={video.id} video={video} onClick={() => setSelected(video)} />
            ))}
          </div>
        )}
      </div>
      {selected && <VideoDetailModal video={selected} onClose={() => setSelected(null)} />}
    </Layout>
  )
}
