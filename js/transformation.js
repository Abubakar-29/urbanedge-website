/* ----------------------------------------------------------
   transformation.js — Cinematic Dark Transformations Page
   ---------------------------------------------------------- */

document.addEventListener("DOMContentLoaded", () => {

  // =============== 1. HERO PARALLAX ===============
  const hero = document.querySelector(".dark-hero");
  const bg = document.querySelector(".hero-bg");
  const light = document.querySelector(".hero-light");

  if (bg && bg.dataset.src) {
    const img = new Image();
    img.src = bg.dataset.src;
    img.onload = () => {
      bg.style.backgroundImage = `url('${bg.dataset.src}')`;
      hero.classList.add("visible");
    };
  }

  window.addEventListener("scroll", () => {
    if (!hero) return;
    const scrollY = window.scrollY;
    const rect = hero.getBoundingClientRect();
    const parallax = scrollY * 0.3;

    if (rect.top < window.innerHeight && rect.bottom > 0) {
      bg.style.transform = `translateY(${parallax * 0.4}px) scale(1.05)`;
      if (light) {
        light.style.transform = `translate(${parallax * 0.05}px, ${-parallax * 0.05}px)`;
      }
    }
  });

  // =============== 2. FADE-UP ANIMATIONS ===============
  const revealEls = document.querySelectorAll(".fade-up, .transform-card");
  const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        fadeObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealEls.forEach(el => fadeObserver.observe(el));

  // =============== 3. BEFORE/AFTER SLIDER LOGIC ===============
  const sliders = document.querySelectorAll(".before-after");

  sliders.forEach(slider => {
    const beforeEl = slider.querySelector(".ba-image.before");
    const afterEl = slider.querySelector(".ba-image.after");
    const handle = slider.querySelector(".ba-handle");

    const beforeSrc = slider.dataset.before;
    const afterSrc = slider.dataset.after;

    // Lazy load images
    const imgBefore = new Image();
    const imgAfter = new Image();

    imgBefore.src = beforeSrc;
    imgAfter.src = afterSrc;
    imgBefore.onload = () => beforeEl.style.backgroundImage = `url('${beforeSrc}')`;
    imgAfter.onload = () => afterEl.style.backgroundImage = `url('${afterSrc}')`;

    // State
    let isDragging = false;
    let startX = 0;
    let handleX = 0;

    const updateSlider = (x) => {
      const rect = slider.getBoundingClientRect();
      const offsetX = Math.max(0, Math.min(x - rect.left, rect.width));
      const percent = (offsetX / rect.width) * 100;
      afterEl.style.clipPath = `inset(0 ${100 - percent}% 0 0)`;
      handle.style.left = `${percent}%`;
      handle.setAttribute("aria-valuenow", Math.round(percent));
    };

    const onDragStart = (e) => {
      isDragging = true;
      slider.classList.add("dragging");
      startX = e.type.startsWith("touch") ? e.touches[0].clientX : e.clientX;
    };

    const onDragMove = (e) => {
      if (!isDragging) return;
      const currentX = e.type.startsWith("touch") ? e.touches[0].clientX : e.clientX;
      updateSlider(currentX);
    };

    const onDragEnd = () => {
      if (!isDragging) return;
      isDragging = false;
      slider.classList.remove("dragging");
    };

    // Desktop events
    handle.addEventListener("mousedown", onDragStart);
    window.addEventListener("mousemove", onDragMove);
    window.addEventListener("mouseup", onDragEnd);

    // Touch events
    handle.addEventListener("touchstart", onDragStart, { passive: true });
    window.addEventListener("touchmove", onDragMove, { passive: true });
    window.addEventListener("touchend", onDragEnd);

    // Keyboard accessibility
    handle.addEventListener("keydown", (e) => {
      let currentPercent = parseInt(handle.getAttribute("aria-valuenow")) || 50;
      if (e.key === "ArrowLeft") currentPercent = Math.max(0, currentPercent - 5);
      if (e.key === "ArrowRight") currentPercent = Math.min(100, currentPercent + 5);
      const rect = slider.getBoundingClientRect();
      const x = rect.left + (rect.width * (currentPercent / 100));
      updateSlider(x);
    });

    // Initialize midpoint
    requestAnimationFrame(() => updateSlider(slider.offsetLeft + slider.offsetWidth / 2));
  });

  // =============== 4. CTA BUTTON HOVER LIGHT REFLECTION ===============
  const ctaBtn = document.querySelector(".transforms-cta .cta-btn");
  if (ctaBtn) {
    ctaBtn.addEventListener("mousemove", (e) => {
      const rect = ctaBtn.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      ctaBtn.style.background = `radial-gradient(circle at ${x}px ${y}px, #ff7c1a, #ff6600)`;
    });
    ctaBtn.addEventListener("mouseleave", () => {
      ctaBtn.style.background = "#ff6600";
    });
  }

  // =============== 5. FOOTER YEAR AUTO UPDATE ===============
  const yearSpan = document.getElementById("yr-full");
  if (yearSpan) yearSpan.textContent = new Date().getFullYear();
});
