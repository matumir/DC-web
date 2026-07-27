import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { SITE_URL } from "../data/siteUrl";

const TITULO_BASE = "Distribuidora Castelli";

function setMeta(attr, key, content) {
  if (!content) return;
  let el = document.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

function setLinkCanonical(href) {
  let el = document.querySelector('link[rel="canonical"]');
  if (!el) {
    el = document.createElement("link");
    el.setAttribute("rel", "canonical");
    document.head.appendChild(el);
  }
  el.setAttribute("href", href);
}

// Actualiza <title>, meta description/Open Graph y el link canonical en cada página.
// El canonical por defecto es origin + pathname (sin query params), para que
// variantes de orden/búsqueda/página de /productos no compitan como contenido duplicado.
// Nota: como el sitio es un SPA sin renderizado en servidor, estos cambios
// los ve Google (que sí ejecuta JS) pero NO los crawlers de WhatsApp/Facebook,
// que solo leen el HTML estático inicial de index.html.
export function useDocumentMeta({ titulo, descripcion, imagen, url }) {
  const location = useLocation();

  useEffect(() => {
    const tituloCompleto = titulo ? `${titulo} | ${TITULO_BASE}` : TITULO_BASE;
    document.title = tituloCompleto;

    const canonical = url || SITE_URL + location.pathname;

    setMeta("name", "description", descripcion);
    setMeta("property", "og:title", tituloCompleto);
    setMeta("property", "og:description", descripcion);
    setMeta("property", "og:image", imagen);
    setMeta("property", "og:url", canonical);
    setLinkCanonical(canonical);
  }, [titulo, descripcion, imagen, url, location.pathname]);
}
