import { DIRECCION, EMAIL, TELEFONO, WHATSAPP_VISIBLE } from "./contacto";

// Datos de la empresa y version de los documentos legales.
//
// VERSION_TERMINOS se guarda junto con la aceptacion de cada usuario. Si algun
// dia cambian los terminos de forma sustancial, subir este numero hace que el
// modal vuelva a aparecer y se pida la aceptacion de la version nueva.
export const VERSION_TERMINOS = "1.0";

// Fecha de la ultima revision, la que se muestra en el encabezado de cada
// documento. Actualizar junto con VERSION_TERMINOS.
export const ULTIMA_ACTUALIZACION = "27 de agosto de 2026";


export const EMPRESA = {
  nombre: "Distribuidora Castelli",
  domicilio: `${DIRECCION}, Provincia de Córdoba, Argentina`,
  email: EMAIL,
  telefono: TELEFONO.visible,
  whatsapp: WHATSAPP_VISIBLE,
};
