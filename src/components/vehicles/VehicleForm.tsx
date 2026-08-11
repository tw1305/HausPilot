import { useState, type FormEvent } from 'react'
import { FormField, Input, Select, Textarea } from '../ui/FormField'
import { Button } from '../ui/Button'
import type { VehicleAppointmentType } from '../../types/database'

export interface VehicleFormValues {
  license_plate: string
  make: string
  model: string
  year_built: string
  notes: string
  tuv_date: string
  service_date: string
  tire_date: string
  tire_season: Extract<VehicleAppointmentType, 'reifenwechsel_sommer' | 'reifenwechsel_winter'>
}

export const emptyVehicleFormValues: VehicleFormValues = {
  license_plate: '',
  make: '',
  model: '',
  year_built: '',
  notes: '',
  tuv_date: '',
  service_date: '',
  tire_date: '',
  tire_season: 'reifenwechsel_sommer',
}

interface VehicleFormProps {
  initialValues: VehicleFormValues
  onSubmit: (values: VehicleFormValues) => void | Promise<void>
  onDelete?: () => void
  submitting?: boolean
}

export function VehicleForm({ initialValues, onSubmit, onDelete, submitting }: VehicleFormProps) {
  const [values, setValues] = useState(initialValues)

  const set = <K extends keyof VehicleFormValues>(key: K, value: VehicleFormValues[K]) =>
    setValues((v) => ({ ...v, [key]: value }))

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    void onSubmit(values)
  }

  return (
    <form onSubmit={handleSubmit}>
      <FormField label="Kennzeichen" required>
        <Input
          value={values.license_plate}
          onChange={(e) => set('license_plate', e.target.value)}
          placeholder="z. B. SL-AB 123"
          required
        />
      </FormField>
      <div className="grid grid-cols-2 gap-3">
        <FormField label="Marke" required>
          <Input value={values.make} onChange={(e) => set('make', e.target.value)} required />
        </FormField>
        <FormField label="Modell" required>
          <Input value={values.model} onChange={(e) => set('model', e.target.value)} required />
        </FormField>
      </div>
      <FormField label="Baujahr">
        <Input
          type="number"
          value={values.year_built}
          onChange={(e) => set('year_built', e.target.value)}
          placeholder="z. B. 2019"
        />
      </FormField>

      <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500 mt-4 mb-2">Termine</h3>
      <FormField label="TÜV / Pickerl fällig am">
        <Input type="date" value={values.tuv_date} onChange={(e) => set('tuv_date', e.target.value)} />
      </FormField>
      <FormField label="Service fällig am">
        <Input type="date" value={values.service_date} onChange={(e) => set('service_date', e.target.value)} />
      </FormField>
      <div className="grid grid-cols-[2fr_1fr] gap-3">
        <FormField label="Reifenwechsel fällig am">
          <Input type="date" value={values.tire_date} onChange={(e) => set('tire_date', e.target.value)} />
        </FormField>
        <FormField label="Saison">
          <Select value={values.tire_season} onChange={(e) => set('tire_season', e.target.value as VehicleFormValues['tire_season'])}>
            <option value="reifenwechsel_sommer">Sommer</option>
            <option value="reifenwechsel_winter">Winter</option>
          </Select>
        </FormField>
      </div>

      <FormField label="Notizen">
        <Textarea value={values.notes} onChange={(e) => set('notes', e.target.value)} />
      </FormField>

      <div className="flex items-center justify-between gap-2 mt-4">
        {onDelete ? (
          <Button type="button" variant="danger" onClick={onDelete}>
            Löschen
          </Button>
        ) : (
          <span />
        )}
        <Button type="submit" disabled={submitting}>
          Speichern
        </Button>
      </div>
    </form>
  )
}
