export default function SubNav({ tabs, active, onChange }) {
  return (
    <div className="flex gap-1 bg-surface-container rounded-2xl p-1 mb-6">
      {tabs.map((tab) => (
        <button key={tab.id} onClick={() => onChange(tab.id)}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl text-sm font-medium transition-all ${
            active === tab.id
              ? 'bg-primary text-on-primary shadow-sm'
              : 'text-on-surface-variant hover:text-on-surface'
          }`}>
          {tab.icon && <span className="material-symbols-outlined text-[16px]">{tab.icon}</span>}
          <span className="hidden sm:inline">{tab.label}</span>
          <span className="sm:hidden">{tab.short || tab.label}</span>
        </button>
      ))}
    </div>
  )
}
