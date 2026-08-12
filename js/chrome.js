/** Scroll progress, back-to-top, nav solid state, active section */

import { anyOverlayOpen } from "./overlays.js";
import { reducedMotion } from "./theme.js";

const SECTION_IDS = ["hero", "about", "experience", "projects", "contact"];

export function scrollToId(id) {
  const el = document.getElementById(id);
  if (!el) return;
  const offset = id === "hero" ? 0 : 56;
  const y = el.getBoundingClientRect().top + window.scrollY - offset;
  window.scrollTo({
    top: Math.max(0, y),
    behavior: reducedMotion() ? "auto" : "smooth",
  });
}

export function initChrome() {
  const progress = document.getElementById("zk-progress");
  const backTop = document.getElementById("zk-back-top");
  const nav = document.querySelector(".zk-nav");
  const navLinks = document.querySelectorAll("[data-nav]");
  let activeSection = "hero";

  const setActive = (id) => {
    if (id === activeSection) return;
    activeSection = id;
    navLinks.forEach((link) => {
      const match = link.getAttribute("data-nav") === id;
      if (match) link.setAttribute("aria-current", "page");
      else link.removeAttribute("aria-current");
    });
  };

  const update = () => {
    const doc = document.documentElement;
    const max = doc.scrollHeight - doc.clientHeight;
    const sy = window.scrollY || doc.scrollTop;
    const p = max > 0 ? sy / max : 0;
    const pct = Math.round(Math.min(1, Math.max(0, p)) * 100);

    if (progress) progress.style.width = pct + "%";

    if (backTop) {
      const show = p > 0.12 && !anyOverlayOpen();
      backTop.classList.toggle("is-visible", show);
    }

    // Active section from scroll position
    const mid = sy + window.innerHeight * 0.35;
    let current = "hero";
    for (const id of SECTION_IDS) {
      const el = document.getElementById(id);
      if (el && el.offsetTop <= mid) current = id;
    }
    setActive(current);

    // Transparent nav only at very top of hero
    const atTop = current === "hero" && p < 0.02;
    nav?.classList.toggle("is-scrolled", !atTop);
  };

  let ticking = false;
  window.addEventListener(
    "scroll",
    () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        ticking = false;
        update();
      });
    },
    { passive: true }
  );

  document.addEventListener("zk:overlays", update);

  backTop?.addEventListener("click", () => scrollToId("hero"));

  // In-page smooth scroll links
  document.querySelectorAll("[data-scroll]").forEach((a) => {
    a.addEventListener("click", (e) => {
      const href = a.getAttribute("href") || "";
      if (!href.startsWith("#")) return;
      const id = href.slice(1);
      if (!document.getElementById(id)) return;
      e.preventDefault();
      scrollToId(id);
      history.replaceState(null, "", href);
    });
  });

  // Land on hash if present
  if (location.hash) {
    const id = location.hash.slice(1);
    requestAnimationFrame(() => scrollToId(id));
  }

  update();
}
