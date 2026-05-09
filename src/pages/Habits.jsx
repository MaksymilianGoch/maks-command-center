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
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-50">Habits</h1>
          <p className="text-sm text-zinc-400 mt-1">
            {completedCount}/{habits.length} heute abgehakt
          </p>
        </div>
        <Button
          onClick={() => {
            setForm(emptyForm)
            setEditId(null)
            setShowModal(true)
          }}
        >
          + Habit hinzufügen
        </Button>
      </div>

      {habits.length === 0 ? (
        <Card className="text-center py-12">
          <div className="text-zinc-600 text-4xl mb-3">◎</div>
          <p className="text-zinc-400">
            Noch keine Habits. Starte mit einer einfachen täglichen Gewohnheit.
          </p>
        </Card>
      ) : (
        <div className="space-y-3">
          {habits.map((h) => {
            const streak = calculateStreak(h.completions)
            const rate = getCompletionRate(h.completions, h.createdAt)
            const done = isCompletedToday(h.completions)
            return (
              <Card key={h.id} className={done ? 'opacity-70' : ''}>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => toggleToday(h.id)}
                    className={`w-6 h-6 rounded-full border-2 flex-shrink-0 transition-all ${
                      done
                        ? 'bg-green-500 border-green-500'
                        : 'border-zinc-600 hover:border-green-500'
                    }`}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={`text-sm font-medium ${
                          done ? 'text-zinc-500 line-through' : 'text-zinc-100'
                        }`}
                      >
                        {h.name}
                      </span>
                      <Badge label={h.category} />
                    </div>
                    <div className="flex items-center gap-4 mt-1">
                      <span className="text-xs text-zinc-500">
                        {streak > 0 ? (
                          <span className="text-amber-400">🔥 {streak} Tage Streak</span>
                        ) : (
                          'Kein aktiver Streak'
                        )}
                      </span>
                      <span className="text-xs text-zinc-500">Erfolgsrate: {rate}%</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <Button variant="ghost" size="sm" onClick={() => openEdit(h)}>
                      ✎
                    </Button>
                    <Button variant="danger" size="sm" onClick={() => deleteHabit(h.id)}>
                      ✕
                    </Button>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      )}

      {showModal && (
        <Modal
          title={editId ? 'Habit bearbeiten' : 'Neuer Habit'}
          onClose={() => setShowModal(false)}
        >
          <div className="space-y-4">
            <div>
              <label className="text-xs text-zinc-400 uppercase tracking-wide block mb-1.5">
                Name
              </label>
              <input
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-indigo-500"
                placeholder="z.B. Täglich 30 Min. lesen"
                value={form.name}
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                autoFocus
                onKeyDown={(e) => e.key === 'Enter' && saveHabit()}
              />
            </div>
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
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="secondary" onClick={() => setShowModal(false)}>
                Abbrechen
              </Button>
              <Button onClick={saveHabit}>Speichern</Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
