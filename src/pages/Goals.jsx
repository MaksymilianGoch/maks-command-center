import { useState } from 'react'
import { today, formatDate, daysUntil } from '../utils/dateUtils'
import Card from '../components/Card'
import Button from '../components/Button'
import Modal from '../components/Modal'
import Badge from '../components/Badge'
import ProgressBar from '../components/ProgressBar'

const CATEGORIES = ['business', 'fitness', 'learning', 'health', 'other']
const STATUSES = ['active', 'paused', 'done']
const emptyForm = { title: '', category: 'business', deadline: '', targetValue: '', currentValue: '', unit: '', nextAction: '', status: 'active' }

export default function Goals({ goals, setGoals }) {
  const [showModal, setShowModal] = useState(false)
  const [editId, setEditId] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [filter, setFilter] = useState('active')

  const saveGoal = () => {
    if (!form.title.trim()) return
    const g = { ...form, targetValue: parseFloat(form.targetValue) || 0, currentValue: parseFloat(form.currentValue) || 0 }
    if (editId) {
      setGoals((prev) => prev.map((x) => (x.id === editId ? { ...x, ...g } : x)))
    } else {
      setGoals((prev) => [...prev, { id: crypto.randomUUID(), createdAt: today(), ...g }])
    }
    setShowModal(false)
    setForm(emptyForm)
    setEditId(null)
  }

  const deleteGoal = (id) => setGoals((prev) => prev.filter((g) => g.id !== id))

  const openEdit = (g) => {
    setForm({ title: g.title, category: g.category, deadline: g.deadline, targetValue: g.targetValue, currentValue: g.currentValue, unit: g.unit, nextAction: g.nextAction, status: g.status })
    setEditId(g.id)
    setShowModal(true)
  }

  const updateProgress = (id, val) =>
    setGoals((prev) => prev.map((g) => (g.id === id ? { ...g, currentValue: parseFloat(val) || 0 } : g)))

  const filtered = goals.filter((g) => filter === 'all' || g.status === filter)

  return (
    <div className="p-4 md:p-6 space-y-4 md:space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Goals</h1>
          <p className="text-sm text-[#9a9aaa] mt-1">{goals.filter((g) => g.status === 'active').length} aktive Ziele</p>
        </div>
        <Button onClick={() => { setForm(emptyForm); setEditId(null); setShowModal(true) }}>
          + Ziel
        </Button>
      </div>

      <div className="flex gap-2">
        {['active', 'paused', 'done', 'all'].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-3 py-1.5 text-xs rounded-xl border transition-colors ${
              filter === s ? 'bg-[#7c6af7]/15 border-[#7c6af7]/50 text-[#7c6af7]' : 'border-[#1e2030] text-[#9a9aaa] hover:border-[#9a9aaa]'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <Card className="text-center py-12">
          <div className="text-[#1e2030] text-4xl mb-3">◈</div>
          <p className="text-[#9a9aaa]">Keine Ziele in dieser Kategorie.</p>
        </Card>
      ) : (
        <div className="space-y-4">
          {filtered.map((g) => {
            const days = g.deadline ? daysUntil(g.deadline) : null
            const pct = g.targetValue > 0 ? Math.round((g.currentValue / g.targetValue) * 100) : 0
            return (
              <Card key={g.id}>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-sm font-semibold text-white">{g.title}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge label={g.category} />
                      <Badge label={g.status} />
                    </div>
                  </div>
                  <div className="flex gap-1 flex-shrink-0 ml-4">
                    <Button variant="ghost" size="sm" onClick={() => openEdit(g)}>✎</Button>
                    <Button variant="danger" size="sm" onClick={() => deleteGoal(g.id)}>✕</Button>
                  </div>
                </div>

                <div className="mb-3">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs text-[#9a9aaa]">Fortschritt</span>
                    <span className="text-xs text-white">{g.currentValue} / {g.targetValue} {g.unit} ({pct}%)</span>
                  </div>
                  <ProgressBar value={g.currentValue} max={g.targetValue} colorClass={pct >= 100 ? 'bg-emerald-500' : 'bg-[#7c6af7]'} />
                </div>

                <div className="flex items-center gap-3 flex-wrap">
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-[#9a9aaa] mb-0.5">Nächste Aktion</div>
                    <div className="text-xs text-white truncate">{g.nextAction || '—'}</div>
                  </div>
                  {days !== null && (
                    <div className="text-right flex-shrink-0">
                      <div className="text-xs text-[#9a9aaa]">Deadline</div>
                      <div className={`text-xs font-medium ${days < 0 ? 'text-red-400' : days < 14 ? 'text-amber-400' : 'text-white'}`}>
                        {days < 0 ? `${Math.abs(days)}d überfällig` : `${days}d`}
                      </div>
                    </div>
                  )}
                  <div className="flex-shrink-0">
                    <input
                      type="number"
                      className="w-20 bg-[#0a0b10] border border-[#1e2030] rounded-lg px-2 py-1 text-xs text-white focus:outline-none focus:border-[#7c6af7]"
                      value={g.currentValue}
                      onChange={(e) => updateProgress(g.id, e.target.value)}
                    />
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      )}

      {showModal && (
        <Modal title={editId ? 'Ziel bearbeiten' : 'Neues Ziel'} onClose={() => setShowModal(false)}>
          <div className="space-y-4">
            {[
              { key: 'title', label: 'Ziel', placeholder: 'z.B. 10.000 € Monatsumsatz', type: 'text' },
              { key: 'deadline', label: 'Deadline', placeholder: '', type: 'date' },
              { key: 'targetValue', label: 'Zielwert', placeholder: '10000', type: 'number' },
              { key: 'currentValue', label: 'Aktueller Wert', placeholder: '0', type: 'number' },
              { key: 'unit', label: 'Einheit', placeholder: '€, kg, h …', type: 'text' },
              { key: 'nextAction', label: 'Nächste Aktion', placeholder: 'Konkreter nächster Schritt', type: 'text' },
            ].map(({ key, label, placeholder, type }) => (
              <div key={key}>
                <label className="text-xs text-[#9a9aaa] uppercase tracking-wide block mb-1.5">{label}</label>
                <input
                  type={type}
                  className="w-full bg-[#0a0b10] border border-[#1e2030] rounded-xl px-3 py-2.5 text-sm text-white placeholder-[#1e2030] focus:outline-none focus:border-[#7c6af7]"
                  placeholder={placeholder}
                  value={form[key]}
                  onChange={(e) => setForm((p) => ({ ...p, [key]: e.target.value }))}
                />
              </div>
            ))}
            <div>
              <label className="text-xs text-[#9a9aaa] uppercase tracking-wide block mb-1.5">Kategorie</label>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((cat) => (
                  <button key={cat} onClick={() => setForm((p) => ({ ...p, category: cat }))}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors ${form.category === cat ? 'bg-[#7c6af7]/20 border-[#7c6af7] text-[#7c6af7]' : 'bg-[#0a0b10] border-[#1e2030] text-[#9a9aaa] hover:border-[#9a9aaa]'}`}>
                    {cat}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs text-[#9a9aaa] uppercase tracking-wide block mb-1.5">Status</label>
              <div className="flex gap-2">
                {STATUSES.map((s) => (
                  <button key={s} onClick={() => setForm((p) => ({ ...p, status: s }))}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors ${form.status === s ? 'bg-[#7c6af7]/20 border-[#7c6af7] text-[#7c6af7]' : 'bg-[#0a0b10] border-[#1e2030] text-[#9a9aaa] hover:border-[#9a9aaa]'}`}>
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="secondary" onClick={() => setShowModal(false)}>Abbrechen</Button>
              <Button onClick={saveGoal}>Speichern</Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
