import { useEffect, useState } from 'react'
import { gql } from '../lib/nhost'
import { buildReminders, type ReminderItem } from '../utils/reminders'
import type { Appliance, Contract, Plant, PlantCareRecommendation, Vehicle, VehicleAppointment } from '../types/database'

const QUERY = /* GraphQL */ `
  query AllReminderData {
    vehicles {
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
    plants {
      id
      name
      plant_type
      location
      planted_on
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
    contracts {
      id
      category
      provider
      customer_number
      monthly_amount
      yearly_amount
      contract_start_date
      cancellation_notice_days
      next_payment_date
      cancellation_deadline_date
      contact_person
      vehicle_id
      notes
      created_at
    }
    appliances {
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
    }
  }
`

interface AllReminderData {
  vehicles: (Vehicle & { vehicle_appointments: VehicleAppointment[] })[]
  plants: (Plant & { plant_care_recommendations: PlantCareRecommendation[] })[]
  contracts: Contract[]
  appliances: Appliance[]
}

export function useReminders() {
  const [reminders, setReminders] = useState<ReminderItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true

    const load = async () => {
      try {
        const data = await gql<AllReminderData>(QUERY)
        if (!active) return
        setReminders(
          buildReminders({
            vehicles: data.vehicles,
            plants: data.plants,
            contracts: data.contracts,
            appliances: data.appliances,
          }),
        )
        setError(null)
      } catch (err) {
        if (!active) return
        setError(err instanceof Error ? err.message : 'Unbekannter Fehler beim Laden.')
      } finally {
        if (active) setLoading(false)
      }
    }

    void load()
    return () => {
      active = false
    }
  }, [])

  return { reminders, loading, error }
}
