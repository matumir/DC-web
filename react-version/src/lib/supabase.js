import { createClient } from "@supabase/supabase-js";

// Estas dos variables son publicas por diseño: viajan en el bundle y cualquiera
// que abra el sitio las puede leer. La seguridad no depende de ocultarlas sino
// de las politicas RLS de cada tabla (ver supabase/001_perfiles_y_favoritos.sql).
const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Si faltan las variables (build sin configurar, pre-render en CI, un fork del
// repo) devolvemos null en vez de reventar al arrancar. Toda la app tiene que
// seguir funcionando sin login: catalogo, carrito y WhatsApp son lo que vende.
export const supabase =
  url && anonKey
    ? createClient(url, anonKey, {
        auth: {
          persistSession: true,
          autoRefreshToken: true,
          detectSessionInUrl: true,
          // Explicito en vez de depender del default de la libreria, que
          // cambio entre versiones de supabase-js.
          flowType: "pkce",
        },
      })
    : null;

export const authDisponible = Boolean(supabase);
