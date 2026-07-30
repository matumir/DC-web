import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import { categoriasHome } from "../../data/categoriasHome";
import { slugify } from "../../utils/slug";

export default function CategoriasHome() {
  const viewportRef = useRef(null);
  const trackRef = useRef(null);
  const [indice, setIndice] = useState(0);

  function mover(direccion) {
    const viewport = viewportRef.current;
    const track = trackRef.current;
    const cards = track?.querySelectorAll(".categoria-card");
    if (!viewport || !cards?.length) return;

    const gap = 16;
    const anchoCard = cards[0].offsetWidth + gap;
    const visibles = Math.floor(viewport.offsetWidth / anchoCard);
    const maxIndice = cards.length - visibles;

    const nuevoIndice = Math.max(0, Math.min(indice + direccion, maxIndice));
    setIndice(nuevoIndice);
    viewport.scrollTo({ left: nuevoIndice * anchoCard, behavior: "smooth" });
  }

  return (
    <section id="inicio-categorias" className="categorias-home">
      <h2>Categorías</h2>

      <div className="categorias-wrapper">
        <button
          className="flecha-categoria izquierda"
          type="button"
          onClick={() => mover(-1)}
          aria-label="Anterior"
        >
          ‹
        </button>

        <div className="categorias-viewport" ref={viewportRef}>
          <div id="categoriasContainer" className="categorias-cards" ref={trackRef}>
            {categoriasHome.map((cat) => (
              <div className="categoria-card" key={cat.nombre}>
                <h3>{cat.nombre}</h3>
                <img src={cat.img} loading="lazy" decoding="async" alt={cat.nombre} />
                <Link
                  to={`/productos/filtrar/${slugify(cat.nombre)}/todas/todas`}
                  aria-label={`Ver productos de ${cat.nombre}`}
                >
                  Ver productos
                </Link>
              </div>
            ))}
          </div>
        </div>

        <button
          className="flecha-categoria derecha"
          type="button"
          onClick={() => mover(1)}
          aria-label="Siguiente"
        >
          ›
        </button>
      </div>

      <div className="ver-todos-wrapper">
        <Link className="btn-principal" to="/productos">
          Ver todos los productos
        </Link>
      </div>
    </section>
  );
}
