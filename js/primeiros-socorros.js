(() => {
  'use strict';

  const searchInput  = document.getElementById('search-input');
  const emptyState   = document.getElementById('empty-state');
  const emptyQuery   = document.getElementById('empty-query');
  const allCards     = document.querySelectorAll('.card');
  const cardSections = document.querySelectorAll('.cards-section');

  /* ── 1. SEARCH ── */
  function normalise(str) {
    return str.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }

  function filterCards(query) {
    const norm  = normalise(query.trim());
    let   found = 0;

    allCards.forEach(card => {
      const titulo = normalise(card.dataset.titulo || '');
      const desc   = normalise(card.querySelector('.card__desc')?.textContent || '');
      const match  = !norm || titulo.includes(norm) || desc.includes(norm);
      card.hidden  = !match;
      if (match) found++;
    });

    cardSections.forEach(section => {
      section.hidden = section.querySelectorAll('.card:not([hidden])').length === 0;
    });

    if (found === 0 && norm) {
      if (emptyQuery) emptyQuery.textContent = query.trim();
      if (emptyState) emptyState.hidden = false;
    } else {
      if (emptyState) emptyState.hidden = true;
    }
  }

  let debounceTimer;
  if (searchInput) {
    searchInput.addEventListener('input', e => {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => filterCards(e.target.value), 220);
    });

    searchInput.addEventListener('keydown', e => {
      if (e.key === 'Escape') {
        searchInput.value = '';
        filterCards('');
        searchInput.blur();
      }
    });
  }

  /* ── 2. CARD CLICK + RIPPLE ── */
  function addRipple(card, e) {
    card.querySelector('.card__ripple')?.remove();

    const rect = card.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height) * 1.4;

    const x = (e.clientX ?? rect.left + rect.width / 2) - rect.left - size / 2;
    const y = (e.clientY ?? rect.top + rect.height / 2) - rect.top - size / 2;

    const ripple = document.createElement('span');
    ripple.className = 'card__ripple';

    Object.assign(ripple.style, {
      position: 'absolute',
      borderRadius: '50%',
      width: `${size}px`,
      height: `${size}px`,
      left: `${x}px`,
      top: `${y}px`,
      background: 'rgba(255,255,255,0.35)',
      transform: 'scale(0)',
      animation: 'ripple-anim 0.45s ease-out forwards',
      pointerEvents: 'none',
      zIndex: '0',
    });

    card.style.overflow = 'hidden';
    card.appendChild(ripple);

    ripple.addEventListener('animationend', () => ripple.remove());
  }

  const rippleStyle = document.createElement('style');
  rippleStyle.textContent = `
    @keyframes ripple-anim {
      to { transform: scale(1); opacity: 0; }
    }
  `;
  document.head.appendChild(rippleStyle);

  allCards.forEach(card => {
    card.addEventListener('click', e => {
      addRipple(card, e);
      const link = card.querySelector('.card__link');
      if (link && e.target !== link) {
        setTimeout(() => link.click(), 180);
      }
    });

    card.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        card.click();
      }
    });
  });

  /* ── 3. SCROLL ENTRANCE ANIMATION ── */
  if ('IntersectionObserver' in window) {
    const animStyle = document.createElement('style');

    animStyle.textContent = `
      .card {
        opacity: 0;
        transform: translateY(24px);
        transition: opacity 0.4s ease, transform 0.4s ease;
      }
      .card.card--visible {
        opacity: 1;
        transform: translateY(0);
      }
    `;

    document.head.appendChild(animStyle);

    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const idx = parseInt(entry.target.dataset.animIndex || '0', 10);
          setTimeout(() => {
            entry.target.classList.add('card--visible');
          }, idx * 80);

          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    });

    allCards.forEach((card, i) => {
      card.dataset.animIndex = i;
      observer.observe(card);
    });
  }

  /* ── 4. EMERGENCY NUMBERS — clicáveis ── */
  document.querySelectorAll('.acesso-rapido__numbers li').forEach(item => {
    item.style.cursor = 'pointer';
    item.setAttribute('role', 'link');
    item.setAttribute('tabindex', '0');

    const dial = () => {
      const num = item.textContent.match(/(\d{3})/);
      if (num) {
        window.location.href = `tel:${num[1]}`;
      }
    };

    item.addEventListener('click', dial);

    item.addEventListener('keydown', e => {
      if (e.key === 'Enter') dial();
    });

    item.addEventListener('mouseenter', () => {
      item.style.opacity = '0.8';
      item.style.textDecoration = 'underline';
    });

    item.addEventListener('mouseleave', () => {
      item.style.opacity = '';
      item.style.textDecoration = '';
    });
  });

})();