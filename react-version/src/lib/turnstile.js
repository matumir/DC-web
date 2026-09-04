// Cloudflare Turnstile: el CAPTCHA que protege el alta y el ingreso.
//
// La clave publica va en el codigo a proposito (asi la define Cloudflare, es
// el equivalente al anon key de Supabase). La secreta vive solo en el panel de
// Supabase y no toca este repo.
// La clave real esta fija y no en una variable de entorno a proposito: si
// dependiera de un secreto de GitHub y alguien olvidara cargarlo, el deploy
// saldria sin captcha y el login quedaria roto en produccion sin aviso.
// VITE_TURNSTILE_SITE_KEY solo sirve para pruebas locales, donde se usa la
// clave de ensayo de Cloudflare (funciona en cualquier dominio, incluido
// localhost, que no esta autorizado en el widget real).
export const TURNSTILE_SITE_KEY =
  import.meta.env.VITE_TURNSTILE_SITE_KEY || "0x4AAAAAAEmhPzA4gCbDulct";

const SRC = "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";

let promesa = null;

/**
 * Carga el script una sola vez, aunque lo pidan varios formularios a la vez.
 *
 * No se pone en index.html para no cargarselo a las 558 paginas del catalogo:
 * el 99% de las visitas nunca abre el formulario de ingreso.
 */
export function cargarTurnstile() {
  if (typeof window === "undefined") return Promise.reject(new Error("sin ventana"));
  if (window.turnstile) return Promise.resolve(window.turnstile);
  if (promesa) return promesa;

  promesa = new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = SRC;
    script.async = true;
    script.defer = true;
    script.onload = () => {
      if (window.turnstile) resolve(window.turnstile);
      else reject(new Error("turnstile no quedo disponible"));
    };
    script.onerror = () => {
      // Que falle el proximo intento en vez de quedar cacheado el rechazo:
      // pudo ser un corte de red momentaneo.
      promesa = null;
      reject(new Error("no se pudo cargar turnstile"));
    };
    document.head.appendChild(script);
  });

  return promesa;
}
