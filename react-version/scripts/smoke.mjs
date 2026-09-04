// Smoke test contra el build real, antes de subirlo por FTP.
//
// Levanta `vite preview` sobre dist/ y visita las rutas principales con un
// navegador de verdad. Comprueba que cada una responda 200, que tenga título,
// que haya renderizado contenido y que no tire errores de consola.
//
// No reemplaza tests unitarios: es la red de contención mínima para que no se
// publique un sitio roto. Si algo falla, el deploy se detiene.

import { spawn } from "node:child_process";
import { chromium } from "playwright";

const PUERTO = 4322;
const BASE = `http://localhost:${PUERTO}`;

const RUTAS = [
  "/",
  "/productos",
  "/nosotros",
  "/empresas",
  "/carrito",
  "/favoritos",
  "/politica-de-privacidad",
  "/terminos-y-condiciones",
  "/panel",
  "/ingresar",
  "/restablecer-contrasena",
  "/baja",
];

// Ruido conocido que no depende de nuestro código: el iframe de Google Maps
// tira un ReferenceError propio, y los recursos externos pueden no cargar en CI.
// challenges.cloudflare.com da error 110200 ("dominio no autorizado") porque
// el widget de Turnstile solo acepta el dominio real, y esta prueba corre en
// localhost. En produccion no pasa.
const RUIDO = [
  /maps\.gstatic/i,
  /google is not defined/i,
  /afip\.gob\.ar/i,
  /supabase\.co/i,
  /challenges\.cloudflare\.com/i,
  /turnstile/i,
];

function esRuido(texto) {
  return RUIDO.some((r) => r.test(texto));
}

function esperarServidor(url, intentos = 60) {
  return new Promise((resolve, reject) => {
    const probar = async (quedan) => {
      try {
        const res = await fetch(url);
        if (res.ok) return resolve();
      } catch {
        // todavía no levantó
      }
      if (quedan <= 0) return reject(new Error("vite preview no respondió a tiempo"));
      setTimeout(() => probar(quedan - 1), 250);
    };
    probar(intentos);
  });
}

// Comando como cadena única con shell: mismo enfoque que prerender.mjs, y
// evita el aviso de deprecación de pasar argumentos sueltos junto a shell.
const servidor = spawn(`npx vite preview --port ${PUERTO} --strictPort`, {
  stdio: "ignore",
  shell: true,
});

let navegador;
const fallos = [];

try {
  await esperarServidor(BASE);
  navegador = await chromium.launch();

  for (const ruta of RUTAS) {
    const pagina = await navegador.newPage();
    const errores = [];
    pagina.on("console", (m) => {
      if (m.type() === "error" && !esRuido(m.text())) errores.push(m.text().slice(0, 160));
    });
    pagina.on("pageerror", (e) => {
      if (!esRuido(e.message)) errores.push(`pageerror: ${e.message.slice(0, 160)}`);
    });

    const respuesta = await pagina.goto(BASE + ruta, { waitUntil: "load", timeout: 30000 });
    // El SPA fallback puede tardar en montar: esperamos contenido, no un tiempo fijo.
    await pagina
      .waitForFunction(() => document.body.innerText.trim().length > 150, { timeout: 15000 })
      .catch(() => {});

    const estado = respuesta?.status();
    const titulo = await pagina.title();
    const largo = (await pagina.locator("body").innerText()).trim().length;

    if (estado !== 200) fallos.push(`${ruta}: HTTP ${estado}`);
    if (!titulo) fallos.push(`${ruta}: sin <title>`);
    if (largo < 150) fallos.push(`${ruta}: renderizó ${largo} caracteres, parece vacía`);
    for (const e of errores) fallos.push(`${ruta}: ${e}`);

    console.log(
      `${fallos.length ? " " : ""}${estado === 200 && largo >= 150 && !errores.length ? "ok  " : "FALLA"} ${ruta.padEnd(26)} ${largo} car.  "${titulo.slice(0, 45)}"`
    );
    await pagina.close();
  }
} finally {
  await navegador?.close();
  servidor.kill();
}

if (fallos.length) {
  console.error(`\n${fallos.length} problema(s) — se detiene el deploy:`);
  for (const f of fallos) console.error(`  ✗ ${f}`);
  process.exit(1);
}

console.log(`\n${RUTAS.length} rutas verificadas, sin problemas.`);
