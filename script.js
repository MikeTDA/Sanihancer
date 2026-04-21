(function(){
  'use strict';

  const navbar    = document.getElementById('navbar');
  const hamburger = document.getElementById('hamburger');
  const mobileNav = document.getElementById('mobileNav');
  const testiTrack     = document.getElementById('testiTrack');
  const testiPrev      = document.getElementById('testiPrev');
  const testiNext      = document.getElementById('testiNext');
  const testiDotsWrap  = document.getElementById('testiDots');

  /* ---- NAVBAR SCROLL ---- */
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  }, { passive: true });

  /* ---- MOBILE NAV ---- */
  hamburger.addEventListener('click', () => {
    const open = mobileNav.classList.toggle('open');
    hamburger.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });
  document.querySelectorAll('[data-close]').forEach(el => {
    el.addEventListener('click', () => {
      mobileNav.classList.remove('open');
      hamburger.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  /* ---- SMOOTH SCROLL ---- */
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', e => {
      const target = document.querySelector(a.getAttribute('href'));
      if (!target) return;
      e.preventDefault();
      const offset = navbar.offsetHeight + 8;
      window.scrollTo({
        top: target.getBoundingClientRect().top + window.scrollY - offset,
        behavior: 'smooth'
      });
    });
  });

  /* ---- TESTIMONIALS SLIDER ---- */
  if (testiTrack) {
    const cards = testiTrack.querySelectorAll('.testi-card');
    const total = cards.length;
    let current = 0;
    let perView = getPerView();
    let autoTimer;

    function getPerView() {
      if (window.innerWidth <= 768) return 1;
      if (window.innerWidth <= 1024) return 2;
      return 3;
    }
    function maxIndex() { return Math.max(0, total - perView); }

    function buildDots() {
      if (!testiDotsWrap) return;
      testiDotsWrap.innerHTML = '';
      const count = maxIndex() + 1;
      for (let i = 0; i < count; i++) {
        const btn = document.createElement('button');
        btn.className = 'testi-dot' + (i === current ? ' active' : '');
        btn.setAttribute('aria-label', 'Slide ' + (i + 1));
        btn.addEventListener('click', () => { goTo(i); resetAuto(); });
        testiDotsWrap.appendChild(btn);
      }
    }

    function updateDots() {
      if (!testiDotsWrap) return;
      testiDotsWrap.querySelectorAll('.testi-dot').forEach((d, i) => {
        d.classList.toggle('active', i === current);
      });
    }

    function goTo(index) {
      current = Math.max(0, Math.min(index, maxIndex()));
      const cardW = cards[0].offsetWidth + 24;
      testiTrack.style.transform = `translateX(-${current * cardW}px)`;
      updateDots();
    }

    function resetAuto() {
      clearInterval(autoTimer);
      autoTimer = setInterval(() => {
        goTo(current >= maxIndex() ? 0 : current + 1);
      }, 4500);
    }

    if (testiPrev) testiPrev.addEventListener('click', () => { goTo(current - 1); resetAuto(); });
    if (testiNext) testiNext.addEventListener('click', () => { goTo(current + 1); resetAuto(); });

    // Touch swipe
    let touchStartX = 0;
    testiTrack.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
    testiTrack.addEventListener('touchend', e => {
      const diff = touchStartX - e.changedTouches[0].clientX;
      if (Math.abs(diff) > 40) {
        diff > 0 ? goTo(current + 1) : goTo(current - 1);
        resetAuto();
      }
    });

    window.addEventListener('resize', () => {
      perView = getPerView();
      current = Math.min(current, maxIndex());
      buildDots();
      goTo(current);
    });

    buildDots();
    goTo(0);
    resetAuto();
  }

  /* ---- SCROLL FADE IN ---- */
  const fadeTargets = document.querySelectorAll(
    '.benefit-card, .how-step, .testi-card, .use-card, .step-item, .dosage-box, .hero-text, .hero-product, .about-left, .about-right, .compare-col'
  );
  const styleTag = document.createElement('style');
  styleTag.textContent = `
    .fade-el{opacity:0;transform:translateY(22px);transition:opacity 0.55s ease,transform 0.55s ease}
    .fade-el.visible{opacity:1;transform:none}
    .benefit-card.fade-el:nth-child(2){transition-delay:0.07s}
    .benefit-card.fade-el:nth-child(3){transition-delay:0.14s}
    .benefit-card.fade-el:nth-child(4){transition-delay:0.21s}
    .benefit-card.fade-el:nth-child(5){transition-delay:0.28s}
    .benefit-card.fade-el:nth-child(6){transition-delay:0.35s}
    .use-card.fade-el:nth-child(2){transition-delay:0.08s}
    .use-card.fade-el:nth-child(3){transition-delay:0.16s}
    .use-card.fade-el:nth-child(4){transition-delay:0.24s}
    .use-card.fade-el:nth-child(5){transition-delay:0.32s}
    .use-card.fade-el:nth-child(6){transition-delay:0.40s}
    .how-step.fade-el:nth-child(1){transition-delay:0s}
    .how-step.fade-el:nth-child(2){transition-delay:0.1s}
    .how-step.fade-el:nth-child(3){transition-delay:0.2s}
    .how-step.fade-el:nth-child(4){transition-delay:0.3s}
    .step-item.fade-el:nth-child(2){transition-delay:0.07s}
    .step-item.fade-el:nth-child(3){transition-delay:0.14s}
    .step-item.fade-el:nth-child(4){transition-delay:0.21s}
    .step-item.fade-el:nth-child(5){transition-delay:0.28s}
  `;
  document.head.appendChild(styleTag);
  fadeTargets.forEach(el => el.classList.add('fade-el'));

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(e => {
        if (e.isIntersecting) {
          e.target.classList.add('visible');
          io.unobserve(e.target);
        }
      });
    }, { threshold: 0.08 });
    fadeTargets.forEach(el => io.observe(el));
  } else {
    fadeTargets.forEach(el => el.classList.add('visible'));
  }

  /* ---- COUNT-UP ANIMATION ---- */
  const countEls = document.querySelectorAll('[data-count]');
  if (countEls.length && 'IntersectionObserver' in window) {
    const countObs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        const target = parseInt(el.dataset.count, 10);
        const duration = 1600;
        const start = performance.now();
        function step(now) {
          const elapsed = now - start;
          const progress = Math.min(elapsed / duration, 1);
          const eased = 1 - Math.pow(1 - progress, 3);
          el.textContent = Math.round(eased * target);
          if (progress < 1) requestAnimationFrame(step);
        }
        requestAnimationFrame(step);
        countObs.unobserve(el);
      });
    }, { threshold: 0.5 });
    countEls.forEach(el => countObs.observe(el));
  }

  /* ---- HERO BOTTLE PARALLAX ---- */
  const heroBottle = document.getElementById('heroBottle');
  if (heroBottle) {
    window.addEventListener('scroll', () => {
      const sy = window.scrollY;
      if (sy < window.innerHeight) {
        heroBottle.style.transform = `translateY(${sy * 0.07}px)`;
      }
    }, { passive: true });
  }

  /* ---- ACTIVE NAV LINK ---- */
  const sections = document.querySelectorAll('section[id]');
  const navAnchors = document.querySelectorAll('.nav-links a[href^="#"]');
  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(sec => {
      if (window.scrollY >= sec.offsetTop - 100) current = sec.id;
    });
    navAnchors.forEach(a => {
      const isActive = a.getAttribute('href') === '#' + current;
      a.style.color = isActive ? 'var(--blue-bright)' : '';
    });
  }, { passive: true });

  /* ---- COMPARE LIST STAGGER ---- */
  const compareLists = document.querySelectorAll('.compare-col ul');
  if ('IntersectionObserver' in window) {
    const cObs = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const items = entry.target.querySelectorAll('li');
        items.forEach((li, i) => {
          li.style.opacity = '0';
          li.style.transform = 'translateX(-10px)';
          li.style.transition = `opacity 0.35s ease ${i * 0.055}s, transform 0.35s ease ${i * 0.055}s`;
          setTimeout(() => {
            li.style.opacity = '1';
            li.style.transform = 'none';
          }, 80 + i * 55);
        });
        cObs.unobserve(entry.target);
      });
    }, { threshold: 0.15 });
    compareLists.forEach(el => cObs.observe(el));
  }

})();
