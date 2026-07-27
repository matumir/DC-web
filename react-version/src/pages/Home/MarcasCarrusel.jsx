import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { marcas } from "../../data/marcas";
import { slugify } from "../../utils/slug";

export default function MarcasCarrusel() {
  const trackRef = useRef(null);
  const [indice, setIndice] = useState(0);

  function mover(direccion) {
    const track = trackRef.current;
    const items = track?.querySelectorAll(".marca");
    if (!track || !items?.length) return;

    const gap = 20;
    const anchoMarca = items[0].offsetWidth + gap;
    const visibles = Math.floor(track.parentElement.offsetWidth / anchoMarca);
    const maxIndice = items.length - visibles;

    setIndice(Math.max(0, Math.min(indice + direccion, maxIndice)));
  }

  const track = trackRef.current;
  const items = track?.querySelectorAll(".marca");
  const anchoMarca = items?.length ? items[0].offsetWidth + 20 : 0;

  return (
    <section id="inicio-marcas" className="marcas">
      <div className="divisor" />
      <h3>Marcas que trabajamos</h3>

      <div className="marcas-carrusel">
        <button className="flecha izquierda" onClick={() => mover(-1)} aria-label="Anterior">
          ‹
        </button>

        <div className="marcas-viewport">
          <div
            className="marcas-track"
            id="marcasTrack"
            ref={trackRef}
            style={{ transform: `translateX(-${indice * anchoMarca}px)` }}
          >
            {marcas.map((m) => (
              <Link
                className="marca"
                key={m.nombre}
                data-marca={m.nombre}
                to={`/productos/filtrar/todos/todas/${slugify(m.nombre)}`}
              >
                <img src={m.imagen} loading="lazy" decoding="async" alt={m.nombre} />
              </Link>
            ))}
          </div>
        </div>

        <button className="flecha derecha" onClick={() => mover(1)} aria-label="Siguiente">
          ›
        </button>
      </div>
    </section>
  );
}
