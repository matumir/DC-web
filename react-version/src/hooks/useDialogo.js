import { useEffect } from "react";

/**
 * Comportamiento comun de un modal: cerrar con Escape, bloquear el scroll del
 * fondo y meter el foco adentro.
 *
 * Lo del foco no es un detalle: si se queda afuera, quien navega con teclado
 * sigue tabulando por el catalogo que hay detras del modal sin darse cuenta.
 *
 * Guarda y repone el overflow anterior en vez de asumir que era "": si algun
 * dia se abren dos modales encadenados, el de adentro no le deja la pagina
 * trabada al de afuera.
 */
export function useDialogo({ abierto, onCerrar, cajaRef }) {
  useEffect(() => {
    if (!abierto) return;

    const previo = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const alTeclear = (e) => {
      if (e.key === "Escape") onCerrar();
    };
    document.addEventListener("keydown", alTeclear);

    cajaRef.current?.focus();

    return () => {
      document.body.style.overflow = previo;
      document.removeEventListener("keydown", alTeclear);
    };
  }, [abierto, onCerrar, cajaRef]);
}
