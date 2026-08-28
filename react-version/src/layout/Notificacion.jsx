import { useEffect, useState } from "react";
import { IconCheck, IconHeartSolid } from "../components/icons/Icon";
import { useCart } from "../context/CartContext";
import { useFavoritos } from "../context/FavoritosContext";

export default function Notificacion() {
  const { notificacionVisible } = useCart();
  const { notificacion } = useFavoritos();

  // El texto se conserva mientras dura el fundido de salida: si se limpiara
  // junto con el estado, el cartel se vaciaria a mitad de la animacion.
  const [ultimo, setUltimo] = useState(null);
  useEffect(() => {
    if (notificacion) setUltimo(notificacion);
  }, [notificacion]);

  const clasesFavorito = [
    "notificacion",
    "notificacion-favorito",
    notificacion ? "visible" : "",
    (notificacion ?? ultimo)?.tipo === "error" ? "notificacion-error" : "",
    // Si las dos coinciden, la de favoritos sube para no taparse con la del carrito.
    notificacionVisible ? "apilada" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <>
      <div
        id="notificacion"
        className={`notificacion${notificacionVisible ? " visible" : ""}`}
        role="status"
        aria-live="polite"
      >
        <IconCheck /> Producto agregado
      </div>

      <div className={clasesFavorito} role="status" aria-live="polite">
        <IconHeartSolid /> {(notificacion ?? ultimo)?.texto}
      </div>
    </>
  );
}
