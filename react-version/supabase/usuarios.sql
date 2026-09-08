-- Distribuidora Castelli - consultar los usuarios registrados.
--
-- ESTO NO ES UNA MIGRACION: son consultas sueltas para el SQL Editor.
--
-- Los correos no se pueden leer desde el navegador y eso es a proposito: el
-- 006 le quito el acceso a los roles anon y authenticated, y el 009 rehizo los
-- permisos columna por columna. La clave anon es publica, asi que cualquier
-- cosa que el navegador pueda leer la puede leer cualquiera.
--
-- Para MANDAR novedades no uses estas consultas: hay que escribirle solo a
-- quien dio el consentimiento. Eso esta en novedades.sql.


-- ---------------------------------------------------------------------------
-- 1. Todos los registrados, del mas nuevo al mas viejo.
--    El boton "Download CSV" del SQL Editor baja el resultado.
-- ---------------------------------------------------------------------------
select
  email,
  nombre,
  telefono,
  acepta_novedades,
  creado_en
from public.perfiles
order by creado_en desc;


-- ---------------------------------------------------------------------------
-- 2. Un resumen rapido.
-- ---------------------------------------------------------------------------
select
  count(*)                                                 as registrados,
  count(*) filter (where acepta_novedades)                 as aceptan_novedades,
  count(*) filter (where telefono is not null)             as con_telefono,
  count(*) filter (where es_admin)                         as administradores,
  count(*) filter (where creado_en > now() - interval '30 days') as ultimos_30_dias
from public.perfiles;


-- ---------------------------------------------------------------------------
-- 3. Como se registro cada uno y si confirmo el correo.
--
--    auth.users es la tabla de Supabase; perfiles es la nuestra, que se llena
--    con un trigger. email_confirmed_at en NULL significa que se registro con
--    correo y contraseña pero nunca abrio el enlace de confirmacion.
-- ---------------------------------------------------------------------------
select
  p.email,
  p.nombre,
  u.raw_app_meta_data ->> 'provider' as metodo,
  u.email_confirmed_at,
  u.last_sign_in_at,
  p.creado_en
from public.perfiles p
join auth.users u on u.id = p.id
order by p.creado_en desc;


-- ---------------------------------------------------------------------------
-- 4. Control: cuentas sin perfil.
--
--    Tiene que devolver cero filas. Si devuelve alguna, el trigger crear_perfil
--    fallo en ese alta y esa persona no aparece en el panel ni en la lista de
--    novedades. Paso una vez: el trigger original solo leia los datos que manda
--    Google y el 007 lo corrigio para el alta con correo.
-- ---------------------------------------------------------------------------
select u.id, u.email, u.created_at
from auth.users u
left join public.perfiles p on p.id = u.id
where p.id is null
order by u.created_at desc;
