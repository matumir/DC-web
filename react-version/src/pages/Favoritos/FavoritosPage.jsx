import { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { IconHeart } from "../../components/icons/Icon";
import Breadcrumbs from "../../components/Breadcrumbs";
import { productos } from "../../data/productos";
import { useAuth } from "../../context/AuthContext";
import { useFavoritos } from "../../context/FavoritosContext";
import { useDocumentMeta } from "../../hooks/useDocumentMeta";
import TarjetaProducto from "../Productos/TarjetaProducto";

export default function FavoritosPage() {
  const { favoritos, cantidad, sincronizando } = useFavoritos();
  const { usuario, disponible } = useAuth();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useDocumentMeta({
    titulo: "Mis favoritos",
    descripcion: "Los productos que guardaste para tenerlos a mano.",
  });

  // Los favoritos guardan ids; el detalle del producto vive en los datos del
  // repo. Si un producto se dio de baja, su id queda sin match y lo ignoramos.
  const lista = useMemo(() => productos.filter((p) => favoritos.has(p.id)), [favoritos]);

  return (
    <section className="favoritos-page">
      <div className="favoritos-encabezado">
        <Breadcrumbs items={[{ label: "Inicio", to: "/" }, { label: "Mis favoritos" }]} />
        <h1>Mis favoritos</h1>
        <p>
          {cantidad === 0
            ? "Todavía no guardaste ningún producto."
            : `${cantidad} producto${cantidad === 1 ? "" : "s"} guardado${cantidad === 1 ? "" : "s"}.`}
          {sincronizando && " Sincronizando..."}
        </p>

        {/* Sin sesion los favoritos viven solo en este navegador. */}
        {cantidad > 0 && !usuario && disponible && (
          <span className="favoritos-aviso">
            Iniciá sesión para tenerlos también en tus otros dispositivos.
          </span>
        )}
      </div>

      {lista.length === 0 ? (
        <div className="favoritos-vacio">
          <IconHeart />
          <h2>Sin favoritos todavía</h2>
          <p>
            Tocá el corazón en cualquier producto para guardarlo acá y encontrarlo rápido la
            próxima vez.
          </p>
          <Link className="btn-ver" to="/productos">
            Ver productos
          </Link>
        </div>
      ) : (
        <div id="catalogo" className="catalogo">
          {lista.map((p) => (
            <TarjetaProducto producto={p} key={p.id} />
          ))}
        </div>
      )}
    </section>
  );
}
