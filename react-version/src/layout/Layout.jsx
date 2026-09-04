import { useState } from "react";
import { Outlet } from "react-router-dom";
import MiniHeader from "./MiniHeader";
import Header from "./Header";
import HeaderMobile from "./HeaderMobile";
import MobileMenu from "./MobileMenu";
import SearchOverlayMobile from "./SearchOverlayMobile";
import CartMobileDrawer from "./CartMobileDrawer";
import Footer from "./Footer";
import Notificacion from "./Notificacion";
import AvisoNovedades from "./AvisoNovedades";
import ModalAuth from "./auth/ModalAuth";
import ModalContrasena from "./auth/ModalContrasena";
import { useAuth } from "../context/AuthContext";
import WhatsAppFlotante from "./WhatsAppFlotante";
import ScrollToTopButton from "./ScrollToTopButton";

export default function Layout() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { modalAuth, cerrarModalAuth, modalContrasena, cerrarModalContrasena } = useAuth();

  return (
    <>
      <MiniHeader />
      <Header />
      <HeaderMobile onOpenMenu={() => setMenuOpen(true)} />
      <SearchOverlayMobile />
      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />

      <main>
        <Outlet />
      </main>

      <CartMobileDrawer />
      <Footer />
      <Notificacion />
      <AvisoNovedades />
      <ModalAuth abierto={modalAuth} onCerrar={cerrarModalAuth} />
      <ModalContrasena abierto={modalContrasena} onCerrar={cerrarModalContrasena} />
      <WhatsAppFlotante />
      <ScrollToTopButton />
    </>
  );
}
