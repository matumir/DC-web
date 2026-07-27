import Banner from "./Banner";
import CategoriasHome from "./CategoriasHome";
import Destacados from "./Destacados";
import EmpresasTeaser from "./EmpresasTeaser";
import MarcasCarrusel from "./MarcasCarrusel";
import { useDocumentMeta } from "../../hooks/useDocumentMeta";
import { SITE_URL } from "../../data/siteUrl";

export default function Home() {
  useDocumentMeta({
    descripcion:
      "Distribuidora Castelli: artículos de seguridad industrial y protección personal en San Francisco, Córdoba y todo el país.",
    imagen: SITE_URL + "/og-image.jpg",
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
    </>
  );
}
