/*
 * Ansicht „Overlay“ (#overlay): kleine Kacheln für ein schmales Fenster neben dem Spiel – Termine, Rotation,
 * Schadenstest, Begleiter und Checkliste. Jede Kachel lässt sich einzeln an- und ausschalten (localStorage dk.overlay).
 * Termine und Checkliste zeichnet app.js (data-part "ov-next" und "ov-check"), Rotation und Schadenstest kommen
 * aus DK_SK (skills.js), das Farm-Gebiet aus DK_BG (begleiter.js). Nichts davon liest Daten aus dem Spiel.
 * In der Desktop-App schaltet desktop.js den Overlay-Modus (Ansicht, kompakt, im Vordergrund).
 */
(function () {
  const KEY = "dk.overlay";
  const TILES = [["termine", "Termine"], ["rotation", "Rotation"], ["dps", "Schadenstest"], ["begleiter", "Begleiter"], ["checkliste", "Checkliste"]];
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const fmtNum = (n) => Math.round(n).toLocaleString("de-DE");
  const MAX_PETS = 6;

  /* ---------- Zustand ---------- */
  function load() {
    const tiles = Object.fromEntries(TILES.map((t) => [t[0], true]));
    try {
      const s = JSON.parse(localStorage.getItem(KEY) || "{}") || {};
      TILES.forEach(([k]) => { if (s.tiles && typeof s.tiles[k] === "boolean") tiles[k] = s.tiles[k]; });
      return { tiles, mode: s.mode === "pvp" ? "pvp" : "pve", ziel: s.ziel || "tempo", start: !!s.start };
    } catch (e) { return { tiles, mode: "pve", ziel: "tempo", start: false }; }
  }
  let S = load();
  function save() { try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* Speicher gesperrt */ } }

  const app = () => window.DK_APP;
  const cls = () => (app() && app().status().cls) || "spiritmaster";
  const clsName = (id) => { const c = ((window.DK_DATA || {}).classes || []).find((x) => x.id === id); return c ? c.de : id; };
  const seg = (label, items, cur, act) => `<div class="seg seg--sm" role="group" aria-label="${esc(label)}">${items.map(([k, t]) =>
    `<button type="button" class="seg-btn${k === cur ? " is-on" : ""}" aria-pressed="${k === cur}" data-ov="${act}" data-id="${esc(k)}">${esc(t)}</button>`).join("")}</div>`;
  const visible = () => location.hash === "#overlay";

  /* ---------- Kacheln ---------- */
  function chips() {
    const host = document.getElementById("ov-chips");
    if (!host) return;
    host.innerHTML = TILES.map(([k, t]) => `<button type="button" class="fchip${S.tiles[k] ? " is-on" : ""}" aria-pressed="${S.tiles[k]}" data-ov="tile" data-id="${k}">${esc(t)}</button>`).join("");
    const sum = document.querySelector("#v-overlay .ov-pick summary");
    if (sum) sum.textContent = `Kacheln · ${TILES.filter(([k]) => S.tiles[k]).length} von ${TILES.length}`;
  }
  function applyTiles() {
    document.querySelectorAll("#v-overlay [data-tile]").forEach((n) => { n.hidden = !S.tiles[n.getAttribute("data-tile")]; });
    const none = document.querySelector("#v-overlay .ov-none");
    if (none) none.hidden = TILES.some(([k]) => S.tiles[k]);
  }

  function rotation() {
    const host = document.getElementById("ov-rotation");
    const SK = window.DK_SK;
    if (!host) return;
    if (!SK || !SK.rotationHtml) { host.innerHTML = '<p class="empty">Skill-Daten fehlen.</p>'; return; }
    const c = cls();
    host.innerHTML = `<div class="ov-bar"><span class="ov-who">${esc(clsName(c))}</span>${seg("Modus", [["pve", "PvE"], ["pvp", "PvP"]], S.mode, "mode")}</div>
      ${SK.rotationHtml(c, S.mode)}
      <p class="ov-more"><button type="button" class="link-btn" data-action="open-sk" data-id="${esc(c)}" data-mode="${S.mode}">Ganze Leiste und Opener</button></p>`;
  }

  function dps() {
    const host = document.getElementById("ov-dps");
    const T = window.DK_SK && window.DK_SK.test;
    if (!host) return;
    if (!T) { host.innerHTML = '<p class="empty">Schadenstest nicht verfügbar.</p>'; return; }
    const c = cls(), list = T.list(c, S.mode);
    const best = list.reduce((m, r) => Math.max(m, r.dps), 0);
    const rows = list.slice(0, 3).map((r) => `<li class="ov-dps-row${r.dps === best ? " is-best" : ""}"><span>${esc(r.name)}</span><b>${fmtNum(r.dps)}</b><small>${r.dps === best ? "beste" : "−" + Math.abs((r.dps / best - 1) * 100).toFixed(1).replace(".", ",") + " %"}</small></li>`).join("");
    const running = T.running();
    host.innerHTML = `<div class="ov-bar"><span class="dk-clock${running ? " is-run" : ""}" data-sk-clock>${T.clock()}</span>
        ${seg("Testdauer", T.dauern().map((d) => [String(d), d / 60 + " min"]), String(T.dauer()), "dauer")}
        <button type="button" class="btn" data-ov="start" data-sk-start>${running ? "Abbrechen" : "Test starten"}</button></div>
      <form class="ov-dps-form" id="ov-dps-form" autocomplete="off">
        <label class="field"><span>DPS aus der Kampfanalyse (Strg+X)</span><input type="number" id="ov-dps-val" inputmode="numeric" min="1" step="1" required data-sk-dps></label>
        <button type="submit" class="btn btn--ghost">Eintragen</button>
      </form>
      ${rows ? `<ul class="ov-dps">${rows}</ul>` : `<p class="ov-sub">Noch keine Ergebnisse für ${esc(clsName(c))} im ${S.mode === "pvp" ? "PvP" : "PvE"}.</p>`}`;
  }

  function begleiter() {
    const host = document.getElementById("ov-bg");
    const BG = window.DK_BG;
    if (!host) return;
    if (!BG || !BG.nextZone) { host.innerHTML = '<p class="empty">Begleiter-Daten fehlen.</p>'; return; }
    const r = BG.nextZone(S.ziel);
    let h = `<div class="ov-bar">${seg("Ziel", BG.ziele(), S.ziel, "ziel")}</div>`;
    if (!r.zone) {
      h += `<p class="ov-sub">${r.targets ? `Für „${esc(r.ziel)}“ fehlen noch ${r.targets} Begleiter, aber keiner davon lebt auf deiner Karte – den Rest zeigt die Begleiter-Seite.` : `Für „${esc(r.ziel)}“ hast du alle farmbaren Begleiter.`}</p>`;
    } else {
      const z = r.zone;
      h += `<p class="ov-zone"><b>${esc(z.name)}</b> <span>${esc(z.map)} · Monster St. ${z.min}${z.max > z.min ? "–" + z.max : ""}</span></p>
        <ul class="ov-pets">${z.pets.slice(0, MAX_PETS).map((p) => `<li class="ov-pet">${p.icon}<span><b>${esc(p.de)}</b><small>${esc(p.typ)} · ${p.monster && p.monster !== p.de ? esc(p.monster) + " " : ""}St. ${p.stufe}</small></span>
          <button type="button" class="btn btn--ghost ov-have" data-ov="pet" data-id="${p.id}" aria-label="${esc(p.de)} als gesammelt abhaken">Hab ich</button></li>`).join("")}</ul>
        ${z.pets.length > MAX_PETS ? `<p class="ov-sub">Im selben Gebiet noch ${z.pets.length - MAX_PETS} weitere.</p>` : ""}
        <p class="ov-sub">${r.targets} fehlen für „${esc(r.ziel)}“ (${esc(r.fac)})${r.weitere ? ` · danach noch ${r.weitere} weitere Gebiete` : ""}.</p>`;
    }
    h += `<p class="ov-more"><a class="link-btn" href="#begleiter">Ganze Farm-Route</a></p>`;
    host.innerHTML = h;
  }

  function render() {
    chips();
    applyTiles();
    if (S.tiles.rotation) rotation();
    if (S.tiles.dps) dps();
    if (S.tiles.begleiter) begleiter();
  }

  /* ---------- Ereignisse ---------- */
  function onClick(e) {
    const b = e.target.closest("#v-overlay [data-ov]");
    if (!b) return;
    const act = b.getAttribute("data-ov"), id = b.getAttribute("data-id");
    if (act === "tile" || act === "hide") {
      S.tiles[id] = act === "hide" ? false : !S.tiles[id];
      save(); render();
    } else if (act === "mode") { S.mode = id === "pvp" ? "pvp" : "pve"; save(); rotation(); dps(); }
    else if (act === "ziel") { S.ziel = id; save(); begleiter(); }
    else if (act === "pet") { if (window.DK_BG) window.DK_BG.setLevel(+id, 1); begleiter(); }
    else if (act === "dauer") { if (window.DK_SK) window.DK_SK.test.dauer(+id); dps(); }
    else if (act === "start") { if (window.DK_SK) window.DK_SK.test.start(); }
  }
  function onSubmit(e) {
    if (!e.target || e.target.id !== "ov-dps-form") return;
    e.preventDefault();
    const T = window.DK_SK && window.DK_SK.test;
    const val = +document.getElementById("ov-dps-val").value;
    if (!T || !(val > 0)) return;
    const n = T.list(cls(), S.mode).length;
    T.add(cls(), S.mode, `${S.mode === "pvp" ? "PvP" : "PvE"}-Makro${n ? " " + (n + 1) : ""}`, val);
    dps();
  }

  window.DK_OV = {
    show() { if (app()) app().go("overlay"); render(); },
    start: () => S.start,
    setStart(on) { S.start = !!on; save(); },
  };

  function init() {
    render();
    document.addEventListener("click", onClick);
    document.addEventListener("submit", onSubmit);
    window.addEventListener("hashchange", () => { if (visible()) render(); });
    window.addEventListener("storage", (e) => {
      if (e.key === KEY) { S = load(); render(); }
      else if (visible() && (e.key === "dk.begleiter" || e.key === "dk.dps" || e.key === "dk.v1")) render();
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
