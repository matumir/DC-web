-- Distribuidora Castelli - exportar la lista de novedades.
--
-- ESTO NO ES UNA MIGRACION: son consultas sueltas para el SQL Editor.
--
-- Solo se le escribe a quien tiene acepta_novedades = true. La vista ya filtra
-- por eso, asi que alcanza con exportarla tal cual.


-- ---------------------------------------------------------------------------
-- 1. Cuantos son.
-- ---------------------------------------------------------------------------
select
  count(*) filter (where acepta_novedades)                as suscriptores,
  count(*) filter (where novedades_respondido_en is null) as sin_responder,
  count(*)                                                as total
from public.perfiles;


-- ---------------------------------------------------------------------------
-- 2. La lista para exportar a CSV (boton "Download CSV" del SQL Editor).
--
--    enlace_baja es la columna que hay que mapear al campo de baja del
--    proveedor de newsletter. Si el correo sale sin ese enlace, se incumple la
--    politica de privacidad del sitio.
-- ---------------------------------------------------------------------------
select email, nombre, enlace_baja
from public.suscriptores_novedades
order by novedades_respondido_en;


-- ---------------------------------------------------------------------------
-- 3. Quienes se dieron de baja, por si hay que sacarlos a mano del proveedor.
--    Mientras la sincronizacion sea manual, esta es la lista de bajas nuevas:
--    correr antes de cada envio y quitarlas en el panel del proveedor.
-- ---------------------------------------------------------------------------
select email, nombre, novedades_respondido_en as se_dio_de_baja
from public.perfiles
where not acepta_novedades
  and novedades_respondido_en is not null
order by novedades_respondido_en desc;


-- ---------------------------------------------------------------------------
-- 4. Dar de baja a alguien a mano, si escribe pidiendolo.
-- ---------------------------------------------------------------------------
-- update public.perfiles
-- set acepta_novedades = false, novedades_respondido_en = now()
-- where lower(email) = lower('mail@ejemplo.com')
-- returning email, acepta_novedades;
