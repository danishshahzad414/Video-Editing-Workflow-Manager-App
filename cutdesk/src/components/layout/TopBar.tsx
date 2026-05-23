import { useState } from 'react'
import { Bell, Search, Menu } from 'lucide-react'
import { useNotifications } from '../../hooks/useNotifications'
import NotificationPanel from './NotificationPanel'
import { useAuth } from '../../context/AuthContext'

interface Props {
  title?: string
  onMenuClick?: () => void
}

export default function TopBar({ title, onMenuClick }: Props) {
  const { data: notifications = [] } = useNotifications()
  const { profile } = useAuth()
  const [showNotif, setShowNotif] = useState(false)
  const unreadCount = notifications.filter(n => !n.is_read).length

  const greeting = () => {
    const h = new Date().getHours()
    if (h < 12) return 'Good morning'
    if (h < 17) return 'Good afternoon'
    return 'Good evening'
  }

  const today = new Date().toLocaleDateString('en-AU', { weekday: 'long', day: 'numeric', month: 'long' })
  const firstName = profile?.full_name?.split(' ')[0]

  return (
    <>
      <header
        className="flex items-center justify-between px-4 md:px-6 lg:px-8 flex-shrink-0"
        style={{
          height: 60,
          background: '#FFFFFF',
          borderBottom: '1px solid rgba(0,0,0,0.07)',
          boxShadow: '0 1px 0 rgba(0,0,0,0.04)',
        }}
      >
        {/* Left */}
        <div className="flex items-center gap-3 min-w-0">
          {/* Mobile menu */}
          <button
            onClick={onMenuClick}
            className="lg:hidden w-8 h-8 rounded-lg flex items-center justify-center transition-colors hover:bg-slate-50 flex-shrink-0"
            style={{ border: '1px solid rgba(0,0,0,0.10)' }}
          >
            <Menu size={16} className="text-slate-500" />
          </button>

          {/* Title or greeting */}
          {title ? (
            <h1 style={{ fontFamily: 'Montserrat', fontWeight: 800, fontSize: 18, color: '#111827', margin: 0 }}>
              {title}
            </h1>
          ) : (
            <div className="min-w-0">
              <p style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: 14, color: '#111827', margin: 0, whiteSpace: 'nowrap' }}>
                {greeting()}, <span style={{ color: '#0284C7' }}>{firstName}</span> 👋
              </p>
              <p style={{ fontFamily: 'Poppins', fontWeight: 400, fontSize: 11, color: '#94A3B8', margin: 0, whiteSpace: 'nowrap' }}>
                {today}
              </p>
            </div>
          )}
        </div>

        {/* Right */}
        <div className="flex items-center gap-2">
          {/* Search */}
          <div
            className="hidden md:flex items-center gap-2 px-3 rounded-lg cursor-pointer transition-all duration-150 hover:border-slate-300"
            style={{ height: 36, background: '#F7F8FA', border: '1px solid rgba(0,0,0,0.09)', minWidth: 180 }}
          >
            <Search size={13} style={{ color: '#94A3B8', flexShrink: 0 }} />
            <span style={{ fontFamily: 'Poppins', fontSize: 12, color: '#94A3B8' }}>Quick search…</span>
            <kbd className="ml-auto px-1.5 py-0.5 rounded text-[9px] font-mono flex-shrink-0"
              style={{ background: '#EDEFF2', color: '#94A3B8', border: '1px solid rgba(0,0,0,0.08)' }}>
              ⌘K
            </kbd>
          </div>

          {/* Notification bell */}
          <button
            onClick={() => setShowNotif(true)}
            className="relative w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-150 hover:bg-slate-50 active:scale-95"
            style={{ border: '1px solid rgba(0,0,0,0.09)', background: '#FFFFFF' }}
          >
            <Bell size={16} style={{ color: '#475569' }} />
            {unreadCount > 0 && (
              <span
                className="absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center text-white notif-badge"
                style={{
                  background: 'linear-gradient(135deg, #0284C7, #06B6D4)',
                  fontFamily: 'Poppins',
                  fontWeight: 700,
                  fontSize: 9,
                  boxShadow: '0 2px 6px rgba(2,132,199,0.45)',
                }}
              >
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
