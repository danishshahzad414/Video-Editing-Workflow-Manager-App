import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { X, Upload, File, Film } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { uploadToDrive } from '../../lib/googleDrive'
import { useCreateVideo } from '../../hooks/useVideos'
import { supabase } from '../../lib/supabase'
import { CATEGORIES } from '../../lib/utils'
import { sendNotification } from '../../hooks/useNotifications'
import toast from 'react-hot-toast'

interface Props {
  onClose: () => void
}

export default function VideoUploadModal({ onClose }: Props) {
  const { profile } = useAuth()
  const createVideo = useCreateVideo()
  const [form, setForm] = useState({
    title: '', category: '', date_recorded: '', description: '',
    notes_for_editor: '', is_urgent: false,
  })
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [scriptFile, setScriptFile] = useState<File | null>(null)
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)

  const onDropVideo = useCallback((files: File[]) => { if (files[0]) setVideoFile(files[0]) }, [])
  const onDropScript = useCallback((files: File[]) => { if (files[0]) setScriptFile(files[0]) }, [])

  const { getRootProps: getVideoProps, getInputProps: getVideoInputProps, isDragActive: videoDrag } = useDropzone({
    onDrop: onDropVideo,
    accept: { 'video/mp4': ['.mp4'], 'video/quicktime': ['.mov'], 'video/x-msvideo': ['.avi'] },
    maxSize: 500 * 1024 * 1024,
    multiple: false,
  })
  const { getRootProps: getScriptProps, getInputProps: getScriptInputProps, isDragActive: scriptDrag } = useDropzone({
    onDrop: onDropScript,
    accept: { 'application/pdf': ['.pdf'], 'application/msword': ['.doc'], 'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'], 'text/plain': ['.txt'] },
    maxSize: 10 * 1024 * 1024,
    multiple: false,
  })

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!videoFile || !form.title || !form.category || !profile) return
    setUploading(true)

    try {
      const driveResult = await uploadToDrive(videoFile, profile.full_name, undefined, setProgress)
      let scriptUrl: string | null = null
      if (scriptFile) {
        const scriptResult = await uploadToDrive(scriptFile, profile.full_name, 'Scripts')
        scriptUrl = scriptResult.directDownloadUrl
      }

      await createVideo.mutateAsync({
        title: form.title,
        category: form.category,
        description: form.description || null,
        date_recorded: form.date_recorded || null,
        notes_for_editor: form.notes_for_editor || null,
        counselor_id: profile.id,
        status: 'Raw Uploaded',
        priority: form.is_urgent ? 'Urgent' : 'Normal',
        drive_url: driveResult.webViewLink,
        edited_drive_url: null,
        script_file_url: scriptUrl,
        script_id: null,
        thumbnail_url: null,
        actual_edit_time_minutes: null,
        estimated_completion_date: null,
        revision_rounds: 0,
        is_urgent: form.is_urgent,
      })

      // Log activity
      await supabase.from('activity_log').insert({
        video_id: null,
        user_id: profile.id,
        action: `Uploaded video: ${form.title}`,
        from_status: null,
        to_status: 'Raw Uploaded',
        notes: null,
        created_at: new Date().toISOString(),
      })

      // Notify editor
      const { data: editors } = await supabase.from('profiles').select('id').eq('role', 'editor')
      for (const editor of editors || []) {
        await sendNotification(editor.id, 'New video uploaded', `${form.title} by ${profile.full_name}`)
      }

      onClose()
    } catch (err: any) {
      toast.error(err.message || 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  const isValid = form.title && form.category && videoFile

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="rounded-xl overflow-hidden w-full" style={{ maxWidth: 640, maxHeight: '90vh', background: '#003D52', border: '1px solid rgba(0,162,207,0.15)', display: 'flex', flexDirection: 'column' }} onClick={e => e.stopPropagation()}>
        <div className="flex items-center justify-between px-6 py-4 flex-shrink-0" style={{ background: '#006386' }}>
          <h2 className="text-white text-lg" style={{ fontFamily: 'Montserrat', fontWeight: 800 }}>Upload Video</h2>
          <button onClick={onClose} className="text-white/60 hover:text-white"><X size={18} /></button>
        </div>

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="section-label mb-2 block">Video Title *</label>
              <input className="cd-input" placeholder="Enter video title" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required />
            </div>
            <div>
              <label className="section-label mb-2 block">Topic / Category *</label>
              <select className="cd-select" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))} required>
                <option value="">Select category</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="section-label mb-2 block">Date Recorded</label>
              <input type="date" className="cd-input" value={form.date_recorded} onChange={e => setForm(f => ({ ...f, date_recorded: e.target.value }))} />
            </div>
            <div className="col-span-2">
              <label className="section-label mb-2 block">Description</label>
              <textarea className="cd-textarea" rows={2} placeholder="Optional description..." value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
            </div>
            <div className="col-span-2">
              <label className="section-label mb-2 block">Special Notes for Editor</label>
              <textarea className="cd-textarea" rows={2} placeholder="Any special instructions for the editor..." value={form.notes_for_editor} onChange={e => setForm(f => ({ ...f, notes_for_editor: e.target.value }))} />
            </div>
          </div>

          <label className="flex items-center gap-3 cursor-pointer">
            <div
              className="w-10 h-6 rounded-full relative transition-colors"
              style={{ background: form.is_urgent ? '#EF4444' : 'rgba(255,255,255,0.15)' }}
              onClick={() => setForm(f => ({ ...f, is_urgent: !f.is_urgent }))}
            >
              <div className="w-4 h-4 bg-white rounded-full absolute top-1 transition-all" style={{ left: form.is_urgent ? 22 : 4 }} />
            </div>
            <span style={{ fontFamily: 'Poppins', fontWeight: 500, fontSize: 14, color: '#fff' }}>Mark as Urgent</span>
          </label>

          {/* Video file drop */}
          <div>
            <label className="section-label mb-2 block">Video File * (MP4/MOV/AVI, max 500MB)</label>
            <div
              {...getVideoProps()}
              className="rounded-xl border-2 border-dashed p-6 text-center cursor-pointer transition-colors"
              style={{ borderColor: videoDrag ? '#00A2CF' : 'rgba(0,162,207,0.25)', background: videoDrag ? 'rgba(0,162,207,0.05)' : 'transparent' }}
            >
              <input {...getVideoInputProps()} />
              {videoFile ? (
                <div className="flex items-center justify-center gap-2 text-[#00A2CF]">
                  <Film size={20} />
                  <span style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: 13 }}>{videoFile.name}</span>
                </div>
              ) : (
                <div className="text-white/50">
                  <Film size={32} className="mx-auto mb-2 text-white/20" />
                  <p style={{ fontFamily: 'Poppins', fontWeight: 500, fontSize: 13 }}>Drag & drop or click to select video</p>
                </div>
              )}
            </div>
          </div>

          {/* Script file drop */}
          <div>
            <label className="section-label mb-2 block">Script / Outline File (PDF/DOC/TXT, max 10MB)</label>
            <div
              {...getScriptProps()}
              className="rounded-xl border-2 border-dashed p-4 text-center cursor-pointer transition-colors"
              style={{ borderColor: scriptDrag ? '#00A2CF' : 'rgba(0,162,207,0.15)', background: scriptDrag ? 'rgba(0,162,207,0.05)' : 'transparent' }}
            >
              <input {...getScriptInputProps()} />
              {scriptFile ? (
                <div className="flex items-center justify-center gap-2 text-[#00A2CF]">
                  <File size={16} />
                  <span style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: 12 }}>{scriptFile.name}</span>
                </div>
              ) : (
                <p className="text-white/40" style={{ fontFamily: 'Poppins', fontWeight: 500, fontSize: 12 }}>Drag & drop or click to attach script (optional)</p>
              )}
            </div>
          </div>

          {uploading && (
            <div>
              <div className="flex justify-between mb-1">
                <span className="text-white/60 text-xs" style={{ fontFamily: 'Poppins' }}>Uploading...</span>
                <span className="text-[#00A2CF] text-xs" style={{ fontFamily: 'Poppins', fontWeight: 600 }}>{progress}%</span>
              </div>
              <div className="h-2 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.1)' }}>
                <div className="h-full rounded-full transition-all" style={{ width: `${progress}%`, background: '#00A2CF' }} />
              </div>
            </div>
          )}
        </form>

        <div className="flex justify-end gap-3 px-6 py-4 border-t border-[rgba(0,162,207,0.15)] flex-shrink-0">
          <button className="btn-secondary" onClick={onClose} disabled={uploading}>Cancel</button>
          <button className="btn-primary" onClick={handleSubmit as any} disabled={!isValid || uploading}>
            {uploading ? `Uploading ${progress}%...` : <><Upload size={16} /> Upload Video</>}
          </button>
        </div>
      </div>
    </div>
  )
}
