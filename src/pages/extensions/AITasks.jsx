import { useState } from 'react'
import { useLocalStorage } from '../../hooks/useLocalStorage'
import { sampleAITasks } from '../../data/sampleData'
import { today } from '../../utils/dateUtils'
import Modal from '../../components/Modal'
import Button from '../../components/Button'

const TOOLS = ['Claude', 'ChatGPT', 'n8n', 'Cursor', 'Gemma', 'Midjourney', 'Sonstiges']
const STATUS_COLORS = {
  todo:  'bg-surface-container text-on-surface-variant',
  doing: 'bg-primary/10 text-primary',
  done:  'bg-green-500/10 text-green-400',
}
const STATUS_LABELS = { todo: 'To Do', doing: 'In Arbeit', done: 'Erledigt' }
const emptyForm = { title: '', tool: 'Claude', status: 'todo', note: '' }

export default function AITasks() {
  const [tasks, setTasks] = useLocalStorage('maks_aitasks_v1', sampleAITasks)
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [editId, setEditId] = useState(null)
  const [filter, setFilter] = useState('all')

  const save = () => {
    if (!form.title.trim()) return
    if (editId) {
      setTasks((prev) => prev.map((t) => t.id === editId ? { ...t, ...form, doneAt: form.status === 'done' ? today() : null } : t))
    } else {
      setTasks((prev) => [...prev, { id: crypto.randomUUID(), ...form, createdAt: today(), doneAt: null }])
    }
    setShowModal(false); setForm(emptyForm); setEditId(null)
  }

  const openEdit = (t) => { setForm({ title: t.title, tool: t.tool, status: t.status, note: t.note || '' }); setEditId(t.id); setShowModal(true) }
  const del = (id) => setTasks((prev) => prev.filter((t) => t.id !== id))
  const cycleStatus = (id) => {
    const order = ['todo', 'doing', 'done']
    setTasks((prev) => prev.map((t) => t.id === id ? { ...t, status: order[(order.indexOf(t.status) + 1) % 3] } : t))
  }

  const filtered = tasks.filter((t) => filter === 'all' || t.status === filter)
  const counts = { todo: tasks.filter(t => t.status === 'todo').length, doing: tasks.filter(t => t.status === 'doing').length, done: tasks.filter(t => t.status === 'done').length }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="text-xl font-bold text-on-surface">AI Tasks</h2>
          <p className="text-sm text-on-surface-variant mt-0.5">{counts.todo} offen · {counts.doing} in Arbeit · {counts.done} erledigt</p>
        </div>
        <Button size="sm" onClick={() => { setForm(emptyForm); setEditId(null); setShowModal(true) }}>+ Task</Button>
      </div>

      {/* Filter */}
      <div className="flex gap-2">
        {['all', 'todo', 'doing', 'done'].map((s) => (
          <button key={s} onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${filter === s ? 'bg-primary text-on-primary' : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'}`}>
            {s === 'all' ? 'Alle' : STATUS_LABELS[s]} {s !== 'all' && `(${counts[s]})`}
          </button>
        ))}
      </div>

      {/* Task Table */}
      {filtered.length === 0 ? (
        <div className="glass-card rounded-2xl p-10 text-center">
          <span className="material-symbols-outlined text-4xl text-on-surface-variant mb-3 block">smart_toy</span>
          <p className="text-on-surface-variant">Noch keine AI Tasks.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {filtered.map((t) => (
            <div key={t.id} className="glass-card rounded-2xl p-4 flex items-start gap-3 group hover:bg-surface-container-high transition-all">
              <button onClick={() => cycleStatus(t.id)}
                className={`mt-0.5 px-2.5 py-1 rounded-full text-xs font-medium flex-shrink-0 transition-all ${STATUS_COLORS[t.status]}`}>
                {STATUS_LABELS[t.status]}
              </button>
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-medium ${t.status === 'done' ? 'line-through text-on-surface-variant' : 'text-on-surface'}`}>{t.title}</p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-primary bg-primary/10 px-2 py-0.5 rounded-full">{t.tool}</span>
                  {t.note && <span className="text-xs text-on-surface-variant truncate">{t.note}</span>}
                </div>
              </div>
              <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                <button onClick={() => openEdit(t)} className="text-on-surface-variant hover:text-primary p-1">
                  <span className="material-symbols-outlined text-lg">edit</span>
                </button>
                <button onClick={() => del(t.id)} className="text-on-surface-variant hover:text-red-400 p-1">
                  <span className="material-symbols-outlined text-lg">delete</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <Modal title={editId ? 'Task bearbeiten' : 'Neuer AI Task'} onClose={() => { setShowModal(false); setEditId(null) }}>
          <div className="space-y-4">
            <div>
              <label className="text-xs text-on-surface-variant uppercase tracking-wide block mb-1.5">Aufgabe</label>
              <input className="w-full bg-surface-container-low border border-white/10 rounded-2xl px-4 py-3 text-sm text-on-surface placeholder-outline focus:outline-none focus:border-primary/50"
                placeholder="z.B. n8n Workflow für Leads bauen"
                value={form.title} onChange={(e) => setForm(p => ({ ...p, title: e.target.value }))}
                autoFocus onKeyDown={(e) => e.key === 'Enter' && save()} />
            </div>
            <div>
              <label className="text-xs text-on-surface-variant uppercase tracking-wide block mb-1.5">Tool</label>
              <div className="flex flex-wrap gap-2">
                {TOOLS.map((tool) => (
                  <button key={tool} onClick={() => setForm(p => ({ ...p, tool }))}
                    className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${form.tool === tool ? 'bg-primary text-on-primary' : 'bg-surface-container text-on-surface-variant'}`}>
                    {tool}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs text-on-surface-variant uppercase tracking-wide block mb-1.5">Status</label>
              <div className="flex gap-2">
                {Object.entries(STATUS_LABELS).map(([key, label]) => (
                  <button key={key} onClick={() => setForm(p => ({ ...p, status: key }))}
                    className={`flex-1 py-2 rounded-full text-xs font-medium transition-all ${form.status === key ? 'bg-primary text-on-primary' : 'bg-surface-container text-on-surface-variant'}`}>
                    {label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs text-on-surface-variant uppercase tracking-wide block mb-1.5">Notiz</label>
              <textarea className="w-full bg-surface-container-low border border-white/10 rounded-2xl px-4 py-3 text-sm text-on-surface placeholder-outline focus:outline-none focus:border-primary/50 resize-none"
                rows={2} placeholder="Optionale Notiz …" value={form.note}
                onChange={(e) => setForm(p => ({ ...p, note: e.target.value }))} />
            </div>
            <div className="flex justify-end gap-2 pt-1">
              <Button variant="secondary" onClick={() => { setShowModal(false); setEditId(null) }}>Abbrechen</Button>
              <Button onClick={save}>Speichern</Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
