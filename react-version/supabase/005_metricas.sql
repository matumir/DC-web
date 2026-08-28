-- Distribuidora Castelli - metricas para el panel.
--
-- Correr una sola vez desde el SQL Editor, despues del 004. Es idempotente.
--
-- COMO SE PROTEGE ESTO
-- El panel corre en el navegador con la clave anon, que es publica. Por eso no
-- se abren las tablas: se exponen funciones security definer que devuelven
-- SOLO NUMEROS AGREGADOS y que verifican que quien llama sea administrador.
-- Aunque alguien descubra la URL del panel y llame a las funciones a mano, lo
-- peor que obtiene son totales; la lista de mails sigue siendo inalcanzable
-- desde el navegador.

-- ---------------------------------------------------------------------------
-- Quien es administrador
-- ---------------------------------------------------------------------------
alter table public.perfiles
  add column if not exists es_admin boolean not null default false;

comment on column public.perfiles.es_admin is
  'Solo se activa a mano desde el panel de Supabase. Habilita /panel.';

create or replace function public.es_admin()
returns boolean
language sql
security definer
stable
set search_path = public
as $$
  select coalesce((select p.es_admin from public.perfiles p where p.id = auth.uid()), false);
$$;

-- ---------------------------------------------------------------------------
-- Tarjetas del encabezado
-- ---------------------------------------------------------------------------
create or replace function public.metricas_resumen()
returns table (
  registros bigint,
  suscriptores bigint,
  favoritos bigint,
  activos_30d bigint,
  consultas_30d bigint
)
language plpgsql
security definer
stable
set search_path = public
as $$
begin
  if not public.es_admin() then
    raise exception 'Acceso denegado';
  end if;

  return query
    select
      (select count(*) from public.perfiles),
      (select count(*) from public.perfiles where acepta_novedades),
      (select count(*) from public.favoritos),
      (select count(*) from auth.users where last_sign_in_at > now() - interval '30 days'),
      (select count(*) from public.consultas where creado_en > now() - interval '30 days');
end;
$$;

-- ---------------------------------------------------------------------------
-- Series por mes (ultimos 12)
-- ---------------------------------------------------------------------------
create or replace function public.metricas_registros_por_mes()
returns table (mes date, cantidad bigint)
language plpgsql
security definer
stable
set search_path = public
as $$
begin
  if not public.es_admin() then
    raise exception 'Acceso denegado';
  end if;

  return query
    select date_trunc('month', creado_en)::date, count(*)
    from public.perfiles
    where creado_en > now() - interval '12 months'
    group by 1
    order by 1;
end;
$$;

create or replace function public.metricas_consultas_por_mes()
returns table (mes date, cantidad bigint)
language plpgsql
security definer
stable
set search_path = public
as $$
begin
  if not public.es_admin() then
    raise exception 'Acceso denegado';
  end if;

  return query
    select date_trunc('month', creado_en)::date, count(*)
    from public.consultas
    where creado_en > now() - interval '12 months'
    group by 1
    order by 1;
end;
$$;

-- ---------------------------------------------------------------------------
-- Rankings
-- ---------------------------------------------------------------------------
-- Devuelve el id del producto ("guantes-42"): el catalogo vive en los archivos
-- del repo, no en la base, asi que el nombre lo resuelve el front.
create or replace function public.metricas_top_favoritos(limite int default 15)
returns table (producto_id text, cantidad bigint)
language plpgsql
security definer
stable
set search_path = public
as $$
begin
  if not public.es_admin() then
    raise exception 'Acceso denegado';
  end if;

  return query
    select f.producto_id, count(*)
    from public.favoritos f
    group by 1
    order by 2 desc, 1
    limit least(greatest(limite, 1), 50);
end;
$$;

create or replace function public.metricas_consultas_por_provincia()
returns table (provincia text, cantidad bigint)
language plpgsql
security definer
stable
set search_path = public
as $$
begin
  if not public.es_admin() then
    raise exception 'Acceso denegado';
  end if;

  return query
    select coalesce(c.provincia, 'Sin especificar'), count(*)
    from public.consultas c
    group by 1
    order by 2 desc
    limit 25;
end;
$$;

-- ---------------------------------------------------------------------------
-- Para activarte como administrador, reemplaza el mail y ejecuta:
--
--   update public.perfiles set es_admin = true
--   where email = 'tu-mail@gmail.com';
-- ---------------------------------------------------------------------------
