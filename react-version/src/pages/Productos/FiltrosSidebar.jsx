export default function FiltrosSidebar({ filtros, open, closing, onClose }) {
  const {
    categoria,
    subcategoria,
    marca,
    orden,
    soloOfertas,
    categorias,
    subcategoriasDisponibles,
    marcasDisponibles,
    filtrosActivos,
    setCategoria,
    setSubcategoria,
    setMarca,
    setOrden,
    setSoloOfertas,
    quitarFiltro,
    limpiarFiltros,
  } = filtros;

  let claseSidebar = "productos-sidebar";
  if (open) claseSidebar += " activo";
  if (closing) claseSidebar += " cerrando";

  return (
    <aside className={claseSidebar}>
      <button className="btn-cerrar-filtros" onClick={onClose}>
        ✕ Cerrar filtros
      </button>

      <div className="filtro">
        <h4>Categoría</h4>
        <select value={categoria} onChange={(e) => setCategoria(e.target.value)}>
          <option value="todos">Todas</option>
          {categorias.map((c) => (
            <option value={c} key={c}>
              {c}
            </option>
          ))}
        </select>
      </div>

      <div className="filtro">
        <h4>Subcategoría</h4>
        <select value={subcategoria} onChange={(e) => setSubcategoria(e.target.value)}>
          <option value="todas">Todas</option>
          {subcategoriasDisponibles.map((s) => (
            <option value={s} key={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      <div className="filtro">
        <h4>Ordenar</h4>
        <select value={orden} onChange={(e) => setOrden(e.target.value)}>
          <option value="az">Nombre A–Z</option>
          <option value="za">Nombre Z–A</option>
        </select>
      </div>

      <div className="filtro">
        <h4>Marca</h4>
        <select value={marca} onChange={(e) => setMarca(e.target.value)}>
          <option value="todas">Todas</option>
          {marcasDisponibles.map((m) => (
            <option value={m} key={m}>
              {m}
            </option>
          ))}
        </select>
      </div>

      <div className="filtro filtro-checkbox">
        <label>
          <input
            type="checkbox"
            checked={soloOfertas}
            onChange={(e) => setSoloOfertas(e.target.checked)}
          />
          Solo ofertas/nuevos
        </label>
      </div>

      <div id="filtrosActivos" className="filtros-activos">
        {filtrosActivos.map((f) => (
          <div className="filtro-activo" key={f.tipo}>
            {f.valor}
            <button onClick={() => quitarFiltro(f.tipo)}>×</button>
          </div>
        ))}
        {filtrosActivos.length > 0 && (
          <button className="btn-limpiar" onClick={limpiarFiltros}>
            Limpiar filtros
          </button>
        )}
      </div>
    </aside>
  );
}
