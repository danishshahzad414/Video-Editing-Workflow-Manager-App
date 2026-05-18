import { useState } from 'react'
import { Send } from 'lucide-react'
import { useVideos } from '../../hooks/useVideos'
import Layout from '../../components/layout/Layout'
import VideoCard from '../../components/shared/VideoCard'
import VideoDetailModal from '../../components/shared/VideoDetailModal'
import PublishingModal from '../../components/smm/PublishingModal'
import EmptyState from '../../components/shared/EmptyState'

export default function ReadyToPublish() {
  const { data: allVideos = [] } = useVideos()
  const [detailVideo, setDetailVideo] = useState<any>(null)
  const [publishVideo, setPublishVideo] = useState<any>(null)

  const readyVideos = allVideos.filter(v => ['Editing Complete', 'Pending Social Review'].includes(v.status))

  return (
    <Layout title="Ready to Publish">
      <div className="max-w-3xl mx-auto fade-in">
        {readyVideos.length === 0 ? (
          <EmptyState icon={Send} title="No videos ready to publish" description="Videos marked as editing complete will appear here" />
        ) : (
          <div className="space-y-2">
            {readyVideos.map(video => (
              <VideoCard
                key={video.id}
                video={video}
                onClick={() => setDetailVideo(video)}
                actionSlot={
                  <button
                    className="btn-primary text-xs py-1.5 px-3"
                    onClick={e => { e.stopPropagation(); setPublishVideo(video) }}
                  >
                    <Send size={12} /> Publish / Schedule
                  </button>
                }
              />
            ))}
          </div>
        )}
      </div>
      {detailVideo && <VideoDetailModal video={detailVideo} onClose={() => setDetailVideo(null)} />}
      {publishVideo && <PublishingModal video={publishVideo} onClose={() => setPublishVideo(null)} />}
    </Layout>
  )
}
