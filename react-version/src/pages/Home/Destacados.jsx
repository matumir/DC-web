import { useMemo, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { productos } from "../../data/productos";
import { imagenPrincipal } from "../../hooks/useProductSearch";
import { productoUrl } from "../../utils/productoUrl";

const PRODUCTOS_POR_PAGINA = 5;

export default function Destacados() {
  const trackRef = useRef(null);
  const [indice, setIndice] = useState(0);

  const destacados = useMemo(
    () =>
      productos
        .filter((p) => p.destacado)
        .sort(() => Math.random() - 0.5)
        .slice(0, 20),
    []
  );

  const totalPaginas = Math.ceil(destacados.length / PRODUCTOS_POR_PAGINA);

  function mover(dir) {
    let nuevoIndice = indice + dir;
    if (nuevoIndice < 0) nuevoIndice = totalPaginas - 1;
    if (nuevoIndice >= totalPaginas) nuevoIndice = 0;
    setIndice(nuevoIndice);
  }

  const card = trackRef.current?.querySelector(".card");
  const cardWidth = card ? card.offsetWidth + 12 : 0;
  const desplazamiento = indice * PRODUCTOS_POR_PAGINA * cardWidth;

  return (
    <section id="destacados">
      <div className="divisor" />
      <h2>Artículos destacados</h2>
      <div className="destacados-container">
        <button className="flecha-destacados izquierda" onClick={() => mover(-1)} aria-label="Anterior">
          ❮
        </button>
        <div className="destacados-carrusel">
          <div
            className="destacados-track"
            id="trackDestacados"
            ref={trackRef}
            style={{ transform: `translateX(-${desplazamiento}px)` }}
          >
            {destacados.map((p) => (
              <div className="card" style={{ position: "relative", overflow: "hidden" }} key={p.id}>
                {p.oferta && <div className="card-ribbon">NUEVO</div>}
                <span className="badge">{p.categoria}</span>
                <img src={imagenPrincipal(p)} loading="lazy" decoding="async" alt={p.nombre} />
                <h4>
                  {p.marca} | {p.nombre}
                </h4>
                <Link className="btn-ver-des" to={productoUrl(p)}>
                  Ver en detalle
                </Link>
              </div>
            ))}
          </div>
        </div>
        <button className="flecha-destacados derecha" onClick={() => mover(1)} aria-label="Siguiente">
          ❯
        </button>
      </div>
    </section>
  );
}
