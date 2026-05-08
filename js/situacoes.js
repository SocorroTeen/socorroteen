// ── SCROLL REVEAL com Intersection Observer ──
const reveals = document.querySelectorAll('.reveal');
 
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), 60);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
 
reveals.forEach(el => observer.observe(el));
 
// Escalonamento dos step cards para efeito cascata
document.querySelectorAll('.step-card').forEach((card, i) => {
  card.style.transitionDelay = `${i * 80}ms`;
});
 
// ── BOTÃO VOLTAR ──
function goBack() {
  if (window.history.length > 1) {
    window.history.back();
  } else {
    window.location.href = '../primeiros-socorros.html';
  }
}

// ── BOTÃO OUVIR GUIA ──
let speechUtterance = null;

function getGuideText() {
  const heroTitle = document.querySelector('.hero-title')?.textContent.trim() || '';
  const heroSub = document.querySelector('.hero-sub')?.textContent.trim() || '';
  const steps = Array.from(document.querySelectorAll('.step-card')).map((card) => {
    const num = card.querySelector('.step-num')?.textContent.trim() || '';
    const title = card.querySelector('.step-title')?.textContent.trim() || '';
    const desc = card.querySelector('.step-desc')?.textContent.trim() || '';
    return `${num}. ${title}. ${desc}`;
  }).join(' ');
  return `${heroTitle}. ${heroSub}. ${steps}`;
}

function toggleAudio() {
  const btn = document.querySelector('.btn-audio');
  if (!btn) return;

  if (!('speechSynthesis' in window)) {
    alert('Áudio não suportado neste navegador.');
    return;
  }

  const isPlaying = btn.dataset.playing === 'true';

  if (isPlaying) {
    window.speechSynthesis.cancel();
    btn.dataset.playing = 'false';
    btn.textContent = '🔊 Ouvir guia';
    btn.style.background = '';
    return;
  }

  const text = getGuideText().trim();
  if (!text) return;

  speechUtterance = new SpeechSynthesisUtterance(text);
  speechUtterance.lang = 'pt-BR';
  speechUtterance.rate = 0.95;
  speechUtterance.pitch = 1;
  speechUtterance.onend = () => {
    btn.dataset.playing = 'false';
    btn.textContent = '🔊 Ouvir guia';
    btn.style.background = '';
  };
  speechUtterance.onerror = () => {
    btn.dataset.playing = 'false';
    btn.textContent = '🔊 Ouvir guia';
    btn.style.background = '';
  };

  btn.dataset.playing = 'true';
  btn.textContent = '⏹ Parar guia';
  btn.style.background = '#c62828';
  window.speechSynthesis.speak(speechUtterance);
}
 