import { useState, useEffect } from 'react'
import { List, GripVertical } from 'lucide-react'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { useVideos } from '../../hooks/useVideos'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../lib/supabase'
import { sendNotification } from '../../hooks/useNotifications'
import { useQueryClient } from '@tanstack/react-query'
import { stageColor, timeAgo } from '../../lib/utils'
import Layout from '../../components/layout/Layout'
import VideoDetailModal from '../../components/shared/VideoDetailModal'
import EmptyState from '../../components/shared/EmptyState'
import StatusBadge from '../../components/shared/StatusBadge'
import PriorityBadge from '../../components/shared/PriorityBadge'
import toast from 'react-hot-toast'

export default function EditorQueue() {
  const { profile } = useAuth()
  const { data: allVideos = [] } = useVideos()
  const qc = useQueryClient()
  const [queueOrder, setQueueOrder] = useState<string[]>([])
  const [detailVideo, setDetailVideo] = useState<any>(null)
  const [revisionVideo, setRevisionVideo] = useState<any>(null)
  const [revisionNote, setRevisionNote] = useState('')
  const [templates, setTemplates] = useState<any[]>([])

  const queueVideos = allVideos.filter(v => v.status === 'In Editor Queue')

  useEffect(() => {
    setQueueOrder(queueVideos.map(v => v.id))
    fetchTemplates()
  }, [queueVideos.length])

  async function fetchTemplates() {
    const { data } = await supabase.from('editor_note_templates').select('*').order('is_default').order('created_at')
    setTemplates(data || [])
  }

  const orderedQueue = queueOrder.map(id => queueVideos.find(v => v.id === id)).filter(Boolean) as typeof queueVideos

  function onDragEnd(result: any) {
    if (!result.destination) return
    const newOrder = [...queueOrder]
    const [moved] = newOrder.splice(result.source.index, 1)
    newOrder.splice(result.destination.index, 0, moved)
    setQueueOrder(newOrder)
  }

  async function startEditing(video: any) {
    await supabase.from('videos').update({ status: 'Editing In Progress', updated_at: new Date().toISOString() }).eq('id', video.id)
    await supabase.from('activity_log').insert({ video_id: video.id, user_id: profile!.id, action: 'Started editing', from_status: 'In Editor Queue', to_status: 'Editing In Progress', notes: null, created_at: new Date().toISOString() })
    await sendNotification(video.counselor_id, 'Editing started', `Editing has started on "${video.title}"`, video.id)
    qc.invalidateQueries({ queryKey: ['videos'] })
    toast.success('Editing started!')
  }

  async function sendRevision() {
    if (!revisionVideo || !profile) return
    const newRounds = (revisionVideo.revision_rounds || 0) + 1
    await supabase.from('videos').update({ status: 'Revision Requested', revision_rounds: newRounds, notes_for_editor: revisionNote, updated_at: new Date().toISOString() }).eq('id', revisionVideo.id)
    await supabase.from('activity_log').insert({ video_id: revisionVideo.id, user_id: profile.id, action: 'Requested revision', from_status: 'In Editor Queue', to_status: 'Revision Requested', notes: revisionNote, created_at: new Date().toISOString() })
    await sendNotification(revisionVideo.counselor_id, 'Revision requested', `Please re-record "${revisionVideo.title}": ${revisionNote}`, revisionVideo.id)
    qc.invalidateQueries({ queryKey: ['videos'] })
    setRevisionVideo(null)
    setRevisionNote('')
    toast.success('Revision request sent!')
  }

  return (
    <Layout title="My Queue">
      <div className="max-w-3xl mx-auto fade-in">
        {orderedQueue.length === 0 ? (
          <EmptyState icon={List} title="Queue is empty" description="Add videos from the Inbox to start working" />
        ) : (
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="queue">
              {provided => (
                <div {...provided.droppableProps} ref={provided.innerRef} className="space-y-2">
                  {orderedQueue.map((video, index) => (
                    <Draggable key={video.id} draggableId={video.id} index={index}>
                      {(provided: any, snapshot: any) => (
                        <div
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          className="cd-card p-4 flex items-center gap-3"
                          style={{
                            ...provided.draggableProps.style,
                            borderLeft: `4px solid ${stageColor(video.status)}`,
                            opacity: snapshot.isDragging ? 0.9 : 1,
                          }}
                        >
                          <div {...provided.dragHandleProps} className="text-white/30 hover:text-white/60 drag-handle flex-shrink-0">
                            <GripVertical size={18} />
                          </div>
                          <div className="flex-1 min-w-0 cursor-pointer" onClick={() => setDetailVideo(video)}>
                            <p className="text-white text-sm font-bold truncate" style={{ fontFamily: 'Montserrat', fontWeight: 700 }}>{video.title}</p>
                            <p className="text-white/50 text-xs mt-0.5" style={{ fontFamily: 'Poppins' }}>
                              {(video.counselor as any)?.full_name} · {timeAgo(video.created_at)}
                            </p>
                            <div className="flex items-center gap-2 mt-1">
                              <StatusBadge status={video.status} size="sm" />
                              <PriorityBadge priority={video.priority} />
                            </div>
                          </div>
                          <div className="flex gap-2 flex-shrink-0">
                            <button className="btn-primary text-xs py-2 px-3" onClick={() => startEditing(video)}>Start Editing</button>
                            <button
                              className="text-xs py-2 px-3 rounded-lg"
                              style={{ background: 'rgba(239,68,68,0.15)', color: '#EF4444', fontFamily: 'Poppins', fontWeight: 700, border: 'none', cursor: 'pointer' }}
                              onClick={() => { setRevisionVideo(video); setRevisionNote('') }}
                            >
                              Request Revision
                            </button>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        )}
      </div>

      {/* Revision modal */}
      {revisionVideo && (
        <div className="modal-overlay" onClick={() => setRevisionVideo(null)}>
          <div className="rounded-xl overflow-hidden w-full max-w-lg" style={{ background: '#003D52', border: '1px solid rgba(0,162,207,0.15)' }} onClick={e => e.stopPropagation()}>
            <div className="px-6 py-4" style={{ background: '#006386' }}>
              <h2 className="text-white text-lg" style={{ fontFamily: 'Montserrat', fontWeight: 800 }}>Request Revision</h2>
              <p className="text-white/60 text-xs mt-0.5" style={{ fontFamily: 'Poppins' }}>{revisionVideo.title}</p>
            </div>
            <div className="p-6">
              {templates.length > 0 && (
                <div className="mb-3">
                  <select className="cd-select" onChange={e => { if (e.target.value) setRevisionNote(e.target.value) }}>
                    <option value="">Use Template ▾</option>
                    {templates.map(t => <option key={t.id} value={t.body}>{t.title}</option>)}
                  </select>
                </div>
              )}
              <textarea className="cd-textarea" rows={5} placeholder="Describe the revision needed..." value={revisionNote} onChange={e => setRevisionNote(e.target.value)} />
            </div>
            <div className="flex justify-end gap-3 px-6 pb-6">
              <button className="btn-secondary" onClick={() => setRevisionVideo(null)}>Cancel</button>
              <button className="btn-danger" onClick={sendRevision} disabled={!revisionNote.trim()}>Send Revision Request</button>
            </div>
          </div>
        </div>
      )}

      {detailVideo && <VideoDetailModal video={detailVideo} onClose={() => setDetailVideo(null)} />}
    </Layout>
  )
}
