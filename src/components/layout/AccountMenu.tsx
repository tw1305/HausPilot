import { useEffect, useRef, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { IconLogout, IconHomeSolid } from './NavIcons'

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

  return (
    <div ref={ref} className="relative shrink-0">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-[#16301b] shadow-sm transition-transform active:scale-95"
        aria-haspopup="true"
        aria-expanded={open}
        aria-label="Konto-Menü"
      >
        <IconHomeSolid className="w-5 h-5 text-white" />
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
