-- ============================================================================
-- HausPilot – Nachrüsten: Dokumente-Feature + Merkzettel (EINMALIG ausführen)
-- ============================================================================
-- Additiv, keine drops – bestehende Daten in den anderen Tabellen bleiben
-- unangetastet. NICHT nhost_schema.sql erneut ausführen, das würde alle
-- Tabellen samt Daten löschen!
--
-- Ausführen in: Nhost Console -> Database -> SQL -> Run!
-- Danach: siehe SETUP.md Abschnitt "Dokumente-Feature nachrüsten" für
-- Tracking + Berechtigungen der zwei neuen Tabellen.
-- ============================================================================

-- 1) Neue Tabellen für Dokumente/Belege -------------------------------------

create table documents (
  id             uuid primary key default gen_random_uuid(),
  household_id   uuid not null,
  category       text not null check (category in ('lebensmittel','haushalt','reparatur_handwerker','elektronik','kleidung','gesundheit','freizeit','sonstiges')),
  vendor         text,
  amount         numeric(10,2),
  document_date  date,
  notes          text,
  created_at     timestamptz default now()
);

-- file_id verweist auf eine Datei im Nhost-Storage-Standard-Bucket (kein FK,
-- da storage.files eine separate, servicegeführte Tabelle ist).
create table document_files (
  id            uuid primary key default gen_random_uuid(),
  household_id  uuid not null,
  document_id   uuid not null references documents(id) on delete cascade,
  file_id       uuid not null,
  file_name     text,
  created_at    timestamptz default now()
);

-- 2) Merkzettel: due_date bei reminders ist jetzt optional -------------------
-- (der neue "Merkzettel" auf dem Dashboard braucht kein Datum, im Gegensatz
-- zu den automatischen Terminen)

alter table reminders alter column due_date drop not null;

-- 3) Dev-Modus ohne Auth: dieselben festen Defaults wie bei den anderen
-- Tabellen (siehe dev_no_auth.sql). Nur nötig/wirksam, solange
-- VITE_NHOST_ADMIN_SECRET in der .env gesetzt ist.

alter table documents      alter column household_id set default '11111111-1111-1111-1111-111111111111';
alter table document_files alter column household_id set default '11111111-1111-1111-1111-111111111111';
