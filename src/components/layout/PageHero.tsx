import type { ReactNode } from 'react'
import type { CategoryTheme } from '../../theme/categories'
import { HeroWave } from './HeroWave'

interface PageHeroProps {
  title: string
  subtitle?: string
  icon: ReactNode
  category: CategoryTheme
}

// Dunkler Hero-Header im Stil der Start-Seite, für jede Seite im eigenen
// Kategorie-Farbton (category.heroGradient) statt Grün. Bewusst ohne
// Aktions-Button in der Zeile – die "+"-Buttons der Seiten sitzen
// stattdessen oben im hellen Inhaltsbereich. Der Abmelde-Button lebt
// nur noch im Dashboard-Hero, nicht auf jeder Unterseite.
export function PageHero({ title, subtitle, icon, category }: PageHeroProps) {
  return (
    <div className={`relative overflow-hidden safe-top ${category.heroGradient}`}>
      <div className="relative z-10 max-w-md mx-auto px-4 pt-4 pb-14 flex items-center gap-3">
        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-white/15 text-white">
          {icon}
        </span>
        <div className="min-w-0">
          <h1 className="text-2xl font-semibold text-white truncate">{title}</h1>
          {subtitle && <p className="text-sm text-white/70 mt-0.5 truncate">{subtitle}</p>}
        </div>
      </div>

      <HeroWave />
    </div>
  )
}
