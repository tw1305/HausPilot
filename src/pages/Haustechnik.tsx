import { useEffect, useState } from 'react'
import { PageHero } from '../components/layout/PageHero'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Modal } from '../components/ui/Modal'
import { EmptyState } from '../components/ui/EmptyState'
import { IconWrench, IconHome, IconLeaf, IconClipboardCheck, IconTag, IconCheck, IconTrash } from '../components/layout/NavIcons'
import { AppDecor } from '../components/layout/AppDecor'
import {
  ApplianceForm,
  defaultApplianceCategories,
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

const knownCategoryIcons: Record<string, typeof IconWrench> = {
  Technik: IconWrench,
  Haus: IconHome,
  Garten: IconLeaf,
  Sonstiges: IconClipboardCheck,
}

function iconForCategory(category: string) {
  return knownCategoryIcons[category] ?? IconTag
}

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
  const [filtering, setFiltering] = useState(false)
  const [categoryFilter, setCategoryFilter] = useState<string[]>([])

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

  const allCategories = Array.from(new Set([...defaultApplianceCategories, ...appliances.map((a) => a.category)]))
  const visibleAppliances =
    categoryFilter.length === 0 ? appliances : appliances.filter((a) => categoryFilter.includes(a.category))

  const toggleCategoryFilter = (c: string) =>
    setCategoryFilter((prev) => (prev.includes(c) ? prev.filter((x) => x !== c) : [...prev, c]))

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

  const deleteAppliance = async (target: ApplianceWithLog) => {
    if (!confirm(`"${target.name}" wirklich löschen?`)) return
    setSaving(true)
    try {
      await gql(DELETE_APPLIANCE, { id: target.id })
      setEditing((current) => (current !== 'new' && current?.id === target.id ? null : current))
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unbekannter Fehler beim Löschen.')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = () => {
    if (!editing || editing === 'new') return
    void deleteAppliance(editing)
  }

  const handleMarkDone = async (target: ApplianceWithLog) => {
    setError(null)
    try {
      await gql(UPDATE_APPLIANCE, { id: target.id, set: { next_maintenance_due: null } })
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unbekannter Fehler beim Speichern.')
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
      <PageHero title="Offene Aufgaben" category={cat} icon={<IconWrench className="w-6 h-6" />} />

      <div className="px-4 pt-5">
        <div className="flex justify-end gap-2 mb-3">
          <Button accent={cat.solid} onClick={() => setEditing('new')}>+ Aufgabe</Button>
          <Button variant="secondary" onClick={() => setFiltering(true)}>
            Filtern{categoryFilter.length > 0 ? ` (${categoryFilter.length})` : ''}
          </Button>
        </div>

        {error && <p className="text-sm text-red-500 mb-4">{error}</p>}

        {loading ? (
          <p className="text-sm text-slate-400">Lädt …</p>
        ) : appliances.length === 0 ? (
          <EmptyState title="Noch keine Aufgaben erfasst" hint="z. B. Technik, Haus oder Garten." />
        ) : visibleAppliances.length === 0 ? (
          <EmptyState title="Keine Aufgaben in dieser Kategorie" hint="Filter zurücksetzen, um alle zu sehen." />
        ) : (
          <div className="space-y-3">
            {visibleAppliances.map((appliance) => {
              const CategoryIcon = iconForCategory(appliance.category)
              return (
              <Card key={appliance.id} className="hover:border-slate-300 transition-colors">
                <div className="flex items-center gap-3 cursor-pointer" onClick={() => setEditing(appliance)}>
                  <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${cat.tintBg} ${cat.text}`}>
                    <CategoryIcon className="w-5 h-5" />
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800">{appliance.name}</p>
                    <p className="text-xs text-slate-400">
                      {appliance.category}
                      {appliance.manufacturer ? ` · ${appliance.manufacturer}` : ''}
                    </p>
                  </div>
                  {appliance.next_maintenance_due && (
                    <div className="text-right shrink-0">
                      <p className="text-xs text-slate-400">Fällig</p>
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
                <div className="flex items-center justify-end gap-4 mt-2.5 pt-2.5 border-t border-slate-100">
                  {appliance.next_maintenance_due && (
                    <button
                      type="button"
                      onClick={() => void handleMarkDone(appliance)}
                      className="flex items-center gap-1 text-xs font-medium text-slate-400 hover:text-emerald-600"
                    >
                      <IconCheck className="w-3.5 h-3.5" /> Erledigt
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => void deleteAppliance(appliance)}
                    className="flex items-center gap-1 text-xs font-medium text-slate-400 hover:text-red-500"
                  >
                    <IconTrash className="w-3.5 h-3.5" /> Löschen
                  </button>
                </div>
              </Card>
              )
            })}
          </div>
        )}
      </div>

      {editing && (
        <Modal title={editing === 'new' ? 'Aufgabe hinzufügen' : 'Aufgabe bearbeiten'} onClose={() => setEditing(null)}>
          {error && <p className="mb-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}
          <ApplianceForm
            initialValues={valuesFromAppliance(editing === 'new' ? undefined : editing)}
            categoryOptions={Array.from(
              new Set(appliances.map((a) => a.category).filter((c) => !defaultApplianceCategories.includes(c))),
            )}
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

      {filtering && (
        <Modal title="Nach Kategorie filtern" onClose={() => setFiltering(false)}>
          <div className="flex flex-wrap gap-2">
            {allCategories.map((c) => {
              const active = categoryFilter.includes(c)
              return (
                <button
                  key={c}
                  type="button"
                  onClick={() => toggleCategoryFilter(c)}
                  className={`rounded-full border px-3 py-1.5 text-sm font-medium transition-colors ${
                    active ? `${cat.solid} border-transparent text-white` : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  {c}
                </button>
              )
            })}
          </div>
          <div className="flex items-center justify-between gap-2 mt-5">
            <Button type="button" variant="ghost" onClick={() => setCategoryFilter([])} disabled={categoryFilter.length === 0}>
              Zurücksetzen
            </Button>
            <Button type="button" onClick={() => setFiltering(false)}>
              Fertig
            </Button>
          </div>
        </Modal>
      )}
    </>
  )
}
