export function normalizarTexto(texto) {
  return texto
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .trim();
}

function distanciaLevenshtein(a, b) {
  const matrix = [];

  for (let i = 0; i <= b.length; i++) matrix[i] = [i];
  for (let j = 0; j <= a.length; j++) matrix[0][j] = j;

  for (let i = 1; i <= b.length; i++) {
    for (let j = 1; j <= a.length; j++) {
      if (b.charAt(i - 1) === a.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }

  return matrix[b.length][a.length];
}

export function filtrarProductos(productos, texto) {
  const query = normalizarTexto(texto);
  if (!query) return productos;

  const resultados = productos.map((p) => {
    const nombre = normalizarTexto(p.nombre);
    const categoria = normalizarTexto(p.categoria);
    const marca = p.marca ? normalizarTexto(p.marca) : "";

    let score = 0;
    if (nombre === query) score += 100;
    if (nombre.startsWith(query)) score += 50;
    if (nombre.includes(query)) score += 30;
    if (marca.includes(query)) score += 20;
    if (categoria.includes(query)) score += 10;

    nombre.split(" ").forEach((palabra) => {
      if (distanciaLevenshtein(palabra, query) === 1) score += 15;
    });

    return { producto: p, score };
  });

  return resultados
    .filter((r) => r.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((r) => r.producto);
}

export function resaltar(texto, query) {
  if (!query) return texto;

  const textoNormalizado = normalizarTexto(texto);
  const queryNormalizado = normalizarTexto(query);

  if (!textoNormalizado.includes(queryNormalizado)) return texto;

  return texto.replace(new RegExp(`(${query})`, "i"), "<strong>$1</strong>");
}

export function imagenPrincipal(producto) {
  return producto.colores ? producto.colores[0].imagenes[0] : producto.imagenes[0];
}
