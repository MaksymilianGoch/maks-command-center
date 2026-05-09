const colors = {
  fitness: 'bg-orange-500/10 text-orange-400 border-orange-500/20',
  learning: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
  business: 'bg-purple-500/10 text-purple-400 border-purple-500/20',
  health: 'bg-green-500/10 text-green-400 border-green-500/20',
  other: 'bg-zinc-500/10 text-zinc-400 border-zinc-500/20',
  active: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
  paused: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
  done: 'bg-green-500/10 text-green-400 border-green-500/20',
}

export default function Badge({ label }) {
  const color = colors[label] || colors.other
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-medium border ${color}`}>
      {label}
    </span>
  )
}
