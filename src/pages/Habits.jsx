import { useState } from 'react'
import { today } from '../utils/dateUtils'
import { calculateStreak, isCompletedToday, getCompletionRate } from '../utils/habitUtils'
import Card from '../components/Card'
import Button from '../components/Button'
import Modal from '../components/Modal'
import Badge from '../components/Badge'

const CATEGORIES = ['fitness', 'learning', 'business', 'health', 'other']
const emptyForm = { name: '', category: 'fitness' }

function Toggle({ checked, onChange }) {
  return (
    <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
      <input type="checkbox" className="sr-only" checked={checked} onChange={onChange} />
      <div className={`w-11 h-6 rounded-full transition-colors ${checked ? 'bg-[#7c6af7]' : 'bg-[#1e2030]'}`}>
        <div className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${checked ? 'translate-x-5' : 'translate-x-0'}`} />
      </div>
    </label>
  )
}

export default function Habits({ habits, setHabits }) {
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [editId, setEditId] = useState(null)
  const todayStr = today()

  const saveHabit = () => {
    if (!form.name.trim()) return
    if (editId) {
      setHabits((prev) => prev.map((h) => (h.id === editId ? { ...h, ...form } : h)))
    } else {
      setHabits((prev) => [...prev, { id: crypto.randomUUID(), ...form, createdAt: todayStr, completions: [] }])
    }
    setShowModal(false)
    setForm(emptyForm)
    setEditId(null)
  }

  const deleteHabit = (id) => setHabits((prev) => prev.filter((h) => h.id !== id))

  const toggleToday = (id) => {
    setHabits((prev) => prev.map((h) => {
      if (h.id !== id) return h
      const completions = isCompletedToday(h.completions)
        ? h.completions.filter((d) => d !== todayStr)
        : [...h.completions, todayStr]
      return { ...h, completions }
    }))
  }

  const openEdit = (h) => {
    setForm({ name: h.name, category: h.category })
    setEditId(h.id)
    setShowModal(true)
  }

  const completedCount = habits.filter((h) => isCompletedToday(h.completions)).length

  return (
    <div className="p-4 md:p-6 space-y-4 md:space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Habits</h1>
          <p className="text-sm text-[#9a9aaa] mt-1">{completedCount}/{habits.length} heute erledigt</p>
        </div>
        <Button onClick={() => { setForm(emptyForm); setEditId(null); setShowModal(true) }}>+ Habit</Button>
      </div>

      {habits.length === 0 ? (
        <Card className="text-center py-12">
          <div className="text-[#1e2030] text-4xl mb-3">○</div>
          <p className="text-[#9a9aaa]">Noch keine Habits. Starte mit einer einfachen täglichen Gewohnheit.</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {habits.map((h) => {
            const streak = calculateStreak(h.completions)
            const rate = getCompletionRate(h.completions, h.createdAt)
            const done = isCompletedToday(h.completions)
            return (
              <Card key={h.id}>
                <div className="flex items-center gap-3">
                  <Toggle checked={done} onChange={() => toggleToday(h.id)} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-sm font-medium ${done ? 'text-[#9a9aaa] line-through' : 'text-white'}`}>
                        {h.name}
                      </span>
                      <Badge label={h.category} />
                    </div>
                    <div className="flex items-center gap-3 mt-1">
                      {streak > 0
                        ? <span className="text-xs text-amber-400">🔥 {streak} Tage</span>
                        : <span className="text-xs text-[#9a9aaa]">Kein Streak</span>
                      }
                      <span className="text-xs text-[#9a9aaa]">{rate}% Erfolg</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <Button variant="ghost" size="sm" onClick={() => openEdit(h)}>✎</Button>
                    <Button variant="danger" size="sm" onClick={() => deleteHabit(h.id)}>✕</Button>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      )}

      {showModal && (
        <Modal title={editId ? 'Habit bearbeiten' : 'Neuer Habit'} onClose={() => setShowModal(false)}>
          <div className="space-y-4">
            <div>
              <label className="text-xs text-[#9a9aaa] uppercase tracking-wide block mb-1.5">Name</label>
              <input
                className="w-full bg-[#0a0b10] border border-[#1e2030] rounded-xl px-3 py-2.5 text-sm text-white placeholder-[#1e2030] focus:outline-none focus:border-[#7c6af7]"
                placeholder="z.B. Täglich 30 Min. lesen"
                value={form.name}
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                autoFocus
                onKeyDown={(e) => e.key === 'Enter' && saveHabit()}
              />
            </div>
            <div>
              <label className="text-xs text-[#9a9aaa] uppercase tracking-wide block mb-1.5">Kategorie</label>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((cat) => (
                  <button key={cat} onClick={() => setForm((p) => ({ ...p, category: cat }))}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors ${
                      form.category === cat
                        ? 'bg-[#7c6af7]/20 border-[#7c6af7] text-[#7c6af7]'
                        : 'bg-[#0a0b10] border-[#1e2030] text-[#9a9aaa] hover:border-[#9a9aaa]'
                    }`}>
                    {cat}
                  </button>
                ))}
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="secondary" onClick={() => setShowModal(false)}>Abbrechen</Button>
              <Button onClick={saveHabit}>Speichern</Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
