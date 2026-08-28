import { useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { productos } from "../../data/productos";
import { useAuth } from "../../context/AuthContext";
import { useDocumentMeta } from "../../hooks/useDocumentMeta";
import { BarrasPorMes, Ranking, Tarjeta } from "./Graficos";
import { useMetricas } from "./useMetricas";

export default function PanelPage() {
  const { usuario, cargando: cargandoSesion, disponible, entrarConGoogle } = useAuth();
  const { datos, cargando, error } = useMetricas(Boolean(usuario));

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useDocumentMeta({ titulo: "Panel", descripcion: "Métricas internas del sitio." });

  // El id del favorito ("guantes-42") se traduce a nombre con el catalogo del
  // repo: la base no conoce los productos.
  const porId = useMemo(() => new Map(productos.map((p) => [p.id, p])), []);

  const favoritos = useMemo(
    () =>
      (datos?.topFavoritos ?? []).map((f) => {
        const p = porId.get(f.producto_id);
        return {
          clave: f.producto_id,
          cantidad: f.cantidad,
          nombre: p ? `${p.marca ? `${p.marca} | ` : ""}${p.nombre}` : f.producto_id,
        };
      }),
    [datos, porId]
  );

  const provincias = useMemo(
    () =>
      (datos?.consultasPorProvincia ?? []).map((c) => ({
        clave: c.provincia,
        nombre: c.provincia,
        cantidad: c.cantidad,
      })),
    [datos]
  );

  if (cargandoSesion) return <section className="panel" />;

  if (!disponible) {
    return (
      <section className="panel">
        <div className="panel-aviso">
          <h1>Panel</h1>
          <p>El servicio de datos no está disponible en este momento.</p>
        </div>
      </section>
    );
  }

  if (!usuario) {
    return (
      <section className="panel">
        <div className="panel-aviso">
          <h1>Panel</h1>
          <p>Necesitás iniciar sesión con una cuenta de administrador.</p>
          <button className="btn-principal" onClick={entrarConGoogle}>
            Iniciar sesión
          </button>
        </div>
      </section>
    );
  }

  // La base rechaza a quien no es admin: el error viene de alla, no de una
  // comprobacion del front que se pueda saltear editando el JavaScript.
  if (error) {
    return (
      <section className="panel">
        <div className="panel-aviso">
          <h1>Panel</h1>
          <p>Tu cuenta no tiene permisos para ver estas métricas.</p>
          <small>{error}</small>
          <Link className="btn-principal" to="/">
            Volver al inicio
          </Link>
        </div>
      </section>
    );
  }

  if (cargando || !datos) {
    return (
      <section className="panel">
        <div className="panel-aviso">
          <h1>Panel</h1>
          <p>Cargando métricas...</p>
        </div>
      </section>
    );
  }

  const r = datos.resumen ?? {};
  const porcentajeSuscriptores =
    Number(r.registros) > 0
      ? Math.round((Number(r.suscriptores) / Number(r.registros)) * 100)
      : 0;

  return (
    <section className="panel">
      <div className="panel-contenido">
        <header className="panel-encabezado">
          <h1>Panel</h1>
          <p>Métricas del sitio. Solo visible para administradores.</p>
        </header>

        <div className="panel-tarjetas">
          <Tarjeta titulo="Usuarios registrados" valor={r.registros} />
          <Tarjeta
            titulo="Suscriptores a novedades"
            valor={r.suscriptores}
            detalle={`${porcentajeSuscriptores}% de los registrados`}
          />
          <Tarjeta titulo="Favoritos guardados" valor={r.favoritos} />
          <Tarjeta titulo="Activos" valor={r.activos_30d} detalle="últimos 30 días" />
          <Tarjeta titulo="Consultas" valor={r.consultas_30d} detalle="últimos 30 días" />
        </div>

        <div className="panel-bloque">
          <h2>Registros nuevos por mes</h2>
          <BarrasPorMes
            datos={datos.registrosPorMes}
            vacio="Todavía no hay registros en los últimos 12 meses."
          />
        </div>

        <div className="panel-bloque">
          <h2>Consultas recibidas por mes</h2>
          <BarrasPorMes
            datos={datos.consultasPorMes}
            color="#12414a"
            vacio="Todavía no se registraron consultas. Se empiezan a contar desde ahora."
          />
        </div>

        <div className="panel-grilla">
          <div className="panel-bloque">
            <h2>Productos más guardados</h2>
            <Ranking filas={favoritos} vacio="Nadie guardó favoritos todavía." />
          </div>

          <div className="panel-bloque">
            <h2>Consultas por provincia</h2>
            <Ranking filas={provincias} vacio="Sin consultas registradas." />
          </div>
        </div>
      </div>
    </section>
  );
}
