import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDocumentMeta } from "../hooks/useDocumentMeta";

export default function ComingSoon({ titulo }) {
  useDocumentMeta({
    titulo,
    descripcion: "La página que buscás no existe o fue movida.",
  });

  useEffect(() => {
    let meta = document.querySelector('meta[name="robots"]');
    if (!meta) {
      meta = document.createElement("meta");
      meta.setAttribute("name", "robots");
      document.head.appendChild(meta);
    }
    meta.setAttribute("content", "noindex, follow");
    return () => meta.setAttribute("content", "index, follow");
  }, []);

  return (
    <section style={{ padding: "80px 24px", textAlign: "center" }}>
      <h2>{titulo}</h2>
      <p>La página que buscás no existe o fue movida.</p>
      <Link to="/" className="btn-principal" style={{ marginTop: "20px" }}>
        Volver al inicio
      </Link>
    </section>
  );
}
