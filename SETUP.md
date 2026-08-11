# HausPilot – Einrichtung mit Login & mehreren Haushalten

Diese Anleitung richtet die echte Trennung mehrerer Haushalte über Nhost-Auth ein.
Jeder Haushalt meldet sich mit **Haushaltsname + Passwort** an und sieht nur seine
eigenen Daten. Neue Haushalte legst nur **du als Admin** an.

> Reihenfolge einhalten: erst Auth-Einstellungen (A), dann Schema (B), dann
> Tracking (C) und Berechtigungen (D), zuletzt Haushalte anlegen (E).

---

## A) Nhost-Auth-Einstellungen

Nhost-Dashboard → **Settings → Authentication**:

1. **E-Mail + Passwort** als Anmeldemethode aktiviert lassen.
2. **E-Mail-Verifizierung ausschalten:** Option „Require verified emails" / „E-Mail-
   Verifizierung erforderlich" **deaktivieren**. (Die App nutzt interne technische
   E-Mails wie `familie-mueller@hauspilot.app`, die nicht bestätigt werden können.)
3. **Öffentliche Registrierung ausschalten:** „Allow new users to sign up" / „Neue
   Registrierungen erlauben" **deaktivieren**. So kann sich niemand selbst anlegen –
   Haushalte entstehen nur über die Nutzerverwaltung (Schritt E).

---

## B) Schema einspielen

Nhost-Dashboard → **Database → SQL Editor** → kompletten Inhalt von
[`nhost_schema.sql`](./nhost_schema.sql) einfügen und ausführen.

> Der DROP-Block am Anfang löscht die alten Tabellen samt Testdaten – gewollt,
> weil sich die Struktur geändert hat (`household_id` jetzt auf allen Tabellen).

---

## C) Tabellen & Beziehungen tracken

Nhost-Dashboard → **Data** (Hasura-Console) → Tab **Data**:

1. Unter `public` alle **11 Tabellen** über **„Track All"** tracken:
   `vehicles, vehicle_appointments, plants, plant_care_recommendations, contracts,
   appliances, appliance_maintenance_log, shopping_items, reminders, documents,
   document_files`.
2. Danach zeigt Hasura vorgeschlagene **Foreign-Key-Beziehungen** an → ebenfalls
   **„Track All"**. (Sonst funktionieren die verschachtelten Abfragen wie
   Fahrzeug→Termine oder Pflanze→Pflegeempfehlungen nicht.)

---

## D) Berechtigungen: nur die `user`-Rolle, gefiltert auf den Haushalt

Für **jede der 11 Tabellen** (Data → Tabelle → Tab **Permissions**):

1. Im Feld für eine neue Rolle **`user`** eintippen.
2. Für **select / insert / update / delete** jeweils diese Regel setzen:
   - **Row-Check (Zeilenfilter):** `household_id` **`_eq`** `X-Hasura-User-Id`
     (im Builder: Spalte `household_id`, Operator `_eq`, Wert aus dem Dropdown
     **`X-Hasura-User-Id`** auswählen).
   - **Columns:** alle Spalten anhaken.
   - **Nur bei insert zusätzlich – Column preset:** `household_id` = `x-hasura-user-id`
     (Session-Variable). Dadurch setzt Hasura den Haushalt automatisch; die App
     sendet `household_id` nie selbst.
3. **Wichtig:** Die Rolle **`public` darf KEINE Berechtigungen haben.** Falls dort
   noch die alten offenen Rechte stehen: entfernen. Sonst könnte man ohne Login lesen.

**Zeitspar-Tipp:** Hasura bietet beim Speichern einer Berechtigung unten
„**Clone permission**" an – damit kannst du dieselbe Regel in einem Rutsch auf
mehrere Tabellen/Aktionen übertragen. Die Regel ist überall identisch
(`household_id = X-Hasura-User-Id`), also gut klonbar.

---

## E) Einen Haushalt anlegen (Admin)

Nhost-Dashboard → **Auth → Users → Add user** (Nutzer hinzufügen):

- **Email:** `<slug>@hauspilot.app`
  Der *slug* ist der Haushaltsname in Kleinbuchstaben, Umlaute ausgeschrieben
  (ä→ae, ö→oe, ü→ue, ß→ss), Leer-/Sonderzeichen zu Bindestrichen.
- **Password:** frei wählbar (mind. 3 Zeichen).
- **Display name:** der schöne Haushaltsname – **dieser wird in der App angezeigt.**
- Falls ein Schalter „Email verified" angeboten wird: **an**.

**Beispiele**

| Haushaltsname (Login + Anzeige) | Email für Nhost               |
| ------------------------------- | ----------------------------- |
| `Familie Müller`                | `familie-mueller@hauspilot.app` |
| `WG Sonnenhof`                  | `wg-sonnenhof@hauspilot.app`  |

Der Haushalt meldet sich danach in der App mit **`Familie Müller` + Passwort** an.
Die App bildet aus dem eingegebenen Namen automatisch dieselbe interne E-Mail.

---

## F) App starten

`.env` enthält bereits `VITE_NHOST_SUBDOMAIN` und `VITE_NHOST_REGION`. Dann:

```
npm install
npm run dev
```

http://localhost:5173 öffnen → Login-Screen erscheint → mit einem in Schritt E
angelegten Haushalt anmelden.

---

## G) Dokumente-Feature nachrüsten (bei bereits bestehender Installation)

Läuft die App schon mit echten Daten, **nicht** `nhost_schema.sql` erneut
ausführen (löscht alles). Stattdessen:

1. Nhost-Dashboard → **Database → SQL Editor** → kompletten Inhalt von
   [`add_documents_and_merkzettel.sql`](./add_documents_and_merkzettel.sql)
   einfügen und ausführen. Legt nur die zwei neuen Tabellen `documents` und
   `document_files` an, macht `reminders.due_date` optional (für den
   Merkzettel) und setzt – nur falls `VITE_NHOST_ADMIN_SECRET` aktiv ist –
   den gleichen Dev-Default für `household_id` wie bei den übrigen Tabellen.
2. Wie in Abschnitt C beschrieben: `documents` und `document_files` in der
   Hasura-Console tracken (inkl. vorgeschlagener Beziehung `document_files`
   auf `documents`).
3. Falls das echte Multi-Haushalt-Login (Abschnitt D) schon aktiv ist: für
   beide neuen Tabellen dieselbe `user`-Rollen-Regel wie bei den anderen
   Tabellen setzen (`household_id = X-Hasura-User-Id`).

**Fotos/Storage:** Uploads nutzen den Standard-Storage-Bucket, den jedes
Nhost-Projekt automatisch hat – dafür ist kein zusätzlicher Dashboard-Schritt
nötig, solange der Dev-Modus (Admin-Secret) aktiv ist. Wird später das echte
Login reaktiviert, braucht auch die Storage-Tabelle `storage.files`
Berechtigungen für die `user`-Rolle, sonst können eingeloggte Haushalte keine
Fotos mehr hoch-/herunterladen – das ist aktuell noch offen (siehe unten).

---

## H) Neue Vertragskategorien für die Kostenübersicht nachrüsten

Nhost-Dashboard → **Database → SQL Editor** → kompletten Inhalt von
[`extend_contract_categories.sql`](./extend_contract_categories.sql) einfügen
und ausführen. Erweitert nur den Check-Constraint der Spalte
`contracts.category` um `wasser`, `muellabfuhr`, `kreditrate`,
`grundsteuer` – additiv, keine Daten betroffen, kein neues Tracking nötig
(die Tabelle `contracts` ist ja schon getrackt).

---

## Sicherheit vor einem echten Deployment

Mit Schritt D ist die Trennung serverseitig echt: Ohne gültigen Login-Token gibt die
`public`-Rolle nichts heraus, und jeder Haushalt sieht ausschließlich Zeilen mit
seiner `household_id`. Vor einem öffentlichen Deployment trotzdem prüfen:
`public`-Rolle wirklich ohne Rechte, und ggf. Passwort-Mindestlänge in den
Nhost-Auth-Einstellungen erhöhen. Zusätzlich noch offen: Berechtigungen für
`storage.files` (siehe Abschnitt G) – ohne die kann nach Aktivierung des
echten Logins niemand mehr Dokumente-Fotos hoch-/herunterladen.
