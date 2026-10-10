/*
 * Charakter-Check: Name eingeben → Daten über den Proxy laden → Auswertung anzeigen.
 * Alle Texte aus der Armory werden escaped, bevor sie ins HTML gehen.
 */
(function () {
  const D = window.DK_DATA, Z = window.DK_ZEIT, AU = window.DK_AUDIT;
  const $ = (s, r) => (r || document).querySelector(s);
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const fmt = (n) => (n == null || n === "" || isNaN(n) ? "–" : Math.round(Number(n)).toLocaleString("de-DE"));
  const REG = { eu: "Europa", nae: "NA Ost", naw: "NA West", la: "Südamerika", as: "Asien" };
  const FAC = { elyos: "Elyos", asmo: "Asmodier" };
  const STATUS = {
    schwach: ["Schwachstelle", "crit"], leer: ["Leer", "crit"], upgrade: ["Ausbauen", "warn"],
    warnung: ["Achtung", "warn"], ok: ["Gut", "ok"], top: ["Top", "gold"],
  };
  const CONF = { ok: "Bestätigt", community: "Community", offen: "Unsicher" };
  const chip = (c) => (c ? `<span class="chip chip--${c}">${CONF[c] || c}</span>` : "");

  const store = {
    get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* egal */ } },
  };

  let current = null; // { character }
  let lastQuery = null;
  let pendingSid = null;

  const CFG = window.DK_CONFIG || {};
  let apiState = "unbekannt"; // "ok" | "fehlt"

  function apiBase() {
    return String(CFG.apiBase || "").replace(/\/+$/, "");
  }

  function liveUrl() {
    const u = String(CFG.liveUrl || "").replace(/\/+$/, "");
    return u && !location.href.startsWith(u) ? u : "";
  }

  function liveLink(name, sid) {
    return `${liveUrl()}/?${name ? "name=" + encodeURIComponent(name) + (sid ? "&server=" + sid : "") : ""}#charakter`;
  }

  /* Hinweis, wenn diese Kopie der Seite keinen Server-Teil hat – ohne Spieler nach Technik zu fragen */
  function offlineText() {
    if (liveUrl()) {
      return `Diese Kopie der Seite hat keinen Server-Teil. Der Charakter-Check läuft auf der <a href="${esc(liveLink())}">Online-Version</a>; deine Suche wird automatisch dorthin geschickt.`;
    }
    return "Der Charakter-Check läuft nur auf der veröffentlichten Seite: NCSOFT erlaubt keine Abrufe direkt aus dem Browser, deshalb braucht es den Server-Teil der Seite. Wer die Seite betreibt, findet die Anleitung im README unter „Online stellen“.";
  }

  function markOffline() {
    apiState = "fehlt";
    ["#ch-offline", "#ov-ch-offline"].forEach((id) => {
      const n = $(id);
      if (n) { n.innerHTML = offlineText(); n.hidden = false; }
    });
  }

  async function api(path) {
    let res;
    try {
      res = await fetch(`${apiBase()}/api/${path}`, { headers: { Accept: "application/json" } });
    } catch (e) {
      throw new Error("offline");
    }
    let data = null;
    try { data = await res.json(); } catch (e) { /* keine JSON-Antwort */ }
    if (!data) throw new Error("kein-proxy");
    return data;
  }

  function problemText(err) {
    if (err.message === "kein-proxy" || err.message === "offline") {
      markOffline();
      return offlineText();
    }
    return esc(err.message || "Unbekannter Fehler");
  }

  function setStatus(kind, html) {
    const box = $("#ch-status");
    if (!box) return;
    box.className = "ch-status" + (kind ? " ch-status--" + kind : "");
    box.innerHTML = html || "";
    box.hidden = !html;
  }

  /* ---------- Server-Liste ---------- */
  async function loadServers() {
    const cached = store.get("dk.servers", null);
    if (cached && cached.at > Date.now() - 86400000 && cached.list && cached.list.length) return cached.list;
    const data = await api("servers");
    if (data.status !== "ok") throw new Error(data.message || "Serverliste nicht verfügbar");
    store.set("dk.servers", { at: Date.now(), list: data.servers });
    return data.servers;
  }

  function fillServerSelect(list) {
    const sel = $("#ch-server");
    if (!sel) return;
    const keep = sel.value;
    const groups = {};
    list.forEach((s) => { (groups[s.region] = groups[s.region] || []).push(s); });
    sel.innerHTML = '<option value="">Alle Global-Server</option>' + Object.keys(REG).filter((r) => groups[r]).map((r) =>
      `<optgroup label="${esc(REG[r])}">` + groups[r].sort((a, b) => a.name.localeCompare(b.name)).map((s) =>
        `<option value="${s.id}">${esc(s.name)} (${FAC[s.faction]})</option>`).join("") + "</optgroup>"
    ).join("");
    if (keep || pendingSid) sel.value = keep || String(pendingSid);
  }

  /* ---------- Abfrage ---------- */
  async function lookup(q) {
    if (apiState === "fehlt" && liveUrl()) {
      location.href = liveLink(q.name, q.sid);
      return;
    }
    lastQuery = q;
    $("#ch-result").innerHTML = "";
    setStatus("loading", `<span class="spinner" aria-hidden="true"></span> Lade ${q.name ? "„" + esc(q.name) + "“" : "Charakter"} aus der NCSOFT-Armory … das dauert etwa 5 bis 10 Sekunden.`);
    const params = q.cid ? `cid=${encodeURIComponent(q.cid)}&sid=${q.sid}` : `name=${encodeURIComponent(q.name)}${q.sid ? "&server=" + q.sid : ""}`;
    try {
      const data = await api("charakter?" + params);
      if (data.status === "ok") {
        setStatus("loading", `<span class="spinner" aria-hidden="true"></span> ${esc(data.character.meta.name)} gefunden – lade Ausrüstung, Manasteine und Daevanion …`);
        await loadDetails(data.character);
        setStatus(null, "");
        current = { character: data.character };
        remember(data.character);
        updateUrl(data.character);
        render();
      } else if (data.status === "mehrere") {
        renderMatches(data);
      } else if (data.status === "keiner") {
        setStatus("info", `Kein Charakter „${esc(data.name)}“ gefunden${q.sid ? " auf diesem Server" : " auf den Global-Servern"}. Prüf die Schreibweise; Groß- und Kleinschreibung ist egal.`);
      } else {
        setStatus("error", esc(data.message || "Abruf fehlgeschlagen."));
      }
    } catch (err) {
      setStatus("error", problemText(err));
    }
  }

  /* Daevanion und Item-Details in kleinen Anfragen nachladen und einfügen */
  async function loadDetails(ch) {
    const base = `cid=${encodeURIComponent(ch.meta.characterId)}&sid=${ch.meta.serverId}`;
    const items = ch.equipment.filter((e) => e.itemId).map((e) => `${e.slot}:${e.itemId}:${e.enchant + e.exceed}`);
    const batches = [];
    for (let i = 0; i < items.length; i += 12) batches.push(items.slice(i, i + 12));
    const jobs = [];
    if (ch.boards.length) {
      jobs.push(api(`daevanion?${base}&boards=${ch.boards.map((b) => b.id).join(",")}`).then((d) => {
        if (d.status !== "ok") return;
        ch.boards.forEach((b) => { if (d.boards[b.id]) Object.assign(b, d.boards[b.id]); });
      }).catch(() => {}));
    }
    batches.forEach((list) => {
      jobs.push(api(`items?${base}&list=${list.join(",")}`).then((d) => {
        if (d.status !== "ok") return;
        ch.equipment.forEach((e) => { if (d.items[e.slot] !== undefined) e.detail = d.items[e.slot]; });
      }).catch(() => {}));
    });
    await Promise.all(jobs);
    ch.meta.partial = ch.equipment.some((e) => e.itemId && !e.detail) || ch.boards.some((b) => !b.nodes.length);
  }

  let allMatches = null;
  function renderMatches(data, showAll) {
    allMatches = data;
    const sorted = data.matches.slice().sort((a, b) =>
      (a.region === "eu" ? 0 : 1) - (b.region === "eu" ? 0 : 1) || Number(b.level) - Number(a.level) || String(a.serverName).localeCompare(String(b.serverName)));
    const shown = showAll ? sorted : sorted.slice(0, 18);
    setStatus("info", `<p><strong>${data.matches.length} Charaktere heißen „${esc(data.name)}“.</strong> Welcher ist deiner? Europa und höchstes Level stehen oben. Mit der Server-Auswahl geht es direkt.</p>` +
      '<ul class="ch-matches">' + shown.map((m) =>
        `<li><button type="button" class="btn btn--ghost" data-ch="pick" data-cid="${esc(m.characterId)}" data-sid="${m.serverId}" data-name="${esc(m.name)}">` +
        `<strong>${esc(m.serverName)}</strong> <span class="muted">${esc(REG[m.region] || m.region)} · ${FAC[m.faction]} · Level ${esc(m.level)}${classOf(m.pcId) ? " · " + esc(classOf(m.pcId)) : ""}</span></button></li>`
      ).join("") + "</ul>" +
      (shown.length < sorted.length ? `<button type="button" class="link-btn" data-ch="all-matches">Alle ${sorted.length} anzeigen</button>` : ""));
  }

  function classOf(pcId) {
    const id = D.audit.pcClass[pcId];
    const c = D.classes.find((x) => x.id === id);
    return c ? c.name : "";
  }

  function remember(ch) {
    const list = store.get("dk.recent", []).filter((r) => !(r.name.toLowerCase() === ch.meta.name.toLowerCase() && r.sid === ch.meta.serverId));
    list.unshift({ name: ch.meta.name, sid: ch.meta.serverId, server: ch.meta.serverName });
    store.set("dk.recent", list.slice(0, 6));
    renderRecent();
  }

  function renderRecent() {
    const box = $("#ch-recent");
    if (!box) return;
    const list = store.get("dk.recent", []);
    box.innerHTML = list.length ? '<span class="muted small">Zuletzt:</span> ' + list.map((r) =>
      `<button type="button" class="fchip is-on" data-ch="recent" data-name="${esc(r.name)}" data-sid="${r.sid}">${esc(r.name)} <span class="muted">${esc(r.server || "")}</span></button>`).join("") : "";
  }

  function shareUrl(ch) {
    return `${location.origin}${location.pathname}?name=${encodeURIComponent(ch.meta.name)}&server=${ch.meta.serverId}#charakter`;
  }

  function updateUrl(ch) {
    if (!/^https?:$/.test(location.protocol)) return;
    try { history.replaceState(null, "", `?name=${encodeURIComponent(ch.meta.name)}&server=${ch.meta.serverId}#charakter`); } catch (e) { /* egal */ }
  }

  /* ---------- Darstellung ---------- */
  function resKey(ch) { return `dk.res.${ch.meta.serverId}.${ch.meta.name.toLowerCase()}`; }

  function render() {
    if (!current) return;
    const ch = current.character;
    const res = store.get(resKey(ch), {});
    const shifts = window.DK_APP && window.DK_APP.shifts ? window.DK_APP.shifts() : {};
    const a = AU.analyse(ch, { resources: res, shifts });
    current.audit = a;
    const p = ch.profile;
    const gate = a.nextGate;
    const quick = a.quick.filter((q) => q !== a.verdict);

    let h = `<article class="ch" aria-labelledby="ch-name-h">`;
    h += `<header class="ch-head">
      <div class="ch-id">
        <p class="eyebrow">${esc(a.clsName || p.className)} · Level ${esc(p.level)} · ${esc(ch.meta.serverName)} (${esc(REG[ch.meta.region] || "")}, ${FAC[ch.meta.faction]})</p>
        <h2 id="ch-name-h">${esc(p.name)}</h2>
      </div>
      <dl class="ch-kpis">
        <div><dt>Kampfkraft</dt><dd>${fmt(p.combatPower)}</dd></div>
        <div><dt>Gearscore</dt><dd>${fmt(a.gs)}</dd></div>
        <div><dt>Nächstes Tor</dt><dd>${gate ? gate.gs : "–"}</dd>${gate ? `<span>noch ${fmt(gate.gs - a.gs)} · ${esc(gate.title)}</span>` : ""}</div>
      </dl>
      <div class="ch-actions">
        <button type="button" class="btn" data-ch="apply">Für die ganze Seite übernehmen</button>
        <button type="button" class="btn btn--ghost" data-ch="share">Link kopieren</button>
        <button type="button" class="btn btn--ghost" data-ch="reload">Neu laden</button>
      </div>
      <input class="ch-share" id="ch-share" type="text" readonly value="${esc(shareUrl(ch))}" aria-label="Link zu dieser Auswertung" hidden>
    </header>`;

    h += `<section class="verdict" aria-label="Sofort-Urteil">
      <p class="eyebrow">Sofort-Urteil</p>
      <p class="verdict-title">${esc(a.verdict.title)}</p>
      <p>${esc(a.verdict.why)}</p>
      ${a.verdict.how ? `<p class="muted">${esc(a.verdict.how)}</p>` : ""}
      ${chip(a.verdict.conf)}
    </section>`;

    h += `<div class="two">
      <section class="panel"><h3>Quick-Wins unter 10 Minuten</h3>${quick.length ? '<ol class="prio">' + quick.map((q) =>
        `<li><strong>${esc(q.title)}</strong><br><span class="small muted">${esc(q.why)}</span>${q.how ? `<br><span class="small">${esc(q.how)}</span>` : ""}</li>`).join("") + "</ol>" : '<p class="empty">Keine schnellen Korrekturen nötig.</p>'}</section>
      <section class="panel"><h3>Tagesziel</h3><ol class="prio">${a.today.map((t) => `<li><strong>${esc(t.title)}</strong><br><span class="small muted">${esc(t.why)}</span></li>`).join("")}</ol>
        <h4 class="lbl-line">Heute in deutscher Zeit</h4>
        <ul class="nx-list">${a.times.map((t) => `<li class="nx"><span class="nx-time">${Z.time(t.ts)}</span><span class="nx-name">${esc(t.label)}${t.day ? ` <small>${esc(Z.day(t.ts))}</small>` : ""}${t.more && t.more.length ? ` <small>dann ${esc(t.more.join(", "))}</small>` : ""}${t.note ? ` <small>${esc(t.note)}</small>` : ""}</span><span class="nx-cd"><span class="cd" data-cd="${t.ts}"></span></span></li>`).join("")}</ul>
      </section>
    </div>`;

    h += `<section class="panel"><h3>Ausrüstung</h3><div class="tbl-scroll"><table class="tbl gear-tbl"><thead><tr><th scope="col">Slot</th><th scope="col">Jetzt</th><th scope="col">Status</th><th scope="col">Nächster Schritt</th></tr></thead><tbody>` +
      a.gear.map((r) => {
        const st = STATUS[r.status] || STATUS.ok;
        const it = r.item;
        const d = it && it.detail;
        const stones = d && d.stoneSlots ? ` · Manasteine ${d.stones.length}/${d.stoneSlots}` : "";
        return `<tr class="gs-${r.status}"><th scope="row">${esc(r.label)}</th>` +
          `<td>${it ? `${esc(it.name)} <strong>+${it.enchant}</strong>${it.exceed ? ` (+${it.exceed})` : ""}<br><span class="small muted">${r.il ? "IL " + r.il + " · " : ""}${esc(it.grade || "")}${stones}</span>` : '<span class="muted">–</span>'}</td>` +
          `<td><span class="stat stat--${st[1]}">${st[0]}</span></td>` +
          `<td>${esc(r.next)}${r.source ? `<br><span class="small muted">${esc(r.source)}</span>` : ""}</td></tr>`;
      }).join("") + `</tbody></table></div><p class="fine">IL = Item-Level des Teils. Drop-Chancen und Garantie-Gutscheine laut Spieldaten (Metabot), 10 Eroberungs-Würfel pro Woche.</p></section>`;

    h += `<div class="two">
      <section class="panel"><h3>Stigmen</h3><div class="tbl-scroll"><table class="tbl"><thead><tr><th scope="col">Stigma</th><th scope="col">Status</th><th scope="col">Stufe</th><th scope="col">Splitter bis 15</th></tr></thead><tbody>` +
      a.stigmas.map((s) => `<tr><th scope="row">${esc(s.name)}${s.core ? ' <span class="mine">Kern</span>' : ""}</th><td>${!s.acquired ? "nicht freigeschaltet" : s.equipped ? "ausgerüstet" : '<strong class="warn-text">nicht ausgerüstet</strong>'}</td><td class="num">${s.acquired ? s.level : "–"}</td><td class="num">${s.core && s.acquired ? (s.shards ? s.shards : "✓") : "–"}</td></tr>`).join("") +
      `</tbody></table></div><p class="fine">Kern-Stigmen: die Stigmen, die die Top-Spieler deiner Klasse in PvE fast immer nutzen. Stufe 11–15 kostet je 4 Splitter.</p></section>
      <section class="panel"><h3>Daevanion</h3><ul class="boards">` +
      a.boards.map((b) => {
        const pct = b.total ? Math.round((b.open / b.total) * 100) : 0;
        const off = Object.entries(b.offensive).sort((x, y) => y[1] - x[1]).slice(0, 4).map(([k, v]) => `${k} ×${v}`);
        const sk = Object.entries(b.skills).map(([k, v]) => `${k}${v > 1 ? " ×" + v : ""}`);
        return `<li><div class="board-head"><strong>${esc(b.name)}</strong>${b.pvp ? ' <span class="chip chip--offen">PvP</span>' : ""}<span class="num muted">${b.open}/${b.total}</span></div>
          <div class="meter"><div class="meter-fill" style="width:${pct}%"></div></div>
          ${b.pvp ? '<p class="small muted">PvP-Brett: für PvE zuletzt.</p>' : (off.length || sk.length ? `<p class="small muted">Noch zu: ${esc(sk.concat(off).join(" · "))}</p>` : '<p class="small muted">Offensive Knoten erledigt.</p>')}</li>`;
      }).join("") + `</ul></section>
    </div>`;

    h += `<div class="two">
      <section class="panel"><h3>Build & Werte</h3>${a.build.map((b) => `<h4 class="lbl-line">${esc(b.title)}</h4><ol class="prio">${b.list.map((x) => `<li>${esc(x)}</li>`).join("")}</ol>`).join("")}
        <p class="fine">Die Armory zeigt keine Gesamtwerte für Genauigkeit, Krit und Geschwindigkeit. Breakpoints prüfst du im Werte-Fenster im Spiel.</p></section>
      <section class="panel"><h3>Manasteine</h3>
        ${a.emptyStones.length ? `<h4 class="lbl-line">Leere Slots</h4><ul class="plain">${a.emptyStones.map((x) => `<li>${esc(x.label)} (${esc(x.name)}): ${x.free} frei</li>`).join("")}</ul>` : '<p class="small">Keine leeren Slots.</p>'}
        ${a.badStones.length ? `<h4 class="lbl-line">Defensive Steine auf IL-70-Teilen</h4><ul class="plain">${a.badStones.map((x) => `<li>${esc(x.label)}: ${esc(x.stones.join(", "))}</li>`).join("")}</ul>` : ""}
        <p class="fine">Manasteine gehen beim Gear-Transfer verloren. Investiere nur in Teile, die du länger behältst.</p></section>
    </div>`;

    h += `<div class="two">
      <section class="panel"><h3>Farmen</h3><ul class="plain">${a.farm.map((x) => `<li>${esc(x)}</li>`).join("")}</ul></section>
      <section class="panel panel--warn"><h3>Nicht verschwenden</h3><ul class="donts">${a.waste.map((x) => `<li>${esc(x)}</li>`).join("")}</ul></section>
    </div>`;

    h += `<section class="panel"><h3>Deine Ressourcen</h3>
      <p class="small muted">Trag ein, was du gerade hast. Die Seite rechnet aus, was davon reicht. Die Werte bleiben nur in deinem Browser.</p>
      <form class="res-form" id="ch-res-form" autocomplete="off">
        <label class="field"><span>Kinah</span><input type="number" id="ch-res-kinah" min="0" step="1000" inputmode="numeric" value="${res.kinah != null ? res.kinah : ""}"></label>
        <label class="field"><span>Abyss-Punkte (AP)</span><input type="number" id="ch-res-ap" min="0" step="100" inputmode="numeric" value="${res.ap != null ? res.ap : ""}"></label>
        <label class="field"><span>Verstärkungssteine</span><input type="number" id="ch-res-stones" min="0" step="10" inputmode="numeric" value="${res.stones != null ? res.stones : ""}"></label>
        <button type="submit" class="btn">Plan anpassen</button>
      </form>
      ${a.costs.notes.length ? `<ul class="plain res-notes">${a.costs.notes.map((n) => `<li>${esc(n)}</li>`).join("")}</ul>` : ""}
    </section>`;

    if (ch.meta.partial) h += `<p class="notice">Ein Teil der Details (Manasteine oder Daevanion) kam nicht an. Die Auswertung ist deshalb unvollständig – „Neu laden“ versucht es erneut.</p>`;
    h += `<p class="fine">Daten aus der NCSOFT-Armory, abgerufen ${esc(Z.day(Date.parse(ch.meta.fetchedAt)))} ${esc(Z.time(Date.parse(ch.meta.fetchedAt)))}. Die Endpunkte sind inoffiziell. Drops, Kosten und Garantien stammen aus den Spieldaten (Metabot), Meta-Empfehlungen aus Guides; NCSOFT veröffentlicht keine CP-Formel.</p>`;
    h += "</article>";
    $("#ch-result").innerHTML = h;
  }

  /* ---------- Ereignisse ---------- */
  function onSubmit(e) {
    const form = e.target;
    if (form.id === "ch-form" || form.id === "ov-ch-form") {
      e.preventDefault();
      const nameInput = form.querySelector('input[name="name"]');
      const name = nameInput.value.trim();
      if (!name) { nameInput.focus(); return; }
      const sel = $("#ch-server");
      const sid = form.id === "ch-form" && sel && sel.value ? Number(sel.value) : null;
      if (form.id === "ov-ch-form") {
        $("#ch-name").value = name;
        window.DK_APP.go("charakter");
      }
      lookup({ name, sid });
    } else if (form.id === "ch-res-form") {
      e.preventDefault();
      if (!current) return;
      const val = (id) => { const v = $(id).value.trim(); return v === "" ? null : Math.max(0, Number(v)); };
      store.set(resKey(current.character), { kinah: val("#ch-res-kinah"), ap: val("#ch-res-ap"), stones: val("#ch-res-stones") });
      render();
      const notes = $(".res-notes");
      if (notes) notes.scrollIntoView({ block: "nearest" });
    }
  }

  function onClick(e) {
    const b = e.target.closest("[data-ch]");
    if (!b) return;
    const act = b.getAttribute("data-ch");
    if (act === "all-matches" && allMatches) {
      renderMatches(allMatches, true);
    } else if (act === "pick") {
      lookup({ cid: b.getAttribute("data-cid"), sid: Number(b.getAttribute("data-sid")), name: b.getAttribute("data-name") });
    } else if (act === "recent") {
      $("#ch-name").value = b.getAttribute("data-name");
      lookup({ name: b.getAttribute("data-name"), sid: Number(b.getAttribute("data-sid")) });
    } else if (act === "reload" && lastQuery) {
      lookup(current ? { cid: current.character.meta.characterId, sid: current.character.meta.serverId, name: current.character.meta.name } : lastQuery);
    } else if (act === "apply" && current && current.audit) {
      window.DK_APP.setStatus({ gs: current.audit.gs, cls: current.audit.cls, faction: current.audit.faction });
      b.textContent = "Übernommen";
    } else if (act === "share" && current) {
      const input = $("#ch-share");
      const url = input.value;
      const done = () => { b.textContent = "Link kopiert"; };
      const fallback = () => { input.hidden = false; input.select(); b.textContent = "Link markiert"; };
      try {
        const p = navigator.clipboard && navigator.clipboard.writeText(url);
        if (p && p.then) p.then(done, fallback); else fallback();
      } catch (err) { fallback(); }
    }
  }

  /* Prüft beim Laden, ob der Server-Teil antwortet, und füllt dabei die Serverliste */
  async function initServers() {
    if (location.protocol === "file:" && !apiBase()) { markOffline(); return; }
    try {
      fillServerSelect(await loadServers());
      apiState = "ok";
    } catch (err) {
      if (err.message === "kein-proxy" || err.message === "offline") markOffline();
    }
  }

  function init() {
    document.addEventListener("submit", onSubmit);
    document.addEventListener("click", onClick);
    try { localStorage.removeItem("dk.api"); } catch (e) { /* frühere Proxy-Eingabe verwerfen */ }
    renderRecent();
    initServers();
    const params = new URLSearchParams(location.search);
    const name = params.get("name");
    if (name) {
      $("#ch-name").value = name;
      const sid = Number(params.get("server")) || null;
      pendingSid = sid;
      if (window.DK_APP) window.DK_APP.go("charakter");
      lookup({ name, sid });
    }
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
