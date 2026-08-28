-- Distribuidora Castelli - aceptacion de terminos y politica de privacidad.
--
-- Correr una sola vez desde el SQL Editor de Supabase, despues del 002.
-- Es idempotente.
--
-- Se guarda la VERSION aceptada, no solo un booleano: el dia que cambien los
-- terminos de forma sustancial, subir VERSION_TERMINOS en src/data/legal.js
-- hace que el modal vuelva a aparecer y quede constancia de que acepto la
-- version nueva. Con un simple true/false eso seria imposible de demostrar.
alter table public.perfiles
  add column if not exists terminos_version text,
  add column if not exists terminos_aceptados_en timestamptz;

comment on column public.perfiles.terminos_version is
  'Version de los Terminos y la Politica de Privacidad que acepto el usuario.';

comment on column public.perfiles.terminos_aceptados_en is
  'Cuando los acepto. NULL = todavia no acepto ninguna version.';
