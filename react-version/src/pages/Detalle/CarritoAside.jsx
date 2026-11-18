import { IconCartShopping, IconWhatsapp } from "../../components/icons/Icon";
import { useCart } from "../../context/CartContext";
import { textoBordado } from "./detalleUtils";

export default function CarritoAside() {
  const { carrito, eliminarDelCarrito, enviarWhatsapp } = useCart();

  return (
    <aside className="carrito">
      <h3>
        <IconCartShopping /> Tu carrito
      </h3>
      <ul id="listaCarritoDetalle">
        {carrito.map((p, i) => (
          <li key={`${p.id}-${p.talle}-${p.color}-${i}`}>
            {p.marca} | {p.nombre} {p.talle ? `(${p.talle})` : ""}
            {p.color ? ` - ${p.color}` : ""}
            {textoBordado(p.bordado) ? ` - ${textoBordado(p.bordado)}` : ""} x {p.cantidad}
            <button onClick={() => eliminarDelCarrito(i)}>✕</button>
          </li>
        ))}
      </ul>

      <button onClick={enviarWhatsapp} className="btn-whatsapp">
        <IconWhatsapp /> Consultar por WhatsApp
      </button>
    </aside>
  );
}
