import { useState, useEffect } from 'react'
import { FileEdit, X, Plus, UserPlus, Bell } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../lib/supabase'
import { sendNotification } from '../../hooks/useNotifications'
import { CATEGORIES, PLATFORMS, PLATFORM_COLORS, formatDate } from '../../lib/utils'
import Layout from '../../components/layout/Layout'
import EmptyState from '../../components/shared/EmptyState'
import ConfirmModal from '../../components/shared/ConfirmModal'
import toast from 'react-hot-toast'
import { differenceInDays } from 'date-fns'
import { DEMO_MODE, MOCK_SCRIPTS, MOCK_SCRIPT_ASSIGNMENTS, DEMO_PROFILES } from '../../lib/mockData'

interface Script {
  id: string; title: string; category: string; target_platforms: string[]
  target_duration: string; body: string; recording_notes: string | null
  priority: string; deadline: string | null; status: string; created_by: string; created_at: string
}
interface Assignment { id: string; script_id: string; assigned_to: string; status: string; assigned_at: string; deadline: string | null; counselor?: any }

const STATUSES = ['All', 'Draft', 'Assigned', 'In Progress', 'Recorded', 'Archived'] as const
const DURATIONS = ['30s', '60s', '2min', '5min', '10min', '15min+']

const STATUS_STYLE: Record<string, { bg: string; color: string }> = {
  Draft: { bg: '#F1F5F9', color: '#64748B' },
  Assigned: { bg: '#EFF6FF', color: '#0284C7' },
  'In Progress': { bg: '#FEF3C7', color: '#B45309' },
  Recorded: { bg: '#D1FAE5', color: '#065F46' },
  Archived: { bg: '#F1F5F9', color: '#94A3B8' },
}

const DEMO_COUNSELORS = Object.values(DEMO_PROFILES)
  .filter(p => p.role === 'counselor')
  .map(p => ({ id: p.id, full_name: p.full_name, email: p.email }))

export default function SMMScripts() {
  const [scripts, setScripts] = useState<Script[]>([])
  const [assignments, setAssignments] = useState<Record<string, Assignment[]>>({})
  const [counselors, setCounselors] = useState<any[]>([])
  const [filter, setFilter] = useState('All')
  const [showNew, setShowNew] = useState(false)
  const [detailScript, setDetailScript] = useState<Script | null>(null)
  const [assignScript, setAssignScript] = useState<Script | null>(null)
  const [archiveConfirm, setArchiveConfirm] = useState<string | null>(null)

  useEffect(() => { fetchAll() }, [])

  function fetchAll() {
    if (DEMO_MODE) {
      setScripts(MOCK_SCRIPTS as any)
      const grouped: Record<string, Assignment[]> = {}
      for (const a of MOCK_SCRIPT_ASSIGNMENTS) {
        if (!grouped[a.script_id]) grouped[a.script_id] = []
        grouped[a.script_id].push(a as any)
      }
      setAssignments(grouped)
      setCounselors(DEMO_COUNSELORS)
      return
    }
    fetchScripts()
    fetchCounselors()
  }

  async function fetchScripts() {
    const { data } = await supabase.from('scripts').select('*').order('created_at', { ascending: false })
    setScripts(data || [])
    if (data?.length) {
      const { data: asgn } = await supabase
        .from('script_assignments')
        .select('*, counselor:profiles!script_assignments_assigned_to_fkey(full_name, email)')
        .in('script_id', data.map(s => s.id))
      const grouped: Record<string, Assignment[]> = {}
      for (const a of asgn || []) {
        if (!grouped[a.script_id]) grouped[a.script_id] = []
        grouped[a.script_id].push(a)
      }
      setAssignments(grouped)
    }
  }

  async function fetchCounselors() {
    const { data } = await supabase.from('profiles').select('id, full_name, email').eq('role', 'counselor')
    setCounselors(data || [])
  }

  const filtered = scripts.filter(s => filter === 'All' || s.status === filter)

  async function archiveScript(id: string) {
    if (DEMO_MODE) {
      setScripts(prev => prev.map(s => s.id === id ? { ...s, status: 'Archived' } : s))
      setArchiveConfirm(null)
      toast.success('Script archived!')
      return
    }
    await supabase.from('scripts').update({ status: 'Archived' }).eq('id', id)
    setArchiveConfirm(null)
    fetchScripts()
    toast.success('Script archived!')
  }

  const priorityBorderColor = (p: string) => p === 'Urgent' ? '#EF4444' : p === 'Low' ? '#94A3B8' : '#0284C7'

  return (
    <Layout title="Scripts">
      <div className="max-w-3xl mx-auto fade-in">
        {/* Filter bar + New Script button */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5">
          <div className="flex flex-wrap gap-1 p-1 rounded-xl" style={{ background: '#F1F5F9', border: '1px solid #E2E8F0' }}>
            {STATUSES.map(s => (
              <button
                key={s}
                onClick={() => setFilter(s)}
                className="px-3 py-1.5 rounded-lg text-xs transition-all"
                style={{ background: filter === s ? '#0284C7' : 'transparent', color: filter === s ? '#fff' : '#475569', fontFamily: 'Poppins', fontWeight: 600 }}
              >
                {s}
              </button>
            ))}
          </div>
          <button className="btn-primary text-sm py-2 px-4" onClick={() => setShowNew(true)}>
            <Plus size={15} /> New Script
          </button>
        </div>

        {filtered.length === 0 ? (
          <EmptyState icon={FileEdit} title="No scripts yet" description="Create your first script to assign to counselors" action={<button className="btn-primary" onClick={() => setShowNew(true)}><Plus size={15} /> New Script</button>} />
        ) : (
          <div className="space-y-3 stagger-children">
            {filtered.map(script => {
              const scriptAssignments = assignments[script.id] || []
              const daysUntil = script.deadline ? differenceInDays(new Date(script.deadline), new Date()) : null
              const isOverdue = daysUntil !== null && daysUntil < 0
              const isNear = daysUntil !== null && daysUntil >= 0 && daysUntil < 3
              const style = STATUS_STYLE[script.status] || STATUS_STYLE['Draft']

              return (
                <div key={script.id} className="cd-card p-4 fade-in" style={{ borderLeft: `4px solid ${priorityBorderColor(script.priority)}` }}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1.5 flex-wrap">
                        <h3 className="text-sm font-bold" style={{ fontFamily: 'Montserrat', fontWeight: 700, color: '#0F172A' }}>{script.title}</h3>
                        {script.priority !== 'Normal' && (
                          <span style={{ background: priorityBorderColor(script.priority), color: '#fff', fontFamily: 'Poppins', fontWeight: 600, fontSize: 10, padding: '2px 6px', borderRadius: 4 }}>
                            {script.priority}
                          </span>
                        )}
                        <span style={{ background: '#EFF6FF', color: '#0284C7', fontFamily: 'Poppins', fontWeight: 600, fontSize: 10, padding: '2px 6px', borderRadius: 4 }}>
                          {script.category}
                        </span>
                        <span style={{ background: style.bg, color: style.color, fontFamily: 'Poppins', fontWeight: 600, fontSize: 10, padding: '2px 6px', borderRadius: 4, textTransform: 'uppercase' }}>
                          {script.status}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 flex-wrap">
                        <div className="flex gap-1">
                          {(script.target_platforms || []).map(p => (
                            <div key={p} className="w-2 h-2 rounded-full" style={{ background: PLATFORM_COLORS[p] || '#94A3B8' }} title={p} />
                          ))}
                        </div>
                        {script.deadline && (
                          <span style={{ fontFamily: 'Poppins', fontWeight: 500, fontSize: 11, color: isOverdue ? '#EF4444' : isNear ? '#F59E0B' : '#94A3B8' }}>
                            Due {formatDate(script.deadline)}
                          </span>
                        )}
                        <span style={{ fontFamily: 'Poppins', fontSize: 11, color: '#94A3B8' }}>
                          {scriptAssignments.length > 0
                            ? `Assigned to: ${scriptAssignments.map(a => a.counselor?.full_name || '').filter(Boolean).join(', ')}`
                            : 'Unassigned'}
                        </span>
                      </div>
                    </div>
                    <div className="flex gap-2 flex-shrink-0 flex-wrap justify-end">
                      <button
                        className="text-xs px-3 py-1.5 rounded-lg flex items-center gap-1"
                        style={{ background: '#F0FDF4', color: '#065F46', fontFamily: 'Poppins', fontWeight: 700, border: '1px solid #BBF7D0' }}
                        onClick={() => setAssignScript(script)}
                      >
                        <UserPlus size={12} /> Assign
                      </button>
                      <button
                        className="text-xs px-3 py-1.5 rounded-lg"
                        style={{ background: '#EFF6FF', color: '#0284C7', fontFamily: 'Poppins', fontWeight: 700, border: '1px solid #BFDBFE' }}
                        onClick={() => setDetailScript(script)}
                      >
                        View
                      </button>
                      <button
                        className="text-xs px-3 py-1.5 rounded-lg"
                        style={{ background: '#FEE2E2', color: '#EF4444', fontFamily: 'Poppins', fontWeight: 700, border: '1px solid #FECACA' }}
                        onClick={() => setArchiveConfirm(script.id)}
                      >
                        Archive
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {showNew && (
        <NewScriptModal
          counselors={counselors}
          onClose={() => setShowNew(false)}
          onSaved={() => { fetchAll(); setShowNew(false) }}
        />
      )}
      {detailScript && (
        <ScriptDetailPanel
          script={detailScript}
          assignments={assignments[detailScript.id] || []}
          counselors={counselors}
          onClose={() => setDetailScript(null)}
          onRefresh={fetchAll}
        />
      )}
      {assignScript && (
        <AssignScriptModal
          script={assignScript}
          counselors={counselors}
          existingAssignments={assignments[assignScript.id] || []}
          onClose={() => setAssignScript(null)}
          onSaved={() => { fetchAll(); setAssignScript(null) }}
        />
      )}
      {archiveConfirm && (
        <ConfirmModal
          title="Archive Script?"
          message="This script will be archived and no longer active."
          confirmLabel="Archive"
          onConfirm={() => archiveScript(archiveConfirm)}
          onCancel={() => setArchiveConfirm(null)}
        />
      )}
    </Layout>
  )
}

// ── Assign Script Modal ───────────────────────────────────────────────────────
function AssignScriptModal({ script, counselors, existingAssignments, onClose, onSaved }: {
  script: Script
  counselors: any[]
  existingAssignments: Assignment[]
  onClose: () => void
  onSaved: () => void
}) {
  const { profile } = useAuth()
  const alreadyAssigned = existingAssignments.map(a => a.assigned_to)
  const [selected, setSelected] = useState<string[]>([])
  const [deadline, setDeadline] = useState(script.deadline || '')
  const [saving, setSaving] = useState(false)
  const [done, setDone] = useState(false)

  function toggle(id: string) {
    setSelected(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  }

  async function handleAssign() {
    if (selected.length === 0 || !profile) return
    setSaving(true)
    try {
      if (DEMO_MODE) {
        await new Promise(r => setTimeout(r, 800))
        toast.success(`Script assigned to ${selected.length} counselor${selected.length > 1 ? 's' : ''}!`)
        setDone(true)
        setTimeout(onSaved, 1200)
        return
      }
      for (const counselorId of selected) {
        if (alreadyAssigned.includes(counselorId)) continue
        await supabase.from('script_assignments').insert({
          script_id: script.id,
          assigned_to: counselorId,
          assigned_by: profile.id,
          assigned_at: new Date().toISOString(),
          deadline: deadline || null,
          status: 'Assigned',
        })
        await sendNotification(counselorId, `New script assigned: "${script.title}"`, deadline ? `Due ${formatDate(deadline)}` : '', undefined, script.id)
      }
      if (script.status === 'Draft') {
        await supabase.from('scripts').update({ status: 'Assigned', deadline: deadline || script.deadline }).eq('id', script.id)
      }
      toast.success(`Script assigned to ${selected.length} counselor${selected.length > 1 ? 's' : ''}!`)
      setDone(true)
      setTimeout(onSaved, 1200)
    } catch (err: any) {
      toast.error(err.message || 'Failed to assign')
    }
    setSaving(false)
  }

  return (
    <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div
        className="scale-in rounded-2xl overflow-hidden w-full flex flex-col"
        style={{ maxWidth: 520, background: '#FFFFFF', border: '1px solid #E2E8F0', boxShadow: '0 20px 60px rgba(0,0,0,0.12)' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 flex items-center justify-between flex-shrink-0" style={{ background: 'linear-gradient(135deg, #0284C7, #06B6D4)', color: '#fff' }}>
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.2)' }}>
              <UserPlus size={16} />
            </div>
            <div>
              <h2 style={{ fontFamily: 'Montserrat', fontWeight: 800, fontSize: 16, margin: 0 }}>Assign Script</h2>
              <p style={{ fontFamily: 'Poppins', fontWeight: 400, fontSize: 11, opacity: 0.85, margin: 0 }}>{script.title}</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.15)' }}>
            <X size={16} />
          </button>
        </div>

        {done ? (
          <div className="p-10 flex flex-col items-center gap-4 text-center">
            <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ background: '#DCFCE7' }}>
              <UserPlus size={28} className="text-emerald-500" />
            </div>
            <p style={{ fontFamily: 'Montserrat', fontWeight: 800, fontSize: 18, color: '#0F172A' }}>Assigned!</p>
            <p style={{ fontFamily: 'Poppins', fontWeight: 400, fontSize: 13, color: '#64748B' }}>
              Counselors have been notified.
            </p>
          </div>
        ) : (
          <>
            <div className="p-6 space-y-5 flex-1 overflow-y-auto">
              {/* Deadline */}
              <div>
                <label className="section-label mb-2 block">Recording Deadline</label>
                <input type="date" className="cd-input" value={deadline} onChange={e => setDeadline(e.target.value)} />
              </div>

              {/* Counselor list */}
              <div>
                <label className="section-label mb-2 block">Select Counselors *</label>
                {counselors.length === 0 ? (
                  <p style={{ fontFamily: 'Poppins', fontSize: 12, color: '#94A3B8' }}>No counselors available</p>
                ) : (
                  <div className="space-y-2 max-h-60 overflow-y-auto">
                    {counselors.map(c => {
                      const isExisting = alreadyAssigned.includes(c.id)
                      const isSelected = selected.includes(c.id)
                      return (
                        <label
                          key={c.id}
                          className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${isExisting ? 'opacity-50 cursor-not-allowed' : 'hover:bg-slate-50'}`}
                          style={{ border: `1.5px solid ${isSelected ? '#0284C7' : '#E2E8F0'}`, background: isSelected ? '#EFF6FF' : '#FAFAFA' }}
                        >
                          <input
                            type="checkbox"
                            checked={isSelected}
                            disabled={isExisting}
                            onChange={() => !isExisting && toggle(c.id)}
                            className="accent-[#0284C7]"
                          />
                          <div className="flex-1 min-w-0">
                            <p style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: 13, color: '#0F172A', margin: 0 }}>{c.full_name}</p>
                            <p style={{ fontFamily: 'Poppins', fontWeight: 400, fontSize: 11, color: '#94A3B8', margin: 0 }}>{c.email}</p>
                          </div>
                          {isExisting && (
                            <span style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: 10, color: '#10B981', background: '#D1FAE5', padding: '2px 6px', borderRadius: 4 }}>
                              Already Assigned
                            </span>
                          )}
                        </label>
                      )
                    })}
                  </div>
                )}
              </div>

              {selected.length > 0 && (
                <div className="p-3 rounded-xl" style={{ background: '#F0FDF4', border: '1px solid #BBF7D0' }}>
                  <p style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: 12, color: '#065F46', margin: 0 }}>
                    ✓ {selected.length} counselor{selected.length > 1 ? 's' : ''} selected · They will receive a notification
                  </p>
                </div>
              )}

              {DEMO_MODE && (
                <div className="p-3 rounded-xl flex items-start gap-2" style={{ background: '#EFF6FF', border: '1px solid #BFDBFE' }}>
                  <Bell size={13} className="text-sky-500 mt-0.5 flex-shrink-0" />
                  <p style={{ fontFamily: 'Poppins', fontWeight: 500, fontSize: 12, color: '#1D4ED8', margin: 0 }}>
                    <strong>Demo Mode:</strong> Assignment will be simulated. In production, selected counselors receive in-app notifications.
                  </p>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-3 px-6 py-4" style={{ borderTop: '1px solid #E2E8F0' }}>
              <button className="btn-secondary" onClick={onClose} disabled={saving}>Cancel</button>
              <button
                className="btn-primary"
                onClick={handleAssign}
                disabled={selected.length === 0 || saving}
              >
                {saving ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Assigning...
                  </span>
                ) : (
                  <><UserPlus size={14} /> Assign to {selected.length > 0 ? selected.length : ''} Counselor{selected.length !== 1 ? 's' : ''}</>
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  )
}

// ── New Script Modal ──────────────────────────────────────────────────────────
function NewScriptModal({ counselors, onClose, onSaved }: { counselors: any[]; onClose: () => void; onSaved: () => void }) {
  const { profile } = useAuth()
  const [form, setForm] = useState({ title: '', category: '', duration: '', priority: 'Normal', deadline: '', body: '', recording_notes: '' })
  const [platforms, setPlatforms] = useState<string[]>([])
  const [assignTo, setAssignTo] = useState<string[]>([])
  const [saving, setSaving] = useState(false)

  async function save(assign: boolean) {
    if (!form.title || !form.category || !form.body || !profile) return
    setSaving(true)
    try {
      if (DEMO_MODE) {
        await new Promise(r => setTimeout(r, 700))
        toast.success(assign ? 'Script saved and assigned! (Demo)' : 'Script saved as draft! (Demo)')
        onSaved()
        return
      }
      const status = assign && assignTo.length > 0 ? 'Assigned' : 'Draft'
      const { data: script, error } = await supabase.from('scripts').insert({
        title: form.title, category: form.category, target_platforms: platforms,
        target_duration: form.duration, body: form.body, recording_notes: form.recording_notes || null,
        priority: form.priority, deadline: form.deadline || null, created_by: profile.id,
        status, created_at: new Date().toISOString(),
      }).select().single()
      if (error) throw error

      if (assign && assignTo.length > 0) {
        for (const counselorId of assignTo) {
          await supabase.from('script_assignments').insert({ script_id: script.id, assigned_to: counselorId, assigned_by: profile.id, assigned_at: new Date().toISOString(), status: 'Assigned' })
          await sendNotification(counselorId, `New script assigned: "${form.title}"`, `Due ${form.deadline || 'no deadline'}`, undefined, script.id)
        }
      }
      toast.success(assign ? 'Script saved and assigned!' : 'Script saved as draft!')
      onSaved()
    } catch (err: any) {
      toast.error(err.message || 'Failed to save')
    }
    setSaving(false)
  }

  return (
    <div className="modal-overlay" onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div
        className="rounded-2xl overflow-hidden w-full flex flex-col scale-in"
        style={{ maxWidth: 680, maxHeight: '90vh', background: '#FFFFFF', border: '1px solid #E2E8F0', boxShadow: '0 20px 60px rgba(0,0,0,0.12)' }}
        onClick={e => e.stopPropagation()}
      >
        <div className="px-6 py-4 flex items-center justify-between flex-shrink-0" style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
          <h2 style={{ fontFamily: 'Montserrat', fontWeight: 800, fontSize: 18, color: '#0F172A', margin: 0 }}>New Script</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors"><X size={18} /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {DEMO_MODE && (
            <div className="flex items-start gap-2 px-4 py-3 rounded-xl" style={{ background: '#EFF6FF', border: '1px solid #BFDBFE' }}>
              <Bell size={13} className="text-sky-500 mt-0.5 flex-shrink-0" />
              <p style={{ fontFamily: 'Poppins', fontWeight: 500, fontSize: 12, color: '#1D4ED8', margin: 0 }}>
                <strong>Demo Mode:</strong> Script will be simulated and not saved to the database.
              </p>
            </div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="section-label mb-2 block">Script Title *</label>
              <input className="cd-input" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="Enter script title" />
            </div>
            <div>
              <label className="section-label mb-2 block">Category *</label>
              <select className="cd-select" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                <option value="">Select category</option>
                {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="section-label mb-2 block">Target Duration</label>
              <select className="cd-select" value={form.duration} onChange={e => setForm(f => ({ ...f, duration: e.target.value }))}>
                <option value="">Select duration</option>
                {DURATIONS.map(d => <option key={d} value={d}>{d}</option>)}
              </select>
            </div>
            <div>
              <label className="section-label mb-2 block">Priority</label>
              <div className="flex gap-2">
                {['Urgent', 'Normal', 'Low'].map(p => (
                  <button key={p} onClick={() => setForm(f => ({ ...f, priority: p }))} className="flex-1 py-2 rounded-lg text-xs transition-all" style={{ background: form.priority === p ? '#0284C7' : '#F1F5F9', color: form.priority === p ? '#fff' : '#475569', fontFamily: 'Poppins', fontWeight: 700, border: '1px solid #E2E8F0' }}>{p}</button>
                ))}
              </div>
            </div>
            <div>
              <label className="section-label mb-2 block">Recording Deadline</label>
              <input type="date" className="cd-input" value={form.deadline} onChange={e => setForm(f => ({ ...f, deadline: e.target.value }))} />
            </div>
          </div>
          <div>
            <label className="section-label mb-2 block">Target Platforms</label>
            <div className="flex gap-2 flex-wrap">
              {PLATFORMS.map(p => (
                <button key={p} onClick={() => setPlatforms(prev => prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p])} className="px-3 py-1.5 rounded-lg text-xs" style={{ background: platforms.includes(p) ? '#EFF6FF' : '#F8FAFC', color: platforms.includes(p) ? '#0284C7' : '#475569', fontFamily: 'Poppins', fontWeight: 600, border: `1.5px solid ${platforms.includes(p) ? '#BFDBFE' : '#E2E8F0'}` }}>{p}</button>
              ))}
            </div>
          </div>
          <div>
            <label className="section-label mb-2 block">Assign To Counselors</label>
            <div className="grid grid-cols-2 gap-1.5 max-h-32 overflow-y-auto">
              {counselors.map(c => (
                <label key={c.id} className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-slate-50">
                  <input type="checkbox" checked={assignTo.includes(c.id)} onChange={() => setAssignTo(prev => prev.includes(c.id) ? prev.filter(x => x !== c.id) : [...prev, c.id])} className="accent-[#0284C7]" />
                  <span style={{ fontFamily: 'Poppins', fontWeight: 500, fontSize: 12, color: '#0F172A' }}>{c.full_name}</span>
                </label>
              ))}
            </div>
          </div>
          <div>
            <label className="section-label mb-2 block">Script Body *</label>
            <textarea className="cd-textarea" rows={6} placeholder="Write the full script here..." value={form.body} onChange={e => setForm(f => ({ ...f, body: e.target.value }))} style={{ minHeight: 120 }} />
          </div>
          <div>
            <label className="section-label mb-2 block">Recording Notes</label>
            <textarea className="cd-textarea" rows={2} placeholder="Lighting, tone, delivery instructions..." value={form.recording_notes} onChange={e => setForm(f => ({ ...f, recording_notes: e.target.value }))} />
          </div>
        </div>
        <div className="flex flex-col sm:flex-row justify-end gap-3 px-6 py-4 flex-shrink-0" style={{ borderTop: '1px solid #E2E8F0' }}>
          <button className="btn-secondary order-3 sm:order-1" onClick={onClose}>Cancel</button>
          <button className="btn-secondary order-2" onClick={() => save(false)} disabled={saving || !form.title || !form.category || !form.body}>Save as Draft</button>
          <button className="btn-primary order-1 sm:order-3" onClick={() => save(true)} disabled={saving || !form.title || !form.category || !form.body}>{saving ? 'Saving...' : 'Save & Assign'}</button>
        </div>
      </div>
    </div>
  )
}

// ── Script Detail Panel ───────────────────────────────────────────────────────
function ScriptDetailPanel({ script, assignments, onClose }: { script: Script; assignments: Assignment[]; counselors: any[]; onClose: () => void; onRefresh: () => void }) {
  async function sendReminder(counselorId: string) {
    if (DEMO_MODE) {
      toast.success('Reminder sent! (Demo)')
      return
    }
    await sendNotification(counselorId, `Reminder: Please record "${script.title}"`, script.deadline ? `Due ${formatDate(script.deadline)}` : '', undefined, script.id)
    toast.success('Reminder sent!')
  }

  const statusColor: Record<string, string> = { Assigned: '#3B82F6', Acknowledged: '#8B5CF6', Recording: '#F59E0B', Submitted: '#10B981', Done: '#06B6D4' }

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0" style={{ background: 'rgba(15,23,42,0.3)', backdropFilter: 'blur(2px)' }} onClick={onClose} />
      <div className="relative w-full max-w-[420px] h-full flex flex-col slide-in-right" style={{ background: '#FFFFFF', borderLeft: '1px solid #E2E8F0', boxShadow: '-8px 0 32px rgba(0,0,0,0.08)' }}>
        <div className="px-5 py-4 flex items-center justify-between flex-shrink-0" style={{ background: '#F8FAFC', borderBottom: '1px solid #E2E8F0' }}>
          <div>
            <h2 className="text-base font-bold" style={{ fontFamily: 'Montserrat', fontWeight: 800, color: '#0F172A' }}>{script.title}</h2>
            <span style={{ background: (STATUS_STYLE[script.status] || STATUS_STYLE['Draft']).bg, color: (STATUS_STYLE[script.status] || STATUS_STYLE['Draft']).color, fontFamily: 'Poppins', fontWeight: 600, fontSize: 10, padding: '2px 6px', borderRadius: 4 }}>{script.status}</span>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors"><X size={18} /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          <div className="grid grid-cols-2 gap-3 text-xs">
            {[['Category', script.category], ['Platforms', (script.target_platforms || []).join(', ') || '—'], ['Duration', script.target_duration || '—'], ['Deadline', script.deadline ? formatDate(script.deadline) : '—']].map(([l, v]) => (
              <div key={l}><p className="section-label mb-1">{l}</p><p style={{ fontFamily: 'Poppins', color: '#475569' }}>{v}</p></div>
            ))}
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="section-label">Script Body</p>
              <button className="text-xs hover:underline" style={{ fontFamily: 'Poppins', fontWeight: 600, color: '#0284C7' }} onClick={() => navigator.clipboard.writeText(script.body).then(() => toast.success('Copied!'))}>Copy Script</button>
            </div>
            <div className="p-3 rounded-lg text-xs overflow-y-auto max-h-48" style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', fontFamily: 'Poppins', fontWeight: 500, color: '#475569', whiteSpace: 'pre-wrap' }}>{script.body}</div>
          </div>
          {script.recording_notes && (
            <div>
              <p className="section-label mb-2">Recording Notes</p>
              <div className="p-3 rounded-lg" style={{ background: '#FFFBEB', borderLeft: '3px solid #F59E0B' }}>
                <p className="text-xs" style={{ fontFamily: 'Poppins', color: '#B45309' }}>{script.recording_notes}</p>
              </div>
            </div>
          )}
          <div>
            <p className="section-label mb-2">Assignment Tracker ({assignments.length})</p>
            {assignments.length === 0 ? (
              <p className="text-xs" style={{ fontFamily: 'Poppins', color: '#94A3B8' }}>No counselors assigned yet</p>
            ) : (
              <div className="space-y-2">
                {assignments.map(a => (
                  <div key={a.id} className="flex items-center justify-between p-2 rounded-lg" style={{ background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
                    <div>
                      <p style={{ fontFamily: 'Poppins', fontWeight: 600, fontSize: 12, color: '#0F172A', margin: 0 }}>{a.counselor?.full_name}</p>
                      {a.deadline && <p style={{ fontFamily: 'Poppins', fontWeight: 400, fontSize: 11, color: '#94A3B8', margin: 0 }}>Due {formatDate(a.deadline)}</p>}
                    </div>
                    <div className="flex items-center gap-2">
                      <span style={{ background: statusColor[a.status] || '#94A3B8', color: '#fff', padding: '2px 6px', borderRadius: 4, fontFamily: 'Poppins', fontWeight: 600, fontSize: 10, textTransform: 'uppercase' }}>{a.status}</span>
                      {!['Submitted', 'Done'].includes(a.status) && (
                        <button onClick={() => sendReminder(a.assigned_to)} title="Send Reminder" className="w-7 h-7 rounded-lg flex items-center justify-center hover:bg-sky-50 transition-colors">
                          <Bell size={13} className="text-sky-500" />
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
