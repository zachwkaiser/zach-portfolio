/** Hero typewriter + particle canvas (home page only) */

import { reducedMotion, getTheme } from "./theme.js";

const PHRASES = [
  "An aspiring software engineer.",
  "Building real things, one project at a time.",
  "Always learning something new.",
  "Turning ideas into software that works.",
  "Currently interning at nCino.",
];

export function initHero() {
  startTyping();
  setupCanvas();
}

function startTyping() {
  const textEl = document.getElementById("zk-typed");
  const caret = document.getElementById("zk-caret");
  if (!textEl) return;

  if (reducedMotion()) {
    textEl.textContent = PHRASES[0];
    return;
  }

  let pi = 0;
  let ci = 0;
  let deleting = false;

  const tick = () => {
    const full = PHRASES[pi];
    ci += deleting ? -1 : 1;
    textEl.textContent = full.slice(0, ci);
    let delay = deleting ? 34 : 62;
    if (!deleting && ci === full.length) {
      deleting = true;
      delay = 1600;
    } else if (deleting && ci === 0) {
      deleting = false;
      pi = (pi + 1) % PHRASES.length;
      delay = 340;
    }
    setTimeout(tick, delay);
  };

  setTimeout(tick, 700);
  if (caret) {
    setInterval(() => caret.classList.toggle("is-off"), 530);
  }
}

function setupCanvas() {
  const c = document.getElementById("zk-hero-canvas");
  const hero = document.getElementById("hero");
  if (!c || !hero || reducedMotion()) return;

  const ctx = c.getContext("2d");
  const dpr = Math.min(window.devicePixelRatio || 1, 2);
  const small = window.innerWidth < 720;
  const spacing = small ? 56 : 42;
  const reach = small ? 100 : 150;
  let dots = [];
  let cw = 0;
  let ch = 0;
  const mouse = { x: -9999, y: -9999 };

  const resize = () => {
    const r = c.getBoundingClientRect();
    cw = r.width;
    ch = r.height;
    c.width = r.width * dpr;
    c.height = r.height * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    dots = [];
    const cols = Math.ceil(r.width / spacing) + 1;
    const rows = Math.ceil(r.height / spacing) + 1;
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        dots.push({ bx: i * spacing, by: j * spacing });
      }
    }
  };

  resize();
  window.addEventListener("resize", resize);

  hero.addEventListener("pointermove", (e) => {
    const r = c.getBoundingClientRect();
    mouse.x = e.clientX - r.left;
    mouse.y = e.clientY - r.top;
  });
  hero.addEventListener("pointerleave", () => {
    mouse.x = -9999;
    mouse.y = -9999;
  });

  let t = 0;
  const draw = () => {
    t += 0.006;
    ctx.clearRect(0, 0, cw, ch);
    const light = getTheme() === "light";
    const rgb = light ? "37,99,235" : "122,167,255";
    const base = light ? 0.1 : 0.14;
    for (const d of dots) {
      const drift =
        Math.sin(t + d.bx * 0.011) * 1.8 + Math.cos(t + d.by * 0.013) * 1.8;
      let ox = 0;
      let oy = 0;
      let r0 = 1.1;
      let a = base;
      const dx = d.bx - mouse.x;
      const dy = d.by - mouse.y;
      const dist = Math.hypot(dx, dy);
      if (dist < reach) {
        const f = 1 - dist / reach;
        const inv = dist || 1;
        ox = (dx / inv) * f * 12;
        oy = (dy / inv) * f * 12;
        r0 = 1.1 + f * 2.4;
        a = base + f * 0.5;
      }
      ctx.beginPath();
      ctx.arc(d.bx + ox + drift * 0.4, d.by + oy + drift * 0.4, r0, 0, 6.2832);
      ctx.fillStyle = "rgba(" + rgb + "," + a + ")";
      ctx.fill();
    }
    requestAnimationFrame(draw);
  };
  draw();
}
