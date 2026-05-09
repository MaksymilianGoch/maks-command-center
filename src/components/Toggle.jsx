export default function Toggle({ checked, onChange, size = 'md' }) {
  const w = size === 'sm' ? 'w-9 h-5' : 'w-11 h-6'
  const t = size === 'sm' ? 'w-4 h-4 top-0.5 left-0.5' : 'w-5 h-5 top-0.5 left-0.5'
  const tr = size === 'sm' ? 'translate-x-4' : 'translate-x-5'
  return (
    <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
      <input type="checkbox" className="sr-only peer" checked={checked} onChange={onChange} />
      <div className={`${w} rounded-full transition-colors ${checked ? 'bg-primary' : 'bg-surface-variant'}`}>
        <div className={`absolute ${t} rounded-full bg-white shadow transition-transform ${checked ? tr : 'translate-x-0'}`} />
      </div>
    </label>
  )
}
