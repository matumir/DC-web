import { writeFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import { productos } from "../src/data/productos/index.js";
import { categoriasHome } from "../src/data/categoriasHome.js";
import { slugify } from "../src/utils/slug.js";
import { SITE_URL } from "../src/data/siteUrl.js";

// Réplica de src/utils/productoUrl.js: se reimplementa acá en vez de importarla
// porque ese archivo usa un import relativo sin extensión ("./slug"), válido
// para el resolver de Vite pero no para el ESM nativo de Node con el que corre este script.
function productoUrl(producto) {
  const categoriaSlug = slugify(producto.categoria);
  const marcaSlug = slugify(producto.marca) || "generico";
  return `/productos/${categoriaSlug}/${marcaSlug}/${producto.slugNombre}`;
}

const __dirname = dirname(fileURLToPath(import.meta.url));
const publicDir = resolve(__dirname, "../public");

const hoy = new Date().toISOString().slice(0, 10);

const rutasEstaticas = [
  { loc: "/", prioridad: "1.0" },
  { loc: "/productos", prioridad: "0.9" },
  { loc: "/nosotros", prioridad: "0.5" },
  { loc: "/empresas", prioridad: "0.6" },
];

const rutasCategorias = categoriasHome.map((c) => ({
  loc: `/productos/filtrar/${slugify(c.nombre)}/todas/todas`,
  prioridad: "0.7",
}));

const rutasProductos = productos.map((p) => ({
  loc: productoUrl(p),
  prioridad: "0.6",
}));

const todasLasRutas = [...rutasEstaticas, ...rutasCategorias, ...rutasProductos];

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${todasLasRutas
  .map(
    (r) => `  <url>
    <loc>${SITE_URL}${r.loc}</loc>
    <lastmod>${hoy}</lastmod>
    <priority>${r.prioridad}</priority>
  </url>`
  )
  .join("\n")}
</urlset>
`;

writeFileSync(resolve(publicDir, "sitemap.xml"), xml, "utf8");

const robots = `User-agent: *
Allow: /

Sitemap: ${SITE_URL}/sitemap.xml
`;

writeFileSync(resolve(publicDir, "robots.txt"), robots, "utf8");

console.log(`sitemap.xml generado con ${todasLasRutas.length} URLs (${rutasProductos.length} productos, ${rutasCategorias.length} categorías, ${rutasEstaticas.length} estáticas).`);
console.log("robots.txt generado.");
