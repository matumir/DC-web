import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { IconEnvelope, IconGoogle } from "../../components/icons/Icon";
import { useAuth } from "../../context/AuthContext";
import RequisitosPassword from "../../components/RequisitosPassword";
import { errorPassword } from "../../utils/password";

// Las reglas de la contraseña viven en utils/password.js, compartidas con el
// cambio desde el perfil y con el restablecimiento por correo.

const VACIO = { nombre: "", email: "", telefono: "", password: "" };

/**
 * Formulario de ingreso, registro y recuperacion.
 *
 * Vive en un solo componente porque los tres modos comparten el encabezado,
 * el boton de Google y el cuadro de error; separarlos multiplicaria la
 * duplicacion sin ganar nada.
 *
 * `onListo` lo usa el modal para cerrarse cuando la sesion queda abierta. En
 * la pagina /ingresar no se pasa y la redireccion la maneja la propia pagina.
 */
export default function FormularioAuth({ onListo, modoInicial = "ingresar" }) {
  const { entrarConGoogle, registrarConMail, entrarConMail, recuperarContrasena, disponible } =
    useAuth();

  const [modo, setModo] = useState(modoInicial);
  const [valores, setValores] = useState(VACIO);
  const [errores, setErrores] = useState({});
  const [errorGeneral, setErrorGeneral] = useState(null);
  const [aviso, setAviso] = useState(null);
  const [enviando, setEnviando] = useState(false);
  const [verPassword, setVerPassword] = useState(false);
  const primerCampoRef = useRef(null);

  // Al cambiar de modo se limpia todo: dejar un error de "contraseña incorrecta"
  // visible sobre el formulario de registro no tiene sentido.
  useEffect(() => {
    setErrores({});
    setErrorGeneral(null);
    setAviso(null);
  }, [modo]);

  if (!disponible) {
    return (
      <p className="auth-no-disponible">
        El servicio de cuentas no está disponible en este momento. Podés seguir navegando el
        catálogo y consultarnos por WhatsApp.
      </p>
    );
  }

  function actualizar(campo, valor) {
    setValores((prev) => ({ ...prev, [campo]: valor }));
    setErrores((prev) => ({ ...prev, [campo]: null }));
    setErrorGeneral(null);
  }

  function validar() {
    const e = {};
    const email = valores.email.trim();

    if (!email) e.email = "Ingresá tu correo.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) e.email = "Ese correo no parece válido.";

    if (modo !== "recuperar") {
      if (!valores.password) e.password = "Ingresá tu contraseña.";
      // Las reglas se exigen solo al registrarse. Al ingresar hay que aceptar
      // la contraseña que la persona ya tenga, aunque sea de antes de esta
      // regla: si no, quedaria afuera de su propia cuenta.
      else if (modo === "registrar") {
        // OJO: errorPassword devuelve null si esta bien, y asignarlo igual
        // dejaria la clave "password" en el objeto y el formulario nunca
        // se enviaria.
        const falla = errorPassword(valores.password);
        if (falla) e.password = falla;
      }
    }

    if (modo === "registrar" && !valores.nombre.trim()) e.nombre = "Ingresá tu nombre.";

    setErrores(e);

    // Foco en el primer campo con problema: quien navega con teclado o lector
    // de pantalla no ve el mensaje rojo si no lo llevamos hasta ahi.
    const primero = Object.keys(e)[0];
    if (primero) document.getElementById(`auth-${primero}`)?.focus();

    return Object.keys(e).length === 0;
  }

  async function enviar(evento) {
    evento.preventDefault();
    if (!validar()) return;

    setEnviando(true);
    setErrorGeneral(null);

    const email = valores.email.trim();
    let resultado;

    if (modo === "ingresar") {
      resultado = await entrarConMail({ email, password: valores.password });
    } else if (modo === "registrar") {
      resultado = await registrarConMail({
        nombre: valores.nombre,
        email,
        password: valores.password,
        telefono: valores.telefono,
      });
    } else {
      resultado = await recuperarContrasena(email);
    }

    setEnviando(false);

    if (!resultado.ok) {
      setErrorGeneral(resultado.error);
      return;
    }

    if (modo === "registrar" && resultado.necesitaConfirmar) {
      setAviso(
        `Te enviamos un correo a ${email}. Abrí el enlace para activar tu cuenta. Si no lo ves, revisá la carpeta de spam.`
      );
      setValores(VACIO);
      return;
    }

    if (modo === "recuperar") {
      // A proposito no se distingue si el correo existe: decirlo permitiria
      // averiguar quien tiene cuenta en el sitio.
      setAviso(
        `Si hay una cuenta con ${email}, te enviamos un correo para crear una contraseña nueva.`
      );
      setValores(VACIO);
      return;
    }

    onListo?.();
  }

  const titulos = {
    ingresar: "Iniciá sesión",
    registrar: "Creá tu cuenta",
    recuperar: "Recuperar contraseña",
  };

  const subtitulos = {
    ingresar: "Guardá tus favoritos y tenelos en todos tus dispositivos.",
    registrar: "Es gratis y te lleva menos de un minuto.",
    recuperar: "Te enviamos un enlace para crear una contraseña nueva.",
  };

  return (
    <div className="auth-form">
      <h2 className="auth-titulo">{titulos[modo]}</h2>
      <p className="auth-subtitulo">{subtitulos[modo]}</p>

      {modo !== "recuperar" && (
        <>
          <button type="button" className="auth-google" onClick={entrarConGoogle}>
            <IconGoogle /> Continuar con Google
          </button>
          <div className="auth-separador"><span>o con tu correo</span></div>
        </>
      )}

      {aviso ? (
        <div className="auth-aviso" role="status">
          <IconEnvelope />
          <p>{aviso}</p>
        </div>
      ) : (
        <form onSubmit={enviar} noValidate>
          {modo === "registrar" && (
            <div className="auth-campo">
              <label htmlFor="auth-nombre">Nombre y apellido</label>
              <input
                id="auth-nombre"
                ref={primerCampoRef}
                type="text"
                autoComplete="name"
                value={valores.nombre}
                onChange={(e) => actualizar("nombre", e.target.value)}
                aria-invalid={Boolean(errores.nombre)}
                aria-describedby={errores.nombre ? "auth-nombre-error" : undefined}
              />
              {errores.nombre && (
                <span className="auth-error-campo" id="auth-nombre-error">{errores.nombre}</span>
              )}
            </div>
          )}

          <div className="auth-campo">
            <label htmlFor="auth-email">Correo electrónico</label>
            <input
              id="auth-email"
              type="email"
              autoComplete="email"
              value={valores.email}
              onChange={(e) => actualizar("email", e.target.value)}
              aria-invalid={Boolean(errores.email)}
              aria-describedby={errores.email ? "auth-email-error" : undefined}
            />
            {errores.email && (
              <span className="auth-error-campo" id="auth-email-error">{errores.email}</span>
            )}
          </div>

          {modo === "registrar" && (
            <div className="auth-campo">
              <label htmlFor="auth-telefono">
                Teléfono <span className="auth-opcional">(opcional)</span>
              </label>
              <input
                id="auth-telefono"
                type="tel"
                autoComplete="tel"
                placeholder="Para poder contactarte por tu pedido"
                value={valores.telefono}
                onChange={(e) => actualizar("telefono", e.target.value)}
              />
            </div>
          )}

          {modo !== "recuperar" && (
            <div className="auth-campo">
              <label htmlFor="auth-password">Contraseña</label>
              <div className="auth-password">
                <input
                  id="auth-password"
                  type={verPassword ? "text" : "password"}
                  autoComplete={modo === "registrar" ? "new-password" : "current-password"}
                  value={valores.password}
                  onChange={(e) => actualizar("password", e.target.value)}
                  aria-invalid={Boolean(errores.password)}
                  aria-describedby={errores.password ? "auth-password-error" : undefined}
                />
                <button
                  type="button"
                  className="auth-ver"
                  onClick={() => setVerPassword((v) => !v)}
                  aria-label={verPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
                >
                  {verPassword ? "Ocultar" : "Ver"}
                </button>
              </div>
              {errores.password && (
                <span className="auth-error-campo" id="auth-password-error">{errores.password}</span>
              )}
              {modo === "registrar" && (
                <RequisitosPassword valor={valores.password} id="auth-password-requisitos" />
              )}
            </div>
          )}

          {errorGeneral && (
            <div className="auth-error-general" role="alert">{errorGeneral}</div>
          )}

          <button type="submit" className="btn-principal auth-enviar" disabled={enviando}>
            {enviando
              ? "Un momento..."
              : modo === "ingresar"
                ? "Ingresar"
                : modo === "registrar"
                  ? "Crear cuenta"
                  : "Enviar enlace"}
          </button>

          {modo === "registrar" && (
            <p className="auth-legal">
              Al crear tu cuenta aceptás los{" "}
              <Link to="/terminos-y-condiciones" target="_blank">Términos y Condiciones</Link> y la{" "}
              <Link to="/politica-de-privacidad" target="_blank">Política de Privacidad</Link>.
            </p>
          )}
        </form>
      )}

      <div className="auth-cambiar">
        {modo === "ingresar" && (
          <>
            <button type="button" onClick={() => setModo("recuperar")}>
              Olvidé mi contraseña
            </button>
            <span>
              ¿No tenés cuenta?{" "}
              <button type="button" onClick={() => setModo("registrar")}>Creá una</button>
            </span>
          </>
        )}

        {modo === "registrar" && (
          <span>
            ¿Ya tenés cuenta?{" "}
            <button type="button" onClick={() => setModo("ingresar")}>Iniciá sesión</button>
          </span>
        )}

        {modo === "recuperar" && (
          <button type="button" onClick={() => setModo("ingresar")}>
            Volver al inicio de sesión
          </button>
        )}
      </div>
    </div>
  );
}
