const NAV = [
  { id: 'dashboard', label: 'Home',    icon: '⌂' },
  { id: 'today',     label: 'Today',   icon: '✓' },
  { id: 'habits',    label: 'Habits',  icon: '◎' },
  { id: 'finance',   label: 'Finance', icon: '◈' },
  { id: 'log',       label: 'Log',     icon: '≡' },
]

export default function Sidebar({ current, onNavigate }) {
  return (
    <aside className="hidden md:flex w-56 flex-shrink-0 bg-[#080810] border-r border-[#1e1e2e] flex-col">
      <div className="p-6 border-b border-[#1e1e2e]">
        <div className="text-xs font-semibold text-[#7c6af7] tracking-widest uppercase mb-1">Command Center</div>
        <div className="text-2xl font-bold text-white">MAKS</div>
      </div>
      <nav className="flex-1 p-3 space-y-1">
        {NAV.map((item) => (
          <button key={item.id} onClick={() => onNavigate(item.id)}
            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all text-left ${
              current === item.id
                ? 'bg-[#7c6af7]/15 text-[#7c6af7] border border-[#7c6af7]/30 shadow-[0_0_15px_rgba(124,106,247,0.1)]'
                : 'text-[#9a9aaa] hover:text-white hover:bg-[#1a1a2e] border border-transparent'
            }`}>
            <span className="text-base">{item.icon}</span>{item.label}
          </button>
        ))}
      </nav>
      <div className="p-4 border-t border-[#1e1e2e]">
        <div className="text-xs text-[#2a2a3e]">v2.0</div>
      </div>
    </aside>
  )
}
