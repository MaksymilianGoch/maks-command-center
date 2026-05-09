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
    (max, h) => {
      const s = calculateStreak(h.completions)
      return s > max.streak ? { name: h.name, streak: s } : max
    },
    { name: '', streak: 0 }
  )

  return (
    <div className="p-6 space-y-6">
      <div>
        <div className="text-xs text-zinc-500 font-medium tracking-widest uppercase mb-1">
          {new Date().toLocaleDateString('de-DE', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
          })}
        </div>
        <h1 className="text-2xl font-bold text-zinc-50">Guten Morgen.</h1>
      </div>

      <div className="grid grid-cols-4 gap-3">
        <Card>
          <div className="text-2xl font-bold text-indigo-400">
            {completedToday.length}/{habits.length}
          </div>
          <div className="text-xs text-zinc-400 mt-1">Habits heute</div>
        </Card>
        <Card>
          <div className="text-2xl font-bold text-green-400">{topStreak.streak}</div>
          <div className="text-xs text-zinc-400 mt-1">Bester Streak</div>
        </Card>
        <Card>
          <div className="text-2xl font-bold text-amber-400">{activeGoals.length}</div>
          <div className="text-xs text-zinc-400 mt-1">Aktive Ziele</div>
        </Card>
        <Card>
          <div className={`text-2xl font-bold ${todayLog ? 'text-green-400' : 'text-zinc-600'}`}>
            {todayLog ? `${todayLog.energyLevel}/10` : '—'}
          </div>
          <div className="text-xs text-zinc-400 mt-1">Energie heute</div>
        </Card>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-zinc-200">Heutige Habits</h2>
            <button
              onClick={() => onNavigate('habits')}
              className="text-xs text-indigo-400 hover:text-indigo-300"
            >
              Alle →
            </button>
          </div>
          {habits.length === 0 ? (
            <p className="text-sm text-zinc-600">Noch keine Habits. Erstelle dein erstes!</p>
          ) : (
            <div className="space-y-2">
              {habits.slice(0, 5).map((h) => {
                const done = isCompletedToday(h.completions)
                const streak = calculateStreak(h.completions)
                return (
                  <div key={h.id} className="flex items-center gap-3">
                    <div
                      className={`w-4 h-4 rounded-full border-2 flex-shrink-0 ${
                        done ? 'bg-green-500 border-green-500' : 'border-zinc-600'
                      }`}
                    />
                    <span
                      className={`text-sm flex-1 ${
                        done ? 'text-zinc-500 line-through' : 'text-zinc-200'
                      }`}
                    >
                      {h.name}
                    </span>
                    {streak > 2 && (
                      <span className="text-xs text-amber-400">🔥 {streak}</span>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </Card>

        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-zinc-200">Ziele</h2>
            <button
              onClick={() => onNavigate('goals')}
              className="text-xs text-indigo-400 hover:text-indigo-300"
            >
              Alle →
            </button>
          </div>
          {activeGoals.length === 0 ? (
            <p className="text-sm text-zinc-600">Noch keine Ziele definiert.</p>
          ) : (
            <div className="space-y-4">
              {activeGoals.map((g) => (
                <div key={g.id}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm text-zinc-200 truncate">{g.title}</span>
                    <span className="text-xs text-zinc-400 ml-2 flex-shrink-0">
                      {Math.round((g.currentValue / g.targetValue) * 100)}%
                    </span>
                  </div>
                  <ProgressBar value={g.currentValue} max={g.targetValue} />
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      <Card>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-zinc-200 mb-1">Daily Log</h2>
            {todayLog ? (
              <div className="flex items-center gap-4">
                <span className="text-xs text-zinc-400">
                  Energie: <span className="text-zinc-200">{todayLog.energyLevel}/10</span>
                </span>
                <span className="text-xs text-zinc-400">
                  Disziplin: <span className="text-zinc-200">{todayLog.disciplineLevel}/10</span>
                </span>
                <span className="text-xs text-green-400">✓ Heute eingetragen</span>
              </div>
            ) : (
              <p className="text-xs text-zinc-500">Heute noch kein Eintrag.</p>
            )}
          </div>
          <button
            onClick={() => onNavigate('dailylog')}
            className="text-xs text-indigo-400 hover:text-indigo-300 px-3 py-1.5 bg-indigo-600/10 rounded-lg border border-indigo-600/20 hover:border-indigo-600/40 transition-colors"
          >
            {todayLog ? 'Bearbeiten' : 'Jetzt eintragen →'}
          </button>
        </div>
      </Card>
    </div>
  )
}
