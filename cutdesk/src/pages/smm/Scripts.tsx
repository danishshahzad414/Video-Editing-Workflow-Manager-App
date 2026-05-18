import { useState, useEffect } from 'react'
import { FileEdit, X, Plus } from 'lucide-react'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../lib/supabase'
import { sendNotification } from '../../hooks/useNotifications'
import { CATEGORIES, PLATFORMS, PLATFORM_COLORS, formatDate } from '../../lib/utils'
import Layout from '../../components/layout/Layout'
import EmptyState from '../../components/shared/EmptyState'
import ConfirmModal from '../../components/shared/ConfirmModal'
import toast from 'react-hot-toast'
import { differenceInDays } from 'date-fns'

interface Script {
  id: string; title: string; category: string; target_platforms: string[]
  target_duration: string; body: string; recording_notes: string | null
  priority: string; deadline: string | null; status: string; created_by: string; created_at: string
}
interface Assignment { id: string; script_id: string; assigned_to: string; status: string; assigned_at: string; counselor?: any }

const STATUSES = ['All', 'Draft', 'Assigned', 'In Progress', 'Recorded', 'Archived'] as const
const DURATIONS = ['30s', '60s', '2min', '5min', '10min', '15min+']

export default function SMMScripts() {
  const [scripts, setScripts] = useState<Script[]>([])
  const [assignments, setAssignments] = useState<Record<string, Assignment[]>>({})
  const [counselors, setCounselors] = useState<any[]>([])
  const [filter, setFilter] = useState('All')
  const [showNew, setShowNew] = useState(false)
  const [detailScript, setDetailScript] = useState<Script | null>(null)
  const [archiveConfirm, setArchiveConfirm] = useState<string | null>(null)

  useEffect(() => {
    fetchScripts()
    fetchCounselors()
  }, [])

  async function fetchScripts() {
    const { data } = await supabase.from('scripts').select('*').order('created_at', { ascending: false })
    setScripts(data || [])
    if (data?.length) {
      const { data: asgn } = await supabase.from('script_assignments').select('*, counselor:profiles!script_assignments_assigned_to_fkey(full_name)').in('script_id', data.map(s => s.id))
      const grouped: Record<string, Assignment[]> = {}
      for (const a of asgn || []) {
        if (!grouped[a.script_id]) grouped[a.script_id] = []
        grouped[a.script_id].push(a)
      }
      setAssignments(grouped)
    }
  }

  async function fetchCounselors() {
    const { data } = await supabase.from('profiles').select('id, full_name').eq('role', 'counselor')
    setCounselors(data || [])
  }

  const filtered = scripts.filter(s => filter === 'All' || s.status === filter)

  async function archiveScript(id: string) {
    await supabase.from('scripts').update({ status: 'Archived' }).eq('id', id)
    setArchiveConfirm(null)
    fetchScripts()
    toast.success('Script archived!')
  }

  const priorityBorderColor = (p: string) => p === 'Urgent' ? '#EF4444' : p === 'Low' ? '#6B7280' : '#00A2CF'

  return (
    <Layout title="Scripts">
      <div className="max-w-3xl mx-auto fade-in">
        <div className="flex items-center justify-between mb-5">
          <div className="flex gap-1 p-1 rounded-xl" style={{ background: '#003D52' }}>
            {STATUSES.map(s => (
              <button key={s} onClick={() => setFilter(s)} className="px-3 py-1.5 rounded-lg text-xs transition-all" style={{ background: filter === s ? '#00A2CF' : 'transparent', color: filter === s ? '#fff' : 'rgba(245,248,250,0.5)', fontFamily: 'Poppins', fontWeight: 600 }}>{s}</button>
            ))}
          </div>
          <button className="btn-primary text-sm py-2 px-4" onClick={() => setShowNew(true)}><Plus size={15} /> New Script</button>
        </div>

        {filtered.length === 0 ? (
          <EmptyState icon={FileEdit} title="No scripts yet" description="Create your first script to assign to counselors" action={<button className="btn-primary" onClick={() => setShowNew(true)}><Plus size={15} /> New Script</button>} />
        ) : (
          <div className="space-y-3">
            {filtered.map(script => {
              const scriptAssignments = assignments[script.id] || []
              const daysUntil = script.deadline ? differenceInDays(new Date(script.deadline), new Date()) : null
              const isOverdue = daysUntil !== null && daysUntil < 0
              const isNear = daysUntil !== null && daysUntil >= 0 && daysUntil < 3

              return (
                <div key={script.id} className="cd-card p-4" style={{ borderLeft: `4px solid ${priorityBorderColor(script.priority)}` }}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1 flex-wrap">
                        <h3 className="text-white text-sm font-bold" style={{ fontFamily: 'Montserrat', fontWeight: 700 }}>{script.title}</h3>
                        {script.priority !== 'Normal' && <span style={{ background: priorityBorderColor(script.priority), color: '#fff', fontFamily: 'Poppins', fontWeight: 600, fontSize: 10, padding: '2px 6px', borderRadius: 4 }}>{script.priority}</span>}
                        <span style={{ background: 'rgba(0,162,207,0.15)', color: '#00A2CF', fontFamily: 'Poppins', fontWeight: 600, fontSize: 10, padding: '2px 6px', borderRadius: 4 }}>{script.category}</span>
                        <span style={{ background: script.status === 'Draft' ? 'rgba(107,114,128,0.3)' : 'rgba(16,185,129,0.15)', color: script.status === 'Draft' ? '#9CA3AF' : '#10B981', fontFamily: 'Poppins', fontWeight: 600, fontSize: 10, padding: '2px 6px', borderRadius: 4, textTransform: 'uppercase' }}>{script.status}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex gap-1">{(script.target_platforms || []).map(p => <div key={p} className="w-2 h-2 rounded-full" style={{ background: PLATFORM_COLORS[p] || '#6B7280' }} title={p} />)}</div>
                        {script.deadline && <span style={{ fontFamily: 'Poppins', fontWeight: 500, fontSize: 11, color: isOverdue ? '#EF4444' : isNear ? '#F59E0B' : 'rgba(245,248,250,0.4)' }}>Due {formatDate(script.deadline)}</span>}
                        <span className="text-white/40 text-xs" style={{ fontFamily: 'Poppins' }}>{scriptAssignments.length > 0 ? `Assigned to: ${scriptAssignments.map(a => a.counselor?.full_name || '').join(', ')}` : 'Unassigned'}</span>
                      </div>
                    </div>
                    <div className="flex gap-2 flex-shrink-0 ml-2">
                      <button className="text-xs px-3 py-1.5 rounded-lg" style={{ background: 'rgba(0,162,207,0.15)', color: '#00A2CF', fontFamily: 'Poppins', fontWeight: 700 }} onClick={() => setDetailScript(script)}>View</button>
                      <button className="text-xs px-3 py-1.5 rounded-lg" style={{ background: 'rgba(239,68,68,0.15)', color: '#EF4444', fontFamily: 'Poppins', fontWeight: 700 }} onClick={() => setArchiveConfirm(script.id)}>Archive</button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {showNew && <NewScriptModal counselors={counselors} onClose={() => setShowNew(false)} onSaved={fetchScripts} />}
      {detailScript && <ScriptDetailPanel script={detailScript} assignments={assignments[detailScript.id] || []} counselors={counselors} onClose={() => setDetailScript(null)} onRefresh={fetchScripts} />}
      {archiveConfirm && <ConfirmModal title="Archive Script?" message="This script will be archived and no longer active." confirmLabel="Archive" onConfirm={() => archiveScript(archiveConfirm)} onCancel={() => setArchiveConfirm(null)} />}
    </Layout>
  )
}

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
      onClose()
    } catch (err: any) {
      toast.error(err.message || 'Failed to save')
    }
    setSaving(false)
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="rounded-xl overflow-hidden w-full flex flex-col" style={{ maxWidth: 680, maxHeight: '90vh', background: '#003D52', border: '1px solid rgba(0,162,207,0.15)' }} onClick={e => e.stopPropagation()}>
        <div className="px-6 py-4 flex items-center justify-between flex-shrink-0" style={{ background: '#006386' }}>
          <h2 className="text-white text-lg" style={{ fontFamily: 'Montserrat', fontWeight: 800 }}>New Script</h2>
          <button onClick={onClose} className="text-white/60 hover:text-white"><X size={18} /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
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
                  <button key={p} onClick={() => setForm(f => ({ ...f, priority: p }))} className="flex-1 py-2 rounded-lg text-xs transition-all" style={{ background: form.priority === p ? '#00A2CF' : 'rgba(255,255,255,0.08)', color: '#fff', fontFamily: 'Poppins', fontWeight: 700 }}>{p}</button>
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
                <button key={p} onClick={() => setPlatforms(prev => prev.includes(p) ? prev.filter(x => x !== p) : [...prev, p])} className="px-3 py-1.5 rounded-lg text-xs" style={{ background: platforms.includes(p) ? 'rgba(0,162,207,0.2)' : 'rgba(255,255,255,0.06)', color: platforms.includes(p) ? '#00A2CF' : 'rgba(245,248,250,0.5)', fontFamily: 'Poppins', fontWeight: 600, border: `1px solid ${platforms.includes(p) ? 'rgba(0,162,207,0.4)' : 'transparent'}` }}>{p}</button>
              ))}
            </div>
          </div>
          <div>
            <label className="section-label mb-2 block">Assign To</label>
            <div className="grid grid-cols-2 gap-1.5 max-h-32 overflow-y-auto">
              {counselors.map(c => (
                <label key={c.id} className="flex items-center gap-2 cursor-pointer p-2 rounded-lg hover:bg-[rgba(0,162,207,0.05)]">
                  <input type="checkbox" checked={assignTo.includes(c.id)} onChange={() => setAssignTo(prev => prev.includes(c.id) ? prev.filter(x => x !== c.id) : [...prev, c.id])} className="accent-[#00A2CF]" />
                  <span style={{ fontFamily: 'Poppins', fontWeight: 500, fontSize: 12, color: '#fff' }}>{c.full_name}</span>
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
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-[rgba(0,162,207,0.15)] flex-shrink-0">
          <button className="btn-secondary" onClick={onClose}>Cancel</button>
          <button className="btn-secondary" onClick={() => save(false)} disabled={saving || !form.title || !form.category || !form.body}>Save as Draft</button>
          <button className="btn-primary" onClick={() => save(true)} disabled={saving || !form.title || !form.category || !form.body}>{saving ? 'Saving...' : 'Save & Assign'}</button>
        </div>
      </div>
    </div>
  )
}

function ScriptDetailPanel({ script, assignments, onClose }: { script: Script; assignments: Assignment[]; counselors: any[]; onClose: () => void; onRefresh: () => void }) {
  async function sendReminder(counselorId: string) {
    await sendNotification(counselorId, `Reminder: Please record "${script.title}"`, script.deadline ? `Due ${formatDate(script.deadline)}` : '', undefined, script.id)
    toast.success('Reminder sent!')
  }

  const statusColor: Record<string, string> = { Assigned: '#3B82F6', Acknowledged: '#8B5CF6', Recording: '#F59E0B', Submitted: '#10B981', Done: '#06B6D4' }

  return (
    <div className="fixed inset-0 z-50 flex justify-end">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative w-[400px] h-full flex flex-col slide-in-right" style={{ background: '#003D52', borderLeft: '1px solid rgba(0,162,207,0.15)' }}>
        <div className="px-5 py-4 border-b border-[rgba(0,162,207,0.15)] flex items-center justify-between flex-shrink-0" style={{ background: '#006386' }}>
          <div>
            <h2 className="text-white text-base font-bold" style={{ fontFamily: 'Montserrat', fontWeight: 800 }}>{script.title}</h2>
            <span style={{ background: script.status === 'Draft' ? '#6B7280' : '#00A2CF', color: '#fff', fontFamily: 'Poppins', fontWeight: 600, fontSize: 10, padding: '2px 6px', borderRadius: 4 }}>{script.status}</span>
          </div>
          <button onClick={onClose} className="text-white/60 hover:text-white"><X size={18} /></button>
        </div>
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          <div className="grid grid-cols-2 gap-3 text-xs">
            {[['Category', script.category], ['Platforms', (script.target_platforms || []).join(', ')], ['Duration', script.target_duration || '—'], ['Deadline', script.deadline ? formatDate(script.deadline) : '—']].map(([l, v]) => (
              <div key={l}><p className="section-label mb-1">{l}</p><p className="text-white/70" style={{ fontFamily: 'Poppins' }}>{v}</p></div>
            ))}
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <p className="section-label">Script Body</p>
              <button className="text-xs text-[#00A2CF] hover:underline" style={{ fontFamily: 'Poppins', fontWeight: 600 }} onClick={() => navigator.clipboard.writeText(script.body).then(() => toast.success('Copied!'))}>Copy Script</button>
            </div>
            <div className="p-3 rounded-lg text-white/70 text-xs overflow-y-auto max-h-48" style={{ background: 'rgba(0,162,207,0.05)', border: '1px solid rgba(0,162,207,0.1)', fontFamily: 'Poppins', fontWeight: 500, whiteSpace: 'pre-wrap' }}>{script.body}</div>
          </div>
          {script.recording_notes && (
            <div>
              <p className="section-label mb-2">Recording Notes</p>
              <div className="p-3 rounded-lg" style={{ background: 'rgba(245,158,11,0.08)', borderLeft: '3px solid rgba(245,158,11,0.5)' }}>
                <p className="text-white/70 text-xs" style={{ fontFamily: 'Poppins' }}>{script.recording_notes}</p>
              </div>
            </div>
          )}
          <div>
            <p className="section-label mb-2">Assignment Tracker ({assignments.length})</p>
            {assignments.length === 0 ? (
              <p className="text-white/30 text-xs" style={{ fontFamily: 'Poppins' }}>No counselors assigned yet</p>
            ) : (
              <table className="w-full text-xs">
                <thead><tr><th className="text-left section-label py-1">Counselor</th><th className="text-left section-label py-1">Status</th><th className="text-left section-label py-1">Action</th></tr></thead>
                <tbody>
                  {assignments.map(a => (
                    <tr key={a.id} style={{ borderTop: '1px solid rgba(0,162,207,0.06)' }}>
                      <td className="py-2 text-white/70" style={{ fontFamily: 'Poppins' }}>{a.counselor?.full_name}</td>
                      <td className="py-2"><span style={{ background: statusColor[a.status] || '#6B7280', color: '#fff', padding: '1px 5px', borderRadius: 3, fontFamily: 'Poppins', fontWeight: 600, fontSize: 9, textTransform: 'uppercase' }}>{a.status}</span></td>
                      <td className="py-2">
                        {!['Submitted', 'Done'].includes(a.status) && (
                          <button onClick={() => sendReminder(a.assigned_to)} className="text-[#00A2CF] hover:underline" style={{ fontFamily: 'Poppins', fontWeight: 600 }}>Send Reminder</button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
