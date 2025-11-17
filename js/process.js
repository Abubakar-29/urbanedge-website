/* ----------------------------------------------------------
   process.js — Logic for the Process Page Hero
   ---------------------------------------------------------- */

document.addEventListener("DOMContentLoaded", () => {

  // =============== 1. HERO PARALLAX & LAZY-LOAD ===============
  const hero = document.getElementById("process-hero");
  const bg = hero ? hero.querySelector(".hero-bg") : null;

  if (bg && bg.dataset.src) {
    const img = new Image();
    img.src = bg.dataset.src;
    // On image load, set it as background and fade in hero
    img.onload = () => {
      bg.style.backgroundImage = `url('${bg.dataset.src}')`;
      hero.classList.add("visible");
    };
  } else if (hero) {
    // Fallback in case data-src isn't set, just show the hero
    hero.classList.add("visible");
  }

  // Parallax scroll effect
  window.addEventListener("scroll", () => {
    if (!hero || !bg) return;

    const scrollY = window.scrollY;
    const rect = hero.getBoundingClientRect();
    
    // Only apply effect when hero is in or near viewport
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      // Apply a subtle parallax effect (slower than home page)
      const parallax = scrollY * 0.2;
      bg.style.transform = `translateY(${parallax}px) scale(1.05)`;
    }
  }, { passive: true }); // Use passive listener for better scroll performance

  // Note: The .fade-up animations for the steps
  // are handled by the global js/main.js file.
  // This file is only for page-specific logic.

});
