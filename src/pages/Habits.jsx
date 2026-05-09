import { useState } from 'react'
import { today } from '../utils/dateUtils'
import { calculateStreak, isCompletedToday, getCompletionRate } from '../utils/habitUtils'
import Card from '../components/Card'
import Button from '../components/Button'
import Modal from '../components/Modal'
import Badge from '../components/Badge'
import Toggle from '../components/Toggle'
import RingProgress from '../components/RingProgress'

const CATEGORIES = ['fitness', 'learning', 'business', 'health', 'other']
const emptyForm = { name: '', category: 'other' }
const DAYS = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So']

export default function Habits({ habits, setHabits }) {
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState(emptyForm)
  const [editId, setEditId] = useState(null)
  const todayStr = today()

  const last7 = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (6 - i)); return d.toISOString().split('T')[0]
  })
  const weeklyDone = last7.map((date) => habits.filter((h) => h.completions.includes(date)).length)
  const weekMax = habits.length || 1
  const todayIdx = new Date().getDay() === 0 ? 6 : new Date().getDay() - 1

  const saveHabit = () => {
    if (!form.name.trim()) return
    if (editId) {
      setHabits((prev) => prev.map((h) => h.id === editId ? { ...h, ...form } : h))
    } else {
      setHabits((prev) => [...prev, { id: crypto.randomUUID(), ...form, createdAt: todayStr, completions: [] }])
    }
    setShowModal(false); setForm(emptyForm); setEditId(null)
  }

  const toggleToday = (id) => {
    setHabits((prev) => prev.map((h) => {
      if (h.id !== id) return h
      const completions = isCompletedToday(h.completions)
        ? h.completions.filter((d) => d !== todayStr)
        : [...h.completions, todayStr]
      return { ...h, completions }
    }))
  }

  const deleteHabit = (id) => setHabits((prev) => prev.filter((h) => h.id !== id))
  const openEdit = (h) => { setForm({ name: h.name, category: h.category }); setEditId(h.id); setShowModal(true) }

  const completedCount = habits.filter((h) => isCompletedToday(h.completions)).length

  return (
    <div className="p-4 md:p-6 space-y-4 max-w-lg mx-auto md:max-w-none">
      <div className="flex items-start justify-between pt-2">
        <div>
          <p className="text-xs text-[#4a4a6a] uppercase tracking-widest mb-1">Productivity Core</p>
          <h1 className="text-2xl font-bold text-white">Habit Hub</h1>
          <p className="text-xs text-[#4a4a6a] mt-1">Tägliche Gewohnheiten • Max. 7</p>
        </div>
        {habits.length < 7 && (
          <Button size="sm" onClick={() => { setForm(emptyForm); setEditId(null); setShowModal(true) }}>+ Habit</Button>
        )}
      </div>

      {/* Stats + Ring */}
      <Card glow>
        <div className="flex items-center gap-4">
          <RingProgress value={completedCount} max={habits.length || 1} size={80} strokeWidth={7} color="#7c6af7">
            <span className="text-sm font-bold text-white">{completedCount}/{habits.length}</span>
          </RingProgress>
          <div className="flex-1">
            <div className="text-xs text-[#4a4a6a] mb-2">Letzte 7 Tage</div>
            <div className="flex items-end gap-1 h-8">
              {weeklyDone.map((count, i) => (
                <div key={i} className="flex flex-col items-center gap-0.5 flex-1">
                  <div
                    className={`w-full rounded-sm transition-all ${i === todayIdx ? 'bg-[#7c6af7]' : count > 0 ? 'bg-[#7c6af7]/40' : 'bg-[#1e1e2e]'}`}
                    style={{ height: `${Math.max(3, (count / weekMax) * 28)}px` }}
                  />
                  <span className="text-[9px] text-[#4a4a6a]">{DAYS[i]}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Card>

      {/* Habit List */}
      <div>
        <div className="text-xs text-[#4a4a6a] uppercase tracking-widest mb-3">
          Daily Habits · {completedCount} von {habits.length} erledigt
        </div>
        <div className="space-y-2">
          {habits.map((h) => {
            const done = isCompletedToday(h.completions)
            const streak = calculateStreak(h.completions)
            const rate = getCompletionRate(h.completions, h.createdAt)
            return (
              <Card key={h.id} className={done ? 'opacity-70' : ''}>
                <div className="flex items-center gap-3">
                  <Toggle checked={done} onChange={() => toggleToday(h.id)} />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-medium ${done ? 'text-[#4a4a6a] line-through' : 'text-white'}`}>{h.name}</span>
                      <Badge label={h.category} />
                    </div>
                    <div className="flex gap-3 mt-0.5">
                      {streak > 0
                        ? <span className="text-xs text-amber-400">🔥 {streak}d</span>
                        : <span className="text-xs text-[#4a4a6a]">kein Streak</span>
                      }
                      <span className="text-xs text-[#4a4a6a]">{rate}%</span>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => openEdit(h)} className="text-[#4a4a6a] hover:text-white text-xs px-1.5 py-1 transition-colors">✎</button>
                    <button onClick={() => deleteHabit(h.id)} className="text-[#4a4a6a] hover:text-red-400 text-xs px-1.5 py-1 transition-colors">✕</button>
                  </div>
                </div>
              </Card>
            )
          })}
        </div>
      </div>

      {habits.length === 0 && (
        <Card className="text-center py-10">
          <p className="text-[#4a4a6a] text-sm">Keine Habits. Max. 7 — wenige, aber konsequent.</p>
        </Card>
      )}
      {habits.length >= 7 && (
        <p className="text-xs text-amber-400 text-center">Maximum erreicht — mehr ist Performance-Theater.</p>
      )}

      {showModal && (
        <Modal title={editId ? 'Habit bearbeiten' : 'Neuer Habit'} onClose={() => setShowModal(false)}>
          <div className="space-y-4">
            <div>
              <label className="text-xs text-[#9a9aaa] uppercase tracking-wide block mb-1.5">Name</label>
              <input
                className="w-full bg-[#080810] border border-[#2a2a3e] rounded-xl px-3 py-2.5 text-sm text-white placeholder-[#2a2a3e] focus:outline-none focus:border-[#7c6af7]"
                placeholder="z.B. Lernen 90 min" value={form.name}
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                autoFocus onKeyDown={(e) => e.key === 'Enter' && saveHabit()} />
            </div>
            <div>
              <label className="text-xs text-[#9a9aaa] uppercase tracking-wide block mb-1.5">Kategorie</label>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((cat) => (
                  <button key={cat} onClick={() => setForm((p) => ({ ...p, category: cat }))}
                    className={`px-3 py-1.5 rounded-xl text-xs font-medium border transition-colors ${form.category === cat ? 'bg-[#7c6af7]/20 border-[#7c6af7] text-[#7c6af7]' : 'bg-[#080810] border-[#2a2a3e] text-[#9a9aaa] hover:border-[#9a9aaa]'}`}>
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
