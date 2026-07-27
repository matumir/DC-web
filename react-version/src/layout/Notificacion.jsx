import { IconCheck } from "../components/icons/Icon";
import { useCart } from "../context/CartContext";

export default function Notificacion() {
  const { notificacionVisible } = useCart();

  return (
    <div id="notificacion" className={`notificacion${notificacionVisible ? "" : " oculto"}`}>
      <IconCheck /> Producto agregado
    </div>
  );
}
