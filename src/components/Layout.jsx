import Sidebar from './Sidebar'
import BottomNav from './BottomNav'

export default function Layout({ current, onNavigate, children }) {
  return (
    <div className="flex h-screen bg-[#191a1f] text-white overflow-hidden">
      <Sidebar current={current} onNavigate={onNavigate} />
      <main className="flex-1 overflow-y-auto pb-20 md:pb-0">
        {children}
      </main>
      <BottomNav current={current} onNavigate={onNavigate} />
    </div>
  )
}
