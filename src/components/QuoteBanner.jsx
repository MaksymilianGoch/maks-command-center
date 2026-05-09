export default function QuoteBanner({ quote }) {
  return (
    <div className="bg-primary/5 border border-primary/15 rounded-2xl px-4 py-3">
      <p className="text-sm text-on-surface-variant italic leading-relaxed">
        {quote.text}
      </p>
      <p className="text-xs text-primary mt-1.5 font-medium">— {quote.source}</p>
    </div>
  )
}
