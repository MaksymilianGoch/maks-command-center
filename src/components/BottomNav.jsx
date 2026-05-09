const NAV = [
  { id: 'dashboard', label: 'Home',    icon: '⌂' },
  { id: 'today',     label: 'Today',   icon: '✓' },
  { id: 'habits',    label: 'Habits',  icon: '◎' },
  { id: 'finance',   label: 'Finance', icon: '◈' },
  { id: 'log',       label: 'Log',     icon: '≡' },
]

export default function BottomNav({ current, onNavigate }) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#080810]/95 backdrop-blur-md border-t border-[#1e1e2e] flex md:hidden">
      {NAV.map((item) => (
        <button key={item.id} onClick={() => onNavigate(item.id)}
          className={`flex-1 flex flex-col items-center justify-center py-3 gap-0.5 transition-all ${
            current === item.id ? 'text-[#7c6af7]' : 'text-[#4a4a6a] hover:text-[#9a9aaa]'
          }`}>
          <span className={`text-xl leading-none transition-all ${current === item.id ? 'scale-110' : ''}`}>{item.icon}</span>
          <span className="text-[10px] font-medium">{item.label}</span>
        </button>
      ))}
    </nav>
  )
}
