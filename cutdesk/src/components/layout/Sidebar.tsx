import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, Video, Upload, BookOpen, BarChart2,
  Inbox, List, PlayCircle, CalendarDays, Film, ScrollText,
  LayoutGrid, Send, FileEdit, Calendar, CheckCircle, TrendingUp,
  Users, LogOut, ChevronLeft, ChevronRight, Scissors, Settings, X
} from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import SettingsModal from '../shared/SettingsModal'

const counselorNav = [
  { to: '/counselor/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/counselor/videos', icon: Video, label: 'My Videos' },
  { to: '/counselor/upload', icon: Upload, label: 'Upload Video' },
  { to: '/counselor/scripts', icon: BookOpen, label: 'My Scripts' },
  { to: '/counselor/stats', icon: BarChart2, label: 'My Stats' },
]

const editorNav = [
  { to: '/editor/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/editor/inbox', icon: Inbox, label: 'Inbox' },
  { to: '/editor/queue', icon: List, label: 'My Queue' },
  { to: '/editor/in-progress', icon: PlayCircle, label: 'In Progress' },
  { to: '/editor/capacity', icon: CalendarDays, label: 'Capacity' },
  { to: '/editor/all-videos', icon: Film, label: 'All Videos' },
  { to: '/editor/activity', icon: ScrollText, label: 'Activity Log' },
]

const smmNav = [
  { to: '/smm/dashboard', icon: LayoutGrid, label: 'Dashboard' },
  { to: '/smm/ready', icon: Send, label: 'Ready to Publish' },
  { to: '/smm/scripts', icon: FileEdit, label: 'Scripts' },
  { to: '/smm/calendar', icon: Calendar, label: 'Calendar' },
  { to: '/smm/published', icon: CheckCircle, label: 'Published' },
  { to: '/smm/performance', icon: TrendingUp, label: 'Performance' },
]

const ceoNav = [
  { to: '/ceo/overview', icon: LayoutDashboard, label: 'Overview' },
  { to: '/ceo/all-videos', icon: Film, label: 'All Videos' },
  { to: '/ceo/counselors', icon: Users, label: 'Counselors' },
  { to: '/ceo/editor-stats', icon: BarChart2, label: 'Editor Stats' },
  { to: '/ceo/activity', icon: ScrollText, label: 'Activity Log' },
]

const ROLE_COLORS: Record<string, string> = {
  ceo: '#F59E0B',
  editor: '#0EA5E9',
  social_manager: '#A78BFA',
  counselor: '#34D399',
}

interface Props {
  onClose?: () => void
}

export default function Sidebar({ onClose }: Props) {
  const { profile, signOut } = useAuth()
  const navigate = useNavigate()
  const [collapsed, setCollapsed] = useState(false)
  const [showSettings, setShowSettings] = useState(false)

  const navItems = {
    counselor: counselorNav,
    editor: editorNav,
    social_manager: smmNav,
    ceo: ceoNav,
  }[profile?.role || 'counselor'] || []

  const initials = profile?.full_name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || '?'
  const roleColor = ROLE_COLORS[profile?.role || 'counselor'] || '#0EA5E9'

  async function handleSignOut() {
    await signOut()
    navigate('/login')
  }

  return (
    <>
      <aside
        className="flex flex-col h-full relative"
        style={{
          width: collapsed ? 68 : 230,
          background: '#0F172A',
          flexShrink: 0,
          transition: 'width 250ms cubic-bezier(0.34,1.1,0.64,1)',
          height: '100vh',
        }}
      >
        {/* Logo + mobile close */}
        <div className="flex items-center gap-3 px-4 py-5" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
          <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: 'linear-gradient(135deg, #0284C7, #06B6D4)', boxShadow: '0 4px 12px rgba(2,132,199,0.4)' }}>
            <Scissors size={17} className="text-white" />
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <span style={{ fontFamily: 'Montserrat', fontWeight: 900, fontSize: 17, color: '#FFFFFF', whiteSpace: 'nowrap', letterSpacing: '-0.3px' }}>
                CutDesk
              </span>
              <p style={{ fontFamily: 'Poppins', fontWeight: 500, fontSize: 10, color: 'rgba(255,255,255,0.35)', marginTop: 1, whiteSpace: 'nowrap' }}>Video Workflow OS</p>
            </div>
          )}
          {onClose && !collapsed && (
            <button onClick={onClose} className="lg:hidden text-white/40 hover:text-white ml-auto flex-shrink-0 transition-colors p-1">
              <X size={18} />
            </button>
          )}
        </div>

        {/* Role badge */}
        {!collapsed && (
          <div className="px-4 py-3" style={{ borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{ background: 'rgba(255,255,255,0.04)' }}>
              <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: roleColor, boxShadow: `0 0 6px ${roleColor}` }} />
              <span style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: 11, color: roleColor, textTransform: 'capitalize', whiteSpace: 'nowrap' }}>
                {profile?.role?.replace('_', ' ')}
              </span>
            </div>
          </div>
        )}

        {/* Nav items */}
        <nav className="flex-1 py-3 overflow-y-auto overflow-x-hidden">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) =>
                `relative flex items-center gap-3 mx-2 px-3 py-2.5 rounded-xl mb-0.5 transition-all duration-200 ${
                  isActive ? 'text-white' : 'text-white/40 hover:text-white/80 hover:bg-white/5'
                }`
              }
              style={({ isActive }) => isActive ? { background: 'rgba(2,132,199,0.2)' } : {}}
              title={collapsed ? label : undefined}
            >
              {({ isActive }) => (
                <>
                  {isActive && <div className="nav-active-dot" />}
                  <div className="flex-shrink-0 w-5 h-5 flex items-center justify-center">
                    <Icon size={17} className={isActive ? 'text-sky-400' : ''} />
                  </div>
                  {!collapsed && (
                    <span style={{ fontFamily: 'Poppins', fontWeight: isActive ? 600 : 500, fontSize: 13, whiteSpace: 'nowrap', color: isActive ? '#FFFFFF' : undefined }}>
                      {label}
                    </span>
                  )}
                  {isActive && !collapsed && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-sky-400" />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Bottom: user + logout */}
        <div className="p-3" style={{ borderTop: '1px solid rgba(255,255,255,0.06)' }}>
          <button
            onClick={() => setShowSettings(true)}
            className="flex items-center gap-3 w-full rounded-xl p-2.5 transition-all duration-200 hover:bg-white/5 text-left mb-1"
            title={collapsed ? profile?.full_name : undefined}
          >
            <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: roleColor + '22', border: `1px solid ${roleColor}44` }}>
              <span style={{ fontFamily: 'Montserrat', fontWeight: 800, fontSize: 12, color: roleColor }}>{initials}</span>
            </div>
            {!collapsed && (
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold truncate" style={{ fontFamily: 'Poppins', fontWeight: 600, color: '#FFFFFF' }}>{profile?.full_name}</p>
                <div className="flex items-center gap-1 mt-0.5">
                  <Settings size={9} className="text-white/30" />
                  <p className="text-[10px] truncate" style={{ fontFamily: 'Poppins', color: 'rgba(255,255,255,0.35)' }}>Settings</p>
                </div>
              </div>
            )}
          </button>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-3 w-full rounded-xl p-2.5 transition-all duration-200 hover:bg-red-500/10 group"
            title={collapsed ? 'Logout' : undefined}
          >
            <LogOut size={16} className="text-white/30 group-hover:text-red-400 flex-shrink-0 transition-colors" />
            {!collapsed && <span style={{ fontFamily: 'Poppins', fontWeight: 500, fontSize: 12, color: 'rgba(255,255,255,0.35)' }} className="group-hover:text-red-400 transition-colors">Logout</span>}
          </button>
        </div>

        {/* Desktop collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden lg:flex absolute -right-3 top-16 w-6 h-6 rounded-full items-center justify-center z-10 transition-all duration-200 hover:scale-110"
          style={{ background: '#1E293B', border: '1.5px solid rgba(255,255,255,0.12)', color: 'rgba(255,255,255,0.5)', boxShadow: '0 2px 8px rgba(0,0,0,0.3)' }}
        >
          {collapsed ? <ChevronRight size={11} /> : <ChevronLeft size={11} />}
        </button>
      </aside>

      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
    </>
  )
}