import { getWeekStart } from '../utils/dateUtils'

const d = (daysAgo) => {
  const date = new Date()
  date.setDate(date.getDate() - daysAgo)
  return date.toISOString().split('T')[0]
}

export const sampleHabits = [
  {
    id: 'h1',
    name: 'Morgensport 30 min',
    category: 'fitness',
    createdAt: d(7),
    completions: [d(6), d(5), d(4), d(3), d(2), d(1)],
  },
  {
    id: 'h2',
    name: 'Täglich lesen 20 Seiten',
    category: 'learning',
    createdAt: d(7),
    completions: [d(5), d(4), d(2), d(1), d(0)],
  },
  {
    id: 'h3',
    name: 'Kein Zucker nach 18 Uhr',
    category: 'health',
    createdAt: d(4),
    completions: [d(3), d(2), d(1)],
  },
  {
    id: 'h4',
    name: 'Deep Work Session 2h',
    category: 'business',
    createdAt: d(5),
    completions: [d(4), d(2), d(0)],
  },
]

export const sampleGoals = [
  {
    id: 'g1',
    title: '10.000 € Monatsumsatz',
    category: 'business',
    deadline: '2026-12-31',
    targetValue: 10000,
    currentValue: 3200,
    unit: '€',
    nextAction: 'Nächsten Sales-Call für Dienstag einplanen',
    status: 'active',
    createdAt: '2026-01-01',
  },
  {
    id: 'g2',
    title: 'React lernen — 50 Stunden',
    category: 'learning',
    deadline: '2026-08-31',
    targetValue: 50,
    currentValue: 12,
    unit: 'h',
    nextAction: 'Hooks-Tutorial fertigstellen',
    status: 'active',
    createdAt: '2026-04-01',
  },
  {
    id: 'g3',
    title: 'Körpergewicht 80 kg',
    category: 'fitness',
    deadline: '2026-09-01',
    targetValue: 80,
    currentValue: 87,
    unit: 'kg',
    nextAction: '3x pro Woche Krafttraining',
    status: 'active',
    createdAt: '2026-03-01',
  },
]

export const sampleDailyLogs = [
  {
    id: 'dl1',
    date: d(1),
    note: 'Sehr produktiver Tag. Morgens early bird, Fokus war stark.',
    strongPoints: 'Deep Work Session abgeschlossen, Habit-Streak gehalten',
    weakPoints: 'Abends zu lange am Handy',
    tomorrowFocus: 'Sales-Call vorbereiten',
    energyLevel: 8,
    disciplineLevel: 7,
  },
  {
    id: 'dl2',
    date: d(2),
    note: 'Mittelmäßiger Tag. Zu viele Unterbrechungen.',
    strongPoints: 'Sport gemacht trotz wenig Motivation',
    weakPoints: 'Schlechte Ernährung, kein Lesen',
    tomorrowFocus: 'Ablenkungen reduzieren, Handy in anderen Raum',
    energyLevel: 6,
    disciplineLevel: 5,
  },
  {
    id: 'dl3',
    date: d(3),
    note: 'Solider Tag. Routine lief gut.',
    strongPoints: 'Morgenroutine komplett, alle Habits',
    weakPoints: 'Nachmittags Energie-Einbruch',
    tomorrowFocus: 'Früher schlafen gehen',
    energyLevel: 7,
    disciplineLevel: 8,
  },
]

export const sampleWeeklyReviews = [
  {
    id: 'wr1',
    weekStart: getWeekStart(new Date(Date.now() - 7 * 86400000)),
    notes: 'Gute Woche overall. Sport Streak auf 6 Tage. Business langsamer als geplant.',
    nextWeekPlan: 'Fokus auf Sales-Aktivitäten. Morgenroutine beibehalten.',
  },
]
