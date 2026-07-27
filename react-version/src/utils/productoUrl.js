import { slugify } from "./slug";

export function productoUrl(producto) {
  const categoriaSlug = slugify(producto.categoria);
  const marcaSlug = slugify(producto.marca) || "generico";
  return `/productos/${categoriaSlug}/${marcaSlug}/${producto.slugNombre}`;
}

export function buscarProductoPorSlug(productos, categoria, marca, slug) {
  return productos.find(
    (p) =>
      slugify(p.categoria) === categoria &&
      (slugify(p.marca) || "generico") === marca &&
      p.slugNombre === slug
  );
}
