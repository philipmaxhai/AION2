/*
 * Daevanion: empfohlene Route je Klasse und Brett, das Brett als Bild (SVG) und als PNG zum Speichern.
 * Daten: DK_DATA.daevanion (Raster und Knoten, data-daevanion.js), DK_DATA.daevanionPlan (Prioritäten, data.js).
 *
 * Route: Vom Startknoten aus wird immer der günstigste Weg (Knotenkosten 1/2/3/4) zum nächsten Ziel gelegt.
 *   1. Kern: Knoten der Kern-Skills und der wichtigsten Passiven, dann die Ecken, dann die übrigen Passiven der Liste.
 *      Innerhalb einer Stufe zuerst das Ziel, das gerade am wenigsten kostet.
 *   2. Ausbau: danach jeweils der Weg mit dem besten Nutzen pro Punkt (Angriff und Krit für Schaden, LP und Verteidigung für Tanks).
 *   3. Zuletzt: was übrig bleibt (für Schadensklassen vor allem Verteidigung, LP, Krit.-Widerstand und MP).
 * Mit offenen Knoten (Charakter-Check) startet die Route von dort aus.
 * Ariel (art "pve", eigene Ariel-Punkte, keine Skills): Kern sind die vier PvE-Schadensecken (Tanks: PvE-Resistenz),
 * dann die Boss-Schadensknoten. Azphel (art "pvp"): PvP-Schadensecken und Statuseffekt-Chance.
 */
(function () {
  const D = window.DK_DATA;
  const DV = D && D.daevanion;
  if (!DV) return;
  const PLAN = D.daevanionPlan || {};
  const ROLES = (D.audit && D.audit.roles) || {};
  const IMG = "https://assets.playnccdn.com/static-aion2/characters/img/";
  const clsIcon = (id) => IMG + "class/class_icon_" + (id === "spiritmaster" ? "elementalist" : id) + ".png";
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const fmt = (n) => Math.round(n).toLocaleString("de-DE");
  const KOSTEN = DV.kosten;
  const GRADE_DE = { c: "Gewöhnlich", r: "Selten", l: "Legendär", u: "Einzigartig" };

  /* ---------- Modell eines Bretts für eine Klasse ---------- */
  const cache = new Map();
  function model(cls, bi) {
    const key = cls + ":" + bi;
    if (cache.has(key)) return cache.get(key);
    const b = DV.boards[bi];
    const k = DV.klassen[cls];
    let si = 0;
    const nodes = b.nodes.map(([r, c, t, g, idx], i) => {
      const n = { i, r, c, t, g, cost: t === "S" ? 0 : KOSTEN[g] };
      if (t === "T") {
        const s = DV.stats[idx];
        n.en = s.en; n.name = s.de; n.eff = s.eff.join(", "); n.kurz = s.kurz;
      } else if (t === "K") {
        const sk = k.skills[k.map[bi][si++]];
        n.en = sk[0]; n.name = sk[1]; n.active = sk[2] === "a"; n.eff = `${sk[1]} +1`;
      } else {
        n.name = "Start";
      }
      return n;
    });
    const at = new Map(nodes.map((n) => [n.r * 100 + n.c, n]));
    nodes.forEach((n) => {
      n.nb = [[-1, 0], [1, 0], [0, -1], [0, 1]].map(([dr, dc]) => at.get((n.r + dr) * 100 + n.c + dc)).filter(Boolean);
    });
    const m = { board: b, bi, cls, nodes, at, start: nodes.find((n) => n.t === "S") };
    cache.set(key, m);
    return m;
  }

  /* ---------- Nutzen eines Knotens ---------- */
  const STAT_W = {
    dps: { "Attack": 1, "Critical Hit": 0.8, "Max HP": 0.25, "Defense": 0.2, "Critical Hit Resist": 0.15, "Max MP": 0.1 },
    tank: { "Attack": 0.5, "Critical Hit": 0.35, "Max HP": 1, "Defense": 0.9, "Critical Hit Resist": 0.6, "Max MP": 0.1 },
    heal: { "Attack": 0.9, "Critical Hit": 0.7, "Max HP": 0.45, "Defense": 0.3, "Critical Hit Resist": 0.2, "Max MP": 0.3 },
    hybrid: { "Attack": 0.9, "Critical Hit": 0.75, "Max HP": 0.4, "Defense": 0.3, "Critical Hit Resist": 0.2, "Max MP": 0.15 },
  };
  const PVP_W = { "PvP Attack": 1, "PvP Critical Hit": 0.8, "PvP Accuracy": 0.7, "PvP Defense": 0.55, "PvP Evasion": 0.35, "PvP Critical Hit Resist": 0.45 };
  const PVE_W = { "PvE Attack": 1, "Boss Attack": 0.9, "PvE Accuracy": 0.55, "Max HP": 0.25, "PvE Defense": 0.2, "Boss Defense": 0.2, "PvE Evasion": 0.15, "Max MP": 0.05 };
  const PVE_L = { "Boss Damage Boost": 3, "Critical Hit": 2.4, "Boss Damage Tolerance": 1.6, "Critical Hit Resist": 1.2 };
  /* Haupt-Ecken und Boss-Knoten von Ariel je Rolle */
  const arielMain = (role) => (role === "tank" ? ["PvE Damage Tolerance", "Boss Damage Tolerance"] : ["PvE Damage Boost", "Boss Damage Boost"]);
  function value(n, plan, role, pvp, art) {
    if (art === "pve") {
      if (n.t === "S") return 0;
      const main = arielMain(role);
      if (n.g === "u") return n.en === main[0] ? 7 : 4;
      if (n.g === "l") return n.en === main[1] ? 3 : PVE_L[n.en] || 1.5;
      return n.en.split(", ").reduce((a, s) => a + (PVE_W[s] || 0.2), 0);
    }
    if (n.t === "S") return 0;
    if (n.t === "K") {
      const ci = plan.core.indexOf(n.en);
      if (ci >= 0) return 9 - ci * 0.2;
      const pi = plan.passive.indexOf(n.en);
      if (pi >= 0) return 7 - pi * 0.3;
      if (n.en === "Defiance") return 0.3;
      return n.active ? 1.2 : 0.6;
    }
    if (pvp) {
      if (n.g === "u") return /Tolerance/.test(n.en) === (role === "tank") ? 7 : 5;
      if (n.g === "l") return /Chance/.test(n.en) ? 2.4 : 1.8;
      return n.en.split(", ").reduce((a, s) => a + (PVP_W[s] || 0.3), 0);
    }
    if (n.g === "u") {
      const r = plan.corners.indexOf(n.en);
      return r >= 0 ? 8 - r * 0.4 : 1;
    }
    const w = STAT_W[role] || STAT_W.dps;
    return w[n.en] != null ? w[n.en] : 0.2;
  }

  /* Günstigste Wege von allen offenen Knoten aus; bei gleichen Kosten der Weg mit mehr Nutzen */
  function paths(m, owned, val) {
    const N = m.nodes.length;
    const dist = new Array(N).fill(Infinity), gain = new Array(N).fill(-Infinity), prev = new Array(N).fill(-1), done = new Uint8Array(N);
    owned.forEach((i) => { dist[i] = 0; gain[i] = 0; });
    for (;;) {
      let u = -1;
      for (let i = 0; i < N; i++) {
        if (done[i] || dist[i] === Infinity) continue;
        if (u < 0 || dist[i] < dist[u] || (dist[i] === dist[u] && gain[i] > gain[u])) u = i;
      }
      if (u < 0) break;
      done[u] = 1;
      for (const v of m.nodes[u].nb) {
        if (owned.has(v.i)) continue;
        const d = dist[u] + v.cost, g = gain[u] + val[v.i];
        if (d < dist[v.i] || (d === dist[v.i] && g > gain[v.i])) { dist[v.i] = d; gain[v.i] = g; prev[v.i] = u; }
      }
    }
    return { dist, gain, prev };
  }

  /* Route berechnen. open: Indizes bereits offener Knoten (Charakter-Check) */
  function route(cls, bi, open) {
    const m = model(cls, bi);
    const plan = PLAN[cls] || { core: [], passive: [], corners: [] };
    const role = ROLES[cls] || "dps";
    const pvp = !!m.board.pvp;
    const art = m.board.art || (pvp ? "pvp" : "skill");
    const val = m.nodes.map((n) => value(n, plan, role, pvp, art));
    const owned = new Set([m.start.i].concat(open || []));
    const opened = new Set(owned);
    const steps = [];
    let cum = 0;
    const take = (path, tier) => path.forEach((i) => { owned.add(i); cum += m.nodes[i].cost; steps.push({ i, tier, cum }); });
    const pathTo = (res, t) => { const p = []; for (let x = t; x >= 0 && !owned.has(x); x = res.prev[x]) p.push(x); return p.reverse(); };

    let tiers;
    if (art === "pve") {
      const main = arielMain(role);
      tiers = [
        m.nodes.filter((n) => n.g === "u" && n.en === main[0]),
        m.nodes.filter((n) => n.g === "l" && n.en === main[1]),
      ];
    } else if (pvp) {
      const main = role === "tank" ? "PvP Damage Tolerance" : "PvP Damage Boost";
      tiers = [
        m.nodes.filter((n) => n.g === "u" && n.en === main),
        m.nodes.filter((n) => n.g === "l" && n.en === "Status Effect Chance"),
      ];
    } else {
      tiers = [
        m.nodes.filter((n) => n.t === "K" && (plan.core.includes(n.en) || n.en === plan.passive[0])),
        m.nodes.filter((n) => n.t === "T" && n.g === "u" && plan.corners.includes(n.en)),
        m.nodes.filter((n) => n.t === "K" && plan.passive.slice(1).includes(n.en)),
      ];
    }
    for (const targets of tiers) {
      let left = targets.filter((n) => !owned.has(n.i));
      while (left.length) {
        const res = paths(m, owned, val);
        left.sort((a, b) => res.dist[a.i] - res.dist[b.i] || val[b.i] - val[a.i]);
        if (res.dist[left[0].i] === Infinity) break;
        take(pathTo(res, left[0].i), "kern");
        left = left.filter((n) => !owned.has(n.i));
      }
    }
    while (owned.size < m.nodes.length) {
      const res = paths(m, owned, val);
      let best = -1, score = -1;
      for (const n of m.nodes) {
        if (owned.has(n.i) || res.dist[n.i] === Infinity) continue;
        const sc = res.gain[n.i] / res.dist[n.i];
        if (sc > score + 1e-9) { score = sc; best = n.i; }
      }
      if (best < 0) break;
      take(pathTo(res, best), score >= 0.45 ? "ausbau" : "rest");
    }
    const sum = (tier) => steps.filter((s) => s.tier === tier).reduce((a, s) => a + m.nodes[s.i].cost, 0);
    return { m, plan, role, pvp, art, steps, opened, cost: { kern: sum("kern"), ausbau: sum("ausbau"), rest: sum("rest") } };
  }

  /* ---------- Bild ---------- */
  const COL = {
    bg: "#0d1013", frame: "#2a3038", edge: "#262c33", edgeOn: "#7d6a43", edgeOpen: "#d4b06a",
    c: "#8e949c", r: "#52b35c", l: "#3d94d8", u: "#e9a43a",
    kern: "#e3c27a", kernFill: "#2a2416", ausbau: "#6cc3bb", ausbauFill: "#132126",
    restFill: "#151a1f", text: "#ece8df", muted: "#6f7680", open: "#d4b06a",
  };
  const FONT = "Archivo, Segoe UI, Arial, sans-serif";

  /* r: Ergebnis von route(); opt: { limit: wie viele Schritte nummeriert werden, export: mit Kopf- und Fußzeile } */
  function svg(r, opt) {
    opt = opt || {};
    const m = r.m;
    const cell = 46, pad = 18;
    const rs = m.nodes.map((n) => n.r), cs = m.nodes.map((n) => n.c);
    const r0 = Math.min(...rs), r1 = Math.max(...rs), c0 = Math.min(...cs), c1 = Math.max(...cs);
    const head = opt.export ? 74 : 0, foot = opt.export ? 40 : 0;
    const W = (c1 - c0 + 1) * cell + pad * 2, H = (r1 - r0 + 1) * cell + pad * 2 + head + foot;
    const X = (n) => pad + (n.c - c0) * cell + cell / 2, Y = (n) => head + pad + (n.r - r0) * cell + cell / 2;
    const limit = opt.limit == null ? Infinity : opt.limit;
    const step = new Map();
    r.steps.forEach((s, k) => { if (k < limit && s.tier !== "rest") step.set(s.i, { k: k + 1, tier: s.tier }); });
    const lit = (i) => r.opened.has(i) || step.has(i);
    let out = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}" font-family="${FONT}" role="img" aria-label="${esc(opt.label || "Daevanion-Brett")}">`;
    out += `<rect x="0" y="0" width="${W}" height="${H}" rx="14" fill="${COL.bg}"/>`;
    out += `<rect x="${pad / 2}" y="${head + pad / 2}" width="${W - pad}" height="${H - head - foot - pad}" rx="10" fill="none" stroke="${COL.frame}"/>`;
    if (opt.export) {
      out += `<text x="${pad}" y="34" fill="${COL.text}" font-size="22" font-weight="700">${esc(opt.title || "")}</text>`;
      out += `<text x="${pad}" y="58" fill="${COL.muted}" font-size="14">${esc(opt.sub || "")}</text>`;
      out += `<text x="${pad}" y="${H - 16}" fill="${COL.muted}" font-size="12">${esc(opt.footer || "")}</text>`;
    }
    /* Verbindungen */
    for (const n of m.nodes) {
      for (const v of n.nb) {
        if (v.i < n.i) continue;
        const both = lit(n.i) && lit(v.i);
        const open = r.opened.has(n.i) && r.opened.has(v.i);
        out += `<line x1="${X(n)}" y1="${Y(n)}" x2="${X(v)}" y2="${Y(v)}" stroke="${open ? COL.edgeOpen : both ? COL.edgeOn : COL.edge}" stroke-width="${both ? 3 : 2}" stroke-linecap="round"/>`;
      }
    }
    /* Knoten */
    for (const n of m.nodes) {
      const x = X(n), y = Y(n);
      const s = step.get(n.i);
      const isOpen = r.opened.has(n.i);
      const grade = COL[n.g] || COL.c;
      let stroke = grade, fill = COL.restFill, sw = 1.6, txt = "", tcol = COL.muted, tsize = 10, op = 1;
      if (isOpen) { fill = grade; stroke = "#f3e7c7"; sw = 1.4; }
      else if (s) {
        fill = s.tier === "kern" ? COL.kernFill : COL.ausbauFill;
        stroke = s.tier === "kern" ? COL.kern : COL.ausbau;
        sw = 2.6; txt = String(s.k); tcol = s.tier === "kern" ? "#f6e3b4" : "#bfe9e4"; tsize = s.k > 99 ? 12 : 14;
      } else {
        op = 0.62;
        if (n.t === "T") { txt = n.kurz; tsize = n.kurz.length > 3 ? 8 : 9.5; }
      }
      const title = `${s ? s.k + ". " : ""}${n.t === "S" ? "Start" : n.eff}${n.t === "K" ? (n.active ? " (aktiv)" : " (passiv)") : ""}${n.cost ? ` · ${n.cost} ${n.cost === 1 ? "Punkt" : "Punkte"}` : ""}${isOpen ? " · offen" : ""}`;
      out += `<g data-dvn="${n.i}" opacity="${op}"><title>${esc(title)}</title>`;
      if (n.t === "S") {
        const h = cell * 0.36;
        out += `<path d="M${x} ${y - h}L${x + h} ${y}L${x} ${y + h}L${x - h} ${y}Z" fill="#d4b06a" stroke="#f3e7c7" stroke-width="1.5"/>`;
        out += `<path d="M${x} ${y - h * 0.45}L${x + h * 0.45} ${y}L${x} ${y + h * 0.45}L${x - h * 0.45} ${y}Z" fill="#0d1013"/>`;
      } else if (n.t === "K") {
        const rad = cell * (n.g === "l" ? 0.33 : 0.29);
        out += `<circle cx="${x}" cy="${y}" r="${rad}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"/>`;
        if (!isOpen) out += `<circle cx="${x}" cy="${y}" r="${rad - 4}" fill="none" stroke="${grade}" stroke-width="1" opacity="0.8"/>`;
      } else {
        const big = n.g === "u", size = cell * (big ? 0.78 : n.g === "c" ? 0.56 : 0.64), h = size / 2;
        out += `<rect x="${x - h}" y="${y - h}" width="${size}" height="${size}" rx="${big ? 7 : 5}" fill="${fill}" stroke="${stroke}" stroke-width="${sw}"/>`;
        if (big && !isOpen) out += `<rect x="${x - h + 4}" y="${y - h + 4}" width="${size - 8}" height="${size - 8}" rx="4" fill="none" stroke="${grade}" stroke-width="1"/>`;
      }
      if (isOpen) out += `<path d="M${x - 5} ${y}l3.5 3.5l6.5 -7" fill="none" stroke="#0d1013" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round"/>`;
      else if (txt) out += `<text x="${x}" y="${y + tsize * 0.36}" text-anchor="middle" font-size="${tsize}" font-weight="700" fill="${tcol}">${esc(txt)}</text>`;
      out += `</g>`;
    }
    out += `</svg>`;
    return { svg: out, W, H, start: { x: X(m.start), y: Y(m.start) }, cell };
  }

  /* PNG aus dem SVG (nur eigene Formen, keine fremden Bilder – sonst ließe sich das Bild nicht speichern) */
  function savePng(r, opt, file) {
    const out = svg(r, Object.assign({}, opt, { export: true }));
    const img = new Image();
    const url = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(out.svg);
    return new Promise((resolve, reject) => {
      img.onload = () => {
        const scale = 2;
        const cv = document.createElement("canvas");
        cv.width = out.W * scale; cv.height = out.H * scale;
        const ctx = cv.getContext("2d");
        ctx.scale(scale, scale);
        ctx.drawImage(img, 0, 0);
        cv.toBlob((blob) => {
          if (!blob) { reject(new Error("kein Bild")); return; }
          const a = document.createElement("a");
          a.href = URL.createObjectURL(blob);
          a.download = file;
          document.body.appendChild(a);
          a.click();
          setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
          resolve();
        }, "image/png");
      };
      img.onerror = () => reject(new Error("Bild nicht erzeugt"));
      img.src = url;
    });
  }

  /* ---------- HTML-Bausteine ---------- */
  function boardFigure(r, opt) {
    const o = svg(r, opt);
    const emblem = opt && opt.cls ? `<img class="dv-emblem" src="${esc(clsIcon(opt.cls))}" alt="" style="left:${(o.start.x / o.W * 100).toFixed(2)}%;top:${(o.start.y / o.H * 100).toFixed(2)}%;width:${(o.cell * 0.95 / o.W * 100).toFixed(2)}%">` : "";
    return `<div class="dv-figure">${o.svg}${emblem}</div>`;
  }

  function legendHtml(r, withOpen) {
    const used = new Map();
    r.m.nodes.forEach((n) => { if (n.t === "T") used.set(n.kurz, n.name); });
    return `<ul class="dv-legend">
      ${withOpen ? '<li><span class="dv-key dv-key--open"></span>schon offen</li>' : ""}
      <li><span class="dv-key dv-key--kern">1</span>Kern-Route, in dieser Reihenfolge</li>
      <li><span class="dv-key dv-key--ausbau">9</span>Ausbau danach</li>
      <li><span class="dv-key dv-key--rest"></span>zuletzt</li>
      <li><span class="dv-shape dv-shape--sq"></span>Wert</li>
      ${r.m.nodes.some((n) => n.t === "K") ? '<li><span class="dv-shape dv-shape--ci"></span>Skill-Stufe</li>' : ""}
      <li><span class="dv-cost">1 · 2 · 3 · 4 Punkte</span>grau · grün · blau · orange</li>
    </ul>
    <p class="dv-abbr">${[...used].map(([k, v]) => `<span><b>${esc(k)}</b> ${esc(v)}</span>`).join("")}</p>`;
  }

  function stepRows(r, list) {
    return list.map((s) => {
      const n = r.m.nodes[s.i];
      return `<li class="dv-step dv-step--${s.tier}" data-dvn="${n.i}">
        <span class="dv-no">${r.steps.indexOf(s) + 1}</span>
        <span class="dv-what"><span class="dv-mark dv-mark--${n.t === "K" ? "ci" : "sq"} dv-g-${n.g}"></span><span class="dv-tx">${esc(n.t === "K" ? n.name : n.eff)}${n.t === "K" ? ` <small>${n.active ? "aktiv" : "passiv"}</small>` : ""}</span></span>
        <span class="dv-pts">${n.cost}</span>
        <span class="dv-sum">${s.cum}</span>
      </li>`;
    }).join("");
  }

  function summarize(r, list) {
    const count = new Map();
    list.forEach((s) => {
      const n = r.m.nodes[s.i];
      const k = n.t === "K" ? "Skill-Stufen" : n.name;
      count.set(k, (count.get(k) || 0) + 1);
    });
    return [...count].sort((a, b) => b[1] - a[1]).map(([k, v]) => `${v}× ${k}`).join(" · ");
  }

  /* ---------- Ansicht „Daevanion“ ---------- */
  const view = { cls: null, bi: 0, r: null };

  function readUrl() {
    const p = new URLSearchParams(location.search);
    const k = p.get("klasse"), b = p.get("brett");
    if (k && DV.klassen[k]) view.cls = k;
    const bi = DV.boards.findIndex((x) => x.key === b);
    if (bi >= 0) view.bi = bi;
  }

  function shareLink() {
    return `${location.origin}${location.pathname}?klasse=${view.cls}&brett=${DV.boards[view.bi].key}#daevanion`;
  }

  function render() {
    const host = document.getElementById("dv-app");
    if (!host) return;
    if (!view.cls) view.cls = (window.DK_APP && window.DK_APP.status().cls) || "spiritmaster";
    const cls = view.cls;
    const c = D.classes.find((x) => x.id === cls) || { name: cls, de: cls };
    const plan = PLAN[cls] || {};
    const all = DV.boards.map((b, i) => route(cls, i));
    const r = all[view.bi];
    view.r = r;
    const b = DV.boards[view.bi];
    const kern = r.steps.filter((s) => s.tier === "kern");
    const aus = r.steps.filter((s) => s.tier === "ausbau");
    const rest = r.steps.filter((s) => s.tier === "rest");
    const skillBoards = all.filter((x) => x.art === "skill");
    const kernSum = skillBoards.reduce((a, x) => a + x.cost.kern, 0);
    const TAG = { pvp: " · PvP", pve: " · Ariel-Punkte" };
    /* Ariel: wie viele Kern-Schritte die 30 Ariel-Punkte heute abdecken */
    const AR = D.ariel || {};
    const arielReach = r.art === "pve" && AR.punkteMax ? r.steps.filter((s) => s.cum <= AR.punkteMax).length : 0;
    const coreNames = (plan.core || []).map((en) => (DV.klassen[cls].skills.find((s) => s[0] === en) || [en, en])[1]);
    const passNames = (plan.passive || []).map((en) => (DV.klassen[cls].skills.find((s) => s[0] === en) || [en, en])[1]);
    const cornerNames = (plan.corners || []).map((en) => (DV.stats.find((s) => s.en === en) || { de: en }).de);

    let h = `<div class="cls-tabs dv-cls" role="tablist" aria-label="Klasse">` + D.classes.map((x) =>
      `<button type="button" role="tab" class="cls-tab${x.id === cls ? " is-on" : ""}" aria-selected="${x.id === cls}" data-dv="cls" data-id="${x.id}">
        <img class="cls-tab-ico" src="${esc(clsIcon(x.id))}" alt="" loading="lazy" decoding="async"><span class="cls-tab-name">${esc(x.de)}</span></button>`).join("") + `</div>`;

    h += `<div class="dv-boards" role="tablist" aria-label="Brett">` + DV.boards.map((x, i) =>
      `<button type="button" role="tab" class="dv-tab${i === view.bi ? " is-on" : ""}" aria-selected="${i === view.bi}" data-dv="board" data-i="${i}">
        <span class="dv-tab-name">${esc(x.name)}${x.art === "pve" ? ' <span class="dv-new">neu</span>' : ""}</span><span class="dv-tab-sub">ab Level ${x.level}${TAG[all[i].art] || ""} · Kern ${all[i].cost.kern} P.</span></button>`).join("") + `</div>`;

    h += `<div class="dv-layout">
      <div class="dv-board">
        ${boardFigure(r, { cls, label: `${c.de}: ${b.name}, empfohlene Route` })}
        ${legendHtml(r, false)}
        <div class="dv-actions">
          <button type="button" class="btn" data-dv="png">Als Bild speichern</button>
          <button type="button" class="btn btn--ghost" data-dv="link">Link kopieren</button>
          <input class="dv-share" type="text" readonly value="${esc(shareLink())}" aria-label="Link zu diesem Brett" hidden>
        </div>
        <p class="dv-info" id="dv-info" aria-live="polite">Tipp: Knoten antippen zeigt, was er gibt.</p>
      </div>
      <div class="dv-plan">
        <h2>${esc(c.de)} · ${esc(b.name)}</h2>
        <p class="dv-meta">${b.punkte} Punkte für das ganze Brett · Kern-Route <b>${r.cost.kern}</b> · Ausbau <b>${r.cost.ausbau}</b> · zuletzt ${r.cost.rest}</p>
        ${r.art === "pvp"
          ? `<p>Azphel ist das PvP-Brett und hat eigene Punkte (Azphel-Kristalle aus Abyss, Arena und Monolithen). Es nimmt den anderen Brettern nichts weg. Für PvE bringt es nichts.</p>`
          : r.art === "pve"
            ? `<p>${esc(AR.text || "Ariel ist das PvE-Brett mit eigenen Ariel-Punkten.")}</p>
               ${AR.punkteMax ? `<p class="dv-note">Mit den derzeit höchstens <b>${AR.punkteMax}</b> Ariel-Punkten reichen die Punkte für die ersten <b>${arielReach}</b> Schritte unten (Summe bis ${AR.punkteMax}). ${esc(AR.hinweis || "")}</p>` : ""}`
            : `<p>Kern-Skills: ${esc(coreNames.join(", "))}. Passive: ${esc(passNames.join(", "))}. Ecken: ${esc(cornerNames.join(", "))}.</p>`}
        ${plan.hinweis && r.art === "skill" ? `<p class="dv-note">${esc(plan.hinweis)}</p>` : ""}
        <h3>Kern-Route · ${r.cost.kern} Punkte</h3>
        <ol class="dv-steps" aria-label="Kern-Route">
          <li class="dv-step dv-step--head"><span class="dv-no">Nr.</span><span class="dv-what">Knoten</span><span class="dv-pts">Punkte</span><span class="dv-sum">Summe</span></li>
          ${stepRows(r, kern)}
        </ol>
        <details class="dv-more"><summary>Ausbau · ${r.cost.ausbau} Punkte (${aus.length} Knoten)</summary>
          <p class="small muted">${esc(summarize(r, aus))}</p>
          <ol class="dv-steps">${stepRows(r, aus)}</ol>
        </details>
        <p class="small muted">Zuletzt · ${r.cost.rest} Punkte: ${esc(summarize(r, rest)) || "–"}</p>
      </div>
    </div>`;

    h += `<section class="dv-total" aria-label="Alle Bretter">
      <h3>Punkte für die Kern-Routen</h3>
      <table class="tbl"><thead><tr><th scope="col">Brett</th><th scope="col">ab Level</th><th scope="col">Kern</th><th scope="col">mit Ausbau</th><th scope="col">ganzes Brett</th></tr></thead><tbody>
      ${all.map((x, i) => `<tr${i === view.bi ? ' class="is-on"' : ""}><th scope="row">${esc(DV.boards[i].name)}${x.art === "pvp" ? " (PvP)" : x.art === "pve" ? " (Ariel-Punkte)" : ""}</th><td class="num">${DV.boards[i].level}</td><td class="num">${x.cost.kern}</td><td class="num">${x.cost.kern + x.cost.ausbau}</td><td class="num">${DV.boards[i].punkte}</td></tr>`).join("")}
      </tbody></table>
      <p class="small muted">Die Kern-Routen der vier Skill-Bretter kosten zusammen <b>${kernSum}</b> Daevanion-Punkte. Alle vier voll kosten 570, der Vorrat ist bei 840 gedeckelt. Punkte gibt es pro Level, für versiegelte Dungeons (2) und regionale Quests (1). Ariel und Azphel haben eigene Punkte und nehmen den Skill-Brettern nichts weg.</p>
    </section>`;

    h += `<p class="fine">Prioritäten: ${esc(plan.quelle || "Guides")}, zusammengefasst bei aion2vault.com, und die Klassen-Analyse von Metabot. Die Reihenfolge berechnet die Seite selbst: immer der günstigste Weg vom Start (Knoten kosten 1, 2, 3 oder 4 Punkte) zum nächsten Kern-Knoten. Brett-Daten aus dem GameWith-Daevanion-Planer, für den Beschwörer gegen die offizielle Armory geprüft; Ariel aus den Client-Daten (questlog.gg über AION2 Vault, gegen die übrigen Bretter abgeglichen). Eine Empfehlung, keine Formel von NCSOFT.</p>`;
    host.innerHTML = h;
  }

  function nodeInfo(i) {
    const r = view.r;
    const info = document.getElementById("dv-info");
    if (!r || !info) return;
    const n = r.m.nodes[i];
    const k = r.steps.findIndex((s) => s.i === i);
    const s = r.steps[k];
    const tier = s ? { kern: "Kern-Route", ausbau: "Ausbau", rest: "zuletzt" }[s.tier] : "Start";
    info.textContent = n.t === "S" ? "Startknoten – ist immer offen." :
      `${k + 1}. ${n.t === "K" ? `${n.name} +1 (${n.active ? "aktiver" : "passiver"} Skill)` : n.eff} · ${n.cost} ${n.cost === 1 ? "Punkt" : "Punkte"} · ${GRADE_DE[n.g]} · ${tier}${s ? `, Summe bis hier ${s.cum}` : ""}`;
  }

  function onClick(e) {
    const b = e.target.closest("[data-dv]");
    const nodeEl = e.target.closest("#dv-app [data-dvn]");
    if (!b && nodeEl) { nodeInfo(Number(nodeEl.getAttribute("data-dvn"))); return; }
    if (!b) return;
    const act = b.getAttribute("data-dv");
    if (act === "cls") { view.cls = b.getAttribute("data-id"); render(); updateUrl(); }
    else if (act === "board") { view.bi = Number(b.getAttribute("data-i")); render(); updateUrl(); }
    else if (act === "png" && view.r) {
      const c = D.classes.find((x) => x.id === view.cls) || { de: view.cls };
      const bd = DV.boards[view.bi];
      b.disabled = true;
      savePng(view.r, {
        title: `${c.de} · ${bd.name} · empfohlene Route`,
        sub: `Kern ${view.r.cost.kern} Punkte (gold, nummeriert) · Ausbau ${view.r.cost.ausbau} Punkte (türkis)`,
        footer: "Daeva-Kompass · aion2.philipmax-hain.workers.dev",
      }, `daevanion-${view.cls}-${bd.key}.png`).then(() => { b.textContent = "Bild gespeichert"; }, () => { b.textContent = "Speichern nicht möglich"; })
        .then(() => { b.disabled = false; });
    } else if (act === "link") {
      const input = document.querySelector("#dv-app .dv-share");
      const done = () => { b.textContent = "Link kopiert"; };
      const fallback = () => { input.hidden = false; input.select(); b.textContent = "Link markiert"; };
      try {
        const p = navigator.clipboard && navigator.clipboard.writeText(input.value);
        if (p && p.then) p.then(done, fallback); else fallback();
      } catch (err) { fallback(); }
    }
  }

  function updateUrl() {
    if (!/^https?:$/.test(location.protocol) || location.hash !== "#daevanion") return;
    try { history.replaceState(null, "", `?klasse=${view.cls}&brett=${DV.boards[view.bi].key}#daevanion`); } catch (e) { /* egal */ }
  }

  /* Für andere Teile der Seite: Ansicht mit Klasse öffnen, Route für einen Charakter */
  window.DK_DV = {
    route, svg, boardFigure, legendHtml, stepRows,
    show(cls, bi) {
      if (cls && DV.klassen[cls]) view.cls = cls;
      if (bi != null) view.bi = bi;
      render();
      if (window.DK_APP) window.DK_APP.go("daevanion");
      updateUrl();
    },
    boardIndex: (name) => DV.boards.findIndex((x) => x.key === String(name || "").toLowerCase()),
  };

  function init() {
    readUrl();
    render();
    document.addEventListener("click", onClick);
    window.addEventListener("hashchange", () => { if (location.hash === "#daevanion") updateUrl(); });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
