/* =====================
   VALIDACIÓN
===================== */
if (typeof productos === "undefined") {
  console.error("productos no definido");
}

/* =====================
   ESTADO
===================== */
let carrito = JSON.parse(localStorage.getItem("carrito")) || [];
let productoActual = null;
let imagenIndex = 0;
let paginaActual = 1;
const productosPorPagina = 12;
let listaActual = productos;
let indiceCarrusel = 0;
const productosPorCarrusel = 4;
let galeriaImagenes = [];
let colorSeleccionado = null;
const coloresProducto = document.getElementById("coloresProducto");
let categoriaActual = "todos";
let marcaActual = "todas";
let ordenActual = "az";
const selectSubcategoria = document.getElementById("selectSubcategoria");
let subcategoriaActual = "todas";
let busquedaActual = "";
let indiceCategoria = 0;
/* =====================
   REFERENCIAS
===================== */
const inicioSecciones = [
  document.getElementById("banner-inicio"),
  document.getElementById("inicio-categorias"),
  document.getElementById("destacados"),
  document.getElementById("inicio-marcas")
  
];

const productosSec = document.getElementById("productos");
const vistaProducto = document.getElementById("vistaProducto");
const contadorResultados = document.getElementById("contadorResultados");
const bannerCarrusel = document.querySelector(".banner-carrusel");

const catalogo = document.getElementById("catalogo");
const paginacion = document.getElementById("paginacion");
const btnCarritoMobile = document.getElementById("btnCarritoMobile");
const cerrarCarritoMobile = document.getElementById("cerrarCarritoMobile");
const carritoMobile = document.getElementById("carritoMobile");
const miniaturas = document.getElementById("miniaturas");
const detalleImg = document.getElementById("detalleImg");
const detalleNombre = document.getElementById("detalleNombre");
const detalleMarca = document.getElementById("detalleMarca");
const detalleDescripcion = document.getElementById("detalleDescripcion");
const detalleTalle = document.getElementById("detalleTalle");
const detalleCantidad = document.getElementById("detalleCantidad");
const listaCarritoDetalle = document.getElementById("listaCarritoDetalle");

const previewCarrito = document.getElementById("previewCarrito");
const btnCarrito = document.getElementById("btnCarrito");
const carritoSec = document.getElementById("carrito");
const listaCarritoDesktop = document.getElementById("listaCarritoDesktop");
const listaCarritoMobile = document.getElementById("listaCarritoMobile");
const relacionados = document.getElementById("relacionados");
const selectCategoria = document.getElementById("selectCategoria");
const selectMarca = document.getElementById("selectMarca");
const selectOrden = document.getElementById("selectOrden");
const categoriasHome = [
  { nombre: "Calzado", img: "imagenes/logos/logocalzado.png" },
  { nombre: "Guantes", img: "imagenes/logos/logoguantes.png" },
  { nombre: "Indumentaria", img: "imagenes/logos/camisin.png" },
  { nombre: "Protección en altura", img: "imagenes/logos/altura.png" },
  { nombre: "Protección craneal", img: "imagenes/logos/craneal.png" },
  { nombre: "Protección facial", img: "imagenes/logos/facial.png" },
  { nombre: "Protección auditiva", img: "imagenes/logos/auditiva.png" },
  { nombre: "Protección ocular", img: "imagenes/logos/ocular.png" },
  { nombre: "Protección respiratoria", img: "imagenes/logos/respiratoria.png" },
  { nombre: "Sujeción de cargas", img: "imagenes/logos/cargas.png" },
  { nombre: "Insumos", img: "imagenes/logos/insumos.png" }
];
const marcas = [
  {nombre: 'OMBU', imagen: 'imagenes/marcas/ombu.png'},
  {nombre: 'CAS', imagen: 'imagenes/marcas/cas.png'},
  {nombre: 'AIRE LIBRE', imagen: 'imagenes/marcas/airelibre.webp'},
  {nombre: 'BLADI', imagen: 'imagenes/marcas/bladi.png'},
  {nombre: 'PAMPERO', imagen: 'imagenes/marcas/pampero.webp'},
  {nombre: 'LIBUS', imagen: 'imagenes/marcas/libus.png'},
  {nombre: 'S.P.I SHIELD', imagen: 'imagenes/marcas/spi.webp'},
  {nombre: 'GEO', imagen: 'imagenes/marcas/geo.png'},
  {nombre: 'NARVIC', imagen: 'imagenes/marcas/narvic.png'},
  {nombre: 'GUADAL', imagen: 'imagenes/marcas/guadal.png'},
  {nombre: 'DE PASCALE', imagen: 'imagenes/marcas/depascale.png'},
  {nombre: 'WORK SAFE', imagen: 'imagenes/marcas/worksafe.avif'},
  {nombre: 'VICSA', imagen: 'imagenes/marcas/vicsa.jpg'},
  {nombre: 'GUPLASTEX', imagen: 'imagenes/marcas/guplastex.png'},
  {nombre: 'BELLAZZI', imagen: 'imagenes/marcas/bellazzi.png'},
  {nombre: 'GLOVEX', imagen: 'imagenes/marcas/glovex.png'},
  {nombre: 'DELTA PLUS', imagen: 'imagenes/marcas/deltaplus.svg'},
  {nombre: 'STEELPRO', imagen: 'imagenes/marcas/steelpro.png'},
  {nombre: 'FRAVIDA', imagen: 'imagenes/marcas/fravida.png'},
  {nombre: '3M', imagen: 'imagenes/marcas/3m.jpg'},
  {nombre: 'BLACK PANTHER', imagen: 'imagenes/marcas/blackpanther.png'},
  {nombre: 'ELEGANTE', imagen: 'imagenes/marcas/elegante.png'},
  {nombre: 'MAKE', imagen: 'imagenes/marcas/make.png'},
  {nombre: 'PRACTY BOTIQUIN', imagen: 'imagenes/marcas/practybotiquin.png'},
  {nombre: 'YUKON', imagen: 'imagenes/marcas/yukon.png'},
  {nombre: 'LA MEJOR', imagen: 'imagenes/marcas/lamejor.png'}
];

/* =====================
   NAVEGACIÓN
===================== */
function ocultarSecciones() {
  document.querySelectorAll("section").forEach(s => s.classList.add("oculto"));
   if (bannerCarrusel) {
    bannerCarrusel.classList.add("oculto");
    detenerAutoBanner(); // ⛔ frena el autoplay (importante)
  }
  window.scrollTo(0, 0);
}

// =====================
// FILTRO POR MARCA
// =====================
document.addEventListener("click", (e) => {
  const marcaCard = e.target.closest(".marca");
  if (!marcaCard) return;

  const marca = marcaCard.dataset.marca;
  if (!marca) return;

  // 1️⃣ Ocultar todo
  ocultarSecciones();

  // 2️⃣ Mostrar productos
  productosSec.classList.remove("oculto");

  // 3️⃣ Estado global
  marcaActual = marca;
  categoriaActual = "todos";
  subcategoriaActual = "todas";
  paginaActual = 1;
  busquedaActual = "";

  // 4️⃣ Sincronizar selects base
  selectCategoria.value = "todos";
  selectSubcategoria.value = "todas";

  // 5️⃣ 🔑 Cargar marcas ANTES de setear el value
  cargarMarcas();

  // 6️⃣ Ahora sí, seleccionar la marca
  selectMarca.value = marcaActual;

  // 7️⃣ Aplicar filtros
  aplicarFiltros();
});


function mostrarInicio() {
  ocultarSecciones();
// 🔑 reset estado
  categoriaActual = "todos";
  subcategoriaActual = "todas";
  marcaActual = "todas";
  busquedaActual = "";
  inicioSecciones.forEach(sec => {
    if (sec) sec.classList.remove("oculto");
  });
 if (bannerCarrusel) {
    bannerCarrusel.classList.remove("oculto");
    reiniciarAutoBanner();
  }
  renderInicio();
}



function mostrarProductos(lista = productos) {
  ocultarSecciones();
  productosSec.classList.remove("oculto");
  paginaActual = 1;
  listaActual = lista;
  renderProductos(lista);
  cargarMarcas();
}

function renderSubcategorias(categoria) {
  const contenedor = document.getElementById("subcategorias");
  contenedor.innerHTML = "";

  if (categoria === "todos") return;

  const subcategorias = [...new Set(
    productos
      .filter(p => p.categoria === categoria && p.subcategoria)
      .map(p => p.subcategoria)
  )];

  if (subcategorias.length === 0) return;

  subcategorias.forEach(sub => {
    const btn = document.createElement("button");
    btn.textContent = sub;

    btn.onclick = () => {
      document
        .querySelectorAll(".subcategorias button")
        .forEach(b => b.classList.remove("active"));

      btn.classList.add("active");
      subcategoriaActual = sub;
      aplicarFiltros();
    };

    contenedor.appendChild(btn);
  });
}



/* =====================
   BUSCADOR
===================== */
// ===== BUSCADOR MOBILE =====
const btnBuscarMobile = document.getElementById("btnBuscarMobile");
const buscadorMobile = document.getElementById("buscadorMobile");
const cerrarBuscadorMobile = document.getElementById("cerrarBuscadorMobile");

const buscadorMobileInput = document.getElementById("buscadorMobileInput");
const resultadosBuscadorMobile = document.getElementById("resultadosBuscadorMobile");

const inputBuscador = document.getElementById("buscador");
const resultadosBuscador = document.getElementById("resultadosBuscador");
let indiceSeleccionado = -1;
const buscador = document.getElementById("buscador");

buscador.addEventListener("keydown", e => {
  if (e.key === "Enter") {
    e.preventDefault();

    busquedaActual = buscador.value.trim().toLowerCase();

    // Ir a la sección productos
    ocultarSecciones();
    productosSec.classList.remove("oculto");

    aplicarFiltros();
  }
});

function estoyEnInicio() {
  return inicioSecciones.every(sec => sec && !sec.classList.contains("oculto"));
}


function filtrarProductos(texto) {
  return productos.filter(p =>
    p.nombre.toLowerCase().includes(texto) ||
    p.categoria.toLowerCase().includes(texto) ||
    (p.marca && p.marca.toLowerCase().includes(texto))
  );
}

function resaltar(texto, query) {
  if (!query) return texto;

  const safeQuery = query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const regex = new RegExp(`(${safeQuery})`, "ig");

  return texto.replace(regex, "<strong>$1</strong>");
}



if (inputBuscador && resultadosBuscador) {
  inputBuscador.addEventListener("input", e => {
    const textoOriginal = e.target.value.trim();
  const texto = textoOriginal.toLowerCase();

    resultadosBuscador.innerHTML = "";
    indiceSeleccionado = -1;

    // 🔹 AUTOCOMPLETE SOLO EN INICIO
    if (true) {
      if (texto.length < 2) {
        resultadosBuscador.classList.add("oculto");
        return;
      }

      const matches = filtrarProductos(texto);
      if (matches.length === 0) {
        resultadosBuscador.innerHTML = `
          <div class="buscador-sin-resultados">
            No se encontraron productos
          </div>
        `;
        resultadosBuscador.classList.remove("oculto");
        return;
      }
      matches.forEach(p => {
      const imagenSrc = p.colores ? p.colores[0].imagenes[0] : p.imagenes[0];
      const item = document.createElement("div");
      item.className = "buscador-item";
      item.dataset.id = p.id; // 🔑 CLAVE ABSOLUTA
      item.innerHTML = `
      <img src="${imagenSrc}" alt="${p.nombre}">
      <div class="buscador-texto">
        ${resaltar(`${p.marca} | ${p.nombre}`, textoOriginal)}
      </div>
      `;

  item.onclick = () => {
  resultadosBuscador.classList.add("oculto");
  buscadorMobile?.classList.remove("activo");

  inputBuscador.value = "";
  buscadorMobileInput.value = "";

  mostrarDetalle(p.id);
};

  resultadosBuscador.appendChild(item);
  })
  if (matches.length > 0) {
  indiceSeleccionado = -1;
  const items = resultadosBuscador.querySelectorAll(".buscador-item");
  if (items[0]) items[0].classList.add("activo");
  }
  ;

      resultadosBuscador.classList.remove("oculto");
}
  });

  // 🔹 ENTER → IR A PRODUCTOS Y FILTRAR
  inputBuscador.addEventListener("keydown", e => {
  const items = resultadosBuscador.querySelectorAll(".buscador-item");
  if (!items.length) return;

  if (e.key === "ArrowDown") {
    e.preventDefault();
    indiceSeleccionado =
      indiceSeleccionado < items.length - 1 ? indiceSeleccionado + 1 : 0;
  }

  if (e.key === "ArrowUp") {
    e.preventDefault();
    indiceSeleccionado =
      indiceSeleccionado > 0 ? indiceSeleccionado - 1 : items.length - 1;
  }

  if (e.key === "Enter") {
    e.preventDefault();

    if (indiceSeleccionado >= 0) {
      items[indiceSeleccionado].click();
      return;
    }

    const texto = inputBuscador.value.toLowerCase().trim();
    resultadosBuscador.classList.add("oculto");
    mostrarProductos(texto ? filtrarProductos(texto) : productos);
    return;
  }

  items.forEach((item, i) => {
    item.classList.toggle("activo", i === indiceSeleccionado);
  });

  if (indiceSeleccionado >= 0) {
    items[indiceSeleccionado].scrollIntoView({
      block: "nearest",
      behavior: "smooth"
    });
  }
});
document.addEventListener("keydown", e => {
  if (e.key === "Escape") {
    resultadosBuscador.classList.add("oculto");
    indiceSeleccionado = -1;
    inputBuscador.blur();
  }
});
// 🔁 SINCRONIZAR BUSCADOR MOBILE → DESKTOP
buscadorMobileInput?.addEventListener("input", () => {
  inputBuscador.value = buscadorMobileInput.value;
  inputBuscador.dispatchEvent(new Event("input"));
});

}

// 🔁 DUPLICAR RESULTADOS DESKTOP → MOBILE
if (resultadosBuscador && resultadosBuscadorMobile) {
  const observer = new MutationObserver(() => {
  resultadosBuscadorMobile.innerHTML = resultadosBuscador.innerHTML;
  resultadosBuscadorMobile.classList.remove("oculto");
});

  observer.observe(resultadosBuscador, {
    childList: true,
    subtree: true,
  });
}

document.addEventListener("click", e => {
  if (
    !e.target.closest(".header-search") &&
    !e.target.closest(".buscador-mobile")
  ) {
    resultadosBuscador?.classList.add("oculto");
    resultadosBuscadorMobile?.classList.add("oculto");
  }
});

/* =====================
   CATÁLOGO
===================== */
function mostrarSkeleton() {
  catalogo.innerHTML = "";
  for (let i = 0; i < productosPorPagina; i++) {
    catalogo.innerHTML += `<div class="skeleton-card"></div>`;
  }
}
function actualizarContador(total, ini, fin) {
  contadorResultados.textContent =
    `Mostrando ${ini + 1}–${fin} / ${total}`;
}
function volverAlCatalogo() {
  ocultarSecciones();
  productosSec.classList.remove("oculto");

  paginaActual = 1;

  // 🔑 volver a aplicar filtros reales
  aplicarFiltros();
}


function renderProductos(lista) {
  mostrarSkeleton();

  setTimeout(() => {
    catalogo.innerHTML = "";

    const total = lista.length;
    const ini = (paginaActual - 1) * productosPorPagina;
    const fin = Math.min(ini + productosPorPagina, total);

    lista.slice(ini, fin).forEach(p => {
      const imagenSrc = p.colores ? p.colores[0].imagenes[0] : p.imagenes[0];

      catalogo.innerHTML += `
        <div class="card fade-page">
          <span class="badge">${p.categoria}</span>
          <img src="${imagenSrc}" alt="${p.nombre}">
          <h4>${p.marca} | ${p.nombre}</h4>
          <button class="btn-ver" onclick="mostrarDetalle('${p.id}')">
            Ver en detalle
          </button>
        </div>
      `;
    });
    if (lista.length != 0){
    actualizarContador(total, ini, fin);
    renderPaginacion(total);
    }
  }, 400);
}
function cargarSubcategorias() {
  selectSubcategoria.innerHTML = `<option value="todas">Todas</option>`;

  if (categoriaActual === "todos") return;

  const subcategorias = new Set();

  productos.forEach(p => {
    if (p.categoria === categoriaActual && p.subcategoria) {
      subcategorias.add(p.subcategoria);
    }
  });

  // 🔽 ORDEN ALFABÉTICO
  [...subcategorias]
    .sort((a, b) => a.localeCompare(b, "es", { sensitivity: "base" }))
    .forEach(sub => {
      const opt = document.createElement("option");
      opt.value = sub;
      opt.textContent = sub;
      selectSubcategoria.appendChild(opt);
    });
}


selectCategoria.addEventListener("change", e => {
  categoriaActual = e.target.value;

  subcategoriaActual = "todas";
  selectSubcategoria.value = "todas";

  cargarMarcas();
  cargarSubcategorias();
  aplicarFiltros();
});

selectSubcategoria.addEventListener("change", e => {
  subcategoriaActual = e.target.value;
  aplicarFiltros();
});


function cambiarCategoria(categoria) {
  categoriaActual = categoria;
  subcategoriaActual = "todas";
  paginaActual = 1;

  selectCategoria.value = categoria;
  selectSubcategoria.value = "todas";

  cargarMarcas();
  cargarSubcategorias();
  aplicarFiltros();
}

function renderPaginacion(total) {
  paginacion.innerHTML = "";

  const totalPaginas = Math.ceil(total / productosPorPagina);
  if (totalPaginas <= 1) return;

  const ancho = window.innerWidth;

  // 🔹 Cantidad máxima de números visibles según ancho
  let maxNumeros;

  if (ancho < 480) {
    maxNumeros = 3; // mobile chico
  } else if (ancho < 768) {
    maxNumeros = 5; // mobile grande
  } else {
    maxNumeros = 9; // desktop
  }

  // 🔹 BOTÓN ANTERIOR
  const btnPrev = document.createElement("button");
  btnPrev.textContent = "‹";
  btnPrev.disabled = paginaActual === 1;
  btnPrev.onclick = () => cambiarPagina(paginaActual - 1);
  paginacion.appendChild(btnPrev);

  let inicio = Math.max(1, paginaActual - Math.floor(maxNumeros / 2));
  let fin = inicio + maxNumeros - 1;

  if (fin > totalPaginas) {
    fin = totalPaginas;
    inicio = Math.max(1, fin - maxNumeros + 1);
  }

  // 🔹 Mostrar primera página + ...
  if (inicio > 1) {
    agregarBotonPagina(1);
    if (inicio > 2) {
      agregarEllipsis();
    }
  }

  // 🔹 Números centrales
  for (let i = inicio; i <= fin; i++) {
    agregarBotonPagina(i);
  }

  // 🔹 Mostrar ... + última página
  if (fin < totalPaginas) {
    if (fin < totalPaginas - 1) {
      agregarEllipsis();
    }
    agregarBotonPagina(totalPaginas);
  }

  // 🔹 BOTÓN SIGUIENTE
  const btnNext = document.createElement("button");
  btnNext.textContent = "›";
  btnNext.disabled = paginaActual === totalPaginas;
  btnNext.onclick = () => cambiarPagina(paginaActual + 1);
  paginacion.appendChild(btnNext);

  // 🔹 Funciones auxiliares
  function agregarBotonPagina(numero) {
    const btn = document.createElement("button");
    btn.textContent = numero;

    if (numero === paginaActual) {
      btn.classList.add("activa");
      btn.disabled = true;
    }

    btn.onclick = () => cambiarPagina(numero);
    paginacion.appendChild(btn);
  }

  function agregarEllipsis() {
    const span = document.createElement("button");
    span.textContent = "...";
    span.disabled = true;
    paginacion.appendChild(span);
  }
}
function crearBotonNumero(i, totalPaginas) {
  const btn = document.createElement("button");
  btn.textContent = i;

  if (i === paginaActual) {
    btn.classList.add("activa");
    btn.disabled = true;
  }

  btn.onclick = () => cambiarPagina(i);
  return btn;
}
window.addEventListener("resize", () => {
  renderPaginacion(listaActual.length);
});
function crearEllipsis() {
  const btn = document.createElement("button");
  btn.textContent = "...";
  btn.disabled = true;
  return btn;
}
window.addEventListener("resize", () => {
  renderPaginacion(productosFiltrados.length);
});
function cambiarPagina(p) {
  paginaActual = p;
  renderProductos(listaActual);
}
function aplicarFiltros() {
  let lista = [...productos];

  // Categoría
  if (categoriaActual !== "todos") {
    lista = lista.filter(p => p.categoria === categoriaActual);
  }

  // Subcategoría (solo si categoría está aplicada)
  if (
    categoriaActual !== "todos" &&
    subcategoriaActual !== "todas"
  ) {
    lista = lista.filter(p => p.subcategoria === subcategoriaActual);
  }

  // Marca (SIEMPRE independiente)
  if (marcaActual !== "todas") {
    lista = lista.filter(p => p.marca === marcaActual);
  }
  // 🔍 Búsqueda por texto
if (busquedaActual) {
  lista = lista.filter(p =>
    p.nombre.toLowerCase().includes(busquedaActual) ||
    (p.marca && p.marca.toLowerCase().includes(busquedaActual)) ||
    (p.categoria && p.categoria.toLowerCase().includes(busquedaActual)) ||
    (p.subcategoria && p.subcategoria.toLowerCase().includes(busquedaActual))
  );
}

  // Orden
  if (ordenActual === "az") {
    lista.sort((a, b) => a.nombre.localeCompare(b.nombre));
  } else {
    lista.sort((a, b) => b.nombre.localeCompare(a.nombre));
  }

  listaActual = lista;
  paginaActual = 1;

   // 🔥 SI NO HAY RESULTADOS
  if (lista.length === 0) {
    catalogo.innerHTML = `
      <div class="sin-resultados">
        <h3>No encontramos productos para "${busquedaActual}"</h3>
        <p>Intentá con otra palabra clave.</p>
      </div>
    `;
    return;
  }
  renderProductos(listaActual);
  renderFiltrosActivos();

}



selectCategoria.addEventListener("change", e => {
  categoriaActual = e.target.value; 
  cargarMarcas();
  renderSubcategorias(categoriaActual);
  aplicarFiltros();
});

selectMarca.addEventListener("change", e => {
  marcaActual = e.target.value;
  aplicarFiltros();
});

selectOrden.addEventListener("change", e => {
  ordenActual = e.target.value;
  aplicarFiltros();
});
function cargarMarcas() {
  const marcas = new Set();

  productos.forEach(p => {
    if (categoriaActual === "todos" || p.categoria === categoriaActual) {
      if (p.marca) marcas.add(p.marca);
    }
  });

  selectMarca.innerHTML = `<option value="todas">Todas</option>`;

  [...marcas].sort((a, b) => a.localeCompare(b, "es", { sensitivity: "base" }))
    .forEach(m => {
      selectMarca.innerHTML += `<option value="${m}">${m}</option>`;
    });

  // ❌ NO hacer esto siempre
  // marcaActual = "todas";

  // ✅ solo si la marca actual ya no existe
  if (![...marcas].includes(marcaActual)) {
    marcaActual = "todas";
    selectMarca.value = "todas";
  } else {
    selectMarca.value = marcaActual;
  }
}
function renderFiltrosActivos() {
  const cont = document.getElementById("filtrosActivos");
  cont.innerHTML = "";

  const activos = [];

  if (categoriaActual !== "todos") {
    activos.push({ tipo: "categoria", valor: categoriaActual });
  }

  if (
  categoriaActual !== "todos" &&
  subcategoriaActual &&
  subcategoriaActual !== "todas") {
  
    activos.push({ tipo: "subcategoria", valor: subcategoriaActual });
  }

  if (marcaActual !== "todas") {
    activos.push({ tipo: "marca", valor: marcaActual });
  }
if (busquedaActual && busquedaActual.trim() !== "") {
  activos.push({
    tipo: "busqueda",
    valor: `Búsqueda: "${busquedaActual}"`
  });
}


  activos.forEach(f => {
    const tag = document.createElement("div");
    tag.className = "filtro-activo";
    tag.innerHTML = `
      ${f.valor}
      <button onclick="quitarFiltro('${f.tipo}')">×</button>
    `;
    cont.appendChild(tag);
  });

  if (activos.length) {
    const btn = document.createElement("button");
    btn.className = "btn-limpiar";
    btn.textContent = "Limpiar filtros";
    btn.onclick = limpiarFiltros;
    cont.appendChild(btn);
  }
}
function quitarFiltro(tipo) {

  if (tipo === "categoria") {
    categoriaActual = "todos";
    subcategoriaActual = "todas";
    selectCategoria.value = "todos";
    selectSubcategoria.value = "todas";
  }

  if (tipo === "subcategoria") {
    subcategoriaActual = "todas";
    selectSubcategoria.value = "todas";
  }

  if (tipo === "marca") {
    marcaActual = "todas";
    selectMarca.value = "todas";
  }

  if (tipo === "busqueda") {
    busquedaActual = "";
    buscador.value = "";
  }

  aplicarFiltros();
}

function limpiarFiltros() {
  categoriaActual = "todos";
  subcategoriaActual = "todas";
  marcaActual = "todas";
  ordenActual = "az";
  paginaActual = 1;

  // sincronizar selects
  selectCategoria.value = "todos";
  selectSubcategoria.value = "todas";
  selectMarca.value = "todas";
  selectOrden.value = "az";
  busquedaActual = "";
  buscador.value = "";

  cargarMarcas();
  cargarSubcategorias();

  // aplicar UNA sola vez
  aplicarFiltros();
}



/* =====================
   DETALLE
===================== */
function mostrarDetalle(id) {
  ocultarSecciones();
  vistaProducto.classList.remove("oculto");

  productoActual = productos.find(p => p.id === id);
  if (!productoActual) return;

  const imagenesActual = productoActual.colores ? productoActual.colores[0].imagenes : productoActual.imagenes;
galeriaImagenes = [];

if (productoActual.colores) {
  productoActual.colores.forEach((color, colorIndex) => {
    color.imagenes.forEach(img => {
      galeriaImagenes.push({
        src: img,
        colorIndex
      });
    });
  });
} else {
  productoActual.imagenes.forEach(img => {
    galeriaImagenes.push({
      src: img,
      colorIndex: null
    });
  });
}

imagenIndex = 0;
cargarImagenPrincipal();
cargarMiniaturas();


  detalleNombre.innerText = productoActual.marca
  ? `${productoActual.marca} | ${productoActual.nombre}`
  : productoActual.nombre;
  detalleMarca.innerText = productoActual.marca || "";

  prepararTalles();
  prepararCantidad();
  prepararColores();
  cargarImagenPrincipal();
  cargarMiniaturas();
  prepararGaleria();
  renderRelacionados();
  renderCarrito();
  prepararDescripcion()
}

/* =====================
   IMÁGENES
===================== */
function cargarImagenPrincipal() {
  const imagen = galeriaImagenes[imagenIndex];
  if (!imagen) return;

  // animación suave
  detalleImg.classList.add("cambiando");

  setTimeout(() => {
    detalleImg.src = imagen.src;
    detalleImg.classList.remove("cambiando");

    if (imagen.colorIndex !== null) {
      colorSeleccionado = imagen.colorIndex;
      if (detalleColor) detalleColor.value = colorSeleccionado;
      actualizarBadgeColor();
    }
    detalleImg.onclick = abrirZoom;
  }, 150);
}

function cargarMiniaturas() {
  miniaturas.innerHTML = "";

  galeriaImagenes.forEach((img, i) => {
    const thumb = document.createElement("img");
    thumb.src = img.src;
    if (i === imagenIndex) thumb.classList.add("activa");

    thumb.onclick = () => {
      imagenIndex = i;
      cargarImagenPrincipal();
      cargarMiniaturas();
    };

    miniaturas.appendChild(thumb);
  });
}

function moverImagen(dir) {
  imagenIndex += dir;

  if (imagenIndex < 0) imagenIndex = galeriaImagenes.length - 1;
  if (imagenIndex >= galeriaImagenes.length) imagenIndex = 0;

  cargarImagenPrincipal();
  cargarMiniaturas();
}

function prepararGaleria() {
  galeriaImagenes = [];
  imagenIndex = 0;

  if (productoActual.colores) {
    productoActual.colores.forEach((color, cIndex) => {
      color.imagenes.forEach(img => {
        galeriaImagenes.push({
          src: img,
          colorIndex: cIndex
        });
      });
    });
    colorSeleccionado = 0;
  } else {
    productoActual.imagenes.forEach(img => {
      galeriaImagenes.push({ src: img, colorIndex: null });
    });
    colorSeleccionado = null;
  }

  cargarImagenPrincipal();
  cargarMiniaturas();
}

/* =====================
   ZOOM
===================== */
function abrirZoom() {
  const overlay = document.createElement("div");
  overlay.className = "zoom-overlay";
  overlay.innerHTML = `<img src="${galeriaImagenes[imagenIndex].src}">`;
  overlay.onclick = () => overlay.remove();
  document.body.appendChild(overlay);
}


/* =====================
   TALLES / CANTIDAD / COLOR / DESCRIPCION
===================== */
function prepararDescripcion() {
  const contenedor = document.getElementById("descripcionProducto");
  const tabInfo = document.getElementById("tab-info");
  const tabSpecs = document.getElementById("tab-specs");
  const tabDocs = document.getElementById("tab-docs");

  tabInfo.innerHTML = "";
  tabSpecs.innerHTML = "";
  tabDocs.innerHTML = "";

  let hayContenido = false;

  // INFO
  if (productoActual.Descripcion) {
    productoActual.Descripcion.split("\n").forEach(l => {
      if (l.trim()) tabInfo.innerHTML += `<p>${l}</p>`;
    });
    hayContenido = true;
  }

// ESPECIFICACIONES
if (productoActual.Especificaciones) {
  tabSpecs.innerHTML = "<ul>";

  productoActual.Especificaciones.split("\n").forEach(linea => {
    let texto = linea;

    if (!texto) return;

    // 🔥 LIMPIEZA TOTAL (CLAVE)
    texto = texto
      .replace(/^[^A-Za-z0-9ÁÉÍÓÚáéíóúÑñ]+/g, "") // elimina viñetas raras
      .replace(/\s+/g, " ")
      .trim();

    if (!texto) return;

    const partes = texto.split(":");
    const titulo = partes[0]?.trim();
    const valor = partes.slice(1).join(":").trim();

    if (valor) {
      tabSpecs.innerHTML += `
        <li><strong>${titulo}:</strong> ${valor}</li>
      `;
    } else {
      tabSpecs.innerHTML += `<li>${titulo}</li>`;
    }
  });

  tabSpecs.innerHTML += "</ul>";
}




  // DOCUMENTACIÓN
  if (productoActual.Documentacion) {
    productoActual.Documentacion.forEach(doc => {
      tabDocs.innerHTML += `
        <a href="${doc.url}" target="_blank">
          <i class="fa-solid fa-file-pdf"></i> ${doc.nombre}
        </a>
      `;
    });
    hayContenido = true;
  }

  if (!hayContenido) {
    contenedor.classList.add("oculto");
    return;
  }

  contenedor.classList.remove("oculto");

  // Tabs
  document.querySelectorAll(".tab-btn").forEach(btn => {
    btn.onclick = () => {
      document.querySelectorAll(".tab-btn").forEach(b => b.classList.remove("activo"));
      document.querySelectorAll(".tab-panel").forEach(p => p.classList.remove("activo"));

      btn.classList.add("activo");
      document.getElementById(`tab-${btn.dataset.tab}`).classList.add("activo");
    };
  });
}



function prepararTalles() {
  const campoTalle = document.getElementById("campoTalle");
  detalleTalle.innerHTML = "";

  let talles = [];

  if (Array.isArray(productoActual.talles)) {
    // Caso ideal: [35, 36, 37, 38, ...]
    talles = productoActual.talles;

  }

  if (talles.length) {
    campoTalle.classList.remove("oculto");

    detalleTalle.innerHTML =
      `<option value="" disabled selected>Seleccionar talle</option>`;

    talles.forEach(t => {
      detalleTalle.innerHTML += `<option value="${t}">${t}</option>`;
    });

  } else {
    campoTalle.classList.add("oculto");
  }
}


function prepararCantidad() {
  detalleCantidad.value = "";
  detalleCantidad.oninput = () => {
    if (detalleCantidad.value !== "" && detalleCantidad.value < 1) {
      detalleCantidad.value = 1;
    }
  };
}

function prepararColores() {
  const labelColor = document.getElementById("labelColor");
  coloresProducto.innerHTML = "";

  // 🔴 SI NO TIENE COLORES → OCULTAR TODO
  if (!productoActual.colores || productoActual.colores.length === 0) {
    coloresProducto.classList.add("oculto");
    labelColor.classList.add("oculto");
    colorSeleccionado = null;
    return;
  }

  // 🟢 SI TIENE COLORES → MOSTRAR TODO
  coloresProducto.classList.remove("oculto");
  labelColor.classList.remove("oculto");

  colorSeleccionado = 0;

  productoActual.colores.forEach((color, index) => {
    const item = document.createElement("div");
    item.className = "color-item";
    item.title = color.nombre;

    item.style.background = obtenerColorCSS(color.nombre);

    if (index === 0) item.classList.add("activo");

    item.onclick = () => {
      colorSeleccionado = index;

      document
        .querySelectorAll(".color-item")
        .forEach(c => c.classList.remove("activo"));

      item.classList.add("activo");

      const primeraImgColor = galeriaImagenes.findIndex(
        img => img.colorIndex === index
      );

      if (primeraImgColor !== -1) {
        imagenIndex = primeraImgColor;
        cargarImagenPrincipal();
        cargarMiniaturas();
      }

      actualizarBadgeColor();
    };

    coloresProducto.appendChild(item);
  });
}

function obtenerColorCSS(nombre) {
  const mapa = {
    negro: "#000",
    petroleo: "#1b1e35ff",
    gris: "#888",
    beige: "#d6c3a3",
    marron: "rgb(146, 91, 2)",
    blanco: "#fff",
    azul: "#002678",
    rojo: "#e53935",
    verde: "#43a047",
    amarillo: "#fdd835",
    naranja: "#fb8c00",
    azulino: "#318bc8",
    caqui: "#f2debc",
    "verde oliva": "#495745",
    "azul marino": "#061534"
  };

  return mapa[nombre.toLowerCase()] || "#ccc";
}

function actualizarBadgeColor() {
  const badge = document.getElementById("badgeColor");
  if (!badge || colorSeleccionado === null || !productoActual.colores) {
    badge?.classList.add("oculto");
    return;
  }

  badge.textContent = productoActual.colores[colorSeleccionado].nombre;
  badge.classList.remove("oculto");
}

/* =====================
   CARRITO
===================== */
function agregarDesdeDetalle() {
  if (productoActual.talles?.length && !detalleTalle.value) {
  alert("Seleccioná un talle");
  return;
}

if (!detalleCantidad.value || detalleCantidad.value < 1) {
  alert("Ingresá una cantidad válida");
  return;
}
  const cantidad = parseInt(detalleCantidad.value);
  const talle = !detalleTalle.classList.contains("oculto") ? detalleTalle.value : null;
  const color = productoActual.colores ? productoActual.colores[colorSeleccionado].nombre : null;  // Cambia: guarda siempre si hay colores

  const existente = carrito.find(p => p.id === productoActual.id && p.talle === talle && p.color === color);
  if (existente) existente.cantidad += cantidad;
  else carrito.push({ ...productoActual, cantidad, talle, color });

  localStorage.setItem("carrito", JSON.stringify(carrito));
  renderCarrito();
  mostrarNotificacion();
  actualizarContadorCarrito();
  console.log("Fin de agregarDesdeDetalle");  
}

function renderCarrito() {
  listaCarritoDetalle.innerHTML = "";
  carrito.forEach((p, i) => {
    listaCarritoDetalle.innerHTML += `
  <li>
    ${p.marca} | ${p.nombre} ${p.talle ? `(${p.talle})` : ""} ${p.color ? ` - ${p.color}` : ""} x ${p.cantidad}
    <button onclick="eliminarDelCarrito(${i})">✕</button>
  </li>
`;
  })
  actualizarContadorCarrito();
  actualizarResumenCarrito();
}
function eliminarDelCarrito(index) {
  carrito.splice(index, 1);
  localStorage.setItem("carrito", JSON.stringify(carrito));
  renderCarrito();
  actualizarContadorCarrito();
}
function actualizarContadorCarrito() {
  const carrito = JSON.parse(localStorage.getItem("carrito")) || [];

  const total = carrito.reduce((acc, item) => acc + item.cantidad, 0);

  const contadorDesktop = document.getElementById("contadorCarrito");
  const contadorMobile = document.getElementById("contadorCarritoMobile");

  if (contadorDesktop) contadorDesktop.textContent = total;
  if (contadorMobile) contadorMobile.textContent = total;
}


function renderPreviewCarrito() {
  if (!previewCarrito) return;

  previewCarrito.innerHTML = "";

  if (carrito.length === 0) {
    previewCarrito.innerHTML = "<p>El carrito está vacío</p>";
    return;
  }

  carrito.forEach(p => {
    let imagenSrc = p.imagenes
      ? p.imagenes[0]
      : (p.colores ? p.colores[0].imagenes[0] : "");

    if (p.colores && p.color) {
      const colorIndex = p.colores.findIndex(c => c.nombre === p.color);
      if (colorIndex !== -1) {
        imagenSrc = p.colores[colorIndex].imagenes[0];
      }
    }

    previewCarrito.innerHTML += `
      <div class="preview-item">
        <img src="${imagenSrc}" alt="${p.nombre}">
        <div>
          <strong>${p.marca} | ${p.nombre}</strong>
          <div>
            Cant: ${p.cantidad}
            ${p.talle ? ` | Talle: ${p.talle}` : ""}
            ${p.color ? ` | Color: ${p.color}` : ""}
          </div>
        </div>
      </div>
    `;
  });
}


let carritoHoverTimeout = null;

// Mostrar preview
btnCarrito.addEventListener("mouseenter", () => {
  clearTimeout(carritoHoverTimeout);
  renderPreviewCarrito();
  previewCarrito.classList.add("activo");
});

// Ocultar preview con delay
btnCarrito.addEventListener("mouseleave", () => {
  carritoHoverTimeout = setTimeout(() => {
    previewCarrito.classList.remove("activo");
  }, 200);
});

// Mantener abierto si el mouse entra al preview
previewCarrito.addEventListener("mouseenter", () => {
  clearTimeout(carritoHoverTimeout);
  previewCarrito.classList.add("activo");
});

// Cerrar al salir del preview
previewCarrito.addEventListener("mouseleave", () => {
  carritoHoverTimeout = setTimeout(() => {
    previewCarrito.classList.remove("activo");
  }, 200);
});



function mostrarCarrito() {
  ocultarSecciones();
  carritoSec.classList.remove("oculto");
  renderCarritoCompleto();
  if (window.innerWidth <= 768) {
  document.getElementById("carritoMobile").classList.add("activo");
  renderCarritoMobile();
return;
}
}
function renderCarritoCompleto() {
  listaCarritoDesktop.innerHTML = "";

  if (carrito.length === 0) {
    listaCarritoDesktop.innerHTML = "<p>No hay productos en el carrito.</p>";
    return;
  }

  carrito.forEach((p, i) => {
    let imagenSrc = p.imagenes ? p.imagenes[0] : (p.colores ? p.colores[0].imagenes[0] : "");
    if (p.colores && p.color) {
      const colorIndex = p.colores.findIndex(c => c.nombre === p.color);
      if (colorIndex !== -1) {
        imagenSrc = p.colores[colorIndex].imagenes[0];
      }
    }

    listaCarritoDesktop.innerHTML += `
      <div class="card">
        <img src="${imagenSrc}" alt="${p.nombre}">
        <h4>${p.marca} | ${p.nombre}</h4>
        <p>Cantidad: ${p.cantidad}</p>
        ${p.talle ? `<p>Talle: ${p.talle}</p>` : ""}
        ${p.color ? `<p>Color: ${p.color}</p>` : ""}
        <button onclick="carrito.splice(${i},1);guardarCarrito()">Eliminar</button>
      </div>
    `;
  });
  actualizarResumenCarrito();
}
function guardarCarrito() {
  localStorage.setItem("carrito", JSON.stringify(carrito));
  actualizarContadorCarrito();
  renderCarritoCompleto();
}
function mostrarNotificacion() {
  const noti = document.getElementById("notificacion");
  if (!noti) return;

  noti.classList.remove("oculto");

  setTimeout(() => {
    noti.classList.add("oculto");
  }, 2000);
}

/* =====================
   RELACIONADOS
===================== */
function renderRelacionados() {
  const carrusel = document.getElementById("carruselRelacionados");
  carrusel.innerHTML = "";
  indiceCarrusel = 0;

  // 1️⃣ Primero intentamos por SUBCATEGORÍA
  let relacionadosFiltrados = productos.filter(
    p =>
      p.categoria === productoActual.categoria &&
      p.subcategoria === productoActual.subcategoria &&
      p.id !== productoActual.id
  );

  // 2️⃣ Si no hay resultados, buscamos solo por CATEGORÍA
  if (relacionadosFiltrados.length === 0) {
    relacionadosFiltrados = productos.filter(
      p =>
        p.categoria === productoActual.categoria &&
        p.id !== productoActual.id
    );
  }

  // 3️⃣ Renderizamos
  relacionadosFiltrados.forEach(p => {
    const imagenSrc = p.colores
      ? p.colores[0].imagenes[0]
      : p.imagenes[0];

    const card = document.createElement("div");
    card.className = "card";
    card.onclick = () => mostrarDetalle(p.id);

    card.innerHTML = `
      <img src="${imagenSrc}" alt="${p.nombre}">
      <h4>${p.marca} | ${p.nombre}</h4>
      <button class="btn-ver fijo" onclick="mostrarDetalle('${p.id}')">
        Ver detalle
      </button>
    `;

    carrusel.appendChild(card);
  });

  actualizarCarrusel();
}
function moverCarrusel(dir) {
  const cards = document.querySelectorAll("#carruselRelacionados .card");
  const totalGrupos = Math.ceil(cards.length / productosPorCarrusel);

  indiceCarrusel += dir;
  if (indiceCarrusel < 0) indiceCarrusel = totalGrupos - 1;
  if (indiceCarrusel >= totalGrupos) indiceCarrusel = 0;

  actualizarCarrusel();
}

function actualizarCarrusel() {
  const track = document.getElementById("carruselRelacionados");
  const card = track.querySelector(".card");
if (!card) return;

const cardWidth = card.offsetWidth + 20;
const desplazamiento = indiceCarrusel * productosPorCarrusel * cardWidth;

track.style.transform = `translateX(-${desplazamiento}px)`;
}
detalleImg.onclick = abrirZoom;
/* =====================
   WHATSAPP
===================== */
function enviarWhatsapp() {
  let msg = "Hola, quiero consultar por:\n";
  carrito.forEach(p => {
    msg += `-${p.marca} | ${p.nombre} ${p.talle ? `(${p.talle})` : ""} ${p.color ? ` - ${p.color}` : ""} x ${p.cantidad}\n`;
  });
  window.open(`https://wa.me/5493564598969?text=${encodeURIComponent(msg)}`);
}

/* =====================
   EVENTOS
===================== */


//INICIO 
function filtrarYMostrar(categoria) {
  // 1️⃣ Actualizar estado global
  categoriaActual = categoria;
  subcategoriaActual = "todas";
  marcaActual = "todas";
  paginaActual = 1;

  // 2️⃣ Sincronizar selects de la sidebar
  selectCategoria.value = categoria;
  selectSubcategoria.value = "todas";
  selectMarca.value = "todas";

  // 3️⃣ Mostrar sección productos
  ocultarSecciones();
  productosSec.classList.remove("oculto");

  // 4️⃣ Cargar filtros dependientes
  cargarMarcas();
  cargarSubcategorias();

  // 5️⃣ Aplicar filtros (esto renderiza todo)
  aplicarFiltros();
}

function renderInicio() {
  renderCategoriasHome();                // crea las cards
  renderDestacados();
  renderBanner();
  iniciarAutoBanner();
  renderMarcas();
}

function renderCategoriasHome() {
  const container = document.getElementById("categoriasContainer");
  if (!container) return;
  container.innerHTML = ""; 

  // Renderizar solo las 8 categorías originales
  categoriasHome.forEach(cat => {
    container.innerHTML += `
      <div class="categoria-card">
        <h3>${cat.nombre}</h3>
        <img src="${cat.img}" alt="${cat.nombre}">
        <button onclick="filtrarYMostrar('${cat.nombre}')">
          Ver productos
        </button>
      </div>
    `;
  });
}

function moverCategoria(direccion) {
  const viewport = document.querySelector(".categorias-viewport");
  const track = document.getElementById("categoriasContainer");
  const cards = track.querySelectorAll(".categoria-card");

  if (!viewport || cards.length === 0) return;

  const gap = 16;
  const anchoCard = cards[0].offsetWidth + gap;

  const visibles = Math.floor(viewport.offsetWidth / anchoCard);
  const maxIndice = cards.length - visibles;

  indiceCategoria += direccion;
  indiceCategoria = Math.max(0, Math.min(indiceCategoria, maxIndice));

  viewport.scrollTo({
    left: indiceCategoria * anchoCard,
    behavior: "smooth"
  });
}


//DESTACADOS

let indiceDestacados = 0;
const productosPorDestacado = 5;

function renderDestacados() {
  const track = document.getElementById("trackDestacados");
  if (!track) return;

  track.innerHTML = "";
  indiceDestacados = 0;

  // 🔴 RESET CLAVE
  track.style.transform = "translateX(0%)";

  const destacados = productos
    .filter(p => p.destacado)
    .sort(() => Math.random() - 0.5)
    .slice(0, 20);

  destacados.forEach(p => {
    const imagen = p.colores
      ? p.colores[0].imagenes[0]
      : p.imagenes[0];

    track.innerHTML += `
      <div class="card">
        <span class="badge">${p.categoria}</span>
        <img src="${imagen}" alt="${p.nombre}">
        <h4>${p.marca} | ${p.nombre}</h4>
        <button class="btn-ver-des" onclick="mostrarDetalle('${p.id}')">
          Ver en detalle
        </button>
      </div>
    `;
  });
}


function moverDestacados(dir) {
  const track = document.getElementById("trackDestacados");
  const tot = Math.ceil(
    document.querySelectorAll("#trackDestacados .card").length / productosPorDestacado
  );

  indiceDestacados += dir;
  if (indiceDestacados < 0) indiceDestacados = tot - 1;
  if (indiceDestacados >= tot) indiceDestacados = 0;

  const card = track.querySelector(".card");
if (!card) return;

const cardWidth = card.offsetWidth + 12; // gap
const desplazamiento = indiceDestacados * productosPorDestacado * cardWidth;

track.style.transform = `translateX(-${desplazamiento}px)`;


}
/* =====================
   CARRUSEL BANNER
===================== */
const bannerTrack = document.getElementById("bannerTrack");
const bannerIndicadores = document.getElementById("bannerIndicadores");

const bannerImagenes = [
  "imagenes/Grafico/banner.png",
  "imagenes/Grafico/banner1.webp",
  "imagenes/Grafico/banner2.webp",
  "imagenes/Grafico/banner3.webp",
  "imagenes/Grafico/banner4.png",
  "imagenes/Grafico/banner5.jpg"
];

let bannerIndex = 0;
let bannerAutoInterval = null;
let bannerAutoTimeout = null;

function renderBanner() {
  bannerTrack.innerHTML = "";
  bannerIndicadores.innerHTML = "";

  bannerImagenes.forEach((src, i) => {
    const slide = document.createElement("div");
    slide.className = "banner-slide";

    const img = document.createElement("img");
    img.src = src;
    img.alt = `Banner ${i+1}`;
    slide.appendChild(img);
    bannerTrack.appendChild(slide);

    const indicador = document.createElement("div");
    indicador.className = "banner-indicador";
    if (i === bannerIndex) indicador.classList.add("activo");
    indicador.onclick = () => irABanner(i);
    bannerIndicadores.appendChild(indicador);

    // Cuando la imagen carga, si es la actual, ajusta el contenedor
    img.addEventListener("load", () => {
      if (i === bannerIndex) ajustarAlturaContenedor();
    });
  });

  // Observador para cambios de tamaño (responsive)
  if (window.ResizeObserver) {
    const ro = new ResizeObserver(() => ajustarAlturaContenedor());
    ro.observe(document.querySelector('.banner-carrusel'));
    // opcional: también observar imágenes si quieres
  } else {
    window.addEventListener('resize', ajustarAlturaContenedor);
  }

  actualizarBannerPosicion(true);
}

// Actualizar posición del track (sin cambios dinámicos de alto)
function ajustarAlturaContenedor() {
  const contenedor = document.querySelector('.banner-carrusel');
  const slideActual = bannerTrack.querySelector(`.banner-slide:nth-child(${bannerIndex + 1})`);
  if (!slideActual) return;

  const img = slideActual.querySelector('img');
  if (img && img.complete) {
    // usa offsetHeight real de la imagen renderizada
    const alto = img.offsetHeight;
    if (alto && alto > 0) contenedor.style.height = alto + 'px';
  } else if (img) {
    img.onload = () => {
      const alto = img.offsetHeight;
      if (alto && alto > 0) contenedor.style.height = alto + 'px';
    };
  }
}

function actualizarIndicadores() {
  const indicadores = bannerIndicadores.querySelectorAll(".banner-indicador");
  indicadores.forEach((ind, i) => ind.classList.toggle("activo", i === bannerIndex));
}

function actualizarBannerPosicion(skipAdjust) {
  const offset = -bannerIndex * 100;
  bannerTrack.style.transform = `translateX(${offset}%)`;
  actualizarIndicadores();
  if (!skipAdjust) {
    // espera un frame para que el navegador haya aplicado transform y layout
    requestAnimationFrame(ajustarAlturaContenedor);
  } else {
    // al render inicial, forzamos ajuste
    ajustarAlturaContenedor();
  }
}



// Función para mover el banner (reinicia timeout)
function moverBanner(dir) {
  bannerIndex = (bannerIndex + dir + bannerImagenes.length) % bannerImagenes.length;
  actualizarBannerPosicion();
  reiniciarAutoBanner();
}

function irABanner(index) {
  bannerIndex = index;
  actualizarBannerPosicion();
  reiniciarAutoBanner();
}

function iniciarAutoBanner() {
  detenerAutoBanner();
  bannerAutoTimeout = setTimeout(() => {
    bannerAutoInterval = setInterval(() => moverBanner(1), 5000);
  }, 3000);
}

function detenerAutoBanner() {
  clearTimeout(bannerAutoTimeout);
  clearInterval(bannerAutoInterval);
}

function reiniciarAutoBanner() {
  detenerAutoBanner();
  iniciarAutoBanner();
}

// Touch events para móvil (deslizable)
let startX = 0;
let endX = 0;

// Touch events para móvil (reinicia timeout)
bannerTrack.addEventListener("touchstart", (e) => {
  startX = e.touches[0].clientX;
  detenerAutoBanner();  // Pausa inmediatamente
});

bannerTrack.addEventListener("touchend", (e) => {
  endX = e.changedTouches[0].clientX;
  const diff = startX - endX;
  if (Math.abs(diff) > 50) {
    if (diff > 0) moverBanner(1);
    else moverBanner(-1);
  }
  reiniciarAutoBanner();  // Reinicia después de swipe
});


document.addEventListener("DOMContentLoaded", () => {
  actualizarContadorCarrito();

  btnInicio.onclick = mostrarInicio;
  btnProductos.onclick = () => mostrarProductos();
  volverCatalogo.onclick = volverAlCatalogo;
  detalleAgregar.onclick = agregarDesdeDetalle;
  btnCarrito.onclick = mostrarCarrito;

  mostrarInicio(); // 👈 ESTO ES CLAVE
  if (btnCarritoMobile) btnCarritoMobile.onclick = mostrarCarritoMobile;
  if (cerrarCarritoMobile) cerrarCarritoMobile.onclick = cerrarCarritoMobileFunc;

  // =====================
// MENÚ MOBILE
// =====================

const btnMenuMobile = document.querySelector(".btn-menu-mobile");
const menuMobile = document.getElementById("menuMobile");
const cerrarMenuMobile = document.getElementById("cerrarMenuMobile");

btnMenuMobile?.addEventListener("click", () => {
  menuMobile.classList.add("activo");
});

cerrarMenuMobile?.addEventListener("click", () => {
  menuMobile.classList.remove("activo");
});

// Navegación
document.querySelectorAll(".menu-link").forEach(btn => {
  btn.addEventListener("click", () => {
    const target = btn.dataset.target;

    if (target === "inicio" && typeof mostrarInicio === "function") {
      mostrarInicio();
    }

    if (target === "productos" && typeof mostrarProductos === "function") {
      mostrarProductos();
    }
    if (target === "nosotros" && typeof mostrarNosotros === "function") {
      mostrarNosotros();
    }
    menuMobile.classList.remove("activo");
  });
});

});

// =====================
// BUSCADOR MOBILE
// =====================
btnBuscarMobile?.addEventListener("click", () => {
  buscadorMobile.classList.add("activo");
  buscadorMobileInput.focus();
});

cerrarBuscadorMobile?.addEventListener("click", () => {
  buscadorMobile.classList.remove("activo");

  buscadorMobileInput.value = "";
  inputBuscador.value = "";

  resultadosBuscador.innerHTML = "";
  resultadosBuscadorMobile.innerHTML = "";
});

const inputBuscadorMobile = document.getElementById("buscadorMobileInput");

/* ENTER EN BUSCADOR MOBILE */
inputBuscadorMobile.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    e.preventDefault();

    const termino = inputBuscadorMobile.value.trim().toLowerCase();
    if (!termino) return;

    // 🔑 actualizar estado global
    busquedaActual = termino;

    // ir a productos
    ocultarSecciones();
    productosSec.classList.remove("oculto");

    aplicarFiltros();

    // cerrar buscador mobile
    buscadorMobile.classList.remove("activo");
    document.body.style.overflow = "";
  }
});


const resultadosMobile = document.getElementById("resultadosBuscadorMobile");

resultadosBuscadorMobile.addEventListener("click", (e) => {
  const item = e.target.closest(".buscador-item");
  if (!item) return;

  const id = item.dataset.id;
  if (!id) return;

  // cerrar buscador
  buscadorMobile.classList.remove("activo");
  document.body.style.overflow = "";

  // mostrar detalle
  mostrarDetalle(id);
});

/* =====================
   CARRITO MÓVIL
===================== */
// Función para mostrar carrito móvil con animación
function mostrarCarritoMobile() {
carritoMobile.classList.remove("oculto"); // 🔑 CLAVE
carritoMobile.classList.add("activo");
renderCarritoMobile();
}

// Función para cerrar carrito móvil
function cerrarCarritoMobileFunc() {
  carritoMobile.classList.remove("activo");
  carritoMobile.classList.add("oculto");
}
function renderCarritoMobile() {
  const lista = document.getElementById("listaCarritoMobile");
  if (!lista) return;

  lista.innerHTML = "";
  if (carrito.length === 0) {
  lista.innerHTML = "<p style='text-align:center;color:#666'>El carrito está vacío</p>";
  return;
  }
  carrito.forEach((p, i) => {
  let imagenSrc = p.imagenes
  ? p.imagenes[0]
  : (p.colores ? p.colores[0].imagenes[0] : "");
  if (p.colores && p.color) {
  const idx = p.colores.findIndex(c => c.nombre === p.color);
  if (idx !== -1) imagenSrc = p.colores[idx].imagenes[0];
}


lista.innerHTML += `
<div class="carrito-item-mobile">
<img src="${imagenSrc}">
<div class="detalles">
<strong>${p.marca} | ${p.nombre}</strong>
<div>Cant: ${p.cantidad}
${p.talle ? ` | Talle: ${p.talle}` : ""}
${p.color ? ` | Color: ${p.color}` : ""}
</div>
</div>
<button onclick="eliminarDelCarrito(${i}); renderCarritoMobile()">×</button>
</div>
`;
});
}

const btnFiltrar = document.querySelector('.btn-filtrar-mobile');
const btnCerrarFiltros = document.querySelector('.btn-cerrar-filtros');
const sidebar = document.querySelector('.productos-sidebar');

if (btnFiltrar && sidebar) {
  btnFiltrar.addEventListener('click', () => {
    sidebar.classList.add('activo');
    btnFiltrar.classList.add('oculto');
  });
}

if (btnCerrarFiltros && sidebar && btnFiltrar) {
  btnCerrarFiltros.addEventListener('click', () => {
  sidebar.classList.add('cerrando');
  setTimeout(() => {
  sidebar.classList.remove('activo', 'cerrando');
  btnFiltrar.classList.remove('oculto');
  }, 250);
  });
}

const btnFiltrarTexto = document.querySelector('.btn-filtrar-mobile');
const contadorFiltrosSpan = document.querySelector('.contador-filtros');


const filtros = [
document.getElementById('selectCategoria'),
document.getElementById('selectSubcategoria'),
document.getElementById('selectOrden'),
document.getElementById('selectMarca')
];


function actualizarContadorFiltros() {
let activos = 0;


filtros.forEach(select => {
if (!select) return;


const valorDefault =
select.querySelector('option')?.value;


if (select.value !== valorDefault) {
activos++;
}
});


if (activos > 0) {
btnFiltrarTexto.innerHTML = `
<i class="fa-solid fa-filter"></i>
Filtrar (${activos})
`;
} else {
btnFiltrarTexto.innerHTML = `
<i class="fa-solid fa-filter"></i>
Filtrar
`;
}
}


// Escuchar cambios en filtros
filtros.forEach(select => {
if (select) {
select.addEventListener('change', actualizarContadorFiltros);
}
});

/* =====================
SWIPE GALERÍA MOBILE
===================== */


let startXDetalle = 0;
let endXDetalle = 0;


detalleImg?.addEventListener("touchstart", (e) => {
startXDetalle = e.touches[0].clientX;
});


detalleImg?.addEventListener("touchend", (e) => {
endXDetalle = e.changedTouches[0].clientX;
const diff = startXDetalle - endXDetalle;


// umbral para evitar falsos movimientos
if (Math.abs(diff) > 50) {
if (diff > 0) {
moverImagen(1); // swipe izquierda → siguiente
} else {
moverImagen(-1); // swipe derecha → anterior
}
}
});

/* =====================
   RENDER MARCAS
===================== */
const marcasTrack = document.getElementById('marcasTrack');

if (marcasTrack) {
  marcas.forEach(marca => {
    const link = document.createElement('a');
    link.className = 'marca';
    link.href = `productos.html?marca=${encodeURIComponent(marca.nombre)}`;

    const img = document.createElement('img');
    img.src = marca.imagen;
    img.alt = marca.nombre;

    link.appendChild(img);
    marcasTrack.appendChild(link);
  });
}

let indiceMarca = 0;

function moverMarcas(direccion) {
  const track = document.getElementById('marcasTrack');
  const marcas = document.querySelectorAll('.marca');
  if (!track || marcas.length === 0) return;

  const gap = 20;
  const anchoMarca = marcas[0].offsetWidth + gap;
  const visibles = Math.floor(track.parentElement.offsetWidth / anchoMarca);
  const maxIndice = marcas.length - visibles;

  indiceMarca += direccion;
  indiceMarca = Math.max(0, Math.min(indiceMarca, maxIndice));

  track.style.transform = `translateX(-${indiceMarca * anchoMarca}px)`;
}

function renderMarcas() {
  const track = document.getElementById("marcasTrack");
  if (!track) return;

  track.innerHTML = "";

  marcas.forEach(m => {
    const div = document.createElement("div");
    div.className = "marca";
    div.dataset.marca = m.nombre;

    div.innerHTML = `<img src="${m.imagen}" alt="${m.nombre}">`;

    track.appendChild(div);
  });
}

function mostrarNosotros() {
  ocultarSecciones();
  const nosotros = document.getElementById('nosotros');
  nosotros.classList.remove('oculto');

  window.scrollTo({ top: 0, behavior: 'smooth' });

  iniciarAnimacionesNosotros();
  observarNosotros(); // 👈 CLAVE
}
const btnNosotros = document.getElementById("btnNosotros");
if (btnNosotros) {
  btnNosotros.addEventListener("click", mostrarNosotros);
  ocultarSecciones();

  const nosotros = document.getElementById("nosotros");
  nosotros.classList.remove("oculto");

  // 🔑 esperar a que el navegador lo pinte
  requestAnimationFrame(() => {
    iniciarAnimacionesNosotros();
  });
}

document.querySelectorAll(".btn-nosotros").forEach(btn => {
  ocultarSecciones();

  const nosotros = document.getElementById("nosotros");
  nosotros.classList.remove("oculto");

  // 🔑 esperar a que el navegador lo pinte
  requestAnimationFrame(() => {
    iniciarAnimacionesNosotros();
  });
});

function iniciarAnimacionesNosotros() {
  const elementos = document.querySelectorAll(
    "#nosotros .animar-nosotros"
  );

  if (!elementos.length) return;

  // limpiar observer anterior
  if (observerNosotros) observerNosotros.disconnect();

  observerNosotros = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observerNosotros.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.2
  });

  elementos.forEach(el => {
    el.classList.remove("visible"); // reset real
    observerNosotros.observe(el);
  });
}
/* =========================
   OBSERVER SECCIÓN NOSOTROS
========================= */

const observerNosotros = new IntersectionObserver(
  (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("animar");
      } else {
        entry.target.classList.remove("animar");
      }
    });
  },
  { threshold: 0.2 }
);
function observarNosotros() {
  const elementos = document.querySelectorAll("#nosotros .animable");

  elementos.forEach(el => {
    el.classList.remove("animar"); // reset
    observerNosotros.observe(el);
  });
}
function actualizarResumenCarrito() {
  const contenedor = document.getElementById("carritoResumen");
  if (!contenedor) return;

  const totalProductos = carrito.reduce(
    (acc, item) => acc + (item.cantidad || 0),
    0
  );

  contenedor.textContent =
    totalProductos === 1
      ? "1 producto seleccionado"
      : `${totalProductos} productos seleccionados`;
}