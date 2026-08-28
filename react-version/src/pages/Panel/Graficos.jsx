// Graficos hechos a mano con CSS y SVG.
//
// Sin libreria a proposito: Recharts y compania pesan del orden de 100 KB, y
// para barras y un ranking no se justifica en un sitio donde venimos cuidando
// cada kilobyte. Si algun dia hacen falta graficos complejos, ahi si.

const MESES = [
  "ene", "feb", "mar", "abr", "may", "jun",
  "jul", "ago", "sep", "oct", "nov", "dic",
];

function etiquetaMes(iso) {
  // Se parsea a mano: new Date("2026-08-01") se interpreta como UTC y en
  // Argentina (UTC-3) devolveria el mes anterior.
  const [anio, mes] = iso.split("-").map(Number);
  return `${MESES[mes - 1]} ${String(anio).slice(2)}`;
}

export function BarrasPorMes({ datos, color = "#4abcb1", vacio }) {
  if (!datos.length) return <p className="panel-vacio">{vacio}</p>;

  const maximo = Math.max(...datos.map((d) => Number(d.cantidad)));

  return (
    <div className="panel-barras">
      {datos.map((d) => {
        const valor = Number(d.cantidad);
        const alto = maximo ? Math.max((valor / maximo) * 100, 3) : 3;
        return (
          <div className="panel-barra" key={d.mes}>
            <span className="panel-barra-valor">{valor}</span>
            <div
              className="panel-barra-relleno"
              style={{ height: `${alto}%`, background: color }}
              title={`${etiquetaMes(d.mes)}: ${valor}`}
            />
            <span className="panel-barra-mes">{etiquetaMes(d.mes)}</span>
          </div>
        );
      })}
    </div>
  );
}

export function Ranking({ filas, vacio, etiqueta = (f) => f.nombre }) {
  if (!filas.length) return <p className="panel-vacio">{vacio}</p>;

  const maximo = Math.max(...filas.map((f) => Number(f.cantidad)));

  return (
    <ol className="panel-ranking">
      {filas.map((f, i) => {
        const valor = Number(f.cantidad);
        return (
          <li key={f.clave ?? i}>
            <span className="panel-ranking-pos">{i + 1}</span>
            <div className="panel-ranking-cuerpo">
              <span className="panel-ranking-nombre">{etiqueta(f)}</span>
              <div className="panel-ranking-riel">
                <div
                  className="panel-ranking-relleno"
                  style={{ width: `${maximo ? (valor / maximo) * 100 : 0}%` }}
                />
              </div>
            </div>
            <span className="panel-ranking-valor">{valor}</span>
          </li>
        );
      })}
    </ol>
  );
}

export function Tarjeta({ titulo, valor, detalle }) {
  return (
    <div className="panel-tarjeta">
      <span className="panel-tarjeta-titulo">{titulo}</span>
      <strong className="panel-tarjeta-valor">{valor ?? "—"}</strong>
      {detalle && <span className="panel-tarjeta-detalle">{detalle}</span>}
    </div>
  );
}
