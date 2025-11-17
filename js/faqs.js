/* ----------------------------------------------------------
   faqs.js — Cinematic accordion for UrbanEdge
   Full replacement file — paste to js/faqs.js
   ---------------------------------------------------------- */

document.addEventListener("DOMContentLoaded", () => {
  const faqItems = document.querySelectorAll(".faq-item");
  const questions = document.querySelectorAll(".faq-question");

  /* ---------- 1️⃣ Toggle FAQ open/close ---------- */
  questions.forEach((btn) => {
    btn.addEventListener("click", () => toggleFAQ(btn));
    btn.addEventListener("keypress", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        toggleFAQ(btn);
      }
    });
  });

  function toggleFAQ(button) {
    const parent = button.closest(".faq-item");
    const isOpen = parent.classList.contains("open");

    // close all
    faqItems.forEach((item) => {
      item.classList.remove("open");
      const q = item.querySelector(".faq-question");
      q.setAttribute("aria-expanded", "false");
    });

    // open selected if not already open
    if (!isOpen) {
      parent.classList.add("open");
      button.setAttribute("aria-expanded", "true");

      // smooth scroll to opened item (for mobile)
      setTimeout(() => {
        parent.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });
      }, 280);
    }
  }

  /* ---------- 2️⃣ Auto-Year for Footer ---------- */
  const yearEl = document.getElementById("yr-full");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  /* ---------- 3️⃣ Intersection Animation ---------- */
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.1 }
  );

  faqItems.forEach((item) => {
    item.classList.add("fade-up");
    observer.observe(item);
  });

  /* ---------- 4️⃣ Placeholder for Firebase Hook ---------- */
  // Later, when we connect the dashboard:
  // - We'll fetch FAQ entries dynamically from Firestore.
  // - Each FAQ will have an ID, question, and answer.
  // - This section will replace the static HTML generation.
});

