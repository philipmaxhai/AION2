/*
 * Charakter-Check: wertet die Armory-Daten eines Charakters aus.
 * Ergebnis: Sofort-Urteil, konkrete Änderungen, Plan in Phasen, ausführlicher Plan pro Slot
 * (Ersetzen, Verstärken, Manasteine, Zusatzwerte), Stigmen, Daevanion, Farm- und Anti-Waste-Liste.
 * Reine Funktionen ohne DOM. Regeln und Zahlen: DK_DATA.audit (data.js) und DK_DATA.audit.targets (data-items.js).
 * Die Logik arbeitet mit den englischen Namen der Armory, angezeigt werden die deutschen (`de`).
 */
(function () {
  const D = window.DK_DATA;
  const A = D.audit;
  const T = A.targets || { weapons: {}, guard: {}, armor: {}, acc: {}, costs: {} };
  const Z = window.DK_ZEIT;

  const num = (v) => {
    const n = parseFloat(String(v == null ? "" : v).replace(/[^\d.\-]/g, ""));
    return isFinite(n) ? n : 0;
  };
  const fmt = (n) => Math.round(n).toLocaleString("de-DE");
  const nm = (x) => (x && (x.de || x.name)) || "";

  /* Englische Werte-Namen der Armory → Begriffe des deutschen Clients */
  const STAT_DE = {
    "Max Attack": "Max. Angriffskraft", "Attack": "Angriffskraft", "Attack Bonus": "Zusatzangriffskraft",
    "Accuracy": "Präzision", "Accuracy Bonus": "Präzisionsbonus", "Critical Hit": "Kritischer Treffer",
    "Critical Attack": "Krit.-Angriffskraft", "Critical Hit Resist": "Krit.-Widerstand", "Critical Damage Boost": "Krit.-Schadensverstärkung",
    "Critical Damage Tolerance": "Krit.-Schadensresistenz", "Max HP": "Max. LP", "Max MP": "Max. MP",
    "Defense": "Verteidigung", "Defense Bonus": "Zusatzverteidigung", "HP": "LP", "MP": "MP", "Block": "Block",
    "Evasion": "Ausweichen", "Evasion Bonus": "Zusatzausweichen", "Natural MP Regen": "Natürliche MP-Regeneration",
    "Might": "Macht", "Precision": "Präzision", "Dexterity": "Agilität", "Willpower": "Willenskraft",
    "Status Effect Resist": "Widerstand (Statuseffekte)", "Status Effect Chance": "Statuseffekt-Trefferchance",
    "Perfect Resist": "Perfektion-Widerstand", "Perfect Chance": "Perfektion", "Penetration": "Durchschlag",
    "Weapon Damage Boost": "Waffenschadensbonus", "Power Shard Damage Bonus": "Kraftsplitter-Schaden",
    "Combat Speed": "Kampftempo", "Multi-hit Chance": "Mehrfachtreffer", "Multi-hit Resist": "Widerstand (Mehrfachtreffer)",
    "Multi-Hit Chance": "Mehrfachtreffer", "Multi-Hit Resist": "Widerstand (Mehrfachtreffer)",
    "PvE Damage Boost": "Schadensverstärkung (PvE)", "PvE Damage Tolerance": "Schadensresistenz (PvE)", "Damage Boost": "Schadensverstärkung",
    "Damage Tolerance": "Schadensresistenz", "HP Potion Recovery increase": "LP-Trank-Heilung", "Regeneration": "Regeneration",
    "Cooldown Reduction": "Abklingzeitverringerung", "Back Attack": "Rückenangriff", "Front Attack": "Frontangriff", "Move Speed": "Bewegungstempo",
  };
  const statDe = (name) => STAT_DE[name] || name;
  /* „Attack Bonus +3“ → „Angriffskraft-Bonus +3“, „Spirit Strike +1“ → deutscher Skillname */
  function effectDe(text, skillDe) {
    const m = /^(.+?)\s*([+-][\d.,]+%?)$/.exec(String(text));
    if (!m) return text;
    const label = skillDe[m[1]] || STAT_DE[m[1]] || m[1];
    return `${label} ${m[2]}`;
  }

  function classId(ch) {
    const n = String(ch.profile.className || "").toLowerCase();
    return A.roles[n] ? n : A.pcClass[ch.profile.pcId] || null;
  }

  /* Stigma-Splitter: Stufe 1–5 je 1, 6–10 je 2, 11–15 je 4 */
  function shardsTo(from, to) {
    let s = 0;
    for (let l = from + 1; l <= to; l++) s += l <= 5 ? 1 : l <= 10 ? 2 : 4;
    return s;
  }

  const fmtLv = (n) => String(Math.round(n * 10) / 10).replace(".", ",");
  const und = (list) => list.length > 1 ? list.slice(0, -1).join(", ") + " und " + list[list.length - 1] : list.join("");

  /* Skillpunkte je Skill schätzen und mit den Top-Spielern der Klasse vergleichen.
   * Daten: DK_DATA.skills (Durchschnittsstufen der Top-Spieler) und DK_DATA.skillPlan.punkte (Kosten, 384 Punkte).
   * Punkte-Stufe = Armory-Stufe − Daevanion-Knoten − Skill-Stufen auf der Ausrüstung, begrenzt auf 1–10. */
  function skillPoints(ch, cls) {
    const SK = D.skills && D.skills.klassen && D.skills.klassen[cls];
    const SP = D.skillPlan && D.skillPlan.punkte;
    if (!SK || !SP || !ch.skills || !ch.skills.length) return null;
    const cum = [0, 0];
    for (let l = 2; l <= 10; l++) cum[l] = cum[l - 1] + SP.kosten[l];
    const daev = {}, gearB = {};
    for (const b of ch.boards || []) {
      for (const e of b.openSkills || []) {
        const m = /^(.+?)\s*\+(\d+)$/.exec(String(e));
        if (m) daev[m[1]] = (daev[m[1]] || 0) + Number(m[2]);
      }
    }
    for (const e of ch.equipment || []) {
      for (const s of (e.detail && e.detail.subSkills) || []) gearB[s.name] = (gearB[s.name] || 0) + (num(s.level) || num(s.value) || 1);
    }
    const loaded = (ch.boards || []).some((b) => b.nodes && b.nodes.length);
    /* Skills, die das PvP-Build braucht (Metabot auf 10, aion2builds-Ziele) – beim Umverteilen markieren */
    const pvpPlan = D.skillPlan && D.skillPlan.klassen && D.skillPlan.klassen[cls] && D.skillPlan.klassen[cls].pvp;
    const pvpSet = new Set(((SK.top.builds.pvp || {}).skills || []).filter((x) => x[1] >= 10).map((x) => x[0]).concat(pvpPlan ? pvpPlan.ziele.map((z) => z[0]) : []));
    const rows = ch.skills.filter((s) => (s.category === "Active" || s.category === "Passive") && s.acquired).map((s) => {
      const t = SK.top.skills[s.name] || null;
      const level = num(s.level), d = daev[s.name] || 0, g = gearB[s.name] || 0;
      const pts = Math.max(1, Math.min(10, level - d - g));
      return { name: s.name, de: s.de, icon: s.icon, typ: s.category === "Active" ? "a" : "p", level, daev: d, gear: g, pts, cost: cum[pts], top: t ? t[1] : null, pick: t ? t[0] : null, pvp: pvpSet.has(s.name) };
    });
    const pool = SP.quellen.reduce((a, q) => a + q[1], 0);
    const used = rows.reduce((a, r) => a + r.cost, 0);
    const slots = Math.floor(pool / cum[10]);
    const ranked = rows.filter((r) => r.top != null).sort((a, b) => b.top - a.top);
    const want = new Set(ranked.slice(0, slots).map((r) => r.name));
    rows.forEach((r) => { r.ziel = want.has(r.name) ? 10 : null; r.rank = ranked.indexOf(r) + 1 || null; });
    const level = num(ch.profile && ch.profile.level);
    let moves = null;
    // Nur mit geladenen Brettern: ohne Daevanion-Knoten wäre die Punkte-Stufe zu hoch geschätzt
    if (loaded && level >= 45) {
      const raise = ranked.filter((r) => want.has(r.name) && r.pts < 10 && r.top - r.level >= 3).map((r) => Object.assign({}, r, { need: cum[10] - r.cost }));
      const free = ranked.filter((r) => !want.has(r.name) && r.pts >= 8 && r.level - r.top >= 3).sort((a, b) => a.top - b.top);
      if (raise.length) {
        const spare = Math.max(0, pool - used);
        const needAll = raise.slice(0, 3).reduce((a, r) => a + r.need, 0);
        const pickFree = [];
        let refund = 0;
        for (const r of free) {
          if (refund + spare >= needAll) break;
          pickFree.push(r);
          refund += r.cost;
        }
        let budget = refund + spare;
        const pickRaise = [];
        for (const r of raise) if (pickRaise.length < 3 && r.need <= budget) { pickRaise.push(r); budget -= r.need; }
        if (pickRaise.length) moves = { free: pickFree, raise: pickRaise, refund, spare, rest: budget };
      }
    }
    return { rows, pool, used, slots, loaded, moves, level, top: SK.top };
  }

  /* Verstärkungskosten bis +10 nach Item-Level-Stufe (garantierte Schritte) */
  function costTier(il) { return il >= 86 ? "86" : il >= 78 ? "78" : "70"; }
  function enchantCost(from, to, il) {
    const table = T.costs[costTier(il || 70)] || A.enchantIL70;
    let kinah = 0, stones = 0;
    for (let l = Math.max(0, from); l < Math.min(10, to); l++) {
      kinah += table[l][0];
      stones += table[l][1];
    }
    return { kinah, stones, exact: il >= 70, tier: costTier(il || 70) };
  }

  const itemLevel = (e) => (e && e.detail ? num(e.detail.level) : 0);
  /* Reihenfolge wie in der NCSOFT-Armory: Common < Rare < Legend < Unique < Epic < Mythic */
  const gradeRank = (g) => ["Common", "Rare", "Legend", "Unique", "Epic", "Mythic"].indexOf(g);

  /* Bewertung von Manasteinen und Zusatzwerten nach Rolle */
  const GOOD = {
    dps: ["Attack", "Critical Hit", "Accuracy Bonus", "Accuracy", "Critical Attack", "Critical Damage Boost", "Combat Speed", "Damage Boost", "Weapon Damage Boost", "Multi-hit Chance", "Might", "Precision", "Back Attack", "Front Attack", "Penetration"],
    tank: ["HP", "Defense", "Block", "Critical Hit Resist", "Evasion", "Evasion Bonus", "Damage Tolerance", "Accuracy Bonus", "Accuracy"],
    heal: ["Attack", "Critical Hit", "Accuracy Bonus", "Accuracy", "Cooldown Reduction", "Combat Speed", "Might", "Precision", "MP"],
    hybrid: ["Attack", "Critical Hit", "Accuracy Bonus", "Accuracy", "Combat Speed", "Damage Boost", "Might", "Precision"],
  };
  const WEAK = {
    dps: ["Block", "MP", "Natural MP Regen", "Evasion", "Evasion Bonus", "Critical Hit Resist", "Defense", "Status Effect Resist"],
    tank: ["MP", "Natural MP Regen"],
    heal: ["Block", "Natural MP Regen", "Critical Hit Resist", "Evasion Bonus"],
    hybrid: ["Block", "Natural MP Regen", "Critical Hit Resist", "Evasion Bonus"],
  };
  const rate = (role, name) => (GOOD[role] || GOOD.dps).includes(name) ? "gut" : (WEAK[role] || WEAK.dps).includes(name) ? "schwach" : "neutral";
  const STONE_TIP = {
    dps: "Angriffskraft, Kritischer Treffer oder Präzisionsbonus",
    tank: "LP, Verteidigung oder Block",
    heal: "Angriffskraft (heilt mit), Kritischer Treffer oder Präzisionsbonus",
    hybrid: "Angriffskraft, Kritischer Treffer oder Präzisionsbonus",
  };

  /* Mögliche Ziele für einen Slot */
  function targetsFor(slot, cls, faction, il) {
    const now = [], later = [];
    if (slot === 1 && T.weapons[cls]) {
      const w = T.weapons[cls];
      if (il < 78) now.push({ kind: "craft", item: w.craft[faction] });
      if (il < 70) now.push({ kind: "drop", item: w.aulamus });
      if (il < 86) later.push({ kind: "spaeter", item: w.kromede });
    } else if (slot === 2 && T.guard.craft) {
      if (il < 78) now.push({ kind: "craft", item: T.guard.craft[faction] });
      if (il < 86) later.push({ kind: "spaeter", item: T.guard.nuakum });
    } else if (T.armor[slot]) {
      if (il < 70) now.push({ kind: "drop", item: T.armor[slot].vakron });
      if (il < 86) later.push({ kind: "spaeter", item: T.armor[slot].nuakum });
    } else if (A.accessories[slot] && T.acc[A.accessories[slot]]) {
      const a = T.acc[A.accessories[slot]];
      if (il < 70) now.push({ kind: "drop", item: a.aulamus });
      if (il < 86) later.push({ kind: "spaeter", item: a.kromede });
    }
    return { now, later };
  }

  /* Hauptwerte jetzt (mit Verstärkung) gegen Ziel (+0) */
  function compareRows(e, target) {
    const cur = {};
    for (const s of ((e.detail && e.detail.mainStats) || [])) {
      const label = statDe(s.name === "Attack" && s.minValue ? "Max Attack" : s.name);
      const low = s.minValue && String(s.minValue) !== String(s.value) ? `${s.minValue}–` : "";
      const extra = num(s.extra) ? ` (+${s.extra})` : "";
      cur[label] = `${low}${s.value}${extra}`;
      if (label === "Max. Angriffskraft") cur["Angriffskraft"] = cur[label];
    }
    return target.stats.map(([label, val]) => [label, cur[label] || cur[label.replace("Max. ", "")] || "–", val]);
  }

  function analyse(ch, opts) {
    opts = opts || {};
    const res = opts.resources || {};
    const now = opts.now || Date.now();
    const cls = classId(ch);
    const role = A.roles[cls] || "dps";
    const clsData = D.classes.find((c) => c.id === cls) || null;
    const faction = ch.meta.faction;
    const gsStat = ch.stats.find((s) => s.type === "ItemLevel");
    const gs = gsStat ? num(gsStat.value) : 0;
    const bySlot = {};
    ch.equipment.forEach((e) => { bySlot[e.slot] = e; });
    const skillDe = {};
    ch.skills.forEach((s) => { if (s.de) skillDe[s.name] = s.de; });
    const weapon = A.weapons[cls] || null;
    const wT = T.weapons[cls] || null;
    const craftW = wT ? wT.craft[faction] : null;
    const craftG = T.guard.craft ? T.guard.craft[faction] : null;
    const place = A.craftTable[faction];
    const nextGate = D.gates.find((g) => g.gs > gs) || null;
    const hasArcana = ch.equipment.some((e) => e.slot >= 41 && e.slot <= 50);
    const cands = [];
    const add = (c) => cands.push(c);

    /* ---------- Ausrüstung: Plan pro Slot ---------- */
    const gear = [];
    const weakArmor = [], weakAcc = [];
    for (const slot of A.slotOrder) {
      const e = bySlot[slot];
      const label = A.slotNames[slot];
      const row = { slot, label, item: e || null, il: itemLevel(e), status: "ok", next: "", source: "", plan: null };
      if (!e) {
        row.status = "leer";
        row.next = slot >= 23 ? "Konfliktrune ausrüsten und auf +1 bringen" : "Slot ist leer – jedes Teil bringt Gearscore";
        row.plan = { verdict: "leer", headline: row.next, options: [], later: [], enchant: null, stones: null, subs: null, compare: null };
        gear.push(row);
        continue;
      }
      const il = row.il;
      const d = e.detail || {};
      const t = targetsFor(slot, cls, faction, il);
      const plan = { verdict: "behalten", headline: "", options: t.now, later: t.later, enchant: null, stones: null, subs: null, compare: null, soul: null };

      /* Status und Kurzanweisung */
      if (t.now.length) {
        row.status = il < 70 ? "schwach" : "upgrade";
        plan.verdict = "ersetzen";
        plan.compare = { target: t.now[0].item, rows: compareRows(e, t.now[0].item) };
        row.next = t.now.map((o) => `${nm(o.item)} (IL ${o.item.il})`).join(" oder ");
        plan.headline = `Ersetzen durch ${row.next}.`;
        if (A.armor[slot]) weakArmor.push(slot);
        if (A.accessories[slot]) weakAcc.push(slot);
      } else if (t.later.length) {
        row.next = `Später ${nm(t.later[0].item)} (IL ${t.later[0].item.il}, ab 2100)`;
        plan.headline = e.enchant >= 10 ? `Behalten. ${row.next}.` : `Behalten und auf +10 bringen. ${row.next}.`;
      } else if (il >= 86 && (slot === 1 || slot === 2 || A.armor[slot] || A.accessories[slot])) {
        row.status = "top";
        plan.headline = slot === 1 ? "Top-Stufe erreicht. Nächster Schritt: Raid-Waffe aus Abyssal Forge (IL 102)." : "Top-Stufe erreicht.";
        row.next = plan.headline;
      }

      /* Verstärkung */
      const keeper = slot === 1 || slot === 2 || slot === 15 || slot === 16 || slot === 17 || slot === 22 || il >= 70;
      if (slot === 23 || slot === 24) {
        if (e.enchant >= 2) {
          row.status = "warnung";
          plan.verdict = "achtung";
          row.next = "Nicht weiter verstärken";
          plan.headline = `Bei +${e.enchant} stehen lassen. Ab +2 kann ein Fehlschlag die Rune zerstören, jede Stufe bringt nur +0,5 % Schadensverstärkung (PvE).`;
        } else if (e.enchant < 1) {
          row.status = "upgrade";
          plan.verdict = "ausbauen";
          row.next = "Auf +1 verstärken, dann stoppen";
          plan.headline = "Auf +1 verstärken (sicher), danach nicht weiter.";
        }
      } else if (e.enchant < 10 && keeper) {
        const scroll = slot === 17 || slot === 22;
        const cost = scroll ? null : enchantCost(e.enchant, 10, il);
        let gain = null;
        if (e.preview && e.preview.mainStats) {
          const cur = {};
          (d.mainStats || []).forEach((s) => { cur[s.name] = num(s.extra); });
          gain = e.preview.mainStats.map((s) => [statDe(s.name), num(s.extra) - (cur[s.name] || 0)]).filter((g) => g[1] > 0);
        }
        plan.enchant = { from: e.enchant, to: 10, cost, gain, scroll };
        if (plan.verdict === "behalten") plan.verdict = "ausbauen";
        if (row.status === "ok") row.status = "upgrade";
        if (!row.next) row.next = `Auf +10 verstärken (jetzt +${e.enchant})`;
        if (slot === 1 || slot === 2) {
          plan.enchant.note = t.now.length
            ? "Lohnt sich trotz Ersatz: Laut mehreren Guides nimmt der Gear-Transfer die Verstärkung auf das neue Teil mit (Manasteine nicht). Vorher am Transfer-NPC prüfen."
            : "Bis +10 ist jede Stufe garantiert.";
        } else if (slot === 17) {
          plan.enchant.note = `Der Gürtel wird mit Gürtel-Schriftrollen verstärkt, nicht mit Kinah und Verstärkungssteinen. Die Schriftrollen gibt es aus den Festungen; ${10 - e.enchant} Stufen fehlen.`;
        } else if (slot === 22) {
          plan.enchant.note = `Das Amulett wird mit Amulett-Schriftrollen verstärkt: Federn sammeln und an den Monolithen ${A.monoliths[faction]} abgeben. ${10 - e.enchant} Stufen fehlen.`;
        } else {
          plan.enchant.note = "Bis +10 ist jede Stufe garantiert.";
        }
      } else if (!keeper && t.now.length) {
        plan.enchantStop = `Nicht weiter verstärken – das Teil wird durch ${nm(t.now[0].item)} ersetzt.`;
      }
      if ((slot === 17 || slot === 22) && gradeRank(e.grade) >= 0 && gradeRank(e.grade) < gradeRank("Unique")) {
        row.status = "upgrade";
        plan.rarity = "Seltenheit per Substanzwandlung auf Einzigartig (Unique) anheben – das ist einer der größten frühen Gearscore-Sprünge.";
      }

      /* Manasteine */
      const stones = (d.stones || []).map((s) => ({ name: s.name, de: statDe(s.name), value: s.value, grade: s.grade, icon: s.icon, rating: role === "tank" ? rate("tank", s.name) : rate(role, s.name) }));
      const free = Math.max(0, num(d.stoneSlots) - stones.length);
      if (d.stoneSlots) {
        const weak = stones.filter((s) => s.rating === "schwach");
        let advice;
        if (il < 70 && t.now.length) {
          advice = free
            ? `${free} Slot${free > 1 ? "s" : ""} frei: nur billige Steine mit ${STONE_TIP[role]} einsetzen. Nichts Teures – Manasteine gehen beim Gear-Transfer verloren.`
            : "Nicht umsockeln: Das Teil wird ersetzt, und Manasteine gehen beim Gear-Transfer verloren.";
        } else if (weak.length || free) {
          advice = `${free ? `${free} Slot${free > 1 ? "s" : ""} frei. ` : ""}${weak.length ? `${weak.length} schwache${weak.length > 1 ? "" : "r"} Stein${weak.length > 1 ? "e" : ""} (${weak.map((s) => s.de).join(", ")}). ` : ""}Dieses Teil behältst du länger: hier lohnen sich gute Steine mit ${STONE_TIP[role]}.`;
        } else {
          advice = "Passt.";
        }
        plan.stones = { list: stones, free, slots: num(d.stoneSlots), advice };
      }

      /* Zusatzwerte und Skill-Bonus */
      const subs = (d.subStats || []).map((s) => ({ name: s.name, de: statDe(s.name), value: s.value, rating: rate(role, s.name) }));
      const subSkills = (d.subSkills || []).map((s) => ({ name: s.name, de: skillDe[s.name] || s.name, value: s.value || (s.level ? "+" + s.level : "") }));
      if (subs.length || subSkills.length) plan.subs = { list: subs, skills: subSkills };
      if (d.soulBindRate != null && num(d.soulBindRate) < 100) plan.soul = num(d.soulBindRate);

      /* Kurzfassung, wenn oben noch keine gesetzt ist */
      if (!plan.headline) {
        if (plan.enchant) plan.headline = `Behalten und von +${plan.enchant.from} auf +10 verstärken.`;
        else if (plan.stones && (plan.stones.free || plan.stones.list.some((x) => x.rating === "schwach"))) plan.headline = "Behalten. Bei den Manasteinen ist noch Luft.";
        else plan.headline = "Passt – hier ist gerade nichts zu tun.";
      }
      if (plan.rarity) plan.headline += " Danach die Seltenheit auf Einzigartig (Unique) heben.";

      row.plan = plan;
      gear.push(row);
    }

    /* ---------- Stigmen ---------- */
    const stigmaSkills = ch.skills.filter((s) => s.category === "Dp");
    const core = (A.coreStigmas[cls] || []).map((name) => {
      const s = stigmaSkills.find((x) => x.name === name);
      const level = s ? num(s.level) : 0;
      const bp = A.stigmaBreakpoints[name];
      return {
        name, de: s && s.de, icon: s && s.icon, core: true,
        acquired: !!(s && s.acquired), equipped: !!(s && s.equipped), level,
        target: 15, shards: s && s.acquired && level < 15 ? shardsTo(level, 15) : 0,
        breakpoint: bp || null,
      };
    });
    const extraEquipped = stigmaSkills.filter((s) => s.equipped && !(A.coreStigmas[cls] || []).includes(s.name))
      .map((s) => ({ name: s.name, de: s.de, icon: s.icon, core: false, acquired: true, equipped: true, level: num(s.level), target: null, shards: 0 }));
    const stigmas = core.concat(extraEquipped);
    const shardsNeeded = core.reduce((a, s) => a + s.shards, 0);

    for (const s of core) {
      if (s.breakpoint && s.acquired && s.level < s.breakpoint.level) {
        const n = shardsTo(s.level, s.breakpoint.level);
        add({
          id: "stigma-bp", score: 100, cat: "quick", icon: s.icon,
          title: `${nm(s)} von ${s.level} auf ${s.breakpoint.level} bringen`,
          why: s.breakpoint.text,
          how: `Dafür brauchst du ${n} Stigma-Splitter (Stufe 11–15 kostet je 4). Splitter: ${A.shardShops}.`,
          steps: [`${n} Stigma-Splitter besorgen (${A.shardShops}).`, `Im Skill-Fenster unter Stigmen ${nm(s)} zweimal aufwerten.`, `An den Trainingspuppen testen: ${skillDe["Elemental Fusion"] || "Elementarfusion"} löst jetzt deutlich öfter aus.`],
          conf: "ok",
        });
      }
    }
    const unequippedCore = core.filter((s) => s.acquired && !s.equipped);
    if (unequippedCore.length && extraEquipped.length) {
      add({
        id: "stigma-swap", score: 70, cat: "quick", icon: unequippedCore[0].icon,
        title: `Stigma tauschen: ${unequippedCore.map(nm).join(", ")} ausrüsten`,
        why: `Die Top-Spieler deiner Klasse nutzen in PvE fast immer ${core.map(nm).join(", ")}. Du trägst stattdessen ${extraEquipped.map(nm).join(", ")}.`,
        how: "Im Skill-Fenster unter Stigmen tauschen.",
        conf: "community",
      });
    }
    const lowCore = core.filter((s) => s.acquired && s.level < 15 && !(s.breakpoint && s.level < s.breakpoint.level));
    if (lowCore.length) {
      add({
        id: "stigma-15", score: 40, cat: "build", icon: lowCore[0].icon,
        title: `Kern-Stigmen auf 15: ${lowCore.map((s) => `${nm(s)} (${s.level})`).join(", ")}`,
        why: "Das sind die Stigmen, die die Top-Spieler deiner Klasse in PvE nutzen.",
        how: `Zusammen ${lowCore.reduce((a, s) => a + s.shards, 0)} Splitter. ${A.shardShops}.`,
        conf: "community",
      });
    }

    /* ---------- Skillpunkte: deine Stufen gegen die Top-Spieler deiner Klasse ----------
     * Punkte-Stufe = Stufe in der Armory minus Daevanion-Knoten minus Skill-Stufen auf der Ausrüstung (geschätzt, höchstens 10).
     * Mit allen 384 Punkten passen 18 Skills auf 10. Welche, zeigt die Durchschnittsstufe der Top-Spieler (data-skills.js). */
    const skillPts = skillPoints(ch, cls);
    if (skillPts && skillPts.moves) {
      const mv = skillPts.moves;
      const swap = mv.free.length > 0;
      const why = `${mv.raise.map((r) => `${nm(r)}: Top-Spieler im Schnitt Stufe ${fmtLv(r.top)}, du ${r.level}`).join("; ")}.`;
      if (!swap) {
        add({
          id: "skill-verteilen", score: 45, cat: "quick", icon: mv.raise[0].icon,
          title: `Skillpunkte verteilen: ${und(mv.raise.map((r) => nm(r)))} auf 10`,
          why: `${why} Rechnerisch sind noch etwa ${mv.spare} Punkte offen.`,
          how: `Freie Punkte im Skill-Fenster (K) zuerst dort hinein: ${mv.raise.map((r) => `${nm(r)} ${r.pts} → 10 (${r.need} Punkte)`).join(", ")}. Fehlen Punkte, kommen sie aus Weisheitssteinen (versiegelte Dungeons und Regionsquests) – die Steine im Inventar benutzen.`,
          conf: "community",
        });
      } else add({
        id: "skill-umverteilen", score: 45, cat: "quick", icon: mv.raise[0].icon,
        title: `Skillpunkte umverteilen: ${und(mv.raise.map((r) => nm(r)))} auf 10`,
        why: `${why} Dafür stecken bei dir Punkte in ${und(mv.free.map((r) => `${nm(r)} (Punkte-Stufe ${r.pts}, Top-Schnitt ${fmtLv(r.top)})`))}.${mv.free.some((r) => r.pvp) ? ` Gilt für PvE: ${und(mv.free.filter((r) => r.pvp).map(nm))} brauchst du im PvP – spielst du viel PvP, leg dir dafür ein eigenes Preset an.` : ""}`,
        how: `Im Skill-Fenster (K) zurücksetzen und neu verteilen: ${und(mv.free.map((r) => nm(r)))} nur noch auf 1 (${mv.refund} Punkte frei), dafür ${mv.raise.map((r) => `${nm(r)} ${r.pts} → 10 (${r.need} Punkte)`).join(", ")}. Umskillen gibt alle Punkte zurück und kostet laut Guides nur etwas Kinah.`,
        steps: [
          "Skill-Fenster öffnen (K) und die Skillpunkte zurücksetzen.",
          `${und(mv.free.map((r) => nm(r)))} nur auf Stufe 1 lassen (${mv.refund} Punkte).`,
          ...mv.raise.map((r) => `${nm(r)} auf Punkte-Stufe 10 statt ${r.pts} (${r.need} Punkte).`),
          "Alles andere wie vorher verteilen, dann an der Trainingspuppe prüfen, ob Leiste und Makro noch stimmen.",
        ],
        conf: "community",
      });
    }

    /* ---------- Gate, Waffe, Rüstung, Schmuck ---------- */
    if (gs < 1400) {
      add({
        id: "gs-1400", score: 90, cat: "gear",
        title: `Erst 1400 Gearscore erreichen (noch ${fmt(1400 - gs)})`,
        why: "Ab 1400 öffnen Vakron Sky Island und Urugugu Canyon (Eroberung) – dort droppt dein nächstes Gear.",
        how: "Gürtel und Amulett auf +10, alle Daevanion-Kristalle verteilen, Konfliktrunen auf +1, Waffe, Guard und Armband auf +10.",
        conf: "community",
      });
    }
    if (gs >= 1600 && !hasArcana) {
      add({
        id: "arcana", score: 85, cat: "gear",
        title: "Transzendenz laufen und Arkana-Slots füllen",
        why: "Deine 10 Arkana-Slots sind leer. Arkana-Karten sind zwischen 1600 und 2100 der größte Gearscore-Hebel.",
        how: "Shattered Arkanis (Spiegel, Pergament, Kelch) und Deus Research Base (Glocke, Kompass, Kelch), 2 Belohnungen je Dungeon und Tag.",
        conf: "community",
      });
    }
    const w = bySlot[1];
    if (wT && w && itemLevel(w) < 70 && gs >= 1400) {
      add({
        id: "weapon", score: 80, cat: "gear", slot: 1, icon: w.icon, targetIcon: craftW && craftW.icon,
        title: `Waffe ersetzen: ${nm(w)} (IL ${itemLevel(w)}) ist dein schwächstes Kernteil`,
        why: `${nm(wT.aulamus)} hat IL 70, ${nm(craftW)} IL 78 (${craftW.stats[0][0]} ${craftW.stats[0][1]}). Die Waffe bringt am meisten Angriffskraft pro Slot.`,
        how: `Planbar: ${nm(craftW)} herstellen (${craftW.craft ? craftW.craft.beruf + ", " + craftW.craft.werkbank + " in " + craftW.craft.ort : place}). Oder Urugugu Canyon: 0,86 % je Würfel, garantiert über den Auswahl-Gutschein nach ${A.pity.tier70} Würfeln.`,
        conf: "ok",
      });
    }
    const g = bySlot[2];
    if (craftG && g && itemLevel(g) < 78 && gs >= 1400) {
      add({
        id: "guard", score: 42 + (itemLevel(g) < 70 ? 10 : 0), cat: "gear", slot: 2, icon: g.icon, targetIcon: craftG.icon,
        title: `Guard ersetzen: ${nm(g)} (IL ${itemLevel(g)})`,
        why: `${nm(craftG)} hat IL 78 und ${craftG.stats[0][1]} Angriffskraft.`,
        how: `Herstellen: ${craftG.craft ? craftG.craft.beruf + ", " + craftG.craft.werkbank + " in " + craftG.craft.ort : place}.`,
        conf: "ok",
      });
    }
    if (weakArmor.length && gs >= 1400) {
      add({
        id: "armor", score: 55 + weakArmor.length * 2, cat: "gear", slot: weakArmor[0], icon: bySlot[weakArmor[0]].icon, targetIcon: T.armor[weakArmor[0]] && T.armor[weakArmor[0]].vakron.icon,
        title: `${weakArmor.length} Rüstungsteile unter IL 70 gegen Vakron tauschen`,
        why: `Betroffen: ${weakArmor.map((s) => A.slotNames[s]).join(", ")}. Jedes Vakron-Teil hat IL 70.`,
        how: `Vakron Sky Island, Eroberung (IL 1400). Auswahl-Gutschein nach ${A.pity.tier70} Würfeln.`,
        conf: "ok",
      });
    }
    if (weakAcc.length && gs >= 1400) {
      add({
        id: "acc", score: 52 + weakAcc.length * 2, cat: "gear", slot: weakAcc[0], icon: bySlot[weakAcc[0]].icon, targetIcon: T.acc[A.accessories[weakAcc[0]]] && T.acc[A.accessories[weakAcc[0]]].aulamus.icon,
        title: `${weakAcc.length} Schmuckteile unter IL 70 gegen Aulamus tauschen`,
        why: `Betroffen: ${weakAcc.map((s) => A.slotNames[s]).join(", ")}.`,
        how: "Urugugu Canyon, Eroberung (IL 1400): Kette 2 %, Ohrringe 3 %, Ring 3 % je Würfel.",
        conf: "ok",
      });
    }
    if (w && w.enchant < 10) {
      const c = enchantCost(w.enchant, 10, itemLevel(w));
      add({
        id: "weapon-enchant", score: 50, cat: "gear", slot: 1, icon: w.icon,
        title: `Waffe von +${w.enchant} auf +10`,
        why: "Bis +10 ist jede Stufe garantiert. Laut mehreren Guides nimmt der Gear-Transfer die Verstärkung auf die nächste Waffe mit (Manasteine nicht).",
        how: `${c.exact ? "" : "Höchstens "}${fmt(c.kinah)} Kinah und ${fmt(c.stones)} Verstärkungssteine. Vor dem Transfer am NPC prüfen, ob die Stufe übernommen wird.`,
        conf: "community",
      });
    }
    const amu = bySlot[22], belt = bySlot[17];
    if (amu && amu.enchant < 10) {
      add({
        id: "amulet", score: 46, cat: "gear", slot: 22, icon: amu.icon,
        title: `Amulett von +${amu.enchant} auf +10`,
        why: "Das Amulett trägt offensive Werte (Durchschlag, Waffenschadensbonus). Gürtel und Amulett auf +10 gehören zu den größten frühen Gearscore-Sprüngen.",
        how: `Mit Amulett-Schriftrollen: Federn sammeln und an den Monolithen ${A.monoliths[faction]} abgeben.`,
        conf: "community",
      });
    }
    if (belt && belt.enchant < 10) {
      add({
        id: "belt", score: 36, cat: "gear", slot: 17, icon: belt.icon,
        title: `Gürtel von +${belt.enchant} auf +10`,
        why: "Bringt Gearscore, aber nur Verteidigung und LP.",
        how: "Mit Gürtel-Schriftrollen aus den Festungen.",
        conf: "community",
      });
    }

    /* ---------- Manasteine gesamt ---------- */
    const emptyStones = [], badStones = [];
    for (const row of gear) {
      const st = row.plan && row.plan.stones;
      if (!st) continue;
      if (st.free > 0) emptyStones.push({ slot: row.slot, label: row.label, name: nm(row.item), free: st.free, icon: row.item.icon });
      if (role !== "tank" && row.il >= 70) {
        const bad = st.list.filter((s) => s.rating === "schwach");
        if (bad.length) badStones.push({ slot: row.slot, label: row.label, name: nm(row.item), icon: row.item.icon, stones: bad.map((s) => `${s.de} ${s.value}`) });
      }
    }
    if (emptyStones.length) {
      add({
        id: "stones-empty", score: 30, cat: "quick", slot: emptyStones[0].slot, icon: emptyStones[0].icon,
        title: `${emptyStones.reduce((a, x) => a + x.free, 0)} leere Manastein-Slots füllen`,
        why: emptyStones.map((x) => `${x.label} (${x.name}): ${x.free} frei`).join(" · "),
        how: `Billige Steine mit ${STONE_TIP[role]}. Keine teuren Steine in Teile, die du bald ersetzt.`,
        conf: "ok",
      });
    }
    if (badStones.length) {
      add({
        id: "stones-bad", score: 28, cat: "build", slot: badStones[0].slot, icon: badStones[0].icon,
        title: `Schwache Manasteine auf ${badStones.length} Teil${badStones.length > 1 ? "en" : ""}, die du behältst`,
        why: badStones.map((b) => `${b.label}: ${b.stones.join(", ")}`).join(" · "),
        how: `Beim nächsten Umsockeln ${STONE_TIP[role]} nehmen.`,
        conf: "community",
      });
    }

    /* ---------- Daevanion ---------- */
    const relevantSkills = new Set(ch.skills.filter((s) => s.acquired && (s.equipped || s.category === "Passive")).map((s) => s.name));
    const boards = ch.boards.map((b) => {
      const nodes = b.nodes.filter((n) => n.type !== "Start");
      const pvp = nodes.length > 0 && nodes.filter((n) => n.effects.some((e) => /PvP/.test(e))).length >= nodes.length / 2;
      const offensive = {}, skills = {};
      for (const n of nodes) {
        if (n.open) continue;
        for (const e of n.effects) {
          if (n.type === "SkillLevel") {
            const sk = e.replace(/\s*\+\d+$/, "");
            if (relevantSkills.has(sk)) { const k = effectDe(e, skillDe) + (n.grade && n.grade !== "Common" ? ` (${n.grade})` : ""); skills[k] = (skills[k] || 0) + 1; }
          } else if (A.offensiveNodes.some((k) => e.startsWith(k))) {
            const key = effectDe(e, skillDe) + (n.grade && n.grade !== "Common" ? ` (${n.grade})` : "");
            offensive[key] = (offensive[key] || 0) + 1;
          }
        }
      }
      return { name: b.name, de: b.de, open: b.open, total: b.total, pvp, offensive, skills, loaded: nodes.length > 0 };
    });
    const pveOpen = boards.filter((b) => !b.pvp).reduce((a, b) => a + Object.values(b.offensive).reduce((x, y) => x + y, 0) + Object.values(b.skills).reduce((x, y) => x + y, 0), 0);
    if (pveOpen) {
      add({
        id: "daevanion", score: 25, cat: "quick",
        title: "Daevanion-Kristalle zuerst in offensive Knoten",
        why: `Auf deinen PvE-Brettern sind noch ${pveOpen} Knoten mit Angriffskraft, Krit oder Skill-Stufen für deine genutzten Skills zu.`,
        how: "Die genaue Reihenfolge zeigt dein Brett weiter unten: nummeriert, als günstigster Weg von deinen offenen Knoten aus. PvP-Bretter zuletzt.",
        conf: "ok",
      });
    }

    /* ---------- Sofort-Urteil ---------- */
    cands.sort((a, b) => b.score - a.score);
    const verdict = cands[0] || {
      title: "Alles Wichtige ist erledigt",
      why: "Kein offensichtlicher Engpass in den Armory-Daten.",
      how: "Weiter Eroberung und Transzendenz laufen, Arkana-Sets und Raids angehen.",
      conf: "ok",
    };

    /* ---------- Session-Fahrplan ---------- */
    const quick = cands.filter((c) => c.cat === "quick");
    const runeRows = gear.filter((r) => (r.slot === 23 || r.slot === 24) && r.status === "warnung");
    if (runeRows.length) {
      quick.push({ id: "runes", slot: runeRows[0].slot, title: "Konfliktrunen nicht weiter verstärken", icon: runeRows[0].item.icon, why: runeRows.map((r) => `${r.label}: +${r.item.enchant}`).join(", ") + ". Ab +2 kann die Rune zerbrechen, jede Stufe bringt nur +0,5 % Schadensverstärkung (PvE).", conf: "community" });
    }

    let dungeon;
    if (gs < 1400) dungeon = { name: "Gearscore auf 1400 bringen", why: "Eroberung öffnet erst ab 1400. Bis dahin Abyss (ab IL 1000), Aufstiegsprüfung und die Basis-Schritte." };
    else if ((w && itemLevel(w) < 70) || weakAcc.length >= 3) dungeon = { name: "Urugugu Canyon – Eroberung", why: `Deine Waffe${weakAcc.length ? " und " + weakAcc.length + " Schmuckteile" : ""} liegen unter IL 70. Jeder Würfel zählt auf den Auswahl-Gutschein (${A.pity.tier70} Würfel).` };
    else if (weakArmor.length) dungeon = { name: "Vakron Sky Island – Eroberung", why: `${weakArmor.length} Rüstungsteile liegen unter IL 70.` };
    else if (gs >= 2100) dungeon = { name: "Fire Temple oder Ferocious Horn Den – Eroberung", why: "IL-86-Waffen, Schmuck und Nuakum-Rüstung (Auswahl-Gutschein nach 28 Würfeln)." };
    else if (gs >= 1600) dungeon = { name: "Transzendenz", why: "Arkana-Karten für die Slots, dann Richtung 2100." };
    else dungeon = { name: "Vakron oder Urugugu – Eroberung", why: "Dein IL-70-Gear ist komplett; Würfel für Verstärkungsmaterial und Pity nutzen." };

    const today = [];
    today.push({ title: dungeon.name, why: dungeon.why + ` Pro Woche gibt es ${A.pity.weeklyCubes} Würfel.` });
    today.push({ title: "Albtraum 2×", why: "Phantasmal Fragments für Stigma-Splitter; ein Versuch zählt nur bei Sieg." });
    if (amu && amu.enchant < 10) today.push({ title: "Federn sammeln", why: `Für das Amulett: Monolithen ${A.monoliths[faction]}.` });

    const times = [];
    let weekReset = null;
    if (Z) {
      const ev = (id) => D.events.find((e) => e.id === id);
      const shift = (id) => (opts.shifts && +opts.shifts[id]) || 0;
      const r = Z.next(ev("reset"), now, shift("reset"));
      const wr = Z.next(ev("wreset"), now, shift("wreset"));
      const rifts = Z.occurrences(ev("riss"), now, now + 24 * 3600000, shift("riss")).filter((o) => o.ts >= now).slice(0, 4);
      const siege = Z.occurrences(ev("belagerung"), now, now + 24 * 3600000, shift("belagerung")).filter((o) => o.end > now)[0];
      if (r) times.push({ label: "Tages-Reset", ts: r.ts });
      if (rifts.length) times.push({ label: "Raumzeit-Riss", ts: rifts[0].ts, more: rifts.slice(1).map((o) => Z.time(o.ts)) });
      if (siege) times.push({ label: "Artefakt-Belagerung", ts: siege.ts, note: "Zeit unsicher" });
      if (wr) { times.push({ label: "Wochen-Reset (Würfel-Zähler)", ts: wr.ts, day: true }); weekReset = wr.ts; }
    }

    /* ---------- Plan in Phasen ---------- */
    const phases = [];
    const P = (id, title, items) => { if (items.length) phases.push({ id, title, items }); };
    const heute = quick.map((q) => ({ id: "q-" + q.id, slot: q.slot, title: q.title, detail: q.how || q.why, icon: q.icon }));
    heute.push({ id: "albtraum", title: "Albtraum 2× laufen", detail: "Phantasmal Fragments für den Albtraum-Shop (Stigma-Splitter). Ein Versuch zählt nur bei Sieg." });
    P("heute", "Heute", heute);

    const woche = [];
    if (gs >= 1400) woche.push({ id: "wuerfel", title: `${A.pity.weeklyCubes} Eroberungs-Würfel: ${dungeon.name}`, detail: `${dungeon.why}${weekReset && Z ? ` Der Zähler setzt sich ${Z.day(weekReset)} um ${Z.time(weekReset)} zurück – vorher alle Würfel nutzen.` : ""}` });
    for (const row of gear) {
      const en = row.plan && row.plan.enchant;
      if (!en || !(row.slot === 1 || row.slot === 2 || row.slot === 17 || row.slot === 22 || row.slot === 15 || row.slot === 16)) continue;
      const price = en.cost ? `${en.cost.exact ? "" : "Höchstens "}${fmt(en.cost.kinah)} Kinah und ${fmt(en.cost.stones)} Verstärkungssteine. ` : "";
      const plus = en.gain && en.gain.length ? `Bringt ${en.gain.map((g) => `+${fmt(g[1])} ${g[0]}`).join(", ")}. ` : "";
      woche.push({ id: "ench-" + row.slot, slot: row.slot, icon: row.item.icon, title: `${row.label}: ${nm(row.item)} von +${en.from} auf +10`, detail: `${plus}${price}${en.note || ""}` });
    }
    woche.push({ id: "aufstieg", title: "Aufstiegsprüfung 3×", detail: "Verstärkungssteine und Amplify-Stone-Fragmente." });
    if (shardsNeeded) woche.push({ id: "abyss-ap", title: "Abyss-Zeit nutzen (7 h pro Woche)", detail: "Abyss-Punkte für Stigma-Splitter im Abyss-Shop (10.000–25.000 AP pro Splitter)." });
    P("woche", "Diese Woche", woche);

    const wochen = [];
    for (const row of gear) {
      const p = row.plan;
      if (!p || !p.options.length) continue;
      const o = p.options[0];
      if (o.kind === "craft") {
        wochen.push({ id: "craft-" + row.slot, slot: row.slot, icon: o.item.icon, title: `${nm(o.item)} herstellen (${row.label})`, detail: `${o.item.craft ? `${o.item.craft.beruf}, ${o.item.craft.werkbank} in ${o.item.craft.ort}. ` : ""}Material: ${(o.item.recipe || []).map((r) => `${r[0]}× ${r[1]}`).join(", ")}. Zorniger Gedanke, Zorniger Wille und der Veredelungsstein sind handelbar (Handelsagent).` });
      }
    }
    const armorRows = gear.filter((r) => A.armor[r.slot] && r.plan && r.plan.options.length);
    if (armorRows.length) wochen.push({ id: "vakron", slot: armorRows[0].slot, icon: armorRows[0].plan.options[0].item.icon, title: `Vakron-Rüstung: ${armorRows.map((r) => r.label).join(", ")}`, detail: `Vakron Sky Island (Eroberung). Nach ${A.pity.tier70} Würfeln gibt es einen Auswahl-Gutschein – damit das Teil wählen, das dir am meisten fehlt (Brust hat die höchsten Werte).` });
    const accRows = gear.filter((r) => A.accessories[r.slot] && r.plan && r.plan.options.length);
    if (accRows.length) wochen.push({ id: "aulamus-acc", slot: accRows[0].slot, icon: accRows[0].plan.options[0].item.icon, title: `Aulamus-Schmuck: ${accRows.map((r) => r.label).join(", ")}`, detail: "Urugugu Canyon (Eroberung): Kette 2 %, Ohrringe 3 %, Ring 3 % je Würfel." });
    if (nextGate) wochen.push({ id: "gate", title: `${nextGate.gs} Gearscore erreichen (noch ${fmt(nextGate.gs - gs)})`, detail: nextGate.text });
    P("wochen", "Nächste 2–3 Wochen", wochen);

    const spaeter = [];
    const laterRows = gear.filter((r) => r.plan && r.plan.later.length);
    laterRows.filter((r) => r.slot === 1 || r.slot === 2).forEach((r) => {
      const o = r.plan.later[0];
      spaeter.push({ id: "spaet-" + r.slot, slot: r.slot, icon: o.item.icon, title: `${r.label}: ${nm(o.item)} (IL ${o.item.il})`, detail: `${o.item.source}.${o.item.plus10 ? ` Bei +10 kommt dazu: ${o.item.plus10}.` : ""}` });
    });
    const group = (rows, id, title, extra) => {
      if (!rows.length) return;
      const o = rows[0].plan.later[0];
      spaeter.push({ id, slot: rows[0].slot, icon: o.item.icon, title: `${title}: ${rows.map((r) => r.label).join(", ")} (IL ${o.item.il})`, detail: `${o.item.source}. ${extra}` });
    };
    group(laterRows.filter((r) => A.armor[r.slot]), "spaet-ruestung", "Nuakums Rüstung", "Mit dem Auswahl-Gutschein das Teil nehmen, das dir am meisten fehlt.");
    group(laterRows.filter((r) => A.accessories[r.slot]), "spaet-schmuck", "Schmuck der Wütenden Kromede", "Kette, Ohrringe und Ringe droppen in derselben Eroberung.");
    P("spaeter", "Ab 2100 Gearscore", spaeter);

    /* ---------- Build ---------- */
    const build = [];
    if (clsData) build.push({ title: "Werte-Priorität (Guides)", list: clsData.stats });
    const ks = A.keySkills[cls];
    if (ks) {
      const rows = ks.names.map((n) => {
        const s = ch.skills.find((x) => x.name === n);
        return `${s ? nm(s) : n}: ${s ? s.level : "–"} (Ziel ${ks.target}+)`;
      });
      build.push({ title: "Kern-Skills", list: rows });
    }
    if (clsData && clsData.extra && clsData.extra.rotation) build.push({ title: "Kern-Ablauf", list: clsData.extra.rotation });

    /* ---------- Farming & Anti-Waste ---------- */
    const farm = [];
    if (craftW && w && itemLevel(w) < 78) farm.push(`Waffe: ${nm(craftW)} herstellen (${craftW.craft ? craftW.craft.beruf + ", " + craftW.craft.ort : place}); Engpass ${A.craftBottleneck}. Oder Urugugu-Pity (${A.pity.tier70} Würfel).`);
    if (weakArmor.length) farm.push(`Rüstung: Vakron Sky Island, Teile 1–3 % je Würfel, Gutschein nach ${A.pity.tier70} Würfeln.`);
    if (weakAcc.length) farm.push("Schmuck: Urugugu Canyon, Aulamus-Kette, -Ohrringe, -Ring 2–3 % je Würfel.");
    if (amu && amu.enchant < 10) farm.push(`Amulett-Schriftrollen: Federn an den Monolithen ${A.monoliths[faction]}.`);
    if (belt && belt.enchant < 10) farm.push("Gürtel-Schriftrollen: Festungen.");
    if (shardsNeeded) farm.push(`Stigma-Splitter (${shardsNeeded} bis alle Kern-Stigmen auf 15): ${A.shardShops}.`);
    if (skillPts && skillPts.loaded && skillPts.level >= 45 && skillPts.pool - skillPts.used >= 10) farm.push(`Skillpunkte: Verteilt sind etwa ${skillPts.used} von ${skillPts.pool}. Die übrigen kommen aus Weisheitssteinen – 61 versiegelte Dungeons (je 2, goldenes Fragezeichen auf der Karte) und 59 Regionsquests (je 1, grüne Markierung). Steine im Inventar benutzen.`);
    farm.push("Verstärkungssteine: Erfolg „Urugugu Canyon Eroberung abschließen“ (1/3/5/10/15/20×) gibt je 2.480 Steine und 53.000 Kinah; doppelte IL-70-Waffen zerlegen gibt 320 Steine.");

    const waste = [
      "Keine Manasteine in Teile unter IL 70 stecken – sie gehen beim Gear-Transfer verloren.",
      "Teile, die du bald ersetzt, nicht über +10 verstärken. " + A.above10,
      "Unyielding-Drops aus Vakron (IL 42, Episch) sind schlechter als dein Gear – zerlegen.",
      "Odyle nie über den Cap laufen lassen und nicht in Erkundungs-Dungeons ausgeben.",
    ];
    if (runeRows.length) waste.unshift("Konfliktrunen bleiben, wo sie sind – ab +2 können sie zerbrechen.");

    /* ---------- Ressourcen ---------- */
    const bpStigma = core.find((s) => s.breakpoint && s.acquired && s.level < s.breakpoint.level);
    const shardsFirst = bpStigma ? shardsTo(bpStigma.level, bpStigma.breakpoint.level) : shardsNeeded;
    const costs = { shardsNeeded, shardsFirst, weapon: null, notes: [] };
    if (w) {
      const il = itemLevel(w);
      const c = enchantCost(il >= 70 ? w.enchant : 0, 10, Math.max(il, 70));
      costs.weapon = { from: il >= 70 ? w.enchant : 0, kinah: c.kinah, stones: c.stones, il70: il >= 70 };
    }
    if (res.kinah != null || res.stones != null || res.ap != null) {
      if (costs.weapon && costs.weapon.kinah) {
        const okK = res.kinah == null || res.kinah >= costs.weapon.kinah;
        const okS = res.stones == null || res.stones >= costs.weapon.stones;
        costs.notes.push(`${costs.weapon.il70 ? "Deine Waffe" : "Eine IL-70-Waffe"} von +${costs.weapon.from} auf +10: ${fmt(costs.weapon.kinah)} Kinah und ${fmt(costs.weapon.stones)} Steine – ${okK && okS ? "das hast du." : "dafür fehlen dir noch " + [!okK ? fmt(costs.weapon.kinah - res.kinah) + " Kinah" : "", !okS ? fmt(costs.weapon.stones - res.stones) + " Steine" : ""].filter(Boolean).join(" und ") + "."}`);
      }
      if (shardsFirst && res.ap != null) {
        const n = shardsFirst, min = n * 10000, max = n * 25000;
        const what = bpStigma ? `die ${n} Splitter für ${nm(bpStigma)}` : `${n} Splitter für deine Kern-Stigmen`;
        costs.notes.push(res.ap >= max ? `Deine ${fmt(res.ap)} AP reichen für ${what}.` : res.ap >= min ? `Deine ${fmt(res.ap)} AP reichen je nach Preisstufe für ${what} (10.000–25.000 AP pro Splitter).` : `Für ${what} brauchst du ${fmt(min)}–${fmt(max)} AP; dir fehlen mindestens ${fmt(min - res.ap)}. Albtraum- und Shugo-Shop sind die Alternative.`);
      }
      if (res.kinah != null && craftW && w && itemLevel(w) < 78) costs.notes.push(`Für ${nm(craftW)}: Engpass-Material (${A.craftBottleneck}) am Handelsagenten mit deinen ${fmt(res.kinah)} Kinah gegenrechnen.`);
    }

    return {
      cls, clsName: clsData ? clsData.name : ch.profile.className, role, faction, gs, nextGate,
      verdict, candidates: cands, quick, today, times, phases, gear, stigmas, shardsNeeded,
      emptyStones, badStones, boards, build, farm, waste, costs, hasArcana, statDe, skillPts,
    };
  }

  window.DK_AUDIT = { analyse, shardsTo, enchantCost, statDe, effectDe, skillPoints, fmtLv };
})();
