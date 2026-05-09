import { useState } from 'react'
import { useLocalStorage } from '../../hooks/useLocalStorage'
import { sampleWorkouts } from '../../data/sampleData'
import { today } from '../../utils/dateUtils'
import Button from '../../components/Button'
import Modal from '../../components/Modal'

const WORKOUT_TYPES = {
  push: {
    label: 'Push', color: 'text-primary bg-primary/10', icon: 'fitness_center',
    exercises: [
      { name: 'Bankdrücken', defaultSets: 3, defaultReps: '8–12' },
      { name: 'Schulterdrücken', defaultSets: 3, defaultReps: '8–12' },
      { name: 'Schrägbank-Drücken', defaultSets: 3, defaultReps: '10–15' },
      { name: 'Seitheben', defaultSets: 3, defaultReps: '12–15' },
      { name: 'Trizeps-Drücken', defaultSets: 3, defaultReps: '10–15' },
    ],
  },
  pull: {
    label: 'Pull', color: 'text-tertiary bg-tertiary/10', icon: 'exercise',
    exercises: [
      { name: 'Klimmzüge', defaultSets: 3, defaultReps: 'max' },
      { name: 'Langhantelrudern', defaultSets: 3, defaultReps: '8–12' },
      { name: 'Latziehen', defaultSets: 3, defaultReps: '10–15' },
      { name: 'Face Pull', defaultSets: 3, defaultReps: '15–20' },
      { name: 'Bizeps-Curl', defaultSets: 3, defaultReps: '10–15' },
    ],
  },
  leg: {
    label: 'Leg', color: 'text-green-400 bg-green-500/10', icon: 'directions_walk',
    exercises: [
      { name: 'Kniebeugen', defaultSets: 3, defaultReps: '8–12' },
      { name: 'Beinpresse', defaultSets: 3, defaultReps: '10–15' },
      { name: 'Rumänisches Kreuzheben', defaultSets: 3, defaultReps: '8–12' },
      { name: 'Beinstrecker', defaultSets: 3, defaultReps: '12–15' },
      { name: 'Wadenheben', defaultSets: 4, defaultReps: '15–20' },
    ],
  },
}

function WeekCalendar({ workouts, onSelectDay, selectedDay }) {
  const last14 = Array.from({ length: 14 }, (_, i) => {
    const d = new Date(); d.setDate(d.getDate() - (13 - i))
    return d.toISOString().split('T')[0]
  })
  const days = ['Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa', 'So']

  return (
    <div className="glass-card rounded-2xl p-4 mb-5">
      <div className="flex items-center justify-between mb-3">
        <p className="text-sm font-semibold text-on-surface">Kalender</p>
        <p className="text-xs text-on-surface-variant">Letzte 14 Tage</p>
      </div>
      <div className="grid grid-cols-7 gap-1">
        {days.map((d) => <p key={d} className="text-[10px] text-on-surface-variant text-center pb-1">{d}</p>)}
        {last14.map((date) => {
          const w = workouts.find((x) => x.date === date)
          const isToday = date === today()
          const isSelected = date === selectedDay
          const typeColor = w ? WORKOUT_TYPES[w.type]?.color.split(' ')[1] || 'bg-primary/30' : ''
          return (
            <button key={date} onClick={() => onSelectDay(date)}
              className={`aspect-square rounded-xl text-xs font-medium flex items-center justify-center transition-all ${
                isSelected ? 'ring-2 ring-primary' : ''
              } ${w ? typeColor : isToday ? 'bg-surface-container-high' : 'bg-surface-container-low'} ${
                isToday && !w ? 'border border-primary/30' : ''
              }`}>
              <span className={w ? 'text-on-surface' : isToday ? 'text-primary' : 'text-on-surface-variant opacity-50'}>
                {parseInt(date.slice(8))}
              </span>
            </button>
          )
        })}
      </div>
      <div className="flex gap-3 mt-3 text-xs text-on-surface-variant">
        {Object.entries(WORKOUT_TYPES).map(([key, t]) => (
          <span key={key} className={`flex items-center gap-1 px-2 py-0.5 rounded-full ${t.color}`}>
            {t.label}
          </span>
        ))}
      </div>
    </div>
  )
}

export default function Gym() {
  const [workouts, setWorkouts] = useLocalStorage('maks_workouts_v1', sampleWorkouts)
  const [selectedDay, setSelectedDay] = useState(today())
  const [showModal, setShowModal] = useState(false)
  const [workoutType, setWorkoutType] = useState('push')
  const [exercises, setExercises] = useState([])

  const dayWorkout = workouts.find((w) => w.date === selectedDay)

  const startWorkout = () => {
    const defaults = WORKOUT_TYPES[workoutType].exercises.map((ex) => ({
      name: ex.name,
      sets: Array.from({ length: ex.defaultSets }, () => ({ weight: '', reps: ex.defaultReps })),
    }))
    setExercises(defaults)
    setShowModal(true)
  }

  const saveWorkout = () => {
    const session = { id: crypto.randomUUID(), date: selectedDay, type: workoutType, exercises }
    setWorkouts((prev) => [...prev.filter((w) => w.date !== selectedDay), session])
    setShowModal(false)
  }

  const updateSet = (exIdx, setIdx, field, value) => {
    setExercises((prev) => prev.map((ex, i) => i !== exIdx ? ex : {
      ...ex,
      sets: ex.sets.map((s, j) => j !== setIdx ? s : { ...s, [field]: value }),
    }))
  }

  const addSet = (exIdx) => {
    setExercises((prev) => prev.map((ex, i) => i !== exIdx ? ex : {
      ...ex, sets: [...ex.sets, { weight: '', reps: '8–12' }],
    }))
  }

  // Personal records: best weight per exercise
  const getRecord = (exerciseName) => {
    let best = 0
    workouts.forEach((w) => {
      const ex = w.exercises?.find((e) => e.name === exerciseName)
      if (ex) ex.sets.forEach((s) => { if (parseFloat(s.weight) > best) best = parseFloat(s.weight) })
    })
    return best > 0 ? best : null
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-bold text-on-surface">Gym Tracker</h2>
        {!dayWorkout && (
          <div className="flex gap-2">
            {Object.entries(WORKOUT_TYPES).map(([key, t]) => (
              <button key={key} onClick={() => setWorkoutType(key)}
                className={`px-3 py-1.5 rounded-full text-xs font-medium transition-all ${workoutType === key ? `${t.color} font-bold` : 'bg-surface-container text-on-surface-variant'}`}>
                {t.label}
              </button>
            ))}
          </div>
        )}
      </div>

      <WeekCalendar workouts={workouts} onSelectDay={setSelectedDay} selectedDay={selectedDay} />

      {dayWorkout ? (
        <div className="space-y-3">
          <div className="flex items-center justify-between mb-2">
            <div>
              <span className={`px-3 py-1 rounded-full text-xs font-semibold ${WORKOUT_TYPES[dayWorkout.type]?.color}`}>
                {WORKOUT_TYPES[dayWorkout.type]?.label} Day
              </span>
              <p className="text-xs text-on-surface-variant mt-1">{selectedDay}</p>
            </div>
            <Button variant="danger" size="sm" onClick={() => setWorkouts((prev) => prev.filter((w) => w.date !== selectedDay))}>
              Löschen
            </Button>
          </div>
          {dayWorkout.exercises.map((ex, i) => {
            const record = getRecord(ex.name)
            const bestToday = Math.max(...ex.sets.map((s) => parseFloat(s.weight) || 0))
            const isNewRecord = record && bestToday > record
            return (
              <div key={i} className="glass-card rounded-2xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <p className="text-sm font-semibold text-on-surface">{ex.name}</p>
                  {isNewRecord && <span className="text-xs text-amber-400 font-bold">🏆 Neuer Rekord!</span>}
                  {record && !isNewRecord && <span className="text-xs text-on-surface-variant">Rekord: {record} kg</span>}
                </div>
                <div className="space-y-1.5">
                  {ex.sets.map((set, j) => (
                    <div key={j} className="flex items-center gap-2 text-sm">
                      <span className="text-xs text-on-surface-variant w-6">#{j + 1}</span>
                      <span className="text-on-surface">{set.weight ? `${set.weight} kg` : '—'}</span>
                      <span className="text-on-surface-variant">×</span>
                      <span className="text-on-surface">{set.reps}</span>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>
      ) : (
        <div className="glass-card rounded-2xl p-6 text-center">
          <span className="material-symbols-outlined text-4xl text-on-surface-variant mb-3 block">fitness_center</span>
          <p className="text-on-surface-variant mb-4">
            {selectedDay === today() ? 'Noch kein Training heute.' : `Kein Training am ${selectedDay}.`}
          </p>
          {selectedDay === today() && (
            <Button onClick={startWorkout}>
              {WORKOUT_TYPES[workoutType].label} Day starten
            </Button>
          )}
        </div>
      )}

      {showModal && (
        <Modal title={`${WORKOUT_TYPES[workoutType].label} Day — ${selectedDay}`} onClose={() => setShowModal(false)}>
          <div className="space-y-5 max-h-[60vh] overflow-y-auto pr-1">
            {exercises.map((ex, exIdx) => {
              const record = getRecord(ex.name)
              return (
                <div key={exIdx} className="bg-surface-container-low rounded-2xl p-4">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-sm font-semibold text-on-surface">{ex.name}</p>
                    {record && <p className="text-xs text-on-surface-variant">Rekord: {record} kg</p>}
                  </div>
                  <div className="space-y-2">
                    {ex.sets.map((set, setIdx) => (
                      <div key={setIdx} className="flex items-center gap-2">
                        <span className="text-xs text-on-surface-variant w-5">#{setIdx + 1}</span>
                        <input type="number" placeholder="kg"
                          className="w-20 bg-surface-container border border-white/10 rounded-xl px-2 py-1.5 text-sm text-on-surface text-center focus:outline-none focus:border-primary/50"
                          value={set.weight} onChange={(e) => updateSet(exIdx, setIdx, 'weight', e.target.value)} />
                        <span className="text-on-surface-variant text-xs">kg ×</span>
                        <input type="text" placeholder="Wdh."
                          className="w-20 bg-surface-container border border-white/10 rounded-xl px-2 py-1.5 text-sm text-on-surface text-center focus:outline-none focus:border-primary/50"
                          value={set.reps} onChange={(e) => updateSet(exIdx, setIdx, 'reps', e.target.value)} />
                      </div>
                    ))}
                  </div>
                  <button onClick={() => addSet(exIdx)} className="text-xs text-primary mt-2 hover:text-primary/80">+ Satz hinzufügen</button>
                </div>
              )
            })}
          </div>
          <div className="flex justify-end gap-2 pt-4 border-t border-white/10 mt-4">
            <Button variant="secondary" onClick={() => setShowModal(false)}>Abbrechen</Button>
            <Button onClick={saveWorkout}>Training speichern</Button>
          </div>
        </Modal>
      )}
    </div>
  )
}
