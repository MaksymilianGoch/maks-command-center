export default function Card({ children, className = '', onClick }) {
  return (
    <div
      className={`bg-[#13141c] border border-[#1e2030] rounded-2xl p-4 ${
        onClick ? 'cursor-pointer hover:border-[#7c6af7]/40 transition-colors' : ''
      } ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  )
}
