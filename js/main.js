/** Boot: load partials, then wire up the scrollable site */

import { loadIncludes } from "./includes.js";
import { initTheme } from "./theme.js";
import { initNav } from "./nav.js";
import { initChrome } from "./chrome.js";
import { initMotion } from "./motion.js";
import { initHero } from "./hero.js";
import { initProjects } from "./projects.js";
import { initContact } from "./contact.js";

async function boot() {
  try {
    await loadIncludes();
  } catch (err) {
    console.error(err);
    const root = document.getElementById("zk-root");
    if (root) {
      root.innerHTML =
        '<p style="padding:2rem;font-family:system-ui;color:#eef2f8;">Could not load page sections. Serve this site over HTTP (Live Server / Vercel), not as a file:// URL.</p>';
    }
    document.documentElement.classList.add("is-ready");
    return;
  }

  document.documentElement.classList.add("is-ready");

  initTheme();
  initNav();
  initChrome();
  initMotion();
  initHero();
  initProjects();
  initContact();
}

boot();
