import { useEffect } from "react";
import { Link } from "react-router-dom";
import Breadcrumbs from "../../components/Breadcrumbs";
import { EMPRESA, ULTIMA_ACTUALIZACION } from "../../data/legal";
import { useDocumentMeta } from "../../hooks/useDocumentMeta";

export default function TerminosCondiciones() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useDocumentMeta({
    titulo: "Términos y Condiciones",
    descripcion:
      "Condiciones de uso del sitio de Distribuidora Castelli: catálogo, consultas, cuentas de usuario y precios.",
  });

  return (
    <section className="legal">
      <div className="legal-contenido">
        <Breadcrumbs items={[{ label: "Inicio", to: "/" }, { label: "Términos y Condiciones" }]} />

        <h1>Términos y Condiciones</h1>
        <p className="legal-fecha">Última actualización: {ULTIMA_ACTUALIZACION}</p>

        <p>
          Estos términos regulan el uso del sitio web de <strong>{EMPRESA.nombre}</strong>, con
          domicilio en {EMPRESA.domicilio}. Al navegar el sitio o crear una cuenta, aceptás las
          condiciones que siguen.
        </p>

        <h2>1. Qué es este sitio</h2>
        <p>
          Este sitio es un <strong>catálogo informativo</strong> de artículos de seguridad industrial
          y protección personal. <strong>No es una tienda online:</strong> no se realizan compras ni
          pagos a través del sitio. El carrito es una herramienta para armar tu consulta, que se
          envía por WhatsApp para que coordinemos el pedido de forma personal.
        </p>

        <h2>2. Precios, stock y disponibilidad</h2>
        <p>
          El sitio no publica precios. La disponibilidad de los productos exhibidos{" "}
          <strong>está sujeta a confirmación</strong> al momento de la consulta: la presencia de un
          artículo en el catálogo no garantiza que haya stock ni constituye una oferta en los
          términos del Código Civil y Comercial.
        </p>
        <p>
          Toda cotización que enviemos tiene la validez que se indique en cada caso y puede variar
          por cambios de costos, disponibilidad del fabricante o condiciones de entrega.
        </p>

        <h2>3. Imágenes y descripciones</h2>
        <p>
          Las fotografías son <strong>ilustrativas</strong>. Los colores pueden verse distintos según
          la pantalla, y los fabricantes pueden modificar presentaciones, envases o detalles de
          terminación sin previo aviso. Las especificaciones técnicas y las fichas de producto se
          publican tal como las provee cada fabricante; ante cualquier duda sobre si un producto es
          apto para una tarea determinada, consultanos antes de decidir la compra.
        </p>

        <h2>4. Cuentas de usuario</h2>
        <p>
          Podés navegar el catálogo completo sin registrarte. La cuenta es opcional y sirve para
          guardar favoritos y sincronizarlos entre dispositivos. Al crear una cuenta te comprometés
          a que los datos sean veraces y a no usarla de forma que perjudique el funcionamiento del
          sitio o los derechos de terceros.
        </p>
        <p>
          Podés pedir la eliminación de tu cuenta cuando quieras escribiendo a{" "}
          <a href={`mailto:${EMPRESA.email}`}>{EMPRESA.email}</a>. Nos reservamos el derecho de
          suspender cuentas ante un uso abusivo o fraudulento.
        </p>

        <h2>5. Uso del contenido</h2>
        <p>
          Los textos, el diseño y la selección del catálogo son propiedad de {EMPRESA.nombre}. Las
          marcas y logotipos de los fabricantes pertenecen a sus respectivos titulares y se muestran
          únicamente para identificar los productos que comercializamos. No está permitida la
          reproducción del contenido con fines comerciales sin autorización previa.
        </p>

        <h2>6. Responsabilidad</h2>
        <p>
          Procuramos que la información publicada sea correcta y esté actualizada, pero pueden
          existir errores de carga o desactualizaciones. Los elementos de protección personal deben
          seleccionarse según el riesgo de cada puesto de trabajo y utilizarse conforme a las
          instrucciones del fabricante y a la normativa de higiene y seguridad aplicable. La
          información del sitio no sustituye el asesoramiento profesional en materia de seguridad e
          higiene laboral.
        </p>
        <p>
          No garantizamos que el sitio esté disponible de forma ininterrumpida, ya que depende de
          servicios de terceros y de tareas de mantenimiento.
        </p>

        <h2>7. Enlaces y servicios de terceros</h2>
        <p>
          El sitio enlaza a servicios externos como WhatsApp, Google y Google Maps, que se rigen por
          sus propios términos. No respondemos por el contenido ni por las prácticas de esos
          servicios.
        </p>

        <h2>8. Protección de datos</h2>
        <p>
          El tratamiento de tus datos personales se rige por nuestra{" "}
          <Link to="/politica-de-privacidad">Política de Privacidad</Link>, que forma parte
          integrante de estos términos.
        </p>

        <h2>9. Modificaciones</h2>
        <p>
          Podemos actualizar estos términos para reflejar cambios en el servicio o en la normativa.
          La fecha del encabezado indica la última revisión. Si el cambio es sustancial, te pediremos
          la aceptación nuevamente al iniciar sesión.
        </p>

        <h2>10. Ley aplicable y jurisdicción</h2>
        <p>
          Estos términos se rigen por las leyes de la República Argentina. Ante cualquier
          controversia, las partes se someten a los tribunales ordinarios de la ciudad de San
          Francisco, Provincia de Córdoba, renunciando a cualquier otro fuero que pudiera
          corresponder.
        </p>

        <h2>11. Contacto</h2>
        <p>
          Por cualquier consulta sobre estos términos: <a href={`mailto:${EMPRESA.email}`}>{EMPRESA.email}</a>{" "}
          o al {EMPRESA.telefono}.
        </p>

        <p className="legal-relacionado">
          Ver también la <Link to="/politica-de-privacidad">Política de Privacidad</Link>.
        </p>
      </div>
    </section>
  );
}
