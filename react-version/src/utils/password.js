// Reglas de la contraseña, en un solo lugar.
//
// Antes vivian duplicadas en el registro, en el cambio desde el perfil y en el
// restablecimiento por correo. Con tres copias alcanza con tocar una y dejar
// las otras dos aceptando contraseñas que el resto del sitio rechaza.

export const LARGO_MINIMO = 8;

// Esta es exactamente la lista de simbolos que acepta Supabase con la opcion
// "Lowercase, uppercase letters, digits and symbols". Tiene que coincidir: si
// aca aceptaramos alguno de mas (¿ ¡ º, o un espacio), el formulario daria la
// contraseña por buena y el servidor la rechazaria despues, sin que la persona
// entienda por que.
const SIMBOLOS = /[!@#$%^&*()_+\-=[\]{};'\\:"|<>?,./`~]/;

export const REQUISITOS = [
  {
    id: "largo",
    texto: `Al menos ${LARGO_MINIMO} caracteres`,
    cumple: (v) => v.length >= LARGO_MINIMO,
  },
  // Sin acentos ni eñe, igual que Supabase: si aceptaramos "Á" como mayuscula,
  // una contraseña que solo tenga acentuadas pasaria aca y fallaria alla.
  { id: "mayuscula", texto: "Una letra mayúscula", cumple: (v) => /[A-Z]/.test(v) },
  // Supabase exige minuscula ademas de mayuscula. Sin esta regla, "ABCDEF1!"
  // pasaria el formulario y moriria en el servidor.
  { id: "minuscula", texto: "Una letra minúscula", cumple: (v) => /[a-z]/.test(v) },
  { id: "numero", texto: "Un número", cumple: (v) => /[0-9]/.test(v) },
  { id: "simbolo", texto: "Un símbolo (! ? # $ % & *)", cumple: (v) => SIMBOLOS.test(v) },
];

/** Los requisitos que todavia no cumple. Vacio = contraseña valida. */
export function requisitosFaltantes(valor) {
  const v = valor ?? "";
  return REQUISITOS.filter((r) => !r.cumple(v));
}

export function passwordValida(valor) {
  return requisitosFaltantes(valor).length === 0;
}

/**
 * Mensaje corto para el campo, o null si esta bien.
 *
 * Enumera lo que falta en vez de repetir la regla completa: quien ya puso ocho
 * caracteres y un numero solo necesita saber que le falta la mayuscula.
 */
export function errorPassword(valor) {
  const faltan = requisitosFaltantes(valor);
  if (faltan.length === 0) return null;

  const textos = faltan.map((r) =>
    r.id === "largo" ? `${LARGO_MINIMO} caracteres` : r.texto.toLowerCase()
  );

  const lista =
    textos.length === 1
      ? textos[0]
      : `${textos.slice(0, -1).join(", ")} y ${textos[textos.length - 1]}`;

  return `Falta: ${lista}.`;
}
