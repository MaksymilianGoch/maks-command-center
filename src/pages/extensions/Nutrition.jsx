import { useState } from 'react'
import { useLocalStorage } from '../../hooks/useLocalStorage'
import { sampleNutrition } from '../../data/sampleData'
import { today } from '../../utils/dateUtils'
import Button from '../../components/Button'

// Fallback lokale Datenbank (Werte pro 100g)
const LOCAL_FOODS = [
  { name: 'Ei', cal: 155, p: 13, c: 1, f: 11, unit: 'Stück', unitG: 60 },
  { name: 'Vollkornbrot', cal: 240, p: 8, c: 45, f: 5, unit: 'Scheibe', unitG: 50 },
  { name: 'Tomate', cal: 18, p: 0.9, c: 3.9, f: 0.2, unit: 'Stück', unitG: 120 },
  { name: 'Hähnchenbrust', cal: 165, p: 31, c: 0, f: 3.6, unit: 'g', unitG: 100 },
  { name: 'Haferflocken', cal: 370, p: 13, c: 60, f: 6, unit: 'g', unitG: 100 },
  { name: 'Banane', cal: 89, p: 1, c: 23, f: 0.3, unit: 'Stück', unitG: 120 },
  { name: 'Apfel', cal: 52, p: 0.3, c: 13, f: 0.2, unit: 'Stück', unitG: 180 },
  { name: 'Brokkoli', cal: 35, p: 2.8, c: 6.5, f: 0.4, unit: 'g', unitG: 100 },
  { name: 'Lachs', cal: 208, p: 20, c: 0, f: 13, unit: 'g', unitG: 100 },
  { name: 'Quark', cal: 90, p: 12, c: 3, f: 4, unit: 'g', unitG: 100 },
  { name: 'Reis', cal: 130, p: 2.7, c: 28, f: 0.3, unit: 'g', unitG: 100 },
  { name: 'Nudeln', cal: 120, p: 5, c: 25, f: 1, unit: 'g', unitG: 100 },
  { name: 'Kartoffel', cal: 77, p: 2, c: 17, f: 0.1, unit: 'Stück', unitG: 150 },
  { name: 'Avocado', cal: 97, p: 2, c: 6, f: 8.8, unit: 'Stück', unitG: 150 },
  { name: 'Mandeln', cal: 579, p: 21, c: 22, f: 55, unit: 'g', unitG: 100 },
  { name: 'Milch', cal: 42, p: 3.5, c: 5, f: 3.5, unit: 'ml', unitG: 100 },
  { name: 'Joghurt', cal: 100, p: 3.5, c: 5, f: 3.5, unit: 'g', unitG: 100 },
  { name: 'Käse', cal: 350, p: 25, c: 1.5, f: 28, unit: 'g', unitG: 100 },
  { name: 'Rinderhack', cal: 250, p: 26, c: 0, f: 18, unit: 'g', unitG: 100 },
  { name: 'Spinat', cal: 23, p: 2.9, c: 3.6, f: 0.4, unit: 'g', unitG: 100 },
]

// Parse meal description: "2 Eier, 1 Scheibe Vollkornbrot, 1 Tomate"
function parseMeal(description) {
  const parts = description.split(/[,;]+/).map(s => s.trim()).filter(Boolean)
  let totalCal = 0, totalP = 0, totalC = 0, totalF = 0
  const matched = []

  parts.forEach(part => {
    const numMatch = part.match(/^(\d+\.?\d*)\s*(.+)/)
    if (!numMatch) return
    const qty = parseFloat(numMatch[1])
    const foodName = numMatch[2].toLowerCase().trim()

    const found = LOCAL_FOODS.find(f =>
      f.name.toLowerCase() === foodName ||
      foodName.includes(f.name.toLowerCase()) ||
      f.name.toLowerCase().includes(foodName.split(' ')[0])
    )
    if (found) {
      const factor = (qty * found.unitG) / 100
      const cal = Math.round(found.cal * factor)
      const p = Math.round(found.p * factor * 10) / 10
      const c = Math.round(found.c * factor * 10) / 10
      const f = Math.round(found.f * factor * 10) / 10
      totalCal += cal; totalP += p; totalC += c; totalF += f
      matched.push({ name: found.name, qty, unit: found.unit, cal, p, c, f })
    }
  })

  return { cal: totalCal, protein: totalP, carbs: totalC, fat: totalF, matched }
}

function rateMeal(cal, protein) {
  if (protein >= 20 && cal <= 600) return { label: 'Sehr gut', color: 'text-green-400', bg: 'bg-green-500/10' }
  if (cal > 800) return { label: 'Kalorienreich', color: 'text-red-400', bg: 'bg-red-500/10' }
  if (protein < 10 && cal > 400) return { label: 'Protein fehlt', color: 'text-amber-400', bg: 'bg-amber-500/10' }
  return { label: 'Solide', color: 'text-primary', bg: 'bg-primary/10' }
}

function MacroBar({ cal, protein, carbs, fat, goal = 2500 }) {
  const pct = Math.min(100, Math.round((cal / goal) * 100))
  const color = pct > 110 ? 'bg-red-500' : pct > 90 ? 'bg-amber-500' : 'bg-green-500'
  return (
    <div className="glass-card rounded-2xl p-5 space-y-3">
      <div className="flex justify-between items-center">
        <p className="text-sm font-semibold text-on-surface">Tagesübersicht</p>
        <p className={`text-sm font-bold ${pct > 110 ? 'text-red-400' : pct > 90 ? 'text-amber-400' : 'text-green-400'}`}>
          {cal} / {goal} kcal
        </p>
      </div>
      <div className="w-full h-3 bg-surface-variant rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <div className="grid grid-cols-3 gap-2">
        {[['Protein', protein, 'g', 'text-primary'], ['Kohlenhydrate', carbs, 'g', 'text-tertiary'], ['Fett', fat, 'g', 'text-green-400']].map(([label, val, unit, color]) => (
          <div key={label} className="text-center">
            <p className={`text-base font-bold ${color}`}>{Math.round(val)}{unit}</p>
            <p className="text-xs text-on-surface-variant">{label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function Nutrition() {
  const [entries, setEntries] = useLocalStorage('maks_nutrition_v1', sampleNutrition)
  const [input, setInput] = useState('')
  const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(false)

  const todayStr = today()
  const todayEntry = entries.find(e => e.date === todayStr) || { date: todayStr, meals: [] }

  const totalCal = todayEntry.meals.reduce((s, m) => s + m.calories, 0)
  const totalP = todayEntry.meals.reduce((s, m) => s + m.protein, 0)
  const totalC = todayEntry.meals.reduce((s, m) => s + m.carbs, 0)
  const totalF = todayEntry.meals.reduce((s, m) => s + m.fat, 0)

  const analyze = () => {
    if (!input.trim()) return
    setLoading(true)
    setTimeout(() => {
      const result = parseMeal(input)
      const rating = rateMeal(result.cal, result.protein)
      setPreview({ ...result, rating, description: input })
      setLoading(false)
    }, 300)
  }

  const addMeal = () => {
    if (!preview) return
    const meal = {
      id: crypto.randomUUID(),
      description: preview.description,
      calories: preview.cal,
      protein: preview.protein,
      carbs: preview.carbs,
      fat: preview.fat,
      rating: preview.rating.label,
      time: new Date().toTimeString().slice(0, 5),
    }
    const updated = { ...todayEntry, meals: [...todayEntry.meals, meal] }
    setEntries(prev => [...prev.filter(e => e.date !== todayStr), updated])
    setInput('')
    setPreview(null)
  }

  const deleteMeal = (id) => {
    const updated = { ...todayEntry, meals: todayEntry.meals.filter(m => m.id !== id) }
    setEntries(prev => [...prev.filter(e => e.date !== todayStr), updated])
  }

  return (
    <div className="space-y-5">
      <h2 className="text-xl font-bold text-on-surface">Ernährung</h2>

      <MacroBar cal={totalCal} protein={totalP} carbs={totalC} fat={totalF} />

      {/* Mahlzeit eingeben */}
      <div className="glass-card rounded-2xl p-5 space-y-4">
        <p className="text-sm font-semibold text-on-surface">Mahlzeit analysieren</p>
        <textarea
          className="w-full bg-surface-container-low border border-white/10 rounded-2xl px-4 py-3 text-sm text-on-surface placeholder-outline focus:outline-none focus:border-primary/50 resize-none"
          rows={3}
          placeholder="z.B.: 2 Eier, 1 Scheibe Vollkornbrot, 1 Tomate"
          value={input}
          onChange={(e) => { setInput(e.target.value); setPreview(null) }}
        />
        <Button onClick={analyze} disabled={!input.trim() || loading} className="w-full justify-center">
          {loading ? 'Analysiere …' : 'Analysieren'}
        </Button>

        {/* Preview */}
        {preview && (
          <div className="bg-surface-container rounded-2xl p-4 space-y-3">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold text-on-surface">Ergebnis</p>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${preview.rating.bg} ${preview.rating.color}`}>
                {preview.rating.label}
              </span>
            </div>
            <div className="grid grid-cols-4 gap-2 text-center">
              {[['kcal', preview.cal, 'text-on-surface'], ['Protein', `${Math.round(preview.protein)}g`, 'text-primary'], ['Kohlenhydrate', `${Math.round(preview.carbs)}g`, 'text-tertiary'], ['Fett', `${Math.round(preview.fat)}g`, 'text-green-400']].map(([label, val, color]) => (
                <div key={label} className="bg-surface-container-low rounded-xl p-2">
                  <p className={`text-sm font-bold ${color}`}>{val}</p>
                  <p className="text-[10px] text-on-surface-variant">{label}</p>
                </div>
              ))}
            </div>
            {preview.matched.length > 0 && (
              <div className="space-y-1">
                {preview.matched.map((f, i) => (
                  <div key={i} className="flex justify-between text-xs text-on-surface-variant">
                    <span>{f.qty} {f.unit} {f.name}</span>
                    <span>{f.cal} kcal</span>
                  </div>
                ))}
              </div>
            )}
            {preview.matched.length === 0 && (
              <p className="text-xs text-amber-400">Lebensmittel nicht erkannt. Bitte genauer eingeben.</p>
            )}
            <Button onClick={addMeal} className="w-full justify-center" disabled={preview.cal === 0}>
              Zum Log hinzufügen
            </Button>
          </div>
        )}
      </div>

      {/* Heutige Mahlzeiten */}
      {todayEntry.meals.length > 0 && (
        <div className="glass-card rounded-2xl p-5">
          <p className="text-sm font-semibold text-on-surface mb-4">Heute gegessen</p>
          <div className="space-y-3">
            {todayEntry.meals.map((meal) => (
              <div key={meal.id} className="flex items-start justify-between bg-surface-container-low rounded-xl p-3 group">
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-on-surface truncate">{meal.description}</p>
                  <div className="flex gap-2 mt-1 text-xs text-on-surface-variant">
                    <span>{meal.calories} kcal</span>
                    <span>P: {Math.round(meal.protein)}g</span>
                    <span>K: {Math.round(meal.carbs)}g</span>
                    <span>F: {Math.round(meal.fat)}g</span>
                    {meal.time && <span>· {meal.time}</span>}
                  </div>
                </div>
                <button onClick={() => deleteMeal(meal.id)} className="ml-2 opacity-0 group-hover:opacity-100 transition-opacity text-red-400">
                  <span className="material-symbols-outlined text-lg">delete</span>
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Schnellauswahl */}
      <div className="glass-card rounded-2xl p-4">
        <p className="text-xs text-on-surface-variant uppercase tracking-widest mb-3">Häufige Lebensmittel</p>
        <div className="flex flex-wrap gap-2">
          {LOCAL_FOODS.slice(0, 8).map((food) => (
            <button key={food.name} onClick={() => setInput(prev => prev ? `${prev}, 1 ${food.name}` : `1 ${food.name}`)}
              className="px-3 py-1.5 bg-surface-container text-on-surface-variant hover:bg-surface-container-high rounded-full text-xs transition-all">
              {food.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
