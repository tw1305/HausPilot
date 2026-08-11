import { PageHeader } from '../components/layout/PageHeader'
import { Card } from '../components/ui/Card'
import { EmptyState } from '../components/ui/EmptyState'
import { ReminderRow } from '../components/ui/ReminderRow'
import { MerkzettelSection } from '../components/dashboard/MerkzettelSection'
import { AppDecor } from '../components/layout/AppDecor'
import { IconBell } from '../components/layout/NavIcons'
import { useReminders } from '../hooks/useReminders'
import { categories } from '../theme/categories'
import { formatWeekdayDateDe } from '../utils/dates'

const cat = categories.dashboard

export default function Dashboard() {
  const { reminders, loading: remindersLoading, error: remindersError } = useReminders()

  return (
    <>
      <AppDecor />
      <PageHeader
        title={formatWeekdayDateDe()}
        subtitle="Diese Woche im Blick"
        category={cat}
        icon={<IconBell className="w-6 h-6" />}
      />

      <section className="mb-6">
        <h2 className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-2">Anstehend</h2>
        {remindersError && <p className="text-sm text-red-500">{remindersError}</p>}
        {remindersLoading ? (
          <p className="text-sm text-slate-400">Lädt …</p>
        ) : reminders.length === 0 ? (
          <EmptyState title="Aktuell nichts Dringendes" hint="Neue Termine tauchen hier automatisch auf." />
        ) : (
          <Card>
            {reminders.map((item) => (
              <ReminderRow key={item.id} item={item} />
            ))}
          </Card>
        )}
      </section>

      <MerkzettelSection />
    </>
  )
}
