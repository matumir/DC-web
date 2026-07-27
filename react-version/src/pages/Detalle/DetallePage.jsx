import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { IconArrowLeft } from "../../components/icons/Icon";
import Breadcrumbs from "../../components/Breadcrumbs";
import { productos } from "../../data/productos";
import { buscarProductoPorSlug, productoUrl } from "../../utils/productoUrl";
import { imagenPrincipal } from "../../hooks/useProductSearch";
import { useDocumentMeta } from "../../hooks/useDocumentMeta";
import { useStructuredData } from "../../hooks/useStructuredData";
import { SITE_URL } from "../../data/siteUrl";
import { slugify } from "../../utils/slug";
import Galeria from "./Galeria";
import InfoProducto from "./InfoProducto";
import CarritoAside from "./CarritoAside";
import DescripcionTabs from "./DescripcionTabs";
import Relacionados from "./Relacionados";
import AgregarFlotanteMobile from "./AgregarFlotanteMobile";
import { useDetalleProducto } from "./useDetalleProducto";

export default function DetallePage() {
  const { categoria, marca, slug } = useParams();
  const navigate = useNavigate();
  const producto = buscarProductoPorSlug(productos, categoria, marca, slug);
  const detalle = useDetalleProducto(producto);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [categoria, marca, slug]);

  useDocumentMeta({
    titulo: producto ? `${producto.marca ? `${producto.marca} | ` : ""}${producto.nombre}` : "Producto no encontrado",
    descripcion: producto
      ? `${producto.marca || ""} ${producto.nombre} - ${producto.categoria}. Consultá precio y disponibilidad.`
      : undefined,
    imagen: producto ? SITE_URL + imagenPrincipal(producto) : undefined,
    url: producto ? SITE_URL + productoUrl(producto) : undefined,
  });

  useStructuredData(
    producto && {
      "@context": "https://schema.org",
      "@type": "Product",
      name: producto.nombre,
      image: [SITE_URL + imagenPrincipal(producto)],
      description: `${producto.marca || ""} ${producto.nombre} - ${producto.categoria}`.trim(),
      category: producto.categoria,
      ...(producto.marca && { brand: { "@type": "Brand", name: producto.marca } }),
    }
  );

  useStructuredData(
    producto && {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Inicio", item: SITE_URL + "/" },
        { "@type": "ListItem", position: 2, name: "Productos", item: SITE_URL + "/productos" },
        {
          "@type": "ListItem",
          position: 3,
          name: producto.categoria,
          item: `${SITE_URL}/productos/filtrar/${slugify(producto.categoria)}/todas/todas`,
        },
        {
          "@type": "ListItem",
          position: 4,
          name: producto.nombre,
          item: SITE_URL + productoUrl(producto),
        },
      ],
    }
  );

  if (!producto) {
    return (
      <section id="vistaProducto">
        <button className="volver" onClick={() => navigate(-1)}>
          <IconArrowLeft /> Volver
        </button>
        <p style={{ padding: "40px 24px" }}>No encontramos ese producto.</p>
      </section>
    );
  }

  return (
    <section id="vistaProducto">
      <Breadcrumbs
        items={[
          { label: "Inicio", to: "/" },
          { label: "Productos", to: "/productos" },
          { label: producto.categoria, to: `/productos/filtrar/${slugify(producto.categoria)}/todas/todas` },
          { label: producto.nombre },
        ]}
      />

      <button id="volverCatalogo" className="volver" onClick={() => navigate(-1)}>
        <IconArrowLeft /> Volver
      </button>

      <div className="detalle-layout">
        <Galeria producto={producto} detalle={detalle} />
        <InfoProducto producto={producto} detalle={detalle} />
        <CarritoAside />
      </div>

      <DescripcionTabs
        producto={producto}
        tabActivo={detalle.tabActivo}
        setTabActivo={detalle.setTabActivo}
      />

      <Relacionados producto={producto} />

      <AgregarFlotanteMobile producto={producto} />
    </section>
  );
}
