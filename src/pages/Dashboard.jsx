import { today } from '../utils/dateUtils'
import { calculateStreak, isCompletedToday } from '../utils/habitUtils'
import Card from '../components/Card'
import RingProgress from '../components/RingProgress'
import ProgressBar from '../components/ProgressBar'

const QUOTES = [
  'Complexity is the enemy of execution.',
  'Disziplin ist Freiheit.',
  'Du bist eine Stimme, nicht ein Echo.',
  'Wer die Ruhe bewahrt, gewinnt.',
]

export default function Dashboard({ habits, tasks, finance, logs, onNavigate }) {
  const todayStr = today()
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Guten Morgen' : hour < 18 ? 'Guten Tag' : 'Guten Abend'
  const quote = QUOTES[new Date().getDay() % QUOTES.length]

  const todayLog = logs.find((l) => l.date === todayStr)
  const topTask = tasks.find((t) => t.isTop && !t.done && t.date === todayStr)
  const completedHabits = habits.filter((h) => isCompletedToday(h.completions)).length
  const topStreak = habits.reduce((max, h) => Math.max(max, calculateStreak(h.completions)), 0)
  const todayTasks = tasks.filter((t) => t.date === todayStr)
  const doneTasks = todayTasks.filter((t) => t.done).length

  const latestFinance = [...finance].sort((a, b) => b.date.localeCompare(a.date))[0]
  const savings = latestFinance?.savingsTotal ?? 0
  const pct500k = Math.min(100, Math.round((savings / 500000) * 100))

  // Weekly habit completion (last 7 days)
  const last7 = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (6 - i)); return d.toISOString().split('T')[0]
  })
  const weeklyDone = last7.map((date) => habits.filter((h) => h.completions.includes(date)).length)
  const weeklyMax = habits.length || 1
  const weekDays = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So']
  const today7idx = new Date().getDay() === 0 ? 6 : new Date().getDay() - 1

  return (
    <div className="p-4 md:p-6 space-y-4 max-w-lg mx-auto md:max-w-none">
      {/* Header */}
      <div className="pt-2 pb-1">
        <p className="text-xs text-[#4a4a6a] uppercase tracking-widest mb-1">
          {new Date().toLocaleDateString('de-DE', { weekday: 'long', day: 'numeric', month: 'long' })}
        </p>
        <h1 className="text-3xl font-bold text-white mb-1">{greeting}, Maks.</h1>
        <p className="text-sm text-[#4a4a6a] italic">"{quote}"</p>
      </div>

      {/* Weekly Focus — Ring Progress */}
      <Card glow>
        <div className="flex items-center gap-4">
          <RingProgress value={completedHabits} max={habits.length || 1} size={88} strokeWidth={7} color="#7c6af7">
            <span className="text-xl font-bold text-white">{Math.round((completedHabits / (habits.length || 1)) * 100)}%</span>
          </RingProgress>
          <div className="flex-1">
            <div className="text-xs text-[#4a4a6a] uppercase tracking-widest mb-1">Weekly Focus</div>
            <div className="text-base font-semibold text-white">{completedHabits} / {habits.length} Habits</div>
            <div className="text-xs text-[#9a9aaa] mt-0.5">Streak Top: {topStreak} Tage 🔥</div>
          </div>
          <div className="flex gap-1 items-end h-10">
            {weeklyDone.map((count, i) => (
              <div key={i} className="flex flex-col items-center gap-0.5">
                <div
                  className={`w-4 rounded-sm transition-all ${i === today7idx ? 'bg-[#7c6af7]' : count > 0 ? 'bg-[#7c6af7]/40' : 'bg-[#1e1e2e]'}`}
                  style={{ height: `${Math.max(3, (count / weeklyMax) * 32)}px` }}
                />
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* ONE Thing */}
      {topTask && (
        <Card className="border-[#7c6af7]/25 bg-[#7c6af7]/5 shadow-[0_0_20px_rgba(124,106,247,0.1)]">
          <div className="text-xs text-[#7c6af7] uppercase tracking-widest mb-2 font-semibold">ONE Thing heute</div>
          <p className="text-base font-semibold text-white">{topTask.text}</p>
          <button onClick={() => onNavigate('today')} className="text-xs text-[#7c6af7] mt-2 hover:text-white transition-colors">
            Alle Tasks →
          </button>
        </Card>
      )}

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3">
        <Card onClick={() => onNavigate('today')} className="text-center py-5">
          <div className="text-2xl mb-2">✓</div>
          <div className="text-sm font-semibold text-white">{doneTasks}/{todayTasks.length}</div>
          <div className="text-xs text-[#4a4a6a] mt-0.5">Tasks heute</div>
        </Card>
        <Card onClick={() => onNavigate('habits')} className="text-center py-5">
          <div className="text-2xl mb-2">◎</div>
          <div className="text-sm font-semibold text-white">{completedHabits}/{habits.length}</div>
          <div className="text-xs text-[#4a4a6a] mt-0.5">Habits</div>
        </Card>
        <Card onClick={() => onNavigate('finance')} className="text-center py-5">
          <div className="text-2xl mb-2">◈</div>
          <div className="text-sm font-semibold text-white">{pct500k}%</div>
          <div className="text-xs text-[#4a4a6a] mt-0.5">zu 500k</div>
        </Card>
        <Card onClick={() => onNavigate('log')} className="text-center py-5">
          <div className="text-2xl mb-2">≡</div>
          <div className={`text-sm font-semibold ${todayLog ? 'text-emerald-400' : 'text-[#4a4a6a]'}`}>
            {todayLog ? `${todayLog.energyLevel}/10` : '—'}
          </div>
          <div className="text-xs text-[#4a4a6a] mt-0.5">Energie</div>
        </Card>
      </div>

      {/* Finance Snapshot */}
      <Card onClick={() => onNavigate('finance')}>
        <div className="flex items-center justify-between mb-2">
          <div className="text-xs text-[#4a4a6a] uppercase tracking-widest">500k Ziel</div>
          <span className="text-xs text-[#7c6af7]">{pct500k}% erreicht</span>
        </div>
        <div className="text-2xl font-bold text-white mb-3">
          {(500000 - savings).toLocaleString('de-DE')} <span className="text-sm text-[#4a4a6a]">€ noch</span>
        </div>
        <ProgressBar value={savings} max={500000} colorClass="bg-gradient-to-r from-[#7c6af7] to-[#a78bfa]" />
      </Card>

      {/* Habit Snapshot */}
      <Card>
        <div className="flex items-center justify-between mb-3">
          <div className="text-xs text-[#4a4a6a] uppercase tracking-widest">Heutige Habits</div>
          <button onClick={() => onNavigate('habits')} className="text-xs text-[#7c6af7]">Alle →</button>
        </div>
        <div className="space-y-2">
          {habits.slice(0, 5).map((h) => {
            const done = isCompletedToday(h.completions)
            return (
              <div key={h.id} className="flex items-center gap-3">
                <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${done ? 'bg-[#7c6af7]' : 'bg-[#2a2a3e]'}`} />
                <span className={`text-sm flex-1 truncate ${done ? 'text-[#4a4a6a] line-through' : 'text-white'}`}>{h.name}</span>
                {done && <span className="text-xs text-[#7c6af7]">✓</span>}
              </div>
            )
          })}
        </div>
      </Card>
    </div>
  )
}
