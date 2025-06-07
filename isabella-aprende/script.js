// --- LISTA DE PALABRAS ---
// ¡Puedes agregar todas las palabras que quieras aquí!
const palabras = [
    // Palabras básicas y de la casa
    'agua', 'amigo', 'amiga', 'árbol', 'azul', 'bebé', 'blanco', 'boca',
    'brazo', 'caballo', 'cabeza', 'cama', 'camisa', 'campo', 'carro',
    'casa', 'cebra', 'cerdo', 'cielo', 'ciudad', 'cocina', 'conejo',
    'corazón', 'cosa', 'cuaderno', 'cuchara', 'cuello', 'cuerpo', 'diente',
    'dinero', 'doctor', 'dulce', 'escuela', 'espalda', 'espejo', 'estrella',
    
    // Familia y personas
    'familia', 'fiesta', 'flor', 'fuego', 'gallina', 'gato', 'gente',
    'gigante', 'globo', 'gracias', 'grande', 'guitarra', 'gusano', 'hambre',
    'helado', 'hermana', 'hermano', 'hoja', 'hombre', 'hormiga', 'hospital',
    'huevo', 'idea', 'iglesia', 'invierno', 'jabón', 'jamón', 'jarra',
    
    // Objetos y lugares
    'jardín', 'jirafa', 'juego', 'juguete', 'lápiz', 'leche', 'lechuza',
    'león', 'letra', 'libro', 'limón', 'llave', 'lluvia', 'luna', 'luz',
    'maestro', 'mamá', 'mano', 'manzana', 'mañana', 'mariposa', 'martillo',
    'mesa', 'mochila', 'mono', 'montaña', 'mujer', 'muñeca', 'música',
    
    // Naturaleza y animales
    'naranja', 'nariz', 'nido', 'niña', 'niño', 'noche', 'nombre', 'nube',
    'nuevo', 'número', 'ojo', 'oreja', 'oso', 'oveja', 'pájaro', 'pantalón',
    'pan', 'papá', 'parque', 'pasto', 'pato', 'payaso', 'peces', 'pelota',
    'pelo', 'pera', 'perro', 'pie', 'piedra', 'pierna', 'pingüino', 'piso',
    
    // Palabras con sílabas trabadas y complejas
    'plátano', 'playa', 'plaza', 'pluma', 'pollo', 'primo', 'princesa',
    'profesor', 'pueblo', 'puente', 'puerta', 'queso', 'ratón', 'regla',
    'reloj', 'río', 'rojo', 'ropa', 'rosa', 'rueda', 'sal', 'sandía',
    'sapo', 'serpiente', 'silla', 'sofá', 'sol', 'sombrero', 'sopa',
    
    // Adjetivos y más
    'suelo', 'tarde', 'tarea', 'taza', 'techo', 'teléfono', 'tenedor',
    'tigre', 'tijeras', 'tomate', 'torta', 'tortuga', 'trabajo', 'tren',
    'triste', 'uva', 'vaca', 'vaso', 'vela', 'ventana', 'verano', 'verde',
    'vestido', 'viento', 'violín', 'zapato', 'zoológico', 'zanahoria',

    // Verbos comunes (acciones)
    'abrir', 'ayudar', 'bailar', 'beber', 'buscar', 'caer', 'caminar',
    'cantar', 'cerrar', 'cocinar', 'comer', 'comprar', 'correr', 'cortar',
    'crecer', 'cuidar', 'dar', 'decir', 'dejar', 'dibujar', 'dormir',
    'empezar', 'encontrar', 'enseñar', 'entrar', 'escribir', 'escuchar',
    'esperar', 'estar', 'ganar', 'gritar', 'hablar', 'hacer', 'ir',
    'jugar', 'lavar', 'leer', 'limpiar', 'llamar', 'llegar', 'llevar',
    'llorar', 'meter', 'mirar', 'nadar', 'necesitar', 'oler', 'pagar',
    'parar', 'pasar', 'pedir', 'pegar', 'pensar', 'perder', 'pintar',
    'poder', 'poner', 'preguntar', 'querer', 'reír', 'romper', 'saber',
    'salir', 'saltar', 'sentir', 'ser', 'soñar', 'subir', 'tener',
    'terminar', 'tocar', 'tomar', 'traer', 'usar', 'venir', 'ver',
    'viajar', 'vivir', 'volar', 'volver'
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
