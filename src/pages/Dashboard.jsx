import { calculateStreak, isCompletedToday } from '../utils/habitUtils'
import { today } from '../utils/dateUtils'
import Card from '../components/Card'
import ProgressBar from '../components/ProgressBar'

export default function Dashboard({ habits, goals, dailyLogs, onNavigate }) {
  const todayStr = today()
  const todayLog = dailyLogs.find((l) => l.date === todayStr)
  const completedToday = habits.filter((h) => isCompletedToday(h.completions))
  const activeGoals = goals.filter((g) => g.status === 'active').slice(0, 3)
  const topStreak = habits.reduce(
    (max, h) => { const s = calculateStreak(h.completions); return s > max.streak ? { name: h.name, streak: s } : max },
    { name: '', streak: 0 }
  )
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Guten Morgen' : hour < 18 ? 'Guten Tag' : 'Guten Abend'

  return (
    <div className="p-4 md:p-6 space-y-5">

      {/* Hero Header */}
      <div className="pt-2">
        <p className="text-sm text-[#9a9aaa] mb-1">
          {new Date().toLocaleDateString('de-DE', { weekday: 'long', day: 'numeric', month: 'long' })}
        </p>
        <h1 className="text-3xl font-bold text-white">{greeting}, Maks.</h1>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card>
          <div className="text-3xl font-bold text-[#7c6af7] mb-1">
            {completedToday.length}<span className="text-lg text-[#9a9aaa]">/{habits.length}</span>
          </div>
          <div className="text-xs text-[#9a9aaa]">Habits heute</div>
        </Card>
        <Card>
          <div className="text-3xl font-bold text-emerald-400 mb-1">{topStreak.streak}</div>
          <div className="text-xs text-[#9a9aaa]">Bester Streak</div>
        </Card>
        <Card>
          <div className="text-3xl font-bold text-amber-400 mb-1">{activeGoals.length}</div>
          <div className="text-xs text-[#9a9aaa]">Aktive Ziele</div>
        </Card>
        <Card>
          <div className={`text-3xl font-bold mb-1 ${todayLog ? 'text-emerald-400' : 'text-[#1e2030]'}`}>
            {todayLog ? todayLog.energyLevel : '—'}<span className="text-lg text-[#9a9aaa]">{todayLog ? '/10' : ''}</span>
          </div>
          <div className="text-xs text-[#9a9aaa]">Energie</div>
        </Card>
      </div>

      {/* Habits + Goals */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-white">Heutige Habits</h2>
            <button onClick={() => onNavigate('habits')} className="text-xs text-[#7c6af7] hover:text-[#6c5ce7]">Alle →</button>
          </div>
          {habits.length === 0 ? (
            <p className="text-sm text-[#9a9aaa]">Noch keine Habits erstellt.</p>
          ) : (
            <div className="space-y-3">
              {habits.slice(0, 5).map((h) => {
                const done = isCompletedToday(h.completions)
                const streak = calculateStreak(h.completions)
                return (
                  <div key={h.id} className="flex items-center gap-3">
                    <div className={`w-2 h-2 rounded-full flex-shrink-0 ${done ? 'bg-emerald-400' : 'bg-[#1e2030]'}`} />
                    <span className={`text-sm flex-1 ${done ? 'text-[#9a9aaa] line-through' : 'text-white'}`}>{h.name}</span>
                    {streak > 2 && <span className="text-xs text-amber-400">🔥 {streak}</span>}
                  </div>
                )
              })}
            </div>
          )}
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-white">Ziele</h2>
            <button onClick={() => onNavigate('goals')} className="text-xs text-[#7c6af7] hover:text-[#6c5ce7]">Alle →</button>
          </div>
          {activeGoals.length === 0 ? (
            <p className="text-sm text-[#9a9aaa]">Noch keine Ziele definiert.</p>
          ) : (
            <div className="space-y-4">
              {activeGoals.map((g) => (
                <div key={g.id}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-white truncate">{g.title}</span>
                    <span className="text-xs text-[#9a9aaa] ml-2 flex-shrink-0">
                      {Math.round((g.currentValue / g.targetValue) * 100)}%
                    </span>
                  </div>
                  <ProgressBar value={g.currentValue} max={g.targetValue} colorClass="bg-[#7c6af7]" />
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Daily Log CTA */}
      <Card>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-white mb-1">Daily Log</h2>
            {todayLog ? (
              <div className="flex items-center gap-4">
                <span className="text-xs text-[#9a9aaa]">Energie: <span className="text-white">{todayLog.energyLevel}/10</span></span>
                <span className="text-xs text-[#9a9aaa]">Disziplin: <span className="text-white">{todayLog.disciplineLevel}/10</span></span>
                <span className="text-xs text-emerald-400">✓ Eingetragen</span>
              </div>
            ) : (
              <p className="text-xs text-[#9a9aaa]">Heute noch kein Eintrag.</p>
            )}
          </div>
          <button onClick={() => onNavigate('dailylog')}
            className="text-xs text-[#7c6af7] px-3 py-1.5 bg-[#7c6af7]/10 rounded-xl border border-[#7c6af7]/20 hover:border-[#7c6af7]/40 transition-colors">
            {todayLog ? 'Bearbeiten' : 'Eintragen →'}
          </button>
        </div>
      </Card>
    </div>
  )
}
