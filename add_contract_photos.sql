-- ============================================================================
-- HausPilot – Fotos direkt am Vertrag (EINMALIG)
-- ============================================================================
-- Neue Tabelle contract_files (analog zu document_files), fuer Fotos, die
-- direkt im Vertrag selbst hinterlegt werden (z. B. Foto der Police), statt
-- nur ueber einen separat verknuepften Beleg.
--
-- Ausführen in: Nhost Console -> Table Editor & Browser -> SQL
--
-- Danach in der Hasura-Console (siehe auch SETUP.md Abschnitt I):
-- 1. Tabelle "contract_files" tracken (erscheint nach dem Ausführen unter
--    "Untracked tables")
-- 2. Vorgeschlagene Beziehung contract_files <-> contracts mittracken
--    (bzw. über "Edit Relationships" nachtragen)
-- 3. GraphQL -> Metadata -> Reload metadata
-- 4. Permissions fuer Rolle "user" bei contract_files setzen
--    (select/insert/delete), genau wie bei document_files
-- ============================================================================

-- file_id verweist auf eine Datei im Nhost-Storage-Standard-Bucket (kein FK,
-- da storage.files eine separate, servicegeführte Tabelle ist).
create table contract_files (
  id            uuid primary key default gen_random_uuid(),
  household_id  uuid not null,
  contract_id   uuid not null references contracts(id) on delete cascade,
  file_id       uuid not null,
  file_name     text,
  created_at    timestamptz default now()
);

-- Dev-Modus ohne Auth: gleicher fester Default wie bei den anderen Tabellen.
alter table contract_files alter column household_id set default '11111111-1111-1111-1111-111111111111';
