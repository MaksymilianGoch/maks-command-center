const NAV_DE = [
  { id: 'dashboard', label: 'Home',    icon: 'dashboard' },
  { id: 'today',     label: 'Today',   icon: 'check_circle' },
  { id: 'habits',    label: 'Habits',  icon: 'rebase_edit' },
  { id: 'finance',   label: 'Finance', icon: 'payments' },
  { id: 'log',       label: 'Log',     icon: 'timer' },
]

export default function BottomNav({ current, onNavigate }) {
  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-2 h-16 bg-surface-container/95 backdrop-blur-2xl border-t border-white/5 shadow-[0px_-8px_30px_rgba(0,0,0,0.4)] rounded-t-2xl md:hidden">
      {NAV_DE.map((item) => (
        <button key={item.id} onClick={() => onNavigate(item.id)}
          className={`flex flex-col items-center justify-center gap-0.5 flex-1 py-1 transition-all ${
            current === item.id
              ? 'text-primary'
              : 'text-on-surface-variant opacity-50 hover:opacity-80'
          }`}>
          <span className="material-symbols-outlined text-[22px]"
            style={current === item.id ? { fontVariationSettings: "'FILL' 1" } : {}}>
            {item.icon}
          </span>
          <span className="text-[10px] font-medium">{item.label}</span>
        </button>
      ))}
    </nav>
  )
}
