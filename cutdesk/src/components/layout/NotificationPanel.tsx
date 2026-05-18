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
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative w-[360px] h-full bg-[#003D52] border-l border-[rgba(0,162,207,0.15)] flex flex-col slide-in-right">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[rgba(0,162,207,0.15)]" style={{ background: '#006386' }}>
          <div className="flex items-center gap-3">
            <Bell size={18} className="text-white" />
            <h2 className="text-white text-base" style={{ fontFamily: 'Montserrat', fontWeight: 800 }}>Notifications</h2>
            {unread.length > 0 && (
              <span className="bg-[#00A2CF] text-white text-xs px-2 py-0.5 rounded-full" style={{ fontFamily: 'Poppins', fontWeight: 600 }}>
                {unread.length}
              </span>
            )}
          </div>
          <div className="flex items-center gap-3">
            {unread.length > 0 && (
              <button
                onClick={() => markAll.mutate()}
                className="text-xs text-[#00A2CF] hover:underline"
                style={{ fontFamily: 'Poppins', fontWeight: 500 }}
              >
                Mark all read
              </button>
            )}
            <button onClick={onClose} className="text-white/60 hover:text-white">
              <X size={18} />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-3 text-white/40">
              <Bell size={48} />
              <p style={{ fontFamily: 'Poppins', fontWeight: 500, fontSize: 14 }}>You're all caught up</p>
            </div>
          ) : (
            notifications.map(n => (
              <div
                key={n.id}
                onClick={() => {
                  markRead.mutate(n.id)
                  if (n.video_id && onOpenVideo) onOpenVideo(n.video_id)
                }}
                className="flex gap-3 px-4 py-3 border-b border-[rgba(0,162,207,0.08)] cursor-pointer hover:bg-[rgba(0,162,207,0.05)] transition-colors"
                style={{ background: n.is_read ? 'transparent' : 'rgba(0,61,82,0.8)' }}
              >
                <div className="w-1 rounded-full flex-shrink-0 mt-1" style={{ background: '#00A2CF', minHeight: 32 }} />
                <div className="flex-1 min-w-0">
                  <p className="text-white text-sm font-semibold leading-snug" style={{ fontFamily: 'Poppins', fontWeight: 600 }}>{n.title}</p>
                  <p className="text-white/60 text-xs mt-0.5 leading-relaxed" style={{ fontFamily: 'Poppins', fontWeight: 500 }}>{n.body}</p>
                  <p className="text-white/30 text-xs mt-1" style={{ fontFamily: 'Poppins' }}>{timeAgo(n.created_at)}</p>
                </div>
                {!n.is_read && <div className="w-2 h-2 rounded-full bg-[#00A2CF] mt-1.5 flex-shrink-0" />}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )
}
