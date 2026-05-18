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

  return (
    <>
      <header className="h-16 flex items-center justify-between px-4 md:px-6 lg:px-8" style={{ background: '#FFFFFF', borderBottom: '1px solid #E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
        <div className="flex items-center gap-3">
          {/* Hamburger — mobile only */}
          <button
            onClick={onMenuClick}
            className="lg:hidden w-9 h-9 rounded-lg flex items-center justify-center transition-colors hover:bg-slate-50 flex-shrink-0"
            style={{ border: '1.5px solid #E2E8F0' }}
          >
            <Menu size={18} className="text-slate-500" />
          </button>
        <div className="flex flex-col">
          {title ? (
            <h1 style={{ fontFamily: 'Montserrat', fontWeight: 800, fontSize: 20, color: '#0F172A', margin: 0 }}>{title}</h1>
          ) : (
            <div>
              <p style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: 14, color: '#0F172A', margin: 0 }}>
                {greeting()}, <span style={{ color: '#0284C7' }}>{profile?.full_name?.split(' ')[0]}</span> 👋
              </p>
              <p style={{ fontFamily: 'Poppins', fontWeight: 400, fontSize: 12, color: '#94A3B8', margin: 0 }}>
                {new Date().toLocaleDateString('en-AU', { weekday: 'long', day: 'numeric', month: 'long' })}
              </p>
            </div>
          )}
        </div>
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          {/* Search bar */}
          <div className="hidden md:flex items-center gap-2 px-3 h-9 rounded-lg" style={{ background: '#F8FAFC', border: '1.5px solid #E2E8F0' }}>
            <Search size={14} className="text-slate-400" />
            <span style={{ fontFamily: 'Poppins', fontSize: 13, color: '#94A3B8' }}>Quick search...</span>
            <kbd className="px-1.5 py-0.5 rounded text-[10px] font-mono" style={{ background: '#E2E8F0', color: '#64748B' }}>⌘K</kbd>
          </div>

          {/* Notification bell */}
          <button
            onClick={() => setShowNotif(true)}
            className="relative w-9 h-9 rounded-lg flex items-center justify-center transition-all duration-200 hover:bg-slate-50"
            style={{ border: '1.5px solid #E2E8F0' }}
          >
            <Bell size={17} className="text-slate-500" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #0284C7, #06B6D4)', fontFamily: 'Poppins', boxShadow: '0 2px 6px rgba(2,132,199,0.4)' }}>
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
