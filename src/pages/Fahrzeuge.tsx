import { useEffect, useState } from 'react'
import { PageHero } from '../components/layout/PageHero'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Modal } from '../components/ui/Modal'
import { EmptyState } from '../components/ui/EmptyState'
import { IconCar } from '../components/layout/NavIcons'
import { AppDecor } from '../components/layout/AppDecor'
import { VehicleForm, emptyVehicleFormValues, type VehicleFormValues } from '../components/vehicles/VehicleForm'
import { gql } from '../lib/nhost'
import { categories } from '../theme/categories'
import { daysUntil, formatDateDe } from '../utils/dates'
import type { Vehicle, VehicleAppointment, VehicleAppointmentType } from '../types/database'

const cat = categories.fahrzeuge

type VehicleWithAppointments = Vehicle & { vehicle_appointments: VehicleAppointment[] }

const appointmentLabels: Record<VehicleAppointmentType, string> = {
  tuv_pickerl: 'TÜV/Pickerl',
  service: 'Service',
  reifenwechsel_sommer: 'Sommerreifen',
  reifenwechsel_winter: 'Winterreifen',
  reifenwechsel_ganzjahr: 'Ganzjahresreifen',
  sonstiges: 'Sonstiges',
}

const LIST_QUERY = /* GraphQL */ `
  query Vehicles {
    vehicles(order_by: { created_at: asc }) {
      id
      license_plate
      make
      model
      year_built
      notes
      created_at
      vehicle_appointments {
        id
        vehicle_id
        type
        due_date
        notes
        completed_at
        created_at
      }
    }
  }
`

const INSERT_VEHICLE = /* GraphQL */ `
  mutation InsertVehicle($object: vehicles_insert_input!) {
    insert_vehicles_one(object: $object) {
      id
    }
  }
`

const UPDATE_VEHICLE = /* GraphQL */ `
  mutation UpdateVehicle($id: uuid!, $set: vehicles_set_input!) {
    update_vehicles_by_pk(pk_columns: { id: $id }, _set: $set) {
      id
    }
  }
`

const DELETE_VEHICLE = /* GraphQL */ `
  mutation DeleteVehicle($id: uuid!) {
    delete_vehicles_by_pk(id: $id) {
      id
    }
  }
`

const INSERT_APPOINTMENT = /* GraphQL */ `
  mutation InsertAppointment($vehicleId: uuid!, $type: String!, $dueDate: date!) {
    insert_vehicle_appointments_one(object: { vehicle_id: $vehicleId, type: $type, due_date: $dueDate }) {
      id
    }
  }
`

const UPDATE_APPOINTMENT = /* GraphQL */ `
  mutation UpdateAppointment($id: uuid!, $dueDate: date!) {
    update_vehicle_appointments_by_pk(pk_columns: { id: $id }, _set: { due_date: $dueDate }) {
      id
    }
  }
`

const DELETE_APPOINTMENT = /* GraphQL */ `
  mutation DeleteAppointment($id: uuid!) {
    delete_vehicle_appointments_by_pk(id: $id) {
      id
    }
  }
`

const TIRE_TYPES: VehicleAppointmentType[] = ['reifenwechsel_sommer', 'reifenwechsel_winter', 'reifenwechsel_ganzjahr']

function findAppointment(vehicle: VehicleWithAppointments, type: VehicleAppointmentType) {
  return vehicle.vehicle_appointments.find((a) => a.type === type)
}

function nextAppointment(vehicle: VehicleWithAppointments) {
  return [...vehicle.vehicle_appointments].sort((a, b) => a.due_date.localeCompare(b.due_date))[0]
}

function valuesFromVehicle(vehicle?: VehicleWithAppointments): VehicleFormValues {
  if (!vehicle) return emptyVehicleFormValues
  const tuv = findAppointment(vehicle, 'tuv_pickerl')
  const service = findAppointment(vehicle, 'service')
  const tireSommer = findAppointment(vehicle, 'reifenwechsel_sommer')
  const tireWinter = findAppointment(vehicle, 'reifenwechsel_winter')
  const tireGanzjahr = findAppointment(vehicle, 'reifenwechsel_ganzjahr')
  const tire = tireSommer ?? tireWinter ?? tireGanzjahr
  return {
    license_plate: vehicle.license_plate,
    make: vehicle.make,
    model: vehicle.model,
    year_built: vehicle.year_built?.toString() ?? '',
    notes: vehicle.notes ?? '',
    tuv_date: tuv?.due_date ?? '',
    service_date: service?.due_date ?? '',
    tire_date: tire?.due_date ?? '',
    tire_season: !tire
      ? 'reifenwechsel_sommer'
      : tire === tireWinter
        ? 'reifenwechsel_winter'
        : tire === tireGanzjahr
          ? 'reifenwechsel_ganzjahr'
          : 'reifenwechsel_sommer',
  }
}

export default function Fahrzeuge() {
  const [vehicles, setVehicles] = useState<VehicleWithAppointments[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editing, setEditing] = useState<VehicleWithAppointments | null | 'new'>(null)
  const [saving, setSaving] = useState(false)

  const load = async () => {
    setLoading(true)
    try {
      const data = await gql<{ vehicles: VehicleWithAppointments[] }>(LIST_QUERY)
      setVehicles(data.vehicles)
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

  const upsertAppointment = async (
    vehicleId: string,
    existingAppointments: VehicleAppointment[],
    type: VehicleAppointmentType,
    dueDate: string,
  ) => {
    const existing = existingAppointments.find((a) => a.type === type)
    if (!dueDate) {
      if (existing) await gql(DELETE_APPOINTMENT, { id: existing.id })
      return
    }
    if (existing) {
      await gql(UPDATE_APPOINTMENT, { id: existing.id, dueDate })
    } else {
      await gql(INSERT_APPOINTMENT, { vehicleId, type, dueDate })
    }
  }

  const handleSave = async (values: VehicleFormValues) => {
    setSaving(true)
    setError(null)
    const vehicleSet = {
      license_plate: values.license_plate,
      make: values.make,
      model: values.model,
      year_built: values.year_built ? Number(values.year_built) : null,
      notes: values.notes || null,
    }

    const isNew = editing === 'new'
    const current = isNew ? undefined : (editing ?? undefined)

    try {
      let vehicleId: string
      if (isNew) {
        const data = await gql<{ insert_vehicles_one: { id: string } }>(INSERT_VEHICLE, {
          object: vehicleSet,
        })
        vehicleId = data.insert_vehicles_one.id
      } else if (current) {
        await gql(UPDATE_VEHICLE, { id: current.id, set: vehicleSet })
        vehicleId = current.id
      } else {
        setSaving(false)
        return
      }

      const existingAppointments = current?.vehicle_appointments ?? []
      const otherTireTypes = TIRE_TYPES.filter((t) => t !== values.tire_season)
      await Promise.all([
        upsertAppointment(vehicleId, existingAppointments, 'tuv_pickerl', values.tuv_date),
        upsertAppointment(vehicleId, existingAppointments, 'service', values.service_date),
        upsertAppointment(vehicleId, existingAppointments, values.tire_season, values.tire_date),
        ...otherTireTypes.map((type) => upsertAppointment(vehicleId, existingAppointments, type, '')),
      ])

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
    if (!confirm(`${editing.license_plate} wirklich löschen?`)) return
    setSaving(true)
    try {
      await gql(DELETE_VEHICLE, { id: editing.id })
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
      <PageHero title="Fahrzeuge" category={cat} icon={<IconCar className="w-6 h-6" />} />

      <div className="px-4 pt-5">
        <div className="flex justify-end mb-3">
          <Button accent={cat.solid} onClick={() => setEditing('new')}>+ Fahrzeug</Button>
        </div>

        {error && <p className="text-sm text-red-500 mb-4">{error}</p>}

        {loading ? (
          <p className="text-sm text-slate-400">Lädt …</p>
        ) : vehicles.length === 0 ? (
          <EmptyState title="Noch keine Fahrzeuge" hint="Füge dein erstes Fahrzeug hinzu." />
        ) : (
          <div className="space-y-3">
            {vehicles.map((vehicle) => {
              const next = nextAppointment(vehicle)
              return (
                <Card
                  key={vehicle.id}
                  className="cursor-pointer hover:border-slate-300 transition-colors"
                  onClick={() => setEditing(vehicle)}
                >
                  <div className="flex items-center gap-3">
                    <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${cat.tintBg} ${cat.text}`}>
                      <IconCar className="w-5 h-5" />
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-slate-800">
                        {vehicle.make} {vehicle.model}
                      </p>
                      <p className="text-xs text-slate-400">
                        {vehicle.license_plate}
                        {vehicle.year_built ? ` · ${vehicle.year_built}` : ''}
                      </p>
                    </div>
                    {next && (
                      <div className="text-right shrink-0">
                        <p className="text-xs text-slate-400">{appointmentLabels[next.type]}</p>
                        <p
                          className={`text-xs font-medium ${
                            daysUntil(next.due_date) <= 30 ? 'text-amber-600' : 'text-slate-500'
                          }`}
                        >
                          {formatDateDe(next.due_date)}
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
        <Modal title={editing === 'new' ? 'Fahrzeug hinzufügen' : 'Fahrzeug bearbeiten'} onClose={() => setEditing(null)}>
          <VehicleForm
            initialValues={valuesFromVehicle(editing === 'new' ? undefined : editing)}
            onSubmit={handleSave}
            onDelete={editing !== 'new' ? handleDelete : undefined}
            submitting={saving}
          />
        </Modal>
      )}
    </>
  )
}
