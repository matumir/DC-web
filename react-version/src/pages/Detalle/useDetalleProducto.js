import { useEffect, useMemo, useState } from "react";
import { construirGaleria } from "./detalleUtils";

export function useDetalleProducto(producto) {
  const galeria = useMemo(() => (producto ? construirGaleria(producto) : []), [producto]);

  const [imagenIndex, setImagenIndexRaw] = useState(0);
  const [colorSeleccionado, setColorSeleccionado] = useState(producto?.colores ? 0 : null);
  const [talle, setTalle] = useState("");
  const [cantidad, setCantidad] = useState("");
  const [tabActivo, setTabActivo] = useState("info");
  const [zoomOpen, setZoomOpen] = useState(false);

  useEffect(() => {
    setImagenIndexRaw(0);
    setColorSeleccionado(producto?.colores ? 0 : null);
    setTalle("");
    setCantidad("");
    setTabActivo("info");
    setZoomOpen(false);
  }, [producto]);

  function setImagenIndex(i) {
    setImagenIndexRaw(i);
    const imagen = galeria[i];
    if (imagen && imagen.colorIndex !== null) {
      setColorSeleccionado(imagen.colorIndex);
    }
  }

  function moverImagen(dir) {
    if (!galeria.length) return;
    const nuevo = (imagenIndex + dir + galeria.length) % galeria.length;
    setImagenIndex(nuevo);
  }

  function seleccionarColor(index) {
    setColorSeleccionado(index);
    const primeraImgColor = galeria.findIndex((img) => img.colorIndex === index);
    if (primeraImgColor !== -1) setImagenIndex(primeraImgColor);
  }

  function onCantidadChange(valor) {
    if (valor !== "" && Number(valor) < 1) {
      setCantidad("1");
    } else {
      setCantidad(valor);
    }
  }

  return {
    galeria,
    imagenIndex,
    setImagenIndex,
    moverImagen,
    colorSeleccionado,
    seleccionarColor,
    talle,
    setTalle,
    cantidad,
    onCantidadChange,
    tabActivo,
    setTabActivo,
    zoomOpen,
    setZoomOpen,
  };
}
