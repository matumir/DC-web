// Slides del carrusel de la portada, en orden.
//
// Antes era una lista de rutas y el boton del primer slide estaba escrito a
// mano dentro del componente, atado a `i === 0`. Con dos slides con boton eso
// ya no alcanzaba: ahora cada slide trae el suyo, y agregar o reordenar es
// tocar solo este archivo.
//
// El boton es opcional: un slide sin `texto` es solo la imagen. El destino se
// da con `enlace` (una URL cualquiera) o con `productoId` (la ficha de ese
// producto, resuelta al dibujar).
export const bannerImagenes = [
  {
    src: "/imagenes/Grafico/ingreso2.webp",
    // Catalogo filtrado por Calzado + Pampero, que son las dos trekking nuevas.
    // La ruta es /productos/filtrar/:categoria/:subcategoria/:marca, y "todas"
    // es el comodin de la subcategoria.
    enlace: "/productos/filtrar/calzado/todas/pampero",
    texto: "Ver modelos",
  },
  {
    src: "/imagenes/Grafico/ingreso.webp",
    // La zapatilla Nature de GEO, el slide que ya tenia boton. Se referencia
    // por id y no por URL: el slug sale del nombre del producto, asi que
    // escribirlo a mano lo dejaria roto en silencio si alguien lo renombra.
    productoId: "calzado-32",
    texto: "Ver detalle",
  },
  { src: "/imagenes/Grafico/banner.webp" },
  { src: "/imagenes/Grafico/banner1.webp" },
  { src: "/imagenes/Grafico/banner3.webp" },
  { src: "/imagenes/Grafico/banner4.webp" },
  { src: "/imagenes/Grafico/banner5.webp" },
  { src: "/imagenes/Grafico/banner6.webp" },
];
