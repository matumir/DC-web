import { useEffect, useRef, useState } from "react";
import { IconEnvelope } from "../../components/icons/Icon";
import RequisitosPassword from "../../components/RequisitosPassword";
import Turnstile from "../../components/Turnstile";
import { useAuth } from "../../context/AuthContext";
import { errorPassword } from "../../utils/password";

/**
 * Cambio de contraseña desde el menu de perfil.
 *
 * Dos caminos segun como se creo la cuenta:
 *  - con correo y contraseña: se pide la actual y se verifica antes de cambiar.
 *  - solo con Google: no hay contraseña que verificar, asi que en vez de dejar
 *    que cualquiera con la sesion abierta se cree una, se manda el correo de
 *    siempre y la persona confirma que tiene acceso a esa casilla.
 */
export default function ModalContrasena({ abierto, onCerrar }) {
  const { email, tieneContrasena, cambiarContrasena, recuperarContrasena } = useAuth();

  const [actual, setActual] = useState("");
  const [nueva, setNueva] = useState("");
  const [repetir, setRepetir] = useState("");
  const [errores, setErrores] = useState({});
  const [errorGeneral, setErrorGeneral] = useState(null);
  const [enviando, setEnviando] = useState(false);
  const [aviso, setAviso] = useState(null);
  const [ver, setVer] = useState(false);
  const cajaRef = useRef(null);
  // Verificar la contraseña actual pasa por signInWithPassword, que tambien
  // esta detras del CAPTCHA. Y pedir el correo pasa por resetPasswordForEmail.
  const [captchaToken, setCaptchaToken] = useState(null);
  const captchaRef = useRef(null);

  useEffect(() => {
    if (!abierto) return;

    const previo = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const alTeclear = (e) => e.key === "Escape" && onCerrar();
    document.addEventListener("keydown", alTeclear);
    cajaRef.current?.focus();

    return () => {
      document.body.style.overflow = previo;
      document.removeEventListener("keydown", alTeclear);
    };
  }, [abierto, onCerrar]);

  // Al cerrarse se limpia todo: la contraseña no queda escrita en memoria
  // esperando a la proxima vez que se abra el modal.
  useEffect(() => {
    if (abierto) return;
    setActual("");
    setNueva("");
    setRepetir("");
    setErrores({});
    setErrorGeneral(null);
    setAviso(null);
    setVer(false);
  }, [abierto]);

  if (!abierto) return null;

  function validar() {
    const e = {};
    if (!actual) e.actual = "Ingresá tu contraseña actual.";

    if (!nueva) e.nueva = "Ingresá la contraseña nueva.";
    else if (nueva === actual) e.nueva = "La nueva tiene que ser distinta de la actual.";
    else {
      const falla = errorPassword(nueva);
      if (falla) e.nueva = falla;
    }

    if (nueva && repetir !== nueva) e.repetir = "Las dos contraseñas no coinciden.";

    setErrores(e);

    // Mismo criterio que el formulario de ingreso: el foco va al primer campo
    // con problema, para que el mensaje no pase inadvertido con teclado.
    const primero = Object.keys(e)[0];
    if (primero) document.getElementById(`clave-${primero}`)?.focus();

    return Object.keys(e).length === 0;
  }

  async function enviar(evento) {
    evento.preventDefault();
    if (enviando || !validar()) return;

    setEnviando(true);
    setErrorGeneral(null);
    const resultado = await cambiarContrasena({ actual, nueva, captchaToken });
    setEnviando(false);
    captchaRef.current?.reset();

    if (!resultado.ok) {
      setErrorGeneral(resultado.error);
      return;
    }

    setActual("");
    setNueva("");
    setRepetir("");
    setAviso("Listo, tu contraseña quedó cambiada. La vas a usar la próxima vez que entres.");
  }

  async function pedirPorCorreo() {
    if (enviando) return;
    setEnviando(true);
    setErrorGeneral(null);
    const resultado = await recuperarContrasena(email, captchaToken);
    setEnviando(false);
    captchaRef.current?.reset();

    if (!resultado.ok) {
      setErrorGeneral(resultado.error);
      return;
    }
    setAviso(`Te enviamos un correo a ${email} con el enlace para crear tu contraseña.`);
  }

  return (
    <div className="auth-modal-fondo" onClick={onCerrar}>
      <div
        className="auth-modal"
        role="dialog"
        aria-modal="true"
        aria-label={tieneContrasena ? "Cambiar contraseña" : "Crear una contraseña"}
        tabIndex={-1}
        ref={cajaRef}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="auth-modal-cerrar" onClick={onCerrar} aria-label="Cerrar">
          ×
        </button>

        <div className="auth-form">
          <h2 className="auth-titulo">
            {tieneContrasena ? "Cambiar contraseña" : "Crear una contraseña"}
          </h2>

          {aviso ? (
            <div className="auth-aviso" role="status">
              <IconEnvelope />
              <p>{aviso}</p>
            </div>
          ) : !tieneContrasena ? (
            <>
              <p className="auth-subtitulo">
                Entrás con tu cuenta de Google, así que todavía no tenés una contraseña. Podemos
                enviarte un correo a {email} para que crees una y puedas entrar de las dos formas.
              </p>

              <Turnstile ref={captchaRef} onToken={setCaptchaToken} accion="crear-clave" />

              {errorGeneral && (
                <div className="auth-error-general" role="alert">
                  {errorGeneral}
                </div>
              )}

              <button
                type="button"
                className="btn-principal auth-enviar"
                onClick={pedirPorCorreo}
                disabled={enviando}
              >
                {enviando ? "Enviando..." : "Enviarme el correo"}
              </button>
            </>
          ) : (
            <>
              <p className="auth-subtitulo">
                Te pedimos la contraseña actual antes de cambiarla, por seguridad.
              </p>

              <form onSubmit={enviar} noValidate>
                <div className="auth-campo">
                  <label htmlFor="clave-actual">Contraseña actual</label>
                  <input
                    id="clave-actual"
                    type="password"
                    autoComplete="current-password"
                    value={actual}
                    onChange={(e) => {
                      setActual(e.target.value);
                      setErrores((p) => ({ ...p, actual: null }));
                      setErrorGeneral(null);
                    }}
                    aria-invalid={Boolean(errores.actual)}
                    aria-describedby={errores.actual ? "clave-actual-error" : undefined}
                  />
                  {errores.actual && (
                    <span className="auth-error-campo" id="clave-actual-error">
                      {errores.actual}
                    </span>
                  )}
                </div>

                <div className="auth-campo">
                  <label htmlFor="clave-nueva">Contraseña nueva</label>
                  <div className="auth-password">
                    <input
                      id="clave-nueva"
                      type={ver ? "text" : "password"}
                      autoComplete="new-password"
                      value={nueva}
                      onChange={(e) => {
                        setNueva(e.target.value);
                        setErrores((p) => ({ ...p, nueva: null }));
                      }}
                      aria-invalid={Boolean(errores.nueva)}
                      aria-describedby={
                        errores.nueva ? "clave-nueva-error" : "clave-nueva-requisitos"
                      }
                    />
                    <button
                      type="button"
                      className="auth-ver"
                      onClick={() => setVer((v) => !v)}
                      aria-label={ver ? "Ocultar contraseña" : "Mostrar contraseña"}
                    >
                      {ver ? "Ocultar" : "Ver"}
                    </button>
                  </div>
                  {errores.nueva && (
                    <span className="auth-error-campo" id="clave-nueva-error">
                      {errores.nueva}
                    </span>
                  )}
                  <RequisitosPassword valor={nueva} id="clave-nueva-requisitos" />
                </div>

                <div className="auth-campo">
                  <label htmlFor="clave-repetir">Repetir contraseña nueva</label>
                  <input
                    id="clave-repetir"
                    type={ver ? "text" : "password"}
                    autoComplete="new-password"
                    value={repetir}
                    onChange={(e) => {
                      setRepetir(e.target.value);
                      setErrores((p) => ({ ...p, repetir: null }));
                    }}
                    aria-invalid={Boolean(errores.repetir)}
                    aria-describedby={errores.repetir ? "clave-repetir-error" : undefined}
                  />
                  {errores.repetir && (
                    <span className="auth-error-campo" id="clave-repetir-error">
                      {errores.repetir}
                    </span>
                  )}
                </div>

                <Turnstile ref={captchaRef} onToken={setCaptchaToken} accion="cambiar-clave" />

                {errorGeneral && (
                  <div className="auth-error-general" role="alert">
                    {errorGeneral}
                  </div>
                )}

                <button type="submit" className="btn-principal auth-enviar" disabled={enviando}>
                  {enviando ? "Guardando..." : "Cambiar contraseña"}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
