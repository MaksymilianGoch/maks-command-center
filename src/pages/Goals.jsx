import { useState } from 'react'
import { today, formatDate, daysUntil } from '../utils/dateUtils'
import Card from '../components/Card'
import Button from '../components/Button'
import Modal from '../components/Modal'
import Badge from '../components/Badge'
import ProgressBar from '../components/ProgressBar'

const CATEGORIES = ['business', 'fitness', 'learning', 'health', 'other']
const STATUSES = ['active', 'paused', 'done']

const emptyForm = {
  title: '',
  category: 'business',
  deadline: '',
  targetValue: '',
  currentValue: '',
  unit: '',
  nextAction: '',
  status: 'active',
}

export default function Goals({ goals, setGoals }) {
  const [showModal, setShowModal] = useState(false)
  const [editId, setEditId] = useState(null)
  const [form, setForm] = useState(emptyForm)
  const [filter, setFilter] = useState('active')

  const saveGoal = () => {
    if (!form.title.trim()) return
    const g = {
      ...form,
      targetValue: parseFloat(form.targetValue) || 0,
      currentValue: parseFloat(form.currentValue) || 0,
    }
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
    setForm({
      title: g.title,
      category: g.category,
      deadline: g.deadline,
      targetValue: g.targetValue,
      currentValue: g.currentValue,
      unit: g.unit,
      nextAction: g.nextAction,
      status: g.status,
    })
    setEditId(g.id)
    setShowModal(true)
  }

  const updateProgress = (id, newValue) => {
    setGoals((prev) =>
      prev.map((g) => (g.id === id ? { ...g, currentValue: parseFloat(newValue) || 0 } : g))
    )
  }

  const filtered = goals.filter((g) => (filter === 'all' ? true : g.status === filter))

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-50">Goals</h1>
          <p className="text-sm text-zinc-400 mt-1">
            {goals.filter((g) => g.status === 'active').length} aktive Ziele
          </p>
        </div>
        <Button
          onClick={() => {
            setForm(emptyForm)
            setEditId(null)
            setShowModal(true)
          }}
        >
          + Ziel hinzufügen
        </Button>
      </div>

      <div className="flex gap-2">
        {['active', 'paused', 'done', 'all'].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`px-3 py-1.5 text-xs rounded-lg border transition-colors ${
              filter === s
                ? 'bg-indigo-600/20 border-indigo-600/50 text-indigo-300'
                : 'border-zinc-800 text-zinc-400 hover:border-zinc-700'
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <Card className="text-center py-12">
          <div className="text-zinc-600 text-4xl mb-3">◈</div>
          <p className="text-zinc-400">Keine Ziele in dieser Kategorie.</p>
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
                    <h3 className="text-sm font-semibold text-zinc-100">{g.title}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge label={g.category} />
                      <Badge label={g.status} />
                    </div>
                  </div>
                  <div className="flex gap-2 flex-shrink-0 ml-4">
                    <Button variant="ghost" size="sm" onClick={() => openEdit(g)}>
                      ✎
                    </Button>
                    <Button variant="danger" size="sm" onClick={() => deleteGoal(g.id)}>
                      ✕
                    </Button>
                  </div>
                </div>

                <div className="mb-3">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs text-zinc-400">Fortschritt</span>
                    <span className="text-xs text-zinc-300">
                      {g.currentValue} / {g.targetValue} {g.unit} ({pct}%)
                    </span>
                  </div>
                  <ProgressBar
                    value={g.currentValue}
                    max={g.targetValue}
                    colorClass={pct >= 100 ? 'bg-green-500' : 'bg-indigo-500'}
                  />
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-zinc-500 mb-0.5">Nächste Aktion</div>
                    <div className="text-xs text-zinc-300 truncate">{g.nextAction || '—'}</div>
                  </div>
                  {days !== null && (
                    <div className="text-right flex-shrink-0">
                      <div className="text-xs text-zinc-500">Deadline</div>
                      <div
                        className={`text-xs font-medium ${
                          days < 0
                            ? 'text-red-400'
                            : days < 14
                            ? 'text-amber-400'
                            : 'text-zinc-300'
                        }`}
                      >
                        {days < 0 ? `${Math.abs(days)}d überfällig` : `noch ${days}d`}
                      </div>
                    </div>
                  )}
                  <div className="flex-shrink-0">
                    <div className="text-xs text-zinc-500 mb-0.5">Wert aktualisieren</div>
                    <input
                      type="number"
                      className="w-24 bg-zinc-800 border border-zinc-700 rounded px-2 py-1 text-xs text-zinc-100 focus:outline-none focus:border-indigo-500"
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
        <Modal
          title={editId ? 'Ziel bearbeiten' : 'Neues Ziel'}
          onClose={() => setShowModal(false)}
        >
          <div className="space-y-4">
            {[
              { key: 'title', label: 'Ziel', placeholder: 'z.B. 10.000 € Monatsumsatz', type: 'text' },
              { key: 'deadline', label: 'Deadline', placeholder: '', type: 'date' },
              { key: 'targetValue', label: 'Zielwert', placeholder: '10000', type: 'number' },
              { key: 'currentValue', label: 'Aktueller Wert', placeholder: '0', type: 'number' },
              { key: 'unit', label: 'Einheit', placeholder: '€, kg, h, Seiten …', type: 'text' },
              {
                key: 'nextAction',
                label: 'Nächste Aktion',
                placeholder: 'Konkreter nächster Schritt',
                type: 'text',
              },
            ].map(({ key, label, placeholder, type }) => (
              <div key={key}>
                <label className="text-xs text-zinc-400 uppercase tracking-wide block mb-1.5">
                  {label}
                </label>
                <input
                  type={type}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-indigo-500"
                  placeholder={placeholder}
                  value={form[key]}
                  onChange={(e) => setForm((p) => ({ ...p, [key]: e.target.value }))}
                />
              </div>
            ))}
            <div>
              <label className="text-xs text-zinc-400 uppercase tracking-wide block mb-1.5">
                Kategorie
              </label>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setForm((p) => ({ ...p, category: cat }))}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                      form.category === cat
                        ? 'bg-indigo-600/30 border-indigo-500 text-indigo-300'
                        : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-zinc-500'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="text-xs text-zinc-400 uppercase tracking-wide block mb-1.5">
                Status
              </label>
              <div className="flex gap-2">
                {STATUSES.map((s) => (
                  <button
                    key={s}
                    onClick={() => setForm((p) => ({ ...p, status: s }))}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                      form.status === s
                        ? 'bg-indigo-600/30 border-indigo-500 text-indigo-300'
                        : 'bg-zinc-800 border-zinc-700 text-zinc-400 hover:border-zinc-500'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="secondary" onClick={() => setShowModal(false)}>
                Abbrechen
              </Button>
              <Button onClick={saveGoal}>Speichern</Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
