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
const areaFeedbackElem = document.getElementById('area-feedback');
const marcadorElem = document.getElementById('marcador');
const mensajeRachaElem = document.getElementById('mensaje-racha');
const barraTiempoElem = document.getElementById('barra-tiempo');
const dificultadSelect = document.getElementById('dificultad');

// --- Variables de estado ---
let indicePalabraActual = 0;
let marcador = 0;
let racha = 0;
let tiempoMaximo = 10000;
let tiempoTimeout;

let reconocimientoActivo = false;
let recognition;

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

// --- UI ---
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
  if (indicePalabraActual >= palabras.length) {
    palabraActualElem.textContent = '¡Felicidades!';
    entradaUsuarioElem.style.display = 'none';
    areaFeedbackElem.innerHTML = '🎉 ¡Completaste todas las palabras!';
    return;
  }

  const palabra = palabras[indicePalabraActual];
  palabraActualElem.textContent = palabra;
  entradaUsuarioElem.value = '';
  areaFeedbackElem.textContent = '';
  iniciarTemporizador();
  iniciarReconocimientoVoz();
}

// --- Temporizador ---
function iniciarTemporizador() {
  const nivel = dificultadSelect.value;
  tiempoMaximo = tiemposPorDificultad[nivel] || 10000;

  barraTiempoElem.style.transition = 'none';
  barraTiempoElem.style.width = '100%';
  barraTiempoElem.offsetWidth;
  barraTiempoElem.style.transition = `width ${tiempoMaximo}ms linear`;
  barraTiempoElem.style.width = '0%';

  tiempoTimeout = setTimeout(() => revisarPalabra('', true), tiempoMaximo);
}

// --- Revisión ---
function revisarPalabra(entrada, auto = false) {
  clearTimeout(tiempoTimeout);
  detenerReconocimientoVoz();

  const correcta = palabras[indicePalabraActual].toLowerCase();
  const entradaLimpia = entrada.toLowerCase().trim();

  if (entradaLimpia === correcta && !auto) {
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

    setTimeout(() => {
      escucharPalabra(() => {
        indicePalabraActual++;
        actualizarMarcador();
        guardarProgreso();
        mostrarSiguientePalabra();
      });
    }, 1000);
  } else {
    sonidoIncorrecto.play();
    racha = 0;
    areaFeedbackElem.textContent = auto ? '⏰ ¡Tiempo agotado!' : '❌ Casi, ¡inténtalo de nuevo!';
    areaFeedbackElem.className = 'incorrecto';

    setTimeout(() => {
      indicePalabraActual++;
      actualizarMarcador();
      guardarProgreso();
      mostrarSiguientePalabra();
    }, 1500);
  }
}

// --- TTS ---
function escucharPalabra(callback) {
  const palabra = palabraActualElem.textContent;
  if ('speechSynthesis' in window) {
    const msg = new SpeechSynthesisUtterance(palabra);
    msg.lang = 'es-ES';
    msg.rate = 0.9;
    msg.onend = () => callback && callback();
    window.speechSynthesis.speak(msg);
  } else {
    callback && callback();
  }
}

// --- Voz ---
function iniciarReconocimientoVoz() {
  if (!('webkitSpeechRecognition' in window)) {
    alert('Tu navegador no soporta el reconocimiento de voz.');
    return;
  }

  recognition = new webkitSpeechRecognition();
  recognition.lang = 'es-ES';
  recognition.continuous = false;
  recognition.interimResults = false;

  recognition.onresult = (event) => {
    const resultado = event.results[0][0].transcript.trim().toLowerCase();
    entradaUsuarioElem.value = resultado;
    revisarPalabra(resultado);
  };

  recognition.onerror = (event) => {
    console.error('Error de reconocimiento:', event.error);
  };

  recognition.onend = () => {
    // Si aún no se ha evaluado, puede reintentar si se desea
  };

  recognition.start();
  reconocimientoActivo = true;
}

function detenerReconocimientoVoz() {
  if (recognition && reconocimientoActivo) {
    recognition.stop();
    reconocimientoActivo = false;
  }
}

// --- Reiniciar ---
function reiniciarPuntaje() {
  if (confirm('¿Estás segura de que quieres reiniciar el puntaje a cero?')) {
    localStorage.removeItem('marcador_isabella');
    localStorage.removeItem('indice_isabella');
    location.reload();
  }
}

// --- Inicializar ---
cargarProgreso();
mostrarSiguientePalabra();
