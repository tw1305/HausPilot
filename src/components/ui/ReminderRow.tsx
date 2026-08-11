import { Link } from 'react-router-dom'
import { formatDateDe } from '../../utils/dates'
import type { ReminderItem } from '../../utils/reminders'

// Abbuchungen sind reine Info (wird automatisch abgebucht) – bleiben neutral,
// alles andere färbt sich rot/gelb, je näher die Fälligkeit rückt.
function urgencyDotClass(item: ReminderItem): string {
  if (item.type === 'contract_payment') return 'bg-emerald-400'
  if (item.daysUntil <= 7) return 'bg-red-400'
  if (item.daysUntil <= 30) return 'bg-amber-400'
  return 'bg-emerald-400'
}

export function ReminderRow({ item }: { item: ReminderItem }) {
  return (
    <Link
      to={item.link}
      className="flex items-center justify-between gap-3 rounded-2xl bg-[#152a19] px-4 py-3.5 transition-colors hover:bg-[#1c351f]"
    >
      <div className="flex items-center gap-3 min-w-0">
        <span className={`h-2.5 w-2.5 shrink-0 rounded-full ${urgencyDotClass(item)}`} />
        <div className="min-w-0">
          <p className="text-sm font-medium text-white truncate">{item.title}</p>
          {item.subtitle && <p className="text-xs text-emerald-100/60 truncate">{item.subtitle}</p>}
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <span className="rounded-full bg-emerald-800/70 px-2.5 py-1 text-xs font-medium text-emerald-50">
          {formatDateDe(item.dueDate)}
        </span>
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4 text-emerald-100/50">
          <path strokeLinecap="round" strokeLinejoin="round" d="m9 6 6 6-6 6" />
        </svg>
      </div>
    </Link>
  )
}
