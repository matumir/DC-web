import { Link } from "react-router-dom";
import { slugify } from "../../utils/slug";

const filtro = (categoria) => `/productos/filtrar/${slugify(categoria)}/todas/todas`;

// Las 14 categorías del catálogo agrupadas en 4 líneas temáticas.
const LINEAS = [
  {
    id: "proteccion-personal",
    titulo: "Protección personal",
    icono: "/imagenes/logos/ocular.webp",
    descripcion:
      "Todo el equipamiento para proteger al trabajador de riesgos en cabeza, ojos, oídos y vías respiratorias. Anteojos de seguridad, protectores auditivos, barbijos y respiradores, cascos y protección facial para soldadura y amolado.",
    categorias: ["Protección ocular", "Protección auditiva", "Protección respiratoria", "Protección craneal", "Protección facial"],
    imagen: "/imagenes/Grafico/home1.webp",
    alt: "Operario con casco, anteojos de seguridad y protectores auditivos",
  },
  {
    id: "calzado-indumentaria",
    titulo: "Calzado e indumentaria",
    icono: "/imagenes/logos/logocalzado.webp",
    descripcion:
      "Calzado de seguridad con puntera de acero, modelos dieléctricos y de uso diario. Ropa de trabajo completa: pantalones cargo, camisas, mamelucos, camperas, ropa para lluvia y gorras. Consultá por indumentaria personalizada con el logo de tu empresa.",
    categorias: ["Calzado", "Indumentaria"],
    imagen: "/imagenes/Grafico/home2.webp",
    alt: "Botines de seguridad y camisa de trabajo sobre un banco de taller",
  },
  {
    id: "manos-altura",
    titulo: "Manos, altura y cargas",
    icono: "/imagenes/logos/logoguantes.webp",
    descripcion:
      "Guantes de descarne, anticorte, de nitrilo y para tareas específicas. Para trabajo en altura contamos con arneses, cabos de vida y kits homologados. Sumamos elementos de izaje y sujeción de cargas para movimiento seguro de materiales.",
    categorias: ["Guantes", "Protección en altura", "Sujeción de cargas"],
    imagen: "/imagenes/Grafico/home3.webp",
    alt: "Trabajador con guantes anticorte abriendo una caja con cutter",
  },
  {
    id: "senalizacion-insumos",
    titulo: "Señalización e insumos",
    icono: "/imagenes/logos/señalizacion.webp",
    descripcion:
      "Carteles y señalización de seguridad para identificar riesgos, salidas y zonas restringidas. Discos de corte y desbaste para amoladora. Insumos de uso diario para mantener el taller y la obra en condiciones.",
    categorias: ["Señalización", "Cartelería", "Discos de corte", "Insumos"],
    imagen: "/imagenes/Grafico/home4.webp",
    alt: "Balizas, matafuego, botiquín, chaleco reflectivo e insumos de seguridad",
  },
];

export default function LineasProductos() {
  return (
    <section className="lineas-productos">
      <div className="lineas-header">
        <h2>Nuestras líneas de productos</h2>
      </div>

      {LINEAS.map((linea, i) => (
        <div className={`linea-fila${i % 2 === 1 ? " invertida" : ""}`} key={linea.id}>
          <div className="linea-texto">
            <img className="linea-icono" src={linea.icono} loading="lazy" decoding="async" alt="" />
            <h3>{linea.titulo}</h3>
            <p>{linea.descripcion}</p>
            <ul className="linea-categorias">
              {linea.categorias.map((cat) => (
                <li key={cat}>
                  <Link to={filtro(cat)}>{cat}</Link>
                </li>
              ))}
            </ul>
            <Link className="btn-secundario linea-btn" to={filtro(linea.categorias[0])}>
              Ver productos
            </Link>
          </div>

          <div className="linea-imagen">
            <img src={linea.imagen} loading="lazy" decoding="async" alt={linea.alt} />
          </div>
        </div>
      ))}
    </section>
  );
}
