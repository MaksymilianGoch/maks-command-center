const d = (daysAgo) => {
  const date = new Date()
  date.setDate(date.getDate() - daysAgo)
  return date.toISOString().split('T')[0]
}

// 7 MAKS-Habits aus streaks.md
export const sampleHabits = [
  { id: 'h1', name: 'Schlaf vor 23:30', category: 'health', createdAt: d(10), completions: [d(8), d(7), d(6), d(5), d(4), d(3), d(1)] },
  { id: 'h2', name: 'Morning Routine', category: 'other', createdAt: d(10), completions: [d(9), d(8), d(7), d(6), d(4), d(3), d(1), d(0)] },
  { id: 'h3', name: 'Lernen 90 min', category: 'learning', createdAt: d(10), completions: [d(7), d(5), d(3), d(2), d(0)] },
  { id: 'h4', name: 'Business 60 min', category: 'business', createdAt: d(10), completions: [d(8), d(6), d(5), d(4), d(3), d(1), d(0)] },
  { id: 'h5', name: 'Bewegung 20 min', category: 'fitness', createdAt: d(10), completions: [d(9), d(7), d(5), d(4), d(2), d(1)] },
  { id: 'h6', name: 'Kein SoMe vor 18 Uhr', category: 'health', createdAt: d(10), completions: [d(6), d(5), d(4), d(2), d(1), d(0)] },
  { id: 'h7', name: 'Evening Reflection', category: 'other', createdAt: d(10), completions: [d(8), d(7), d(5), d(4), d(3), d(1)] },
]

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
