// --- LISTA DE PALABRAS ---
const palabras = [
    'casa', 'perro', 'gato', 'luna', 'sol', 'mesa', 'silla', 'agua',
    'pelota', 'cometa', 'zapato', 'mochila', 'helado', 'caballo',
    'manzana', 'fresa', 'plátano', 'naranja', 'familia', 'amigo',
    'escuela', 'jugar', 'leer', 'escribir', 'mariposa', 'elefante',
    'bicicleta', 'computadora', 'felicidad', 'aventura', 'cocodrilo',
    'helicóptero', 'dinosaurio', 'hamburguesa', 'inteligente'
];

// --- ELEMENTOS DE LA PÁGINA ---
const palabraActualElem = document.getElementById('palabra-actual');
const entradaUsuarioElem = document.getElementById('entrada-usuario');
const botonRevisarElem = document.getElementById('boton-revisar');
const areaFeedbackElem = document.getElementById('area-feedback');
const botonEscucharElem = document.getElementById('boton-escuchar');
const marcadorElem = document.getElementById('marcador');
const mensajeRachaElem = document.getElementById('mensaje-racha');
const botonReiniciarElem = document.getElementById('boton-reiniciar');

// --- LÓGICA DE GAMIFICACIÓN ---
let indicePalabraActual = 0;
let marcador = 0;
let racha = 0;
const PUNTOS_POR_RACHA = 25; // Monedas extra por cada 5 aciertos seguidos

// Carga el marcador guardado en el navegador
function cargarProgreso() {
    const marcadorGuardado = localStorage.getItem('marcador_isabella');
    if (marcadorGuardado) {
        marcador = parseInt(marcadorGuardado, 10);
    }
    actualizarMarcador();
}

// Guarda el marcador en el navegador
function guardarProgreso() {
    localStorage.setItem('marcador_isabella', marcador);
}

// Actualiza el texto del marcador en pantalla
function actualizarMarcador() {
    marcadorElem.textContent = `🪙 ${marcador}`;
}

// Muestra el mensaje de racha
function mostrarMensajeRacha() {
    mensajeRachaElem.textContent = `¡RACHA DE ${racha}! +${PUNTOS_POR_RACHA} EXTRA`;
    // Reinicia la animación
    mensajeRachaElem.style.animation = 'none';
    mensajeRachaElem.offsetHeight; // Truco para forzar el reinicio
    mensajeRachaElem.style.animation = 'fadeInOut 2.5s forwards';
}

// Función principal para mostrar la siguiente palabra
function mostrarSiguientePalabra() {
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
}

// Función principal para revisar la palabra
function revisarPalabra() {
    escucharPalabra();
    const palabraCorrecta = palabraActualElem.textContent.toLowerCase();
    const palabraUsuario = entradaUsuarioElem.value.toLowerCase().trim();

    if (palabraUsuario === palabraCorrecta) {
        // --- RESPUESTA CORRECTA ---
        const puntosGanados = 10 + palabraCorrecta.length; // 10 puntos base + 1 por cada letra
        marcador += puntosGanados;
        racha++;

        areaFeedbackElem.innerHTML = `✔️ ¡Correcto! <span style="color: #fbc531;">+${puntosGanados}</span>`;
        areaFeedbackElem.className = 'correcto';
        
        // Comprobar si hay racha
        if (racha > 0 && racha % 5 === 0) {
            marcador += PUNTOS_POR_RACHA;
            mostrarMensajeRacha();
        }

        indicePalabraActual++;
        actualizarMarcador();
        guardarProgreso();
        
        // Desactiva el botón para evitar clics rápidos
        botonRevisarElem.disabled = true;
        setTimeout(() => {
            mostrarSiguientePalabra();
            botonRevisarElem.disabled = false;
        }, 1800);

    } else {
        // --- RESPUESTA INCORRECTA ---
        racha = 0; // Se rompe la racha
        areaFeedbackElem.textContent = '❌ Casi, ¡inténtalo de nuevo!';
        areaFeedbackElem.className = 'incorrecto';
        
        setTimeout(() => {
            entradaUsuarioElem.value = '';
            areaFeedbackElem.textContent = '';
        }, 2000);
    }
}

// Función para escuchar la palabra
function escucharPalabra() {
    const palabra = palabraActualElem.textContent;
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(palabra);
        utterance.lang = 'es-ES';
        utterance.rate = 0.9; // Un poco más lento para que sea más claro
        window.speechSynthesis.speak(utterance);
    } else {
        alert("Tu navegador no soporta la función de escuchar palabras.");
    }
}

// Función para reiniciar todo
function reiniciarPuntaje() {
    if (confirm('¿Estás segura de que quieres reiniciar tu puntaje a cero?')) {
        marcador = 0;
        racha = 0;
        indicePalabraActual = 0;
        localStorage.removeItem('marcador_isabella');
        location.reload(); // Recarga la página para empezar de cero
    }
}

// --- ASIGNAR EVENTOS ---
botonRevisarElem.addEventListener('click', revisarPalabra);
botonEscucharElem.addEventListener('click', escucharPalabra);
botonReiniciarElem.addEventListener('click', reiniciarPuntaje);

entradaUsuarioElem.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        revisarPalabra();
    }
});

// --- INICIAR EL JUEGO ---
cargarProgreso();
mostrarSiguientePalabra();
