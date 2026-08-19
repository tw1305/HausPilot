import { useState } from 'react'
import { EmptyState } from '../components/ui/EmptyState'
import { ReminderRow } from '../components/ui/ReminderRow'
import { MerkzettelSection } from '../components/dashboard/MerkzettelSection'
import { DashboardHero } from '../components/dashboard/DashboardHero'
import { AppDecor } from '../components/layout/AppDecor'
import { useReminders } from '../hooks/useReminders'
import { formatWeekdayDateDe } from '../utils/dates'

const SOON_DAYS = 28

export default function Dashboard() {
  const { reminders, loading: remindersLoading, error: remindersError } = useReminders()
  const [showMore, setShowMore] = useState(false)

  const soonReminders = reminders.filter((item) => item.daysUntil <= SOON_DAYS)
  const laterReminders = reminders.filter((item) => item.daysUntil > SOON_DAYS)

  return (
    <>
      <AppDecor />
      <DashboardHero />

      <div className="px-4 pt-5">
        <div className="mb-5">
          <h2 className="text-2xl font-semibold text-slate-900">{formatWeekdayDateDe()}</h2>
          <p className="text-sm text-slate-500 mt-0.5">Die nächsten Wochen im Blick</p>
        </div>

        <section className="mb-6">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-700 mb-2">Anstehend</h3>
          {remindersError && <p className="text-sm text-red-500">{remindersError}</p>}
          {remindersLoading ? (
            <p className="text-sm text-slate-400">Lädt …</p>
          ) : reminders.length === 0 ? (
            <EmptyState title="Aktuell nichts Dringendes" hint="Neue Termine tauchen hier automatisch auf." />
          ) : (
            <>
              {soonReminders.length === 0 ? (
                <p className="py-2 text-sm text-slate-400">Nächste 4 Wochen frei.</p>
              ) : (
                <div className="space-y-2">
                  {soonReminders.map((item) => (
                    <ReminderRow key={item.id} item={item} />
                  ))}
                </div>
              )}

              {laterReminders.length > 0 && (
                <div className="mt-2">
                  <button
                    type="button"
                    onClick={() => setShowMore((v) => !v)}
                    className="flex w-full items-center justify-center gap-1.5 py-2 text-xs font-medium text-slate-400 transition-colors hover:text-slate-600"
                  >
                    Weitere ({laterReminders.length})
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      className={`h-3.5 w-3.5 transition-transform ${showMore ? 'rotate-180' : ''}`}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="m6 9 6 6 6-6" />
                    </svg>
                  </button>
                  {showMore && (
                    <div className="mt-1 space-y-2">
                      {laterReminders.map((item) => (
                        <ReminderRow key={item.id} item={item} />
                      ))}
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </section>

        <MerkzettelSection />
      </div>
    </>
  )
}
