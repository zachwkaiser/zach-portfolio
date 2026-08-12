/** Modal / overlay helpers: body scroll lock, focus restore, tab trap */

let openCount = 0;
let lastFocus = null;

export function anyOverlayOpen() {
  return openCount > 0;
}

export function openOverlay(el) {
  if (!el) return;
  if (openCount === 0) lastFocus = document.activeElement;
  openCount += 1;
  el.classList.add("is-open");
  el.hidden = false;
  document.body.style.overflow = "hidden";
  requestAnimationFrame(() => focusModal(el));
  document.dispatchEvent(new CustomEvent("zk:overlays"));
}

export function closeOverlay(el) {
  if (!el || !el.classList.contains("is-open")) return;
  el.classList.remove("is-open");
  el.hidden = true;
  openCount = Math.max(0, openCount - 1);
  if (openCount === 0) {
    document.body.style.overflow = "";
    if (lastFocus && lastFocus.focus) lastFocus.focus();
  }
  document.dispatchEvent(new CustomEvent("zk:overlays"));
}

export function focusModal(root) {
  const panel =
    root.querySelector("[data-modal-panel]") ||
    root.querySelector('[role="dialog"]') ||
    root;
  const focusable = panel.querySelector(
    'button, a[href], input, textarea, [tabindex]:not([tabindex="-1"])'
  );
  if (focusable) focusable.focus();
}

export function trapFocus(e) {
  if (e.key !== "Tab") return;
  const m = e.currentTarget;
  const list = Array.from(
    m.querySelectorAll(
      'button, a[href], input, textarea, [tabindex]:not([tabindex="-1"])'
    )
  ).filter((el) => el.offsetParent !== null || el === document.activeElement);
  if (!list.length) return;
  const first = list[0];
  const last = list[list.length - 1];
  if (e.shiftKey && document.activeElement === first) {
    e.preventDefault();
    last.focus();
  } else if (!e.shiftKey && document.activeElement === last) {
    e.preventDefault();
    first.focus();
  }
}

export function bindBackdropClose(el, closer) {
  el.addEventListener("click", (e) => {
    if (e.target === el) closer();
  });
  el.addEventListener("keydown", trapFocus);
}
