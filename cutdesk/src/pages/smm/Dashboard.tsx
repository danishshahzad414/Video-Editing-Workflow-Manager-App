import { useState, useEffect } from 'react'
import { useVideos } from '../../hooks/useVideos'
import Layout from '../../components/layout/Layout'
import { format, startOfWeek, addDays, startOfMonth, endOfMonth } from 'date-fns'
import { stageColor } from '../../lib/utils'
import { X, UserCheck, Film, Bell, CheckCircle, CalendarDays } from 'lucide-react'
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
  const weekDays           = DAYS.map((_, i) => addDays(weekStart, i))
  const assignableVideos   = allVideos.filter(v => ['Raw Uploaded', 'In Editor Queue', 'Re-record Submitted'].includes(v.status))

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
    <Layout title="Social Media">
      <div className="fade-in space-y-5">

        {/* ── Page header ── */}
        <div className="flex items-center justify-between gap-4">
          <div>
            <h1 style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 900, fontSize: 22, color: '#111827', margin: 0 }}>
              Command Centre
            </h1>
            <p style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 400, fontSize: 13, color: '#94A3B8', margin: '3px 0 0' }}>
              {readyToPublish > 0
                ? `${readyToPublish} ready to publish · ${scheduledThisWeek} scheduled this week`
                : `${scheduledThisWeek} scheduled · ${publishedThisMonth} published this month`}
            </p>
          </div>
          {readyToPublish > 0 && (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl flex-shrink-0"
              style={{ background: '#EFF6FF', border: '1px solid #BAE6FD' }}>
              <div className="w-1.5 h-1.5 rounded-full pulse-dot" style={{ background: '#0284C7' }} />
              <span style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 600, fontSize: 12, color: '#0369A1' }}>
                {readyToPublish} awaiting review
              </span>
            </div>
          )}
        </div>

        {/* ── Stats strip ── */}
        <div className="stats-strip stagger-children" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
          {[
            { label: 'Ready to Publish',     render: () => <Num n={readyToPublish} /> },
            { label: 'Scheduled This Week',  render: () => <Num n={scheduledThisWeek} /> },
            { label: 'Published This Month', render: () => <Num n={publishedThisMonth} /> },
            { label: 'Platforms Active',     render: () => <Num n={5} /> },
          ].map((s, i) => (
            <div key={s.label} className="stats-strip-item fade-in" style={{ animationDelay: `${i * 40}ms` }}>
              <span className="stat-lbl">{s.label}</span>
              <p className="stat-num">{s.render()}</p>
            </div>
          ))}
        </div>

        {/* ── Assign Videos to Editor ── */}
        <div className="cd-card overflow-hidden">
          <div className="section-header" style={{ borderBottom: '1px solid rgba(0,0,0,0.05)', background: '#FAFBFD' }}>
            <div className="section-header-icon" style={{ background: '#EFF6FF' }}>
              <UserCheck size={13} style={{ color: '#0284C7' }} />
            </div>
            <span className="page-section-title flex-1">Assign Videos to Editor</span>
            {assignableVideos.length > 0 && (
              <span style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 700, fontSize: 11, color: '#0284C7', background: '#EFF6FF', padding: '3px 10px', borderRadius: 20 }}>
                {assignableVideos.length} pending
              </span>
            )}
          </div>

          {assignableVideos.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon"><Film size={20} style={{ color: '#9CA3AF' }} /></div>
              <p className="empty-state-title" style={{ fontSize: 14 }}>All videos assigned</p>
              <p className="empty-state-sub">No videos waiting for editor assignment</p>
            </div>
          ) : (
            <div className="divide-y" style={{ borderColor: 'rgba(0,0,0,0.04)' }}>
              {assignableVideos.map(video => {
                const assignment = getAssignment(video.id)
                return (
                  <div key={video.id}
                    className="px-5 py-3.5 flex items-center justify-between gap-3 hover:bg-slate-50 transition-colors duration-150">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <p style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 600, fontSize: 13, color: '#111827', margin: 0 }} className="truncate">{video.title}</p>
                        {video.is_urgent && (
                          <span style={{ background: '#FEE2E2', color: '#EF4444', fontFamily: 'Plus Jakarta Sans', fontWeight: 700, fontSize: 9, padding: '2px 6px', borderRadius: 5, letterSpacing: '0.05em' }}>URGENT</span>
                        )}
                        <span className="text-[10px] px-2 py-0.5 rounded-md font-semibold text-white"
                          style={{ background: stageColor(video.status), fontFamily: 'Plus Jakarta Sans' }}>
                          {video.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 flex-wrap">
                        <p style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 400, fontSize: 11, color: '#94A3B8', margin: 0 }}>
                          By {video.counselor?.full_name} · {video.category}
                        </p>
                        {assignment ? (
                          <span style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 600, fontSize: 11, color: '#10B981' }}>
                            ✓ {assignment.editor?.full_name}{assignment.deadline ? ` · Due ${formatDate(assignment.deadline)}` : ''}
                          </span>
                        ) : (
                          <span style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 500, fontSize: 11, color: '#F59E0B' }}>⚠ No editor assigned</span>
                        )}
                      </div>
                    </div>
                    <button
                      onClick={() => handleOpenAssign(video)}
                      className="flex-shrink-0 text-xs px-3 py-1.5 rounded-xl flex items-center gap-1.5 transition-all duration-200 hover:scale-105 active:scale-95"
                      style={{
                        background: assignment ? '#F0FDF4' : 'linear-gradient(135deg, #0284C7, #06B6D4)',
                        color: assignment ? '#065F46' : '#fff',
                        fontFamily: 'Plus Jakarta Sans', fontWeight: 700,
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
          <div className="section-header" style={{ borderBottom: '1px solid rgba(0,0,0,0.05)', background: '#FAFBFD' }}>
            <div className="section-header-icon" style={{ background: '#EEF2FF' }}>
              <CalendarDays size={13} style={{ color: '#6366F1' }} />
            </div>
            <span className="page-section-title">Publishing Calendar</span>
            <span style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 400, fontSize: 12, color: '#94A3B8' }}>This week's scheduled content</span>
          </div>
          <div className="p-4 grid grid-cols-7 gap-2 overflow-x-auto">
            {weekDays.map((day, i) => {
              const dayStr    = format(day, 'yyyy-MM-dd')
              const isToday   = dayStr === today
              const dayVideos = allVideos.filter(v => v.status === 'Scheduled' && v.estimated_completion_date === dayStr)
              return (
                <div key={i} className="min-h-[90px]">
                  <div className="text-center mb-2 py-1.5 rounded-lg"
                    style={{ background: isToday ? '#EEF2FF' : 'transparent' }}>
                    <p style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 700, fontSize: 11, color: isToday ? '#6366F1' : '#475569', margin: 0 }}>{DAYS[i]}</p>
                    <p style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 500, fontSize: 10, color: isToday ? '#818CF8' : '#94A3B8', margin: '1px 0 0' }}>{format(day, 'd')}</p>
                  </div>
                  {dayVideos.map(v => (
                    <div key={v.id} className="px-1.5 py-1 rounded-lg text-[9px] mb-1 truncate"
                      style={{ background: '#EEF2FF', color: '#4338CA', fontFamily: 'Plus Jakarta Sans', fontWeight: 600, border: '1px solid #C7D2FE' }}>
                      {v.title.slice(0, 14)}
                    </div>
                  ))}
                  {dayVideos.length === 0 && (
                    <div className="h-1.5 rounded-full mt-1 mx-1" style={{ background: 'rgba(0,0,0,0.05)' }} />
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
        style={{ maxWidth: 500, background: '#FFFFFF', border: '1px solid rgba(0,0,0,0.07)', boxShadow: '0 24px 64px rgba(0,0,0,0.14)' }}
        onClick={e => e.stopPropagation()}>

        <div className="px-6 py-4 flex items-center justify-between flex-shrink-0"
          style={{ borderBottom: '1px solid rgba(0,0,0,0.06)' }}>
          <div className="flex items-center gap-3">
            <div className="section-header-icon" style={{ background: '#EFF6FF' }}>
              <UserCheck size={13} style={{ color: '#0284C7' }} />
            </div>
            <div>
              <h2 style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 800, fontSize: 16, color: '#111827', margin: 0 }}>
                {existingAssignment ? 'Reassign Video' : 'Assign to Editor'}
              </h2>
              <p style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 400, fontSize: 11, color: '#94A3B8', margin: 0 }} className="truncate max-w-[260px]">{video.title}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-slate-100 transition-colors"
            style={{ border: '1px solid rgba(0,0,0,0.08)', cursor: 'pointer', background: 'transparent' }}>
            <X size={15} style={{ color: '#6B7280' }} />
          </button>
        </div>

        {done ? (
          <div className="p-12 flex flex-col items-center gap-4 text-center">
            <div className="w-16 h-16 rounded-full flex items-center justify-center pop-in" style={{ background: '#DCFCE7' }}>
              <CheckCircle size={30} style={{ color: '#10B981' }} />
            </div>
            <p style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 800, fontSize: 18, color: '#111827' }}>Video Assigned!</p>
            <p style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 400, fontSize: 13, color: '#64748B' }}>
              {chosenEditor?.full_name} will be notified to start editing.
            </p>
          </div>
        ) : (
          <>
            <div className="p-6 space-y-5">
              <div className="flex items-center gap-3 p-3 rounded-xl" style={{ background: '#F8FAFC', border: '1px solid rgba(0,0,0,0.06)' }}>
                <div className="section-header-icon flex-shrink-0" style={{ background: '#EEF2FF' }}>
                  <Film size={13} style={{ color: '#6366F1' }} />
                </div>
                <div className="min-w-0">
                  <p style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 600, fontSize: 13, color: '#111827', margin: 0 }} className="truncate">{video.title}</p>
                  <p style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 400, fontSize: 11, color: '#94A3B8', margin: 0 }}>{video.counselor?.full_name} · {video.category}</p>
                </div>
              </div>

              <div>
                <label className="section-label mb-2 block">Select Editor *</label>
                <div className="space-y-2">
                  {editors.map(editor => (
                    <label key={editor.id}
                      className="flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all duration-150"
                      style={{ border: `1.5px solid ${selectedEditor === editor.id ? '#0284C7' : 'rgba(0,0,0,0.08)'}`, background: selectedEditor === editor.id ? '#EFF6FF' : '#FAFBFD' }}>
                      <input type="radio" name="editor" value={editor.id} checked={selectedEditor === editor.id} onChange={() => setSelectedEditor(editor.id)} className="accent-sky-500" />
                      <div className="flex-1 min-w-0">
                        <p style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 600, fontSize: 13, color: '#111827', margin: 0 }}>{editor.full_name}</p>
                        <p style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 400, fontSize: 11, color: '#94A3B8', margin: 0 }}>{editor.email}</p>
                      </div>
                      {selectedEditor === editor.id && (
                        <span style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 700, fontSize: 10, color: '#0284C7', background: '#DBEAFE', padding: '2px 7px', borderRadius: 5 }}>Selected</span>
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
                <div className="p-3 rounded-xl flex items-start gap-2" style={{ background: '#EFF6FF', border: '1px solid #BAE6FD' }}>
                  <Bell size={13} style={{ color: '#0284C7', marginTop: 2, flexShrink: 0 }} />
                  <p style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 500, fontSize: 12, color: '#0369A1', margin: 0 }}>
                    <strong>Demo Mode:</strong> Assignment simulated. In production the editor receives an in-app notification.
                  </p>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 px-6 py-4" style={{ borderTop: '1px solid rgba(0,0,0,0.05)' }}>
              <button className="btn-secondary" onClick={onClose} disabled={saving}>Cancel</button>
              <button
                onClick={handleAssign}
                disabled={!selectedEditor || saving}
                className="btn-primary"
                style={{ opacity: !selectedEditor || saving ? 0.5 : 1, cursor: !selectedEditor || saving ? 'not-allowed' : 'pointer' }}>
                {saving ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Assigning...
                  </span>
                ) : <><UserCheck size={14} /> {existingAssignment ? 'Reassign' : 'Assign to Editor'}</>}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
