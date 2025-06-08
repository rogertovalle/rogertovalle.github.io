// --- script.js ---

// --- Sonidos ---
const sonidoCorrecto = new Audio('sounds/bien.wav');
const sonidoIncorrecto = new Audio('sounds/mal.wav');
const sonidoRacha = new Audio('sounds/racha.wav');

// --- Lista de palabras ---
const palabras = [ /* tu lista de palabras */ ];

// --- Elementos del DOM ---
const palabraActualElem   = document.getElementById('palabra-actual');
const entradaUsuarioElem  = document.getElementById('entrada-usuario');
const areaFeedbackElem    = document.getElementById('area-feedback');
const marcadorElem        = document.getElementById('marcador');
const mensajeRachaElem    = document.getElementById('mensaje-racha');
const barraTiempoElem     = document.getElementById('barra-tiempo');
const dificultadSelect    = document.getElementById('dificultad');
const botonReiniciarElem  = document.getElementById('boton-reiniciar');

// --- Estado ---
let indicePalabraActual = 0;
let marcador            = 0;
let racha               = 0;
let tiempoTimeout;
let recognition;        // SpeechRecognition instance

const PUNTOS_POR_RACHA = 25;
const tiemposPorDificultad = {
  facil:   10000,
  medio:    7000,
  dificil:  5000,
  experto:  2000
};

// --- LocalStorage ---
function cargarProgreso() {
  const m   = localStorage.getItem('marcador_isabella');
  const idx = localStorage.getItem('indice_isabella');
  if (m)   marcador = +m;
  if (idx) indicePalabraActual = +idx;
  actualizarMarcador();
}
function guardarProgreso() {
  localStorage.setItem('marcador_isabella', marcador);
  localStorage.setItem('indice_isabella', indicePalabraActual);
}

// --- UI Helpers ---
function actualizarMarcador() {
  marcadorElem.textContent = `🪙 ${marcador}`;
}
function mostrarMensajeRacha() {
  mensajeRachaElem.textContent = `¡RACHA DE ${racha}! +${PUNTOS_POR_RACHA} EXTRA`;
  mensajeRachaElem.style.animation = 'none';
  mensajeRachaElem.offsetHeight;
  mensajeRachaElem.style.animation = 'fadeInOut 2.5s forwards';
}

// --- Temporizador & sincronización micrófono ---
function iniciarTemporizador() {
  const nivel      = dificultadSelect.value;
  const tiempoMax  = tiemposPorDificultad[nivel] || 10000;

  // Barra visual
  barraTiempoElem.style.transition = 'none';
  barraTiempoElem.style.width = '100%';
  barraTiempoElem.offsetWidth; 
  barraTiempoElem.style.transition = `width ${tiempoMax}ms linear`;
  barraTiempoElem.style.width = '0%';

  // Cuando se acabe el tiempo, forzamos parada y fallo
  tiempoTimeout = setTimeout(() => {
    recognition.stop();
    revisarPalabra(true);
  }, tiempoMax);
}

// --- Mostrar la siguiente palabra ---
function mostrarSiguientePalabra() {
  clearTimeout(tiempoTimeout);
  areaFeedbackElem.textContent = '';

  if (indicePalabraActual >= palabras.length) {
    palabraActualElem.textContent = '¡Felicidades!';
    entradaUsuarioElem.style.display = 'none';
    return;
  }

  // 1) Muestra la palabra
  palabraActualElem.textContent = palabras[indicePalabraActual];
  entradaUsuarioElem.value = '';

  // 2) Inicia barra de tiempo
  iniciarTemporizador();

  // 3) Da tiempo al TTS y luego arranca reconocimiento
  escucharPalabra(() => {
    recognition.start();
  });
}

// --- Evaluación de la respuesta ---
function revisarPalabra(auto = false, entradaVoz = null) {
  clearTimeout(tiempoTimeout);
  recognition.stop();

  const correcta = palabraActualElem.textContent.toLowerCase();
  const entrada  = entradaVoz !== null
                   ? entradaVoz
                   : entradaUsuarioElem.value.toLowerCase().trim();

  if (entrada === correcta && !auto) {
    // Correcto
    sonidoCorrecto.play();
    const puntos = 10 + correcta.length;
    marcador += puntos; racha++;
    areaFeedbackElem.innerHTML = `✔️ ¡Correcto! <span style="color:#fbc531;">+${puntos}</span>`;
    areaFeedbackElem.className = 'correcto';

    if (racha % 5 === 0) {
      marcador += PUNTOS_POR_RACHA;
      sonidoRacha.play();
      mostrarMensajeRacha();
    }
  } else {
    // Incorrecto o timeout
    sonidoIncorrecto.play();
    racha = 0;
    areaFeedbackElem.textContent = auto
      ? '⏰ ¡Tiempo agotado!'
      : '❌ Casi, ¡inténtalo de nuevo!';
    areaFeedbackElem.className = 'incorrecto';
  }

  // Avanza estado
  actualizarMarcador();
  guardarProgreso();
  indicePalabraActual++;

  // Después de 1.8s lee la palabra (feedback) y pasa a la siguiente
  setTimeout(() => {
    escucharPalabra(mostrarSiguientePalabra);
  }, 1800);
}

// --- Text-to-Speech con callback ---
function escucharPalabra(onEnd) {
  const palabra = palabraActualElem.textContent;
  if ('speechSynthesis' in window) {
    const msg = new SpeechSynthesisUtterance(palabra);
    msg.lang = 'es-ES'; msg.rate = 0.9;
    msg.onend = () => { if (onEnd) onEnd(); };
    window.speechSynthesis.speak(msg);
  } else {
    if (onEnd) onEnd();
  }
}

// --- Inicializar SpeechRecognition ---
function inicializarReconocimiento() {
  if (!('webkitSpeechRecognition' in window)) {
    alert('Tu navegador no soporta reconocimiento de voz.');
    return;
  }

  recognition = new webkitSpeechRecognition();
  recognition.lang = 'es-ES';
  recognition.continuous = true;     // escucha toda la ventana de tiempo
  recognition.interimResults = false;

  recognition.onresult = (event) => {
    // Toma el último resultado completo
    const raw = event.results[event.results.length - 1][0].transcript.trim().toLowerCase();
    // Filtra duplicados y sílabas: toma solo el último token
    const tokens = raw.split(/\s+/);
    const ultimo = tokens[tokens.length - 1];

    entradaUsuarioElem.value = ultimo;
    recognition.stop();
    revisarPalabra(false, ultimo);
  };

  recognition.onerror = (e) => {
    console.warn('SpeechRecognition error:', e.error);
  };
}

// --- Reiniciar juego ---
function reiniciarPuntaje() {
  if (confirm('¿Seguro que quieres reiniciar el puntaje?')) {
    localStorage.removeItem('marcador_isabella');
    localStorage.removeItem('indice_isabella');
    location.reload();
  }
}

// --- Inicialización ---
entradaUsuarioElem.disabled = true;
cargarProgreso();
inicializarReconocimiento();
mostrarSiguientePalabra();

// Maneja reinicio
botonReiniciarElem.addEventListener('click', reiniciarPuntaje);
