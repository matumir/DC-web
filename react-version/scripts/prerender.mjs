// Pre-renderiza rutas clave del SPA a HTML estático dentro de dist/, para que
// crawlers que no ejecutan JS (y buscadores en general) reciban contenido real
// en la primera respuesta, en vez de solo el shell vacío de index.html.
//
// Cómo funciona: levanta el propio `vite preview` sobre dist/, visita cada ruta
// con un navegador real (Playwright), espera a que React haga su render +
// setee title/meta/JSON-LD, y guarda el HTML resultante como dist/<ruta>/index.html.
// El .htaccess ya sirve archivos existentes antes de aplicar el fallback SPA
// (RewriteCond %{REQUEST_FILENAME} !-f), así que esto funciona sin tocar el server.
//
// Uso: npm run build && npm run prerender

import { spawn } from "node:child_process";
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { chromium } from "playwright";
import { productos } from "../src/data/productos/index.js";
import { categoriasHome } from "../src/data/categoriasHome.js";
import { slugify } from "../src/utils/slug.js";

function productoUrl(producto) {
  const categoriaSlug = slugify(producto.categoria);
  const marcaSlug = slugify(producto.marca) || "generico";
  return `/productos/${categoriaSlug}/${marcaSlug}/${producto.slugNombre}`;
}

const __dirname = dirname(fileURLToPath(import.meta.url));
const distDir = resolve(__dirname, "../dist");
const PORT = 4321;
const BASE_URL = `http://localhost:${PORT}`;
const CONCURRENCIA = 6;

const rutas = [
  "/",
  "/productos",
  "/nosotros",
  "/empresas",
  "/politica-de-privacidad",
  "/terminos-y-condiciones",
  ...categoriasHome.map((c) => `/productos/filtrar/${slugify(c.nombre)}/todas/todas`),
  ...productos.map((p) => productoUrl(p)),
];

function esperarServidor(url, intentos = 40) {
  return new Promise((resolve, reject) => {
    const check = async (restantes) => {
      try {
        const res = await fetch(url);
        if (res.ok) return resolve();
      } catch {
        // servidor aún no responde
      }
      if (restantes <= 0) return reject(new Error("El servidor de preview no respondió a tiempo"));
      setTimeout(() => check(restantes - 1), 250);
    };
    check(intentos);
  });
}

async function pool(items, concurrencia, worker) {
  let i = 0;
  let ok = 0;
  let fallidas = 0;
  async function next() {
    while (i < items.length) {
      const idx = i++;
      try {
        await worker(items[idx]);
        ok++;
      } catch (err) {
        fallidas++;
        console.error(`  ✗ ${items[idx]}: ${err.message}`);
      }
    }
  }
  await Promise.all(Array.from({ length: concurrencia }, next));
  return { ok, fallidas };
}

async function main() {
  console.log(`Levantando vite preview en el puerto ${PORT}...`);
  const server = spawn(`npx vite preview --port ${PORT} --strictPort`, {
    cwd: resolve(__dirname, ".."),
    stdio: "ignore",
    shell: true,
  });

  try {
    await esperarServidor(BASE_URL);
    console.log(`Servidor listo. Pre-renderizando ${rutas.length} rutas (concurrencia ${CONCURRENCIA})...`);

    const browser = await chromium.launch();
    const context = await browser.newContext();

    const { ok, fallidas } = await pool(rutas, CONCURRENCIA, async (ruta) => {
      const page = await context.newPage();
      try {
        await page.goto(BASE_URL + ruta, { waitUntil: "domcontentloaded", timeout: 15000 });
        // Espera a que React monte el contenido real (chunk lazy + datos del
        // producto), en vez de un timeout fijo que puede quedar corto bajo carga.
        try {
          await page.waitForFunction(
            () => document.querySelector("#root")?.innerHTML.length > 2000,
            { timeout: 8000 }
          );
        } catch {
          console.warn(`  ⚠ ${ruta}: no se detectó contenido renderizado a tiempo, se guarda igual`);
        }
        let html = await page.content();

        // React Router / Vite inyectan <link rel="modulepreload" href="http://localhost:4321/assets/...">
        // con la URL ABSOLUTA del server de prerender. Si quedan en el HTML, el navegador del
        // visitante intenta buscar esos assets en localhost -> dispara el permiso de "acceso a la
        // red local" de Chrome. Los convertimos a rutas relativas para que apunten al sitio real.
        html = html.split(BASE_URL).join("");

        const destino = ruta === "/" ? distDir : join(distDir, ruta);
        mkdirSync(destino, { recursive: true });
        writeFileSync(join(destino, "index.html"), html, "utf8");
      } finally {
        await page.close();
      }
    });

    await browser.close();
    console.log(`Listo: ${ok} páginas pre-renderizadas, ${fallidas} fallidas.`);
  } finally {
    server.kill();
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
