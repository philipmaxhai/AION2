/*
 * Daeva-Kompass – alle Spieldaten an einer Stelle.
 * Stand: 09.10.2026 (Global-Launch 05.10.2026). Quellen siehe DK_DATA.sources.
 * confidence: "ok" = mehrere Quellen einig, "community" = Community-Konsens,
 *             "offen" = Quellen widersprechen sich / nicht offiziell bestätigt.
 */
window.DK_DATA = {
  stand: "09.10.2026",

  /* ---------- Gearscore-Schwellen (Item-Level) ---------- */
  gates: [
    { gs: 1000, title: "Abyss · Prüfung", text: "Untere Reshanta (Lv 45) und Aufstiegsprüfung Leicht öffnen." },
    { gs: 1400, title: "Vakron & Urugugu", text: "Eroberung (Conquest) Stufe 2: Vakron Sky Island und Urugugu Canyon." },
    { gs: 1600, title: "Transzendenz 1", text: "Shattered Arkanis und Deus Research Base – Arkana-Karten." },
    { gs: 1900, title: "Transzendenz 2", text: "Zweite Transzendenz-Stufe, mehr Effekte, bessere Karten." },
    { gs: 2100, title: "Eroberung 3", text: "Eroberung Stufe 3: Enraged-Kromede-Waffen, Nuakum-Rüstung." },
    { gs: 2200, title: "Transzendenz 3", text: "Boss-Level steigt, Karten-Qualität steigt." },
    { gs: 2500, title: "Transzendenz 4", text: "Höchste Transzendenz-Stufe (Boss-Level 68)." }
  ],

  /* ---------- Gearscore-Fahrplan ---------- */
  stages: [
    { id: "basis", title: "Fundament", sub: "Billige Punkte, die viele mit 1400 noch liegen lassen", minGS: 0 },
    { id: "s1400", title: "Ab 1400", sub: "Vakron & Urugugu farmen, Wochenlimits voll nutzen", minGS: 1400 },
    { id: "s1600", title: "Ab 1600", sub: "Transzendenz öffnen, Arkana-Slots füllen", minGS: 1600 },
    { id: "s2100", title: "Ab 2100", sub: "Nächste Eroberungsstufe und Raids", minGS: 2100 }
  ],

  steps: [
    {
      id: "gurt-amulett", icon: "https://assets.playnccdn.com/static-aion2-gamedata/resources/Icon_Acc_Belt_C_022.png", stage: "basis", minGS: 0, prio: 1,
      title: "Gürtel & Amulett auf +10, dann auf Unique heben",
      gain: "Einer der größten frühen Sprünge",
      cadence: "Wöchentlich (Odyle-Handwerk)",
      where: "Festungen (Strongholds) für Gürtel-Schriftrollen, Monolith-Federn für Amulett-Schriftrollen",
      marker: "monolith",
      detail: "Erst auf +10 verstärken, danach per Substanzwandlung (Substance Morph) die Seltenheit anheben, mindestens auf Unique. Ohne das kommt man laut mehreren Guides kaum sauber über 1400.",
      confidence: "community"
    },
    {
      id: "daevanion", icon: "https://assets.playnccdn.com/static-aion2/characters/img/daevanion/board_icon_unique_open.png", stage: "basis", minGS: 0, prio: 2,
      title: "Alle Daevanion-Kristalle verteilen",
      gain: "Weiß ca. +1, Blau ca. +3, Gelb ca. +4 je Knoten",
      cadence: "Sofort, danach bei jedem neuen Kristall",
      where: "Menü › Daevanion",
      marker: null,
      detail: "Nicht ausgegebene Kristalle zählen nicht zum Gearscore. Wenn Punkte knapp sind: von jeder aktiven Fähigkeit zuerst den billigsten Knoten nehmen.",
      confidence: "offen"
    },
    {
      id: "runen", icon: "https://assets.playnccdn.com/static-aion2-gamedata/resources/Icon_Acc_Rune_R_002.png", stage: "basis", minGS: 0, prio: 3,
      title: "Beide Konfliktrunen (Clash Runes) tragen, je +1, dann aufhören",
      gain: "Ca. +40 bis +60 pro Rune (Quellen uneinig)",
      cadence: "Einmalig",
      where: "Ausrüstung › Runen-Slots",
      marker: null,
      detail: "Ab +2 zerstört ein Fehlschlag die Rune. +1 mitnehmen und dort stehen bleiben.",
      confidence: "community"
    },
    {
      id: "verstaerken", icon: "https://assets.playnccdn.com/static-aion2-gamedata/resources/Icon_Acc_Bracelet_R_027.png", stage: "basis", minGS: 0, prio: 4,
      title: "Waffe, Guard und Quest-Armband auf +10, Rest auf +3",
      gain: "Viel GS pro Verstärkungsstein",
      cadence: "Laufend",
      where: "Verstärken-Menü",
      marker: null,
      detail: "Reihenfolge Waffe › Guard › Armband. Die übrigen Teile nur auf +3, weil du sie mit Vakron- und Urugugu-Drops bald ersetzt.",
      confidence: "community"
    },
    {
      id: "federn", stage: "basis", minGS: 0, prio: 5,
      title: "Monolith-Federn (Empyrean Traces) sammeln",
      gain: "Amulett-Material, 560 Punkte bis Maximum",
      cadence: "Nebenbei beim Fliegen",
      where: "Monolithe in Verteron, Eltnen, Altgard, Morheim und im Abyss",
      marker: "monolith",
      detail: "187 Federn à 3 Punkte ergeben 561 Punkte. Abgabe am Monolithen deiner Region. Im Abyss gibt es eigene Federn, dort herrscht offenes PvP.",
      confidence: "community"
    },
    {
      id: "odyle", stage: "s1400", minGS: 1400, prio: 6,
      title: "Odyle-Energie nie überlaufen lassen, nur in Eroberung ausgeben",
      gain: "Jeder Würfel = Chance auf IL-70-Teile",
      cadence: "Alle 3 h +15 (120 pro Tag)",
      where: "Dungeon-Menü",
      marker: null,
      detail: "Cap 560 (840 mit Mitgliedschaft). Ein Belohnungswürfel kostet 40. Spare die Energie für Vakron und Urugugu statt für alte Erkundungs-Dungeons.",
      confidence: "community"
    },
    {
      id: "vakron", icon: "https://assets.playnccdn.com/static-aion2-gamedata/resources/Icon_Equip_AR_L_0028_T05_Torso.png", stage: "s1400", minGS: 1400, prio: 7,
      title: "Vakron Sky Island – Eroberung farmen",
      gain: "Rüstung IL 70",
      cadence: "Solange Odyle da ist",
      where: "Dungeon-Menü (2–5 Spieler, 60 Min)",
      marker: null,
      detail: "Bosse: Tiere (optional, beseitigt ihr Gift), Thamon, Vakron. Jeder getötete Zwischenboss legt zusätzliche Beute in den Würfel. Mehrere Runs füllen eine Pity-Belohnung. Gruppen verlangen oft etwa 200 GS über dem Minimum.",
      confidence: "community"
    },
    {
      id: "urugugu", icon: "https://assets.playnccdn.com/static-aion2-gamedata/resources/Icon_ACC_Ring_0072.png", iconKey: "aulamus", stage: "s1400", minGS: 1400, prio: 8,
      title: "Urugugu Canyon – Eroberung für Waffe & Schmuck",
      gain: "Aulamus-Waffen und -Accessoires IL 70",
      cadence: "Solange Odyle da ist",
      where: "Dungeon-Menü (2–5 Spieler)",
      marker: null,
      detail: "Vakron liefert vor allem Rüstung, Urugugu die Waffe und Accessoires. Spiritmaster: Aulamus-Orb ist das Ziel.",
      confidence: "offen"
    },
    {
      id: "albtraum", stage: "s1400", minGS: 1000, prio: 9,
      title: "Albtraum (Nightmare) jeden Tag",
      gain: "Phantasmal Fragments für den Albtraum-Shop",
      cadence: "2 Versuche pro Tag, bis 14 speicherbar",
      where: "Dungeon-Menü (Solo)",
      marker: null,
      detail: "Ein Versuch wird nur bei Erfolg verbraucht, ein Wipe kostet nichts. Jeder Boss hat Stufen 1 bis 10.",
      confidence: "ok"
    },
    {
      id: "aufstieg", stage: "s1400", minGS: 1000, prio: 10,
      title: "Aufstiegsprüfung (Ascension Trial) 3× pro Woche",
      gain: "Verstärkungssteine, Amplify-Stone-Fragmente",
      cadence: "3 Tickets pro Woche",
      where: "Dungeon-Menü (Solo, 6 Dungeons, ein Zähler)",
      marker: null,
      detail: "Leicht ab IL 1000, Hölle ab IL 3500. Nimm die höchste Stufe, die du sicher schaffst.",
      confidence: "community"
    },
    {
      id: "unterwerfung", stage: "s1400", minGS: 1000, prio: 11,
      title: "Unterwerfung (Subjugation) 3× pro Woche",
      gain: "Wochenbelohnungen",
      cadence: "3 Tickets pro Woche",
      where: "Dungeon-Menü (4 Spieler)",
      marker: null,
      detail: "Balaur-Basen: Beritra Brigade Fortress, Orcus's Grave, Fafnite Forge.",
      confidence: "community"
    },
    {
      id: "abyss", stage: "s1400", minGS: 1000, prio: 12,
      title: "Abyss-Zeit nutzen (Untere Reshanta)",
      gain: "Abyss-Punkte, Abyss-Federn, Artefakte",
      cadence: "7 h pro Woche je Schicht",
      where: "Untere Reshanta (Lv 45, IL 1000)",
      marker: "abyss",
      detail: "Zeitbudget statt Eintrittszähler, mit Mitgliedschaft 14 h für Untere und Mittlere Reshanta. Zur Artefakt-Belagerung (Mo/Do/Sa) einloggen.",
      confidence: "community"
    },
    {
      id: "tagesdungeon", stage: "s1400", minGS: 0, prio: 13,
      title: "Täglicher Dungeon und Pflichtmissionen",
      gain: "Material und Kinah",
      cadence: "14 Einträge pro Woche, 5 Missionen pro Tag",
      where: "Dungeon-Menü / Missionsfenster",
      marker: null,
      detail: "Läuft schnell nebenher. Pflichtmissionen zuerst, damit sie zum Reset nicht verfallen.",
      confidence: "community"
    },
    {
      id: "transzendenz1", stage: "s1600", minGS: 1600, prio: 14,
      title: "Transzendenz Stufe 1 täglich",
      gain: "Arkana-Karten (Slot = Gearscore)",
      cadence: "2 Belohnungen pro Dungeon und Tag (bis 4 gespeichert)",
      where: "Dungeon-Menü",
      marker: null,
      detail: "Shattered Arkanis: Spiegel, Pergament, Kelch (Bosse Siliator, Ruthilis, Talisra). Deus Research Base: Glocke, Kompass, Kelch (Bosse Gelcos, Nazmun, Atiel). Gemeinsamer Zähler lädt alle 12 h, max. 14. Wöchentlich höchstens 28 Endboss-Kills.",
      confidence: "community"
    },
    {
      id: "arkana", stage: "s1600", minGS: 1600, prio: 15,
      title: "Arkana-Slots füllen, dann auf Sets gehen",
      gain: "Großer GS-Hebel zwischen 1600 und 2100",
      cadence: "Laufend",
      where: "Menü › Arkana",
      marker: null,
      detail: "Erst jeden Slot belegen, dann Karten passend zum Set tauschen. Kelch droppt in beiden Transzendenz-Dungeons.",
      confidence: "community"
    },
    {
      id: "transzendenz2", stage: "s1600", minGS: 1900, prio: 16,
      title: "Transzendenz Stufe 2 (IL 1900)",
      gain: "Bessere Karten",
      cadence: "Täglich",
      where: "Dungeon-Menü",
      marker: null,
      detail: "Gleiche Dungeons, stärkere Bosse (Level steigt von 56 in Stufe 1 bis 68 in Stufe 4).",
      confidence: "community"
    },
    {
      id: "feuertempel", icon: "https://assets.playnccdn.com/static-aion2-gamedata/resources/Icon_ACC_Ring_0053.png", iconKey: "kromede", stage: "s2100", minGS: 2100, prio: 17,
      title: "Fire Temple – Eroberung",
      gain: "Enraged-Kromede-Waffen & -Schmuck IL 86",
      cadence: "Mit Odyle",
      where: "Dungeon-Menü (1–5 Spieler)",
      marker: null,
      detail: "Für Spiritmaster ist das Enraged Kromede Jewel der Orb (IL 86), kein Schmuckstück. Es gehört zu den meistgetragenen Waffen.",
      confidence: "community"
    },
    {
      id: "horn", icon: "https://assets.playnccdn.com/static-aion2-gamedata/resources/Icon_Equip_AR_L_Idris_01_Torso.png", stage: "s2100", minGS: 2100, prio: 18,
      title: "Ferocious Horn Den – Eroberung",
      gain: "Nuakum-Rüstung und Guard",
      cadence: "Mit Odyle",
      where: "Dungeon-Menü (1–5 Spieler)",
      marker: null,
      detail: "Der Nuakum-Helm ist auf Global einer der beliebtesten Helme, üblich auf +10 bis +15.",
      confidence: "offen"
    },
    {
      id: "raids", stage: "s2100", minGS: 2100, prio: 19,
      title: "Heiligtum-Raids (Abyssal Forge)",
      gain: "Endgame-Waffen, z. B. Ludra's Abyssal Jade (Orb, IL 102)",
      cadence: "4 Versuche pro Raid und Woche",
      where: "Dungeon-Menü (10 Spieler)",
      marker: null,
      detail: "Ludra, Chalice of Muspel, Corroded Decontamination Facility. Ein Eintritts-IL ist bisher nicht veröffentlicht.",
      confidence: "offen"
    }
  ],

  /* ---------- Spielzeiten ----------
   * tz: Zeitzone, in der die Quelle die Zeit angibt.
   * kind: "interval" (alle every Min ab start), "fixed" (times[]).
   * days: 0=So … 6=Sa, null = täglich. dur: Dauer in Minuten.
   */
  events: [
    { id: "reset", name: "Tages-Reset", short: "Reset", kind: "fixed", tz: "UTC", times: ["07:00"], days: null, dur: 0,
      lane: "Reset", where: "Überall", what: "Pflichtmissionen, Albtraum-Versuche, Tageslimits", confidence: "community",
      note: "Global-Reset 07:00 UTC. Im Spiel zeigt der Tooltip eines Zählers die exakte Restzeit." },
    { id: "wreset", name: "Wochen-Reset (Mittwoch)", short: "Woche", kind: "fixed", tz: "UTC", times: ["07:00"], days: [3], dur: 0,
      lane: "Reset", where: "Überall", what: "Abyss-Zeit, Aufstiegsprüfung, Unterwerfung, Täglicher Dungeon, Raids", confidence: "community",
      note: "Mittwoch zur selben Uhrzeit wie der Tages-Reset." },
    { id: "riss", name: "Raumzeit-Riss (Spacetime Rift)", short: "Riss", kind: "interval", tz: "UTC", start: "00:00", every: 180, days: null, dur: 10,
      lane: "Riss", where: "Eigene Heimatregion › führt ins Feindgebiet", what: "Quests und Beute im Feindgebiet (ab Lv 45)", confidence: "community", marker: "riss",
      note: "Alle 3 h, Eingang ca. 10 Min offen, drinnen hast du etwa eine Stunde. Manche Seiten nennen dieselben Zeiten als Berliner Ortszeit; nach der Zeitumstellung am 25.10. bitte im Spiel prüfen." },
    { id: "shugo", name: "Shugo-Fest", short: "Shugo", kind: "interval", tz: "UTC", start: "00:00", every: 60, days: null, dur: 10,
      lane: "Stündlich", where: "Event-Instanz", what: "Schlüssel ausgeben (3 Aufladungen pro Tag)", confidence: "community",
      note: "Zur vollen Stunde. Dauer laut Quellen 5 bis 10 Minuten." },
    { id: "invasion", name: "Dimensionsinvasion", short: "Invasion", kind: "interval", tz: "UTC", start: "00:30", every: 60, days: null, dur: 15,
      lane: "Stündlich", where: "Event", what: "Schlüssel ausgeben (3 Aufladungen pro Tag)", confidence: "offen",
      note: "Zur halben Stunde laut koreanischem Zeitplan, für Global noch nicht bestätigt." },
    { id: "belagerung", name: "Artefakt-Belagerung", short: "Belagerung", kind: "fixed", tz: "Europe/Berlin", times: ["21:00"], days: [1, 4, 6], dur: 30,
      lane: "Abyss", where: "Abyss (Reshanta)", what: "Artefakte erobern, Abyss-Punkte", confidence: "offen", marker: "artefakt",
      note: "Mo, Do, Sa ca. 30 Min. Ob 21:00 Berliner Zeit oder UTC gilt, ist umstritten. Mit dem Versatz unten anpassbar." },
    { id: "kaira", name: "Wächter Kaira (Feldboss)", short: "Kaira", kind: "interval", tz: "Europe/Berlin", start: "01:00", every: 180, days: null, dur: 15,
      lane: "Bosse", where: "Ort per Weltboss-Ansage im Spiel", what: "Feldboss-Beute", confidence: "offen",
      note: "Community-Muster alle 3 h ab 01:00. Taiwan nutzt einen 4-h-Rhythmus. Unbestätigt." },
    { id: "nahma", name: "Wächterfürst Nahma", short: "Nahma", kind: "fixed", tz: "Europe/Berlin", times: ["21:00"], days: [5, 0], dur: 30,
      lane: "Bosse", where: "Ort per Weltboss-Ansage im Spiel", what: "Wöchentlicher Boss", confidence: "offen",
      note: "Fr und So, 21:00 Serverzeit laut Community. Unbestätigt." }
  ],

  /* ---------- Checkliste ---------- */
  checklist: {
    daily: [
      { id: "pflicht", label: "Pflichtmissionen", max: 5, hint: "5 pro Tag" },
      { id: "albtraum", label: "Albtraum (Nightmare)", max: 2, hint: "Nur Siege verbrauchen Versuche" },
      { id: "odyle", label: "Odyle unter Cap ausgegeben", max: 1, hint: "Vakron / Urugugu Eroberung" },
      { id: "schluessel", label: "Shugo-/Invasions-Schlüssel genutzt", max: 1, hint: "3 Aufladungen pro Tag" },
      { id: "trans", label: "Transzendenz-Belohnungen", max: 4, hint: "Ab IL 1600, 2 je Dungeon" },
      { id: "riss", label: "Raumzeit-Riss gemacht", max: 1, hint: "Optional, alle 3 h" },
      { id: "federn", label: "Federn eingesammelt", max: 1, hint: "Bis das Amulett fertig ist" }
    ],
    weekly: [
      { id: "tagesdungeon", label: "Täglicher Dungeon", max: 14, hint: "14 pro Woche" },
      { id: "aufstieg", label: "Aufstiegsprüfung", max: 3, hint: "3 Tickets" },
      { id: "unterwerfung", label: "Unterwerfung", max: 3, hint: "3 Tickets, 4er-Gruppe" },
      { id: "abyss-u", label: "Abyss: Untere Reshanta (Stunden)", max: 7, hint: "7 h Budget" },
      { id: "belagerung", label: "Artefakt-Belagerung", max: 3, hint: "Mo / Do / Sa" },
      { id: "morph", label: "Substanzwandlung", max: 4, hint: "4 pro Charakter" },
      { id: "festung", label: "Festungen für Gürtel-Material", max: 1, hint: "Bis Gürtel Unique" },
      { id: "raid", label: "Heiligtum-Raid-Versuche", max: 4, hint: "Ab später, 4 pro Raid" }
    ]
  },

  /* ---------- Karte ----------
   * Schematisch. Koordinaten im viewBox 0 0 800 1300, regionsgenau, nicht koordinatengenau.
   */
  regions: [
    { id: "poeta", name: "Poeta", faction: "elyos", cx: 135, cy: 120, rx: 85, ry: 62, seed: 3, level: "Lv 1–9",
      text: "Startgebiet der Elyos. Für dich nur noch wegen Sammelaufgaben interessant." },
    { id: "verteron", name: "Verteron", faction: "elyos", cx: 410, cy: 290, rx: 245, ry: 160, seed: 7, level: "Lv 10–45",
      text: "Heimat der Elyos. Hier holst du Federn für die Monolithe, Gürtel-Material aus Festungen, Feldbosse und den Riss ins Feindgebiet." },
    { id: "eltnen", name: "Eltnen", faction: "elyos", cx: 680, cy: 125, rx: 98, ry: 78, seed: 11, level: "Lv 45+",
      text: "Zweite Elyos-Region, öffnet später in der Story. Ein Monolith und hochstufige Feldbosse." },
    { id: "untere", name: "Untere Reshanta", faction: "abyss", cx: 190, cy: 650, rx: 140, ry: 92, seed: 5, level: "Lv 45 · IL 1000",
      text: "Erste Abyss-Schicht. 7 h pro Woche. Abyss-Punkte, eigene Federn und Monolithe, 3 Artefakte. Offenes PvP." },
    { id: "mittlere", name: "Mittlere Reshanta", faction: "abyss", cx: 455, cy: 625, rx: 130, ry: 85, seed: 13, level: "Lv 45+ · IL-Gate offen",
      text: "Zweite Abyss-Schicht mit weiteren Artefakten und der Artefakt-Belagerung. Eintritts-IL unterschiedlich angegeben." },
    { id: "obere", name: "Obere Reshanta", faction: "abyss", cx: 675, cy: 690, rx: 98, ry: 70, seed: 17, level: "Lv 45+",
      text: "Oberste Schicht. Laut Quellen ohne Artefakte." },
    { id: "altgard", name: "Altgard", faction: "asmo", cx: 395, cy: 1010, rx: 245, ry: 160, seed: 19, level: "Lv 10–45",
      text: "Heimat der Asmodier. Federn und Monolithe, Festungen für Gürtel-Material, Feldbosse und der Riss ins Feindgebiet." },
    { id: "morheim", name: "Morheim", faction: "asmo", cx: 125, cy: 1180, rx: 98, ry: 78, seed: 23, level: "Lv 45+",
      text: "Zweite Asmodier-Region, öffnet später in der Story. Ein Monolith und neue Feldbosse." },
    { id: "ishalgen", name: "Ishalgen", faction: "asmo", cx: 665, cy: 1185, rx: 85, ry: 62, seed: 29, level: "Lv 1–9",
      text: "Startgebiet der Asmodier." }
  ],

  places: [
    { region: "verteron", name: "Cantas Valley", x: 330, y: 205 },
    { region: "verteron", name: "Südl. Altamia-Hochland", x: 470, y: 405 },
    { region: "altgard", name: "Safe Haven", x: 285, y: 958 },
    { region: "altgard", name: "Nornir Assembly", x: 470, y: 1078 },
    { region: "eltnen", name: "Fractured Land", x: 690, y: 188 }
  ],

  markers: [
    /* Monolithe */
    { id: "mono-dawn", type: "monolith", region: "verteron", faction: "elyos", x: 352, y: 240, name: "Monolith – Dawn Legion Base",
      text: "Federn hier abgeben, Amulett-Schriftrollen holen. Kibelisk: Dawn Legion Base (Cantas Valley).", step: "federn" },
    { id: "mono-zumion", type: "monolith", region: "verteron", faction: "elyos", x: 565, y: 235, name: "Monolith – Zumion Village",
      text: "Zweiter Verteron-Monolith. Kibelisk: Zumion Village.", step: "federn" },
    { id: "mono-eltnen", type: "monolith", region: "eltnen", faction: "elyos", x: 628, y: 160, name: "Monolith – Eltnen",
      text: "Monolith der zweiten Elyos-Region.", step: "federn" },
    { id: "mono-safe", type: "monolith", region: "altgard", faction: "asmo", x: 300, y: 985, name: "Monolith – Safe Haven",
      text: "Federn hier abgeben, Amulett-Schriftrollen holen. Kibelisk: Safe Haven.", step: "federn" },
    { id: "mono-nornir", type: "monolith", region: "altgard", faction: "asmo", x: 455, y: 1052, name: "Monolith – Nornir Assembly",
      text: "Zweiter Altgard-Monolith. Kibelisk: Nornir Assembly.", step: "federn" },
    { id: "mono-morheim", type: "monolith", region: "morheim", faction: "asmo", x: 140, y: 1150, name: "Monolith – Morheim",
      text: "Monolith der zweiten Asmodier-Region.", step: "federn" },
    { id: "mono-u1", type: "monolith", region: "untere", faction: "abyss", x: 120, y: 598, name: "Abyss-Monolith (Untere 1)",
      text: "Abyss-Federn abgeben. Offenes PvP, Feder-Camper einplanen.", step: "abyss" },
    { id: "mono-u2", type: "monolith", region: "untere", faction: "abyss", x: 250, y: 702, name: "Abyss-Monolith (Untere 2)",
      text: "Zweiter Monolith der Unteren Reshanta.", step: "abyss" },
    { id: "mono-m1", type: "monolith", region: "mittlere", faction: "abyss", x: 405, y: 672, name: "Abyss-Monolith (Mittlere 1)",
      text: "Monolith der Mittleren Reshanta.", step: "abyss" },
    { id: "mono-m2", type: "monolith", region: "mittlere", faction: "abyss", x: 525, y: 680, name: "Abyss-Monolith (Mittlere 2)",
      text: "Zweiter Monolith der Mittleren Reshanta.", step: "abyss" },

    /* Artefakte */
    { id: "art-u1", type: "artefakt", region: "untere", faction: "abyss", x: 92, y: 688, name: "Artefakt (Untere)", event: "belagerung",
      text: "Eines von 3 Artefakten der Unteren Reshanta. Bei der Belagerung umkämpft.", step: "abyss" },
    { id: "art-u2", type: "artefakt", region: "untere", faction: "abyss", x: 190, y: 588, name: "Artefakt (Untere)", event: "belagerung",
      text: "Eines von 3 Artefakten der Unteren Reshanta.", step: "abyss" },
    { id: "art-u3", type: "artefakt", region: "untere", faction: "abyss", x: 172, y: 712, name: "Artefakt (Untere)", event: "belagerung",
      text: "Eines von 3 Artefakten der Unteren Reshanta.", step: "abyss" },
    { id: "art-m1", type: "artefakt", region: "mittlere", faction: "abyss", x: 395, y: 572, name: "Artefakt (Mittlere)", event: "belagerung",
      text: "Eines von 3 Artefakten der Mittleren Reshanta.", step: "abyss" },
    { id: "art-m2", type: "artefakt", region: "mittlere", faction: "abyss", x: 470, y: 562, name: "Artefakt (Mittlere)", event: "belagerung",
      text: "Eines von 3 Artefakten der Mittleren Reshanta.", step: "abyss" },
    { id: "art-m3", type: "artefakt", region: "mittlere", faction: "abyss", x: 540, y: 580, name: "Artefakt (Mittlere)", event: "belagerung",
      text: "Eines von 3 Artefakten der Mittleren Reshanta.", step: "abyss" },

    /* Risse */
    { id: "riss-elyos", type: "riss", region: "verteron", faction: "elyos", x: 500, y: 330, name: "Raumzeit-Riss (Verteron)", event: "riss",
      text: "Risse öffnen sich in deiner Heimat und führen nach Altgard. Genaue Position wechselt, die Ansage im Spiel zeigt sie." },
    { id: "riss-asmo", type: "riss", region: "altgard", faction: "asmo", x: 300, y: 1060, name: "Raumzeit-Riss (Altgard)", event: "riss",
      text: "Risse öffnen sich in deiner Heimat und führen nach Verteron. Genaue Position wechselt, die Ansage im Spiel zeigt sie." },

    /* Trainingspuppen */
    { id: "dummy-elyos", type: "puppe", region: "verteron", faction: "elyos", x: 345, y: 212, name: "Trainingspuppen (Verteron)",
      text: "Nördlich vom Monolithen an der Dawn Legion Base. Ideal, um die Spiritmaster-Rotation zu testen." },
    { id: "dummy-asmo", type: "puppe", region: "altgard", faction: "asmo", x: 330, y: 945, name: "Trainingspuppen (Altgard)",
      text: "Von Safe Haven Richtung Nordosten zum Kommandozentrum." },

    /* Feldbosse – Respawn startet beim Kill */
    { id: "fb-dartan", type: "boss", region: "verteron", faction: "elyos", x: 455, y: 380, name: "Silent Dartan",
      text: "Feldboss im südlichen Altamia-Hochland.", respawn: null },
    { id: "fb-kashapa", type: "boss", region: "verteron", faction: "elyos", x: 285, y: 320, name: "Soul Ruler Kashapa",
      text: "Feldboss in Verteron. Position ungefähr.", respawn: null },
    { id: "fb-lagta", type: "boss", region: "verteron", faction: "elyos", x: 590, y: 330, name: "High Commander Lagta",
      text: "Feldboss in Verteron. Position ungefähr.", respawn: null },
    { id: "fb-kernon", type: "boss", region: "verteron", faction: "elyos", x: 205, y: 270, name: "Kernon of the West",
      text: "Feldboss im Westen Verterons. Ursprünglich 1 h Respawn.", respawn: 60 },
    { id: "fb-neikel", type: "boss", region: "verteron", faction: "elyos", x: 625, y: 265, name: "Neikel of the East",
      text: "Feldboss im Osten Verterons. Ursprünglich 1 h Respawn.", respawn: 60 },
    { id: "fb-nihogg", type: "boss", region: "eltnen", faction: "elyos", x: 738, y: 160, name: "Rabid Nihogg",
      text: "Hochstufiger Feldboss im Fractured Land.", respawn: null },
    { id: "fb-shujakan", type: "boss", region: "altgard", faction: "asmo", x: 225, y: 1010, name: "Veteran Shujakan",
      text: "Feldboss in Altgard. Position ungefähr.", respawn: null },
    { id: "fb-karuka", type: "boss", region: "altgard", faction: "asmo", x: 390, y: 925, name: "Visionary Karuka",
      text: "Feldboss in Altgard. Position ungefähr.", respawn: null },
    { id: "fb-gartua", type: "boss", region: "altgard", faction: "asmo", x: 545, y: 990, name: "Immortal Gartua",
      text: "Feldboss in Altgard. Position ungefähr.", respawn: null },
    { id: "fb-shylak", type: "boss", region: "altgard", faction: "asmo", x: 410, y: 1120, name: "Sharp Shylak",
      text: "Feldboss in Altgard. Position ungefähr.", respawn: null }
  ],

  /* Instanzen ohne Laufweg – startet man über das Dungeon-Menü */
  menuContent: [
    { name: "Vakron Sky Island", req: "Lv 45 · IL 1400", info: "Eroberung, 2–5 Spieler, 60 Min", step: "vakron" },
    { name: "Urugugu Canyon", req: "Lv 45 · IL 1400", info: "Eroberung, 2–5 Spieler", step: "urugugu" },
    { name: "Albtraum (Nightmare)", req: "Lv 45", info: "Solo, 2 pro Tag", step: "albtraum" },
    { name: "Aufstiegsprüfung", req: "IL 1000", info: "Solo, 3 pro Woche", step: "aufstieg" },
    { name: "Unterwerfung", req: "Lv 45", info: "4 Spieler, 3 pro Woche", step: "unterwerfung" },
    { name: "Transzendenz", req: "IL 1600", info: "Arkana-Karten", step: "transzendenz1" },
    { name: "Fire Temple / Horn Den", req: "IL 2100", info: "Eroberung Stufe 3", step: "feuertempel" }
  ],

  /* ---------- Klassen ---------- */
  classes: [
    {
      id: "spiritmaster", name: "Spiritmaster", de: "Beschwörer", role: "Beschwörer / Kontrolle", weapon: "Orb",
      range: "Fernkampf, magisch", element: "geist",
      summary: "Kämpft mit Elementargeistern. Stark in Kontrolle und Dauer-Schaden, braucht saubere Geist-Steuerung.",
      tier: "In Tier-Listen uneinig (B bis C). Die Earth-Tank-plus-Summon-Variante gilt bei manchen als stärkster PvE-Build.",
      stats: ["Genauigkeit bis zum Boss-Cap (frühe Marke ca. 1500)", "Angriff und Schadensbonus", "Kritischer Schaden", "Abklingzeit-Reduktion (ca. 20 %) und Kampfgeschwindigkeit"],
      gsFocus: ["Orb zuerst verstärken", "Dann Guard und Quest-Armband", "Helm mit Doppelchance / Geisterschlag"],
      gearPath: [
        { slot: "Waffe", path: "Aulamus' Orb (Urugugu, IL 70) oder Orb des Schwarzen bzw. Weißen Drachenkönigs (Alchemie, IL 78) › Juwel der Wütenden Kromede (Fire Temple, IL 86) › Ludra's Abyssal Jade (Raid, IL 102)" },
        { slot: "Guard", path: "Schützer des Schwarzen bzw. Weißen Drachenkönigs (Schmieden, IL 78) › Nuakums Schützer (Ferocious Horn Den, IL 86)" },
        { slot: "Rüstung", path: "Vakrons Rüstung (IL 70) › Nuakums Rüstung (Ferocious Horn Den, IL 86), Nuakums Helm besonders beliebt" },
        { slot: "Schmuck", path: "Aulamus' Halskette, Ohrringe und Ring (Urugugu, IL 70)" },
        { slot: "Verstärkung", path: "Auf Global üblich +10 bis +15 auf den Kernteilen" }
      ],
      extra: {
        spirits: [
          { name: "Feuergeist", text: "Standard für PvE-Schaden. Beschwörung: Feuergeist (Summon: Fire Spirit) auf Rang 20 oder höher." },
          { name: "Erdgeist", text: "Tank-Geist. In Nutzungsstatistiken selten, in der Erdgeist-Tank-Variante aber Kern des Builds." },
          { name: "Wassergeist", text: "MP-Unterstützung, niedrige Priorität." },
          { name: "Uralter Naturgeist", text: "Stigma Beschwörung: Uralter Naturgeist (Summon: Ancient Spirit). Wichtigstes Stigma, siehe Stigmen." }
        ],
        stigmas: [
          { name: "Beschwörung: Uralter Naturgeist (Summon: Ancient Spirit)", text: "Zuerst und so schnell wie möglich auf Rang 15. Dann braucht Elementarfusion nur noch 5 statt 7 Auto-Angriffe." },
          { name: "Koordinationsangriff: Korrosion (Jointstrike: Corrode)", text: "Fester Bestandteil fast aller PvE-Builds." },
          { name: "Flammensegen (Flame Blessing) oder Fluchwolke (Cursed Cloud)", text: "Dritter Slot, Guides sind sich uneinig." },
          { name: "Verstärkung: Gnade des Naturgeists (Enhance: Spirit's Benediction)", text: "Vierter Slot." }
        ],
        skills: [
          { name: "Elementarfusion (Elemental Fusion)", rank: "20+" },
          { name: "Einäscherung (Combustion)", rank: "20+" },
          { name: "Beschwörung: Feuergeist (Summon: Fire Spirit)", rank: "20+" },
          { name: "Kälteschock (Cold Shock)", rank: "12" },
          { name: "Koordinationsangriff: Fluch (Jointstrike: Curse)", rank: "12" },
          { name: "Raumbeherrschung (Dimensional Control)", rank: "12" }
        ],
        daevanion: [
          "Nezekan: zuerst das Geisterschlag-Paar (Spirit Strike, bufft dich und den Geist)",
          "Zikel: Kontinuierlicher Rückfluss (Consecutive Countercurrent) und Elementarvereinigung (Element Unification)",
          "Bei wenig Punkten: von jeder Aktiv-Fähigkeit zuerst den billigsten Knoten"
        ],
        gearStats: [
          { slot: "Orb / Guard", stats: "Kampfgeschwindigkeit, Schadensbonus, Macht, Präzision, Waffenschadensbonus" },
          { slot: "Helm", stats: "Doppelchance, Angriffssteigerung, Angriff, Mentale Konzentration, Geisterschlag" },
          { slot: "Passive auf Gear", stats: "Geisterschlag, Mentale Konzentration, Elementarvereinigung" }
        ],
        rotation: [
          "Feuergeist und Uralten Naturgeist vor dem Pull beschwören",
          "Koordinationsangriff: Fluch / Korrosion auf das Ziel",
          "Auto-Angriffe laufen lassen, bis Elementarfusion bereit ist (5 Angriffe mit Uraltem Naturgeist auf Rang 15)",
          "Einäscherung und Elementarfusion in Burst-Fenstern bündeln",
          "Kälteschock und Raumbeherrschung für Kontrolle und Adds"
        ]
      }
    },
    {
      id: "gladiator", name: "Gladiator", de: "Gladiator", role: "Nahkampf-DPS / Flächenschaden", weapon: "Großschwert",
      range: "Nahkampf, physisch", element: "stahl",
      summary: "Robuster Flächenschaden, verzeiht Fehler. In fast allen Tier-Listen weit oben.",
      tier: "Konstant S bis A für Schaden, auch als Ersatz-Tank brauchbar.",
      stats: ["Genauigkeit bis Cap", "Angriff / Schadensbonus", "Krit und Krit-Schaden", "Kampfgeschwindigkeit"],
      gsFocus: ["Waffe zuerst", "Guard", "Armband"],
      gearPath: [
        { slot: "Waffe", path: "Aulamus (Urugugu) › Enraged Kromede (Fire Temple) › Raid-Waffe" },
        { slot: "Rüstung", path: "Vakron (IL 70) › Nuakum (Ferocious Horn Den)" }
      ]
    },
    {
      id: "templar", name: "Templar", de: "Templer", role: "Tank", weapon: "Schwert & Schild",
      range: "Nahkampf, physisch", element: "stahl",
      summary: "Der Konsens-Tank. Findet für Vakron und Raids am schnellsten eine Gruppe.",
      tier: "Bester Tank (S in PvE-Rollenlisten), als DPS schwächer bewertet.",
      stats: ["Genauigkeit für sicheres Aggro", "Lebenspunkte / Verteidigung", "Blocken / Ausweichen", "Danach Angriff"],
      gsFocus: ["Waffe und Guard (Schild) parallel", "Rüstung früh auf +10", "Armband"],
      gearPath: [
        { slot: "Waffe/Schild", path: "Aulamus (Urugugu) › Enraged Kromede / Nuakum-Guard" },
        { slot: "Rüstung", path: "Vakron (IL 70) › Nuakum (Ferocious Horn Den)" }
      ]
    },
    {
      id: "assassin", name: "Assassin", de: "Assassine", role: "Burst-DPS / Tarnung", weapon: "Dolche",
      range: "Nahkampf, physisch", element: "schatten",
      summary: "Hoher Einzelziel-Burst, Positionsschaden von hinten. Stark in PvP und Bosskämpfen.",
      tier: "Meist S bis A für Schaden.",
      stats: ["Genauigkeit bis Cap", "Krit und Krit-Schaden", "Angriff / Schadensbonus", "Kampfgeschwindigkeit"],
      gsFocus: ["Waffe zuerst", "Guard", "Armband"],
      gearPath: [
        { slot: "Waffe", path: "Aulamus (Urugugu) › Enraged Kromede (Fire Temple) › Raid-Waffe" },
        { slot: "Rüstung", path: "Vakron (IL 70) › Nuakum (Ferocious Horn Den)" }
      ]
    },
    {
      id: "ranger", name: "Ranger", de: "Jäger", role: "Fernkampf-DPS, physisch", weapon: "Bogen",
      range: "Fernkampf, physisch", element: "wind",
      summary: "Sicherer Schaden auf Distanz, hohe Mobilität. Bringt eigene Krit- und Genauigkeits-Buffs mit.",
      tier: "Stark schwankend zwischen S und B.",
      stats: ["Genauigkeit (eigene Buffs einrechnen)", "Angriff / Schadensbonus", "Krit-Schaden", "Kampfgeschwindigkeit"],
      gsFocus: ["Bogen zuerst", "Guard", "Armband"],
      gearPath: [
        { slot: "Waffe", path: "Aulamus (Urugugu) › Enraged Kromede (Fire Temple) › Raid-Waffe" },
        { slot: "Rüstung", path: "Vakron (IL 70) › Nuakum (Ferocious Horn Den)" }
      ]
    },
    {
      id: "sorcerer", name: "Sorcerer", de: "Zauberer", role: "Fernkampf-DPS, magisch", weapon: "Zauberbuch",
      range: "Fernkampf, magisch", element: "arkan",
      summary: "Hoher magischer Burst und Flächenschaden, wenig Selbstschutz.",
      tier: "Meist A bis B.",
      stats: ["Genauigkeit bis Cap", "Angriff / Schadensbonus", "Krit-Schaden", "Abklingzeit-Reduktion"],
      gsFocus: ["Waffe zuerst", "Guard", "Armband"],
      gearPath: [
        { slot: "Waffe", path: "Aulamus (Urugugu) › Enraged Kromede (Fire Temple) › Raid-Waffe" },
        { slot: "Rüstung", path: "Vakron (IL 70) › Nuakum (Ferocious Horn Den)" }
      ]
    },
    {
      id: "cleric", name: "Cleric", de: "Kleriker", role: "Heiler", weapon: "Streitkolben",
      range: "Mittel, magisch", element: "licht",
      summary: "Haupt-Heiler. Die Heilung skaliert mit Angriff, reine Verteidigungs-Werte schwächen Heilung und Schaden.",
      tier: "Konsens-Heiler (S in PvE-Rollenlisten).",
      stats: ["Angriff (skaliert die Heilung)", "Genauigkeit", "Abklingzeit-Reduktion", "Überleben"],
      gsFocus: ["Waffe zuerst (Heilung skaliert mit Angriff)", "Guard", "Armband"],
      gearPath: [
        { slot: "Waffe", path: "Aulamus (Urugugu) › Enraged Kromede (Fire Temple) › Raid-Waffe" },
        { slot: "Rüstung", path: "Vakron (IL 70) › Nuakum (Ferocious Horn Den)" }
      ]
    },
    {
      id: "chanter", name: "Chanter", de: "Kantor", role: "Support / Nahkampf-Hybrid", weapon: "Stab",
      range: "Nahkampf, Hybrid", element: "klang",
      summary: "Buffs für die Gruppe plus solider Nahkampfschaden. Gern gesehen in Vakron-Gruppen.",
      tier: "Meist A bis B, stark abhängig von der Gruppe.",
      stats: ["Genauigkeit", "Angriff / Schadensbonus", "Abklingzeit-Reduktion", "Überleben"],
      gsFocus: ["Waffe zuerst", "Guard", "Armband"],
      gearPath: [
        { slot: "Waffe", path: "Aulamus (Urugugu) › Enraged Kromede (Fire Temple) › Raid-Waffe" },
        { slot: "Rüstung", path: "Vakron (IL 70) › Nuakum (Ferocious Horn Den)" }
      ]
    }
  ],

  donts: [
    "Odyle-Energie in alte Erkundungs-Dungeons stecken. Sie gehört in Vakron und Urugugu.",
    "Konfliktrunen über +1 verstärken. Ab +2 kann die Rune zerbrechen.",
    "Teile, die du bald ersetzt, über +3 verstärken.",
    "Teure Manasteine in Übergangs-Gear sockeln. Manasteine und Seelensteine wandern beim normalen Gear-Transfer nicht mit.",
    "Odyle am Cap stehen lassen. Alles über 560 (840 mit Mitgliedschaft) verfällt.",
    "Daevanion-Kristalle horten. Unverteilt zählen sie 0 GS."
  ],

  sources: [
    { name: "Daevanion-Builds je Klasse, Bretter bekannter Spieler (AION2 Vault)", url: "https://aion2vault.com/builds/gladiator/daevanion/" },
    { name: "Daevanion-Guide: Kosten, Punkte, Prioritäten je Klasse (Metabot)", url: "https://metabot.gg/en/aion-2/guides/daevanion-guide" },
    { name: "Daevanion-Planer mit Brett-Daten aller Klassen (GameWith)", url: "https://gamewith.ai/aion2/en/daevanion-planner" },
    { name: "Aion 2 Gear Score Guide (Corpus)", url: "https://corpus.gg/blog/aion-2/gear-score-guide" },
    { name: "Gear Score Farming 1400–2100 (Skycoach)", url: "https://skycoach.gg/blog/aion-2/articles/how-to-farm-gs" },
    { name: "Progression 45 bis 2100 (Raid Relay)", url: "https://raidrelay.com/aion-2-gear-score-guide" },
    { name: "Dungeons & Odyle (GameTruth)", url: "https://www.gametruth.com/guides/aion-2-dungeons-and-odyle-energy/" },
    { name: "Dungeon-Anforderungen (Leprestore)", url: "https://leprestore.com/guides/aion2/dungeon-requirements/" },
    { name: "Vakron Sky Island Drops (AllThings.how)", url: "https://allthings.how/vakron-sky-island-drop-rates-every-aion-2-boss-and-reward/" },
    { name: "Transzendenz-Guide (ExpCarry)", url: "https://expcarry.com/aion-2-transcendence-dungeons-guide" },
    { name: "Daily & Weekly Checklist (Metabot)", url: "https://metabot.gg/en/aion-2/guides/daily-weekly-checklist" },
    { name: "Tägliche/wöchentliche Checkliste (ExpCarry, DE)", url: "https://expcarry.com/de/aion-2-taegliche-woechentliche-checkliste" },
    { name: "Daily Reset & Weekly Reset (Aion2Timers)", url: "https://www.aion2timers.com/daily-reset/" },
    { name: "Event-Zeitplan (Metabot)", url: "https://metabot.gg/en/aion-2/events" },
    { name: "Spacetime Rift Timer (Metabot)", url: "https://metabot.gg/en/aion-2/events/spacetime-rift" },
    { name: "Boss-Zeitplan (Questlog)", url: "https://questlog.gg/aion-2/en/boss-schedule" },
    { name: "Feldbosse (Wikily)", url: "https://wikily.gg/aion-2/bosses" },
    { name: "Monolithe (Metabot)", url: "https://metabot.gg/en/aion-2/monoliths" },
    { name: "Interaktive Karte mit Koordinaten (aion2.th.gl)", url: "https://aion2.th.gl/" },
    { name: "Interaktive Karte (Wikily)", url: "https://wikily.gg/aion-2/interactive-map" },
    { name: "Abyss-Guide (Wikily)", url: "https://wikily.gg/aion-2/abyss" },
    { name: "Spiritmaster-Guide (Aion2 Maps)", url: "https://aion2maps.com/guides/spiritmaster/" },
    { name: "Spiritmaster-Build (Aion2-Meta)", url: "https://aion2-meta.com/guides/spiritmaster/" },
    { name: "Spiritmaster BiS (Aionbuilds, EU)", url: "https://aionbuilds.com/en/items/class/spiritmaster" },
    { name: "Stats & Manasteine (Odealo)", url: "https://odealo.com/articles/best-stats-manastones-for-every-class-aion-2-guide" },
    { name: "Klassen-Tierliste (KeenGamer)", url: "https://www.keengamer.com/articles/guides/aion-2-best-class-tier-list-pve-pvp-solo/" },
    { name: "Server-Wartung & Launch (Mein-MMO)", url: "https://mein-mmo.de/en/aion-2-servers-are-live-everything-about-status-time-patch-notes-and-more-for-the-release-in-the-live-ticker,1590795/" },
    { name: "Item-Datenbank: Drops, Verstärkung, Rezepte (Metabot)", url: "https://metabot.gg/en/aion-2/items/aulamus-orb" },
    { name: "Urugugu Canyon Beute & Pity (Metabot)", url: "https://metabot.gg/en/aion-2/dungeons/urugugu-canyon" },
    { name: "Vakron Sky Island Beute & Pity (Metabot)", url: "https://metabot.gg/en/aion-2/dungeons/vakron-sky-island" },
    { name: "Kern-Stigmen nach Klasse (Aion2-Meta)", url: "https://aion2-meta.com/guides/spiritmaster/" },
    { name: "Stigma-Kosten (VGTimes)", url: "https://vgtimes.com/guides/170418-aion-2-stigma-guide-best-skills-and-how-to-upgrade-them.html" },
    { name: "Gear-Transfer (Game8)", url: "https://game8.co/games/Aion-2/archives/616977" }
  ],

  /* ---------- Charakter-Check: Upgrade-Stufen und Klassenregeln ----------
   * Quellen: Spieldaten des Global-Clients über Metabot (Drops, Rezepte, Verstärkung),
   * Kern-Stigmen aus Nutzungsdaten koreanischer Top-Spieler (Aion2-Meta).
   */
  /* Daevanion: Prioritäten je Klasse für PvE (englische Namen wie in der Armory, Anzeige deutsch aus data-daevanion.js).
   * core: aktive Skills, deren Knoten auf jedem PvE-Brett zuerst kommen. passive: Passive in Reihenfolge (die erste kommt mit den Kern-Skills).
   * corners: 4-Punkte-Ecken in Reihenfolge. Quelle: öffentliche Bretter bekannter Spieler, zusammengefasst bei aion2vault.com,
   * und die Klassen-Analyse von Metabot. Die Route selbst (Reihenfolge der Knoten) berechnet daevanion.js: günstigster Weg vom Start. */
  daevanionPlan: {
    gladiator: {
      core: ["Overhead Slam", "Ruinous Blow", "Rending Blow", "Keen Strike"],
      passive: ["Attack Preparation", "Impact Hit", "Murderous Burst", "Blood Absorption"],
      corners: ["Combat Speed", "Damage Boost", "Cooldown Reduction", "Multi-Hit Chance", "Critical Damage Boost"],
      quelle: "Bretter von Grobs (227 Punkte, Level 45) und Ulfhednar",
      hinweis: "Max. MP nur nehmen, wenn dir das Mana ausgeht."
    },
    templar: {
      core: ["Judgment", "Pummel", "Vicious Strike", "Punishment"],
      passive: ["Fury", "Insulting Roar", "Impact Hit", "Punishing Benediction", "Enhance Health", "Ironclad Defense"],
      corners: ["Combat Speed", "Cooldown Reduction", "Damage Boost", "Damage Tolerance", "Multi-Hit Chance", "Critical Damage Boost"],
      quelle: "Bretter von Xia, Leonis und NoBS Game Guides",
      hinweis: "Zikel ist für den Templer mindestens so wichtig wie Nezekan: dort liegen Kampfrausch, Gebrüll der Verachtung und Schocktreffer doppelt."
    },
    assassin: {
      core: ["Quick Slice", "Savage Roar", "Heart Gore", "Insignia Explosion"],
      passive: ["Assault Stance", "Rear Smite", "Exploit Weakness", "Impact Hit"],
      corners: ["Combat Speed", "Cooldown Reduction", "Damage Boost", "Multi-Hit Chance", "Critical Damage Boost"],
      quelle: "Bretter von Grobs (82 Punkte früh, Level-45-Pläne)",
      hinweis: "Nezekan zuerst füllen: dort liegen drei der vier wichtigsten Passiven."
    },
    ranger: {
      core: ["Deadshot", "Gale Arrow", "Drill Dart", "Tempest Shot", "Snipe", "Burst Arrow", "Snare Shot"],
      passive: ["Focused Eye", "Hunter's Resolve", "Hunter's Soul"],
      corners: ["Damage Boost", "Critical Damage Boost", "Cooldown Reduction", "Multi-Hit Chance", "Combat Speed"],
      quelle: "öffentliche Ranger-Bretter, zusammengefasst bei aion2vault",
      hinweis: "Nezekan zuerst: Fokussiertes Auge und Entschlossenheit des Jägers liegen dort doppelt."
    },
    sorcerer: {
      core: ["Hellfire", "Wish of Concentration", "Blaze", "Bittercold Wind", "Firestorm", "Winter's Shackles", "Flame Arrow"],
      passive: ["Fire Mark", "Robe of Flame", "Vitality Evaporation", "Grace of Enhancement"],
      corners: ["Damage Boost", "Critical Damage Boost", "Cooldown Reduction", "Combat Speed", "Multi-Hit Chance"],
      quelle: "Bretter von shr1kn (268 und 401 Punkte), aLuckyRO",
      hinweis: "Feuerzeichen zuerst: Flammenexplosion hängt davon ab."
    },
    spiritmaster: {
      core: ["Combustion", "Elemental Fusion", "Summon: Fire Spirit", "Cold Shock", "Dimensional Control"],
      passive: ["Spirit Strike", "Spirit Revitalization", "Element Unification"],
      corners: ["Combat Speed", "Cooldown Reduction", "Damage Boost", "Multi-Hit Chance", "Critical Damage Boost"],
      quelle: "Bretter von Grobs (290 Punkte, Level 45) und init.rb",
      hinweis: "Die Krit.-Schaden-Ecken auf Vaizel erst spät nehmen."
    },
    cleric: {
      core: ["Condemnation", "Judgment Thunder", "Divine Aura", "Chain of Torment", "Debilitating Mark", "Earth's Retribution"],
      passive: ["Empyrean Lord's Grace", "Healing Enhancement", "Earth's Grace"],
      corners: ["Cooldown Reduction", "Combat Speed", "Damage Boost", "Critical Damage Boost", "Multi-Hit Chance"],
      quelle: "Bretter von MrRosaPony (239 Punkte), Lucia, BoredAF und whelps",
      hinweis: "Zum Farmen ohne Punkte in Heilungen. Wer in der Gruppe heilt, nimmt Licht der Heilung und Glanz der Genesung dazu."
    },
    chanter: {
      core: ["Dark Crush", "Onslaught", "Incandescent Blow", "Spinning Strike", "Recuperation"],
      passive: ["Attack Preparation", "Wind's Promise", "Earth's Promise"],
      corners: ["Combat Speed", "Cooldown Reduction", "Damage Boost", "Critical Damage Boost", "Multi-Hit Chance", "Damage Tolerance"],
      quelle: "Bretter von Grobs (85 Punkte früh, 325 Punkte Level 45)",
      hinweis: "Gelübde der Erde senkt die Schadensresistenz des Ziels – stark in der Gruppe."
    }
  },

  audit: {
    roles: {
      gladiator: "dps", templar: "tank", assassin: "dps", ranger: "dps",
      sorcerer: "dps", spiritmaster: "dps", cleric: "heal", chanter: "hybrid"
    },
    pcClass: {
      2: "gladiator", 5: "gladiator", 6: "gladiator", 7: "gladiator", 8: "gladiator",
      3: "templar", 9: "templar", 10: "templar", 11: "templar", 12: "templar",
      4: "ranger", 13: "ranger", 14: "ranger", 15: "ranger", 16: "ranger",
      17: "assassin", 18: "assassin", 19: "assassin", 20: "assassin",
      21: "spiritmaster", 22: "spiritmaster", 23: "spiritmaster", 24: "spiritmaster",
      25: "sorcerer", 26: "sorcerer", 27: "sorcerer", 28: "sorcerer",
      29: "cleric", 30: "cleric", 31: "cleric", 32: "cleric",
      33: "chanter", 34: "chanter", 35: "chanter", 36: "chanter"
    },
    weapons: {
      gladiator: { type: "Großschwert", aulamus: "Aulamus Greatsword", craft: "Dragon Lord Greatsword", prof: "Schmiedekunst (Blacksmithing)", kromede: "Enraged Kromede Claymore" },
      templar: { type: "Langschwert", aulamus: "Aulamus Longsword", craft: "Dragon Lord Longsword", prof: "Schmiedekunst (Blacksmithing)", kromede: "Enraged Kromede Sword" },
      assassin: { type: "Dolch", aulamus: "Aulamus Dagger", craft: "Dragon Lord Dagger", prof: "Schmiedekunst (Blacksmithing)", kromede: "Enraged Kromede Silver Dagger" },
      ranger: { type: "Bogen", aulamus: "Aulamus Bow", craft: "Dragon Lord Bow", prof: "Handwerk (Handicrafting)", kromede: "Enraged Kromede Longbow" },
      sorcerer: { type: "Zauberbuch", aulamus: "Aulamus Spellbook", craft: "Dragon Lord Spellbook", prof: "Alchemie (Alchemy)", kromede: "Enraged Kromede Spellbook" },
      spiritmaster: { type: "Orb", aulamus: "Aulamus Orb", craft: "Dragon Lord Orb", prof: "Alchemie (Alchemy)", kromede: "Enraged Kromede Jewel" },
      cleric: { type: "Streitkolben", aulamus: "Aulamus Mace", craft: "Dragon Lord Mace", prof: "Schmiedekunst (Blacksmithing)", kromede: "Enraged Kromede Warhammer" },
      chanter: { type: "Stab", aulamus: "Aulamus Staff", craft: "Dragon Lord Staff", prof: "Handwerk (Handicrafting)", kromede: "Enraged Kromede Rod" }
    },
    craftPrefix: { asmo: "Dark", elyos: "White" },
    craftTable: { asmo: "Exulantendorf (Safe Haven), Altgard", elyos: "Basis der Legion der Morgenröte (Dawn Legion Base), Verteron" },
    craftBottleneck: "je 3× Zorniger Gedanke, 15× Zorniger Wille und 5× Vollendeter Veredelungsstein des Meisters – alle handelbar",
    monoliths: { asmo: "Exulantendorf (Safe Haven) und Nornirkonvent (Nornir Assembly) in Altgard", elyos: "Basis der Legion der Morgenröte (Dawn Legion Base) und Zumion Village in Verteron" },
    slotNames: {
      1: "Waffe", 2: "Guard", 3: "Helm", 4: "Schultern", 5: "Brust", 6: "Hose", 7: "Handschuhe", 8: "Stiefel", 19: "Umhang",
      10: "Kette", 11: "Ohrring 1", 12: "Ohrring 2", 13: "Ring 1", 14: "Ring 2", 15: "Armband 1", 16: "Armband 2",
      17: "Gürtel", 22: "Amulett", 23: "Rune 1", 24: "Rune 2"
    },
    slotOrder: [1, 2, 3, 4, 5, 6, 7, 8, 19, 10, 11, 12, 13, 14, 15, 16, 17, 22, 23, 24],
    armor: { 3: "Helm", 4: "Pauldrons", 5: "Breastplate", 6: "Greaves", 7: "Gloves", 8: "Boots", 19: "Cloak" },
    vakronChance: { 3: 2, 4: 2, 5: 1, 6: 2, 7: 3, 8: 2, 19: 3 },
    accessories: { 10: "Necklace", 11: "Earrings", 12: "Earrings", 13: "Ring", 14: "Ring" },
    aulamusChance: { Necklace: 2, Earrings: 3, Ring: 3, weapon: 0.86 },
    pity: { tier70: 21, tier86: 28, weeklyCubes: 10 },
    coreStigmas: {
      gladiator: ["Lunge Stance", "Zikel's Blessing", "Rage Burst", "Focused Block"],
      templar: ["Shield of Protection", "Taunt", "Battlefield Banner", "Doom Shield"],
      assassin: ["Illusive Clone", "Swift Contract", "Triniel's Dagger", "Throw Shadowblade"],
      ranger: ["Vaizel's Authority", "Bow of Blessing", "Supporting Fire", "Griffon Arrow"],
      sorcerer: ["Element Enhancement", "Delayed Explosion", "Fire Wall", "Steel Barrier"],
      spiritmaster: ["Summon: Ancient Spirit", "Enhance: Spirit's Benediction", "Flame Blessing", "Jointstrike: Corrode"],
      cleric: ["Light of Protection", "Noble Aura", "Earth Punishment", "Benevolence"],
      chanter: ["Undefeated Mantra", "Sprint Mantra", "Power of the Storm", "Marchutan's Wrath"]
    },
    stigmaBreakpoints: {
      "Summon: Ancient Spirit": { level: 15, text: "Ab Rang 15 löst der Uralte Naturgeist Elementarfusion alle 5 statt alle 7 Angriffe aus (drei Guides bestätigen das)." }
    },
    keySkills: {
      spiritmaster: { names: ["Elemental Fusion", "Combustion", "Summon: Fire Spirit"], target: 20 }
    },
    shardShops: "Albtraum-Shop (1.500 Phantasmal Fragments), Shugo-Fest-Shop (300 Münzen) oder Abyss-Shop (10.000–25.000 AP) – Preise je Splitter laut Guides",
    /* Kinah und Verstärkungssteine je Schritt +0→+1 … +9→+10, IL-70-Waffe (Aulamus), garantiert */
    enchantIL70: [[8750, 350], [12500, 500], [22800, 910], [35000, 1400], [49000, 1960], [65000, 2580], [82000, 3250], [99000, 3960], [119000, 4730], [139000, 5540]],
    above10: "Ab +10 → +11 sinkt die Chance auf 65 %, ein Versuch kostet bei einer IL-70-Waffe 246.000 bis 1,28 Mio. Kinah.",
    defensiveStones: ["Block", "HP", "Defense", "Evasion Bonus", "Evasion", "Critical Hit Resist", "MP", "Natural MP Regen", "Status Effect Resist", "Magic Defense", "Damage Tolerance"],
    offensiveNodes: ["Attack Bonus", "Critical Hit +", "Multi-hit Chance", "Damage Boost", "Combat Speed", "Cooldown", "Critical Damage Boost", "Accuracy"]
  }
};
