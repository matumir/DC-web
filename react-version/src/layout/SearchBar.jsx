import { useEffect, useRef, useState } from "react";
import { IconSearch } from "../components/icons/Icon";
import { useSearch } from "../context/SearchContext";
import SearchResultsList from "./SearchResultsList";

export default function SearchBar() {
  const { query, setQuery, results, selectProduct, submitSearch } = useSearch();
  const [visible, setVisible] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const containerRef = useRef(null);

  useEffect(() => {
    function onDocClick(e) {
      if (!containerRef.current?.contains(e.target)) setVisible(false);
    }
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  function handleChange(e) {
    const value = e.target.value;
    setQuery(value);
    setSelectedIndex(-1);
    setVisible(value.trim().length >= 2);
  }

  function handleKeyDown(e) {
    if (e.key === "Escape") {
      setVisible(false);
      setSelectedIndex(-1);
      return;
    }
    if (!results.length) {
      if (e.key === "Enter") {
        e.preventDefault();
        submitSearch();
        setVisible(false);
      }
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((i) => (i < results.length - 1 ? i + 1 : 0));
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((i) => (i > 0 ? i - 1 : results.length - 1));
    }
    if (e.key === "Enter") {
      e.preventDefault();
      if (selectedIndex >= 0) {
        selectProduct(results[selectedIndex]);
      } else {
        submitSearch();
      }
      setVisible(false);
    }
  }

  return (
    <div className="header-search" ref={containerRef}>
      <input
        type="text"
        id="buscador"
        placeholder="Buscar productos..."
        aria-label="Buscar productos"
        autoComplete="off"
        value={query}
        onChange={handleChange}
        onFocus={() => setVisible(query.trim().length >= 2)}
        onKeyDown={handleKeyDown}
      />
      <IconSearch className="icono-busqueda" />
      <div id="resultadosBuscador" className={`buscador-resultados${visible ? "" : " oculto"}`}>
        {visible && (
          <SearchResultsList
            results={results}
            query={query}
            selectedIndex={selectedIndex}
            onSelect={(producto) => {
              selectProduct(producto);
              setVisible(false);
            }}
            onVerTodos={() => {
              submitSearch();
              setVisible(false);
            }}
          />
        )}
      </div>
    </div>
  );
}
