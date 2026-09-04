-- Distribuidora Castelli - registro con mail y contraseña.
--
-- Correr una sola vez desde el SQL Editor, despues del 006. Es idempotente.

-- El telefono es un dato del perfil, NO un metodo de acceso. El login por
-- telefono de Supabase manda un SMS por cada intento y eso lo cobra un
-- proveedor externo; aca solo queremos el dato para poder contactar al cliente.
alter table public.perfiles
  add column if not exists telefono text;

alter table public.perfiles
  drop constraint if exists perfiles_telefono_largo;

alter table public.perfiles
  add constraint perfiles_telefono_largo
  check (telefono is null or char_length(telefono) <= 30);

comment on column public.perfiles.telefono is
  'Opcional, cargado por el usuario al registrarse. No se usa para autenticar.';

-- El usuario tiene que poder editar su propio telefono desde el sitio. El 006
-- limito el UPDATE a las columnas de consentimiento, asi que hay que sumarla.
grant update (telefono) on public.perfiles to authenticated;

-- ---------------------------------------------------------------------------
-- El trigger leia solo lo que manda Google (full_name, avatar_url). En el alta
-- por mail esos campos no existen: los mandamos nosotros en options.data del
-- signUp, y quedan tambien en raw_user_meta_data.
-- Sin esto, todos los registrados por mail quedarian sin nombre en el panel.
-- ---------------------------------------------------------------------------
create or replace function public.crear_perfil()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.perfiles (id, email, nombre, avatar_url, telefono)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name'),
    coalesce(new.raw_user_meta_data ->> 'avatar_url', new.raw_user_meta_data ->> 'picture'),
    nullif(trim(new.raw_user_meta_data ->> 'telefono'), '')
  )
  on conflict (id) do nothing;
  return new;
end;
$$;
