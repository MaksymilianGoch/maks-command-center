import { useState } from 'react'
import { today } from '../utils/dateUtils'
import { calculateStreak, isCompletedToday, getCompletionRate } from '../utils/habitUtils'
import Button from '../components/Button'
import Modal from '../components/Modal'
import Toggle from '../components/Toggle'
import QuoteBanner from '../components/QuoteBanner'
import { QUOTES } from '../data/quotes'

const CATEGORIES = ['fitness', 'learning', 'business', 'health', 'other']
const DAYS = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN']
const emptyForm = { name: '', category: 'other' }

const CAT_ICONS = {
  fitness: { icon: 'fitness_center', bg: 'bg-primary/10', color: 'text-primary' },
  learning: { icon: 'book_2', bg: 'bg-tertiary/10', color: 'text-tertiary' },
  business: { icon: 'business_center', bg: 'bg-primary/10', color: 'text-primary' },
  health: { icon: 'water_drop', bg: 'bg-blue-400/10', color: 'text-blue-400' },
  other: { icon: 'self_improvement', bg: 'bg-purple-400/10', color: 'text-purple-400' },
}

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
  const weeklyPct = habits.length > 0 ? Math.round((weeklyDone.reduce((a, b) => a + b, 0) / (weekMax * 7)) * 100) : 0

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
    <div className="space-y-6">
      {/* Header */}
      <div className="mb-2">
        <h1 className="text-3xl font-bold text-on-surface">Productivity Core</h1>
        <p className="text-on-surface-variant mt-1">Synthesizing daily performance and directive alignment.</p>
      </div>

      <QuoteBanner quote={QUOTES.habits} />

      {/* Efficiency Chart */}
      <div className="glass-card rounded-2xl p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-xl font-semibold text-on-surface">Operational Efficiency</h2>
            <p className="text-sm text-on-surface-variant">Weekly analytical breakdown</p>
          </div>
          <div className="bg-surface-container px-3 py-1 rounded-full text-xs text-primary flex items-center gap-1">
            <span className="material-symbols-outlined text-sm">trending_up</span>
            {weeklyPct}%
          </div>
        </div>
        <div className="h-32 flex items-end gap-2 px-2">
          {weeklyDone.map((count, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <div
                className={`w-full rounded-t-md transition-all ${i === todayIdx ? 'bg-primary shadow-[0_0_12px_rgba(170,199,255,0.4)]' : 'bg-primary/20 hover:bg-primary/40'}`}
                style={{ height: `${Math.max(4, (count / weekMax) * 100)}%` }}
              />
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-2">
          {DAYS.map((d, i) => (
            <span key={i} className={`flex-1 text-center text-[10px] font-medium ${i === todayIdx ? 'text-primary' : 'text-on-surface-variant opacity-50'}`}>{d}</span>
          ))}
        </div>
      </div>

      {/* Critical Directives — ONE Thing */}
      <div className="bg-primary/10 border border-primary/20 rounded-2xl p-6">
        <div className="flex items-center gap-2 text-primary mb-4">
          <span className="material-symbols-outlined">priority_high</span>
          <h2 className="text-xs font-bold uppercase tracking-widest">Critical Directives</h2>
        </div>
        <div className="space-y-3 mb-5">
          <div className="flex items-start gap-3">
            <span className="material-symbols-outlined text-primary mt-0.5">check_circle</span>
            <p className="text-sm text-on-surface">Alle 7 Habits täglich abarbeiten.</p>
          </div>
          <div className="flex items-start gap-3 opacity-60">
            <span className="material-symbols-outlined text-on-surface-variant mt-0.5">radio_button_unchecked</span>
            <p className="text-sm text-on-surface">{completedCount}/{habits.length} heute abgehakt.</p>
          </div>
        </div>
        {habits.length < 7 && (
          <button onClick={() => { setForm(emptyForm); setEditId(null); setShowModal(true) }}
            className="w-full bg-primary text-on-primary py-3 rounded-full text-sm font-bold hover:opacity-90 transition-all flex items-center justify-center gap-2 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]">
            Neuer Habit
            <span className="material-symbols-outlined text-sm">add</span>
          </button>
        )}
      </div>

      {/* Daily Habits List */}
      <div className="glass-card rounded-2xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-on-surface">Daily Habits</h2>
          <span className="text-sm text-primary">{habits.length - completedCount} von {habits.length} verbleibend</span>
        </div>
        <div className="space-y-3">
          {habits.map((h) => {
            const done = isCompletedToday(h.completions)
            const streak = calculateStreak(h.completions)
            const cat = CAT_ICONS[h.category] || CAT_ICONS.other
            return (
              <div key={h.id}
                className="bg-surface-container-low p-4 rounded-2xl border border-white/5 flex items-center justify-between hover:border-primary/20 transition-all group">
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full ${cat.bg} flex items-center justify-center ${cat.color}`}>
                    <span className="material-symbols-outlined text-lg">{cat.icon}</span>
                  </div>
                  <div>
                    <h3 className={`text-sm font-medium ${done ? 'text-on-surface-variant line-through' : 'text-on-surface'}`}>{h.name}</h3>
                    <p className="text-xs text-on-surface-variant">
                      {streak > 0 ? `🔥 ${streak}d Streak` : 'Kein Streak'} · {getCompletionRate(h.completions, h.createdAt)}%
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="hidden group-hover:flex gap-1">
                    <button onClick={() => openEdit(h)} className="text-on-surface-variant hover:text-on-surface text-xs p-1">✎</button>
                    <button onClick={() => deleteHabit(h.id)} className="text-on-surface-variant hover:text-red-400 text-xs p-1">✕</button>
                  </div>
                  <Toggle checked={done} onChange={() => toggleToday(h.id)} />
                </div>
              </div>
            )
          })}
          {habits.length === 0 && (
            <p className="text-on-surface-variant text-sm text-center py-6">Noch keine Habits. Max. 7 — wenige, aber konsequent.</p>
          )}
        </div>
      </div>

      {habits.length >= 7 && (
        <p className="text-xs text-tertiary text-center">Maximum 7 Habits — mehr ist Performance-Theater.</p>
      )}

      {showModal && (
        <Modal title={editId ? 'Habit bearbeiten' : 'Neuer Habit'} onClose={() => setShowModal(false)}>
          <div className="space-y-4">
            <div>
              <label className="text-xs text-on-surface-variant uppercase tracking-wide block mb-1.5">Name</label>
              <input className="w-full bg-surface-container-low border border-white/10 rounded-2xl px-4 py-3 text-sm text-on-surface placeholder-outline focus:outline-none focus:border-primary/50"
                placeholder="z.B. Lernen 90 min" value={form.name}
                onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))}
                autoFocus onKeyDown={(e) => e.key === 'Enter' && saveHabit()} />
            </div>
            <div>
              <label className="text-xs text-on-surface-variant uppercase tracking-wide block mb-1.5">Kategorie</label>
              <div className="flex flex-wrap gap-2">
                {CATEGORIES.map((cat) => (
                  <button key={cat} onClick={() => setForm((p) => ({ ...p, category: cat }))}
                    className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${form.category === cat ? 'bg-primary text-on-primary' : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'}`}>
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
