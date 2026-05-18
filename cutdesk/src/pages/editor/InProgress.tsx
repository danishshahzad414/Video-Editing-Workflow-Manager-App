import { useState, useCallback } from 'react'
import { PlayCircle, Upload } from 'lucide-react'
import { useDropzone } from 'react-dropzone'
import { useVideos } from '../../hooks/useVideos'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../lib/supabase'
import { sendNotification } from '../../hooks/useNotifications'
import { uploadToDrive } from '../../lib/googleDrive'
import { useQueryClient } from '@tanstack/react-query'
import { stageColor, timeAgo } from '../../lib/utils'
import Layout from '../../components/layout/Layout'
import VideoDetailModal from '../../components/shared/VideoDetailModal'
import EmptyState from '../../components/shared/EmptyState'
import EditTimer from '../../components/editor/EditTimer'
import ConfirmModal from '../../components/shared/ConfirmModal'
import toast from 'react-hot-toast'

export default function InProgress() {
  const { profile } = useAuth()
  const { data: allVideos = [] } = useVideos()
  const qc = useQueryClient()
  const [detailVideo, setDetailVideo] = useState<any>(null)
  const [completeVideo, setCompleteVideo] = useState<any>(null)
  const [completeNotes, setCompleteNotes] = useState('')
  const [editedFile, setEditedFile] = useState<File | null>(null)
  const [logConfirm, setLogConfirm] = useState<{ videoId: string; minutes: number } | null>(null)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)

  const inProgress = allVideos.filter(v => v.status === 'Editing In Progress')

  const onDrop = useCallback((files: File[]) => { if (files[0]) setEditedFile(files[0]) }, [])
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: { 'video/mp4': [], 'video/quicktime': [], 'video/x-msvideo': [] }, multiple: false })

  async function logTime(videoId: string, minutes: number) {
    await supabase.from('videos').update({ actual_edit_time_minutes: minutes, updated_at: new Date().toISOString() }).eq('id', videoId)
    qc.invalidateQueries({ queryKey: ['videos'] })
    setLogConfirm(null)
    toast.success(`Logged: ${Math.floor(minutes / 60)}h ${minutes % 60}m`)
  }

  async function markComplete() {
    if (!completeVideo || !profile) return
    setUploading(true)
    try {
      let editedUrl = completeVideo.edited_drive_url
      if (editedFile) {
        const result = await uploadToDrive(editedFile, profile.full_name, undefined, setProgress)
        editedUrl = result.webViewLink
      }
      await supabase.from('videos').update({
        status: 'Editing Complete', edited_drive_url: editedUrl,
        updated_at: new Date().toISOString(),
      }).eq('id', completeVideo.id)
      await supabase.from('activity_log').insert({ video_id: completeVideo.id, user_id: profile.id, action: 'Editing complete', from_status: 'Editing In Progress', to_status: 'Editing Complete', notes: completeNotes || null, created_at: new Date().toISOString() })

      const { data: smmUsers } = await supabase.from('profiles').select('id').eq('role', 'social_manager')
      for (const u of smmUsers || []) {
        await sendNotification(u.id, 'Video ready for social media', `"${completeVideo.title}" editing is complete`, completeVideo.id)
      }
      await sendNotification(completeVideo.counselor_id, 'Video editing complete', `"${completeVideo.title}" has been edited and is ready`, completeVideo.id)

      qc.invalidateQueries({ queryKey: ['videos'] })
      setCompleteVideo(null)
      setEditedFile(null)
      setCompleteNotes('')
      toast.success('Marked as editing complete!')
    } catch (err: any) {
      toast.error(err.message || 'Failed')
    } finally {
      setUploading(false)
    }
  }

  return (
    <Layout title="In Progress">
      <div className="max-w-4xl mx-auto fade-in">
        {inProgress.length === 0 ? (
          <EmptyState icon={PlayCircle} title="No videos in progress" description="Start editing a video from your queue" />
        ) : (
          <div className="space-y-3">
            {inProgress.map(video => (
              <div key={video.id} className="cd-card p-4" style={{ borderLeft: `4px solid ${stageColor(video.status)}` }}>
                <div className="flex items-center gap-4">
                  <div className="flex-1 min-w-0 cursor-pointer" onClick={() => setDetailVideo(video)}>
                    <p className="text-white font-bold text-sm truncate" style={{ fontFamily: 'Montserrat', fontWeight: 700 }}>{video.title}</p>
                    <p className="text-white/50 text-xs mt-0.5" style={{ fontFamily: 'Poppins' }}>{(video.counselor as any)?.full_name} · {timeAgo(video.created_at)}</p>
                  </div>
                  <EditTimer
                    videoId={video.id}
                    onStop={minutes => setLogConfirm({ videoId: video.id, minutes })}
                  />
                  {video.actual_edit_time_minutes && (
                    <span className="text-[#10B981] text-xs px-2 py-1 rounded-lg" style={{ background: 'rgba(16,185,129,0.15)', fontFamily: 'Poppins', fontWeight: 600 }}>
                      Logged: {Math.floor(video.actual_edit_time_minutes / 60)}h {video.actual_edit_time_minutes % 60}m
                    </span>
                  )}
                  <button className="btn-primary text-xs py-2 px-3" onClick={() => { setCompleteVideo(video); setEditedFile(null); setCompleteNotes('') }}>
                    Mark Complete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Log time confirm */}
      {logConfirm && (
        <ConfirmModal
          title="Log editing time?"
          message={`Log ${Math.floor(logConfirm.minutes / 60)}h ${logConfirm.minutes % 60}m as editing time for this video?`}
          confirmLabel="Log Time"
          danger={false}
          onConfirm={() => logTime(logConfirm.videoId, logConfirm.minutes)}
          onCancel={() => setLogConfirm(null)}
        />
      )}

      {/* Mark complete modal */}
      {completeVideo && (
        <div className="modal-overlay" onClick={() => setCompleteVideo(null)}>
          <div className="rounded-xl overflow-hidden w-full max-w-lg" style={{ background: '#003D52', border: '1px solid rgba(0,162,207,0.15)' }} onClick={e => e.stopPropagation()}>
            <div className="px-6 py-4" style={{ background: '#006386' }}>
              <h2 className="text-white text-lg" style={{ fontFamily: 'Montserrat', fontWeight: 800 }}>Mark Editing Complete</h2>
              <p className="text-white/60 text-xs mt-0.5" style={{ fontFamily: 'Poppins' }}>{completeVideo.title}</p>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="section-label mb-2 block">Upload Edited Video</label>
                <div {...getRootProps()} className="rounded-xl border-2 border-dashed p-6 text-center cursor-pointer" style={{ borderColor: isDragActive ? '#00A2CF' : 'rgba(0,162,207,0.25)' }}>
                  <input {...getInputProps()} />
                  {editedFile ? (
                    <p className="text-[#00A2CF] text-sm font-semibold" style={{ fontFamily: 'Poppins' }}>{editedFile.name}</p>
                  ) : (
                    <div>
                      <Upload size={24} className="mx-auto mb-2 text-white/20" />
                      <p className="text-white/40 text-sm" style={{ fontFamily: 'Poppins' }}>Drop edited video here (optional)</p>
                    </div>
                  )}
                </div>
              </div>
              <div>
                <label className="section-label mb-2 block">Completion Notes</label>
                <textarea className="cd-textarea" rows={3} placeholder="Any notes for the SMM..." value={completeNotes} onChange={e => setCompleteNotes(e.target.value)} />
              </div>
              {uploading && <div className="h-2 rounded-full" style={{ background: 'rgba(255,255,255,0.1)' }}><div style={{ width: `${progress}%`, height: '100%', background: '#00A2CF', borderRadius: 9999 }} /></div>}
            </div>
            <div className="flex justify-end gap-3 px-6 pb-6">
              <button className="btn-secondary" onClick={() => setCompleteVideo(null)}>Cancel</button>
              <button className="btn-primary" onClick={markComplete} disabled={uploading}>{uploading ? 'Uploading...' : 'Mark Complete'}</button>
            </div>
          </div>
        </div>
      )}

      {detailVideo && <VideoDetailModal video={detailVideo} onClose={() => setDetailVideo(null)} />}
    </Layout>
  )
}
