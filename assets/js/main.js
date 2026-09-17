/* ============================================================
   Malena Bustos — Abogada · Landing page
   JS sin dependencias: navegación, métricas animadas,
   carrusel de testimonios y animaciones de entrada.
   ============================================================ */
(function () {
  'use strict';

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- 1. Menú móvil ---------- */
  (function initNav() {
    var toggle = document.getElementById('nav-toggle');
    var menu = document.getElementById('nav-menu');
    if (!toggle || !menu) return;

    function close() {
      menu.classList.remove('is-open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Abrir menú de navegación');
    }

    toggle.addEventListener('click', function () {
      var open = menu.classList.toggle('is-open');
      toggle.setAttribute('aria-expanded', String(open));
      toggle.setAttribute('aria-label', open ? 'Cerrar menú de navegación' : 'Abrir menú de navegación');
    });

    menu.addEventListener('click', function (e) {
      if (e.target.closest('a')) close();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && menu.classList.contains('is-open')) {
        close();
        toggle.focus();
      }
    });
  })();

  /* ---------- 2. Sombra del header al hacer scroll ---------- */
  (function initHeaderState() {
    var header = document.getElementById('site-header');
    if (!header) return;
    var onScroll = function () {
      header.classList.toggle('is-stuck', window.scrollY > 8);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
  })();

  /* ---------- 3. Enlace activo según la sección visible ---------- */
  (function initScrollSpy() {
    var links = Array.prototype.slice.call(document.querySelectorAll('.nav a[href^="#"]'));
    if (!links.length || !('IntersectionObserver' in window)) return;

    var map = {};
    links.forEach(function (link) {
      var section = document.querySelector(link.getAttribute('href'));
      if (section) map[section.id] = link;
    });

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        links.forEach(function (l) { l.classList.remove('is-active'); });
        var active = map[entry.target.id];
        if (active) active.classList.add('is-active');
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });

    Object.keys(map).forEach(function (id) {
      observer.observe(document.getElementById(id));
    });
  })();

  /* ---------- 4. Gráficos circulares + conteo de métricas ---------- */
  (function initDonuts() {
    var donuts = Array.prototype.slice.call(document.querySelectorAll('.donut'));
    if (!donuts.length) return;

    var CIRCUMFERENCE = 2 * Math.PI * 52; // r = 52 en el viewBox del SVG

    function render(donut) {
      var ring = donut.querySelector('.donut-ring');
      var output = donut.querySelector('.donut-value');
      var target = parseFloat(donut.dataset.value) || 0;
      var suffix = donut.dataset.suffix || '';
      var progress = Math.max(0, Math.min(100, parseFloat(donut.dataset.progress) || 0));

      if (ring) {
        ring.style.strokeDasharray = CIRCUMFERENCE;
        ring.style.strokeDashoffset = CIRCUMFERENCE * (1 - progress / 100);
      }

      if (!output) return;

      if (reduceMotion) {
        output.textContent = target + suffix;
        return;
      }

      var duration = 1400;
      var start = null;
      function step(now) {
        if (start === null) start = now;
        var t = Math.min((now - start) / duration, 1);
        var eased = 1 - Math.pow(1 - t, 3); // easeOutCubic
        output.textContent = Math.round(target * eased) + suffix;
        if (t < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    }

    if (!('IntersectionObserver' in window)) {
      donuts.forEach(render);
      return;
    }

    var observer = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        render(entry.target);
        obs.unobserve(entry.target);
      });
    }, { threshold: 0.45 });

    donuts.forEach(function (d) { observer.observe(d); });
  })();

  /* ---------- 5. Carrusel de testimonios ---------- */
  (function initSlider() {
    var slider = document.querySelector('[data-slider]');
    if (!slider) return;

    var track = slider.querySelector('[data-slider-track]');
    var slides = Array.prototype.slice.call(track.children);
    var dotsWrap = slider.querySelector('[data-slider-dots]');
    var prev = slider.querySelector('[data-slider-prev]');
    var next = slider.querySelector('[data-slider-next]');
    if (slides.length < 2) return;

    var index = 0;
    var timer = null;
    var INTERVAL = 7000;

    var dots = slides.map(function (_, i) {
      var dot = document.createElement('button');
      dot.type = 'button';
      dot.setAttribute('aria-label', 'Ver testimonio ' + (i + 1) + ' de ' + slides.length);
      dot.addEventListener('click', function () { goTo(i); restart(); });
      dotsWrap.appendChild(dot);
      return dot;
    });

    function goTo(i) {
      index = (i + slides.length) % slides.length;
      track.style.transform = 'translateX(' + (-index * 100) + '%)';
      dots.forEach(function (d, n) {
        d.classList.toggle('is-active', n === index);
        d.setAttribute('aria-current', n === index ? 'true' : 'false');
      });
      slides.forEach(function (s, n) {
        s.setAttribute('aria-hidden', n === index ? 'false' : 'true');
        // Evita que el foco caiga en una diapositiva fuera de pantalla.
        s.querySelectorAll('a, button').forEach(function (el) {
          if (n === index) el.removeAttribute('tabindex');
          else el.setAttribute('tabindex', '-1');
        });
      });
    }

    function start() {
      if (reduceMotion || timer) return;
      timer = setInterval(function () { goTo(index + 1); }, INTERVAL);
    }
    function stop() { clearInterval(timer); timer = null; }
    function restart() { stop(); start(); }

    if (prev) prev.addEventListener('click', function () { goTo(index - 1); restart(); });
    if (next) next.addEventListener('click', function () { goTo(index + 1); restart(); });

    slider.addEventListener('mouseenter', stop);
    slider.addEventListener('mouseleave', start);
    slider.addEventListener('focusin', stop);
    slider.addEventListener('focusout', start);

    slider.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') { goTo(index - 1); restart(); }
      if (e.key === 'ArrowRight') { goTo(index + 1); restart(); }
    });

    // Gesto táctil
    var startX = 0;
    var deltaX = 0;
    slider.addEventListener('touchstart', function (e) {
      startX = e.touches[0].clientX;
      deltaX = 0;
      stop();
    }, { passive: true });
    slider.addEventListener('touchmove', function (e) {
      deltaX = e.touches[0].clientX - startX;
    }, { passive: true });
    slider.addEventListener('touchend', function () {
      if (Math.abs(deltaX) > 45) goTo(index + (deltaX < 0 ? 1 : -1));
      start();
    });

    // Pausa el autoplay cuando la pestaña no está visible.
    document.addEventListener('visibilitychange', function () {
      if (document.hidden) stop(); else start();
    });

    goTo(0);
    start();
  })();

  /* ---------- 6. Aparición suave de bloques al hacer scroll ---------- */
  (function initReveal() {
    if (reduceMotion || !('IntersectionObserver' in window)) return;

    var selector = [
      '.hero-text', '.hero-media', '.timeline li', '.valores-text',
      '.metric', '.testimonios .container > *', '.faq-list', '.contact-cards li', '.contact-meta'
    ].join(',');

    var items = Array.prototype.slice.call(document.querySelectorAll(selector));
    if (!items.length) return;

    items.forEach(function (el, i) {
      el.classList.add('reveal');
      el.style.transitionDelay = (Math.min(i % 4, 3) * 80) + 'ms';
    });

    var observer = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        obs.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    items.forEach(function (el) { observer.observe(el); });
  })();

  /* ---------- 7. Año dinámico en el pie (si existe el marcador) ---------- */
  var yearSlot = document.querySelector('[data-year]');
  if (yearSlot) yearSlot.textContent = new Date().getFullYear();
})();
