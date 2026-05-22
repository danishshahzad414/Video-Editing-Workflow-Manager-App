import { useState } from 'react'
import { Upload, AlertCircle, Video, Scissors, CheckCircle2, Clock, ArrowRight, TrendingUp } from 'lucide-react'
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
  const completed = videos.filter(v => ['Editing Complete', 'Published'].includes(v.status)).length
  const avgTurnaround = videos.length
    ? Math.round(videos.reduce((sum, v) => sum + daysSince(v.created_at), 0) / videos.length)
    : 0
  const revisionVideos = videos.filter(v => v.status === 'Revision Requested')
  const firstName = profile?.full_name?.split(' ')[0] || 'there'

  const kpis = [
    { label: 'Total Uploaded', value: totalUploaded, color: '#0284C7', bg: '#EFF6FF', icon: Video,        glow: 'rgba(2,132,199,0.18)' },
    { label: 'In Editing',     value: inEditing,     color: '#6366F1', bg: '#EEF2FF', icon: Scissors,     glow: 'rgba(99,102,241,0.18)' },
    { label: 'Completed',      value: completed,     color: '#10B981', bg: '#ECFDF5', icon: CheckCircle2, glow: 'rgba(16,185,129,0.18)' },
    { label: 'Avg Turnaround', value: `${avgTurnaround}d`, color: '#F59E0B', bg: '#FFFBEB', icon: Clock,  glow: 'rgba(245,158,11,0.18)' },
  ]

  return (
    <Layout>
      <div className="max-w-4xl mx-auto fade-in space-y-6">

        {/* ── Hero greeting ── */}
        <div className="relative rounded-2xl overflow-hidden p-6 md:p-8"
          style={{ background: 'linear-gradient(135deg, #0C4A6E 0%, #0369A1 45%, #0284C7 75%, #0EA5E9 100%)' }}>
          {/* dot grid */}
          <div className="absolute inset-0 opacity-[0.07]"
            style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '22px 22px' }} />
          {/* orbs */}
          <div className="absolute -top-12 -right-12 w-52 h-52 rounded-full opacity-20"
            style={{ background: 'radial-gradient(circle, #38BDF8, transparent)' }} />
          <div className="absolute -bottom-8 -left-8 w-36 h-36 rounded-full opacity-10"
            style={{ background: 'radial-gradient(circle, #BAE6FD, transparent)' }} />

          <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-5">
            <div>
              <p style={{ fontFamily: 'Poppins', fontWeight: 500, fontSize: 13, color: 'rgba(255,255,255,0.6)', margin: 0 }}>
                {getGreeting()} 👋
              </p>
              <h1 style={{ fontFamily: 'Montserrat', fontWeight: 900, fontSize: 26, color: '#fff', margin: '4px 0 8px' }}>
                {firstName}!
              </h1>
              <div className="flex items-center gap-3 flex-wrap">
                <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg"
                  style={{ background: 'rgba(255,255,255,0.14)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.22)' }}>
                  <Video size={11} style={{ color: 'rgba(255,255,255,0.85)' }} />
                  <span style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: 11, color: 'rgba(255,255,255,0.9)' }}>
                    {totalUploaded} uploaded
                  </span>
                </span>
                <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg"
                  style={{ background: 'rgba(255,255,255,0.14)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.22)' }}>
                  <Scissors size={11} style={{ color: 'rgba(255,255,255,0.85)' }} />
                  <span style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: 11, color: 'rgba(255,255,255,0.9)' }}>
                    {inEditing} in editing
                  </span>
                </span>
                {revisionVideos.length > 0 && (
                  <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg"
                    style={{ background: 'rgba(251,191,36,0.25)', border: '1px solid rgba(251,191,36,0.5)' }}>
                    <div className="w-1.5 h-1.5 rounded-full pulse-dot" style={{ background: '#FBBF24' }} />
                    <span style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: 11, color: '#FEF3C7' }}>
                      {revisionVideos.length} needs action
                    </span>
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={() => setShowChecklist(true)}
              className="flex-shrink-0 flex items-center gap-2 px-5 py-3 rounded-xl transition-all duration-200 hover:scale-105 active:scale-95"
              style={{ background: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(12px)', border: '1px solid rgba(255,255,255,0.3)', color: '#fff', fontFamily: 'Poppins', fontWeight: 700, fontSize: 13, boxShadow: '0 4px 16px rgba(0,0,0,0.18)', cursor: 'pointer' }}>
              <Upload size={15} /> Upload Video
            </button>
          </div>
        </div>

        {/* ── KPI cards ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 stagger-children">
          {kpis.map((kpi, i) => (
            <div key={kpi.label} className="stat-card p-5 fade-in" style={{ animationDelay: `${i * 60}ms` }}>
              {/* top accent line */}
              <div className="absolute top-0 left-5 right-5 h-0.5 rounded-full" style={{ background: `linear-gradient(90deg, ${kpi.color}, transparent)` }} />
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: kpi.bg, boxShadow: `0 4px 12px ${kpi.glow}` }}>
                  <kpi.icon size={17} style={{ color: kpi.color }} />
                </div>
                <TrendingUp size={12} style={{ color: kpi.color, opacity: 0.4, marginTop: 4 }} />
              </div>
              <p style={{ fontFamily: 'Montserrat', fontWeight: 900, fontSize: 30, color: kpi.color, margin: 0, lineHeight: 1 }}>{kpi.value}</p>
              <p style={{ fontFamily: 'Poppins', fontWeight: 500, fontSize: 11, color: '#64748B', marginTop: 5 }}>{kpi.label}</p>
            </div>
          ))}
        </div>

        {/* ── Revision alerts ── */}
        {revisionVideos.map((video, i) => (
          <div key={video.id} className="rounded-2xl overflow-hidden fade-in" style={{ border: '1px solid #FDE68A', animationDelay: `${i * 60}ms` }}>
            <div className="px-5 py-2.5 flex items-center gap-2.5" style={{ background: '#FFFBEB', borderBottom: '1px solid #FDE68A' }}>
              <div className="w-2 h-2 rounded-full flex-shrink-0 pulse-dot" style={{ background: '#F59E0B' }} />
              <AlertCircle size={13} style={{ color: '#B45309' }} />
              <p style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: 11, color: '#B45309', textTransform: 'uppercase', letterSpacing: '0.08em', margin: 0 }}>
                Action Required — Revision Requested
              </p>
            </div>
            <div className="px-5 py-4 flex items-center justify-between gap-4" style={{ background: '#FFFFF8' }}>
              <div className="min-w-0">
                <p style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: 14, color: '#0F172A', margin: 0 }}>{video.title}</p>
                {video.notes_for_editor && (
                  <p style={{ fontFamily: 'Poppins', fontWeight: 400, fontSize: 12, color: '#64748B', marginTop: 3 }}>{video.notes_for_editor}</p>
                )}
              </div>
              <button className="btn-primary flex-shrink-0 text-xs py-2 px-4" onClick={() => setSelectedVideo(video)}>
                Re-record <ArrowRight size={12} />
              </button>
            </div>
          </div>
        ))}

        {/* ── Recent videos ── */}
        <div className="cd-card overflow-hidden">
          <div className="px-5 py-3.5 flex items-center justify-between" style={{ borderBottom: '1px solid #F1F5F9', background: '#FAFAFA' }}>
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg flex items-center justify-center" style={{ background: '#EFF6FF' }}>
                <Video size={13} style={{ color: '#0284C7' }} />
              </div>
              <span style={{ fontFamily: 'Montserrat', fontWeight: 800, fontSize: 14, color: '#0F172A' }}>My Videos</span>
              {videos.length > 0 && (
                <span className="px-2 py-0.5 rounded-full" style={{ background: '#EFF6FF', fontFamily: 'Poppins', fontWeight: 700, fontSize: 10, color: '#0284C7' }}>
                  {videos.length}
                </span>
              )}
            </div>
            <a href="/counselor/videos"
              style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: 12, color: '#0284C7', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 4 }}>
              View All <ArrowRight size={12} />
            </a>
          </div>

          {isLoading ? (
            <div className="p-10 flex flex-col items-center gap-3">
              <div className="w-6 h-6 border-2 border-sky-400 border-t-transparent rounded-full animate-spin" />
              <p style={{ fontFamily: 'Poppins', fontSize: 12, color: '#94A3B8' }}>Loading videos...</p>
            </div>
          ) : videos.length === 0 ? (
            <div className="p-12 flex flex-col items-center gap-3">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #EFF6FF, #DBEAFE)' }}>
                <Upload size={24} style={{ color: '#0284C7' }} />
              </div>
              <p style={{ fontFamily: 'Montserrat', fontWeight: 800, fontSize: 15, color: '#0F172A' }}>No videos yet</p>
              <p style={{ fontFamily: 'Poppins', fontWeight: 400, fontSize: 13, color: '#94A3B8' }}>Upload your first video to get started</p>
              <button className="btn-primary mt-1" onClick={() => setShowChecklist(true)}>
                <Upload size={14} /> Upload Your First Video
              </button>
            </div>
          ) : (
            <div className="divide-y" style={{ borderColor: '#F8FAFC' }}>
              {videos.slice(0, 5).map(video => (
                <div key={video.id} className="interactive-row px-5">
                  <VideoCard video={video} onClick={() => setSelectedVideo(video)} />
                </div>
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
      {selectedVideo && <VideoDetailModal video={selectedVideo} onClose={() => setSelectedVideo(null)} />}
    </Layout>
  )
}
