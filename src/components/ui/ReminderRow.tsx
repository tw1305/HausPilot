import { Link } from 'react-router-dom'
import { formatDateDe } from '../../utils/dates'
import { categoryForPath } from '../../theme/categories'
import type { ReminderItem } from '../../utils/reminders'

// Kein Text mehr für "in X Tagen" – das genaue Datum steht ja schon drunter.
// Dringlichkeit nur noch als schlichter, heller Ampel-Balken (rot/gelb/grün).
// Abbuchungen sind reine Info (wird automatisch abgebucht, nichts zu tun) –
// die bekommen bewusst keinen Balken.
function urgencyBarClass(item: ReminderItem): string | null {
  if (item.type === 'contract_payment') return null
  if (item.daysUntil <= 7) return 'bg-red-200'
  if (item.daysUntil <= 30) return 'bg-yellow-200'
  return 'bg-green-200'
}

export function ReminderRow({ item }: { item: ReminderItem }) {
  const category = categoryForPath(item.link)
  const barClass = urgencyBarClass(item)
  return (
    <Link
      to={item.link}
      className="flex items-center justify-between gap-3 py-2.5 border-b border-slate-100 last:border-0 hover:bg-slate-50 -mx-1 px-1 rounded-lg transition-colors"
    >
      <div className="flex items-center gap-2.5 min-w-0">
        <span className={`h-2 w-2 shrink-0 rounded-full ${category.dot}`} />
        <div className="min-w-0">
          <p className="text-sm text-slate-800 truncate">{item.title}</p>
          {item.subtitle && <p className="text-xs text-slate-400 truncate">{item.subtitle}</p>}
        </div>
      </div>
      <div className="flex flex-col items-end gap-1 shrink-0">
        {barClass && <span className={`h-1.5 w-8 rounded-full ${barClass}`} />}
        <p className="text-[11px] text-slate-400">{formatDateDe(item.dueDate)}</p>
      </div>
    </Link>
  )
}
