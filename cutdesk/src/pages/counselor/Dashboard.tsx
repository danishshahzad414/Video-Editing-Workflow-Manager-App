import { useState, useEffect } from 'react'
import { Upload, AlertCircle, Video, ArrowRight } from 'lucide-react'
import { useVideos } from '../../hooks/useVideos'
import Layout from '../../components/layout/Layout'
import VideoCard from '../../components/shared/VideoCard'
import VideoDetailModal from '../../components/shared/VideoDetailModal'
import VideoUploadModal from '../../components/counselor/VideoUploadModal'
import { daysSince } from '../../lib/utils'

/* Animated number — counts up from 0 on mount */
function Num({ n }: { n: number }) {
  const [v, setV] = useState(0)
  useEffect(() => {
    if (!n) { setV(0); return }
    const dur = 650, start = Date.now()
    const tick = setInterval(() => {
      const p = Math.min((Date.now() - start) / dur, 1)
      setV(Math.round((1 - Math.pow(1 - p, 3)) * n))
      if (p >= 1) clearInterval(tick)
    }, 16)
    return () => clearInterval(tick)
  }, [n])
  return <>{v}</>
}

export default function CounselorDashboard() {
  const { data: videos = [], isLoading } = useVideos()
  const [selectedVideo, setSelectedVideo] = useState<any>(null)
  const [showUpload,    setShowUpload]    = useState(false)

  const totalUploaded  = videos.length
  const inEditing      = videos.filter(v => ['In Editor Queue', 'Editing In Progress'].includes(v.status)).length
  const completed      = videos.filter(v => ['Editing Complete', 'Published'].includes(v.status)).length
  const avgTurnaround  = videos.length
    ? Math.round(videos.reduce((s, v) => s + daysSince(v.created_at), 0) / videos.length)
    : 0
  const revisionVideos = videos.filter(v => v.status === 'Revision Requested')

  return (
    <Layout>
      <div className="max-w-4xl mx-auto fade-in space-y-5">

        {/* ── Page header ── */}
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 style={{ fontFamily: 'Montserrat', fontWeight: 900, fontSize: 22, color: '#111827', margin: 0 }}>
              My Videos
            </h1>
            <p style={{ fontFamily: 'Poppins', fontWeight: 400, fontSize: 13, color: '#94A3B8', margin: '3px 0 0' }}>
              {totalUploaded} uploaded · {inEditing} in editing · {completed} completed
            </p>
          </div>
          <button className="btn-primary flex-shrink-0" onClick={() => setShowUpload(true)}>
            <Upload size={14} /> Upload Video
          </button>
        </div>

        {/* ── Stats strip ── */}
        <div className="stats-strip stagger-children" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
          {[
            { label: 'Total Uploaded',  val: totalUploaded },
            { label: 'In Editing',      val: inEditing },
            { label: 'Completed',       val: completed },
            { label: 'Avg Turnaround',  val: null, str: `${avgTurnaround}d` },
          ].map((s, i) => (
            <div key={s.label} className="stats-strip-item fade-in" style={{ animationDelay: `${i * 45}ms` }}>
              <span className="stat-lbl">{s.label}</span>
              <p className="stat-num">
                {s.str ?? <Num n={s.val!} />}
              </p>
            </div>
          ))}
        </div>

        {/* ── Revision alerts ── */}
        {revisionVideos.map((video, i) => (
          <div key={video.id} className="rounded-2xl overflow-hidden slide-up" style={{ border: '1px solid #FDE68A', animationDelay: `${i * 60}ms` }}>
            <div className="flex items-center gap-2.5 px-5 py-2.5" style={{ background: '#FFFBEB', borderBottom: '1px solid #FDE68A' }}>
              <div className="w-1.5 h-1.5 rounded-full flex-shrink-0 pulse-dot" style={{ background: '#F59E0B' }} />
              <AlertCircle size={13} style={{ color: '#B45309' }} />
              <span style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: 11, color: '#B45309', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                Revision Requested
              </span>
            </div>
            <div className="px-5 py-4 flex items-center justify-between gap-4" style={{ background: '#FFFFF8' }}>
              <div className="min-w-0">
                <p style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: 14, color: '#111827', margin: 0 }}>{video.title}</p>
                {video.notes_for_editor && (
                  <p style={{ fontFamily: 'Poppins', fontWeight: 400, fontSize: 12, color: '#6B7280', marginTop: 2 }}>{video.notes_for_editor}</p>
                )}
              </div>
              <button className="btn-primary flex-shrink-0" style={{ fontSize: 12, padding: '8px 16px' }} onClick={() => setSelectedVideo(video)}>
                View <ArrowRight size={12} />
              </button>
            </div>
          </div>
        ))}

        {/* ── Video list ── */}
        <div className="cd-card overflow-hidden">
          <div className="section-header">
            <div className="section-header-icon" style={{ background: '#EFF6FF' }}>
              <Video size={13} style={{ color: '#0284C7' }} />
            </div>
            <span className="page-section-title flex-1">Recent Videos</span>
            {videos.length > 0 && (
              <span style={{ fontFamily: 'Poppins', fontWeight: 500, fontSize: 12, color: '#94A3B8' }}>
                {videos.length} total
              </span>
            )}
            <a href="/counselor/videos"
              className="flex items-center gap-1"
              style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: 12, color: '#0284C7', textDecoration: 'none' }}>
              All <ArrowRight size={11} />
            </a>
          </div>

          {isLoading ? (
            <div className="p-5 space-y-3">
              {[1, 2, 3].map(i => <div key={i} className="skeleton h-14" style={{ animationDelay: `${i * 80}ms` }} />)}
            </div>
          ) : videos.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon" style={{ background: '#EFF6FF' }}>
                <Upload size={22} style={{ color: '#0284C7' }} />
              </div>
              <p className="empty-state-title">No videos yet</p>
              <p className="empty-state-sub">Upload your first video to get started</p>
              <button className="btn-primary mt-1" onClick={() => setShowUpload(true)}>
                <Upload size={14} /> Upload Your First Video
              </button>
            </div>
          ) : (
            <div className="divide-y" style={{ borderColor: 'rgba(0,0,0,0.04)' }}>
              {videos.slice(0, 5).map(video => (
                <div key={video.id} className="interactive-row px-5">
                  <VideoCard video={video} onClick={() => setSelectedVideo(video)} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {showUpload    && <VideoUploadModal onClose={() => setShowUpload(false)} />}
      {selectedVideo && <VideoDetailModal video={selectedVideo} onClose={() => setSelectedVideo(null)} />}
    </Layout>
  )
}
