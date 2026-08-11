import { useEffect, useRef, useState, type ChangeEvent, type FormEvent } from 'react'
import { FormField, Input, Select, Textarea } from '../ui/FormField'
import { Button } from '../ui/Button'
import { IconTrash, IconCamera, IconDocument } from '../layout/NavIcons'
import { DocumentPhoto } from './DocumentPhoto'
import type { DocumentCategory, DocumentFile } from '../../types/database'

export interface DocumentFormValues {
  category: DocumentCategory
  vendor: string
  amount: string
  document_date: string
  notes: string
}

export const emptyDocumentFormValues: DocumentFormValues = {
  category: 'sonstiges',
  vendor: '',
  amount: '',
  document_date: '',
  notes: '',
}

export const documentCategoryLabels: Record<DocumentCategory, string> = {
  lebensmittel: 'Lebensmittel',
  haushalt: 'Haushalt & Einrichtung',
  reparatur_handwerker: 'Reparatur & Handwerker',
  elektronik: 'Elektronik & Technik',
  kleidung: 'Kleidung',
  gesundheit: 'Gesundheit & Apotheke',
  freizeit: 'Freizeit',
  vinted: 'Vinted',
  sonstiges: 'Sonstiges',
}

interface PendingPhoto {
  file: File
  previewUrl: string
}

interface DocumentFormProps {
  initialValues: DocumentFormValues
  existingFiles: DocumentFile[]
  onDeleteExistingFile: (file: DocumentFile) => void | Promise<void>
  onSubmit: (values: DocumentFormValues, newPhotos: File[]) => void | Promise<void>
  onDelete?: () => void
  submitting?: boolean
}

export function DocumentForm({
  initialValues,
  existingFiles,
  onDeleteExistingFile,
  onSubmit,
  onDelete,
  submitting,
}: DocumentFormProps) {
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

  const set = <K extends keyof DocumentFormValues>(key: K, value: DocumentFormValues[K]) =>
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

  const handleDeleteExisting = async (file: DocumentFile) => {
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

  return (
    <form onSubmit={handleSubmit}>
      <FormField label="Kategorie" required>
        <Select value={values.category} onChange={(e) => set('category', e.target.value as DocumentCategory)}>
          {Object.entries(documentCategoryLabels).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </Select>
      </FormField>

      <FormField label="Anbieter/Firma">
        <Input value={values.vendor} onChange={(e) => set('vendor', e.target.value)} placeholder="z. B. Media Markt" />
      </FormField>

      <div className="grid grid-cols-2 gap-3">
        <FormField label="Betrag (€)">
          <Input type="number" step="0.01" value={values.amount} onChange={(e) => set('amount', e.target.value)} />
        </FormField>
        <FormField label="Rechnungsdatum">
          <Input type="date" value={values.document_date} onChange={(e) => set('document_date', e.target.value)} />
        </FormField>
      </div>

      <FormField label="Notiz">
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
                  alt={file.file_name ?? 'Beleg-Foto'}
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
