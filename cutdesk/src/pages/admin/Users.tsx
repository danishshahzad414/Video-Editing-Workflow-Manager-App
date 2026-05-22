import { useState } from 'react'
import Layout from '../../components/layout/Layout'
import { DEMO_PROFILES } from '../../lib/mockData'
import { Users, Plus, Edit2, Key, ToggleLeft, ToggleRight, X, Eye, EyeOff, CheckCircle, Search } from 'lucide-react'
import toast from 'react-hot-toast'

type Role = 'super_admin' | 'ceo' | 'editor' | 'social_manager' | 'counselor'

interface UserRow {
  id: string; full_name: string; email: string; role: Role
  avatar_url: null; created_at: string; disabled?: boolean
}

const ROLE_META: Record<string, { label: string; color: string; bg: string }> = {
  super_admin:    { label: 'Super Admin',    color: '#7C3AED', bg: '#F3E8FF' },
  ceo:            { label: 'CEO',            color: '#B45309', bg: '#FEF3C7' },
  editor:         { label: 'Video Editor',   color: '#0369A1', bg: '#E0F2FE' },
  social_manager: { label: 'Social Manager', color: '#6D28D9', bg: '#EDE9FE' },
  counselor:      { label: 'Counselor',      color: '#065F46', bg: '#D1FAE5' },
}

const ALL_ROLES: Role[] = ['super_admin','ceo','editor','social_manager','counselor']

export default function AdminUsers() {
  const [users, setUsers] = useState<UserRow[]>(Object.values(DEMO_PROFILES) as UserRow[])
  const [search, setSearch] = useState('')
  const [filterRole, setFilterRole] = useState<string>('All')
  const [editUser, setEditUser] = useState<UserRow | null>(null)
  const [showCreate, setShowCreate] = useState(false)
  const [showPassword, setShowPassword] = useState<string | null>(null)

  const filtered = users.filter(u => {
    const matchSearch = u.full_name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())
    const matchRole = filterRole === 'All' || u.role === filterRole
    return matchSearch && matchRole
  })

  function toggleDisable(id: string) {
    setUsers(prev => prev.map(u => u.id === id ? { ...u, disabled: !u.disabled } : u))
    const u = users.find(u => u.id === id)
    toast.success(u?.disabled ? `${u?.full_name} re-enabled` : `${u?.full_name} disabled`)
  }

  function resetPassword(user: UserRow) {
    const newPw = `CutDesk@${user.full_name.split(' ')[0]}${Math.floor(Math.random() * 9000) + 1000}`
    setShowPassword(newPw)
    toast.success('Password reset! (Demo — see modal for new password)')
  }

  function saveEdit(updated: UserRow) {
    setUsers(prev => prev.map(u => u.id === updated.id ? updated : u))
    setEditUser(null)
    toast.success('User updated!')
  }

  function createUser(data: { full_name: string; email: string; role: Role }) {
    const newUser: UserRow = {
      id: `user-${Date.now()}`,
      full_name: data.full_name,
      email: data.email,
      role: data.role,
      avatar_url: null,
      created_at: new Date().toISOString(),
    }
    setUsers(prev => [newUser, ...prev])
    setShowCreate(false)
    toast.success(`${data.full_name} added to portal!`)
  }

  return (
    <Layout title="User Management">
      <div className="fade-in max-w-5xl mx-auto space-y-5">

        {/* Header bar */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 justify-between">
          <div>
            <h1 style={{ fontFamily: 'Montserrat', fontWeight: 900, fontSize: 20, color: '#0F172A' }}>User Management</h1>
            <p style={{ fontFamily: 'Poppins', fontWeight: 400, fontSize: 13, color: '#94A3B8', marginTop: 2 }}>
              {users.length} accounts · {users.filter(u => u.disabled).length} disabled
            </p>
          </div>
          <button className="btn-primary" onClick={() => setShowCreate(true)}>
            <Plus size={14} /> Add User
          </button>
        </div>

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              className="cd-input pl-9"
              placeholder="Search by name or email..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <div className="flex gap-1.5 p-1 rounded-xl flex-wrap" style={{ background: '#F1F5F9', border: '1px solid #E2E8F0' }}>
            {['All', ...ALL_ROLES].map(r => {
              const label = r === 'All' ? 'All' : (ROLE_META[r]?.label || r)
              return (
                <button
                  key={r}
                  onClick={() => setFilterRole(r)}
                  className="px-3 py-1.5 rounded-lg text-xs transition-all duration-200"
                  style={{
                    fontFamily: 'Poppins', fontWeight: 600,
                    background: filterRole === r ? '#7C3AED' : 'transparent',
                    color: filterRole === r ? '#fff' : '#64748B',
                    boxShadow: filterRole === r ? '0 2px 8px rgba(124,58,237,0.3)' : 'none',
                  }}
                >
                  {label}
                </button>
              )
            })}
          </div>
        </div>

        {/* Users table */}
        <div className="cd-card overflow-hidden">
          <div className="px-5 py-3" style={{ borderBottom: '1px solid #F1F5F9', background: '#FAFAFA' }}>
            <p style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: 12, color: '#64748B' }}>
              Showing {filtered.length} of {users.length} users
            </p>
          </div>
          {filtered.length === 0 ? (
            <div className="py-16 text-center">
              <Users size={32} className="text-slate-300 mx-auto mb-3" />
              <p style={{ fontFamily: 'Poppins', fontWeight: 500, fontSize: 13, color: '#94A3B8' }}>No users found</p>
            </div>
          ) : (
            <div className="divide-y" style={{ borderColor: '#F8FAFC' }}>
              {filtered.map((user, i) => {
                const meta = ROLE_META[user.role] || { label: user.role, color: '#64748B', bg: '#F1F5F9' }
                const initials = user.full_name.split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase()
                return (
                  <div
                    key={user.id}
                    className="flex items-center gap-4 px-5 py-3.5 transition-all duration-200 hover:bg-slate-50 fade-in"
                    style={{ animationDelay: `${i * 35}ms`, opacity: user.disabled ? 0.5 : 1 }}
                  >
                    {/* Avatar */}
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform duration-200 hover:scale-110" style={{ background: meta.bg }}>
                      <span style={{ fontFamily: 'Montserrat', fontWeight: 800, fontSize: 13, color: meta.color }}>{initials}</span>
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <p style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: 13, color: '#0F172A', margin: 0 }}>{user.full_name}</p>
                        {user.disabled && (
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold" style={{ background: '#FEE2E2', color: '#EF4444', fontFamily: 'Poppins' }}>DISABLED</span>
                        )}
                      </div>
                      <p style={{ fontFamily: 'Poppins', fontWeight: 400, fontSize: 11, color: '#94A3B8', margin: 0 }}>{user.email}</p>
                    </div>

                    {/* Role badge */}
                    <span className="px-2.5 py-1 rounded-lg text-xs font-semibold flex-shrink-0" style={{ background: meta.bg, color: meta.color, fontFamily: 'Poppins' }}>
                      {meta.label}
                    </span>

                    {/* Actions */}
                    <div className="flex items-center gap-1.5 flex-shrink-0">
                      <button
                        onClick={() => setEditUser(user)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 hover:bg-blue-50 hover:scale-110"
                        title="Edit user"
                      >
                        <Edit2 size={13} className="text-sky-500" />
                      </button>
                      <button
                        onClick={() => resetPassword(user)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 hover:bg-purple-50 hover:scale-110"
                        title="Reset password"
                      >
                        <Key size={13} className="text-purple-500" />
                      </button>
                      <button
                        onClick={() => toggleDisable(user.id)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center transition-all duration-200 hover:bg-slate-100 hover:scale-110"
                        title={user.disabled ? 'Enable account' : 'Disable account'}
                      >
                        {user.disabled
                          ? <ToggleLeft size={16} className="text-slate-400" />
                          : <ToggleRight size={16} className="text-emerald-500" />
                        }
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>

      {/* Edit User Modal */}
      {editUser && (
        <EditUserModal user={editUser} onSave={saveEdit} onClose={() => setEditUser(null)} />
      )}

      {/* Create User Modal */}
      {showCreate && (
        <CreateUserModal onCreate={createUser} onClose={() => setShowCreate(false)} />
      )}

      {/* Password Display Modal */}
      {showPassword && (
        <div className="modal-overlay" onClick={() => setShowPassword(null)}>
          <div className="scale-in cd-card p-8 flex flex-col items-center gap-4 text-center" style={{ maxWidth: 380, width: '100%' }} onClick={e => e.stopPropagation()}>
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center" style={{ background: '#F3E8FF' }}>
              <CheckCircle size={26} style={{ color: '#7C3AED' }} />
            </div>
            <div>
              <h3 style={{ fontFamily: 'Montserrat', fontWeight: 800, fontSize: 17, color: '#0F172A' }}>New Password Generated</h3>
              <p style={{ fontFamily: 'Poppins', fontWeight: 400, fontSize: 12, color: '#94A3B8', marginTop: 4 }}>Share this with the user securely</p>
            </div>
            <div className="w-full px-4 py-3 rounded-xl font-mono text-base font-bold" style={{ background: '#F8FAFC', border: '1.5px dashed #CBD5E1', color: '#0F172A', letterSpacing: '0.05em' }}>
              {showPassword}
            </div>
            <div className="flex gap-3 w-full">
              <button className="btn-secondary flex-1" onClick={() => { navigator.clipboard.writeText(showPassword); toast.success('Copied!') }}>Copy</button>
              <button className="btn-primary flex-1" onClick={() => setShowPassword(null)}>Done</button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  )
}

function EditUserModal({ user, onSave, onClose }: { user: UserRow; onSave: (u: UserRow) => void; onClose: () => void }) {
  const [form, setForm] = useState({ full_name: user.full_name, email: user.email, role: user.role })

  return (
    <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className="scale-in cd-card overflow-hidden w-full" style={{ maxWidth: 440 }} onClick={e => e.stopPropagation()}>
        <div className="px-6 py-4 flex items-center justify-between" style={{ borderBottom: '1px solid #F1F5F9', background: '#FAFAFA' }}>
          <h3 style={{ fontFamily: 'Montserrat', fontWeight: 800, fontSize: 16, color: '#0F172A' }}>Edit User</h3>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-slate-100 transition-colors">
            <X size={15} className="text-slate-400" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="section-label mb-2 block">Full Name</label>
            <input className="cd-input" value={form.full_name} onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))} />
          </div>
          <div>
            <label className="section-label mb-2 block">Email Address</label>
            <input className="cd-input" type="email" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
          </div>
          <div>
            <label className="section-label mb-2 block">Role</label>
            <select className="cd-select" value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value as Role }))}>
              {(['super_admin','ceo','editor','social_manager','counselor'] as Role[]).map(r => (
                <option key={r} value={r}>{ROLE_META[r]?.label || r}</option>
              ))}
            </select>
          </div>
        </div>
        <div className="flex justify-end gap-3 px-6 py-4" style={{ borderTop: '1px solid #F1F5F9' }}>
          <button className="btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn-primary" onClick={() => onSave({ ...user, ...form })}>Save Changes</button>
        </div>
      </div>
    </div>
  )
}

function CreateUserModal({ onCreate, onClose }: { onCreate: (d: { full_name: string; email: string; role: Role }) => void; onClose: () => void }) {
  const [form, setForm] = useState({ full_name: '', email: '', role: 'counselor' as Role, password: '' })
  const [showPw, setShowPw] = useState(false)

  const isValid = form.full_name && form.email && form.role

  return (
    <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className="scale-in cd-card overflow-hidden w-full" style={{ maxWidth: 460 }} onClick={e => e.stopPropagation()}>
        <div className="px-6 py-4 flex items-center justify-between" style={{ borderBottom: '1px solid #F1F5F9', background: 'linear-gradient(135deg, #2E1065, #4C1D95)' }}>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.15)' }}>
              <Plus size={15} className="text-white" />
            </div>
            <h3 style={{ fontFamily: 'Montserrat', fontWeight: 800, fontSize: 16, color: '#fff' }}>Add New User</h3>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors" style={{ background: 'rgba(255,255,255,0.1)' }}>
            <X size={15} className="text-white" />
          </button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="section-label mb-2 block">Full Name *</label>
            <input className="cd-input" placeholder="e.g. John Smith" value={form.full_name} onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))} />
          </div>
          <div>
            <label className="section-label mb-2 block">Email Address *</label>
            <input className="cd-input" type="email" placeholder="john@themigration.com" value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
          </div>
          <div>
            <label className="section-label mb-2 block">Role *</label>
            <select className="cd-select" value={form.role} onChange={e => setForm(f => ({ ...f, role: e.target.value as Role }))}>
              {(['counselor','editor','social_manager','ceo','super_admin'] as Role[]).map(r => (
                <option key={r} value={r}>{ROLE_META[r]?.label || r}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="section-label mb-2 block">Initial Password</label>
            <div className="relative">
              <input
                className="cd-input pr-10"
                type={showPw ? 'text' : 'password'}
                placeholder="Leave blank to auto-generate"
                value={form.password}
                onChange={e => setForm(f => ({ ...f, password: e.target.value }))}
              />
              <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                {showPw ? <EyeOff size={15} /> : <Eye size={15} />}
              </button>
            </div>
          </div>
          <div className="p-3 rounded-xl flex items-start gap-2" style={{ background: '#F0FDF4', border: '1px solid #BBF7D0' }}>
            <CheckCircle size={13} className="text-emerald-500 flex-shrink-0 mt-0.5" />
            <p style={{ fontFamily: 'Poppins', fontWeight: 500, fontSize: 11, color: '#065F46', margin: 0 }}>
              In demo mode this adds to the session only. Connect Supabase to persist accounts.
            </p>
          </div>
        </div>
        <div className="flex justify-end gap-3 px-6 py-4" style={{ borderTop: '1px solid #F1F5F9' }}>
          <button className="btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn-primary" disabled={!isValid} onClick={() => onCreate(form)}>
            <Plus size={14} /> Create Account
          </button>
        </div>
      </div>
    </div>
  )
}
