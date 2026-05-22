import { useState } from 'react'
import { useVideos } from '../../hooks/useVideos'
import Layout from '../../components/layout/Layout'
import { format, startOfWeek, addDays, startOfMonth, endOfMonth } from 'date-fns'
import { stageColor } from '../../lib/utils'
import { X, UserCheck, Film, Bell, CheckCircle, Send, CalendarDays, BarChart3, Rocket } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../lib/supabase'
import { sendNotification } from '../../hooks/useNotifications'
import { formatDate } from '../../lib/utils'
import { DEMO_MODE, MOCK_VIDEO_ASSIGNMENTS, DEMO_PROFILES } from '../../lib/mockData'
import toast from 'react-hot-toast'

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

const DEMO_EDITORS = Object.values(DEMO_PROFILES)
  .filter(p => p.role === 'editor')
  .map(p => ({ id: p.id, full_name: p.full_name, email: p.email }))

export default function SMMDashboard() {
  const { data: allVideos = [] } = useVideos()
  const [showAssign, setShowAssign] = useState(false)
  const [selectedVideo, setSelectedVideo] = useState<any | null>(null)
  const [videoAssignments, setVideoAssignments] = useState(MOCK_VIDEO_ASSIGNMENTS)

  const readyToPublish     = allVideos.filter(v => ['Editing Complete', 'Pending Social Review'].includes(v.status)).length
  const monthStart         = startOfMonth(new Date())
  const monthEnd           = endOfMonth(new Date())
  const publishedThisMonth = allVideos.filter(v => v.status === 'Published' && new Date(v.updated_at) >= monthStart && new Date(v.updated_at) <= monthEnd).length
  const scheduledThisWeek  = allVideos.filter(v => v.status === 'Scheduled').length
  const weekStart          = startOfWeek(new Date(), { weekStartsOn: 1 })

  const kpis = [
    { label: 'Ready to Publish',     value: readyToPublish,     color: '#0284C7', bg: '#EFF6FF', icon: Send,        glow: 'rgba(2,132,199,0.2)' },
    { label: 'Scheduled This Week',  value: scheduledThisWeek,  color: '#6366F1', bg: '#EEF2FF', icon: CalendarDays, glow: 'rgba(99,102,241,0.2)' },
    { label: 'Published This Month', value: publishedThisMonth, color: '#10B981', bg: '#ECFDF5', icon: CheckCircle,  glow: 'rgba(16,185,129,0.2)' },
    { label: 'Platforms Active',     value: 5,                  color: '#F59E0B', bg: '#FFFBEB', icon: BarChart3,    glow: 'rgba(245,158,11,0.2)' },
  ]

  const weekDays          = DAYS.map((_, i) => addDays(weekStart, i))
  const assignableVideos  = allVideos.filter(v => ['Raw Uploaded', 'In Editor Queue', 'Re-record Submitted'].includes(v.status))

  function getAssignment(videoId: string) {
    return videoAssignments.find(a => a.video_id === videoId)
  }
  function handleOpenAssign(video: any) { setSelectedVideo(video); setShowAssign(true) }
  function handleAssigned(newAssignment: typeof MOCK_VIDEO_ASSIGNMENTS[0]) {
    setVideoAssignments(prev => {
      const exists = prev.find(a => a.video_id === newAssignment.video_id)
      if (exists) return prev.map(a => a.video_id === newAssignment.video_id ? newAssignment : a)
      return [...prev, newAssignment]
    })
  }

  const today = format(new Date(), 'yyyy-MM-dd')

  return (
    <Layout title="SMM Dashboard">
      <div className="fade-in space-y-6">

        {/* ── Hero ── */}
        <div className="relative rounded-2xl overflow-hidden p-6 md:p-8"
          style={{ background: 'linear-gradient(135deg, #0F172A 0%, #1E1B4B 30%, #312E81 60%, #4F46E5 100%)' }}>
          <div className="absolute inset-0 opacity-[0.07]"
            style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '22px 22px' }} />
          <div className="absolute -top-12 -right-12 w-56 h-56 rounded-full opacity-20"
            style={{ background: 'radial-gradient(circle, #818CF8, transparent)' }} />
          <div className="absolute bottom-0 left-1/3 w-40 h-40 rounded-full opacity-10"
            style={{ background: 'radial-gradient(circle, #6366F1, transparent)' }} />

          <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-5">
            <div className="flex items-start gap-4">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
                style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.25)' }}>
                <Rocket size={22} className="text-white" />
              </div>
              <div>
                <p style={{ fontFamily: 'Poppins', fontWeight: 400, fontSize: 13, color: 'rgba(255,255,255,0.55)', margin: 0 }}>Social Media</p>
                <h1 style={{ fontFamily: 'Montserrat', fontWeight: 900, fontSize: 24, color: '#fff', margin: '2px 0 8px' }}>
                  Command Centre
                </h1>
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-2.5 py-1 rounded-lg"
                    style={{ background: 'rgba(255,255,255,0.12)', fontFamily: 'Poppins', fontWeight: 600, fontSize: 11, color: 'rgba(255,255,255,0.85)' }}>
                    📤 {readyToPublish} ready to publish
                  </span>
                  <span className="px-2.5 py-1 rounded-lg"
                    style={{ background: 'rgba(255,255,255,0.12)', fontFamily: 'Poppins', fontWeight: 600, fontSize: 11, color: 'rgba(255,255,255,0.85)' }}>
                    🗓 {scheduledThisWeek} scheduled
                  </span>
                </div>
              </div>
            </div>
            {readyToPublish > 0 && (
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl flex-shrink-0"
                style={{ background: 'rgba(2,132,199,0.25)', border: '1px solid rgba(2,132,199,0.5)' }}>
                <div className="w-2 h-2 rounded-full pulse-dot" style={{ background: '#38BDF8' }} />
                <span style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: 12, color: '#BAE6FD' }}>
                  {readyToPublish} awaiting review
                </span>
              </div>
            )}
          </div>
        </div>

        {/* ── KPI cards ── */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 stagger-children">
          {kpis.map((k, i) => (
            <div key={k.label} className="stat-card p-5 fade-in" style={{ animationDelay: `${i * 60}ms` }}>
              <div className="absolute top-0 left-5 right-5 h-0.5 rounded-full" style={{ background: `linear-gradient(90deg, ${k.color}, transparent)` }} />
              <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: k.bg, boxShadow: `0 4px 12px ${k.glow}` }}>
                  <k.icon size={17} style={{ color: k.color }} />
                </div>
              </div>
              <p style={{ fontFamily: 'Montserrat', fontWeight: 900, fontSize: 30, color: k.color, margin: 0, lineHeight: 1 }}>{k.value}</p>
              <p style={{ fontFamily: 'Poppins', fontWeight: 500, fontSize: 11, color: '#64748B', marginTop: 5 }}>{k.label}</p>
            </div>
          ))}
        </div>

        {/* ── Assign Videos to Editor ── */}
        <div className="cd-card overflow-hidden">
          <div className="px-5 py-4 flex items-center justify-between" style={{ borderBottom: '1px solid #F1F5F9', background: '#FAFAFA' }}>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #0284C7, #06B6D4)' }}>
                <UserCheck size={15} className="text-white" />
              </div>
              <div>
                <h2 style={{ fontFamily: 'Montserrat', fontWeight: 800, fontSize: 14, color: '#0F172A', margin: 0 }}>Assign Videos to Editor</h2>
                <p style={{ fontFamily: 'Poppins', fontWeight: 400, fontSize: 11, color: '#94A3B8', marginTop: 1 }}>
                  {assignableVideos.length} video{assignableVideos.length !== 1 ? 's' : ''} awaiting assignment
                </p>
              </div>
            </div>
            {assignableVideos.length > 0 && (
              <span className="px-2.5 py-1 rounded-full text-[10px] font-bold"
                style={{ background: '#EFF6FF', color: '#0284C7', fontFamily: 'Poppins' }}>
                {assignableVideos.length} pending
              </span>
            )}
          </div>

          {assignableVideos.length === 0 ? (
            <div className="p-12 flex flex-col items-center gap-3">
              <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: '#F1F5F9' }}>
                <Film size={22} className="text-slate-400" />
              </div>
              <p style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: 13, color: '#475569' }}>All videos assigned</p>
              <p style={{ fontFamily: 'Poppins', fontWeight: 400, fontSize: 12, color: '#94A3B8' }}>No videos waiting for editor assignment</p>
            </div>
          ) : (
            <div className="divide-y" style={{ borderColor: '#F8FAFC' }}>
              {assignableVideos.map(video => {
                const assignment = getAssignment(video.id)
                return (
                  <div key={video.id}
                    className="px-5 py-3.5 flex items-center justify-between gap-3 hover:bg-slate-50 transition-colors duration-150">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <p style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: 13, color: '#0F172A', margin: 0 }} className="truncate">{video.title}</p>
                        {video.is_urgent && (
                          <span style={{ background: '#FEE2E2', color: '#EF4444', fontFamily: 'Poppins', fontWeight: 700, fontSize: 9, padding: '2px 6px', borderRadius: 5, letterSpacing: '0.05em' }}>URGENT</span>
                        )}
                        <span className="text-[10px] px-2 py-0.5 rounded-md font-semibold text-white"
                          style={{ background: stageColor(video.status), fontFamily: 'Poppins' }}>
                          {video.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 flex-wrap">
                        <p style={{ fontFamily: 'Poppins', fontWeight: 400, fontSize: 11, color: '#94A3B8', margin: 0 }}>
                          By {video.counselor?.full_name} · {video.category}
                        </p>
                        {assignment ? (
                          <span style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: 11, color: '#10B981' }}>
                            ✓ {assignment.editor?.full_name}{assignment.deadline ? ` · Due ${formatDate(assignment.deadline)}` : ''}
                          </span>
                        ) : (
                          <span style={{ fontFamily: 'Poppins', fontWeight: 500, fontSize: 11, color: '#F59E0B' }}>⚠ No editor assigned</span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => handleOpenAssign(video)}
                      className="flex-shrink-0 text-xs px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all duration-200 hover:scale-105 active:scale-95"
                      style={{
                        background: assignment ? '#F0FDF4' : 'linear-gradient(135deg, #0284C7, #06B6D4)',
                        color: assignment ? '#065F46' : '#fff',
                        fontFamily: 'Poppins', fontWeight: 700,
                        border: assignment ? '1px solid #BBF7D0' : 'none',
                        boxShadow: assignment ? 'none' : '0 3px 10px rgba(2,132,199,0.35)',
                        cursor: 'pointer',
                      }}>
                      <UserCheck size={12} />
                      {assignment ? 'Reassign' : 'Assign'}
                    </button>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {/* ── Weekly publishing calendar ── */}
        <div className="cd-card overflow-hidden">
          <div className="px-5 py-4 flex items-center gap-3" style={{ borderBottom: '1px solid #F1F5F9', background: '#FAFAFA' }}>
            <div className="w-8 h-8 rounded-xl flex items-center justify-center" style={{ background: '#EEF2FF' }}>
              <CalendarDays size={15} style={{ color: '#6366F1' }} />
            </div>
            <div>
              <h2 style={{ fontFamily: 'Montserrat', fontWeight: 800, fontSize: 14, color: '#0F172A', margin: 0 }}>Publishing Calendar</h2>
              <p style={{ fontFamily: 'Poppins', fontWeight: 400, fontSize: 11, color: '#94A3B8', marginTop: 1 }}>This week's scheduled content</p>
            </div>
          </div>
          <div className="p-4 grid grid-cols-7 gap-2 overflow-x-auto">
            {weekDays.map((day, i) => {
              const dayStr    = format(day, 'yyyy-MM-dd')
              const isToday   = dayStr === today
              const dayVideos = allVideos.filter(v => v.status === 'Scheduled' && v.estimated_completion_date === dayStr)
              return (
                <div key={i} className="min-h-[90px]">
                  <div className={`text-center mb-2 py-1.5 rounded-lg`}
                    style={{ background: isToday ? '#EEF2FF' : 'transparent' }}>
                    <p style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: 11, color: isToday ? '#6366F1' : '#475569', margin: 0 }}>{DAYS[i]}</p>
                    <p style={{ fontFamily: 'Poppins', fontWeight: 500, fontSize: 10, color: isToday ? '#818CF8' : '#94A3B8', margin: '1px 0 0' }}>{format(day, 'd')}</p>
                  </div>
                  {dayVideos.map(v => (
                    <div key={v.id} className="px-1.5 py-1 rounded-lg text-[9px] mb-1 truncate"
                      style={{ background: '#EEF2FF', color: '#4338CA', fontFamily: 'Poppins', fontWeight: 600, border: '1px solid #C7D2FE' }}>
                      {v.title.slice(0, 14)}
                    </div>
                  ))}
                  {dayVideos.length === 0 && (
                    <div className="h-1.5 rounded-full mt-1 mx-1" style={{ background: '#F1F5F9' }} />
                  )}
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {showAssign && selectedVideo && (
        <AssignVideoModal
          video={selectedVideo}
          existingAssignment={getAssignment(selectedVideo.id)}
          onClose={() => { setShowAssign(false); setSelectedVideo(null) }}
          onAssigned={(a) => { handleAssigned(a); setShowAssign(false); setSelectedVideo(null) }}
        />
      )}
    </Layout>
  )
}

// ── Assign Video Modal ────────────────────────────────────────────────────────
function AssignVideoModal({ video, existingAssignment, onClose, onAssigned }: {
  video: any
  existingAssignment?: typeof MOCK_VIDEO_ASSIGNMENTS[0]
  onClose: () => void
  onAssigned: (a: typeof MOCK_VIDEO_ASSIGNMENTS[0]) => void
}) {
  const { profile } = useAuth()
  const [editors, setEditors] = useState(DEMO_EDITORS)
  const [selectedEditor, setSelectedEditor] = useState(existingAssignment?.assigned_to || '')
  const [deadline, setDeadline] = useState(existingAssignment?.deadline || '')
  const [notes, setNotes] = useState(existingAssignment?.notes || '')
  const [saving, setSaving] = useState(false)
  const [done, setDone] = useState(false)

  useState(() => {
    if (!DEMO_MODE) {
      supabase.from('profiles').select('id, full_name, email').eq('role', 'editor').then(({ data }) => {
        if (data) setEditors(data)
      })
    }
  })

  const chosenEditor = editors.find(e => e.id === selectedEditor)

  async function handleAssign() {
    if (!selectedEditor || !profile) return
    setSaving(true)
    try {
      if (DEMO_MODE) {
        await new Promise(r => setTimeout(r, 700))
        const assignment: typeof MOCK_VIDEO_ASSIGNMENTS[0] = {
          id: `va-${Date.now()}`,
          video_id: video.id,
          assigned_to: selectedEditor,
          assigned_by: profile.id,
          status: 'Assigned',
          assigned_at: new Date().toISOString(),
          deadline: deadline || null,
          notes: notes || null,
          editor: chosenEditor ? { full_name: chosenEditor.full_name, email: chosenEditor.email } : undefined,
        }
        toast.success(`Assigned to ${chosenEditor?.full_name}!`)
        setDone(true)
        setTimeout(() => onAssigned(assignment), 1200)
        return
      }

      if (existingAssignment) {
        await supabase.from('video_assignments').update({ assigned_to: selectedEditor, deadline: deadline || null, notes: notes || null, assigned_at: new Date().toISOString(), status: 'Assigned' }).eq('id', existingAssignment.id)
      } else {
        await supabase.from('video_assignments').insert({ video_id: video.id, assigned_to: selectedEditor, assigned_by: profile.id, assigned_at: new Date().toISOString(), deadline: deadline || null, notes: notes || null, status: 'Assigned' })
        await supabase.from('videos').update({ status: 'In Editor Queue' }).eq('id', video.id)
      }
      await sendNotification(selectedEditor, `Video assigned: "${video.title}"`, deadline ? `Due ${formatDate(deadline)}` : '', video.id)
      toast.success(`Assigned to ${chosenEditor?.full_name}!`)
      setDone(true)
      setTimeout(() => onAssigned({ id: `va-${Date.now()}`, video_id: video.id, assigned_to: selectedEditor, assigned_by: profile.id, status: 'Assigned', assigned_at: new Date().toISOString(), deadline: deadline || null, notes: notes || null, editor: chosenEditor ? { full_name: chosenEditor.full_name, email: chosenEditor.email } : undefined }), 1200)
    } catch (err: any) {
      toast.error(err.message || 'Assignment failed')
    }
    setSaving(false)
  }

  return (
    <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className="scale-in rounded-2xl overflow-hidden w-full flex flex-col"
        style={{ maxWidth: 500, background: '#FFFFFF', border: '1px solid #E2E8F0', boxShadow: '0 24px 64px rgba(0,0,0,0.14)' }}
        onClick={e => e.stopPropagation()}>

        <div className="px-6 py-4 flex items-center justify-between flex-shrink-0"
          style={{ background: 'linear-gradient(135deg, #6366F1, #8B5CF6)', color: '#fff' }}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.2)' }}>
              <UserCheck size={16} />
            </div>
            <div>
              <h2 style={{ fontFamily: 'Montserrat', fontWeight: 800, fontSize: 16, margin: 0 }}>
                {existingAssignment ? 'Reassign Video' : 'Assign to Editor'}
              </h2>
              <p style={{ fontFamily: 'Poppins', fontWeight: 400, fontSize: 11, opacity: 0.8, margin: 0 }} className="truncate max-w-[260px]">{video.title}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-white/20 transition-colors"
            style={{ background: 'rgba(255,255,255,0.15)', cursor: 'pointer' }}>
            <X size={16} />
          </button>
        </div>

        {done ? (
          <div className="p-12 flex flex-col items-center gap-4 text-center">
            <div className="w-16 h-16 rounded-full flex items-center justify-center pop-in" style={{ background: '#DCFCE7' }}>
              <CheckCircle size={30} className="text-emerald-500" />
            </div>
            <p style={{ fontFamily: 'Montserrat', fontWeight: 800, fontSize: 18, color: '#0F172A' }}>Video Assigned!</p>
            <p style={{ fontFamily: 'Poppins', fontWeight: 400, fontSize: 13, color: '#64748B' }}>
              {chosenEditor?.full_name} will be notified to start editing.
            </p>
          </div>
        ) : (
          <>
            <div className="p-6 space-y-5">
              <div className="flex items-center gap-3 p-3 rounded-xl" style={{ background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                <div className="w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: '#EEF2FF' }}>
                  <Film size={16} className="text-indigo-500" />
                </div>
                <div className="min-w-0">
                  <p style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: 13, color: '#0F172A', margin: 0 }} className="truncate">{video.title}</p>
                  <p style={{ fontFamily: 'Poppins', fontWeight: 400, fontSize: 11, color: '#94A3B8', margin: 0 }}>{video.counselor?.full_name} · {video.category}</p>
                </div>
              </div>

              <div>
                <label className="section-label mb-2 block">Select Editor *</label>
                <div className="space-y-2">
                  {editors.map(editor => (
                    <label key={editor.id}
                      className="flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-150"
                      style={{ border: `1.5px solid ${selectedEditor === editor.id ? '#6366F1' : '#E2E8F0'}`, background: selectedEditor === editor.id ? '#EEF2FF' : '#FAFAFA' }}>
                      <input type="radio" name="editor" value={editor.id} checked={selectedEditor === editor.id} onChange={() => setSelectedEditor(editor.id)} className="accent-indigo-500" />
                      <div className="flex-1 min-w-0">
                        <p style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: 13, color: '#0F172A', margin: 0 }}>{editor.full_name}</p>
                        <p style={{ fontFamily: 'Poppins', fontWeight: 400, fontSize: 11, color: '#94A3B8', margin: 0 }}>{editor.email}</p>
                      </div>
                      {selectedEditor === editor.id && (
                        <span style={{ fontFamily: 'Poppins', fontWeight: 700, fontSize: 10, color: '#6366F1', background: '#C7D2FE', padding: '2px 7px', borderRadius: 5 }}>Selected</span>
                      )}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="section-label mb-2 block">Editing Deadline</label>
                <input type="date" className="cd-input" value={deadline} onChange={e => setDeadline(e.target.value)} />
              </div>

              <div>
                <label className="section-label mb-2 block">Notes for Editor</label>
                <textarea className="cd-textarea" rows={2} placeholder="e.g. Focus on colour grade, cut intro to 5s…" value={notes} onChange={e => setNotes(e.target.value)} />
              </div>

              {DEMO_MODE && (
                <div className="p-3 rounded-xl flex items-start gap-2" style={{ background: '#EEF2FF', border: '1px solid #C7D2FE' }}>
                  <Bell size={13} className="text-indigo-500 mt-0.5 flex-shrink-0" />
                  <p style={{ fontFamily: 'Poppins', fontWeight: 500, fontSize: 12, color: '#4338CA', margin: 0 }}>
                    <strong>Demo Mode:</strong> Assignment simulated. In production the editor receives an in-app notification.
                  </p>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 px-6 py-4" style={{ borderTop: '1px solid #F1F5F9' }}>
              <button className="btn-secondary" onClick={onClose} disabled={saving}>Cancel</button>
              <button
                onClick={handleAssign}
                disabled={!selectedEditor || saving}
                className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm text-white transition-all"
                style={{ background: !selectedEditor || saving ? '#C7D2FE' : 'linear-gradient(135deg, #6366F1, #8B5CF6)', fontFamily: 'Poppins', fontWeight: 700, boxShadow: !selectedEditor || saving ? 'none' : '0 4px 14px rgba(99,102,241,0.42)', cursor: !selectedEditor || saving ? 'not-allowed' : 'pointer' }}>
                {saving ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Assigning...
                  </span>
                ) : <><UserCheck size={14} /> Assign to Editor</>}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
