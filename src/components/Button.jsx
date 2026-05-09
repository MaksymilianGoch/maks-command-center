export default function Button({ children, onClick, variant = 'primary', size = 'md', className = '', type = 'button', disabled = false }) {
  const variants = {
    primary: 'bg-primary text-on-primary hover:opacity-90 shadow-[inset_0_1px_1px_rgba(255,255,255,0.1)]',
    secondary: 'bg-surface-container text-on-surface border border-white/10 hover:bg-surface-container-high',
    ghost: 'text-on-surface-variant hover:text-on-surface hover:bg-surface-container',
    danger: 'bg-red-900/20 text-red-400 border border-red-900/30 hover:bg-red-900/40',
  }
  const sizes = {
    sm: 'px-4 py-1.5 text-xs rounded-full',
    md: 'px-6 py-2.5 text-sm rounded-full',
    lg: 'px-8 py-3 text-base rounded-full',
  }
  return (
    <button type={type} onClick={onClick} disabled={disabled}
      className={`font-medium transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}>
      {children}
    </button>
  )
}
