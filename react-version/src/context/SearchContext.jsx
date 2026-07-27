import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { filtrarProductos } from "../hooks/useProductSearch";
import { productoUrl } from "../utils/productoUrl";

const SearchContext = createContext(null);

export function SearchProvider({ children }) {
  const [productos, setProductos] = useState(null);
  const [query, setQuery] = useState("");
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // El catálogo completo se carga en un chunk aparte (no bloquea el bundle inicial)
  // y se dispara apenas la app queda idle, para que la búsqueda esté lista al usarla.
  useEffect(() => {
    import("../data/productos").then((m) => setProductos(m.productos));
  }, []);

  const results = useMemo(
    () => (productos && query.trim().length >= 2 ? filtrarProductos(productos, query) : []),
    [productos, query]
  );

  function selectProduct(producto) {
    setQuery("");
    setMobileOpen(false);
    navigate(productoUrl(producto));
  }

  function submitSearch() {
    setMobileOpen(false);
    const enPaginaCatalogo =
      location.pathname === "/productos" || location.pathname.startsWith("/productos/filtrar/");
    const ruta = enPaginaCatalogo ? location.pathname : "/productos";
    const params = new URLSearchParams(enPaginaCatalogo ? location.search : "");
    if (query.trim()) params.set("q", query.trim());
    else params.delete("q");
    const qs = params.toString();
    navigate(qs ? `${ruta}?${qs}` : ruta);
  }

  return (
    <SearchContext.Provider
      value={{ query, setQuery, results, mobileOpen, setMobileOpen, selectProduct, submitSearch }}
    >
      {children}
    </SearchContext.Provider>
  );
}

export function useSearch() {
  const ctx = useContext(SearchContext);
  if (!ctx) throw new Error("useSearch debe usarse dentro de <SearchProvider>");
  return ctx;
}
