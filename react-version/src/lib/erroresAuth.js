// Traduce los errores de Supabase Auth, que llegan en ingles y con jerga.
//
// "Invalid login credentials" no le dice nada a alguien que solo se equivoco
// de contraseña, y peor: no aclara si el problema es el mail o la clave.

const TRADUCCIONES = [
  [
    /invalid login credentials/i,
    "El correo o la contraseña no son correctos. Revisá los datos e intentá de nuevo.",
  ],
  [
    /email not confirmed/i,
    "Todavía no confirmaste tu cuenta. Buscá el correo que te enviamos y tocá el enlace. Revisá también la carpeta de spam.",
  ],
  [
    /user already registered|already been registered/i,
    "Ya existe una cuenta con ese correo. Probá iniciar sesión, o recuperá tu contraseña si no la recordás.",
  ],
  [
    /password should be at least (\d+)/i,
    "La contraseña es demasiado corta: necesita al menos $1 caracteres.",
  ],
  [/weak password|password is too weak/i, "Elegí una contraseña más segura."],
  [
    /unable to validate email address|invalid email/i,
    "Esa dirección de correo no parece válida.",
  ],
  [
    /for security purposes.*(\d+) seconds/i,
    "Por seguridad hay que esperar unos segundos antes de volver a intentar.",
  ],
  [
    /email rate limit exceeded|over_email_send_rate_limit/i,
    "Se enviaron demasiados correos en poco tiempo. Esperá unos minutos y volvé a intentar.",
  ],
  [
    /same as the old password|should be different/i,
    "La contraseña nueva tiene que ser distinta de la anterior.",
  ],
  [
    /token has expired|expired|invalid.*token/i,
    "El enlace venció o ya se usó. Pedí uno nuevo desde “Olvidé mi contraseña”.",
  ],
  [
    /signups not allowed|signup is disabled/i,
    "El registro está deshabilitado en este momento.",
  ],
  [
    /failed to fetch|network|load failed/i,
    "No pudimos conectarnos. Revisá tu conexión e intentá de nuevo.",
  ],
];

export function traducirErrorAuth(error) {
  const mensaje = typeof error === "string" ? error : error?.message;
  if (!mensaje) return "Ocurrió un error inesperado. Intentá de nuevo.";

  for (const [patron, traduccion] of TRADUCCIONES) {
    const coincidencia = mensaje.match(patron);
    if (coincidencia) {
      // Permite reinyectar capturas del original, como la cantidad de caracteres.
      return traduccion.replace(/\$(\d)/g, (_, i) => coincidencia[Number(i)] ?? "");
    }
  }

  // Si aparece uno sin traducir queda registrado para poder sumarlo despues.
  console.warn("[auth] error sin traducción:", mensaje);
  return "No pudimos completar la operación. Intentá de nuevo en unos minutos.";
}
