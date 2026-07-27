import { useMemo, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { productos } from "../../data/productos";
import { imagenPrincipal } from "../../hooks/useProductSearch";
import { productoUrl } from "../../utils/productoUrl";

const PRODUCTOS_POR_GRUPO = 4;

export default function Relacionados({ producto }) {
  const navigate = useNavigate();
  const trackRef = useRef(null);
  const [indice, setIndice] = useState(0);

  const relacionados = useMemo(() => {
    let lista = productos.filter(
      (p) =>
        p.categoria === producto.categoria &&
        p.subcategoria === producto.subcategoria &&
        p.id !== producto.id
    );
    if (lista.length === 0) {
      lista = productos.filter((p) => p.categoria === producto.categoria && p.id !== producto.id);
    }
    return lista;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [producto.id]);

  if (relacionados.length === 0) return null;

  const totalGrupos = Math.ceil(relacionados.length / PRODUCTOS_POR_GRUPO);
  const card = trackRef.current?.querySelector(".card");
  const cardWidth = card ? card.offsetWidth + 20 : 0;
  const desplazamiento = indice * PRODUCTOS_POR_GRUPO * cardWidth;

  function mover(dir) {
    setIndice((i) => (i + dir + totalGrupos) % totalGrupos);
  }

  return (
    <div id="relacionados">
      <div className="divisor" />
      <h3>También te puede interesar ⬇️</h3>
      <div className="carrusel-container">
        <button className="flecha-carrusel izquierda" onClick={() => mover(-1)} aria-label="Anterior">
          ❮
        </button>
        <div className="carrusel">
          <div
            className="carrusel-track"
            id="carruselRelacionados"
            ref={trackRef}
            style={{ transform: `translateX(-${desplazamiento}px)` }}
          >
            {relacionados.map((p) => (
              <div className="card" key={p.id} onClick={() => navigate(productoUrl(p))}>
                {p.oferta && <div className="card-ribbon">NUEVO</div>}
                <img src={imagenPrincipal(p)} loading="lazy" decoding="async" alt={p.nombre} />
                <h4>
                  {p.marca} | {p.nombre}
                </h4>
                <Link
                  className="btn-ver fijo"
                  to={productoUrl(p)}
                  onClick={(e) => e.stopPropagation()}
                >
                  Ver detalle
                </Link>
              </div>
            ))}
          </div>
        </div>
        <button className="flecha-carrusel derecha" onClick={() => mover(1)} aria-label="Siguiente">
          ❯
        </button>
      </div>
    </div>
  );
}
