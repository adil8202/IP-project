/**
 * adil mohammed Portfolio - JavaScript Application
 * Hand-crafted with vanilla ES6 standards.
 */

document.addEventListener("DOMContentLoaded", () => {
  /* ==========================================================================
     1. Dynamic Footer Year
     ========================================================================== */
  const yearElement = document.getElementById("current-year");
  if (yearElement) {
    yearElement.textContent = new Date().getFullYear();
  }

  /* ==========================================================================
     2. Scroll Reading Progress & Back-to-Top Toggle
     ========================================================================== */
  const scrollProgress = document.getElementById("scroll-progress");
  const backToTopBtn = document.getElementById("back-to-top");

  window.addEventListener("scroll", () => {
    const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = (window.scrollY / totalHeight) * 100;

    if (scrollProgress) {
      scrollProgress.style.width = `${progress}%`;
    }

    if (backToTopBtn) {
      if (window.scrollY > 400) {
        backToTopBtn.classList.add("show");
      } else {
        backToTopBtn.classList.remove("show");
      }
    }
  });

  if (backToTopBtn) {
    backToTopBtn.addEventListener("click", () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }

  /* ==========================================================================
     3. Responsive Mobile Menu Drawer
     ========================================================================== */
  const menuToggle = document.getElementById("menu-toggle");
  const navLinks = document.getElementById("nav-links");

  if (menuToggle && navLinks) {
    menuToggle.addEventListener("click", () => {
      const isExpanded = menuToggle.getAttribute("aria-expanded") === "true";
      menuToggle.setAttribute("aria-expanded", !isExpanded);
      navLinks.classList.toggle("active");
    });

    // Close menu when clicking any nav item
    document.querySelectorAll(".nav-item").forEach((link) => {
      link.addEventListener("click", () => {
        navLinks.classList.remove("active");
        menuToggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* ==========================================================================
     4. Dark / Light Theme Switching via LocalStorage
     ========================================================================== */
  const themeToggle = document.getElementById("theme-toggle");
  const savedTheme = localStorage.getItem("alex-theme") || "light";

  if (savedTheme === "dark") {
    document.body.setAttribute("data-theme", "dark");
    if (themeToggle) themeToggle.textContent = "☀️";
  }

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const isDark = document.body.getAttribute("data-theme") === "dark";
      if (isDark) {
        document.body.removeAttribute("data-theme");
        themeToggle.textContent = "🌙";
        localStorage.setItem("alex-theme", "light");
      } else {
        document.body.setAttribute("data-theme", "dark");
        themeToggle.textContent = "☀️";
        localStorage.setItem("alex-theme", "dark");
      }
    });
  }

  /* ==========================================================================
     5. Hero Section Typewriter Effect
     ========================================================================== */
  const words = [
    "Frontend Engineering.",
    "Responsive Web Design.",
    "Accessible Interfaces.",
    "Performant JavaScript."
  ];

  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  const typewriterTarget = document.getElementById("typewriter");

  function typeEffect() {
    if (!typewriterTarget) return;

    const currentWord = words[wordIndex];

    if (isDeleting) {
      typewriterTarget.textContent = currentWord.substring(0, charIndex - 1);
      charIndex--;
    } else {
      typewriterTarget.textContent = currentWord.substring(0, charIndex + 1);
      charIndex++;
    }

    let speed = isDeleting ? 40 : 80;

    if (!isDeleting && charIndex === currentWord.length) {
      speed = 1800; // Pause when word is finished
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      speed = 350;
    }

    setTimeout(typeEffect, speed);
  }
  typeEffect();

  /* ==========================================================================
     6. Animated Skill Progress Bars (Intersection Observer)
     ========================================================================== */
  const skillBars = document.querySelectorAll(".progress-bar .fill");

  const skillObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const bar = entry.target;
        const targetWidth = bar.getAttribute("data-progress");
        bar.style.width = targetWidth;
        observer.unobserve(bar);
      }
    });
  }, { threshold: 0.25 });

  skillBars.forEach((bar) => skillObserver.observe(bar));

  /* ==========================================================================
     7. Interactive Project Filtering
     ========================================================================== */
  const filterBtns = document.querySelectorAll(".filter-btn");
  const projectCards = document.querySelectorAll(".project-card");

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      filterBtns.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      const filterVal = btn.getAttribute("data-filter");

      projectCards.forEach((card) => {
        const category = card.getAttribute("data-category");
        if (filterVal === "all" || category === filterVal) {
          card.style.display = "flex";
        } else {
          card.style.display = "none";
        }
      });
    });
  });

  /* ==========================================================================
     8. Project Architecture Modal Window
     ========================================================================== */
  const modal = document.getElementById("project-modal");
  const modalTitle = document.getElementById("modal-title");
  const modalDesc = document.getElementById("modal-desc");
  const modalTags = document.getElementById("modal-tags");
  const modalClose = document.getElementById("modal-close");
  const modalOverlay = document.getElementById("modal-overlay");

  const modalData = {
    "modal-portfolio": {
      title: "Portfolio Architecture & WCAG Standards",
      desc: "Designed using native HTML5 landmark semantics (<header>, <nav>, <main>, <section>, <article>, <footer>) to achieve 100% Lighthouse Accessibility scores. Features responsive Flexbox and Grid layouts, CSS Custom Properties for immediate theming, and zero third-party framework overhead.",
      tags: ["HTML5", "CSS3 Custom Properties", "IntersectionObserver", "ES6"]
    },
    "modal-task": {
      title: "Interactive Task Hub with Web Storage",
      desc: "An application engineered to illustrate client-side persistence. Utilizes the browser's Web Storage API (localStorage) with JSON serialization, defensive input sanitization, dynamic category filtering, and custom event listeners.",
      tags: ["Vanilla JavaScript", "Web Storage API", "DOM Manipulation", "UX Design"]
    },
    "modal-weather": {
      title: "Climate Interface & Responsive Design",
      desc: "An exploration into fluid multi-breakpoint CSS Grid systems. Incorporates custom SVG inline weather visualizations, fluid typography using CSS clamp(), and simulated asynchronous API data feeds.",
      tags: ["CSS Grid", "SVG Optimization", "Fluid Typography", "Async JS"]
    }
  };

  document.querySelectorAll(".btn-modal").forEach((button) => {
    button.addEventListener("click", () => {
      const key = button.getAttribute("data-modal");
      const data = modalData[key];

      if (data && modal) {
        modalTitle.textContent = data.title;
        modalDesc.textContent = data.desc;
        modalTags.innerHTML = data.tags.map((t) => `<span>${t}</span>`).join("");
        modal.classList.add("active");
        modal.setAttribute("aria-hidden", "false");
      }
    });
  });

  function hideModal() {
    if (modal) {
      modal.classList.remove("active");
      modal.setAttribute("aria-hidden", "true");
    }
  }

  if (modalClose) modalClose.addEventListener("click", hideModal);
  if (modalOverlay) modalOverlay.addEventListener("click", hideModal);

  // Close modal via Escape key
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal && modal.classList.contains("active")) {
      hideModal();
    }
  });

  /* ==========================================================================
     9. Client-Side Contact Form Validation
     ========================================================================== */
  const contactForm = document.getElementById("contact-form");
  const nameField = document.getElementById("name");
  const emailField = document.getElementById("email");
  const subjectField = document.getElementById("subject");
  const messageField = document.getElementById("message");
  const formAlert = document.getElementById("form-alert");

  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      let isValid = true;

      // Validate Name (>= 3 chars)
      if (nameField.value.trim().length < 3) {
        showValidation("name-error", "Please provide a valid name (at least 3 characters).");
        isValid = false;
      } else {
        clearValidation("name-error");
      }

      // Validate Email (Strict Regex Pattern)
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(emailField.value.trim())) {
        showValidation("email-error", "Please enter a valid email address (e.g., name@domain.com).");
        isValid = false;
      } else {
        clearValidation("email-error");
      }

      // Validate Subject (>= 3 chars)
      if (subjectField.value.trim().length < 3) {
        showValidation("subject-error", "Please enter a subject.");
        isValid = false;
      } else {
        clearValidation("subject-error");
      }

      // Validate Message (>= 10 chars)
      if (messageField.value.trim().length < 10) {
        showValidation("message-error", "Message must be at least 10 characters long.");
        isValid = false;
      } else {
        clearValidation("message-error");
      }

      // If all checks pass
      if (isValid) {
        formAlert.textContent = "✓ Message sent successfully! I will reply shortly.";
        formAlert.className = "form-alert success";
        contactForm.reset();

        setTimeout(() => {
          formAlert.textContent = "";
          formAlert.className = "form-alert";
        }, 5000);
      }
    });
  }

  function showValidation(id, msg) {
    const errorEl = document.getElementById(id);
    if (errorEl) {
      errorEl.textContent = msg;
      errorEl.style.display = "block";
    }
  }

  function clearValidation(id) {
    const errorEl = document.getElementById(id);
    if (errorEl) {
      errorEl.textContent = "";
      errorEl.style.display = "none";
    }
  }

  /* ==========================================================================
     10. Scroll Section Reveal Animations
     ========================================================================== */
  const revealElements = document.querySelectorAll(".reveal");

  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });

  revealElements.forEach((el) => revealObserver.observe(el));
});