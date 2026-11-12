"use strict";

/* Mobile menu */
const menuToggle = document.getElementById("menu-toggle");
const navList = document.getElementById("nav-list");

function setMenu(open) {
  navList.classList.toggle("open", open);
  menuToggle.setAttribute("aria-expanded", String(open));
  menuToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
}
menuToggle.addEventListener("click", () => setMenu(!navList.classList.contains("open")));
navList.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => setMenu(false)));
document.addEventListener("keydown", (e) => { if (e.key === "Escape") setMenu(false); });

/* Highlight the nav link for the section in view */
const navLinks = document.querySelectorAll(".nav-list a");
const sections = document.querySelectorAll("main section[id]");
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        navLinks.forEach((a) => a.classList.toggle("active", a.getAttribute("href") === "#" + entry.target.id));
      }
    });
  },
  { rootMargin: "-45% 0px -50% 0px" }
);
sections.forEach((s) => observer.observe(s));

/* Footer year */
document.getElementById("year").textContent = new Date().getFullYear();

/* Contact form validation */
const form = document.getElementById("contact-form");
const status = document.getElementById("form-status");
const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function showError(field, message) {
  const err = document.getElementById(field.id + "-error");
  err.textContent = message;
  field.setAttribute("aria-invalid", message ? "true" : "false");
  return !message;
}

function validate() {
  const name = form.elements.name;
  const email = form.elements.email;
  const message = form.elements.message;
  const results = [
    showError(name, name.value.trim().length < 2 ? "Enter your name." : ""),
    showError(email, !emailPattern.test(email.value.trim()) ? "Enter a valid email address, like name@example.com." : ""),
    showError(message, message.value.trim().length < 10 ? "Write a message of at least 10 characters." : ""),
  ];
  return results.every(Boolean);
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  status.className = "";
  status.textContent = "";
  if (!validate()) {
    status.className = "fail";
    status.textContent = "Fix the highlighted fields and try again.";
    return;
  }
  /* No server yet: to receive real messages, point the form at a service
     such as Formspree and send it with fetch(). */
  status.className = "success";
  status.textContent = "Thanks, " + form.elements.name.value.trim() + "! Your message is ready to send.";
  form.reset();
});

form.addEventListener("input", (e) => {
  if (e.target.getAttribute("aria-invalid") === "true") showError(e.target, "");
});
