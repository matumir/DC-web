-- Distribuidora Castelli - que productos se piden en cada consulta del carrito.
--
-- Correr una sola vez desde el SQL Editor, despues del 010. Es idempotente.
--
-- QUE CAMBIA RESPECTO DEL 004
-- El 004 decidio no guardar el contenido de la consulta. Eso sigue valiendo
-- para lo que identifica a una persona: no se guarda el nombre, ni la empresa,
-- ni el texto del mensaje, ni quien la mando. Lo que se suma aca es solo QUE
-- PRODUCTO y CUANTAS UNIDADES se pidieron, sin ninguna forma de saber de quien
-- vino. Es informacion del catalogo, no de la persona.
--
-- Para que sirve: saber que se pide de verdad, no solo que se mira. Un producto
-- muy visitado que nadie consulta y uno poco visitado que se pide de a cincuenta
-- son dos problemas distintos, y hoy no hay forma de distinguirlos.

create table if not exists public.consulta_items (
  id bigint generated always as identity primary key,
  -- El on delete cascade importa: si algun dia se borran consultas viejas por
  -- retencion, sus items se van con ellas y no quedan filas huerfanas.
  consulta_id bigint not null references public.consultas (id) on delete cascade,
  -- Los ids del catalogo ("guantes-42") viven en los archivos del repo, no en
  -- la base. Igual que en favoritos.
  producto_id text not null check (char_length(producto_id) between 1 and 60),
  cantidad integer not null check (cantidad between 1 and 999),
  creado_en timestamptz not null default now()
);

alter table public.consulta_items enable row level security;

-- A proposito NO tiene ninguna politica: ni de lectura ni de escritura. Desde
-- el navegador esta tabla es inalcanzable en las dos direcciones. Se escribe
-- por registrar_consulta_carrito() y se lee por metricas_top_consultados(),
-- las dos security definer.

create index if not exists consulta_items_producto_idx
  on public.consulta_items (producto_id);

create index if not exists consulta_items_creado_idx
  on public.consulta_items (creado_en desc);

-- ---------------------------------------------------------------------------
-- Registrar una consulta del carrito, con sus renglones, en una sola operacion.
--
-- Antes el navegador insertaba en consultas y listo. Ahora hace falta el id de
-- esa fila para colgarle los items, y pedirselo a PostgREST obligaria a abrir
-- un SELECT sobre consultas que hoy no tiene nadie. Con una funcion se resuelve
-- en un viaje y sin aflojar ningun permiso.
--
-- Es atomica: si el freno del 008 corta por exceso de consultas, no queda ni la
-- consulta ni sus items.
-- ---------------------------------------------------------------------------
create or replace function public.registrar_consulta_carrito(items jsonb)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  nueva_id bigint;
  cuantos integer;
begin
  if items is null or jsonb_typeof(items) <> 'array' then
    raise exception 'items tiene que ser un arreglo' using errcode = 'invalid_parameter_value';
  end if;

  cuantos := jsonb_array_length(items);

  -- Un carrito vacio no es una consulta. Y el tope de arriba evita que alguien
  -- mande diez mil renglones en un solo pedido: el freno del 008 cuenta
  -- consultas, no items, asi que sin esto quedaba una puerta abierta.
  if cuantos = 0 or cuantos > 50 then
    raise exception 'cantidad de items fuera de rango' using errcode = 'invalid_parameter_value';
  end if;

  insert into public.consultas (tipo) values ('carrito')
  returning id into nueva_id;

  insert into public.consulta_items (consulta_id, producto_id, cantidad)
  select
    nueva_id,
    left(trim(e ->> 'id'), 60),
    -- Se acota en vez de rechazar: una cantidad rara no deberia hacer perder
    -- toda la consulta, que es el dato que mas importa.
    least(greatest(coalesce((e ->> 'cantidad')::integer, 1), 1), 999)
  from jsonb_array_elements(items) e
  where coalesce(trim(e ->> 'id'), '') <> '';
end;
$$;

revoke execute on function public.registrar_consulta_carrito(jsonb) from public;
grant execute on function public.registrar_consulta_carrito(jsonb) to anon, authenticated;

comment on function public.registrar_consulta_carrito(jsonb) is
  'Guarda una consulta del carrito con sus renglones. No guarda quien la mando.';

-- ---------------------------------------------------------------------------
-- Ranking para el panel.
--
-- Devuelve las dos cosas porque miden distinto: 200 unidades en 2 consultas es
-- un cliente grande, y 200 en 40 consultas es un producto que se pide siempre.
-- ---------------------------------------------------------------------------
create or replace function public.metricas_top_consultados(limite int default 15)
returns table (producto_id text, unidades bigint, consultas bigint)
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
    select i.producto_id, sum(i.cantidad)::bigint, count(distinct i.consulta_id)
    from public.consulta_items i
    group by 1
    order by 2 desc, 3 desc, 1
    limit least(greatest(limite, 1), 50);
end;
$$;

-- Igual que el resto de las metricas: anon ni siquiera puede intentarlo.
revoke execute on function public.metricas_top_consultados(int) from anon;
