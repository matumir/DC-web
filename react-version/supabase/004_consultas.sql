-- Distribuidora Castelli - registro de consultas para analitica.
--
-- Correr una sola vez desde el SQL Editor, despues del 003. Es idempotente.
--
-- DECISION IMPORTANTE: aca NO se guarda el contenido del mensaje, ni el nombre
-- del remitente, ni la empresa. Solo el tipo de consulta, la provincia y el
-- motivo. Con eso alcanza para responder "cuantas consultas llegaron y de
-- donde", que es lo que se quiere medir, sin convertir esta tabla en una base
-- de datos personales que haya que proteger, informar y saber borrar.
-- El mensaje sigue viajando por WhatsApp, como hasta ahora.

create table if not exists public.consultas (
  id bigint generated always as identity primary key,
  tipo text not null check (tipo in ('empresa', 'carrito')),
  provincia text check (char_length(provincia) <= 60),
  motivo text check (char_length(motivo) <= 60),
  creado_en timestamptz not null default now()
);

alter table public.consultas enable row level security;

-- Insertar: cualquiera, con sesion o sin ella, porque el formulario no exige
-- cuenta. Es un endpoint abierto y hay que asumirlo: los CHECK de largo y el
-- tipo acotado limitan lo que se puede meter, y no hay datos personales que
-- filtrar aunque alguien lo llene de basura.
drop policy if exists "consultas: cualquiera puede registrar" on public.consultas;
create policy "consultas: cualquiera puede registrar"
  on public.consultas for insert
  with check (true);

-- A proposito NO hay politica de SELECT: desde el navegador nadie puede leer
-- esta tabla, ni siquiera quien la escribio. Los totales salen por las
-- funciones agregadas del 005.

create index if not exists consultas_creado_idx on public.consultas (creado_en desc);
