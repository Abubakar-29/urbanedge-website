/* ================================
   main.js — Global site script
   (Replace the entire existing main.js with this file)
   Responsibilities:
   - Auto-highlight nav links
   - Global fade-up on scroll (IntersectionObserver)
   - Simple Showcase modal (image + video support)
   - Light Process cinematic hooks (step activation on scroll)
   - Footer year auto-update
   - Defensive, modular, documented
   NOTE: Transformation slider code intentionally omitted (moved to js/transformation.js)
   ================================ */

(function () {
  'use strict';

  /* --------------------------
     Utilities
     -------------------------- */
  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));
  const isNodeList = (v) => NodeList.prototype.isPrototypeOf(v) || Array.isArray(v);

  // Simple throttler
  function throttle(fn, wait = 100) {
    let last = 0;
    return function (...args) {
      const now = Date.now();
      if (now - last >= wait) {
        last = now;
        fn.apply(this, args);
      }
    };
  }

  /* --------------------------
     Auto-highlight nav link
     -------------------------- */
  function autoHighlightNav() {
    try {
      const links = $$('.nav-link');
      if (!links.length) return;
      const current = window.location.pathname.split('/').pop() || 'index.html';
      links.forEach(link => {
        const href = link.getAttribute('href') || '';
        // handle index vs root
        if (href === current || (current === '' && href === 'index.html')) {
          link.classList.add('active');
        } else {
          link.classList.remove('active');
        }
      });
    } catch (e) {
      console.warn('autoHighlightNav error', e);
    }
  }

  /* --------------------------
     Fade-up global animation
     Uses IntersectionObserver for .fade-up elements
     -------------------------- */
  function initGlobalFadeUp() {
    const animated = $$('.fade-up');
    if (!animated.length) return;

    const obsOptions = {
      root: null,
      rootMargin: '0px 0px -8% 0px',
      threshold: 0.08
    };

    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const el = entry.target;
        if (entry.isIntersecting) {
          el.classList.add('visible');
        } else {
          // animate again when user scrolls up
          el.classList.remove('visible');
        }
      });
    }, obsOptions);

    animated.forEach(el => io.observe(el));
  }

  /* --------------------------
     Footer year auto-update
     -------------------------- */
  function updateFooterYear() {
    try {
      const yEl = $('#yr-full');
      if (!yEl) return;
      yEl.textContent = new Date().getFullYear();
    } catch (e) {
      console.warn('updateFooterYear error', e);
    }
  }

  /* --------------------------
     Showcase modal gallery (simple)
     - Supports images and short <video> elements via data-type
     - Expect HTML structure:
         <div class="showcase-grid"> ... <a class="showcase-card" data-type="image|video" data-src="..."> ... </a> ... </div>
       And a modal container with classes/ids below (created in HTML)
     -------------------------- */
  function initShowcaseModal() {
    const grid = $('.showcase-grid');
    const modal = $('#showcaseModal');
    if (!grid || !modal) return;

    const modalPanel = $('.modal-panel', modal) || modal.querySelector('.modal-panel') || modal;
    const modalMedia = $('.modal-media', modal);
    const modalTitle = $('#showcaseTitle', modal) || modal.querySelector('#showcaseTitle');
    const modalDesc = $('#showcaseDesc', modal);

    const closeButtons = $$('.modal-close', modal);
    const overlay = modal.querySelector('.modal-overlay') || modal;

    let items = $$('.showcase-card', grid);
    if (!items.length) return;

    // build an array of items with src & type
    const gallery = items.map(el => ({
      el,
      src: el.dataset.src || el.getAttribute('href') || '',
      type: el.dataset.type || (el.dataset.src && el.dataset.src.endsWith('.mp4') ? 'video' : 'image'),
      title: el.dataset.title || '',
      desc: el.dataset.desc || ''
    }));

    let current = 0;

    function renderItem(idx) {
      const item = gallery[idx];
      if (!item) return;
      // clear media area
      if (!modalMedia) return;
      modalMedia.innerHTML = ''; // remove previous media
      if (item.type === 'video') {
        const vid = document.createElement('video');
        vid.src = item.src;
        vid.controls = true;
        vid.autoplay = true;
        vid.playsInline = true;
        vid.style.maxWidth = '100%';
        vid.style.borderRadius = '12px';
        modalMedia.appendChild(vid);
      } else {
        const img = document.createElement('img');
        img.src = item.src;
        img.alt = item.title || 'Showcase image';
        img.style.width = '100%';
        img.style.borderRadius = '12px';
        modalMedia.appendChild(img);
      }
      if (modalTitle) modalTitle.textContent = item.title || '';
      if (modalDesc) modalDesc.textContent = item.desc || '';
      current = idx;
    }

    // open modal
    function openModal(idx) {
      renderItem(idx);
      document.body.style.overflow = 'hidden';
      modal.classList.remove('hidden');
      modal.setAttribute('aria-hidden', 'false');
      // add backdrop blur by toggling a class (CSS should define it)
      document.body.classList.add('blurred-bg');
      // focus modal for accessibility
      modalPanel && modalPanel.focus && modalPanel.focus();
    }

    function closeModal() {
      modal.classList.add('hidden');
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      document.body.classList.remove('blurred-bg');
      // unload media to free memory
      if (modalMedia) modalMedia.innerHTML = '';
    }

    // attach click handlers to cards
    items.forEach((cardEl, i) => {
      cardEl.addEventListener('click', (ev) => {
        ev.preventDefault();
        openModal(i);
      });
    });

    // close overlay/click outside
    overlay.addEventListener('click', (ev) => {
      if (ev.target === overlay || ev.target.classList.contains('modal-overlay')) {
        closeModal();
      }
    });

    // close buttons
    closeButtons.forEach(btn => btn.addEventListener('click', closeModal));

    // keyboard escape
    document.addEventListener('keydown', (e) => {
      if ((e.key === 'Escape' || e.key === 'Esc') && !modal.classList.contains('hidden')) {
        closeModal();
      }
    });

    // optional prev/next if controls exist
    const prevBtn = $('#showcasePrev', modal);
    const nextBtn = $('#showcaseNext', modal);
    if (prevBtn) prevBtn.addEventListener('click', () => renderItem((current - 1 + gallery.length) % gallery.length));
    if (nextBtn) nextBtn.addEventListener('click', () => renderItem((current + 1) % gallery.length));
  }

  /* --------------------------
     Process cinematic hooks (lightweight)
     - Activates .active on elements with .process-step when in view
     - The heavy cinematic engine should live page-scoped in process.js later
     -------------------------- */
  function initProcessCinematic() {
    const steps = $$('.process-step');
    if (!steps.length) return;

    const io = new IntersectionObserver((entries) => {
      entries.forEach(ent => {
        if (ent.isIntersecting) {
          ent.target.classList.add('active');
        } else {
          ent.target.classList.remove('active');
        }
      });
    }, { root: null, threshold: 0.25 });

    steps.forEach(s => io.observe(s));
  }

  /* --------------------------
     Simple DOM-ready initializer
     -------------------------- */
  function initAll() {
    autoHighlightNav();
    initGlobalFadeUp();
    updateFooterYear();
    initShowcaseModal();
    initProcessCinematic();
    // Note: transformation sliders removed from main.js;
    // they are initialized from js/transformation.js (page-scoped)
  }

  // Safe start on DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }

  /* --------------------------
     Public debug hooks (only in dev mode)
     -------------------------- */
  window.__urbanEdge = window.__urbanEdge || {};
  window.__urbanEdge.initAll = initAll;

})();

    // Footer fade-up animation
(function(){
  const footerItems = document.querySelectorAll('.fade-up');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('visible');
    });
  }, { threshold: 0.1 });
  footerItems.forEach(el => observer.observe(el));
})();
