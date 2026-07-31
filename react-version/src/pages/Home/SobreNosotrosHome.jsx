import { Link } from "react-router-dom";

export default function SobreNosotrosHome() {
  return (
    <section className="home-institucional">
      <div className="home-institucional-inner">
        <div className="home-institucional-imagen">
          <img
            src="/imagenes/Grafico/nosotros2.webp"
            loading="lazy"
            decoding="async"
            alt="Trabajadores equipados con elementos de protección personal"
          />
        </div>

        <div className="home-institucional-texto">
          <h2>Hace más de 25 años equipamos a quienes trabajan</h2>
          <p>
            Somos una distribuidora de artículos de seguridad industrial y protección personal de
            San Francisco, Córdoba. Abastecemos a empresas, comercios, productores y particulares de
            todo el país.
          </p>
          <p>
            Trabajamos con las principales marcas del rubro y priorizamos la calidad, la durabilidad
            y el cumplimiento de la normativa vigente.
          </p>
          <Link className="link-subrayado" to="/nosotros">
            Conocé Distribuidora Castelli
          </Link>
        </div>
      </div>
    </section>
  );
}
