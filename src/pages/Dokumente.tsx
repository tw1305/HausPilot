import { useEffect, useState } from 'react'
import { PageHero } from '../components/layout/PageHero'
import { Card } from '../components/ui/Card'
import { Button } from '../components/ui/Button'
import { Modal } from '../components/ui/Modal'
import { EmptyState } from '../components/ui/EmptyState'
import { IconReceipt } from '../components/layout/NavIcons'
import { AppDecor } from '../components/layout/AppDecor'
import {
  DocumentForm,
  documentCategoryLabels,
  emptyDocumentFormValues,
  type DocumentFormValues,
} from '../components/dokumente/DocumentForm'
import { DocumentPhoto } from '../components/dokumente/DocumentPhoto'
import { gql, uploadDocumentPhotos, deleteStorageFile } from '../lib/nhost'
import { categories } from '../theme/categories'
import { formatDateDe } from '../utils/dates'
import { formatEUR } from '../utils/currency'
import type { DocumentRecord, DocumentFile } from '../types/database'

const cat = categories.dokumente

type DocumentWithFiles = DocumentRecord & { document_files: DocumentFile[] }

const LIST_QUERY = /* GraphQL */ `
  query Documents {
    documents(order_by: { created_at: desc }) {
      id
      category
      vendor
      amount
      document_date
      notes
      created_at
      document_files(order_by: { created_at: asc }) {
        id
        file_id
        file_name
      }
    }
  }
`

const INSERT_DOCUMENT = /* GraphQL */ `
  mutation InsertDocument($object: documents_insert_input!) {
    insert_documents_one(object: $object) {
      id
    }
  }
`

const UPDATE_DOCUMENT = /* GraphQL */ `
  mutation UpdateDocument($id: uuid!, $set: documents_set_input!) {
    update_documents_by_pk(pk_columns: { id: $id }, _set: $set) {
      id
    }
  }
`

const DELETE_DOCUMENT = /* GraphQL */ `
  mutation DeleteDocument($id: uuid!) {
    delete_documents_by_pk(id: $id) {
      id
    }
  }
`

const INSERT_DOCUMENT_FILES = /* GraphQL */ `
  mutation InsertDocumentFiles($objects: [document_files_insert_input!]!) {
    insert_document_files(objects: $objects) {
      returning {
        id
      }
    }
  }
`

const DELETE_DOCUMENT_FILE = /* GraphQL */ `
  mutation DeleteDocumentFile($id: uuid!) {
    delete_document_files_by_pk(id: $id) {
      id
    }
  }
`

function valuesFromDocument(doc?: DocumentRecord): DocumentFormValues {
  if (!doc) return emptyDocumentFormValues
  return {
    category: doc.category,
    vendor: doc.vendor ?? '',
    amount: doc.amount?.toString() ?? '',
    document_date: doc.document_date ?? '',
    notes: doc.notes ?? '',
  }
}

export default function Dokumente() {
  const [documents, setDocuments] = useState<DocumentWithFiles[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [editing, setEditing] = useState<DocumentWithFiles | null | 'new'>(null)
  const [saving, setSaving] = useState(false)

  const load = async () => {
    setLoading(true)
    try {
      const data = await gql<{ documents: DocumentWithFiles[] }>(LIST_QUERY)
      setDocuments(data.documents)
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

  const handleSave = async (values: DocumentFormValues, newPhotos: File[]) => {
    setSaving(true)
    setError(null)
    const documentSet = {
      category: values.category,
      vendor: values.vendor || null,
      amount: values.amount ? Number(values.amount) : null,
      document_date: values.document_date || null,
      notes: values.notes || null,
    }

    const isNew = editing === 'new'
    const current = isNew ? undefined : (editing ?? undefined)

    try {
      let documentId = current?.id
      if (isNew) {
        const res = await gql<{ insert_documents_one: { id: string } }>(INSERT_DOCUMENT, { object: documentSet })
        documentId = res.insert_documents_one.id
      } else if (current) {
        await gql(UPDATE_DOCUMENT, { id: current.id, set: documentSet })
      }

      if (documentId && newPhotos.length > 0) {
        const uploaded = await uploadDocumentPhotos(newPhotos)
        await gql(INSERT_DOCUMENT_FILES, {
          objects: uploaded.map((f) => ({ document_id: documentId, file_id: f.file_id, file_name: f.file_name })),
        })
      }

      setEditing(null)
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unbekannter Fehler beim Speichern.')
    } finally {
      setSaving(false)
    }
  }

  const handleDeleteFile = async (file: DocumentFile) => {
    try {
      await deleteStorageFile(file.file_id)
      await gql(DELETE_DOCUMENT_FILE, { id: file.id })
      setEditing((current) =>
        current && current !== 'new'
          ? { ...current, document_files: current.document_files.filter((f) => f.id !== file.id) }
          : current,
      )
      await load()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unbekannter Fehler beim Löschen des Fotos.')
    }
  }

  const handleDelete = async () => {
    if (!editing || editing === 'new') return
    if (!confirm('Dieses Dokument wirklich löschen? Alle zugehörigen Fotos werden ebenfalls gelöscht.')) return
    setSaving(true)
    try {
      for (const file of editing.document_files) {
        await deleteStorageFile(file.file_id)
      }
      await gql(DELETE_DOCUMENT, { id: editing.id })
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
      <PageHero title="Dokumente" category={cat} icon={<IconReceipt className="w-6 h-6" />} />

      <div className="px-4 pt-5">
        <div className="flex justify-end mb-3">
          <Button accent={cat.solid} onClick={() => setEditing('new')}>
            + Beleg
          </Button>
        </div>

        {error && <p className="text-sm text-red-500 mb-4">{error}</p>}

        {loading ? (
          <p className="text-sm text-slate-400">Lädt …</p>
        ) : documents.length === 0 ? (
          <EmptyState
            title="Noch keine Dokumente erfasst"
            hint="Fotografiere Rechnungen und Belege, um sie später wiederzufinden."
          />
        ) : (
          <div className="space-y-3">
            {documents.map((doc) => (
              <Card
                key={doc.id}
                className="cursor-pointer border-transparent transition-all hover:-translate-y-0.5 hover:shadow-md"
                onClick={() => setEditing(doc)}
              >
                <div className="flex items-center gap-3">
                  {doc.document_files[0] ? (
                    <DocumentPhoto
                      fileId={doc.document_files[0].file_id}
                      alt=""
                      className="h-10 w-10 shrink-0 rounded-xl object-cover"
                    />
                  ) : (
                    <span
                      className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl ${cat.tintBg} ${cat.text}`}
                    >
                      <IconReceipt className="w-5 h-5" />
                    </span>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800">
                      {doc.vendor?.trim() || documentCategoryLabels[doc.category]}
                    </p>
                    <p className="text-xs text-slate-400">
                      {documentCategoryLabels[doc.category]}
                      {doc.document_date ? ` · ${formatDateDe(doc.document_date)}` : ''}
                    </p>
                  </div>
                  {doc.amount !== null && (
                    <p className="text-sm font-medium text-slate-600 shrink-0">{formatEUR(doc.amount)}</p>
                  )}
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>

      {editing && (
        <Modal title={editing === 'new' ? 'Beleg hinzufügen' : 'Beleg bearbeiten'} onClose={() => setEditing(null)}>
          {error && <p className="mb-3 rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}
          <DocumentForm
            initialValues={valuesFromDocument(editing === 'new' ? undefined : editing)}
            existingFiles={editing === 'new' ? [] : editing.document_files}
            onDeleteExistingFile={handleDeleteFile}
            onSubmit={handleSave}
            onDelete={editing !== 'new' ? handleDelete : undefined}
            submitting={saving}
          />
        </Modal>
      )}
    </>
  )
}
