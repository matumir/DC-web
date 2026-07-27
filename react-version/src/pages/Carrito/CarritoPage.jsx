import { useEffect } from "react";
import { Link } from "react-router-dom";
import { IconCartShopping, IconWhatsapp } from "../../components/icons/Icon";
import { useCart } from "../../context/CartContext";
import { imagenPrincipal } from "../../hooks/useProductSearch";
import { useDocumentMeta } from "../../hooks/useDocumentMeta";

export default function CarritoPage() {
  const { carrito, eliminarDelCarrito, enviarWhatsapp, abrirCarritoMobile } = useCart();

  useEffect(() => {
    if (window.innerWidth <= 768) abrirCarritoMobile();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useDocumentMeta({
    titulo: "Carrito",
    descripcion: "Revisá los productos seleccionados y enviá tu consulta por WhatsApp.",
  });

  const totalProductos = carrito.reduce((acc, item) => acc + (item.cantidad || 0), 0);

  if (carrito.length === 0) {
    return (
      <section id="carrito">
        <h2 className="titulo-carrito">
          <IconCartShopping /> Tu carrito
        </h2>
        <div className="carrito-vacio">
          <p>Todavía no agregaste productos a tu carrito.</p>
          <Link className="btn-principal" to="/productos">
            Ver catálogo de productos
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section id="carrito">
      <h1 className="titulo-carrito">
        <IconCartShopping /> Tu carrito
      </h1>

      <div id="listaCarritoDesktop">
        {carrito.length === 0 ? (
          <p>No hay productos en el carrito.</p>
        ) : (
          carrito.map((p, i) => {
            const colorIndex = p.colores?.findIndex((c) => c.nombre === p.color);
            const imagenSrc =
              p.colores && colorIndex >= 0
                ? p.colores[colorIndex].imagenes[0]
                : imagenPrincipal(p);
            return (
              <div className="card" key={`${p.id}-${p.talle}-${p.color}-${i}`}>
                <img src={imagenSrc} loading="lazy" decoding="async" alt={p.nombre} />
                <h4>
                  {p.marca} | {p.nombre}
                </h4>
                <p>Cantidad: {p.cantidad}</p>
                {p.talle && <p>Talle: {p.talle}</p>}
                {p.color && <p>Color: {p.color}</p>}
                <button onClick={() => eliminarDelCarrito(i)}>Eliminar</button>
              </div>
            );
          })
        )}
      </div>

      <div id="carritoResumen" className="carrito-resumen">
        {totalProductos === 1 ? "1 producto seleccionado" : `${totalProductos} productos seleccionados`}
      </div>

      <button onClick={enviarWhatsapp} className="btn-whatsapp">
        <IconWhatsapp /> Consultar por WhatsApp
      </button>
    </section>
  );
}
