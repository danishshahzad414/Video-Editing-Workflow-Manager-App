import { useState } from 'react'
import Layout from '../../components/layout/Layout'
import VideoUploadModal from '../../components/counselor/VideoUploadModal'
import { Upload, Film, FileText, Zap } from 'lucide-react'

export default function UploadPage() {
  const [showUpload, setShowUpload] = useState(false)

  return (
    <Layout title="Upload Video">
      <div className="fade-in max-w-2xl mx-auto">

        {/* Hero card */}
        <div className="cd-card overflow-hidden">
          {/* Top accent */}
          <div style={{ height: 3, background: 'linear-gradient(90deg,#0284C7,#06B6D4,#38BDF8)' }} />

          <div className="p-10 flex flex-col items-center text-center gap-6">
            {/* Icon */}
            <div className="w-20 h-20 rounded-2xl flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg,#0EA5E9,#0284C7)', boxShadow: '0 8px 24px rgba(2,132,199,0.35)' }}>
              <Upload size={34} className="text-white" />
            </div>

            <div>
              <h1 style={{ fontFamily: 'Montserrat', fontWeight: 900, fontSize: 24, color: '#111827', margin: 0 }}>
                Upload a New Video
              </h1>
              <p style={{ fontFamily: 'Poppins', fontWeight: 400, fontSize: 14, color: '#94A3B8', marginTop: 6 }}>
                Fill in your video details and attach your file to submit it to the editor queue.
              </p>
            </div>

            <button className="btn-primary" style={{ fontSize: 14, padding: '12px 28px' }} onClick={() => setShowUpload(true)}>
              <Upload size={16} /> Start Upload
            </button>
          </div>

          {/* Tips row */}
          <div className="grid grid-cols-3 divide-x" style={{ borderTop: '1px solid rgba(0,0,0,0.05)', borderColor: 'rgba(0,0,0,0.05)' }}>
            {[
              { icon: Film,     title: 'MP4 / MOV / AVI', sub: 'Up to 500 MB' },
              { icon: FileText, title: 'Optional Script',  sub: 'PDF, DOC or TXT' },
              { icon: Zap,      title: 'Mark as Urgent',   sub: 'Jumps the queue' },
            ].map((t, i) => (
              <div key={i} className="flex flex-col items-center gap-1.5 py-5 px-4 text-center">
                <t.icon size={16} style={{ color: '#0284C7' }} />
                <p style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: 12, color: '#374151', margin: 0 }}>{t.title}</p>
                <p style={{ fontFamily: 'Poppins', fontWeight: 400, fontSize: 11, color: '#94A3B8', margin: 0 }}>{t.sub}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {showUpload && <VideoUploadModal onClose={() => setShowUpload(false)} />}
    </Layout>
  )
}
