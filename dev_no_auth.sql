-- ============================================================================
-- HausPilot – Entwicklungsmodus ohne Haushalte/Login (EINMALIG ausführen)
-- ============================================================================
-- Zweck: Im Dev-Modus spricht die App Hasura mit Admin-Rechten an (siehe
-- VITE_NHOST_ADMIN_SECRET in der .env). Dabei setzt Hasura die household_id
-- NICHT mehr automatisch (das machte bisher die "user"-Rolle per Preset).
-- Weil household_id auf jeder Tabelle NOT NULL ist, würden Inserts sonst
-- scheitern. Dieses Skript vergibt einen festen Dev-Standardwert.
--
-- Ausführen in: Nhost Console -> Database -> SQL -> Run!
-- Muss nur EINMAL laufen. Rückgängig: siehe Block ganz unten.
-- ============================================================================

alter table vehicles                    alter column household_id set default '11111111-1111-1111-1111-111111111111';
alter table vehicle_appointments        alter column household_id set default '11111111-1111-1111-1111-111111111111';
alter table plants                      alter column household_id set default '11111111-1111-1111-1111-111111111111';
alter table plant_care_recommendations  alter column household_id set default '11111111-1111-1111-1111-111111111111';
alter table contracts                   alter column household_id set default '11111111-1111-1111-1111-111111111111';
alter table appliances                  alter column household_id set default '11111111-1111-1111-1111-111111111111';
alter table appliance_maintenance_log   alter column household_id set default '11111111-1111-1111-1111-111111111111';
alter table shopping_items              alter column household_id set default '11111111-1111-1111-1111-111111111111';
alter table reminders                   alter column household_id set default '11111111-1111-1111-1111-111111111111';
alter table documents                   alter column household_id set default '11111111-1111-1111-1111-111111111111';
alter table document_files              alter column household_id set default '11111111-1111-1111-1111-111111111111';

-- ============================================================================
-- Rückgängig machen (wenn Login/Haushalte später wieder aktiv werden):
-- ============================================================================
-- alter table vehicles                    alter column household_id drop default;
-- alter table vehicle_appointments        alter column household_id drop default;
-- alter table plants                      alter column household_id drop default;
-- alter table plant_care_recommendations  alter column household_id drop default;
-- alter table contracts                   alter column household_id drop default;
-- alter table appliances                  alter column household_id drop default;
-- alter table appliance_maintenance_log   alter column household_id drop default;
-- alter table shopping_items              alter column household_id drop default;
-- alter table reminders                   alter column household_id drop default;
-- alter table documents                   alter column household_id drop default;
-- alter table document_files              alter column household_id drop default;
