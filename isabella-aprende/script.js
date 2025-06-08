// --- script.js ---

// --- Sonidos ---
const sonidoCorrecto = new Audio('sounds/bien.wav');
const sonidoIncorrecto = new Audio('sounds/mal.wav');
const sonidoRacha = new Audio('sounds/racha.wav');

// --- Lista de palabras ---
const palabras = [
  'casa', 'perro', 'gato', 'luna', 'sol', 'mesa', 'silla', 'agua',
  'pelota', 'cometa', 'zapato', 'mochila', 'helado', 'caballo',
  'manzana', 'fresa', 'plátano', 'naranja', 'familia', 'amigo',
  'escuela', 'jugar', 'leer', 'escribir', 'mariposa', 'elefante',
  'bicicleta', 'computadora', 'felicidad', 'aventura', 'cocodrilo',
  'helicóptero', 'dinosaurio', 'hamburguesa', 'inteligente'
];

// --- Elementos del DOM ---
const palabraActualElem = document.getElementById('palabra-actual');
const entradaUsuarioElem = document.getElementById('entrada-usuario');
const botonRevisarElem = document.getElementById('boton-revisar');
const areaFeedbackElem = document.getElementById('area-feedback');
const botonEscucharElem = document.getElementById('boton-escuchar');
const marcadorElem = document.getElementById('marcador');
const mensajeRachaElem = document.getElementById('mensaje-racha');
const botonReiniciarElem = document.getElementById('boton-reiniciar');
const barraTiempoElem = document.getElementById('barra-tiempo');
const dificultadSelect = document.getElementById('dificultad');

// --- Variables de estado ---
let indicePalabraActual = 0;
let marcador = 0;
let racha = 0;
let tiempoMaximo = 10000;
let tiempoTimeout;

const PUNTOS_POR_RACHA = 25;
const tiemposPorDificultad = {
  facil: 10000,
  medio: 7000,
  dificil: 5000,
  experto: 2000
};

// --- Progreso en localStorage ---
function cargarProgreso() {
  const m = localStorage.getItem('marcador_isabella');
  const idx = localStorage.getItem('indice_isabella');
  if (m) marcador = parseInt(m, 10);
  if (idx) indicePalabraActual = parseInt(idx, 10);
  actualizarMarcador();
}
function guardarProgreso() {
  localStorage.setItem('marcador_isabella', marcador);
  localStorage.setItem('indice_isabella', indicePalabraActual);
}

// --- Actualizar UI ---
function actualizarMarcador() {
  marcadorElem.textContent = `🪙 ${marcador}`;
}

function mostrarMensajeRacha() {
  mensajeRachaElem.textContent = `¡RACHA DE ${racha}! +${PUNTOS_POR_RACHA} EXTRA`;
  mensajeRachaElem.style.animation = 'none';
  mensajeRachaElem.offsetHeight;
  mensajeRachaElem.style.animation = 'fadeInOut 2.5s forwards';
}

function mostrarSiguientePalabra() {
  clearTimeout(tiempoTimeout);
  if (indicePalabraActual >= palabras.length) {
    palabraActualElem.textContent = '¡Felicidades!';
    entradaUsuarioElem.style.display = 'none';
    botonRevisarElem.style.display = 'none';
    areaFeedbackElem.innerHTML = '🎉 ¡Completaste todas las palabras!';
    return;
  }
  palabraActualElem.textContent = palabras[indicePalabraActual];
  entradaUsuarioElem.value = '';
  areaFeedbackElem.textContent = '';
  entradaUsuarioElem.focus();
  iniciarTemporizador();
}

// --- Manejo de tiempo ---
function iniciarTemporizador() {
  // Determinar tiempo según nivel
  const nivel = dificultadSelect.value;
  tiempoMaximo = tiemposPorDificultad[nivel] || 10000;

  // Resetear barra
  barraTiempoElem.style.transition = 'none';
  barraTiempoElem.style.width = '100%';
  // Forzar reflow antes de animar
  barraTiempoElem.offsetWidth;
  barraTiempoElem.style.transition = `width ${tiempoMaximo}ms linear`;
  barraTiempoElem.style.width = '0%';

  // Timeout para auto-revisar como fallo
  tiempoTimeout = setTimeout(() => revisarPalabra(true), tiempoMaximo);
}

// --- Revisar palabra ---
function revisarPalabra(auto = false) {
  clearTimeout(tiempoTimeout);

  const correcta = palabraActualElem.textContent.toLowerCase();
  const entrada = entradaUsuarioElem.value.toLowerCase().trim();

  if (entrada === correcta && !auto) {
    sonidoCorrecto.play();
    const puntos = 10 + correcta.length;
    marcador += puntos;
    racha++;
    areaFeedbackElem.innerHTML = `✔️ ¡Correcto! <span style="color:#fbc531;">+${puntos}</span>`;
    areaFeedbackElem.className = 'correcto';

    if (racha % 5 === 0) {
      marcador += PUNTOS_POR_RACHA;
      sonidoRacha.play();
      mostrarMensajeRacha();
    }
  } else {
    sonidoIncorrecto.play();
    racha = 0;
    areaFeedbackElem.textContent = auto ? '⏰ ¡Tiempo agotado!' : '❌ Casi, ¡inténtalo de nuevo!';
    areaFeedbackElem.className = 'incorrecto';
  }

  // Pospone siguiente
  indicePalabraActual++;
  actualizarMarcador();
  guardarProgreso();
  botonRevisarElem.disabled = true;
  setTimeout(() => {
    botonRevisarElem.disabled = false;
    mostrarSiguientePalabra();
  }, 1800);
}

// --- Otros handlers ---
function escucharPalabra() {
  const palabra = palabraActualElem.textContent;
  if ('speechSynthesis' in window) {
    const msg = new SpeechSynthesisUtterance(palabra);
    msg.lang = 'es-ES';
    msg.rate = 0.9;
    window.speechSynthesis.speak(msg);
  }
}
function reiniciarPuntaje() {
  if (confirm('¿Estás segura de que quieres reiniciar el puntaje a cero?')) {
    localStorage.removeItem('marcador_isabella');
    localStorage.removeItem('indice_isabella');
    location.reload();
  }
}

// --- Asignar eventos ---
botonRevisarElem.addEventListener('click', () => revisarPalabra());
botonEscucharElem.addEventListener('click', escucharPalabra);
botonReiniciarElem.addEventListener('click', reiniciarPuntaje);
entradaUsuarioElem.addEventListener('keydown', e => {
  if (e.key === 'Enter') revisarPalabra();
});
dificultadSelect.addEventListener('change', mostrarSiguientePalabra);

// --- Inicializar ---
cargarProgreso();
mostrarSiguientePalabra();
