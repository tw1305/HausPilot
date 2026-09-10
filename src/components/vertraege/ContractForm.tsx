import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from 'react'
import { FormField, Input, Select, Textarea } from '../ui/FormField'
import { Button } from '../ui/Button'
import { IconTrash, IconCamera, IconDocument, IconCheck } from '../layout/NavIcons'
import { DocumentPhoto } from '../dokumente/DocumentPhoto'
import { toIsoDate } from '../../utils/dates'
import type { ContractCategory, ContractFile } from '../../types/database'

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
  return toIsoDate(d)
}

interface VehicleOption {
  id: string
  label: string
}

interface PendingPhoto {
  file: File
  previewUrl: string
}

interface ContractFormProps {
  initialValues: ContractFormValues
  vehicles: VehicleOption[]
  existingFiles: ContractFile[]
  onDeleteExistingFile: (file: ContractFile) => void | Promise<void>
  onSubmit: (values: ContractFormValues, newPhotos: File[]) => void | Promise<void>
  onDelete?: () => void
  onMarkCancellationHandled?: () => void
  submitting?: boolean
}

export function ContractForm({
  initialValues,
  vehicles,
  existingFiles,
  onDeleteExistingFile,
  onSubmit,
  onDelete,
  onMarkCancellationHandled,
  submitting,
}: ContractFormProps) {
  const [values, setValues] = useState(initialValues)
  const [pendingPhotos, setPendingPhotos] = useState<PendingPhoto[]>([])
  const [deletingFileId, setDeletingFileId] = useState<string | null>(null)
  const cameraInputRef = useRef<HTMLInputElement>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const pendingPhotosRef = useRef<PendingPhoto[]>([])
  pendingPhotosRef.current = pendingPhotos

  // Beim Verlassen des Formulars alle noch offenen Objekt-URLs freigeben.
  useEffect(() => {
    return () => {
      pendingPhotosRef.current.forEach((p) => URL.revokeObjectURL(p.previewUrl))
    }
  }, [])

  const set = <K extends keyof ContractFormValues>(key: K, value: ContractFormValues[K]) =>
    setValues((v) => ({ ...v, [key]: value }))

  const addPhotos = (e: ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? [])
    const withPreviews = files.map((file) => ({ file, previewUrl: URL.createObjectURL(file) }))
    setPendingPhotos((prev) => [...prev, ...withPreviews])
    e.target.value = ''
  }

  const removePendingPhoto = (index: number) => {
    setPendingPhotos((prev) => {
      const target = prev[index]
      if (target) URL.revokeObjectURL(target.previewUrl)
      return prev.filter((_, i) => i !== index)
    })
  }

  const handleDeleteExisting = async (file: ContractFile) => {
    setDeletingFileId(file.id)
    try {
      await onDeleteExistingFile(file)
    } finally {
      setDeletingFileId(null)
    }
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    void onSubmit(
      values,
      pendingPhotos.map((p) => p.file),
    )
  }

  const hasPhotos = existingFiles.length > 0 || pendingPhotos.length > 0
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
      {onMarkCancellationHandled && values.cancellation_deadline_date && (
        <div className="-mt-2 mb-3 flex justify-end">
          <Button type="button" variant="secondary" onClick={onMarkCancellationHandled}>
            <IconCheck className="w-4 h-4" /> Kündigungsfrist erledigt
          </Button>
        </div>
      )}

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

      <div className="mb-3">
        <span className="block text-xs font-medium text-slate-500 mb-2">Fotos</span>

        {hasPhotos && (
          <div className="mb-3 flex flex-wrap gap-2">
            {existingFiles.map((file) => (
              <div key={file.id} className="relative">
                <DocumentPhoto
                  fileId={file.file_id}
                  alt={file.file_name ?? 'Vertrags-Foto'}
                  className="h-20 w-20 rounded-xl object-cover cursor-pointer"
                  enlargeOnClick
                />
                <button
                  type="button"
                  onClick={() => void handleDeleteExisting(file)}
                  disabled={deletingFileId === file.id}
                  className="absolute -top-1.5 -right-1.5 flex h-6 w-6 items-center justify-center rounded-full border border-slate-200 bg-white text-red-500 shadow-sm disabled:opacity-40"
                  aria-label="Foto löschen"
                >
                  <IconTrash className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
            {pendingPhotos.map((photo, i) => (
              <div key={photo.previewUrl} className="relative">
                <img src={photo.previewUrl} alt={photo.file.name} className="h-20 w-20 rounded-xl object-cover" />
                <button
                  type="button"
                  onClick={() => removePendingPhoto(i)}
                  className="absolute -top-1.5 -right-1.5 flex h-6 w-6 items-center justify-center rounded-full border border-slate-200 bg-white text-red-500 shadow-sm"
                  aria-label="Foto entfernen"
                >
                  <IconTrash className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>
        )}

        {!hasPhotos && (
          <div className="mb-3 flex h-20 w-20 items-center justify-center rounded-xl border border-dashed border-slate-300 text-slate-300">
            <IconDocument className="w-6 h-6" />
          </div>
        )}

        <div className="flex gap-2">
          <Button type="button" variant="secondary" onClick={() => cameraInputRef.current?.click()}>
            <IconCamera className="w-4 h-4" /> Foto aufnehmen
          </Button>
          <Button type="button" variant="secondary" onClick={() => fileInputRef.current?.click()}>
            Aus Dateien wählen
          </Button>
        </div>
        <input
          ref={cameraInputRef}
          type="file"
          accept="image/*"
          capture="environment"
          onChange={addPhotos}
          className="hidden"
        />
        <input ref={fileInputRef} type="file" accept="image/*" multiple onChange={addPhotos} className="hidden" />
      </div>

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
