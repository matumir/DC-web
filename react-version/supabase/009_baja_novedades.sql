-- Distribuidora Castelli - enlace de baja para los correos de novedades.
--
-- Correr una sola vez desde el SQL Editor, despues del 008. Es idempotente.
--
-- POR QUE HACE FALTA
-- La politica de privacidad promete "el enlace de baja incluido en cada
-- correo", y ese enlace no existia: la unica forma de darse de baja era entrar
-- con la cuenta y destildar el casillero. La Ley 25.326 pide poder revocar el
-- consentimiento tan facil como se dio, y un correo masivo sin baja visible es
-- lo que hace que la gente lo marque como spam.
--
-- QUIEN MANDA LA VERDAD
-- perfiles.acepta_novedades, siempre. El enlace apunta a este sitio y no al
-- proveedor de newsletter: si las bajas quedaran solo del lado del proveedor,
-- la proxima sincronizacion volveria a subir a quien pidio que no le escriban.

-- ---------------------------------------------------------------------------
-- Token de baja
--
-- Se agrega en tres pasos en vez de "add column ... not null default": el
-- default es una funcion volatil, y asi queda explicito que cada fila existente
-- recibe su propio uuid y no todas el mismo.
-- ---------------------------------------------------------------------------
alter table public.perfiles
  add column if not exists token_baja uuid;

update public.perfiles
set token_baja = gen_random_uuid()
where token_baja is null;

alter table public.perfiles
  alter column token_baja set default gen_random_uuid();

alter table public.perfiles
  alter column token_baja set not null;

create unique index if not exists perfiles_token_baja_idx
  on public.perfiles (token_baja);

comment on column public.perfiles.token_baja is
  'Identifica al perfil en el enlace de baja de los correos. Solo sirve para desuscribir, nunca para suscribir ni para iniciar sesion.';

-- El token viaja en un correo: no tiene por que poder leerse desde el
-- navegador. Se usa unicamente a traves de darse_de_baja().
--
-- OJO: "revoke select (token_baja)" a secas NO alcanza. Los permisos de
-- columna y los de tabla son independientes: mientras exista el GRANT SELECT
-- sobre la tabla entera, se pueden leer todas las columnas igual y el revoke
-- por columna queda en nada. Hay que sacar el de tabla y volver a dar el
-- resto, que es el mismo patron que uso el 006 para el UPDATE.
revoke select on public.perfiles from anon, authenticated;

-- anon queda sin SELECT: las politicas RLS ya no le devolvian ninguna fila, y
-- el sitio solo lee perfiles con la sesion iniciada.
grant select (
  id,
  email,
  nombre,
  avatar_url,
  acepta_novedades,
  novedades_respondido_en,
  terminos_version,
  terminos_aceptados_en,
  es_admin,
  telefono,
  creado_en
) on public.perfiles to authenticated;

-- Para comprobar que quedo afuera, con una sesion iniciada desde el sitio:
--   select token_baja from perfiles;  -->  permission denied for table perfiles
-- y que lo demas sigue andando:
--   select acepta_novedades from perfiles;  -->  devuelve la fila propia

-- ---------------------------------------------------------------------------
-- Darse de baja
--
-- security definer y abierta a anon a proposito: quien hace clic desde el
-- correo no tiene sesion iniciada, que es justamente el caso que hay que
-- resolver. Pedirle que inicie sesion para dejar de recibir correos seria
-- exactamente la friccion que la ley no permite.
--
-- Es de una sola direccion: con el token SOLO se puede desactivar. Si el
-- enlace se filtra (un correo reenviado, el historial del navegador), lo peor
-- que pasa es que alguien deje de recibir promociones, nunca que lo den de
-- alta sin querer ni que se acceda a la cuenta.
--
-- No devuelve el mail ni el nombre: quien tiene el token ya conoce la casilla
-- porque el correo le llego ahi, y no hay motivo para repetirlo en una URL que
-- puede quedar en un historial compartido.
-- ---------------------------------------------------------------------------
create or replace function public.darse_de_baja(token uuid)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  afectadas integer;
begin
  update public.perfiles
  set acepta_novedades = false,
      novedades_respondido_en = now()
  where token_baja = token;

  get diagnostics afectadas = row_count;
  return afectadas > 0;
end;
$$;

revoke execute on function public.darse_de_baja(uuid) from public;
grant execute on function public.darse_de_baja(uuid) to anon, authenticated;

-- ---------------------------------------------------------------------------
-- Vista de exportacion, ahora con el enlace ya armado.
--
-- El 002 avisaba que al recrear esta vista hay que volver a aplicarle
-- security_invoker y el revoke del 006. Se hace abajo.
-- ---------------------------------------------------------------------------
drop view if exists public.suscriptores_novedades;

create view public.suscriptores_novedades as
  select
    email,
    nombre,
    novedades_respondido_en,
    'https://www.distribuidoracastelli.com/baja?t=' || token_baja as enlace_baja
  from public.perfiles
  where acepta_novedades = true;

-- Sin esto la vista corre con los permisos de quien la creo y saltea las
-- politicas RLS de perfiles, que fue exactamente la fuga que arreglo el 006.
alter view public.suscriptores_novedades set (security_invoker = on);

revoke all on public.suscriptores_novedades from anon, authenticated;

comment on view public.suscriptores_novedades is
  'Lista para exportar a CSV. Solo accesible desde el SQL Editor. Incluye el enlace de baja listo para usar como campo del correo.';
