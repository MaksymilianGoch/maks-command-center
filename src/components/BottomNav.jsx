const NAV = [
  { id: 'dashboard', label: 'Home', icon: '⊡' },
  { id: 'habits', label: 'Habits', icon: '○' },
  { id: 'goals', label: 'Goals', icon: '◈' },
  { id: 'dailylog', label: 'Log', icon: '✎' },
  { id: 'weeklyreview', label: 'Review', icon: '↗' },
]

export default function BottomNav({ current, onNavigate }) {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-[#22252e] border-t border-[#323640] flex md:hidden">
      {NAV.map((item) => (
        <button
          key={item.id}
          onClick={() => onNavigate(item.id)}
          className={`flex-1 flex flex-col items-center justify-center py-3 gap-1 text-xs font-medium transition-colors ${
            current === item.id
              ? 'text-[#4f86f7]'
              : 'text-[#b0b7c2] hover:text-white'
          }`}
        >
          <span className="text-lg leading-none">{item.icon}</span>
          <span>{item.label}</span>
        </button>
      ))}
    </nav>
  )
}
