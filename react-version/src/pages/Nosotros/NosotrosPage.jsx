import { useEffect } from "react";
import {
  IconCertificate,
  IconHandshake,
  IconShieldHalved,
  IconUserCheck,
} from "../../components/icons/Icon";
import { useDocumentMeta } from "../../hooks/useDocumentMeta";
import Animable from "./Animable";

export default function NosotrosPage() {
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  useDocumentMeta({
    titulo: "Nosotros",
    descripcion:
      "Conocé a Distribuidora Castelli: más de 25 años proveyendo artículos de seguridad industrial y protección personal.",
  });

  return (
    <section id="nosotros" className="nosotros">
      <Animable className="nosotros-hero">
        <img src="/imagenes/Grafico/nosotros1.webp" loading="lazy" decoding="async" alt="Sobre nosotros" />
        <div className="nosotros-hero-texto">
          <h1>SOBRE NOSOTROS</h1>
          <p>Tu seguridad, nuestro compromiso.</p>
        </div>
      </Animable>

      <Animable className="nosotros-texto">
        <h2>COMPROMETIDOS CON TU SEGURIDAD HACE MÁS DE 25 AÑOS</h2>
        <p>
          Distribuimos todo tipo de artículos para <strong>garantizar tu seguridad</strong>. Trabajamos
          con marcas reconocidas y ofrecemos soluciones confiables para empresas y trabajadores.
        </p>
      </Animable>

      <div className="nosotros-divider" />

      <div className="nosotros-secciones">
        <Animable className="nosotros-mision">
          <div className="mision-grid">
            <div className="mision-texto">
              <h3>
                Nuestra misión: <span>Proteger con calidad y compromiso.</span>
              </h3>
              <p>
                Trabajamos cada día para ofrecer artículos de seguridad industrial que cumplan con los
                más altos estándares de calidad, garantizando la protección y el bienestar de quienes
                los utilizan. Seleccionamos productos confiables y certificados, manteniendo precios
                competitivos y soluciones eficientes, porque entendemos que la seguridad no es un
                costo, sino una responsabilidad.
              </p>
            </div>

            <div className="mision-imagen">
              <img
                src="/imagenes/Grafico/nosotros2.webp"
                loading="lazy"
                decoding="async"
                alt="Nuestra misión"
              />
            </div>
          </div>
        </Animable>

        <div className="nosotros-divider" />

        <Animable className="nosotros-porque">
          <div className="porque-texto">
            <h3>
              <strong>¿Por qué elegirnos?</strong>
            </h3>
            <ul className="porque-lista">
              <li>
                <IconShieldHalved />
                <div>
                  <strong>Compromiso con la seguridad</strong>
                  <span>
                    Cada producto que ofrecemos está pensado para proteger a las personas y cumplir con
                    estándares de calidad confiables.
                  </span>
                </div>
              </li>

              <li>
                <IconUserCheck />
                <div>
                  <strong>Asesoramiento especializado</strong>
                  <span>
                    Acompañamos a nuestros clientes ayudándolos a elegir la solución adecuada según cada
                    necesidad y entorno de trabajo.
                  </span>
                </div>
              </li>

              <li>
                <IconCertificate />
                <div>
                  <strong>Calidad comprobada</strong>
                  <span>
                    Trabajamos con marcas reconocidas y productos certificados que garantizan
                    durabilidad y eficiencia.
                  </span>
                </div>
              </li>

              <li>
                <IconHandshake />
                <div>
                  <strong>Precio competitivo y confianza</strong>
                  <span>
                    Ofrecemos precios justos y construimos relaciones basadas en la seriedad y más de 20
                    años de experiencia.
                  </span>
                </div>
              </li>
            </ul>
          </div>
        </Animable>
      </div>
    </section>
  );
}
