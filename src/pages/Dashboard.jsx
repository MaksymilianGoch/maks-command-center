import { today } from '../utils/dateUtils'
import { calculateStreak, isCompletedToday } from '../utils/habitUtils'
import Card from '../components/Card'
import ProgressBar from '../components/ProgressBar'

export default function Dashboard({ habits, tasks, finance, logs, onNavigate }) {
  const todayStr = today()
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Guten Morgen' : hour < 18 ? 'Guten Tag' : 'Guten Abend'

  const todayLog = logs.find((l) => l.date === todayStr)
  const topTask = tasks.find((t) => t.isTop && !t.done && t.date === todayStr)
  const completedHabits = habits.filter((h) => isCompletedToday(h.completions)).length
  const topStreak = habits.reduce((max, h) => {
    const s = calculateStreak(h.completions)
    return s > max ? s : max
  }, 0)

  const latestFinance = finance.sort((a, b) => b.date.localeCompare(a.date))[0]
  const savings = latestFinance?.savingsTotal ?? 0
  const target = 500000
  const distanceTo500k = target - savings
  const pct500k = Math.min(100, Math.round((savings / target) * 100))

  const todayTasks = tasks.filter((t) => t.date === todayStr)
  const doneTasks = todayTasks.filter((t) => t.done).length

  return (
    <div className="p-4 md:p-6 space-y-5">
      {/* Header */}
      <div className="pt-2">
        <p className="text-xs text-[#9a9aaa] uppercase tracking-widest mb-1">
          {new Date().toLocaleDateString('de-DE', { weekday: 'long', day: 'numeric', month: 'long' })}
        </p>
        <h1 className="text-3xl font-bold text-white">{greeting}, Maks.</h1>
      </div>

      {/* ONE Thing */}
      <Card className="border-[#7c6af7]/30 bg-[#7c6af7]/5">
        <div className="text-xs text-[#7c6af7] uppercase tracking-widest mb-2 font-semibold">ONE Thing heute</div>
        {topTask ? (
          <p className="text-base font-semibold text-white">{topTask.text}</p>
        ) : (
          <p className="text-sm text-[#9a9aaa]">
            {tasks.find((t) => t.isTop) ? 'Bereits erledigt ✓' : 'Noch kein TOP gesetzt'}
          </p>
        )}
        <button onClick={() => onNavigate('today')} className="text-xs text-[#7c6af7] mt-2 hover:text-white transition-colors">
          Alle Tasks →
        </button>
      </Card>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card onClick={() => onNavigate('habits')}>
          <div className="text-3xl font-bold text-[#7c6af7] mb-1">
            {completedHabits}<span className="text-base text-[#9a9aaa]">/{habits.length}</span>
          </div>
          <div className="text-xs text-[#9a9aaa]">Habits heute</div>
        </Card>
        <Card onClick={() => onNavigate('habits')}>
          <div className="text-3xl font-bold text-amber-400 mb-1">{topStreak}</div>
          <div className="text-xs text-[#9a9aaa]">Top Streak</div>
        </Card>
        <Card onClick={() => onNavigate('today')}>
          <div className="text-3xl font-bold text-emerald-400 mb-1">
            {doneTasks}<span className="text-base text-[#9a9aaa]">/{todayTasks.length}</span>
          </div>
          <div className="text-xs text-[#9a9aaa]">Tasks heute</div>
        </Card>
        <Card onClick={() => onNavigate('log')}>
          <div className={`text-3xl font-bold mb-1 ${todayLog ? 'text-emerald-400' : 'text-[#1e2030]'}`}>
            {todayLog ? todayLog.energyLevel : '—'}<span className="text-base text-[#9a9aaa]">{todayLog ? '/10' : ''}</span>
          </div>
          <div className="text-xs text-[#9a9aaa]">Energie</div>
        </Card>
      </div>

      {/* Finance Snapshot */}
      <Card onClick={() => onNavigate('finance')}>
        <div className="flex items-center justify-between mb-3">
          <div>
            <div className="text-xs text-[#9a9aaa] uppercase tracking-widest mb-1">Distanz zu 500k</div>
            <div className="text-2xl font-bold text-white">
              {distanceTo500k.toLocaleString('de-DE')} €
              <span className="text-sm text-[#9a9aaa] ml-2">noch</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-[#7c6af7]">{pct500k}%</div>
            <div className="text-xs text-[#9a9aaa]">erreicht</div>
          </div>
        </div>
        <ProgressBar value={savings} max={target} colorClass="bg-[#7c6af7]" />
        <div className="flex justify-between text-xs text-[#9a9aaa] mt-1.5">
          <span>{savings.toLocaleString('de-DE')} € gespart</span>
          <span>500.000 € Ziel</span>
        </div>
      </Card>

      {/* Habits + Log status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-white">Heutige Habits</h2>
            <button onClick={() => onNavigate('habits')} className="text-xs text-[#7c6af7]">Alle →</button>
          </div>
          <div className="space-y-2">
            {habits.slice(0, 6).map((h) => {
              const done = isCompletedToday(h.completions)
              const streak = calculateStreak(h.completions)
              return (
                <div key={h.id} className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 transition-colors ${done ? 'bg-emerald-400' : 'bg-[#1e2030]'}`} />
                  <span className={`text-sm flex-1 truncate ${done ? 'text-[#9a9aaa] line-through' : 'text-white'}`}>{h.name}</span>
                  {streak > 1 && <span className="text-xs text-amber-400 flex-shrink-0">🔥{streak}</span>}
                </div>
              )
            })}
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-white">Daily Log</h2>
            <button onClick={() => onNavigate('log')} className="text-xs text-[#7c6af7]">Öffnen →</button>
          </div>
          {todayLog ? (
            <div className="space-y-2">
              <div className="flex gap-4">
                <div className="flex-1 bg-[#0a0b10] rounded-xl p-3">
                  <div className="text-xs text-[#9a9aaa] mb-1">Energie</div>
                  <div className={`text-xl font-bold ${todayLog.energyLevel >= 7 ? 'text-emerald-400' : todayLog.energyLevel >= 5 ? 'text-amber-400' : 'text-red-400'}`}>
                    {todayLog.energyLevel}/10
                  </div>
                </div>
                <div className="flex-1 bg-[#0a0b10] rounded-xl p-3">
                  <div className="text-xs text-[#9a9aaa] mb-1">Disziplin</div>
                  <div className={`text-xl font-bold ${todayLog.disciplineLevel >= 7 ? 'text-emerald-400' : todayLog.disciplineLevel >= 5 ? 'text-amber-400' : 'text-red-400'}`}>
                    {todayLog.disciplineLevel}/10
                  </div>
                </div>
              </div>
              <div className="flex gap-3 text-xs">
                <span className={`px-2 py-1 rounded-lg ${todayLog.sleepBefore2330 ? 'bg-emerald-500/10 text-emerald-400' : 'bg-red-500/10 text-red-400'}`}>
                  Schlaf {todayLog.sleepBefore2330 ? '✓' : '✗'}
                </span>
                <span className={`px-2 py-1 rounded-lg ${todayLog.workout ? 'bg-emerald-500/10 text-emerald-400' : 'bg-[#1e2030] text-[#9a9aaa]'}`}>
                  Sport {todayLog.workout ? '✓' : '—'}
                </span>
                {todayLog.learningTool && (
                  <span className={`px-2 py-1 rounded-lg ${todayLog.learningMode === 'aktiv' ? 'bg-[#7c6af7]/10 text-[#7c6af7]' : 'bg-amber-500/10 text-amber-400'}`}>
                    {todayLog.learningTool}
                  </span>
                )}
              </div>
            </div>
          ) : (
            <div>
              <p className="text-sm text-[#9a9aaa] mb-3">Heute noch kein Eintrag.</p>
              <button onClick={() => onNavigate('log')}
                className="text-xs text-[#7c6af7] px-3 py-1.5 bg-[#7c6af7]/10 rounded-xl border border-[#7c6af7]/20 hover:border-[#7c6af7]/40 transition-colors">
                Jetzt eintragen →
              </button>
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
