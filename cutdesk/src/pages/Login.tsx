import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Scissors, ChevronDown, ChevronUp, Eye, EyeOff, Zap } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { DEMO_MODE, DEMO_PROFILES } from '../lib/mockData'
import toast from 'react-hot-toast'

const DEMO_ACCOUNTS = [
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
            <div className="w-11 h-11 rounded-2xl flex items-center justify-center float" style={{ background: 'linear-gradient(135deg, #0284C7, #06B6D4)', boxShadow: '0 8px 24px rgba(2,132,199,0.5)' }}>
              <Scissors size={20} className="text-white" />
            </div>
            <span style={{ fontFamily: 'Montserrat', fontWeight: 900, fontSize: 22, color: '#FFFFFF', letterSpacing: '-0.5px' }}>CutDesk</span>
          </div>

          <h2 style={{ fontFamily: 'Montserrat', fontWeight: 900, fontSize: 36, color: '#FFFFFF', lineHeight: 1.15, letterSpacing: '-1px' }}>
            Your Video<br />
            <span className="gradient-text">Workflow OS</span>
          </h2>
          <p style={{ fontFamily: 'Poppins', fontWeight: 400, fontSize: 15, color: 'rgba(255,255,255,0.45)', marginTop: 16, lineHeight: 1.7 }}>
            From raw footage to published content — every step, tracked and streamlined.
          </p>

          <div className="mt-10 space-y-4">
            {['Script to screen in one place', 'Real-time pipeline tracking', '4 role dashboards', 'Auto-notifications'].map((f, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: 'rgba(2,132,199,0.2)', border: '1px solid rgba(2,132,199,0.4)' }}>
                  <div className="w-1.5 h-1.5 rounded-full bg-sky-400" />
                </div>
                <span style={{ fontFamily: 'Poppins', fontWeight: 500, fontSize: 13, color: 'rgba(255,255,255,0.55)' }}>{f}</span>
              </div>
            ))}
          </div>
        </div>

        <p style={{ fontFamily: 'Poppins', fontWeight: 400, fontSize: 12, color: 'rgba(255,255,255,0.25)', position: 'relative' }}>
          © 2025 The Migration, Melbourne AU · Internal Tool
        </p>
      </div>

      {/* Right panel — login form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-[400px]">
          {/* Mobile logo */}
          <div className="flex items-center gap-3 mb-10 lg:hidden">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #0284C7, #06B6D4)' }}>
              <Scissors size={18} className="text-white" />
            </div>
            <span style={{ fontFamily: 'Montserrat', fontWeight: 900, fontSize: 20, color: '#0F172A' }}>CutDesk</span>
          </div>

          <div className="fade-in">
            <h1 style={{ fontFamily: 'Montserrat', fontWeight: 900, fontSize: 28, color: '#0F172A', letterSpacing: '-0.5px', marginBottom: 6 }}>Sign in</h1>
            <p style={{ fontFamily: 'Poppins', fontWeight: 400, fontSize: 14, color: '#64748B', marginBottom: 32 }}>Welcome back! Enter your credentials to continue.</p>

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
                  <span style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: 13, color: '#475569' }}>Try Demo Accounts</span>
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
                          <p style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: 12, color: '#0F172A' }}>{acc.role}</p>
                          <p style={{ fontFamily: 'Poppins', fontWeight: 400, fontSize: 11, color: '#94A3B8' }}>{acc.email}</p>
                        </div>
                      </div>
                      <span style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: 12, color: '#0284C7' }}>Use →</span>
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
