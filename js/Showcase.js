/* ----------------------------------------------------------
   showcase.js — Cinematic Gallery Logic for UrbanEdge
   (Optimized: Removed redundant fade-up and footer-year code)
   ---------------------------------------------------------- */

document.addEventListener("DOMContentLoaded", () => {

  // =============== 1. HERO PARALLAX ===============
  const hero = document.querySelector(".dark-hero");
  const bg = document.querySelector(".hero-bg");

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
      bg.style.transform = `translateY(${parallax * 0.3}px) scale(1.05)`;
    }
  }, { passive: true }); // Added passive listener for scroll performance

  // =============== 2. FADE-UP ANIMATIONS ===============
  // Removed. This is now handled globally by js/main.js
  // to prevent duplicate IntersectionObservers.

  // =============== 3. SHOWCASE GRID / MODAL LOGIC ===============
  const cards = document.querySelectorAll(".showcase-card");
  const modal = document.getElementById("showcase-modal");
  
  // Defensive check if modal exists on this page
  if (!modal || cards.length === 0) {
    return;
  }

  const modalMedia = modal.querySelector(".modal-media");
  const modalTitle = modal.querySelector(".modal-title");
  const modalTags = modal.querySelector(".modal-tags");
  const btnClose = modal.querySelector(".modal-close");
  const btnPrev = modal.querySelector(".modal-prev");
  const btnNext = modal.querySelector(".modal-next");

  let currentIndex = 0;

  // Load card thumbnails lazily
  cards.forEach(card => {
    const src = card.dataset.src;
    const thumb = card.querySelector(".showcase-thumb");
    if (!src || !thumb) return;

    const img = new Image();
    img.src = src;
    img.onload = () => thumb.style.backgroundImage = `url('${src}')`;
  });

  const openModal = (index) => {
    const card = cards[index];
    if (!card) return;

    const type = card.dataset.type;
    const src = card.dataset.src;
    const title = card.dataset.title;
    const tags = card.dataset.tags;

    modalMedia.innerHTML = ""; // Clear previous media

    if (type === "video") {
      const video = document.createElement("video");
      video.src = src;
      video.controls = true;
      video.autoplay = true;
      video.loop = true;
      video.playsInline = true; // Important for mobile
      modalMedia.appendChild(video);
    } else {
      const img = document.createElement("img");
      img.src = src;
      img.alt = title || "Showcase Image"; // Add alt text
      modalMedia.appendChild(img);
    }

    modalTitle.textContent = title;
    modalTags.textContent = tags;
    modal.setAttribute("aria-hidden", "false");
    modal.classList.add("active");
    currentIndex = index;
    document.body.style.overflow = "hidden"; // Prevent background scroll
  };

  const closeModal = () => {
    modal.classList.remove("active");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = ""; // Restore scroll
    
    // Stop any playing media
    const video = modalMedia.querySelector("video");
    if (video) {
      video.pause();
    }
    // Delay clearing media to allow for fade-out animation
    setTimeout(() => modalMedia.innerHTML = "", 400);
  };

  const nextProject = () => openModal((currentIndex + 1) % cards.length);
  const prevProject = () => openModal((currentIndex - 1 + cards.length) % cards.length);

  cards.forEach((card, index) => card.addEventListener("click", () => openModal(index)));
  btnClose.addEventListener("click", closeModal);
  btnNext.addEventListener("click", nextProject);
  btnPrev.addEventListener("click", prevProject);

  // Close modal by clicking outside content (on the overlay itself)
  modal.addEventListener("click", (e) => {
    if (e.target === modal) closeModal();
  });

  // Keyboard controls for accessibility
  window.addEventListener("keydown", (e) => {
    if (!modal.classList.contains("active")) return;
    if (e.key === "Escape") closeModal();
    if (e.key === "ArrowRight") nextProject();
    if (e.key === "ArrowLeft") prevProject();
  });

  // =============== 4. FOOTER YEAR UPDATE ===============
  // Removed. This is now handled globally by js/main.js.

  // =============== 5. ACCESSIBILITY FOCUS ===============
  // This is good practice, but js/main.js should handle global listeners.
  // If this is meant to be global, it should be in main.js.
  // If it's page-specific, it's fine, but let's assume main.js handles globals.
});

