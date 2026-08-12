/** Nav: mobile menu + resume modal */

import {
  openOverlay,
  closeOverlay,
  bindBackdropClose,
  trapFocus,
} from "./overlays.js";

export function initNav() {
  const menu = document.getElementById("zk-menu");
  const resume = document.getElementById("zk-resume");
  const burger = document.querySelector("[data-open-menu]");
  const closeMenuBtn = document.querySelector("[data-close-menu]");
  const openResumeBtns = document.querySelectorAll("[data-open-resume]");
  const closeResumeBtns = document.querySelectorAll("[data-close-resume]");

  const closeMenu = () => {
    if (menu) closeOverlay(menu);
    if (burger) burger.setAttribute("aria-expanded", "false");
  };

  const openMenu = () => {
    if (menu) openOverlay(menu);
    if (burger) burger.setAttribute("aria-expanded", "true");
  };

  const openResume = () => {
    closeMenu();
    if (resume) openOverlay(resume);
  };

  const closeResume = () => {
    if (resume) closeOverlay(resume);
  };

  if (burger) {
    burger.addEventListener("click", () => {
      if (menu?.classList.contains("is-open")) closeMenu();
      else openMenu();
    });
  }

  if (closeMenuBtn) closeMenuBtn.addEventListener("click", closeMenu);
  openResumeBtns.forEach((btn) => btn.addEventListener("click", openResume));
  closeResumeBtns.forEach((btn) => btn.addEventListener("click", closeResume));

  if (menu) {
    menu.hidden = true;
    menu.addEventListener("keydown", trapFocus);
    // Close menu after in-page jump (scroll handled by chrome.js)
    menu.querySelectorAll("a[data-scroll]").forEach((el) => {
      el.addEventListener("click", () => closeMenu());
    });
  }

  if (resume) {
    resume.hidden = true;
    bindBackdropClose(resume, closeResume);
  }

  window.addEventListener("keydown", (e) => {
    if (e.key !== "Escape") return;
    if (resume?.classList.contains("is-open")) closeResume();
    else if (menu?.classList.contains("is-open")) closeMenu();
  });
}
