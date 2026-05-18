import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import {
  LayoutDashboard, Video, Upload, BookOpen, BarChart2,
  Inbox, List, PlayCircle, CalendarDays, Film, ScrollText,
  LayoutGrid, Send, FileEdit, Calendar, CheckCircle, TrendingUp,
  Users, LogOut, ChevronLeft, ChevronRight, Scissors
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

export default function Sidebar() {
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

  async function handleSignOut() {
    await signOut()
    navigate('/login')
  }

  return (
    <>
      <aside
        className="flex flex-col h-full border-r border-[rgba(0,162,207,0.15)] transition-all duration-200"
        style={{
          width: collapsed ? 64 : 220,
          background: '#006386',
          flexShrink: 0,
        }}
      >
        {/* Logo */}
        <div className="flex items-center gap-2 px-4 py-4 border-b border-[rgba(0,0,0,0.15)]">
          <div className="w-8 h-8 rounded-lg bg-[#00A2CF] flex items-center justify-center flex-shrink-0">
            <Scissors size={16} className="text-white" />
          </div>
          {!collapsed && (
            <span style={{ fontFamily: 'Montserrat', fontWeight: 800, fontSize: 16, color: '#fff', whiteSpace: 'nowrap' }}>
              CutDesk
            </span>
          )}
        </div>

        {/* Nav items */}
        <nav className="flex-1 py-4 overflow-y-auto overflow-x-hidden">
          {navItems.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-2.5 mx-2 rounded-lg transition-all duration-200 mb-0.5 ${
                  isActive
                    ? 'bg-[#00A2CF] text-white'
                    : 'text-white/70 hover:text-white hover:bg-[rgba(0,0,0,0.15)]'
                }`
              }
              title={collapsed ? label : undefined}
            >
              <Icon size={18} className="flex-shrink-0" />
              {!collapsed && (
                <span style={{ fontFamily: 'Poppins', fontWeight: 500, fontSize: 13, whiteSpace: 'nowrap' }}>
                  {label}
                </span>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Bottom: user + logout */}
        <div className="border-t border-[rgba(0,0,0,0.15)] p-3">
          <button
            onClick={() => setShowSettings(true)}
            className="flex items-center gap-2 w-full rounded-lg p-2 hover:bg-[rgba(0,0,0,0.15)] transition-colors text-left"
            title={collapsed ? profile?.full_name : undefined}
          >
            <div className="w-8 h-8 rounded-full bg-[#00A2CF] flex items-center justify-center flex-shrink-0">
              <span style={{ fontFamily: 'Montserrat', fontWeight: 700, fontSize: 12, color: '#fff' }}>{initials}</span>
            </div>
            {!collapsed && (
              <div className="min-w-0 flex-1">
                <p className="text-white text-xs font-semibold truncate" style={{ fontFamily: 'Poppins', fontWeight: 600 }}>{profile?.full_name}</p>
                <p className="text-white/50 text-[10px] truncate capitalize" style={{ fontFamily: 'Poppins' }}>{profile?.role?.replace('_', ' ')}</p>
              </div>
            )}
          </button>
          <button
            onClick={handleSignOut}
            className="flex items-center gap-2 w-full rounded-lg p-2 text-white/60 hover:text-white hover:bg-[rgba(0,0,0,0.15)] transition-colors mt-1"
            title={collapsed ? 'Logout' : undefined}
          >
            <LogOut size={16} className="flex-shrink-0" />
            {!collapsed && <span style={{ fontFamily: 'Poppins', fontWeight: 500, fontSize: 12 }}>Logout</span>}
          </button>
        </div>

        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="absolute -right-3 top-20 w-6 h-6 rounded-full bg-[#006386] border border-[rgba(0,162,207,0.3)] flex items-center justify-center text-white/70 hover:text-white z-10"
          style={{ position: 'relative', alignSelf: 'flex-end', margin: '4px 8px 8px' }}
        >
          {collapsed ? <ChevronRight size={12} /> : <ChevronLeft size={12} />}
        </button>
      </aside>

      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
    </>
  )
}
