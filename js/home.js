/* ----------------------------------------------------------
   home.js — Cinematic motion logic for UrbanEdge homepage
   ---------------------------------------------------------- */

document.addEventListener("DOMContentLoaded", () => {
  // =============== 1. HERO PARALLAX BACKGROUND ===============
  const hero = document.querySelector(".hero");
  const bg = document.querySelector(".hero-bg");
  const lightFlare = document.querySelector(".light-flare");
  let lastScroll = 0;

  // Lazy-load hero image for performance
  if (bg && bg.dataset.src) {
    const img = new Image();
    img.src = bg.dataset.src;
    img.onload = () => {
      bg.style.backgroundImage = `url('${bg.dataset.src}')`;
      hero.classList.add("visible");
    };
  }

  // Parallax scroll effect
  window.addEventListener("scroll", () => {
    const scrollY = window.scrollY;
    if (!hero) return;

    // only when hero is visible
    const rect = hero.getBoundingClientRect();
    const offset = rect.top;
    if (offset < window.innerHeight && offset > -rect.height) {
      const parallax = scrollY * 0.3;
      bg.style.transform = `translateY(${parallax}px) scale(1.05)`;
      lightFlare.style.transform = `translate(${parallax * 0.05}px, ${parallax * -0.05}px)`;
    }
    lastScroll = scrollY;
  });

  // =============== 2. FADE-UP ANIMATIONS ===============
  const revealEls = document.querySelectorAll(".fade-up, .card, .project-card");
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealEls.forEach(el => observer.observe(el));

  // =============== 3. HERO GLASS MOTION ON SCROLL ===============
  const glassLayers = document.querySelectorAll(".glass-layer");
  window.addEventListener("scroll", () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop;
    glassLayers.forEach((layer, i) => {
      const move = (scrollTop * 0.02) * (i % 2 === 0 ? 1 : -1);
      layer.style.transform = `translateY(${move}px) rotate(${5 + i}deg)`;
    });
  });

  // =============== 4. SMOOTH SCROLL HINT BUTTON ===============
  const scrollHint = document.querySelector(".scroll-hint");
  if (scrollHint) {
    scrollHint.addEventListener("click", () => {
      window.scrollTo({
        top: window.innerHeight,
        behavior: "smooth"
      });
    });
  }

  // =============== 5. YEAR AUTO-UPDATE IN FOOTER ===============
  const yearSpan = document.getElementById("yr-full");
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
  }

  // =============== 6. ACCESSIBILITY: TAB FOCUS FOR LINKS ===============
  document.querySelectorAll("a, button").forEach(el => {
    el.addEventListener("keyup", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        el.click();
      }
    });
  });

  // =============== 7. MOBILE PARALLAX DAMPENING ===============
  const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
  if (isMobile) {
    window.addEventListener("scroll", () => {
      // Slightly reduce parallax intensity for smoothness
      const y = window.scrollY * 0.15;
      bg.style.transform = `translateY(${y}px) scale(1.03)`;
    }, { passive: true });
  }

  // =============== 8. WINDOW RESIZE OPTIMIZATION ===============
  let resizeTimer;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      // reset parallax transforms when viewport changes
      bg.style.transform = "translateY(0) scale(1.1)";
      lightFlare.style.transform = "translate(0,0)";
    }, 150);
  });

  // =============== 9. SMOOTH REVEAL OF HERO ON LOAD ===============
  window.addEventListener("load", () => {
    hero.classList.add("visible");
  });
});

