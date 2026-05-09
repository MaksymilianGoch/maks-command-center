import { today } from '../utils/dateUtils'
import { calculateStreak, isCompletedToday } from '../utils/habitUtils'
import RingProgress from '../components/RingProgress'
import ProgressBar from '../components/ProgressBar'
import QuoteBanner from '../components/QuoteBanner'
import { QUOTES } from '../data/quotes'

const DAILY_QUOTES = [
  'Complexity is the enemy of execution. Simple is where the magic lives.',
  'Disziplin ist Freiheit.',
  'Du bist eine Stimme, nicht ein Echo.',
  'Wer die Ruhe bewahrt, gewinnt.',
]

const ACTIONS = [
  { id: 'today',   label: 'Today',   sub: 'Tasks & Focus',  icon: 'check_circle',    bg: 'bg-primary/10',   color: 'text-primary' },
  { id: 'log',     label: 'Log',     sub: 'Reflection time', icon: 'edit_note',      bg: 'bg-tertiary/10',  color: 'text-tertiary' },
  { id: 'habits',  label: 'Habits',  sub: 'Check streaks',   icon: 'rebase_edit',    bg: 'bg-secondary/10', color: 'text-secondary' },
  { id: 'finance', label: 'Finance', sub: 'Review growth',   icon: 'analytics',      bg: 'bg-primary/10',   color: 'text-primary-container' },
]

export default function Dashboard({ habits, tasks, finance, logs, onNavigate }) {
  const todayStr = today()
  const hour = new Date().getHours()
  const greeting = hour < 12 ? 'Guten Morgen' : hour < 18 ? 'Guten Tag' : 'Guten Abend'
  const quote = DAILY_QUOTES[new Date().getDay() % DAILY_QUOTES.length]

  const completedHabits = habits.filter((h) => isCompletedToday(h.completions)).length
  const topStreak = habits.reduce((max, h) => Math.max(max, calculateStreak(h.completions)), 0)
  const todayTasks = tasks.filter((t) => t.date === todayStr)
  const doneTasks = todayTasks.filter((t) => t.done).length
  const topTask = tasks.find((t) => t.isTop && !t.done && t.date === todayStr)

  const latestFinance = [...finance].sort((a, b) => b.date.localeCompare(a.date))[0]
  const savings = latestFinance?.savingsTotal ?? 0
  const pct500k = Math.min(100, Math.round((savings / 500000) * 100))

  const weeklyPct = habits.length > 0 ? Math.round((completedHabits / habits.length) * 100) : 0

  return (
    <div className="space-y-6">
      {/* Greeting */}
      <section className="mb-2">
        <h1 className="text-3xl md:text-5xl font-bold tracking-tight text-on-surface mb-2">{greeting}, Maks.</h1>
        <p className="text-sm text-on-surface-variant italic max-w-md">"{quote}"</p>
      </section>

      <QuoteBanner quote={QUOTES.dashboard} />

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* Weekly Focus Ring */}
        <div className="md:col-span-4 glass-card rounded-2xl p-8 flex flex-col items-center justify-center text-center">
          <h3 className="text-xs font-medium text-on-surface-variant mb-6 uppercase tracking-widest">Weekly Focus</h3>
          <RingProgress value={completedHabits} max={habits.length || 1} size={160} strokeWidth={12} color="#aac7ff" trackColor="rgba(255,255,255,0.05)">
            <span className="text-3xl font-bold text-on-surface">{weeklyPct}%</span>
            <span className="text-xs text-on-surface-variant">Complete</span>
          </RingProgress>
          <p className="text-base text-on-surface mt-6">
            {completedHabits} / {habits.length} Habits · Streak {topStreak}d 🔥
          </p>
        </div>

        {/* Quick Actions 2x2 */}
        <div className="md:col-span-8 grid grid-cols-2 gap-4">
          {ACTIONS.map((a) => (
            <div key={a.id} onClick={() => onNavigate(a.id)}
              className="glass-card rounded-2xl p-6 hover:bg-surface-container-high transition-all cursor-pointer group">
              <div className={`w-12 h-12 rounded-full ${a.bg} flex items-center justify-center mb-4 ${a.color} group-hover:scale-110 transition-transform`}>
                <span className="material-symbols-outlined">{a.icon}</span>
              </div>
              <h4 className="text-xl font-semibold text-on-surface mb-1">{a.label}</h4>
              <p className="text-sm text-on-surface-variant">{a.sub}</p>
              {a.id === 'today' && todayTasks.length > 0 && (
                <p className="text-xs text-primary mt-2">{doneTasks}/{todayTasks.length} erledigt</p>
              )}
              {a.id === 'finance' && (
                <p className="text-xs text-primary mt-2">{pct500k}% zu 500k</p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* ONE Thing + Finance Banner */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* ONE Thing */}
        <div className="glass-card rounded-2xl p-6">
          <p className="text-xs font-medium text-primary uppercase tracking-[0.2em] mb-3">ONE Thing heute</p>
          {topTask ? (
            <>
              <h2 className="text-xl font-semibold text-on-surface mb-2">{topTask.text}</h2>
              <button onClick={() => onNavigate('today')}
                className="bg-primary text-on-primary px-6 py-2 rounded-full text-sm font-medium hover:opacity-90 transition-all flex items-center gap-2">
                Öffnen
                <span className="material-symbols-outlined text-sm">arrow_forward</span>
              </button>
            </>
          ) : (
            <>
              <p className="text-on-surface-variant mb-3">Noch kein ONE Thing für heute gesetzt.</p>
              <button onClick={() => onNavigate('today')}
                className="bg-primary text-on-primary px-6 py-2 rounded-full text-sm font-medium hover:opacity-90 transition-all">
                Today öffnen →
              </button>
            </>
          )}
        </div>

        {/* Finance Snapshot */}
        <div className="glass-card rounded-2xl p-6" onClick={() => onNavigate('finance')} style={{ cursor: 'pointer' }}>
          <p className="text-xs font-medium text-on-surface-variant uppercase tracking-widest mb-2">500k Ziel</p>
          <div className="text-3xl font-bold text-on-surface mb-1">{savings.toLocaleString('de-DE')} €</div>
          <div className="flex items-center gap-2 mb-4">
            <span className="flex items-center text-primary text-sm bg-primary/10 px-3 py-1 rounded-full">
              <span className="material-symbols-outlined text-sm mr-1">trending_up</span>
              {pct500k}%
            </span>
            <span className="text-on-surface-variant text-sm">von 500.000 €</span>
          </div>
          <div className="w-full bg-surface-variant h-2 rounded-full overflow-hidden">
            <div className="h-full rounded-full bg-gradient-to-r from-primary to-primary-container" style={{ width: `${pct500k}%` }} />
          </div>
        </div>
      </div>

      {/* Inspiration Card */}
      <section className="relative w-full rounded-2xl overflow-hidden border border-white/10 bg-gradient-to-br from-surface-container to-surface-container-high p-8">
        <div className="max-w-lg">
          <span className="text-xs font-medium text-primary mb-3 block uppercase tracking-[0.2em]">Dein System</span>
          <h2 className="text-2xl md:text-3xl font-semibold text-on-surface mb-3">Produktivität ist keine Emotion. Sie ist ein System.</h2>
          <p className="text-on-surface-variant mb-5">Habits → Log → Review → Repeat.</p>
          <button onClick={() => onNavigate('log')}
            className="bg-primary text-on-primary px-8 py-3 rounded-full text-sm font-medium hover:opacity-90 transition-all flex items-center gap-2 group/btn">
            Log öffnen
            <span className="material-symbols-outlined text-sm group-hover/btn:translate-x-1 transition-transform">arrow_forward</span>
          </button>
        </div>
      </section>
    </div>
  )
}
