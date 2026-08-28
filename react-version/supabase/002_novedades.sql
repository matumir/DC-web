-- Distribuidora Castelli - consentimiento para novedades por mail.
--
-- Correr una sola vez desde el SQL Editor de Supabase, despues del 001.
-- Es idempotente.
--
-- Por que hace falta una columna extra: acepta_novedades es NOT NULL DEFAULT
-- false, asi que no distingue "dijo que no" de "todavia no le preguntamos".
-- Sin esa diferencia, o le preguntamos en cada login a quien ya dijo que no,
-- o nunca le preguntamos a nadie.
alter table public.perfiles
  add column if not exists novedades_respondido_en timestamptz;

comment on column public.perfiles.acepta_novedades is
  'Consentimiento explicito para mails promocionales (Ley 25.326). Solo mandar a quienes tienen true.';

comment on column public.perfiles.novedades_respondido_en is
  'Cuando respondio. NULL = todavia no se le pregunto. Sirve de constancia de cuando dio el consentimiento.';

-- Vista para exportar la lista de mails a la que SI se puede escribir.
--
-- OJO: una vista NO hereda las politicas RLS de la tabla por defecto, porque
-- se ejecuta con los permisos de quien la creo. Tal como quedaba aca, filtraba
-- los mails a cualquiera con la clave anon. El 006_seguridad.sql lo corrige
-- con security_invoker y revoke; si recreas esta vista, volve a aplicarlo.
create or replace view public.suscriptores_novedades as
  select email, nombre, novedades_respondido_en
  from public.perfiles
  where acepta_novedades = true;
