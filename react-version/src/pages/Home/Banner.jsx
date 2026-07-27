import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { bannerImagenes } from "../../data/bannerImagenes";
import { productos } from "../../data/productos";
import { productoUrl } from "../../utils/productoUrl";

const AUTOPLAY_DELAY = 3000;
const AUTOPLAY_INTERVAL = 5000;

// Producto destacado en el primer slide del banner (zapatilla GEO Nature)
const productoBannerPrincipal = productos.find((p) => p.id === "calzado-32");

export default function Banner() {
  const [index, setIndex] = useState(0);
  const [height, setHeight] = useState(null);
  const containerRef = useRef(null);
  const trackRef = useRef(null);
  const timeoutRef = useRef(null);
  const intervalRef = useRef(null);
  const touchStartX = useRef(0);

  function detenerAutoplay() {
    clearTimeout(timeoutRef.current);
    clearInterval(intervalRef.current);
  }

  function iniciarAutoplay() {
    detenerAutoplay();
    timeoutRef.current = setTimeout(() => {
      intervalRef.current = setInterval(() => {
        setIndex((i) => (i + 1) % bannerImagenes.length);
      }, AUTOPLAY_INTERVAL);
    }, AUTOPLAY_DELAY);
  }

  useEffect(() => {
    iniciarAutoplay();
    return detenerAutoplay;
  }, []);

  function irA(i) {
    setIndex(i);
    iniciarAutoplay();
  }

  function mover(dir) {
    irA((index + dir + bannerImagenes.length) % bannerImagenes.length);
  }

  function ajustarAltura() {
    const slide = trackRef.current?.children[index];
    const img = slide?.querySelector("img");
    if (!img) return;
    const setFromImg = () => {
      if (img.offsetHeight > 0) setHeight(img.offsetHeight);
    };
    if (img.complete) setFromImg();
    else img.addEventListener("load", setFromImg, { once: true });
  }

  useEffect(() => {
    ajustarAltura();
  }, [index]);

  useEffect(() => {
    if (!containerRef.current || !window.ResizeObserver) return;
    const ro = new ResizeObserver(() => ajustarAltura());
    ro.observe(containerRef.current);
    return () => ro.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function onTouchStart(e) {
    touchStartX.current = e.touches[0].clientX;
    detenerAutoplay();
  }

  function onTouchEnd(e) {
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) mover(diff > 0 ? 1 : -1);
    iniciarAutoplay();
  }

  return (
    <div
      className="banner-carrusel"
      ref={containerRef}
      style={height ? { height } : undefined}
    >
      <div
        id="bannerTrack"
        className="banner-track"
        ref={trackRef}
        style={{ transform: `translateX(-${index * 100}%)` }}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {bannerImagenes.map((src, i) => (
          <div className="banner-slide" key={src}>
            <img
              src={src}
              alt={`Banner ${i + 1}`}
              loading={i === 0 ? "eager" : "lazy"}
              fetchPriority={i === 0 ? "high" : undefined}
              decoding="async"
            />
            {i === 0 && productoBannerPrincipal && (
              <Link className="banner-ver-detalle" to={productoUrl(productoBannerPrincipal)}>
                Ver detalle
              </Link>
            )}
          </div>
        ))}
      </div>

      <div id="bannerIndicadores" className="banner-indicadores">
        {bannerImagenes.map((src, i) => (
          <div
            key={src}
            className={`banner-indicador${i === index ? " activo" : ""}`}
            onClick={() => irA(i)}
          />
        ))}
      </div>

      <button className="banner-flecha izquierda" onClick={() => mover(-1)}>
        ‹
      </button>
      <button className="banner-flecha derecha" onClick={() => mover(1)}>
        ›
      </button>
    </div>
  );
}
