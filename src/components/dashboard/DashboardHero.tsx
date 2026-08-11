import { useEffect, useRef, useState } from 'react'
import { useAuth } from '../../context/AuthContext'
import { IconBell, IconLogout } from '../layout/NavIcons'

interface DashboardHeroProps {
  /** Zeigt einen kleinen Punkt an der Glocke, wenn es etwas Anstehendes gibt. */
  hasUpcoming?: boolean
}

export function DashboardHero({ hasUpcoming }: DashboardHeroProps) {
  const { householdName, logout } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const menuRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!menuOpen) return
    const onClick = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setMenuOpen(false)
    }
    document.addEventListener('mousedown', onClick)
    return () => document.removeEventListener('mousedown', onClick)
  }, [menuOpen])

  const initial = (householdName ?? 'H').trim().charAt(0).toUpperCase() || 'H'

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-[#0c1c12] via-[#16301b] to-[#204223] safe-top">
      <div className="relative z-10 max-w-md mx-auto px-4 pt-4 pb-14 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-2xl font-semibold text-white truncate">{householdName ?? 'HausPilot'}</h1>
          <p className="text-sm text-emerald-100/70 mt-0.5">Willkommen zurück</p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <span className="relative flex h-9 w-9 items-center justify-center text-emerald-50/90">
            <IconBell className="w-5 h-5" />
            {hasUpcoming && (
              <span className="absolute top-1 right-1.5 h-2 w-2 rounded-full bg-emerald-400 ring-2 ring-[#16301b]" />
            )}
          </span>

          <div ref={menuRef} className="relative">
            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-600 text-sm font-semibold text-white shadow-sm transition-transform active:scale-95"
              aria-haspopup="true"
              aria-expanded={menuOpen}
              aria-label="Konto-Menü"
            >
              {initial}
            </button>
            {menuOpen && (
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
        </div>
      </div>

      <svg
        className="absolute bottom-0 left-0 w-full h-10"
        viewBox="0 0 400 56"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <path d="M0,20 C90,58 170,2 260,18 C320,29 360,12 400,0 L400,56 L0,56 Z" fill="#f2f1ec" />
      </svg>
    </div>
  )
}
