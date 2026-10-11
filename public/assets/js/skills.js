/*
 * Ansicht „Skills“: je Klasse die Skillpunkte-Reihenfolge, Stigmen, Leiste mit gestapelten Linien, Makro, Opener und Ablauf.
 * Daten: DK_DATA.skills (data-skills.js, erzeugt: Namen, Symbole, Stufen der Top-Spieler)
 * und DK_DATA.skillPlan (data.js, kuratiert: Linien, Makro, Texte). [[English Name]] in Texten wird zum deutschen Namen.
 * Link: ?klasse=<id>#skills
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

  const view = { cls: null };

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

  function readUrl() {
    const k = new URLSearchParams(location.search).get("klasse");
    if (k && SK.klassen[k]) view.cls = k;
  }
  function updateUrl() {
    if (!/^https?:$/.test(location.protocol) || location.hash !== "#skills") return;
    try { history.replaceState(null, "", `?klasse=${view.cls}#skills`); } catch (e) { /* egal */ }
  }

  /* ---------- Bausteine ---------- */
  function pointsHtml(cls, K) {
    const P = SP.punkte;
    const pool = P.quellen.reduce((a, q) => a + q[1], 0);
    const cum = [0, 0];
    for (let l = 2; l <= 10; l++) cum[l] = cum[l - 1] + P.kosten[l];
    const slots = Math.floor(pool / cum[10]);
    const lvl = K.top.builds.leveling;
    const ranked = Object.entries(K.top.skills).map(([en, v]) => ({ en, pick: v[0], avg: v[1] })).sort((a, b) => b.avg - a.avg);
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
      <header class="sk-sec-head"><h3 id="sk-punkte-h">Skillpunkte</h3><p>${pool} Punkte insgesamt: ${P.quellen.map((q) => `${q[1]} aus ${esc(q[0])}`).join(", ")}. Stufe 2–4 kostet 1 Punkt, 5–7 kostet 2, 8–10 kostet 4 – also ${cum[10]} Punkte bis Stufe 10. Das reicht für <b>${slots} Skills auf 10</b>. Darüber geht es nur mit Daevanion-Knoten (+1 je PvE-Brett), Arkana und Ausrüstung.</p></header>
      <div class="sk-cols">
        <div class="sk-col">
          <h4>Beim Leveln bis 45</h4>
          <p class="sk-hint">Die 203 Punkte aus den Stufen reichen für 9 Skills auf 10. In dieser Reihenfolge, sobald sie frei sind:</p>
          <ol class="sk-list">${lvlRows}</ol>
        </div>
        <div class="sk-col">
          <h4>Auf Stufe 45 – so stehen die Top-Spieler</h4>
          <p class="sk-hint">Balken: Durchschnittsstufe von ${K.top.spieler} Top-Spielern (Stand ${date(K.top.stand)}), samt Daevanion und Ausrüstung. Die ersten ${slots} bekommen die volle Punkte-Stufe 10, der Rest bleibt niedrig. ${esc(name(cls, "Defiance"))} reicht auf Stufe 1.</p>
          <ol class="sk-list sk-list--rank">${rankRows}</ol>
        </div>
      </div>
      <p class="sk-fine">${esc(P.hinweis)}</p>
    </section>`;
  }

  function stigmaHtml(cls, K) {
    const top = K.top;
    const main = top.builds.endgame.stigmen;
    const slotLv = [22, 27, 32, 37];
    const mainSet = new Set(main.map((s) => s[0]));
    const alt = Object.entries(top.stigmen).filter(([en]) => !mainSet.has(en)).slice(0, 3);
    const pvp = top.builds.pvp.stigmen;
    const rows = main.map(([en], i) => {
      const s = skill(cls, en);
      const p = top.stigmen[en] ? top.stigmen[en][0] : null;
      return `<li class="sk-row"><span class="sk-slot">Stufe ${slotLv[i]}</span>${ico(s)}<span class="sk-nm">${esc(s.de)}<small>${p != null ? `${Math.round(p)} % der Top-Spieler` : ""}</small></span>
        <span class="sk-meter sk-meter--pick" role="img" aria-label="${p != null ? Math.round(p) : 0} Prozent"><span style="width:${p != null ? p : 0}%"></span></span></li>`;
    }).join("");
    return `<section class="sk-sec" id="sk-stigmen" aria-labelledby="sk-stigmen-h">
      <header class="sk-sec-head"><h3 id="sk-stigmen-h">Stigmen</h3><p>Ein Platz kommt mit Stufe 22, 27, 32 und 37 dazu. Das sind die vier Stigmen, die die Top-Spieler in PvE am häufigsten tragen – in der Reihenfolge, in der die Plätze aufgehen.</p></header>
      <ol class="sk-list sk-list--stig">${rows}</ol>
      <dl class="sk-alt">
        ${alt.length ? `<div><dt>Auch gespielt</dt><dd>${alt.map(([en, v]) => chip(cls, en, `<em>${Math.round(v[0])} %</em>`)).join("")}</dd></div>` : ""}
        ${pvp.length ? `<div><dt>PvP</dt><dd>${pvp.map(([en]) => chip(cls, en)).join("")}</dd></div>` : ""}
      </dl>
    </section>`;
  }

  function lineHtml(cls, line, i) {
    const n = line.skills.length;
    const cells = line.skills.map((en, k) => {
      const s = skill(cls, en);
      const prio = n - k;
      return `<li class="sk-cell${prio === 1 ? " is-first" : ""}" title="${esc(s.en)}">${ico(s)}<span class="sk-cell-nm">${esc(s.de)}</span><span class="sk-prio" aria-label="Priorität ${prio}">${prio}</span></li>`;
    }).join("");
    return `<figure class="sk-line">
      <figcaption><span class="sk-line-no">${String.fromCharCode(65 + i)}</span><span class="sk-line-nm">${esc(line.name)}</span>${line.taste ? `<kbd>${esc(line.taste)}</kbd>` : ""}${line.hand ? `<span class="sk-hand">von Hand</span>` : ""}</figcaption>
      <ol class="sk-stack" aria-label="${esc(line.name)}, von oben nach unten">${cells}</ol>
    </figure>`;
  }

  function stepLabel(cls, P, st) {
    if (typeof st === "number") return { html: `<span class="sk-step sk-step--line"><span class="sk-line-no">${String.fromCharCode(65 + st)}</span>${esc(P.leiste[st].name)}</span>`, text: P.leiste[st].name };
    return { html: `<span class="sk-step">${chip(cls, st)}</span>`, text: name(cls, st) };
  }

  function barHtml(cls, P) {
    const steps = P.makro.map((st) => stepLabel(cls, P, st));
    const opener = P.opener.map((en, i) => en === "makro"
      ? `<li class="sk-op sk-op--macro"><span class="sk-no">${i + 1}</span><span>Makro halten</span></li>`
      : `<li class="sk-op"><span class="sk-no">${i + 1}</span>${chip(cls, en)}</li>`).join("");
    return `<section class="sk-sec" id="sk-leiste" aria-labelledby="sk-leiste-h">
      <header class="sk-sec-head"><h3 id="sk-leiste-h">Leiste &amp; Makro</h3><p>Jede Linie ist ein Leistenplatz mit gestapelten Skills. Das Spiel wirkt von unten nach oben den ersten Skill, der bereit ist: unten steht der wichtigste (1), oben der Füller.</p></header>
      <div class="sk-lines">${P.leiste.map((l, i) => lineHtml(cls, l, i)).join("")}</div>
      <div class="sk-macro">
        <div class="sk-block">
          <h4>Makro</h4>
          <ol class="sk-chain">${steps.map((s) => `<li>${s.html}</li>`).join("")}</ol>
          <p class="sk-hint">${P.makroTaste ? `Auf <kbd>${esc(P.makroTaste)}</kbd> legen. ` : ""}10 ms zwischen den Schritten. Makrotaste halten, dazu Grundangriff.</p>
        </div>
        <div class="sk-block">
          <h4>Eigene Tasten</h4>
          <ul class="sk-keys">${P.eigene.map(([en, note]) => `<li>${chip(cls, en)}${note ? `<span class="sk-note">${esc(note)}</span>` : ""}</li>`).join("")}</ul>
        </div>
        <div class="sk-block sk-block--wide">
          <h4>Opener</h4>
          <ol class="sk-opener">${opener}</ol>
        </div>
      </div>
      ${P.tipps && P.tipps.length ? `<ul class="sk-tips">${P.tipps.map((t) => `<li>${rich(cls, t)}</li>`).join("")}</ul>` : ""}
      <div class="sk-actions"><button type="button" class="btn btn--ghost" data-sk="copy">Als Text kopieren</button><span class="sk-copied" aria-live="polite"></span></div>
    </section>`;
  }

  function flowHtml(cls, P) {
    return `<section class="sk-sec" id="sk-ablauf" aria-labelledby="sk-ablauf-h">
      <header class="sk-sec-head"><h3 id="sk-ablauf-h">Ablauf im Kampf</h3></header>
      <ol class="sk-flow">${P.ablauf.map((t) => `<li><span>${rich(cls, t)}</span></li>`).join("")}</ol>
    </section>`;
  }

  function setupHtml() {
    const M = SP.makro;
    return `<section class="sk-sec" id="sk-setup" aria-labelledby="sk-setup-h">
      <header class="sk-sec-head"><h3 id="sk-setup-h">Makro einrichten</h3><p>Für alle Klassen gleich.</p></header>
      <ol class="sk-setup">${M.schritte.map(([t, x]) => `<li><b>${esc(t)}</b><span>${esc(x)}</span></li>`).join("")}</ol>
      <p class="sk-out">${esc(M.raus)}</p>
      <p class="sk-rule">${esc(M.regel)}</p>
    </section>`;
  }

  function copyText(cls) {
    const c = D.classes.find((x) => x.id === cls) || { de: cls };
    const P = SP.klassen[cls];
    const lines = [`${c.de} – Leiste & Makro (Daeva-Kompass)`];
    P.leiste.forEach((l, i) => lines.push(`${String.fromCharCode(65 + i)} ${l.name}${l.taste ? ` [${l.taste}]` : ""}${l.hand ? " (von Hand)" : ""}, oben → unten: ${l.skills.map((en) => name(cls, en)).join(", ")}`));
    lines.push(`Makro (10 ms): ${P.makro.map((st) => typeof st === "number" ? String.fromCharCode(65 + st) + " " + P.leiste[st].name : name(cls, st)).join(" → ")}`);
    lines.push(`Eigene Tasten: ${P.eigene.map(([en, n]) => name(cls, en) + (n ? ` (${n})` : "")).join(", ")}`);
    lines.push(`Opener: ${P.opener.map((en) => en === "makro" ? "Makro halten" : name(cls, en)).join(" → ")}`);
    (P.tipps || []).forEach((t) => lines.push("• " + plain(cls, t)));
    return lines.join("\n");
  }

  /* ---------- Ansicht ---------- */
  function render() {
    const host = document.getElementById("sk-app");
    if (!host) return;
    if (!view.cls) view.cls = (window.DK_APP && window.DK_APP.status().cls) || "spiritmaster";
    const cls = view.cls;
    const c = D.classes.find((x) => x.id === cls) || { id: cls, name: cls, de: cls };
    const K = SK.klassen[cls];
    const P = SP.klassen[cls];

    let h = `<div class="cls-tabs" role="tablist" aria-label="Klasse">` + D.classes.map((x) =>
      `<button type="button" role="tab" class="cls-tab${x.id === cls ? " is-on" : ""}" aria-selected="${x.id === cls}" data-sk="cls" data-id="${x.id}">
        <img class="cls-tab-ico" src="${esc(clsIcon(x.id))}" alt="" loading="lazy" decoding="async"><span class="cls-tab-name">${esc(x.de)}</span></button>`).join("") + `</div>`;

    h += `<header class="sk-head">
      <img class="sk-emblem" src="${esc(clsIcon(cls))}" alt="" width="64" height="64" decoding="async">
      <div class="sk-head-text">
        <h2>${esc(c.de)} <span>${esc(c.role || "")}</span></h2>
        <p>${rich(cls, P.kurz)}</p>
      </div>
      <dl class="sk-facts">
        <div><dt>Zuerst leveln</dt><dd>${chip(cls, P.zuerst)}</dd></div>
        <div><dt>Linien im Makro</dt><dd><b>${P.makro.filter((x) => typeof x === "number").length}</b> von ${P.leiste.length}</dd></div>
        <div><dt>Top-Spieler</dt><dd><b>${K.top.spieler}</b> · ${date(K.top.stand)}</dd></div>
      </dl>
    </header>
    <nav class="sk-jump" aria-label="Abschnitte"><a href="#sk-leiste" data-sk="jump">Leiste &amp; Makro</a><a href="#sk-punkte" data-sk="jump">Skillpunkte</a><a href="#sk-stigmen" data-sk="jump">Stigmen</a><a href="#sk-ablauf" data-sk="jump">Ablauf</a><a href="#sk-setup" data-sk="jump">Einrichten</a></nav>`;

    h += barHtml(cls, P) + pointsHtml(cls, K) + `<div class="sk-two">${stigmaHtml(cls, K)}${flowHtml(cls, P)}</div>` + setupHtml();
    h += `<p class="fine">Linien, Makro-Schritte, Opener und eigene Tasten: aion2builds.org (Stand 9.10.2026). Kern-Skills und Ablauf: metabot.gg. Stufen und Stigmen der Top-Spieler: metabot.gg, ${K.top.spieler} Charaktere auf Stufe 45 mit der höchsten Kampfkraft je Region. Punkte: allthings.how. Namen und Symbole aus dem deutschen Client. Empfehlungen, keine Vorgaben von NCSOFT – im Zweifel an der Trainingspuppe testen.</p>`;
    host.innerHTML = h;
  }

  function onClick(e) {
    const b = e.target.closest("#sk-app [data-sk]");
    if (!b) return;
    const act = b.getAttribute("data-sk");
    if (act === "cls") { view.cls = b.getAttribute("data-id"); render(); updateUrl(); }
    else if (act === "jump") {
      e.preventDefault();
      const t = document.getElementById(b.getAttribute("href").slice(1));
      if (t) t.scrollIntoView({ behavior: "smooth", block: "start" });
    } else if (act === "copy") {
      const out = document.querySelector("#sk-app .sk-copied");
      const text = copyText(view.cls);
      const done = () => { if (out) out.textContent = "Kopiert."; };
      const fail = () => { if (out) out.textContent = "Kopieren nicht möglich – Text markieren und kopieren."; };
      try {
        const p = navigator.clipboard && navigator.clipboard.writeText(text);
        if (p && p.then) p.then(done, fail); else fail();
      } catch (err) { fail(); }
    }
  }

  window.DK_SK = {
    show(cls) {
      if (cls && SK.klassen[cls]) view.cls = cls;
      render();
      if (window.DK_APP) window.DK_APP.go("skills");
      updateUrl();
    },
    copyText,
  };

  function init() {
    readUrl();
    render();
    document.addEventListener("click", onClick);
    window.addEventListener("hashchange", () => { if (location.hash === "#skills") updateUrl(); });
  }
  if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", init);
  else init();
})();
