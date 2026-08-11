import { useRef, type ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import { BottomNav } from './BottomNav'
import { IconLogout } from './NavIcons'
import { useAuth } from '../../context/AuthContext'
import { useSwipeNavigation } from '../../hooks/useSwipeNavigation'

interface AppShellProps {
  children: ReactNode
}

export function AppShell({ children }: AppShellProps) {
  const { householdName, logout } = useAuth()
  const mainRef = useRef<HTMLElement>(null)
  useSwipeNavigation(mainRef)
  // Die Start-Seite hat ihren eigenen Hero-Header (mit Avatar-Menü fürs
  // Abmelden) – die schmale graue Leiste wäre dort doppelt gemoppelt.
  const isDashboard = useLocation().pathname === '/'

  return (
    <div className="min-h-screen flex flex-col">
      {!isDashboard && (
        <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/80 backdrop-blur safe-top">
          <div className="max-w-md mx-auto flex items-center justify-between px-4 h-12">
            <div className="flex items-center gap-2 min-w-0">
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-brand text-white text-xs font-bold">H</span>
              <span className="text-sm font-medium text-slate-700 truncate">
                {householdName ?? 'HausPilot'}
              </span>
            </div>
            <button
              type="button"
              onClick={() => void logout()}
              className="flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800 transition-colors"
            >
              <IconLogout className="w-4 h-4" />
              Abmelden
            </button>
          </div>
        </header>
      )}

      <main ref={mainRef} className={`flex-1 w-full max-w-md mx-auto pb-24 ${isDashboard ? '' : 'px-4 pt-5'}`}>
        {children}
      </main>

      <BottomNav />
    </div>
  )
}
