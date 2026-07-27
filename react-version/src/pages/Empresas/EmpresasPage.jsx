import { useEffect } from "react";
import {
  IconCertificate,
  IconHandshake,
  IconShieldHalved,
  IconUserCheck,
} from "../../components/icons/Icon";
import { useDocumentMeta } from "../../hooks/useDocumentMeta";
import FormularioEmpresas from "./FormularioEmpresas";

export default function EmpresasPage() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  useDocumentMeta({
    titulo: "Empresas",
    descripcion:
      "Pedidos corporativos de seguridad industrial con asesoramiento personalizado y precios especiales por volumen.",
  });

  return (
    <section id="empresas">
      <div className="empresas-hero">
        <h1>Empresas</h1>
        <p>Equipamos a tu equipo de trabajo con seguridad, calidad y respaldo.</p>
      </div>

      <div className="empresas-intro">
        <h2>Seguridad industrial a medida de tu empresa</h2>
        <p>
          Somos proveedores de artículos de seguridad industrial y protección personal hace más de
          25 años, y trabajamos con empresas de todos los tamaños en San Francisco, Córdoba y en todo
          el país. Armamos pedidos corporativos con asesoramiento personalizado, precios especiales
          por volumen y entrega coordinada según las necesidades de cada equipo de trabajo.
        </p>
      </div>

      <ul className="empresas-beneficios">
        <li>
          <IconHandshake />
          <div>
            <strong>Atención dedicada</strong>
            <span>Un asesor te acompaña en todo el proceso, desde la consulta hasta la entrega.</span>
          </div>
        </li>
        <li>
          <IconCertificate />
          <div>
            <strong>Productos certificados</strong>
            <span>Trabajamos con marcas reconocidas y artículos que cumplen normativa vigente.</span>
          </div>
        </li>
        <li>
          <IconUserCheck />
          <div>
            <strong>Asesoramiento por rubro</strong>
            <span>Te ayudamos a definir los EPP correctos según la tarea y el entorno de trabajo.</span>
          </div>
        </li>
        <li>
          <IconShieldHalved />
          <div>
            <strong>Pedidos por volumen</strong>
            <span>Precios y condiciones especiales para compras corporativas y recurrentes.</span>
          </div>
        </li>
      </ul>

      <div className="empresas-formulario-wrapper">
        <div className="empresas-formulario-texto">
          <h2>Contanos qué necesita tu empresa</h2>
          <p>
            Completá el formulario con los datos de tu empresa y el motivo de tu consulta. Vas a poder
            enviarnos el mensaje directamente por WhatsApp para que te respondamos a la brevedad.
          </p>
        </div>
        <FormularioEmpresas />
      </div>
    </section>
  );
}
