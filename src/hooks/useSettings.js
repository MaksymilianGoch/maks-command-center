import { useState, useEffect } from 'react'

const DEFAULTS = {
  name: 'Maks',
  language: 'de',
  theme: 'dark',
  weekStart: 'monday',
  habitsMax: 10,
}

export function useSettings() {
  const [settings, setSettings] = useState(() => {
    try {
      const stored = localStorage.getItem('maks_settings')
      return stored ? { ...DEFAULTS, ...JSON.parse(stored) } : DEFAULTS
    } catch {
      return DEFAULTS
    }
  })

  useEffect(() => {
    localStorage.setItem('maks_settings', JSON.stringify(settings))
    document.documentElement.setAttribute('data-theme', settings.theme)
  }, [settings])

  const update = (key, value) => setSettings((p) => ({ ...p, [key]: value }))

  const resetData = () => {
    const keys = ['maks_habits_v2', 'maks_tasks_v2', 'maks_finance_v2', 'maks_logs_v2', 'maks_workouts_v1', 'maks_nutrition_v1', 'maks_aitasks_v1']
    keys.forEach((k) => localStorage.removeItem(k))
    window.location.reload()
  }

  return { settings, update, resetData }
}
