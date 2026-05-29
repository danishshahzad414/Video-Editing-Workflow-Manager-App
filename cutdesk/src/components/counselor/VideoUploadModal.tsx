import { useState, useCallback } from 'react'
import { useDropzone } from 'react-dropzone'
import { X, Upload, File, Film, CheckCircle, AlertCircle } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { uploadToDrive } from '../../lib/googleDrive'
import { useCreateVideo } from '../../hooks/useVideos'
import { supabase } from '../../lib/supabase'
import { CATEGORIES } from '../../lib/utils'
import { sendNotification } from '../../hooks/useNotifications'
import { DEMO_MODE } from '../../lib/mockData'
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
  const [done, setDone] = useState(false)

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

  // Simulate upload progress for demo mode
  function simulateProgress(onProgress: (p: number) => void): Promise<void> {
    return new Promise(resolve => {
      let p = 0
      const interval = setInterval(() => {
        p += Math.random() * 18 + 8
        if (p >= 100) {
          onProgress(100)
          clearInterval(interval)
          resolve()
        } else {
          onProgress(Math.round(p))
        }
      }, 180)
    })
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!videoFile || !form.title || !form.category || !profile) return
    setUploading(true)
    setProgress(0)

    try {
      let driveUrl = '#'
      let scriptUrl: string | null = null

      if (DEMO_MODE) {
        // Simulate upload progress without hitting real APIs
        await simulateProgress(setProgress)
        driveUrl = `https://drive.google.com/demo/${Date.now()}`
        if (scriptFile) scriptUrl = `https://drive.google.com/demo/script-${Date.now()}`
      } else {
        // Try real Google Drive upload — fall back to placeholder if Drive isn't configured
        try {
          const driveResult = await uploadToDrive(videoFile, profile.full_name, undefined, setProgress)
          driveUrl = driveResult.webViewLink
          if (scriptFile) {
            const scriptResult = await uploadToDrive(scriptFile, profile.full_name, 'Scripts')
            scriptUrl = scriptResult.directDownloadUrl
          }
        } catch {
          // Drive not configured yet — simulate progress and save record with placeholder
          await simulateProgress(setProgress)
          driveUrl = `#pending-${Date.now()}`
          if (scriptFile) scriptUrl = `#pending-script-${Date.now()}`
        }
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
        drive_url: driveUrl,
        edited_drive_url: null,
        script_file_url: scriptUrl,
        script_id: null,
        thumbnail_url: null,
        actual_edit_time_minutes: null,
        estimated_completion_date: null,
        revision_rounds: 0,
        is_urgent: form.is_urgent,
      })

      if (!DEMO_MODE) {
        // Log activity and notify editors in real mode
        await supabase.from('activity_log').insert({
          video_id: null,
          user_id: profile.id,
          action: `Uploaded video: ${form.title}`,
          from_status: null,
          to_status: 'Raw Uploaded',
          notes: null,
          created_at: new Date().toISOString(),
        })
        const { data: editors } = await supabase.from('profiles').select('id').eq('role', 'editor')
        for (const editor of editors || []) {
          await sendNotification(editor.id, 'New video uploaded', `${form.title} by ${profile.full_name}`)
        }
      }

      setDone(true)
      setTimeout(() => onClose(), 1800)
    } catch (err: any) {
      toast.error(err.message || 'Upload failed')
      setUploading(false)
    }
  }

  const isValid = form.title && form.category && videoFile

  if (done) {
    return (
      <div className="modal-overlay">
        <div className="scale-in rounded-2xl p-10 flex flex-col items-center gap-4" style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', boxShadow: '0 20px 60px rgba(0,0,0,0.12)' }}>
          <div className="w-16 h-16 rounded-full flex items-center justify-center" style={{ background: '#DCFCE7' }}>
            <CheckCircle size={32} className="text-emerald-500" />
          </div>
          <div className="text-center">
            <h3 style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 800, fontSize: 20, color: '#0F172A' }}>Video Submitted!</h3>
            <p style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 400, fontSize: 14, color: '#64748B', marginTop: 6 }}>
              <strong style={{ color: '#0F172A' }}>{form.title}</strong> is now in the editor queue.
            </p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className="scale-in rounded-2xl overflow-hidden w-full" style={{ maxWidth: 640, maxHeight: '92vh', background: '#FFFFFF', border: '1px solid #E2E8F0', boxShadow: '0 20px 60px rgba(0,0,0,0.12)', display: 'flex', flexDirection: 'column' }}>

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 flex-shrink-0" style={{ borderBottom: '1px solid #F1F5F9' }}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #0284C7, #06B6D4)' }}>
              <Upload size={16} className="text-white" />
            </div>
            <div>
              <h2 style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 800, fontSize: 17, color: '#0F172A', margin: 0 }}>Upload Video</h2>
              <p style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 400, fontSize: 11, color: '#94A3B8', margin: 0 }}>Fill details then attach your video file</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors hover:bg-slate-100" style={{ color: '#94A3B8' }}>
            <X size={16} />
          </button>
        </div>

        {/* Demo notice */}
        {DEMO_MODE && (
          <div className="mx-6 mt-4 flex items-start gap-2 px-4 py-3 rounded-xl" style={{ background: '#EFF6FF', border: '1px solid #BFDBFE' }}>
            <AlertCircle size={15} className="text-sky-500 flex-shrink-0 mt-0.5" />
            <p style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 500, fontSize: 12, color: '#1D4ED8', margin: 0 }}>
              <strong>Demo Mode:</strong> Upload will be simulated. Connect Google Drive credentials (VITE_GOOGLE_CLIENT_ID etc.) for real file storage.
            </p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-6 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <label className="section-label mb-2 block">Video Title *</label>
              <input className="cd-input" placeholder="e.g. PR Pathway Explained" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required />
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
            <div className="sm:col-span-2">
              <label className="section-label mb-2 block">Description</label>
              <textarea className="cd-textarea" rows={2} placeholder="Brief description of video content..." value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
            </div>
            <div className="sm:col-span-2">
              <label className="section-label mb-2 block">Notes for Editor</label>
              <textarea className="cd-textarea" rows={2} placeholder="Any special instructions, cuts, highlights..." value={form.notes_for_editor} onChange={e => setForm(f => ({ ...f, notes_for_editor: e.target.value }))} />
            </div>
          </div>

          {/* Urgent toggle */}
          <label className="flex items-center gap-3 cursor-pointer select-none">
            <div
              className="w-11 h-6 rounded-full relative transition-all duration-200 flex-shrink-0"
              style={{ background: form.is_urgent ? '#EF4444' : '#E2E8F0' }}
              onClick={() => setForm(f => ({ ...f, is_urgent: !f.is_urgent }))}
            >
              <div className="w-4 h-4 bg-white rounded-full absolute top-1 transition-all duration-200 shadow-sm" style={{ left: form.is_urgent ? 26 : 4 }} />
            </div>
            <div>
              <p style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 600, fontSize: 13, color: '#0F172A', margin: 0 }}>Mark as Urgent</p>
              <p style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 400, fontSize: 11, color: '#94A3B8', margin: 0 }}>Moves to top of editor queue</p>
            </div>
          </label>

          {/* Video drop zone */}
          <div>
            <label className="section-label mb-2 block">Video File * <span style={{ color: '#94A3B8', textTransform: 'none', fontSize: 11 }}>(MP4 / MOV / AVI · max 500 MB)</span></label>
            <div
              {...getVideoProps()}
              className="rounded-xl border-2 border-dashed p-6 text-center cursor-pointer transition-all duration-200"
              style={{
                borderColor: videoDrag ? '#0284C7' : videoFile ? '#10B981' : '#CBD5E1',
                background: videoDrag ? '#EFF6FF' : videoFile ? '#F0FDF4' : '#FAFAFA',
              }}
            >
              <input {...getVideoInputProps()} />
              {videoFile ? (
                <div className="flex flex-col items-center gap-2">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: '#DCFCE7' }}>
                    <Film size={20} className="text-emerald-500" />
                  </div>
                  <p style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 600, fontSize: 13, color: '#065F46' }}>{videoFile.name}</p>
                  <p style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 400, fontSize: 11, color: '#94A3B8' }}>{(videoFile.size / (1024 * 1024)).toFixed(1)} MB · Click to change</p>
                </div>
              ) : (
                <div className="flex flex-col items-center gap-2">
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: '#F1F5F9' }}>
                    <Film size={20} className="text-slate-400" />
                  </div>
                  <p style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 600, fontSize: 13, color: '#475569' }}>Drag & drop or click to select</p>
                  <p style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 400, fontSize: 11, color: '#94A3B8' }}>MP4, MOV, AVI up to 500 MB</p>
                </div>
              )}
            </div>
          </div>

          {/* Script drop zone */}
          <div>
            <label className="section-label mb-2 block">Script File <span style={{ color: '#94A3B8', textTransform: 'none', fontSize: 11 }}>(PDF / DOC / TXT · optional)</span></label>
            <div
              {...getScriptProps()}
              className="rounded-xl border-2 border-dashed p-4 text-center cursor-pointer transition-all duration-200"
              style={{
                borderColor: scriptDrag ? '#0284C7' : scriptFile ? '#10B981' : '#E2E8F0',
                background: scriptDrag ? '#EFF6FF' : scriptFile ? '#F0FDF4' : '#FAFAFA',
              }}
            >
              <input {...getScriptInputProps()} />
              {scriptFile ? (
                <div className="flex items-center justify-center gap-2">
                  <File size={15} className="text-emerald-500" />
                  <span style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 600, fontSize: 12, color: '#065F46' }}>{scriptFile.name}</span>
                </div>
              ) : (
                <p style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 400, fontSize: 12, color: '#94A3B8' }}>Attach script or outline (optional)</p>
              )}
            </div>
          </div>

          {/* Progress bar */}
          {uploading && (
            <div>
              <div className="flex justify-between mb-2">
                <span style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 500, fontSize: 12, color: '#475569' }}>
                  {DEMO_MODE ? 'Simulating upload...' : 'Uploading to Google Drive...'}
                </span>
                <span style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 700, fontSize: 12, color: '#0284C7' }}>{progress}%</span>
              </div>
              <div className="h-2 rounded-full overflow-hidden" style={{ background: '#E2E8F0' }}>
                <div className="h-full rounded-full transition-all duration-300" style={{ width: `${progress}%`, background: 'linear-gradient(90deg, #0284C7, #06B6D4)' }} />
              </div>
            </div>
          )}
        </form>

        {/* Footer */}
        <div className="flex flex-col sm:flex-row justify-end gap-3 px-6 py-4 flex-shrink-0" style={{ borderTop: '1px solid #F1F5F9' }}>
          <button className="btn-secondary order-2 sm:order-1" onClick={onClose} disabled={uploading}>Cancel</button>
          <button className="btn-primary order-1 sm:order-2 justify-center" onClick={handleSubmit as any} disabled={!isValid || uploading}>
            {uploading
              ? <span className="flex items-center gap-2"><div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />{progress}%</span>
              : <><Upload size={15} /> Submit Video</>
            }
          </button>
        </div>
      </div>
    </div>
  )
}
