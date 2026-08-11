import { useEffect, useState } from 'react'
import { PageHero } from '../components/layout/PageHero'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Modal } from '../components/ui/Modal'
import { EmptyState } from '../components/ui/EmptyState'
import { IconLeaf } from '../components/layout/NavIcons'
import { PlantForm, emptyPlantFormValues, type PlantFormValues } from '../components/garten/PlantForm'
import { AppDecor } from '../components/layout/AppDecor'
import { findPlantCareTemplate } from '../data/plantCareLibrary'
import { gql } from '../lib/nhost'
import { categories } from '../theme/categories'
import { daysUntil, formatDateDe, nextOccurrenceForMonth } from '../utils/dates'
import type { Plant, PlantCareRecommendation } from '../types/database'

const cat = categories.garten

type PlantWithRecommendations = Plant & { plant_care_recommendations: PlantCareRecommendation[] }

const LIST_QUERY = /* GraphQL */ `
  query Plants {
    plants(order_by: { created_at: asc }) {
      id
      name
      plant_type
      location
      planted_on
      next_pruning_on
      notes
      created_at
      plant_care_recommendations {
        id
        plant_id
        title
        month
        recurring
        year
        notes
        source
        created_at
      }
    }
  }
`

const INSERT_PLANT = /* GraphQL */ `
  mutation InsertPlant($object: plants_insert_input!) {
    insert_plants_one(object: $object) {
      id
    }
  }
`

const UPDATE_PLANT = /* GraphQL */ `
  mutation UpdatePlant($id: uuid!, $set: plants_set_input!) {
    update_plants_by_pk(pk_columns: { id: $id }, _set: $set) {
      id
    }
  }
`

const DELETE_PLANT = /* GraphQL */ `
  mutation DeletePlant($id: uuid!) {
    delete_plants_by_pk(id: $id) {
      id
    }
  }
`

const DELETE_RECOMMENDATIONS = /* GraphQL */ `
  mutation DeleteRecommendations($plantId: uuid!) {
    delete_plant_care_recommendations(where: { plant_id: { _eq: $plantId } }) {
      affected_rows
    }
  }
`

const INSERT_RECOMMENDATIONS = /* GraphQL */ `
  mutation InsertRecommendations($objects: [plant_care_recommendations_insert_input!]!) {
    insert_plant_care_recommendations(objects: $objects) {
      affected_rows
    }
  }
`

function nextDueDate(plant: PlantWithRecommendations): Date | null {
  const dates = plant.plant_care_recommendations.map((r) =>
    nextOccurrenceForMonth(r.month, r.recurring, r.year),
  )
  // Konkret gesetzter Rückschnitt-Termin fließt mit in die „nächste Pflege" ein
  if (plant.next_pruning_on) dates.push(new Date(plant.next_pruning_on))
  if (dates.length === 0) return null
  return dates.sort((a, b) => a.getTime() - b.getTime())[0]
}

function valuesFromPlant(plant?: PlantWithRecommendations): PlantFormValues {
  if (!plant) return emptyPlantFormValues
  return {
    name: plant.name,
    plant_type: plant.plant_type ?? '',
    location: plant.location ?? '',
    planted_on: plant.planted_on ?? '',
    next_pruning_on: plant.next_pruning_on ?? '',
    notes: plant.notes ?? '',
    recommendations: plant.plant_care_recommendations.map((r) => ({
      id: r.id,
      title: r.title,
      month: r.month,
      recurring: r.recurring,
    })),
  }
}

export default function Garten() {
  const [plants, setPlants] = useState<PlantWithRecommendations[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editing, setEditing] = useState<PlantWithRecommendations | null | 'new'>(null)
  const [saving, setSaving] = useState(false)

  const load = async () => {
    setLoading(true)
    try {
      const data = await gql<{ plants: PlantWithRecommendations[] }>(LIST_QUERY)
      setPlants(data.plants)
      setError(null)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unbekannter Fehler beim Laden.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void load()
  }, [])

  const handleSave = async (values: PlantFormValues) => {
    setSaving(true)
    setError(null)
    const plantSet = {
      name: values.name,
      plant_type: values.plant_type || null,
      location: values.location || null,
      planted_on: values.planted_on || null,
      next_pruning_on: values.next_pruning_on || null,
      notes: values.notes || null,
    }

    const isNew = editing === 'new'
    const current = isNew ? undefined : (editing ?? undefined)

    try {
      let plantId: string
      if (isNew) {
        const data = await gql<{ insert_plants_one: { id: string } }>(INSERT_PLANT, { object: plantSet })
        plantId = data.insert_plants_one.id
      } else if (current) {
        await gql(UPDATE_PLANT, { id: current.id, set: plantSet })
        plantId = current.id
      } else {
        setSaving(false)
        return
      }

      // Empfehlungen werden komplett ersetzt statt einzeln abgeglichen – bei der
      // kleinen erwarteten Anzahl pro Pflanze reicht das für dieses Grundgerüst.
      if (current) {
        await gql(DELETE_RECOMMENDATIONS, { plantId })
      }
      const recommendationsToInsert = values.recommendations
        .filter((r) => r.title.trim())
        .map((r) => ({
          plant_id: plantId,
          title: r.title,
          month: r.month,
          recurring: r.recurring,
          source: findPlantCareTemplate(values.plant_type) ? 'template' : 'manual',
        }))
      if (recommendationsToInsert.length > 0) {
        await gql(INSERT_RECOMMENDATIONS, { objects: recommendationsToInsert })
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
    if (!confirm(`${editing.name} wirklich löschen?`)) return
    setSaving(true)
    try {
      await gql(DELETE_PLANT, { id: editing.id })
      setEditing(null)
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unbekannter Fehler beim Löschen.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <>
      <AppDecor />
      <PageHero title="Garten" category={cat} icon={<IconLeaf className="w-6 h-6" />} />

      <div className="px-4 pt-5">
        <div className="flex justify-end mb-3">
          <Button accent={cat.solid} onClick={() => setEditing('new')}>
            + Pflanze
          </Button>
        </div>

        {error && <p className="text-sm text-red-500 mb-4">{error}</p>}

        {loading ? (
          <p className="text-sm text-slate-400">Lädt …</p>
        ) : plants.length === 0 ? (
          <EmptyState title="Noch keine Pflanzen angelegt" hint="Füge Hecken, Bäume oder Beete hinzu." />
        ) : (
          <div className="space-y-3">
            {plants.map((plant) => {
              const due = nextDueDate(plant)
              const template = plant.plant_type ? findPlantCareTemplate(plant.plant_type) : undefined
              return (
                <Card
                  key={plant.id}
                  className="cursor-pointer hover:border-slate-300 transition-colors"
                  onClick={() => setEditing(plant)}
                >
                  <div className="flex items-center gap-3">
                    <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${cat.tintBg} ${cat.text}`}>
                      <IconLeaf className="w-5 h-5" />
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-800">{plant.name}</p>
                      <p className="text-xs text-slate-400">
                        {template?.label ?? plant.location ?? ' '}
                        {plant.planted_on ? ` · gepflanzt ${new Date(plant.planted_on).getFullYear()}` : ''}
                      </p>
                    </div>
                    {due && (
                      <div className="text-right shrink-0">
                        <p className="text-xs text-slate-400">nächste Pflege</p>
                        <p
                          className={`text-xs font-medium ${
                            daysUntil(due) <= 30 ? 'text-amber-600' : 'text-slate-500'
                          }`}
                        >
                          {formatDateDe(due)}
                        </p>
                      </div>
                    )}
                  </div>
                </Card>
              )
            })}
          </div>
        )}
      </div>

      {editing && (
        <Modal title={editing === 'new' ? 'Pflanze hinzufügen' : 'Pflanze bearbeiten'} onClose={() => setEditing(null)}>
          {error && (
            <p className="mb-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>
          )}
          <PlantForm
            initialValues={valuesFromPlant(editing === 'new' ? undefined : editing)}
            onSubmit={handleSave}
            onDelete={editing !== 'new' ? handleDelete : undefined}
            submitting={saving}
          />
        </Modal>
      )}
    </>
  )
}
