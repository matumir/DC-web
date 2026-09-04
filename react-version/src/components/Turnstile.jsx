import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { TURNSTILE_SITE_KEY, cargarTurnstile } from "../lib/turnstile";

/**
 * Widget de Cloudflare Turnstile.
 *
 * En modo "managed" una persona real normalmente no ve ni toca nada: el
 * desafio visible le aparece solo a quien se comporta como un bot.
 *
 * El token se usa UNA sola vez y vence a los ~5 minutos. Por eso el formulario
 * tiene que llamar a reset() despues de cada intento; si no, quien se equivoca
 * de contraseña y reintenta recibe un error de captcha en vez del de la clave.
 * Esa llamada la hace el formulario a traves del ref.
 */
const Turnstile = forwardRef(function Turnstile({ onToken, accion }, ref) {
  const contenedorRef = useRef(null);
  const widgetRef = useRef(null);
  const [error, setError] = useState(null);

  useImperativeHandle(ref, () => ({
    reset() {
      onToken(null);
      if (widgetRef.current !== null) window.turnstile?.reset(widgetRef.current);
    },
  }));

  useEffect(() => {
    let vivo = true;

    cargarTurnstile()
      .then((turnstile) => {
        if (!vivo || !contenedorRef.current) return;
        widgetRef.current = turnstile.render(contenedorRef.current, {
          sitekey: TURNSTILE_SITE_KEY,
          action: accion,
          language: "es",
          callback: (token) => vivo && onToken(token),
          // El token vencido no sirve: se pide otro en el momento, asi el
          // formulario nunca manda uno muerto.
          "expired-callback": () => {
            if (!vivo) return;
            onToken(null);
            window.turnstile?.reset(widgetRef.current);
          },
          "error-callback": () => {
            if (!vivo) return;
            onToken(null);
            setError("No pudimos verificar que no seas un robot. Recargá la página.");
            // Devolver false deja que Turnstile muestre tambien su propio
            // mensaje en el widget.
            return false;
          },
        });
      })
      .catch(() => {
        if (!vivo) return;
        // Suele ser un bloqueador de publicidad o una red que filtra dominios.
        setError(
          "No se pudo cargar la verificación de seguridad. Si usás un bloqueador de anuncios, desactivalo en este sitio."
        );
      });

    return () => {
      vivo = false;
      if (widgetRef.current !== null) window.turnstile?.remove(widgetRef.current);
      widgetRef.current = null;
    };
    // Montar una sola vez: volver a renderizar el widget le limpiaria el token
    // a alguien que ya lo resolvio.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="turnstile">
      <div ref={contenedorRef} />
      {error && (
        <p className="turnstile-error" role="alert">
          {error}
        </p>
      )}
    </div>
  );
});

export default Turnstile;
