/* =============================================
   THAYSSA — EXPERIÊNCIA INTERATIVA
   script.js
   
   Seções:
   1. Pétalas flutuantes
   2. Tela de abertura
   3. Navegação entre cards
   4. Reveal de elementos
   5. Animações específicas por card
   6. Suporte a swipe (mobile)
============================================= */

'use strict';

/* =============================================
   1. PÉTALAS FLUTUANTES
============================================= */
(function initPetals() {
  const container = document.getElementById('petals-container');
  if (!container) return;

  // Emojis de pétalas e flores
  const petalEmojis = ['🌸', '🌹', '✿', '❀', '🌺', '💮'];
  const PETAL_COUNT = 18;

  function createPetal() {
    const el = document.createElement('span');
    el.classList.add('petal');
    el.setAttribute('aria-hidden', 'true');
    el.textContent = petalEmojis[Math.floor(Math.random() * petalEmojis.length)];

    // Posição horizontal aleatória
    el.style.left = `${Math.random() * 100}%`;

    // Tamanho aleatório
    const size = 0.7 + Math.random() * 0.9;
    el.style.fontSize = `${size}rem`;

    // Duração e delay aleatórios
    const duration = 10 + Math.random() * 14;
    const delay = Math.random() * 12;
    el.style.animationDuration = `${duration}s`;
    el.style.animationDelay = `${delay}s`;

    container.appendChild(el);
  }

  for (let i = 0; i < PETAL_COUNT; i++) {
    createPetal();
  }
})();

/* =============================================
   2. TELA DE ABERTURA
============================================= */
const btnStart = document.getElementById('btn-start');
const introScreen = document.getElementById('intro');
const experience = document.getElementById('experience');
const overlay = document.getElementById('transition-overlay');

btnStart && btnStart.addEventListener('click', startExperience);

function startExperience() {
  // Desabilita o botão imediatamente
  if (btnStart) btnStart.disabled = true;

  // Activa o overlay de transição
  overlay.classList.add('active');

  // Aguarda o fade
  setTimeout(() => {
    // Esconde a intro
    introScreen.classList.add('fade-out');

    // Mostra a experiência
    experience.classList.remove('hidden');

    // Remove o overlay
    setTimeout(() => {
      overlay.classList.remove('active');
      introScreen.style.display = 'none';

      // Inicializa o conteúdo do primeiro card
      activateCard(currentCard);
    }, 600);
  }, 650);
}

/* =============================================
   3. NAVEGAÇÃO ENTRE CARDS
============================================= */
const TOTAL_CARDS = 10;
let currentCard = 0;
let isAnimating = false;

const slidesWrapper = document.getElementById('slides-wrapper');
const progressFill = document.getElementById('progress-fill');
const dotsNav = document.getElementById('dots-nav');
const navPrev = document.getElementById('nav-prev');
const navNext = document.getElementById('nav-next');

// Criar dots de navegação
(function buildDots() {
  for (let i = 0; i < TOTAL_CARDS; i++) {
    const btn = document.createElement('button');
    btn.classList.add('dot');
    btn.setAttribute('aria-label', `Ir para card ${i + 1}`);
    btn.dataset.index = i;
    if (i === 0) btn.classList.add('active');
    btn.addEventListener('click', () => goToCard(i));
    dotsNav.appendChild(btn);
  }
})();

function updateDots(index) {
  const dots = dotsNav.querySelectorAll('.dot');
  dots.forEach((d, i) => d.classList.toggle('active', i === index));
}

function updateProgress(index) {
  const pct = ((index + 1) / TOTAL_CARDS) * 100;
  progressFill.style.width = `${pct}%`;
}

function updateNavButtons() {
  navPrev.disabled = currentCard === 0;
  navNext.disabled = currentCard === TOTAL_CARDS - 1;
}

function goToCard(index) {
  if (isAnimating || index === currentCard) return;
  if (index < 0 || index >= TOTAL_CARDS) return;

  isAnimating = true;
  currentCard = index;

  // Move o wrapper
  slidesWrapper.style.transform = `translateX(-${index * 100}%)`;

  // Atualiza UI
  updateProgress(index);
  updateDots(index);
  updateNavButtons();

  // Ativa animações do card
  setTimeout(() => {
    activateCard(index);
    isAnimating = false;
  }, 700);
}

// Botões de navegação
navPrev && navPrev.addEventListener('click', () => goToCard(currentCard - 1));
navNext && navNext.addEventListener('click', () => goToCard(currentCard + 1));

// Teclado
document.addEventListener('keydown', (e) => {
  if (experience.classList.contains('hidden')) return;
  if (e.key === 'ArrowRight' || e.key === 'ArrowDown') goToCard(currentCard + 1);
  if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') goToCard(currentCard - 1);
});

// Estado inicial dos botões
updateNavButtons();

/* =============================================
   4. REVEAL DE ELEMENTOS (Intersection Observer)
   Elementos com .reveal-up ficam visíveis
   quando o card pai está ativo
============================================= */
function activateCard(index) {
  const card = document.querySelector(`[data-card="${index}"]`);
  if (!card) return;

  // Revela elementos com .reveal-up
  const reveals = card.querySelectorAll('.reveal-up');
  reveals.forEach(el => el.classList.add('visible'));

  // Animações específicas por card
  switch (index) {
    case 1: animateUSEYELA(card); break;
    case 2: animateTimeline(card); break;
    case 5: animatePlayButton(); break;
    case 9: animateFinalCard(card); break;
  }
}

/* =============================================
   5. ANIMAÇÕES ESPECÍFICAS POR CARD
============================================= */

/* --- Card 2: USEYELA --- */
function animateUSEYELA(card) {
  const letters = card.querySelectorAll('.useyela-letter');
  letters.forEach((letter, i) => {
    setTimeout(() => {
      letter.classList.add('visible');
    }, i * 120);
  });
}

/* --- Card 3: Timeline --- */
function animateTimeline(card) {
  const items = card.querySelectorAll('.timeline-item');
  items.forEach((item, i) => {
    setTimeout(() => {
      item.classList.add('visible');
    }, 200 + i * 160);
  });

  // Frase final aparece depois de todos os itens
  const phrase = card.querySelector('.timeline-end-phrase');
  if (phrase) {
    setTimeout(() => {
      phrase.classList.add('visible');
    }, 200 + items.length * 160 + 200);
  }
}

/* --- Card 6: Botão de play --- */
function animatePlayButton() {
  const btn = document.getElementById('btn-play');
  const msg = document.getElementById('play-message');
  if (!btn || !msg) return;

  // Garante estado limpo ao re-visitar o card
  btn.disabled = false;
  msg.classList.add('hidden');
  const iconEl = document.getElementById('play-icon');
  if (iconEl) iconEl.textContent = '▶';

  const audio = new Audio('musica.mp3');

  btn.onclick = function () {
    btn.classList.add('spinning');
    btn.disabled = true;

    setTimeout(() => {
      btn.classList.remove('spinning');
      audio.play();
      if (iconEl) iconEl.textContent = '⏹';
      btn.disabled = false;

      btn.onclick = function () {
        audio.pause();
        audio.currentTime = 0;
        if (iconEl) iconEl.textContent = '▶';
      };
    }, 500);

    msg.classList.add('hidden'); // remove a msg de direitos autorais
  };
}

/* --- Card 10: Final card extra --- */
function animateFinalCard(card) {
  const extra = document.getElementById('final-extra');
  if (!extra) return;

  // Revela o bloco extra após as frases principais carregarem
  setTimeout(() => {
    extra.classList.remove('hidden');
    // Trigger reflow para animar
    requestAnimationFrame(() => {
      extra.style.opacity = '0';
      extra.style.transform = 'translateY(24px)';
      extra.style.transition = 'opacity 1.2s ease, transform 1.2s ease';
      requestAnimationFrame(() => {
        extra.style.opacity = '1';
        extra.style.transform = 'translateY(0)';
      });
    });

    // Mais pétalas na tela final
    increasePetals();
  }, 2200);
}

/* Aumenta a frequência de pétalas na tela final */
function increasePetals() {
  const container = document.getElementById('petals-container');
  if (!container) return;

  const petalEmojis = ['🌸', '🌹', '✿', '❀'];
  const extra = 12;

  for (let i = 0; i < extra; i++) {
    const el = document.createElement('span');
    el.classList.add('petal');
    el.setAttribute('aria-hidden', 'true');
    el.textContent = petalEmojis[Math.floor(Math.random() * petalEmojis.length)];
    el.style.left = `${Math.random() * 100}%`;

    const size = 0.8 + Math.random() * 1;
    el.style.fontSize = `${size}rem`;

    const duration = 7 + Math.random() * 8;
    const delay = Math.random() * 3;
    el.style.animationDuration = `${duration}s`;
    el.style.animationDelay = `${delay}s`;

    container.appendChild(el);
  }
}

/* =============================================
   6. SUPORTE A SWIPE (MOBILE)
============================================= */
(function initSwipe() {
  let touchStartX = 0;
  let touchStartY = 0;
  const SWIPE_THRESHOLD = 45;

  experience.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  }, { passive: true });

  experience.addEventListener('touchend', (e) => {
    if (!e.changedTouches.length) return;

    const deltaX = e.changedTouches[0].clientX - touchStartX;
    const deltaY = e.changedTouches[0].clientY - touchStartY;

    // Só processa swipe horizontal (ignora scroll vertical)
    if (Math.abs(deltaX) < Math.abs(deltaY)) return;
    if (Math.abs(deltaX) < SWIPE_THRESHOLD) return;

    if (deltaX < 0) {
      // Swipe para esquerda → próximo
      goToCard(currentCard + 1);
    } else {
      // Swipe para direita → anterior
      goToCard(currentCard - 1);
    }
  }, { passive: true });
})();

/* =============================================
   PARALLAX SUAVE NO FUNDO
   Move levemente o gradiente conforme o mouse
============================================= */
(function initParallax() {
  const body = document.body;
  let rafId = null;

  function applyParallax(x, y) {
    const xPct = (x / window.innerWidth - 0.5) * 6;
    const yPct = (y / window.innerHeight - 0.5) * 6;
    body.style.backgroundPosition = `${50 + xPct}% ${50 + yPct}%`;
  }

  document.addEventListener('mousemove', (e) => {
    if (rafId) cancelAnimationFrame(rafId);
    rafId = requestAnimationFrame(() => applyParallax(e.clientX, e.clientY));
  });
})();
