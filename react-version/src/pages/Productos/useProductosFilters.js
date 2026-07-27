import { useMemo } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { productos } from "../../data/productos";
import { categoriasHome } from "../../data/categoriasHome";
import { slugify } from "../../utils/slug";

const CATEGORIAS = categoriasHome.map((c) => c.nombre);

function sortEs(lista) {
  return [...lista].sort((a, b) => a.localeCompare(b, "es", { sensitivity: "base" }));
}

function resolverPorSlug(lista, slug, valorPorDefecto) {
  if (!slug || slug === slugify(valorPorDefecto)) return valorPorDefecto;
  return lista.find((v) => slugify(v) === slug) || valorPorDefecto;
}

export function useProductosFilters() {
  const params = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const categoria = resolverPorSlug(CATEGORIAS, params.categoria, "todos");

  const subcategoriasDisponibles = useMemo(() => {
    if (categoria === "todos") return [];
    const set = new Set();
    productos.forEach((p) => {
      if (p.categoria === categoria && p.subcategoria) set.add(p.subcategoria);
    });
    return sortEs([...set]);
  }, [categoria]);

  const marcasDisponibles = useMemo(() => {
    const set = new Set();
    productos.forEach((p) => {
      if ((categoria === "todos" || p.categoria === categoria) && p.marca) set.add(p.marca);
    });
    return sortEs([...set]);
  }, [categoria]);

  const subcategoria = resolverPorSlug(subcategoriasDisponibles, params.subcategoria, "todas");
  const marca = resolverPorSlug(marcasDisponibles, params.marca, "todas");

  const orden = searchParams.get("orden") || "az";
  const busqueda = (searchParams.get("q") || "").toLowerCase();
  const pagina = Number(searchParams.get("pagina")) || 1;
  const soloOfertas = searchParams.get("ofertas") === "1";

  const listaFiltrada = useMemo(() => {
    let lista = productos;

    if (categoria !== "todos") {
      lista = lista.filter((p) => p.categoria === categoria);
    }
    if (categoria !== "todos" && subcategoria !== "todas") {
      lista = lista.filter((p) => p.subcategoria === subcategoria);
    }
    if (marca !== "todas") {
      lista = lista.filter((p) => p.marca === marca);
    }
    if (soloOfertas) {
      lista = lista.filter((p) => p.oferta);
    }
    if (busqueda) {
      lista = lista.filter(
        (p) =>
          p.nombre.toLowerCase().includes(busqueda) ||
          (p.marca && p.marca.toLowerCase().includes(busqueda)) ||
          (p.categoria && p.categoria.toLowerCase().includes(busqueda)) ||
          (p.subcategoria && p.subcategoria.toLowerCase().includes(busqueda))
      );
    }

    return [...lista].sort((a, b) =>
      orden === "az" ? a.nombre.localeCompare(b.nombre) : b.nombre.localeCompare(a.nombre)
    );
  }, [categoria, subcategoria, marca, soloOfertas, busqueda, orden]);

  // Navega a la ruta de filtros (/productos/filtrar/:categoria/:subcategoria/:marca),
  // o a /productos "limpio" si los tres quedan en su valor por defecto.
  // Preserva orden/búsqueda de la query string y resetea la página.
  function irA(cambios) {
    const nuevaCategoria = cambios.categoria ?? categoria;
    const nuevaSubcategoria = cambios.subcategoria ?? subcategoria;
    const nuevaMarca = cambios.marca ?? marca;

    const cSlug = nuevaCategoria !== "todos" ? slugify(nuevaCategoria) : "todos";
    const sSlug = nuevaSubcategoria !== "todas" ? slugify(nuevaSubcategoria) : "todas";
    const mSlug = nuevaMarca !== "todas" ? slugify(nuevaMarca) : "todas";

    const ruta =
      cSlug === "todos" && sSlug === "todas" && mSlug === "todas"
        ? "/productos"
        : `/productos/filtrar/${cSlug}/${sSlug}/${mSlug}`;

    const nuevosParams = new URLSearchParams(searchParams);
    nuevosParams.delete("pagina");
    const qs = nuevosParams.toString();
    navigate(qs ? `${ruta}?${qs}` : ruta);
  }

  function setCategoria(nuevaCategoria) {
    const marcasDeNuevaCategoria = new Set();
    productos.forEach((p) => {
      if ((nuevaCategoria === "todos" || p.categoria === nuevaCategoria) && p.marca) {
        marcasDeNuevaCategoria.add(p.marca);
      }
    });
    irA({
      categoria: nuevaCategoria,
      subcategoria: "todas",
      marca: marcasDeNuevaCategoria.has(marca) ? marca : "todas",
    });
  }

  function setSubcategoria(valor) {
    irA({ subcategoria: valor });
  }

  function setMarca(valor) {
    irA({ marca: valor });
  }

  function setOrden(valor) {
    const next = new URLSearchParams(searchParams);
    if (valor === "az") next.delete("orden");
    else next.set("orden", valor);
    setSearchParams(next);
  }

  function setPagina(numero) {
    const next = new URLSearchParams(searchParams);
    if (numero <= 1) next.delete("pagina");
    else next.set("pagina", String(numero));
    setSearchParams(next);
  }

  function setSoloOfertas(valor) {
    const next = new URLSearchParams(searchParams);
    if (valor) next.set("ofertas", "1");
    else next.delete("ofertas");
    next.delete("pagina");
    setSearchParams(next);
  }

  function quitarFiltro(tipo) {
    if (tipo === "categoria") irA({ categoria: "todos", subcategoria: "todas" });
    if (tipo === "subcategoria") irA({ subcategoria: "todas" });
    if (tipo === "marca") irA({ marca: "todas" });
    if (tipo === "ofertas") setSoloOfertas(false);
    if (tipo === "busqueda") {
      const next = new URLSearchParams(searchParams);
      next.delete("q");
      setSearchParams(next);
    }
  }

  function limpiarFiltros() {
    navigate("/productos");
  }

  const filtrosActivos = [];
  if (categoria !== "todos") filtrosActivos.push({ tipo: "categoria", valor: categoria });
  if (categoria !== "todos" && subcategoria !== "todas") {
    filtrosActivos.push({ tipo: "subcategoria", valor: subcategoria });
  }
  if (marca !== "todas") filtrosActivos.push({ tipo: "marca", valor: marca });
  if (soloOfertas) filtrosActivos.push({ tipo: "ofertas", valor: "Solo ofertas/nuevos" });
  if (busqueda.trim()) {
    filtrosActivos.push({ tipo: "busqueda", valor: `Búsqueda: "${busqueda}"` });
  }

  return {
    categoria,
    subcategoria,
    marca,
    orden,
    busqueda,
    pagina,
    soloOfertas,
    categorias: CATEGORIAS,
    subcategoriasDisponibles,
    marcasDisponibles,
    listaFiltrada,
    filtrosActivos,
    setCategoria,
    setSubcategoria,
    setMarca,
    setOrden,
    setPagina,
    setSoloOfertas,
    quitarFiltro,
    limpiarFiltros,
  };
}
