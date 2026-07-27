import { Link } from "react-router-dom";
import { IconHandshake } from "../../components/icons/Icon";

export default function EmpresasTeaser() {
  return (
    <section className="empresas-teaser">
      <div className="empresas-teaser-icono">
        <IconHandshake />
      </div>
      <div className="empresas-teaser-texto">
        <h2>¿Sos empresa?</h2>
        <p>
          Armamos pedidos corporativos con asesoramiento personalizado y precios especiales por
          volumen para equipar a todo tu equipo de trabajo.
        </p>
      </div>
      <Link className="btn-principal" to="/empresas">
        Conocé Empresas
      </Link>
    </section>
  );
}
