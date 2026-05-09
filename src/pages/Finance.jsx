import { useState } from 'react'
import { today } from '../utils/dateUtils'
import Card from '../components/Card'
import Button from '../components/Button'
import Modal from '../components/Modal'
import ProgressBar from '../components/ProgressBar'

const TARGET = 500000

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
    const entry = {
      id: crypto.randomUUID(),
      date: today().slice(0, 7) + '-01',
      monthlyIncome: parseFloat(form.monthlyIncome) || 0,
      monthlyExpenses: parseFloat(form.monthlyExpenses) || 0,
      savingsTotal: parseFloat(form.savingsTotal) || 0,
    }
    setFinance((prev) => [...prev.filter((f) => f.date !== entry.date), entry])
    setShowModal(false)
    setForm({ monthlyIncome: '', monthlyExpenses: '', savingsTotal: '' })
  }

  return (
    <div className="p-4 md:p-6 space-y-5">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Finance</h1>
          <p className="text-sm text-[#9a9aaa] mt-1">Distanz zum 500k-Ziel</p>
        </div>
        <Button size="sm" onClick={() => setShowModal(true)}>Update</Button>
      </div>

      {/* Hero: Distanz */}
      <Card className="border-[#7c6af7]/20">
        <div className="text-xs text-[#9a9aaa] uppercase tracking-widest mb-2">Noch zu sparen</div>
        <div className="text-4xl font-bold text-white mb-1">
          {distance.toLocaleString('de-DE')} <span className="text-xl text-[#9a9aaa]">€</span>
        </div>
        <div className="text-sm text-[#9a9aaa] mb-4">
          {savings.toLocaleString('de-DE')} € von 500.000 € ({pct}%)
          {savingsDiff !== null && (
            <span className={`ml-2 ${savingsDiff >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {savingsDiff >= 0 ? '+' : ''}{savingsDiff.toLocaleString('de-DE')} € vs. Vormonat
            </span>
          )}
        </div>
        <ProgressBar value={savings} max={TARGET} colorClass="bg-[#7c6af7]" />
        {monthsToGoal !== null && (
          <p className="text-xs text-[#9a9aaa] mt-2">
            Bei aktuellem Tempo: <span className="text-white font-medium">~{monthsToGoal} Monate</span> ({Math.ceil(monthsToGoal / 12)} Jahre)
          </p>
        )}
      </Card>

      {/* Monatliche Stats */}
      {latest && (
        <div className="grid grid-cols-2 gap-3">
          <Card>
            <div className="text-xs text-[#9a9aaa] uppercase tracking-widest mb-2">Einnahmen</div>
            <div className="text-2xl font-bold text-emerald-400">{latest.monthlyIncome.toLocaleString('de-DE')} €</div>
            <div className="text-xs text-[#9a9aaa] mt-1">diesen Monat</div>
          </Card>
          <Card>
            <div className="text-xs text-[#9a9aaa] uppercase tracking-widest mb-2">Ausgaben</div>
            <div className="text-2xl font-bold text-red-400">{latest.monthlyExpenses.toLocaleString('de-DE')} €</div>
            <div className="text-xs text-[#9a9aaa] mt-1">diesen Monat</div>
          </Card>
          <Card>
            <div className="text-xs text-[#9a9aaa] uppercase tracking-widest mb-2">Netto</div>
            <div className={`text-2xl font-bold ${monthlyNet >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {monthlyNet >= 0 ? '+' : ''}{monthlyNet.toLocaleString('de-DE')} €
            </div>
            <div className="text-xs text-[#9a9aaa] mt-1">Sparrate</div>
          </Card>
          <Card>
            <div className="text-xs text-[#9a9aaa] uppercase tracking-widest mb-2">Gespart</div>
            <div className="text-2xl font-bold text-white">{savings.toLocaleString('de-DE')} €</div>
            <div className="text-xs text-[#9a9aaa] mt-1">gesamt</div>
          </Card>
        </div>
      )}

      {/* Verlauf */}
      {sorted.length > 1 && (
        <Card>
          <h2 className="text-sm font-semibold text-white mb-3">Verlauf</h2>
          <div className="space-y-2">
            {sorted.slice(0, 6).map((f) => {
              const net = f.monthlyIncome - f.monthlyExpenses
              return (
                <div key={f.id} className="flex items-center justify-between py-1 border-b border-[#1e2030] last:border-0">
                  <span className="text-xs text-[#9a9aaa]">{f.date.slice(0, 7)}</span>
                  <span className="text-xs text-white">{f.savingsTotal.toLocaleString('de-DE')} €</span>
                  <span className={`text-xs font-medium ${net >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                    {net >= 0 ? '+' : ''}{net.toLocaleString('de-DE')} €/Mo
                  </span>
                </div>
              )
            })}
          </div>
        </Card>
      )}

      {showModal && (
        <Modal title="Monatliche Zahlen updaten" onClose={() => setShowModal(false)}>
          <div className="space-y-4">
            {[
              { key: 'savingsTotal', label: 'Gesamtvermögen (€)', placeholder: '24500' },
              { key: 'monthlyIncome', label: 'Einnahmen diesen Monat (€)', placeholder: '3200' },
              { key: 'monthlyExpenses', label: 'Ausgaben diesen Monat (€)', placeholder: '1800' },
            ].map(({ key, label, placeholder }) => (
              <div key={key}>
                <label className="text-xs text-[#9a9aaa] uppercase tracking-wide block mb-1.5">{label}</label>
                <input
                  type="number"
                  className="w-full bg-[#0a0b10] border border-[#1e2030] rounded-xl px-3 py-2.5 text-sm text-white placeholder-[#1e2030] focus:outline-none focus:border-[#7c6af7]"
                  placeholder={placeholder}
                  value={form[key]}
                  onChange={(e) => setForm((p) => ({ ...p, [key]: e.target.value }))}
                />
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
