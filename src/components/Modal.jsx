import { useEffect } from 'react'
import Button from './Button'

export default function Modal({ title, onClose, children }) {
  useEffect(() => {
    const h = (e) => e.key === 'Escape' && onClose()
    window.addEventListener('keydown', h)
    return () => window.removeEventListener('keydown', h)
  }, [onClose])

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative glass-card rounded-t-3xl md:rounded-2xl p-6 w-full md:max-w-lg shadow-[0_10px_40px_rgba(0,0,0,0.4)] max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-semibold text-on-surface">{title}</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>✕</Button>
        </div>
        {children}
      </div>
    </div>
  )
}
