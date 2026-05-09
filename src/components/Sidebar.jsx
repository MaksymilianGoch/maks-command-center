const NAV = [
  { id: 'dashboard', label: 'Home',    icon: 'dashboard' },
  { id: 'today',     label: 'Today',   icon: 'check_circle' },
  { id: 'habits',    label: 'Habits',  icon: 'rebase_edit' },
  { id: 'finance',   label: 'Finance', icon: 'payments' },
  { id: 'log',       label: 'Log',     icon: 'timer' },
]

export default function Sidebar({ current, onNavigate }) {
  return (
    <aside className="hidden md:flex w-60 flex-shrink-0 bg-surface/80 backdrop-blur-xl border-r border-white/10 flex-col">
      <div className="p-6 border-b border-white/10 flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-bold text-primary">M</div>
        <span className="text-lg font-bold tracking-tight text-on-surface">MAKS</span>
      </div>
      <nav className="flex-1 p-3 space-y-1">
        {NAV.map((item) => (
          <button key={item.id} onClick={() => onNavigate(item.id)}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all text-left ${
              current === item.id
                ? 'bg-primary/10 text-primary'
                : 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container'
            }`}>
            <span className="material-symbols-outlined text-[20px]"
              style={current === item.id ? { fontVariationSettings: "'FILL' 1" } : {}}>
              {item.icon}
            </span>
            {item.label}
          </button>
        ))}
      </nav>
    </aside>
  )
}
