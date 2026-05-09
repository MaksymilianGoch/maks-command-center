export default function Button({ children, onClick, variant = 'primary', size = 'md', className = '', type = 'button', disabled = false }) {
  const variants = {
    primary: 'bg-[#7c6af7] hover:bg-[#6c5ce7] text-white shadow-[0_0_15px_rgba(124,106,247,0.3)]',
    secondary: 'bg-[#1a1a2e] hover:bg-[#1e1e38] text-[#9a9aaa] border border-[#2a2a3e]',
    danger: 'bg-red-900/20 hover:bg-red-900/40 text-red-400 border border-red-900/30',
    ghost: 'hover:bg-[#1a1a2e] text-[#9a9aaa] hover:text-white',
  }
  const sizes = { sm: 'px-3 py-1.5 text-xs', md: 'px-4 py-2 text-sm', lg: 'px-6 py-3 text-base' }
  return (
    <button type={type} onClick={onClick} disabled={disabled}
      className={`rounded-xl font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}>
      {children}
    </button>
  )
}
