-- ============================================================================
-- HausPilot – Beleg <-> Vertrag verknüpfen + "Bezahlt am" (EINMALIG ausführen)
-- ============================================================================
-- Additiv, keine drops – bestehende Daten bleiben unangetastet.
--
-- Ausführen in: Nhost Console -> Database -> SQL -> Run!
-- Danach: in Hasura (Data) die neue Beziehung documents.contract_id ->
-- contracts.id tracken (Hasura schlägt sie automatisch vor), und bei
-- documents/document_files ggf. wie gehabt die Spalten-Freigabe für die
-- user-Rolle prüfen (Toggle All bei select/insert/update).
-- ============================================================================

alter table documents add column contract_id uuid references contracts(id) on delete set null;
alter table documents add column paid_on date;
