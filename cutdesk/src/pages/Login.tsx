import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronDown, ChevronUp, Eye, EyeOff, Zap } from 'lucide-react'

function ViteLogo({ size = 22 }: { size?: number }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 256 257">
      <defs>
        <linearGradient id="vll1" x1="-.828%" x2="57.636%" y1="7.652%" y2="78.411%">
          <stop offset="0%" stopColor="#41D1FF"/>
          <stop offset="100%" stopColor="#BD34FE"/>
        </linearGradient>
        <linearGradient id="vll2" x1="43.376%" x2="50.316%" y1="2.242%" y2="89.03%">
          <stop offset="0%" stopColor="#FF3E00"/>
          <stop offset="100%" stopColor="#FF3E00" stopOpacity="0"/>
        </linearGradient>
      </defs>
      <path fill="url(#vll1)" d="M255.153 37.938L134.897 252.976c-2.483 4.44-8.862 4.466-11.382.048L.875 37.958c-2.746-4.814 1.371-10.646 6.827-9.67l120.385 21.517a6.537 6.537 0 0 0 2.322-.004l117.867-21.483c5.438-.991 9.574 4.796 6.877 9.62Z"/>
      <path fill="url(#vll2)" d="M185.432.063L96.44 17.501a3.268 3.268 0 0 0-2.634 3.014l-5.474 92.456a3.268 3.268 0 0 0 3.997 3.378l24.777-5.718c2.318-.535 4.413 1.507 3.936 3.838l-7.361 36.047c-.495 2.426 1.782 4.5 4.151 3.78l15.304-4.649c2.372-.72 4.652 1.36 4.15 3.788l-11.698 56.621c-.732 3.542 3.979 5.473 5.943 2.437l1.313-2.028l72.516-144.72c1.215-2.423-.88-5.186-3.54-4.672l-25.505 4.922c-2.396.462-4.435-1.77-3.759-4.114l16.646-57.705c.677-2.35-1.37-4.583-3.769-4.113Z"/>
    </svg>
  )
}
import { useAuth } from '../context/AuthContext'
import { DEMO_MODE, DEMO_PROFILES } from '../lib/mockData'
import toast from 'react-hot-toast'

const DEMO_ACCOUNTS = [
  { role: 'Super Admin', email: 'admin@themigration.com', password: 'CutDesk@Admin2024', color: '#8B5CF6', icon: '⚡' },
  { role: 'CEO', email: 'ceo@themigration.com', password: 'CutDesk@CEO2024', color: '#F59E0B', icon: '👑' },
  { role: 'Video Editor', email: 'editor@themigration.com', password: 'CutDesk@Editor2024', color: '#0EA5E9', icon: '🎬' },
  { role: 'Social Media Manager', email: 'smm@themigration.com', password: 'CutDesk@SMM2024', color: '#A78BFA', icon: '📱' },
  { role: 'Counselor 1', email: 'counselor1@themigration.com', password: 'CutDesk@C12024', color: '#34D399', icon: '🎤' },
  { role: 'Counselor 2', email: 'counselor2@themigration.com', password: 'CutDesk@C22024', color: '#34D399', icon: '🎤' },
  { role: 'Counselor 3', email: 'counselor3@themigration.com', password: 'CutDesk@C32024', color: '#34D399', icon: '🎤' },
  { role: 'Counselor 4', email: 'counselor4@themigration.com', password: 'CutDesk@C42024', color: '#34D399', icon: '🎤' },
  { role: 'Counselor 5', email: 'counselor5@themigration.com', password: 'CutDesk@C52024', color: '#34D399', icon: '🎤' },
]

const ROLE_REDIRECTS: Record<string, string> = {
  counselor: '/counselor/dashboard',
  editor: '/editor/dashboard',
  social_manager: '/smm/dashboard',
  ceo: '/ceo/overview',
}

export default function Login() {
  const { signIn, profile } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [showDemo, setShowDemo] = useState(false)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    if (!email || !password) { toast.error('Please enter email and password'); return }
    setLoading(true)
    const { error } = await signIn(email, password)
    setLoading(false)
    if (error) { toast.error(error.message || 'Invalid credentials'); return }
    toast.success('Welcome back!')
    if (DEMO_MODE) {
      const role = DEMO_PROFILES[email]?.role
      navigate(ROLE_REDIRECTS[role] || '/')
    } else {
      setTimeout(() => { navigate(ROLE_REDIRECTS[profile?.role || ''] || '/') }, 300)
    }
  }

  function fillDemo(acc: typeof DEMO_ACCOUNTS[0]) {
    setEmail(acc.email)
    setPassword(acc.password)
    setShowDemo(false)
  }

  return (
    <div className="min-h-screen flex" style={{ background: 'linear-gradient(135deg, #F8FAFC 0%, #EFF6FF 50%, #F0FDFF 100%)' }}>
      {/* Left panel — branding */}
      <div className="hidden lg:flex flex-col justify-between w-[420px] p-12 relative overflow-hidden flex-shrink-0" style={{ background: '#0F172A' }}>
        {/* Gradient orbs */}
        <div className="absolute top-0 right-0 w-80 h-80 rounded-full opacity-20" style={{ background: 'radial-gradient(circle, #0284C7, transparent)', transform: 'translate(30%, -30%)' }} />
        <div className="absolute bottom-0 left-0 w-96 h-96 rounded-full opacity-10" style={{ background: 'radial-gradient(circle, #06B6D4, transparent)', transform: 'translate(-30%, 30%)' }} />

        <div className="relative">
          <div className="flex items-center gap-3 mb-16">
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center float" style={{ background: '#1a1a2e', boxShadow: '0 8px 24px rgba(189,52,254,0.45)' }}>
              <ViteLogo size={26} />
            </div>
            <span style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 900, fontSize: 22, color: '#FFFFFF', letterSpacing: '-0.5px' }}>CutDesk</span>
          </div>

          <h2 style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 900, fontSize: 36, color: '#FFFFFF', lineHeight: 1.15, letterSpacing: '-1px' }}>
            Your Video<br />
            <span className="gradient-text">Workflow OS</span>
          </h2>
          <p style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 400, fontSize: 15, color: 'rgba(255,255,255,0.45)', marginTop: 16, lineHeight: 1.7 }}>
            From raw footage to published content — every step, tracked and streamlined.
          </p>

          <div className="mt-10 space-y-4">
            {['Script to screen in one place', 'Real-time pipeline tracking', '4 role dashboards', 'Auto-notifications'].map((f, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(2,132,199,0.2)', border: '1px solid rgba(2,132,199,0.4)' }}>
                  <div className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                </div>
                <span style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 500, fontSize: 13, color: 'rgba(255,255,255,0.55)' }}>{f}</span>
              </div>
            ))}
          </div>
        </div>

        <p style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 400, fontSize: 12, color: 'rgba(255,255,255,0.25)', position: 'relative' }}>
          © 2025 The Migration, Melbourne AU · Internal Tool
        </p>
      </div>

      {/* Right panel — login form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-[400px]">
          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-10 lg:hidden">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: '#1a1a2e', boxShadow: '0 4px 12px rgba(189,52,254,0.35)' }}>
              <ViteLogo size={22} />
            </div>
            <span style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 900, fontSize: 20, color: '#0F172A' }}>CutDesk</span>
          </div>

          <div className="fade-in">
            <h1 style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 900, fontSize: 28, color: '#0F172A', letterSpacing: '-0.5px', marginBottom: 6 }}>Sign in</h1>
            <p style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 400, fontSize: 14, color: '#64748B', marginBottom: 32 }}>Welcome back! Enter your credentials to continue.</p>

            {/* Card */}
            <div className="rounded-2xl p-8" style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', boxShadow: '0 4px 24px rgba(0,0,0,0.06)' }}>
              <form onSubmit={handleLogin} className="space-y-5">
                <div>
                  <label className="section-label mb-2 block" style={{ color: '#475569' }}>Email Address</label>
                  <input type="email" className="cd-input" placeholder="you@themigration.com" value={email} onChange={e => setEmail(e.target.value)} autoComplete="email" />
                </div>
                <div>
                  <label className="section-label mb-2 block" style={{ color: '#475569' }}>Password</label>
                  <div className="relative">
                    <input type={showPw ? 'text' : 'password'} className="cd-input pr-11" placeholder="Enter your password" value={password} onChange={e => setPassword(e.target.value)} autoComplete="current-password" />
                    <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                      {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                    </button>
                  </div>
                </div>
                <button type="submit" disabled={loading} className="btn-primary w-full justify-center text-sm py-3 mt-2" style={{ fontSize: 15 }}>
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Signing in...
                    </span>
                  ) : 'Sign In →'}
                </button>
              </form>
            </div>

            {/* Demo accounts */}
            <div className="mt-4 rounded-2xl overflow-hidden" style={{ border: '1px solid #E2E8F0', background: '#FFFFFF', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
              <button
                onClick={() => setShowDemo(!showDemo)}
                className="w-full flex items-center justify-between px-5 py-3.5 transition-colors hover:bg-slate-50"
              >
                <div className="flex items-center gap-2">
                  <Zap size={14} className="text-sky-500" />
                  <span style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 600, fontSize: 13, color: '#475569' }}>Try Demo Accounts</span>
                </div>
                {showDemo ? <ChevronUp size={15} className="text-slate-400" /> : <ChevronDown size={15} className="text-slate-400" />}
              </button>
              {showDemo && (
                <div style={{ borderTop: '1px solid #F1F5F9' }}>
                  {DEMO_ACCOUNTS.map((acc, i) => (
                    <button key={acc.email} onClick={() => fillDemo(acc)} className="w-full flex items-center justify-between px-5 py-3 hover:bg-slate-50 transition-colors" style={{ borderTop: i > 0 ? '1px solid #F8FAFC' : undefined }}>
                      <div className="flex items-center gap-3">
                        <span className="text-lg">{acc.icon}</span>
                        <div className="text-left">
                          <p style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 600, fontSize: 12, color: '#0F172A' }}>{acc.role}</p>
                          <p style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 400, fontSize: 11, color: '#94A3B8' }}>{acc.email}</p>
                        </div>
                      </div>
                      <span style={{ fontFamily: 'Plus Jakarta Sans', fontWeight: 600, fontSize: 12, color: '#0284C7' }}>Use →</span>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
