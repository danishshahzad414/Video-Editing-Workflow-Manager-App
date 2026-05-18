import { useState } from 'react'
import { Upload, AlertCircle } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { useVideos } from '../../hooks/useVideos'
import Layout from '../../components/layout/Layout'
import VideoCard from '../../components/shared/VideoCard'
import VideoDetailModal from '../../components/shared/VideoDetailModal'
import PreUploadChecklist from '../../components/counselor/PreUploadChecklist'
import VideoUploadModal from '../../components/counselor/VideoUploadModal'
import { getGreeting, daysSince } from '../../lib/utils'

export default function CounselorDashboard() {
  const { profile } = useAuth()
  const { data: videos = [], isLoading } = useVideos()
  const [selectedVideo, setSelectedVideo] = useState<any>(null)
  const [showChecklist, setShowChecklist] = useState(false)
  const [showUpload, setShowUpload] = useState(false)

  const totalUploaded = videos.length
  const inEditing = videos.filter(v => ['In Editor Queue', 'Editing In Progress'].includes(v.status)).length
  const completed = videos.filter(v => v.status === 'Editing Complete' || v.status === 'Published').length
  const avgTurnaround = videos.length
    ? Math.round(videos.reduce((sum, v) => sum + daysSince(v.created_at), 0) / videos.length)
    : 0

  const revisionVideos = videos.filter(v => v.status === 'Revision Requested')

  const kpis = [
    { label: 'Total Uploaded', value: totalUploaded, color: '#0284C7' },
    { label: 'In Editing', value: inEditing, color: '#6366F1' },
    { label: 'Completed', value: completed, color: '#10B981' },
    { label: 'Avg Turnaround', value: `${avgTurnaround}d`, color: '#F59E0B' },
  ]

  return (
    <Layout>
      <div className="max-w-4xl mx-auto fade-in">
        {/* Greeting */}
        <div className="flex items-center justify-between mb-6">
          <h1 style={{ fontFamily: 'Montserrat', fontWeight: 800, fontSize: 28, color: '#0F172A' }}>
            {getGreeting()}, {profile?.full_name?.split(' ')[0]}!
          </h1>
          <button
            className="btn-primary"
            onClick={() => setShowChecklist(true)}
          >
            <Upload size={16} /> Upload New Video
          </button>
        </div>

        {/* KPI cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 stagger-children">
          {kpis.map(kpi => (
            <div key={kpi.label} className="stat-card p-4 text-center fade-in">
              <p className="text-2xl font-bold mb-1" style={{ fontFamily: 'Montserrat', fontWeight: 800, color: kpi.color }}>{kpi.value}</p>
              <p className="text-xs" style={{ fontFamily: 'Poppins', fontWeight: 500, color: '#475569' }}>{kpi.label}</p>
            </div>
          ))}
        </div>

        {/* Action required alerts */}
        {revisionVideos.map(video => (
          <div key={video.id} className="mb-4 p-4 rounded-xl" style={{ background: '#FFFBEB', borderLeft: '4px solid #F59E0B', border: '1px solid #FDE68A' }}>
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle size={16} style={{ color: '#B45309' }} />
              <p className="text-xs font-semibold uppercase tracking-widest" style={{ fontFamily: 'Poppins', fontWeight: 600, letterSpacing: '0.08em', color: '#B45309' }}>Action Required</p>
            </div>
            <p className="text-sm font-semibold mb-1" style={{ fontFamily: 'Poppins', fontWeight: 600, color: '#0F172A' }}>{video.title}</p>
            {video.notes_for_editor && (
              <p className="text-xs mb-3" style={{ fontFamily: 'Poppins', color: '#475569' }}>{video.notes_for_editor}</p>
            )}
            <button className="btn-primary text-xs py-2 px-4" onClick={() => setSelectedVideo(video)}>Submit Re-record</button>
          </div>
        ))}

        {/* Recent videos */}
        <div>
          <h2 className="text-base mb-3" style={{ fontFamily: 'Montserrat', fontWeight: 800, color: '#0F172A' }}>My Videos</h2>
          {isLoading ? (
            <div className="text-sm text-center py-8" style={{ fontFamily: 'Poppins', color: '#94A3B8' }}>Loading...</div>
          ) : videos.length === 0 ? (
            <div className="cd-card p-8 text-center">
              <p className="text-sm" style={{ fontFamily: 'Poppins', color: '#94A3B8' }}>No videos yet. Upload your first video!</p>
            </div>
          ) : (
            <div className="space-y-2">
              {videos.slice(0, 5).map(video => (
                <VideoCard key={video.id} video={video} onClick={() => setSelectedVideo(video)} />
              ))}
            </div>
          )}
        </div>
      </div>

      {showChecklist && (
        <PreUploadChecklist
          onProceed={() => { setShowChecklist(false); setShowUpload(true) }}
          onClose={() => setShowChecklist(false)}
        />
      )}
      {showUpload && <VideoUploadModal onClose={() => setShowUpload(false)} />}
      {selectedVideo && (
        <VideoDetailModal
          video={selectedVideo}
          onClose={() => setSelectedVideo(null)}
        />
      )}
    </Layout>
  )
}
