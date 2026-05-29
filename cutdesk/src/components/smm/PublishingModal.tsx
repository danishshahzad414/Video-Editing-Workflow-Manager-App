import { useState } from 'react'
import { X, Sparkles, ChevronDown, ChevronRight } from 'lucide-react'
import { type Video } from '../../hooks/useVideos'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../lib/supabase'
import { sendNotification } from '../../hooks/useNotifications'
import { generateCaption } from '../../lib/anthropic'
import { PLATFORMS, PLATFORM_CHAR_LIMITS, PLATFORM_COLORS } from '../../lib/utils'
import { useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'

const BEST_TIMES: Record<string, { days: string; times: string }> = {
  YouTube: { days: 'Tue, Wed, Thu', times: '2–4 PM or 6–9 PM' },
  Instagram: { days: 'Mon, Wed, Fri', times: '6–9 AM or 6–9 PM' },
  TikTok: { days: 'Tue, Thu, Fri', times: '7–9 AM or 7–9 PM' },
  Facebook: { days: 'Wed, Thu', times: '1–3 PM' },
  LinkedIn: { days: 'Tue, Wed, Thu', times: '8–10 AM or 12–1 PM' },
}

interface Props {
  video: Video
  onClose: () => void
}

export default function PublishingModal({ video, onClose }: Props) {
  const { profile } = useAuth()
  const qc = useQueryClient()
  const [selectedPlatforms, setSelectedPlatforms] = useState<string[]>([])
  const [activePlatform, setActivePlatform] = useState('')
  const [captions, setCaptions] = useState<Record<string, string>>({})
  const [hashtags, setHashtags] = useState<string[]>([])
  const [hashInput, setHashInput] = useState('')
  const [timing, setTiming] = useState<'now' | 'later'>('later')
  const [scheduleDate, setScheduleDate] = useState('')
  const [scheduleTime, setScheduleTime] = useState('')
  const [generatingFor, setGeneratingFor] = useState('')
  const [showBestTimes, setShowBestTimes] = useState(false)
  const [submitting, setSubmitting] = useState(false)

  function togglePlatform(p: string) {
    setSelectedPlatforms(prev => {
      const next = prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p]
      if (!activePlatform && next.length > 0) setActivePlatform(next[0])
      if (activePlatform === p && !next.includes(p)) setActivePlatform(next[0] || '')
      return next
    })
  }

  async function genCaption(platform: string) {
    setGeneratingFor(platform)
    try {
      const cap = await generateCaption(platform, video.title, video.category, video.description || '', PLATFORM_CHAR_LIMITS[platform])
      setCaptions(prev => ({ ...prev, [platform]: cap }))
    } catch {
      toast.error('Caption generation failed. Please write manually.')
    }
    setGeneratingFor('')
  }

  function addHashtag() {
    const tag = hashInput.trim().replace(/^#/, '')
    if (tag && !hashtags.includes(tag)) setHashtags(prev => [...prev, tag])
    setHashInput('')
  }

  async function handleConfirm() {
    if (selectedPlatforms.length === 0) { toast.error('Select at least one platform'); return }
    setSubmitting(true)
    try {
      const scheduledAt = timing === 'later' && scheduleDate ? `${scheduleDate}T${scheduleTime || '00:00'}:00` : null
      const publishedAt = timing === 'now' ? new Date().toISOString() : null
      const newStatus = timing === 'now' ? 'Published' : 'Scheduled'

      await supabase.from('publishing_details').insert({
        video_id: video.id, platforms: selectedPlatforms, captions, hashtags,
        scheduled_at: scheduledAt, published_at: publishedAt,
        created_by: profile!.id, created_at: new Date().toISOString(),
      })
      await supabase.from('videos').update({ status: newStatus, updated_at: new Date().toISOString() }).eq('id', video.id)
      await supabase.from('activity_log').insert({ video_id: video.id, user_id: profile!.id, action: `${newStatus} on ${selectedPlatforms.join(', ')}`, from_status: video.status, to_status: newStatus, notes: null, created_at: new Date().toISOString() })
      await sendNotification(video.counselor_id, `Video ${newStatus.toLowerCase()}`, `"${video.title}" has been ${newStatus.toLowerCase()} on ${selectedPlatforms.join(', ')}`, video.id)

      qc.invalidateQueries({ queryKey: ['videos'] })
      toast.success(`${newStatus === 'Published' ? 'Marked as published' : 'Scheduled'} on ${selectedPlatforms.length} platform${selectedPlatforms.length > 1 ? 's' : ''}!`)
      onClose()
    } catch (err: any) {
      toast.error(err.message || 'Failed')
    }
    setSubmitting(false)
  }

  const charLimit = activePlatform ? PLATFORM_CHAR_LIMITS[activePlatform] : 0
  const charCount = captions[activePlatform]?.length || 0

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="rounded-xl overflow-hidden w-full flex flex-col" style={{ maxWidth: 680, maxHeight: '90vh', background: '#003D52', border: '1px solid rgba(0,162,207,0.15)' }} onClick={e => e.stopPropagation()}>
        <div className="px-6 py-4 flex-shrink-0" style={{ background: '#006386' }}>
          <div className="flex items-center justify-between">
            <h2 className="text-white text-lg" style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 800 }}>Publish / Schedule</h2>
            <button onClick={onClose} className="text-white/60 hover:text-white"><X size={18} /></button>
          </div>
          <p className="text-white/60 text-xs mt-0.5" style={{ fontFamily: 'Plus Jakarta Sans' }}>{video.title}</p>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Section 1: Platforms */}
          <div>
            <p className="section-label mb-3">Select Platforms</p>
            <div className="flex gap-2 flex-wrap">
              {PLATFORMS.map(p => (
                <button
                  key={p}
                  onClick={() => togglePlatform(p)}
                  className="px-4 py-2 rounded-lg text-sm transition-all"
                  style={{
                    background: selectedPlatforms.includes(p) ? 'rgba(0,162,207,0.15)' : 'rgba(255,255,255,0.05)',
                    border: `2px solid ${selectedPlatforms.includes(p) ? '#00A2CF' : 'rgba(255,255,255,0.1)'}`,
                    color: '#fff', fontFamily: 'Plus Jakarta Sans', fontWeight: 600,
                  }}
                >
                  <span className="w-2 h-2 rounded-full inline-block mr-2" style={{ background: PLATFORM_COLORS[p] }} />
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Section 2: Captions */}
          {selectedPlatforms.length > 0 && (
            <div>
              <p className="section-label mb-3">Caption & Hashtags</p>
              <div className="flex gap-1 mb-3">
                {selectedPlatforms.map(p => (
                  <button key={p} onClick={() => setActivePlatform(p)} className="px-3 py-1.5 rounded-lg text-xs transition-all" style={{ background: activePlatform === p ? '#00A2CF' : 'rgba(255,255,255,0.08)', color: '#fff', fontFamily: 'Plus Jakarta Sans', fontWeight: 600 }}>{p}</button>
                ))}
              </div>
              {activePlatform && (
                <div>
                  <div className="relative">
                    <textarea
                      className="cd-textarea"
                      rows={4}
                      placeholder={`Write your ${activePlatform} caption...`}
                      value={captions[activePlatform] || ''}
                      onChange={e => setCaptions(prev => ({ ...prev, [activePlatform]: e.target.value }))}
                    />
                    <div className="flex items-center justify-between mt-1">
                      <span className="text-xs" style={{ fontFamily: 'Plus Jakarta Sans', color: charCount > charLimit ? '#EF4444' : 'rgba(245,248,250,0.4)' }}>{charCount} / {charLimit}</span>
                      <button
                        onClick={() => genCaption(activePlatform)}
                        disabled={!!generatingFor}
                        className="btn-primary text-xs py-1.5 px-3"
                      >
                        <Sparkles size={12} /> {generatingFor === activePlatform ? 'Generating...' : captions[activePlatform] ? 'Regenerate ↺' : 'Generate Caption ✨'}
                      </button>
                    </div>
                  </div>

                  {/* Hashtags */}
                  <div className="mt-3">
                    <div className="flex gap-2 mb-2">
                      <input
                        className="cd-input flex-1"
                        style={{ height: 36, fontSize: 12 }}
                        placeholder="Add hashtag (press Enter)..."
                        value={hashInput}
                        onChange={e => setHashInput(e.target.value)}
                        onKeyDown={e => { if (e.key === 'Enter') { e.preventDefault(); addHashtag() } }}
                      />
                      <button className="btn-primary text-xs py-2 px-3" onClick={addHashtag}>Add</button>
                    </div>
                    <div className="flex gap-1.5 flex-wrap">
                      {hashtags.map(tag => (
                        <span key={tag} className="flex items-center gap-1 px-2 py-1 rounded-full text-xs" style={{ background: 'rgba(0,162,207,0.2)', color: '#00A2CF', fontFamily: 'Plus Jakarta Sans', fontWeight: 600 }}>
                          #{tag} <button onClick={() => setHashtags(prev => prev.filter(t => t !== tag))} className="text-white/60 hover:text-white ml-0.5">×</button>
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Section 3: Timing */}
          <div>
            <p className="section-label mb-3">Publish Timing</p>
            <div className="flex gap-3 mb-3">
              {(['now', 'later'] as const).map(t => (
                <label key={t} className="flex items-center gap-2 cursor-pointer">
                  <input type="radio" name="timing" value={t} checked={timing === t} onChange={() => setTiming(t)} className="accent-[#00A2CF]" />
                  <span style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 500, fontSize: 14, color: '#fff' }}>{t === 'now' ? 'Publish Now' : 'Schedule for Later'}</span>
                </label>
              ))}
            </div>
            {timing === 'now' && (
              <p className="text-amber-400 text-xs" style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 500 }}>This will be marked as published immediately</p>
            )}
            {timing === 'later' && (
              <div className="flex gap-3">
                <input type="date" className="cd-input flex-1" style={{ height: 40, fontSize: 13 }} value={scheduleDate} onChange={e => setScheduleDate(e.target.value)} />
                <input type="time" className="cd-input flex-1" style={{ height: 40, fontSize: 13 }} value={scheduleTime} onChange={e => setScheduleTime(e.target.value)} />
              </div>
            )}
          </div>

          {/* Section 4: Best times (collapsible) */}
          <div>
            <button onClick={() => setShowBestTimes(!showBestTimes)} className="flex items-center gap-1 text-white/50 hover:text-white/80 text-sm" style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 600 }}>
              {showBestTimes ? <ChevronDown size={14} /> : <ChevronRight size={14} />} Best times to post
            </button>
            {showBestTimes && selectedPlatforms.length > 0 && (
              <div className="mt-2 rounded-xl overflow-hidden" style={{ border: '1px solid rgba(0,162,207,0.15)' }}>
                <table className="w-full">
                  <thead><tr style={{ background: 'rgba(0,162,207,0.05)' }}>
                    {['Platform', 'Best Days', 'Best Times'].map(h => <th key={h} className="px-4 py-2 text-left section-label">{h}</th>)}
                  </tr></thead>
                  <tbody>
                    {selectedPlatforms.map(p => (
                      <tr key={p} style={{ borderTop: '1px solid rgba(0,162,207,0.06)' }}>
                        <td className="px-4 py-2 text-white text-xs font-semibold" style={{ fontFamily: 'Plus Jakarta Sans' }}>{p}</td>
                        <td className="px-4 py-2 text-white/60 text-xs" style={{ fontFamily: 'Plus Jakarta Sans' }}>{BEST_TIMES[p]?.days}</td>
                        <td className="px-4 py-2 text-white/60 text-xs" style={{ fontFamily: 'Plus Jakarta Sans' }}>{BEST_TIMES[p]?.times}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Section 5: Review */}
          {selectedPlatforms.length > 0 && (
            <div className="p-4 rounded-xl" style={{ background: 'rgba(0,162,207,0.06)', border: '1px solid rgba(0,162,207,0.15)' }}>
              <p className="section-label mb-2">Review Summary</p>
              <p className="text-white/70 text-xs mb-1" style={{ fontFamily: 'Plus Jakarta Sans' }}>Publishing to: <strong className="text-white">{selectedPlatforms.join(', ')}</strong></p>
              <p className="text-white/70 text-xs mb-1" style={{ fontFamily: 'Plus Jakarta Sans' }}>Timing: <strong className="text-white">{timing === 'now' ? 'Immediately' : scheduleDate ? `${scheduleDate} ${scheduleTime}` : 'TBD'}</strong></p>
              {activePlatform && captions[activePlatform] && (
                <p className="text-white/70 text-xs" style={{ fontFamily: 'Plus Jakarta Sans' }}>Caption: <span className="text-white/60">{captions[activePlatform].slice(0, 80)}{captions[activePlatform].length > 80 ? '…' : ''}</span></p>
              )}
            </div>
          )}

          <p className="text-white/30 text-xs" style={{ fontFamily: 'Plus Jakarta Sans' }}>Direct API publishing to platforms coming soon</p>
        </div>

        <div className="flex justify-end gap-3 px-6 py-4 border-t border-[rgba(0,162,207,0.15)] flex-shrink-0">
          <button className="btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn-primary" onClick={handleConfirm} disabled={selectedPlatforms.length === 0 || submitting}>
            {submitting ? 'Processing...' : timing === 'now' ? 'Confirm & Publish' : 'Confirm & Schedule'}
          </button>
        </div>
      </div>
    </div>
  )
}
