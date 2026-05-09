import { useState } from 'react'
import { today, formatDate } from '../utils/dateUtils'
import Card from '../components/Card'
import Button from '../components/Button'
import Toggle from '../components/Toggle'

const TOOLS = ['n8n', 'claude-code', 'cs-basics']

const emptyForm = {
  note: '', strongPoints: '', weakPoints: '', tomorrowFocus: '',
  energyLevel: 7, disciplineLevel: 7,
  sleepHours: 7, sleepBefore2330: false, workout: false, workoutMin: 0,
  nutritionQuality: 'ok',
  learningTool: '', learningTopic: '', learningBuilt: false, learningMin: 0, learningMode: 'aktiv',
}

function Slider({ label, value, onChange }) {
  const color = value >= 8 ? 'text-emerald-400' : value >= 5 ? 'text-amber-400' : 'text-red-400'
  return (
    <div>
      <div className="flex justify-between mb-1.5">
        <label className="text-xs text-[#9a9aaa] uppercase tracking-wide">{label}</label>
        <span className={`text-xl font-bold ${color}`}>{value}</span>
      </div>
      <input type="range" min={1} max={10} value={value} onChange={(e) => onChange(+e.target.value)} className="w-full accent-[#7c6af7]" />
    </div>
  )
}

function Field({ label, placeholder, value, onChange, rows = 2 }) {
  return (
    <div>
      <label className="text-xs text-[#9a9aaa] uppercase tracking-wide block mb-1.5">{label}</label>
      <textarea className="w-full bg-[#080810] border border-[#1e1e2e] rounded-xl px-3 py-2.5 text-sm text-white placeholder-[#2a2a3e] focus:outline-none focus:border-[#7c6af7] resize-none" rows={rows} placeholder={placeholder} value={value} onChange={(e) => onChange(e.target.value)} />
    </div>
  )
}

export default function Log({ logs, setLogs }) {
  const todayStr = today()
  const existing = logs.find((l) => l.date === todayStr)
  const [form, setForm] = useState(existing || { ...emptyForm })
  const [saved, setSaved] = useState(!!existing)
  const [expanded, setExpanded] = useState(null)

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
    <div className="p-4 md:p-6 space-y-5">
      <div>
        <h1 className="text-2xl font-bold text-white">Daily Log</h1>
        <p className="text-sm text-[#9a9aaa] mt-1">
          {new Date().toLocaleDateString('de-DE', { weekday: 'long', day: 'numeric', month: 'long' })}
        </p>
      </div>

      <Card>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-sm font-semibold text-white">Performance</h2>
          {saved && <span className="text-xs text-emerald-400">✓ Gespeichert</span>}
        </div>

        <div className="grid grid-cols-2 gap-5 mb-5">
          <Slider label="Energie" value={form.energyLevel} onChange={(v) => s('energyLevel', v)} />
          <Slider label="Disziplin" value={form.disciplineLevel} onChange={(v) => s('disciplineLevel', v)} />
        </div>

        {/* Health */}
        <div className="border-t border-[#1e1e2e] pt-4 mb-4">
          <div className="text-xs text-[#9a9aaa] uppercase tracking-widest mb-3">Health</div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Toggle checked={form.sleepBefore2330} onChange={() => s('sleepBefore2330', !form.sleepBefore2330)} size="sm" />
                <span className="text-sm text-white">Schlaf vor 23:30</span>
              </div>
              <div className="flex items-center gap-2">
                <input type="number" min={0} max={12} step={0.5}
                  className="w-16 bg-[#080810] border border-[#1e1e2e] rounded-lg px-2 py-1 text-xs text-white focus:outline-none focus:border-[#7c6af7] text-center"
                  value={form.sleepHours} onChange={(e) => s('sleepHours', +e.target.value)} />
                <span className="text-xs text-[#9a9aaa]">h</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Toggle checked={form.workout} onChange={() => s('workout', !form.workout)} size="sm" />
                <span className="text-sm text-white">Bewegung</span>
              </div>
              {form.workout && (
                <div className="flex items-center gap-2">
                  <input type="number" min={0} max={180}
                    className="w-16 bg-[#080810] border border-[#1e1e2e] rounded-lg px-2 py-1 text-xs text-white focus:outline-none focus:border-[#7c6af7] text-center"
                    value={form.workoutMin} onChange={(e) => s('workoutMin', +e.target.value)} />
                  <span className="text-xs text-[#9a9aaa]">min</span>
                </div>
              )}
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-white">Ernährung</span>
              <div className="flex gap-2">
                {['gut', 'ok', 'schlecht'].map((q) => (
                  <button key={q} onClick={() => s('nutritionQuality', q)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-medium border transition-colors ${
                      form.nutritionQuality === q
                        ? q === 'gut' ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400'
                          : q === 'ok' ? 'bg-amber-500/20 border-amber-500 text-amber-400'
                          : 'bg-red-500/20 border-red-500 text-red-400'
                        : 'bg-[#080810] border-[#1e1e2e] text-[#9a9aaa]'
                    }`}>{q}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Learning */}
        <div className="border-t border-[#1e1e2e] pt-4 mb-4">
          <div className="text-xs text-[#9a9aaa] uppercase tracking-widest mb-3">Learning</div>
          <div className="space-y-3">
            <div>
              <div className="text-xs text-[#9a9aaa] mb-1.5">Tool</div>
              <div className="flex gap-2 flex-wrap">
                <button onClick={() => s('learningTool', '')}
                  className={`px-2.5 py-1 rounded-lg text-xs border transition-colors ${!form.learningTool ? 'bg-[#1e2030] border-[#9a9aaa] text-white' : 'bg-[#080810] border-[#1e1e2e] text-[#9a9aaa]'}`}>
                  Keines
                </button>
                {TOOLS.map((t) => (
                  <button key={t} onClick={() => s('learningTool', t)}
                    className={`px-2.5 py-1 rounded-lg text-xs border transition-colors ${form.learningTool === t ? 'bg-[#7c6af7]/20 border-[#7c6af7] text-[#7c6af7]' : 'bg-[#080810] border-[#1e1e2e] text-[#9a9aaa]'}`}>
                    {t}
                  </button>
                ))}
              </div>
            </div>
            {form.learningTool && (
              <>
                <input className="w-full bg-[#080810] border border-[#1e1e2e] rounded-xl px-3 py-2 text-sm text-white placeholder-[#2a2a3e] focus:outline-none focus:border-[#7c6af7]"
                  placeholder="Thema / Was gelernt?" value={form.learningTopic} onChange={(e) => s('learningTopic', e.target.value)} />
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    <Toggle checked={form.learningBuilt} onChange={() => s('learningBuilt', !form.learningBuilt)} size="sm" />
                    <span className="text-xs text-white">Etwas gebaut</span>
                  </div>
                  <div className="flex items-center gap-2 ml-auto">
                    <input type="number" min={0} max={300}
                      className="w-16 bg-[#080810] border border-[#1e1e2e] rounded-lg px-2 py-1 text-xs text-white focus:outline-none focus:border-[#7c6af7] text-center"
                      value={form.learningMin} onChange={(e) => s('learningMin', +e.target.value)} />
                    <span className="text-xs text-[#9a9aaa]">min</span>
                  </div>
                  <div className="flex gap-1">
                    {['aktiv', 'passiv'].map((m) => (
                      <button key={m} onClick={() => s('learningMode', m)}
                        className={`px-2.5 py-1 rounded-lg text-xs border transition-colors ${form.learningMode === m ? m === 'aktiv' ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : 'bg-amber-500/20 border-amber-500 text-amber-400' : 'bg-[#080810] border-[#1e1e2e] text-[#9a9aaa]'}`}>
                        {m}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Reflexion */}
        <div className="border-t border-[#1e1e2e] pt-4 space-y-3">
          <div className="text-xs text-[#9a9aaa] uppercase tracking-widest mb-1">Reflexion</div>
          <Field label="Was war stark?" placeholder="Erfolge, gute Entscheidungen …" value={form.strongPoints} onChange={(v) => s('strongPoints', v)} />
          <Field label="Was war schwach?" placeholder="Fehler, Ablenkungen …" value={form.weakPoints} onChange={(v) => s('weakPoints', v)} />
          <Field label="ONE Thing morgen" placeholder="Eine konkrete Sache" value={form.tomorrowFocus} onChange={(v) => s('tomorrowFocus', v)} rows={1} />
          <Field label="Notiz" placeholder="Wie war der Tag insgesamt?" value={form.note} onChange={(v) => s('note', v)} />
        </div>

        <div className="flex justify-end mt-4">
          <Button onClick={save} size="lg">Speichern</Button>
        </div>
      </Card>

      {past.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-white mb-3">Vergangene Einträge</h2>
          <div className="space-y-2">
            {past.map((l) => (
              <Card key={l.id} onClick={() => setExpanded(expanded === l.date ? null : l.date)}>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-white">{formatDate(l.date)}</span>
                  <div className="flex gap-3 text-xs text-[#9a9aaa]">
                    <span className={l.energyLevel >= 7 ? 'text-emerald-400' : l.energyLevel >= 5 ? 'text-amber-400' : 'text-red-400'}>E:{l.energyLevel}</span>
                    <span className={l.disciplineLevel >= 7 ? 'text-emerald-400' : l.disciplineLevel >= 5 ? 'text-amber-400' : 'text-red-400'}>D:{l.disciplineLevel}</span>
                    {l.sleepBefore2330 && <span className="text-emerald-400">Schlaf✓</span>}
                    {l.workout && <span className="text-emerald-400">Sport✓</span>}
                    {l.learningTool && <span className={l.learningMode === 'aktiv' ? 'text-[#7c6af7]' : 'text-amber-400'}>{l.learningTool}</span>}
                  </div>
                </div>
                {expanded === l.date && (
                  <div className="mt-3 pt-3 border-t border-[#1e1e2e] space-y-1.5">
                    {l.strongPoints && <p className="text-xs text-[#9a9aaa]"><span className="text-emerald-400">+ </span>{l.strongPoints}</p>}
                    {l.weakPoints && <p className="text-xs text-[#9a9aaa]"><span className="text-red-400">− </span>{l.weakPoints}</p>}
                    {l.tomorrowFocus && <p className="text-xs text-[#9a9aaa]"><span className="text-[#7c6af7]">→ </span>{l.tomorrowFocus}</p>}
                    {l.note && <p className="text-xs text-[#9a9aaa] mt-1">{l.note}</p>}
                  </div>
                )}
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
