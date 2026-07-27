import { useEffect, useState } from "react";

const PRODUCTOS_POR_PAGINA = 12;

function useMaxNumeros() {
  const [maxNumeros, setMaxNumeros] = useState(getMax());

  function getMax() {
    if (typeof window === "undefined") return 9;
    const ancho = window.innerWidth;
    if (ancho < 480) return 3;
    if (ancho < 768) return 5;
    return 9;
  }

  useEffect(() => {
    function onResize() {
      setMaxNumeros(getMax());
    }
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return maxNumeros;
}

export default function Paginacion({ total, paginaActual, onCambiarPagina }) {
  const maxNumeros = useMaxNumeros();
  const totalPaginas = Math.ceil(total / PRODUCTOS_POR_PAGINA);

  if (totalPaginas <= 1) return null;

  let inicio = Math.max(1, paginaActual - Math.floor(maxNumeros / 2));
  let fin = inicio + maxNumeros - 1;
  if (fin > totalPaginas) {
    fin = totalPaginas;
    inicio = Math.max(1, fin - maxNumeros + 1);
  }

  const numeros = [];
  for (let i = inicio; i <= fin; i++) numeros.push(i);

  return (
    <div id="paginacion" className="paginacion">
      <button disabled={paginaActual === 1} onClick={() => onCambiarPagina(paginaActual - 1)}>
        ‹
      </button>

      {inicio > 1 && (
        <>
          <button onClick={() => onCambiarPagina(1)}>1</button>
          {inicio > 2 && (
            <button disabled className="ellipsis">
              ...
            </button>
          )}
        </>
      )}

      {numeros.map((n) => (
        <button
          key={n}
          className={n === paginaActual ? "activa" : ""}
          disabled={n === paginaActual}
          onClick={() => onCambiarPagina(n)}
        >
          {n}
        </button>
      ))}

      {fin < totalPaginas && (
        <>
          {fin < totalPaginas - 1 && (
            <button disabled className="ellipsis">
              ...
            </button>
          )}
          <button onClick={() => onCambiarPagina(totalPaginas)}>{totalPaginas}</button>
        </>
      )}

      <button disabled={paginaActual === totalPaginas} onClick={() => onCambiarPagina(paginaActual + 1)}>
        ›
      </button>
    </div>
  );
}

export { PRODUCTOS_POR_PAGINA };
