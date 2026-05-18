import { useState } from 'react'
import { Bell } from 'lucide-react'
import { useNotifications } from '../../hooks/useNotifications'
import NotificationPanel from './NotificationPanel'

interface Props {
  title?: string
}

export default function TopBar({ title }: Props) {
  const { data: notifications = [] } = useNotifications()
  const [showNotif, setShowNotif] = useState(false)
  const unreadCount = notifications.filter(n => !n.is_read).length

  return (
    <>
      <header className="h-14 flex items-center justify-between px-6 border-b border-[rgba(0,162,207,0.15)]" style={{ background: '#006386' }}>
        {title && (
          <h1 className="text-white text-lg" style={{ fontFamily: 'Montserrat', fontWeight: 800 }}>{title}</h1>
        )}
        <div className="flex-1" />
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowNotif(true)}
            className="relative p-2 text-white/70 hover:text-white transition-colors"
          >
            <Bell size={20} />
            {unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 bg-[#00A2CF] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center" style={{ fontFamily: 'Poppins' }}>
                {unreadCount > 9 ? '9+' : unreadCount}
              </span>
            )}
          </button>
        </div>
      </header>
      {showNotif && <NotificationPanel onClose={() => setShowNotif(false)} />}
    </>
  )
}
