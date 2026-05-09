export default function Card({ children, className = '', onClick }) {
  return (
    <div
      className={`bg-zinc-900 border border-zinc-800 rounded-xl p-4 ${
        onClick ? 'cursor-pointer hover:border-zinc-700 transition-colors' : ''
      } ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  )
}
