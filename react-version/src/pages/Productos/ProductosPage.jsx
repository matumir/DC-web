import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { IconArrowLeft, IconFilter } from "../../components/icons/Icon";
import Breadcrumbs from "../../components/Breadcrumbs";
import { useDocumentMeta } from "../../hooks/useDocumentMeta";
import { slugify } from "../../utils/slug";
import { useProductosFilters } from "./useProductosFilters";
import FiltrosSidebar from "./FiltrosSidebar";
import Catalogo from "./Catalogo";
import { PRODUCTOS_POR_PAGINA } from "./Paginacion";

export default function ProductosPage() {
  const filtros = useProductosFilters();
  const { categoria, subcategoria, listaFiltrada, busqueda, pagina, setPagina, filtrosActivos, quitarFiltro, limpiarFiltros } =
    filtros;
  const hayFiltros = filtrosActivos.some((f) => f.tipo !== "busqueda");

  const breadcrumbItems = [{ label: "Inicio", to: "/" }, { label: "Productos", to: "/productos" }];
  if (categoria !== "todos") {
    breadcrumbItems.push({
      label: categoria,
      to: `/productos/filtrar/${slugify(categoria)}/todas/todas`,
    });
  }
  if (categoria !== "todos" && subcategoria !== "todas") {
    breadcrumbItems.push({
      label: subcategoria,
      to: `/productos/filtrar/${slugify(categoria)}/${slugify(subcategoria)}/todas`,
    });
  }

  useDocumentMeta({
    titulo:
      categoria !== "todos"
        ? `${categoria}${subcategoria !== "todas" ? ` - ${subcategoria}` : ""}`
        : "Productos",
    descripcion:
      "Catálogo de artículos de seguridad industrial y protección personal: calzado, indumentaria, equipos de protección y más.",
  });

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [sidebarClosing, setSidebarClosing] = useState(false);

  const totalPaginas = Math.ceil(listaFiltrada.length / PRODUCTOS_POR_PAGINA);
  useEffect(() => {
    if (totalPaginas > 0 && pagina > totalPaginas) setPagina(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [totalPaginas, pagina]);

  function cerrarFiltrosMobile() {
    setSidebarClosing(true);
    setTimeout(() => {
      setSidebarOpen(false);
      setSidebarClosing(false);
    }, 250);
  }

  function cambiarPagina(numero) {
    setPagina(numero);
    window.scrollTo(0, 0);
  }

  return (
    <section id="productos">
      <h1 className="visually-hidden">
        {categoria !== "todos" ? `${categoria}${subcategoria !== "todas" ? ` - ${subcategoria}` : ""}` : "Productos"}
      </h1>

      <Breadcrumbs items={breadcrumbItems} />

      <button
        className={`btn-filtrar-mobile${sidebarOpen ? " oculto" : ""}`}
        onClick={() => setSidebarOpen(true)}
      >
        <IconFilter /> Filtrar
        {filtrosActivos.length > 0 && (
          <span className="contador-filtros">{filtrosActivos.length}</span>
        )}
      </button>

      <div className="productos-layout">
        <FiltrosSidebar
          filtros={filtros}
          open={sidebarOpen}
          closing={sidebarClosing}
          onClose={cerrarFiltrosMobile}
        />

        <div className="productos-contenido">
          <div className="productos-header">
            <Link className="volver" to="/">
              <IconArrowLeft /> Volver
            </Link>
            {listaFiltrada.length > 0 && (
              <span id="contadorResultados">
                Mostrando {Math.min((pagina - 1) * PRODUCTOS_POR_PAGINA + 1, listaFiltrada.length)}–
                {Math.min(pagina * PRODUCTOS_POR_PAGINA, listaFiltrada.length)} / {listaFiltrada.length}
              </span>
            )}
          </div>

          <Catalogo
            lista={listaFiltrada}
            busqueda={busqueda}
            hayFiltros={hayFiltros}
            paginaActual={pagina}
            onCambiarPagina={cambiarPagina}
            onQuitarBusqueda={() => quitarFiltro("busqueda")}
            onLimpiarFiltros={limpiarFiltros}
          />
        </div>
      </div>
    </section>
  );
}
