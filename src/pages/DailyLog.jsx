import { useState } from 'react'
import { today, formatDate } from '../utils/dateUtils'
import Card from '../components/Card'
import Button from '../components/Button'

function LevelSlider({ label, value, onChange }) {
  const color = value >= 8 ? 'text-green-400' : value >= 5 ? 'text-amber-400' : 'text-red-400'
  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <label className="text-xs text-zinc-400 uppercase tracking-wide">{label}</label>
        <span className={`text-2xl font-bold ${color}`}>{value}</span>
      </div>
      <input
        type="range"
        min={1}
        max={10}
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        className="w-full accent-indigo-500"
      />
      <div className="flex justify-between text-xs text-zinc-600 mt-1">
        <span>1</span>
        <span>5</span>
        <span>10</span>
      </div>
    </div>
  )
}

function TextArea({ label, placeholder, value, onChange }) {
  return (
    <div>
      <label className="text-xs text-zinc-400 uppercase tracking-wide block mb-1.5">{label}</label>
      <textarea
        className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-100 placeholder-zinc-600 focus:outline-none focus:border-indigo-500 resize-none"
        rows={3}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  )
}

const emptyForm = {
  note: '',
  strongPoints: '',
  weakPoints: '',
  tomorrowFocus: '',
  energyLevel: 7,
  disciplineLevel: 7,
}

export default function DailyLog({ dailyLogs, setDailyLogs }) {
  const todayStr = today()
  const existing = dailyLogs.find((l) => l.date === todayStr)
  const [form, setForm] = useState(existing || { ...emptyForm })
  const [saved, setSaved] = useState(!!existing)
  const [expanded, setExpanded] = useState(null)

  const set = (key, val) => setForm((p) => ({ ...p, [key]: val }))

  const save = () => {
    if (existing) {
      setDailyLogs((prev) => prev.map((l) => (l.date === todayStr ? { ...l, ...form } : l)))
    } else {
      setDailyLogs((prev) => [
        ...prev,
        { id: crypto.randomUUID(), date: todayStr, ...form },
      ])
    }
    setSaved(true)
  }

  const past = dailyLogs
    .filter((l) => l.date !== todayStr)
    .sort((a, b) => b.date.localeCompare(a.date))

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-zinc-50">Daily Log</h1>
        <p className="text-sm text-zinc-400 mt-1">
          {new Date().toLocaleDateString('de-DE', {
            weekday: 'long',
            day: 'numeric',
            month: 'long',
          })}
        </p>
      </div>

      <Card>
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-sm font-semibold text-zinc-200">Heute</h2>
          {saved && <span className="text-xs text-green-400">✓ Gespeichert</span>}
        </div>

        <div className="grid grid-cols-2 gap-6 mb-5">
          <LevelSlider
            label="Energie (1–10)"
            value={form.energyLevel}
            onChange={(v) => set('energyLevel', v)}
          />
          <LevelSlider
            label="Disziplin (1–10)"
            value={form.disciplineLevel}
            onChange={(v) => set('disciplineLevel', v)}
          />
        </div>

        <div className="space-y-4">
          <TextArea
            label="Tagesnotiz"
            placeholder="Wie war dein Tag allgemein?"
            value={form.note}
            onChange={(v) => set('note', v)}
          />
          <TextArea
            label="Was war heute stark?"
            placeholder="Erfolge, gute Entscheidungen, Fortschritte …"
            value={form.strongPoints}
            onChange={(v) => set('strongPoints', v)}
          />
          <TextArea
            label="Was war schwach?"
            placeholder="Fehler, Ablenkungen, verpasste Chancen …"
            value={form.weakPoints}
            onChange={(v) => set('weakPoints', v)}
          />
          <TextArea
            label="Fokus für morgen"
            placeholder="Eine konkrete Sache, die morgen wichtig ist"
            value={form.tomorrowFocus}
            onChange={(v) => set('tomorrowFocus', v)}
          />
        </div>

        <div className="flex justify-end mt-5">
          <Button onClick={save} size="lg">
            Speichern
          </Button>
        </div>
      </Card>

      {past.length > 0 && (
        <div>
          <h2 className="text-sm font-semibold text-zinc-300 mb-3">Vergangene Einträge</h2>
          <div className="space-y-2">
            {past.map((l) => (
              <Card key={l.id} onClick={() => setExpanded(expanded === l.date ? null : l.date)}>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-zinc-200">{formatDate(l.date)}</span>
                  <div className="flex gap-4 text-xs text-zinc-400">
                    <span>
                      Energie: <span className="text-zinc-200">{l.energyLevel}/10</span>
                    </span>
                    <span>
                      Disziplin: <span className="text-zinc-200">{l.disciplineLevel}/10</span>
                    </span>
                    <span className="text-zinc-600">{expanded === l.date ? '▲' : '▼'}</span>
                  </div>
                </div>
                {expanded === l.date && (
                  <div className="mt-3 pt-3 border-t border-zinc-800 space-y-2">
                    {l.note && <p className="text-xs text-zinc-300">{l.note}</p>}
                    {l.strongPoints && (
                      <div>
                        <span className="text-xs text-green-400 font-medium">+ </span>
                        <span className="text-xs text-zinc-300">{l.strongPoints}</span>
                      </div>
                    )}
                    {l.weakPoints && (
                      <div>
                        <span className="text-xs text-red-400 font-medium">− </span>
                        <span className="text-xs text-zinc-300">{l.weakPoints}</span>
                      </div>
                    )}
                    {l.tomorrowFocus && (
                      <div>
                        <span className="text-xs text-indigo-400 font-medium">→ </span>
                        <span className="text-xs text-zinc-300">{l.tomorrowFocus}</span>
                      </div>
                    )}
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
