// --- LISTA DE PALABRAS ---
// ¡Puedes agregar todas las palabras que quieras aquí!
const palabras = [
    'casa', 'perro', 'gato', 'luna', 'sol', 'mesa', 'silla', 'agua',
    'pelota', 'cometa', 'zapato', 'mochila', 'helado', 'caballo',
    'manzana', 'fresa', 'plátano', 'naranja', 'familia', 'amigo',
    'escuela', 'jugar', 'leer', 'escribir', 'mariposa', 'elefante',
    'bicicleta', 'computadora', 'felicidad', 'aventura'
];

// --- ELEMENTOS DE LA PÁGINA ---
const palabraActualElem = document.getElementById('palabra-actual');
const entradaUsuarioElem = document.getElementById('entrada-usuario');
const botonRevisarElem = document.getElementById('boton-revisar');
const areaFeedbackElem = document.getElementById('area-feedback');
const botonEscucharElem = document.getElementById('boton-escuchar');

// --- LÓGICA DEL JUEGO ---
let indicePalabraActual = 0;

// Función para mostrar la siguiente palabra en la pantalla
function mostrarSiguientePalabra() {
    if (indicePalabraActual >= palabras.length) {
        // Si se acaban las palabras
        palabraActualElem.textContent = '¡Felicidades!';
        entradaUsuarioElem.style.display = 'none';
        botonRevisarElem.style.display = 'none';
        botonEscucharElem.style.display = 'none';
        areaFeedbackElem.innerHTML = '🎉';
        return;
    }

    // Muestra la palabra y limpia los campos
    palabraActualElem.textContent = palabras[indicePalabraActual];
    entradaUsuarioElem.value = '';
    areaFeedbackElem.textContent = '';
    entradaUsuarioElem.focus(); // Pone el cursor en el campo de texto
}

// Función para revisar si la palabra es correcta
function revisarPalabra() {
    const palabraCorrecta = palabraActualElem.textContent.toLowerCase();
    const palabraUsuario = entradaUsuarioElem.value.toLowerCase().trim();

    if (palabraUsuario === palabraCorrecta) {
        // Si es correcta
        areaFeedbackElem.textContent = '✔️ ¡Muy bien!';
        areaFeedbackElem.className = 'correcto';
        indicePalabraActual++;

        // Espera un momento y luego muestra la siguiente palabra
        setTimeout(mostrarSiguientePalabra, 1500);

    } else {
        // Si es incorrecta
        areaFeedbackElem.textContent = '❌ Inténtalo de nuevo';
        areaFeedbackElem.className = 'incorrecto';
        
        // Limpia el campo para que lo intente de nuevo
        setTimeout(() => {
            entradaUsuarioElem.value = '';
            areaFeedbackElem.textContent = '';
        }, 2000);
    }
}

// Función para escuchar la palabra (Text-to-Speech del navegador)
function escucharPalabra() {
    const palabra = palabraActualElem.textContent;
    if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(palabra);
        utterance.lang = 'es-ES'; // Asegura que se use la voz en español
        window.speechSynthesis.speak(utterance);
    } else {
        alert("Tu navegador no soporta la función de escuchar palabras.");
    }
}


// --- ASIGNAR EVENTOS ---
botonRevisarElem.addEventListener('click', revisarPalabra);
botonEscucharElem.addEventListener('click', escucharPalabra);

// Permite que se pueda presionar "Enter" en lugar del botón
entradaUsuarioElem.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        revisarPalabra();
    }
});


// --- INICIAR EL JUEGO ---
mostrarSiguientePalabra();
