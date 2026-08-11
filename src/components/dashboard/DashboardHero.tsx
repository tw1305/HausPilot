import { useAuth } from '../../context/AuthContext'
import { AccountMenu } from '../layout/AccountMenu'
import { HeroWave } from '../layout/HeroWave'
import { IconBell } from '../layout/NavIcons'

interface DashboardHeroProps {
  /** Zeigt einen kleinen Punkt an der Glocke, wenn es etwas Anstehendes gibt. */
  hasUpcoming?: boolean
}

export function DashboardHero({ hasUpcoming }: DashboardHeroProps) {
  const { householdName } = useAuth()

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
          <AccountMenu />
        </div>
      </div>

      <HeroWave />
    </div>
  )
}
