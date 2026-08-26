import { Link } from "react-router-dom";
import {
  IconEnvelope,
  IconFacebook,
  IconInstagram,
  IconLocationDot,
  IconPhone,
  IconWhatsapp,
} from "../components/icons/Icon";
export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-col">
          <h4>Menú</h4>
          <ul>
            <li>
              <Link to="/">Inicio</Link>
            </li>
            <li>
              <Link to="/productos">Productos</Link>
            </li>
            <li>
              <Link to="/nosotros">Nosotros</Link>
            </li>
            <li>
              <Link to="/empresas">Empresas</Link>
            </li>
            <li>
              <Link to="/carrito">Carrito</Link>
            </li>
          </ul>
        </div>

        <div className="footer-col">
          <h4>Contacto</h4>
          <ul className="footer-contacto">
            <li>
              <IconLocationDot /> Castelli 2948, San Francisco
            </li>
            <li>
              <IconWhatsapp /> +54 9 3564 598969
            </li>
            <li>
              <IconPhone /> +54 9 3564 435909 (Tel.)
            </li>
            <li>
              <IconEnvelope /> castellidistribuidorasf@gmail.com
            </li>
          </ul>

          {/* Data Fiscal de AFIP. El sitio va por HTTPS, asi que la imagen se
              pide por https:// (el snippet que da AFIP usa http:// y el
              navegador lo bloquearia por contenido mixto). */}
          <a
            className="footer-afip"
            href="https://qr.afip.gob.ar/?qr=LlgQP9o0el4c1uHRABhVXA,,"
            target="_F960AFIPInfo"
            rel="noopener noreferrer"
          >
            <img
              src="https://www.afip.gob.ar/images/f960/DATAWEB.jpg"
              alt="Data Fiscal - AFIP"
              width="239"
              height="327"
              loading="lazy"
              decoding="async"
            />
          </a>
        </div>

        <div className="footer-col">
          <h4>Redes sociales</h4>
          <p>Seguinos para conocer novedades y productos.</p>
          <div className="footer-redes">
            <a
              href="https://www.instagram.com/distribuidoracastelli.sf"
              target="_blank"
              rel="noopener noreferrer"
            >
              <IconInstagram />
            </a>
            <a
              href="https://www.facebook.com/profile.php?id=61584264827973"
              target="_blank"
              rel="noopener noreferrer"
            >
              <IconFacebook />
            </a>
            <a href="https://wa.me/5493564598969" target="_blank" className="whatsapp" rel="noopener noreferrer">
              <IconWhatsapp />
            </a>
          </div>
        </div>

        <div className="footer-col footer-mapa">
          <h4>Ubicación</h4>
          <iframe
            title="Ubicación Distribuidora Castelli"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3404.758466896376!2d-62.099648125026775!3d-31.42078009646262!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x95cb283866c553db%3A0x95cccbdd84ce2e87!2sDistribuidora%20Castelli%20de%20Juan%20Salvay!5e0!3m2!1ses-419!2sar!4v1768306948277!5m2!1ses-419!2sar"
            width="600"
            height="450"
            style={{ border: 0 }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>

      <div className="footer-bottom">
        Distribuidora Castelli © Todos los derechos reservados. Desarrollado por{" "}
        <a
          href="https://instagram.com/matuu.miranda"
          target="_blank"
          rel="noopener noreferrer"
          className="developer-link"
        >
          Mateo Miranda
        </a>
        .
      </div>
    </footer>
  );
}
