// Sonidos cortos para las notificaciones, generados con la Web Audio API.
//
// Sin archivos de audio a proposito: son dos tonos de 150ms, no vale la pena
// una peticion de red ni sumar peso al deploy. Ademas evita el desfasaje entre
// el cartel que aparece y un mp3 que todavia se esta descargando.

let contexto = null;

function obtenerContexto() {
  const AudioCtx = window.AudioContext || window.webkitAudioContext;
  if (!AudioCtx) return null;
  if (!contexto) contexto = new AudioCtx();
  // Los navegadores arrancan el audio suspendido hasta que hay un gesto del
  // usuario. Como esto siempre se dispara desde un click, aca ya se puede.
  if (contexto.state === "suspended") contexto.resume();
  return contexto;
}

function tono(ctx, frecuencia, inicio, duracion, volumen) {
  const osc = ctx.createOscillator();
  const ganancia = ctx.createGain();

  osc.type = "sine";
  osc.frequency.setValueAtTime(frecuencia, inicio);

  // Ataque y caida progresivos: arrancar o cortar de golpe produce un "clic"
  // audible bastante desagradable.
  ganancia.gain.setValueAtTime(0.0001, inicio);
  ganancia.gain.linearRampToValueAtTime(volumen, inicio + 0.012);
  ganancia.gain.exponentialRampToValueAtTime(0.0001, inicio + duracion);

  osc.connect(ganancia).connect(ctx.destination);
  osc.start(inicio);
  osc.stop(inicio + duracion + 0.02);
}

const VOLUMEN = 0.05;

// Cada accion suena distinto para poder distinguirlas sin mirar la pantalla.
const MELODIAS = {
  carrito: [[659, 0, 0.12], [880, 0.075, 0.16]],
  favorito: [[880, 0, 0.1], [1175, 0.07, 0.16]],
  quitar: [[880, 0, 0.1], [587, 0.07, 0.16]],
  error: [[311, 0, 0.2]],
};

export function sonar(clave) {
  const melodia = MELODIAS[clave];
  if (!melodia) return;

  try {
    const ctx = obtenerContexto();
    if (!ctx) return;
    const ahora = ctx.currentTime;
    for (const [frecuencia, retraso, duracion] of melodia) {
      tono(ctx, frecuencia, ahora + retraso, duracion, VOLUMEN);
    }
  } catch {
    // Sin audio disponible (permisos, navegador viejo) el sitio sigue igual.
  }
}
