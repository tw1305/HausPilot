import { daysUntil, nextOccurrenceForMonth } from './dates'
import type { Appliance, Contract, Plant, PlantCareRecommendation, Vehicle, VehicleAppointment } from '../types/database'

export type ReminderType =
  | 'vehicle_tuv'
  | 'vehicle_service'
  | 'vehicle_tire'
  | 'plant_care'
  | 'contract_payment'
  | 'contract_cancellation'
  | 'appliance_maintenance'

export interface ReminderItem {
  id: string
  type: ReminderType
  title: string
  subtitle: string
  dueDate: Date
  daysUntil: number
  link: string
}

/** Ab wie vielen Tagen vor Fälligkeit ein Erinnerungstyp im Dashboard auftaucht. */
export const LEAD_DAYS: Record<ReminderType, number> = {
  vehicle_tuv: 60,
  vehicle_service: 30,
  vehicle_tire: 30,
  plant_care: 21,
  contract_payment: 14,
  contract_cancellation: 60,
  appliance_maintenance: 30,
}

const vehicleAppointmentMeta: Record<
  VehicleAppointment['type'],
  { type: ReminderType; title: string }
> = {
  tuv_pickerl: { type: 'vehicle_tuv', title: 'TÜV/Pickerl fällig' },
  service: { type: 'vehicle_service', title: 'Service fällig' },
  reifenwechsel_sommer: { type: 'vehicle_tire', title: 'Sommerreifen montieren' },
  reifenwechsel_winter: { type: 'vehicle_tire', title: 'Winterreifen montieren' },
  reifenwechsel_ganzjahr: { type: 'vehicle_tire', title: 'Ganzjahresreifen wechseln' },
  sonstiges: { type: 'vehicle_service', title: 'Fahrzeugtermin' },
}

interface RemindersInput {
  vehicles: (Vehicle & { vehicle_appointments: VehicleAppointment[] })[]
  plants: (Plant & { plant_care_recommendations: PlantCareRecommendation[] })[]
  contracts: Contract[]
  appliances: Appliance[]
}

export function buildReminders(input: RemindersInput): ReminderItem[] {
  const items: ReminderItem[] = []

  for (const vehicle of input.vehicles) {
    const vehicleLabel = `${vehicle.make} ${vehicle.model} (${vehicle.license_plate})`
    for (const appointment of vehicle.vehicle_appointments) {
      if (appointment.completed_at) continue
      const meta = vehicleAppointmentMeta[appointment.type]
      items.push({
        id: `vehicle-appointment-${appointment.id}`,
        type: meta.type,
        title: meta.title,
        subtitle: vehicleLabel,
        dueDate: new Date(appointment.due_date),
        daysUntil: daysUntil(appointment.due_date),
        link: '/fahrzeuge',
      })
    }
  }

  for (const plant of input.plants) {
    for (const rec of plant.plant_care_recommendations) {
      const dueDate = nextOccurrenceForMonth(rec.month, rec.recurring, rec.year)
      items.push({
        id: `plant-care-${rec.id}`,
        type: 'plant_care',
        title: rec.title,
        subtitle: plant.name,
        dueDate,
        daysUntil: daysUntil(dueDate),
        link: '/garten',
      })
    }
  }

  for (const contract of input.contracts) {
    if (contract.next_payment_date) {
      items.push({
        id: `contract-payment-${contract.id}`,
        type: 'contract_payment',
        title: 'Nächste Abbuchung',
        subtitle: contract.provider,
        dueDate: new Date(contract.next_payment_date),
        daysUntil: daysUntil(contract.next_payment_date),
        link: '/vertraege',
      })
    }
    if (contract.cancellation_deadline_date) {
      items.push({
        id: `contract-cancellation-${contract.id}`,
        type: 'contract_cancellation',
        title: 'Kündigungsfrist',
        subtitle: contract.provider,
        dueDate: new Date(contract.cancellation_deadline_date),
        daysUntil: daysUntil(contract.cancellation_deadline_date),
        link: '/vertraege',
      })
    }
  }

  for (const appliance of input.appliances) {
    if (appliance.next_maintenance_due) {
      items.push({
        id: `appliance-maintenance-${appliance.id}`,
        type: 'appliance_maintenance',
        title: 'Wartung fällig',
        subtitle: appliance.name,
        dueDate: new Date(appliance.next_maintenance_due),
        daysUntil: daysUntil(appliance.next_maintenance_due),
        link: '/haustechnik',
      })
    }
  }

  return items
    .filter((item) => item.daysUntil <= LEAD_DAYS[item.type])
    .sort((a, b) => a.dueDate.getTime() - b.dueDate.getTime())
}
