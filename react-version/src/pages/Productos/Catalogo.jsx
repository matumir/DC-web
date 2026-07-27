import { useEffect, useState } from "react";
import Paginacion, { PRODUCTOS_POR_PAGINA } from "./Paginacion";
import TarjetaProducto from "./TarjetaProducto";

export default function Catalogo({
  lista,
  busqueda,
  hayFiltros,
  paginaActual,
  onCambiarPagina,
  onQuitarBusqueda,
  onLimpiarFiltros,
}) {
  const [cargando, setCargando] = useState(true);

  useEffect(() => {
    setCargando(true);
    const timer = setTimeout(() => setCargando(false), 400);
    return () => clearTimeout(timer);
  }, [lista, paginaActual]);

  if (lista.length === 0) {
    const hayBusqueda = Boolean(busqueda.trim());

    return (
      <div id="catalogo" className="catalogo">
        <div className="sin-resultados">
          {hayBusqueda && hayFiltros ? (
            <>
              <h3>No encontramos productos para "{busqueda}" con los filtros aplicados</h3>
              <p>Probá modificar la búsqueda o quitar alguno de los filtros.</p>
              <div className="sin-resultados-acciones">
                <button className="btn-limpiar" onClick={onQuitarBusqueda}>
                  Quitar búsqueda
                </button>
                <button className="btn-limpiar" onClick={onLimpiarFiltros}>
                  Limpiar filtros
                </button>
              </div>
            </>
          ) : hayBusqueda ? (
            <>
              <h3>No encontramos productos para "{busqueda}"</h3>
              <p>Intentá con otra palabra clave.</p>
            </>
          ) : hayFiltros ? (
            <>
              <h3>No hay productos que coincidan con los filtros seleccionados</h3>
              <p>Probá modificarlos o quitarlos para ver más resultados.</p>
              <div className="sin-resultados-acciones">
                <button className="btn-limpiar" onClick={onLimpiarFiltros}>
                  Limpiar filtros
                </button>
              </div>
            </>
          ) : (
            <h3>No hay productos disponibles.</h3>
          )}
        </div>
      </div>
    );
  }

  const total = lista.length;
  const ini = (paginaActual - 1) * PRODUCTOS_POR_PAGINA;
  const fin = Math.min(ini + PRODUCTOS_POR_PAGINA, total);

  return (
    <>
      <div id="catalogo" className="catalogo">
        {cargando
          ? Array.from({ length: PRODUCTOS_POR_PAGINA }).map((_, i) => (
              <div className="skeleton-card" key={i} />
            ))
          : lista.slice(ini, fin).map((p) => <TarjetaProducto producto={p} key={p.id} />)}
      </div>

      {!cargando && (
        <Paginacion total={total} paginaActual={paginaActual} onCambiarPagina={onCambiarPagina} />
      )}
    </>
  );
}
