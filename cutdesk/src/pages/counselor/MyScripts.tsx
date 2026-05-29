import { useState, useEffect, useCallback } from 'react'
import { BookOpen, Film, ChevronDown, ChevronUp } from 'lucide-react'
import { useDropzone } from 'react-dropzone'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../lib/supabase'
import { uploadToDrive } from '../../lib/googleDrive'
import { sendNotification } from '../../hooks/useNotifications'
import { formatDate, PLATFORM_COLORS } from '../../lib/utils'
import Layout from '../../components/layout/Layout'
import EmptyState from '../../components/shared/EmptyState'
import toast from 'react-hot-toast'
import { differenceInDays } from 'date-fns'

type AssignmentStatus = 'Assigned' | 'Acknowledged' | 'Recording' | 'Submitted' | 'Done'

const FILTERS = ['All', 'Pending', 'In Progress', 'Submitted'] as const
type Filter = typeof FILTERS[number]

interface Script {
  id: string; title: string; category: string; target_platforms: string[]
  target_duration: string; body: string; recording_notes: string | null
  priority: string; deadline: string | null; created_by: string
}
interface Assignment {
  id: string; script_id: string; status: AssignmentStatus
  counselor_notes: string | null; assigned_at: string
  script?: Script
}

function filterAssignments(assignments: Assignment[], filter: Filter): Assignment[] {
  if (filter === 'All') return assignments
  if (filter === 'Pending') return assignments.filter(a => ['Assigned', 'Acknowledged'].includes(a.status))
  if (filter === 'In Progress') return assignments.filter(a => a.status === 'Recording')
  if (filter === 'Submitted') return assignments.filter(a => ['Submitted', 'Done'].includes(a.status))
  return assignments
}

function ScriptCard({ assignment, onRefresh }: { assignment: Assignment; onRefresh: () => void }) {
  const { profile } = useAuth()
  const [expanded, setExpanded] = useState(false)
  const [showSubmit, setShowSubmit] = useState(false)
  const script = assignment.script!

  const daysUntilDeadline = script.deadline ? differenceInDays(new Date(script.deadline), new Date()) : null
  const isOverdue = daysUntilDeadline !== null && daysUntilDeadline < 0
  const isNear = daysUntilDeadline !== null && daysUntilDeadline >= 0 && daysUntilDeadline < 3

  const priorityColor = script.priority === 'Urgent' ? '#EF4444' : script.priority === 'Low' ? '#6B7280' : '#0284C7'

  async function updateStatus(status: AssignmentStatus) {
    await supabase.from('script_assignments').update({ status }).eq('id', assignment.id)
    toast.success(`Status updated to ${status}!`)
    onRefresh()

    if (profile) {
      const { data: creators } = await supabase.from('profiles').select('id').eq('role', 'social_manager')
      for (const c of creators || []) {
        if (status === 'Acknowledged') await sendNotification(c.id, `${profile.full_name} acknowledged "${script.title}"`, '', undefined, script.id)
      }
    }
  }

  return (
    <div className="cd-card overflow-hidden" style={{ borderLeft: `4px solid ${priorityColor}` }}>
      <div className="p-4">
        <div className="flex items-start justify-between gap-3 mb-2">
          <h3 className="text-sm font-bold" style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 700, color: '#0F172A' }}>{script.title}</h3>
          <div className="flex items-center gap-2 flex-shrink-0">
            {script.priority !== 'Normal' && (
              <span style={{ background: priorityColor, color: '#fff', fontFamily: 'Plus Jakarta Sans', fontWeight: 600, fontSize: 10, padding: '2px 6px', borderRadius: 4, textTransform: 'uppercase' }}>{script.priority}</span>
            )}
            <span style={{ background: '#EFF6FF', color: '#0284C7', fontFamily: 'Plus Jakarta Sans', fontWeight: 600, fontSize: 10, padding: '2px 6px', borderRadius: 4 }}>{script.category}</span>
          </div>
        </div>

        {/* Platforms & deadline */}
        <div className="flex items-center gap-3 mb-2">
          <div className="flex gap-1">
            {(script.target_platforms || []).map(p => (
              <div key={p} className="w-2 h-2 rounded-full" style={{ background: PLATFORM_COLORS[p] || '#6B7280' }} title={p} />
            ))}
          </div>
          {script.deadline && (
            <span style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 500, fontSize: 11, color: isOverdue ? '#EF4444' : isNear ? '#F59E0B' : '#94A3B8' }}>
              Due {formatDate(script.deadline)}{isOverdue ? ' (Overdue)' : ''}
            </span>
          )}
          <span style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 600, fontSize: 10, padding: '2px 6px', borderRadius: 4, background: '#EFF6FF', color: '#0284C7' }}>{assignment.status}</span>
        </div>

        {/* Recording notes */}
        {script.recording_notes && (
          <div className="p-3 rounded-lg mb-3" style={{ background: '#FFFBEB', borderLeft: '3px solid #F59E0B' }}>
            <p className="text-xs" style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 500, color: '#92400E' }}>{script.recording_notes}</p>
          </div>
        )}

        {/* Expandable script body */}
        <div>
          <button onClick={() => setExpanded(!expanded)} className="flex items-center gap-1 mb-2 transition-colors" style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 600, fontSize: 12, color: '#94A3B8' }}>
            {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />} Read Full Script
          </button>
          {expanded && (
            <div className="p-3 rounded-lg text-xs" style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', fontFamily: 'Plus Jakarta Sans', fontWeight: 500, color: '#475569', whiteSpace: 'pre-wrap', maxHeight: 200, overflowY: 'auto' }}>
              {script.body}
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex gap-2 mt-3">
          {assignment.status === 'Assigned' && (
            <button className="btn-primary text-xs py-2 px-4" onClick={() => updateStatus('Acknowledged')}>Acknowledge</button>
          )}
          {assignment.status === 'Acknowledged' && (
            <button className="btn-primary text-xs py-2 px-4" onClick={() => updateStatus('Recording')}>Start Recording</button>
          )}
          {assignment.status === 'Recording' && (
            <button className="btn-primary text-xs py-2 px-4" onClick={() => setShowSubmit(true)}><Film size={13} /> Submit Recording</button>
          )}
          {['Submitted', 'Done'].includes(assignment.status) && (
            <span className="text-xs flex items-center gap-1" style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 600, color: '#10B981' }}>✓ Recording Submitted</span>
          )}
        </div>
      </div>
      {showSubmit && <SubmitRecordingModal assignment={assignment} onClose={() => setShowSubmit(false)} onDone={() => { setShowSubmit(false); onRefresh() }} />}
    </div>
  )
}

function SubmitRecordingModal({ assignment, onClose, onDone }: { assignment: Assignment; onClose: () => void; onDone: () => void }) {
  const { profile } = useAuth()
  const [file, setFile] = useState<File | null>(null)
  const [notes, setNotes] = useState('')
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)

  const onDrop = useCallback((files: File[]) => { if (files[0]) setFile(files[0]) }, [])
  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop, accept: { 'video/mp4': [], 'video/quicktime': [], 'video/x-msvideo': [] }, multiple: false })

  async function handleSubmit() {
    if (!file || !profile) return
    setUploading(true)
    try {
      const script = assignment.script!
      const result = await uploadToDrive(file, profile.full_name, undefined, setProgress)
      const { data: video } = await supabase.from('videos').insert({
        title: script.title, category: script.category, counselor_id: profile.id,
        status: 'Raw Uploaded', priority: 'Normal', drive_url: result.webViewLink,
        script_id: script.id, notes_for_editor: notes || null,
        revision_rounds: 0, is_urgent: false,
        created_at: new Date().toISOString(), updated_at: new Date().toISOString(),
      }).select().single()

      await supabase.from('script_assignments').update({ status: 'Submitted', submitted_video_id: video?.id }).eq('id', assignment.id)

      const { data: smmUsers } = await supabase.from('profiles').select('id').eq('role', 'social_manager')
      const { data: editors } = await supabase.from('profiles').select('id').eq('role', 'editor')
      for (const u of [...(smmUsers || []), ...(editors || [])]) {
        await sendNotification(u.id, `New recording submitted`, `${profile.full_name} submitted a recording for "${script.title}"`, video?.id, script.id)
      }

      toast.success('Recording submitted!')
      onDone()
    } catch (err: any) {
      toast.error(err.message || 'Upload failed')
    } finally {
      setUploading(false)
    }
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="scale-in rounded-xl overflow-hidden w-full max-w-md" style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', boxShadow: '0 20px 60px rgba(0,0,0,0.15)' }} onClick={e => e.stopPropagation()}>
        <div className="px-5 py-4" style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
          <h3 className="text-base" style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 800, color: '#0F172A' }}>Submit Recording</h3>
        </div>
        <div className="p-5 space-y-4">
          <div {...getRootProps()} className="rounded-xl border-2 border-dashed p-6 text-center cursor-pointer transition-colors" style={{ borderColor: isDragActive ? '#0284C7' : '#BFDBFE', background: isDragActive ? '#EFF6FF' : '#F8FAFC' }}>
            <input {...getInputProps()} />
            {file ? <p className="text-sm font-semibold" style={{ fontFamily: 'Plus Jakarta Sans', color: '#0284C7' }}>{file.name}</p> : <p className="text-sm" style={{ fontFamily: 'Plus Jakarta Sans', color: '#94A3B8' }}>Drop video here (MP4/MOV/AVI)</p>}
          </div>
          <textarea className="cd-textarea" rows={2} placeholder="Notes for editor..." value={notes} onChange={e => setNotes(e.target.value)} />
          {uploading && (
            <div className="h-2 rounded-full" style={{ background: '#E2E8F0' }}>
              <div style={{ width: `${progress}%`, height: '100%', background: 'linear-gradient(90deg, #0284C7, #06B6D4)', borderRadius: 9999, transition: 'width 0.3s ease' }} />
            </div>
          )}
        </div>
        <div className="flex justify-end gap-3 px-5 pb-5">
          <button className="btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn-primary" onClick={handleSubmit} disabled={!file || uploading}>{uploading ? `${progress}%...` : 'Submit'}</button>
        </div>
      </div>
    </div>
  )
}

export default function MyScripts() {
  const { profile } = useAuth()
  const [filter, setFilter] = useState<Filter>('All')
  const [assignments, setAssignments] = useState<Assignment[]>([])
  const [loading, setLoading] = useState(true)

  async function fetchAssignments() {
    if (!profile) return
    const { data } = await supabase
      .from('script_assignments')
      .select('*, script:scripts!script_assignments_script_id_fkey(*)')
      .eq('assigned_to', profile.id)
      .order('assigned_at', { ascending: false })
    setAssignments((data as Assignment[]) || [])
    setLoading(false)
  }

  useEffect(() => { fetchAssignments() }, [profile?.id])

  const filtered = filterAssignments(assignments, filter)

  return (
    <Layout title="My Scripts">
      <div className="max-w-3xl mx-auto fade-in">
        <div className="flex gap-1 mb-5 p-1 rounded-xl w-fit" style={{ background: '#F1F5F9', border: '1px solid #E2E8F0' }}>
          {FILTERS.map(f => (
            <button key={f} onClick={() => setFilter(f)} className="px-4 py-2 rounded-lg text-xs transition-all" style={{ background: filter === f ? '#0284C7' : 'transparent', color: filter === f ? '#fff' : '#475569', fontFamily: 'Plus Jakarta Sans', fontWeight: 600 }}>{f}</button>
          ))}
        </div>
        {loading ? (
          <div className="text-sm text-center py-12" style={{ fontFamily: 'Plus Jakarta Sans', color: '#94A3B8' }}>Loading...</div>
        ) : filtered.length === 0 ? (
          <EmptyState icon={BookOpen} title="No scripts here" description="Scripts assigned to you will appear here" />
        ) : (
          <div className="space-y-3">
            {filtered.map(a => <ScriptCard key={a.id} assignment={a} onRefresh={fetchAssignments} />)}
          </div>
        )}
      </div>
    </Layout>
  )
}
