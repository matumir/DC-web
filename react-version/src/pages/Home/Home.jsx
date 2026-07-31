import Banner from "./Banner";
import CategoriasHome from "./CategoriasHome";
import Destacados from "./Destacados";
import EmpresasTeaser from "./EmpresasTeaser";
import MarcasCarrusel from "./MarcasCarrusel";
import SobreNosotrosHome from "./SobreNosotrosHome";
import LineasProductos from "./LineasProductos";
import CtaFinalHome from "./CtaFinalHome";
import { useDocumentMeta } from "../../hooks/useDocumentMeta";
import { useStructuredData } from "../../hooks/useStructuredData";
import { SITE_URL } from "../../data/siteUrl";

export default function Home() {
  useDocumentMeta({
    titulo: "Seguridad Industrial y Protección Personal",
    descripcion:
      "Distribuidora Castelli: artículos de seguridad industrial y protección personal en San Francisco, Córdoba y todo el país.",
    imagen: SITE_URL + "/og-image.jpg",
  });

  // Datos del negocio para búsquedas locales (Google Maps / "cerca mío").
  // Solo se declaran datos verificables del sitio: no se inventan horarios ni coordenadas.
  useStructuredData({
    "@context": "https://schema.org",
    "@type": "Store",
    name: "Distribuidora Castelli",
    description:
      "Venta de artículos de seguridad industrial y elementos de protección personal en San Francisco, Córdoba.",
    url: SITE_URL,
    image: SITE_URL + "/og-image.jpg",
    logo: SITE_URL + "/imagenes/logos/LOGO.webp",
    telephone: "+5493564435909",
    email: "castellidistribuidorasf@gmail.com",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Castelli 2948",
      addressLocality: "San Francisco",
      addressRegion: "Córdoba",
      addressCountry: "AR",
    },
    areaServed: "AR",
    sameAs: [
      "https://www.instagram.com/distribuidoracastelli.sf",
      "https://www.facebook.com/profile.php?id=61584264827973",
    ],
  });

  return (
    <>
      <h1 className="visually-hidden">
        Distribuidora Castelli - Artículos de seguridad industrial y protección personal
      </h1>
      <Banner />
      <CategoriasHome />
      <Destacados />
      <EmpresasTeaser />
      <MarcasCarrusel />
      <SobreNosotrosHome />
      <LineasProductos />
      <CtaFinalHome />
    </>
  );
}
