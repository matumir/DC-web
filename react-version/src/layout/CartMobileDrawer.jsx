import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { IconWhatsapp } from "../components/icons/Icon";
import { imagenPrincipal } from "../hooks/useProductSearch";

export default function CartMobileDrawer() {
  const { carrito, eliminarDelCarrito, enviarWhatsapp, cartMobileOpen, cerrarCarritoMobile } = useCart();

  return (
    <section
      id="carritoMobile"
      className={`carrito-mobile${cartMobileOpen ? " activo" : " oculto"}`}
    >
      <button id="cerrarCarritoMobile" onClick={cerrarCarritoMobile}>
        ✕
      </button>
      <h2>Tu carrito</h2>
      <div id="listaCarritoMobile">
        {carrito.length === 0 ? (
          <div className="carrito-vacio">
            <p>Todavía no agregaste productos a tu carrito.</p>
            <Link className="btn-principal" to="/productos" onClick={cerrarCarritoMobile}>
              Ver catálogo de productos
            </Link>
          </div>
        ) : (
          carrito.map((p, i) => {
            const colorIndex = p.colores?.findIndex((c) => c.nombre === p.color);
            const imagenSrc =
              p.colores && colorIndex >= 0
                ? p.colores[colorIndex].imagenes[0]
                : imagenPrincipal(p);
            return (
              <div className="carrito-item-mobile" key={`${p.id}-${p.talle}-${p.color}-${i}`}>
                <img src={imagenSrc} loading="lazy" decoding="async" alt={p.nombre} />
                <div className="detalles">
                  <strong>
                    {p.marca} | {p.nombre}
                  </strong>
                  <div>
                    Cant: {p.cantidad}
                    {p.talle ? ` | Talle: ${p.talle}` : ""}
                    {p.color ? ` | Color: ${p.color}` : ""}
                  </div>
                </div>
                <button onClick={() => eliminarDelCarrito(i)}>×</button>
              </div>
            );
          })
        )}
      </div>
      {carrito.length > 0 && (
        <button onClick={enviarWhatsapp} className="btn-whatsapp">
          <IconWhatsapp /> Consultar por WhatsApp
        </button>
      )}
    </section>
  );
}
