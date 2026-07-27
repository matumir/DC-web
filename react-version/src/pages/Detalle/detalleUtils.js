const MAPA_COLORES = {
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
  "azul marino": "#061534",
  "azul francia": "#1560bd",
  "bordó": "#6d071a",
  bordo: "#6d071a",
  claro: "#d4d4d49e",
  "verde f": "#67ff20",
  "naranja f": "#fd3102",
  "gris topo": "#6e6e6eff",
  "marron claro": "rgb(255, 218, 158)",
  tostado: "#d6c3a3",
};

export function obtenerColorCSS(nombre) {
  return MAPA_COLORES[nombre.toLowerCase()] || "#ccc";
}

export function construirGaleria(producto) {
  if (producto.colores) {
    const imgs = [];
    producto.colores.forEach((color, colorIndex) => {
      color.imagenes.forEach((src) => imgs.push({ src, colorIndex }));
    });
    return imgs;
  }
  return (producto.imagenes || []).map((src) => ({ src, colorIndex: null }));
}

export function parseDescripcion(texto) {
  if (!texto) return [];
  return texto
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
}

export function parseEspecificaciones(texto) {
  if (!texto) return [];
  return texto
    .split("\n")
    .map((linea) => {
      const limpio = linea
        .replace(/^[^A-Za-z0-9ÁÉÍÓÚáéíóúÑñ]+/g, "")
        .replace(/\s+/g, " ")
        .trim();
      if (!limpio) return null;

      const partes = limpio.split(":");
      const titulo = partes[0]?.trim();
      const valor = partes.slice(1).join(":").trim();
      return { titulo, valor };
    })
    .filter(Boolean);
}
