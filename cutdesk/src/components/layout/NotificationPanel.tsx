import { X, Bell } from 'lucide-react'
import { useNotifications, useMarkNotificationRead, useMarkAllRead } from '../../hooks/useNotifications'
import { timeAgo } from '../../lib/utils'

interface Props {
  onClose: () => void
  onOpenVideo?: (videoId: string) => void
}

export default function NotificationPanel({ onClose, onOpenVideo }: Props) {
  const { data: notifications = [] } = useNotifications()
  const markRead = useMarkNotificationRead()
  const markAll = useMarkAllRead()

  const unread = notifications.filter(n => !n.is_read)

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0" style={{ background: 'rgba(15,23,42,0.3)', backdropFilter: 'blur(2px)' }} onClick={onClose} />
      <div className="relative w-[360px] h-full flex flex-col slide-in-right" style={{ background: '#FFFFFF', borderLeft: '1px solid #E2E8F0', boxShadow: '-8px 0 32px rgba(0,0,0,0.08)' }}>
        <div className="flex items-center justify-between px-5 py-4" style={{ borderBottom: '1px solid #E2E8F0', background: '#FFFFFF' }}>
          <div className="flex items-center gap-3">
            <Bell size={18} className="text-slate-600" />
            <h2 style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 800, fontSize: 16, color: '#0F172A', margin: 0 }}>Notifications</h2>
            {unread.length > 0 && (
              <span className="text-white text-xs px-2 py-0.5 rounded-full" style={{ background: 'linear-gradient(135deg, #0284C7, #06B6D4)', fontFamily: 'Plus Jakarta Sans', fontWeight: 600 }}>
                {unread.length}
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            {unread.length > 0 && (
              <button
                onClick={() => markAll.mutate()}
                className="text-xs hover:underline"
                style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 500, color: '#0284C7' }}
              >
                Mark all read
              </button>
            )}
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-3" style={{ color: '#94A3B8' }}>
              <Bell size={48} />
              <p style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 500, fontSize: 14 }}>You're all caught up</p>
            </div>
          ) : (
            notifications.map(n => (
              <div
                key={n.id}
                onClick={() => {
                  markRead.mutate(n.id)
                  if (n.video_id && onOpenVideo) onOpenVideo(n.video_id)
                }}
                className="flex gap-3 px-4 py-3 cursor-pointer transition-colors"
                style={{
                  borderBottom: '1px solid #F1F5F9',
                  background: n.is_read ? 'transparent' : '#EFF6FF',
                }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#F8FAFC' }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = n.is_read ? 'transparent' : '#EFF6FF' }}
              >
                <div className="w-1 rounded-full flex-shrink-0 mt-1" style={{ background: '#0284C7', minHeight: 32 }} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold leading-snug" style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 600, color: '#0F172A' }}>{n.title}</p>
                  <p className="text-xs mt-0.5 leading-relaxed" style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 500, color: '#475569' }}>{n.body}</p>
                  <p className="text-xs mt-1" style={{ fontFamily: 'Plus Jakarta Sans', color: '#94A3B8' }}>{timeAgo(n.created_at)}</p>
                </div>
                {!n.is_read && <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ background: '#0284C7' }} />}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
