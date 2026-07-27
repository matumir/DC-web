import { IconWhatsapp } from "../components/icons/Icon";
import { WHATSAPP_NUMBER } from "../data/contacto";

export default function WhatsAppFlotante() {
  function contactar() {
    const msg = "Hola! Quiero hacer una consulta.";
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`);
  }

  return (
    <button
      className="whatsapp-flotante"
      onClick={contactar}
      aria-label="Consultar por WhatsApp"
      title="Consultar por WhatsApp"
    >
      <IconWhatsapp />
    </button>
  );
}
