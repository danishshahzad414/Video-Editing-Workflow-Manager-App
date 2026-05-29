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
  { to: '/counselor/videos',    icon: Video,           label: 'My Videos' },
  { to: '/counselor/upload',    icon: Upload,          label: 'Upload Video' },
  { to: '/counselor/scripts',   icon: BookOpen,        label: 'My Scripts' },
  { to: '/counselor/stats',     icon: BarChart2,       label: 'My Stats' },
]

const editorNav = [
  { to: '/editor/dashboard',   icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/editor/inbox',       icon: Inbox,           label: 'Inbox' },
  { to: '/editor/queue',       icon: List,            label: 'My Queue' },
  { to: '/editor/in-progress', icon: PlayCircle,      label: 'In Progress' },
  { to: '/editor/capacity',    icon: CalendarDays,    label: 'Capacity' },
  { to: '/editor/all-videos',  icon: Film,            label: 'All Videos' },
  { to: '/editor/activity',    icon: ScrollText,      label: 'Activity Log' },
]

const smmNav = [
  { to: '/smm/dashboard',   icon: LayoutGrid,  label: 'Dashboard' },
  { to: '/smm/ready',       icon: Send,        label: 'Ready to Publish' },
  { to: '/smm/scripts',     icon: FileEdit,    label: 'Scripts' },
  { to: '/smm/calendar',    icon: Calendar,    label: 'Calendar' },
  { to: '/smm/published',   icon: CheckCircle, label: 'Published' },
  { to: '/smm/performance', icon: TrendingUp,  label: 'Performance' },
]

const ceoNav = [
  { to: '/ceo/overview',      icon: LayoutDashboard, label: 'Overview' },
  { to: '/ceo/all-videos',    icon: Film,            label: 'All Videos' },
  { to: '/ceo/counselors',    icon: Users,           label: 'Counselors' },
  { to: '/ceo/editor-stats',  icon: BarChart2,       label: 'Editor Stats' },
  { to: '/ceo/activity',      icon: ScrollText,      label: 'Activity Log' },
]

const adminNav = [
  { to: '/admin/dashboard', icon: Shield,     label: 'Portal Overview' },
  { to: '/admin/users',     icon: Users,      label: 'User Management' },
  { to: '/admin/settings',  icon: Settings,   label: 'Portal Settings' },
  { to: '/admin/audit',     icon: ScrollText, label: 'Audit Log' },
]

const ROLE_META: Record<string, { color: string; label: string }> = {
  super_admin:    { color: '#A78BFA', label: 'Super Admin' },
  ceo:            { color: '#F59E0B', label: 'CEO' },
  editor:         { color: '#38BDF8', label: 'Video Editor' },
  social_manager: { color: '#C084FC', label: 'Social Manager' },
  counselor:      { color: '#34D399', label: 'Counselor' },
}

interface Props { onClose?: () => void }

export default function Sidebar({ onClose }: Props) {
  const { profile, signOut } = useAuth()
  const navigate = useNavigate()
  const [collapsed, setCollapsed] = useState(false)
  const [showSettings, setShowSettings] = useState(false)

  const navItems = {
    super_admin:    adminNav,
    counselor:      counselorNav,
    editor:         editorNav,
    social_manager: smmNav,
    ceo:            ceoNav,
  }[profile?.role || 'counselor'] || []

  const initials  = profile?.full_name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() || '?'
  const roleMeta  = ROLE_META[profile?.role || 'counselor'] || { color: '#38BDF8', label: 'User' }

  async function handleSignOut() {
    await signOut()
    navigate('/login')
  }

  return (
    <>
      <aside
        className="flex flex-col h-full relative"
        style={{
          width: collapsed ? 64 : 224,
          background: 'linear-gradient(180deg, #080E1A 0%, #0B1425 50%, #0D1830 100%)',
          flexShrink: 0,
          transition: 'width 240ms cubic-bezier(0.22,1,0.36,1)',
          height: '100vh',
          borderRight: '1px solid rgba(255,255,255,0.04)',
          boxShadow: '4px 0 24px rgba(0,0,0,0.25)',
        }}
      >
        {/* ── Logo ── */}
        <div
          className="flex items-center gap-3 px-4"
          style={{ height: 60, borderBottom: '1px solid rgba(255,255,255,0.05)', flexShrink: 0 }}
        >
          <div
            className="flex items-center justify-center flex-shrink-0"
            style={{ width: 34, height: 34, borderRadius: 10, background: 'rgba(189,52,254,0.15)', border: '1px solid rgba(189,52,254,0.3)', boxShadow: '0 0 24px rgba(189,52,254,0.35), 0 4px 12px rgba(189,52,254,0.2)' }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" viewBox="0 0 256 257">
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
              <p style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 900, fontSize: 16, color: '#FFFFFF', margin: 0, letterSpacing: '-0.3px', whiteSpace: 'nowrap' }}>
                CutDesk
              </p>
              <p style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 500, fontSize: 10, color: 'rgba(255,255,255,0.28)', margin: 0, whiteSpace: 'nowrap' }}>
                Video Workflow OS
              </p>
            </div>
          )}
          {onClose && !collapsed && (
            <button
              onClick={onClose}
              className="lg:hidden ml-auto flex-shrink-0 w-7 h-7 rounded-lg flex items-center justify-center transition-colors"
              style={{ color: 'rgba(255,255,255,0.35)', background: 'rgba(255,255,255,0.06)' }}
            >
              <X size={15} />
            </button>
          )}
        </div>

        {/* ── Nav items ── */}
        <nav className="flex-1 py-3 overflow-y-auto overflow-x-hidden">
          <div className="space-y-0.5 px-2">
            {navItems.map(({ to, icon: Icon, label }) => (
              <NavLink
                key={to}
                to={to}
                onClick={onClose}
                title={collapsed ? label : undefined}
                className={({ isActive }) =>
                  `relative flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-all duration-200 group ${
                    isActive
                      ? 'text-white'
                      : 'text-white/30 hover:text-white/65 hover:bg-white/[0.04]'
                  }`
                }
                style={({ isActive }) => isActive ? {
                  background: 'linear-gradient(135deg, rgba(14,165,233,0.20) 0%, rgba(2,132,199,0.12) 100%)',
                  boxShadow: 'inset 2px 0 0 #38BDF8, 0 2px 10px rgba(14,165,233,0.12)',
                } : {}}
              >
                {({ isActive }) => (
                  <>
                    {isActive && <div className="nav-active-dot" />}
                    <div
                      className="flex-shrink-0 w-[18px] h-[18px] flex items-center justify-center"
                      style={{ transition: 'transform 200ms var(--spring)' }}
                    >
                      <Icon
                        size={16}
                        style={{ color: isActive ? '#38BDF8' : undefined }}
                      />
                    </div>
                    {!collapsed && (
                      <span style={{
                        fontFamily: 'Plus Jakarta Sans',
                        fontWeight: isActive ? 600 : 500,
                        fontSize: 13,
                        whiteSpace: 'nowrap',
                        color: isActive ? '#FFFFFF' : undefined,
                        transition: 'color 150ms',
                      }}>
                        {label}
                      </span>
                    )}
                    {isActive && !collapsed && (
                      <div className="ml-auto w-1.5 h-1.5 rounded-full flex-shrink-0"
                        style={{ background: '#38BDF8', boxShadow: '0 0 6px #38BDF8' }} />
                    )}
                  </>
                )}
              </NavLink>
            ))}
          </div>
        </nav>

        {/* ── User area + logout ── */}
        <div className="px-2 pb-3 pt-2 space-y-0.5" style={{ borderTop: '1px solid rgba(255,255,255,0.05)', flexShrink: 0 }}>
          {/* User / Settings */}
          <button
            onClick={() => setShowSettings(true)}
            title={collapsed ? `${profile?.full_name} — Settings` : undefined}
            className="flex items-center gap-2.5 w-full rounded-xl px-3 py-2.5 transition-all duration-150 hover:bg-white/5 text-left group"
          >
            {/* Avatar */}
            <div
              className="flex-shrink-0 flex items-center justify-center"
              style={{
                width: 32, height: 32, borderRadius: 9,
                background: `${roleMeta.color}18`,
                border: `1.5px solid ${roleMeta.color}35`,
              }}
            >
              <span style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 800, fontSize: 11, color: roleMeta.color }}>
                {initials}
              </span>
            </div>
            {!collapsed && (
              <div className="min-w-0 flex-1">
                <p style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 600, fontSize: 12.5, color: '#FFFFFF', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {profile?.full_name}
                </p>
                <p style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 500, fontSize: 10.5, color: roleMeta.color, margin: 0, whiteSpace: 'nowrap', opacity: 0.85 }}>
                  {roleMeta.label}
                </p>
              </div>
            )}
            {!collapsed && (
              <Settings size={12} style={{ color: 'rgba(255,255,255,0.22)', flexShrink: 0 }}
                className="group-hover:text-white/50 transition-colors" />
            )}
          </button>

          {/* Logout */}
          <button
            onClick={handleSignOut}
            title={collapsed ? 'Log out' : undefined}
            className="flex items-center gap-2.5 w-full rounded-xl px-3 py-2.5 transition-all duration-150 group"
            style={{ color: 'rgba(255,255,255,0.28)' }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(239,68,68,0.08)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
          >
            <LogOut size={15} className="flex-shrink-0 group-hover:text-red-400 transition-colors" style={{ transition: 'color 150ms' }} />
            {!collapsed && (
              <span style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 500, fontSize: 12.5 }}
                className="group-hover:text-red-400 transition-colors">
                Log out
              </span>
            )}
          </button>
        </div>

        {/* ── Collapse toggle (desktop only) ── */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden lg:flex absolute -right-3 top-[18px] w-6 h-6 rounded-full items-center justify-center z-10 transition-all duration-200 hover:scale-110 active:scale-95"
          style={{
            background: '#1E293B',
            border: '1.5px solid rgba(255,255,255,0.10)',
            color: 'rgba(255,255,255,0.4)',
            boxShadow: '0 2px 8px rgba(0,0,0,0.35)',
          }}
        >
          {collapsed ? <ChevronRight size={10} /> : <ChevronLeft size={10} />}
        </button>
      </aside>

      {showSettings && <SettingsModal onClose={() => setShowSettings(false)} />}
    </>
  )
}
