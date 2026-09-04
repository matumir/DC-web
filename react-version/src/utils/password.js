// Reglas de la contraseña, en un solo lugar.
//
// Antes vivian duplicadas en el registro, en el cambio desde el perfil y en el
// restablecimiento por correo. Con tres copias alcanza con tocar una y dejar
// las otras dos aceptando contraseñas que el resto del sitio rechaza.

export const LARGO_MINIMO = 8;

// Conjunto explicito de simbolos en vez de "cualquier cosa que no sea letra o
// numero": asi la eñe y las vocales acentuadas cuentan como letras y no le
// hacen creer a alguien que ya puso un simbolo.
const SIMBOLOS = /[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?~`¡¿°ª º·]/;

export const REQUISITOS = [
  {
    id: "largo",
    texto: `Al menos ${LARGO_MINIMO} caracteres`,
    cumple: (v) => v.length >= LARGO_MINIMO,
  },
  { id: "mayuscula", texto: "Una letra mayúscula", cumple: (v) => /[A-ZÁÉÍÓÚÜÑ]/.test(v) },
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
