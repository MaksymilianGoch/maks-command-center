import { useState } from 'react'
import { today, formatDate } from '../utils/dateUtils'
import { calculateStreak } from '../utils/habitUtils'
import Toggle from '../components/Toggle'
import Button from '../components/Button'
import RingProgress from '../components/RingProgress'
import QuoteBanner from '../components/QuoteBanner'
import { QUOTES } from '../data/quotes'

const TOOLS = ['n8n', 'claude-code', 'cs-basics']

const emptyForm = {
  note: '', strongPoints: '', weakPoints: '', tomorrowFocus: '',
  energyLevel: 7, disciplineLevel: 7,
  sleepHours: 7, sleepBefore2330: false, workout: false, workoutMin: 0,
  nutritionQuality: 'ok',
  learningTool: '', learningTopic: '', learningBuilt: false, learningMin: 0, learningMode: 'aktiv',
}

export default function Log({ logs, setLogs, habits }) {
  const todayStr = today()
  const existing = logs.find((l) => l.date === todayStr)
  const [form, setForm] = useState(existing || { ...emptyForm })
  const [saved, setSaved] = useState(!!existing)
  const [expanded, setExpanded] = useState(null)

  const topStreak = habits
    ? habits.reduce((max, h) => Math.max(max, calculateStreak(h.completions)), 0)
    : 0

  const s = (key, val) => setForm((p) => ({ ...p, [key]: val }))

  const save = () => {
    if (existing) {
      setLogs((prev) => prev.map((l) => l.date === todayStr ? { ...l, ...form } : l))
    } else {
      setLogs((prev) => [...prev, { id: crypto.randomUUID(), date: todayStr, ...form }])
    }
    setSaved(true)
  }

  const past = logs.filter((l) => l.date !== todayStr).sort((a, b) => b.date.localeCompare(a.date))

  return (
    <div className="space-y-6">
      {/* Header — adapted from Study Center */}
      <section className="space-y-1">
        <p className="text-xs font-medium text-primary uppercase tracking-[0.2em]">Daily Log</p>
        <h1 className="text-3xl font-bold text-on-surface">Stay sharp, Maks.</h1>
      </section>

      <QuoteBanner quote={QUOTES.log} />

      {/* Streak + Today Status */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        <div className="md:col-span-4 glass-card rounded-2xl p-6 flex flex-col justify-between min-h-[180px] relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-4 opacity-10 text-7xl">🔥</div>
          <div className="space-y-1">
            <span className="text-tertiary text-2xl">🔥</span>
            <h3 className="text-sm text-on-surface-variant">Top Streak</h3>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-5xl font-bold text-on-surface">{topStreak}</span>
            <span className="text-xl text-on-surface-variant">Tage</span>
          </div>
          <p className="text-xs text-tertiary">Kein "fast geschafft".</p>
        </div>

        {/* Energy Ring */}
        <div className="md:col-span-8 glass-card rounded-2xl p-6 flex items-center justify-between gap-6">
          <div className="space-y-3">
            <h3 className="text-xl font-semibold text-on-surface">Performance heute</h3>
            <p className="text-sm text-on-surface-variant">Energie & Disziplin</p>
            <div className="flex gap-3">
              {!saved && (
                <Button onClick={save} size="sm">Speichern</Button>
              )}
              {saved && <span className="text-sm text-green-400 flex items-center gap-1"><span className="material-symbols-outlined text-sm">check_circle</span> Gespeichert</span>}
            </div>
          </div>
          <RingProgress value={form.energyLevel} max={10} size={120} strokeWidth={10} color="#aac7ff">
            <span className="text-2xl font-bold text-on-surface">{form.energyLevel}</span>
            <span className="text-[10px] uppercase tracking-widest text-on-surface-variant">Energie</span>
          </RingProgress>
        </div>
      </div>

      {/* Main Log Form */}
      <div className="glass-card rounded-2xl p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-on-surface">Tageseintrag</h2>
          {saved && <span className="text-sm text-green-400">✓ Gespeichert</span>}
        </div>

        {/* Energie + Disziplin Sliders */}
        <div className="grid grid-cols-2 gap-6 mb-6">
          {[{ key: 'energyLevel', label: 'Energie' }, { key: 'disciplineLevel', label: 'Disziplin' }].map(({ key, label }) => {
            const val = form[key]
            const color = val >= 8 ? 'text-green-400' : val >= 5 ? 'text-tertiary' : 'text-red-400'
            return (
              <div key={key}>
                <div className="flex justify-between mb-2">
                  <label className="text-xs text-on-surface-variant uppercase tracking-wide">{label}</label>
                  <span className={`text-xl font-bold ${color}`}>{val}</span>
                </div>
                <input type="range" min={1} max={10} value={val}
                  onChange={(e) => s(key, +e.target.value)}
                  className="w-full accent-primary" />
              </div>
            )
          })}
        </div>

        {/* Health */}
        <div className="border-t border-white/10 pt-5 mb-5">
          <p className="text-xs text-on-surface-variant uppercase tracking-widest mb-4">Health</p>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Toggle checked={form.sleepBefore2330} onChange={() => s('sleepBefore2330', !form.sleepBefore2330)} size="sm" />
                <span className="text-sm text-on-surface">Schlaf vor 23:30</span>
              </div>
              <div className="flex items-center gap-2">
                <input type="number" min={0} max={12} step={0.5}
                  className="w-16 bg-surface-container-low border border-white/10 rounded-xl px-2 py-1 text-xs text-on-surface focus:outline-none focus:border-primary/50 text-center"
                  value={form.sleepHours} onChange={(e) => s('sleepHours', +e.target.value)} />
                <span className="text-xs text-on-surface-variant">h</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Toggle checked={form.workout} onChange={() => s('workout', !form.workout)} size="sm" />
                <span className="text-sm text-on-surface">Bewegung</span>
              </div>
              {form.workout && (
                <div className="flex items-center gap-2">
                  <input type="number" min={0} max={180}
                    className="w-16 bg-surface-container-low border border-white/10 rounded-xl px-2 py-1 text-xs text-on-surface focus:outline-none focus:border-primary/50 text-center"
                    value={form.workoutMin} onChange={(e) => s('workoutMin', +e.target.value)} />
                  <span className="text-xs text-on-surface-variant">min</span>
                </div>
              )}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-on-surface">Ernährung</span>
              <div className="flex gap-2">
                {['gut', 'ok', 'schlecht'].map((q) => (
                  <button key={q} onClick={() => s('nutritionQuality', q)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                      form.nutritionQuality === q
                        ? q === 'gut' ? 'bg-green-500/20 text-green-400' : q === 'ok' ? 'bg-tertiary/20 text-tertiary' : 'bg-red-500/20 text-red-400'
                        : 'bg-surface-container text-on-surface-variant'
                    }`}>{q}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Learning */}
        <div className="border-t border-white/10 pt-5 mb-5">
          <p className="text-xs text-on-surface-variant uppercase tracking-widest mb-4">Learning</p>
          <div className="flex gap-2 flex-wrap mb-3">
            <button onClick={() => s('learningTool', '')}
              className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${!form.learningTool ? 'bg-primary text-on-primary' : 'bg-surface-container text-on-surface-variant'}`}>
              Keines
            </button>
            {TOOLS.map((t) => (
              <button key={t} onClick={() => s('learningTool', t)}
                className={`px-4 py-2 rounded-full text-xs font-medium transition-all ${form.learningTool === t ? 'bg-primary text-on-primary' : 'bg-surface-container text-on-surface-variant'}`}>
                {t}
              </button>
            ))}
          </div>
          {form.learningTool && (
            <div className="space-y-3">
              <input className="w-full bg-surface-container-low border border-white/10 rounded-2xl px-4 py-3 text-sm text-on-surface placeholder-outline focus:outline-none focus:border-primary/50"
                placeholder="Thema / Was gelernt?" value={form.learningTopic} onChange={(e) => s('learningTopic', e.target.value)} />
              <div className="flex items-center gap-4 flex-wrap">
                <label className="flex items-center gap-2">
                  <Toggle checked={form.learningBuilt} onChange={() => s('learningBuilt', !form.learningBuilt)} size="sm" />
                  <span className="text-xs text-on-surface">Etwas gebaut</span>
                </label>
                <div className="flex items-center gap-2 ml-auto">
                  <input type="number" min={0} max={300}
                    className="w-16 bg-surface-container-low border border-white/10 rounded-xl px-2 py-1 text-xs text-on-surface focus:outline-none text-center"
                    value={form.learningMin} onChange={(e) => s('learningMin', +e.target.value)} />
                  <span className="text-xs text-on-surface-variant">min</span>
                </div>
                {['aktiv', 'passiv'].map((m) => (
                  <button key={m} onClick={() => s('learningMode', m)}
                    className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${form.learningMode === m ? m === 'aktiv' ? 'bg-green-500/20 text-green-400' : 'bg-tertiary/20 text-tertiary' : 'bg-surface-container text-on-surface-variant'}`}>
                    {m}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Reflexion */}
        <div className="border-t border-white/10 pt-5 space-y-4">
          <p className="text-xs text-on-surface-variant uppercase tracking-widest">Reflexion</p>
          {[
            { key: 'strongPoints', label: 'Was war stark?', placeholder: 'Erfolge, gute Entscheidungen …' },
            { key: 'weakPoints', label: 'Was war schwach?', placeholder: 'Fehler, Ablenkungen …' },
            { key: 'tomorrowFocus', label: 'ONE Thing morgen', placeholder: 'Konkrete nächste Sache' },
            { key: 'note', label: 'Notiz', placeholder: 'Wie war der Tag?' },
          ].map(({ key, label, placeholder }) => (
            <div key={key}>
              <label className="text-xs text-on-surface-variant uppercase tracking-wide block mb-1.5">{label}</label>
              <textarea className="w-full bg-surface-container-low border border-white/10 rounded-2xl px-4 py-3 text-sm text-on-surface placeholder-outline focus:outline-none focus:border-primary/50 resize-none"
                rows={2} placeholder={placeholder} value={form[key]} onChange={(e) => s(key, e.target.value)} />
            </div>
          ))}
        </div>

        <div className="flex justify-end mt-5">
          <Button onClick={save} size="lg">Speichern</Button>
        </div>
      </div>

      {/* Past entries */}
      {past.length > 0 && (
        <div className="glass-card rounded-2xl p-6">
          <h2 className="text-xl font-semibold text-on-surface mb-4">Vergangene Einträge</h2>
          <div className="space-y-3">
            {past.slice(0, 5).map((l) => (
              <div key={l.id} onClick={() => setExpanded(expanded === l.date ? null : l.date)}
                className="bg-surface-container-low rounded-2xl p-4 cursor-pointer hover:bg-surface-container transition-all border border-white/5">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-on-surface">{formatDate(l.date)}</span>
                  <div className="flex gap-3 text-xs">
                    <span className={l.energyLevel >= 7 ? 'text-green-400' : l.energyLevel >= 5 ? 'text-tertiary' : 'text-red-400'}>E:{l.energyLevel}</span>
                    <span className={l.disciplineLevel >= 7 ? 'text-green-400' : l.disciplineLevel >= 5 ? 'text-tertiary' : 'text-red-400'}>D:{l.disciplineLevel}</span>
                    {l.sleepBefore2330 && <span className="text-green-400">Schlaf✓</span>}
                    {l.learningTool && <span className={l.learningMode === 'aktiv' ? 'text-primary' : 'text-tertiary'}>{l.learningTool}</span>}
                    <span className="text-on-surface-variant">{expanded === l.date ? '▲' : '▼'}</span>
                  </div>
                </div>
                {expanded === l.date && (
                  <div className="mt-3 pt-3 border-t border-white/10 space-y-1.5">
                    {l.strongPoints && <p className="text-xs text-on-surface-variant"><span className="text-green-400">+ </span>{l.strongPoints}</p>}
                    {l.weakPoints && <p className="text-xs text-on-surface-variant"><span className="text-red-400">− </span>{l.weakPoints}</p>}
                    {l.tomorrowFocus && <p className="text-xs text-on-surface-variant"><span className="text-primary">→ </span>{l.tomorrowFocus}</p>}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
