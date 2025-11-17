/* ----------------------------------------------------------
   contact.js — UrbanEdge Contact Page Logic
   Full replacement file — paste into js/contact.js
   ---------------------------------------------------------- */

document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contact-form");
  const statusEl = document.getElementById("form-status");
  const submitBtn = document.getElementById("submit-btn");
  const yearEl = document.getElementById("yr-full");

  // Set dynamic year
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Smooth fade-up animation observer
  const fadeObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        fadeObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });
  document.querySelectorAll(".contact-form, .contact-map, .info-card").forEach(el => fadeObserver.observe(el));

  /* ---------- 1️⃣ Form validation ---------- */
  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const message = form.message.value.trim();

    if (!name || !email || !message) {
      showStatus("Please fill in all fields.", "error");
      return;
    }

    if (!validateEmail(email)) {
      showStatus("Please enter a valid email address.", "error");
      return;
    }

    // Simulate send
    setSendingState(true);
    showStatus("Sending your message...", "loading");

    try {
      // ---------- 2️⃣ Firebase placeholder ----------
      // This will be replaced when dashboard is connected:
      // await addDoc(collection(db, "contactMessages"), {
      //   name, email, message, createdAt: new Date()
      // });

      // Simulate delay
      await new Promise(res => setTimeout(res, 1800));

      showStatus("Message sent successfully! We’ll get back to you soon.", "success");
      form.reset();
    } catch (err) {
      console.error("Message error:", err);
      showStatus("Something went wrong. Please try again later.", "error");
    } finally {
      setSendingState(false);
    }
  });

  /* ---------- 3️⃣ Helper functions ---------- */
  function validateEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function setSendingState(isSending) {
    submitBtn.disabled = isSending;
    if (isSending) {
      submitBtn.style.opacity = "0.6";
      submitBtn.querySelector("i").classList.add("fa-spinner", "fa-spin");
    } else {
      submitBtn.style.opacity = "1";
      submitBtn.querySelector("i").classList.remove("fa-spinner", "fa-spin");
    }
  }

  function showStatus(message, type) {
    statusEl.textContent = message;
    statusEl.style.opacity = "1";

    if (type === "success") {
      statusEl.style.color = "var(--brand-orange)";
    } else if (type === "error") {
      statusEl.style.color = "#e63946";
    } else {
      statusEl.style.color = "var(--muted)";
    }

    setTimeout(() => (statusEl.style.opacity = "0.7"), 4000);
  }

  /* ---------- 4️⃣ Keyboard / accessibility polish ---------- */
  form.querySelectorAll("input, textarea, button").forEach(el => {
    el.addEventListener("focus", () => el.parentElement.classList.add("focus"));
    el.addEventListener("blur", () => el.parentElement.classList.remove("focus"));
  });
});

