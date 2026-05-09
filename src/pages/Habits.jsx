import { useState } from 'react'
import { today } from '../utils/dateUtils'
import { calculateStreak, isCompletedToday, getCompletionRate } from '../utils/habitUtils'
import Card from '../components/Card'
import Button from '../components/Button'
import Modal from '../components/Modal'
import Badge from '../components/Badge'

const CATEGORIES = ['fitness', 'learning', 'business', 'health', 'other']
const emptyForm = { name: '', category: 'fitness' }

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
      setHabits((prev) => [
        ...prev,
        { id: crypto.randomUUID(), ...form, createdAt: todayStr, completions: [] },
      ])
    }
    setShowModal(false)
    setForm(emptyForm)
    setEditId(null)
  }

  const deleteHabit = (id) => setHabits((prev) => prev.filter((h) => h.id !== id))

  const toggleToday = (id) => {
    setHabits((prev) =>
      prev.map((h) => {
        if (h.id !== id) return h
        const completions = isCompletedToday(h.completions)
          ? h.completions.filter((d) => d !== todayStr)
          : [...h.completions, todayStr]
        return { ...h, completions }
      })
    )
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
          <p className="text-sm text-[#b0b7c2] mt-1">{completedCount}/{habits.length} heute abgehakt</p>
        </div>
        <Button onClick={() => { setForm(emptyForm); setEditId(null); setShowModal(true) }}>
          + Habit
        </Button>
      </div>

      {habits.length === 0 ? (
        <Card className="text-center py-12">
          <div className="text-[#323640] text-4xl mb-3">○</div>
          <p className="text-[#b0b7c2]">Noch keine Habits. Starte mit einer einfachen täglichen Gewohnheit.</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {habits.map((h) => {
            const streak = calculateStreak(h.completions)
            const rate = getCompletionRate(h.completions, h.createdAt)
            const done = isCompletedToday(h.completions)
            return (
              <Card key={h.id} className={done ? 'opacity-60' : ''}>
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => toggleToday(h.id)}
                    className={`w-6 h-6 rounded-full border-2 flex-shrink-0 transition-all ${
                      done ? 'bg-emerald-500 border-emerald-500' : 'border-[#323640] hover:border-emerald-500'
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`text-sm font-medium ${done ? 'text-[#b0b7c2] line-through' : 'text-white'}`}>
                        {h.name}
                      </span>
                      <Badge label={h.category} />
                    </div>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-xs">
                        {streak > 0 ? (
                          <span className="text-amber-400">🔥 {streak} Tage</span>
                        ) : (
                          <span className="text-[#b0b7c2]">Kein Streak</span>
                        )}
                      </span>
                      <span className="text-xs text-[#b0b7c2]">{rate}% Erfolg</span>
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
              <label className="text-xs text-[#b0b7c2] uppercase tracking-wide block mb-1.5">Name</label>
              <input
                className="w-full bg-[#191a1f] border border-[#323640] rounded-xl px-3 py-2.5 text-sm text-white placeholder-[#323640] focus:outline-none focus:border-[#4f86f7]"
                placeholder="z.B. Täglich 30 Min. lesen"
                value={form.name}
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                autoFocus
                onKeyDown={(e) => e.key === 'Enter' && saveHabit()}
              />
            </div>
            <div>
              <label className="text-xs text-[#b0b7c2] uppercase tracking-wide block mb-1.5">Kategorie</label>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setForm((p) => ({ ...p, category: cat }))}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors ${
                      form.category === cat
                        ? 'bg-[#4f86f7]/20 border-[#4f86f7] text-[#4f86f7]'
                        : 'bg-[#191a1f] border-[#323640] text-[#b0b7c2] hover:border-[#b0b7c2]'
                    }`}
                  >
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
