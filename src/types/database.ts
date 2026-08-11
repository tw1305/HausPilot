export type VehicleAppointmentType =
  | 'tuv_pickerl'
  | 'service'
  | 'reifenwechsel_sommer'
  | 'reifenwechsel_winter'
  | 'sonstiges'

export type ContractCategory =
  | 'strom'
  | 'internet'
  | 'wasser'
  | 'muellabfuhr'
  | 'kreditrate'
  | 'grundsteuer'
  | 'versicherung_gebaeude'
  | 'versicherung_kfz'
  | 'versicherung_sonstige'
  | 'sonstiges'

export type ApplianceCategory = 'waermepumpe' | 'pv_anlage' | 'sonstiges'

export type DocumentCategory =
  | 'lebensmittel'
  | 'haushalt'
  | 'reparatur_handwerker'
  | 'elektronik'
  | 'kleidung'
  | 'gesundheit'
  | 'freizeit'
  | 'sonstiges'

export interface Household {
  id: string
  name: string
  created_at: string
}

export interface Vehicle {
  id: string
  household_id: string
  license_plate: string
  make: string
  model: string
  year_built: number | null
  notes: string | null
  created_at: string
}

export interface VehicleAppointment {
  id: string
  vehicle_id: string
  type: VehicleAppointmentType
  due_date: string
  notes: string | null
  completed_at: string | null
  created_at: string
}

export interface Plant {
  id: string
  household_id: string
  name: string
  plant_type: string | null
  location: string | null
  planted_on: string | null
  next_pruning_on: string | null
  notes: string | null
  created_at: string
}

export interface PlantCareRecommendation {
  id: string
  plant_id: string
  title: string
  month: number
  recurring: boolean
  year: number | null
  notes: string | null
  source: 'manual' | 'template'
  created_at: string
}

export interface Contract {
  id: string
  household_id: string
  category: ContractCategory
  provider: string
  customer_number: string | null
  monthly_amount: number | null
  yearly_amount: number | null
  contract_start_date: string | null
  contract_end_date: string | null
  cancellation_notice_days: number | null
  next_payment_date: string | null
  cancellation_deadline_date: string | null
  reminder_date: string | null
  contact_person: string | null
  vehicle_id: string | null
  notes: string | null
  created_at: string
}

export interface Appliance {
  id: string
  household_id: string
  category: ApplianceCategory
  name: string
  manufacturer: string | null
  model: string | null
  serial_number: string | null
  installed_on: string | null
  next_maintenance_due: string | null
  details: Record<string, unknown>
  notes: string | null
  created_at: string
}

export interface ApplianceMaintenanceLogEntry {
  id: string
  appliance_id: string
  performed_on: string
  description: string
  performed_by: string | null
  cost: number | null
  created_at: string
}

export interface DocumentRecord {
  id: string
  household_id: string
  category: DocumentCategory
  vendor: string | null
  amount: number | null
  document_date: string | null
  notes: string | null
  created_at: string
}

export interface DocumentFile {
  id: string
  household_id: string
  document_id: string
  file_id: string
  file_name: string | null
  created_at: string
}

export interface ShoppingItem {
  id: string
  household_id: string
  name: string
  quantity: string | null
  is_done: boolean
  done_at: string | null
  created_at: string
}

export interface Reminder {
  id: string
  household_id: string
  title: string
  due_date: string | null
  notes: string | null
  is_done: boolean
  created_at: string
}
