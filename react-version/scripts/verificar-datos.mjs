// Verifica la integridad del catálogo antes de compilar.
//
// Corre en el deploy: si encuentra un error, el pipeline se detiene y el sitio
// en producción queda intacto. Se puede correr a mano con `npm run verificar`.
//
// Distingue dos niveles a propósito:
//   ERROR   rompe el sitio (imagen que no existe, id duplicado) -> corta el deploy
//   AVISO   conviene arreglarlo pero no rompe nada -> solo se informa
//
// Los ids duplicados están acá porque ya causaron un bug real: la lista de
// resultados del buscador usa el id como key de React, y con keys repetidas
// quedaban productos pegados en pantalla sin importar qué se buscara.

import { existsSync, readdirSync } from "node:fs";
import path from "node:path";
import { productos } from "../src/data/productos/index.js";
import { marcas } from "../src/data/marcas.js";

const PUBLIC = path.resolve(import.meta.dirname, "..", "public");

const errores = [];
const avisos = [];

// Windows no distingue mayúsculas de minúsculas, el servidor Linux sí. Esta
// comprobación exacta ya atrapó un "1100FER.pdf" que en el disco era
// "1100fer.pdf" y habría dado 404 solo en producción.
function existeExacto(rutaPublica) {
  const abs = path.join(PUBLIC, rutaPublica);
  if (!existsSync(abs)) return false;
  const dir = path.dirname(abs);
  return existsSync(dir) && readdirSync(dir).includes(path.basename(abs));
}

// ---------------------------------------------------------------- ids únicos
const vistos = new Map();
for (const p of productos) {
  if (vistos.has(p.id)) {
    errores.push(`id duplicado "${p.id}": "${vistos.get(p.id)}" y "${p.nombre}"`);
  } else {
    vistos.set(p.id, p.nombre);
  }
  if (p.id !== p.id.trim()) {
    errores.push(`id con espacios sobrantes: ${JSON.stringify(p.id)}`);
  }
}

// ------------------------------------------------------------------ imágenes
let totalImagenes = 0;
for (const p of productos) {
  const lista = p.colores ? p.colores.flatMap((c) => c.imagenes || []) : p.imagenes || [];

  if (!lista.length) {
    avisos.push(`${p.id} no tiene ninguna imagen`);
    continue;
  }

  for (const img of lista) {
    totalImagenes++;
    if (!existeExacto(img)) errores.push(`${p.id}: no existe la imagen ${img}`);
    else if (!/\.webp$/i.test(img)) avisos.push(`${p.id}: ${img} no es webp`);
  }
}

// -------------------------------------------------------------------- fichas
let totalFichas = 0;
for (const p of productos) {
  for (const doc of p.Documentacion || []) {
    if (typeof doc?.url !== "string") continue; // placeholder "no disponible"
    totalFichas++;
    if (!existeExacto(doc.url)) avisos.push(`${p.id}: falta la ficha ${doc.url}`);
  }
}

// ------------------------------------------------------------ logos de marca
for (const m of marcas) {
  if (!existeExacto(m.imagen)) errores.push(`marca ${m.nombre}: no existe ${m.imagen}`);
}

// -------------------------------------------------------------------- salida
console.log(
  `Revisado: ${productos.length} productos, ${totalImagenes} imágenes, ` +
    `${totalFichas} fichas, ${marcas.length} marcas.`
);

if (avisos.length) {
  console.log(`\n${avisos.length} aviso(s):`);
  for (const a of avisos) console.log(`  · ${a}`);
}

if (errores.length) {
  console.error(`\n${errores.length} ERROR(es) — se detiene el deploy:`);
  for (const e of errores) console.error(`  ✗ ${e}`);
  process.exit(1);
}

console.log("\nSin errores.");
