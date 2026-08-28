import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { IconChart, IconGoogle, IconHeartSolid, IconLogout, IconUser } from "../components/icons/Icon";
import { useFavoritos } from "../context/FavoritosContext";
import { useAuth } from "../context/AuthContext";

export default function UserMenu() {
  const { usuario, nombre, avatar, email, cargando, disponible, errorLogin, descartarError, entrarConGoogle, salir, aceptaNovedades, responderNovedades, esAdmin } =
    useAuth();
  const { cantidad } = useFavoritos();
  const [abierto, setAbierto] = useState(false);
  const contenedorRef = useRef(null);

  // Cierra el desplegable al hacer click afuera o con Escape.
  useEffect(() => {
    if (!abierto) return;
    const fueraClick = (e) => {
      if (!contenedorRef.current?.contains(e.target)) setAbierto(false);
    };
    const escape = (e) => e.key === "Escape" && setAbierto(false);
    document.addEventListener("mousedown", fueraClick);
    document.addEventListener("keydown", escape);
    return () => {
      document.removeEventListener("mousedown", fueraClick);
      document.removeEventListener("keydown", escape);
    };
  }, [abierto]);

  // Durante el pre-render y el primer instante no sabemos si hay sesion:
  // reservamos el espacio para que no salte el layout al resolverse.
  if (cargando) return <div className="user-menu user-menu-cargando" aria-hidden />;

  // Supabase sin configurar o sin responder: el resto del sitio sigue igual.
  if (!disponible) return null;

  if (!usuario) {
    return (
      <div className="user-menu">
        <button className="btn-login" onClick={entrarConGoogle}>
          <IconGoogle />
          <span>Iniciar sesión</span>
        </button>

        {errorLogin && (
          <div className="login-error" role="alert">
            <p>No pudimos iniciar sesión.</p>
            <span>{errorLogin}</span>
            <button onClick={descartarError}>Entendido</button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="user-menu" ref={contenedorRef}>
      <button
        className="user-boton"
        onClick={() => setAbierto((v) => !v)}
        aria-expanded={abierto}
        aria-haspopup="menu"
      >
        {avatar ? (
          <img src={avatar} alt="" referrerPolicy="no-referrer" />
        ) : (
          <IconUser className="user-avatar-fallback" />
        )}
        <span className="user-nombre">{nombre}</span>
      </button>

      {abierto && (
        <div className="user-desplegable" role="menu">
          <div className="user-datos">
            <strong>{nombre}</strong>
            <span>{email}</span>
          </div>
          {/* Solo decide si se ve el acceso: el permiso real lo valida la base. */}
          {esAdmin && (
            <Link
              className="user-item user-item-admin"
              to="/panel"
              onClick={() => setAbierto(false)}
              role="menuitem"
            >
              <IconChart /> Panel de métricas
            </Link>
          )}

          <Link className="user-item" to="/favoritos" onClick={() => setAbierto(false)} role="menuitem">
            <IconHeartSolid /> Mis favoritos
            {cantidad > 0 && <span className="user-item-contador">{cantidad}</span>}
          </Link>
          {/* Poder revocar el consentimiento es tan obligatorio como pedirlo. */}
          <label className="user-novedades">
            <input
              type="checkbox"
              checked={aceptaNovedades}
              onChange={(e) => responderNovedades(e.target.checked)}
            />
            <span>Recibir novedades por mail</span>
          </label>

          <button className="user-salir" onClick={salir} role="menuitem">
            <IconLogout /> Cerrar sesión
          </button>
        </div>
      )}
    </div>
  );
}
