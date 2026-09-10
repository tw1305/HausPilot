-- ============================================================================
-- HausPilot – Turnus (Wiederholung) bei Aufgaben (EINMALIG)
-- ============================================================================
-- Fuegt appliances.recurrence_amount (Zahl) und appliances.recurrence_unit
-- (Einheit) hinzu. Wenn beide gesetzt sind, wird beim Erledigen einer
-- Aufgabe (Button "Erledigt" oder neuer Wartungsprotokoll-Eintrag)
-- automatisch ein neues next_maintenance_due berechnet, statt es zu leeren.
--
-- Ausführen in: Nhost Console -> Database -> SQL -> Run!
--
-- WICHTIG danach (sonst Fehler "field not found in type"):
-- 1. Settings -> Metadata -> Reload metadata
-- 2. Data -> appliances -> Permissions -> Rolle "user":
--    recurrence_amount und recurrence_unit bei select/insert/update anhaken
-- ============================================================================

alter table appliances add column if not exists recurrence_amount integer;
alter table appliances add column if not exists recurrence_unit text
  check (recurrence_unit in ('days', 'weeks', 'months', 'years'));
