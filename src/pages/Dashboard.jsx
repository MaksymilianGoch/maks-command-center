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
    <div className="p-4 md:p-6 space-y-4 md:space-y-6">
      <div>
        <div className="text-xs text-[#b0b7c2] font-medium tracking-widest uppercase mb-1">
          {new Date().toLocaleDateString('de-DE', {
            weekday: 'long', day: 'numeric', month: 'long',
          })}
        </div>
        <h1 className="text-2xl font-bold text-white">Guten Morgen.</h1>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Card>
          <div className="text-2xl font-bold text-[#4f86f7]">
            {completedToday.length}/{habits.length}
          </div>
          <div className="text-xs text-[#b0b7c2] mt-1">Habits heute</div>
        </Card>
        <Card>
          <div className="text-2xl font-bold text-emerald-400">{topStreak.streak}</div>
          <div className="text-xs text-[#b0b7c2] mt-1">Bester Streak</div>
        </Card>
        <Card>
          <div className="text-2xl font-bold text-amber-400">{activeGoals.length}</div>
          <div className="text-xs text-[#b0b7c2] mt-1">Aktive Ziele</div>
        </Card>
        <Card>
          <div className={`text-2xl font-bold ${todayLog ? 'text-emerald-400' : 'text-[#323640]'}`}>
            {todayLog ? `${todayLog.energyLevel}/10` : '—'}
          </div>
          <div className="text-xs text-[#b0b7c2] mt-1">Energie heute</div>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-white">Heutige Habits</h2>
            <button onClick={() => onNavigate('habits')} className="text-xs text-[#4f86f7] hover:text-[#3a70e0]">
              Alle →
            </button>
          </div>
          {habits.length === 0 ? (
            <p className="text-sm text-[#b0b7c2]">Noch keine Habits. Erstelle dein erstes!</p>
          ) : (
            <div className="space-y-2">
              {habits.slice(0, 5).map((h) => {
                const done = isCompletedToday(h.completions)
                const streak = calculateStreak(h.completions)
                return (
                  <div key={h.id} className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded-full border-2 flex-shrink-0 ${
                      done ? 'bg-emerald-500 border-emerald-500' : 'border-[#323640]'
                    }`} />
                    <span className={`text-sm flex-1 ${done ? 'text-[#b0b7c2] line-through' : 'text-white'}`}>
                      {h.name}
                    </span>
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
            <button onClick={() => onNavigate('goals')} className="text-xs text-[#4f86f7] hover:text-[#3a70e0]">
              Alle →
            </button>
          </div>
          {activeGoals.length === 0 ? (
            <p className="text-sm text-[#b0b7c2]">Noch keine Ziele definiert.</p>
          ) : (
            <div className="space-y-4">
              {activeGoals.map((g) => (
                <div key={g.id}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-sm text-white truncate">{g.title}</span>
                    <span className="text-xs text-[#b0b7c2] ml-2 flex-shrink-0">
                      {Math.round((g.currentValue / g.targetValue) * 100)}%
                    </span>
                  </div>
                  <ProgressBar value={g.currentValue} max={g.targetValue} colorClass="bg-[#4f86f7]" />
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      <Card>
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-sm font-semibold text-white mb-1">Daily Log</h2>
            {todayLog ? (
              <div className="flex items-center gap-4">
                <span className="text-xs text-[#b0b7c2]">Energie: <span className="text-white">{todayLog.energyLevel}/10</span></span>
                <span className="text-xs text-[#b0b7c2]">Disziplin: <span className="text-white">{todayLog.disciplineLevel}/10</span></span>
                <span className="text-xs text-emerald-400">✓ Eingetragen</span>
              </div>
            ) : (
              <p className="text-xs text-[#b0b7c2]">Heute noch kein Eintrag.</p>
            )}
          </div>
          <button
            onClick={() => onNavigate('dailylog')}
            className="text-xs text-[#4f86f7] px-3 py-1.5 bg-[#4f86f7]/10 rounded-xl border border-[#4f86f7]/20 hover:border-[#4f86f7]/40 transition-colors"
          >
            {todayLog ? 'Bearbeiten' : 'Eintragen →'}
          </button>
        </div>
      </Card>
    </div>
  )
}
