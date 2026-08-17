const root = document.documentElement;
const themeToggle = document.querySelector(".theme-toggle");
const themeToggleIcon = document.querySelector(".theme-toggle-icon");
const themeToggleText = document.querySelector(".theme-toggle-text");

const setThemeUI = (theme) => {
  const isDark = theme === "dark";
  if (themeToggle) {
    themeToggle.setAttribute("aria-pressed", String(isDark));
  }
  if (themeToggleIcon) {
    themeToggleIcon.textContent = isDark ? "☀️" : "🌙";
  }
  if (themeToggleText) {
    themeToggleText.textContent = isDark ? "Light" : "Dark";
  }
};

setThemeUI(root.getAttribute("data-theme") || "light");

if (themeToggle) {
  themeToggle.addEventListener("click", () => {
    const currentTheme = root.getAttribute("data-theme") || "light";
    const nextTheme = currentTheme === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", nextTheme);
    localStorage.setItem("portfolio-theme", nextTheme);
    setThemeUI(nextTheme);
  });
}

const navToggle = document.querySelector(".nav-toggle");
const navControls = document.querySelector(".nav-controls");

const closeMobileMenu = () => {
  if (!navToggle || !navControls) return;
  navControls.classList.remove("is-open");
  navToggle.setAttribute("aria-expanded", "false");
  navToggle.setAttribute("aria-label", "Open menu");
};

if (navToggle && navControls) {
  navToggle.addEventListener("click", () => {
    const isOpen = navControls.classList.toggle("is-open");
    navToggle.setAttribute("aria-expanded", String(isOpen));
    navToggle.setAttribute("aria-label", isOpen ? "Close menu" : "Open menu");
  });

  navControls.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", closeMobileMenu);
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeMobileMenu();
    }
  });
}

const navLinks = Array.from(document.querySelectorAll(".nav-menu a"));
const sections = navLinks
  .map((link) => link.getAttribute("href"))
  .filter((href) => href && href.startsWith("#"))
  .map((href) => document.querySelector(href))
  .filter((section) => section instanceof HTMLElement);

if ("IntersectionObserver" in window && sections.length > 0) {
  const setActive = (id) => {
    navLinks.forEach((link) => {
      const isActive = link.getAttribute("href") === `#${id}`;
      link.classList.toggle("active", isActive);
      if (isActive) {
        link.setAttribute("aria-current", "page");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  };

  const observer = new IntersectionObserver(
    (entries) => {
      const visible = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
      if (visible?.target?.id) {
        setActive(visible.target.id);
      }
    },
    {
      rootMargin: "-35% 0px -55% 0px",
      threshold: [0.25, 0.5, 0.75],
    },
  );

  sections.forEach((section) => observer.observe(section));
}

const contactForm = document.querySelector("#contact-form");
const feedback = document.querySelector("#form-feedback");

if (contactForm && feedback) {
  contactForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const name = contactForm.querySelector("#name");
    const email = contactForm.querySelector("#email");
    const message = contactForm.querySelector("#message");

    if (!(name instanceof HTMLInputElement) || !(email instanceof HTMLInputElement) || !(message instanceof HTMLTextAreaElement)) {
      return;
    }

    const values = {
      name: name.value.trim(),
      email: email.value.trim(),
      message: message.value.trim(),
    };
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!values.name || !values.email || !values.message) {
      feedback.textContent = "Please complete all fields before submitting.";
      feedback.className = "form-feedback error";
      return;
    }

    if (!emailPattern.test(values.email)) {
      feedback.textContent = "Please enter a valid email address.";
      feedback.className = "form-feedback error";
      return;
    }

    feedback.textContent = "Thanks for your message.";
    feedback.className = "form-feedback success";
    contactForm.reset();
  });
}

const yearNode = document.querySelector("#year");
if (yearNode) {
  yearNode.textContent = String(new Date().getFullYear());
}
