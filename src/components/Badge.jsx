export default function Badge({ label, variant = 'default' }) {
  const variants = {
    default: 'bg-surface-container text-on-surface-variant',
    primary: 'bg-primary/10 text-primary',
    tertiary: 'bg-tertiary/10 text-tertiary',
    success: 'bg-green-500/10 text-green-400',
    warning: 'bg-amber-500/10 text-amber-400',
    fitness: 'bg-tertiary/10 text-tertiary',
    learning: 'bg-primary/10 text-primary',
    business: 'bg-primary/10 text-primary',
    health: 'bg-green-500/10 text-green-400',
    other: 'bg-surface-variant/50 text-on-surface-variant',
    active: 'bg-primary/10 text-primary',
    paused: 'bg-amber-500/10 text-amber-400',
    done: 'bg-green-500/10 text-green-400',
  }
  const color = variants[label] || variants[variant] || variants.default
  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${color}`}>
      {label}
    </span>
  )
}
