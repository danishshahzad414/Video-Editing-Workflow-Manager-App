import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Scissors, ChevronDown, ChevronUp, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import { DEMO_MODE, DEMO_PROFILES } from '../lib/mockData'
import toast from 'react-hot-toast'

const DEMO_ACCOUNTS = [
  { role: 'CEO', email: 'ceo@themigration.com', password: 'CutDesk@CEO2024' },
  { role: 'Video Editor', email: 'editor@themigration.com', password: 'CutDesk@Editor2024' },
  { role: 'Social Media Manager', email: 'smm@themigration.com', password: 'CutDesk@SMM2024' },
  { role: 'Counselor 1', email: 'counselor1@themigration.com', password: 'CutDesk@C12024' },
  { role: 'Counselor 2', email: 'counselor2@themigration.com', password: 'CutDesk@C22024' },
  { role: 'Counselor 3', email: 'counselor3@themigration.com', password: 'CutDesk@C32024' },
  { role: 'Counselor 4', email: 'counselor4@themigration.com', password: 'CutDesk@C42024' },
  { role: 'Counselor 5', email: 'counselor5@themigration.com', password: 'CutDesk@C52024' },
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
    if (error) {
      toast.error(error.message || 'Invalid credentials')
      return
    }
    toast.success('Welcome back!')
    if (DEMO_MODE) {
      const role = DEMO_PROFILES[email]?.role
      navigate(ROLE_REDIRECTS[role] || '/')
    } else {
      setTimeout(() => {
        const role = profile?.role
        navigate(ROLE_REDIRECTS[role || ''] || '/')
      }, 300)
    }
  }

  function fillDemo(acc: typeof DEMO_ACCOUNTS[0]) {
    setEmail(acc.email)
    setPassword(acc.password)
    setShowDemo(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden" style={{ background: '#00293A' }}>
      {/* Accent stripe */}
      <div className="fixed top-0 left-0 right-0 h-[3px] bg-[#00A2CF] z-50" />

      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-32 -right-32 w-96 h-96 rounded-full opacity-10" style={{ background: '#00A2CF' }} />
        <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full opacity-5" style={{ background: '#006386' }} />
      </div>

      <div className="relative w-full max-w-md px-4">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl mb-4" style={{ background: '#006386', border: '2px solid rgba(0,162,207,0.3)' }}>
            <Scissors size={28} className="text-white" />
          </div>
          <h1 className="text-white text-3xl" style={{ fontFamily: 'Montserrat', fontWeight: 800 }}>CutDesk</h1>
          <p className="text-white/50 text-sm mt-1" style={{ fontFamily: 'Poppins', fontWeight: 500 }}>Video Workflow OS · The Migration</p>
        </div>

        {/* Card */}
        <div className="rounded-2xl p-8" style={{ background: '#003D52', border: '1px solid rgba(0,162,207,0.15)' }}>
          <h2 className="text-white text-xl mb-6" style={{ fontFamily: 'Montserrat', fontWeight: 800 }}>Sign in to your account</h2>

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="section-label mb-2 block">Email Address</label>
              <input
                type="email"
                className="cd-input"
                placeholder="you@themigration.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>
            <div>
              <label className="section-label mb-2 block">Password</label>
              <div className="relative">
                <input
                  type={showPw ? 'text' : 'password'}
                  className="cd-input pr-10"
                  placeholder="Enter your password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white/70"
                >
                  {showPw ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full justify-center text-base py-3 mt-2"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>
        </div>

        {/* Demo accounts */}
        <div className="mt-4 rounded-xl overflow-hidden" style={{ border: '1px solid rgba(0,162,207,0.15)' }}>
          <button
            onClick={() => setShowDemo(!showDemo)}
            className="w-full flex items-center justify-between px-4 py-3 text-white/60 hover:text-white transition-colors"
            style={{ background: '#003D52', fontFamily: 'Poppins', fontWeight: 600, fontSize: 13 }}
          >
            <span>Demo Accounts</span>
            {showDemo ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          {showDemo && (
            <div style={{ background: '#002535' }}>
              {DEMO_ACCOUNTS.map(acc => (
                <button
                  key={acc.email}
                  onClick={() => fillDemo(acc)}
                  className="w-full flex items-center justify-between px-4 py-2.5 hover:bg-[rgba(0,162,207,0.08)] transition-colors border-t border-[rgba(0,162,207,0.1)]"
                >
                  <div className="text-left">
                    <p className="text-white text-xs font-semibold" style={{ fontFamily: 'Poppins', fontWeight: 600 }}>{acc.role}</p>
                    <p className="text-white/40 text-xs" style={{ fontFamily: 'Poppins' }}>{acc.email}</p>
                  </div>
                  <span className="text-[#00A2CF] text-xs" style={{ fontFamily: 'Poppins', fontWeight: 600 }}>Use →</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <p className="text-center text-white/30 text-xs mt-6" style={{ fontFamily: 'Poppins' }}>
          Internal tool · The Migration, Melbourne AU
        </p>
      </div>
    </div>
  )
}
