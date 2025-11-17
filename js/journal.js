/* ----------------------------------------------------------
   journal.js — Apple-Newsroom style logic
   (Optimized: Removed redundant fade-up and footer-year code)
   ---------------------------------------------------------- */

document.addEventListener("DOMContentLoaded", () => {

  /* ---------- 1️⃣ Lazy-load card media ---------- */
  const cards = document.querySelectorAll(".article-card");
  cards.forEach(card => {
    const imgEl = card.querySelector(".card-media");
    const src = card.dataset.src;
    if (src && imgEl) { // Added defensive check
      const img = new Image();
      img.src = src;
      img.onload = () => {
        imgEl.style.backgroundImage = `url('${src}')`;
        imgEl.classList.add("loaded");
      };
    }
  });

  /* ---------- 2️⃣ Fade-up on scroll ---------- */
  // Removed. This is now handled globally by js/main.js.

  /* ---------- 3️⃣ Modal Preview ---------- */
  const modal = document.getElementById("journal-modal");
  
  // Defensive check if modal exists on this page
  if (!modal || cards.length === 0) {
    return;
  }

  const backdrop = modal.querySelector(".journal-modal-backdrop");
  const modalMedia = modal.querySelector(".modal-media");
  const modalTitle = modal.querySelector("#modal-title");
  const modalExcerpt = modal.querySelector("#modal-excerpt");
  const readFull = modal.querySelector("#read-full");
  const closeBtn = modal.querySelector(".modal-close");

  // Check for all required modal elements
  if (!backdrop || !modalMedia || !modalTitle || !modalExcerpt || !readFull || !closeBtn) {
    console.warn("Journal modal is missing required elements.");
    return;
  }

  let lastFocused = null;

  const openModal = (card) => {
    if (!card) return;
    lastFocused = document.activeElement; // Save focus for accessibility

    const src = card.dataset.src;
    const title = card.dataset.title;
    const excerpt = card.dataset.excerpt;

    modalMedia.style.backgroundImage = `url('${src}')`;
    modalTitle.textContent = title;
    modalExcerpt.textContent = excerpt;

    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
    closeBtn.focus(); // Move focus to the close button
  };

  const closeModal = () => {
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    if (lastFocused) lastFocused.focus(); // Return focus to the element that opened the modal
  };

  // card click / enter open modal
  cards.forEach(card => {
    card.addEventListener("click", () => openModal(card));
    card.addEventListener("keypress", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openModal(card);
      }
    });
  });

  // close modal events
  backdrop.addEventListener("click", closeModal);
  closeBtn.addEventListener("click", closeModal);
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.getAttribute("aria-hidden") === "false") {
      closeModal();
    }
  });

  /* ---------- 4️⃣ Filters ---------- */
  const filterBtns = document.querySelectorAll(".filter-btn");
  filterBtns.forEach(btn => {
    btn.addEventListener("click", () => {
      filterBtns.forEach(b => b.setAttribute("aria-pressed", "false"));
      btn.setAttribute("aria-pressed", "true");

      const filter = btn.dataset.filter;
      cards.forEach(card => {
        if (!filter || filter === "all" || btn.id === "filter-all") {
          card.style.display = ""; // Show all
        } else {
          const tags = (card.dataset.tags || "").toLowerCase();
          card.style.display = tags.includes(filter.toLowerCase()) ? "" : "none"; // Show if tag matches
        }
      });
    });
  });

  /* ---------- 5️⃣ Search ---------- */
  const searchInput = document.getElementById("journal-search");
  if (searchInput) {
    searchInput.addEventListener("input", () => {
      const q = searchInput.value.toLowerCase();
      cards.forEach(card => {
        const title = (card.dataset.title || "").toLowerCase();
        const excerpt = (card.dataset.excerpt || "").toLowerCase();
        const visible = title.includes(q) || excerpt.includes(q);
        card.style.display = visible ? "" : "none";
      });
    });
  }

  /* ---------- 6️⃣ "Load More" (placeholder for Firebase pagination) ---------- */
  const loadMoreBtn = document.getElementById("load-more");
  if (loadMoreBtn) {
    loadMoreBtn.addEventListener("click", () => {
      // Placeholder logic — will connect to Firebase cursor later
      loadMoreBtn.textContent = "Loading more stories...";
      setTimeout(() => {
        loadMoreBtn.textContent = "All stories loaded";
        loadMoreBtn.disabled = true;
      }, 800);
    });
  }

  /* ---------- 7️⃣ Accessibility focus trap ---------- */
  modal.addEventListener("keydown", (e) => {
    if (e.key !== "Tab" || modal.getAttribute("aria-hidden") === "true") return;
    const focusables = modal.querySelectorAll("a,button,[tabindex]:not([tabindex='-1'])");
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  });

  /* ---------- 8️⃣ Auto-year update ---------- */
  // Removed. This is now handled globally by js/main.js.

});
