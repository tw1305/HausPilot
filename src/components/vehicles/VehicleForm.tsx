import { useState, type FormEvent } from 'react'
import { FormField, Input, Select, Textarea } from '../ui/FormField'
import { Button } from '../ui/Button'
import { IconCheck } from '../layout/NavIcons'
import type { VehicleAppointmentType } from '../../types/database'

export interface VehicleFormValues {
  license_plate: string
  make: string
  model: string
  year_built: string
  mileage_km: string
  mileage_date: string
  last_oil_change_date: string
  notes: string
  tuv_date: string
  service_date: string
  tire_date: string
  tire_season: Extract<VehicleAppointmentType, 'reifenwechsel_sommer' | 'reifenwechsel_winter' | 'reifenwechsel_ganzjahr'>
}

export const emptyVehicleFormValues: VehicleFormValues = {
  license_plate: '',
  make: '',
  model: '',
  year_built: '',
  mileage_km: '',
  mileage_date: '',
  last_oil_change_date: '',
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
  onMarkAppointmentDone?: (type: VehicleAppointmentType) => void
  submitting?: boolean
}

export function VehicleForm({
  initialValues,
  onSubmit,
  onDelete,
  onMarkAppointmentDone,
  submitting,
}: VehicleFormProps) {
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

      <div className="grid grid-cols-2 gap-3">
        <FormField label="Kilometerstand (km)">
          <Input
            type="number"
            value={values.mileage_km}
            onChange={(e) => set('mileage_km', e.target.value)}
            placeholder="z. B. 45000"
          />
        </FormField>
        <FormField label="Stand vom">
          <Input type="date" value={values.mileage_date} onChange={(e) => set('mileage_date', e.target.value)} />
        </FormField>
      </div>
      <FormField label="Letzter Ölwechsel">
        <Input
          type="date"
          value={values.last_oil_change_date}
          onChange={(e) => set('last_oil_change_date', e.target.value)}
        />
      </FormField>

      <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500 mt-4 mb-2">Termine</h3>
      <FormField label="TÜV / Pickerl fällig am">
        <div className="flex gap-2">
          <Input type="date" value={values.tuv_date} onChange={(e) => set('tuv_date', e.target.value)} className="flex-1" />
          {onMarkAppointmentDone && values.tuv_date && (
            <Button type="button" variant="secondary" onClick={() => onMarkAppointmentDone('tuv_pickerl')}>
              <IconCheck className="w-4 h-4" /> Erledigt
            </Button>
          )}
        </div>
      </FormField>
      <FormField label="Service fällig am">
        <div className="flex gap-2">
          <Input type="date" value={values.service_date} onChange={(e) => set('service_date', e.target.value)} className="flex-1" />
          {onMarkAppointmentDone && values.service_date && (
            <Button type="button" variant="secondary" onClick={() => onMarkAppointmentDone('service')}>
              <IconCheck className="w-4 h-4" /> Erledigt
            </Button>
          )}
        </div>
      </FormField>
      <div className="grid grid-cols-[2fr_1fr] gap-3">
        <FormField label="Reifenwechsel fällig am">
          <Input type="date" value={values.tire_date} onChange={(e) => set('tire_date', e.target.value)} />
        </FormField>
        <FormField label="Saison">
          <Select value={values.tire_season} onChange={(e) => set('tire_season', e.target.value as VehicleFormValues['tire_season'])}>
            <option value="reifenwechsel_sommer">Sommer</option>
            <option value="reifenwechsel_winter">Winter</option>
            <option value="reifenwechsel_ganzjahr">Ganzjahr</option>
          </Select>
        </FormField>
      </div>
      {onMarkAppointmentDone && values.tire_date && (
        <div className="-mt-2 mb-3 flex justify-end">
          <Button type="button" variant="secondary" onClick={() => onMarkAppointmentDone(values.tire_season)}>
            <IconCheck className="w-4 h-4" /> Reifenwechsel erledigt
          </Button>
        </div>
      )}

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
