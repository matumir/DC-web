import { Link } from "react-router-dom";
import { IconLock, IconLogout, IconUser } from "../components/icons/Icon";
import { useAuth } from "../context/AuthContext";
import { useFavoritos } from "../context/FavoritosContext";

export default function MobileMenu({ open, onClose }) {
  const { usuario, nombre, avatar, email, disponible, errorLogin, salir, esAdmin, abrirModalAuth, abrirModalContrasena, tieneContrasena } =
    useAuth();
  const { cantidad } = useFavoritos();

  return (
    <nav className={`menu-mobile${open ? " activo" : ""}`} id="menuMobile">
      <button className="menu-cerrar" id="cerrarMenuMobile" onClick={onClose}>
        <img src="/imagenes/logos/close.webp" loading="lazy" decoding="async" alt="Cerrar" />
      </button>

      <Link className="menu-link" data-target="inicio" to="/" onClick={onClose}>
        Inicio
      </Link>
      <Link className="menu-link" data-target="productos" to="/productos" onClick={onClose}>
        Productos
      </Link>
      <Link className="menu-link" data-target="nosotros" to="/nosotros" onClick={onClose}>
        Nosotros
      </Link>
      <Link className="menu-link" data-target="empresas" to="/empresas" onClick={onClose}>
        Empresas
      </Link>
      <Link className="menu-link" data-target="favoritos" to="/favoritos" onClick={onClose}>
        Favoritos{cantidad > 0 ? ` (${cantidad})` : ""}
      </Link>
      {esAdmin && (
        <Link className="menu-link menu-link-admin" data-target="panel" to="/panel" onClick={onClose}>
          Panel de métricas
        </Link>
      )}

      {/* Si Supabase no esta disponible el menu queda igual que antes. */}
      {disponible && (
        <div className="menu-sesion">
          {usuario ? (
            <>
              <div className="menu-sesion-datos">
                {avatar ? (
                  <img src={avatar} alt="" referrerPolicy="no-referrer" />
                ) : (
                  <IconUser className="menu-sesion-avatar" />
                )}
                <div>
                  <strong>{nombre}</strong>
                  <span>{email}</span>
                </div>
              </div>
              <button
                className="menu-sesion-boton menu-sesion-clave"
                onClick={() => {
                  abrirModalContrasena();
                  onClose();
                }}
              >
                <IconLock /> {tieneContrasena ? "Cambiar contraseña" : "Crear una contraseña"}
              </button>
              <button
                className="menu-sesion-boton"
                onClick={() => {
                  salir();
                  onClose();
                }}
              >
                <IconLogout /> Cerrar sesión
              </button>
            </>
          ) : (
            <>
              <button
                className="menu-sesion-boton menu-sesion-entrar"
                onClick={() => {
                  abrirModalAuth();
                  onClose();
                }}
              >
                <IconUser /> Iniciar sesión
              </button>
              {errorLogin && <p className="menu-sesion-error">{errorLogin}</p>}
            </>
          )}
        </div>
      )}
    </nav>
  );
}
