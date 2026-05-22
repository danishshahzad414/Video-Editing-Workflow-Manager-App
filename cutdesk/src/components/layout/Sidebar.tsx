import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, Video, Upload, BookOpen, BarChart2,
  Inbox, List, PlayCircle, CalendarDays, Film, ScrollText,
  LayoutGrid, Send, FileEdit, Calendar, CheckCircle, TrendingUp,
  Users, LogOut, ChevronLeft, ChevronRight, Settings, X, Shield
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
  super_admin: '#A78BFA',
  ceo: '#F59E0B',
  editor: '#0EA5E9',
  social_manager: '#C084FC',
  counselor: '#34D399',
}

const adminNav = [
  { to: '/admin/dashboard', icon: Shield,       label: 'Portal Overview' },
  { to: '/admin/users',     icon: Users,        label: 'User Management' },
  { to: '/admin/settings',  icon: Settings,     label: 'Portal Settings' },
  { to: '/admin/audit',     icon: ScrollText,   label: 'Audit Log' },
]

interface Props {
  onClose?: () => void
}

export default function Sidebar({ onClose }: Props) {
  const { profile, signOut } = useAuth()
  const navigate = useNavigate()
  const [collapsed, setCollapsed] = useState(false)
  const [showSettings, setShowSettings] = useState(false)

  const navItems = {
    super_admin: adminNav,
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
          <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: '#1a1a2e', boxShadow: '0 4px 12px rgba(189,52,254,0.35)' }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 256 257">
              <defs>
                <linearGradient id="vl1" x1="-.828%" x2="57.636%" y1="7.652%" y2="78.411%">
                  <stop offset="0%" stopColor="#41D1FF"/>
                  <stop offset="100%" stopColor="#BD34FE"/>
                </linearGradient>
                <linearGradient id="vl2" x1="43.376%" x2="50.316%" y1="2.242%" y2="89.03%">
                  <stop offset="0%" stopColor="#FF3E00"/>
                  <stop offset="100%" stopColor="#FF3E00" stopOpacity="0"/>
                </linearGradient>
              </defs>
              <path fill="url(#vl1)" d="M255.153 37.938L134.897 252.976c-2.483 4.44-8.862 4.466-11.382.048L.875 37.958c-2.746-4.814 1.371-10.646 6.827-9.67l120.385 21.517a6.537 6.537 0 0 0 2.322-.004l117.867-21.483c5.438-.991 9.574 4.796 6.877 9.62Z"/>
              <path fill="url(#vl2)" d="M185.432.063L96.44 17.501a3.268 3.268 0 0 0-2.634 3.014l-5.474 92.456a3.268 3.268 0 0 0 3.997 3.378l24.777-5.718c2.318-.535 4.413 1.507 3.936 3.838l-7.361 36.047c-.495 2.426 1.782 4.5 4.151 3.78l15.304-4.649c2.372-.72 4.652 1.36 4.15 3.788l-11.698 56.621c-.732 3.542 3.979 5.473 5.943 2.437l1.313-2.028l72.516-144.72c1.215-2.423-.88-5.186-3.54-4.672l-25.505 4.922c-2.396.462-4.435-1.77-3.759-4.114l16.646-57.705c.677-2.35-1.37-4.583-3.769-4.113Z"/>
            </svg>
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