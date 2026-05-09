import { useState } from 'react'
import { today } from '../utils/dateUtils'
import Card from '../components/Card'
import Button from '../components/Button'
import Modal from '../components/Modal'
import RingProgress from '../components/RingProgress'

const TARGET = 500000

function DonutChart({ value, max, size = 140, label, sublabel }) {
  const pct = max > 0 ? Math.min(100, (value / max) * 100) : 0
  const r = 52; const cx = size / 2; const cy = size / 2
  const circumference = 2 * Math.PI * r
  const dash = (pct / 100) * circumference
  return (
    <div className="relative inline-flex items-center justify-center flex-shrink-0" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="absolute">
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#1e1e2e" strokeWidth={10} />
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="url(#grad)" strokeWidth={10}
          strokeLinecap="round" strokeDasharray={`${dash} ${circumference - dash}`}
          transform={`rotate(-90 ${cx} ${cy})`} />
        <defs>
          <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#7c6af7" />
            <stop offset="100%" stopColor="#a78bfa" />
          </linearGradient>
        </defs>
      </svg>
      <div className="relative z-10 text-center">
        <div className="text-2xl font-bold text-white">{Math.round(pct)}%</div>
        <div className="text-xs text-[#4a4a6a]">{sublabel}</div>
      </div>
    </div>
  )
}

export default function Finance({ finance, setFinance }) {
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState({ monthlyIncome: '', monthlyExpenses: '', savingsTotal: '' })

  const sorted = [...finance].sort((a, b) => b.date.localeCompare(a.date))
  const latest = sorted[0]
  const prev = sorted[1]
  const savings = latest?.savingsTotal ?? 0
  const distance = TARGET - savings
  const pct = Math.min(100, Math.round((savings / TARGET) * 100))
  const monthlyNet = (latest?.monthlyIncome ?? 0) - (latest?.monthlyExpenses ?? 0)
  const monthsToGoal = monthlyNet > 0 ? Math.ceil(distance / monthlyNet) : null
  const savingsDiff = prev ? savings - prev.savingsTotal : null

  const saveEntry = () => {
    const entry = { id: crypto.randomUUID(), date: today().slice(0, 7) + '-01', monthlyIncome: parseFloat(form.monthlyIncome) || 0, monthlyExpenses: parseFloat(form.monthlyExpenses) || 0, savingsTotal: parseFloat(form.savingsTotal) || 0 }
    setFinance((prev) => [...prev.filter((f) => f.date !== entry.date), entry])
    setShowModal(false)
    setForm({ monthlyIncome: '', monthlyExpenses: '', savingsTotal: '' })
  }

  return (
    <div className="p-4 md:p-6 space-y-4 max-w-lg mx-auto md:max-w-none">
      <div className="flex items-start justify-between pt-2">
        <div>
          <p className="text-xs text-[#4a4a6a] uppercase tracking-widest mb-1">Finanzen</p>
          <h1 className="text-3xl font-bold text-white">500k Ziel</h1>
        </div>
        <Button size="sm" onClick={() => setShowModal(true)}>Update</Button>
      </div>

      {/* Hero Balance */}
      <Card glow>
        <div className="flex items-center gap-5">
          <DonutChart value={savings} max={TARGET} sublabel="erreicht" />
          <div className="flex-1">
            <div className="text-xs text-[#4a4a6a] uppercase tracking-widest mb-1">Gespartes Vermögen</div>
            <div className="text-3xl font-bold text-white mb-1">{savings.toLocaleString('de-DE')} €</div>
            {savingsDiff !== null && (
              <div className={`text-sm font-semibold ${savingsDiff >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                {savingsDiff >= 0 ? '+' : ''}{savingsDiff.toLocaleString('de-DE')} € vs. Vormonat
              </div>
            )}
            <div className="text-xs text-[#4a4a6a] mt-1">
              Noch <span className="text-white font-semibold">{distance.toLocaleString('de-DE')} €</span> bis 500k
            </div>
          </div>
        </div>
        {monthsToGoal && (
          <div className="mt-3 pt-3 border-t border-[#1e1e2e] flex justify-between text-xs text-[#4a4a6a]">
            <span>Tempo bei aktuellem Netto</span>
            <span className="text-white font-semibold">~{monthsToGoal} Monate</span>
          </div>
        )}
      </Card>

      {/* Monthly Stats */}
      {latest && (
        <div className="grid grid-cols-2 gap-3">
          <Card>
            <div className="text-xs text-[#4a4a6a] uppercase tracking-widest mb-2">Einnahmen</div>
            <div className="text-2xl font-bold text-emerald-400">{latest.monthlyIncome.toLocaleString('de-DE')} €</div>
            <div className="text-xs text-[#4a4a6a] mt-1">diesen Monat</div>
          </Card>
          <Card>
            <div className="text-xs text-[#4a4a6a] uppercase tracking-widest mb-2">Ausgaben</div>
            <div className="text-2xl font-bold text-red-400">{latest.monthlyExpenses.toLocaleString('de-DE')} €</div>
            <div className="text-xs text-[#4a4a6a] mt-1">diesen Monat</div>
          </Card>
          <Card>
            <div className="text-xs text-[#4a4a6a] uppercase tracking-widest mb-2">Netto / Monat</div>
            <div className={`text-2xl font-bold ${monthlyNet >= 0 ? 'text-[#7c6af7]' : 'text-red-400'}`}>
              {monthlyNet >= 0 ? '+' : ''}{monthlyNet.toLocaleString('de-DE')} €
            </div>
            <div className="text-xs text-[#4a4a6a] mt-1">Sparrate</div>
          </Card>
          <Card>
            <div className="text-xs text-[#4a4a6a] uppercase tracking-widest mb-2">Gesamt</div>
            <div className="text-2xl font-bold text-white">{pct}%</div>
            <div className="text-xs text-[#4a4a6a] mt-1">von 500k</div>
          </Card>
        </div>
      )}

      {/* Verlauf */}
      {sorted.length > 1 && (
        <Card>
          <div className="text-xs text-[#4a4a6a] uppercase tracking-widest mb-3">Verlauf</div>
          <div className="space-y-2">
            {sorted.slice(0, 5).map((f) => {
              const net = f.monthlyIncome - f.monthlyExpenses
              const p = Math.round((f.savingsTotal / TARGET) * 100)
              return (
                <div key={f.id} className="flex items-center gap-3 py-1.5 border-b border-[#1e1e2e] last:border-0">
                  <span className="text-xs text-[#4a4a6a] w-16">{f.date.slice(0, 7)}</span>
                  <div className="flex-1 h-1 bg-[#1e1e2e] rounded-full overflow-hidden">
                    <div className="h-full bg-[#7c6af7]/60 rounded-full" style={{ width: `${p}%` }} />
                  </div>
                  <span className="text-xs text-white w-20 text-right">{f.savingsTotal.toLocaleString('de-DE')} €</span>
                  <span className={`text-xs font-semibold w-16 text-right ${net >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {net >= 0 ? '+' : ''}{net.toLocaleString('de-DE')}
                  </span>
                </div>
              )
            })}
          </div>
        </Card>
      )}

      {showModal && (
        <Modal title="Monatliche Zahlen" onClose={() => setShowModal(false)}>
          <div className="space-y-4">
            {[
              { key: 'savingsTotal', label: 'Gesamtvermögen (€)', placeholder: '24500' },
              { key: 'monthlyIncome', label: 'Einnahmen (€)', placeholder: '3200' },
              { key: 'monthlyExpenses', label: 'Ausgaben (€)', placeholder: '1800' },
            ].map(({ key, label, placeholder }) => (
              <div key={key}>
                <label className="text-xs text-[#9a9aaa] uppercase tracking-wide block mb-1.5">{label}</label>
                <input type="number"
                  className="w-full bg-[#080810] border border-[#2a2a3e] rounded-xl px-3 py-2.5 text-sm text-white placeholder-[#2a2a3e] focus:outline-none focus:border-[#7c6af7]"
                  placeholder={placeholder} value={form[key]} onChange={(e) => setForm((p) => ({ ...p, [key]: e.target.value }))} />
              </div>
            ))}
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="secondary" onClick={() => setShowModal(false)}>Abbrechen</Button>
              <Button onClick={saveEntry}>Speichern</Button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  )
}
