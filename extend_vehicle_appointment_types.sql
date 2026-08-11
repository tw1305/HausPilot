-- ============================================================================
-- HausPilot – Ganzjahresreifen als Reifenwechsel-Typ (EINMALIG)
-- ============================================================================
-- Fügt 'reifenwechsel_ganzjahr' zu den erlaubten Werten der Spalte
-- vehicle_appointments.type hinzu. Additiv, keine Daten betroffen.
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
  where conrelid = 'vehicle_appointments'::regclass
    and contype = 'c'
    and pg_get_constraintdef(oid) like '%type%';

  if con_name is not null then
    execute format('alter table vehicle_appointments drop constraint %I', con_name);
  end if;
end $$;

alter table vehicle_appointments add constraint vehicle_appointments_type_check
  check (type in (
    'tuv_pickerl',
    'service',
    'reifenwechsel_sommer',
    'reifenwechsel_winter',
    'reifenwechsel_ganzjahr',
    'sonstiges'
  ));
