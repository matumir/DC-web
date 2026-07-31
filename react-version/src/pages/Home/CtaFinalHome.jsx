import { Link } from "react-router-dom";
import { WHATSAPP_NUMBER } from "../../data/contacto";

export default function CtaFinalHome() {
  function consultar() {
    const msg = "Hola! Quiero hacer una consulta.";
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`);
  }

  return (
    <section className="cta-final">
      <div className="cta-final-col">
        <h2>Equipá a tu empresa</h2>
        <p>Pedidos corporativos con asesoramiento y precios especiales por volumen.</p>
        <Link className="btn-principal" to="/empresas">
          Solicitar cotización ›
        </Link>
      </div>

      <div className="cta-final-col">
        <h2>¿Necesitás asesoramiento?</h2>
        <p>Contanos qué tarea tenés que cubrir y te ayudamos a elegir el elemento correcto.</p>
        <button className="btn-principal" onClick={consultar}>
          Escribinos por WhatsApp ›
        </button>
      </div>
    </section>
  );
}
