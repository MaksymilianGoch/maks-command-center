import { useState } from 'react'
import { useLocalStorage } from '../../hooks/useLocalStorage'
import { sampleNutrition } from '../../data/sampleData'
import { today } from '../../utils/dateUtils'
import Button from '../../components/Button'

// ─── Lebensmittel-Datenbank (Werte pro 100g) ───────────────────────────────
// unit = natürliche Portion  |  unitG = Gramm pro Einheit
const FOODS = [
  // ── Obst
  { name: 'Apfel',        cat: 'Obst',         cal: 52,  p: 0.3,  c: 14.4, f: 0.2,  unit: 'Stück',   unitG: 180 },
  { name: 'Banane',       cat: 'Obst',         cal: 89,  p: 1.1,  c: 22.8, f: 0.3,  unit: 'Stück',   unitG: 120 },
  { name: 'Orange',       cat: 'Obst',         cal: 47,  p: 0.9,  c: 11.8, f: 0.1,  unit: 'Stück',   unitG: 130 },
  { name: 'Erdbeere',     cat: 'Obst',         cal: 32,  p: 0.7,  c: 7.7,  f: 0.3,  unit: 'Stück',   unitG: 12  },
  { name: 'Traube',       cat: 'Obst',         cal: 69,  p: 0.6,  c: 18.1, f: 0.2,  unit: 'Stück',   unitG: 6   },
  { name: 'Kiwi',         cat: 'Obst',         cal: 61,  p: 1.1,  c: 14.7, f: 0.5,  unit: 'Stück',   unitG: 75  },
  { name: 'Mango',        cat: 'Obst',         cal: 60,  p: 0.8,  c: 15.0, f: 0.4,  unit: 'Stück',   unitG: 200 },
  { name: 'Birne',        cat: 'Obst',         cal: 57,  p: 0.4,  c: 15.2, f: 0.1,  unit: 'Stück',   unitG: 170 },
  { name: 'Heidelbeere',  cat: 'Obst',         cal: 57,  p: 0.7,  c: 14.5, f: 0.3,  unit: 'g',       unitG: 100 },
  { name: 'Ananas',       cat: 'Obst',         cal: 50,  p: 0.5,  c: 13.1, f: 0.1,  unit: 'Scheibe', unitG: 80  },
  // ── Gemüse
  { name: 'Brokkoli',     cat: 'Gemüse',       cal: 35,  p: 2.8,  c: 6.5,  f: 0.4,  unit: 'g',       unitG: 100 },
  { name: 'Spinat',       cat: 'Gemüse',       cal: 23,  p: 2.9,  c: 3.6,  f: 0.4,  unit: 'g',       unitG: 100 },
  { name: 'Tomate',       cat: 'Gemüse',       cal: 18,  p: 0.9,  c: 3.9,  f: 0.2,  unit: 'Stück',   unitG: 120 },
  { name: 'Karotte',      cat: 'Gemüse',       cal: 41,  p: 0.9,  c: 9.6,  f: 0.2,  unit: 'Stück',   unitG: 80  },
  { name: 'Gurke',        cat: 'Gemüse',       cal: 15,  p: 0.7,  c: 3.6,  f: 0.1,  unit: 'Stück',   unitG: 300 },
  { name: 'Paprika',      cat: 'Gemüse',       cal: 31,  p: 1.0,  c: 6.0,  f: 0.3,  unit: 'Stück',   unitG: 150 },
  { name: 'Zucchini',     cat: 'Gemüse',       cal: 17,  p: 1.2,  c: 3.1,  f: 0.3,  unit: 'Stück',   unitG: 200 },
  { name: 'Champignon',   cat: 'Gemüse',       cal: 22,  p: 3.1,  c: 3.3,  f: 0.3,  unit: 'Stück',   unitG: 20  },
  { name: 'Kartoffel',    cat: 'Gemüse',       cal: 77,  p: 2.0,  c: 17.0, f: 0.1,  unit: 'Stück',   unitG: 150 },
  { name: 'Zwiebel',      cat: 'Gemüse',       cal: 40,  p: 1.1,  c: 9.3,  f: 0.1,  unit: 'Stück',   unitG: 100 },
  { name: 'Süßkartoffel', cat: 'Gemüse',       cal: 86,  p: 1.6,  c: 20.1, f: 0.1,  unit: 'Stück',   unitG: 200 },
  { name: 'Avocado',      cat: 'Gemüse',       cal: 160, p: 2.0,  c: 9.0,  f: 15.0, unit: 'Stück',   unitG: 150 },
  // ── Fleisch / Geflügel
  { name: 'Hähnchenbrust',cat: 'Fleisch',      cal: 165, p: 31.0, c: 0.0,  f: 3.6,  unit: 'g',       unitG: 100 },
  { name: 'Putenbrust',   cat: 'Fleisch',      cal: 157, p: 24.0, c: 0.0,  f: 1.0,  unit: 'g',       unitG: 100 },
  { name: 'Hähnchenschenkel', cat: 'Fleisch',  cal: 215, p: 20.0, c: 0.0,  f: 15.0, unit: 'g',       unitG: 100 },
  { name: 'Rindfleisch',  cat: 'Fleisch',      cal: 250, p: 26.0, c: 0.0,  f: 17.0, unit: 'g',       unitG: 100 },
  { name: 'Rinderhack',   cat: 'Fleisch',      cal: 250, p: 26.0, c: 0.0,  f: 18.0, unit: 'g',       unitG: 100 },
  { name: 'Rinderfilet',  cat: 'Fleisch',      cal: 180, p: 28.0, c: 0.0,  f: 8.0,  unit: 'g',       unitG: 100 },
  { name: 'Schweinefilet',cat: 'Fleisch',      cal: 143, p: 22.0, c: 0.0,  f: 6.0,  unit: 'g',       unitG: 100 },
  { name: 'Schweinehack', cat: 'Fleisch',      cal: 263, p: 18.0, c: 0.0,  f: 21.0, unit: 'g',       unitG: 100 },
  { name: 'Speck',        cat: 'Fleisch',      cal: 458, p: 12.0, c: 1.4,  f: 45.0, unit: 'Scheibe', unitG: 20  },
  { name: 'Schinken',     cat: 'Fleisch',      cal: 145, p: 22.0, c: 1.0,  f: 6.0,  unit: 'Scheibe', unitG: 25  },
  // ── Fisch / Meeresfrüchte
  { name: 'Lachs',        cat: 'Fisch',        cal: 208, p: 20.0, c: 0.0,  f: 13.0, unit: 'g',       unitG: 100 },
  { name: 'Thunfisch',    cat: 'Fisch',        cal: 116, p: 26.0, c: 0.0,  f: 1.0,  unit: 'g',       unitG: 100 },
  { name: 'Forelle',      cat: 'Fisch',        cal: 119, p: 20.0, c: 0.0,  f: 4.3,  unit: 'g',       unitG: 100 },
  { name: 'Hering',       cat: 'Fisch',        cal: 158, p: 18.0, c: 0.0,  f: 9.0,  unit: 'g',       unitG: 100 },
  { name: 'Kabeljau',     cat: 'Fisch',        cal: 82,  p: 18.0, c: 0.0,  f: 0.7,  unit: 'g',       unitG: 100 },
  { name: 'Garnelen',     cat: 'Fisch',        cal: 85,  p: 20.0, c: 0.9,  f: 0.5,  unit: 'g',       unitG: 100 },
  { name: 'Sardinen',     cat: 'Fisch',        cal: 208, p: 25.0, c: 0.0,  f: 11.0, unit: 'g',       unitG: 100 },
  // ── Hülsenfrüchte
  { name: 'Linsen',       cat: 'Hülsenfrüchte',cal: 353, p: 25.0, c: 60.0, f: 1.1,  unit: 'g',       unitG: 100 },
  { name: 'Kichererbsen', cat: 'Hülsenfrüchte',cal: 364, p: 19.0, c: 61.0, f: 6.0,  unit: 'g',       unitG: 100 },
  { name: 'Kidneybohnen', cat: 'Hülsenfrüchte',cal: 337, p: 24.0, c: 61.0, f: 1.5,  unit: 'g',       unitG: 100 },
  { name: 'Erbsen',       cat: 'Hülsenfrüchte',cal: 81,  p: 5.4,  c: 14.4, f: 0.4,  unit: 'g',       unitG: 100 },
  { name: 'Edamame',      cat: 'Hülsenfrüchte',cal: 122, p: 11.0, c: 10.0, f: 5.2,  unit: 'g',       unitG: 100 },
  { name: 'Sojabohnen',   cat: 'Hülsenfrüchte',cal: 173, p: 17.0, c: 9.9,  f: 9.0,  unit: 'g',       unitG: 100 },
  // ── Milchprodukte
  { name: 'Milch',        cat: 'Milch',        cal: 42,  p: 3.5,  c: 5.0,  f: 3.5,  unit: 'ml',      unitG: 100 },
  { name: 'Joghurt',      cat: 'Milch',        cal: 100, p: 3.5,  c: 5.0,  f: 3.5,  unit: 'g',       unitG: 100 },
  { name: 'Magerquark',   cat: 'Milch',        cal: 67,  p: 12.0, c: 4.0,  f: 0.2,  unit: 'g',       unitG: 100 },
  { name: 'Skyr',         cat: 'Milch',        cal: 63,  p: 11.0, c: 4.0,  f: 0.2,  unit: 'g',       unitG: 100 },
  { name: 'Griech. Joghurt', cat: 'Milch',     cal: 133, p: 5.7,  c: 4.0,  f: 10.0, unit: 'g',       unitG: 100 },
  { name: 'Käse',         cat: 'Milch',        cal: 350, p: 25.0, c: 1.5,  f: 28.0, unit: 'Scheibe', unitG: 25  },
  { name: 'Mozzarella',   cat: 'Milch',        cal: 280, p: 18.0, c: 2.2,  f: 22.0, unit: 'g',       unitG: 100 },
  { name: 'Butter',       cat: 'Milch',        cal: 717, p: 0.9,  c: 0.1,  f: 81.0, unit: 'g',       unitG: 100 },
  { name: 'Sahne',        cat: 'Milch',        cal: 337, p: 2.5,  c: 3.4,  f: 35.0, unit: 'ml',      unitG: 100 },
  // ── Eier & Tierprodukte
  { name: 'Ei',           cat: 'Eier',         cal: 155, p: 13.0, c: 1.1,  f: 11.0, unit: 'Stück',   unitG: 60  },
  { name: 'Eiweiß',       cat: 'Eier',         cal: 52,  p: 11.0, c: 0.7,  f: 0.2,  unit: 'Stück',   unitG: 30  },
  { name: 'Eigelb',       cat: 'Eier',         cal: 322, p: 16.0, c: 0.6,  f: 27.0, unit: 'Stück',   unitG: 18  },
  { name: 'Honig',        cat: 'Eier',         cal: 304, p: 0.3,  c: 82.4, f: 0.0,  unit: 'TL',      unitG: 7   },
  // ── Getreide & Brot
  { name: 'Haferflocken', cat: 'Getreide',     cal: 370, p: 13.0, c: 60.0, f: 6.0,  unit: 'g',       unitG: 100 },
  { name: 'Vollkornbrot', cat: 'Getreide',     cal: 240, p: 8.0,  c: 45.0, f: 5.0,  unit: 'Scheibe', unitG: 50  },
  { name: 'Weißbrot',     cat: 'Getreide',     cal: 265, p: 8.5,  c: 54.0, f: 2.7,  unit: 'Scheibe', unitG: 30  },
  { name: 'Reis',         cat: 'Getreide',     cal: 130, p: 2.7,  c: 28.0, f: 0.3,  unit: 'g',       unitG: 100 },
  { name: 'Nudeln',       cat: 'Getreide',     cal: 120, p: 5.0,  c: 25.0, f: 1.0,  unit: 'g',       unitG: 100 },
  { name: 'Quinoa',       cat: 'Getreide',     cal: 120, p: 4.4,  c: 22.0, f: 1.9,  unit: 'g',       unitG: 100 },
  // ── Nüsse & Samen
  { name: 'Mandeln',      cat: 'Nüsse',        cal: 579, p: 21.0, c: 22.0, f: 50.0, unit: 'g',       unitG: 100 },
  { name: 'Walnüsse',     cat: 'Nüsse',        cal: 654, p: 15.0, c: 14.0, f: 65.0, unit: 'g',       unitG: 100 },
  { name: 'Cashews',      cat: 'Nüsse',        cal: 553, p: 18.0, c: 30.0, f: 44.0, unit: 'g',       unitG: 100 },
  { name: 'Erdnüsse',     cat: 'Nüsse',        cal: 567, p: 26.0, c: 16.0, f: 49.0, unit: 'g',       unitG: 100 },
  { name: 'Leinsamen',    cat: 'Nüsse',        cal: 534, p: 18.0, c: 29.0, f: 42.0, unit: 'EL',      unitG: 10  },
  { name: 'Chiasamen',    cat: 'Nüsse',        cal: 486, p: 17.0, c: 42.0, f: 31.0, unit: 'EL',      unitG: 10  },
]

const CATEGORIES = ['Alle', 'Obst', 'Gemüse', 'Fleisch', 'Fisch', 'Hülsenfrüchte', 'Milch', 'Eier', 'Getreide', 'Nüsse']
const CAT_ICONS = { Alle: 'restaurant', Obst: '🍎', Gemüse: '🥦', Fleisch: '🥩', Fisch: '🐟', Hülsenfrüchte: '🫘', Milch: '🥛', Eier: '🥚', Getreide: '🌾', Nüsse: '🥜' }

// ─── Parser (unterstützt Gramm + Stück + ml) ────────────────────────────────
function parseMeal(description) {
  const parts = description.split(/[,;]+/).map(s => s.trim()).filter(Boolean)
  let totalCal = 0, totalP = 0, totalC = 0, totalF = 0
  const matched = []

  parts.forEach(part => {
    const gramMatch = part.match(/^(\d+\.?\d*)\s*(g|gramm|gram|ml|milliliter)\s+(.+)/i)
    const unitMatch = part.match(/^(\d+\.?\d*)\s+(.+)/)
    let qty, grams, foodName, isGramBased = false

    if (gramMatch) {
      qty = parseFloat(gramMatch[1]); grams = qty
      foodName = gramMatch[3].toLowerCase().trim(); isGramBased = true
    } else if (unitMatch) {
      qty = parseFloat(unitMatch[1]); foodName = unitMatch[2].toLowerCase().trim()
    } else return

    const found = FOODS.find(f =>
      f.name.toLowerCase() === foodName ||
      foodName.includes(f.name.toLowerCase()) ||
      f.name.toLowerCase().includes(foodName.split(' ')[0])
    )
    if (found) {
      const factor = isGramBased ? grams / 100 : (qty * found.unitG) / 100
      const displayUnit = isGramBased ? `${grams}g` : `${qty} ${found.unit}`
      const cal = Math.round(found.cal * factor)
      const p = Math.round(found.p * factor * 10) / 10
      const c = Math.round(found.c * factor * 10) / 10
      const f = Math.round(found.f * factor * 10) / 10
      totalCal += cal; totalP += p; totalC += c; totalF += f
      matched.push({ name: found.name, qty, unit: displayUnit, cal, p, c, f })
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

// ─── Portionsauswahl ────────────────────────────────────────────────────────
function FoodPicker({ onAdd }) {
  const [cat, setCat] = useState('Alle')
  const [search, setSearch] = useState('')
  const [selected, setSelected] = useState(null)
  const [qty, setQty] = useState(1)
  const [useGrams, setUseGrams] = useState(false)
  const [customG, setCustomG] = useState(100)

  const filtered = FOODS.filter(f =>
    (cat === 'Alle' || f.cat === cat) &&
    (!search || f.name.toLowerCase().includes(search.toLowerCase()))
  )

  const selectFood = (food) => {
    setSelected(food)
    setUseGrams(food.unit === 'g' || food.unit === 'ml')
    setQty(1)
    setCustomG(food.unitG)
  }

  const getPreview = () => {
    if (!selected) return null
    const factor = useGrams ? customG / 100 : (qty * selected.unitG) / 100
    return {
      cal: Math.round(selected.cal * factor),
      p: Math.round(selected.p * factor * 10) / 10,
      c: Math.round(selected.c * factor * 10) / 10,
      f: Math.round(selected.f * factor * 10) / 10,
      str: useGrams ? `${customG}g ${selected.name}` : `${qty} ${selected.unit} ${selected.name}`,
    }
  }

  const preview = getPreview()

  const handleAdd = () => {
    if (!selected || !preview) return
    onAdd(preview.str)
    setSelected(null); setSearch('')
  }

  return (
    <div className="glass-card rounded-2xl p-4 space-y-4">
      <p className="text-sm font-semibold text-on-surface">Lebensmittel auswählen</p>

      {/* Search */}
      <input className="w-full bg-surface-container-low border border-white/10 rounded-xl px-3 py-2 text-sm text-on-surface placeholder-outline focus:outline-none focus:border-primary/50"
        placeholder="Suchen …" value={search} onChange={e => { setSearch(e.target.value); setSelected(null) }} />

      {/* Category filter */}
      <div className="flex gap-1 overflow-x-auto pb-1 scrollbar-hide">
        {CATEGORIES.map(c => (
          <button key={c} onClick={() => { setCat(c); setSelected(null) }}
            className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-medium transition-all ${cat === c ? 'bg-primary text-on-primary' : 'bg-surface-container text-on-surface-variant'}`}>
            {CAT_ICONS[c] || ''} {c}
          </button>
        ))}
      </div>

      {/* Food grid */}
      <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 max-h-48 overflow-y-auto">
        {filtered.map(food => (
          <button key={food.name} onClick={() => selectFood(food)}
            className={`rounded-xl p-2 text-xs font-medium text-center transition-all ${selected?.name === food.name ? 'bg-primary text-on-primary' : 'bg-surface-container-low text-on-surface hover:bg-surface-container-high'}`}>
            <div className="truncate">{food.name}</div>
            <div className="opacity-60 text-[10px]">{food.cal} kcal</div>
          </button>
        ))}
      </div>

      {/* Portion selector */}
      {selected && (
        <div className="bg-surface-container rounded-2xl p-4 space-y-3">
          <div className="flex items-center justify-between">
            <p className="text-sm font-semibold text-on-surface">{selected.name}</p>
            <p className="text-xs text-on-surface-variant">{selected.cal} kcal/100g</p>
          </div>

          {/* Toggle Stück / Gramm */}
          <div className="flex gap-2">
            <button onClick={() => setUseGrams(false)}
              className={`flex-1 py-2 rounded-xl text-xs font-medium transition-all ${!useGrams ? 'bg-primary text-on-primary' : 'bg-surface-container-low text-on-surface-variant'}`}>
              {selected.unit === 'ml' ? 'ml' : selected.unit === 'g' ? 'Portion' : `Stück (${selected.unit})`}
            </button>
            <button onClick={() => setUseGrams(true)}
              className={`flex-1 py-2 rounded-xl text-xs font-medium transition-all ${useGrams ? 'bg-primary text-on-primary' : 'bg-surface-container-low text-on-surface-variant'}`}>
              Gramm eingeben
            </button>
          </div>

          {/* Quantity input */}
          {useGrams ? (
            <div className="flex items-center gap-3">
              <button onClick={() => setCustomG(g => Math.max(10, g - 10))} className="w-9 h-9 rounded-full bg-surface-container-low text-on-surface flex items-center justify-center text-lg">−</button>
              <div className="flex-1 text-center">
                <input type="number" min={1} className="w-24 bg-transparent text-center text-2xl font-bold text-on-surface focus:outline-none"
                  value={customG} onChange={e => setCustomG(Math.max(1, +e.target.value))} />
                <p className="text-xs text-on-surface-variant">g</p>
              </div>
              <button onClick={() => setCustomG(g => g + 10)} className="w-9 h-9 rounded-full bg-surface-container-low text-on-surface flex items-center justify-center text-lg">+</button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <button onClick={() => setQty(q => Math.max(0.5, q - 0.5))} className="w-9 h-9 rounded-full bg-surface-container-low text-on-surface flex items-center justify-center text-lg">−</button>
              <div className="flex-1 text-center">
                <p className="text-2xl font-bold text-on-surface">{qty}</p>
                <p className="text-xs text-on-surface-variant">{selected.unit} · {Math.round(qty * selected.unitG)}g</p>
              </div>
              <button onClick={() => setQty(q => q + 0.5)} className="w-9 h-9 rounded-full bg-surface-container-low text-on-surface flex items-center justify-center text-lg">+</button>
            </div>
          )}

          {/* Preview & Add */}
          {preview && (
            <div className="flex items-center justify-between">
              <div className="flex gap-3 text-xs text-on-surface-variant">
                <span className="text-on-surface font-semibold">{preview.cal} kcal</span>
                <span>P {preview.p}g</span>
                <span>K {preview.c}g</span>
                <span>F {preview.f}g</span>
              </div>
              <Button size="sm" onClick={handleAdd}>+ Hinzufügen</Button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// ─── Makro-Übersicht ─────────────────────────────────────────────────────────
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
        {[['Protein', protein, 'text-primary'], ['Kohlenhydrate', carbs, 'text-tertiary'], ['Fett', fat, 'text-green-400']].map(([label, val, c]) => (
          <div key={label} className="text-center">
            <p className={`text-base font-bold ${c}`}>{Math.round(val)}g</p>
            <p className="text-xs text-on-surface-variant">{label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

// ─── Hauptkomponente ─────────────────────────────────────────────────────────
export default function Nutrition() {
  const [entries, setEntries] = useLocalStorage('maks_nutrition_v1', sampleNutrition)
  const [input, setInput] = useState('')
  const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [tab, setTab] = useState('picker')  // 'picker' | 'text'

  const todayStr = today()
  const todayEntry = entries.find(e => e.date === todayStr) || { date: todayStr, meals: [] }

  const totalCal = todayEntry.meals.reduce((s, m) => s + m.calories, 0)
  const totalP   = todayEntry.meals.reduce((s, m) => s + m.protein, 0)
  const totalC   = todayEntry.meals.reduce((s, m) => s + m.carbs, 0)
  const totalF   = todayEntry.meals.reduce((s, m) => s + m.fat, 0)

  const addFromPicker = (foodStr) => {
    const result = parseMeal(foodStr)
    const rating = rateMeal(result.cal, result.protein)
    const meal = {
      id: crypto.randomUUID(),
      description: foodStr,
      calories: result.cal, protein: result.protein,
      carbs: result.carbs, fat: result.fat,
      rating: rating.label,
      time: new Date().toTimeString().slice(0, 5),
    }
    const updated = { ...todayEntry, meals: [...todayEntry.meals, meal] }
    setEntries(prev => [...prev.filter(e => e.date !== todayStr), updated])
  }

  const analyze = () => {
    if (!input.trim()) return
    setLoading(true)
    setTimeout(() => {
      const result = parseMeal(input)
      setPreview({ ...result, rating: rateMeal(result.cal, result.protein), description: input })
      setLoading(false)
    }, 300)
  }

  const addMeal = () => {
    if (!preview) return
    const meal = {
      id: crypto.randomUUID(),
      description: preview.description,
      calories: preview.cal, protein: preview.protein,
      carbs: preview.carbs, fat: preview.fat,
      rating: preview.rating.label,
      time: new Date().toTimeString().slice(0, 5),
    }
    const updated = { ...todayEntry, meals: [...todayEntry.meals, meal] }
    setEntries(prev => [...prev.filter(e => e.date !== todayStr), updated])
    setInput(''); setPreview(null)
  }

  const deleteMeal = (id) => {
    const updated = { ...todayEntry, meals: todayEntry.meals.filter(m => m.id !== id) }
    setEntries(prev => [...prev.filter(e => e.date !== todayStr), updated])
  }

  return (
    <div className="space-y-5">
      <h2 className="text-xl font-bold text-on-surface">Ernährung</h2>

      <MacroBar cal={totalCal} protein={totalP} carbs={totalC} fat={totalF} />

      {/* Tab: Picker vs. Freitext */}
      <div className="flex gap-2 bg-surface-container rounded-2xl p-1">
        <button onClick={() => setTab('picker')}
          className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all ${tab === 'picker' ? 'bg-primary text-on-primary' : 'text-on-surface-variant'}`}>
          Auswählen
        </button>
        <button onClick={() => setTab('text')}
          className={`flex-1 py-2 rounded-xl text-sm font-medium transition-all ${tab === 'text' ? 'bg-primary text-on-primary' : 'text-on-surface-variant'}`}>
          Freitext
        </button>
      </div>

      {tab === 'picker' && <FoodPicker onAdd={addFromPicker} />}

      {tab === 'text' && (
        <div className="glass-card rounded-2xl p-5 space-y-4">
          <div>
            <p className="text-sm font-semibold text-on-surface mb-1">Freitext eingeben</p>
            <p className="text-xs text-on-surface-variant">
              Stück: <span className="text-primary">2 Eier</span> ·
              Gramm: <span className="text-primary">150g Hähnchenbrust</span> ·
              ml: <span className="text-primary">200ml Milch</span>
            </p>
          </div>
          <textarea
            className="w-full bg-surface-container-low border border-white/10 rounded-2xl px-4 py-3 text-sm text-on-surface placeholder-outline focus:outline-none focus:border-primary/50 resize-none"
            rows={3}
            placeholder="z.B.: 2 Eier, 150g Hähnchenbrust, 1 Tomate, 200ml Milch"
            value={input}
            onChange={(e) => { setInput(e.target.value); setPreview(null) }}
          />
          <Button onClick={analyze} disabled={!input.trim() || loading} className="w-full justify-center">
            {loading ? 'Analysiere …' : 'Analysieren'}
          </Button>

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
                      <span>{f.unit} {f.name}</span>
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
      )}

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
                    <span className="font-semibold text-on-surface">{meal.calories} kcal</span>
                    <span>P:{Math.round(meal.protein)}g</span>
                    <span>K:{Math.round(meal.carbs)}g</span>
                    <span>F:{Math.round(meal.fat)}g</span>
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
    </div>
  )
}
