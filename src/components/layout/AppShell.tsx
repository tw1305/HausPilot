import { useRef, type ReactNode } from 'react'
import { BottomNav } from './BottomNav'
import { useSwipeNavigation } from '../../hooks/useSwipeNavigation'

interface AppShellProps {
  children: ReactNode
}

// Jede Seite bringt inzwischen ihren eigenen Hero-Header mit (DashboardHero
// bzw. PageHero) inklusive Konto-Menü fürs Abmelden – eine zusätzliche,
// schmale Kopfzeile hier würde sich damit doppeln.
export function AppShell({ children }: AppShellProps) {
  const mainRef = useRef<HTMLElement>(null)
  useSwipeNavigation(mainRef)

  return (
    <div className="min-h-screen flex flex-col">
      <main ref={mainRef} className="flex-1 w-full max-w-md mx-auto pb-24">
        {children}
      </main>

      <BottomNav />
    </div>
  )
}
