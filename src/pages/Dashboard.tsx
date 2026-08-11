import { EmptyState } from '../components/ui/EmptyState'
import { ReminderRow } from '../components/ui/ReminderRow'
import { MerkzettelSection } from '../components/dashboard/MerkzettelSection'
import { DashboardHero } from '../components/dashboard/DashboardHero'
import { AppDecor } from '../components/layout/AppDecor'
import { useReminders } from '../hooks/useReminders'
import { formatWeekdayDateDe } from '../utils/dates'

export default function Dashboard() {
  const { reminders, loading: remindersLoading, error: remindersError } = useReminders()

  return (
    <>
      <AppDecor />
      <DashboardHero hasUpcoming={reminders.length > 0} />

      <div className="px-4 pt-5">
        <div className="mb-5">
          <h2 className="text-2xl font-semibold text-slate-900">{formatWeekdayDateDe()}</h2>
          <p className="text-sm text-slate-500 mt-0.5">Diese Woche im Blick</p>
        </div>

        <section className="mb-6">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-700 mb-2">Anstehend</h3>
          {remindersError && <p className="text-sm text-red-500">{remindersError}</p>}
          {remindersLoading ? (
            <p className="text-sm text-slate-400">Lädt …</p>
          ) : reminders.length === 0 ? (
            <EmptyState title="Aktuell nichts Dringendes" hint="Neue Termine tauchen hier automatisch auf." />
          ) : (
            <div className="space-y-2">
              {reminders.map((item) => (
                <ReminderRow key={item.id} item={item} />
              ))}
            </div>
          )}
        </section>

        <MerkzettelSection />
      </div>
    </>
  )
}
