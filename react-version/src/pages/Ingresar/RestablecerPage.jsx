import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useDocumentMeta } from "../../hooks/useDocumentMeta";

const LARGO_MINIMO = 8;

/**
 * Adonde aterriza el enlace del correo de recuperacion.
 *
 * Supabase canjea el token de la URL por una sesion temporal antes de que
 * esta pagina se monte, asi que aca ya hay usuario y alcanza con updateUser.
 * Si alguien entra sin venir del correo, no hay sesion y se lo dice.
 */
export default function RestablecerPage() {
  const { usuario, cargando, definirContrasena, errorLogin } = useAuth();
  const navegar = useNavigate();

  const [password, setPassword] = useState("");
  const [repetir, setRepetir] = useState("");
  const [error, setError] = useState(null);
  const [guardando, setGuardando] = useState(false);
  const [listo, setListo] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useDocumentMeta({ titulo: "Restablecer contraseña" });

  async function enviar(e) {
    e.preventDefault();

    if (password.length < LARGO_MINIMO) {
      setError(`La contraseña necesita al menos ${LARGO_MINIMO} caracteres.`);
      return;
    }
    if (password !== repetir) {
      setError("Las dos contraseñas no coinciden.");
      return;
    }

    setGuardando(true);
    setError(null);
    const resultado = await definirContrasena(password);
    setGuardando(false);

    if (!resultado.ok) {
      setError(resultado.error);
      return;
    }
    setListo(true);
    setTimeout(() => navegar("/", { replace: true }), 2500);
  }

  if (cargando) return <section className="auth-pagina" />;

  // Sin sesion el enlace vencio, ya se uso, o entraron directo por la URL.
  if (!usuario) {
    return (
      <section className="auth-pagina">
        <div className="auth-caja">
          <h2 className="auth-titulo">Enlace no válido</h2>
          <p className="auth-subtitulo">
            {errorLogin ||
              "Este enlace venció o ya fue usado. Pedí uno nuevo desde “Olvidé mi contraseña”."}
          </p>
          <Link className="btn-principal auth-enviar" to="/ingresar">
            Ir a iniciar sesión
          </Link>
        </div>
      </section>
    );
  }

  if (listo) {
    return (
      <section className="auth-pagina">
        <div className="auth-caja">
          <h2 className="auth-titulo">Contraseña actualizada</h2>
          <p className="auth-subtitulo">Ya podés usarla para entrar. Te llevamos al inicio...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="auth-pagina">
      <div className="auth-caja">
        <div className="auth-form">
          <h2 className="auth-titulo">Elegí una contraseña nueva</h2>
          <p className="auth-subtitulo">Se aplica a la cuenta {usuario.email}.</p>

          <form onSubmit={enviar} noValidate>
            <div className="auth-campo">
              <label htmlFor="nueva">Contraseña nueva</label>
              <input
                id="nueva"
                type="password"
                autoComplete="new-password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError(null);
                }}
              />
              <span className="auth-ayuda">Mínimo {LARGO_MINIMO} caracteres.</span>
            </div>

            <div className="auth-campo">
              <label htmlFor="repetir">Repetir contraseña</label>
              <input
                id="repetir"
                type="password"
                autoComplete="new-password"
                value={repetir}
                onChange={(e) => {
                  setRepetir(e.target.value);
                  setError(null);
                }}
              />
            </div>

            {error && <div className="auth-error-general" role="alert">{error}</div>}

            <button type="submit" className="btn-principal auth-enviar" disabled={guardando}>
              {guardando ? "Guardando..." : "Guardar contraseña"}
            </button>
          </form>
        </div>
      </div>
    </section>
  );
}
