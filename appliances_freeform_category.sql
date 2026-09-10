-- ============================================================================
-- HausPilot – Freie Kategorien bei Haus & Technik (EINMALIG)
-- ============================================================================
-- Entfernt den festen Check-Constraint auf appliances.category, damit
-- Nutzer eigene Kategorien anlegen können. Bestehende Werte 'waermepumpe'
-- und 'pv_anlage' werden zur neuen Sammelkategorie 'Technik' migriert,
-- 'sonstiges' wird zu 'Sonstiges'.
--
-- Ausführen in: Nhost Console -> Database -> SQL -> Run!
-- ============================================================================

do $$
declare
  con_name text;
begin
  select conname into con_name
  from pg_constraint
  where conrelid = 'appliances'::regclass
    and contype = 'c'
    and pg_get_constraintdef(oid) like '%category%';

  if con_name is not null then
    execute format('alter table appliances drop constraint %I', con_name);
  end if;
end $$;

update appliances set category = 'Technik' where category in ('waermepumpe', 'pv_anlage');
update appliances set category = 'Sonstiges' where category = 'sonstiges';
