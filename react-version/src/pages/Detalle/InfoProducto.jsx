import { useEffect, useState } from "react";
import { IconCartPlus, IconShare } from "../../components/icons/Icon";
import { useCart } from "../../context/CartContext";
import { obtenerColorCSS } from "./detalleUtils";
import { productoUrl } from "../../utils/productoUrl";
import { SITE_URL } from "../../data/siteUrl";

export default function InfoProducto({ producto, detalle }) {
  const { agregarAlCarrito } = useCart();
  const { talle, setTalle, cantidad, onCantidadChange, colorSeleccionado, seleccionarColor } = detalle;
  const [errores, setErrores] = useState({});
  const [copiado, setCopiado] = useState(false);

  useEffect(() => {
    setErrores({});
  }, [producto]);

  async function compartir() {
    const url = SITE_URL + productoUrl(producto);
    const titulo = producto.marca ? `${producto.marca} | ${producto.nombre}` : producto.nombre;

    if (navigator.share) {
      try {
        await navigator.share({ title: titulo, url });
      } catch {
        // el usuario canceló el diálogo de compartir
      }
      return;
    }

    try {
      await navigator.clipboard.writeText(url);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    } catch {
      // clipboard no disponible
    }
  }

  const tieneTalles = Array.isArray(producto.talles) && producto.talles.length > 0;
  const tieneColores = Array.isArray(producto.colores) && producto.colores.length > 0;

  function agregar() {
    const nuevosErrores = {};
    if (tieneTalles && !talle) nuevosErrores.talle = "Seleccioná un talle";
    if (!cantidad || Number(cantidad) < 1) nuevosErrores.cantidad = "Ingresá una cantidad válida";

    setErrores(nuevosErrores);
    if (Object.keys(nuevosErrores).length > 0) return;

    agregarAlCarrito(producto, {
      cantidad: parseInt(cantidad, 10),
      talle: tieneTalles ? talle : null,
      color: tieneColores ? producto.colores[colorSeleccionado].nombre : null,
    });
  }

  return (
    <div className="info" id="infoProducto">
      <h1 id="detalleNombre">{producto.marca ? `${producto.marca} | ${producto.nombre}` : producto.nombre}</h1>
      <p>
        <strong>Marca:</strong> <span id="detalleMarca">{producto.marca || ""}</span>
      </p>

      <div className={`campo-detalle${tieneTalles ? "" : " oculto"}`} id="campoTalle">
        <label htmlFor="detalleTalle">Talle</label>
        <select
          id="detalleTalle"
          value={talle}
          onChange={(e) => {
            setTalle(e.target.value);
            setErrores((prev) => ({ ...prev, talle: null }));
          }}
        >
          <option value="" disabled>
            Seleccionar talle
          </option>
          {producto.talles?.map((t) => (
            <option value={t} key={t}>
              {t}
            </option>
          ))}
        </select>
        {errores.talle && <span className="empresas-error">{errores.talle}</span>}
      </div>

      <div className="campo-detalle" id="campoColor">
        <label id="labelColor" className={tieneColores ? "" : "oculto"}>
          Color
        </label>
        <div id="coloresProducto" className={`colores-producto${tieneColores ? "" : " oculto"}`}>
          {producto.colores?.map((color, index) => (
            <div
              key={color.nombre}
              className={`color-item${index === colorSeleccionado ? " activo" : ""}`}
              title={color.nombre}
              style={{ background: obtenerColorCSS(color.nombre) }}
              onClick={() => seleccionarColor(index)}
            />
          ))}
        </div>
      </div>

      <div className="campo-detalle">
        <label>Cantidad</label>
        <input
          type="number"
          id="detalleCantidad"
          min="1"
          placeholder="Cantidad"
          value={cantidad}
          onChange={(e) => {
            onCantidadChange(e.target.value);
            setErrores((prev) => ({ ...prev, cantidad: null }));
          }}
        />
        {errores.cantidad && <span className="empresas-error">{errores.cantidad}</span>}
      </div>

      <button id="detalleAgregar" className="btn-secundario" onClick={agregar}>
        <IconCartPlus /> Agregar al carrito
      </button>

      <button type="button" className="btn-compartir" onClick={compartir}>
        <IconShare /> {copiado ? "¡Enlace copiado!" : "Compartir"}
      </button>
    </div>
  );
}
