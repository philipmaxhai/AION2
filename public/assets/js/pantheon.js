/*
 * Ansicht „Pantheon“: welche Teile du hast (im Browser abgehakt), wie die 17 Plätze am besten belegt sind
 * (1 Koloss, 4 Statuen, 12 Kunstwerke), was die Götter-Werte zusammen bringen und welches Teil als Nächstes lohnt.
 * Daten: DK_DATA.pantheon (data.js, kuratiert). Der Charakter-Check meldet über DK_PT.fromCharacter
 * Fraktion und Götter-Werte aus der Armory (dort zählen alle Quellen zusammen: Pantheon, Arkana, Armband, Monolithen).
 * Link: #pantheon
 */
(function () {
  const D = window.DK_DATA;
  const P = D && D.pantheon;
  if (!P) return;

  const KEY = "dk.pantheon";
  const TYPES = ["koloss", "statue", "kunstwerk"];
  const FAC = { elyos: "Elyos", asmo: "Asmodier" };
  const KEYS = Object.keys(P.werte);
  /* Für die Reihenfolge innerhalb einer Stufe: Schaden zuerst (Wucht, Angriffskraft, Kampftempo), dann Krit. und Abklingzeit */
  const W = { wisdom: 1, destruction: 1, time: 0.9, death: 0.7, illusion: 0.5, freedom: 0.3, justice: 0.2, space: 0.15, destiny: 0.1, life: 0.1 };
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const pct = (v) => (Math.round(v) / 10).toLocaleString("de-DE", { maximumFractionDigits: 1 });
  const short = (k) => P.werte[k][0].replace(/\s*\[.*\]$/, "");
  const pieces = P.teile.map((t, i) => Object.assign({ i }, t));
  const byName = new Map(pieces.map((t) => [t.name, t]));

  /* ---------- Zustand ---------- */
  function load() {
    try {
      const s = JSON.parse(localStorage.getItem(KEY) || "{}");
      return { have: s.have && typeof s.have === "object" ? s.have : {}, fac: s.fac || null, aktiv: s.aktiv || null };
    } catch (e) { return { have: {}, fac: null, aktiv: null }; }
  }
  let S = load();
  function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* Speicher gesperrt */ } }
  const owns = (t) => Object.prototype.hasOwnProperty.call(S.have, t.name);
  const variant = (t) => (t.oder ? (t.oder.includes(S.have[t.name]) ? S.have[t.name] : t.oder[0]) : null);

  function faction() {
    if (S.fac === "elyos" || S.fac === "asmo") return S.fac;
    if (S.aktiv && FAC[S.aktiv.faction]) return S.aktiv.faction;
    const st = window.DK_APP && window.DK_APP.status && window.DK_APP.status();
    return st && FAC[st.faction] ? st.faction : "elyos";
  }
  const forFac = (t, fac) => !t.fraktion || t.fraktion === fac;

  /* ---------- Rechnen ---------- */
  /* Werte eines Teils; bei „oder“ trägt es zusätzlich einen der genannten Werte in gleicher Höhe */
  function statsOf(t, v) {
    const out = Object.assign({}, t.werte);
    if (t.oder) out[v || variant(t)] = Math.max(...Object.values(t.werte));
    return out;
  }
  const score = (t) => Object.entries(statsOf(t)).reduce((a, [k, v]) => a + (W[k] || 0) * v, 0);
  const better = (a, b) => a.stufe - b.stufe || score(b) - score(a) || a.i - b.i;

  /* Belegung: je Platzart die besten Teile; ohne Abhaken die Ziel-Aufstellung deiner Fraktion */
  function lineup(list) {
    const out = {};
    TYPES.forEach((ty) => { out[ty] = list.filter((t) => t.typ === ty).sort(better).slice(0, P.plaetze[ty]); });
    return out;
  }
  function sum(lu) {
    const s = Object.fromEntries(KEYS.map((k) => [k, 0]));
    TYPES.forEach((ty) => lu[ty].forEach((t) => { Object.entries(statsOf(t)).forEach(([k, v]) => { s[k] += v; }); }));
    return s;
  }

  /* Nächste Schritte je Platzart: freie Plätze zuerst füllen, dann das schwächste belegte Teil tauschen.
   * Was schnell zu haben ist (Quest, Erfolg, Albtraum-Shop, billig im Markt), kommt vor dem Besten. */
  const quick = (a, b) => (b.leicht ? 1 : 0) - (a.leicht ? 1 : 0) || better(a, b);
  function plan(fac, mine) {
    const out = {};
    TYPES.forEach((ty) => {
      const placed = mine[ty];
      const cands = pieces.filter((t) => t.typ === ty && forFac(t, fac) && !owns(t)).sort(quick);
      const free = Math.max(0, P.plaetze[ty] - placed.length);
      const fill = cands.slice(0, free).map((t) => ({ t, frei: true }));
      const used = new Set(fill.map((x) => x.t));
      const worst = placed.slice().sort(better).reverse();
      const swap = [];
      cands.filter((t) => !used.has(t)).forEach((t) => {
        const old = worst[swap.length];
        if (old && better(t, old) < 0) swap.push({ t, statt: old });
      });
      out[ty] = fill.concat(swap);
    });
    return out;
  }
  function nextSteps(steps) {
    const order = TYPES.slice().sort((a, b) => (steps[b][0] && steps[b][0].frei ? 1 : 0) - (steps[a][0] && steps[a][0].frei ? 1 : 0));
    return order.flatMap((ty) => steps[ty].slice(0, 3));
  }

  /* ---------- Bausteine ---------- */
  const tag = (ty) => `<span class="pt-tag pt-tag--${ty}">${esc(P.typen[ty])}</span>`;
  const facTag = (t) => (t.fraktion ? ` <span class="pt-fac">${FAC[t.fraktion]}</span>` : "");
  const newTag = (t) => (t.neu ? ' <span class="dv-new">neu</span>' : "");
  function statLine(t, v) {
    const s = statsOf(t, v);
    return Object.keys(s).sort((a, b) => KEYS.indexOf(a) - KEYS.indexOf(b)).map((k) =>
      `<span class="pt-st${P.schaden.includes(k) ? " is-dmg" : ""}">${esc(short(k))} ${s[k]}</span>`).join("");
  }
  const orLine = (t) => (t.oder ? `<small class="pt-or">dazu ${t.oder.map((k) => esc(short(k))).join(" oder ")}</small>` : "");

  function kpis(mine, total, have) {
    const used = TYPES.reduce((a, ty) => a + mine[ty].length, 0);
    const slots = TYPES.reduce((a, ty) => a + P.plaetze[ty], 0);
    const deathStatues = mine.statue.filter((t) => statsOf(t).death).length;
    const both = mine.kunstwerk.filter((t) => t.werte.wisdom && t.werte.illusion).length;
    const tile = (dt, dd, sub) => `<div><dt>${dt}</dt><dd><b>${dd}</b>${sub ? `<span>${sub}</span>` : ""}</dd></div>`;
    let h = tile("Plätze belegt", `${used} <small>von ${slots}</small>`, have ? `Koloss ${mine.koloss.length}/1 · Statuen ${mine.statue.length}/4 (${deathStatues} mit Tod) · Kunstwerke ${mine.kunstwerk.length}/12 (${both} mit Weisheit und Illusion)` : "Hak unten ab, was du im Pantheon hast");
    h += tile("Weisheit · Zerstörung · Zeit", `+${total.wisdom} · +${total.destruction} · +${total.time}`, `aus deinen Teilen: Wucht +${pct(total.wisdom)} %, Angriffskraft +${pct(total.destruction)} %, Kampftempo +${pct(total.time)} %`);
    h += tile("Tod · Illusion", `+${total.death} · +${total.illusion}`, `Krit.-Treffer +${pct(total.death)} %, Abklingzeit −${pct(total.illusion)} %`);
    return `<dl class="sk-facts bg-facts pt-facts">${h}</dl>`;
  }

  function stepsHtml(all) {
    const steps = nextSteps(all);
    const head = `<header class="sk-sec-head"><h3 id="pt-next-h">Als Nächstes</h3><p>Erst jeden Platz füllen, dann das schwächste Teil tauschen – je Platzart bis zu drei Schritte. Was schnell zu haben ist (Quest, Erfolg, Albtraum-Shop, billig im Markt), steht vorn; danach nach Stufe aus den Quellen und Schaden (Weisheit, Zerstörung und Zeit zählen am meisten).</p></header>`;
    if (!steps.length) return `<section class="sk-sec" id="pt-next" aria-labelledby="pt-next-h">${head}<p class="bg-done">Deine Aufstellung ist so gut, wie es die bekannten Teile deiner Fraktion erlauben.</p></section>`;
    const rows = steps.map((s, i) => `<li class="pt-step">
      <span class="bg-zone-no">${i + 1}</span>
      <div class="pt-step-b">
        <p class="bg-nm"><b>${esc(s.t.name)}</b> ${tag(s.t.typ)} <span class="pt-grade">${esc(s.t.grad)}</span>${facTag(s.t)}${newTag(s.t)}${s.t.leicht ? ' <span class="bg-ok">schnell</span>' : ""}</p>
        <p class="pt-sts">${statLine(s.t)}${orLine(s.t)}</p>
        <p class="pt-src">${esc(s.t.quelle)}</p>
        <p class="pt-why">${s.frei ? `Füllt einen freien ${esc(P.typen[s.t.typ])}-Platz.` : `Ersetzt ${esc(s.statt.name)} (${esc(s.statt.grad)}).`}</p>
      </div>
    </li>`).join("");
    return `<section class="sk-sec" id="pt-next" aria-labelledby="pt-next-h">${head}<ol class="pt-steps">${rows}</ol></section>`;
  }

  function slotsHtml(fac, mine, steps, have) {
    const col = (ty) => {
      const list = mine[ty];
      const target = steps[ty].filter((s) => s.frei).map((s) => s.t);
      const rows = [];
      for (let k = 0; k < P.plaetze[ty]; k++) {
        const t = list[k];
        if (t) rows.push(`<li class="pt-slot is-own"><span class="pt-slot-n">${k + 1}</span><span><span class="bg-nm"><b>${esc(t.name)}</b> <span class="pt-grade">${esc(t.grad)}</span></span><span class="pt-sts">${statLine(t)}</span></span></li>`);
        else {
          const sug = target.shift();
          rows.push(`<li class="pt-slot"><span class="pt-slot-n">${k + 1}</span><span><span class="bg-nm"><span class="muted">frei</span>${sug ? ` · Vorschlag <b>${esc(sug.name)}</b>` : ""}</span>${sug ? `<span class="pt-sts">${statLine(sug)}</span>` : ""}</span></li>`);
        }
      }
      return `<div class="pt-col"><h4>${esc(P.typen[ty])} <span class="muted">${list.length}/${P.plaetze[ty]}</span></h4><p class="sk-hint">${esc(P.punkte[ty])}</p><ol class="pt-slots">${rows.join("")}</ol></div>`;
    };
    return `<section class="sk-sec" id="pt-plaetze" aria-labelledby="pt-plaetze-h">
      <header class="sk-sec-head"><h3 id="pt-plaetze-h">${have ? "Deine Plätze" : `Ziel-Aufstellung · ${FAC[fac]}`}</h3>
        <p>${have ? "Die besten deiner abgehakten Teile, je Platzart sortiert. Freie Plätze zeigen den nächsten Vorschlag." : "Noch nichts abgehakt: so sieht die beste bekannte Aufstellung für deine Fraktion aus. Alle Klassen belegen das Pantheon gleich: der beste Koloss, vier Statuen mit Tod, zwölf Kunstwerke mit Weisheit und Illusion."}</p></header>
      <div class="pt-cols">${TYPES.map(col).join("")}</div>
    </section>`;
  }

  function statsHtml(total, ziel) {
    const ch = S.aktiv && S.aktiv.werte;
    const zs = sum(ziel);
    const rows = KEYS.map((k) => {
      const w = P.werte[k];
      const dmg = P.schaden.indexOf(k);
      return `<tr${dmg >= 0 ? ' class="is-dmg"' : ""}><th scope="row"><span class="pt-wname">${esc(short(k))}</span><small>${esc(w[0].replace(/^.*?\[/, "[").replace(/\]$/, "]"))}${dmg >= 0 ? ` · Schaden ${dmg + 1}` : ""}</small><span class="pt-eff">${esc(w[2])} · ${esc(w[3])}</span></th>
        <td class="num">${total[k] ? `+${total[k]}` : "–"}</td>
        <td class="num">${zs[k] ? `+${zs[k]}` : "–"}</td>
        ${ch ? `<td class="num">${ch[k] != null ? ch[k] : "–"}</td>` : ""}</tr>`;
    }).join("");
    return `<section class="sk-sec" id="pt-werte" aria-labelledby="pt-werte-h">
      <header class="sk-sec-head"><h3 id="pt-werte-h">Die zehn Götter-Werte</h3>
        <p>Jeder Wert hat zwei Wirkungen; jeder Punkt gibt <b>0,1 %</b> auf beide (10 Weisheit = 1 % Wucht). Für Schaden zählen zuerst Weisheit, Zerstörung und Zeit. „Teile“ zählt deine abgehakten Teile, „Ziel“ die beste bekannte Aufstellung deiner Fraktion.${ch ? ` „Charakter“ kommt aus dem Charakter-Check von <b>${esc(S.aktiv.name)}</b> und enthält alle Quellen, nicht nur das Pantheon.` : ""}</p></header>
      <div class="tbl-wrap"><table class="tbl pt-tbl">
        <thead><tr><th scope="col">Wert und Wirkungen</th><th scope="col" class="num" title="aus deinen abgehakten Teilen">Teile</th><th scope="col" class="num" title="beste bekannte Aufstellung deiner Fraktion">Ziel</th>${ch ? '<th scope="col" class="num" title="Armory, alle Quellen">Charakter</th>' : ""}</tr></thead>
        <tbody>${rows}</tbody></table></div>
      <p class="sk-hint">Götter-Werte kommen auch von Arkana-Karten, dem Abyss-Armband und den Monolithen.</p>
    </section>`;
  }

  function listHtml(fac) {
    const row = (t) => {
      const own = owns(t);
      const v = variant(t);
      return `<li class="bg-row pt-row${own ? " is-own" : ""}">
        <button type="button" class="pt-check" role="checkbox" aria-checked="${own}" data-pt="have" data-id="${esc(t.name)}" aria-label="${esc(t.name)} im Pantheon"></button>
        <span class="bg-row-nm"><span class="bg-nm"><b>${esc(t.name)}</b> <span class="pt-grade">${esc(t.grad)}</span>${facTag(t)}${newTag(t)} <span class="pt-rank">${esc(P.stufen[t.stufe])}</span></span>
          <span class="pt-sts">${statLine(t, v)}</span><small>${esc(t.quelle)}</small></span>
        ${t.oder && own ? `<span class="bg-lvsel" role="group" aria-label="Zweiter Wert von ${esc(t.name)}">${t.oder.map((k) =>
          `<button type="button" class="bg-lvbtn${v === k ? " is-on" : ""}" aria-pressed="${v === k}" data-pt="var" data-id="${esc(t.name)}" data-v="${k}">${esc(short(k))}</button>`).join("")}</span>` : ""}
      </li>`;
    };
    const groups = TYPES.map((ty) => {
      const own = pieces.filter((t) => t.typ === ty && forFac(t, fac)).sort(better);
      const other = pieces.filter((t) => t.typ === ty && !forFac(t, fac)).sort(better);
      return `<div class="pt-group"><h4>${esc(P.typen[ty])} <span class="muted">${own.filter(owns).length}/${own.length}</span></h4>
        <ul class="bg-list">${own.map(row).join("")}</ul>
        ${other.length ? `<details class="dv-more"><summary>Nur ${FAC[fac === "elyos" ? "asmo" : "elyos"]} (${other.length})</summary><ul class="bg-list">${other.map(row).join("")}</ul></details>` : ""}</div>`;
    }).join("");
    return `<section class="sk-sec" id="pt-alle" aria-labelledby="pt-alle-h">
      <header class="sk-sec-head"><h3 id="pt-alle-h">Teile abhaken</h3>
        <p>Hak an, was du im Pantheon hast (Menü › Pantheon). Bei Teilen mit „oder“ wählst du danach den zweiten Wert, den dein Teil trägt. Gespeichert wird nur in diesem Browser. Namen wie im englischen Client – deutsche Namen der Teile sind noch nicht bekannt.</p></header>
      ${groups}
    </section>`;
  }

  /* ---------- Ansicht ---------- */
  function render() {
    const host = document.getElementById("pt-app");
    if (!host) return;
    const fac = faction();
    const mineList = pieces.filter(owns);
    const have = mineList.length > 0;
    const mine = lineup(mineList);
    const ziel = lineup(pieces.filter((t) => forFac(t, fac)));
    const total = sum(mine);
    const a = S.aktiv;
    let h = `<div class="bg-top">
      <p class="sk-hint pt-unlock">${esc(P.freischalten)}</p>
      <div class="seg seg--sm" role="group" aria-label="Fraktion">${Object.keys(FAC).map((f) =>
        `<button type="button" class="seg-btn${fac === f ? " is-on" : ""}" aria-pressed="${fac === f}" data-pt="fac" data-id="${f}">${FAC[f]}</button>`).join("")}</div>
    </div>`;
    if (a) h += `<p class="notice bg-from">Aus dem Charakter-Check: <b>${esc(a.name)}</b>${FAC[a.faction] ? ` (${FAC[a.faction]})` : ""}. Die Armory zeigt die Götter-Werte, aber nicht, welche Pantheon-Teile du hast – hak sie unten ab.</p>`;
    else if (!have) h += `<p class="notice bg-from">Mit dem <a href="#charakter">Charakter-Check</a> kennt die Seite deine Fraktion und deine aktuellen Götter-Werte.</p>`;
    h += kpis(mine, total, have);
    h += `<nav class="sk-jump" aria-label="Abschnitte"><a href="#pt-next" data-pt="jump">Als Nächstes</a><a href="#pt-plaetze" data-pt="jump">Plätze</a><a href="#pt-werte" data-pt="jump">Götter-Werte</a><a href="#pt-alle" data-pt="jump">Abhaken</a><a href="#pt-tipps" data-pt="jump">Tipps</a></nav>`;
    const steps = plan(fac, mine);
    h += stepsHtml(steps);
    h += slotsHtml(fac, have ? mine : ziel, steps, have);
    h += statsHtml(total, ziel);
    h += listHtml(fac);
    h += `<section class="sk-sec" id="pt-tipps" aria-labelledby="pt-tipps-h"><header class="sk-sec-head"><h3 id="pt-tipps-h">Tipps</h3></header>
      <ul class="sk-tips">${P.tipps.map((t) => `<li><b>${esc(t[0])}:</b> ${esc(t[1])}</li>`).join("")}</ul></section>`;
    h += `<p class="fine">Quellen: ${P.quellen.map((q) => `<a href="${esc(q.url)}" target="_blank" rel="noopener">${esc(q.name)}</a>`).join(" · ")}. Drop-Chancen und Kosten laut Client-Daten; NCSOFT veröffentlicht keine Formel für den Schaden.</p>`;
    host.innerHTML = h;
  }

  function onClick(e) {
    const b = e.target.closest("#pt-app [data-pt]");
    if (!b) return;
    const act = b.getAttribute("data-pt");
    const y = window.scrollY;
    if (act === "fac") { S.fac = b.getAttribute("data-id"); save(); render(); }
    else if (act === "have") {
      const t = byName.get(b.getAttribute("data-id"));
      if (!t) return;
      if (owns(t)) delete S.have[t.name]; else S.have[t.name] = t.oder ? t.oder[0] : 1;
      save(); render(); window.scrollTo(0, y);
    } else if (act === "var") {
      const t = byName.get(b.getAttribute("data-id"));
      const v = b.getAttribute("data-v");
      if (!t || !t.oder || !t.oder.includes(v)) return;
      S.have[t.name] = v;
      save(); render(); window.scrollTo(0, y);
    } else if (act === "jump") {
      e.preventDefault();
      const n = document.getElementById(b.getAttribute("href").slice(1));
      if (n) n.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  window.DK_PT = {
    show() {
      render();
      if (window.DK_APP) window.DK_APP.go("pantheon");
    },
    /* Vom Charakter-Check: Fraktion und Götter-Werte (Armory-Typen Justice … Space) */
    fromCharacter(ch) {
      if (!ch || !ch.meta) return;
      const werte = {};
      (ch.stats || []).forEach((s) => { const k = String(s.type || "").toLowerCase(); if (P.werte[k]) werte[k] = Number(s.value) || 0; });
      S.aktiv = { name: ch.meta.name, faction: FAC[ch.meta.faction] ? ch.meta.faction : null, werte };
      if (S.aktiv.faction) S.fac = null;
      save();
      render();
    },
  };

  function init() {
    render();
    document.addEventListener("click", onClick);
    window.addEventListener("hashchange", () => { if (location.hash === "#pantheon") render(); });
    window.addEventListener("storage", (e) => { if (e.key === KEY) { S = load(); render(); } });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
