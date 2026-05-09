const NAV = [
  { id: 'dashboard', label: 'Dashboard', icon: '◉' },
  { id: 'habits', label: 'Habits', icon: '◎' },
  { id: 'goals', label: 'Goals', icon: '◈' },
  { id: 'dailylog', label: 'Daily Log', icon: '◧' },
  { id: 'weeklyreview', label: 'Weekly Review', icon: '◫' },
]

export default function Sidebar({ current, onNavigate }) {
  return (
    <aside className="w-56 flex-shrink-0 bg-zinc-950 border-r border-zinc-800 flex flex-col">
      <div className="p-6 border-b border-zinc-800">
        <div className="text-xs font-semibold text-indigo-400 tracking-widest uppercase mb-1">
          Command Center
        </div>
        <div className="text-2xl font-bold text-zinc-50">MAKS</div>
      </div>

      <nav className="flex-1 p-3 space-y-1">
        {NAV.map((item) => (
          <button
            key={item.id}
            onClick={() => onNavigate(item.id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-left ${
              current === item.id
                ? 'bg-indigo-600/20 text-indigo-300 border border-indigo-600/30'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 border border-transparent'
            }`}
          >
            <span>{item.icon}</span>
            {item.label}
          </button>
        ))}
      </nav>

      <div className="p-4 border-t border-zinc-800">
        <div className="text-xs text-zinc-600">v1.0 MVP</div>
      </div>
    </aside>
  )
}
