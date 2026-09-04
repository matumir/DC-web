import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const CLAVE = "dc_invitacion_ingresar";

// Cada cuanto se vuelve a ofrecer a quien ya lo cerro sin registrarse.
// Poner 0 lo muestra en cada visita.
const DIAS_ESPERA = 7;

// Un respiro antes de aparecer: cayendo encima del primer pintado tapa el
// catalogo antes de que la persona llegue a ver que vende el sitio.
const DEMORA_MS = 2500;

// Paginas donde estorbaria: en /ingresar el formulario ya esta a la vista, y
// en /restablecer-contrasena taparia el campo de la contraseña nueva.
//
// En /baja seria directamente contraproducente: la persona acaba de pedir que
// le escribamos menos, y lo primero que veria es un cartel ofreciendole crear
// una cuenta.
const RUTAS_EXCLUIDAS = ["/ingresar", "/restablecer-contrasena", "/baja"];

// localStorage tira excepcion en modo privado de algunos navegadores. No vale
// la pena romper la pagina por no poder recordar si ya lo mostramos.
function leerMarca() {
  try {
    return Number(window.localStorage.getItem(CLAVE)) || 0;
  } catch {
    return 0;
  }
}

function guardarMarca() {
  try {
    window.localStorage.setItem(CLAVE, String(Date.now()));
  } catch {
    /* sin memoria: se vuelve a ofrecer en la proxima visita */
  }
}

/**
 * Ofrece crear cuenta a quien llega sin sesion.
 *
 * No renderiza nada: solo decide cuando abrir el modal que ya existe, para que
 * la invitacion y el boton del header muestren exactamente lo mismo.
 */
export default function InvitacionIngresar() {
  const { usuario, cargando, disponible, abrirModalAuth } = useAuth();
  const { pathname } = useLocation();

  useEffect(() => {
    // Mientras carga todavia no sabemos si hay sesion: abrirlo aca se lo
    // mostraria por un instante a alguien que ya esta logueado.
    if (cargando || usuario || !disponible) return;
    if (RUTAS_EXCLUIDAS.includes(pathname)) return;

    const desde = leerMarca();
    if (desde && Date.now() - desde < DIAS_ESPERA * 24 * 60 * 60 * 1000) return;

    const t = setTimeout(() => {
      guardarMarca();
      abrirModalAuth();
    }, DEMORA_MS);

    return () => clearTimeout(t);
    // Sin `pathname`: se evalua una vez por carga. Si dependiera de la ruta,
    // reaparecería al navegar de una pagina a otra dentro del mismo sitio.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cargando, usuario, disponible, abrirModalAuth]);

  return null;
}
