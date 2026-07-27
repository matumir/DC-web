// Dominio real de producción. Se usa fijo (en vez de window.location.origin)
// para que canonical/og/JSON-LD sean correctos incluso cuando el sitio se
// sirve desde otro host (preview local, prerender en build, staging).
export const SITE_URL = "https://distribuidoracastelli.com";
