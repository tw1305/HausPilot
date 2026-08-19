import { useState } from 'react'
import { AccountMenu } from '../layout/AccountMenu'
import { HeroWave } from '../layout/HeroWave'
import { WeatherButton } from './WeatherButton'
import { randomGreeting } from '../../utils/greeting'

export function DashboardHero() {
  const [greeting] = useState(() => randomGreeting())

  return (
    <div className="relative overflow-hidden bg-gradient-to-b from-[#0c1c12] via-[#16301b] to-[#204223] safe-top">
      <div className="relative z-10 max-w-md mx-auto px-4 pt-4 pb-14 flex items-start justify-between gap-3">
        <div className="min-w-0">
          <h1 className="text-2xl font-semibold text-white truncate">{greeting}</h1>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <WeatherButton />
          <AccountMenu />
        </div>
      </div>

      <HeroWave />
    </div>
  )
}
