import { useEffect } from "react";
import { Link } from "react-router-dom";
import Breadcrumbs from "../../components/Breadcrumbs";
import { EMPRESA, ULTIMA_ACTUALIZACION } from "../../data/legal";
import { useDocumentMeta } from "../../hooks/useDocumentMeta";

export default function PoliticaPrivacidad() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useDocumentMeta({
    titulo: "Política de Privacidad",
    descripcion:
      "Cómo Distribuidora Castelli recolecta, usa y protege tus datos personales, y cómo podés ejercer tus derechos.",
  });

  return (
    <section className="legal">
      <div className="legal-contenido">
        <Breadcrumbs items={[{ label: "Inicio", to: "/" }, { label: "Política de Privacidad" }]} />

        <h1>Política de Privacidad</h1>
        <p className="legal-fecha">Última actualización: {ULTIMA_ACTUALIZACION}</p>

        <p>
          En {EMPRESA.nombre} tratamos tus datos personales con el cuidado que exige la{" "}
          <strong>Ley 25.326 de Protección de Datos Personales</strong> de la República Argentina.
          Este documento explica qué información recolectamos, para qué la usamos y cómo podés
          controlarla.
        </p>

        <h2>1. Quién es responsable de tus datos</h2>
        <p>
          El responsable de la base de datos es <strong>{EMPRESA.nombre}</strong>, con domicilio en{" "}
          {EMPRESA.domicilio}. Ante cualquier consulta sobre tus datos podés escribirnos a{" "}
          <a href={`mailto:${EMPRESA.email}`}>{EMPRESA.email}</a>.
        </p>

        <h2>2. Qué datos recolectamos</h2>
        <p>Solo recolectamos lo que hace falta para que el sitio funcione:</p>
        <ul>
          <li>
            <strong>Si iniciás sesión con Google:</strong> tu nombre, tu dirección de correo
            electrónico y tu foto de perfil. No accedemos a tus contactos, a tu agenda ni a ningún
            otro contenido de tu cuenta de Google, ni conocemos tu contraseña en ningún momento.
          </li>
          <li>
            <strong>Tus favoritos:</strong> la lista de productos que marcás para guardar.
          </li>
          <li>
            <strong>Tu preferencia de novedades:</strong> si aceptaste o no recibir correos
            promocionales, junto con la fecha en que lo decidiste.
          </li>
          <li>
            <strong>Si nos escribís por el formulario de empresas:</strong> los datos que completás
            (empresa, localidad, provincia, remitente y mensaje), que se envían por WhatsApp.
          </li>
        </ul>
        <p>
          <strong>No usamos cookies de seguimiento, publicidad ni analítica.</strong> El carrito y
          los favoritos se guardan en el almacenamiento local de tu propio navegador, que no viaja a
          ningún servidor salvo que inicies sesión.
        </p>

        <h2>3. Para qué usamos tus datos</h2>
        <ul>
          <li>Identificarte cuando iniciás sesión.</li>
          <li>Sincronizar tus favoritos entre los dispositivos que uses.</li>
          <li>Responder las consultas que nos hagas.</li>
          <li>
            Enviarte novedades y promociones <strong>únicamente si diste tu consentimiento
            expreso</strong> marcando la casilla correspondiente.
          </li>
        </ul>
        <p>
          Nunca vendemos, alquilamos ni cedemos tus datos a terceros con fines comerciales.
        </p>

        <h2>4. Servicios de terceros</h2>
        <p>Para funcionar, el sitio se apoya en estos servicios, cada uno con su propia política:</p>
        <ul>
          <li>
            <strong>Supabase:</strong> aloja la base de datos donde se guardan tu perfil y tus
            favoritos.
          </li>
          <li>
            <strong>Google:</strong> gestiona el inicio de sesión. Google sabe que iniciaste sesión
            en nuestro sitio.
          </li>
          <li>
            <strong>WhatsApp (Meta):</strong> es el canal por el que llegan las consultas del
            formulario y del carrito.
          </li>
          <li>
            <strong>Google Maps:</strong> muestra el mapa de nuestra ubicación en el pie de página.
          </li>
        </ul>

        <h2>5. Cuánto tiempo conservamos tus datos</h2>
        <p>
          Mantenemos tu cuenta y tus favoritos mientras la cuenta siga activa. Si pedís que la
          eliminemos, borramos tus datos de nuestra base. Los mensajes que nos enviaste por WhatsApp
          quedan en ese servicio según sus propias condiciones.
        </p>

        <h2>6. Tus derechos</h2>
        <p>
          La Ley 25.326 te garantiza los derechos de <strong>acceso, rectificación, actualización y
          supresión</strong> de tus datos personales. Para ejercerlos, escribinos a{" "}
          <a href={`mailto:${EMPRESA.email}`}>{EMPRESA.email}</a> desde la dirección con la que te
          registraste y te respondemos en los plazos que fija la ley.
        </p>
        <p>
          Podés darte de baja de los correos promocionales en cualquier momento desde tu menú de
          usuario, o desde el enlace de baja incluido en cada correo. La baja es inmediata y no
          afecta el resto de tu cuenta.
        </p>
        <p className="legal-nota">
          La <strong>Agencia de Acceso a la Información Pública</strong>, en su carácter de órgano de
          control de la Ley 25.326, tiene la atribución de atender las denuncias y reclamos que
          interpongan quienes resulten afectados en sus derechos por incumplimiento de las normas
          vigentes en materia de protección de datos personales.
        </p>

        <h2>7. Seguridad</h2>
        <p>
          El sitio se sirve por conexión cifrada (HTTPS) y el acceso a la base de datos está
          restringido por políticas que garantizan que cada usuario solo pueda leer y modificar su
          propia información. Ningún sistema es infalible, pero aplicamos las medidas técnicas
          razonables para proteger tus datos.
        </p>

        <h2>8. Menores de edad</h2>
        <p>
          El sitio está dirigido a personas mayores de 18 años y a empresas. No recolectamos
          intencionalmente datos de menores de edad.
        </p>

        <h2>9. Cambios en esta política</h2>
        <p>
          Si modificamos este documento, actualizamos la fecha del encabezado. Cuando el cambio sea
          sustancial, te lo notificaremos y volveremos a pedirte la aceptación al iniciar sesión.
        </p>

        <p className="legal-relacionado">
          Ver también los <Link to="/terminos-y-condiciones">Términos y Condiciones</Link>.
        </p>
      </div>
    </section>
  );
}
