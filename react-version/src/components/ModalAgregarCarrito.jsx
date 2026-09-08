import { useRef, useState } from "react";
import { createPortal } from "react-dom";
import { IconCartPlus } from "./icons/Icon";
import { useCart } from "../context/CartContext";
import { useDialogo } from "../hooks/useDialogo";
import { obtenerColorCSS } from "../pages/Detalle/detalleUtils";

const MAXIMO = 999;

/**
 * Elegir cantidad, talle y color sin salir del listado.
 *
 * Se monta con createPortal en el body y no dentro de la tarjeta: .card:hover
 * aplica un transform, y un elemento position:fixed dentro de un ancestro
 * transformado se posiciona respecto de ese ancestro en vez de la ventana.
 * Ademas la tarjeta tiene overflow:hidden, que lo recortaria.
 */
export default function ModalAgregarCarrito({ producto, abierto, onCerrar, colorInicial = 0 }) {
  const { agregarAlCarrito } = useCart();
  const cajaRef = useRef(null);

  const talles = Array.isArray(producto.talles) ? producto.talles : [];
  const colores = Array.isArray(producto.colores) ? producto.colores : [];
  const tieneTalles = talles.length > 0;
  const tieneColores = colores.length > 0;

  // Con un solo talle no tiene sentido hacerlo elegir: se da por elegido.
  const [talle, setTalle] = useState(talles.length === 1 ? String(talles[0]) : "");
  // Arranca en el color que la tarjeta venia mostrando: si alguien miro el
  // azul y toca agregar, esperaba el azul.
  const [colorIndex, setColorIndex] = useState(colorInicial);
  const [cantidad, setCantidad] = useState("1");
  const [error, setError] = useState(null);

  useDialogo({ abierto, onCerrar, cajaRef });

  if (!abierto) return null;

  const imagen = tieneColores ? colores[colorIndex]?.imagenes?.[0] : producto.imagenes?.[0];
  const numero = parseInt(cantidad, 10);

  function cambiarCantidad(delta) {
    const base = Number.isNaN(numero) ? 1 : numero;
    setCantidad(String(Math.min(MAXIMO, Math.max(1, base + delta))));
    setError(null);
  }

  function confirmar() {
    if (tieneTalles && !talle) {
      setError("Elegí un talle para continuar.");
      document.getElementById("modal-talles")?.focus();
      return;
    }
    if (Number.isNaN(numero) || numero < 1) {
      setError("La cantidad tiene que ser 1 o más.");
      document.getElementById("modal-cantidad")?.focus();
      return;
    }

    agregarAlCarrito(producto, {
      cantidad: Math.min(MAXIMO, numero),
      talle: tieneTalles ? talle : null,
      color: tieneColores ? colores[colorIndex].nombre : null,
    });
    onCerrar();
  }

  return createPortal(
    <div className="carrito-modal-fondo" onClick={onCerrar}>
      <div
        className="carrito-modal"
        role="dialog"
        aria-modal="true"
        aria-label={`Agregar ${producto.nombre} al carrito`}
        tabIndex={-1}
        ref={cajaRef}
        onClick={(e) => e.stopPropagation()}
      >
        <button className="carrito-modal-cerrar" onClick={onCerrar} aria-label="Cerrar">
          ×
        </button>

        <div className="carrito-modal-producto">
          {imagen && <img src={imagen} alt="" loading="lazy" decoding="async" />}
          <div>
            {producto.marca && <span className="carrito-modal-marca">{producto.marca}</span>}
            <h2>{producto.nombre}</h2>
          </div>
        </div>

        {tieneColores && (
          <div className="carrito-modal-campo">
            <span className="carrito-modal-label">
              Color <strong>{colores[colorIndex].nombre}</strong>
            </span>
            <div className="carrito-modal-colores">
              {colores.map((color, index) => (
                <button
                  type="button"
                  key={color.nombre}
                  className={`carrito-modal-color${index === colorIndex ? " activo" : ""}`}
                  style={{ background: obtenerColorCSS(color.nombre) }}
                  title={color.nombre}
                  aria-label={color.nombre}
                  aria-pressed={index === colorIndex}
                  onClick={() => setColorIndex(index)}
                />
              ))}
            </div>
          </div>
        )}

        {tieneTalles && (
          <div className="carrito-modal-campo">
            <span className="carrito-modal-label" id="modal-talles-label">
              Talle
            </span>
            <div
              className="carrito-modal-talles"
              id="modal-talles"
              role="group"
              aria-labelledby="modal-talles-label"
              tabIndex={-1}
            >
              {talles.map((t) => (
                <button
                  type="button"
                  key={t}
                  className={`carrito-modal-talle${String(t) === talle ? " activo" : ""}`}
                  aria-pressed={String(t) === talle}
                  onClick={() => {
                    setTalle(String(t));
                    setError(null);
                  }}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>
        )}

        <div className="carrito-modal-campo">
          <span className="carrito-modal-label">Cantidad</span>
          <div className="carrito-modal-cantidad">
            <button
              type="button"
              onClick={() => cambiarCantidad(-1)}
              aria-label="Quitar uno"
              disabled={numero <= 1}
            >
              −
            </button>
            <input
              id="modal-cantidad"
              type="number"
              min="1"
              max={MAXIMO}
              inputMode="numeric"
              value={cantidad}
              onChange={(e) => {
                setCantidad(e.target.value);
                setError(null);
              }}
              aria-label="Cantidad"
            />
            <button type="button" onClick={() => cambiarCantidad(1)} aria-label="Sumar uno">
              +
            </button>
          </div>
        </div>

        {error && (
          <p className="carrito-modal-error" role="alert">
            {error}
          </p>
        )}

        <button type="button" className="btn-principal carrito-modal-agregar" onClick={confirmar}>
          <IconCartPlus /> Agregar al carrito
        </button>
      </div>
    </div>,
    document.body
  );
}
