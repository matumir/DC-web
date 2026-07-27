import { useRef, useState } from "react";
import { createPortal } from "react-dom";

export default function Galeria({ producto, detalle }) {
  const { galeria, imagenIndex, setImagenIndex, moverImagen, zoomOpen, setZoomOpen } = detalle;
  const touchStartX = useRef(0);
  const [zoomHover, setZoomHover] = useState(false);
  const [origen, setOrigen] = useState({ x: 50, y: 50 });

  const imagenActual = galeria[imagenIndex];

  function onTouchStart(e) {
    touchStartX.current = e.touches[0].clientX;
  }

  function onTouchEnd(e) {
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) moverImagen(diff > 0 ? 1 : -1);
  }

  function onMouseMove(e) {
    const rect = e.currentTarget.getBoundingClientRect();
    setOrigen({
      x: ((e.clientX - rect.left) / rect.width) * 100,
      y: ((e.clientY - rect.top) / rect.height) * 100,
    });
  }

  return (
    <div className="galeria-producto">
      <div id="miniaturas" className="miniaturas">
        {galeria.map((img, i) => (
          <img
            key={img.src + i}
            src={img.src}
            loading="lazy"
            decoding="async"
            alt={producto.nombre}
            className={i === imagenIndex ? "activa" : ""}
            onClick={() => setImagenIndex(i)}
          />
        ))}
      </div>

      <div className="imagen-principal" style={{ position: "relative", overflow: "hidden" }}>
        {producto.oferta && <div className="detalle-ribbon">NUEVO</div>}
        <button className="flecha izquierda" onClick={() => moverImagen(-1)} aria-label="Imagen anterior">
          ❮
        </button>
        <img
          id="detalleImg"
          src={imagenActual?.src}
          alt={producto.nombre}
          loading="eager"
          fetchPriority="high"
          className={zoomHover ? "zoom-hover" : ""}
          style={zoomHover ? { transformOrigin: `${origen.x}% ${origen.y}%` } : undefined}
          onClick={() => setZoomOpen(true)}
          onMouseEnter={() => setZoomHover(true)}
          onMouseLeave={() => setZoomHover(false)}
          onMouseMove={onMouseMove}
          onTouchStart={onTouchStart}
          onTouchEnd={onTouchEnd}
        />
        <button className="flecha derecha" onClick={() => moverImagen(1)} aria-label="Imagen siguiente">
          ❯
        </button>
      </div>

      {zoomOpen &&
        createPortal(
          <div className="zoom-overlay" onClick={() => setZoomOpen(false)}>
            <img src={imagenActual?.src} loading="lazy" alt={producto.nombre} />
          </div>,
          document.body
        )}
    </div>
  );
}
