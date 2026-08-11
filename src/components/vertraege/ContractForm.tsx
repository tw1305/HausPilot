import { useState, type FormEvent } from 'react'
import { FormField, Input, Select, Textarea } from '../ui/FormField'
import { Button } from '../ui/Button'
import type { ContractCategory } from '../../types/database'

export interface ContractFormValues {
  category: ContractCategory
  provider: string
  customer_number: string
  monthly_amount: string
  yearly_amount: string
  contract_start_date: string
  contract_end_date: string
  cancellation_notice_days: string
  next_payment_date: string
  cancellation_deadline_date: string
  reminder_date: string
  contact_person: string
  vehicle_id: string
  notes: string
}

export const emptyContractFormValues: ContractFormValues = {
  category: 'strom',
  provider: '',
  customer_number: '',
  monthly_amount: '',
  yearly_amount: '',
  contract_start_date: '',
  contract_end_date: '',
  cancellation_notice_days: '',
  next_payment_date: '',
  cancellation_deadline_date: '',
  reminder_date: '',
  contact_person: '',
  vehicle_id: '',
  notes: '',
}

export const contractCategoryLabels: Record<ContractCategory, string> = {
  strom: 'Strom',
  internet: 'Internet',
  wasser: 'Wasser',
  muellabfuhr: 'Müllabfuhr',
  kreditrate: 'Kreditrate',
  grundsteuer: 'Grundsteuer',
  versicherung_gebaeude: 'Gebäudeversicherung',
  versicherung_kfz: 'KFZ-Versicherung',
  versicherung_sonstige: 'Sonstige Versicherung',
  sonstiges: 'Sonstiges',
}

const reminderPresets = [
  { months: 1, label: '1 Monat vorher' },
  { months: 3, label: '3 Monate vorher' },
  { months: 6, label: '6 Monate vorher' },
]

/** Zieht `months` Monate vom Vertragsende ab und liefert ein ISO-Datum (YYYY-MM-DD). */
function reminderFromEnd(endDate: string, months: number): string {
  if (!endDate) return ''
  const d = new Date(endDate)
  if (Number.isNaN(d.getTime())) return ''
  d.setMonth(d.getMonth() - months)
  return d.toISOString().slice(0, 10)
}

interface VehicleOption {
  id: string
  label: string
}

interface ContractFormProps {
  initialValues: ContractFormValues
  vehicles: VehicleOption[]
  onSubmit: (values: ContractFormValues) => void | Promise<void>
  onDelete?: () => void
  submitting?: boolean
}

export function ContractForm({ initialValues, vehicles, onSubmit, onDelete, submitting }: ContractFormProps) {
  const [values, setValues] = useState(initialValues)

  const set = <K extends keyof ContractFormValues>(key: K, value: ContractFormValues[K]) =>
    setValues((v) => ({ ...v, [key]: value }))

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    void onSubmit(values)
  }

  const isInsurance = values.category.startsWith('versicherung')

  return (
    <form onSubmit={handleSubmit}>
      <FormField label="Kategorie" required>
        <Select value={values.category} onChange={(e) => set('category', e.target.value as ContractCategory)}>
          {Object.entries(contractCategoryLabels).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </Select>
      </FormField>

      {values.category === 'versicherung_kfz' && (
        <FormField label="Fahrzeug">
          <Select value={values.vehicle_id} onChange={(e) => set('vehicle_id', e.target.value)}>
            <option value="">– kein Fahrzeug verknüpft –</option>
            {vehicles.map((v) => (
              <option key={v.id} value={v.id}>
                {v.label}
              </option>
            ))}
          </Select>
        </FormField>
      )}

      <FormField label="Anbieter" required>
        <Input value={values.provider} onChange={(e) => set('provider', e.target.value)} placeholder="z. B. Salzburg AG" required />
      </FormField>
      <FormField label="Kundennummer">
        <Input value={values.customer_number} onChange={(e) => set('customer_number', e.target.value)} />
      </FormField>

      <div className="grid grid-cols-2 gap-3">
        <FormField label="Monatsbeitrag (€)">
          <Input
            type="number"
            step="0.01"
            value={values.monthly_amount}
            onChange={(e) => set('monthly_amount', e.target.value)}
          />
        </FormField>
        <FormField label="Jahreskosten (€)">
          <Input
            type="number"
            step="0.01"
            value={values.yearly_amount}
            onChange={(e) => set('yearly_amount', e.target.value)}
          />
        </FormField>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <FormField label="Vertragsbeginn">
          <Input type="date" value={values.contract_start_date} onChange={(e) => set('contract_start_date', e.target.value)} />
        </FormField>
        <FormField label="Vertragsende">
          <Input type="date" value={values.contract_end_date} onChange={(e) => set('contract_end_date', e.target.value)} />
        </FormField>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <FormField label="Kündigungsfrist (Tage)">
          <Input
            type="number"
            value={values.cancellation_notice_days}
            onChange={(e) => set('cancellation_notice_days', e.target.value)}
          />
        </FormField>
        <FormField label="Kündigungs-Deadline">
          <Input
            type="date"
            value={values.cancellation_deadline_date}
            onChange={(e) => set('cancellation_deadline_date', e.target.value)}
          />
        </FormField>
      </div>

      <FormField label="Nächste Zahlung">
        <Input type="date" value={values.next_payment_date} onChange={(e) => set('next_payment_date', e.target.value)} />
      </FormField>

      <div className="mb-3">
        <div className="flex items-baseline justify-between mb-1">
          <span className="block text-xs font-medium text-slate-500">Erinnerung (Timer)</span>
          <span className="text-[11px] text-slate-400">Ab wann kümmern?</span>
        </div>
        <Input type="date" value={values.reminder_date} onChange={(e) => set('reminder_date', e.target.value)} />
        <div className="mt-2 flex flex-wrap gap-2">
          {reminderPresets.map((preset) => (
            <button
              key={preset.months}
              type="button"
              disabled={!values.contract_end_date}
              onClick={() => set('reminder_date', reminderFromEnd(values.contract_end_date, preset.months))}
              className="rounded-lg border border-slate-200 px-2.5 py-1 text-xs font-medium text-slate-600 transition-colors hover:border-slate-300 hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
              title={values.contract_end_date ? undefined : 'Bitte zuerst ein Vertragsende setzen'}
            >
              {preset.label}
            </button>
          ))}
          {values.reminder_date && (
            <button
              type="button"
              onClick={() => set('reminder_date', '')}
              className="rounded-lg px-2.5 py-1 text-xs font-medium text-slate-400 transition-colors hover:text-red-500"
            >
              Zurücksetzen
            </button>
          )}
        </div>
      </div>

      {isInsurance && (
        <FormField label="Ansprechpartner">
          <Input value={values.contact_person} onChange={(e) => set('contact_person', e.target.value)} />
        </FormField>
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
