-- ============================================================================
-- HausPilot – Kilometerstand + letzter Ölwechsel bei Fahrzeugen (EINMALIG)
-- ============================================================================
-- Additiv, keine drops – bestehende Daten bleiben unangetastet.
--
-- Ausführen in: Nhost Console -> Database -> SQL -> Run!
-- Danach ggf. wie gehabt bei vehicles die Spalten-Freigabe für die
-- user-Rolle prüfen (Toggle All bei select/insert/update).
-- ============================================================================

alter table vehicles add column mileage_km integer;
alter table vehicles add column mileage_date date;
alter table vehicles add column last_oil_change_date date;
