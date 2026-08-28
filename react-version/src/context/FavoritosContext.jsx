import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import { supabase } from "../lib/supabase";
import { registrar } from "../lib/pendientes";
import { sonar } from "../lib/sonido";
import { useAuth } from "./AuthContext";

const FavoritosContext = createContext(null);
const CLAVE = "favoritos";

function leerLocal() {
  try {
    const guardado = JSON.parse(localStorage.getItem(CLAVE));
    return Array.isArray(guardado) ? guardado : [];
  } catch {
    return [];
  }
}

function guardarLocal(ids) {
  try {
    localStorage.setItem(CLAVE, JSON.stringify(ids));
  } catch {
    // Modo incognito o storage lleno: seguimos solo en memoria.
  }
}

export function FavoritosProvider({ children }) {
  const { usuario } = useAuth();
  // localStorage es la fuente de verdad: si Supabase se pausa o se cae, los
  // favoritos siguen funcionando. La nube es solo la capa de sincronizacion.
  const [ids, setIds] = useState(() => new Set(leerLocal()));
  const [sincronizando, setSincronizando] = useState(false);
  const [error, setError] = useState(null);
  const usuarioAnterior = useRef(null);
  const [notificacion, setNotificacion] = useState(null);
  const temporizador = useRef(null);

  // Mismo patron que la notificacion del carrito: aparece 2s y se va sola.
  const avisar = useCallback((texto, tipo = "ok", sonido) => {
    clearTimeout(temporizador.current);
    setNotificacion({ texto, tipo });
    if (sonido) sonar(sonido);
    temporizador.current = setTimeout(() => setNotificacion(null), 2000);
  }, []);

  useEffect(() => () => clearTimeout(temporizador.current), []);

  const actualizar = useCallback((siguiente) => {
    setIds(siguiente);
    guardarLocal([...siguiente]);
  }, []);

  // Al iniciar sesion: traer los de la nube, unirlos con los locales y subir
  // los que falten. Union en vez de "gana uno": nadie pierde un favorito.
  useEffect(() => {
    if (!supabase) return;

    if (!usuario) {
      // Paso de "habia sesion" a "no hay": se cerro sesion, limpiamos el
      // navegador para no dejar los favoritos de uno a la vista del siguiente
      // (importante en una computadora compartida). Al volver a entrar se
      // recuperan de la nube.
      if (usuarioAnterior.current) actualizar(new Set());
      usuarioAnterior.current = null;
      return;
    }
    if (usuarioAnterior.current === usuario.id) return;
    usuarioAnterior.current = usuario.id;

    let vivo = true;
    setSincronizando(true);

    (async () => {
      const { data, error } = await supabase.from("favoritos").select("producto_id");
      if (!vivo) return;

      if (error) {
        console.error("[favoritos] no se pudieron leer los de la nube:", error.message);
        setError(error.message);
        setSincronizando(false);
        return; // Nos quedamos con los locales.
      }
      setError(null);

      const remotos = new Set(data.map((f) => f.producto_id));
      const locales = new Set(leerLocal());
      const union = new Set([...remotos, ...locales]);

      const faltanArriba = [...locales].filter((id) => !remotos.has(id));
      if (faltanArriba.length) {
        const { error: errorSubida } = await registrar(
          supabase
            .from("favoritos")
            .insert(faltanArriba.map((id) => ({ usuario_id: usuario.id, producto_id: id })))
        );
        if (errorSubida) {
          console.error("[favoritos] no se pudieron subir los locales:", errorSubida.message);
          setError(errorSubida.message);
        }
      }

      if (!vivo) return;
      actualizar(union);
      setSincronizando(false);
    })();

    return () => {
      vivo = false;
    };
  }, [usuario, actualizar]);

  const alternar = useCallback(
    async (productoId) => {
      const siguiente = new Set(ids);
      const eraFavorito = siguiente.has(productoId);

      if (eraFavorito) siguiente.delete(productoId);
      else siguiente.add(productoId);

      // Actualizacion optimista: la UI responde ya, la nube se entera despues.
      actualizar(siguiente);
      avisar(
        eraFavorito ? "Eliminado de favoritos" : "Agregado a favoritos",
        "ok",
        eraFavorito ? "quitar" : "favorito"
      );

      if (!supabase || !usuario) return;

      const operacion = eraFavorito
        ? supabase
            .from("favoritos")
            .delete()
            .eq("usuario_id", usuario.id)
            .eq("producto_id", productoId)
        : supabase.from("favoritos").insert({ usuario_id: usuario.id, producto_id: productoId });

      const { error } = await registrar(operacion);

      if (error) {
        // Si la nube rechazo el cambio, revertimos la pantalla en vez de
        // mostrar un estado que no existe en ningun lado.
        console.error("[favoritos] fallo al guardar:", error.message);
        setError(error.message);
        avisar("No pudimos guardarlo", "error", "error");
        const revertido = new Set(siguiente);
        if (eraFavorito) revertido.add(productoId);
        else revertido.delete(productoId);
        actualizar(revertido);
      } else {
        setError(null);
      }
    },
    [ids, usuario, actualizar, avisar]
  );

  const valor = {
    favoritos: ids,
    cantidad: ids.size,
    esFavorito: (id) => ids.has(id),
    alternar,
    sincronizando,
    error,
    notificacion,
  };

  return <FavoritosContext.Provider value={valor}>{children}</FavoritosContext.Provider>;
}

export function useFavoritos() {
  const ctx = useContext(FavoritosContext);
  if (!ctx) throw new Error("useFavoritos debe usarse dentro de <FavoritosProvider>");
  return ctx;
}
