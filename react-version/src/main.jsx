import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import "./index.css";
import "./styles/styles.css";
import "./styles/mobile.css";
import { AuthProvider } from "./context/AuthContext";
import { FavoritosProvider } from "./context/FavoritosContext";
import { CartProvider } from "./context/CartContext";
import { SearchProvider } from "./context/SearchContext";
import App from "./App.jsx";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <FavoritosProvider>
          <CartProvider>
            <SearchProvider>
              <App />
            </SearchProvider>
          </CartProvider>
        </FavoritosProvider>
      </AuthProvider>
    </BrowserRouter>
  </StrictMode>
);
