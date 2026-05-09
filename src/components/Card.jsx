export default function Card({ children, className = '', onClick, glow = false }) {
  const base = 'bg-[#0f1017] rounded-2xl p-4 transition-all'
  const border = glow
    ? 'border border-[#7c6af7]/30 shadow-[0_0_25px_rgba(124,106,247,0.12)]'
    : 'border border-[#1e1e2e] hover:border-[#2a2a3e]'
  const click = onClick ? 'cursor-pointer active:scale-[0.98]' : ''
  return (
    <div className={`${base} ${border} ${click} ${className}`} onClick={onClick}>
      {children}
    </div>
  )
}
