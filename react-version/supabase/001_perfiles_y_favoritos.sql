-- Distribuidora Castelli - esquema inicial de cuentas y favoritos.
--
-- Correr una sola vez desde el SQL Editor de Supabase.
-- Es idempotente: si lo corres dos veces no rompe nada.
--
-- IMPORTANTE: la clave anon viaja en el bundle del sitio y es publica. Toda la
-- seguridad depende de las politicas RLS de abajo. Si en el futuro agregas una
-- tabla, activale RLS SIEMPRE, aunque parezca que no tiene datos sensibles.

-- ---------------------------------------------------------------------------
-- PERFILES: una fila por usuario registrado.
-- Guarda el consentimiento explicito para novedades, que es lo que habilita
-- mandarle mails promocionales (loguearse con Google NO es consentimiento).
-- ---------------------------------------------------------------------------
create table if not exists public.perfiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  nombre text,
  avatar_url text,
  acepta_novedades boolean not null default false,
  creado_en timestamptz not null default now()
);

alter table public.perfiles enable row level security;

drop policy if exists "perfiles: cada uno ve el suyo" on public.perfiles;
create policy "perfiles: cada uno ve el suyo"
  on public.perfiles for select
  using (auth.uid() = id);

drop policy if exists "perfiles: cada uno edita el suyo" on public.perfiles;
create policy "perfiles: cada uno edita el suyo"
  on public.perfiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- No hace falta politica de INSERT: el alta la hace el trigger de abajo, que
-- corre como security definer y por lo tanto saltea RLS.

-- ---------------------------------------------------------------------------
-- Alta automatica del perfil al registrarse.
-- Google manda el nombre y la foto dentro de raw_user_meta_data.
-- ---------------------------------------------------------------------------
create or replace function public.crear_perfil()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.perfiles (id, email, nombre, avatar_url)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name'),
    coalesce(new.raw_user_meta_data ->> 'avatar_url', new.raw_user_meta_data ->> 'picture')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists al_crear_usuario on auth.users;
create trigger al_crear_usuario
  after insert on auth.users
  for each row
  execute function public.crear_perfil();

-- ---------------------------------------------------------------------------
-- FAVORITOS.
-- producto_id es text porque los ids del catalogo son del tipo "guantes-42",
-- y viven en los archivos JS del repo, no en la base.
-- ---------------------------------------------------------------------------
create table if not exists public.favoritos (
  id bigint generated always as identity primary key,
  usuario_id uuid not null references auth.users (id) on delete cascade,
  producto_id text not null,
  creado_en timestamptz not null default now(),
  unique (usuario_id, producto_id)
);

alter table public.favoritos enable row level security;

drop policy if exists "favoritos: cada uno ve los suyos" on public.favoritos;
create policy "favoritos: cada uno ve los suyos"
  on public.favoritos for select
  using (auth.uid() = usuario_id);

drop policy if exists "favoritos: cada uno agrega los suyos" on public.favoritos;
create policy "favoritos: cada uno agrega los suyos"
  on public.favoritos for insert
  with check (auth.uid() = usuario_id);

drop policy if exists "favoritos: cada uno borra los suyos" on public.favoritos;
create policy "favoritos: cada uno borra los suyos"
  on public.favoritos for delete
  using (auth.uid() = usuario_id);

create index if not exists favoritos_usuario_idx on public.favoritos (usuario_id);
