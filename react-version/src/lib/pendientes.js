// Registro de escrituras en vuelo hacia Supabase.
//
// Existe por una carrera concreta: al marcar un favorito la pantalla se
// actualiza al instante y la escritura viaja despues. Si el usuario cierra
// sesion en ese intervalo, signOut() invalida el token, la escritura muere con
// 401 y ademas se limpia el guardado local: el favorito se pierde de los dos
// lados. Cerrar sesion espera a que estas promesas terminen.

const enVuelo = new Set();

export function registrar(operacion) {
  // OJO: las consultas de supabase-js NO son Promises, son "thenables" (solo
  // implementan .then(); no tienen .finally() ni .catch()). Llamarles .finally
  // tira un TypeError antes de que la consulta se ejecute, y si nadie espera el
  // resultado la excepcion se pierde y la escritura nunca sale.
  // Promise.resolve() lo envuelve en una Promise de verdad y dispara la consulta.
  const promesa = Promise.resolve(operacion);
  enVuelo.add(promesa);
  promesa.then(
    () => enVuelo.delete(promesa),
    () => enVuelo.delete(promesa)
  );
  return promesa;
}

export function esperarPendientes() {
  // allSettled: si una escritura fallo no queremos bloquear el logout.
  return Promise.allSettled([...enVuelo]);
}
