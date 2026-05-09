const NAV = [
  { id: 'dashboard', label: 'Home',    icon: '⊡' },
  { id: 'today',     label: 'Today',   icon: '✓' },
  { id: 'habits',    label: 'Habits',  icon: '○' },
  { id: 'finance',   label: 'Finance', icon: '◈' },
  { id: 'log',       label: 'Log',     icon: '✎' },
]

export default function BottomNav({ current, onNavigate }) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#0a0b10] border-t border-[#1e2030] flex md:hidden">
      {NAV.map((item) => (
        <button key={item.id} onClick={() => onNavigate(item.id)}
          className={`flex-1 flex flex-col items-center justify-center py-3 gap-0.5 text-xs font-medium transition-colors ${
            current === item.id ? 'text-[#7c6af7]' : 'text-[#9a9aaa] hover:text-white'
          }`}>
          <span className="text-lg leading-none">{item.icon}</span>
          <span>{item.label}</span>
        </button>
      ))}
    </nav>
  )
}
