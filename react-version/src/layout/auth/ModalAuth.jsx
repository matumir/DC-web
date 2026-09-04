import { useEffect, useRef } from "react";
import FormularioAuth from "./FormularioAuth";

/**
 * Envoltorio del formulario para usarlo sin sacar al usuario de donde estaba.
 * La misma pieza vive tambien en /ingresar, que es adonde apuntan los enlaces
 * de los correos y adonde llega quien entra directo por URL.
 */
export default function ModalAuth({ abierto, onCerrar }) {
  const cajaRef = useRef(null);

  useEffect(() => {
    if (!abierto) return;

    const previo = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const alTeclear = (e) => {
      if (e.key === "Escape") onCerrar();
    };
    document.addEventListener("keydown", alTeclear);

    // El foco entra al modal: si se queda atras, quien usa teclado sigue
    // tabulando por el catalogo que hay detras sin darse cuenta.
    cajaRef.current?.focus();

    return () => {
      document.body.style.overflow = previo;
      document.removeEventListener("keydown", alTeclear);
    };
  }, [abierto, onCerrar]);

  if (!abierto) return null;

  return (
    <div className="auth-modal-fondo" onClick={onCerrar}>
      <div
        className="auth-modal"
        role="dialog"
        aria-modal="true"
        aria-label="Iniciar sesión o crear cuenta"
        tabIndex={-1}
        ref={cajaRef}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="auth-modal-cerrar" onClick={onCerrar} aria-label="Cerrar">
          ×
        </button>
        <FormularioAuth onListo={onCerrar} />
      </div>
    </div>
  );
}
