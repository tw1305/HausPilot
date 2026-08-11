import { useEffect, useRef, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { IconLogout } from './NavIcons'

// Runder Avatar-Button für dunkle Hero-Header: antippen öffnet ein kleines
// Menü mit Haushaltsname + Abmelden (ersetzt die frühere separate Kopfzeile).
export function AccountMenu() {
  const { householdName, logout } = useAuth()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [open])

  const initial = (householdName ?? 'H').trim().charAt(0).toUpperCase() || 'H'

  return (
    <div ref={ref} className="relative shrink-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-600 text-sm font-semibold text-white shadow-sm transition-transform active:scale-95"
        aria-haspopup="true"
        aria-expanded={open}
        aria-label="Konto-Menü"
      >
        {initial}
      </button>
      {open && (
        <div className="absolute right-0 top-11 z-20 w-40 overflow-hidden rounded-xl border border-black/5 bg-white py-1 shadow-lg">
          <div className="px-3 py-1.5 text-xs text-slate-400 truncate">{householdName ?? 'HausPilot'}</div>
          <button
            type="button"
            onClick={() => void logout()}
            className="flex w-full items-center gap-2 px-3 py-2 text-sm text-slate-700 hover:bg-slate-50"
          >
            <IconLogout className="w-4 h-4" />
            Abmelden
          </button>
        </div>
      )}
    </div>
  )
}
