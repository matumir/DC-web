import { useEffect, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { supabase } from "../../lib/supabase";
import { useDocumentMeta } from "../../hooks/useDocumentMeta";

/**
 * Adonde lleva el enlace de baja de los correos de novedades.
 *
 * Se da de baja sola al abrirse, sin pedir confirmacion ni sesion: quien hizo
 * clic en "no quiero recibir mas" ya expreso lo que queria, y ponerle un boton
 * mas en el medio es la friccion que la ley justamente no permite.
 *
 * Volver a suscribirse si se hace desde la cuenta, porque eso si necesita que
 * la persona demuestre que es ella.
 */
export default function BajaPage() {
  const [params] = useSearchParams();
  const token = params.get("t");

  const [estado, setEstado] = useState("procesando");
  // En desarrollo React monta dos veces; sin esto la baja se dispara doble.
  const yaCorrio = useRef(false);

  useDocumentMeta({ titulo: "Baja de novedades" });

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (yaCorrio.current) return;
    yaCorrio.current = true;

    if (!token) {
      setEstado("sin-token");
      return;
    }
    if (!supabase) {
      setEstado("error");
      return;
    }

    supabase
      .rpc("darse_de_baja", { token })
      .then(({ data, error }) => {
        if (error) {
          console.warn("[baja] no se pudo procesar:", error.message);
          setEstado("error");
          return;
        }
        // false = el token no corresponde a ningun perfil. Puede ser un enlace
        // viejo de una cuenta borrada, o una URL cortada al copiarla.
        setEstado(data ? "listo" : "sin-token");
      });
  }, [token]);

  return (
    <section className="auth-pagina">
      <div className="auth-caja">
        <div className="auth-form">
          {estado === "procesando" && (
            <>
              <h2 className="auth-titulo">Un momento</h2>
              <p className="auth-subtitulo">Estamos procesando tu baja.</p>
            </>
          )}

          {estado === "listo" && (
            <>
              <h2 className="auth-titulo">Listo, te diste de baja</h2>
              <p className="auth-subtitulo">
                No vas a recibir más correos con novedades ni promociones. Los correos de tu
                cuenta, como el de recuperar la contraseña, se siguen enviando.
              </p>
              <p className="auth-ayuda" style={{ textAlign: "center" }}>
                ¿Te arrepentiste? Podés volver a activarlas cuando quieras desde tu menú de
                usuario.
              </p>
              <Link className="btn-principal auth-enviar" to="/">
                Volver al inicio
              </Link>
            </>
          )}

          {estado === "sin-token" && (
            <>
              <h2 className="auth-titulo">Este enlace no es válido</h2>
              <p className="auth-subtitulo">
                Puede que se haya cortado al copiarlo, o que corresponda a una cuenta que ya no
                existe. Si tenés cuenta, podés darte de baja desde tu menú de usuario.
              </p>
              <Link className="btn-principal auth-enviar" to="/">
                Ir al inicio
              </Link>
            </>
          )}

          {estado === "error" && (
            <>
              <h2 className="auth-titulo">No pudimos procesar la baja</h2>
              <p className="auth-subtitulo">
                Hubo un problema de conexión. Volvé a abrir el enlace en unos minutos. Si sigue
                fallando, escribinos y te damos de baja a mano.
              </p>
              <Link className="btn-principal auth-enviar" to="/">
                Ir al inicio
              </Link>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
