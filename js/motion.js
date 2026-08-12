/** Scroll reveals + magnetic buttons */

import { reducedMotion } from "./theme.js";

export function initMotion() {
  setupReveals();
  setupMagnetic();
}

function setupReveals() {
  const els = document.querySelectorAll("[data-reveal]");
  if (!els.length) return;

  if (reducedMotion() || !("IntersectionObserver" in window)) {
    els.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((en) => {
        if (!en.isIntersecting) return;
        const el = en.target;
        const d = el.getAttribute("data-reveal-delay") || "0";
        el.style.transition =
          "opacity .7s cubic-bezier(.22,.61,.36,1) " +
          d +
          "ms, transform .7s cubic-bezier(.22,.61,.36,1) " +
          d +
          "ms";
        el.classList.add("is-visible");
        io.unobserve(el);
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
  );

  els.forEach((el) => io.observe(el));
}

function setupMagnetic() {
  if (reducedMotion()) return;
  document.querySelectorAll("[data-magnetic]").forEach((el) => {
    const s = parseFloat(el.getAttribute("data-magnetic")) || 0.25;
    el.addEventListener("pointermove", (e) => {
      const r = el.getBoundingClientRect();
      const mx = e.clientX - r.left - r.width / 2;
      const my = e.clientY - r.top - r.height / 2;
      el.style.transform = "translate(" + mx * s + "px," + my * s + "px)";
    });
    el.addEventListener("pointerleave", () => {
      el.style.transform = "translate(0,0)";
    });
  });
}
