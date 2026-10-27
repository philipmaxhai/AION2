/*
 * Desktop-App: Download-Seite (#desktop) und – wenn die Seite in der App läuft (window.dkDesktop aus desktop/,
 * Go + WebView2) – das Overlay-Menü im Kopf: Kachel-Overlay (#overlay, overlay.js), im Vordergrund, Deckkraft,
 * kompakt, Durchklicken.
 * In der App öffnen Links zu anderen Seiten im Standard-Browser.
 * Daten zur Datei: download/DaevaKompass.json (vom Build-Skript tools/build-desktop.sh geschrieben).
 */
(function () {
  const D = window.DK_DATA || {};
  const KA = D.kampfanalyse;
  const bridge = typeof window.dkDesktop === "function" ? window.dkDesktop : null;
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const size = (b) => (b >= 1048576 ? (b / 1048576).toFixed(1).replace(".", ",") + " MB" : Math.round(b / 1024) + " KB");
  const kbd = (k) => String(k || "").split("+").map((x) => `<kbd>${esc(x)}</kbd>`).join("+");
  let info = null;
  let meta = null;

  /* ---------- Download-Seite ---------- */
  function render() {
    const host = document.getElementById("dk-app");
    if (!host) return;
    const keys = info || { tasteZeigen: "Strg+Umschalt+K", tasteDurchklicken: "Strg+Umschalt+D", tasteZuruecksetzen: "Strg+Umschalt+0" };
    const dl = meta
      ? `<a class="btn" href="download/${esc(meta.datei)}" download>DaevaKompass.exe laden · ${size(meta.bytes)}</a>
         <p class="dk-meta">Version ${esc(meta.version)} vom ${esc(meta.datum)} · SHA-256 ${esc(meta.sha256)}</p>`
      : `<p class="muted">Die Datei-Angaben werden geladen …</p>`;
    host.innerHTML = `
      <section class="sk-sec" aria-labelledby="dk-dl-h">
        <div class="dk-hero">
          <div class="dk-dl">
            <header class="sk-sec-head"><h3 id="dk-dl-h">Herunterladen <span class="chip chip--offen">Neu</span></h3>
              <p>Eine einzelne Datei, keine Installation. Leg sie in einen eigenen Ordner (z. B. <b>Dokumente\\DaevaKompass</b>) und starte sie per Doppelklick. Daneben entsteht der Ordner <b>DaevaKompass-Daten</b> mit deinen Einstellungen.</p></header>
            ${bridge ? `<p class="notice">Du nutzt die App gerade${info ? ` (Version ${esc(info.version)})` : ""}. Das Overlay-Menü findest du oben rechts.</p>` : dl}
          </div>
          <div class="dk-dl">
            <h4>Voraussetzungen</h4>
            <ul class="sk-tips">
              <li>Windows 10 oder 11 (64 Bit) mit der Microsoft Edge WebView2 Runtime – bei Windows 11 schon dabei. Fehlt sie, bietet die App den Download bei Microsoft an.</li>
              <li>Windows SmartScreen warnt beim ersten Start, weil die Datei nicht signiert ist: <b>Weitere Informationen › Trotzdem ausführen</b>. Die SHA-256-Prüfsumme oben muss zu deiner Datei passen.</li>
              <li>AION 2 im <b>Fenster</b> oder <b>randlosen Vollbild</b> spielen – über exklusivem Vollbild kann kein Fenster liegen.</li>
            </ul>
          </div>
        </div>
      </section>
      <section class="sk-sec" aria-labelledby="dk-f-h">
        <header class="sk-sec-head"><h3 id="dk-f-h">Was die App kann</h3><p>Die App zeigt die Live-Seite in einem eigenen Fenster – Daten, Zeiten und Pläne sind also immer aktuell, deine Häkchen bleiben im App-Ordner.</p></header>
        <ul class="dk-feats">
          <li class="dk-feat"><b>Kachel-Overlay</b><span>Ein Klick im Overlay-Menü macht das Fenster schmal, legt es über das Spiel und zeigt nur noch Kacheln: Termine, Rotation, Schadenstest, Begleiter und Checkliste – jede einzeln an- und ausschaltbar. <a href="#overlay">Im Browser ansehen</a></span></li>
          <li class="dk-feat"><b>Über dem Spiel</b><span>„Immer im Vordergrund“ im Overlay-Menü: Timer, Checkliste, Leiste oder Begleiter-Route neben dem Spiel.</span></li>
          <li class="dk-feat"><b>Durchsichtig</b><span>Deckkraft von 30 bis 100 %, damit das Spiel durchscheint.</span></li>
          <li class="dk-feat"><b>Durchklicken</b><span>Mausklicks gehen durch das Fenster ans Spiel. Ein und aus mit ${kbd(keys.tasteDurchklicken)}.</span></li>
          <li class="dk-feat"><b>Ein- und ausblenden</b><span>${kbd(keys.tasteZeigen)} zeigt oder versteckt das Fenster – auch mitten im Spiel.</span></li>
          <li class="dk-feat"><b>Kompakt</b><span>Schmales Fenster in Handy-Breite für den Bildschirmrand; Größe und Position merkt sich die App.</span></li>
          <li class="dk-feat"><b>Notbremse</b><span>${kbd(keys.tasteZuruecksetzen)} macht das Fenster wieder normal: voll deckend, nicht durchklickbar, nicht im Vordergrund.</span></li>
        </ul>
        <p class="sk-hint">Tasten ändern: in <b>DaevaKompass-Daten\\einstellungen.json</b> die Einträge <code>tasteZeigen</code>, <code>tasteDurchklicken</code> und <code>tasteZuruecksetzen</code> anpassen (z. B. <code>"Strg+Alt+F9"</code>) und die App neu starten.</p>
      </section>
      ${KA ? `<section class="sk-sec" aria-labelledby="dk-dmg-h">
        <header class="sk-sec-head"><h3 id="dk-dmg-h">Schadensanzeige</h3>
          <p>AION 2 hat einen eigenen Schadensmesser: die <b>Kampfanalyse</b> mit ${kbd(KA.taste)}. Sie zeigt ${esc(KA.zeigt.join(", "))}.</p></header>
        <ul class="sk-tips">
          <li>${esc(KA.bedienung)}</li>
          <li>${esc(KA.grenzen)}</li>
          <li><b>Warum die App keine eigene Schadensanzeige hat:</b> ${esc(KA.fremd)}</li>
        </ul>
        <p><button type="button" class="btn btn--ghost" data-action="open-sk" data-id="${esc((window.DK_APP && window.DK_APP.status().cls) || "spiritmaster")}" data-dk="dps">Schadenstest für dein Makro</button></p>
      </section>` : ""}
      <p class="fine">Quelltext im Ordner desktop/ des Projekts (Go mit WebView2). Die App liest nichts aus dem Spiel und schickt nichts außer den Seitenaufrufen ins Netz.</p>`;
  }

  async function loadMeta() {
    try {
      const r = await fetch("download/DaevaKompass.json", { cache: "no-cache" });
      if (r.ok) meta = await r.json();
    } catch (e) { /* ohne Angaben bleibt nur der Hinweis */ }
    render();
  }

  /* ---------- Overlay-Menü in der App ---------- */
  function panelHtml() {
    const i = info || {};
    const pct = Math.round((i.deckkraft || 1) * 100);
    const ov = window.DK_OV;
    const onOv = location.hash === "#overlay";
    return `<h2 id="dk-panel-h">Overlay</h2>
        ${ov ? `<button type="button" class="btn" data-dkc="kacheln">${onOv ? "Kacheln schließen" : "Kacheln über dem Spiel"}</button>
        <label class="dk-row switch"><input type="checkbox" data-dkc="start"${ov.start() ? " checked" : ""}><span>Beim Start mit den Kacheln öffnen</span></label>` : ""}
        <label class="dk-row switch"><input type="checkbox" data-dkc="oben"${i.oben ? " checked" : ""}${i.durchklicken ? " disabled" : ""}><span>Immer im Vordergrund</span></label>
        <label class="dk-row"><span>Deckkraft</span><input type="range" min="30" max="100" step="5" value="${pct}" data-dkc="deckkraft" aria-label="Deckkraft in Prozent"><b data-dk-pct>${pct} %</b></label>
        <label class="dk-row switch"><input type="checkbox" data-dkc="kompakt"${i.kompakt ? " checked" : ""}><span>Kompakt (schmal)</span></label>
        <button type="button" class="btn btn--ghost" data-dkc="durchklicken">${i.durchklicken ? "Durchklicken aus" : "Durchklicken einschalten"}</button>
        <ul class="dk-keys">
          <li>${kbd(i.tasteDurchklicken)} Durchklicken an/aus</li>
          <li>${kbd(i.tasteZeigen)} Fenster zeigen/verstecken</li>
          <li>${kbd(i.tasteZuruecksetzen)} alles zurücksetzen</li>
        </ul>
        ${i.tastenFehler && i.tastenFehler.length ? `<p class="dk-warn">Schon von einem anderen Programm belegt: ${i.tastenFehler.map(esc).join(", ")}. In einstellungen.json ändern.</p>` : ""}`;
  }
  /* Knopf in der Kopfzeile, Feld direkt im body (die Kopfzeile ist Bezugsrahmen für feste Elemente) */
  function mountTools() {
    const bar = document.querySelector(".topbar-tools");
    if (!bar) return;
    let btn = document.querySelector(".dk-toggle");
    if (!btn) {
      btn = document.createElement("button");
      btn.type = "button";
      btn.className = "btn btn--ghost dk-toggle";
      btn.setAttribute("aria-expanded", "false");
      btn.setAttribute("aria-controls", "dk-panel");
      btn.innerHTML = `<svg class="nav-ico" aria-hidden="true"><use href="#n-app"/></svg><span>Overlay</span>`;
      bar.insertBefore(btn, bar.firstChild);
    }
    let panel = document.getElementById("dk-panel");
    if (!panel) {
      panel = document.createElement("div");
      panel.id = "dk-panel";
      panel.className = "dk-panel";
      panel.setAttribute("role", "dialog");
      panel.setAttribute("aria-labelledby", "dk-panel-h");
      panel.hidden = true;
      document.body.appendChild(panel);
    }
    panel.innerHTML = panelHtml();
  }
  function togglePanel(open) {
    const panel = document.getElementById("dk-panel"), btn = document.querySelector(".dk-toggle");
    if (!panel || !btn) return;
    panel.hidden = !open;
    btn.setAttribute("aria-expanded", String(open));
    btn.classList.toggle("is-on", open);
  }
  function apply(next) {
    if (next && typeof next === "object") info = next;
    mountTools();
    render();
  }
  function call(cmd, val) {
    return bridge(cmd, val).then(apply, (err) => { console.warn("Desktop-App:", err); });
  }

  let pending = null;
  function onInput(e) {
    const t = e.target;
    if (!t.matches || !t.matches('[data-dkc="deckkraft"]')) return;
    const out = document.querySelector("[data-dk-pct]");
    if (out) out.textContent = t.value + " %";
    clearTimeout(pending);
    pending = setTimeout(() => { bridge("deckkraft", +t.value / 100).then((n) => { info = n; }, () => {}); }, 120);
  }
  function onChange(e) {
    const t = e.target;
    if (!t.matches) return;
    if (t.matches('[data-dkc="oben"]')) call("oben", t.checked);
    else if (t.matches('[data-dkc="kompakt"]')) call("kompakt", t.checked);
    else if (t.matches('[data-dkc="deckkraft"]')) call("deckkraft", +t.value / 100);
    else if (t.matches('[data-dkc="start"]') && window.DK_OV) window.DK_OV.setStart(t.checked);
  }
  /* Kachel-Overlay: Ansicht #overlay, schmales Fenster, im Vordergrund – und zurück */
  function kacheln() {
    if (!window.DK_OV) return;
    if (location.hash === "#overlay") {
      if (window.DK_APP) window.DK_APP.go("uebersicht");
      call("kompakt", false);
    } else {
      window.DK_OV.show();
      call("kompakt", true).then(() => call("oben", true));
    }
    togglePanel(false);
  }
  function onClick(e) {
    if (e.target.closest(".dk-toggle")) { togglePanel(document.getElementById("dk-panel").hidden); return; }
    const b = e.target.closest('[data-dkc="durchklicken"]');
    if (b) { call("durchklicken", !(info && info.durchklicken)); return; }
    if (e.target.closest('[data-dkc="kacheln"]')) { kacheln(); return; }
    if (!e.target.closest("#dk-panel")) togglePanel(false);
    const a = e.target.closest("a[href]");
    if (!a || e.defaultPrevented) return;
    let u;
    try { u = new URL(a.getAttribute("href"), location.href); } catch (err) { return; }
    if (u.origin === location.origin || !/^https?:$/.test(u.protocol)) return;
    e.preventDefault();
    if (u.protocol === "https:") bridge("oeffnen", u.href).catch(() => {});
  }

  function initApp() {
    document.documentElement.classList.add("is-desktop");
    window.open = function (url) {
      try {
        const u = new URL(url, location.href);
        if (u.protocol === "https:") bridge("oeffnen", u.href).catch(() => {});
      } catch (err) { /* ungültige Adresse */ }
      return null;
    };
    document.addEventListener("click", onClick);
    document.addEventListener("input", onInput);
    document.addEventListener("change", onChange);
    window.addEventListener("dkdesktop", (e) => apply(e.detail));
    window.addEventListener("hashchange", () => mountTools());
    if (window.DK_OV && window.DK_OV.start() && (!location.hash || location.hash === "#uebersicht")) window.DK_OV.show();
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") togglePanel(false); });
    bridge("info").then(apply, () => mountTools());
  }

  function init() {
    render();
    loadMeta();
    if (bridge) initApp();
    document.addEventListener("click", (e) => {
      const b = e.target.closest('[data-dk="dps"]');
      if (b) setTimeout(() => { const t = document.getElementById("sk-test"); if (t) t.scrollIntoView({ block: "start" }); }, 0);
    });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
