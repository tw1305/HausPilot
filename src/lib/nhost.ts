import { createClient } from '@nhost/nhost-js'
import type { StoredSession } from '@nhost/nhost-js/session'
import { withAdminSessionMiddleware } from '@nhost/nhost-js/fetch'

export const nhost = createClient({
  subdomain: import.meta.env.VITE_NHOST_SUBDOMAIN,
  region: import.meta.env.VITE_NHOST_REGION,
})

const ADMIN_SECRET = import.meta.env.VITE_NHOST_ADMIN_SECRET as string | undefined

// Im Dev-Modus (siehe DEV_NO_AUTH unten) läuft auch der Storage-Client ohne
// Login – die GraphQL-Anfragen bekommen ihr Admin-Secret über den manuellen
// fetch()-Zweig in gql(), der Storage-Client braucht dafür diese Middleware.
if (ADMIN_SECRET) {
  nhost.storage.pushChainFunction(withAdminSessionMiddleware({ adminSecret: ADMIN_SECRET }))
}

/**
 * Entwicklungsmodus. Ist in der .env ein `VITE_NHOST_ADMIN_SECRET` gesetzt,
 * läuft die App OHNE Login/Haushalte und spricht Hasura mit Admin-Rechten an –
 * das umgeht sämtliche Rollen-/Spalten-Berechtigungen, sodass neue DB-Spalten
 * sofort funktionieren, ohne sie in Hasura freizugeben.
 *
 * ⚠️ NUR für die lokale Entwicklung. Das Admin-Secret landet im Browser-Bundle –
 * eine so gebaute App darf niemals öffentlich deployt werden. Vor dem Deployment
 * das Secret aus der .env entfernen und die Haushalts-/Login-Logik wieder aktiv.
 */
export const DEV_NO_AUTH = Boolean(ADMIN_SECRET)

const GRAPHQL_URL = `https://${import.meta.env.VITE_NHOST_SUBDOMAIN}.hasura.${import.meta.env.VITE_NHOST_REGION}.nhost.run/v1/graphql`

/**
 * Wandelt einen Haushaltsnamen in einen technischen Login-Bezeichner um
 * (Kleinbuchstaben, Umlaute ausgeschrieben, Sonderzeichen zu Bindestrichen).
 * Daraus wird die interne E-Mail für Nhost-Auth gebildet – so kann sich der
 * Haushalt mit "Haushaltsname + Passwort" einloggen, ohne eine E-Mail zu kennen.
 */
export function householdSlug(name: string): string {
  return name
    .trim()
    .toLowerCase()
    .replace(/ä/g, 'ae')
    .replace(/ö/g, 'oe')
    .replace(/ü/g, 'ue')
    .replace(/ß/g, 'ss')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function householdEmail(name: string): string {
  return `${householdSlug(name)}@hauspilot.app`
}

export async function loginWithHousehold(name: string, password: string): Promise<StoredSession | null> {
  await nhost.auth.signInEmailPassword({ email: householdEmail(name), password })
  return nhost.getUserSession()
}

export async function logout(): Promise<void> {
  const session = nhost.getUserSession()
  try {
    if (session) await nhost.auth.signOut({ refreshToken: session.refreshToken })
  } catch {
    // Server-Abmeldung best effort – lokale Session wird in jedem Fall geleert.
  }
  nhost.clearSession()
}

export function getSession(): StoredSession | null {
  return nhost.getUserSession()
}

/**
 * Dünner Wrapper um nhost.graphql.request(): entpackt die verschachtelte
 * FetchResponse<GraphQLResponse<T>>-Struktur der SDK auf das reine Datenobjekt.
 * Der Auth-Token wird von der SDK-Middleware automatisch an jede Anfrage
 * angehängt, sobald ein Haushalt eingeloggt ist – Hasura filtert dann über die
 * user-Rolle serverseitig auf die Daten dieses Haushalts.
 */
export async function gql<TData = unknown, TVariables extends Record<string, unknown> = Record<string, unknown>>(
  query: string,
  variables?: TVariables,
): Promise<TData> {
  // Entwicklungsmodus: direkt gegen Hasura mit Admin-Secret (umgeht Berechtigungen)
  if (ADMIN_SECRET) {
    const res = await fetch(GRAPHQL_URL, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        'x-hasura-admin-secret': ADMIN_SECRET,
      },
      body: JSON.stringify({ query, variables }),
    })
    const json = (await res.json()) as { data?: TData; errors?: { message: string }[] }
    if (json.errors?.length) {
      throw new Error(json.errors[0].message)
    }
    if (json.data === undefined || json.data === null) {
      throw new Error('GraphQL-Antwort enthielt keine Daten.')
    }
    return json.data
  }

  const response = await nhost.graphql.request<TData, TVariables>({ query, variables })
  if (response.body.data === undefined) {
    throw new Error('GraphQL-Antwort enthielt keine Daten.')
  }
  return response.body.data
}

/** Lädt Fotos in den Nhost-Storage-Standard-Bucket hoch, z. B. für Dokumente/Belege. */
export async function uploadDocumentPhotos(files: File[]): Promise<{ file_id: string; file_name: string }[]> {
  if (files.length === 0) return []
  const res = await nhost.storage.uploadFiles({ 'file[]': files })
  return res.body.processedFiles.map((f) => ({ file_id: f.id, file_name: f.name }))
}

/** Löscht eine Datei im Storage. Ist sie schon weg, wird das ignoriert – die zugehörige DB-Zeile wird trotzdem entfernt. */
export async function deleteStorageFile(fileId: string): Promise<void> {
  try {
    await nhost.storage.deleteFile(fileId)
  } catch {
    // best effort
  }
}

/** Lädt eine Storage-Datei als Blob und liefert eine object: URL dafür (vom Aufrufer per URL.revokeObjectURL wieder freizugeben). */
export async function getStorageFileUrl(fileId: string): Promise<string> {
  const res = await nhost.storage.getFile(fileId)
  return URL.createObjectURL(res.body)
}
