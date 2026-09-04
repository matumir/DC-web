import { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./layout/Layout";
import ErrorBoundary from "./components/ErrorBoundary";

const Home = lazy(() => import("./pages/Home/Home"));
const ProductosPage = lazy(() => import("./pages/Productos/ProductosPage"));
const DetallePage = lazy(() => import("./pages/Detalle/DetallePage"));
const CarritoPage = lazy(() => import("./pages/Carrito/CarritoPage"));
const FavoritosPage = lazy(() => import("./pages/Favoritos/FavoritosPage"));
const PoliticaPrivacidad = lazy(() => import("./pages/Legal/PoliticaPrivacidad"));
const TerminosCondiciones = lazy(() => import("./pages/Legal/TerminosCondiciones"));
const PanelPage = lazy(() => import("./pages/Panel/PanelPage"));
const IngresarPage = lazy(() => import("./pages/Ingresar/IngresarPage"));
const RestablecerPage = lazy(() => import("./pages/Ingresar/RestablecerPage"));
const BajaPage = lazy(() => import("./pages/Baja/BajaPage"));
const NosotrosPage = lazy(() => import("./pages/Nosotros/NosotrosPage"));
const EmpresasPage = lazy(() => import("./pages/Empresas/EmpresasPage"));
const ComingSoon = lazy(() => import("./pages/ComingSoon"));

export default function App() {
  return (
    <ErrorBoundary>
      <Suspense fallback={null}>
        <Routes>
          <Route element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="productos" element={<ProductosPage />} />
            <Route path="productos/filtrar/:categoria/:subcategoria/:marca" element={<ProductosPage />} />
            <Route path="productos/:categoria/:marca/:slug" element={<DetallePage />} />
            <Route path="nosotros" element={<NosotrosPage />} />
            <Route path="empresas" element={<EmpresasPage />} />
            <Route path="carrito" element={<CarritoPage />} />
            <Route path="favoritos" element={<FavoritosPage />} />
            <Route path="politica-de-privacidad" element={<PoliticaPrivacidad />} />
            <Route path="terminos-y-condiciones" element={<TerminosCondiciones />} />
            <Route path="panel" element={<PanelPage />} />
            <Route path="ingresar" element={<IngresarPage />} />
            <Route path="restablecer-contrasena" element={<RestablecerPage />} />
            <Route path="baja" element={<BajaPage />} />
            <Route path="*" element={<ComingSoon titulo="Página no encontrada" />} />
          </Route>
        </Routes>
      </Suspense>
    </ErrorBoundary>
  );
}
