-- ============================================================
-- HausPilot – Nhost (Postgres) Schema · Multi-Haushalt
-- Ausführen im Nhost-Dashboard → Database → SQL Editor
-- Danach: Tabellen tracken + Permissions setzen (siehe SETUP.md)
--
-- ACHTUNG: Der DROP-Block unten löscht die alten Tabellen samt Daten.
-- Das ist gewollt, da sich die Struktur geändert hat (household_id auf
-- allen Tabellen, keine households-Tabelle mehr). Nur Testdaten betroffen.
-- ============================================================

drop table if exists document_files cascade;
drop table if exists documents cascade;
drop table if exists appliance_maintenance_log cascade;
drop table if exists appliances cascade;
drop table if exists plant_care_recommendations cascade;
drop table if exists plants cascade;
drop table if exists vehicle_appointments cascade;
drop table if exists contracts cascade;
drop table if exists vehicles cascade;
drop table if exists shopping_items cascade;
drop table if exists reminders cascade;
drop table if exists households cascade;

-- ------------------------------------------------------------
-- household_id auf JEDER Tabelle = die Nhost-Auth-User-ID des Haushalts
-- (X-Hasura-User-Id). Wird von Hasura beim Insert automatisch gesetzt
-- (Column-Preset) und beim Lesen/Ändern/Löschen als Filter genutzt.
-- Deshalb: kein Default, kein FK auf eine households-Tabelle nötig.
-- ------------------------------------------------------------

create table vehicles (
  id             uuid primary key default gen_random_uuid(),
  household_id   uuid not null,
  license_plate  text not null,
  make           text not null,
  model          text not null,
  year_built     int,
  notes          text,
  created_at     timestamptz default now()
);

create table vehicle_appointments (
  id            uuid primary key default gen_random_uuid(),
  household_id  uuid not null,
  vehicle_id    uuid not null references vehicles(id) on delete cascade,
  type          text not null check (type in ('tuv_pickerl','service','reifenwechsel_sommer','reifenwechsel_winter','reifenwechsel_ganzjahr','sonstiges')),
  due_date      date not null,
  notes         text,
  completed_at  date,
  created_at    timestamptz default now()
);

create table plants (
  id            uuid primary key default gen_random_uuid(),
  household_id  uuid not null,
  name          text not null,
  plant_type    text,
  location      text,
  planted_on    date,
  next_pruning_on date,
  notes         text,
  created_at    timestamptz default now()
);

create table plant_care_recommendations (
  id            uuid primary key default gen_random_uuid(),
  household_id  uuid not null,
  plant_id      uuid not null references plants(id) on delete cascade,
  title         text not null,
  month         int not null check (month between 1 and 12),
  recurring     boolean not null default true,
  year          int,
  notes         text,
  source        text not null default 'manual' check (source in ('manual','template')),
  created_at    timestamptz default now()
);

create table contracts (
  id                          uuid primary key default gen_random_uuid(),
  household_id                uuid not null,
  category                    text not null check (category in ('strom','internet','wasser','muellabfuhr','kreditrate','grundsteuer','versicherung_gebaeude','versicherung_kfz','versicherung_sonstige','sonstiges')),
  provider                    text not null,
  customer_number             text,
  monthly_amount              numeric(10,2),
  yearly_amount               numeric(10,2),
  contract_start_date         date,
  contract_end_date           date,
  cancellation_notice_days    int,
  next_payment_date           date,
  cancellation_deadline_date  date,
  reminder_date               date,
  contact_person              text,
  vehicle_id                  uuid references vehicles(id) on delete set null,
  notes                       text,
  created_at                  timestamptz default now()
);

create table appliances (
  id                     uuid primary key default gen_random_uuid(),
  household_id           uuid not null,
  category               text not null check (category in ('waermepumpe','pv_anlage','sonstiges')),
  name                   text not null,
  manufacturer           text,
  model                  text,
  serial_number          text,
  installed_on           date,
  next_maintenance_due   date,
  details                jsonb not null default '{}',
  notes                  text,
  created_at             timestamptz default now()
);

create table appliance_maintenance_log (
  id            uuid primary key default gen_random_uuid(),
  household_id  uuid not null,
  appliance_id  uuid not null references appliances(id) on delete cascade,
  performed_on  date not null,
  description   text not null,
  performed_by  text,
  cost          numeric(10,2),
  created_at    timestamptz default now()
);

create table shopping_items (
  id            uuid primary key default gen_random_uuid(),
  household_id  uuid not null,
  name          text not null,
  quantity      text,
  is_done       boolean not null default false,
  done_at       timestamptz,
  created_at    timestamptz default now()
);

create table reminders (
  id            uuid primary key default gen_random_uuid(),
  household_id  uuid not null,
  title         text not null,
  due_date      date, -- optional: der Merkzettel (Dashboard) kommt auch ohne Datum aus
  notes         text,
  is_done       boolean not null default false,
  created_at    timestamptz default now()
);

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

-- Nach dem Ausführen: alle 11 Tabellen in der Hasura-Console tracken
-- (inkl. der vorgeschlagenen Beziehungen) und je Tabelle die user-Rolle
-- konfigurieren. Genaue Schritte: siehe SETUP.md.
