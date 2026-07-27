import { useEffect } from "react";

// Inyecta un bloque JSON-LD (schema.org) en <head> mientras el componente está montado.
export function useStructuredData(data) {
  const json = data ? JSON.stringify(data) : null;

  useEffect(() => {
    if (!json) return;
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.textContent = json;
    document.head.appendChild(script);
    return () => script.remove();
  }, [json]);
}
