-- Distribuidora Castelli - correcciones de seguridad.
--
-- CORRER ANTES DEL PROXIMO DEPLOY. Arregla dos agujeros reales introducidos
-- en migraciones anteriores. Es idempotente.

-- ===========================================================================
-- 1) FUGA DE MAILS POR LA VISTA suscriptores_novedades
--
-- En Postgres una vista se ejecuta con los permisos de QUIEN LA CREO, no de
-- quien la consulta. Por eso la vista salteaba las politicas de perfiles y
-- devolvia los mails de todos los suscriptores a cualquiera que usara la clave
-- anon, que es publica y viaja en el bundle del sitio.
--
-- Se arregla por dos caminos a la vez:
--   a) security_invoker: la vista pasa a evaluarse con los permisos de quien
--      consulta, asi que RLS vuelve a aplicar.
--   b) revoke: ademas se le quita el acceso a los roles del navegador. La
--      vista es para el panel de Supabase y para vos, no para el sitio.
-- ===========================================================================
alter view public.suscriptores_novedades set (security_invoker = on);

revoke all on public.suscriptores_novedades from anon, authenticated;

-- ===========================================================================
-- 2) ESCALADA DE PRIVILEGIOS A ADMINISTRADOR
--
-- La politica de UPDATE de perfiles permite editar la propia fila, pero RLS no
-- distingue columnas: cualquier usuario logueado podia hacer
--
--     supabase.from('perfiles').update({ es_admin: true })
--
-- y habilitarse el panel. Se limita con permisos por columna, que es la
-- herramienta correcta para esto: la politica sigue diciendo "solo tu fila" y
-- el grant agrega "y solo estas columnas".
-- ===========================================================================
revoke update on public.perfiles from anon, authenticated;

grant update (
  acepta_novedades,
  novedades_respondido_en,
  terminos_version,
  terminos_aceptados_en
) on public.perfiles to authenticated;

-- es_admin, email, nombre, avatar_url e id quedan fuera: solo se cambian desde
-- el panel de Supabase.

-- ===========================================================================
-- 3) LIMITES EN LO QUE SE PUEDE ESCRIBIR
--
-- producto_id era text sin tope: alguien podia insertar cadenas enormes y
-- llenar la base (el plan gratuito tiene 500 MB). Los ids reales son del tipo
-- "guantes-42", 40 caracteres sobran.
-- ===========================================================================
alter table public.favoritos
  drop constraint if exists favoritos_producto_id_largo;

alter table public.favoritos
  add constraint favoritos_producto_id_largo
  check (char_length(producto_id) <= 40);

-- ===========================================================================
-- 4) FUNCIONES DE METRICAS: QUE NO LAS PUEDA LLAMAR CUALQUIERA
--
-- Ya validan es_admin() adentro, asi que un anonimo solo recibia "Acceso
-- denegado". Igual se les quita el permiso de ejecucion: menos superficie
-- expuesta y menos consultas inutiles contra la base.
-- ===========================================================================
revoke execute on function public.metricas_resumen() from anon;
revoke execute on function public.metricas_registros_por_mes() from anon;
revoke execute on function public.metricas_consultas_por_mes() from anon;
revoke execute on function public.metricas_top_favoritos(int) from anon;
revoke execute on function public.metricas_consultas_por_provincia() from anon;
revoke execute on function public.es_admin() from anon;

-- ===========================================================================
-- 5) VERIFICACION
--
-- Despues de correr esto, desde una terminal, con la clave anon:
--
--   curl -H "apikey: <anon>" \
--     "https://<proyecto>.supabase.co/rest/v1/suscriptores_novedades?select=*"
--
-- Tiene que devolver un error de permisos o una lista vacia, NUNCA mails.
-- ===========================================================================
