import { createContext, useCallback, useContext, useEffect, useState } from "react";
import { authDisponible, supabase } from "../lib/supabase";
import { esperarPendientes, registrar } from "../lib/pendientes";
import { VERSION_TERMINOS } from "../data/legal";
import { traducirErrorAuth } from "../lib/erroresAuth";

const AuthContext = createContext(null);

const CAMPOS_PERFIL =
  "acepta_novedades, novedades_respondido_en, terminos_version, terminos_aceptados_en, es_admin";

// Cuando el login falla, Supabase devuelve el motivo en la URL (a veces en la
// query, a veces en el fragmento). Sin esto el usuario vuelve al sitio y no
// pasa nada: ni sesion ni explicacion.
function leerErrorDeUrl() {
  const query = new URLSearchParams(window.location.search);
  const hash = new URLSearchParams(window.location.hash.replace(/^#/, ""));
  const descripcion = query.get("error_description") || hash.get("error_description");
  if (!descripcion) return null;

  // Limpia la URL para que el error no reaparezca al recargar o al compartirla.
  const limpia = window.location.pathname;
  window.history.replaceState({}, "", limpia);
  return descripcion.replace(/\+/g, " ");
}

export function AuthProvider({ children }) {
  const [sesion, setSesion] = useState(null);
  // Solo hay algo que esperar si Supabase esta configurado.
  const [cargando, setCargando] = useState(authDisponible);
  // Si Supabase no responde (proyecto pausado, caido, sin red) lo marcamos y
  // la UI muestra el login deshabilitado en vez de romper la pagina.
  const [caido, setCaido] = useState(false);
  const [errorLogin, setErrorLogin] = useState(null);
  const [perfil, setPerfil] = useState(null);
  // Estado del modal de ingreso: vive aca para que lo pueda abrir tanto el
  // menu de escritorio como el de mobile sin pasar props por medio arbol.
  const [modalAuth, setModalAuth] = useState(false);
  const [modalContrasena, setModalContrasena] = useState(false);

  useEffect(() => {
    if (!supabase) return;

    let vivo = true;

    const fallo = leerErrorDeUrl();
    if (fallo) setErrorLogin(fallo);

    supabase.auth
      .getSession()
      .then(({ data, error }) => {
        if (!vivo) return;
        if (error) setCaido(true);
        else setSesion(data.session);
        setCargando(false);
      })
      .catch(() => {
        if (!vivo) return;
        setCaido(true);
        setCargando(false);
      });

    const { data } = supabase.auth.onAuthStateChange((_evento, nuevaSesion) => {
      setSesion(nuevaSesion);
      setCaido(false);
      if (nuevaSesion) setModalAuth(false);
    });

    return () => {
      vivo = false;
      data.subscription.unsubscribe();
    };
  }, []);

  const usuarioId = sesion?.user?.id ?? null;

  // El perfil vive en nuestra tabla, no en la sesion: de ahi sale si ya
  // respondio lo de las novedades.
  useEffect(() => {
    if (!supabase || !usuarioId) {
      setPerfil(null);
      return;
    }
    let vivo = true;
    supabase
      .from("perfiles")
      .select(CAMPOS_PERFIL)
      .eq("id", usuarioId)
      .maybeSingle()
      .then(({ data }) => {
        if (vivo && data) setPerfil(data);
      });
    return () => {
      vivo = false;
    };
  }, [usuarioId]);

  // Guarda la respuesta y deja constancia de cuando la dio: eso es lo que
  // convierte el dato en un consentimiento demostrable.
  const responderNovedades = useCallback(
    async (acepta) => {
      if (!supabase || !usuarioId) return { ok: false, error: "Sin sesión" };

      const respondidoEn = new Date().toISOString();
      const anterior = perfil;
      // Merge, no reemplazo: si se pisa el objeto entero se pierden los campos
      // de terminos y el modal volveria a aparecer.
      setPerfil({ ...perfil, acepta_novedades: acepta, novedades_respondido_en: respondidoEn });

      // select() despues del update: sin eso PostgREST no devuelve las filas
      // afectadas y un update que no toco nada pasaria por exitoso.
      const { data, error } = await registrar(
        supabase
          .from("perfiles")
          .update({ acepta_novedades: acepta, novedades_respondido_en: respondidoEn })
          .eq("id", usuarioId)
          .select(CAMPOS_PERFIL)
      );

      if (error || !data?.length) {
        const motivo = error?.message || "la fila no existe o RLS bloqueo la escritura";
        console.error("[novedades] no se pudo guardar:", motivo);
        setPerfil(anterior);
        return { ok: false, error: motivo };
      }

      setPerfil(data[0]);
      return { ok: true };
    },
    [usuarioId, perfil]
  );

  // Terminos y novedades se guardan juntos porque se piden en el mismo modal:
  // una sola escritura en vez de dos, y no puede quedar a medias.
  const aceptarTerminos = useCallback(
    async ({ novedades }) => {
      if (!supabase || !usuarioId) return { ok: false, error: "Sin sesión" };

      const ahora = new Date().toISOString();
      const anterior = perfil;
      const cambios = {
        terminos_version: VERSION_TERMINOS,
        terminos_aceptados_en: ahora,
        acepta_novedades: novedades,
        novedades_respondido_en: ahora,
      };
      setPerfil({ ...perfil, ...cambios });

      const { data, error } = await registrar(
        supabase.from("perfiles").update(cambios).eq("id", usuarioId).select(CAMPOS_PERFIL)
      );

      if (error || !data?.length) {
        const motivo = error?.message || "la fila no existe o RLS bloqueo la escritura";
        console.error("[terminos] no se pudo guardar:", motivo);
        setPerfil(anterior);
        return { ok: false, error: motivo };
      }

      setPerfil(data[0]);
      return { ok: true };
    },
    [usuarioId, perfil]
  );

  // ---- Registro e ingreso con correo y contraseña -------------------------
  // Todas devuelven { ok, error } con el mensaje ya en castellano, para que
  // los formularios no tengan que saber nada de los errores de Supabase.

  const registrarConMail = useCallback(async ({ nombre, email, password, telefono }) => {
    if (!supabase) return { ok: false, error: "El servicio no está disponible." };
    setErrorLogin(null);

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        // Viaja a raw_user_meta_data, de donde el trigger arma el perfil.
        // Sin esto los registrados por mail quedarían sin nombre.
        data: { full_name: nombre.trim(), telefono: telefono?.trim() || null },
        emailRedirectTo: `${window.location.origin}/`,
      },
    });

    if (error) return { ok: false, error: traducirErrorAuth(error) };

    // Con confirmación de correo activada, signUp no devuelve sesión: el
    // usuario tiene que abrir el enlace del mail antes de poder entrar.
    return { ok: true, necesitaConfirmar: !data.session };
  }, []);

  const entrarConMail = useCallback(async ({ email, password }) => {
    if (!supabase) return { ok: false, error: "El servicio no está disponible." };
    setErrorLogin(null);

    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { ok: false, error: traducirErrorAuth(error) };
    return { ok: true };
  }, []);

  const recuperarContrasena = useCallback(async (email) => {
    if (!supabase) return { ok: false, error: "El servicio no está disponible." };

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/restablecer-contrasena`,
    });
    if (error) return { ok: false, error: traducirErrorAuth(error) };
    return { ok: true };
  }, []);

  const definirContrasena = useCallback(async (password) => {
    if (!supabase) return { ok: false, error: "El servicio no está disponible." };

    const { error } = await supabase.auth.updateUser({ password });
    if (error) return { ok: false, error: traducirErrorAuth(error) };
    return { ok: true };
  }, []);

  /**
   * Cambio de contraseña desde el perfil, con la sesion ya abierta.
   *
   * Pide la contraseña actual y la verifica con signInWithPassword antes de
   * tocar nada. Supabase no lo exige por defecto: con solo tener la sesion
   * abierta alcanza para cambiarla. Eso significa que quien se siente frente a
   * una computadora con la sesion sin cerrar puede cambiar la clave y dejar
   * afuera al dueño de la cuenta. Verificarla aca cierra esa puerta.
   */
  const cambiarContrasena = useCallback(
    async ({ actual, nueva }) => {
      if (!supabase) return { ok: false, error: "El servicio no está disponible." };

      const correo = sesion?.user?.email;
      if (!correo) return { ok: false, error: "Tu sesión venció. Volvé a iniciar sesión." };

      const { error: errorVerificacion } = await supabase.auth.signInWithPassword({
        email: correo,
        password: actual,
      });
      if (errorVerificacion) {
        return { ok: false, error: "La contraseña actual no es correcta." };
      }

      const { error } = await supabase.auth.updateUser({ password: nueva });
      if (error) return { ok: false, error: traducirErrorAuth(error) };
      return { ok: true };
    },
    [sesion]
  );

  const entrarConGoogle = useCallback(async () => {
    if (!supabase) return;
    setErrorLogin(null);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      // Vuelve a la misma pagina desde la que se inicio sesion.
      options: { redirectTo: `${window.location.origin}${window.location.pathname}` },
    });
    if (error) setErrorLogin(error.message);
  }, []);

  const salir = useCallback(async () => {
    if (!supabase) return;
    // Antes de invalidar el token, dejar que terminen las escrituras en vuelo
    // (un favorito recien marcado, por ejemplo). Si no, mueren con 401.
    await esperarPendientes();
    await supabase.auth.signOut();
    setSesion(null);
    setPerfil(null);
  }, []);

  const usuario = sesion?.user ?? null;
  const metadatos = usuario?.user_metadata ?? {};

  const valor = {
    usuario,
    // Google manda el nombre en full_name o name segun el caso.
    nombre: metadatos.full_name || metadatos.name || usuario?.email?.split("@")[0] || "",
    avatar: metadatos.avatar_url || metadatos.picture || null,
    email: usuario?.email ?? null,
    cargando,
    disponible: authDisponible && !caido,
    errorLogin,
    descartarError: () => setErrorLogin(null),
    entrarConGoogle,
    salir,
    aceptaNovedades: perfil?.acepta_novedades ?? false,
    // Se pregunta mientras no haya aceptado. Al aceptar no vuelve a aparecer.
    // El perfil tiene que estar cargado: si no, el modal parpadearia en cada
    // carga antes de saber la respuesta.
    debePreguntarNovedades: Boolean(usuario && perfil && !perfil.acepta_novedades),
    responderNovedades,
    // Hay que aceptar si nunca acepto, o si acepto una version anterior a la
    // vigente (subir VERSION_TERMINOS vuelve a pedir la aceptacion a todos).
    debeAceptarTerminos: Boolean(
      usuario && perfil && perfil.terminos_version !== VERSION_TERMINOS
    ),
    aceptarTerminos,
    // Solo controla si se muestra el acceso al panel. La proteccion real esta
    // en las funciones de la base, que verifican es_admin del lado del
    // servidor: falsear esto en el navegador no da acceso a ningun dato.
    esAdmin: perfil?.es_admin === true,
    registrarConMail,
    entrarConMail,
    recuperarContrasena,
    definirContrasena,
    cambiarContrasena,
    // Quien entro solo con Google no tiene contraseña que cambiar: para esa
    // cuenta el formulario de "contraseña actual" no tendria nada que validar.
    tieneContrasena: Boolean(
      usuario?.identities?.some((i) => i.provider === 'email') ??
        usuario?.app_metadata?.providers?.includes('email')
    ),
    modalAuth,
    abrirModalAuth: () => setModalAuth(true),
    cerrarModalAuth: () => setModalAuth(false),
    modalContrasena,
    abrirModalContrasena: () => setModalContrasena(true),
    cerrarModalContrasena: () => setModalContrasena(false),
  };

  return <AuthContext.Provider value={valor}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de <AuthProvider>");
  return ctx;
}
