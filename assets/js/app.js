/*
 * Daeva-Kompass – Oberfläche.
 * Jede Ansicht hat feste Container (data-part), die bei Änderungen neu gerendert werden.
 */
(function () {
  const D = window.DK_DATA, Z = window.DK_ZEIT, K = window.DK_KARTE;
  const KEY = "dk.v1";
  const HOUR = 3600000, MIN = 60000;

  /* ---------- Zustand ---------- */
  const defaults = {
    gs: 1400, cls: "spiritmaster", faction: "elyos",
    steps: {}, shifts: {}, remind: {},
    check: { dayKey: null, weekKey: null, daily: {}, weekly: {} },
    odyle: { val: 280, at: null, member: false },
    kills: {}, respawn: {}, pins: [], filters: {}, theme: null
  };
  const clone = (o) => JSON.parse(JSON.stringify(o));
  let S = load();
  let viewCls = S.cls;
  let selected = null;
  const notified = new Set();

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) {
        const s = Object.assign(clone(defaults), JSON.parse(raw));
        s.check = Object.assign(clone(defaults.check), s.check || {});
        s.odyle = Object.assign(clone(defaults.odyle), s.odyle || {});
        return s;
      }
    } catch (e) { /* Speicher gesperrt: mit Standardwerten weiter */ }
    return clone(defaults);
  }
  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* ignorieren */ }
  }

  /* ---------- Helfer ---------- */
  const $ = (sel, root) => (root || document).querySelector(sel);
  const $$ = (sel, root) => [...(root || document).querySelectorAll(sel)];
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const now = () => Date.now();
  const CONF = { ok: "Bestätigt", community: "Community", offen: "Unsicher" };
  const chip = (c) => '<span class="chip chip--' + c + '" title="Datenlage: ' + CONF[c] + '">' + CONF[c] + "</span>";
  const TYPE = { monolith: "Monolith", boss: "Feldboss", artefakt: "Artefakt", riss: "Raumzeit-Riss", puppe: "Trainingspuppen", pin: "Eigener Pin" };
  const FACTION = { elyos: "Elyos", asmo: "Asmodier", abyss: "Abyss" };
  const evById = (id) => D.events.find((e) => e.id === id);
  const shift = (ev) => +S.shifts[ev.id] || 0;
  const nextOf = (ev, t) => Z.next(ev, t || now(), shift(ev));
  const cls = () => D.classes.find((c) => c.id === S.cls) || D.classes[0];
  const icon = (type) => '<svg class="ico ico--' + type + '" viewBox="0 0 16 16" aria-hidden="true"><use href="#s-' + type + '" width="16" height="16"/></svg>';

  function cd(ts, left) {
    return '<span class="cd" data-cd="' + ts + '"' + (left ? ' data-left="1"' : "") + "></span>";
  }

  function nextGate() { return D.gates.find((g) => g.gs > S.gs) || null; }

  /* ---------- Resets & Checkliste ---------- */
  function resetKeys(t) {
    const d = Z.last(evById("reset"), t, shift(evById("reset")));
    const w = Z.last(evById("wreset"), t, shift(evById("wreset")));
    return { day: d ? d.ts : 0, week: w ? w.ts : 0 };
  }
  function checkResets() {
    const k = resetKeys(now());
    let changed = false;
    if (S.check.dayKey !== k.day) { if (S.check.dayKey !== null) S.check.daily = {}; S.check.dayKey = k.day; changed = true; }
    if (S.check.weekKey !== k.week) { if (S.check.weekKey !== null) S.check.weekly = {}; S.check.weekKey = k.week; changed = true; }
    if (changed) save();
    return changed;
  }

  /* ---------- Odyle ---------- */
  function odyle(t) {
    const cap = S.odyle.member ? 840 : 560;
    const at = S.odyle.at || t;
    const ticks = Math.max(0, Math.floor((t - at) / (3 * HOUR)));
    const cur = Math.min(cap, (+S.odyle.val || 0) + ticks * 15);
    const missing = Math.max(0, cap - (+S.odyle.val || 0));
    const fullAt = at + Math.ceil(missing / 15) * 3 * HOUR;
    return { cap, cur, fullAt, cubes: Math.floor(cur / 40), full: cur >= cap };
  }

  /* ---------- Boss-Timer ---------- */
  function bossState(id, t) {
    const killed = S.kills[id];
    if (!killed) return null;
    const m = D.markers.find((x) => x.id === id);
    const mins = +S.respawn[id] || (m && m.respawn) || 60;
    const at = killed + mins * MIN;
    return { killed, at, mins, up: t >= at };
  }

  /* ================= Parts ================= */
  const parts = {};

  parts.track = function () {
    const min = 1000, max = 2600;
    const pos = (v) => Math.max(0, Math.min(100, ((v - min) / (max - min)) * 100));
    const ng = nextGate();
    let html = '<div class="track-scroll"><div class="track" style="--p:' + pos(S.gs).toFixed(2) + '%">';
    html += '<div class="track-rail"><div class="track-fill"></div></div>';
    D.gates.forEach((g, i) => {
      const st = g.gs <= S.gs ? "is-open" : (ng && ng.gs === g.gs ? "is-next" : "");
      html += '<div class="gate ' + st + (i % 2 ? " gate--low" : "") + '" style="left:' + pos(g.gs).toFixed(2) + '%">' +
        '<span class="gate-gem" aria-hidden="true"></span><span class="gate-gs">' + g.gs + '</span><span class="gate-name">' + esc(g.title) + "</span></div>";
    });
    html += '<div class="you" style="left:' + pos(S.gs).toFixed(2) + '%"><span>Du · ' + S.gs + "</span></div>";
    html += "</div></div>";
    if (ng) {
      html += '<p class="track-note"><strong>Nächstes Tor: ' + ng.gs + " · " + esc(ng.title) + "</strong> – noch " + (ng.gs - S.gs) + " GS. " + esc(ng.text) + "</p>";
    } else {
      html += '<p class="track-note"><strong>Alle bekannten Tore offen.</strong> Ab hier zählen Raids, Transzendenz 4 und Arkana-Sets.</p>';
    }
    return html;
  };

  function upcomingPerEvent(t) {
    return D.events.map((ev) => ({ ev, o: nextOf(ev, t) })).filter((x) => x.o).sort((a, b) => a.o.ts - b.o.ts);
  }

  function nextRow(x, t) {
    const live = x.o.ts <= t && x.o.end > t;
    return '<li class="nx' + (live ? " is-live" : "") + '">' +
      '<span class="nx-time">' + Z.time(x.o.ts) + "</span>" +
      '<span class="nx-name">' + esc(x.ev.name) + (x.o.ts - t > 20 * HOUR ? ' <small>' + Z.day(x.o.ts) + "</small>" : "") + "</span>" +
      '<span class="nx-cd">' + (live ? "läuft · " + cd(x.o.end, true) : cd(x.o.ts)) + "</span></li>";
  }

  parts["next-short"] = function () {
    const t = now();
    return '<ul class="nx-list">' + upcomingPerEvent(t).slice(0, 5).map((x) => nextRow(x, t)).join("") + "</ul>";
  };

  parts["next-full"] = function () {
    const t = now();
    return '<ul class="nx-list nx-list--full">' + upcomingPerEvent(t).map((x) =>
      nextRow(x, t).replace("</li>", '<span class="nx-meta">' + esc(x.ev.where) + " · " + esc(x.ev.what) + " " + chip(x.ev.confidence) + "</span></li>")
    ).join("") + "</ul>";
  };

  function stepCard(s, compact) {
    const done = !!S.steps[s.id];
    const locked = s.minGS > S.gs;
    const mapBtn = s.marker ? '<button type="button" class="link-btn" data-action="map-step" data-marker="' + s.marker + '">Auf der Karte</button>' : "";
    return '<li class="step' + (done ? " is-done" : "") + (locked ? " is-locked" : "") + '" id="st-' + s.id + '">' +
      '<label class="step-check"><input type="checkbox" id="step-' + s.id + '" data-step="' + s.id + '"' + (done ? " checked" : "") + '><span class="sr">Erledigt</span></label>' +
      '<div class="step-body">' +
      '<p class="step-title">' + esc(s.title) + (locked ? ' <span class="lock">ab ' + s.minGS + "</span>" : "") + "</p>" +
      '<p class="step-meta"><span class="gain">' + esc(s.gain) + '</span><span class="sep">·</span><span>' + esc(s.cadence) + "</span></p>" +
      (compact ? "" :
        '<p class="step-where"><span class="lbl">Wo</span> ' + esc(s.where) + "</p>" +
        '<details><summary>Details</summary><p>' + esc(s.detail) + "</p></details>" +
        '<div class="step-foot">' + chip(s.confidence) + mapBtn + "</div>") +
      "</div></li>";
  }

  parts["steps-short"] = function () {
    const open = D.steps.filter((s) => !S.steps[s.id] && s.minGS <= S.gs).sort((a, b) => a.prio - b.prio).slice(0, 5);
    if (!open.length) return '<p class="empty">Alles Freigeschaltete ist abgehakt. Nächstes Ziel: ' + (nextGate() ? nextGate().gs + " GS" : "Raids") + ".</p>";
    return '<ol class="steps steps--compact">' + open.map((s) => stepCard(s, true)).join("") + '</ol><a class="more" href="#gearscore">Ganzer Fahrplan</a>';
  };

  parts["gs-summary"] = function () {
    const total = D.steps.length, done = D.steps.filter((s) => S.steps[s.id]).length;
    const ng = nextGate();
    return '<div class="summary">' +
      '<div><span class="k">Dein Gearscore</span><span class="v">' + S.gs + "</span></div>" +
      '<div><span class="k">Nächstes Tor</span><span class="v">' + (ng ? ng.gs : "–") + "</span>" + (ng ? '<span class="s">noch ' + (ng.gs - S.gs) + " GS · " + esc(ng.title) + "</span>" : "") + "</div>" +
      '<div><span class="k">Abgehakt</span><span class="v">' + done + "/" + total + "</span></div></div>";
  };

  parts.plan = function () {
    return D.stages.map((st) => {
      const list = D.steps.filter((s) => s.stage === st.id).sort((a, b) => a.prio - b.prio);
      const open = S.gs >= st.minGS;
      return '<section class="stage' + (open ? "" : " is-locked") + '">' +
        '<header class="stage-head"><h2>' + esc(st.title) + '</h2><p>' + esc(st.sub) + "</p>" +
        (open ? "" : '<span class="lock">noch ' + (st.minGS - S.gs) + " GS</span>") + "</header>" +
        '<ol class="steps">' + list.map((s) => stepCard(s, false)).join("") + "</ol></section>";
    }).join("");
  };

  parts.odyle = function () {
    const o = odyle(now());
    const pct = Math.round((o.cur / o.cap) * 100);
    return '<div class="meter" role="img" aria-label="Odyle ' + o.cur + " von " + o.cap + '"><div class="meter-fill" style="width:' + pct + '%"></div></div>' +
      '<dl class="kv">' +
      "<div><dt>Jetzt (geschätzt)</dt><dd>" + o.cur + " / " + o.cap + "</dd></div>" +
      "<div><dt>Würfel möglich</dt><dd>" + o.cubes + " × 40</dd></div>" +
      "<div><dt>Voll um</dt><dd>" + (o.full ? '<span class="warn-text">Jetzt voll – ausgeben!</span>' : Z.day(o.fullAt) + ", " + Z.time(o.fullAt) + " · " + cd(o.fullAt)) + "</dd></div>" +
      "</dl>" +
      '<p class="fine">+15 alle 3 h, läuft auch offline. Der genaue Tick-Zeitpunkt ist nicht bekannt, deshalb ± 3 h.</p>';
  };

  parts["today-mini"] = function () {
    const t = now();
    const r = nextOf(evById("reset"), t), w = nextOf(evById("wreset"), t);
    const dl = D.checklist.daily, done = dl.reduce((a, c) => a + Math.min(+S.check.daily[c.id] || 0, c.max), 0), all = dl.reduce((a, c) => a + c.max, 0);
    const o = odyle(t);
    return '<dl class="kv">' +
      "<div><dt>Tages-Reset</dt><dd>" + (r ? Z.time(r.ts) + " · " + cd(r.ts) : "–") + "</dd></div>" +
      "<div><dt>Wochen-Reset</dt><dd>" + (w ? Z.day(w.ts) + " " + Z.time(w.ts) + " · " + cd(w.ts) : "–") + "</dd></div>" +
      "<div><dt>Tagesliste</dt><dd>" + done + " / " + all + "</dd></div>" +
      "<div><dt>Odyle</dt><dd>" + o.cur + " / " + o.cap + (o.full ? ' <span class="warn-text">voll</span>' : " · " + o.cubes + " Würfel") + "</dd></div>" +
      '</dl><a class="more" href="#checkliste">Zur Checkliste</a>';
  };

  parts["class-mini"] = function () {
    const c = cls();
    return '<p class="cm-name">' + esc(c.name) + ' <span class="muted">(' + esc(c.de) + ")</span></p>" +
      '<p class="muted">' + esc(c.role) + " · " + esc(c.weapon) + "</p>" +
      '<p class="lbl-line">Werte-Priorität</p><ol class="prio">' + c.stats.map((s) => "<li>" + esc(s) + "</li>").join("") + "</ol>" +
      '<p class="lbl-line">Waffen-Weg</p><p class="small">' + esc(c.gearPath[0].path) + "</p>" +
      '<a class="more" href="#klassen">Klassen-Details</a>';
  };

  parts["class-gear"] = function () {
    const c = cls();
    return '<p class="muted">' + esc(c.name) + " · Verstärken: " + c.gsFocus.map(esc).join(" › ") + "</p>" +
      '<table class="tbl"><tbody>' + c.gearPath.map((g) => "<tr><th scope=\"row\">" + esc(g.slot) + "</th><td>" + esc(g.path) + "</td></tr>").join("") + "</tbody></table>";
  };

  /* ---------- Zeiten ---------- */
  parts["zone-info"] = function () {
    const t = now();
    return 'Alle Zeiten in <strong>deutscher Zeit (' + esc(Z.zoneName(t)) + ")</strong>, egal wo dein Gerät steht. Umstellung auf Sommer- und Winterzeit läuft automatisch.";
  };

  parts.dst = function () {
    const t = now();
    const ch = Z.nextDstChange(t, 45);
    if (!ch) return "";
    const toWinter = ch.to < ch.from;
    return '<div class="notice"><strong>' + Z.long(ch.ts) + ": " + (toWinter ? "Ende der Sommerzeit" : "Beginn der Sommerzeit") + ".</strong> " +
      "Termine, die auf UTC laufen (Reset, Riss, Shugo), erscheinen danach in deutscher Zeit " + (toWinter ? "1 h früher" : "1 h später") +
      (toWinter ? " – der Reset rückt von 09:00 auf 08:00." : ".") + " Die Seite rechnet das automatisch um. Falls NCSOFT die Serverzeit anders handhabt, korrigiere es unten mit dem Versatz.</div>";
  };

  parts.timeline = function () {
    const t = now();
    const mid = Z.berlinMidnight(t);
    const end = mid + 24 * HOUR + (Z.offsetMin(Z.TZ, mid) - Z.offsetMin(Z.TZ, mid + 25 * HOUR)) * MIN;
    const span = end - mid;
    const lanes = [];
    D.events.forEach((ev) => { if (!lanes.includes(ev.lane)) lanes.push(ev.lane); });
    let html = '<div class="tl-scroll"><div class="tl" style="--now:' + ((t - mid) / span).toFixed(5) + '">';
    html += '<div class="tl-axis"><span class="tl-lane-name"></span><div class="tl-ticks">';
    for (let h = 0; h <= 24; h += 3) html += '<span style="left:' + ((h / 24) * 100).toFixed(2) + '%">' + String(h).padStart(2, "0") + "</span>";
    html += "</div></div>";
    lanes.forEach((lane) => {
      html += '<div class="tl-row"><span class="tl-lane-name">' + esc(lane) + '</span><div class="tl-track">';
      D.events.filter((e) => e.lane === lane).forEach((ev) => {
        Z.occurrences(ev, mid, end, shift(ev)).forEach((o) => {
          if (o.ts < mid || o.ts >= end) return;
          const left = ((o.ts - mid) / span) * 100;
          const w = Math.max(((o.end - o.ts) / span) * 100, 0.35);
          const past = o.end < t;
          html += '<span class="tl-ev t-' + ev.id + (past ? " is-past" : "") + '" style="left:' + left.toFixed(3) + "%;width:" + w.toFixed(3) + '%" title="' + esc(ev.name) + " " + Z.time(o.ts) + (o.end > o.ts ? "–" + Z.time(o.end) : "") + '"></span>';
        });
      });
      html += "</div></div>";
    });
    html += '<div class="tl-now" aria-hidden="true"><span>' + Z.time(t) + "</span></div>";
    html += "</div></div>";
    html += '<ul class="legend">' + D.events.filter((e) => e.id !== "wreset").map((e) => '<li><span class="sw t-' + e.id + '"></span>' + esc(e.short) + "</li>").join("") + "</ul>";
    return html;
  };

  parts.week = function () {
    const t = now();
    const today = Z.berlinDay(t);
    const monOffset = (today.dow + 6) % 7;
    const days = [];
    for (let i = 0; i < 7; i++) {
      const nx = new Date(Date.UTC(today.y, today.mo, today.d - monOffset + i));
      const start = Z.zoned(Z.TZ, nx.getUTCFullYear(), nx.getUTCMonth(), nx.getUTCDate(), 0, 0);
      const n2 = new Date(Date.UTC(today.y, today.mo, today.d - monOffset + i + 1));
      const stop = Z.zoned(Z.TZ, n2.getUTCFullYear(), n2.getUTCMonth(), n2.getUTCDate(), 0, 0);
      days.push({ start, stop, label: Z.day(start + 12 * HOUR), isToday: i === monOffset });
    }
    let html = '<div class="tbl-scroll"><table class="tbl tbl--week"><thead><tr><th scope="col">Termin</th>' +
      days.map((d) => '<th scope="col"' + (d.isToday ? ' class="is-today"' : "") + ">" + esc(d.label) + "</th>").join("") + "</tr></thead><tbody>";
    D.events.forEach((ev) => {
      html += '<tr><th scope="row">' + esc(ev.short) + "</th>";
      days.forEach((d) => {
        const occ = Z.occurrences(ev, d.start, d.stop - 1, shift(ev)).filter((o) => o.ts >= d.start && o.ts < d.stop);
        let txt = "";
        if (occ.length > 8) {
          const mins = [...new Set(occ.map((o) => Z.time(o.ts).slice(3)))];
          txt = "stündl. :" + mins.join(", :");
        } else if (occ.length > 3) {
          txt = occ.map((o) => { const s = Z.time(o.ts); return s.endsWith(":00") ? s.slice(0, 2) : s; }).join(" · ");
        } else {
          txt = occ.map((o) => Z.time(o.ts)).join(" · ");
        }
        html += "<td" + (d.isToday ? ' class="is-today"' : "") + ">" + (txt ? esc(txt) : '<span class="muted">–</span>') + "</td>";
      });
      html += "</tr>";
    });
    html += "</tbody></table></div>";
    return html;
  };

  parts.settings = function () {
    const canNotify = "Notification" in window;
    let perm = "";
    if (canNotify) {
      try { perm = Notification.permission; } catch (e) { perm = "denied"; }
    }
    let html = '<p class="muted">Quellen sind sich bei manchen Zeiten uneinig. Stimmt etwas im Spiel nicht, verschiebe den Termin hier. Die Seite merkt sich das in deinem Browser.</p>';
    html += '<div class="tbl-scroll"><table class="tbl tbl--set"><thead><tr><th scope="col">Termin</th><th scope="col">Quelle</th><th scope="col">Versatz</th><th scope="col">5 Min vorher erinnern</th></tr></thead><tbody>';
    D.events.forEach((ev) => {
      const base = ev.kind === "interval" ? "alle " + (ev.every >= 60 ? ev.every / 60 + " h" : ev.every + " min") + " ab " + ev.start : ev.times.join(", ");
      const days = ev.days ? " · " + ev.days.map((d) => ["So", "Mo", "Di", "Mi", "Do", "Fr", "Sa"][d]).join("/") : "";
      html += "<tr><th scope=\"row\">" + esc(ev.name) + "<br>" + chip(ev.confidence) + "</th>" +
        '<td class="small">' + esc(base + days) + " " + (ev.tz === "UTC" ? "UTC" : "Berlin") + '<br><span class="muted">' + esc(ev.note) + "</span></td>" +
        '<td><select id="shift-' + ev.id + '" data-shift="' + ev.id + '" aria-label="Versatz für ' + esc(ev.name) + '">' +
        [-180, -120, -60, -30, 0, 30, 60, 120, 180].map((m) => '<option value="' + m + '"' + (shift(ev) === m ? " selected" : "") + ">" + (m > 0 ? "+" : "") + (m === 0 ? "±0" : m >= 60 || m <= -60 ? m / 60 + " h" : m + " min") + "</option>").join("") +
        "</select></td>" +
        '<td><label class="switch"><input type="checkbox" id="remind-' + ev.id + '" data-remind="' + ev.id + '"' + (S.remind[ev.id] ? " checked" : "") + '><span>Erinnern</span></label></td></tr>';
    });
    html += "</tbody></table></div>";
    html += '<div class="row-actions">';
    if (canNotify && perm === "default") html += '<button type="button" class="btn" data-action="notify-perm">Browser-Benachrichtigungen erlauben</button>';
    if (canNotify && perm === "granted") html += '<span class="muted">Browser-Benachrichtigungen sind an.</span>';
    if (!canNotify || perm === "denied") html += '<span class="muted">Erinnerungen erscheinen als Hinweis auf der Seite, solange sie offen ist.</span>';
    html += '<button type="button" class="btn btn--ghost" data-action="shift-reset">Alle Versätze zurücksetzen</button></div>';
    return html;
  };

  parts["boss-timers"] = function () {
    const t = now();
    const rows = Object.keys(S.kills).map((id) => ({ id, m: D.markers.find((x) => x.id === id), st: bossState(id, t) })).filter((x) => x.m && x.st);
    if (!rows.length) return '<p class="empty">Feldbosse haben keinen festen Plan, ihr Respawn startet beim Kill. Tippe auf der Karte einen Boss an und drücke „Gerade getötet“, dann läuft hier sein Timer.</p><a class="more" href="#karte">Zur Karte</a>';
    return '<ul class="nx-list">' + rows.sort((a, b) => a.st.at - b.st.at).map((x) =>
      '<li class="nx' + (x.st.up ? " is-live" : "") + '"><span class="nx-time">' + Z.time(x.st.at) + '</span><span class="nx-name">' + esc(x.m.name) + "</span>" +
      '<span class="nx-cd">' + (x.st.up ? "sollte da sein" : cd(x.st.at)) + "</span>" +
      '<span class="nx-meta"><button type="button" class="link-btn" data-action="map-marker" data-id="' + x.id + '">Karte</button><button type="button" class="link-btn" data-action="boss-clear" data-id="' + x.id + '">Entfernen</button></span></li>'
    ).join("") + "</ul>";
  };

  /* ---------- Checkliste ---------- */
  function checkList(kind) {
    const list = D.checklist[kind];
    const store = S.check[kind];
    return '<ul class="checks">' + list.map((c) => {
      const v = Math.min(+store[c.id] || 0, c.max);
      const done = v >= c.max;
      return '<li class="ck' + (done ? " is-done" : "") + '">' +
        '<div class="ck-text"><span class="ck-label">' + esc(c.label) + '</span><span class="ck-hint">' + esc(c.hint) + "</span></div>" +
        '<div class="ck-ctrl">' +
        (c.max === 1
          ? '<label class="switch"><input type="checkbox" id="ck-' + kind + "-" + c.id + '" data-check="' + kind + '" data-id="' + c.id + '"' + (done ? " checked" : "") + "><span>Erledigt</span></label>"
          : '<button type="button" class="ctr" id="ckm-' + kind + "-" + c.id + '" data-ctr="' + kind + '" data-id="' + c.id + '" data-d="-1" aria-label="' + esc(c.label) + ' minus eins">−</button>' +
            '<span class="ctr-val" aria-live="polite">' + v + "/" + c.max + "</span>" +
            '<button type="button" class="ctr" id="ckp-' + kind + "-" + c.id + '" data-ctr="' + kind + '" data-id="' + c.id + '" data-d="1" aria-label="' + esc(c.label) + ' plus eins">+</button>') +
        "</div></li>";
    }).join("") + "</ul>";
  }
  parts["check-daily"] = () => checkList("daily");
  parts["check-weekly"] = () => checkList("weekly");
  parts["reset-daily"] = function () {
    const r = nextOf(evById("reset"));
    return r ? "Setzt sich zurück um " + Z.time(r.ts) + " (" + cd(r.ts) + ")" : "";
  };
  parts["reset-weekly"] = function () {
    const r = nextOf(evById("wreset"));
    return r ? "Setzt sich zurück " + Z.day(r.ts) + " " + Z.time(r.ts) + " (" + cd(r.ts) + ")" : "";
  };

  /* ---------- Klassen ---------- */
  parts["class-tabs"] = function () {
    return '<div class="seg seg--wrap" role="tablist" aria-label="Klasse wählen">' + D.classes.map((c) =>
      '<button type="button" role="tab" id="ct-' + c.id + '" class="seg-btn' + (c.id === viewCls ? " is-on" : "") + '" aria-selected="' + (c.id === viewCls) + '" data-action="view-class" data-id="' + c.id + '">' +
      esc(c.name) + (c.id === S.cls ? ' <span class="mine">deine</span>' : "") + "</button>").join("") + "</div>";
  };

  parts["class-detail"] = function () {
    const c = D.classes.find((x) => x.id === viewCls) || D.classes[0];
    let html = '<article class="cls cls--' + c.id + '">';
    html += '<header class="cls-head"><div><p class="eyebrow">' + esc(c.role) + "</p><h2>" + esc(c.name) + ' <span class="muted">' + esc(c.de) + "</span></h2>" +
      '<p class="cls-tags"><span>' + esc(c.weapon) + "</span><span>" + esc(c.range) + "</span></p></div>" +
      (c.id !== S.cls ? '<button type="button" class="btn" data-action="set-class" data-id="' + c.id + '">Das ist meine Klasse</button>' : '<span class="chip chip--ok">Deine Klasse</span>') + "</header>";
    html += '<p class="lede">' + esc(c.summary) + '</p><p class="muted small">Tier-Einschätzung: ' + esc(c.tier) + "</p>";
    html += '<div class="cols">' +
      '<section><h3>Werte-Priorität (PvE)</h3><ol class="prio">' + c.stats.map((s) => "<li>" + esc(s) + "</li>").join("") + "</ol>" +
      '<p class="fine">Guides widersprechen sich teils. Erst Genauigkeit bis zum Cap, danach Schaden ist der gemeinsame Nenner.</p></section>' +
      '<section><h3>Gearscore-Fokus</h3><ol class="prio">' + c.gsFocus.map((s) => "<li>" + esc(s) + "</li>").join("") + "</ol>" +
      '<h3>Gear-Weg ab 1400</h3><table class="tbl"><tbody>' + c.gearPath.map((g) => '<tr><th scope="row">' + esc(g.slot) + "</th><td>" + esc(g.path) + "</td></tr>").join("") + "</tbody></table></section></div>";
    if (c.extra) {
      const x = c.extra;
      html += '<div class="cols cols--3">' +
        '<section><h3>Geister</h3><dl class="defs">' + x.spirits.map((s) => "<dt>" + esc(s.name) + "</dt><dd>" + esc(s.text) + "</dd>").join("") + "</dl></section>" +
        '<section><h3>Stigmen</h3><ol class="prio">' + x.stigmas.map((s) => "<li><strong>" + esc(s.name) + "</strong><br>" + esc(s.text) + "</li>").join("") + "</ol></section>" +
        '<section><h3>Skill-Ränge</h3><table class="tbl"><thead><tr><th scope="col">Fähigkeit</th><th scope="col">Ziel-Rang</th></tr></thead><tbody>' +
        x.skills.map((s) => "<tr><td>" + esc(s.name) + '</td><td class="num">' + esc(s.rank) + "</td></tr>").join("") + "</tbody></table></section></div>";
      html += '<div class="cols cols--3">' +
        '<section><h3>Daevanion</h3><ol class="prio">' + x.daevanion.map((s) => "<li>" + esc(s) + "</li>").join("") + "</ol></section>" +
        '<section><h3>Werte auf dem Gear</h3><dl class="defs">' + x.gearStats.map((s) => "<dt>" + esc(s.slot) + "</dt><dd>" + esc(s.stats) + "</dd>").join("") + "</dl></section>" +
        '<section><h3>Kern-Ablauf</h3><ol class="prio">' + x.rotation.map((s) => "<li>" + esc(s) + "</li>").join("") + '</ol><p class="fine">Testen an den Trainingspuppen.</p>' +
        '<button type="button" class="link-btn" data-action="map-marker" data-id="' + (S.faction === "asmo" ? "dummy-asmo" : "dummy-elyos") + '">Trainingspuppen auf der Karte</button></section></div>';
      html += '<p class="fine">Skill- und Itemnamen stammen aus dem englischen Client. Im deutschen Client können sie anders heißen.</p>';
    }
    html += "</article>";
    return html;
  };

  /* ---------- Karte ---------- */
  parts["map-filters"] = function () {
    const types = ["monolith", "boss", "artefakt", "riss", "puppe", "pin"];
    return types.map((t) => {
      const on = S.filters[t] !== false;
      return '<button type="button" class="fchip' + (on ? " is-on" : "") + '" aria-pressed="' + on + '" data-action="filter" data-type="' + t + '" id="flt-' + t + '">' + icon(t) + esc(TYPE[t]) + "</button>";
    }).join("");
  };

  function markerPanel(m) {
    const t = now();
    const isPin = m.type === "pin";
    const reg = D.regions.find((r) => r.id === m.region);
    let html = '<div class="mp-head">' + icon(m.type) + '<div><p class="eyebrow">' + esc(TYPE[m.type]) + (reg ? " · " + esc(reg.name) : "") + "</p><h3>" + esc(m.name || "Eigener Pin") + "</h3></div></div>";
    if (isPin) {
      html += '<label class="field"><span>Name</span><input type="text" id="pin-name" data-pin="name" value="' + esc(m.name || "") + '" placeholder="z. B. Festung, Farmspot"></label>' +
        '<label class="field"><span>Notiz</span><textarea id="pin-note" data-pin="note" rows="3" placeholder="Was gibt es hier?">' + esc(m.note || "") + "</textarea></label>" +
        '<div class="row-actions"><button type="button" class="btn btn--ghost" data-action="pin-delete">Pin löschen</button></div>' +
        '<p class="fine">Pins speichert nur dein Browser.</p>';
      return html;
    }
    html += "<p>" + esc(m.text) + "</p>";
    if (m.event) {
      const ev = evById(m.event);
      const o = nextOf(ev, t);
      if (o) {
        const live = o.ts <= t && o.end > t;
        html += '<div class="mp-time' + (live ? " is-live" : "") + '"><span class="k">' + esc(ev.name) + "</span>" +
          '<span class="v">' + (live ? "läuft jetzt · " + cd(o.end, true) : Z.day(o.ts) + ", " + Z.time(o.ts) + " · " + cd(o.ts)) + "</span>" + chip(ev.confidence) + "</div>";
      }
    }
    if (m.type === "boss") {
      const st = bossState(m.id, t);
      const mins = +S.respawn[m.id] || m.respawn || 60;
      html += '<div class="mp-boss">' +
        '<label class="field field--inline"><span>Respawn (Min)</span><input type="number" min="5" max="1440" step="5" id="respawn-' + m.id + '" data-respawn="' + m.id + '" value="' + mins + '"></label>' +
        '<button type="button" class="btn" data-action="boss-kill" data-id="' + m.id + '">Gerade getötet</button>' +
        (st ? '<p class="mp-time' + (st.up ? " is-live" : "") + '"><span class="k">Respawn</span><span class="v">' + (st.up ? "sollte wieder da sein" : "ca. " + Z.time(st.at) + " · " + cd(st.at)) + "</span></p>" : "") +
        "</div>" +
        (m.respawn ? "" : '<p class="fine">Respawn-Zeit für diesen Boss ist nicht veröffentlicht. Stell sie nach deiner Beobachtung ein.</p>');
    }
    if (m.step) {
      const s = D.steps.find((x) => x.id === m.step);
      if (s) html += '<p class="mp-link"><span class="lbl">Gehört zu</span> <button type="button" class="link-btn" data-action="goto-step" data-id="' + s.id + '">' + esc(s.title) + "</button></p>";
    }
    html += '<p class="fine">Position schematisch. Exakte Koordinaten: <a href="https://aion2.th.gl/" target="_blank" rel="noopener">aion2.th.gl</a> oder <a href="https://wikily.gg/aion-2/interactive-map" target="_blank" rel="noopener">Wikily-Karte</a>.</p>';
    return html;
  }

  function regionPanel(r) {
    const ms = D.markers.filter((m) => m.region === r.id);
    return '<div class="mp-head"><span class="region-dot region-dot--' + r.faction + '"></span><div><p class="eyebrow">' + esc(FACTION[r.faction]) + " · " + esc(r.level) + "</p><h3>" + esc(r.name) + "</h3></div></div>" +
      "<p>" + esc(r.text) + "</p>" +
      (ms.length ? '<ul class="mlist">' + ms.map((m) => '<li><button type="button" class="link-btn" data-action="map-marker" data-id="' + m.id + '">' + icon(m.type) + esc(m.name) + "</button></li>").join("") + "</ul>" : "");
  }

  parts["map-panel"] = function () {
    if (selected) {
      const m = D.markers.find((x) => x.id === selected);
      if (m) return markerPanel(m);
      const p = S.pins.find((x) => x.id === selected);
      if (p) return markerPanel(Object.assign({ type: "pin" }, p));
      const r = D.regions.find((x) => x.id === selected);
      if (r) return regionPanel(r);
    }
    return '<h3 class="side-title">So liest du die Karte</h3>' +
      '<ul class="legend legend--map">' + Object.keys(TYPE).map((t) => "<li>" + icon(t) + esc(TYPE[t]) + "</li>").join("") + "</ul>" +
      '<p class="small">Tippe auf eine Region oder ein Symbol. Glühende Symbole sind gerade aktiv, pulsierende starten bald.</p>' +
      '<h3 class="side-title">Ohne Laufweg: Dungeon-Menü</h3>' +
      '<p class="small muted">Diese Instanzen startest du über das Menü, egal wo du stehst.</p>' +
      '<ul class="menu-list">' + D.menuContent.map((c) => {
        const lock = /IL (\d+)/.exec(c.req);
        const locked = lock && +lock[1] > S.gs;
        return '<li class="' + (locked ? "is-locked" : "") + '"><button type="button" class="link-btn" data-action="goto-step" data-id="' + c.step + '">' + esc(c.name) + "</button><span>" + esc(c.req) + " · " + esc(c.info) + "</span></li>";
      }).join("") + "</ul>";
  };

  parts["map-hint"] = function () {
    return document.body.classList.contains("pinmode") ? "Pin-Modus: Tippe auf die Karte, um einen Pin zu setzen." : "";
  };

  parts["map-list"] = function () {
    const groups = {};
    D.markers.forEach((m) => { (groups[m.region] = groups[m.region] || []).push(m); });
    return '<div class="place-groups">' + D.regions.filter((r) => groups[r.id]).map((r) =>
      '<section><h3><button type="button" class="link-btn" data-action="map-region" data-id="' + r.id + '">' + esc(r.name) + '</button> <span class="muted small">' + esc(FACTION[r.faction]) + "</span></h3><ul>" +
      groups[r.id].map((m) => '<li><button type="button" class="link-btn" data-action="map-marker" data-id="' + m.id + '">' + icon(m.type) + esc(m.name) + "</button></li>").join("") + "</ul></section>"
    ).join("") +
      (S.pins.length ? '<section><h3>Deine Pins</h3><ul>' + S.pins.map((p) => '<li><button type="button" class="link-btn" data-action="map-marker" data-id="' + p.id + '">' + icon("pin") + esc(p.name || "Eigener Pin") + "</button></li>").join("") + "</ul></section>" : "") +
      "</div>";
  };

  /* ================= Rendern ================= */
  function refresh(names) {
    const active = document.activeElement;
    const activeId = active && active.id;
    $$("[data-part]").forEach((host) => {
      const n = host.getAttribute("data-part");
      if (names && !names.includes(n)) return;
      if (!parts[n]) return;
      host.innerHTML = parts[n]();
    });
    if (activeId && document.activeElement !== active) {
      const again = document.getElementById(activeId);
      if (again) again.focus({ preventScroll: true });
    }
    tick(true);
  }

  const TIME_PARTS = ["next-short", "next-full", "today-mini", "timeline", "week", "boss-timers", "odyle", "dst", "zone-info", "reset-daily", "reset-weekly"];

  function tick(onlyCd) {
    const t = now();
    $$("[data-cd]").forEach((n) => {
      const ts = +n.getAttribute("data-cd");
      const left = n.hasAttribute("data-left");
      n.textContent = ts - t > 0 ? (left ? "noch " : "in ") + Z.countdown(ts - t) : (left ? "vorbei" : "jetzt");
    });
    $$("[data-clock]").forEach((n) => { n.textContent = Z.timeSec(t); });
    $$("[data-zone]").forEach((n) => { n.textContent = Z.zoneName(t); });
    if (onlyCd) return;

    const sec = Math.floor(t / 1000);
    if (checkResets()) refresh(["check-daily", "check-weekly", "today-mini"]);
    if (sec % 30 === 0) refresh(TIME_PARTS);
    else {
      // Läuft ein Countdown ab, sofort neu zeichnen
      const expired = $$("[data-cd]").some((n) => { const d = +n.getAttribute("data-cd") - t; return d <= 0 && d > -1500; });
      if (expired) refresh(TIME_PARTS.concat(["map-panel"]));
    }
    const needle = $(".tl");
    if (needle) {
      const mid = Z.berlinMidnight(t);
      needle.style.setProperty("--now", ((t - mid) / (24 * HOUR)).toFixed(5));
    }
    liveMap(t);
    reminders(t);
  }

  function liveMap(t) {
    const live = {};
    D.markers.forEach((m) => {
      if (m.event) {
        const o = nextOf(evById(m.event), t);
        if (o && o.ts <= t && o.end > t) live[m.id] = "live";
        else if (o && o.ts - t < 15 * MIN) live[m.id] = "soon";
      }
      if (m.type === "boss") {
        const st = bossState(m.id, t);
        if (st && !st.up) live[m.id] = st.at - t < 5 * MIN ? "soon" : "down";
        else if (st && st.up) live[m.id] = "live";
      }
    });
    K.setLive(live);
  }

  function reminders(t) {
    D.events.forEach((ev) => {
      if (!S.remind[ev.id]) return;
      const o = nextOf(ev, t);
      if (!o) return;
      const left = o.ts - t;
      const key = ev.id + ":" + o.ts;
      if (left > 0 && left <= 5 * MIN && !notified.has(key)) {
        notified.add(key);
        const msg = ev.name + " um " + Z.time(o.ts) + " (in " + Math.ceil(left / MIN) + " min)";
        toast(msg);
        try {
          if ("Notification" in window && Notification.permission === "granted") new Notification("AION 2 · Daeva-Kompass", { body: msg });
        } catch (e) { /* Hinweis auf der Seite reicht */ }
      }
    });
  }

  function toast(text) {
    const box = $("#toasts");
    if (!box) return;
    const n = document.createElement("div");
    n.className = "toast";
    n.textContent = text;
    box.appendChild(n);
    setTimeout(() => n.remove(), 7000);
  }

  /* ================= Navigation ================= */
  const VIEWS = ["uebersicht", "charakter", "gearscore", "karte", "zeiten", "checkliste", "klassen", "quellen"];
  function show(view) {
    if (!VIEWS.includes(view)) view = "uebersicht";
    VIEWS.forEach((v) => {
      const sec = $("#v-" + v);
      if (sec) sec.hidden = v !== view;
      const tab = $('.tabs a[href="#' + v + '"]');
      if (tab) { if (v === view) tab.setAttribute("aria-current", "page"); else tab.removeAttribute("aria-current"); }
    });
  }
  function go(view) {
    if (location.hash !== "#" + view) { try { history.replaceState(null, "", "#" + view); } catch (e) { location.hash = view; } }
    show(view);
    window.scrollTo({ top: 0 });
  }

  function focusMapFor(markerType) {
    go("karte");
    if (markerType === "abyss") { K.focusRegion("untere"); selected = "untere"; refresh(["map-panel"]); return; }
    const m = D.markers.find((x) => x.type === markerType && x.faction === S.faction) || D.markers.find((x) => x.type === markerType);
    if (m) { K.focusMarker(m.id); }
  }

  /* ================= Ereignisse ================= */
  function onClick(e) {
    const ctr = e.target.closest("[data-ctr]");
    if (ctr) {
      const kind = ctr.getAttribute("data-ctr"), cid = ctr.getAttribute("data-id");
      const item = D.checklist[kind].find((c) => c.id === cid);
      const v = Math.max(0, Math.min(item.max, (+S.check[kind][cid] || 0) + +ctr.getAttribute("data-d")));
      S.check[kind][cid] = v; save(); refresh(["check-" + kind, "today-mini"]);
      return;
    }
    const a = e.target.closest("[data-action]");
    if (!a) return;
    const act = a.getAttribute("data-action");
    const id = a.getAttribute("data-id");
    const t = now();
    switch (act) {
      case "map-step": focusMapFor(a.getAttribute("data-marker")); break;
      case "map-marker": go("karte"); K.focusMarker(id); break;
      case "map-region": go("karte"); K.focusRegion(id); break;
      case "goto-step": {
        go("gearscore");
        const n = document.getElementById("st-" + id);
        if (n) {
          n.scrollIntoView({ block: "center" });
          n.classList.add("flash");
          setTimeout(() => n.classList.remove("flash"), 1600);
          const d = n.querySelector("details"); if (d) d.open = true;
        }
        break;
      }
      case "filter": {
        const type = a.getAttribute("data-type");
        S.filters[type] = S.filters[type] === false;
        save(); K.setFilter(type, S.filters[type] !== false); refresh(["map-filters"]);
        break;
      }
      case "focus": {
        const f = a.getAttribute("data-f");
        $$('[data-action="focus"]').forEach((b) => { const on = b === a; b.classList.toggle("is-on", on); b.setAttribute("aria-pressed", on); });
        K.setFocus(f);
        if (f === "elyos") K.focusRegion("verteron");
        else if (f === "asmo") K.focusRegion("altgard");
        else if (f === "abyss") K.focusRegion("mittlere");
        else K.reset();
        break;
      }
      case "zoom-in": K.zoomIn(); break;
      case "zoom-out": K.zoomOut(); break;
      case "zoom-reset": K.reset(); break;
      case "pinmode": {
        const on = !document.body.classList.contains("pinmode");
        document.body.classList.toggle("pinmode", on);
        a.setAttribute("aria-pressed", on);
        a.classList.toggle("is-on", on);
        K.setPinMode(on);
        refresh(["map-hint"]);
        break;
      }
      case "pin-delete":
        S.pins = S.pins.filter((p) => p.id !== selected);
        save(); selected = null; K.refreshPins(); K.select(null, true); refresh(["map-panel", "map-list"]);
        break;
      case "boss-kill": {
        const inp = document.getElementById("respawn-" + id);
        if (inp && +inp.value > 0) S.respawn[id] = +inp.value;
        S.kills[id] = t; save(); refresh(["map-panel", "boss-timers"]); liveMap(t);
        toast("Timer gestartet: " + (D.markers.find((m) => m.id === id) || {}).name);
        break;
      }
      case "boss-clear": delete S.kills[id]; save(); refresh(["boss-timers", "map-panel"]); liveMap(t); break;
      case "view-class": viewCls = id; refresh(["class-tabs", "class-detail"]); break;
      case "set-class":
        S.cls = id; viewCls = id; save();
        $("#f-class").value = id;
        refresh(["class-tabs", "class-detail", "class-mini", "class-gear"]);
        break;
      case "shift-reset": S.shifts = {}; save(); refresh(TIME_PARTS.concat(["settings"])); break;
      case "notify-perm":
        try {
          const p = Notification.requestPermission();
          if (p && p.then) p.then(() => refresh(["settings"])).catch(() => refresh(["settings"]));
        } catch (err) { refresh(["settings"]); }
        break;
      case "theme": cycleTheme(); break;
      case "check-reset-day": S.check.daily = {}; save(); refresh(["check-daily", "today-mini"]); break;
      case "check-reset-week": S.check.weekly = {}; save(); refresh(["check-weekly"]); break;
      case "odyle-now": {
        const inp = $("#f-odyle");
        S.odyle.val = Math.max(0, Math.min(840, +inp.value || 0)); S.odyle.at = t; save(); refresh(["odyle", "today-mini"]);
        break;
      }
    }
  }

  function onChange(e) {
    const n = e.target;
    if (n.matches("[data-step]")) {
      S.steps[n.getAttribute("data-step")] = n.checked; save();
      refresh(["steps-short", "plan", "gs-summary"]);
    } else if (n.matches("[data-check]")) {
      S.check[n.getAttribute("data-check")][n.getAttribute("data-id")] = n.checked ? 1 : 0; save();
      refresh(["check-" + n.getAttribute("data-check"), "today-mini"]);
    } else if (n.matches("[data-shift]")) {
      S.shifts[n.getAttribute("data-shift")] = +n.value; save(); refresh(TIME_PARTS);
    } else if (n.matches("[data-remind]")) {
      S.remind[n.getAttribute("data-remind")] = n.checked; save();
    } else if (n.matches("[data-respawn]")) {
      S.respawn[n.getAttribute("data-respawn")] = Math.max(1, +n.value || 60); save(); refresh(["boss-timers"]);
    } else if (n.id === "f-class") {
      S.cls = n.value; viewCls = n.value; save(); refresh(["class-mini", "class-gear", "class-tabs", "class-detail"]);
    } else if (n.id === "f-member") {
      S.odyle.member = n.checked; save(); refresh(["odyle", "today-mini"]);
    } else if (n.name === "faction") {
      S.faction = n.value; save(); applyFaction();
    }
  }

  function onInput(e) {
    const n = e.target;
    if (n.id === "f-gs") {
      const v = Math.round(+n.value);
      if (v >= 0 && v <= 5000) { S.gs = v; save(); refresh(["track", "steps-short", "plan", "gs-summary", "map-panel"]); }
    } else if (n.matches("[data-pin]")) {
      const p = S.pins.find((x) => x.id === selected);
      if (p) { p[n.getAttribute("data-pin")] = n.value; save(); if (n.getAttribute("data-pin") === "name") { K.refreshPins(); refresh(["map-list"]); } }
    }
  }

  function applyFaction() {
    document.body.setAttribute("data-faction", S.faction);
    const r = $('input[name="faction"][value="' + S.faction + '"]');
    if (r) r.checked = true;
  }

  /* ---------- Theme ---------- */
  const THEMES = [null, "light", "dark"];
  const THEME_LABEL = { null: "System", light: "Hell", dark: "Dunkel" };
  function applyTheme() {
    if (S.theme) document.documentElement.setAttribute("data-theme", S.theme);
    else if (S.themeTouched) document.documentElement.removeAttribute("data-theme");
    const b = $("#theme-btn");
    if (b) b.querySelector("span").textContent = THEME_LABEL[S.theme];
  }
  function cycleTheme() {
    const i = THEMES.indexOf(S.theme);
    S.theme = THEMES[(i + 1) % THEMES.length];
    S.themeTouched = true;
    save(); applyTheme();
  }

  /* Schnittstelle für den Charakter-Check */
  window.DK_APP = {
    go,
    shifts: () => S.shifts,
    status: () => ({ gs: S.gs, cls: S.cls, faction: S.faction }),
    setStatus(st) {
      if (st.gs != null) S.gs = Math.round(st.gs);
      if (st.cls && D.classes.some((c) => c.id === st.cls)) { S.cls = st.cls; viewCls = st.cls; }
      if (st.faction === "elyos" || st.faction === "asmo") S.faction = st.faction;
      save();
      $("#f-gs").value = S.gs;
      $("#f-class").value = S.cls;
      applyFaction();
      K.setFocus(null);
      refresh();
    },
  };

  /* ================= Start ================= */
  function init() {
    checkResets();
    if (!S.odyle.at) { S.odyle.at = now(); save(); }

    $("#f-gs").value = S.gs;
    $("#f-class").innerHTML = D.classes.map((c) => '<option value="' + c.id + '">' + esc(c.name) + " (" + esc(c.de) + ")</option>").join("");
    $("#f-class").value = S.cls;
    $("#f-odyle").value = odyle(now()).cur;
    $("#f-member").checked = !!S.odyle.member;
    $("#donts").innerHTML = D.donts.map((d) => "<li>" + esc(d) + "</li>").join("");
    $("#sources").innerHTML = D.sources.map((s) => '<li><a href="' + esc(s.url) + '" target="_blank" rel="noopener">' + esc(s.name) + "</a></li>").join("");
    $$("[data-stand]").forEach((n) => { n.textContent = D.stand; });
    applyFaction();
    applyTheme();

    K.init($("#map-host"), {
      getPins: () => S.pins,
      onSelect(id) { selected = id; refresh(["map-panel"]); },
      onAddPin(x, y) {
        const p = { id: "pin-" + Date.now().toString(36), x, y, name: "", note: "" };
        S.pins.push(p); save(); selected = p.id; K.refreshPins(); K.select(p.id, true);
        refresh(["map-panel", "map-list"]);
        const inp = $("#pin-name"); if (inp) inp.focus();
      }
    });
    Object.keys(S.filters).forEach((t) => K.setFilter(t, S.filters[t] !== false));

    document.addEventListener("click", onClick);
    document.addEventListener("change", onChange);
    document.addEventListener("input", onInput);
    $("#status-form").addEventListener("submit", (e) => e.preventDefault());
    $("#odyle-form").addEventListener("submit", (e) => { e.preventDefault(); $('[data-action="odyle-now"]').click(); });
    window.addEventListener("hashchange", () => show(location.hash.slice(1)));

    refresh();
    show(location.hash.slice(1) || "uebersicht");
    setInterval(() => tick(false), 1000);
    tick(false);
  }

  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
