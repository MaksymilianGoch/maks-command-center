export default function Toggle({ checked, onChange, size = 'md' }) {
  const track = size === 'sm' ? 'w-9 h-5' : 'w-11 h-6'
  const thumb = size === 'sm' ? 'w-4 h-4 top-0.5 left-0.5' : 'w-5 h-5 top-0.5 left-0.5'
  const translate = size === 'sm' ? 'translate-x-4' : 'translate-x-5'
  return (
    <label className="relative inline-flex items-center cursor-pointer flex-shrink-0">
      <input type="checkbox" className="sr-only" checked={checked} onChange={onChange} />
      <div className={`${track} rounded-full transition-colors ${checked ? 'bg-[#7c6af7]' : 'bg-[#1e2030]'}`}>
        <div className={`absolute ${thumb} rounded-full bg-white shadow transition-transform ${checked ? translate : 'translate-x-0'}`} />
      </div>
    </label>
  )
}
