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

/* =====================
   REFERENCIAS
===================== */
const inicioSecciones = [
  document.getElementById("banner-inicio"),
  document.getElementById("inicio-categorias"),
  document.getElementById("destacados")
];

const productosSec = document.getElementById("productos");
const vistaProducto = document.getElementById("vistaProducto");
const contadorResultados = document.getElementById("contadorResultados");

const catalogo = document.getElementById("catalogo");
const paginacion = document.getElementById("paginacion");

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
const listaCarrito = document.getElementById("listaCarrito");
const relacionados = document.getElementById("relacionados");
const selectCategoria = document.getElementById("selectCategoria");
const selectMarca = document.getElementById("selectMarca");
const selectOrden = document.getElementById("selectOrden");
const categoriasHome = [
  { nombre: "Calzado", img: "imagenes/logos/logocalzado.png" },
  { nombre: "Guantes", img: "imagenes/logos/logoguantes.png" },
  { nombre: "Protección", img: "imagenes/categorias/proteccion.png" },
  { nombre: "Accesorios", img: "imagenes/categorias/accesorios.png" },
];


/* =====================
   NAVEGACIÓN
===================== */
function ocultarSecciones() {
  document.querySelectorAll("section").forEach(s => s.classList.add("oculto"));
}

function mostrarInicio() {
  ocultarSecciones();

  inicioSecciones.forEach(sec => {
    if (sec) sec.classList.remove("oculto");
  });

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
    if (estoyEnInicio()) {
      if (texto.length < 2) {
        resultadosBuscador.classList.add("oculto");
        return;
      }

      const matches = filtrarProductos(texto);

      matches.forEach(p => {
  const imagenSrc = p.colores ? p.colores[0].imagenes[0] : p.imagenes[0];
  const item = document.createElement("div");
  item.className = "buscador-item";
  item.innerHTML = `
    <img src="${imagenSrc}" alt="${p.nombre}">
    <div class="buscador-texto">
     ${resaltar(`${p.marca} | ${p.nombre}`, textoOriginal)}
    </div>
  `;
  item.onclick = () => {
    resultadosBuscador.classList.add("oculto");
    inputBuscador.value = "";
    mostrarDetalle(p.id);
  };
  resultadosBuscador.appendChild(item);
})
if (matches.length > 0) {
  indiceSeleccionado = 0;
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

}

document.addEventListener("click", e => {
  if (!e.target.closest(".header-search")) {
    resultadosBuscador?.classList.add("oculto");
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

    actualizarContador(total, ini, fin);
    renderPaginacion(total);
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

  // ANTERIOR
  const btnPrev = document.createElement("button");
  btnPrev.textContent = "Anterior";
  btnPrev.disabled = paginaActual === 1;
  btnPrev.onclick = () => cambiarPagina(paginaActual - 1);
  paginacion.appendChild(btnPrev);

  // NÚMEROS
  for (let i = 1; i <= totalPaginas; i++) {
    const btn = document.createElement("button");
    btn.textContent = i;

    if (i === paginaActual) {
      btn.classList.add("activa");
      btn.disabled = true;
    }

    btn.onclick = () => cambiarPagina(i);
    paginacion.appendChild(btn);
  }

  // SIGUIENTE
  const btnNext = document.createElement("button");
  btnNext.textContent = "Siguiente";
  btnNext.disabled = paginaActual === totalPaginas;
  btnNext.onclick = () => cambiarPagina(paginaActual + 1);
  paginacion.appendChild(btnNext);
}


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
    if (
      categoriaActual === "todos" ||
      p.categoria === categoriaActual
    ) {
      if (p.marca) marcas.add(p.marca);
    }
  });

  selectMarca.innerHTML = `<option value="todas">Todas</option>`;

  [...marcas]
    .sort((a, b) => a.localeCompare(b, "es", { sensitivity: "base" }))
    .forEach(m => {
      selectMarca.innerHTML += `<option value="${m}">${m}</option>`;
    });

  marcaActual = "todas";
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
    valor: `Búsqueda: "${busquedaActual}`
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
 // ESPECIFICACIONES
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
 document.getElementById("labelColor").style.display = "block";
 
  coloresProducto.innerHTML = "";

  if (!productoActual.colores || productoActual.colores.length === 0) {
    coloresProducto.classList.add("oculto");
    colorSeleccionado = null;
    return;
  }

  coloresProducto.classList.remove("oculto");
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
    azul: "#1e88e5",
    rojo: "#e53935",
    verde: "#43a047",
    amarillo: "#fdd835",
    naranja: "#fb8c00"
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
}
function eliminarDelCarrito(index) {
  carrito.splice(index, 1);
  localStorage.setItem("carrito", JSON.stringify(carrito));
  renderCarrito();
  actualizarContadorCarrito();
}
function actualizarContadorCarrito() {
  const contador = document.getElementById("contadorCarrito");
  const total = carrito.reduce((acc, p) => acc + p.cantidad, 0);
  contador.textContent = total;
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
}
function renderCarritoCompleto() {
  listaCarrito.innerHTML = "";
  if (carrito.length === 0) {
    listaCarrito.innerHTML = "<p>No hay productos en el carrito.</p>";
    return;
  }
  carrito.forEach((p, i) => {
    let imagenSrc = p.imagenes ? p.imagenes[0] : (p.colores ? p.colores[0].imagenes[0] : ""); // Fallback mejorado
    if (p.colores && p.color) {
      const colorIndex = p.colores.findIndex(c => c.nombre === p.color);
      if (colorIndex !== -1) {
        imagenSrc = p.colores[colorIndex].imagenes[0];
      }
    }
    listaCarrito.innerHTML += `
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

  const relacionadosFiltrados = productos.filter(
    p => p.categoria === productoActual.categoria && p.id !== productoActual.id
  );

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
  renderCategoriasHome();
  renderDestacados();
}

function renderCategoriasHome() {
  const container = document.getElementById("categoriasContainer");
  if (!container) return;
  container.innerHTML = "";

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
    .slice(0, 15);

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
document.addEventListener("DOMContentLoaded", () => {
  actualizarContadorCarrito();

  btnInicio.onclick = mostrarInicio;
  btnProductos.onclick = () => mostrarProductos();
  volverCatalogo.onclick = volverAlCatalogo;
  detalleAgregar.onclick = agregarDesdeDetalle;
  btnCarrito.onclick = mostrarCarrito;

  mostrarInicio(); // 👈 ESTO ES CLAVE
});
