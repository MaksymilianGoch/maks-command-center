export default function Button({
  children,
  onClick,
  variant = 'primary',
  size = 'md',
  className = '',
  type = 'button',
  disabled = false,
}) {
  const variants = {
    primary: 'bg-[#4f86f7] hover:bg-[#3a70e0] text-white',
    secondary: 'bg-[#22252e] hover:bg-[#2a2e38] text-[#b0b7c2] border border-[#323640]',
    danger: 'bg-red-900/20 hover:bg-red-900/40 text-red-400 border border-red-900/40',
    ghost: 'hover:bg-[#22252e] text-[#b0b7c2] hover:text-white',
  }
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2 text-sm',
    lg: 'px-6 py-3 text-base',
  }
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`rounded-xl font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${variants[variant]} ${sizes[size]} ${className}`}
    >
      {children}
    </button>
  )
}
