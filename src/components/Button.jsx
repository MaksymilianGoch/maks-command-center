export default function Button({ children, onClick, variant = 'primary', size = 'md', className = '', type = 'button', disabled = false }) {
  const variants = {
    primary: 'bg-[#7c6af7] hover:bg-[#6c5ce7] text-white',
    secondary: 'bg-[#13141c] hover:bg-[#1e2030] text-[#9a9aaa] border border-[#1e2030]',
    danger: 'bg-red-900/20 hover:bg-red-900/40 text-red-400 border border-red-900/30',
    ghost: 'hover:bg-[#13141c] text-[#9a9aaa] hover:text-white',
  }
  const sizes = { sm: 'px-3 py-1.5 text-sm', md: 'px-4 py-2 text-sm', lg: 'px-6 py-3 text-base' }
  return (
    <button type={type} onClick={onClick} disabled={disabled}
      className={`rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}>
      {children}
    </button>
  )
}
