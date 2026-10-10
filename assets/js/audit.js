/*
 * Charakter-Check: wertet die Armory-Daten eines Charakters aus und erzeugt
 * Sofort-Urteil, Session-Fahrplan, Gear-Tabelle, Build-Hinweise, Farm- und Anti-Waste-Liste.
 * Reine Funktionen ohne DOM; Regeln und Zahlen stehen in DK_DATA.audit.
 */
(function () {
  const D = window.DK_DATA;
  const A = D.audit;
  const Z = window.DK_ZEIT;

  const num = (v) => {
    const n = parseFloat(String(v == null ? "" : v).replace(/[^\d.\-]/g, ""));
    return isFinite(n) ? n : 0;
  };
  const fmt = (n) => Math.round(n).toLocaleString("de-DE");

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

  function enchantCost(from, to) {
    let kinah = 0, stones = 0;
    for (let l = Math.max(0, from); l < Math.min(10, to); l++) {
      kinah += A.enchantIL70[l][0];
      stones += A.enchantIL70[l][1];
    }
    return { kinah, stones };
  }

  const itemLevel = (e) => (e && e.detail ? num(e.detail.level) : 0);
  const gradeRank = (g) => ["Common", "Rare", "Legend", "Unique", "Epic", "Mythic"].indexOf(g);

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
    const weapon = A.weapons[cls] || null;
    const craftName = weapon ? `${A.craftPrefix[faction]} ${weapon.craft}` : null;
    const craftGuard = `${A.craftPrefix[faction]} Dragon Lord Guard`;
    const table = A.craftTable[faction];
    const nextGate = D.gates.find((g) => g.gs > gs) || null;
    const hasArcana = ch.equipment.some((e) => e.slot >= 41 && e.slot <= 50);
    const cands = [];
    const add = (c) => cands.push(c);

    /* ---------- Ausrüstung ---------- */
    const gear = [];
    const weakArmor = [], weakAcc = [];
    for (const slot of A.slotOrder) {
      const e = bySlot[slot];
      const label = A.slotNames[slot];
      const row = { slot, label, item: e || null, il: itemLevel(e), status: "ok", next: "", source: "" };
      if (!e) {
        row.status = "leer";
        row.next = slot >= 23 ? "Konfliktrune ausrüsten" : "Slot ist leer";
        gear.push(row);
        continue;
      }
      const il = row.il;
      if (slot === 1 && weapon) {
        if (il < 70) {
          row.status = "schwach";
          row.next = `${craftName} (IL 78) oder ${weapon.aulamus} (IL 70)`;
          row.source = `Herstellen: ${weapon.prof} in ${table}. Urugugu Canyon: ${A.aulamusChance.weapon} % je Würfel, Auswahl-Gutschein nach ${A.pity.tier70} Würfeln.`;
        } else if (il < 78) {
          row.next = `${craftName} (IL 78), später ${weapon.kromede} (IL 86)`;
          row.source = `Herstellen in ${table}; Kromede ab 2100 im Fire Temple.`;
        } else if (il < 86) {
          row.next = `${weapon.kromede} (IL 86)`;
          row.source = "Fire Temple, Eroberung ab 2100";
        } else {
          row.status = "top";
          row.next = "Raid-Waffe (Ludra, IL 102)";
          row.source = "Heiligtum-Raid Abyssal Forge";
        }
      } else if (slot === 2) {
        if (il < 78) {
          row.status = il < 70 ? "schwach" : "upgrade";
          row.next = `${craftGuard} (IL 78)`;
          row.source = `Herstellen: Schmiedekunst in ${table}. Später Nuakum Guard (IL 86, Ferocious Horn Den ab 2100).`;
        } else if (il < 86) {
          row.next = "Nuakum Guard (IL 86)";
          row.source = "Ferocious Horn Den ab 2100";
        } else row.status = "top";
      } else if (A.armor[slot]) {
        if (il < 70) {
          row.status = "schwach";
          weakArmor.push(slot);
          row.next = `Vakron ${A.armor[slot]} (IL 70)`;
          row.source = `Vakron Sky Island: ${A.vakronChance[slot]} % je Würfel, Auswahl-Gutschein nach ${A.pity.tier70} Würfeln.`;
        } else if (il < 86) {
          row.next = `Nuakum ${A.armor[slot]} (IL 86)`;
          row.source = "Ferocious Horn Den ab 2100";
        } else row.status = "top";
      } else if (A.accessories[slot]) {
        const kind = A.accessories[slot];
        if (il < 70) {
          row.status = "schwach";
          weakAcc.push(slot);
          row.next = `Aulamus ${kind} (IL 70)`;
          row.source = `Urugugu Canyon: ${A.aulamusChance[kind]} % je Würfel.`;
        } else if (il < 86) {
          row.next = `Enraged Kromede ${kind} (IL 86)`;
          row.source = "Fire Temple ab 2100";
        } else row.status = "top";
      } else if (slot === 15 || slot === 16) {
        if (e.enchant < 10) {
          row.status = "upgrade";
          row.next = `Auf +10 verstärken (jetzt +${e.enchant})`;
          row.source = "Verstärkung ist bis +10 garantiert";
        }
      } else if (slot === 17 || slot === 22) {
        const what = slot === 17 ? "Gürtel-Schriftrollen aus Festungen" : `Federn an den Monolithen ${A.monoliths[faction]}`;
        if (e.enchant < 10) {
          row.status = "upgrade";
          row.next = `Auf +10 (jetzt +${e.enchant})`;
          row.source = what;
        }
        if (gradeRank(e.grade) >= 0 && gradeRank(e.grade) < gradeRank("Unique")) {
          row.status = "upgrade";
          row.next = (row.next ? row.next + ", " : "") + "per Substanzwandlung auf Unique";
          row.source = row.source || what;
        }
      } else if (slot === 23 || slot === 24) {
        if (e.enchant >= 2) {
          row.status = "warnung";
          row.next = "Nicht weiter verstärken";
          row.source = "Ab +2 kann ein Fehlschlag die Rune zerstören; jede Stufe bringt nur +0,5 % PvE-Schaden.";
        } else if (e.enchant < 1) {
          row.status = "upgrade";
          row.next = "Auf +1 verstärken, dann stoppen";
        }
      }
      gear.push(row);
    }

    /* ---------- Stigmen ---------- */
    const stigmaSkills = ch.skills.filter((s) => s.category === "Dp");
    const core = (A.coreStigmas[cls] || []).map((name) => {
      const s = stigmaSkills.find((x) => x.name === name);
      const level = s ? num(s.level) : 0;
      const bp = A.stigmaBreakpoints[name];
      return {
        name, core: true,
        acquired: !!(s && s.acquired), equipped: !!(s && s.equipped), level,
        target: 15, shards: s && s.acquired && level < 15 ? shardsTo(level, 15) : 0,
        breakpoint: bp || null,
      };
    });
    const extraEquipped = stigmaSkills.filter((s) => s.equipped && !(A.coreStigmas[cls] || []).includes(s.name))
      .map((s) => ({ name: s.name, core: false, acquired: true, equipped: true, level: num(s.level), target: null, shards: 0 }));
    const stigmas = core.concat(extraEquipped);
    const shardsNeeded = core.reduce((a, s) => a + s.shards, 0);

    for (const s of core) {
      if (s.breakpoint && s.acquired && s.level < s.breakpoint.level) {
        add({
          id: "stigma-bp", score: 100, cat: "quick",
          title: `${s.name} von ${s.level} auf ${s.breakpoint.level} bringen`,
          why: s.breakpoint.text,
          how: `Dafür brauchst du ${shardsTo(s.level, s.breakpoint.level)} Stigma-Splitter: ${A.shardShops}.`,
          conf: "ok",
        });
      }
    }
    const unequippedCore = core.filter((s) => s.acquired && !s.equipped);
    if (unequippedCore.length && extraEquipped.length) {
      add({
        id: "stigma-swap", score: 70, cat: "quick",
        title: `Stigma tauschen: ${unequippedCore.map((s) => s.name).join(", ")} ausrüsten`,
        why: `Die Top-Spieler deiner Klasse nutzen in PvE fast immer ${A.coreStigmas[cls].join(", ")}. Du trägst stattdessen ${extraEquipped.map((s) => s.name).join(", ")}.`,
        how: "Im Skill-Fenster unter Stigmen tauschen.",
        conf: "community",
      });
    }
    const lowCore = core.filter((s) => s.acquired && s.level < 15 && !(s.breakpoint && s.level < s.breakpoint.level));
    if (lowCore.length) {
      add({
        id: "stigma-15", score: 40, cat: "build",
        title: `Kern-Stigmen auf 15: ${lowCore.map((s) => `${s.name} (${s.level})`).join(", ")}`,
        why: "Kern-Stigmen deiner Klasse laut Nutzungsdaten der Top-Spieler.",
        how: `Zusammen ${lowCore.reduce((a, s) => a + s.shards, 0)} Splitter. ${A.shardShops}.`,
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
    if (weapon && w && itemLevel(w) < 70 && gs >= 1400) {
      add({
        id: "weapon", score: 80, cat: "gear",
        title: `Waffe ersetzen: ${w.name} (IL ${itemLevel(w)}) ist dein schwächstes Kernteil`,
        why: `Ein ${weapon.aulamus} hat IL 70, ein ${craftName} IL 78. Die Waffe bringt am meisten Angriff pro Slot.`,
        how: `Planbar: ${craftName} herstellen (${weapon.prof}, ${table}; Engpass ${A.craftBottleneck}). Oder Urugugu Canyon: ${A.aulamusChance.weapon} % je Würfel, garantiert über den Auswahl-Gutschein nach ${A.pity.tier70} Würfeln.`,
        conf: "ok",
      });
    }
    const g = bySlot[2];
    if (g && itemLevel(g) < 78 && gs >= 1400) {
      add({
        id: "guard", score: 42 + (itemLevel(g) < 70 ? 10 : 0), cat: "gear",
        title: `Guard ersetzen: ${g.name} (IL ${itemLevel(g)})`,
        why: `${craftGuard} hat IL 78 und deutlich mehr Angriff.`,
        how: `Herstellen: Schmiedekunst in ${table}; Engpass ${A.craftBottleneck}.`,
        conf: "ok",
      });
    }
    if (weakArmor.length && gs >= 1400) {
      add({
        id: "armor", score: 55 + weakArmor.length * 2, cat: "gear",
        title: `${weakArmor.length} Rüstungsteile unter IL 70 gegen Vakron tauschen`,
        why: `Betroffen: ${weakArmor.map((s) => A.slotNames[s]).join(", ")}. Jedes Vakron-Teil hat IL 70.`,
        how: `Vakron Sky Island, Eroberung (IL 1400). Auswahl-Gutschein nach ${A.pity.tier70} Würfeln.`,
        conf: "ok",
      });
    }
    if (weakAcc.length && gs >= 1400) {
      add({
        id: "acc", score: 52 + weakAcc.length * 2, cat: "gear",
        title: `${weakAcc.length} Schmuckteile unter IL 70 gegen Aulamus tauschen`,
        why: `Betroffen: ${weakAcc.map((s) => A.slotNames[s]).join(", ")}.`,
        how: "Urugugu Canyon, Eroberung (IL 1400): Kette 2 %, Ohrringe 3 %, Ring 3 % je Würfel.",
        conf: "ok",
      });
    }
    if (w && w.enchant < 10) {
      add({
        id: "weapon-enchant", score: 50, cat: "gear",
        title: `Waffe von +${w.enchant} auf +10`,
        why: "Bis +10 ist jede Stufe garantiert. Laut mehreren Guides nimmt der Gear-Transfer die Verstärkung auf die nächste Waffe mit (Manasteine nicht).",
        how: "Vor dem Transfer am NPC prüfen, ob die Stufe übernommen wird.",
        conf: "community",
      });
    }
    const amu = bySlot[22], belt = bySlot[17];
    if (amu && amu.enchant < 10) {
      add({
        id: "amulet", score: 46, cat: "gear",
        title: `Amulett von +${amu.enchant} auf +10`,
        why: "Das Amulett trägt offensive Werte (Durchschlag, Waffenschaden). Gürtel und Amulett auf +10 gehören zu den größten frühen GS-Sprüngen.",
        how: `Federn sammeln und an den Monolithen ${A.monoliths[faction]} abgeben.`,
        conf: "community",
      });
    }
    if (belt && belt.enchant < 10) {
      add({
        id: "belt", score: 36, cat: "gear",
        title: `Gürtel von +${belt.enchant} auf +10`,
        why: "Bringt Gearscore, aber nur Verteidigung und HP.",
        how: "Gürtel-Schriftrollen aus den Festungen.",
        conf: "community",
      });
    }

    /* ---------- Manasteine ---------- */
    const emptyStones = [], badStones = [];
    for (const e of ch.equipment) {
      const d = e.detail;
      if (!d) continue;
      const free = num(d.stoneSlots) - (d.stones || []).length;
      if (free > 0) emptyStones.push({ label: A.slotNames[e.slot] || e.slotName, name: e.name, free });
      if (role !== "tank" && itemLevel(e) >= 70) {
        const bad = (d.stones || []).filter((s) => A.defensiveStones.includes(s.name));
        if (bad.length) badStones.push({ label: A.slotNames[e.slot] || e.slotName, name: e.name, stones: bad.map((s) => `${s.name} ${s.value}`) });
      }
    }
    if (emptyStones.length) {
      add({
        id: "stones-empty", score: 30, cat: "quick",
        title: `${emptyStones.reduce((a, x) => a + x.free, 0)} leere Manastein-Slots füllen`,
        why: emptyStones.map((x) => `${x.label} (${x.name}): ${x.free} frei`).join(" · "),
        how: role === "tank" ? "Billige Steine mit HP, Verteidigung oder Block." : "Billige Steine mit Angriff, Krit oder Genauigkeit. Keine teuren Steine in Teile, die du bald ersetzt.",
        conf: "ok",
      });
    }

    /* ---------- Daevanion ---------- */
    const relevantSkills = new Set(ch.skills.filter((s) => s.acquired && (s.equipped || s.category === "Passive")).map((s) => s.name));
    const boards = ch.boards.map((b) => {
      const nodes = b.nodes.filter((n) => n.type !== "Start");
      const pvp = nodes.filter((n) => n.effects.some((e) => /PvP/.test(e))).length >= nodes.length / 2;
      const offensive = {}, skills = {};
      for (const n of nodes) {
        if (n.open) continue;
        for (const e of n.effects) {
          if (n.type === "SkillLevel") {
            const sk = e.replace(/\s*\+\d+$/, "");
            if (relevantSkills.has(sk)) skills[e] = (skills[e] || 0) + 1;
          } else if (A.offensiveNodes.some((k) => e.startsWith(k))) {
            const key = n.grade && n.grade !== "Common" ? `${e} (${n.grade})` : e;
            offensive[key] = (offensive[key] || 0) + 1;
          }
        }
      }
      return { name: b.name, open: b.open, total: b.total, pvp, offensive, skills };
    });
    const pveOpen = boards.filter((b) => !b.pvp).reduce((a, b) => a + Object.values(b.offensive).reduce((x, y) => x + y, 0) + Object.values(b.skills).reduce((x, y) => x + y, 0), 0);
    if (pveOpen) {
      add({
        id: "daevanion", score: 25, cat: "quick",
        title: "Daevanion-Kristalle zuerst in offensive Knoten",
        why: `Auf deinen PvE-Brettern sind noch ${pveOpen} Knoten mit Angriff, Krit oder Skill-Stufen für deine genutzten Skills zu.`,
        how: "Erst Unique- und Legend-Knoten, dann die gewöhnlichen Angriffs- und Krit-Knoten. PvP-Bretter zuletzt.",
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
      quick.push({ id: "runes", title: "Konfliktrunen nicht weiter verstärken", why: runeRows.map((r) => `${r.label}: +${r.item.enchant}`).join(", ") + ". Ab +2 kann die Rune zerbrechen, jede Stufe bringt nur +0,5 % PvE-Schaden.", conf: "community" });
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
      if (wr) times.push({ label: "Wochen-Reset (Würfel-Zähler)", ts: wr.ts, day: true });
    }

    /* ---------- Build ---------- */
    const build = [];
    if (clsData) build.push({ title: "Werte-Priorität (Guides)", list: clsData.stats });
    const ks = A.keySkills[cls];
    if (ks) {
      const rows = ks.names.map((n) => {
        const s = ch.skills.find((x) => x.name === n);
        return `${n}: ${s ? s.level : "–"} (Ziel ${ks.target}+)`;
      });
      build.push({ title: "Kern-Skills", list: rows });
    }
    if (clsData && clsData.extra && clsData.extra.rotation) build.push({ title: "Kern-Ablauf", list: clsData.extra.rotation });
    const divine = ch.stats.filter((s) => s.secondary && s.secondary.length && num(s.value) > 0)
      .sort((a, b) => num(b.value) - num(a.value)).slice(0, 6)
      .map((s) => `${s.name} ${s.value}: ${s.secondary.join(", ")}`);
    if (divine.length) build.push({ title: "Deine stärksten Werte", list: divine });

    /* ---------- Farming & Anti-Waste ---------- */
    const farm = [];
    if (weapon && w && itemLevel(w) < 78) farm.push(`Waffe: ${craftName} herstellen (${weapon.prof}, ${table}); Engpass ${A.craftBottleneck}. Oder Urugugu-Pity (${A.pity.tier70} Würfel).`);
    if (weakArmor.length) farm.push(`Rüstung: Vakron Sky Island, Teile 1–3 % je Würfel, Gutschein nach ${A.pity.tier70} Würfeln.`);
    if (weakAcc.length) farm.push("Schmuck: Urugugu Canyon, Aulamus-Kette, -Ohrringe, -Ring 2–3 % je Würfel.");
    if (amu && amu.enchant < 10) farm.push(`Amulett-Schriftrollen: Federn an den Monolithen ${A.monoliths[faction]}.`);
    if (belt && belt.enchant < 10) farm.push("Gürtel-Schriftrollen: Festungen.");
    if (shardsNeeded) farm.push(`Stigma-Splitter (${shardsNeeded} bis alle Kern-Stigmen auf 15): ${A.shardShops}.`);
    farm.push("Verstärkungssteine: Erfolg „Urugugu Canyon Eroberung abschließen“ (1/3/5/10/15/20×) gibt je 2.480 Steine und 53.000 Kinah; doppelte IL-70-Waffen zerlegen gibt 320 Steine.");

    const waste = [
      "Keine Manasteine in Teile unter IL 70 stecken – sie gehen beim Gear-Transfer verloren.",
      "Teile, die du bald ersetzt, nicht über +10 verstärken. " + A.above10,
      "Unyielding-Drops aus Vakron (IL 42, Epic) sind schlechter als dein Gear – zerlegen.",
      "Odyle nie über den Cap laufen lassen und nicht in Erkundungs-Dungeons ausgeben.",
    ];
    if (runeRows.length) waste.unshift("Konfliktrunen bleiben, wo sie sind – ab +2 können sie zerbrechen.");
    if (badStones.length) waste.push("Defensive Manasteine auf deinen IL-70-Teilen: " + badStones.map((b) => `${b.label} (${b.stones.join(", ")})`).join("; ") + ". Beim nächsten Umsockeln Angriff, Krit oder Genauigkeit nehmen.");

    /* ---------- Ressourcen ---------- */
    const bpStigma = core.find((s) => s.breakpoint && s.acquired && s.level < s.breakpoint.level);
    const shardsFirst = bpStigma ? shardsTo(bpStigma.level, bpStigma.breakpoint.level) : shardsNeeded;
    const costs = { shardsNeeded, shardsFirst, weapon: null, notes: [] };
    if (w) {
      const from = itemLevel(w) >= 70 ? w.enchant : 0;
      const c = enchantCost(from, 10);
      costs.weapon = { from, kinah: c.kinah, stones: c.stones, il70: itemLevel(w) >= 70 };
    }
    if (res.kinah != null || res.stones != null || res.ap != null) {
      if (costs.weapon && costs.weapon.kinah) {
        const okK = res.kinah == null || res.kinah >= costs.weapon.kinah;
        const okS = res.stones == null || res.stones >= costs.weapon.stones;
        costs.notes.push(`${costs.weapon.il70 ? "Deine Waffe" : "Eine IL-70-Waffe"} von +${costs.weapon.from} auf +10: ${fmt(costs.weapon.kinah)} Kinah und ${fmt(costs.weapon.stones)} Steine – ${okK && okS ? "das hast du." : "dafür fehlen dir noch " + [!okK ? fmt(costs.weapon.kinah - res.kinah) + " Kinah" : "", !okS ? fmt(costs.weapon.stones - res.stones) + " Steine" : ""].filter(Boolean).join(" und ") + "."}`);
      }
      if (shardsFirst && res.ap != null) {
        const n = shardsFirst, min = n * 10000, max = n * 25000;
        const what = bpStigma ? `die ${n} Splitter für ${bpStigma.name}` : `${n} Splitter für deine Kern-Stigmen`;
        costs.notes.push(res.ap >= max ? `Deine ${fmt(res.ap)} AP reichen für ${what}.` : res.ap >= min ? `Deine ${fmt(res.ap)} AP reichen je nach Preisstufe für ${what} (10.000–25.000 AP pro Splitter).` : `Für ${what} brauchst du ${fmt(min)}–${fmt(max)} AP; dir fehlen mindestens ${fmt(min - res.ap)}. Albtraum- und Shugo-Shop sind die Alternative.`);
      }
      if (res.kinah != null && weapon && w && itemLevel(w) < 78) costs.notes.push(`Für ${craftName}: Engpass-Material (${A.craftBottleneck}) am Handelsagenten mit deinen ${fmt(res.kinah)} Kinah gegenrechnen.`);
    }

    return {
      cls, clsName: clsData ? clsData.name : ch.profile.className, role, faction, gs, nextGate,
      verdict, candidates: cands, quick, today, times, gear, stigmas, shardsNeeded,
      emptyStones, badStones, boards, build, farm, waste, costs, hasArcana,
    };
  }

  window.DK_AUDIT = { analyse, shardsTo, enchantCost };
})();
