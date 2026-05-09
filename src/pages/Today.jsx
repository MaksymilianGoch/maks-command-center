import { useState } from 'react'
import { today } from '../utils/dateUtils'
import Card from '../components/Card'
import Button from '../components/Button'
import Toggle from '../components/Toggle'

export default function Today({ tasks, setTasks }) {
  const todayStr = today()
  const [newText, setNewText] = useState('')
  const [newIsTop, setNewIsTop] = useState(false)

  const todayTasks = tasks
    .filter((t) => t.date === todayStr)
    .sort((a, b) => (b.isTop ? 1 : 0) - (a.isTop ? 1 : 0))

  const topTask = todayTasks.find((t) => t.isTop)
  const otherTasks = todayTasks.filter((t) => !t.isTop)
  const doneCount = todayTasks.filter((t) => t.done).length

  const addTask = () => {
    if (!newText.trim()) return
    if (todayTasks.length >= 5) return
    const isTop = newIsTop || !topTask
    if (isTop && topTask) {
      setTasks((prev) => prev.map((t) => (t.id === topTask.id ? { ...t, isTop: false } : t)))
    }
    setTasks((prev) => [...prev, { id: crypto.randomUUID(), text: newText.trim(), isTop, done: false, date: todayStr, createdAt: todayStr }])
    setNewText('')
    setNewIsTop(false)
  }

  const toggleDone = (id) => setTasks((prev) => prev.map((t) => t.id === id ? { ...t, done: !t.done } : t))
  const deleteTask = (id) => setTasks((prev) => prev.filter((t) => t.id !== id))
  const setAsTop = (id) => setTasks((prev) => prev.map((t) => ({ ...t, isTop: t.id === id })))

  return (
    <div className="p-4 md:p-6 space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-white">Today</h1>
        <p className="text-sm text-[#9a9aaa] mt-1">
          {new Date().toLocaleDateString('de-DE', { weekday: 'long', day: 'numeric', month: 'long' })}
          {todayTasks.length > 0 && ` · ${doneCount}/${todayTasks.length} erledigt`}
        </p>
      </div>

      {/* ONE Thing */}
      <div>
        <div className="text-xs text-[#7c6af7] uppercase tracking-widest font-semibold mb-2">ONE Thing</div>
        {topTask ? (
          <Card className="border-[#7c6af7]/30 bg-[#7c6af7]/5">
            <div className="flex items-start gap-3">
              <Toggle checked={topTask.done} onChange={() => toggleDone(topTask.id)} />
              <div className="flex-1">
                <p className={`text-base font-semibold ${topTask.done ? 'line-through text-[#9a9aaa]' : 'text-white'}`}>
                  {topTask.text}
                </p>
                <p className="text-xs text-[#7c6af7] mt-1">Top-Priorität heute</p>
              </div>
              <button onClick={() => deleteTask(topTask.id)} className="text-[#9a9aaa] hover:text-red-400 text-xs transition-colors">✕</button>
            </div>
          </Card>
        ) : (
          <Card className="border-dashed">
            <p className="text-sm text-[#9a9aaa] text-center py-2">Noch kein ONE Thing gesetzt</p>
          </Card>
        )}
      </div>

      {/* Weitere Tasks */}
      {otherTasks.length > 0 && (
        <div>
          <div className="text-xs text-[#9a9aaa] uppercase tracking-widest font-semibold mb-2">Weitere ({otherTasks.length}/4)</div>
          <div className="space-y-2">
            {otherTasks.map((t) => (
              <Card key={t.id}>
                <div className="flex items-center gap-3">
                  <Toggle checked={t.done} onChange={() => toggleDone(t.id)} size="sm" />
                  <span className={`text-sm flex-1 ${t.done ? 'line-through text-[#9a9aaa]' : 'text-white'}`}>{t.text}</span>
                  <div className="flex gap-1 flex-shrink-0">
                    {!t.done && (
                      <button onClick={() => setAsTop(t.id)} className="text-xs text-[#9a9aaa] hover:text-[#7c6af7] px-1.5 py-0.5 transition-colors" title="Als ONE Thing setzen">★</button>
                    )}
                    <button onClick={() => deleteTask(t.id)} className="text-xs text-[#9a9aaa] hover:text-red-400 transition-colors">✕</button>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Add Task */}
      {todayTasks.length < 5 && (
        <Card>
          <div className="text-xs text-[#9a9aaa] uppercase tracking-widest mb-3">+ Aufgabe hinzufügen</div>
          <input
            className="w-full bg-[#080810] border border-[#1e1e2e] rounded-xl px-3 py-2.5 text-sm text-white placeholder-[#2a2a3e] focus:outline-none focus:border-[#7c6af7] mb-3"
            placeholder="Was muss heute erledigt werden?"
            value={newText}
            onChange={(e) => setNewText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && addTask()}
          />
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <Toggle checked={newIsTop || !topTask} onChange={() => setNewIsTop(!newIsTop)} size="sm" />
              <span className="text-xs text-[#9a9aaa]">Als ONE Thing setzen</span>
            </label>
            <Button onClick={addTask} size="sm">Hinzufügen</Button>
          </div>
        </Card>
      )}

      {todayTasks.length >= 5 && (
        <p className="text-xs text-amber-400 text-center">Maximum 5 Aufgaben pro Tag — Fokus halten.</p>
      )}
    </div>
  )
}
