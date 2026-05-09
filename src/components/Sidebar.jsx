const NAV = [
  { id: 'dashboard', label: 'Dashboard', icon: '⊡' },
  { id: 'habits', label: 'Habits', icon: '○' },
  { id: 'goals', label: 'Goals', icon: '◈' },
  { id: 'dailylog', label: 'Daily Log', icon: '✎' },
  { id: 'weeklyreview', label: 'Weekly Review', icon: '↗' },
]

export default function Sidebar({ current, onNavigate }) {
  return (
    <aside className="hidden md:flex w-56 flex-shrink-0 bg-[#191a1f] border-r border-[#323640] flex-col">
      <div className="p-6 border-b border-[#323640]">
        <div className="text-xs font-semibold text-[#4f86f7] tracking-widest uppercase mb-1">
          Command Center
        </div>
        <div className="text-2xl font-bold text-white">MAKS</div>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {NAV.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors text-left ${
              current === item.id
                ? 'bg-[#4f86f7]/15 text-[#4f86f7] border border-[#4f86f7]/30'
                : 'text-[#b0b7c2] hover:text-white hover:bg-[#22252e] border border-transparent'
            }`}
          >
            <span>{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-[#323640]">
        <div className="text-xs text-[#323640]">v1.0 MVP</div>
      </div>
    </aside>
  )
}
