const sonidoCorrecto = new Audio('sounds/bien.wav');
const sonidoIncorrecto = new Audio('sounds/mal.wav');
const sonidoRacha = new Audio('sounds/racha.wav');
const sonidoTic = new Audio('sounds/tic.wav');

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

// --- LÓGICA ---
let palabrasBarajadas = [];
let indicePalabraActual = 0;
let marcador = 0;
let racha = 0;
const PUNTOS_POR_RACHA = 25;

// Baraja las palabras
function barajarPalabras(arr) {
    return arr.sort(() => Math.random() - 0.5);
}

// Cargar progreso
function cargarProgreso() {
    const marcadorGuardado = localStorage.getItem('marcador_isabella');
    const indiceGuardado = localStorage.getItem('indice_isabella');
    if (marcadorGuardado) marcador = parseInt(marcadorGuardado, 10);
    if (indiceGuardado) indicePalabraActual = parseInt(indiceGuardado, 10);
    actualizarMarcador();
}

// Guardar progreso
function guardarProgreso() {
    localStorage.setItem('marcador_isabella', marcador);
    localStorage.setItem('indice_isabella', indicePalabraActual);
}

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
    if (indicePalabraActual >= palabrasBarajadas.length) {
        palabraActualElem.textContent = '¡Felicidades!';
        entradaUsuarioElem.style.display = 'none';
        botonRevisarElem.style.display = 'none';
        areaFeedbackElem.innerHTML = '🎉 ¡Completaste todas las palabras!';
        return;
    }

    palabraActualElem.textContent = palabrasBarajadas[indicePalabraActual];
    palabraActualElem.classList.add('animada');
    setTimeout(() => palabraActualElem.classList.remove('animada'), 300);
    entradaUsuarioElem.value = '';
    areaFeedbackElem.textContent = '';
    entradaUsuarioElem.focus();
}

function revisarPalabra() {
    botonRevisarElem.disabled = true;
    escucharPalabra();

    setTimeout(() => {
        const palabraCorrecta = palabraActualElem.textContent.toLowerCase();
        const palabraUsuario = entradaUsuarioElem.value.toLowerCase().trim();

        if (palabraUsuario === palabraCorrecta) {
            sonidoCorrecto.play();
            const puntosGanados = 10 + palabraCorrecta.length;
            marcador += puntosGanados;
            racha++;

            areaFeedbackElem.innerHTML = `✔️ ¡Correcto! <span style="color: #fbc531;">+${puntosGanados}</span>`;
            areaFeedbackElem.className = 'correcto';

            if (racha % 5 === 0) {
                marcador += PUNTOS_POR_RACHA;
                sonidoRacha.play();
                mostrarMensajeRacha();
            }

            indicePalabraActual++;
            actualizarMarcador();
            guardarProgreso();

            setTimeout(() => {
                mostrarSiguientePalabra();
                botonRevisarElem.disabled = false;
            }, 1800);

        } else {
            sonidoIncorrecto.play();
            racha = 0;
            areaFeedbackElem.textContent = '❌ Casi, ¡inténtalo de nuevo!';
            areaFeedbackElem.className = 'incorrecto';

            setTimeout(() => {
                entradaUsuarioElem.value = '';
                areaFeedbackElem.textContent = '';
                botonRevisarElem.disabled = false;
            }, 2000);
        }
    }, 1000); // Espera para que escuche antes de evaluar
}

function escucharPalabra() {
    const palabra = palabraActualElem.textContent;
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(palabra);
        utterance.lang = 'es-ES';
        utterance.rate = 0.9;
        window.speechSynthesis.speak(utterance);
    } else {
        alert("Tu navegador no soporta la función de escuchar palabras.");
    }
}

function reiniciarPuntaje() {
    if (confirm('¿Estás segura de que quieres reiniciar tu puntaje a cero?')) {
        marcador = 0;
        racha = 0;
        indicePalabraActual = 0;
        localStorage.removeItem('marcador_isabella');
        localStorage.removeItem('indice_isabella');
        location.reload();
    }
}

// Eventos
botonRevisarElem.addEventListener('click', revisarPalabra);
botonEscucharElem.addEventListener('click', escucharPalabra);
botonReiniciarElem.addEventListener('click', reiniciarPuntaje);

entradaUsuarioElem.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') revisarPalabra();
});

entradaUsuarioElem.addEventListener('input', () => {
    sonidoTic.currentTime = 0;
    sonidoTic.play();
});

// Iniciar
palabrasBarajadas = barajarPalabras([...palabras]);
cargarProgreso();
mostrarSiguientePalabra();
