/*
 * Dekoration: schwebende Aether-Funken auf <canvas data-aether>.
 * Läuft nur, solange die Fläche sichtbar ist; bei „Bewegung reduzieren“ bleibt ein ruhiges Bild stehen.
 * Farben kommen aus CSS (--spark-a, --spark-b als „R, G, B“), damit das helle Design eigene Funken hat.
 */
(function () {
  const reduce = window.matchMedia ? window.matchMedia("(prefers-reduced-motion: reduce)") : { matches: false };
  const all = [];

  function sprite(rgb) {
    const c = document.createElement("canvas");
    c.width = c.height = 32;
    const g = c.getContext("2d");
    const grad = g.createRadialGradient(16, 16, 0, 16, 16, 16);
    grad.addColorStop(0, `rgba(${rgb}, 1)`);
    grad.addColorStop(0.25, `rgba(${rgb}, 0.55)`);
    grad.addColorStop(1, `rgba(${rgb}, 0)`);
    g.fillStyle = grad;
    g.fillRect(0, 0, 32, 32);
    return c;
  }

  function start(canvas) {
    if (canvas.__aether) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    const st = { canvas, ctx, w: 0, h: 0, parts: [], raf: 0, inView: false, sprites: [] };
    canvas.__aether = st;
    all.push(st);

    const colors = () => {
      const cs = getComputedStyle(canvas);
      const a = cs.getPropertyValue("--spark-a").trim() || "111, 214, 210";
      const b = cs.getPropertyValue("--spark-b").trim() || "243, 217, 153";
      st.sprites = [sprite(a), sprite(b)];
    };
    const spawn = (anywhere) => ({
      x: Math.random() * st.w,
      y: anywhere ? Math.random() * st.h : st.h + 8,
      s: 3 + Math.random() * 7,
      vy: 0.12 + Math.random() * 0.4,
      vx: (Math.random() - 0.5) * 0.16,
      a: 0.25 + Math.random() * 0.55,
      t: Math.random() * Math.PI * 2,
      k: Math.random() < 0.3 ? 1 : 0,
    });
    st.size = () => {
      const r = canvas.getBoundingClientRect();
      if (!r.width || !r.height) return;
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      st.w = r.width; st.h = r.height;
      canvas.width = Math.round(r.width * dpr);
      canvas.height = Math.round(r.height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const n = Math.round(Math.max(14, Math.min(70, (r.width * r.height) / 8000)));
      st.parts = Array.from({ length: n }, () => spawn(true));
      colors();
      if (reduce.matches || !st.raf) frame(false);
    };
    const frame = (move) => {
      ctx.clearRect(0, 0, st.w, st.h);
      for (const p of st.parts) {
        if (move) {
          p.t += 0.018;
          p.y -= p.vy;
          p.x += p.vx + Math.sin(p.t) * 0.12;
          if (p.y < -10 || p.x < -10 || p.x > st.w + 10) Object.assign(p, spawn(false));
        }
        ctx.globalAlpha = p.a * (0.55 + 0.45 * Math.sin(p.t * 1.6));
        ctx.drawImage(st.sprites[p.k], p.x - p.s, p.y - p.s, p.s * 2, p.s * 2);
      }
      ctx.globalAlpha = 1;
    };
    const loop = () => {
      frame(true);
      st.raf = requestAnimationFrame(loop);
    };
    st.run = () => {
      const go = st.inView && !document.hidden && !reduce.matches;
      if (go && !st.raf) st.raf = requestAnimationFrame(loop);
      if (!go && st.raf) { cancelAnimationFrame(st.raf); st.raf = 0; }
    };
    st.colors = () => { colors(); if (!st.raf) frame(false); };

    if ("IntersectionObserver" in window) {
      new IntersectionObserver((entries) => {
        entries.forEach((e) => { st.inView = e.isIntersecting; if (st.inView && !st.w) st.size(); st.run(); });
      }).observe(canvas);
    } else {
      st.inView = true;
    }
    if ("ResizeObserver" in window) new ResizeObserver(() => st.size()).observe(canvas);
    st.size();
    st.run();
  }

  function scan() {
    document.querySelectorAll("canvas[data-aether]").forEach(start);
  }

  document.addEventListener("visibilitychange", () => all.forEach((st) => st.run()));
  if (reduce.addEventListener) reduce.addEventListener("change", () => all.forEach((st) => { st.run(); if (!st.raf) st.size(); }));
  /* Theme-Wechsel: Funkenfarben neu lesen */
  new MutationObserver(() => all.forEach((st) => st.colors())).observe(document.documentElement, { attributes: true, attributeFilter: ["data-theme"] });
  if (window.matchMedia) {
    const mq = window.matchMedia("(prefers-color-scheme: light)");
    if (mq.addEventListener) mq.addEventListener("change", () => all.forEach((st) => st.colors()));
  }

  window.DK_DEKO = { scan };
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", scan);
  else scan();
})();
