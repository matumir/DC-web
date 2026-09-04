-- Distribuidora Castelli - dar y quitar acceso al panel de metricas.
--
-- ESTO NO ES UNA MIGRACION: no se corre entero. Son consultas sueltas para
-- copiar al SQL Editor cuando haga falta.
--
-- POR QUE SE HACE A MANO
-- El 006 revoco el UPDATE sobre la columna es_admin: desde el navegador nadie
-- puede tocarla, ni siquiera sobre su propio perfil. Si se pudiera, cualquiera
-- con la clave anon (que es publica) se haria administrador solo. El unico
-- camino es este, con la sesion del dueño del proyecto.
--
-- REQUISITO PREVIO
-- La fila en perfiles se crea cuando la persona entra por primera vez. Si
-- todavia no se registro, el UPDATE no encuentra a quien actualizar y no avisa
-- nada: por eso conviene correr primero el paso 1.


-- ---------------------------------------------------------------------------
-- 1. ¿Existe la cuenta? Si esto no devuelve ninguna fila, la persona todavia
--    no se registro en el sitio. Que entre una vez y volve a intentar.
-- ---------------------------------------------------------------------------
select id, email, nombre, es_admin, creado_en
from public.perfiles
where lower(email) = lower('juanjo.salvay@hotmail.com');


-- ---------------------------------------------------------------------------
-- 2. Darle acceso al panel.
--    El RETURNING es a proposito: si devuelve la fila con es_admin = true,
--    funciono. Si devuelve "0 rows", la cuenta no existe (volve al paso 1).
-- ---------------------------------------------------------------------------
update public.perfiles
set es_admin = true
where lower(email) = lower('juanjo.salvay@hotmail.com')
returning id, email, nombre, es_admin;


-- ---------------------------------------------------------------------------
-- 3. Ver quienes son administradores hoy.
-- ---------------------------------------------------------------------------
select email, nombre, creado_en
from public.perfiles
where es_admin
order by creado_en;


-- ---------------------------------------------------------------------------
-- 4. Quitarle el acceso a alguien.
-- ---------------------------------------------------------------------------
-- update public.perfiles
-- set es_admin = false
-- where lower(email) = lower('mail@ejemplo.com')
-- returning email, es_admin;
