-- Distribuidora Castelli - el keep-alive pasa a tocar una tabla de verdad.
--
-- Correr una sola vez desde el SQL Editor, despues del 011. Es idempotente.
--
-- QUE PASO
-- Con el 010 el keep-alive respondia "ok" cada dos dias sin fallar, y aun asi
-- Supabase seguia pausando el proyecto. El ping() del 010 hacia
-- `select 'ok'`: una constante que no lee ni escribe ninguna tabla. Supabase
-- decide la pausa por la "actividad de usuario sobre la base" de la ultima
-- semana, y una consulta que no toca datos muy probablemente no cuenta.
-- Ademas, cada dos dias son unas tres por semana; Supabase habla de "unas
-- pocas por dia".
--
-- QUE CAMBIA
-- ping() conserva el nombre y la firma, asi el workflow no cambia de URL, pero
-- ahora actualiza una fila en una tabla propia: una lectura y una escritura
-- reales en cada llamada. El workflow pasa ademas a correr cada 6 horas.
--
-- POR QUE UNA TABLA PROPIA
-- Mismo criterio que el 010: el keep-alive no tiene que depender de los
-- permisos de las tablas del sitio. La funcion es security definer, asi que
-- anon puede llamarla sin tener ningun permiso sobre la tabla.
--
-- Devuelve "ok N" (N = pings acumulados) en vez de "ok": el workflow avisa si
-- recibe el "ok" a secas, que significa que este archivo no se corrio.

create table if not exists public.keepalive (
  -- Una sola fila, siempre la 1.
  id smallint primary key default 1 check (id = 1),
  ultimo_ping timestamptz not null default now(),
  pings bigint not null default 0
);

alter table public.keepalive enable row level security;

-- Sin politicas a proposito: desde el navegador no se lee ni se escribe. Lo
-- unico que la toca es ping(), que corre con los permisos del duenio.
revoke all on public.keepalive from anon, authenticated;

insert into public.keepalive (id) values (1) on conflict (id) do nothing;

-- El 010 la creo como `language sql stable`; create or replace la reemplaza
-- sin borrar los grants. Volatile porque ahora escribe.
create or replace function public.ping()
returns text
language plpgsql
volatile
security definer
set search_path = public
as $$
declare
  total bigint;
begin
  update public.keepalive
     set ultimo_ping = now(),
         pings = pings + 1
   where id = 1
  returning pings into total;

  return 'ok ' || coalesce(total, 0);
end;
$$;

comment on function public.ping() is
  'Solo para el keep-alive de GitHub Actions. Actualiza public.keepalive para que la base registre actividad real.';

revoke execute on function public.ping() from public;
grant execute on function public.ping() to anon, authenticated;
