import { useSearch } from "../context/SearchContext";
import { useCart } from "../context/CartContext";

export default function HeaderMobile({ onOpenMenu }) {
  const { setMobileOpen } = useSearch();
  const { cartCount, abrirCarritoMobile } = useCart();

  return (
    <header className="header-mobile">
      <button className="btn-menu-mobile" onClick={onOpenMenu}>
        <img src="/imagenes/logos/menu.webp" loading="lazy" decoding="async" alt="Menú" />
      </button>

      <div className="logo-mobile">
        <img src="/imagenes/logos/logopest.webp" loading="lazy" decoding="async" alt="Logo" />
      </div>

      <div className="acciones-mobile">
        <button className="btn-search-mobile" id="btnBuscarMobile" onClick={() => setMobileOpen(true)}>
          <img src="/imagenes/logos/lupa.webp" loading="lazy" decoding="async" alt="Buscar" />
        </button>

        <button className="btn-carrito-mobile" id="btnCarritoMobile" onClick={abrirCarritoMobile}>
          <img
            src="/imagenes/logos/carritomob.webp"
            loading="lazy"
            decoding="async"
            alt="Carrito"
          />
          <span id="contadorCarritoMobile">{cartCount}</span>
        </button>
      </div>
    </header>
  );
}
