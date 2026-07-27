import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { IconWhatsapp } from "../components/icons/Icon";
import { useCart } from "../context/CartContext";
import { imagenPrincipal } from "../hooks/useProductSearch";
import SearchBar from "./SearchBar";

export default function Header() {
  const { carrito, cartCount, enviarWhatsapp } = useCart();
  const [previewVisible, setPreviewVisible] = useState(false);
  const hoverTimeout = useRef(null);

  function mostrarPreview() {
    clearTimeout(hoverTimeout.current);
    setPreviewVisible(true);
  }

  function ocultarPreviewConDelay() {
    hoverTimeout.current = setTimeout(() => setPreviewVisible(false), 200);
  }

  return (
    <header className="header">
      <div className="logo">
        <img src="/imagenes/logos/logohead.webp" loading="lazy" decoding="async" alt="Logo" />
      </div>

      <div className="header-center">
        <SearchBar />

        <nav className="header-nav">
          <Link id="btnInicio" to="/">
            Inicio
          </Link>
          <Link id="btnProductos" to="/productos">
            Productos
          </Link>
          <Link id="btnNosotros" to="/nosotros">
            Nosotros
          </Link>
          <Link id="btnEmpresas" to="/empresas">
            Empresas
          </Link>
        </nav>
      </div>

      <div
        className="carrito-wrapper"
        onMouseEnter={mostrarPreview}
        onMouseLeave={ocultarPreviewConDelay}
      >
        <Link id="btnCarrito" to="/carrito">
          <img src="/imagenes/logos/Carrito.webp" loading="lazy" decoding="async" alt="Carrito" />
          <span id="contadorCarrito">{cartCount}</span>
        </Link>

        <div
          id="previewCarrito"
          className={`preview-carrito${previewVisible ? " activo" : ""}`}
          onMouseEnter={mostrarPreview}
          onMouseLeave={ocultarPreviewConDelay}
        >
          {carrito.length === 0 ? (
            <p className="preview-vacio">El carrito está vacío</p>
          ) : (
            carrito.map((p, i) => {
              const colorIndex = p.colores?.findIndex((c) => c.nombre === p.color);
              const imagenSrc =
                p.colores && colorIndex >= 0
                  ? p.colores[colorIndex].imagenes[0]
                  : imagenPrincipal(p);
              return (
                <div className="preview-item" key={`${p.id}-${p.talle}-${p.color}-${i}`}>
                  <img src={imagenSrc} loading="lazy" decoding="async" alt={p.nombre} />
                  <div>
                    <strong>
                      {p.marca} | {p.nombre}
                    </strong>
                    <div>
                      Cant: {p.cantidad}
                      {p.talle ? ` | Talle: ${p.talle}` : ""}
                      {p.color ? ` | Color: ${p.color}` : ""}
                    </div>
                  </div>
                </div>
              );
            })
          )}
          {carrito.length > 0 && (
            <button
              className="btn-whatsapp preview-whatsapp"
              onClick={(e) => {
                e.stopPropagation();
                enviarWhatsapp();
              }}
            >
              <IconWhatsapp /> Consultar por WhatsApp
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
