const colors = {
  fitness:  'bg-orange-500/10 text-orange-400 border-orange-500/20',
  learning: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  business: 'bg-[#7c6af7]/10 text-[#7c6af7] border-[#7c6af7]/20',
  health:   'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  other:    'bg-[#1e2030] text-[#9a9aaa] border-[#1e2030]',
  active:   'bg-[#7c6af7]/10 text-[#7c6af7] border-[#7c6af7]/20',
  paused:   'bg-amber-500/10 text-amber-400 border-amber-500/20',
  done:     'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
}

export default function Badge({ label }) {
  const color = colors[label] || colors.other
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-lg text-xs font-medium border ${color}`}>
      {label}
    </span>
  )
}
