import { IconFilePdf } from "../../components/icons/Icon";
import { parseDescripcion, parseEspecificaciones } from "./detalleUtils";

export default function DescripcionTabs({ producto, tabActivo, setTabActivo }) {
  const hayContenido = Boolean(producto.Descripcion) || Boolean(producto.Documentacion?.length);
  if (!hayContenido) return null;

  const parrafos = parseDescripcion(producto.Descripcion);
  const specs = parseEspecificaciones(producto.Especificaciones);

  return (
    <div id="descripcionProducto" className="descripcion-producto">
      <div className="descripcion-tabs">
        <button
          className={`tab-btn${tabActivo === "info" ? " activo" : ""}`}
          onClick={() => setTabActivo("info")}
        >
          Información
        </button>
        <button
          className={`tab-btn${tabActivo === "specs" ? " activo" : ""}`}
          onClick={() => setTabActivo("specs")}
        >
          Especificaciones
        </button>
        <button
          className={`tab-btn${tabActivo === "docs" ? " activo" : ""}`}
          onClick={() => setTabActivo("docs")}
        >
          Documentación
        </button>
      </div>

      <div className="descripcion-contenido">
        <div id="tab-info" className={`tab-panel${tabActivo === "info" ? " activo" : ""}`}>
          {parrafos.map((linea, i) => (
            <p key={i}>{linea}</p>
          ))}
        </div>

        <div id="tab-specs" className={`tab-panel${tabActivo === "specs" ? " activo" : ""}`}>
          <ul>
            {specs.map((s, i) => (
              <li key={i}>{s.valor ? <><strong>{s.titulo}:</strong> {s.valor}</> : s.titulo}</li>
            ))}
          </ul>
        </div>

        <div id="tab-docs" className={`tab-panel${tabActivo === "docs" ? " activo" : ""}`}>
          {producto.Documentacion?.map((doc, i) => (
            <a href={doc.url} target="_blank" rel="noopener noreferrer" key={i}>
              <IconFilePdf /> {doc.nombre}
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
