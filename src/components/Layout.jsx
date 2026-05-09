import { useState } from 'react'
import Sidebar from './Sidebar'
import BottomNav from './BottomNav'
import SettingsModal from './SettingsModal'
import { useSettings } from '../hooks/useSettings'

export default function Layout({ current, onNavigate, children }) {
  const [showSettings, setShowSettings] = useState(false)
  const { settings, update, resetData } = useSettings()

  return (
    <div className="min-h-screen bg-background text-on-surface" data-theme={settings.theme}>
      {/* TopAppBar */}
      <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-4 h-14 bg-surface/90 backdrop-blur-xl border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary flex-shrink-0">
            {settings.name.charAt(0).toUpperCase()}
          </div>
          <span className="text-lg font-bold tracking-tight text-on-surface">MAKS</span>
        </div>
        <button onClick={() => setShowSettings(true)} className="text-primary hover:opacity-80 transition-opacity p-1">
          <span className="material-symbols-outlined">settings</span>
        </button>
      </header>

      <div className="flex pt-14">
        <Sidebar current={current} onNavigate={onNavigate} settings={settings} />
        <main className="flex-1 overflow-y-auto pb-20 md:pb-8 min-h-[calc(100dvh-3.5rem)]">
          <div className="px-4 md:px-10 pt-5 pb-8 max-w-[1200px] mx-auto">
            {children}
          </div>
        </main>
      </div>

      <BottomNav current={current} onNavigate={onNavigate} />

      {showSettings && (
        <SettingsModal
          settings={settings}
          update={update}
          resetData={resetData}
          onClose={() => setShowSettings(false)}
        />
      )}
    </div>
  )
}
