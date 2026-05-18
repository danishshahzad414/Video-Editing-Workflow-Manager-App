import { useState, useEffect } from 'react'
import { X, Download, ExternalLink } from 'lucide-react'
import { type Video } from '../../hooks/useVideos'
import { useActivityLog } from '../../hooks/useActivityLog'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../lib/supabase'
import { downloadFromDrive, formatDate, timeAgo } from '../../lib/utils'
import StatusBadge from './StatusBadge'
import PriorityBadge from './PriorityBadge'
import PipelineProgress from './PipelineProgress'
import toast from 'react-hot-toast'

interface Comment {
  id: string
  video_id: string
  user_id: string
  body: string
  is_internal: boolean
  created_at: string
  user?: { full_name: string; role: string }
}

interface Props {
  video: Video
  onClose: () => void
}

const TABS = ['Details', 'Activity', 'Comments', 'Repurpose'] as const
type Tab = typeof TABS[number]

export default function VideoDetailModal({ video, onClose }: Props) {
  const { profile } = useAuth()
  const [tab, setTab] = useState<Tab>('Details')
  const { data: activityLog = [] } = useActivityLog(video.id)
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState('')
  const [isInternal, setIsInternal] = useState(false)
  const [sending, setSending] = useState(false)
  const [repurpose, setRepurpose] = useState<any[]>([])

  const canSeeRepurpose = profile?.role === 'editor' || profile?.role === 'social_manager'
  const canSeeInternal = profile?.role === 'editor' || profile?.role === 'ceo'

  useEffect(() => {
    fetchComments()
    if (canSeeRepurpose) fetchRepurpose()
  }, [video.id])

  async function fetchComments() {
    const { data } = await supabase
      .from('comments')
      .select('*, user:profiles!comments_user_id_fkey(full_name, role)')
      .eq('video_id', video.id)
      .order('created_at', { ascending: true })
    if (data) setComments(data as Comment[])
  }

  async function fetchRepurpose() {
    const { data } = await supabase
      .from('video_repurpose_plans')
      .select('*')
      .eq('video_id', video.id)
    if (data) setRepurpose(data)
  }

  async function sendComment() {
    if (!newComment.trim() || !profile) return
    setSending(true)
    const { error } = await supabase.from('comments').insert({
      video_id: video.id,
      user_id: profile.id,
      body: newComment.trim(),
      is_internal: isInternal,
      created_at: new Date().toISOString(),
    })
    setSending(false)
    if (error) { toast.error('Failed to send comment'); return }
    setNewComment('')
    fetchComments()
  }

  async function updateRepurposeStatus(format_type: string, status: string) {
    const existing = repurpose.find(r => r.format_type === format_type)
    if (existing) {
      await supabase.from('video_repurpose_plans').update({
        status, updated_by: profile!.id, updated_at: new Date().toISOString(),
        ...(status === 'Done' ? { completed_at: new Date().toISOString() } : {}),
      }).eq('id', existing.id)
    } else {
      await supabase.from('video_repurpose_plans').insert({
        video_id: video.id, format_type, status, updated_by: profile!.id,
        updated_at: new Date().toISOString(),
      })
    }
    fetchRepurpose()
    toast.success('Repurpose plan updated!')
  }

  const roleColor: Record<string, string> = { counselor: '#0284C7', editor: '#F59E0B', social_manager: '#8B5CF6', ceo: '#10B981' }

  const visibleComments = canSeeInternal ? comments : comments.filter(c => !c.is_internal)

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div
        className="rounded-2xl overflow-hidden w-full flex flex-col scale-in"
        style={{ maxWidth: 780, maxHeight: '90vh', background: '#FFFFFF', border: '1px solid #E2E8F0', boxShadow: '0 20px 60px rgba(0,0,0,0.12)' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 flex items-start justify-between gap-4" style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0', flexShrink: 0 }}>
          <div className="min-w-0">
            <h2 style={{ fontFamily: 'Montserrat', fontWeight: 800, fontSize: 18, color: '#0F172A', margin: 0 }}>{video.title}</h2>
            <div className="flex items-center gap-2 mt-1.5 flex-wrap">
              <StatusBadge status={video.status} />
              <PriorityBadge priority={video.priority} />
              {video.revision_rounds > 0 && (
                <span style={{
                  background: video.revision_rounds >= 2 ? '#FEE2E2' : '#FEF3C7',
                  color: video.revision_rounds >= 2 ? '#B91C1C' : '#B45309',
                  fontFamily: 'Poppins', fontWeight: 600, fontSize: 10,
                  padding: '2px 6px', borderRadius: 4, textTransform: 'uppercase', letterSpacing: '0.08em',
                }}>
                  {video.revision_rounds} revision{video.revision_rounds > 1 ? 's' : ''}
                </span>
              )}
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 flex-shrink-0 mt-1 transition-colors"><X size={20} /></button>
        </div>

        {/* Tabs */}
        <div className="flex px-6" style={{ borderBottom: '1px solid #E2E8F0', flexShrink: 0, background: '#FFFFFF' }}>
          {TABS.filter(t => t !== 'Repurpose' || canSeeRepurpose).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className="py-3 px-1 mr-6 text-sm border-b-2 transition-colors"
              style={{
                fontFamily: 'Poppins', fontWeight: 600, fontSize: 13,
                borderColor: tab === t ? '#0284C7' : 'transparent',
                color: tab === t ? '#0284C7' : '#94A3B8',
              }}
            >
              {t}
            </button>
          ))}
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {tab === 'Details' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Left col */}
              <div className="space-y-4">
                <div>
                  <p className="section-label mb-2">Counselor</p>
                  <p className="text-sm" style={{ fontFamily: 'Poppins', fontWeight: 500, color: '#0F172A' }}>{(video.counselor as any)?.full_name || '—'}</p>
                </div>
                <div>
                  <p className="section-label mb-2">Category</p>
                  <p className="text-sm" style={{ fontFamily: 'Poppins', fontWeight: 500, color: '#0F172A' }}>{video.category}</p>
                </div>
                {video.date_recorded && (
                  <div>
                    <p className="section-label mb-2">Date Recorded</p>
                    <p className="text-sm" style={{ fontFamily: 'Poppins', fontWeight: 500, color: '#0F172A' }}>{formatDate(video.date_recorded)}</p>
                  </div>
                )}
                {video.description && (
                  <div>
                    <p className="section-label mb-2">Description</p>
                    <p className="text-sm" style={{ fontFamily: 'Poppins', fontWeight: 500, color: '#475569' }}>{video.description}</p>
                  </div>
                )}
                {video.notes_for_editor && (
                  <div>
                    <p className="section-label mb-2">Notes for Editor</p>
                    <div className="p-3 rounded-lg text-sm" style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', fontFamily: 'Poppins', fontWeight: 500, color: '#1E40AF' }}>
                      {video.notes_for_editor}
                    </div>
                  </div>
                )}

                {/* Videos */}
                <div>
                  <p className="section-label mb-2">Raw Video</p>
                  <div className="flex gap-2">
                    <button
                      onClick={() => downloadFromDrive(video.drive_url)}
                      disabled={!video.drive_url}
                      className="btn-primary text-xs py-2 px-3 disabled:opacity-40"
                      title={!video.drive_url ? 'File not available yet' : undefined}
                    >
                      <Download size={13} /> Download
                    </button>
                    {video.drive_url && (
                      <a href={video.drive_url} target="_blank" rel="noreferrer" className="btn-secondary text-xs py-2 px-3">
                        <ExternalLink size={13} /> View
                      </a>
                    )}
                  </div>
                </div>

                <div>
                  <p className="section-label mb-2">Edited Video</p>
                  {video.edited_drive_url ? (
                    <div className="flex gap-2">
                      <button onClick={() => downloadFromDrive(video.edited_drive_url)} className="btn-primary text-xs py-2 px-3">
                        <Download size={13} /> Download
                      </button>
                      <a href={video.edited_drive_url} target="_blank" rel="noreferrer" className="btn-secondary text-xs py-2 px-3">
                        <ExternalLink size={13} /> View
                      </a>
                    </div>
                  ) : (
                    <p className="text-xs" style={{ fontFamily: 'Poppins', color: '#94A3B8' }}>Not uploaded yet</p>
                  )}
                </div>

                {video.script_file_url && (
                  <div>
                    <p className="section-label mb-2">Script File</p>
                    <a href={video.script_file_url} target="_blank" rel="noreferrer" className="btn-secondary text-xs py-2 px-3 inline-flex items-center gap-1">
                      <ExternalLink size={13} /> View Script
                    </a>
                  </div>
                )}
              </div>

              {/* Right col — pipeline */}
              <div>
                <p className="section-label mb-4">Pipeline Progress</p>
                <PipelineProgress currentStatus={video.status} />
              </div>
            </div>
          )}

          {tab === 'Activity' && (
            <div className="space-y-2">
              {activityLog.length === 0 ? (
                <p className="text-sm text-center py-8" style={{ fontFamily: 'Poppins', color: '#94A3B8' }}>No activity yet</p>
              ) : activityLog.map(entry => (
                <div
                  key={entry.id}
                  className="flex gap-3 p-3 rounded-lg"
                  style={{
                    background: entry.from_status === 'Revision Requested' || entry.to_status === 'Revision Requested'
                      ? '#FFF1F2' : '#F8FAFC',
                    borderLeft: `3px solid ${entry.from_status === 'Revision Requested' || entry.to_status === 'Revision Requested' ? '#EF4444' : '#E2E8F0'}`,
                  }}
                >
                  <div className="flex-1">
                    <p className="text-sm" style={{ fontFamily: 'Poppins', fontWeight: 600, color: '#0F172A' }}>
                      {(entry.user as any)?.full_name || 'System'}
                      <span style={{ color: '#475569', fontWeight: 400 }} className="ml-2">{entry.action}</span>
                    </p>
                    {entry.from_status && entry.to_status && (
                      <p className="text-xs mt-0.5" style={{ fontFamily: 'Poppins', color: '#64748B' }}>
                        {entry.from_status} → {entry.to_status}
                      </p>
                    )}
                    {entry.notes && <p className="text-xs mt-1" style={{ fontFamily: 'Poppins', color: '#475569' }}>{entry.notes}</p>}
                  </div>
                  <p className="text-xs flex-shrink-0" style={{ fontFamily: 'Poppins', color: '#94A3B8' }}>{timeAgo(entry.created_at)}</p>
                </div>
              ))}
            </div>
          )}

          {tab === 'Comments' && (
            <div className="flex flex-col h-full" style={{ minHeight: 300 }}>
              <div className="flex-1 space-y-3 mb-4">
                {visibleComments.length === 0 ? (
                  <p className="text-sm text-center py-8" style={{ fontFamily: 'Poppins', color: '#94A3B8' }}>No comments yet</p>
                ) : visibleComments.map(c => (
                  <div key={c.id} className="flex gap-3">
                    <div className="w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center" style={{ background: roleColor[(c.user as any)?.role] || '#E2E8F0' }}>
                      <span style={{ fontFamily: 'Montserrat', fontWeight: 700, fontSize: 11, color: '#fff' }}>
                        {(c.user as any)?.full_name?.charAt(0) || '?'}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold" style={{ fontFamily: 'Poppins', fontWeight: 600, color: '#0F172A' }}>{(c.user as any)?.full_name}</span>
                        {c.is_internal && <span className="text-[10px] px-1.5 py-0.5 rounded" style={{ background: '#FEF3C7', color: '#B45309', fontFamily: 'Poppins', fontWeight: 600 }}>Internal</span>}
                        <span className="text-xs" style={{ fontFamily: 'Poppins', color: '#94A3B8' }}>{timeAgo(c.created_at)}</span>
                      </div>
                      <p className="text-sm mt-0.5" style={{ fontFamily: 'Poppins', fontWeight: 500, color: '#475569' }}>{c.body}</p>
                    </div>
                  </div>
                ))}
              </div>
              {profile?.role !== 'ceo' && (
                <div className="pt-4" style={{ borderTop: '1px solid #E2E8F0' }}>
                  <textarea
                    className="cd-textarea mb-2" rows={2} placeholder="Write a comment..."
                    value={newComment} onChange={e => setNewComment(e.target.value)}
                  />
                  <div className="flex items-center justify-between">
                    {canSeeInternal && (
                      <label className="flex items-center gap-2 cursor-pointer">
                        <div
                          className="w-8 h-5 rounded-full relative"
                          style={{ background: isInternal ? '#F59E0B' : '#E2E8F0' }}
                          onClick={() => setIsInternal(!isInternal)}
                        >
                          <div className="w-3 h-3 bg-white rounded-full absolute top-1 transition-all shadow-sm" style={{ left: isInternal ? 18 : 4 }} />
                        </div>
                        <span style={{ fontFamily: 'Poppins', fontWeight: 500, fontSize: 12, color: '#475569' }}>Internal note</span>
                      </label>
                    )}
                    <button
                      className="btn-primary text-xs py-2 px-4"
                      onClick={sendComment}
                      disabled={!newComment.trim() || sending}
                    >
                      {sending ? 'Sending...' : 'Send'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {tab === 'Repurpose' && canSeeRepurpose && (
            <div className="space-y-4">
              {[
                { format: 'Full Video', platforms: 'YouTube', duration: '5–15 min' },
                { format: 'Short Clip', platforms: 'Instagram Reel, TikTok', duration: '30–60 sec' },
                { format: 'Teaser', platforms: 'Facebook, LinkedIn', duration: '60–90 sec' },
              ].map(({ format, platforms, duration }) => {
                const plan = repurpose.find(r => r.format_type === format)
                const status = plan?.status || 'Not Started'
                const statusStyle = status === 'Done'
                  ? { bg: '#D1FAE5', color: '#065F46' }
                  : status === 'In Progress'
                    ? { bg: '#FEF3C7', color: '#B45309' }
                    : { bg: '#F1F5F9', color: '#64748B' }

                return (
                  <div key={format} className="p-4 rounded-xl" style={{ background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <p className="font-semibold text-sm" style={{ fontFamily: 'Montserrat', fontWeight: 700, color: '#0F172A' }}>{format}</p>
                        <p className="text-xs mt-0.5" style={{ fontFamily: 'Poppins', color: '#94A3B8' }}>{platforms} · {duration}</p>
                      </div>
                      <span style={{ background: statusStyle.bg, color: statusStyle.color, fontFamily: 'Poppins', fontWeight: 600, fontSize: 10, padding: '3px 8px', borderRadius: 4, textTransform: 'uppercase' }}>
                        {status}
                      </span>
                    </div>
                    <div className="flex gap-2">
                      {['Not Started', 'In Progress', 'Done'].map(s => (
                        <button
                          key={s}
                          onClick={() => updateRepurposeStatus(format, s)}
                          className="text-xs py-1.5 px-3 rounded-lg transition-colors"
                          style={{
                            background: status === s ? '#0284C7' : '#FFFFFF',
                            color: status === s ? '#fff' : '#475569',
                            fontFamily: 'Poppins', fontWeight: 600,
                            border: status === s ? 'none' : '1px solid #E2E8F0',
                            cursor: 'pointer',
                          }}
                        >
                          {s}
                        </button>
                      ))}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
