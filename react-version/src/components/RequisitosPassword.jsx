import { REQUISITOS } from "../utils/password";

/**
 * Checklist que se va tildando mientras se escribe.
 *
 * Mostrar las cuatro reglas desde el principio evita el ida y vuelta de
 * mandar el formulario, que lo rechacen, corregir y que lo rechacen de nuevo
 * por la regla siguiente.
 *
 * `aria-live` esta apagado a proposito: un lector de pantalla anunciando cuatro
 * items en cada tecla es peor que no anunciar nada. El mensaje de error al
 * enviar, que si es role="alert", es el que da el aviso.
 */
export default function RequisitosPassword({ valor, id }) {
  const v = valor ?? "";

  return (
    <ul className="password-requisitos" id={id}>
      {REQUISITOS.map((r) => {
        const cumple = r.cumple(v);
        return (
          <li key={r.id} className={cumple ? "cumple" : undefined}>
            <span className="password-requisito-marca" aria-hidden="true">
              {cumple ? "✓" : "•"}
            </span>
            {r.texto}
          </li>
        );
      })}
    </ul>
  );
}
