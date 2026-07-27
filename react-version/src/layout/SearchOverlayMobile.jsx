import { IconSearch } from "../components/icons/Icon";
import { useSearch } from "../context/SearchContext";
import SearchResultsList from "./SearchResultsList";

export default function SearchOverlayMobile() {
  const { query, setQuery, results, mobileOpen, setMobileOpen, selectProduct, submitSearch } =
    useSearch();

  function cerrar() {
    setMobileOpen(false);
    setQuery("");
  }

  function handleKeyDown(e) {
    if (e.key === "Enter") {
      e.preventDefault();
      if (!query.trim()) return;
      submitSearch();
    }
  }

  return (
    <div className={`buscador-mobile${mobileOpen ? " activo" : ""}`} id="buscadorMobile">
      <div className="buscador-header">
        <button id="cerrarBuscadorMobile" className="cerrar-buscador" onClick={cerrar}>
          ✕
        </button>
        <input
          type="text"
          id="buscadorMobileInput"
          placeholder="Buscar productos..."
          aria-label="Buscar productos"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
        />
        <IconSearch className="icono-busqueda" />
      </div>

      <div id="resultadosBuscadorMobile">
        {query.trim().length >= 2 && (
          <SearchResultsList
            results={results}
            query={query}
            selectedIndex={-1}
            onSelect={(producto) => selectProduct(producto)}
            onVerTodos={submitSearch}
          />
        )}
      </div>
    </div>
  );
}
