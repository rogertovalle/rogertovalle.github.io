const container = document.querySelector('.slides-container');
const slides = Array.from(document.querySelectorAll('.slide'));
const progress = document.querySelector('.progress');
let idx = 0;

function updateProgress() {
  const pct = ((idx + 1) / slides.length) * 100;
  progress.style.width = pct + '%';
}

function goToSlide(n) {
  idx = Math.max(0, Math.min(slides.length - 1, n));
  slides[idx].scrollIntoView({behavior:'smooth'});
  updateProgress();
}

document.getElementById('prev').addEventListener('click', () => goToSlide(idx - 1));
document.getElementById('next').addEventListener('click', () => goToSlide(idx + 1));

// Navegación con teclado
document.addEventListener('keydown', e => {
  if (e.key.match(/Arrow(Down|Right)/)) goToSlide(idx + 1);
  if (e.key.match(/Arrow(Up|Left)/))   goToSlide(idx - 1);
});

// Detectar scroll manual para actualizar progress
let isThrottled = false;
container.addEventListener('scroll', () => {
  if (isThrottled) return;
  isThrottled = true;
  setTimeout(() => {
    idx = slides.findIndex(slide => {
      const rect = slide.getBoundingClientRect();
      return rect.top >= 0 && rect.top < window.innerHeight / 2;
    });
    updateProgress();
    isThrottled = false;
  }, 100);
});

// Inicial
updateProgress();
