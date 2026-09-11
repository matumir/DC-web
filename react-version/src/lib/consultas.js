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

/**
 * Igual que la anterior, pero para el carrito: ademas de la consulta guarda
 * que productos y cuantas unidades se pidieron.
 *
 * Va por una funcion de la base y no por un insert directo porque hacen falta
 * dos tablas ligadas por el id de la consulta, y ese id no se puede leer desde
 * el navegador. La funcion resuelve las dos en un viaje.
 *
 * Sigue sin guardarse quien la mando.
 */
export function registrarConsultaCarrito(carrito) {
  if (!supabase) return;

  // La base acota a 50 renglones; se recorta antes para no provocar un error
  // entero por un carrito enorme y perder la consulta completa.
  const items = (carrito || [])
    .filter((p) => p?.id)
    .slice(0, 50)
    .map((p) => ({ id: p.id, cantidad: p.cantidad }));

  if (items.length === 0) return;

  supabase.rpc("registrar_consulta_carrito", { items }).then(({ error }) => {
    if (error) console.warn("[consultas] no se pudo registrar el carrito:", error.message);
  });
}
