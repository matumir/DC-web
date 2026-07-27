import { imagenPrincipal, resaltar } from "../hooks/useProductSearch";

export default function SearchResultsList({ results, query, selectedIndex, onSelect, onVerTodos }) {
  if (results.length === 0) {
    return <div className="buscador-sin-resultados">No se encontraron productos</div>;
  }

  return (
    <>
      {results.map((p, i) => (
        <div
          className={`buscador-item${i === selectedIndex ? " activo" : ""}`}
          data-id={p.id}
          key={p.id}
          onClick={() => onSelect(p)}
        >
          <img src={imagenPrincipal(p)} loading="lazy" decoding="async" alt={p.nombre} />
          <div
            className="buscador-texto"
            dangerouslySetInnerHTML={{ __html: resaltar(`${p.marca} | ${p.nombre}`, query) }}
          />
        </div>
      ))}
      {onVerTodos && (
        <button className="buscador-ver-todos" onClick={onVerTodos}>
          Ver todos los resultados para "{query}"
        </button>
      )}
    </>
  );
}
