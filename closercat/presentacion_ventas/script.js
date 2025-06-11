const container = document.querySelector('.slides-container');
const slides = Array.from(document.querySelectorAll('.slide'));
let idx = 0;

document.getElementById('prev').addEventListener('click', () => {
  idx = Math.max(0, idx - 1);
  slides[idx].scrollIntoView({behavior:'smooth'});
});

document.getElementById('next').addEventListener('click', () => {
  idx = Math.min(slides.length - 1, idx + 1);
  slides[idx].scrollIntoView({behavior:'smooth'});
});

// Navegación con flechas de teclado
document.addEventListener('keydown', e => {
  if (e.key === 'ArrowDown' || e.key === 'ArrowRight') {
    idx = Math.min(slides.length - 1, idx + 1);
    slides[idx].scrollIntoView({behavior:'smooth'});
  }
  if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') {
    idx = Math.max(0, idx - 1);
    slides[idx].scrollIntoView({behavior:'smooth'});
  }
});
