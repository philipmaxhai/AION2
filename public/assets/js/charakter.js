/*
 * Charakter-Check: Name eingeben → Daten über den Proxy laden → Auswertung anzeigen.
 * Darstellung: Porträt und Kennzahlen, Sofort-Urteil, Fahrplan in Phasen (abhakbar),
 * Ausrüstung als Charakterfenster mit Plan pro Slot, Stigmen, Daevanion, Werte, Farmen, Ressourcen.
 * Alle Texte aus der Armory werden escaped, bevor sie ins HTML gehen.
 */
(function () {
  const D = window.DK_DATA, Z = window.DK_ZEIT, AU = window.DK_AUDIT;
  const A = D.audit;
  const $ = (s, r) => (r || document).querySelector(s);
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const fmt = (n) => (n == null || n === "" || isNaN(n) ? "–" : Math.round(Number(n)).toLocaleString("de-DE"));
  const nm = (x) => (x && (x.de || x.name)) || "";
  const REG = { eu: "Europa", nae: "NA Ost", naw: "NA West", la: "Südamerika", as: "Asien" };
  const FAC = { elyos: "Elyos", asmo: "Asmodier" };
  const CONF = { ok: "Bestätigt", community: "Community", offen: "Unsicher" };
  const chip = (c) => (c ? `<span class="chip chip--${c}">${CONF[c] || c}</span>` : "");

  /* Bilder der offiziellen Armory (NCSOFT-CDN) */
  const IMG = "https://assets.playnccdn.com/static-aion2/characters/img/";
  const clsFile = (id) => (id === "spiritmaster" ? "elementalist" : id);
  const clsIcon = (id) => (id ? `${IMG}class/class_icon_${clsFile(id)}.png` : "");
  const STAT_IMG = {
    STR: "stat_str", DEX: "stat_dex", INT: "stat_int", CON: "stat_con", AGI: "stat_agi", WIS: "stat_wis",
    Justice: "stat_lords_justice", Freedom: "stat_lords_freedom", Illusion: "stat_lords_illusion", Life: "stat_lords_life",
    Time: "stat_lords_time", Destruction: "stat_lords_destruction", Death: "stat_lords_death", Wisdom: "stat_lords_wisdom",
    Destiny: "stat_lords_destiny", Space: "stat_lords_space",
  };
  const PRIMARY = ["STR", "DEX", "INT", "CON", "AGI", "WIS"];
  const GRADE_DE = { Common: "Gewöhnlich", Rare: "Selten", Legend: "Legendär", Unique: "Einzigartig", Epic: "Episch", Mythic: "Mythisch", Special: "Speziell" };
  const gradeCls = (g) => "g-" + (GRADE_DE[g] ? g : "Common");
  const TITLE_CAT = { Attack: "Angriff", Defense: "Verteidigung", Etc: "Sonstiges" };

  const STATUS = {
    schwach: ["Ersetzen", "crit"], leer: ["Leer", "crit"], upgrade: ["Ausbauen", "warn"],
    warnung: ["Achtung", "warn"], ok: ["Gut", "ok"], top: ["Top", "gold"],
  };
  const VERDICT = {
    ersetzen: ["Ersetzen", "crit"], ausbauen: ["Ausbauen", "warn"], behalten: ["Behalten", "ok"],
    achtung: ["Stehen lassen", "warn"], leer: ["Slot leer", "crit"],
  };
  const RATE = { gut: "passt", neutral: "geht", schwach: "schwach" };
  const LEFT = [1, 2, 3, 4, 5, 6, 7, 8, 19];
  const RIGHT = [10, 11, 12, 13, 14, 15, 16, 17, 22];
  const RUNES = [23, 24];

  /* <img> mit Ersatzbild; fehlt die Adresse, steht ein Zeichen an seiner Stelle */
  function pic(src, cls, alt, fb) {
    if (!src) return `<span class="${cls} pic-none" aria-hidden="true"></span>`;
    return `<img class="${cls}" src="${esc(src)}" alt="${esc(alt || "")}" loading="lazy" decoding="async"${fb ? ` data-fb="${esc(fb)}"` : ""}>`;
  }

  const store = {
    get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch (e) { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch (e) { /* egal */ } },
  };

  let current = null; // { character, audit, sel, dvSel }
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
        setStatus("loading", `<span class="spinner" aria-hidden="true"></span> ${esc(data.character.meta.name)} gefunden – lade Ausrüstung, Manasteine, Daevanion und die Werte bei +10 …`);
        await loadDetails(data.character);
        setStatus(null, "");
        current = { character: data.character, sel: null };
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

  /* Daevanion, Item-Details und die Werte bei +10 in kleinen Anfragen nachladen und einfügen */
  async function loadDetails(ch) {
    const base = `cid=${encodeURIComponent(ch.meta.characterId)}&sid=${ch.meta.serverId}`;
    const chunks = (list) => { const out = []; for (let i = 0; i < list.length; i += 12) out.push(list.slice(i, i + 12)); return out; };
    const items = ch.equipment.filter((e) => e.itemId).map((e) => `${e.slot}:${e.itemId}:${e.enchant + e.exceed}`);
    // Vorschau bei +10: zeigt, was die Verstärkung an Werten bringt (Runen ausgenommen, die bleiben stehen)
    const preview = ch.equipment.filter((e) => e.itemId && e.enchant < 10 && e.slot < 23).map((e) => `${e.slot}:${e.itemId}:10`);
    const jobs = [];
    if (ch.boards.length) {
      jobs.push(api(`daevanion?${base}&boards=${ch.boards.map((b) => b.id).join(",")}`).then((d) => {
        if (d.status !== "ok") return;
        ch.boards.forEach((b) => { if (d.boards[b.id]) Object.assign(b, d.boards[b.id]); });
      }).catch(() => {}));
    }
    chunks(items).forEach((list) => {
      jobs.push(api(`items?${base}&list=${list.join(",")}`).then((d) => {
        if (d.status !== "ok") return;
        ch.equipment.forEach((e) => { if (d.items[e.slot] !== undefined) e.detail = d.items[e.slot]; });
      }).catch(() => {}));
    });
    chunks(preview).forEach((list) => {
      jobs.push(api(`items?${base}&list=${list.join(",")}`).then((d) => {
        if (d.status !== "ok") return;
        ch.equipment.forEach((e) => { if (d.items[e.slot]) e.preview = d.items[e.slot]; });
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
      '<ul class="ch-matches">' + shown.map((m) => {
        const cid = A.pcClass[m.pcId];
        return `<li><button type="button" class="match" data-ch="pick" data-cid="${esc(m.characterId)}" data-sid="${m.serverId}" data-name="${esc(m.name)}">` +
          `${cid ? pic(clsIcon(cid), "match-ico") : ""}<span><strong>${esc(m.serverName)}</strong> <span class="muted">${esc(REG[m.region] || m.region)} · ${FAC[m.faction]} · Level ${esc(m.level)}${classOf(m.pcId) ? " · " + esc(classOf(m.pcId)) : ""}</span></span></button></li>`;
      }).join("") + "</ul>" +
      (shown.length < sorted.length ? `<button type="button" class="link-btn" data-ch="all-matches">Alle ${sorted.length} anzeigen</button>` : ""));
  }

  function classOf(pcId) {
    const id = A.pcClass[pcId];
    const c = D.classes.find((x) => x.id === id);
    return c ? c.name : "";
  }

  function remember(ch) {
    const list = store.get("dk.recent", []).filter((r) => !(r.name.toLowerCase() === ch.meta.name.toLowerCase() && r.sid === ch.meta.serverId));
    list.unshift({ name: ch.meta.name, sid: ch.meta.serverId, server: ch.meta.serverName, cls: A.pcClass[ch.profile.pcId] || null });
    store.set("dk.recent", list.slice(0, 6));
    renderRecent();
  }

  function renderRecent() {
    const box = $("#ch-recent");
    if (!box) return;
    const list = store.get("dk.recent", []);
    box.innerHTML = list.length ? '<span class="muted small">Zuletzt:</span> ' + list.map((r) =>
      `<button type="button" class="fchip is-on" data-ch="recent" data-name="${esc(r.name)}" data-sid="${r.sid}">${r.cls ? pic(clsIcon(r.cls), "fchip-ico") : ""}${esc(r.name)} <span class="muted">${esc(r.server || "")}</span></button>`).join("") : "";
  }

  function shareUrl(ch) {
    return `${location.origin}${location.pathname}?name=${encodeURIComponent(ch.meta.name)}&server=${ch.meta.serverId}#charakter`;
  }

  function updateUrl(ch) {
    if (!/^https?:$/.test(location.protocol)) return;
    try { history.replaceState(null, "", `?name=${encodeURIComponent(ch.meta.name)}&server=${ch.meta.serverId}#charakter`); } catch (e) { /* egal */ }
  }

  /* ---------- Darstellung ---------- */
  const charKey = (ch) => `${ch.meta.serverId}.${ch.meta.name.toLowerCase()}`;
  const resKey = (ch) => `dk.res.${charKey(ch)}`;
  const planKey = (ch) => `dk.plan.${charKey(ch)}`;

  /* Welcher Slot zuerst offen ist: der vom Sofort-Urteil, sonst der erste mit Handlungsbedarf */
  function defaultSlot(a) {
    if (a.verdict && a.verdict.slot) return a.verdict.slot;
    const c = a.candidates.find((x) => x.slot);
    if (c) return c.slot;
    const r = a.gear.find((g) => g.status === "schwach" || g.status === "leer") || a.gear.find((g) => g.status === "upgrade");
    return r ? r.slot : 1;
  }

  function render() {
    if (!current) return;
    const ch = current.character;
    const res = store.get(resKey(ch), {});
    const shifts = window.DK_APP && window.DK_APP.shifts ? window.DK_APP.shifts() : {};
    const a = AU.analyse(ch, { resources: res, shifts });
    current.audit = a;
    if (!current.sel || !a.gear.some((g) => g.slot === current.sel)) current.sel = defaultSlot(a);

    let h = `<article class="ch" aria-labelledby="ch-name-h">`;
    h += bannerHtml(ch, a);
    h += verdictHtml(a);
    h += `<nav class="ch-toc" aria-label="Abschnitte der Auswertung">` +
      [["ch-plan", "Fahrplan"], ["ch-gear", "Ausrüstung"], ["ch-stigma", "Stigmen & Skills"], ["ch-daev", "Daevanion"], ["ch-werte", "Werte"], ["ch-farm", "Farmen"], ["ch-res", "Ressourcen"]]
        .map(([id, t]) => `<button type="button" class="toc-btn" data-ch="jump" data-to="${id}">${t}</button>`).join("") + "</nav>";
    h += planHtml(ch, a);
    h += gearHtml(ch, a);
    h += `<div class="two">${stigmaHtml(ch, a)}${skillsHtml(ch, a)}</div>`;
    h += boardsHtml(ch, a);
    h += `<div class="two" id="ch-farm">
      ${statsHtml(ch, a)}
      <div class="stack">
        <section class="panel"><h3>Farmen</h3><ul class="plain">${a.farm.map((x) => `<li>${esc(x)}</li>`).join("")}</ul></section>
        <section class="panel panel--warn"><h3>Nicht verschwenden</h3><ul class="donts">${a.waste.map((x) => `<li>${esc(x)}</li>`).join("")}</ul></section>
      </div>
    </div>`;
    h += resHtml(ch, a, res);
    if (ch.meta.partial) h += `<p class="notice">Ein Teil der Details (Manasteine oder Daevanion) kam nicht an. Die Auswertung ist deshalb unvollständig – „Neu laden“ versucht es erneut.</p>`;
    h += `<p class="fine">Daten aus der NCSOFT-Armory, abgerufen ${esc(Z.day(Date.parse(ch.meta.fetchedAt)))} ${esc(Z.time(Date.parse(ch.meta.fetchedAt)))}. Die Endpunkte sind inoffiziell. Bilder vom NCSOFT-CDN. Drops, Kosten und Garantien stammen aus den Spieldaten (Metabot), Meta-Empfehlungen aus Guides. NCSOFT veröffentlicht keine Formel für die Kampfkraft – alles, was nicht direkt aus den Daten kommt, ist eine Schätzung.</p>`;
    h += "</article>";
    $("#ch-result").innerHTML = h;
  }

  /* Kopf: Porträt, Klasse, Kennzahlen */
  function bannerHtml(ch, a) {
    const p = ch.profile, m = ch.meta;
    const gate = a.nextGate;
    const prevGate = D.gates.filter((g) => g.gs <= a.gs).pop();
    const from = prevGate ? prevGate.gs : 1000;
    const pct = gate ? Math.max(0, Math.min(100, ((a.gs - from) / (gate.gs - from)) * 100)) : 100;
    const cls = D.classes.find((c) => c.id === a.cls);
    const extras = [];
    if (ch.wing) extras.push(`<li class="${gradeCls(ch.wing.grade)}" title="Flügel">${pic(ch.wing.icon, "mini-ico")}<span>${esc(nm(ch.wing))}</span></li>`);
    if (ch.pet) extras.push(`<li title="Begleiter">${pic(ch.pet.icon, "mini-ico")}<span>${esc(nm(ch.pet))}</span></li>`);
    return `<header class="ch-banner fac-${esc(m.faction)}">
      <div class="ch-portrait">
        ${m.profileImage ? pic(m.profileImage, "ch-face", "Porträt von " + p.name) : pic(clsIcon(a.cls), "ch-face ch-face--emblem")}
        ${a.cls ? pic(clsIcon(a.cls), "ch-emblem", cls ? cls.name : "") : ""}
      </div>
      <div class="ch-id">
        <p class="eyebrow">${esc(a.clsName || p.className)}${cls ? ` · ${esc(cls.de)}` : ""} · Level ${esc(p.level)}</p>
        <h2 id="ch-name-h">${esc(p.name)}</h2>
        <p class="ch-sub">${esc(m.serverName)} · ${esc(REG[m.region] || "")} · <span class="fac fac--${esc(m.faction)}">${FAC[m.faction] || ""}</span>${p.title ? ` · „${esc(p.title)}“` : ""}</p>
        ${extras.length ? `<ul class="ch-extras">${extras.join("")}</ul>` : ""}
      </div>
      <dl class="ch-kpis">
        <div class="kpi kpi--cp"><dt>${pic(IMG + "info/profile_power_icon.png", "kpi-ico")}Kampfkraft</dt><dd><span class="kpi-v">${fmt(p.combatPower)}</span></dd></div>
        <div class="kpi"><dt>Gearscore</dt><dd><span class="kpi-v">${fmt(a.gs)}</span><span class="kpi-s">Item-Level gesamt</span></dd></div>
        <div class="kpi kpi--gate"><dt>Nächstes Tor</dt><dd><span class="kpi-v">${gate ? gate.gs : "–"}</span>
          <span class="meter meter--gate" role="img" aria-label="${gate ? `${fmt(a.gs)} von ${gate.gs}` : "alle Tore offen"}"><span class="meter-fill" style="width:${pct.toFixed(1)}%"></span></span>
          <span class="kpi-s">${gate ? `noch ${fmt(gate.gs - a.gs)} · ${esc(gate.title)}` : "alle Tore offen"}</span></dd></div>
      </dl>
      <div class="ch-actions">
        <button type="button" class="btn" data-ch="apply">Für die ganze Seite übernehmen</button>
        <button type="button" class="btn btn--ghost" data-ch="share">Link kopieren</button>
        <button type="button" class="btn btn--ghost" data-ch="reload">Neu laden</button>
      </div>
      <input class="ch-share" id="ch-share" type="text" readonly value="${esc(shareUrl(ch))}" aria-label="Link zu dieser Auswertung" hidden>
    </header>`;
  }

  /* Sofort-Urteil mit Bild: aktuelles Teil → Ziel */
  function verdictHtml(a) {
    const v = a.verdict;
    const art = v.icon || v.targetIcon
      ? `<div class="verdict-art">${pic(v.icon, "v-ico")}${v.targetIcon ? `<span class="v-arrow" aria-hidden="true"></span>${pic(v.targetIcon, "v-ico v-ico--target")}` : ""}</div>`
      : `<div class="verdict-art"><span class="v-ico pic-none" aria-hidden="true"></span></div>`;
    return `<section class="verdict" aria-label="Sofort-Urteil">
      ${art}
      <div class="verdict-body">
        <p class="eyebrow">Sofort-Urteil · größter Gewinn pro Aufwand</p>
        <p class="verdict-title">${esc(v.title)}</p>
        <p>${esc(v.why)}</p>
        ${v.how ? `<p class="muted">${esc(v.how)}</p>` : ""}
        ${v.steps ? `<ol class="v-steps">${v.steps.map((s) => `<li>${esc(s)}</li>`).join("")}</ol>` : ""}
        <p class="verdict-foot">${chip(v.conf)}${v.slot ? `<button type="button" class="link-btn" data-ch="slot" data-slot="${v.slot}" data-scroll="1">Plan für diesen Slot</button>` : ""}</p>
      </div>
    </section>`;
  }

  /* Fahrplan: Heute (Quick-Wins, Tagesziel, Zeiten), Woche, 2–3 Wochen, ab 2100 – mit Haken pro Schritt */
  function planHtml(ch, a) {
    const done = store.get(planKey(ch), {});
    const quick = a.quick.filter((q) => q !== a.verdict);
    let count = 0, checked = 0;
    const quest = (it) => {
      count++;
      const isDone = !!done[it.id];
      if (isDone) checked++;
      return `<li class="quest${isDone ? " is-done" : ""}">
        <label class="q-check"><input type="checkbox" data-plan="${esc(it.id)}"${isDone ? " checked" : ""}><span class="sr">Erledigt</span></label>
        <span class="q-icon">${it.icon ? pic(it.icon, "q-img") : '<span class="q-glyph" aria-hidden="true"></span>'}</span>
        <div class="q-body"><p class="q-title">${esc(it.title)}</p>${it.detail ? `<p class="q-detail">${esc(it.detail)}</p>` : ""}
        ${it.slot ? `<button type="button" class="link-btn" data-ch="slot" data-slot="${it.slot}" data-scroll="1">Slot ansehen</button>` : ""}</div>
      </li>`;
    };
    const heute = [];
    if (a.verdict && a.verdict.id) heute.push({ id: "v-" + a.verdict.id, slot: a.verdict.slot, icon: a.verdict.icon, title: a.verdict.title, detail: a.verdict.how || a.verdict.why });
    const quickItems = quick.map((q) => ({ id: "q-" + q.id, slot: q.slot, icon: q.icon, title: q.title, detail: q.how || q.why }));
    const todayItems = a.today.map((t, i) => ({ id: "t-" + i + "-" + t.title.slice(0, 24), title: t.title, detail: t.why }));
    const phases = a.phases.filter((p) => p.id !== "heute");
    const ROMAN = ["II", "III", "IV", "V"];
    // Auf dem Handy sind nur „Heute“ und „Diese Woche“ aufgeklappt, sonst wird die Liste sehr lang
    const narrow = window.matchMedia && window.matchMedia("(max-width: 700px)").matches;
    let body = `<details class="phase phase--heute" open>
      <summary class="phase-title"><span class="phase-num">I</span>Heute</summary>
      ${heute.length ? `<p class="lbl-line">Zuerst</p><ol class="quests">${heute.map(quest).join("")}</ol>` : ""}
      <p class="lbl-line">Quick-Wins unter 10 Minuten</p>
      ${quickItems.length ? `<ol class="quests">${quickItems.map(quest).join("")}</ol>` : '<p class="empty small">Keine schnellen Korrekturen nötig.</p>'}
      <p class="lbl-line">Tagesziel</p><ol class="quests">${todayItems.map(quest).join("")}</ol>
      <p class="lbl-line">Heute in deutscher Zeit</p>
      <ul class="nx-list">${a.times.map((t) => `<li class="nx"><span class="nx-time">${Z.time(t.ts)}</span><span class="nx-name">${esc(t.label)}${t.day ? ` <small>${esc(Z.day(t.ts))}</small>` : ""}${t.more && t.more.length ? ` <small>dann ${esc(t.more.join(", "))}</small>` : ""}${t.note ? ` <small>${esc(t.note)}</small>` : ""}</span><span class="nx-cd"><span class="cd" data-cd="${t.ts}"></span></span></li>`).join("")}</ul>
    </details>`;
    body += phases.map((p, i) => `<details class="phase"${!narrow || i === 0 ? " open" : ""}>
      <summary class="phase-title"><span class="phase-num">${ROMAN[i] || ""}</span>${esc(p.title)} <span class="phase-count">${p.items.length} Schritte</span></summary>
      <ol class="quests">${p.items.map(quest).join("")}</ol>
    </details>`).join("");
    return `<section class="panel plan-panel" id="ch-plan" aria-labelledby="ch-plan-h">
      <header class="panel-head"><h3 id="ch-plan-h">Dein Fahrplan</h3><span class="plan-count">${checked} von ${count} erledigt</span></header>
      <p class="small muted">Von oben nach unten abarbeiten. Haken bleiben in deinem Browser gespeichert; „Slot ansehen“ zeigt den genauen Plan für das Teil.</p>
      <div class="phases">${body}</div>
    </section>`;
  }

  /* Ausrüstung: Charakterfenster mit Kacheln, daneben der Plan für den gewählten Slot */
  function gearHtml(ch, a) {
    const bySlot = {};
    a.gear.forEach((r) => { bySlot[r.slot] = r; });
    const tile = (slot) => {
      const r = bySlot[slot];
      if (!r) return "";
      const it = r.item;
      const st = STATUS[r.status] || STATUS.ok;
      const sel = current.sel === slot;
      return `<button type="button" class="slot ${it ? gradeCls(it.grade) : "is-empty"} s-${st[1]}${sel ? " is-sel" : ""}" data-ch="slot" data-slot="${slot}" aria-pressed="${sel}" title="${esc(r.label)}${it ? ": " + esc(nm(it)) + " +" + it.enchant : " (leer)"}">
        <span class="slot-frame">${it ? pic(it.icon, "slot-img") : `<span class="slot-empty">${esc(r.label.slice(0, 2))}</span>`}</span>
        ${it && it.enchant ? `<span class="slot-plus">+${it.enchant}</span>` : ""}
        <span class="slot-pip" aria-hidden="true"></span>
        <span class="slot-cap" aria-hidden="true">${esc(r.label)}</span>
        <span class="sr">${esc(r.label)}: ${it ? esc(nm(it)) + " +" + it.enchant : "leer"}, ${st[0]}</span>
      </button>`;
    };
    const p = ch.profile;
    const counts = { crit: 0, warn: 0, ok: 0, gold: 0 };
    a.gear.forEach((r) => { counts[(STATUS[r.status] || STATUS.ok)[1]]++; });
    const doll = `<div class="doll">
      <div class="doll-col">${LEFT.map(tile).join("")}</div>
      <div class="doll-mid">
        <div class="doll-portrait">${ch.meta.profileImage ? pic(ch.meta.profileImage, "doll-face", "") : pic(clsIcon(a.cls), "doll-face doll-face--emblem")}</div>
        <p class="doll-name">${esc(p.name)}</p>
        <p class="doll-sub">${pic(clsIcon(a.cls), "doll-cls")}${esc(a.clsName || p.className)} · IL ${fmt(a.gs)}</p>
        <div class="doll-runes">${RUNES.map(tile).join("")}</div>
      </div>
      <div class="doll-col">${RIGHT.map(tile).join("")}</div>
    </div>
    <ul class="doll-legend">
      <li class="s-crit"><span class="slot-pip"></span>Ersetzen (${counts.crit})</li>
      <li class="s-warn"><span class="slot-pip"></span>Ausbauen (${counts.warn})</li>
      <li class="s-ok"><span class="slot-pip"></span>Gut (${counts.ok})</li>
      ${counts.gold ? `<li class="s-gold"><span class="slot-pip"></span>Top (${counts.gold})</li>` : ""}
    </ul>`;
    const list = `<details class="gear-list">
      <summary>Alle Slots als Liste</summary>
      <div class="tbl-scroll"><table class="tbl gear-tbl"><thead><tr><th scope="col">Slot</th><th scope="col">Jetzt</th><th scope="col">Status</th><th scope="col">Nächster Schritt</th></tr></thead><tbody>${a.gear.map((r) => {
        const st = STATUS[r.status] || STATUS.ok;
        const it = r.item;
        const d = it && it.detail;
        return `<tr><th scope="row"><button type="button" class="link-btn" data-ch="slot" data-slot="${r.slot}" data-scroll="1">${esc(r.label)}</button></th>` +
          `<td>${it ? `<span class="gl-item">${pic(it.icon, "gl-ico " + gradeCls(it.grade))}<span><span class="${gradeCls(it.grade)} g-text">${esc(nm(it))}</span> <strong>+${it.enchant}</strong><br><span class="small muted">${r.il ? "IL " + r.il : ""}${d && d.stoneSlots ? ` · Manasteine ${d.stones.length}/${d.stoneSlots}` : ""}</span></span></span>` : '<span class="muted">–</span>'}</td>` +
          `<td><span class="stat stat--${st[1]}">${st[0]}</span></td><td>${esc(r.next)}</td></tr>`;
      }).join("")}</tbody></table></div>
    </details>`;
    return `<section class="panel gear-panel" id="ch-gear" aria-labelledby="ch-gear-h">
      <header class="panel-head"><h3 id="ch-gear-h">Ausrüstung</h3><span class="small muted">Teil antippen für den genauen Plan</span></header>
      <div class="gear-layout">
        <div class="gear-doll">${doll}</div>
        <div class="slot-detail" id="ch-slot" aria-live="polite">${slotHtml(bySlot[current.sel], a)}</div>
      </div>
      ${list}
      <p class="fine">IL = Item-Level des Teils. Drop-Chancen, Garantie-Gutscheine, Rezepte und Werte bei +10 laut Spieldaten; 10 Eroberungs-Würfel pro Woche. Die Werte „bei +10“ für deine eigenen Teile kommen direkt aus der Armory.</p>
    </section>`;
  }

  /* Plan für einen Slot: ersetzen, verstärken, Manasteine, Zusatzwerte, später */
  function slotHtml(r, a) {
    if (!r) return "";
    const it = r.item;
    const p = r.plan || {};
    const v = VERDICT[p.verdict] || VERDICT.behalten;
    if (!it) {
      return `<header class="sd-head"><span class="sd-icon is-empty"><span class="slot-empty">${esc(r.label.slice(0, 2))}</span></span>
        <div><p class="eyebrow">${esc(r.label)}</p><p class="sd-name">Leer</p></div><span class="badge badge--crit">Slot leer</span></header>
        <p class="sd-headline">${esc(r.next)}</p>`;
    }
    const d = it.detail;
    let h = `<header class="sd-head">
      <span class="sd-icon ${gradeCls(it.grade)}">${pic(it.icon, "sd-img")}${it.enchant ? `<span class="slot-plus">+${it.enchant}</span>` : ""}</span>
      <div class="sd-title"><p class="eyebrow">${esc(r.label)}</p><p class="sd-name ${gradeCls(it.grade)} g-text">${esc(nm(it))}</p>
        <p class="sd-meta">+${it.enchant}${it.exceed ? ` (Überschreitung +${it.exceed})` : ""}${r.il ? ` · IL ${r.il}` : ""} · ${esc(GRADE_DE[it.grade] || it.grade || "")}</p></div>
      <span class="badge badge--${v[1]}">${v[0]}</span>
    </header>`;
    if (p.headline) h += `<p class="sd-headline">${esc(p.headline)}</p>`;
    if (!d) h += `<p class="notice small">Die Details zu diesem Teil kamen nicht an. „Neu laden“ versucht es erneut.</p>`;

    /* Ersetzen */
    if (p.options && p.options.length) {
      h += `<div class="sd-block"><h5>Ersetzen durch</h5>`;
      p.options.forEach((o, i) => {
        const t = o.item;
        h += `<div class="target">
          <span class="tg-icon g-Unique">${pic(t.icon, "tg-img")}</span>
          <div class="tg-body"><p class="tg-name">${esc(nm(t))} <span class="tg-il">IL ${t.il}</span></p>
          <p class="small muted">${o.kind === "craft" ? `Herstellen${t.craft ? ` · ${esc(t.craft.beruf)}, ${esc(t.craft.ort)}` : ""}` : `Drop · ${esc(t.source)}`}</p></div>
        </div>`;
        if (i === 0 && p.compare) {
          h += `<div class="tbl-scroll"><table class="tbl cmp"><thead><tr><th scope="col">Wert</th><th scope="col">Jetzt</th><th scope="col">${esc(nm(t))} (+0)</th></tr></thead><tbody>` +
            p.compare.rows.map((row) => `<tr><th scope="row">${esc(row[0])}</th><td class="num">${esc(row[1])}</td><td class="num up">${esc(row[2])}</td></tr>`).join("") +
            `</tbody></table></div>${t.plus10 ? `<p class="small">Bei +10 kommt dazu: <strong>${esc(t.plus10)}</strong>.</p>` : ""}`;
        }
        if (t.recipe && t.recipe.length) {
          h += `<details class="recipe"${i === 0 ? " open" : ""}><summary>Material für ${esc(nm(t))}</summary>
            <ul class="mats">${t.recipe.map((m) => `<li><span class="qty">${esc(m[0])}×</span>${esc(m[1])}</li>`).join("")}</ul>
            ${t.craft ? `<p class="small">${esc(t.craft.beruf)} · ${esc(t.craft.werkbank)} · ${esc(t.craft.ort)}</p>` : ""}
            <p class="small muted">Zorniger Gedanke, Zorniger Wille und der Veredelungsstein sind handelbar (Handelsagent).</p>
          </details>`;
        }
      });
      if (p.enchantStop) h += `<p class="small warn-text">${esc(p.enchantStop)}</p>`;
      h += `</div>`;
    } else if (p.enchantStop) {
      h += `<p class="small warn-text">${esc(p.enchantStop)}</p>`;
    }

    /* Verstärken */
    if (p.enchant) {
      const e = p.enchant;
      const pips = Array.from({ length: 10 }, (_, i) => `<span class="pip${i < e.from ? " is-on" : ""}"></span>`).join("");
      h += `<div class="sd-block"><h5>Verstärken: +${e.from} → +10</h5>
        <div class="pips" role="img" aria-label="Verstärkung ${e.from} von 10">${pips}</div>
        ${e.gain && e.gain.length ? `<p class="gain-line">Bringt ${e.gain.map((g) => `<span class="gain-chip">+${fmt(g[1])} ${esc(g[0])}</span>`).join(" ")}</p>` : ""}
        ${e.cost ? `<p class="small">Kosten: ${e.cost.exact ? "" : "höchstens "}<strong>${fmt(e.cost.kinah)} Kinah</strong> und <strong>${fmt(e.cost.stones)} Verstärkungssteine</strong>${e.cost.exact ? "" : " (Kosten einer IL-70-Waffe als Obergrenze)"}.</p>` : ""}
        ${e.note ? `<p class="small muted">${esc(e.note)}</p>` : ""}
      </div>`;
    } else if (it.enchant >= 10 && r.slot < 23) {
      h += `<div class="sd-block"><h5>Verstärken</h5><p class="small">Schon auf +${it.enchant}. ${esc(A.above10)}</p></div>`;
    }
    if (p.rarity) h += `<p class="small"><strong>Seltenheit:</strong> ${esc(p.rarity)}</p>`;

    /* Manasteine */
    if (p.stones) {
      const s = p.stones;
      const empty = Array.from({ length: s.free }, () => `<li class="stone is-free"><span class="stone-ico pic-none"></span><span>frei</span></li>`).join("");
      h += `<div class="sd-block"><h5>Manasteine ${s.list.length}/${s.slots}</h5>
        <ul class="stones">${s.list.map((x) => `<li class="stone r-${x.rating} ${gradeCls(x.grade)}">${pic(x.icon, "stone-ico", "", "https://assets.playnccdn.com/static-aion2-gamedata/resources/Icon_Item_Usable_Enchant_MagicStone_A_c_002.png")}<span class="stone-txt">${esc(x.de)} <strong>${esc(x.value)}</strong></span><span class="rate rate--${x.rating}">${RATE[x.rating]}</span></li>`).join("")}${empty}</ul>
        <p class="small">${esc(s.advice)}</p>
      </div>`;
    }
    /* Zusatzwerte */
    if (p.subs && (p.subs.list.length || p.subs.skills.length)) {
      h += `<div class="sd-block"><h5>Zusatzwerte</h5><ul class="subs">${p.subs.list.map((x) => `<li class="r-${x.rating}"><span>${esc(x.de)}</span><strong>${esc(x.value)}</strong><span class="rate rate--${x.rating}">${RATE[x.rating]}</span></li>`).join("")}${p.subs.skills.map((x) => `<li class="r-gut"><span>${esc(x.de)}</span><strong>${esc(x.value)}</strong><span class="rate rate--gut">Skill</span></li>`).join("")}</ul>
        <p class="small muted">Zusatzwerte lassen sich nicht ändern. Sie zeigen, wie gut das Teil zu deiner Rolle passt.</p></div>`;
    }
    if (p.soul != null) h += `<p class="small muted">Seelenbindung ${fmt(p.soul)} %.</p>`;

    /* Später */
    if (p.later && p.later.length) {
      const t = p.later[0].item;
      h += `<div class="sd-block sd-block--later"><h5>Später</h5>
        <div class="target target--later"><span class="tg-icon g-Unique">${pic(t.icon, "tg-img")}</span>
        <div class="tg-body"><p class="tg-name">${esc(nm(t))} <span class="tg-il">IL ${t.il}</span></p><p class="small muted">${esc(t.source)}${t.plus10 ? ` · bei +10: ${esc(t.plus10)}` : ""}</p></div></div>
      </div>`;
    }
    return h;
  }

  /* Stigmen mit Bild, Stufe und Splittern */
  function stigmaHtml(ch, a) {
    const max = 15;
    const card = (s) => {
      const lvl = s.acquired ? s.level : 0;
      const bp = s.breakpoint;
      const state = !s.acquired ? "nicht freigeschaltet" : s.equipped ? "ausgerüstet" : "nicht ausgerüstet";
      return `<li class="stg${s.core ? " is-core" : ""}${s.acquired && !s.equipped ? " is-off" : ""}${!s.acquired ? " is-locked" : ""}">
        <span class="stg-icon">${pic(s.icon, "stg-img")}</span>
        <div class="stg-body">
          <p class="stg-name">${esc(nm(s))}${s.core ? ' <span class="mine">Kern</span>' : ""}</p>
          <div class="lvl" role="img" aria-label="Stufe ${lvl} von ${max}"><div class="lvl-bar"><div class="lvl-fill" style="width:${Math.min(100, (lvl / max) * 100).toFixed(0)}%"></div>${bp ? `<span class="lvl-mark" style="left:${((bp.level / max) * 100).toFixed(0)}%"></span>` : ""}</div><span class="lvl-num">${lvl}/${max}</span></div>
          <p class="small ${s.acquired && !s.equipped ? "warn-text" : "muted"}">${state}${s.core && s.acquired ? (s.shards ? ` · ${s.shards} Splitter bis 15` : " · fertig") : ""}</p>
          ${bp && s.acquired && lvl < bp.level ? `<p class="small stg-bp">Breakpoint Stufe ${bp.level}: ${esc(bp.text)}</p>` : ""}
        </div>
      </li>`;
    };
    return `<section class="panel" id="ch-stigma" aria-labelledby="ch-stigma-h">
      <h3 id="ch-stigma-h">Stigmen</h3>
      <ul class="stigmas">${a.stigmas.map(card).join("")}</ul>
      <p class="fine">Kern-Stigmen: die Stigmen, die die Top-Spieler deiner Klasse in PvE fast immer nutzen. Stufe 1–5 kostet je 1 Splitter, 6–10 je 2, 11–15 je 4. Zusammen fehlen ${fmt(a.shardsNeeded)} Splitter. ${esc(A.shardShops)}.</p>
    </section>`;
  }

  /* Ausgerüstete Skills mit Stufe, Kern-Skills mit Ziel, Build-Hinweise */
  function skillsHtml(ch, a) {
    const ks = A.keySkills[a.cls];
    const key = new Set(ks ? ks.names : []);
    const active = ch.skills.filter((s) => s.category === "Active" && s.equipped);
    const passive = ch.skills.filter((s) => s.category === "Passive" && s.acquired);
    const cell = (s) => `<li class="sk${key.has(s.name) ? " is-key" : ""}" title="${esc(nm(s))} – Stufe ${esc(s.level)}">
      ${pic(s.icon, "sk-img")}<span class="sk-lvl">${esc(s.level)}</span><span class="sk-name">${esc(nm(s))}</span></li>`;
    const build = a.build.filter((b) => b.title !== "Kern-Skills");
    const keyRows = ks ? ks.names.map((n) => {
      const s = ch.skills.find((x) => x.name === n);
      const lvl = s ? Number(s.level) : 0;
      return `<li>${s ? pic(s.icon, "ks-img") : ""}<span>${esc(s ? nm(s) : n)}</span><span class="num ${lvl >= ks.target ? "ok-text" : "warn-text"}">${s ? lvl : "–"} / ${ks.target}</span></li>`;
    }).join("") : "";
    const clsDe = (D.classes.find((c) => c.id === a.cls) || {}).de || a.clsName;
    return `<section class="panel" aria-labelledby="ch-skill-h">
      <h3 id="ch-skill-h">Skills &amp; Build</h3>
      ${active.length ? `<p class="lbl-line">Ausgerüstete Skills</p><ul class="skills">${active.map(cell).join("")}</ul>` : ""}
      ${skillPointsHtml(a)}
      ${keyRows ? `<p class="lbl-line">Kern-Skills (Ziel-Stufe ${ks.target}+)</p><ul class="keyskills">${keyRows}</ul>` : ""}
      ${build.map((b) => `<p class="lbl-line">${esc(b.title)}</p><ol class="prio">${b.list.map((x) => `<li>${esc(x)}</li>`).join("")}</ol>`).join("")}
      ${passive.length ? `<details class="more-skills"><summary>Passive Skills (${passive.length})</summary><ul class="skills skills--small">${passive.map(cell).join("")}</ul></details>` : ""}
      ${window.DK_SK && a.cls ? `<p class="ch-sk-link"><button type="button" class="btn btn--ghost" data-action="open-sk" data-id="${esc(a.cls)}">Leiste &amp; Makro für ${esc(clsDe)}</button></p>` : ""}
      <p class="fine">Die Armory zeigt keine Gesamtwerte für Genauigkeit, Krit und Geschwindigkeit. Breakpoints prüfst du im Werte-Fenster im Spiel.</p>
    </section>`;
  }

  /* Skillpunkte: geschätzte Verteilung, Vorschlag zum Umverteilen und Vergleich mit den Top-Spielern (audit.js → skillPoints) */
  function skillPointsHtml(a) {
    const sp = a.skillPts;
    if (!sp || !sp.rows.length) return "";
    const L = AU.fmtLv;
    const rows = sp.rows.slice().sort((x, y) => (x.rank || 99) - (y.rank || 99));
    const state = (r) => {
      if (r.top == null) return ["", ""];
      if (r.ziel && r.top - r.level >= 3) return ["warn", "unter Schnitt"];
      if (!r.ziel && r.pts >= 8 && r.level - r.top >= 3) return ["warn", "Punkte frei machen"];
      return ["ok", r.ziel ? "passt" : "niedrig lassen"];
    };
    const mv = sp.moves;
    const table = rows.map((r) => {
      const [k, t] = state(r);
      return `<tr${k === "warn" ? ' class="is-warn"' : ""}><th scope="row">${pic(r.icon, "sp-img")}<span>${esc(nm(r))}</span></th>
        <td class="num">${r.level}</td><td class="num">${r.pts}</td><td class="num">${r.top != null ? L(r.top) : "–"}</td><td><span class="sp-tag sp-tag--${k || "none"}">${esc(t)}</span></td></tr>`;
    }).join("");
    const flagged = rows.filter((r) => state(r)[0] === "warn").length;
    return `<div class="sp">
      <p class="lbl-line">Skillpunkte</p>
      ${sp.level >= 45 && sp.loaded ? `<div class="sp-meter" role="img" aria-label="Etwa ${sp.used} von ${sp.pool} Punkten verteilt"><span style="width:${Math.min(100, (sp.used / sp.pool) * 100).toFixed(1)}%"></span></div>
      <p class="small muted">Etwa <b>${sp.used}</b> von <b>${sp.pool}</b> Punkten verteilt (geschätzt aus Stufe minus Daevanion und Ausrüstung). Mit allen Punkten passen ${sp.slots} Skills auf 10.</p>` : ""}
      ${mv ? `<div class="sp-move"><p class="sp-move-h">${mv.free.length ? "Vorschlag: umverteilen" : "Vorschlag: freie Punkte hierhin"}</p>
        <ul>${mv.free.map((r) => `<li class="sp-down">${pic(r.icon, "sp-img")}<span>${esc(nm(r))}</span><b>${r.pts} → 1</b><em>+${r.cost} Punkte</em></li>`).join("")}
        ${mv.raise.map((r) => `<li class="sp-up">${pic(r.icon, "sp-img")}<span>${esc(nm(r))}</span><b>${r.pts} → 10</b><em>−${r.need} Punkte</em></li>`).join("")}</ul>
        <p class="small muted">Grundlage: Durchschnittsstufen von ${sp.top.spieler} Top-Spielern deiner Klasse (Metabot, Stand ${esc(sp.top.stand.split("-").reverse().join("."))}).${mv.rest ? ` Danach bleiben ${mv.rest} Punkte frei.` : ""}</p></div>` : ""}
      <details class="sp-all"${flagged && !mv ? " open" : ""}><summary>Alle Skills im Vergleich${flagged ? ` · ${flagged} auffällig` : ""}</summary>
        <div class="tbl-wrap"><table class="tbl sp-tbl"><thead><tr><th scope="col">Skill</th><th scope="col">Stufe</th><th scope="col" title="Stufe aus Skillpunkten, geschätzt">Punkte</th><th scope="col">Top-Schnitt</th><th scope="col">Einschätzung</th></tr></thead><tbody>${table}</tbody></table></div>
      </details>
    </div>`;
  }

  /* Daevanion: dein Brett mit offenen Knoten und den nächsten empfohlenen Schritten (Route aus daevanion.js) */
  function daevData(ch, a) {
    const V = window.DK_DV;
    if (!V || !a.cls) return [];
    return ch.boards.map((b) => {
      const bi = V.boardIndex(b.name);
      if (bi < 0 || !b.nodes || !b.nodes.some((n) => n.row)) return null;
      const m = V.route(a.cls, bi).m;
      const open = b.nodes.filter((n) => n.open && n.row).map((n) => m.at.get(n.row * 100 + n.col)).filter(Boolean).map((n) => n.i);
      return { b, bi, r: V.route(a.cls, bi, open) };
    }).filter(Boolean);
  }

  function boardsHtml(ch, a) {
    const list = daevData(ch, a);
    if (!list.length) {
      const rows = a.boards.map((b) => `<li class="board"><div class="board-body"><div class="board-head"><strong>${esc(nm(b))}</strong><span class="num muted">${b.open}/${b.total}</span></div>
        <div class="meter"><div class="meter-fill" style="width:${b.total ? Math.round((b.open / b.total) * 100) : 0}%"></div></div></div></li>`).join("");
      return `<section class="panel" id="ch-daev" aria-labelledby="ch-daev-h"><h3 id="ch-daev-h">Daevanion</h3>
        ${rows ? `<ul class="boards">${rows}</ul>` : '<p class="empty">Keine Daevanion-Daten.</p>'}
        <p class="fine">Die Knoten-Positionen kamen nicht an. „Neu laden“ versucht es erneut.</p></section>`;
    }
    if (current.dvSel == null || !list.some((x) => x.bi === current.dvSel)) {
      const todo = list.find((x) => !x.r.pvp && x.r.cost.kern > 0);
      current.dvSel = (todo || list[0]).bi;
    }
    const sel = list.find((x) => x.bi === current.dvSel);
    const V = window.DK_DV;
    const LIMIT = 12;
    const next = sel.r.steps.slice(0, LIMIT).filter((s) => s.tier !== "rest");
    const tabs = list.map((x) => `<button type="button" role="tab" class="dv-tab${x.bi === sel.bi ? " is-on" : ""}" aria-selected="${x.bi === sel.bi}" data-ch="dvboard" data-i="${x.bi}">
      <span class="dv-tab-name">${esc(nm(x.b))}</span><span class="dv-tab-sub">${x.b.open}/${x.b.total} offen · ${x.r.pvp ? "PvP" : x.r.cost.kern ? `Kern fehlt ${x.r.cost.kern} P.` : "Kern fertig"}</span></button>`).join("");
    const status = sel.r.pvp
      ? "Azphel ist das PvP-Brett mit eigenen Punkten. Für PvE bringt es nichts."
      : sel.r.cost.kern
        ? `Bis die Kern-Route fertig ist, fehlen dir ${sel.r.cost.kern} Punkte. Die nächsten Schritte sind nummeriert.`
        : `Die Kern-Route auf ${nm(sel.b)} ist fertig. Als Nächstes der Ausbau (noch ${sel.r.cost.ausbau} Punkte).`;
    return `<section class="panel dv-ch" id="ch-daev" aria-labelledby="ch-daev-h">
      <header class="panel-head"><h3 id="ch-daev-h">Daevanion: dein Brett</h3><button type="button" class="link-btn" data-ch="dvall" data-i="${sel.bi}">Empfohlenes Brett für ${esc(((D.classes.find((c) => c.id === a.cls) || {}).de) || "deine Klasse")}</button></header>
      <div class="dv-boards" role="tablist" aria-label="Brett">${tabs}</div>
      <div class="dv-layout">
        <div class="dv-board">
          ${V.boardFigure(sel.r, { cls: a.cls, limit: LIMIT, label: `Dein Brett ${nm(sel.b)} mit den nächsten Schritten` })}
          ${V.legendHtml(sel.r, true)}
        </div>
        <div class="dv-plan">
          <p>${esc(status)}</p>
          ${next.length ? `<h4>Die nächsten ${next.length} Knoten</h4>
          <ol class="dv-steps"><li class="dv-step dv-step--head"><span class="dv-no">Nr.</span><span class="dv-what">Knoten</span><span class="dv-pts">Punkte</span><span class="dv-sum">Summe</span></li>${V.stepRows(sel.r, next)}</ol>` : ""}
          <p class="small muted">Gold = Kern-Route, türkis = Ausbau, ausgefüllt = schon offen. Die Reihenfolge ist der günstigste Weg von deinen offenen Knoten aus.</p>
        </div>
      </div>
    </section>`;
  }

  /* Werte mit den Symbolen der Armory, dazu Titel */
  function statsHtml(ch, a) {
    const cell = (s) => {
      const m = /^(.*?)\s*\[(.+)\]$/.exec(s.de || s.name || "");
      const name = m ? m[1] : s.de || s.name;
      const sub = (s.secondaryDe || s.secondary || []).join(" · ");
      return `<li class="st">
        ${STAT_IMG[s.type] ? pic(`${IMG}info/${STAT_IMG[s.type]}.png`, "st-img") : ""}
        <span class="st-name">${esc(name)}${m ? `<small>${esc(m[2])}</small>` : ""}</span><span class="st-val num">${fmt(s.value)}</span>
        ${sub ? `<span class="st-sub">${esc(sub)}</span>` : ""}
      </li>`;
    };
    const prim = ch.stats.filter((s) => PRIMARY.includes(s.type));
    const lords = ch.stats.filter((s) => STAT_IMG[s.type] && !PRIMARY.includes(s.type));
    const titles = (ch.titles || []).map((t) => `<li class="${gradeCls(t.grade)}"><span class="lbl">${esc(TITLE_CAT[t.category] || t.category || "")}</span><span class="g-text">${esc(t.de || t.name)}</span>${(t.effectsDe || t.effects || []).length ? `<small>${esc((t.effectsDe || t.effects).join(" · "))}</small>` : ""}</li>`).join("");
    return `<section class="panel" id="ch-werte" aria-labelledby="ch-werte-h">
      <h3 id="ch-werte-h">Werte</h3>
      ${prim.length ? `<ul class="statgrid">${prim.map(cell).join("")}</ul>` : ""}
      ${lords.length ? `<p class="lbl-line">Götter-Werte</p><ul class="statgrid statgrid--lords">${lords.map(cell).join("")}</ul>` : ""}
      ${titles ? `<p class="lbl-line">Titel</p><ul class="titles">${titles}</ul>` : ""}
    </section>`;
  }

  /* Ressourcen: zum Schluss nach Kinah, AP und Verstärkungssteinen fragen */
  function resHtml(ch, a, res) {
    return `<section class="panel res-panel" id="ch-res" aria-labelledby="ch-res-h">
      <h3 id="ch-res-h">Deine Ressourcen</h3>
      <p class="res-ask">Zum Schluss: Wie viel <strong>Kinah</strong>, <strong>Abyss-Punkte</strong> und <strong>Verstärkungssteine</strong> hast du gerade? Trag es ein – die Seite rechnet aus, was davon reicht. Die Werte bleiben nur in deinem Browser.</p>
      <form class="res-form" id="ch-res-form" autocomplete="off">
        <label class="field"><span>Kinah</span><input type="number" id="ch-res-kinah" min="0" step="1000" inputmode="numeric" value="${res.kinah != null ? res.kinah : ""}"></label>
        <label class="field"><span>Abyss-Punkte (AP)</span><input type="number" id="ch-res-ap" min="0" step="100" inputmode="numeric" value="${res.ap != null ? res.ap : ""}"></label>
        <label class="field"><span>Verstärkungssteine</span><input type="number" id="ch-res-stones" min="0" step="10" inputmode="numeric" value="${res.stones != null ? res.stones : ""}"></label>
        <button type="submit" class="btn">Plan anpassen</button>
      </form>
      ${a.costs.notes.length ? `<ul class="plain res-notes">${a.costs.notes.map((n) => `<li>${esc(n)}</li>`).join("")}</ul>` : ""}
    </section>`;
  }

  /* Nur den Slot-Plan neu zeichnen (schneller als alles) */
  function selectSlot(slot, scroll) {
    if (!current || !current.audit) return;
    current.sel = slot;
    const r = current.audit.gear.find((g) => g.slot === slot);
    const box = $("#ch-slot");
    if (!box) return;
    box.innerHTML = slotHtml(r, current.audit);
    document.querySelectorAll("#ch-gear .slot").forEach((b) => {
      const on = Number(b.getAttribute("data-slot")) === slot;
      b.classList.toggle("is-sel", on);
      b.setAttribute("aria-pressed", on);
    });
    // Schmal: der Plan steht unter dem Charakterfenster, also dorthin scrollen. Breit: beides nebeneinander.
    const narrow = window.matchMedia && window.matchMedia("(max-width: 979px)").matches;
    if (narrow) box.scrollIntoView({ behavior: "smooth", block: "start" });
    else if (scroll) $("#ch-gear").scrollIntoView({ behavior: "smooth", block: "start" });
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

  function onChange(e) {
    const n = e.target;
    if (!n.matches || !n.matches("[data-plan]") || !current) return;
    const key = planKey(current.character);
    const done = store.get(key, {});
    if (n.checked) done[n.getAttribute("data-plan")] = 1; else delete done[n.getAttribute("data-plan")];
    store.set(key, done);
    const li = n.closest(".quest");
    if (li) li.classList.toggle("is-done", n.checked);
    const box = $("#ch-plan");
    if (box) {
      const all = box.querySelectorAll("[data-plan]").length;
      const ticked = box.querySelectorAll("[data-plan]:checked").length;
      const c = box.querySelector(".plan-count");
      if (c) c.textContent = `${ticked} von ${all} erledigt`;
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
    } else if (act === "slot") {
      selectSlot(Number(b.getAttribute("data-slot")), b.hasAttribute("data-scroll"));
    } else if (act === "dvboard" && current && current.audit) {
      current.dvSel = Number(b.getAttribute("data-i"));
      const box = $("#ch-daev");
      if (box) box.outerHTML = boardsHtml(current.character, current.audit);
    } else if (act === "dvall" && current && current.audit && window.DK_DV) {
      window.DK_DV.show(current.audit.cls, Number(b.getAttribute("data-i")));
    } else if (act === "jump") {
      const t = document.getElementById(b.getAttribute("data-to"));
      if (t) t.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }

  /* Fehlende Bilder: erst das Ersatzbild, sonst ein Zeichen an derselben Stelle */
  function onImgError(e) {
    const n = e.target;
    if (!n || n.tagName !== "IMG") return;
    const fb = n.getAttribute("data-fb");
    if (fb) { n.removeAttribute("data-fb"); n.src = fb; return; }
    const s = document.createElement("span");
    s.className = (n.className ? n.className + " " : "") + "pic-none";
    s.setAttribute("aria-hidden", "true");
    n.replaceWith(s);
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
    document.addEventListener("change", onChange);
    document.addEventListener("error", onImgError, true);
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
