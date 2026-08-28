import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabase";

/**
 * Trae las metricas del panel.
 *
 * Todo pasa por funciones RPC que corren en la base con security definer y que
 * verifican adentro que quien llama sea administrador. El navegador nunca
 * consulta las tablas: pide totales y recibe numeros. Si alguien que no es
 * admin llama a estas funciones, Postgres devuelve "Acceso denegado".
 */
export function useMetricas(habilitado) {
  const [datos, setDatos] = useState(null);
  const [cargando, setCargando] = useState(habilitado);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!habilitado || !supabase) {
      setCargando(false);
      return;
    }

    let vivo = true;
    setCargando(true);
    setError(null);

    (async () => {
      const [resumen, registros, consultasMes, topFavoritos, porProvincia] = await Promise.all([
        supabase.rpc("metricas_resumen"),
        supabase.rpc("metricas_registros_por_mes"),
        supabase.rpc("metricas_consultas_por_mes"),
        supabase.rpc("metricas_top_favoritos", { limite: 15 }),
        supabase.rpc("metricas_consultas_por_provincia"),
      ]);

      if (!vivo) return;

      const fallo = [resumen, registros, consultasMes, topFavoritos, porProvincia].find(
        (r) => r.error
      );
      if (fallo) {
        console.error("[panel] error al traer metricas:", fallo.error.message);
        setError(fallo.error.message);
        setCargando(false);
        return;
      }

      setDatos({
        // metricas_resumen devuelve una sola fila.
        resumen: resumen.data?.[0] ?? null,
        registrosPorMes: registros.data ?? [],
        consultasPorMes: consultasMes.data ?? [],
        topFavoritos: topFavoritos.data ?? [],
        consultasPorProvincia: porProvincia.data ?? [],
      });
      setCargando(false);
    })();

    return () => {
      vivo = false;
    };
  }, [habilitado]);

  return { datos, cargando, error };
}
