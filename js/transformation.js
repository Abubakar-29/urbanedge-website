/* ----------------------------------------------------------
   transformation.js — Cinematic Dark Transformations Page
   (Optimized: Removed redundant fade-up and footer-year code)
   ---------------------------------------------------------- */

document.addEventListener("DOMContentLoaded", () => {

  // =============== 1. HERO PARALLAX ===============
  const hero = document.querySelector(".dark-hero");
  const bg = hero ? hero.querySelector(".hero-bg") : null;
  const light = hero ? hero.querySelector(".hero-light") : null;

  if (bg && bg.dataset.src) {
    const img = new Image();
    img.src = bg.dataset.src;
    img.onload = () => {
      bg.style.backgroundImage = `url('${bg.dataset.src}')`;
      if(hero) hero.classList.add("visible");
    };
  } else if (hero) {
    hero.classList.add("visible");
  }

  window.addEventListener("scroll", () => {
    if (!hero || !bg) return;
    const scrollY = window.scrollY;
    const rect = hero.getBoundingClientRect();
    const parallax = scrollY * 0.3;

    if (rect.top < window.innerHeight && rect.bottom > 0) {
      bg.style.transform = `translateY(${parallax * 0.4}px) scale(1.05)`;
      if (light) {
        light.style.transform = `translate(${parallax * 0.05}px, ${-parallax * 0.05}px)`;
      }
    }
  }, { passive: true }); // Added passive listener

  // =============== 2. FADE-UP ANIMATIONS ===============
  // Removed. This is now handled globally by js/main.js.

  // =============== 3. BEFORE/AFTER SLIDER LOGIC ===============
  const sliders = document.querySelectorAll(".before-after");

  sliders.forEach(slider => {
    const beforeEl = slider.querySelector(".ba-image.before");
    const afterEl = slider.querySelector(".ba-image.after");
    const handle = slider.querySelector(".ba-handle");

    // Defensive check
    if (!beforeEl || !afterEl || !handle) {
      return;
    }

    const beforeSrc = slider.dataset.before;
    const afterSrc = slider.dataset.after;

    // Lazy load images
    if(beforeSrc) {
      const imgBefore = new Image();
      imgBefore.src = beforeSrc;
      imgBefore.onload = () => beforeEl.style.backgroundImage = `url('${beforeSrc}')`;
    }
    
    if(afterSrc) {
      const imgAfter = new Image();
      imgAfter.src = afterSrc;
      imgAfter.onload = () => afterEl.style.backgroundImage = `url('${afterSrc}')`;
    }

    // State
    let isDragging = false;

    const updateSlider = (x) => {
      const rect = slider.getBoundingClientRect();
      // Calculate offset from the slider's left edge
      const offsetX = Math.max(0, Math.min(x - rect.left, rect.width));
      const percent = (offsetX / rect.width) * 100;
      
      afterEl.style.clipPath = `inset(0 ${100 - percent}% 0 0)`;
      handle.style.left = `${percent}%`;
      handle.setAttribute("aria-valuenow", String(Math.round(percent)));
    };

    const onDragStart = (e) => {
      e.preventDefault(); // Prevent text selection
      isDragging = true;
      slider.classList.add("dragging");
    };

    const onDragMove = (e) => {
      if (!isDragging) return;
      // Use clientX which is standard for mouse/touch
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
    window.addEventListener("mouseleave", onDragEnd); // Handle mouse leaving window

    // Touch events
    handle.addEventListener("touchstart", onDragStart, { passive: false }); // Use false to allow preventDefault
    window.addEventListener("touchmove", onDragMove, { passive: true }); // Move can be passive
    window.addEventListener("touchend", onDragEnd);

    // Keyboard accessibility
    handle.addEventListener("keydown", (e) => {
      let currentPercent = parseInt(handle.getAttribute("aria-valuenow") || "50", 10);
      let newPercent = currentPercent;

      if (e.key === "ArrowLeft") {
        newPercent = Math.max(0, currentPercent - 5);
      } else if (e.key === "ArrowRight") {
        newPercent = Math.min(100, currentPercent + 5);
      } else if (e.key === "Home") {
        newPercent = 0;
      } else if (e.key === "End") {
        newPercent = 100;
      }

      if (newPercent !== currentPercent) {
        const rect = slider.getBoundingClientRect();
        const x = rect.left + (rect.width * (newPercent / 100));
        updateSlider(x);
      }
    });

    // Initialize at midpoint
    // Use requestAnimationFrame to ensure layout is calculated
    requestAnimationFrame(() => {
        const rect = slider.getBoundingClientRect();
        if(rect.width > 0) {
            updateSlider(rect.left + rect.width / 2);
        }
    });
  });

  // =============== 4. CTA BUTTON HOVER LIGHT REFLECTION ===============
  const ctaBtn = document.querySelector(".transforms-cta-section .cta-btn");
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
  // Removed. This is now handled globally by js/main.js.
});
