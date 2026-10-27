/*
 * Ansicht „Begleiter“: welche Begleiter du hast (im Browser abgehakt, gilt für alle Charaktere eines Servers),
 * was ihre Besitz-Effekte zusammen bringen und was du als Nächstes farmen solltest – nach Ziel
 * (Bewegungstempo, Kampfwerte, Sammlung), gebündelt nach Gebieten deiner Fraktion und dem Abyss.
 * Daten: DK_PETS (data-pets.js, erzeugt: Begleiter, Fundorte) und DK_DATA.begleiter (data.js, kuratiert: Werte, Titel).
 * Der Charakter-Check meldet über DK_BG.fromCharacter Fraktion, aktiven Begleiter und getragene Titel.
 * Link: ?ziel=tempo|kampf|sammlung#begleiter
 */
(function () {
  const D = window.DK_DATA, PD = window.DK_PETS;
  const B = D && D.begleiter;
  if (!PD || !B) return;

  const KEY = "dk.begleiter";
  const PETS = PD.pets;
  const byId = new Map(PETS.map((p) => [p.id, p]));
  const GENERA = ["fera", "cognia", "natura", "varia", "specia"];
  const FAC = { elyos: "Elyos", asmo: "Asmodier" };
  const MAX_ZONES = 8;
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const num = (n) => String(Math.round(n * 10) / 10).replace(".", ",");
  const plural = (n, one, many) => `${n} ${n === 1 ? one : many}`;

  /* ---------- Zustand ---------- */
  function load() {
    try {
      const s = JSON.parse(localStorage.getItem(KEY) || "{}");
      return { lv: s.lv && typeof s.lv === "object" ? s.lv : {}, aktiv: s.aktiv || null, fac: s.fac || null };
    } catch (e) { return { lv: {}, aktiv: null, fac: null }; }
  }
  let S = load();
  function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* Speicher gesperrt */ } }
  const lvOf = (id) => Math.max(0, Math.min(3, +S.lv[id] || 0));
  const view = { ziel: "tempo", typ: "alle", suche: "", fehlend: false };

  function faction() {
    if (S.fac === "elyos" || S.fac === "asmo") return S.fac;
    if (S.aktiv && FAC[S.aktiv.faction]) return S.aktiv.faction;
    const st = window.DK_APP && window.DK_APP.status();
    return st && FAC[st.faction] ? st.faction : "elyos";
  }

  /* ---------- Karten und Fundorte ---------- */
  function mapKind(m) {
    if (m === "Verteron" || m === "Eltnen") return "elyos";
    if (m === "Altgard" || m === "Morheim") return "asmo";
    if (/Reshanta/.test(m)) return "abyss";
    if (m === "Dungeon") return "dungeon";
    return "";
  }
  const mapName = (m) => (/Reshanta/.test(m) ? "Abyss · " + m.replace(/^Chaotische /, "").replace(/ von Reshanta$/, "") : m);

  /* Seelen-Monster: eigene Karte und Abyss, Karte der anderen Fraktion, nur in Dungeons */
  function sources(p, fac) {
    const own = [], enemy = [], dungeon = [];
    p.drops.forEach((d) => {
      const k = mapKind(d[3]);
      if (k === fac || k === "abyss") own.push(d);
      else if (k === "dungeon") dungeon.push(d);
      else if (k) enemy.push(d);
    });
    const order = (a, b) => a[1] - b[1] || b[4] - a[4];
    return { own: own.sort(order), enemy: enemy.sort(order), dungeon };
  }
  const where = (d) => `${esc(d[0])} <span class="bg-lv">St. ${d[1]}</span> · ${esc(d[2].join(", ") || "–")} · ${esc(mapName(d[3]))}`;
  function sourceLine(p, fac) {
    const s = sources(p, fac);
    if (s.own.length) return where(s.own[0]);
    if (s.enemy.length) return `<span class="bg-flag">Andere Fraktion</span> ${where(s.enemy[0])}`;
    if (s.dungeon.length) return `<span class="bg-flag">Dungeon</span> ${esc(s.dungeon[0][0])} <span class="bg-lv">St. ${s.dungeon[0][1]}</span>`;
    const other = [...p.other, ...p.boxes.map((b) => b[0])];
    return other.length ? `<span class="bg-flag">Kein Monster</span> ${esc(other.slice(0, 2).join(", "))}${other.length > 2 ? " …" : ""}` : "Quelle unbekannt";
  }

  /* ---------- Rechnen ---------- */
  function owned() { return PETS.filter((p) => lvOf(p.id) > 0); }

  /* Summe der Besitz-Effekte je Typ: { fera: [[Wert, Summe, Einheit], …] } */
  function effects() {
    const out = {};
    GENERA.forEach((g) => { out[g] = B.typen[g].werte.map((w) => [w[0], 0, w[4] || "", w[5] || "+"]); });
    PETS.forEach((p) => {
      const l = lvOf(p.id);
      if (l) B.typen[p.g].werte.forEach((w, k) => { out[p.g][k][1] += w[l]; });
    });
    return out;
  }
  function titleState(count) {
    const got = B.titel.filter((t) => count >= t[0]);
    return { got, next: B.titel.find((t) => count < t[0]) || null, pct: got.reduce((s, t) => s + t[2], 0) };
  }
  function nextMilestone(count) {
    const M = B.meilensteine;
    const at = count < M.erster ? M.erster : (Math.floor(count / M.schritt) + 1) * M.schritt;
    if (at > PETS.length) return null;
    return { at, reward: at % M.bonbonAlle === 0 ? `${M.bonbons} Bindungsbonbons` : `${M.kristalle} Seelenkristalle` };
  }

  /* Farm-Route: gierig das Gebiet mit den meisten fehlenden Ziel-Begleitern, bis alle abgedeckt sind */
  function route(fac, genera) {
    const missing = PETS.filter((p) => !lvOf(p.id) && p.g !== "specia");
    const targets = missing.filter((p) => genera.includes(p.g));
    const zones = new Map();
    missing.forEach((p) => sources(p, fac).own.forEach((d) => d[2].forEach((z) => {
      const key = d[3] + "|" + z;
      if (!zones.has(key)) zones.set(key, { key, zone: z, map: d[3], pets: new Map() });
      const pets = zones.get(key).pets, prev = pets.get(p.id);
      if (!prev || d[1] < prev[1]) pets.set(p.id, d);
    })));
    const open = new Set(targets.map((p) => p.id));
    const listed = new Set();
    const picked = [];
    while (open.size && picked.length < MAX_ZONES) {
      let best = null, bestN = 0, bestLv = Infinity;
      zones.forEach((z) => {
        let n = 0, lv = Infinity;
        z.pets.forEach((d, id) => { if (open.has(id)) { n++; lv = Math.min(lv, d[1]); } });
        if (n > bestN || (n && n === bestN && lv < bestLv)) { best = z; bestN = n; bestLv = lv; }
      });
      if (!best) break;
      const main = [], side = [];
      best.pets.forEach((d, id) => {
        if (open.has(id)) { main.push([byId.get(id), d]); open.delete(id); listed.add(id); }
        else if (!listed.has(id)) { side.push([byId.get(id), d]); listed.add(id); }
      });
      const lvs = main.concat(side).map((x) => x[1][1]);
      picked.push({ zone: best.zone, map: best.map, main, side, min: Math.min(...lvs), max: Math.max(...lvs) });
      zones.delete(best.key);
    }
    const rest = { more: [], enemy: [], dungeon: [], none: [] };
    open.forEach((id) => {
      const p = byId.get(id), s = sources(p, fac);
      if (s.own.length) rest.more.push(p);
      else if (s.enemy.length) rest.enemy.push(p);
      else if (s.dungeon.length) rest.dungeon.push(p);
      else rest.none.push(p);
    });
    return { picked, rest, targets: targets.length, missing: missing.length };
  }

  /* ---------- Bausteine ---------- */
  const icon = (p, size) => p.icon
    ? `<img class="bg-ico${size ? " bg-ico--" + size : ""}" src="${esc(PD.cdn + p.icon)}.png" alt="" loading="lazy" decoding="async" width="40" height="40">`
    : `<span class="bg-ico${size ? " bg-ico--" + size : ""} bg-ico--none" aria-hidden="true">${esc(p.de.slice(0, 1))}</span>`;
  const tag = (g) => `<span class="bg-tag bg-tag--${g}">${esc(B.typen[g].name)}</span>`;
  const petChip = (p, d) => `<li class="bg-chip">${icon(p, "sm")}<span><span class="bg-nm"><b>${esc(p.de)}</b> ${tag(p.g)}</span><small>${esc(d[0])} · St. ${d[1]}${d[4] ? ` · ${d[4]} Spawns` : ""}</small></span></li>`;

  function kpis(fac, eff, count) {
    const ts = titleState(count), ms = nextMilestone(count);
    const fera = PETS.filter((p) => p.g === "fera");
    const feraOwned = fera.filter((p) => lvOf(p.id)).length;
    const ride = eff.fera[0][1];
    const tile = (dt, dd, sub) => `<div><dt>${dt}</dt><dd><b>${dd}</b>${sub ? `<span>${sub}</span>` : ""}</dd></div>`;
    let h = tile("Begleiter", `${count} <small>von ${PETS.length}</small>`, ms ? `nächster Meilenstein bei ${ms.at}: ${esc(ms.reward)}` : "alle Meilensteine erreicht");
    if (view.ziel === "kampf") {
      const c = eff.cognia, n = eff.natura;
      h += tile("Macht · Präzision", `+${c[2][1]} · +${n[2][1]}`, `aus Cognia und Natura auf Stufe 3`);
      h += tile("Kritischer Treffer", `+${c[1][1]}`, `LP +${c[0][1]}, Zusatzpräzision +${eff.fera[1][1]}`);
    } else if (view.ziel === "sammlung") {
      h += tile("Auf Stufe 3", `${owned().filter((p) => lvOf(p.id) === 3).length}`, "Stufe 3 gibt den vollen Besitz-Effekt");
      h += tile("Sammel-Titel", `${ts.got.length} <small>von ${B.titel.length}</small>`, ts.next ? `„${esc(ts.next[1])}“ bei ${ts.next[0]} Begleitern` : "alle vier");
    } else {
      h += tile("Boden-Tempo (Reittier)", `+${ride} <small>von +${fera.length * 3}</small>`, `${feraOwned} von ${fera.length} Fera-Begleitern`);
      h += tile("Bewegungstempo dauerhaft", `+${num(ts.pct)} %`, ts.next ? `+${num(ts.next[2])} % mit „${esc(ts.next[1])}“ bei ${ts.next[0]} Begleitern` : "alle Sammel-Titel");
    }
    return `<dl class="sk-facts bg-facts">${h}</dl>`;
  }

  function tempoHtml(fac, eff, count) {
    const ts = titleState(count);
    const worn = new Set((S.aktiv && S.aktiv.titles) || []);
    const best = B.tempoTitel.filter((t) => !t.fraktion || t.fraktion === fac);
    const wearing = best.find((t) => worn.has(t.en));
    const top = best[0];
    const titleRows = best.map((t) => `<li class="bg-src${worn.has(t.en) ? " is-ok" : ""}"><span class="bg-src-v">+${num(t.wert)} %</span>
      <span><span class="bg-nm"><b>${esc(t.de)}</b>${worn.has(t.en) ? ` <span class="bg-ok">trägst du</span>` : ""}</span><small>${esc(t.extra)} · Herkunft: ${esc(t.herkunft)}</small></span></li>`).join("");
    const steps = B.titel.map((t) => `<li class="bg-src${count >= t[0] ? " is-ok" : ""}"><span class="bg-src-v">+${num(t[2])} %</span>
      <span><span class="bg-nm"><b>${esc(t[1])}</b>${count >= t[0] ? ` <span class="bg-ok">hast du</span>` : ""}</span><small>bei ${t[0]} Begleitern${count < t[0] ? ` – noch ${t[0] - count}` : ""}</small></span></li>`).join("");
    const lv1 = owned().filter((p) => p.g === "fera" && lvOf(p.id) === 1).length;
    const lv2 = owned().filter((p) => p.g === "fera" && lvOf(p.id) === 2).length;
    return `<section class="sk-sec" id="bg-tempo" aria-labelledby="bg-tempo-h">
      <header class="sk-sec-head"><h3 id="bg-tempo-h">Bewegungstempo: alle Quellen</h3>
        <p>Alle Reittiere laufen gleich schnell (Laufen ${B.grundtempo.lauf}, Sprint ${B.grundtempo.sprint.toLocaleString("de-DE")}). Schneller wirst du nur über Titel und die Besitz-Effekte deiner Fera-Begleiter.</p></header>
      <div class="bg-srcs">
        <div class="bg-src-col">
          <h4>Titel tragen (Allzweck-Platz)</h4>
          <ul class="bg-src-list">${titleRows}</ul>
          <p class="sk-hint">${wearing ? "Du trägst schon einen Tempo-Titel." : S.aktiv ? `Laut Charakter-Check trägst du keinen Tempo-Titel – „${esc(top.de)}“ bringt +${num(top.wert)} %.` : "Der Charakter-Check zeigt, welchen Titel du trägst."}</p>
        </div>
        <div class="bg-src-col">
          <h4>Sammel-Titel (wirken immer)</h4>
          <ul class="bg-src-list">${steps}</ul>
          <p class="sk-hint">Besitz-Effekt: gilt dauerhaft, auch wenn du einen anderen Titel trägst. Jeder Begleiter zählt, egal welcher Typ.</p>
        </div>
        <div class="bg-src-col">
          <h4>Fera-Begleiter (nur beim Reiten)</h4>
          <p class="bg-big">+${eff.fera[0][1]} <small>Boden-Tempo</small></p>
          <p class="sk-hint">Jeder Fera-Begleiter gibt +1 je Stufe, höchstens +3. ${lv1 || lv2 ? `Aufwerten: ${[lv1 ? `${lv1} von Stufe 1 auf 2 (je ${B.seelen[1]} Seelen)` : "", lv2 ? `${lv2} von Stufe 2 auf 3 (je ${B.seelen[2]} Seelen)` : ""].filter(Boolean).join(", ")}, jeweils +1. Neue Fera freischalten ist günstiger: ${B.seelen[0]} Seelen für +1.` : `Neue Fera freischalten ist am günstigsten: ${B.seelen[0]} Seelen für +1.`}</p>
          <p class="sk-hint">Varia senkt die Ausdauerkosten beim Sprinten auf dem Reittier, Natura gibt mehr Ausdauer – beides hilft auf langen Strecken.</p>
        </div>
      </div>
    </section>`;
  }

  function routeHtml(fac) {
    const Z = B.ziele[view.ziel];
    const r = route(fac, Z.typen);
    const head = `<header class="sk-sec-head"><h3 id="bg-route-h">Als Nächstes farmen · ${esc(FAC[fac])}</h3><p>${esc(Z.text)}</p></header>`;
    if (!r.targets) {
      return `<section class="sk-sec" id="bg-route" aria-labelledby="bg-route-h">${head}<p class="bg-done">Alle farmbaren Begleiter für dieses Ziel hast du. ${r.missing ? `Für die Sammlung fehlen noch ${r.missing}.` : ""}</p></section>`;
    }
    const zones = r.picked.map((z, i) => `<article class="bg-zone">
      <header class="bg-zone-head"><span class="bg-zone-no">${i + 1}</span><div><h4>${esc(z.zone)}</h4><p>${esc(mapName(z.map))} · Monster St. ${z.min}${z.max > z.min ? "–" + z.max : ""}</p></div>
        <span class="bg-zone-n"><b>${z.main.length}</b> ${z.main.length === 1 ? "Ziel" : "Ziele"}${z.side.length ? ` + ${z.side.length}` : ""}</span></header>
      <ul class="bg-chips">${z.main.map((x) => petChip(x[0], x[1])).join("")}</ul>
      ${z.side.length ? `<p class="bg-side-h">Nebenbei mitnehmen (zählen für Titel und Meilensteine)</p><ul class="bg-chips bg-chips--side">${z.side.map((x) => petChip(x[0], x[1])).join("")}</ul>` : ""}
    </article>`).join("");
    const restList = (title, list, note) => list.length ? `<div class="bg-rest"><h4>${title} <span class="muted">${list.length}</span></h4>${note ? `<p class="sk-hint">${note}</p>` : ""}
      <ul class="bg-chips">${list.map((p) => `<li class="bg-chip">${icon(p, "sm")}<span><span class="bg-nm"><b>${esc(p.de)}</b> ${tag(p.g)}</span><small>${sourceLine(p, fac)}</small></span></li>`).join("")}</ul></div>` : "";
    const R = r.rest;
    return `<section class="sk-sec" id="bg-route" aria-labelledby="bg-route-h">${head}
      <p class="sk-hint">${plural(r.targets, "Ziel-Begleiter fehlt", "Ziel-Begleiter fehlen")}. Gebiete in der Reihenfolge, in der sie am meisten auf einmal bringen; rechne mit etwa 5 Kills je Begleiter.</p>
      <div class="bg-zones">${zones}</div>
      ${restList("Weitere Gebiete", R.more, "Nach den Gebieten oben noch offen – nach dem nächsten Abhaken rechnet die Liste neu.")}
      ${restList("Nur auf der Karte der anderen Fraktion", R.enemy, `Dorthin über den Raumzeit-Riss (etwa eine Stunde Zeit). <a href="#zeiten">Riss-Zeiten</a>`)}
      ${restList("Nur in Dungeons", R.dungeon, "")}
      ${restList("Ohne Monster", R.none, "Nur aus Truhen, Pass oder Zufallsladen – doppelte Pet-Items werden zu Seelen.")}
    </section>`;
  }

  function effectsHtml(eff) {
    const rows = GENERA.filter((g) => B.typen[g].werte.length).map((g) => {
      const n = PETS.filter((p) => p.g === g), have = n.filter((p) => lvOf(p.id));
      const vals = eff[g].map((w) => `<span>${esc(w[0])} <b>${w[3]}${num(w[1])}${w[2] ? " " + w[2] : ""}</b></span>`).join("");
      return `<li class="bg-eff"><span class="bg-eff-g">${tag(g)}<small>${have.length} / ${n.length}</small></span><span class="bg-eff-v">${vals}</span></li>`;
    }).join("");
    const per = GENERA.filter((g) => B.typen[g].werte.length).map((g) =>
      `<tr><th scope="row">${tag(g)}</th>${[1, 2, 3].map((l) => `<td>${B.typen[g].werte.filter((w) => w[l]).map((w) => `${esc(w[0])} ${w[5] || "+"}${num(w[l])}${w[4] ? " " + w[4] : ""}`).join("<br>")}</td>`).join("")}</tr>`).join("");
    return `<section class="sk-sec" id="bg-werte" aria-labelledby="bg-werte-h">
      <header class="sk-sec-head"><h3 id="bg-werte-h">Was deine Begleiter dir geben</h3>
        <p>Jeder Begleiter gibt dauerhaft den Besitz-Effekt seines Typs – auch wenn du ihn nicht reitest. Die Werte aller Begleiter addieren sich.</p></header>
      <ul class="bg-effs">${rows}</ul>
      <div class="tbl-wrap"><table class="tbl bg-tbl"><caption class="sk-hint">Besitz-Effekt je Begleiter und Stufe (Seelen: Freischalten ${B.seelen[0]}, Stufe 2 +${B.seelen[1]}, Stufe 3 +${B.seelen[2]})</caption>
        <thead><tr><th scope="col">Typ</th><th scope="col">Stufe 1</th><th scope="col">Stufe 2</th><th scope="col">Stufe 3</th></tr></thead><tbody>${per}</tbody></table></div>
    </section>`;
  }

  function listItems(fac) {
    const q = view.suche.trim().toLowerCase();
    return PETS.filter((p) => (view.typ === "alle" || p.g === view.typ) && (!view.fehlend || !lvOf(p.id))
      && (!q || p.de.toLowerCase().includes(q) || p.en.toLowerCase().includes(q) || p.drops.some((d) => d[0].toLowerCase().includes(q) || d[2].some((z) => z.toLowerCase().includes(q)))))
      .sort((a, b) => a.de.localeCompare(b.de, "de"));
  }
  function rowsHtml(fac) {
    const list = listItems(fac);
    if (!list.length) return `<p class="empty">Keine Begleiter für diese Auswahl.</p>`;
    return `<ul class="bg-list">${list.map((p) => {
      const l = lvOf(p.id);
      const active = S.aktiv && S.aktiv.pet && S.aktiv.pet.id === p.id;
      return `<li class="bg-row${l ? " is-own" : ""}">${icon(p)}
        <span class="bg-row-nm"><span class="bg-nm"><b>${esc(p.de)}</b> ${tag(p.g)}${active ? ` <span class="bg-ok">reitest du</span>` : ""}</span><small>${sourceLine(p, fac)}</small></span>
        <span class="bg-lvsel" role="group" aria-label="Stufe von ${esc(p.de)}">${[0, 1, 2, 3].map((n) =>
          `<button type="button" class="bg-lvbtn${l === n ? " is-on" : ""}" aria-pressed="${l === n}" data-bg="lv" data-id="${p.id}" data-lv="${n}" title="${n ? "Stufe " + n : "nicht gesammelt"}">${n || "–"}</button>`).join("")}</span>
      </li>`;
    }).join("")}</ul>`;
  }
  function listHtml(fac) {
    const chips = ["alle"].concat(GENERA).map((g) => {
      const all = g === "alle" ? PETS : PETS.filter((p) => p.g === g);
      const have = all.filter((p) => lvOf(p.id)).length;
      return `<button type="button" class="fchip${view.typ === g ? " is-on" : ""}" aria-pressed="${view.typ === g}" data-bg="typ" data-id="${g}">${g === "alle" ? "Alle" : esc(B.typen[g].name)} <span class="muted">${have}/${all.length}</span></button>`;
    }).join("");
    return `<section class="sk-sec" id="bg-alle" aria-labelledby="bg-alle-h">
      <header class="sk-sec-head"><h3 id="bg-alle-h">Alle Begleiter abhaken</h3>
        <p>Stell bei jedem Begleiter die Stufe ein, die er im Spiel hat (Pet-Menü). Gespeichert wird nur in diesem Browser; die Sammlung gilt im Spiel für alle Charaktere eines Servers.</p></header>
      <div class="bg-filter">
        <div class="fchips">${chips}</div>
        <div class="bg-filter-row">
          <label class="field bg-search"><span>Suchen (Begleiter, Monster, Gebiet)</span><input type="search" id="bg-suche" value="${esc(view.suche)}" autocomplete="off"></label>
          <label class="switch"><input type="checkbox" data-bg="fehlend"${view.fehlend ? " checked" : ""}><span>Nur fehlende</span></label>
          <span class="bg-bulk">Alle angezeigten mindestens auf ${[1, 2, 3].map((n) => `<button type="button" class="link-btn" data-bg="bulk" data-lv="${n}">Stufe ${n}</button>`).join(" ")} · <button type="button" class="link-btn" data-bg="bulk" data-lv="0">alle entfernen</button></span>
        </div>
      </div>
      <div id="bg-rows">${rowsHtml(fac)}</div>
    </section>`;
  }

  /* ---------- Ansicht ---------- */
  function render() {
    const host = document.getElementById("bg-app");
    if (!host) return;
    const fac = faction();
    const eff = effects();
    const count = owned().length;
    const ziel = B.ziele[view.ziel];
    const a = S.aktiv;
    const pet = a && a.pet && byId.get(a.pet.id);
    let h = `<div class="bg-top">
      <div class="sk-mode bg-goal" role="tablist" aria-label="Ziel">${Object.keys(B.ziele).map((k) =>
        `<button type="button" role="tab" class="sk-mode-btn${view.ziel === k ? " is-on" : ""}" aria-selected="${view.ziel === k}" data-bg="ziel" data-id="${k}">${esc(B.ziele[k].name)}<small>${k === "tempo" ? "Fera und Titel" : k === "kampf" ? "Cognia, Natura" : "Titel, Meilensteine"}</small></button>`).join("")}</div>
      <div class="seg seg--sm" role="group" aria-label="Fraktion">${Object.keys(FAC).map((f) =>
        `<button type="button" class="seg-btn${fac === f ? " is-on" : ""}" aria-pressed="${fac === f}" data-bg="fac" data-id="${f}">${FAC[f]}</button>`).join("")}</div>
    </div>`;
    if (a) {
      h += `<p class="notice bg-from">Aus dem Charakter-Check: <b>${esc(a.name)}</b>${FAC[a.faction] ? ` (${FAC[a.faction]})` : ""}${pet ? ` reitet <b>${esc(pet.de)}</b>${a.pet.lv ? ` auf Stufe ${a.pet.lv}` : ""} – ist abgehakt` : ""}. Welche anderen Begleiter du hast, zeigt die Armory nicht; hak sie unten ab.</p>`;
    } else if (!count) {
      h += `<p class="notice bg-from">Starte mit dem <a href="#charakter">Charakter-Check</a> – dann kennt die Seite deine Fraktion, deinen aktiven Begleiter und deinen Titel. Die übrigen Begleiter hakst du unten ab.</p>`;
    }
    h += kpis(fac, eff, count);
    h += `<nav class="sk-jump" aria-label="Abschnitte"><a href="#bg-route" data-bg="jump">Als Nächstes farmen</a>${view.ziel === "tempo" ? `<a href="#bg-tempo" data-bg="jump">Bewegungstempo</a>` : ""}<a href="#bg-werte" data-bg="jump">Werte</a><a href="#bg-alle" data-bg="jump">Alle abhaken</a><a href="#bg-tipps" data-bg="jump">Tipps</a></nav>`;
    h += routeHtml(fac);
    if (view.ziel === "tempo") h += tempoHtml(fac, eff, count);
    h += effectsHtml(eff);
    h += listHtml(fac);
    h += `<section class="sk-sec" id="bg-tipps" aria-labelledby="bg-tipps-h"><header class="sk-sec-head"><h3 id="bg-tipps-h">Tipps</h3></header>
      <ul class="sk-tips">${B.tipps.map((t) => `<li><b>${esc(t[0])}:</b> ${esc(t[1])}</li>`).join("")}</ul></section>`;
    h += `<p class="fine">Begleiter, Fundorte und Werte: MetaBot (liest den Global-Client aus, Stand ${esc(PD.stand)}), Raid Relay, Daeva Guides, aion2-guides.info. Seelen droppen laut Client-Daten zu 100 % pro Kill; im Spiel zeigt der Reiter „Quelle“ im Pet-Menü dasselbe. Bilder: NCSOFT. Ziel „${esc(ziel.name)}“.</p>`;
    host.innerHTML = h;
  }
  function renderRows() {
    const box = document.getElementById("bg-rows");
    if (box) box.innerHTML = rowsHtml(faction());
  }

  function readUrl() {
    const z = new URLSearchParams(location.search).get("ziel");
    if (z && B.ziele[z]) view.ziel = z;
  }
  function updateUrl() {
    if (!/^https?:$/.test(location.protocol) || location.hash !== "#begleiter") return;
    try { history.replaceState(null, "", `?ziel=${view.ziel}#begleiter`); } catch (e) { /* egal */ }
  }

  function setLevel(ids, lv) {
    ids.forEach((id) => { if (lv) S.lv[id] = lv; else delete S.lv[id]; });
    save();
  }

  function onClick(e) {
    const b = e.target.closest("#bg-app [data-bg]");
    if (!b || b.tagName === "INPUT") return;
    const act = b.getAttribute("data-bg");
    if (act === "ziel") { view.ziel = b.getAttribute("data-id"); render(); updateUrl(); }
    else if (act === "fac") { S.fac = b.getAttribute("data-id"); save(); render(); }
    else if (act === "typ") { view.typ = b.getAttribute("data-id"); render(); }
    else if (act === "lv") {
      const y = window.scrollY;
      setLevel([+b.getAttribute("data-id")], +b.getAttribute("data-lv"));
      render();
      window.scrollTo(0, y);
    } else if (act === "bulk") {
      /* Stufe n hebt nur an, was darunter liegt; „alle entfernen“ setzt die angezeigten auf nicht gesammelt */
      const lv = +b.getAttribute("data-lv");
      const ids = listItems(faction()).filter((p) => (lv ? lvOf(p.id) < lv : lvOf(p.id) > 0)).map((p) => p.id);
      if (!ids.length) return;
      if (ids.length > 3 && !window.confirm(lv ? `${ids.length} Begleiter auf Stufe ${lv} setzen?` : `${ids.length} Begleiter als nicht gesammelt markieren?`)) return;
      const y = window.scrollY;
      setLevel(ids, lv);
      render();
      window.scrollTo(0, y);
    } else if (act === "jump") {
      e.preventDefault();
      const t = document.getElementById(b.getAttribute("href").slice(1));
      if (t) t.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }
  function onChange(e) {
    const t = e.target;
    if (t.matches && t.matches('#bg-app [data-bg="fehlend"]')) { view.fehlend = t.checked; renderRows(); }
  }
  function onInput(e) {
    if (e.target.id === "bg-suche") { view.suche = e.target.value; renderRows(); }
  }

  window.DK_BG = {
    show(ziel) {
      if (ziel && B.ziele[ziel]) view.ziel = ziel;
      render();
      if (window.DK_APP) window.DK_APP.go("begleiter");
      updateUrl();
    },
    /* Vom Charakter-Check: Fraktion, aktiver Begleiter (wird abgehakt) und getragene Titel */
    fromCharacter(ch) {
      if (!ch || !ch.meta) return;
      const pet = ch.pet && ch.pet.id && byId.has(ch.pet.id) ? { id: ch.pet.id, lv: Math.max(1, Math.min(3, ch.pet.level || 1)) } : null;
      S.aktiv = {
        name: ch.meta.name, faction: FAC[ch.meta.faction] ? ch.meta.faction : null, pet,
        titles: (ch.titles || []).map((t) => t.name).filter(Boolean)
      };
      if (pet && lvOf(pet.id) < pet.lv) S.lv[pet.id] = pet.lv;
      if (S.aktiv.faction) S.fac = null;
      save();
      render();
    },
    /* Für das Kachel-Overlay: Ziele und das nächste Farm-Gebiet mit den fehlenden Begleitern */
    ziele: () => Object.keys(B.ziele).map((k) => [k, B.ziele[k].name]),
    nextZone(ziel) {
      const fac = faction();
      const Z = B.ziele[ziel] || B.ziele[view.ziel];
      const r = route(fac, Z.typen);
      const z = r.picked[0];
      return {
        fac: FAC[fac], ziel: Z.name, targets: r.targets, weitere: Math.max(0, r.picked.length - 1),
        zone: z ? { name: z.zone, map: mapName(z.map), min: z.min, max: z.max,
          pets: z.main.map(([p, d]) => ({ id: p.id, de: p.de, typ: B.typen[p.g].name, g: p.g, monster: d[0], stufe: d[1], icon: icon(p, "sm") })) } : null,
      };
    },
    setLevel(id, lv) {
      if (!byId.has(id)) return;
      setLevel([id], Math.max(0, Math.min(3, lv)));
      render();
    },
    /* Für den Charakter-Check: fehlende Fera und bester Tempo-Titel als Kurzinfo */
    summary(fac) {
      const f = FAC[fac] ? fac : faction();
      const count = owned().length;
      const fera = PETS.filter((p) => p.g === "fera");
      return { count, total: PETS.length, fera: fera.filter((p) => lvOf(p.id)).length, feraTotal: fera.length,
        ride: effects().fera[0][1], titles: titleState(count), route: route(f, ["fera"]).picked.slice(0, 2).map((z) => ({ zone: z.zone, map: mapName(z.map), n: z.main.length })) };
    },
  };

  function init() {
    readUrl();
    render();
    document.addEventListener("click", onClick);
    document.addEventListener("change", onChange);
    document.addEventListener("input", onInput);
    window.addEventListener("hashchange", () => { if (location.hash === "#begleiter") { render(); updateUrl(); } });
    window.addEventListener("storage", (e) => { if (e.key === KEY) { S = load(); render(); } });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
