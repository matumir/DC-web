import { useEffect, useState } from "react";
import { IconCartPlus } from "../../components/icons/Icon";

// Alto aproximado del header fijo mobile (72px) + margen, para que el
// scroll no deje el panel de compra tapado detrás del header.
const OFFSET_SCROLL = 90;

export default function AgregarFlotanteMobile({ producto }) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const boton = document.getElementById("detalleAgregar");
    const footerSitio = document.querySelector(".footer");
    if (!boton) return;

    // Se oculta apenas el botón real (con talle/color/cantidad) o el footer
    // del sitio quedan visibles, para no superponerse con ninguno de los dos.
    const estado = { boton: false, footer: false };

    function actualizarVisibilidad() {
      setVisible(!estado.boton && !estado.footer);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.target === boton) estado.boton = entry.isIntersecting;
          if (entry.target === footerSitio) estado.footer = entry.isIntersecting;
        });
        actualizarVisibilidad();
      },
      { rootMargin: "-72px 0px 0px 0px", threshold: 0 }
    );

    observer.observe(boton);
    if (footerSitio) observer.observe(footerSitio);

    return () => observer.disconnect();
  }, [producto.id]);

  function irAComprar() {
    const panel = document.getElementById("infoProducto");
    if (!panel) return;
    const top = panel.getBoundingClientRect().top + window.scrollY - OFFSET_SCROLL;
    window.scrollTo({ top, behavior: "smooth" });
  }

  return (
    <div className={`detalle-agregar-flotante${visible ? " visible" : ""}`}>
      <button className="btn-secundario" onClick={irAComprar}>
        <IconCartPlus /> Agregar al carrito
      </button>
    </div>
  );
}
