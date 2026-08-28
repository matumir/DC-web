import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { IconShieldHalved } from "../components/icons/Icon";
import { useAuth } from "../context/AuthContext";

/**
 * Modal de bienvenida tras iniciar sesion. Pide dos cosas en un solo paso:
 *
 *  - Aceptar Terminos y Politica de Privacidad. Es obligatorio y bloqueante:
 *    guardamos datos personales, asi que sin aceptacion no hay cuenta. Si no
 *    acepta, la unica salida es cerrar sesion; el catalogo, el carrito y las
 *    consultas por WhatsApp siguen funcionando sin cuenta.
 *  - Recibir novedades por mail. Es opcional y arranca DESMARCADO: un
 *    consentimiento premarcado no es consentimiento (Ley 25.326).
 *
 * Van juntos a proposito: encadenar dos modales seguidos seria peor para el
 * usuario, y ademas se guardan en una sola escritura que no puede quedar a
 * medias.
 */
export default function AvisoNovedades() {
  const { debeAceptarTerminos, aceptarTerminos, salir, nombre } = useAuth();
  const [aceptaTerminos, setAceptaTerminos] = useState(false);
  const [novedades, setNovedades] = useState(false);
  const [guardando, setGuardando] = useState(false);
  const [error, setError] = useState(null);

  // Bloquea el scroll del fondo mientras el modal esta abierto.
  useEffect(() => {
    if (!debeAceptarTerminos) return;
    const previo = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = previo;
    };
  }, [debeAceptarTerminos]);

  if (!debeAceptarTerminos) return null;

  async function confirmar() {
    if (!aceptaTerminos) return;
    setGuardando(true);
    setError(null);
    const resultado = await aceptarTerminos({ novedades });
    setGuardando(false);
    if (!resultado?.ok) setError(resultado?.error || "No pudimos guardar tu preferencia.");
  }

  return (
    <div className="modal-novedades-fondo">
      <div
        className="modal-novedades"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-terminos-titulo"
      >
        <div className="modal-novedades-icono">
          <IconShieldHalved />
        </div>

        <h3 id="modal-terminos-titulo">¡Hola{nombre ? `, ${nombre.split(" ")[0]}` : ""}!</h3>
        <p>
          Antes de continuar necesitamos que aceptes nuestras condiciones. Solo te lo pedimos una
          vez.
        </p>

        <label className="modal-novedades-check">
          <input
            type="checkbox"
            checked={aceptaTerminos}
            onChange={(e) => setAceptaTerminos(e.target.checked)}
          />
          <span>
            Leí y acepto los{" "}
            <Link to="/terminos-y-condiciones" target="_blank" rel="noopener noreferrer">
              Términos y Condiciones
            </Link>{" "}
            y la{" "}
            <Link to="/politica-de-privacidad" target="_blank" rel="noopener noreferrer">
              Política de Privacidad
            </Link>
            .
          </span>
        </label>

        <label className="modal-novedades-check modal-novedades-opcional">
          <input
            type="checkbox"
            checked={novedades}
            onChange={(e) => setNovedades(e.target.checked)}
          />
          <span>
            Quiero recibir novedades y promociones por mail <em>(opcional)</em>
          </span>
        </label>

        {error && <p className="modal-novedades-error">{error}</p>}

        <div className="modal-novedades-acciones">
          <button
            className="btn-principal"
            onClick={confirmar}
            disabled={!aceptaTerminos || guardando}
          >
            {guardando ? "Guardando..." : "Acepto y continúo"}
          </button>
          <button className="modal-novedades-omitir" onClick={salir} disabled={guardando}>
            Cancelar y cerrar sesión
          </button>
        </div>

        <small>Podés cambiar lo de las novedades cuando quieras desde tu menú de usuario.</small>
      </div>
    </div>
  );
}
