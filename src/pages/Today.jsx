import { useState } from 'react'
import { today } from '../utils/dateUtils'
import Toggle from '../components/Toggle'
import Button from '../components/Button'
import Card from '../components/Card'
import QuoteBanner from '../components/QuoteBanner'
import { QUOTES } from '../data/quotes'

export default function Today({ tasks, setTasks }) {
  const todayStr = today()
  const [newText, setNewText] = useState('')
  const [newIsTop, setNewIsTop] = useState(false)

  const todayTasks = tasks.filter((t) => t.date === todayStr).sort((a, b) => (b.isTop ? 1 : 0) - (a.isTop ? 1 : 0))
  const topTask = todayTasks.find((t) => t.isTop)
  const otherTasks = todayTasks.filter((t) => !t.isTop)
  const doneCount = todayTasks.filter((t) => t.done).length

  const addTask = () => {
    if (!newText.trim() || todayTasks.length >= 5) return
    const isTop = newIsTop || !topTask
    if (isTop && topTask) setTasks((prev) => prev.map((t) => t.id === topTask.id ? { ...t, isTop: false } : t))
    setTasks((prev) => [...prev, { id: crypto.randomUUID(), text: newText.trim(), isTop, done: false, date: todayStr, createdAt: todayStr }])
    setNewText(''); setNewIsTop(false)
  }

  const toggleDone = (id) => setTasks((prev) => prev.map((t) => t.id === id ? { ...t, done: !t.done } : t))
  const deleteTask = (id) => setTasks((prev) => prev.filter((t) => t.id !== id))
  const setAsTop = (id) => setTasks((prev) => prev.map((t) => ({ ...t, isTop: t.id === id })))

  return (
    <div className="space-y-6">
      <section>
        <p className="text-xs font-medium text-primary uppercase tracking-[0.2em] mb-1">Today's Focus</p>
        <h1 className="text-3xl font-bold text-on-surface">
          {topTask ? 'Fokus gesetzt.' : 'Was ist dein ONE Thing?'}
        </h1>
        {todayTasks.length > 0 && (
          <p className="text-on-surface-variant mt-1">{doneCount}/{todayTasks.length} erledigt</p>
        )}
      </section>

      <QuoteBanner quote={QUOTES.today} />

      {/* ONE Thing */}
      <div>
        <p className="text-xs text-primary uppercase tracking-widest font-medium mb-3">ONE Thing</p>
        {topTask ? (
          <div className="glass-card rounded-2xl p-6 border-primary/20">
            <div className="flex items-start gap-4">
              <Toggle checked={topTask.done} onChange={() => toggleDone(topTask.id)} />
              <div className="flex-1">
                <p className={`text-lg font-semibold ${topTask.done ? 'line-through text-on-surface-variant' : 'text-on-surface'}`}>
                  {topTask.text}
                </p>
                <p className="text-xs text-primary mt-1">Höchste Priorität heute</p>
              </div>
              <button onClick={() => deleteTask(topTask.id)} className="text-on-surface-variant hover:text-red-400 transition-colors">
                <span className="material-symbols-outlined text-lg">close</span>
              </button>
            </div>
          </div>
        ) : (
          <div className="glass-card rounded-2xl p-6 border-dashed border-white/10 text-center">
            <p className="text-on-surface-variant">Noch kein ONE Thing gesetzt.</p>
          </div>
        )}
      </div>

      {/* Weitere Tasks */}
      {otherTasks.length > 0 && (
        <div>
          <p className="text-xs text-on-surface-variant uppercase tracking-widest font-medium mb-3">
            Weitere Aufgaben ({otherTasks.length}/4)
          </p>
          <div className="space-y-3">
            {otherTasks.map((t) => (
              <div key={t.id} className="glass-card rounded-2xl p-4 flex items-center justify-between hover:bg-surface-container-high transition-all group cursor-pointer" style={{ padding: '1rem 1.5rem' }}>
                <div className="flex items-center gap-4">
                  <Toggle checked={t.done} onChange={() => toggleDone(t.id)} size="sm" />
                  <span className={`text-sm ${t.done ? 'line-through text-on-surface-variant' : 'text-on-surface'}`}>{t.text}</span>
                </div>
                <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  {!t.done && (
                    <button onClick={() => setAsTop(t.id)} className="text-on-surface-variant hover:text-primary p-1 text-xs" title="Als ONE Thing">★</button>
                  )}
                  <button onClick={() => deleteTask(t.id)} className="text-on-surface-variant hover:text-red-400 p-1">
                    <span className="material-symbols-outlined text-lg">close</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Task */}
      {todayTasks.length < 5 && (
        <Card variant="glass" className="!p-5">
          <p className="text-xs text-on-surface-variant uppercase tracking-widest mb-3">Aufgabe hinzufügen</p>
          <input
            className="w-full bg-surface-container-low border border-white/10 rounded-2xl px-4 py-3 text-sm text-on-surface placeholder-outline focus:outline-none focus:border-primary/50 mb-4"
            placeholder="Was muss heute erledigt werden?"
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addTask()}
          />
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <Toggle checked={newIsTop || !topTask} onChange={() => setNewIsTop(!newIsTop)} size="sm" />
              <span className="text-xs text-on-surface-variant">Als ONE Thing</span>
            </label>
            <Button onClick={addTask} size="sm">Hinzufügen</Button>
          </div>
        </Card>
      )}
      {todayTasks.length >= 5 && (
        <p className="text-xs text-tertiary text-center">Maximum 5 Aufgaben — Fokus halten.</p>
      )}
    </div>
  )
}
