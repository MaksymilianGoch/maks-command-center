export const calculateStreak = (completions) => {
  if (!completions || completions.length === 0) return 0

  const sorted = [...completions].sort().reverse()
  const todayStr = new Date().toISOString().split('T')[0]
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0]

  if (sorted[0] !== todayStr && sorted[0] !== yesterday) return 0

  let streak = 1
  let current = sorted[0]

  for (let i = 1; i < sorted.length; i++) {
    const prev = new Date(current + 'T00:00:00')
    prev.setDate(prev.getDate() - 1)
    const prevStr = prev.toISOString().split('T')[0]
    if (sorted[i] === prevStr) {
      streak++
      current = prevStr
    } else {
      break
    }
  }

  return streak
}

export const getCompletionRate = (completions, createdAt) => {
  if (!completions || completions.length === 0) return 0
  const start = new Date(createdAt)
  const now = new Date()
  const totalDays = Math.max(1, Math.ceil((now - start) / 86400000))
  return Math.round((completions.length / totalDays) * 100)
}

export const isCompletedToday = (completions) => {
  const todayStr = new Date().toISOString().split('T')[0]
  return completions?.includes(todayStr) ?? false
}
