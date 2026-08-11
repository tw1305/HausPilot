import type { ReactNode } from 'react'
import type { CategoryTheme } from '../../theme/categories'
import { AccountMenu } from './AccountMenu'
import { HeroWave } from './HeroWave'

interface PageHeroProps {
  title: string
  subtitle?: string
  icon: ReactNode
  category: CategoryTheme
}

// Dunkler Hero-Header im Stil der Start-Seite, für jede Seite im eigenen
// Kategorie-Farbton (category.heroGradient) statt Grün. Bewusst ohne
// Aktions-Button in der Zeile (Icon + Titel + Avatar allein wird auf
// schmalen Bildschirmen schon knapp) – die "+"-Buttons der Seiten sitzen
// stattdessen oben im hellen Inhaltsbereich.
export function PageHero({ title, subtitle, icon, category }: PageHeroProps) {
  return (
    <div className={`relative overflow-hidden safe-top ${category.heroGradient}`}>
      <div className="relative z-10 max-w-md mx-auto px-4 pt-4 pb-14 flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/15 text-white">
            {icon}
          </span>
          <div className="min-w-0">
            <h1 className="text-2xl font-semibold text-white truncate">{title}</h1>
            {subtitle && <p className="text-sm text-white/70 mt-0.5 truncate">{subtitle}</p>}
          </div>
        </div>

        <AccountMenu />
      </div>

      <HeroWave />
    </div>
  )
}
