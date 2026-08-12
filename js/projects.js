/** Project detail modals */

import { openOverlay, closeOverlay, bindBackdropClose } from "./overlays.js";

export function initProjects() {
  const modal = document.getElementById("zk-project-modal");
  if (!modal) return;

  const mount = document.getElementById("zk-project-mount");
  const triggers = document.querySelectorAll("[data-open-project]");

  modal.hidden = true;

  const close = () => closeOverlay(modal);

  bindBackdropClose(modal, close);

  const open = (id) => {
    const tpl = document.querySelector(
      'template[data-project-detail="' + id + '"]'
    );
    if (!tpl || !mount) return;
    mount.replaceChildren(tpl.content.cloneNode(true));
    openOverlay(modal);
    mount.querySelectorAll("[data-close-project]").forEach((btn) => {
      btn.addEventListener("click", close);
    });
  };

  triggers.forEach((btn) => {
    btn.addEventListener("click", () => {
      open(btn.getAttribute("data-open-project"));
    });
  });

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("is-open")) close();
  });
}
