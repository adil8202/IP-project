/* =========================================================
   Portfolio JavaScript
   1. Dynamic greeting        5. Project details modal
   2. Mobile menu             6. Animated skill bars
   3. Dark / light theme      7. Contact form validation
   4. Project filtering
   ========================================================= */

"use strict";

/* ---------- 1. Dynamic greeting (changes with the time of day) ---------- */
const greetingEl = document.getElementById("greeting");

function updateGreeting() {
  const hour = new Date().getHours();
  let text;
  if (hour < 12) text = "Good morning";
  else if (hour < 18) text = "Good afternoon";
  else text = "Good evening";
  greetingEl.textContent = text + ", welcome to my portfolio.";
}
updateGreeting();

/* ---------- 2. Mobile menu ---------- */
const menuToggle = document.getElementById("menu-toggle");
const mainNav = document.getElementById("main-nav");

function setMenu(open) {
  mainNav.classList.toggle("open", open);
  menuToggle.setAttribute("aria-expanded", String(open));
  menuToggle.textContent = open ? "Close" : "Menu";
}

menuToggle.addEventListener("click", () => {
  setMenu(!mainNav.classList.contains("open"));
});

// Close the menu after choosing a link, or when Escape is pressed
mainNav.addEventListener("click", (event) => {
  if (event.target.tagName === "A") setMenu(false);
});
document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") setMenu(false);
});

/* ---------- 3. Dark / light theme (saved in localStorage) ---------- */
const themeToggle = document.getElementById("theme-toggle");
const root = document.documentElement;

function applyTheme(theme) {
  root.setAttribute("data-theme", theme);
  // The button offers the opposite theme
  themeToggle.textContent = theme === "dark" ? "Light mode" : "Dark mode";
}

function getStartTheme() {
  try {
    const saved = localStorage.getItem("theme");
    if (saved === "dark" || saved === "light") return saved;
  } catch (error) {
    // localStorage can be blocked; fall back to the device setting
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

applyTheme(getStartTheme());

themeToggle.addEventListener("click", () => {
  const next = root.getAttribute("data-theme") === "dark" ? "light" : "dark";
  applyTheme(next);
  try {
    localStorage.setItem("theme", next);
  } catch (error) {
    // Ignore: the theme still changes for this visit
  }
});

/* ---------- 4. Project filtering ---------- */
const filterButtons = document.querySelectorAll(".filter-btn");
const projectCards = document.querySelectorAll(".project-card");

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter; // "all", "web" or "database"

    filterButtons.forEach((b) => b.classList.remove("active"));
    button.classList.add("active");

    projectCards.forEach((card) => {
      const show = filter === "all" || card.dataset.category === filter;
      card.hidden = !show;
    });
  });
});

/* ---------- 5. Project details modal ---------- */
// Replace these with the real details of YOUR projects
const projectDetails = {
  coffee: {
    title: "Coffee Shop Website",
    text: "A three-page site (Home, Menu, Contact) built with semantic HTML and a responsive CSS Grid layout. I learned how to structure a site and make it work on phones."
  },
  students: {
    title: "Student Records System",
    text: "Stores student names, departments and results in a SQL database. The page lets users search and sort records. I learned table design and basic queries."
  },
  planner: {
    title: "Study Planner",
    text: "A to-do list for study sessions. Tasks are saved with localStorage so they stay after a refresh. I learned DOM manipulation and event handling."
  }
};

const modal = document.getElementById("project-modal");
const modalTitle = document.getElementById("modal-title");
const modalText = document.getElementById("modal-text");

document.querySelectorAll(".details-btn").forEach((button) => {
  button.addEventListener("click", () => {
    const project = projectDetails[button.dataset.project];
    if (!project) return;
    modalTitle.textContent = project.title;
    modalText.textContent = project.text;
    modal.showModal(); // built-in: traps focus and closes with Escape
  });
});

document.getElementById("modal-close").addEventListener("click", () => modal.close());

// Clicking the dark area outside the box also closes it
modal.addEventListener("click", (event) => {
  if (event.target === modal) modal.close();
});

/* ---------- 6. Animated skill bars ---------- */
const bars = document.querySelectorAll(".skill-list progress");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function animateBar(bar) {
  const target = Number(bar.dataset.target);
  if (reduceMotion) {
    bar.value = target;
    return;
  }
  let current = 0;
  const timer = setInterval(() => {
    current += 1;
    bar.value = current;
    if (current >= target) clearInterval(timer);
  }, 12);
}

// Remember each target value, reset to 0, then fill when scrolled into view
bars.forEach((bar) => {
  bar.dataset.target = bar.value;
  bar.value = 0;
});

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateBar(entry.target);
        observer.unobserve(entry.target); // animate only once
      }
    });
  }, { threshold: 0.4 });
  bars.forEach((bar) => observer.observe(bar));
} else {
  bars.forEach(animateBar);
}

/* ---------- 7. Contact form validation ---------- */
const form = document.getElementById("contact-form");
const statusEl = document.getElementById("form-status");

// Friendly messages for each field, based on the browser's validity states
function getMessage(field) {
  const v = field.validity;
  const label = field.labels && field.labels[0] ? field.labels[0].textContent.trim() : "This field";

  if (v.valueMissing) {
    return field.type === "checkbox" ? "Please tick this box to continue." : label + " is required.";
  }
  if (v.typeMismatch) return "Please enter a valid e-mail address.";
  if (v.tooShort) return label + " must be at least " + field.minLength + " characters.";
  if (v.patternMismatch) return field.title || "Please match the requested format.";
  return "";
}

// Find (or create) the <span class="error"> that belongs to a field
function getErrorSpan(field) {
  let span = document.getElementById(field.id + "-error");
  if (!span && field.name) {
    span = document.createElement("span");
    span.className = "error";
    span.id = (field.id || field.name) + "-error";
    span.setAttribute("aria-live", "polite");
    field.closest("p").appendChild(span);
  }
  return span;
}

function validateField(field) {
  const message = getMessage(field);
  const span = getErrorSpan(field);
  field.classList.toggle("invalid", message !== "");
  field.setAttribute("aria-invalid", message !== "" ? "true" : "false");
  if (span) span.textContent = message;
  return message === "";
}

const fields = form.querySelectorAll("input:not([type='reset']), select, textarea");

// Check each field when the user leaves it, and re-check while fixing it
fields.forEach((field) => {
  field.addEventListener("blur", () => validateField(field));
  field.addEventListener("input", () => {
    if (field.classList.contains("invalid")) validateField(field);
  });
});

form.addEventListener("submit", (event) => {
  event.preventDefault(); // stop the page from reloading

  let firstInvalid = null;
  fields.forEach((field) => {
    if (!validateField(field) && !firstInvalid) firstInvalid = field;
  });

  if (firstInvalid) {
    statusEl.textContent = "Please correct the highlighted fields.";
    firstInvalid.focus();
    return;
  }

  // No server yet, so the message is only simulated
  const name = form.elements["name"].value.trim();
  statusEl.textContent = "Thank you, " + name + "! Your message was received.";
  form.reset();
  fields.forEach((field) => field.classList.remove("invalid"));
});

form.addEventListener("reset", () => {
  statusEl.textContent = "";
  form.querySelectorAll(".error").forEach((span) => (span.textContent = ""));
  fields.forEach((field) => field.classList.remove("invalid"));
});