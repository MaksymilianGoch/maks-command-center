import { useState } from 'react'
import { today } from '../utils/dateUtils'
import Button from '../components/Button'
import Modal from '../components/Modal'
import QuoteBanner from '../components/QuoteBanner'
import { QUOTES } from '../data/quotes'

const TARGET = 500000

function DonutChart({ value, max }) {
  const pct = max > 0 ? Math.min(100, (value / max) * 100) : 0
  const r = 52; const cx = 70; const cy = 70
  const c = 2 * Math.PI * r
  const dash = (pct / 100) * c
  return (
    <div className="relative inline-flex items-center justify-center flex-shrink-0" style={{ width: 140, height: 140 }}>
      <svg width={140} height={140} className="absolute">
        <defs>
          <linearGradient id="donut-grad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#aac7ff" />
            <stop offset="100%" stopColor="#3e90ff" />
          </linearGradient>
        </defs>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="#31353d" strokeWidth={12} />
        <circle cx={cx} cy={cy} r={r} fill="none" stroke="url(#donut-grad)" strokeWidth={12}
          strokeLinecap="round" strokeDasharray={`${dash} ${c - dash}`}
          transform={`rotate(-90 ${cx} ${cy})`} />
      </svg>
      <div className="relative z-10 text-center">
        <div className="text-2xl font-bold text-on-surface">{Math.round(pct)}%</div>
        <div className="text-xs text-on-surface-variant">erreicht</div>
      </div>
    </div>
  )
}

export default function Finance({ finance, setFinance }) {
  const [showModal, setShowModal] = useState(false)
  const [editEntry, setEditEntry] = useState(null)
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

  const openNew = () => {
    setEditEntry(null)
    setForm({ monthlyIncome: '', monthlyExpenses: '', savingsTotal: '' })
    setShowModal(true)
  }

  const openEdit = (entry) => {
    setEditEntry(entry)
    setForm({ monthlyIncome: entry.monthlyIncome, monthlyExpenses: entry.monthlyExpenses, savingsTotal: entry.savingsTotal })
    setShowModal(true)
  }

  const deleteEntry = (id) => setFinance((prev) => prev.filter((f) => f.id !== id))

  const saveEntry = () => {
    if (editEntry) {
      setFinance((prev) => prev.map((f) => f.id === editEntry.id
        ? { ...f, monthlyIncome: parseFloat(form.monthlyIncome) || 0, monthlyExpenses: parseFloat(form.monthlyExpenses) || 0, savingsTotal: parseFloat(form.savingsTotal) || 0 }
        : f))
    } else {
      const entry = {
        id: crypto.randomUUID(),
        date: today().slice(0, 7) + '-01',
        monthlyIncome: parseFloat(form.monthlyIncome) || 0,
        monthlyExpenses: parseFloat(form.monthlyExpenses) || 0,
        savingsTotal: parseFloat(form.savingsTotal) || 0,
      }
      setFinance((prev) => [...prev.filter((f) => f.date !== entry.date), entry])
    }
    setShowModal(false)
    setForm({ monthlyIncome: '', monthlyExpenses: '', savingsTotal: '' })
    setEditEntry(null)
  }

  return (
    <div className="space-y-6">
      {/* Hero Balance */}
      <section className="text-center py-4">
        <p className="text-xs font-medium text-on-surface-variant uppercase tracking-widest mb-2">Gesamtvermögen</p>
        <h1 className="text-5xl font-bold tracking-tight text-on-surface mb-4">
          {savings.toLocaleString('de-DE')} €
        </h1>
        <div className="flex justify-center items-center gap-3">
          {savingsDiff !== null && (
            <span className={`flex items-center text-sm px-3 py-1 rounded-full ${savingsDiff >= 0 ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'}`}>
              <span className="material-symbols-outlined text-sm mr-1">{savingsDiff >= 0 ? 'trending_up' : 'trending_down'}</span>
              {savingsDiff >= 0 ? '+' : ''}{savingsDiff.toLocaleString('de-DE')} €
            </span>
          )}
          <span className="text-on-surface-variant text-sm">vs. Vormonat</span>
          <Button size="sm" onClick={openNew}>+ Eintrag</Button>
        </div>
      </section>

      <QuoteBanner quote={QUOTES.finance} />

      {/* Income / Expenses */}
      <div className="grid grid-cols-2 gap-4">
        <div className="glass-card rounded-2xl p-5 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="material-symbols-outlined text-primary bg-primary/10 p-2 rounded-full text-lg">arrow_downward</span>
            <span className="text-xs text-on-surface-variant">Einnahmen</span>
          </div>
          <p className="text-2xl font-semibold text-on-surface mt-2">{(latest?.monthlyIncome ?? 0).toLocaleString('de-DE')} €</p>
        </div>
        <div className="glass-card rounded-2xl p-5 flex flex-col gap-2">
          <div className="flex items-center justify-between">
            <span className="material-symbols-outlined text-tertiary bg-tertiary/10 p-2 rounded-full text-lg">arrow_upward</span>
            <span className="text-xs text-on-surface-variant">Ausgaben</span>
          </div>
          <p className="text-2xl font-semibold text-on-surface mt-2">{(latest?.monthlyExpenses ?? 0).toLocaleString('de-DE')} €</p>
        </div>
      </div>

      {/* Donut + Goal */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
        <div className="glass-card rounded-2xl p-6 md:col-span-3">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-on-surface">500k Ziel</h3>
            <span className="text-xs text-on-surface-variant">Fortschritt</span>
          </div>
          <div className="flex items-center justify-around gap-6">
            <DonutChart value={savings} max={TARGET} />
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-primary" />
                <span className="text-sm text-on-surface-variant">Gespart</span>
                <span className="text-sm font-bold ml-auto">{savings.toLocaleString('de-DE')} €</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-3 h-3 rounded-full bg-surface-variant" />
                <span className="text-sm text-on-surface-variant">Verbleibend</span>
                <span className="text-sm font-bold ml-auto">{distance.toLocaleString('de-DE')} €</span>
              </div>
              {monthlyNet > 0 && (
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-tertiary" />
                  <span className="text-sm text-on-surface-variant">Netto/Mo</span>
                  <span className="text-sm font-bold ml-auto text-green-400">+{monthlyNet.toLocaleString('de-DE')} €</span>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="glass-card rounded-2xl p-6 md:col-span-2 flex flex-col justify-between">
          <div>
            <h3 className="text-xl font-semibold text-on-surface mb-2">Tempo-Kalkulation</h3>
            <p className="text-sm text-on-surface-variant">Bei aktuellem Netto-Sparrate</p>
          </div>
          <div className="mt-6">
            <div className="flex justify-between items-end mb-3">
              <span className="text-4xl font-bold text-on-surface">
                {monthsToGoal ? `~${monthsToGoal}` : '∞'}
              </span>
              <span className="text-sm text-on-surface-variant">Monate</span>
            </div>
            <div className="w-full bg-surface-variant h-3 rounded-full overflow-hidden">
              <div className="h-full rounded-full bg-gradient-to-r from-primary to-primary-container" style={{ width: `${pct}%` }} />
            </div>
            {monthsToGoal && (
              <p className="text-xs text-primary mt-3 flex items-center gap-1">
                <span className="material-symbols-outlined text-sm">info</span>
                {Math.ceil(monthsToGoal / 12)} Jahre bis zum Ziel
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Verlauf */}
      {sorted.length > 0 && (
        <div className="glass-card rounded-2xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-xl font-semibold text-on-surface">Verlauf</h3>
            <span className="text-xs text-on-surface-variant">Tippen zum Bearbeiten</span>
          </div>
          <div className="space-y-3">
            {sorted.slice(0, 6).map((f) => {
              const net = f.monthlyIncome - f.monthlyExpenses
              return (
                <div key={f.id} onClick={() => openEdit(f)}
                  className="glass-card rounded-xl flex items-center justify-between hover:bg-surface-container-high transition-all cursor-pointer group" style={{ padding: '1rem' }}>
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-surface-container-highest flex items-center justify-center">
                      <span className="material-symbols-outlined text-on-surface text-lg">savings</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-on-surface">{f.date.slice(0, 7)}</p>
                      <p className="text-xs text-on-surface-variant">
                        {f.monthlyIncome.toLocaleString('de-DE')} € · {f.monthlyExpenses.toLocaleString('de-DE')} €
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <p className="text-sm font-bold text-on-surface">{f.savingsTotal.toLocaleString('de-DE')} €</p>
                      <p className={`text-xs font-medium ${net >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                        {net >= 0 ? '+' : ''}{net.toLocaleString('de-DE')} €/Mo
                      </p>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <span className="material-symbols-outlined text-primary text-lg">edit</span>
                      <button onClick={(e) => { e.stopPropagation(); deleteEntry(f.id) }}>
                        <span className="material-symbols-outlined text-red-400 text-lg">delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {showModal && (
        <Modal title={editEntry ? `${editEntry.date.slice(0, 7)} bearbeiten` : 'Neuer Eintrag'} onClose={() => { setShowModal(false); setEditEntry(null) }}>
          <div className="space-y-4">
            {[
              { key: 'savingsTotal', label: 'Gesamtvermögen (€)', placeholder: '24500' },
              { key: 'monthlyIncome', label: 'Einnahmen (€)', placeholder: '3200' },
              { key: 'monthlyExpenses', label: 'Ausgaben (€)', placeholder: '1800' },
            ].map(({ key, label, placeholder }) => (
              <div key={key}>
                <label className="text-xs text-on-surface-variant uppercase tracking-wide block mb-1.5">{label}</label>
                <input type="number"
                  className="w-full bg-surface-container-low border border-white/10 rounded-2xl px-4 py-3 text-sm text-on-surface placeholder-outline focus:outline-none focus:border-primary/50"
                  placeholder={placeholder} value={form[key]}
                  onChange={(e) => setForm((p) => ({ ...p, [key]: e.target.value }))} />
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
