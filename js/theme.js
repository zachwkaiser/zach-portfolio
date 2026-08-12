/** Theme: dark / light via data-theme + localStorage */

export function reducedMotion() {
  return window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function getTheme() {
  return document.documentElement.getAttribute("data-theme") || "dark";
}

export function applyTheme(theme) {
  const t = theme === "light" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", t);
  document.body.style.background = t === "light" ? "#ffffff" : "#0a0c10";

  document.querySelectorAll('[data-theme-toggle]').forEach((btn) => {
    const light = t === "light";
    btn.setAttribute("aria-checked", light ? "true" : "false");
    btn.setAttribute(
      "aria-label",
      light ? "Switch to dark mode" : "Switch to light mode"
    );
  });
}

export function initTheme() {
  let saved = null;
  try {
    saved = localStorage.getItem("zk-theme");
  } catch (_) {}

  if (saved !== "dark" && saved !== "light") {
    const prefersLight =
      window.matchMedia && window.matchMedia("(prefers-color-scheme: light)").matches;
    saved = prefersLight ? "light" : "dark";
  }

  applyTheme(saved);

  document.querySelectorAll("[data-theme-toggle]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const next = getTheme() === "dark" ? "light" : "dark";
      try {
        localStorage.setItem("zk-theme", next);
      } catch (_) {}
      applyTheme(next);
    });
  });
}
