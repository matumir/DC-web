import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useDocumentMeta } from "../../hooks/useDocumentMeta";
import FormularioAuth from "../../layout/auth/FormularioAuth";

/**
 * Version en pagina del formulario. Existe porque el modal no alcanza:
 * los enlaces de los correos y los accesos directos por URL necesitan una
 * pagina de verdad a donde llegar.
 *
 * Acepta ?modo=registrar para poder enlazar directo al alta.
 */
export default function IngresarPage() {
  const { usuario, cargando } = useAuth();
  const navegar = useNavigate();
  const [params] = useSearchParams();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useDocumentMeta({
    titulo: "Ingresar",
    descripcion: "Iniciá sesión o creá tu cuenta en Distribuidora Castelli.",
  });

  // Si ya hay sesion no tiene sentido mostrar el formulario. replace: true
  // evita que el boton "atras" devuelva al login ya resuelto.
  useEffect(() => {
    if (!cargando && usuario) navegar("/", { replace: true });
  }, [cargando, usuario, navegar]);

  if (cargando || usuario) return <section className="auth-pagina" />;

  return (
    <section className="auth-pagina">
      <div className="auth-caja">
        <FormularioAuth modoInicial={params.get("modo") === "registrar" ? "registrar" : "ingresar"} />
      </div>
    </section>
  );
}
