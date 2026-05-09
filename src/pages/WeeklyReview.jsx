import { useState } from 'react'
import { getLast7Days, getWeekStart, formatDate } from '../utils/dateUtils'
import Card from '../components/Card'
import Button from '../components/Button'
import ProgressBar from '../components/ProgressBar'

export default function WeeklyReview({ habits, dailyLogs, weeklyReviews, setWeeklyReviews }) {
  const weekStart = getWeekStart()
  const last7 = getLast7Days()
  const existing = weeklyReviews.find((r) => r.weekStart === weekStart)
  const [notes, setNotes] = useState(existing?.notes || '')
  const [nextWeekPlan, setNextWeekPlan] = useState(existing?.nextWeekPlan || '')
  const [saved, setSaved] = useState(!!existing)

  const save = () => {
    if (existing) {
      setWeeklyReviews((prev) => prev.map((r) => (r.weekStart === weekStart ? { ...r, notes, nextWeekPlan } : r)))
    } else {
      setWeeklyReviews((prev) => [...prev, { id: crypto.randomUUID(), weekStart, notes, nextWeekPlan }])
    }
    setSaved(true)
  }

  const habitStats = habits
    .map((h) => {
      const done = h.completions.filter((d) => last7.includes(d)).length
      return { ...h, done, rate: Math.round((done / 7) * 100) }
    })
    .sort((a, b) => b.rate - a.rate)

  const weekLogs = dailyLogs.filter((l) => last7.includes(l.date))
  const avg = (key) =>
    weekLogs.length
      ? Math.round((weekLogs.reduce((s, l) => s + l[key], 0) / weekLogs.length) * 10) / 10
      : null

  const avgEnergy = avg('energyLevel')
  const avgDiscipline = avg('disciplineLevel')
  const totalDone = habits.reduce((s, h) => s + h.completions.filter((d) => last7.includes(d)).length, 0)

  const levelColor = (v) =>
    v === null ? 'text-[#323640]' : v >= 7 ? 'text-emerald-400' : v >= 5 ? 'text-amber-400' : 'text-red-400'

  return (
    <div className="p-4 md:p-6 space-y-4 md:space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">Weekly Review</h1>
        <p className="text-sm text-[#b0b7c2] mt-1">Woche ab {formatDate(weekStart)}</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card>
          <div className={`text-2xl font-bold ${levelColor(avgEnergy)}`}>{avgEnergy ?? '—'}</div>
          <div className="text-xs text-[#b0b7c2] mt-1">Ø Energie</div>
        </Card>
        <Card>
          <div className={`text-2xl font-bold ${levelColor(avgDiscipline)}`}>{avgDiscipline ?? '—'}</div>
          <div className="text-xs text-[#b0b7c2] mt-1">Ø Disziplin</div>
        </Card>
        <Card>
          <div className="text-2xl font-bold text-[#4f86f7]">{totalDone}/{habits.length * 7}</div>
          <div className="text-xs text-[#b0b7c2] mt-1">Completions</div>
        </Card>
        <Card>
          <div className="text-2xl font-bold text-white">{weekLogs.length}/7</div>
          <div className="text-xs text-[#b0b7c2] mt-1">Tage mit Log</div>
        </Card>
      </div>

      {habitStats.length > 0 && (
        <Card>
          <h2 className="text-sm font-semibold text-white mb-4">Habit-Performance</h2>
          <div className="space-y-3">
            {habitStats.map((h) => (
              <div key={h.id}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm text-white truncate">{h.name}</span>
                  <span className="text-xs text-[#b0b7c2] ml-2 flex-shrink-0">{h.done}/7</span>
                </div>
                <ProgressBar
                  value={h.done} max={7}
                  colorClass={h.rate >= 80 ? 'bg-emerald-500' : h.rate >= 50 ? 'bg-amber-500' : 'bg-red-500'}
                />
              </div>
            ))}
          </div>
          {habits.length > 1 && (
            <div className="flex gap-4 mt-4 pt-4 border-t border-[#323640]">
              <div className="flex-1">
                <div className="text-xs text-[#b0b7c2] mb-1">Stärkster</div>
                <div className="text-sm text-emerald-400 font-medium truncate">{habitStats[0]?.name}</div>
              </div>
              <div className="flex-1">
                <div className="text-xs text-[#b0b7c2] mb-1">Schwächster</div>
                <div className="text-sm text-red-400 font-medium truncate">{habitStats[habitStats.length - 1]?.name}</div>
              </div>
            </div>
          )}
        </Card>
      )}

      {weekLogs.length > 0 && (
        <Card>
          <h2 className="text-sm font-semibold text-white mb-4">Energie — letzte 7 Tage</h2>
          <div className="flex items-end gap-1.5 h-14">
            {last7.map((date) => {
              const log = dailyLogs.find((l) => l.date === date)
              return (
                <div key={date} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full flex flex-col items-end justify-end" style={{ height: '40px' }}>
                    {log ? (
                      <div className="w-full rounded-sm bg-[#4f86f7]/60" style={{ height: `${(log.energyLevel / 10) * 40}px` }} />
                    ) : (
                      <div className="w-full h-0.5 bg-[#323640] rounded-sm" />
                    )}
                  </div>
                  <div className="text-xs text-[#323640]">{date.slice(8)}</div>
                </div>
              )
            })}
          </div>
        </Card>
      )}

      <Card>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-white">Review & Planung</h2>
          {saved && <span className="text-xs text-emerald-400">✓ Gespeichert</span>}
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-xs text-[#b0b7c2] uppercase tracking-wide block mb-1.5">Rückblick</label>
            <textarea
              className="w-full bg-[#191a1f] border border-[#323640] rounded-xl px-3 py-2.5 text-sm text-white placeholder-[#323640] focus:outline-none focus:border-[#4f86f7] resize-none"
              rows={3} placeholder="Muster, Erkenntnisse aus dieser Woche …"
              value={notes} onChange={(e) => setNotes(e.target.value)}
            />
          </div>
          <div>
            <label className="text-xs text-[#b0b7c2] uppercase tracking-wide block mb-1.5">Plan nächste Woche</label>
            <textarea
              className="w-full bg-[#191a1f] border border-[#323640] rounded-xl px-3 py-2.5 text-sm text-white placeholder-[#323640] focus:outline-none focus:border-[#4f86f7] resize-none"
              rows={3} placeholder="Einen Fokus setzen …"
              value={nextWeekPlan} onChange={(e) => setNextWeekPlan(e.target.value)}
            />
          </div>
          <div className="flex justify-end">
            <Button onClick={save}>Speichern</Button>
          </div>
        </div>
      </Card>
    </div>
  )
}
