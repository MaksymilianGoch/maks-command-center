const d = (daysAgo) => {
  const date = new Date()
  date.setDate(date.getDate() - daysAgo)
  return date.toISOString().split('T')[0]
}

// 10 MAKS-Habits
export const sampleHabits = [
  { id: 'h1',  name: 'Gym',              category: 'fitness',  createdAt: d(14), completions: [d(7), d(5), d(3), d(1)] },
  { id: 'h2',  name: '8h Schlaf',        category: 'health',   createdAt: d(14), completions: [d(8), d(7), d(6), d(5), d(4), d(3), d(1)] },
  { id: 'h3',  name: 'Beten',            category: 'other',    createdAt: d(14), completions: [d(9), d(8), d(7), d(6), d(5), d(4), d(3), d(2), d(1), d(0)] },
  { id: 'h4',  name: 'Lesen',            category: 'learning', createdAt: d(14), completions: [d(7), d(6), d(5), d(3), d(2), d(1), d(0)] },
  { id: 'h5',  name: 'Business',         category: 'business', createdAt: d(14), completions: [d(8), d(6), d(5), d(4), d(3), d(1), d(0)] },
  { id: 'h6',  name: 'Studium',          category: 'learning', createdAt: d(14), completions: [d(6), d(5), d(4), d(2), d(1)] },
  { id: 'h7',  name: 'AI',               category: 'learning', createdAt: d(14), completions: [d(7), d(5), d(4), d(3), d(1), d(0)] },
  { id: 'h8',  name: 'Uni lernen',       category: 'learning', createdAt: d(14), completions: [d(5), d(4), d(3), d(2)] },
  { id: 'h9',  name: 'Clean gegessen',   category: 'health',   createdAt: d(14), completions: [d(8), d(7), d(6), d(5), d(4), d(3), d(2), d(1), d(0)] },
  { id: 'h10', name: '2000–3000 kcal',   category: 'health',   createdAt: d(14), completions: [d(7), d(6), d(5), d(4), d(3), d(2), d(1)] },
]

export const sampleWorkouts = []
export const sampleNutrition = []
export const sampleAITasks = []

// Tasks — ONE Thing + max. 4
export const sampleTasks = [
  { id: 't1', text: 'n8n Workflow für Kunden fertigstellen', isTop: true, done: false, date: d(0), createdAt: d(0) },
  { id: 't2', text: '3 Marktforschungs-Anrufe', isTop: false, done: false, date: d(0), createdAt: d(0) },
  { id: 't3', text: 'Lead-Liste weiter aufbauen', isTop: false, done: false, date: d(0), createdAt: d(0) },
  { id: 't4', text: 'Claude Code Tutorial fertig', isTop: false, done: true, date: d(1), createdAt: d(1) },
  { id: 't5', text: 'Konkurrenz-Analyse vorbereiten', isTop: false, done: false, date: d(1), createdAt: d(1) },
]

// Finance
export const sampleFinance = [
  { id: 'f1', date: '2026-05-01', monthlyIncome: 3200, monthlyExpenses: 1800, savingsTotal: 24500 },
  { id: 'f2', date: '2026-04-01', monthlyIncome: 2800, monthlyExpenses: 1900, savingsTotal: 23100 },
  { id: 'f3', date: '2026-03-01', monthlyIncome: 3500, monthlyExpenses: 1750, savingsTotal: 22200 },
]

// Daily Logs (erweitert mit Health + Learning)
export const sampleLogs = [
  {
    id: 'l1', date: d(1),
    note: 'Produktiver Tag. n8n Workflow fast fertig.',
    strongPoints: 'Deep Work 3h, alle Habits bis auf Lernen', weakPoints: 'Abends Handy zu lange', tomorrowFocus: 'n8n Workflow fertigstellen',
    energyLevel: 8, disciplineLevel: 7,
    sleepHours: 7.5, sleepBefore2330: true, workout: true, workoutMin: 30,
    nutritionQuality: 'gut',
    learningTool: 'claude-code', learningTopic: 'Agents und Subagents', learningBuilt: true, learningMin: 90, learningMode: 'aktiv',
  },
  {
    id: 'l2', date: d(2),
    note: 'Mittelmäßig. Zu viele Unterbrechungen.',
    strongPoints: 'Sport trotz wenig Motivation', weakPoints: 'SoMe zu früh', tomorrowFocus: 'Fokus-Block morgens blockieren',
    energyLevel: 6, disciplineLevel: 5,
    sleepHours: 6, sleepBefore2330: false, workout: true, workoutMin: 20,
    nutritionQuality: 'ok',
    learningTool: 'n8n', learningTopic: 'HTTP Request Node', learningBuilt: false, learningMin: 45, learningMode: 'passiv',
  },
]
