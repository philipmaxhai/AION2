/*
 * Schematische Karte von Atreia: Elysea (oben), Abyss/Reshanta (Mitte), Asmodae (unten).
 * Zoom per Mausrad, Pinch oder Buttons; Ziehen zum Verschieben; eigene Pins per Klick.
 */
(function () {
  const NS = "http://www.w3.org/2000/svg";
  const W = 800, H = 1300;
  const D = window.DK_DATA;

  let svg, world, labelLayer, pinLayer, opts;
  let vb = { x: 0, y: 0, w: W, h: H };
  let pinMode = false;
  let selId = null;
  const pointers = new Map();
  let drag = null;

  function el(name, attrs, parent) {
    const n = document.createElementNS(NS, name);
    for (const k in attrs) n.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(n);
    return n;
  }

  function rng(seed) {
    let a = seed * 2654435761 >>> 0;
    return function () {
      a |= 0; a = a + 0x6D2B79F5 | 0;
      let t = Math.imul(a ^ a >>> 15, 1 | a);
      t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
      return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
  }

  /* Organische Insel-Form aus wenigen Punkten (Catmull-Rom -> Bézier) */
  function blob(cx, cy, rx, ry, seed, n, jitter) {
    const r = rng(seed);
    n = n || 11; jitter = jitter || 0.16;
    const pts = [];
    for (let i = 0; i < n; i++) {
      const a = (i / n) * Math.PI * 2 + (r() - 0.5) * 0.35;
      const k = 1 + (r() - 0.5) * 2 * jitter;
      pts.push([cx + Math.cos(a) * rx * k, cy + Math.sin(a) * ry * k]);
    }
    let d = "M" + pts[0][0].toFixed(1) + "," + pts[0][1].toFixed(1);
    for (let i = 0; i < n; i++) {
      const p0 = pts[(i - 1 + n) % n], p1 = pts[i], p2 = pts[(i + 1) % n], p3 = pts[(i + 2) % n];
      const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
      const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
      d += "C" + c1.map((v) => v.toFixed(1)).join(",") + " " + c2.map((v) => v.toFixed(1)).join(",") + " " + p2.map((v) => v.toFixed(1)).join(",");
    }
    return d + "Z";
  }

  function build(host, options) {
    opts = options;
    host.innerHTML = "";
    svg = el("svg", { viewBox: "0 0 " + W + " " + H, class: "karte-svg", role: "group", "aria-label": "Schematische Karte von Atreia" }, host);
    const defs = el("defs", {}, svg);
    const grad = (id, c) => {
      const g = el("linearGradient", { id, x1: "0", y1: "0", x2: "0", y2: "1" }, defs);
      el("stop", { offset: "0", class: "stop-" + c + "-a" }, g);
      el("stop", { offset: "1", class: "stop-" + c + "-b" }, g);
    };
    grad("g-elyos", "elyos"); grad("g-abyss", "abyss"); grad("g-asmo", "asmo");

    world = el("g", { class: "world" }, svg);
    el("rect", { x: 0, y: 0, width: W, height: H, class: "sea" }, world);

    /* Reiche als Bänder */
    el("rect", { x: 0, y: 0, width: W, height: 480, class: "band band--elyos", fill: "url(#g-elyos)" }, world);
    el("rect", { x: 0, y: 500, width: W, height: 300, class: "band band--abyss", fill: "url(#g-abyss)" }, world);
    el("rect", { x: 0, y: 820, width: W, height: 480, class: "band band--asmo", fill: "url(#g-asmo)" }, world);

    /* Aether-Funken im Abyss */
    const r = rng(42);
    const sparks = el("g", { class: "sparks" }, world);
    for (let i = 0; i < 70; i++) el("circle", { cx: (r() * W).toFixed(1), cy: (510 + r() * 280).toFixed(1), r: (0.6 + r() * 1.6).toFixed(2) }, sparks);

    const bandLabel = (t, y, cls) => { const tx = el("text", { x: 22, y, class: "band-label " + cls }, world); tx.textContent = t; };
    bandLabel("Elysea · Elyos", 34, "is-elyos");
    bandLabel("Abyss · Reshanta", 530, "is-abyss");
    bandLabel("Asmodae · Asmodier", 1286, "is-asmo");

    /* Verbindungen */
    const links = el("g", { class: "links" }, world);
    el("path", { d: "M395,445 C330,520 260,560 205,575", class: "link link--abyss" }, links);
    el("path", { d: "M400,855 C360,780 300,740 230,730", class: "link link--abyss" }, links);
    el("path", { d: "M500,330 C760,520 760,860 300,1060", class: "link link--riss" }, links);
    const lt = el("text", { class: "link-label", x: 690, y: 820 }, links); lt.textContent = "Riss ins Feindgebiet";
    const la = el("text", { class: "link-label", x: 262, y: 520 }, links); la.textContent = "Abyss-Zugang";

    /* Regionen */
    const regs = el("g", { class: "regions" }, world);
    for (const rg of D.regions) {
      const g = el("g", { class: "region region--" + rg.faction, "data-region": rg.id, tabindex: "0", role: "button", "aria-label": rg.name + ", " + rg.level }, regs);
      el("path", { d: blob(rg.cx, rg.cy, rg.rx, rg.ry, rg.seed), class: "region-shape" }, g);
      el("path", { d: blob(rg.cx, rg.cy, rg.rx * 0.82, rg.ry * 0.8, rg.seed + 100, 9, 0.2), class: "region-inner" }, g);
      const t = el("text", { x: rg.cx, y: rg.cy - rg.ry * 0.12, class: "region-name" }, g); t.textContent = rg.name;
      const lv = el("text", { x: rg.cx, y: rg.cy - rg.ry * 0.12 + 20, class: "region-level" }, g); lv.textContent = rg.level;
    }

    const places = el("g", { class: "places" }, world);
    for (const p of D.places) { const t = el("text", { x: p.x, y: p.y, class: "place" }, places); t.textContent = p.name; }

    /* Marker */
    const mk = el("g", { class: "markers" }, world);
    for (const m of D.markers) addMarker(mk, m, false);
    pinLayer = el("g", { class: "pins" }, world);
    labelLayer = el("g", { class: "labels", "pointer-events": "none" }, world);

    renderPins();
    bind();
    applyView();
  }

  function addMarker(parent, m, isPin) {
    const g = el("g", {
      class: "mk mk--" + m.type, transform: "translate(" + m.x + "," + m.y + ")",
      "data-id": m.id, "data-faction": m.faction || "pin", tabindex: "0", role: "button", "aria-label": m.name
    }, parent);
    const body = el("g", { class: "mk-body" }, g);
    el("circle", { r: 14, class: "mk-halo" }, body);
    el("circle", { r: 11, class: "mk-plate" }, body);
    el("use", { href: "#s-" + m.type, x: -8, y: -8, width: 16, height: 16, class: "mk-icon" }, body);
    return g;
  }

  function renderPins() {
    if (!pinLayer) return;
    pinLayer.innerHTML = "";
    for (const p of opts.getPins()) addMarker(pinLayer, { id: p.id, type: "pin", x: p.x, y: p.y, name: p.name || "Eigener Pin" }, true);
    if (selId) select(selId, true);
  }

  function showLabel(g) {
    labelLayer.innerHTML = "";
    if (!g) return;
    const id = g.getAttribute("data-id");
    const m = D.markers.find((x) => x.id === id) || opts.getPins().find((x) => x.id === id);
    if (!m) return;
    const k = vb.w / W;
    const t = el("text", { x: m.x, y: m.y - 18 * Math.max(k, 0.5), class: "mk-label", "font-size": (13 * Math.max(k, 0.45)).toFixed(1) }, labelLayer);
    t.textContent = m.name || "Eigener Pin";
  }

  function select(id, silent) {
    selId = id || null;
    svg.querySelectorAll(".is-sel").forEach((n) => n.classList.remove("is-sel"));
    const g = id && svg.querySelector('[data-id="' + id + '"], [data-region="' + id + '"]');
    if (g) g.classList.add("is-sel");
    if (g && g.classList.contains("mk")) showLabel(g); else showLabel(null);
    if (!silent && opts.onSelect) opts.onSelect(id);
  }

  /* ---------- Zoom & Pan ---------- */
  function applyView() {
    svg.setAttribute("viewBox", [vb.x, vb.y, vb.w, vb.h].map((v) => v.toFixed(1)).join(" "));
    svg.style.setProperty("--k", (vb.w / W).toFixed(3));
    const sel = svg.querySelector(".mk.is-sel");
    if (sel) showLabel(sel);
  }

  function clampView() {
    vb.w = Math.min(Math.max(vb.w, 160), W);
    vb.h = vb.w * (H / W);
    vb.x = Math.min(Math.max(vb.x, -40), W - vb.w + 40);
    vb.y = Math.min(Math.max(vb.y, -40), H - vb.h + 40);
  }

  function zoomAt(factor, cx, cy) {
    const nw = Math.min(Math.max(vb.w * factor, 160), W);
    const f = nw / vb.w;
    vb.x = cx - (cx - vb.x) * f;
    vb.y = cy - (cy - vb.y) * f;
    vb.w = nw;
    clampView();
    applyView();
  }

  function toSvg(clientX, clientY) {
    const pt = svg.createSVGPoint();
    pt.x = clientX; pt.y = clientY;
    const m = svg.getScreenCTM();
    if (!m) return { x: 0, y: 0 };
    const p = pt.matrixTransform(m.inverse());
    return { x: p.x, y: p.y };
  }

  function focusOn(x, y, w) {
    vb.w = w || 360;
    vb.h = vb.w * (H / W);
    vb.x = x - vb.w / 2;
    vb.y = y - vb.h / 2;
    clampView();
    applyView();
  }

  function bind() {
    svg.addEventListener("wheel", (e) => {
      e.preventDefault();
      const p = toSvg(e.clientX, e.clientY);
      zoomAt(e.deltaY > 0 ? 1.15 : 1 / 1.15, p.x, p.y);
    }, { passive: false });

    svg.addEventListener("pointerdown", (e) => {
      pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      if (pointers.size === 1) {
        drag = { sx: e.clientX, sy: e.clientY, vx: vb.x, vy: vb.y, moved: false, target: e.target };
      } else if (pointers.size === 2) {
        const [a, b] = [...pointers.values()];
        drag = { pinch: Math.hypot(a.x - b.x, a.y - b.y), w: vb.w, moved: true };
      }
    });

    svg.addEventListener("pointermove", (e) => {
      if (!pointers.has(e.pointerId) || !drag) return;
      pointers.set(e.pointerId, { x: e.clientX, y: e.clientY });
      const rect = svg.getBoundingClientRect();
      if (pointers.size === 2 && drag.pinch) {
        const [a, b] = [...pointers.values()];
        const dist = Math.hypot(a.x - b.x, a.y - b.y);
        const mid = toSvg((a.x + b.x) / 2, (a.y + b.y) / 2);
        zoomAt((drag.w * drag.pinch / dist) / vb.w, mid.x, mid.y);
        return;
      }
      const dx = e.clientX - drag.sx, dy = e.clientY - drag.sy;
      if (!drag.moved && Math.hypot(dx, dy) > 5) {
        drag.moved = true;
        try { svg.setPointerCapture(e.pointerId); } catch (err) { /* egal */ }
        svg.classList.add("is-dragging");
      }
      if (drag.moved && !drag.pinch) {
        const scale = vb.w / rect.width;
        vb.x = drag.vx - dx * scale;
        vb.y = drag.vy - dy * scale;
        clampView();
        applyView();
      }
    });

    const end = (e) => {
      const had = pointers.has(e.pointerId);
      pointers.delete(e.pointerId);
      svg.classList.remove("is-dragging");
      if (!had || !drag) return;
      if (pointers.size > 0) { drag = null; return; }
      if (!drag.moved && e.type === "pointerup") click(e, drag.target);
      drag = null;
    };
    svg.addEventListener("pointerup", end);
    svg.addEventListener("pointercancel", end);
    svg.addEventListener("pointerleave", (e) => { if (e.pointerType === "mouse") end(e); });

    svg.addEventListener("keydown", (e) => {
      if (e.key !== "Enter" && e.key !== " ") return;
      const g = e.target.closest && e.target.closest(".mk, .region");
      if (!g) return;
      e.preventDefault();
      select(g.getAttribute("data-id") || g.getAttribute("data-region"));
    });

    svg.addEventListener("pointerover", (e) => {
      const g = e.target.closest && e.target.closest(".mk");
      if (g && !svg.querySelector(".mk.is-sel")) showLabel(g);
    });
    svg.addEventListener("pointerout", (e) => {
      const g = e.target.closest && e.target.closest(".mk");
      if (g && !svg.querySelector(".mk.is-sel")) showLabel(null);
    });
  }

  function click(e, target) {
    const g = target && target.closest && target.closest(".mk");
    if (g) { select(g.getAttribute("data-id")); return; }
    if (pinMode) {
      const p = toSvg(e.clientX, e.clientY);
      if (opts.onAddPin) opts.onAddPin(Math.round(p.x), Math.round(p.y));
      return;
    }
    const rg = target && target.closest && target.closest(".region");
    if (rg) { select(rg.getAttribute("data-region")); return; }
    select(null);
  }

  /* ---------- öffentliche API ---------- */
  window.DK_KARTE = {
    init: build,
    zoomIn: () => zoomAt(1 / 1.35, vb.x + vb.w / 2, vb.y + vb.h / 2),
    zoomOut: () => zoomAt(1.35, vb.x + vb.w / 2, vb.y + vb.h / 2),
    reset: () => { vb = { x: 0, y: 0, w: W, h: H }; applyView(); },
    focusOn,
    focusMarker(id) {
      const m = D.markers.find((x) => x.id === id) || (opts && opts.getPins().find((x) => x.id === id));
      if (m) { focusOn(m.x, m.y, 340); select(id); }
    },
    focusRegion(id) {
      const r = D.regions.find((x) => x.id === id);
      if (r) { focusOn(r.cx, r.cy, Math.max(r.rx * 2.6, 300)); select(id); }
    },
    select,
    setPinMode(on) { pinMode = on; if (svg) svg.classList.toggle("is-pinmode", on); },
    setFilter(type, visible) { if (svg) svg.classList.toggle("hide-" + type, !visible); },
    setFocus(faction) {
      if (!svg) return;
      svg.classList.toggle("focus-elyos", faction === "elyos");
      svg.classList.toggle("focus-asmo", faction === "asmo");
    },
    setLive(map) {
      if (!svg) return;
      svg.querySelectorAll(".mk").forEach((g) => {
        const s = map[g.getAttribute("data-id")];
        g.classList.toggle("is-live", s === "live");
        g.classList.toggle("is-soon", s === "soon");
        g.classList.toggle("is-down", s === "down");
      });
    },
    refreshPins: renderPins
  };
})();
