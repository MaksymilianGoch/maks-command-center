const NAV = [
  { id: 'dashboard', label: 'Home',    icon: 'dashboard' },
  { id: 'today',     label: 'Today',   icon: 'check_circle' },
  { id: 'habits',    label: 'Habits',  icon: 'rebase_edit' },
  { id: 'finance',   label: 'Finance', icon: 'payments' },
  { id: 'log',       label: 'Log',     icon: 'timer' },
]

export default function BottomNav({ current, onNavigate }) {
  return (
    <nav className="fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 h-20 bg-surface-container/90 backdrop-blur-2xl border-t border-white/5 shadow-[0px_-10px_40px_rgba(0,0,0,0.4)] rounded-t-2xl md:hidden">
      {NAV.map((item) => (
        <button key={item.id} onClick={() => onNavigate(item.id)}
          className={`flex flex-col items-center justify-center gap-1 transition-all ${
            current === item.id
              ? 'text-primary font-bold scale-90'
              : 'text-on-surface-variant opacity-60 hover:opacity-100'
          }`}>
          <span className="material-symbols-outlined" style={current === item.id ? { fontVariationSettings: "'FILL' 1" } : {}}>
            {item.icon}
          </span>
          <span className="text-[11px] font-medium">{item.label}</span>
        </button>
      ))}
    </nav>
  )
}
