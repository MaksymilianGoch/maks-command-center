import Sidebar from './Sidebar'
import BottomNav from './BottomNav'

export default function Layout({ current, onNavigate, children }) {
  return (
    <div className="min-h-screen bg-background text-on-surface">
      {/* TopAppBar */}
      <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-4 h-16 bg-surface/80 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">M</div>
          <span className="text-xl font-bold tracking-tight text-on-surface">MAKS</span>
        </div>
        <button className="text-primary hover:opacity-80 transition-opacity">
          <span className="material-symbols-outlined">settings</span>
        </button>
      </header>

      <div className="flex pt-16">
        <Sidebar current={current} onNavigate={onNavigate} />
        <main className="flex-1 overflow-y-auto pb-24 md:pb-8 min-h-[calc(100dvh-4rem)]">
          <div className="px-4 md:px-12 pt-6 pb-8 max-w-[1200px] mx-auto">
            {children}
          </div>
        </main>
      </div>

      <BottomNav current={current} onNavigate={onNavigate} />
    </div>
  )
}
