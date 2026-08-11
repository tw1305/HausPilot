import { useState, type FormEvent } from 'react'
import { FormField, Input, Select, Textarea } from '../ui/FormField'
import { Button } from '../ui/Button'
import type { ApplianceCategory } from '../../types/database'

export interface ApplianceFormValues {
  category: ApplianceCategory
  name: string
  manufacturer: string
  model: string
  serial_number: string
  installed_on: string
  next_maintenance_due: string
  notes: string
}

export const emptyApplianceFormValues: ApplianceFormValues = {
  category: 'waermepumpe',
  name: '',
  manufacturer: '',
  model: '',
  serial_number: '',
  installed_on: '',
  next_maintenance_due: '',
  notes: '',
}

export const applianceCategoryLabels: Record<ApplianceCategory, string> = {
  waermepumpe: 'Wärmepumpe',
  pv_anlage: 'PV-Anlage',
  sonstiges: 'Sonstiges',
}

interface ApplianceFormProps {
  initialValues: ApplianceFormValues
  onSubmit: (values: ApplianceFormValues) => void | Promise<void>
  onDelete?: () => void
  submitting?: boolean
}

export function ApplianceForm({ initialValues, onSubmit, onDelete, submitting }: ApplianceFormProps) {
  const [values, setValues] = useState(initialValues)

  const set = <K extends keyof ApplianceFormValues>(key: K, value: ApplianceFormValues[K]) =>
    setValues((v) => ({ ...v, [key]: value }))

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    void onSubmit(values)
  }

  return (
    <form onSubmit={handleSubmit}>
      <FormField label="Kategorie" required>
        <Select value={values.category} onChange={(e) => set('category', e.target.value as ApplianceCategory)}>
          {Object.entries(applianceCategoryLabels).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </Select>
      </FormField>
      <FormField label="Name" required>
        <Input value={values.name} onChange={(e) => set('name', e.target.value)} placeholder="z. B. Wärmepumpe Keller" required />
      </FormField>
      <div className="grid grid-cols-2 gap-3">
        <FormField label="Hersteller">
          <Input value={values.manufacturer} onChange={(e) => set('manufacturer', e.target.value)} />
        </FormField>
        <FormField label="Modell">
          <Input value={values.model} onChange={(e) => set('model', e.target.value)} />
        </FormField>
      </div>
      <FormField label="Seriennummer">
        <Input value={values.serial_number} onChange={(e) => set('serial_number', e.target.value)} />
      </FormField>
      <div className="grid grid-cols-2 gap-3">
        <FormField label="Installiert am">
          <Input type="date" value={values.installed_on} onChange={(e) => set('installed_on', e.target.value)} />
        </FormField>
        <FormField label="Nächste Wartung fällig">
          <Input
            type="date"
            value={values.next_maintenance_due}
            onChange={(e) => set('next_maintenance_due', e.target.value)}
          />
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
