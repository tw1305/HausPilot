import { useEffect, useState } from 'react'
import { PageHeader } from '../components/layout/PageHeader'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Modal } from '../components/ui/Modal'
import { EmptyState } from '../components/ui/EmptyState'
import { IconWrench } from '../components/layout/NavIcons'
import { AppDecor } from '../components/layout/AppDecor'
import {
  ApplianceForm,
  applianceCategoryLabels,
  emptyApplianceFormValues,
  type ApplianceFormValues,
} from '../components/haustechnik/ApplianceForm'
import { MaintenanceLogForm, type MaintenanceLogFormValues } from '../components/haustechnik/MaintenanceLogForm'
import { gql } from '../lib/nhost'
import { categories } from '../theme/categories'
import { daysUntil, formatDateDe } from '../utils/dates'
import { formatEUR } from '../utils/currency'
import type { Appliance, ApplianceMaintenanceLogEntry } from '../types/database'

const cat = categories.haustechnik

type ApplianceWithLog = Appliance & { appliance_maintenance_log: ApplianceMaintenanceLogEntry[] }

const LIST_QUERY = /* GraphQL */ `
  query Appliances {
    appliances(order_by: { created_at: asc }) {
      id
      category
      name
      manufacturer
      model
      serial_number
      installed_on
      next_maintenance_due
      details
      notes
      created_at
      appliance_maintenance_log {
        id
        appliance_id
        performed_on
        description
        performed_by
        cost
        created_at
      }
    }
  }
`

const INSERT_APPLIANCE = /* GraphQL */ `
  mutation InsertAppliance($object: appliances_insert_input!) {
    insert_appliances_one(object: $object) {
      id
    }
  }
`

const UPDATE_APPLIANCE = /* GraphQL */ `
  mutation UpdateAppliance($id: uuid!, $set: appliances_set_input!) {
    update_appliances_by_pk(pk_columns: { id: $id }, _set: $set) {
      id
    }
  }
`

const DELETE_APPLIANCE = /* GraphQL */ `
  mutation DeleteAppliance($id: uuid!) {
    delete_appliances_by_pk(id: $id) {
      id
    }
  }
`

const INSERT_LOG_ENTRY = /* GraphQL */ `
  mutation InsertLogEntry($object: appliance_maintenance_log_insert_input!) {
    insert_appliance_maintenance_log_one(object: $object) {
      id
    }
  }
`

function valuesFromAppliance(appliance?: ApplianceWithLog): ApplianceFormValues {
  if (!appliance) return emptyApplianceFormValues
  return {
    category: appliance.category,
    name: appliance.name,
    manufacturer: appliance.manufacturer ?? '',
    model: appliance.model ?? '',
    serial_number: appliance.serial_number ?? '',
    installed_on: appliance.installed_on ?? '',
    next_maintenance_due: appliance.next_maintenance_due ?? '',
    notes: appliance.notes ?? '',
  }
}

export default function Haustechnik() {
  const [appliances, setAppliances] = useState<ApplianceWithLog[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editing, setEditing] = useState<ApplianceWithLog | null | 'new'>(null)
  const [saving, setSaving] = useState(false)

  const load = async (): Promise<ApplianceWithLog[]> => {
    setLoading(true)
    try {
      const data = await gql<{ appliances: ApplianceWithLog[] }>(LIST_QUERY)
      setAppliances(data.appliances)
      setError(null)
      return data.appliances
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unbekannter Fehler beim Laden.')
      return []
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void load()
  }, [])

  const handleSave = async (values: ApplianceFormValues) => {
    setSaving(true)
    setError(null)
    const applianceSet = {
      category: values.category,
      name: values.name,
      manufacturer: values.manufacturer || null,
      model: values.model || null,
      serial_number: values.serial_number || null,
      installed_on: values.installed_on || null,
      next_maintenance_due: values.next_maintenance_due || null,
      notes: values.notes || null,
    }

    const isNew = editing === 'new'
    const current = isNew ? undefined : (editing ?? undefined)

    try {
      if (isNew) {
        await gql(INSERT_APPLIANCE, { object: applianceSet })
      } else if (current) {
        await gql(UPDATE_APPLIANCE, { id: current.id, set: applianceSet })
      }
      setEditing(null)
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unbekannter Fehler beim Speichern.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!editing || editing === 'new') return
    if (!confirm(`"${editing.name}" wirklich löschen?`)) return
    setSaving(true)
    try {
      await gql(DELETE_APPLIANCE, { id: editing.id })
      setEditing(null)
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unbekannter Fehler beim Löschen.')
    } finally {
      setSaving(false)
    }
  }

  const handleAddLogEntry = async (applianceId: string, values: MaintenanceLogFormValues) => {
    try {
      await gql(INSERT_LOG_ENTRY, {
        object: {
          appliance_id: applianceId,
          performed_on: values.performed_on,
          description: values.description,
          performed_by: values.performed_by || null,
          cost: values.cost ? Number(values.cost) : null,
        },
      })
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unbekannter Fehler beim Speichern.')
      return
    }
    const rows = await load()
    setEditing((current) => {
      if (!current || current === 'new') return current
      return rows.find((a) => a.id === applianceId) ?? current
    })
  }

  return (
    <>
      <AppDecor />
      <PageHeader
        title="Haus & Technik"
        category={cat}
        icon={<IconWrench className="w-6 h-6" />}
        action={<Button accent={cat.solid} onClick={() => setEditing('new')}>+ Gerät</Button>}
      />

      {error && <p className="text-sm text-red-500 mb-4">{error}</p>}

      {loading ? (
        <p className="text-sm text-slate-400">Lädt …</p>
      ) : appliances.length === 0 ? (
        <EmptyState title="Noch keine Geräte erfasst" hint="z. B. Wärmepumpe oder später PV-Anlage." />
      ) : (
        <div className="space-y-3">
          {appliances.map((appliance) => (
            <Card
              key={appliance.id}
              className="cursor-pointer hover:border-slate-300 transition-colors"
              onClick={() => setEditing(appliance)}
            >
              <div className="flex items-center gap-3">
                <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${cat.tintBg} ${cat.text}`}>
                  <IconWrench className="w-5 h-5" />
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-800">{appliance.name}</p>
                  <p className="text-xs text-slate-400">
                    {applianceCategoryLabels[appliance.category]}
                    {appliance.manufacturer ? ` · ${appliance.manufacturer}` : ''}
                  </p>
                </div>
                {appliance.next_maintenance_due && (
                  <div className="text-right shrink-0">
                    <p className="text-xs text-slate-400">Wartung</p>
                    <p
                      className={`text-xs font-medium ${
                        daysUntil(appliance.next_maintenance_due) <= 30 ? 'text-amber-600' : 'text-slate-500'
                      }`}
                    >
                      {formatDateDe(appliance.next_maintenance_due)}
                    </p>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}

      {editing && (
        <Modal title={editing === 'new' ? 'Gerät hinzufügen' : 'Gerät bearbeiten'} onClose={() => setEditing(null)}>
          <ApplianceForm
            initialValues={valuesFromAppliance(editing === 'new' ? undefined : editing)}
            onSubmit={handleSave}
            onDelete={editing !== 'new' ? handleDelete : undefined}
            submitting={saving}
          />

          {editing !== 'new' && (
            <div className="mt-6 pt-4 border-t border-slate-200">
              <h3 className="text-xs font-semibold uppercase tracking-wide text-slate-400 mb-2">Wartungsprotokoll</h3>
              {editing.appliance_maintenance_log.length === 0 ? (
                <p className="text-sm text-slate-400 mb-3">Noch keine Einträge.</p>
              ) : (
                <ul className="mb-3 space-y-1.5">
                  {[...editing.appliance_maintenance_log]
                    .sort((a, b) => b.performed_on.localeCompare(a.performed_on))
                    .map((entry) => (
                      <li key={entry.id} className="text-sm text-slate-600 flex justify-between gap-2">
                        <span>
                          <span className="text-slate-400">{formatDateDe(entry.performed_on)}</span> {entry.description}
                        </span>
                        {entry.cost !== null && <span className="text-slate-400 shrink-0">{formatEUR(entry.cost)}</span>}
                      </li>
                    ))}
                </ul>
              )}
              <MaintenanceLogForm onSubmit={(values) => handleAddLogEntry(editing.id, values)} />
            </div>
          )}
        </Modal>
      )}
    </>
  )
}
