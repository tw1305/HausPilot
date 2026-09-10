-- ============================================================================
-- HausPilot – Pflegeempfehlungen "erledigen" statt nur verschieben (EINMALIG)
-- ============================================================================
-- Fuegt plant_care_recommendations.last_done_year hinzu. Wird eine
-- wiederkehrende Pflegeempfehlung (z. B. "Kontrolle auf Schädlinge/
-- Frostschäden") als erledigt markiert, merkt sich die App darin das Jahr
-- der gerade erledigten Fälligkeit – der naechste Termin springt dann
-- automatisch aufs Folgejahr, ohne den Monat manuell verschieben zu müssen.
--
-- Ausführen in: Nhost Console -> Table Editor & Browser -> SQL
--
-- Danach in Hasura (wie zuletzt bei appliances):
-- 1. GraphQL -> Metadata -> Reload metadata
-- 2. Data -> plant_care_recommendations -> Edit Permissions -> Rolle "user":
--    last_done_year bei select/insert/update anhaken
-- ============================================================================

alter table plant_care_recommendations add column if not exists last_done_year integer;
