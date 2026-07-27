import { altura } from "./altura.js";
import { auditiva } from "./auditiva.js";
import { calzado } from "./calzado.js";
import { cargas } from "./cargas.js";
import { carteles } from "./carteles.js";
import { craneal } from "./craneal.js";
import { discos } from "./discos.js";
import { facial } from "./facial.js";
import { guantes } from "./guantes.js";
import { indumentaria } from "./indumentaria.js";
import { insumos } from "./insumos.js";
import { ocular } from "./ocular.js";
import { respiratoria } from "./respiratoria.js";
import { señalizacion } from "./señalizacion.js";
import { slugify } from "../../utils/slug.js";

export const productos = [
  ...calzado,
  ...guantes,
  ...indumentaria,
  ...altura,
  ...craneal,
  ...facial,
  ...auditiva,
  ...ocular,
  ...cargas,
  ...insumos,
  ...respiratoria,
  ...discos,
  ...señalizacion,
  ...carteles,
];

// Precalcula un slug de nombre único por (categoría, marca) para armar URLs
// tipo /productos/:categoria/:marca/:slug. Cuando dos productos de la misma
// marca y categoría comparten nombre, se agrega un sufijo -2, -3... para
// que la URL siga siendo única.
const vistos = new Set();
productos.forEach((p) => {
  const base = `${slugify(p.categoria)}/${slugify(p.marca) || "generico"}/${slugify(p.nombre)}`;
  let slugFinal = slugify(p.nombre);
  let clave = base;
  let contador = 2;
  while (vistos.has(clave)) {
    slugFinal = `${slugify(p.nombre)}-${contador}`;
    clave = `${slugify(p.categoria)}/${slugify(p.marca) || "generico"}/${slugFinal}`;
    contador++;
  }
  vistos.add(clave);
  p.slugNombre = slugFinal;
});
