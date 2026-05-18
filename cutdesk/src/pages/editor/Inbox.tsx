import { useState } from 'react'
import { Inbox } from 'lucide-react'
import { useVideos } from '../../hooks/useVideos'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../lib/supabase'
import { sendNotification } from '../../hooks/useNotifications'
import Layout from '../../components/layout/Layout'
import VideoCard from '../../components/shared/VideoCard'
import VideoDetailModal from '../../components/shared/VideoDetailModal'
import EmptyState from '../../components/shared/EmptyState'
import toast from 'react-hot-toast'

export default function EditorInbox() {
  const { profile } = useAuth()
  const { data: videos = [] } = useVideos()
  const [selected, setSelected] = useState<string[]>([])
  const [detailVideo, setDetailVideo] = useState<any>(null)
  const [sort, setSort] = useState<'date' | 'priority' | 'counselor'>('date')

  const rawVideos = videos.filter(v => v.status === 'Raw Uploaded')

  function sorted() {
    return [...rawVideos].sort((a, b) => {
      if (sort === 'priority') {
        const order = { Urgent: 0, Normal: 1, Low: 2 }
        return (order[a.priority] || 1) - (order[b.priority] || 1)
      }
      if (sort === 'counselor') {
        return ((a.counselor as any)?.full_name || '').localeCompare((b.counselor as any)?.full_name || '')
      }
      return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    })
  }

  function toggleSelect(id: string) {
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  }

  function selectAll() {
    setSelected(sorted().map(v => v.id))
  }

  async function bulkAddToQueue() {
    for (const id of selected) {
      const video = rawVideos.find(v => v.id === id)
      if (!video) continue
      await supabase.from('videos').update({ status: 'In Editor Queue', updated_at: new Date().toISOString() }).eq('id', id)
      await supabase.from('activity_log').insert({ video_id: id, user_id: profile!.id, action: 'Added to editor queue', from_status: 'Raw Uploaded', to_status: 'In Editor Queue', notes: null, created_at: new Date().toISOString() })
      await sendNotification(video.counselor_id, 'Video added to queue', `Your video "${video.title}" has been added to the editor's queue`, id)
    }
    toast.success(`Updated ${selected.length} videos successfully`)
    setSelected([])
  }

  async function bulkMarkUrgent() {
    for (const id of selected) {
      await supabase.from('videos').update({ priority: 'Urgent', is_urgent: true, updated_at: new Date().toISOString() }).eq('id', id)
    }
    toast.success(`Marked ${selected.length} videos as urgent`)
    setSelected([])
  }

  const sortedVideos = sorted()

  return (
    <Layout title="Inbox">
      <div className="max-w-4xl mx-auto fade-in">
        {/* Sort bar */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-white/50 text-sm" style={{ fontFamily: 'Poppins' }}>{rawVideos.length} videos waiting</p>
          <div className="flex gap-2 items-center">
            <span className="section-label">Sort:</span>
            {(['date', 'priority', 'counselor'] as const).map(s => (
              <button key={s} onClick={() => setSort(s)} className="text-xs px-3 py-1.5 rounded-lg transition-colors capitalize" style={{ background: sort === s ? '#00A2CF' : 'rgba(255,255,255,0.08)', color: sort === s ? '#fff' : 'rgba(245,248,250,0.5)', fontFamily: 'Poppins', fontWeight: 600 }}>
                {s === 'date' ? 'Upload Date' : s === 'priority' ? 'Priority' : 'Counselor'}
              </button>
            ))}
          </div>
        </div>

        {/* Select all */}
        {rawVideos.length > 0 && (
          <div className="flex items-center gap-3 mb-3">
            <input type="checkbox" checked={selected.length === rawVideos.length && rawVideos.length > 0} onChange={e => e.target.checked ? selectAll() : setSelected([])} className="w-4 h-4 accent-[#00A2CF]" />
            <span className="text-white/50 text-xs" style={{ fontFamily: 'Poppins' }}>Select All</span>
          </div>
        )}

        {sortedVideos.length === 0 ? (
          <EmptyState icon={Inbox} title="Inbox is empty" description="New videos from counselors will appear here" />
        ) : (
          <div className="space-y-2">
            {sortedVideos.map(video => (
              <div key={video.id} className="flex items-center gap-3">
                <input
                  type="checkbox"
                  checked={selected.includes(video.id)}
                  onChange={() => toggleSelect(video.id)}
                  onClick={e => e.stopPropagation()}
                  className="w-4 h-4 accent-[#00A2CF] flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <VideoCard
                    video={video}
                    onClick={() => setDetailVideo(video)}
                    actionSlot={
                      <button
                        className="btn-primary text-xs py-1.5 px-3"
                        onClick={async e => {
                          e.stopPropagation()
                          await supabase.from('videos').update({ status: 'In Editor Queue', updated_at: new Date().toISOString() }).eq('id', video.id)
                          await supabase.from('activity_log').insert({ video_id: video.id, user_id: profile!.id, action: 'Added to editor queue', from_status: 'Raw Uploaded', to_status: 'In Editor Queue', notes: null, created_at: new Date().toISOString() })
                          await sendNotification(video.counselor_id, 'Video added to queue', `"${video.title}" added to editor's queue`, video.id)
                          toast.success('Added to queue!')
                        }}
                      >
                        Add to Queue
                      </button>
                    }
                  />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Floating action bar */}
        {selected.length > 0 && (
          <div className="fixed bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 px-5 py-3 rounded-xl shadow-2xl z-50" style={{ background: '#003D52', border: '1px solid rgba(0,162,207,0.3)' }}>
            <span className="text-white text-sm font-semibold" style={{ fontFamily: 'Poppins', fontWeight: 600 }}>{selected.length} selected</span>
            <div className="w-px h-5 bg-white/20" />
            <button className="btn-primary text-xs py-2 px-3" onClick={bulkAddToQueue}>Add to Queue</button>
            <button className="text-xs py-2 px-3 rounded-lg" style={{ background: '#EF4444', color: '#fff', fontFamily: 'Poppins', fontWeight: 700 }} onClick={bulkMarkUrgent}>Mark Urgent</button>
            <button className="text-white/50 hover:text-white text-xs" style={{ fontFamily: 'Poppins' }} onClick={() => setSelected([])}>Clear</button>
          </div>
        )}
      </div>
      {detailVideo && <VideoDetailModal video={detailVideo} onClose={() => setDetailVideo(null)} />}
    </Layout>
  )
}
