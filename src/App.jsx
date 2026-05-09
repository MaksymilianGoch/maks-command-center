import { useState } from 'react'
import { useLocalStorage } from './hooks/useLocalStorage'
import { sampleHabits, sampleTasks, sampleFinance, sampleLogs } from './data/sampleData'
import Layout from './components/Layout'
import Dashboard from './pages/Dashboard'
import Today from './pages/Today'
import Habits from './pages/Habits'
import Finance from './pages/Finance'
import Log from './pages/Log'

export default function App() {
  const [page, setPage] = useState('dashboard')
  const [habits, setHabits] = useLocalStorage('maks_habits_v2', sampleHabits)
  const [tasks, setTasks] = useLocalStorage('maks_tasks_v2', sampleTasks)
  const [finance, setFinance] = useLocalStorage('maks_finance_v2', sampleFinance)
  const [logs, setLogs] = useLocalStorage('maks_logs_v2', sampleLogs)

  const pages = {
    dashboard: <Dashboard habits={habits} tasks={tasks} finance={finance} logs={logs} onNavigate={setPage} />,
    today:     <Today tasks={tasks} setTasks={setTasks} />,
    habits:    <Habits habits={habits} setHabits={setHabits} />,
    finance:   <Finance finance={finance} setFinance={setFinance} />,
    log:       <Log logs={logs} setLogs={setLogs} />,
  }

  return (
    <Layout current={page} onNavigate={setPage}>
      {pages[page]}
    </Layout>
  )
}
