import { supabase } from "./supabase";

/**
 * Deja constancia de que llego una consulta, para poder contarlas despues.
 *
 * Guarda solo tipo, provincia y motivo: ni nombre, ni empresa, ni el texto del
 * mensaje. Ese contenido sigue viajando unicamente por WhatsApp.
 *
 * No devuelve nada ni se espera: si Supabase esta caido o pausado, la consulta
 * tiene que salir igual. Perder una metrica es aceptable; perder un pedido no.
 */
export function registrarConsulta({ tipo, provincia = null, motivo = null }) {
  if (!supabase) return;

  supabase
    .from("consultas")
    .insert({ tipo, provincia, motivo })
    .then(({ error }) => {
      if (error) console.warn("[consultas] no se pudo registrar:", error.message);
    });
}
