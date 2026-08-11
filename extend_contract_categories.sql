-- ============================================================================
-- HausPilot – Neue Vertragskategorien für die Kostenübersicht (EINMALIG)
-- ============================================================================
-- Fügt 'wasser', 'muellabfuhr', 'kreditrate', 'grundsteuer' zu den erlaubten
-- Werten der Spalte contracts.category hinzu. Additiv, keine Daten betroffen.
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
  where conrelid = 'contracts'::regclass
    and contype = 'c'
    and pg_get_constraintdef(oid) like '%category%';

  if con_name is not null then
    execute format('alter table contracts drop constraint %I', con_name);
  end if;
end $$;

alter table contracts add constraint contracts_category_check
  check (category in (
    'strom',
    'internet',
    'wasser',
    'muellabfuhr',
    'kreditrate',
    'grundsteuer',
    'versicherung_gebaeude',
    'versicherung_kfz',
    'versicherung_sonstige',
    'sonstiges'
  ));
