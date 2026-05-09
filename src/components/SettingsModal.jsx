import { useState } from 'react'
import Button from './Button'

export default function SettingsModal({ settings, update, resetData, onClose }) {
  const [confirmReset, setConfirmReset] = useState(false)

  const t = settings.language === 'en'

  return (
    <div className="fixed inset-0 z-50 flex items-end md:items-center justify-center">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative glass-card rounded-t-3xl md:rounded-2xl p-6 w-full md:max-w-md shadow-[0_10px_40px_rgba(0,0,0,0.4)] max-h-[85vh] overflow-y-auto">

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-on-surface">
            {t ? 'Settings' : 'Einstellungen'}
          </h2>
          <button onClick={onClose} className="text-on-surface-variant hover:text-on-surface transition-colors">
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="space-y-6">
          {/* Name */}
          <div>
            <label className="text-xs text-on-surface-variant uppercase tracking-widest block mb-2">
              {t ? 'Your Name' : 'Dein Name'}
            </label>
            <input
              className="w-full bg-surface-container-low border border-white/10 rounded-2xl px-4 py-3 text-sm text-on-surface placeholder-outline focus:outline-none focus:border-primary/50"
              value={settings.name}
              onChange={(e) => update('name', e.target.value)}
              placeholder="Maks"
            />
          </div>

          {/* Language */}
          <div>
            <label className="text-xs text-on-surface-variant uppercase tracking-widest block mb-2">
              {t ? 'Language' : 'Sprache'}
            </label>
            <div className="flex gap-2">
              {[{ value: 'de', label: 'Deutsch 🇩🇪' }, { value: 'en', label: 'English 🇬🇧' }].map((lang) => (
                <button key={lang.value} onClick={() => update('language', lang.value)}
                  className={`flex-1 py-2.5 rounded-2xl text-sm font-medium transition-all ${settings.language === lang.value ? 'bg-primary text-on-primary' : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'}`}>
                  {lang.label}
                </button>
              ))}
            </div>
          </div>

          {/* Theme */}
          <div>
            <label className="text-xs text-on-surface-variant uppercase tracking-widest block mb-2">
              {t ? 'Theme' : 'Design'}
            </label>
            <div className="flex gap-2">
              {[
                { value: 'dark', label: t ? '🌙 Dark' : '🌙 Dunkel' },
                { value: 'light', label: t ? '☀️ Light' : '☀️ Hell' },
              ].map((th) => (
                <button key={th.value} onClick={() => update('theme', th.value)}
                  className={`flex-1 py-2.5 rounded-2xl text-sm font-medium transition-all ${settings.theme === th.value ? 'bg-primary text-on-primary' : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'}`}>
                  {th.label}
                </button>
              ))}
            </div>
          </div>

          {/* Week Start */}
          <div>
            <label className="text-xs text-on-surface-variant uppercase tracking-widest block mb-2">
              {t ? 'Week starts on' : 'Wochenstart'}
            </label>
            <div className="flex gap-2">
              {[
                { value: 'monday', label: t ? 'Monday' : 'Montag' },
                { value: 'sunday', label: t ? 'Sunday' : 'Sonntag' },
              ].map((w) => (
                <button key={w.value} onClick={() => update('weekStart', w.value)}
                  className={`flex-1 py-2.5 rounded-2xl text-sm font-medium transition-all ${settings.weekStart === w.value ? 'bg-primary text-on-primary' : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'}`}>
                  {w.label}
                </button>
              ))}
            </div>
          </div>

          {/* Max Habits */}
          <div>
            <label className="text-xs text-on-surface-variant uppercase tracking-widest block mb-2">
              {t ? 'Max Habits' : 'Max. Habits'} ({settings.habitsMax})
            </label>
            <input type="range" min={3} max={10} value={settings.habitsMax}
              onChange={(e) => update('habitsMax', +e.target.value)}
              className="w-full accent-primary" />
            <div className="flex justify-between text-xs text-on-surface-variant mt-1">
              <span>3</span><span>10</span>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-white/10" />

          {/* Data Reset */}
          <div>
            <label className="text-xs text-on-surface-variant uppercase tracking-widest block mb-2">
              {t ? 'Data' : 'Daten'}
            </label>
            {!confirmReset ? (
              <button onClick={() => setConfirmReset(true)}
                className="w-full py-3 rounded-2xl text-sm font-medium bg-red-500/10 text-red-400 border border-red-500/20 hover:bg-red-500/20 transition-all flex items-center justify-center gap-2">
                <span className="material-symbols-outlined text-lg">delete_forever</span>
                {t ? 'Reset all data' : 'Alle Daten zurücksetzen'}
              </button>
            ) : (
              <div className="space-y-2">
                <p className="text-xs text-red-400 text-center">
                  {t ? 'This deletes all habits, tasks, finance and logs.' : 'Löscht alle Habits, Tasks, Finanzen und Logs.'}
                </p>
                <div className="flex gap-2">
                  <button onClick={() => setConfirmReset(false)}
                    className="flex-1 py-2.5 rounded-2xl text-sm bg-surface-container text-on-surface-variant">
                    {t ? 'Cancel' : 'Abbrechen'}
                  </button>
                  <button onClick={resetData}
                    className="flex-1 py-2.5 rounded-2xl text-sm bg-red-500 text-white font-bold">
                    {t ? 'Delete' : 'Löschen'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* App info */}
          <p className="text-xs text-on-surface-variant text-center pt-2">
            MAKS Command Center · v2.0
          </p>
        </div>
      </div>
    </div>
  )
}
