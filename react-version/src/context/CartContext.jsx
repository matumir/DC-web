import { createContext, useContext, useEffect, useState } from "react";
import { sonar } from "../lib/sonido";
import { registrarConsulta } from "../lib/consultas";
import { WHATSAPP_NUMBER } from "../data/contacto";

const CartContext = createContext(null);
const STORAGE_KEY = "carrito";

function leerCarritoGuardado() {
  try {
    return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const [carrito, setCarrito] = useState(leerCarritoGuardado);
  const [notificacionVisible, setNotificacionVisible] = useState(false);
  const [cartMobileOpen, setCartMobileOpen] = useState(false);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(carrito));
  }, [carrito]);

  function agregarAlCarrito(producto, { cantidad, talle = null, color = null }) {
    setCarrito((prev) => {
      const existente = prev.find(
        (p) => p.id === producto.id && p.talle === talle && p.color === color
      );
      if (existente) {
        return prev.map((p) =>
          p === existente ? { ...p, cantidad: p.cantidad + cantidad } : p
        );
      }
      return [...prev, { ...producto, cantidad, talle, color }];
    });
    mostrarNotificacion();
  }

  function mostrarNotificacion() {
    setNotificacionVisible(true);
    sonar("carrito");
    setTimeout(() => setNotificacionVisible(false), 2000);
  }

  function eliminarDelCarrito(index) {
    setCarrito((prev) => prev.filter((_, i) => i !== index));
  }

  function abrirCarritoMobile() {
    setCartMobileOpen(true);
  }

  function cerrarCarritoMobile() {
    setCartMobileOpen(false);
  }

  const cartCount = carrito.reduce((acc, item) => acc + item.cantidad, 0);

  function enviarWhatsapp() {
    let msg = "**PEDIDO WEB**\nHola, quiero consultar por:\n";
    carrito.forEach((p) => {
      msg += `-${p.marca} | ${p.nombre} ${p.talle ? `(${p.talle})` : ""} ${
        p.color ? ` - ${p.color}` : ""
      } x ${p.cantidad}\n`;
    });
    // Solo el hecho de que se envio un pedido: nada del contenido del carrito.
    registrarConsulta({ tipo: "carrito" });

    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`);
  }

  return (
    <CartContext.Provider
      value={{
        carrito,
        agregarAlCarrito,
        eliminarDelCarrito,
        cartCount,
        enviarWhatsapp,
        notificacionVisible,
        cartMobileOpen,
        abrirCarritoMobile,
        cerrarCarritoMobile,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart debe usarse dentro de <CartProvider>");
  return ctx;
}
