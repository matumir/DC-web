import { useState } from "react";
import { IconWhatsapp } from "../../components/icons/Icon";
import { provinciasArgentina } from "../../data/provincias";
import { WHATSAPP_NUMBER } from "../../data/contacto";

const MOTIVOS = [
  "Cotización de productos",
  "Pedido corporativo",
  "Consulta general",
  "Soporte post-venta",
  "Otro",
];

const VALORES_INICIALES = {
  empresa: "",
  provincia: "",
  localidad: "",
  remitente: "",
  motivo: "",
  mensaje: "",
};

export default function FormularioEmpresas() {
  const [valores, setValores] = useState(VALORES_INICIALES);
  const [errores, setErrores] = useState({});
  const [enviado, setEnviado] = useState(false);

  function actualizar(campo, valor) {
    setValores((prev) => ({ ...prev, [campo]: valor }));
    setErrores((prev) => ({ ...prev, [campo]: null }));
  }

  function validar() {
    const nuevosErrores = {};
    Object.entries(valores).forEach(([campo, valor]) => {
      if (!valor.trim()) nuevosErrores[campo] = "Este campo es obligatorio";
    });
    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  }

  function enviar(e) {
    e.preventDefault();
    if (!validar()) return;

    // WhatsApp marca negrita con un solo asterisco a cada lado (*texto*).
    const msg = `*MENSAJE DE EMPRESA*
*Empresa:* ${valores.empresa}
*Localidad:* ${valores.localidad}, ${valores.provincia}
*Remitente:* ${valores.remitente}
*Motivo del mensaje:* ${valores.motivo}
*Mensaje:* ${valores.mensaje}`;

    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`);
    setEnviado(true);
    setValores(VALORES_INICIALES);
  }

  return (
    <form className="empresas-form" onSubmit={enviar} noValidate>
      <div className="empresas-campo">
        <label htmlFor="empresaNombre">Empresa</label>
        <input
          id="empresaNombre"
          type="text"
          placeholder="Nombre de la empresa"
          value={valores.empresa}
          onChange={(e) => actualizar("empresa", e.target.value)}
        />
        {errores.empresa && <span className="empresas-error">{errores.empresa}</span>}
      </div>

      <div className="empresas-fila">
        <div className="empresas-campo">
          <label htmlFor="empresaProvincia">Provincia</label>
          <select
            id="empresaProvincia"
            value={valores.provincia}
            onChange={(e) => actualizar("provincia", e.target.value)}
          >
            <option value="" disabled>
              Seleccionar provincia
            </option>
            {provinciasArgentina.map((p) => (
              <option value={p} key={p}>
                {p}
              </option>
            ))}
          </select>
          {errores.provincia && <span className="empresas-error">{errores.provincia}</span>}
        </div>

        <div className="empresas-campo">
          <label htmlFor="empresaLocalidad">Localidad</label>
          <input
            id="empresaLocalidad"
            type="text"
            placeholder="Ciudad o localidad"
            value={valores.localidad}
            onChange={(e) => actualizar("localidad", e.target.value)}
          />
          {errores.localidad && <span className="empresas-error">{errores.localidad}</span>}
        </div>
      </div>

      <div className="empresas-campo">
        <label htmlFor="empresaRemitente">Remitente</label>
        <input
          id="empresaRemitente"
          type="text"
          placeholder="Nombre y apellido"
          value={valores.remitente}
          onChange={(e) => actualizar("remitente", e.target.value)}
        />
        {errores.remitente && <span className="empresas-error">{errores.remitente}</span>}
      </div>

      <div className="empresas-campo">
        <label htmlFor="empresaMotivo">Motivo del mensaje</label>
        <select
          id="empresaMotivo"
          value={valores.motivo}
          onChange={(e) => actualizar("motivo", e.target.value)}
        >
          <option value="" disabled>
            Seleccionar motivo
          </option>
          {MOTIVOS.map((m) => (
            <option value={m} key={m}>
              {m}
            </option>
          ))}
        </select>
        {errores.motivo && <span className="empresas-error">{errores.motivo}</span>}
      </div>

      <div className="empresas-campo">
        <label htmlFor="empresaMensaje">Mensaje</label>
        <textarea
          id="empresaMensaje"
          rows={5}
          placeholder="Contanos qué necesitás..."
          value={valores.mensaje}
          onChange={(e) => actualizar("mensaje", e.target.value)}
        />
        {errores.mensaje && <span className="empresas-error">{errores.mensaje}</span>}
      </div>

      <button type="submit" className="btn-whatsapp">
        <IconWhatsapp /> Enviar por WhatsApp
      </button>

      {enviado && (
        <p className="empresas-confirmacion">
          Se abrió WhatsApp con tu mensaje. Si no se abrió automáticamente, revisá que tu navegador
          permita ventanas emergentes.
        </p>
      )}
    </form>
  );
}
