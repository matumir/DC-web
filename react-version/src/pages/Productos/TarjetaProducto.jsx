import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { IconCartPlus } from "../../components/icons/Icon";
import { useCart } from "../../context/CartContext";
import { obtenerColorCSS } from "../Detalle/detalleUtils";
import { productoUrl } from "../../utils/productoUrl";

export default function TarjetaProducto({ producto }) {
  const { agregarAlCarrito } = useCart();
  const [colorIndex, setColorIndex] = useState(0);
  const [imgIndex, setImgIndex] = useState(0);
  const intervalRef = useRef(null);

  const tieneColores = Array.isArray(producto.colores) && producto.colores.length > 0;
  const imagenes = tieneColores ? producto.colores[colorIndex].imagenes : producto.imagenes || [];
  const sinVariantes = !producto.talles?.length && !producto.colores?.length;

  useEffect(() => () => clearInterval(intervalRef.current), []);

  function iniciarHover() {
    if (imagenes.length <= 1) return;
    intervalRef.current = setInterval(() => {
      setImgIndex((i) => (i + 1) % imagenes.length);
    }, 900);
  }

  function detenerHover() {
    clearInterval(intervalRef.current);
    setImgIndex(0);
  }

  function elegirColor(e, index) {
    e.stopPropagation();
    clearInterval(intervalRef.current);
    setColorIndex(index);
    setImgIndex(0);
  }

  return (
    <div
      className="card fade-page"
      style={{ position: "relative", overflow: "hidden" }}
      onMouseEnter={iniciarHover}
      onMouseLeave={detenerHover}
    >
      {producto.oferta && <div className="card-ribbon">NUEVO</div>}
      <span className="badge">{producto.categoria}</span>
      {sinVariantes && (
        <button
          className="btn-quick-add"
          title="Agregar al carrito"
          aria-label="Agregar al carrito"
          onClick={(e) => {
            e.stopPropagation();
            agregarAlCarrito(producto, { cantidad: 1 });
          }}
        >
          <IconCartPlus />
        </button>
      )}
      <img
        key={`${colorIndex}-${imgIndex}`}
        src={imagenes[imgIndex] || imagenes[0]}
        loading="lazy"
        decoding="async"
        alt={producto.nombre}
      />
      {tieneColores && producto.colores.length > 1 && (
        <div className="card-colores">
          {producto.colores.map((color, index) => (
            <span
              key={color.nombre}
              className={`card-color-item${index === colorIndex ? " activo" : ""}`}
              style={{ background: obtenerColorCSS(color.nombre) }}
              title={color.nombre}
              onClick={(e) => elegirColor(e, index)}
            />
          ))}
        </div>
      )}
      <h4>
        {producto.marca} | {producto.nombre}
      </h4>
      <Link className="btn-ver" to={productoUrl(producto)}>
        Ver en detalle
      </Link>
    </div>
  );
}
