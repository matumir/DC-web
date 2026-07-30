import { Link } from "react-router-dom";

// Sección de contenido institucional de la home.
// Además de informar al visitante, aporta el texto indexable que la home
// necesitaba: repite de forma natural las palabras clave del H1 (artículos de
// seguridad industrial, protección personal, Distribuidora Castelli) y mejora
// la proporción entre encabezados y contenido.
export default function TextoInstitucional() {
  return (
    <section className="texto-institucional">
      <div className="texto-institucional-contenido">
        <h2>Artículos de seguridad industrial y protección personal</h2>

        <p>
          En <strong>Distribuidora Castelli</strong> nos dedicamos a la venta de artículos de
          seguridad industrial y elementos de protección personal. Trabajamos hace más de 25 años en
          San Francisco, Córdoba. Abastecemos a empresas, comercios, productores y particulares de
          todo el país.
        </p>
        <p>
          Nuestro catálogo reúne más de 500 productos de las principales marcas del rubro. Cada
          artículo se elige pensando en la seguridad real del trabajador. Priorizamos la calidad,
          la durabilidad y el cumplimiento de la normativa vigente.
        </p>

        <h3>Qué vas a encontrar en nuestro catálogo</h3>
        <p>
          Contamos con <Link to="/productos/filtrar/calzado/todas/todas">calzado de seguridad</Link>{" "}
          con puntera de acero y modelos dieléctricos. También ofrecemos{" "}
          <Link to="/productos/filtrar/indumentaria/todas/todas">indumentaria de trabajo</Link>:
          pantalones cargo, camisas, mamelucos, camperas y ropa para lluvia. En protección de manos
          tenemos <Link to="/productos/filtrar/guantes/todas/todas">guantes</Link> de descarne,
          anticorte, de nitrilo y para tareas específicas.
        </p>
        <p>
          Sumamos líneas completas de protección ocular, auditiva, respiratoria y craneal. Para
          trabajos en altura disponemos de arneses, cabos de vida y kits homologados. Completan el
          catálogo la señalización de seguridad, los elementos de izaje y carga, y los insumos de uso
          diario.
        </p>

        <h3>Asesoramiento y atención personalizada</h3>
        <p>
          No vendemos productos sueltos: te ayudamos a elegir el elemento correcto. Cada tarea tiene
          su riesgo y cada riesgo su protección adecuada. Nuestro equipo te asesora según el rubro, la
          actividad y las condiciones del puesto de trabajo.
        </p>
        <p>
          Atendemos consultas por WhatsApp, teléfono y de forma presencial en nuestro local de
          Castelli 2948, San Francisco. Podés armar tu pedido desde la web y enviárnoslo en un solo
          mensaje. Te respondemos con disponibilidad, precios y plazos de entrega.
        </p>

        <h3>Equipamiento para empresas</h3>
        <p>
          Trabajamos con empresas de todos los tamaños. Preparamos pedidos corporativos con precios
          especiales por volumen y entregas coordinadas. También ofrecemos indumentaria personalizada
          con el logo de tu empresa.
        </p>
        <p>
          Si necesitás equipar a tu personal, escribinos desde la sección{" "}
          <Link to="/empresas">Empresas</Link>. Contanos qué rubro tenés y cuántas personas trabajan
          con vos. Armamos una propuesta a medida, sin compromiso.
        </p>
      </div>
    </section>
  );
}
