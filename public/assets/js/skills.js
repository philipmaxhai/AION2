/*
 * Ansicht „Skills & Makros“: je Klasse und Modus (PvE/PvP) die komplette Tastenbelegung als Bild (auch als PNG),
 * die gestapelten Linien, das Makro, Opener, Skillpunkte, Stigmen und Ablauf bzw. Kombos.
 * Daten: DK_DATA.skills (data-skills.js, erzeugt: Namen, Symbole, Stufen der Top-Spieler)
 * und DK_DATA.skillPlan (data.js, kuratiert: Tasten, Linien, Makro, Texte). [[English Name]] in Texten wird zum deutschen Namen.
 * Link: ?klasse=<id>[&modus=pvp]#skills
 */
(function () {
  const D = window.DK_DATA;
  const SK = D && D.skills;
  const SP = D && D.skillPlan;
  if (!SK || !SP) return;

  const ICON = "https://assets.playnccdn.com/static-aion2-gamedata/resources/";
  const CLS_IMG = "https://assets.playnccdn.com/static-aion2/characters/img/class/class_icon_";
  const esc = (s) => String(s == null ? "" : s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const lv = (n) => String(Math.round(n * 10) / 10).replace(".", ",");
  const date = (iso) => { const [y, m, d] = String(iso).split("-"); return d ? `${+d}.${+m}.${y}` : iso; };
  const clsIcon = (id) => CLS_IMG + (id === "spiritmaster" ? "elementalist" : id) + ".png";
  const TYP = { a: "aktiv", p: "passiv", s: "Stigma" };
  const LETTER = (i) => String.fromCharCode(65 + i);
  /* Tasten in fester Reihenfolge; Beschriftung wie auf Maus und Tastatur */
  const KEY_LABEL = { LMB: "Maus L", RMB: "Maus R", M4: "Maus 4", M5: "Maus 5" };
  const MOUSE = ["LMB", "RMB", "M4", "M5"];
  const BOARD = ["1", "2", "3", "4", "Q", "E", "R", "F", "Z", "X", "C", "V"];
  const keyLabel = (k) => KEY_LABEL[k] || k;

  const view = { cls: null, mode: "pve" };

  /* Skill einer Klasse nach englischem Namen: { en, de, typ, lern, icon } */
  function skill(cls, en) {
    const row = (SK.klassen[cls].skills || []).find((s) => s[0] === en);
    return row ? { en: row[0], de: row[1], typ: row[2], lern: row[3], icon: row[4] } : { en, de: en, typ: "", lern: null, icon: null };
  }
  const name = (cls, en) => skill(cls, en).de;

  function ico(s, size) {
    const c = `sk-ico${s.typ === "s" ? " sk-ico--stigma" : s.typ === "p" ? " sk-ico--passive" : ""}${size ? " sk-ico--" + size : ""}`;
    if (!s.icon) return `<span class="${c} pic-none" aria-hidden="true"></span>`;
    return `<img class="${c}" src="${ICON}${esc(s.icon)}.png" alt="" loading="lazy" decoding="async" width="40" height="40">`;
  }
  function chip(cls, en, extra) {
    const s = skill(cls, en);
    return `<span class="sk-chip" title="${esc(s.en)}${s.typ ? " · " + TYP[s.typ] : ""}">${ico(s, "sm")}<span>${esc(s.de)}</span>${extra || ""}</span>`;
  }
  /* Text mit [[English Name]] → deutscher Name, hervorgehoben */
  function rich(cls, text) {
    return esc(text).replace(/\[\[(.+?)\]\]/g, (m, en) => {
      const s = skill(cls, en.replace(/&#39;/g, "'").replace(/&amp;/g, "&"));
      return `<b class="sk-ref" title="${esc(s.en)}">${esc(s.de)}</b>`;
    });
  }
  const plain = (cls, text) => String(text).replace(/\[\[(.+?)\]\]/g, (m, en) => name(cls, en));

  /* Plan für den Modus: PvE liegt direkt in skillPlan.klassen[cls], PvP in .pvp */
  function plan(cls, mode) {
    const P = SP.klassen[cls];
    return mode === "pvp" ? P.pvp : P;
  }
  const lineName = (M, i) => `${LETTER(i)} · ${M.leiste[i].name}`;
  function stepText(cls, M, st) {
    return typeof st === "number" ? `${LETTER(st)} ${M.leiste[st].name}` : name(cls, st);
  }
  function macroKey(M) {
    const t = M.tasten.find((x) => x[1] === "makro");
    return t ? keyLabel(t[0]) : "Makrotaste";
  }
  /* Tasten nach Gruppe und fester Reihenfolge */
  function orderedKeys(M) {
    const by = new Map(M.tasten.map((t) => [t[0], t]));
    return { mouse: MOUSE.filter((k) => by.has(k)).map((k) => by.get(k)), board: BOARD.filter((k) => by.has(k)).map((k) => by.get(k)) };
  }
  /* Inhalt einer Taste: Linie (Liste von Skills, oben nach unten), einzelner Skill oder Makro */
  function keyContent(cls, M, t) {
    const [k, ref, note] = t;
    if (ref === "makro") return { kind: "makro", key: k, title: "Makro", note: M.makro.map((st) => typeof st === "number" ? LETTER(st) : name(cls, st)).join(" → "), skills: [] };
    if (typeof ref === "number") {
      const l = M.leiste[ref];
      return { kind: "line", key: k, title: lineName(M, ref), note: note || (l.hand ? "von Hand" : ""), skills: l.skills.map((en) => skill(cls, en)), hand: !!l.hand };
    }
    const s = skill(cls, ref);
    return { kind: "skill", key: k, title: s.de, en: s.en, note: note || "", skills: [s] };
  }

  function readUrl() {
    const p = new URLSearchParams(location.search);
    const k = p.get("klasse");
    if (k && SK.klassen[k]) view.cls = k;
    if (p.get("modus") === "pvp") view.mode = "pvp";
  }
  function updateUrl() {
    if (!/^https?:$/.test(location.protocol) || location.hash !== "#skills") return;
    try { history.replaceState(null, "", `?klasse=${view.cls}${view.mode === "pvp" ? "&modus=pvp" : ""}#skills`); } catch (e) { /* egal */ }
  }

  /* ---------- Tastenbild (HTML) ---------- */
  function keyHtml(cls, M, t) {
    const c = keyContent(cls, M, t);
    let stack;
    if (c.kind === "makro") {
      stack = `<span class="kb-macro" aria-hidden="true">M</span>`;
    } else {
      const n = c.skills.length;
      stack = c.skills.map((s, i) => {
        const first = c.kind === "line" && i === n - 1 && n > 1;
        return `<span class="kb-ico${first ? " is-first" : ""}" title="${esc(s.de)}${c.kind === "line" ? ` · Priorität ${n - i}` : ""}">${ico(s)}</span>`;
      }).join("");
    }
    return `<li class="kb-key kb-key--${c.kind}">
      <span class="kb-stack">${stack}</span>
      <kbd class="kb-cap">${esc(keyLabel(c.key))}</kbd>
      <span class="kb-nm"${c.en ? ` title="${esc(c.en)}"` : ""}>${esc(c.title)}</span>
      ${c.note ? `<span class="kb-note">${esc(c.note)}</span>` : ""}
    </li>`;
  }

  function keyboardHtml(cls, M, mode) {
    const g = orderedKeys(M);
    /* Stapelhöhe je Gruppe: so hoch wie die längste Linie darin */
    const rowsOf = (list) => Math.max(1, ...list.map((t) => typeof t[1] === "number" ? M.leiste[t[1]].skills.length : 1));
    const group = (title, list) => list.length ? `<div class="kb-group" style="--rows:${rowsOf(list)}"><p class="kb-glabel">${title}</p><ol class="kb-keys">${list.map((t) => keyHtml(cls, M, t)).join("")}</ol></div>` : "";
    return `<figure class="kb" aria-label="Tastenbelegung ${mode === "pvp" ? "PvP" : "PvE"}">
      ${group("Maus", g.mouse)}${group("Tastatur", g.board)}
      <figcaption>Linien zeigen alle gestapelten Skills; der blau umrandete hat Vorrang (im Spiel liegt er unten), der Füller liegt oben. Die Tasten sind ein Vorschlag – unter Esc → Einstellungen → Tastenbelegung → Schnellslots legst du sie so, wie sie dir liegen.</figcaption>
    </figure>`;
  }

  /* ---------- Bausteine ---------- */
  function lineHtml(cls, M, line, i) {
    const n = line.skills.length;
    const cells = line.skills.map((en, k) => {
      const s = skill(cls, en);
      const prio = n - k;
      return `<li class="sk-cell${prio === 1 ? " is-first" : ""}" title="${esc(s.en)}">${ico(s)}<span class="sk-cell-nm">${esc(s.de)}</span><span class="sk-prio" aria-label="Priorität ${prio}">${prio}</span></li>`;
    }).join("");
    const key = M.tasten.find((t) => t[1] === i);
    return `<figure class="sk-line">
      <figcaption><span class="sk-line-no">${LETTER(i)}</span><span class="sk-line-nm">${esc(line.name)}</span>${key ? `<kbd>${esc(keyLabel(key[0]))}</kbd>` : ""}${line.hand ? `<span class="sk-hand">von Hand</span>` : ""}</figcaption>
      <ol class="sk-stack" aria-label="${esc(line.name)}, von oben nach unten">${cells}</ol>
    </figure>`;
  }

  function stepHtml(cls, M, st) {
    if (typeof st === "number") return `<span class="sk-step sk-step--line"><span class="sk-line-no">${LETTER(st)}</span>${esc(M.leiste[st].name)}</span>`;
    return `<span class="sk-step">${chip(cls, st)}</span>`;
  }

  function barHtml(cls, M, mode) {
    const opener = M.opener.map((en, i) => en === "makro"
      ? `<li class="sk-op sk-op--macro"><span class="sk-no">${i + 1}</span><span>Makro halten</span></li>`
      : `<li class="sk-op"><span class="sk-no">${i + 1}</span>${chip(cls, en)}</li>`).join("");
    const pvp = mode === "pvp";
    return `<section class="sk-sec" id="sk-leiste" aria-labelledby="sk-leiste-h">
      <header class="sk-sec-head"><h3 id="sk-leiste-h">Leiste &amp; Makro · ${pvp ? "PvP" : "PvE"}</h3>
        <p>${pvp
          ? "Im PvP läuft im Makro nur Schaden. Kontrolle, Schutz und Schockaufhebung drückst du selbst – unten in der Druck-Linie liegen Skills, die nur auf kontrollierte Ziele wirken."
          : "So legst du die Skills auf die Tasten. Jede Linie ist ein Leistenplatz mit gestapelten Skills: das Spiel wirkt von unten nach oben den ersten, der bereit ist."}</p></header>
      ${keyboardHtml(cls, M, mode)}
      <div class="sk-actions"><button type="button" class="btn" data-sk="png">Als Bild speichern</button><button type="button" class="btn btn--ghost" data-sk="copy">Als Text kopieren</button><span class="sk-copied" aria-live="polite"></span></div>
      <div class="sk-lines">${M.leiste.map((l, i) => lineHtml(cls, M, l, i)).join("")}</div>
      <div class="sk-macro">
        <div class="sk-block">
          <h4>Makro · ${esc(macroKey(M))}</h4>
          <ol class="sk-chain">${M.makro.map((st) => `<li>${stepHtml(cls, M, st)}</li>`).join("")}</ol>
          <p class="sk-hint">10 ms zwischen den Schritten. Makrotaste halten, dazu den Grundangriff.</p>
        </div>
        <div class="sk-block">
          <h4>Opener</h4>
          <ol class="sk-opener">${opener}</ol>
        </div>
      </div>
      ${M.tipps && M.tipps.length ? `<ul class="sk-tips">${M.tipps.map((t) => `<li>${rich(cls, t)}</li>`).join("")}</ul>` : ""}
    </section>`;
  }

  function cumCost() {
    const cum = [0, 0];
    for (let l = 2; l <= 10; l++) cum[l] = cum[l - 1] + SP.punkte.kosten[l];
    return cum;
  }
  const poolSize = () => SP.punkte.quellen.reduce((a, q) => a + q[1], 0);
  function pveRanked(K) {
    return Object.entries(K.top.skills).map(([en, v]) => ({ en, pick: v[0], avg: v[1] })).sort((a, b) => b.avg - a.avg);
  }

  function pointsHtml(cls, K) {
    const P = SP.punkte;
    const pool = poolSize();
    const cum = cumCost();
    const slots = Math.floor(pool / cum[10]);
    const lvl = K.top.builds.leveling;
    const ranked = pveRanked(K);
    const max = Math.max(16, Math.ceil(ranked.length ? ranked[0].avg : 16));

    const lvlRows = lvl.skills.map(([en, l], i) => {
      const s = skill(cls, en);
      return `<li class="sk-row"><span class="sk-no">${i + 1}</span>${ico(s)}<span class="sk-nm">${esc(s.de)}<small>${TYP[s.typ] || ""}${s.lern ? ` · ab Stufe ${s.lern}` : ""}</small></span><span class="sk-lv${l >= 10 ? " is-max" : ""}">${l}</span></li>`;
    }).join("");

    const rankRows = ranked.map((r, i) => {
      const s = skill(cls, r.en);
      const on = i < slots;
      return `<li class="sk-row${on ? "" : " is-low"}"><span class="sk-no">${i + 1}</span>${ico(s)}<span class="sk-nm">${esc(s.de)}<small>${TYP[s.typ] || ""} · bei ${Math.round(r.pick)} % auf der Leiste</small></span>
        <span class="sk-meter" role="img" aria-label="Durchschnittsstufe ${lv(r.avg)}"><span style="width:${Math.min(100, (r.avg / max) * 100).toFixed(1)}%"></span></span>
        <span class="sk-avg">${lv(r.avg)}</span><span class="sk-tag${on ? " sk-tag--on" : ""}">${on ? "auf 10" : "niedrig"}</span></li>`;
    }).join("");

    return `<section class="sk-sec" id="sk-punkte" aria-labelledby="sk-punkte-h">
      <header class="sk-sec-head"><h3 id="sk-punkte-h">Skillpunkte · PvE</h3><p>${pool} Punkte insgesamt: ${P.quellen.map((q) => `${q[1]} aus ${esc(q[0])}`).join(", ")}. Stufe 2–4 kostet 1 Punkt, 5–7 kostet 2, 8–10 kostet 4 – also ${cum[10]} Punkte bis Stufe 10. Das reicht für <b>${slots} Skills auf 10</b>. Darüber geht es nur mit Daevanion-Knoten (+1 je PvE-Brett), Arkana und Ausrüstung.</p></header>
      <div class="sk-cols">
        <div class="sk-col">
          <h4>Beim Leveln bis 45</h4>
          <p class="sk-hint">Die 203 Punkte aus den Stufen reichen für 9 Skills auf 10. In dieser Reihenfolge, sobald sie frei sind:</p>
          <ol class="sk-list">${lvlRows}</ol>
        </div>
        <div class="sk-col">
          <h4>Auf Stufe 45 – so stehen die Top-Spieler</h4>
          <p class="sk-hint">Balken: Durchschnittsstufe von ${K.top.spieler} Top-Spielern (Stand ${date(K.top.stand)}), samt Daevanion und Ausrüstung. Die ersten ${slots} bekommen die volle Punkte-Stufe 10, der Rest bleibt niedrig. ${esc(name(cls, "Defiance"))} reicht im PvE auf Stufe 1.</p>
          <ol class="sk-list sk-list--rank">${rankRows}</ol>
        </div>
      </div>
      <p class="sk-fine">${esc(P.hinweis)}</p>
    </section>`;
  }

  /* PvP-Skillpunkte: Metabot-PvP-Build (Punkte-Stufen) und Ziel-Stufen von aion2builds, Unterschied zu PvE */
  function pvpPointsHtml(cls, K, V) {
    const pool = poolSize();
    const cum = cumCost();
    const slots = Math.floor(pool / cum[10]);
    const build = K.top.builds.pvp.skills;
    const pveTop = new Set(pveRanked(K).slice(0, slots).map((r) => r.en));
    const extra = build.filter(([en, l]) => l >= 10 && !pveTop.has(en)).map(([en]) => en);
    if (V.ziele.some(([en]) => en === "Defiance") && !extra.includes("Defiance")) extra.push("Defiance");
    const rows = build.map(([en, l], i) => {
      const s = skill(cls, en);
      const neu = extra.includes(en);
      return `<li class="sk-row"><span class="sk-no">${i + 1}</span>${ico(s)}<span class="sk-nm">${esc(s.de)}<small>${TYP[s.typ] || ""}${neu ? " · mehr als im PvE" : ""}</small></span><span class="sk-lv${l >= 10 ? " is-max" : ""}">${l}</span></li>`;
    }).join("");
    const ziele = V.ziele.map(([en, z]) => {
      const s = skill(cls, en);
      return `<li class="sk-row">${ico(s)}<span class="sk-nm">${esc(s.de)}<small>${TYP[s.typ] || ""}</small></span><span class="sk-lv is-max">${z}</span></li>`;
    }).join("");
    return `<section class="sk-sec" id="sk-punkte" aria-labelledby="sk-punkte-h">
      <header class="sk-sec-head"><h3 id="sk-punkte-h">Skillpunkte · PvP</h3><p>Im PvP verschieben sich die Punkte zu Kontrolle und Überleben. Mit ${pool} Punkten passen ${slots} Skills auf 10: zuerst diese Liste, den Rest wie im PvE. Umskillen gibt alle Punkte zurück.</p></header>
      <div class="sk-cols">
        <div class="sk-col">
          <h4>Punkte-Stufen im PvP-Build</h4>
          <p class="sk-hint">PvP-Build von Metabot, gerechnet für 203 Punkte – mit allen ${pool} Punkten kommen weitere Skills auf 10.</p>
          <ol class="sk-list">${rows}</ol>
        </div>
        <div class="sk-col">
          ${extra.length ? `<h4>Mehr als im PvE</h4><p class="sk-diff">${extra.map((en) => chip(cls, en)).join("")}</p>` : ""}
          ${ziele ? `<h4>Ziel-Stufen gesamt</h4><p class="sk-hint">Laut aion2builds, samt Daevanion, Arkana und Ausrüstung.</p><ol class="sk-list sk-list--goal">${ziele}</ol>` : `<h4>Ziel-Stufen gesamt</h4><p class="sk-hint">aion2builds nennt für diese Klasse noch kein festes PvP-Build – die Liste links ist der Stand von Metabot.</p>`}
          <h4>Passive für PvP</h4>
          <p class="sk-diff">${V.passive.map((en) => chip(cls, en)).join("")}</p>
        </div>
      </div>
    </section>`;
  }

  function stigmaHtml(cls, K) {
    const top = K.top;
    const main = top.builds.endgame.stigmen;
    const slotLv = [22, 27, 32, 37];
    const mainSet = new Set(main.map((s) => s[0]));
    const alt = Object.entries(top.stigmen).filter(([en]) => !mainSet.has(en)).slice(0, 3);
    const rows = main.map(([en], i) => {
      const s = skill(cls, en);
      const p = top.stigmen[en] ? top.stigmen[en][0] : null;
      return `<li class="sk-row"><span class="sk-slot">Stufe ${slotLv[i]}</span>${ico(s)}<span class="sk-nm">${esc(s.de)}<small>${p != null ? `${Math.round(p)} % der Top-Spieler` : ""}</small></span>
        <span class="sk-meter sk-meter--pick" role="img" aria-label="${p != null ? Math.round(p) : 0} Prozent"><span style="width:${p != null ? p : 0}%"></span></span></li>`;
    }).join("");
    return `<section class="sk-sec" id="sk-stigmen" aria-labelledby="sk-stigmen-h">
      <header class="sk-sec-head"><h3 id="sk-stigmen-h">Stigmen · PvE</h3><p>Ein Platz kommt mit Stufe 22, 27, 32 und 37 dazu. Das sind die vier Stigmen, die die Top-Spieler in PvE am häufigsten tragen – in der Reihenfolge, in der die Plätze aufgehen.</p></header>
      <ol class="sk-list sk-list--stig">${rows}</ol>
      ${alt.length ? `<dl class="sk-alt"><div><dt>Auch gespielt</dt><dd>${alt.map(([en, v]) => chip(cls, en, `<em>${Math.round(v[0])} %</em>`)).join("")}</dd></div></dl>` : ""}
    </section>`;
  }

  function pvpStigmaHtml(cls, K, V) {
    const keyOf = new Map(V.tasten.filter((t) => typeof t[1] === "string").map((t) => [t[1], t]));
    const rows = V.stigmen.map((en, i) => {
      const s = skill(cls, en);
      const t = keyOf.get(en);
      return `<li class="sk-row"><span class="sk-slot">Slot ${i + 1}</span>${ico(s)}<span class="sk-nm">${esc(s.de)}<small>${t ? `${esc(keyLabel(t[0]))}${t[2] ? " · " + esc(t[2]) : ""}` : ""}</small></span></li>`;
    }).join("");
    const mb = K.top.builds.pvp.stigmen.map((s) => s[0]);
    const same = mb.length === V.stigmen.length && mb.every((x) => V.stigmen.includes(x));
    return `<section class="sk-sec" id="sk-stigmen" aria-labelledby="sk-stigmen-h">
      <header class="sk-sec-head"><h3 id="sk-stigmen-h">Stigmen · PvP</h3><p>Set „${esc(V.stigmenName)}“. Beim Wechsel ins PvP tauschst du die Stigmen mit der Leiste.</p></header>
      <ol class="sk-list sk-list--pvp">${rows}</ol>
      <dl class="sk-alt">
        ${V.stigmenAlt.length ? `<div><dt>Je nach Gegner</dt><dd class="sk-alt-list">${V.stigmenAlt.map(([en, why]) => `<span class="sk-alt-row">${chip(cls, en)}<span class="sk-note">${esc(why)}</span></span>`).join("")}</dd></div>` : ""}
        ${mb.length && !same ? `<div><dt>PvP-Build von Metabot</dt><dd>${mb.map((en) => chip(cls, en)).join("")}</dd></div>` : ""}
      </dl>
    </section>`;
  }

  function flowHtml(cls, P) {
    return `<section class="sk-sec" id="sk-ablauf" aria-labelledby="sk-ablauf-h">
      <header class="sk-sec-head"><h3 id="sk-ablauf-h">Ablauf im Kampf</h3></header>
      <ol class="sk-flow">${P.ablauf.map((t) => `<li><span>${rich(cls, t)}</span></li>`).join("")}</ol>
    </section>`;
  }

  function combosHtml(cls, V) {
    return `<section class="sk-sec" id="sk-ablauf" aria-labelledby="sk-ablauf-h">
      <header class="sk-sec-head"><h3 id="sk-ablauf-h">Kombos im PvP</h3></header>
      <ol class="sk-flow">${V.kombos.map((t) => `<li><span>${rich(cls, t)}</span></li>`).join("")}</ol>
    </section>`;
  }

  function rulesHtml(cls) {
    const R = SP.pvp;
    const c = D.classes.find((x) => x.id === cls) || { de: cls };
    return `<section class="sk-sec" id="sk-regeln" aria-labelledby="sk-regeln-h">
      <header class="sk-sec-head"><h3 id="sk-regeln-h">PvP-Grundregeln</h3><p>Gilt für alle Klassen.</p></header>
      <ol class="sk-setup">${R.regeln.map(([t, x]) => `<li><b>${esc(t)}</b><span>${esc(x)}</span></li>`).join("")}</ol>
      ${window.DK_DV ? `<p><button type="button" class="btn btn--ghost" data-sk="azphel">Azphel-Brett für ${esc(c.de)} ansehen</button></p>` : ""}
      <p class="sk-fine">${esc(R.hinweis)}</p>
    </section>`;
  }

  function setupHtml() {
    const M = SP.makro;
    return `<section class="sk-sec" id="sk-setup" aria-labelledby="sk-setup-h">
      <header class="sk-sec-head"><h3 id="sk-setup-h">Makro einrichten</h3><p>Für alle Klassen und beide Modi gleich.</p></header>
      <ol class="sk-setup">${M.schritte.map(([t, x]) => `<li><b>${esc(t)}</b><span>${esc(x)}</span></li>`).join("")}</ol>
      <p class="sk-out">${esc(M.raus)}</p>
      <p class="sk-rule">${esc(M.regel)}</p>
    </section>`;
  }

  function copyText(cls, mode) {
    mode = mode || view.mode;
    const c = D.classes.find((x) => x.id === cls) || { de: cls };
    const M = plan(cls, mode);
    const lines = [`${c.de} – Leiste & Makro ${mode === "pvp" ? "PvP" : "PvE"} (Daeva-Kompass)`];
    const g = orderedKeys(M);
    lines.push("Tasten:");
    g.mouse.concat(g.board).forEach((t) => {
      const k = keyContent(cls, M, t);
      const what = k.kind === "makro" ? `Makro (${k.note})` : k.kind === "line" ? `${k.title}: ${k.skills.map((s) => s.de).join(", ")} (unten Vorrang)` : k.title;
      lines.push(`  ${keyLabel(t[0])}: ${what}${k.kind !== "makro" && k.note ? ` – ${k.note}` : ""}`);
    });
    lines.push(`Makro (10 ms): ${M.makro.map((st) => stepText(cls, M, st)).join(" → ")}`);
    lines.push(`Opener: ${M.opener.map((en) => en === "makro" ? "Makro halten" : name(cls, en)).join(" → ")}`);
    if (mode === "pvp") {
      lines.push(`Stigmen (${M.stigmenName}): ${M.stigmen.map((en) => name(cls, en)).join(", ")}`);
      M.kombos.forEach((t) => lines.push("• " + plain(cls, t)));
    }
    (M.tipps || []).forEach((t) => lines.push("• " + plain(cls, t)));
    return lines.join("\n");
  }

  /* ---------- Bild speichern (Canvas) ---------- */
  function iconBase() {
    const C = window.DK_CONFIG || {};
    const api = String(C.apiBase || "").replace(/\/+$/, "");
    if (api) return api;
    if (location.protocol === "file:") return String(C.liveUrl || "").replace(/\/+$/, "");
    return "";
  }
  function loadIcon(icon) {
    return new Promise((resolve) => {
      if (!icon) { resolve(null); return; }
      const im = new Image();
      const t = setTimeout(() => resolve(null), 10000);
      im.crossOrigin = "anonymous";
      im.onload = () => { clearTimeout(t); resolve(im); };
      im.onerror = () => { clearTimeout(t); resolve(null); };
      im.src = `${iconBase()}/api/icon?n=${encodeURIComponent(icon)}`;
    });
  }
  function wrap(ctx, text, width, maxLines) {
    const words = String(text).split(/\s+/);
    const out = [];
    let cur = "";
    for (const w of words) {
      const t = cur ? cur + " " + w : w;
      if (ctx.measureText(t).width <= width || !cur) cur = t;
      else { out.push(cur); cur = w; }
    }
    if (cur) out.push(cur);
    if (out.length > maxLines) {
      const keep = out.slice(0, maxLines);
      let last = keep[maxLines - 1];
      while (last.length > 1 && ctx.measureText(last + "…").width > width) last = last.slice(0, -1);
      keep[maxLines - 1] = last + "…";
      return keep;
    }
    return out;
  }
  function roundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    ctx.moveTo(x + r, y);
    ctx.arcTo(x + w, y, x + w, y + h, r);
    ctx.arcTo(x + w, y + h, x, y + h, r);
    ctx.arcTo(x, y + h, x, y, r);
    ctx.arcTo(x, y, x + w, y, r);
    ctx.closePath();
  }

  async function savePng(cls, mode) {
    const c = D.classes.find((x) => x.id === cls) || { de: cls };
    const M = plan(cls, mode);
    const g = orderedKeys(M);
    const keys = g.mouse.concat(g.board).map((t) => keyContent(cls, M, t));
    const rows = Math.max(1, ...M.leiste.map((l) => l.skills.length));
    const icons = new Map();
    await Promise.all([...new Set(keys.flatMap((k) => k.skills.map((s) => s.icon)))].map((n) => loadIcon(n).then((im) => icons.set(n, im))));
    try { if (document.fonts) await Promise.all([document.fonts.load("700 16px Archivo"), document.fonts.load("400 12px Archivo")]); } catch (e) { /* Ersatzschrift */ }
    const F = "Archivo, 'Segoe UI', Arial, sans-serif";
    const COL = { bg: "#0e1014", card: "#14171c", line: "#2a303a", text: "#eceef2", muted: "#8f97a3", accent: "#4fc3f7", gold: "#e2b866", cap: "#1d2229" };
    const pad = 28, colW = 112, gapG = 28, icon = 46, step = icon + 6, head = 100;
    const stackH = rows * step;
    const nameH = 34, noteH = 30;
    const linesH = 24 + M.leiste.length * 22;
    const W = pad * 2 + keys.length * colW + (g.mouse.length && g.board.length ? gapG : 0);
    const H = head + 22 + stackH + 34 + nameH + noteH + 24 + linesH + 40;
    const scale = 2;
    const cv = document.createElement("canvas");
    cv.width = W * scale; cv.height = H * scale;
    const ctx = cv.getContext("2d");
    ctx.scale(scale, scale);
    ctx.fillStyle = COL.bg; roundRect(ctx, 0, 0, W, H, 16); ctx.fill();
    ctx.fillStyle = COL.text; ctx.font = `700 26px ${F}`; ctx.textBaseline = "alphabetic";
    ctx.fillText(`${c.de} · Leiste & Makro · ${mode === "pvp" ? "PvP" : "PvE"}`, pad, 44);
    ctx.fillStyle = COL.muted; ctx.font = `400 14px ${F}`;
    ctx.fillText(`Makro auf ${macroKey(M)} (10 ms): ${M.makro.map((st) => stepText(cls, M, st)).join(" → ")}`, pad, 70);
    ctx.fillText(wrap(ctx, `Opener: ${M.opener.map((en) => en === "makro" ? "Makro halten" : name(cls, en)).join(" → ")}`, W - pad * 2, 1)[0], pad, 90);

    let x = pad;
    const top = head + 22;
    const drawGroup = (label, list) => {
      if (!list.length) return;
      ctx.fillStyle = COL.muted; ctx.font = `600 11px ${F}`;
      ctx.fillText(label.toUpperCase(), x + 4, top - 8);
      for (const k of list) {
        const cx = x + colW / 2;
        // Stapel unten bündig
        const n = k.skills.length;
        if (k.kind === "makro") {
          const y = top + stackH - icon;
          ctx.fillStyle = COL.card; roundRect(ctx, cx - icon / 2, y, icon, icon, 9); ctx.fill();
          ctx.strokeStyle = COL.accent; ctx.lineWidth = 2; roundRect(ctx, cx - icon / 2, y, icon, icon, 9); ctx.stroke();
          ctx.fillStyle = COL.accent; ctx.font = `800 22px ${F}`; ctx.textAlign = "center"; ctx.fillText("M", cx, y + icon / 2 + 8); ctx.textAlign = "left";
        }
        k.skills.forEach((s, i) => {
          const y = top + stackH - (n - i) * step + 6;
          const im = icons.get(s.icon);
          ctx.save(); roundRect(ctx, cx - icon / 2, y, icon, icon, 8); ctx.clip();
          if (im) ctx.drawImage(im, cx - icon / 2, y, icon, icon);
          else { ctx.fillStyle = COL.card; ctx.fillRect(cx - icon / 2, y, icon, icon); ctx.fillStyle = COL.muted; ctx.font = `700 14px ${F}`; ctx.textAlign = "center"; ctx.fillText(s.de.slice(0, 2), cx, y + icon / 2 + 5); ctx.textAlign = "left"; }
          ctx.restore();
          const first = k.kind === "line" && i === n - 1 && n > 1;
          ctx.strokeStyle = first ? COL.accent : (s.typ === "s" ? COL.gold : COL.line); ctx.lineWidth = first ? 2.5 : 1.2;
          roundRect(ctx, cx - icon / 2, y, icon, icon, 8); ctx.stroke();
        });
        // Taste
        const capY = top + stackH + 8;
        ctx.font = `700 13px ${F}`;
        const label = keyLabel(k.key);
        const cw = Math.max(34, ctx.measureText(label).width + 18);
        ctx.fillStyle = COL.cap; roundRect(ctx, cx - cw / 2, capY, cw, 24, 6); ctx.fill();
        ctx.strokeStyle = COL.line; ctx.lineWidth = 1; roundRect(ctx, cx - cw / 2, capY, cw, 24, 6); ctx.stroke();
        ctx.fillStyle = COL.text; ctx.textAlign = "center"; ctx.fillText(label, cx, capY + 17);
        // Name und Hinweis
        ctx.font = `600 12px ${F}`; ctx.fillStyle = COL.text;
        wrap(ctx, k.title, colW - 10, 2).forEach((l, i) => ctx.fillText(l, cx, capY + 42 + i * 15));
        ctx.font = `400 11px ${F}`; ctx.fillStyle = COL.muted;
        wrap(ctx, k.note || "", colW - 10, 2).forEach((l, i) => ctx.fillText(l, cx, capY + 42 + nameH + i * 13));
        ctx.textAlign = "left";
        x += colW;
      }
    };
    drawGroup("Maus", keys.filter((k) => MOUSE.includes(k.key)));
    if (g.mouse.length && g.board.length) x += gapG;
    drawGroup("Tastatur", keys.filter((k) => BOARD.includes(k.key)));

    // Linien ausgeschrieben
    let y = top + stackH + 34 + nameH + noteH + 30;
    ctx.fillStyle = COL.muted; ctx.font = `600 11px ${F}`;
    ctx.fillText("LINIEN (OBEN → UNTEN, UNTEN HAT VORRANG)", pad, y);
    ctx.font = `400 13px ${F}`;
    M.leiste.forEach((l, i) => {
      y += 22;
      const key = M.tasten.find((t) => t[1] === i);
      ctx.fillStyle = COL.accent; ctx.fillText(LETTER(i), pad, y);
      ctx.fillStyle = COL.text;
      ctx.fillText(`${l.name}${key ? ` [${keyLabel(key[0])}]` : ""}${l.hand ? " · von Hand" : ""}: ${l.skills.map((en) => name(cls, en)).join(" › ")}`, pad + 18, y);
    });
    ctx.fillStyle = COL.muted; ctx.font = `400 11px ${F}`;
    ctx.fillText("Daeva-Kompass · aion2.philipmax-hain.workers.dev · Vorschlag, im Spiel an der Trainingspuppe prüfen", pad, H - 16);

    const blob = await new Promise((resolve) => cv.toBlob(resolve, "image/png"));
    if (!blob) throw new Error("kein Bild");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `leiste-${cls}-${mode}.png`;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => { URL.revokeObjectURL(a.href); a.remove(); }, 1000);
    return { missing: [...icons.values()].filter((v) => !v).length };
  }

  /* ---------- Schadenstest mit der Kampfanalyse des Spiels ----------
   * Ergebnisse je Klasse und Modus im Browser (dk.dps), neueste zuerst. Der Timer gibt die Testdauer vor. */
  const DPS_KEY = "dk.dps";
  const timer = { dauer: 60, phase: "idle", end: 0, iv: null };
  function dpsAll() { try { return JSON.parse(localStorage.getItem(DPS_KEY) || "{}") || {}; } catch (e) { return {}; } }
  function dpsSave(all) { try { localStorage.setItem(DPS_KEY, JSON.stringify(all)); } catch (e) { /* Speicher gesperrt */ } }
  const dpsList = (cls, mode) => dpsAll()[cls + ":" + mode] || [];
  const fmtNum = (n) => Math.round(n).toLocaleString("de-DE");

  function beep(freq, ms) {
    try {
      const C = window.AudioContext || window.webkitAudioContext;
      if (!C) return;
      const ctx = beep.ctx || (beep.ctx = new C());
      const o = ctx.createOscillator(), g = ctx.createGain();
      o.frequency.value = freq; g.gain.value = 0.08;
      o.connect(g); g.connect(ctx.destination);
      o.start(); o.stop(ctx.currentTime + ms / 1000);
    } catch (e) { /* ohne Ton */ }
  }
  function clockText() {
    if (timer.phase === "idle") return `${Math.floor(timer.dauer / 60)}:${String(timer.dauer % 60).padStart(2, "0")}`;
    if (timer.phase === "end") return "Fertig";
    const left = Math.max(0, Math.ceil((timer.end - Date.now()) / 1000));
    return timer.phase === "count" ? String(left) : `${Math.floor(left / 60)}:${String(left % 60).padStart(2, "0")}`;
  }
  function paintClock() {
    const c = document.getElementById("sk-clock");
    if (c) { c.textContent = clockText(); c.className = "dk-clock" + (timer.phase === "run" || timer.phase === "count" ? " is-run" : timer.phase === "end" ? " is-end" : ""); }
    const b = document.querySelector('#sk-app [data-sk="dps-start"]');
    if (b) b.textContent = timer.phase === "run" || timer.phase === "count" ? "Abbrechen" : "Test starten";
  }
  function tickTimer() {
    if (timer.phase === "count" && Date.now() >= timer.end) {
      timer.phase = "run"; timer.end = Date.now() + timer.dauer * 1000; beep(880, 180);
    } else if (timer.phase === "count") {
      const left = Math.ceil((timer.end - Date.now()) / 1000);
      if (left !== tickTimer.last) { tickTimer.last = left; beep(440, 90); }
    } else if (timer.phase === "run" && Date.now() >= timer.end) {
      timer.phase = "end"; clearInterval(timer.iv); timer.iv = null; beep(660, 220); setTimeout(() => beep(990, 260), 260);
      const inp = document.getElementById("sk-dps-val"); if (inp) inp.focus();
    }
    paintClock();
  }
  function startTimer() {
    if (timer.phase === "run" || timer.phase === "count") { timer.phase = "idle"; clearInterval(timer.iv); timer.iv = null; paintClock(); return; }
    timer.phase = "count"; timer.end = Date.now() + 3000; tickTimer.last = null;
    clearInterval(timer.iv); timer.iv = setInterval(tickTimer, 200); tickTimer();
  }

  function testHtml(cls, mode) {
    const KA = D.kampfanalyse;
    if (!KA) return "";
    const list = dpsList(cls, mode);
    const best = list.reduce((m, r) => Math.max(m, r.dps), 0);
    const rows = list.map((r, i) => {
      const diff = best ? (r.dps / best - 1) * 100 : 0;
      return `<li class="dps-row${r.dps === best ? " is-best" : ""}"><span>${esc(r.name)}<small>${esc(r.datum)} · ${r.dauer} s</small></span>
        <span class="sk-meter"><span style="width:${best ? Math.round((r.dps / best) * 100) : 0}%"></span></span>
        <span><b>${fmtNum(r.dps)}</b> DPS <span class="dps-diff">${r.dps === best ? "beste" : "−" + Math.abs(diff).toFixed(1).replace(".", ",") + " %"}</span></span>
        <button type="button" class="link-btn" data-sk="dps-del" data-i="${i}" aria-label="Eintrag ${esc(r.name)} löschen">löschen</button></li>`;
    }).join("");
    const variant = `${mode === "pvp" ? "PvP" : "PvE"}-Makro${list.length ? " " + (list.length + 1) : ""}`;
    return `<section class="sk-sec" id="sk-test" aria-labelledby="sk-test-h">
      <header class="sk-sec-head"><h3 id="sk-test-h">Schadenstest · Kampfanalyse</h3>
        <p>AION 2 misst deinen Schaden selbst: <b>${esc(KA.taste)}</b> öffnet die Kampfanalyse mit ${esc(KA.zeigt.join(", "))}. So findest du heraus, welche Leiste und welches Makro bei dir wirklich mehr Schaden machen.</p></header>
      <div class="sk-cols">
        <div class="sk-col">
          <h4>So testest du</h4>
          <ol class="dk-steps">${KA.test.map((t) => `<li>${esc(t)}</li>`).join("")}</ol>
          <p class="sk-hint">${esc(KA.grenzen)}</p>
        </div>
        <div class="sk-col">
          <h4>Timer</h4>
          <div class="dk-timer">
            <span id="sk-clock" class="dk-clock">${clockText()}</span>
            <div class="seg seg--sm" role="group" aria-label="Testdauer">${KA.dauer.map((d) => `<button type="button" class="seg-btn${timer.dauer === d ? " is-on" : ""}" aria-pressed="${timer.dauer === d}" data-sk="dps-dauer" data-id="${d}">${d / 60} min</button>`).join("")}</div>
            <button type="button" class="btn" data-sk="dps-start">${timer.phase === "run" || timer.phase === "count" ? "Abbrechen" : "Test starten"}</button>
          </div>
          <p class="sk-hint">3 Sekunden Vorlauf mit Ton, dann läuft die Zeit; am Ende ein Doppelton. In der Desktop-App kannst du das Fenster dafür über das Spiel legen.</p>
          <form class="dps-form" id="sk-dps-form" autocomplete="off">
            <label class="field dps-name"><span>Variante</span><input type="text" id="sk-dps-name" maxlength="40" value="${esc(variant)}"></label>
            <label class="field"><span>DPS laut Kampfanalyse</span><input type="number" id="sk-dps-val" inputmode="numeric" min="1" step="1" required></label>
            <button type="submit" class="btn btn--ghost">Eintragen</button>
          </form>
        </div>
      </div>
      ${rows ? `<ul class="dps-list">${rows}</ul><p class="sk-hint">Unterschiede unter etwa 3 % sind meist Zufall (Krits). Gespeichert nur in diesem Browser. <button type="button" class="link-btn" data-sk="dps-clear">Alle löschen</button></p>` : `<p class="sk-hint">Noch keine Ergebnisse für ${mode === "pvp" ? "PvP" : "PvE"}.</p>`}
    </section>`;
  }

  /* ---------- Ansicht ---------- */
  function render() {
    const host = document.getElementById("sk-app");
    if (!host) return;
    if (!view.cls) view.cls = (window.DK_APP && window.DK_APP.status().cls) || "spiritmaster";
    const cls = view.cls;
    const mode = view.mode;
    const pvp = mode === "pvp";
    const c = D.classes.find((x) => x.id === cls) || { id: cls, name: cls, de: cls };
    const K = SK.klassen[cls];
    const P = SP.klassen[cls];
    const M = plan(cls, mode);
    const qKey = M.tasten.find((t) => t[0] === "Q");

    let h = `<div class="cls-tabs" role="tablist" aria-label="Klasse">` + D.classes.map((x) =>
      `<button type="button" role="tab" class="cls-tab${x.id === cls ? " is-on" : ""}" aria-selected="${x.id === cls}" data-sk="cls" data-id="${x.id}">
        <img class="cls-tab-ico" src="${esc(clsIcon(x.id))}" alt="" loading="lazy" decoding="async"><span class="cls-tab-name">${esc(x.de)}</span></button>`).join("") + `</div>`;

    h += `<header class="sk-head">
      <img class="sk-emblem" src="${esc(clsIcon(cls))}" alt="" width="64" height="64" decoding="async">
      <div class="sk-head-text">
        <h2>${esc(c.de)} <span>${esc(c.role || "")}</span></h2>
        <p>${rich(cls, M.kurz)}</p>
      </div>
      <dl class="sk-facts">
        ${pvp
          ? `<div><dt>Wichtigste Kontrolle</dt><dd>${qKey && typeof qKey[1] === "string" ? chip(cls, qKey[1]) : "–"}</dd></div>
             <div><dt>Linien im Makro</dt><dd><b>${M.makro.filter((x) => typeof x === "number").length}</b> von ${M.leiste.length}</dd></div>
             <div><dt>Stigmen-Set</dt><dd><b>${esc(M.stigmenName)}</b></dd></div>`
          : `<div><dt>Zuerst leveln</dt><dd>${chip(cls, P.zuerst)}</dd></div>
             <div><dt>Linien im Makro</dt><dd><b>${P.makro.filter((x) => typeof x === "number").length}</b> von ${P.leiste.length}</dd></div>
             <div><dt>Top-Spieler</dt><dd><b>${K.top.spieler}</b> · ${date(K.top.stand)}</dd></div>`}
      </dl>
    </header>
    <div class="sk-mode" role="tablist" aria-label="Modus">
      <button type="button" role="tab" class="sk-mode-btn${pvp ? "" : " is-on"}" aria-selected="${!pvp}" data-sk="mode" data-id="pve">PvE<small>Dungeons, Bosse, Farmen</small></button>
      <button type="button" role="tab" class="sk-mode-btn${pvp ? " is-on" : ""}" aria-selected="${pvp}" data-sk="mode" data-id="pvp">PvP<small>Abyss, Arena, Duell</small></button>
    </div>
    <nav class="sk-jump" aria-label="Abschnitte"><a href="#sk-leiste" data-sk="jump">Leiste &amp; Makro</a><a href="#sk-test" data-sk="jump">Schadenstest</a><a href="#sk-punkte" data-sk="jump">Skillpunkte</a><a href="#sk-stigmen" data-sk="jump">Stigmen</a><a href="#sk-ablauf" data-sk="jump">${pvp ? "Kombos" : "Ablauf"}</a>${pvp ? `<a href="#sk-regeln" data-sk="jump">PvP-Regeln</a>` : ""}<a href="#sk-setup" data-sk="jump">Einrichten</a></nav>`;

    h += barHtml(cls, M, mode);
    h += testHtml(cls, mode);
    if (pvp) h += pvpPointsHtml(cls, K, M) + `<div class="sk-two">${pvpStigmaHtml(cls, K, M)}${combosHtml(cls, M)}</div>` + rulesHtml(cls);
    else h += pointsHtml(cls, K) + `<div class="sk-two">${stigmaHtml(cls, K)}${flowHtml(cls, P)}</div>`;
    h += setupHtml();
    h += pvp
      ? `<p class="fine">PvP-Stigmen, Ziel-Stufen und Hinweise: aion2builds.org (Stand 9.10.2026) und der PvP-Build von metabot.gg. Kombos aus den PvP-Rotationen von Metabot und den Skill-Tooltips. Tasten, Linien und Makro im PvP: Vorschlag der Seite – für Global gibt es noch kein festes PvP-Meta.</p>`
      : `<p class="fine">Linien, Makro-Schritte und Opener: aion2builds.org (Stand 9.10.2026). Kern-Skills und Ablauf: metabot.gg. Stufen und Stigmen der Top-Spieler: metabot.gg, ${K.top.spieler} Charaktere auf Stufe 45 mit der höchsten Kampfkraft je Region. Punkte: allthings.how. Tastenbelegung: Vorschlag der Seite. Namen und Symbole aus dem deutschen Client – im Zweifel an der Trainingspuppe testen.</p>`;
    host.innerHTML = h;
  }

  function onClick(e) {
    const b = e.target.closest("#sk-app [data-sk]");
    if (!b) return;
    const act = b.getAttribute("data-sk");
    if (act === "cls") { view.cls = b.getAttribute("data-id"); render(); updateUrl(); }
    else if (act === "mode") { view.mode = b.getAttribute("data-id") === "pvp" ? "pvp" : "pve"; render(); updateUrl(); }
    else if (act === "jump") {
      e.preventDefault();
      const t = document.getElementById(b.getAttribute("href").slice(1));
      if (t) t.scrollIntoView({ behavior: "smooth", block: "start" });
    } else if (act === "azphel") {
      if (window.DK_DV) window.DK_DV.show(view.cls, 4);
    } else if (act === "png") {
      const out = document.querySelector("#sk-app .sk-copied");
      b.disabled = true;
      savePng(view.cls, view.mode).then((r) => {
        if (out) out.textContent = r.missing ? `Bild gespeichert (${r.missing} Symbole fehlten – ohne Verbindung zum Server).` : "Bild gespeichert.";
      }, () => { if (out) out.textContent = "Speichern nicht möglich."; }).then(() => { b.disabled = false; });
    } else if (act === "dps-dauer") {
      if (timer.phase === "run" || timer.phase === "count") return;
      timer.dauer = +b.getAttribute("data-id"); timer.phase = "idle"; render();
    } else if (act === "dps-start") {
      startTimer();
    } else if (act === "dps-del" || act === "dps-clear") {
      const all = dpsAll(), key = view.cls + ":" + view.mode;
      if (act === "dps-clear") { if (!window.confirm("Alle Ergebnisse dieser Klasse löschen?")) return; delete all[key]; }
      else (all[key] || []).splice(+b.getAttribute("data-i"), 1);
      dpsSave(all); render();
    } else if (act === "copy") {
      const out = document.querySelector("#sk-app .sk-copied");
      const text = copyText(view.cls, view.mode);
      const done = () => { if (out) out.textContent = "Kopiert."; };
      const fail = () => { if (out) out.textContent = "Kopieren nicht möglich – Text markieren und kopieren."; };
      try {
        const p = navigator.clipboard && navigator.clipboard.writeText(text);
        if (p && p.then) p.then(done, fail); else fail();
      } catch (err) { fail(); }
    }
  }

  window.DK_SK = {
    show(cls, mode) {
      if (cls && SK.klassen[cls]) view.cls = cls;
      if (mode === "pvp" || mode === "pve") view.mode = mode;
      render();
      if (window.DK_APP) window.DK_APP.go("skills");
      updateUrl();
    },
    copyText,
    savePng,
  };

  function onSubmit(e) {
    if (!e.target || e.target.id !== "sk-dps-form") return;
    e.preventDefault();
    const val = +document.getElementById("sk-dps-val").value;
    if (!(val > 0)) return;
    const name = document.getElementById("sk-dps-name").value.trim() || "Test";
    const all = dpsAll(), key = view.cls + ":" + view.mode;
    all[key] = [{ name, dps: Math.round(val), dauer: timer.dauer, datum: new Date().toLocaleDateString("de-DE") }].concat(all[key] || []).slice(0, 30);
    dpsSave(all);
    if (timer.phase === "end") timer.phase = "idle";
    render();
    const t = document.getElementById("sk-test");
    if (t) t.scrollIntoView({ block: "nearest" });
  }

  function init() {
    readUrl();
    render();
    document.addEventListener("click", onClick);
    document.addEventListener("submit", onSubmit);
    window.addEventListener("hashchange", () => { if (location.hash === "#skills") updateUrl(); });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
