-- Distribuidora Castelli - freno de emergencia para la tabla consultas.
--
-- Correr una sola vez desde el SQL Editor, despues del 007. Es idempotente.
--
-- EL PROBLEMA: la politica del 004 es `with check (true)`. Cualquiera con la
-- clave anon (que es publica por diseño) puede insertar filas sin limite. No
-- hay datos personales que filtrar, pero si se puede:
--   1. inflar los numeros del panel hasta volverlos inservibles,
--   2. llenar los 500 MB del plan gratuito.
--
-- POR QUE NO SE EXIGE SESION: el formulario de empresas y el carrito no piden
-- cuenta a proposito. Cerrar la tabla a `authenticated` dejaria de contar
-- justamente las consultas que mas interesan, que son las de gente que todavia
-- no es cliente. El largo de los campos ya esta acotado desde el 004.
--
-- LA SOLUCION: un tope de inserciones por minuto para toda la tabla.
--
-- El tope es global y no por IP porque desde una politica de RLS no se ve la
-- IP del visitante. La contra es que alguien decidido puede dejar sin registrar
-- las consultas de los demas mientras dure la inundacion. Se acepta: lo que se
-- pierde es una metrica, no un pedido. El mensaje de WhatsApp sale igual
-- porque registrarConsulta() no espera la respuesta de Supabase.

-- ---------------------------------------------------------------------------
-- 20 por minuto es varias veces el pico real de un negocio que recibe unas
-- pocas consultas por dia, y aun asi corta cualquier automatizacion.
-- ---------------------------------------------------------------------------
create or replace function public.limitar_consultas()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  recientes integer;
begin
  -- security definer para poder contar: la tabla no tiene politica de SELECT,
  -- asi que el rol anon no puede leerla ni siquiera para esto.
  -- Usa el indice consultas_creado_idx; no recorre la tabla entera.
  select count(*) into recientes
  from public.consultas
  where creado_en > now() - interval '1 minute';

  if recientes >= 20 then
    -- check_violation (23514) hace que PostgREST devuelva 400 y no 500.
    raise exception 'demasiadas consultas en el ultimo minuto'
      using errcode = 'check_violation';
  end if;

  return new;
end;
$$;

-- Higiene: nadie deberia poder llamarla suelta desde la API. Los triggers se
-- disparan igual, no dependen del permiso EXECUTE de quien inserta.
revoke execute on function public.limitar_consultas() from public, anon, authenticated;

drop trigger if exists limitar_consultas_trg on public.consultas;
create trigger limitar_consultas_trg
  before insert on public.consultas
  for each row
  execute function public.limitar_consultas();

comment on function public.limitar_consultas() is
  'Freno de emergencia: corta las inserciones si pasan de 20 en un minuto.';
