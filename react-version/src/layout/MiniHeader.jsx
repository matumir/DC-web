const MENSAJE =
  "🔥 COMPRÁ CON TOTAL SEGURIDAD    •    ENVÍOS A TODO EL PAÍS    •    STOCK PERMANENTE    •    ATENCIÓN PERSONALIZADA    •    ";

export default function MiniHeader() {
  return (
    <div className="mini-header">
      <div className="mini-header-track">
        <span>{MENSAJE.repeat(4)}</span>
      </div>
    </div>
  );
}
