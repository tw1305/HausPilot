import type { ReactNode } from 'react'
import type { CategoryTheme } from '../../theme/categories'

interface PageHeaderProps {
  title: string
  subtitle?: string
  action?: ReactNode
  /** Kategorie liefert Akzentfarbe für das Icon-Badge. */
  category?: CategoryTheme
  icon?: ReactNode
  /** Helle Schrift für Seiten mit dunklem Hintergrund (z. B. Garten). */
  onDark?: boolean
}

export function PageHeader({ title, subtitle, action, category, icon, onDark }: PageHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-3 mb-5">
      <div className="flex items-center gap-3 min-w-0">
        {icon && category && (
          <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl ${category.tintBg} ${category.text}`}>
            {icon}
          </span>
        )}
        <div className="min-w-0">
          <h1 className={`text-2xl font-semibold truncate ${onDark ? 'text-white' : 'text-slate-900'}`}>{title}</h1>
          {subtitle && <p className={`text-sm mt-0.5 ${onDark ? 'text-emerald-100/80' : 'text-slate-500'}`}>{subtitle}</p>}
        </div>
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  )
}
