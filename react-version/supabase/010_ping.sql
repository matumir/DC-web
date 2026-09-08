-- Distribuidora Castelli - endpoint de vida para el keep-alive.
--
-- Correr una sola vez desde el SQL Editor, despues del 009. Es idempotente.
--
-- QUE PASO
-- El workflow keepalive.yml consultaba la tabla perfiles con la clave anon.
-- El 009 le quito el SELECT sobre perfiles a anon (para que el token_baja no
-- se pudiera leer desde el navegador) y el ping empezo a recibir 401.
--
-- POR QUE UNA FUNCION Y NO OTRA TABLA
-- Apuntar el ping a favoritos o consultas lo arreglaria hoy y lo volveria a
-- romper el dia que a esas tablas se les ajusten los permisos. El keep-alive no
-- deberia depender de los permisos de ninguna tabla: lo unico que necesita es
-- demostrar que la base contesta.
--
-- No devuelve nada del contenido de la base, asi que exponerla a anon no filtra
-- absolutamente nada aunque alguien la descubra.

create or replace function public.ping()
returns text
language sql
stable
as $$
  select 'ok';
$$;

comment on function public.ping() is
  'Solo para el keep-alive de GitHub Actions. No lee datos: devuelve una constante.';

revoke execute on function public.ping() from public;
grant execute on function public.ping() to anon, authenticated;
