// --- script.js ---

// --- Sonidos ---
const sonidoCorrecto = new Audio('sounds/bien.wav');
const sonidoIncorrecto = new Audio('sounds/mal.wav');
const sonidoRacha = new Audio('sounds/racha.wav');

// --- Palabras: listado único editable ---
const DEFAULT_WORDS = [
  'casa', 'perro', 'gato', 'luna', 'sol', 'mesa', 'silla', 'agua',
  'pelota', 'cometa', 'zapato', 'mochila', 'helado', 'caballo',
  'manzana', 'fresa', 'plátano', 'naranja', 'familia', 'amigo',
  'escuela', 'jugar', 'leer', 'escribir', 'mariposa', 'elefante',
  'bicicleta', 'computadora', 'felicidad', 'aventura', 'cocodrilo',
  'helicóptero', 'dinosaurio', 'hamburguesa', 'inteligente'
];
let palabras = [];

// --- Elementos del DOM ---
const palabraActualElem    = document.getElementById('palabra-actual');
const entradaUsuarioElem   = document.getElementById('entrada-usuario');
const areaFeedbackElem     = document.getElementById('area-feedback');
const marcadorElem         = document.getElementById('marcador');
const mensajeRachaElem     = document.getElementById('mensaje-racha');
const barraTiempoElem      = document.getElementById('barra-tiempo');
const dificultadSelect     = document.getElementById('dificultad');
const botonReiniciarElem   = document.getElementById('boton-reiniciar');
const botonEscucharElem    = document.getElementById('boton-escuchar');
const botonIniciarElem     = document.getElementById('boton-iniciar');
const contenedorIniciarElem= document.getElementById('contenedor-iniciar');
const textareaPalabrasElem = document.getElementById('entrada-palabras');
const botonLimpiarPersElem = document.getElementById('boton-limpiar-personalizadas');
const resumenPalabrasElem  = document.getElementById('resumen-palabras');

// --- Estado ---
let indicePalabraActual = 0;
let marcador            = 0;
let racha               = 0;
let tiempoTimeout;
let recognition;        // SpeechRecognition instance
let escuchandoActivo    = false; // solo procesar resultados cuando true
let ttsEnCurso          = false; // TTS en progreso
let juegoIniciado       = false; // tras click de Iniciar

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

// --- Listado único (LS) ---
const LS_KEY_PALABRAS = 'palabras_isabella';
const LS_OLD_KEY_PERS = 'palabras_personalizadas_isabella';
function cargarPalabras() {
  try {
    const raw = localStorage.getItem(LS_KEY_PALABRAS);
    if (!raw) {
      // migración desde clave vieja si existe
      const oldRaw = localStorage.getItem(LS_OLD_KEY_PERS);
      if (oldRaw) {
        try {
          const oldArr = JSON.parse(oldRaw);
          const merged = Array.from(new Set(
            (DEFAULT_WORDS.concat(Array.isArray(oldArr) ? oldArr : [])).map(x => String(x).trim().toLowerCase()).filter(Boolean)
          ));
          palabras = merged;
          guardarPalabras();
          localStorage.removeItem(LS_OLD_KEY_PERS);
          return;
        } catch {}
      }
      palabras = DEFAULT_WORDS.slice();
      guardarPalabras();
      return;
    }
    const arr = JSON.parse(raw);
    if (Array.isArray(arr)) {
      palabras = arr.filter(x => typeof x === 'string')
        .map(x => x.trim().toLowerCase())
        .filter(x => x.length > 0);
      if (palabras.length === 0) {
        palabras = DEFAULT_WORDS.slice();
        guardarPalabras();
      }
    } else {
      palabras = DEFAULT_WORDS.slice();
      guardarPalabras();
    }
  } catch {
    palabras = DEFAULT_WORDS.slice();
    guardarPalabras();
  }
}
function guardarPalabras() {
  const dedup = Array.from(new Set(
    (palabras || []).map(w => (w || '').toString().trim().toLowerCase()).filter(Boolean)
  ));
  palabras = dedup;
  localStorage.setItem(LS_KEY_PALABRAS, JSON.stringify(palabras));
}
function obtenerPalabras() { return palabras; }
function actualizarResumenPalabras() {
  if (resumenPalabrasElem) {
    resumenPalabrasElem.textContent = `Total de palabras: ${palabras.length}`;
  }
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

  // Cuando se acabe el tiempo, marcar fallo si no hubo respuesta
  tiempoTimeout = setTimeout(() => {
    if (escuchandoActivo) {
      revisarPalabra(true);
    }
  }, tiempoMax);
}

// --- Mostrar la siguiente palabra ---
function mostrarSiguientePalabra() {
  clearTimeout(tiempoTimeout);
  areaFeedbackElem.textContent = '';

  const lista = obtenerPalabras();
  if (lista.length === 0) {
    palabraActualElem.textContent = 'Agrega palabras para empezar';
    entradaUsuarioElem.style.display = 'none';
    return;
  }
  if (indicePalabraActual >= lista.length) {
    palabraActualElem.textContent = '¡Felicidades!';
    entradaUsuarioElem.style.display = 'none';
    return;
  }

  // 1) Muestra la palabra
  palabraActualElem.textContent = lista[indicePalabraActual];
  entradaUsuarioElem.value = '';

  // 2) Inicia barra de tiempo
  iniciarTemporizador();

  // 3) Da tiempo al TTS y luego arranca reconocimiento
  escucharPalabra(() => {
    // al terminar TTS habilitamos la ventana de escucha
    escuchandoActivo = true;
  });
}

// --- Evaluación de la respuesta ---
function revisarPalabra(auto = false, entradaVoz = null) {
  clearTimeout(tiempoTimeout);
  
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
    ttsEnCurso = true;
    escuchandoActivo = false; // no procesar resultados durante TTS
    msg.onend = () => {
      ttsEnCurso = false;
      if (onEnd) onEnd();
    };
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
    if (!juegoIniciado || !escuchandoActivo || ttsEnCurso) return;
    // Toma el último resultado completo
    const raw = event.results[event.results.length - 1][0].transcript.trim().toLowerCase();
    const tokens = raw.split(/\s+/);
    const ultimo = tokens[tokens.length - 1];
    entradaUsuarioElem.value = ultimo;
    escuchandoActivo = false; // cierra ventana de escucha para esta palabra
    revisarPalabra(false, ultimo);
  };

  recognition.onerror = (e) => {
    console.warn('SpeechRecognition error:', e.error);
  };

  // Mantener reconocimiento activo
  recognition.onend = () => {
    if (juegoIniciado) {
      try { recognition.start(); } catch {}
    }
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

// Maneja reinicio
botonReiniciarElem.addEventListener('click', reiniciarPuntaje);

// Botón re-escuchar palabra actual
if (botonEscucharElem) {
  botonEscucharElem.addEventListener('click', () => escucharPalabra(null));
}

// Gestión UI palabras personalizadas
function parsearEntradaPalabras(texto) {
  return texto
    .split(/[\n,;]/g)
    .map(t => t.trim().toLowerCase())
    .filter(t => t.length > 0);
}
// Guardado automático al editar el textarea (fuente de verdad)
if (textareaPalabrasElem) {
  const aplicarDesdeTextarea = () => {
    const nuevas = parsearEntradaPalabras(textareaPalabrasElem.value || '');
    const anteriorLen = palabras.length;
    palabras = Array.from(new Set(nuevas));
    guardarPalabras();
    actualizarResumenPalabras();
    // si la lista se vacía o el índice quedó fuera de rango
    if (palabras.length === 0) {
      indicePalabraActual = 0;
      guardarProgreso();
      mostrarSiguientePalabra();
      return;
    }
    if (indicePalabraActual >= palabras.length) {
      indicePalabraActual = Math.max(0, palabras.length - 1);
      guardarProgreso();
    }
    // Si cambió el listado y estamos fuera de ventana de escucha, actualiza la UI
    if (anteriorLen !== palabras.length) {
      mostrarSiguientePalabra();
    }
  };
  textareaPalabrasElem.addEventListener('input', aplicarDesdeTextarea);
  textareaPalabrasElem.addEventListener('change', aplicarDesdeTextarea);
}
if (botonLimpiarPersElem) {
  botonLimpiarPersElem.addEventListener('click', () => {
    if (!confirm('¿Restablecer el listado precargado?')) return;
    palabras = DEFAULT_WORDS.slice();
    guardarPalabras();
    actualizarResumenPalabras();
    indicePalabraActual = 0;
    guardarProgreso();
    if (textareaPalabrasElem) {
      textareaPalabrasElem.value = (palabras || []).join(', ');
    }
    mostrarSiguientePalabra();
  });
}

// --- Inicialización ---
entradaUsuarioElem.disabled = true;
cargarProgreso();
cargarPalabras();
actualizarResumenPalabras();
if (textareaPalabrasElem) {
  textareaPalabrasElem.value = (palabras || []).join(', ');
}

// Iniciar juego/permiso micrófono con gesto del usuario
if (botonIniciarElem) {
  botonIniciarElem.addEventListener('click', () => {
    if (juegoIniciado) return;
    inicializarReconocimiento();
    try { recognition.start(); } catch {}
    juegoIniciado = true;
    if (contenedorIniciarElem) contenedorIniciarElem.style.display = 'none';
    mostrarSiguientePalabra();
  });
}
