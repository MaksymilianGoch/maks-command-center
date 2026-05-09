export default function Card({ children, className = '', onClick, variant = 'glass' }) {
  const variants = {
    glass: 'glass-card',
    solid: 'bg-surface-container border border-white/5',
    low: 'bg-surface-container-low border border-white/5',
    highlight: 'bg-primary/10 border border-primary/20',
  }
  const click = onClick ? 'cursor-pointer hover:bg-surface-container-high transition-all active:scale-[0.99]' : ''
  return (
    <div className={`rounded-2xl p-6 ${variants[variant]} ${click} ${className}`} onClick={onClick}>
      {children}
    </div>
  )
}
