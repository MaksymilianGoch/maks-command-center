export default function Card({ children, className = '', onClick }) {
  return (
    <div
      className={`bg-[#22252e] border border-[#323640] rounded-2xl p-4 ${
        onClick ? 'cursor-pointer hover:border-[#4f86f7]/40 transition-colors' : ''
      } ${className}`}
      onClick={onClick}
    >
      {children}
    </div>
  )
}
