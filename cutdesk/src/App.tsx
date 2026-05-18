import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Toaster } from 'react-hot-toast'
import { AuthProvider, useAuth } from './context/AuthContext'

// Pages
import Login from './pages/Login'

// Counselor
import CounselorDashboard from './pages/counselor/Dashboard'
import MyVideos from './pages/counselor/MyVideos'
import Upload from './pages/counselor/Upload'
import MyScripts from './pages/counselor/MyScripts'
import MyStats from './pages/counselor/MyStats'

// Editor
import EditorDashboard from './pages/editor/Dashboard'
import EditorInbox from './pages/editor/Inbox'
import EditorQueue from './pages/editor/Queue'
import InProgress from './pages/editor/InProgress'
import Capacity from './pages/editor/Capacity'
import EditorAllVideos from './pages/editor/AllVideos'
import EditorActivityLog from './pages/editor/ActivityLog'

// SMM
import SMMDashboard from './pages/smm/Dashboard'
import ReadyToPublish from './pages/smm/ReadyToPublish'
import Scripts from './pages/smm/Scripts'
import Calendar from './pages/smm/Calendar'
import Published from './pages/smm/Published'
import Performance from './pages/smm/Performance'

// CEO
import CEOOverview from './pages/ceo/Overview'
import CEOAllVideos from './pages/ceo/AllVideos'
import CEOCounselors from './pages/ceo/Counselors'
import CEOEditorStats from './pages/ceo/EditorStats'
import CEOActivityLog from './pages/ceo/ActivityLog'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 30000,
      retry: 1,
    },
  },
})

const ROLE_HOME: Record<string, string> = {
  counselor: '/counselor/dashboard',
  editor: '/editor/dashboard',
  social_manager: '/smm/dashboard',
  ceo: '/ceo/overview',
}

function AuthGuard({ children, allowedRoles }: { children: React.ReactNode; allowedRoles?: string[] }) {
  const { user, profile, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#00293A' }}>
        <div className="text-center">
          <div className="w-8 h-8 border-2 border-[#00A2CF] border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-white/40 text-sm" style={{ fontFamily: 'Poppins' }}>Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) return <Navigate to="/login" replace />
  if (!profile) return <Navigate to="/login" replace />
  if (allowedRoles && !allowedRoles.includes(profile.role)) {
    return <Navigate to={ROLE_HOME[profile.role] || '/login'} replace />
  }

  return <>{children}</>
}

function RootRedirect() {
  const { user, profile, loading } = useAuth()

  if (loading) return null
  if (!user || !profile) return <Navigate to="/login" replace />
  return <Navigate to={ROLE_HOME[profile.role] || '/login'} replace />
}

function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/" element={<RootRedirect />} />

      {/* Counselor */}
      <Route path="/counselor/dashboard" element={<AuthGuard allowedRoles={['counselor']}><CounselorDashboard /></AuthGuard>} />
      <Route path="/counselor/videos" element={<AuthGuard allowedRoles={['counselor']}><MyVideos /></AuthGuard>} />
      <Route path="/counselor/upload" element={<AuthGuard allowedRoles={['counselor']}><Upload /></AuthGuard>} />
      <Route path="/counselor/scripts" element={<AuthGuard allowedRoles={['counselor']}><MyScripts /></AuthGuard>} />
      <Route path="/counselor/stats" element={<AuthGuard allowedRoles={['counselor']}><MyStats /></AuthGuard>} />

      {/* Editor */}
      <Route path="/editor/dashboard" element={<AuthGuard allowedRoles={['editor']}><EditorDashboard /></AuthGuard>} />
      <Route path="/editor/inbox" element={<AuthGuard allowedRoles={['editor']}><EditorInbox /></AuthGuard>} />
      <Route path="/editor/queue" element={<AuthGuard allowedRoles={['editor']}><EditorQueue /></AuthGuard>} />
      <Route path="/editor/in-progress" element={<AuthGuard allowedRoles={['editor']}><InProgress /></AuthGuard>} />
      <Route path="/editor/capacity" element={<AuthGuard allowedRoles={['editor']}><Capacity /></AuthGuard>} />
      <Route path="/editor/all-videos" element={<AuthGuard allowedRoles={['editor']}><EditorAllVideos /></AuthGuard>} />
      <Route path="/editor/activity" element={<AuthGuard allowedRoles={['editor']}><EditorActivityLog /></AuthGuard>} />

      {/* SMM */}
      <Route path="/smm/dashboard" element={<AuthGuard allowedRoles={['social_manager']}><SMMDashboard /></AuthGuard>} />
      <Route path="/smm/ready" element={<AuthGuard allowedRoles={['social_manager']}><ReadyToPublish /></AuthGuard>} />
      <Route path="/smm/scripts" element={<AuthGuard allowedRoles={['social_manager']}><Scripts /></AuthGuard>} />
      <Route path="/smm/calendar" element={<AuthGuard allowedRoles={['social_manager']}><Calendar /></AuthGuard>} />
      <Route path="/smm/published" element={<AuthGuard allowedRoles={['social_manager']}><Published /></AuthGuard>} />
      <Route path="/smm/performance" element={<AuthGuard allowedRoles={['social_manager']}><Performance /></AuthGuard>} />

      {/* CEO */}
      <Route path="/ceo/overview" element={<AuthGuard allowedRoles={['ceo']}><CEOOverview /></AuthGuard>} />
      <Route path="/ceo/all-videos" element={<AuthGuard allowedRoles={['ceo']}><CEOAllVideos /></AuthGuard>} />
      <Route path="/ceo/counselors" element={<AuthGuard allowedRoles={['ceo']}><CEOCounselors /></AuthGuard>} />
      <Route path="/ceo/editor-stats" element={<AuthGuard allowedRoles={['ceo']}><CEOEditorStats /></AuthGuard>} />
      <Route path="/ceo/activity" element={<AuthGuard allowedRoles={['ceo']}><CEOActivityLog /></AuthGuard>} />

      {/* Catch all */}
      <Route path="*" element={<RootRedirect />} />
    </Routes>
  )
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: '#003D52',
                color: '#fff',
                border: '1px solid rgba(0,162,207,0.3)',
                fontFamily: 'Poppins',
                fontWeight: 500,
                fontSize: 13,
              },
              success: { iconTheme: { primary: '#10B981', secondary: '#fff' } },
              error: { iconTheme: { primary: '#EF4444', secondary: '#fff' } },
            }}
          />
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  )
}
