-- ============================================================================
-- HausPilot – Neue Belegart "Vinted" für Dokumente (EINMALIG)
-- ============================================================================
-- Fügt 'vinted' zu den erlaubten Werten der Spalte documents.category hinzu.
-- Additiv, keine Daten betroffen.
--
-- Der Check-Constraint-Name wird dynamisch ermittelt (statt hart codiert),
-- falls Hasura/Postgres beim Anlegen einen anderen Namen vergeben hat.
--
-- Ausführen in: Nhost Console -> Database -> SQL -> Run!
-- ============================================================================

do $$
declare
  con_name text;
begin
  select conname into con_name
  from pg_constraint
  where conrelid = 'documents'::regclass
    and contype = 'c'
    and pg_get_constraintdef(oid) like '%category%';

  if con_name is not null then
    execute format('alter table documents drop constraint %I', con_name);
  end if;
end $$;

alter table documents add constraint documents_category_check
  check (category in (
    'lebensmittel',
    'haushalt',
    'reparatur_handwerker',
    'elektronik',
    'kleidung',
    'gesundheit',
    'freizeit',
    'vinted',
    'sonstiges'
  ));
