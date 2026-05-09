import { useState } from 'react'
import { useLocalStorage } from './hooks/useLocalStorage'
import { sampleHabits, sampleGoals, sampleDailyLogs, sampleWeeklyReviews } from './data/sampleData'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Habits from './pages/Habits'
import Goals from './pages/Goals'
import DailyLog from './pages/DailyLog'
import WeeklyReview from './pages/WeeklyReview'

export default function App() {
  const [page, setPage] = useState('dashboard')
  const [habits, setHabits] = useLocalStorage('maks_habits', sampleHabits)
  const [goals, setGoals] = useLocalStorage('maks_goals', sampleGoals)
  const [dailyLogs, setDailyLogs] = useLocalStorage('maks_dailylogs', sampleDailyLogs)
  const [weeklyReviews, setWeeklyReviews] = useLocalStorage('maks_weeklyreviews', sampleWeeklyReviews)

  const pages = {
    dashboard: (
      <Dashboard
        habits={habits}
        goals={goals}
        dailyLogs={dailyLogs}
        onNavigate={setPage}
      />
    ),
    habits: <Habits habits={habits} setHabits={setHabits} />,
    goals: <Goals goals={goals} setGoals={setGoals} />,
    dailylog: <DailyLog dailyLogs={dailyLogs} setDailyLogs={setDailyLogs} />,
    weeklyreview: (
      <WeeklyReview
        habits={habits}
        dailyLogs={dailyLogs}
        weeklyReviews={weeklyReviews}
        setWeeklyReviews={setWeeklyReviews}
      />
    ),
  }

  return (
    <Layout current={page} onNavigate={setPage}>
      {pages[page]}
    </Layout>
  )
}
