import { Link } from "react-router-dom";

export default function MobileMenu({ open, onClose }) {
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
    </nav>
  );
}
