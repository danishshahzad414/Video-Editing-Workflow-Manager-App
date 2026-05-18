import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { Film, ExternalLink } from 'lucide-react'
import { type Video } from '../../hooks/useVideos'
import { useAuth } from '../../context/AuthContext'
import { uploadToDrive } from '../../lib/googleDrive'
import { supabase } from '../../lib/supabase'
import { sendNotification } from '../../hooks/useNotifications'
import { useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'

interface Props {
  video: Video
  onDone: () => void
}

export default function ReRecordPanel({ video, onDone }: Props) {
  const { profile } = useAuth()
  const qc = useQueryClient()
  const [file, setFile] = useState<File | null>(null)
  const [notes, setNotes] = useState('')
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)

  const onDrop = useCallback((files: File[]) => { if (files[0]) setFile(files[0]) }, [])
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'video/mp4': [], 'video/quicktime': [], 'video/x-msvideo': [] },
    maxSize: 500 * 1024 * 1024,
    multiple: false,
  })

  async function handleSubmit() {
    if (!file || !profile) return
    setUploading(true)
    try {
      const result = await uploadToDrive(file, profile.full_name, undefined, setProgress)
      const newRounds = (video.revision_rounds || 0) + 1

      await supabase.from('videos').update({
        drive_url: result.webViewLink,
        status: 'Re-record Submitted',
        revision_rounds: newRounds,
        updated_at: new Date().toISOString(),
      }).eq('id', video.id)

      await supabase.from('activity_log').insert({
        video_id: video.id,
        user_id: profile.id,
        action: 'Submitted re-record',
        from_status: 'Revision Requested',
        to_status: 'Re-record Submitted',
        notes: notes || null,
        created_at: new Date().toISOString(),
      })

      const { data: editors } = await supabase.from('profiles').select('id').eq('role', 'editor')
      for (const editor of editors || []) {
        await sendNotification(editor.id, 'Re-record submitted', `${profile.full_name} submitted a re-record for "${video.title}"`, video.id)
      }

      qc.invalidateQueries({ queryKey: ['videos'] })
      toast.success('Re-record submitted!')
      onDone()
    } catch (err: any) {
      toast.error(err.message || 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="grid grid-cols-2 gap-4 p-4 rounded-xl" style={{ background: 'rgba(0,162,207,0.05)', border: '1px solid rgba(0,162,207,0.15)' }}>
      {/* Left: Editor feedback */}
      <div>
        <p className="section-label mb-3">Editor's Feedback</p>
        <div className="p-3 rounded-lg mb-3" style={{ background: 'rgba(245,158,11,0.1)', borderLeft: '3px solid #F59E0B' }}>
          <p style={{ fontFamily: 'Poppins', fontWeight: 500, fontSize: 13, color: 'rgba(245,248,250,0.8)' }}>
            {video.notes_for_editor || 'Please re-record with improvements.'}
          </p>
        </div>
        {video.drive_url && (
          <a href={video.drive_url} target="_blank" rel="noreferrer" className="btn-secondary text-xs py-2 px-3 inline-flex items-center gap-1">
            <ExternalLink size={13} /> Watch Original
          </a>
        )}
      </div>

      {/* Right: Submit re-record */}
      <div>
        <p className="section-label mb-3">Submit Your Re-record</p>
        <div
          {...getRootProps()}
          className="rounded-xl border-2 border-dashed p-4 text-center cursor-pointer mb-3"
          style={{ borderColor: isDragActive ? '#00A2CF' : 'rgba(0,162,207,0.25)', background: isDragActive ? 'rgba(0,162,207,0.05)' : 'transparent' }}
        >
          <input {...getInputProps()} />
          {file ? (
            <div className="flex items-center justify-center gap-2 text-[#00A2CF]">
              <Film size={16} />
              <span style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: 12 }}>{file.name}</span>
            </div>
          ) : (
            <p className="text-white/40" style={{ fontFamily: 'Poppins', fontWeight: 500, fontSize: 12 }}>Drop new video here</p>
          )}
        </div>
        <textarea className="cd-textarea mb-3" rows={2} placeholder="Notes for the editor..." value={notes} onChange={e => setNotes(e.target.value)} style={{ fontSize: 12 }} />
        {uploading && (
          <div className="mb-3">
            <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.1)' }}>
              <div className="h-full rounded-full" style={{ width: `${progress}%`, background: '#00A2CF' }} />
            </div>
          </div>
        )}
        <button className="btn-primary w-full justify-center text-sm py-2.5" onClick={handleSubmit} disabled={!file || uploading}>
          {uploading ? `Uploading ${progress}%...` : 'Submit Re-record'}
        </button>
      </div>
    </div>
  )
}
