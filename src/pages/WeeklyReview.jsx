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
      setWeeklyReviews((prev) =>
        prev.map((r) => (r.weekStart === weekStart ? { ...r, notes, nextWeekPlan } : r))
      )
    } else {
      setWeeklyReviews((prev) => [
        ...prev,
        { id: crypto.randomUUID(), weekStart, notes, nextWeekPlan },
      ])
    }
    setSaved(true)
  }

  const habitStats = habits
    .map((h) => {
      const completedInWeek = h.completions.filter((d) => last7.includes(d)).length
      return { ...h, completedInWeek, rate: Math.round((completedInWeek / 7) * 100) }
    })
    .sort((a, b) => b.rate - a.rate)

  const weekLogs = dailyLogs.filter((l) => last7.includes(l.date))

  const avgEnergy =
    weekLogs.length
      ? Math.round((weekLogs.reduce((s, l) => s + l.energyLevel, 0) / weekLogs.length) * 10) / 10
      : null

  const avgDiscipline =
    weekLogs.length
      ? Math.round(
          (weekLogs.reduce((s, l) => s + l.disciplineLevel, 0) / weekLogs.length) * 10
        ) / 10
      : null

  const totalDone = habits.reduce(
    (sum, h) => sum + h.completions.filter((d) => last7.includes(d)).length,
    0
  )
  const totalPossible = habits.length * 7

  const levelColor = (v) =>
    v === null ? 'text-zinc-600' : v >= 7 ? 'text-green-400' : v >= 5 ? 'text-amber-400' : 'text-red-400'

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-50">Weekly Review</h1>
        <p className="text-sm text-zinc-400 mt-1">Woche ab {formatDate(weekStart)}</p>
      </div>

      <div className="grid grid-cols-4 gap-3">
        <Card>
          <div className={`text-2xl font-bold ${levelColor(avgEnergy)}`}>
            {avgEnergy ?? '—'}
          </div>
          <div className="text-xs text-zinc-400 mt-1">Ø Energie</div>
        </Card>
        <Card>
          <div className={`text-2xl font-bold ${levelColor(avgDiscipline)}`}>
            {avgDiscipline ?? '—'}
          </div>
          <div className="text-xs text-zinc-400 mt-1">Ø Disziplin</div>
        </Card>
        <Card>
          <div className="text-2xl font-bold text-indigo-400">
            {totalDone}/{totalPossible}
          </div>
          <div className="text-xs text-zinc-400 mt-1">Habit-Completions</div>
        </Card>
        <Card>
          <div className="text-2xl font-bold text-zinc-300">{weekLogs.length}/7</div>
          <div className="text-xs text-zinc-400 mt-1">Tage mit Log</div>
        </Card>
      </div>

      {habitStats.length > 0 && (
        <Card>
          <h2 className="text-sm font-semibold text-zinc-200 mb-4">
            Habit-Performance diese Woche
          </h2>
          <div className="space-y-3">
            {habitStats.map((h) => (
              <div key={h.id}>
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm text-zinc-300">{h.name}</span>
                  <span className="text-xs text-zinc-400">{h.completedInWeek}/7 Tagen</span>
                </div>
                <ProgressBar
                  value={h.completedInWeek}
                  max={7}
                  colorClass={
                    h.rate >= 80 ? 'bg-green-500' : h.rate >= 50 ? 'bg-amber-500' : 'bg-red-500'
                  }
                />
              </div>
            ))}
          </div>
          {habits.length > 1 && (
            <div className="flex gap-4 mt-4 pt-4 border-t border-zinc-800">
              <div className="flex-1">
                <div className="text-xs text-zinc-500 mb-1">Stärkster Habit</div>
                <div className="text-sm text-green-400 font-medium">{habitStats[0]?.name}</div>
                <div className="text-xs text-zinc-400">{habitStats[0]?.rate}% diese Woche</div>
              </div>
              <div className="flex-1">
                <div className="text-xs text-zinc-500 mb-1">Schwächster Habit</div>
                <div className="text-sm text-red-400 font-medium">
                  {habitStats[habitStats.length - 1]?.name}
                </div>
                <div className="text-xs text-zinc-400">
                  {habitStats[habitStats.length - 1]?.rate}% diese Woche
                </div>
              </div>
            </div>
          )}
        </Card>
      )}

      {weekLogs.length > 0 && (
        <Card>
          <h2 className="text-sm font-semibold text-zinc-200 mb-4">
            Energie — letzte 7 Tage
          </h2>
          <div className="flex items-end gap-2 h-16">
            {last7.map((date) => {
              const log = dailyLogs.find((l) => l.date === date)
              return (
                <div key={date} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full flex flex-col items-end justify-end" style={{ height: '40px' }}>
                    {log ? (
                      <div
                        className="w-full rounded-sm bg-indigo-500/70"
                        style={{ height: `${(log.energyLevel / 10) * 40}px` }}
                        title={`${date}: Energie ${log.energyLevel}`}
                      />
                    ) : (
                      <div className="w-full h-1 bg-zinc-800 rounded-sm" />
                    )}
                  </div>
                  <div className="text-xs text-zinc-600">{date.slice(8)}</div>
                </div>
              )
            })}
          </div>
          <div className="text-xs text-zinc-600 mt-2">Balken = Energielevel (1–10)</div>
        </Card>
      )}

      <Card>
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-zinc-200">Review & Planung</h2>
          {saved && <span className="text-xs text-green-400">✓ Gespeichert</span>}
        </div>
        <div className="space-y-4">
          <div>
            <label className="text-xs text-zinc-400 uppercase tracking-wide block mb-1.5">
              Rückblick — Was fällt auf?
            </label>
            <textarea
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-indigo-500 resize-none"
              rows={3}
              placeholder="Muster, Erkenntnisse, Überraschungen aus dieser Woche …"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>
          <div>
            <label className="text-xs text-zinc-400 uppercase tracking-wide block mb-1.5">
              Plan für nächste Woche
            </label>
            <textarea
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-indigo-500 resize-none"
              rows={3}
              placeholder="Einen Fokus setzen, konkrete Veränderungen …"
              value={nextWeekPlan}
              onChange={(e) => setNextWeekPlan(e.target.value)}
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
