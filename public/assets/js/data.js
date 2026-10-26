/*
 * Daeva-Kompass – alle Spieldaten an einer Stelle.
 * Stand: 26.10.2026 (Global-Launch 05.10.2026, Patch 21.10.: Hard-Modus und Ariel-Brett). Quellen siehe DK_DATA.sources.
 * confidence: "ok" = mehrere Quellen einig, "community" = Community-Konsens,
 *             "offen" = Quellen widersprechen sich / nicht offiziell bestätigt.
 */
window.DK_DATA = {
  stand: "26.10.2026",

  /* ---------- Gearscore-Schwellen (Item-Level) ---------- */
  gates: [
    { gs: 1000, title: "Abyss · Prüfung", text: "Untere Reshanta (Lv 45) und Aufstiegsprüfung Leicht öffnen (Normal ab 1500, Schwer ab 2000, Herausforderung ab 2500)." },
    { gs: 1400, title: "Vakron & Urugugu", text: "Eroberung (Conquest) Stufe 2: Vakron Sky Island und Urugugu Canyon." },
    { gs: 1600, title: "Transzendenz 1", text: "Shattered Arkanis und Deus Research Base – Arkana-Karten." },
    { gs: 1900, title: "Transzendenz 2", text: "Zweite Transzendenz-Stufe, mehr Effekte, bessere Karten." },
    { gs: 2100, title: "Eroberung 3", text: "Eroberung Stufe 3: Enraged-Kromede-Waffen, Nuakum-Rüstung." },
    { gs: 2200, title: "Transzendenz 3", text: "Boss-Level steigt, Karten-Qualität steigt." },
    { gs: 2500, title: "Transzendenz 4", text: "Höchste Transzendenz-Stufe (Boss-Level 68)." },
    { gs: 2600, title: "Hard-Modus", text: "Krao-Höhle und Draupnir als Eroberung [Hard]: Ariel-Fragmente für das Ariel-Brett, mehr Kinah." },
    { gs: 2800, title: "Ludra", text: "Heiligtum-Raid Ludra (Normal), ab dem 4. November. Präzision um 1.450–1.500 mitbringen." },
    { gs: 3000, title: "Ludra Hard", text: "Ludra im Hard-Modus, ebenfalls ab dem 4. November." }
  ],

  /* ---------- Gearscore-Fahrplan ---------- */
  stages: [
    { id: "basis", title: "Fundament", sub: "Billige Punkte, die viele mit 1400 noch liegen lassen", minGS: 0 },
    { id: "s1400", title: "Ab 1400", sub: "Vakron & Urugugu farmen, Wochenlimits voll nutzen", minGS: 1400 },
    { id: "s1600", title: "Ab 1600", sub: "Transzendenz öffnen, Arkana-Slots füllen", minGS: 1600 },
    { id: "s2100", title: "Ab 2100", sub: "Fire Temple und Horn Den, Albtraum-Shop", minGS: 2100 },
    { id: "s2600", title: "Ab 2600", sub: "Hard-Modus, Ariel-Brett und Ludra", minGS: 2600 }
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
      id: "pantheon", stage: "basis", minGS: 0, prio: 6,
      title: "Pantheon füllen: 12 Kunstwerke mit Weisheit und Illusion",
      gain: "Je Kunstwerk etwa +0,6 bis +0,8 % Schaden (Schätzung), alle zwölf zusammen mehr als der Koloss",
      cadence: "Einmal füllen, dann Teil für Teil verbessern",
      where: "Markt (Kunstwerke Krao, Vakron Sky Island, Draupnir, Ferocious Horn Den), Elite-Bosse, Albtraum-Shop",
      marker: null,
      detail: "Die Story füllt Koloss und Statuen bis Stufe 45 schon mit einfachen Teilen. Statuen immer mit Tod. Kein Gearscore, aber dauerhafte Götter-Werte – Plan und Abhaken in der Ansicht Pantheon.",
      confidence: "community"
    },
    {
      id: "odyle", stage: "s1400", minGS: 1400, prio: 7,
      title: "Odyle-Energie nie überlaufen lassen, nur in Eroberung ausgeben",
      gain: "Jeder Würfel = Chance auf IL-70-Teile",
      cadence: "Alle 3 h +15 (120 pro Tag)",
      where: "Dungeon-Menü",
      marker: null,
      detail: "Cap 560 (840 mit Mitgliedschaft). Ein Belohnungswürfel kostet 40. Spare die Energie für Vakron und Urugugu statt für alte Erkundungs-Dungeons.",
      confidence: "community"
    },
    {
      id: "vakron", icon: "https://assets.playnccdn.com/static-aion2-gamedata/resources/Icon_Equip_AR_L_0028_T05_Torso.png", stage: "s1400", minGS: 1400, prio: 8,
      title: "Vakron Sky Island – Eroberung farmen",
      gain: "Rüstung IL 70",
      cadence: "Solange Odyle da ist",
      where: "Dungeon-Menü (2–5 Spieler, 60 Min)",
      marker: null,
      detail: "Bosse: Tiere (optional, beseitigt ihr Gift), Thamon, Vakron. Jeder getötete Zwischenboss legt zusätzliche Beute in den Würfel. Mehrere Runs füllen eine Pity-Belohnung. Gruppen verlangen oft etwa 200 GS über dem Minimum.",
      confidence: "community"
    },
    {
      id: "urugugu", icon: "https://assets.playnccdn.com/static-aion2-gamedata/resources/Icon_ACC_Ring_0072.png", iconKey: "aulamus", stage: "s1400", minGS: 1400, prio: 9,
      title: "Urugugu Canyon – Eroberung für Waffe & Schmuck",
      gain: "Aulamus-Waffen und -Accessoires IL 70",
      cadence: "Solange Odyle da ist",
      where: "Dungeon-Menü (2–5 Spieler)",
      marker: null,
      detail: "Vakron liefert vor allem Rüstung, Urugugu die Waffe und Accessoires. Spiritmaster: Aulamus-Orb ist das Ziel.",
      confidence: "offen"
    },
    {
      id: "albtraum", stage: "s1400", minGS: 1000, prio: 10,
      title: "Albtraum (Nightmare) jeden Tag",
      gain: "Phantasmal Fragments für den Albtraum-Shop",
      cadence: "2 Versuche pro Tag, bis 14 speicherbar",
      where: "Dungeon-Menü (Solo)",
      marker: null,
      detail: "Ein Versuch wird nur bei Erfolg verbraucht, ein Wipe kostet nichts. Jeder Boss hat Stufen 1 bis 10. Im Shop: Statue Fortress Guardian Notun (8.000 Fragmente, nach Stufe 10 von Notun, empfohlen IL 2.300) und Koloss Zikel's Apparition (14.000, nach dem Finale, Stufen IL 2.400 bis 3.000).",
      confidence: "ok"
    },
    {
      id: "aufstieg", stage: "s1400", minGS: 1000, prio: 11,
      title: "Aufstiegsprüfung (Ascension Trial) 3× pro Woche",
      gain: "Verstärkungssteine, Amplify-Stone-Fragmente",
      cadence: "3 Tickets pro Woche",
      where: "Dungeon-Menü (Solo)",
      marker: null,
      detail: "Vier Stufen: Leicht ab IL 1.000, Normal ab 1.500, Schwer ab 2.000, Herausforderung ab 2.500 (höchstens 5, 3, 2 und 2 Tode). Nimm die höchste Stufe, die du sicher schaffst. Belohnung: Verstärkungssteine, Begleiter-Truhen, Amplify-Stone-Fragmente und Manastein- oder Seelenstein-Truhen, keine Ausrüstung.",
      confidence: "ok"
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
      detail: "Täglicher Dungeon ist die Daeva Bio-Research Base, sie zahlt Verstärkungssteine. Läuft schnell nebenher. Pflichtmissionen zuerst, damit sie zum Reset nicht verfallen.",
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
      id: "hardmodus", stage: "s2600", minGS: 2600, prio: 19,
      title: "Krao-Höhle und Draupnir im Hard-Modus",
      gain: "Ariel-Fragmente (60–90 vom Endboss) und 160.000 Kinah je Boss",
      cadence: "Mit Odyle (40 je Belohnung), Auswahl-Belohnung nach 28 Belohnungen",
      where: "Dungeon-Menü › Eroberung [Hard] (bis 5 Spieler)",
      marker: null,
      detail: "Seit dem Patch vom 21. Oktober: Bosse auf Stufe 68, Raserei schon nach 4 Minuten, höchstens 3 Wiederbelebungen. Dazu 1 % Philosopher's Stone: Revelation und 0,3 % auf das Kunstwerk Wrathful Krao bzw. Wrathful Draupnir (Pantheon). Die Auswahl-Belohnung bietet die Dungeon-Ausrüstung, den Ausrüstungs-Tauschgutschein oder den Revelation-Stein. Erfolge für 5, 10 und 15 Clears geben Skins, Titel und Wiederbelebungs-Steine.",
      confidence: "ok"
    },
    {
      id: "ariel", icon: "https://assets.playnccdn.com/static-aion2/characters/img/daevanion/board_icon_unique_open.png", stage: "s2600", minGS: 2600, prio: 20,
      title: "Ariel-Brett: PvE- und Boss-Schaden zuerst",
      gain: "Bis zu 30 Ariel-Punkte, nur PvE- und Boss-Werte",
      cadence: "Je 100 Ariel-Fragmente ein Punkt",
      where: "Substanzwandlung › Spezial › Daevanion, dann Menü › Daevanion › Ariel",
      marker: null,
      detail: "100 Fragmente werden zu einem Daevanion-Kristall: Ariel (höchstens 30 je Charakter). Das ganze Brett kostet 232 Punkte, also zuerst die Ecken mit PvE- und Boss-Schadensverstärkung. Die Route je Klasse zeigt die Daevanion-Seite. Übrige Fragmente: je 1 Fragment = 5 Verstärkungssteine.",
      confidence: "ok"
    },
    {
      id: "raids", stage: "s2600", minGS: 2800, prio: 21,
      title: "Ludra (Heiligtum-Raid) ab 4. November",
      gain: "Endgame-Waffen, z. B. Ludra's Abyssal Jade (Orb)",
      cadence: "1 Endboss-Kill pro Woche (wie im Early Access)",
      where: "Dungeon-Menü (10 Spieler in zwei Gruppen zu 5)",
      marker: null,
      detail: "Kommt am 4. November mit neuen Mechaniken zurück: Normal ab IL 2.800, Hard ab 3.000, beide ab dem ersten Tag. Der Raid prüft auch Präzision (etwa 1.450–1.500). Wipes und Zwischenbosse verbrauchen den Wochen-Kill nicht; die Belohnung kostet 40 Odyle, jede 4. gibt eine Auswahl. Der Erfolg für 3 Clears gibt das Kunstwerk Abyssal Ludra (Pantheon). Auf Global ist Ludra bisher der einzige Raid.",
      confidence: "ok"
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
      lane: "Reset", where: "Überall", what: "Abyss-Zeit, Aufstiegsprüfung, Täglicher Dungeon, Ludra-Kill", confidence: "community",
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
      { id: "odyle", label: "Odyle unter Cap ausgegeben", max: 1, hint: "Eroberung, ab IL 2.600 Hard-Modus" },
      { id: "schluessel", label: "Shugo-/Invasions-Schlüssel genutzt", max: 1, hint: "3 Aufladungen pro Tag" },
      { id: "trans", label: "Transzendenz-Belohnungen", max: 4, hint: "Ab IL 1600, 2 je Dungeon" },
      { id: "riss", label: "Raumzeit-Riss gemacht", max: 1, hint: "Optional, alle 3 h" },
      { id: "federn", label: "Federn eingesammelt", max: 1, hint: "Bis das Amulett fertig ist" }
    ],
    weekly: [
      { id: "tagesdungeon", label: "Täglicher Dungeon", max: 14, hint: "14 pro Woche" },
      { id: "aufstieg", label: "Aufstiegsprüfung", max: 3, hint: "3 Tickets" },
      { id: "abyss-u", label: "Abyss: Untere Reshanta (Stunden)", max: 7, hint: "7 h Budget" },
      { id: "belagerung", label: "Artefakt-Belagerung", max: 3, hint: "Mo / Do / Sa" },
      { id: "morph", label: "Substanzwandlung", max: 4, hint: "4 pro Charakter" },
      { id: "festung", label: "Festungen für Gürtel-Material", max: 1, hint: "Bis Gürtel Unique" },
      { id: "raid", label: "Ludra-Endboss", max: 1, hint: "Ab 4.11., IL 2.800" },
      { id: "ariel", label: "Ariel-Fragmente umgewandelt", max: 1, hint: "Je 100 ein Punkt, höchstens 30" }
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
    { name: "Aufstiegsprüfung", req: "IL 1000", info: "Solo, 3 pro Woche, 4 Stufen bis IL 2500", step: "aufstieg" },
    { name: "Transzendenz", req: "IL 1600", info: "Arkana-Karten", step: "transzendenz1" },
    { name: "Fire Temple / Horn Den", req: "IL 2100", info: "Eroberung Stufe 3", step: "feuertempel" },
    { name: "Krao-Höhle / Draupnir [Hard]", req: "IL 2600", info: "Ariel-Fragmente, neu seit 21.10.", step: "hardmodus" },
    { name: "Ludra", req: "IL 2800 · Hard 3000", info: "Raid, 10 Spieler, ab 4.11.", step: "raids" }
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
    { name: "Gear-Transfer (Game8)", url: "https://game8.co/games/Aion-2/archives/616977" },
    { name: "Makros für alle Klassen: Linien, Schritte, Opener (AION2 Builds)", url: "https://aion2builds.org/tools/macro/" },
    { name: "Makro-Guide: Taste, Füller, erlaubt oder nicht (Timesaver)", url: "https://timesaver.gg/blog/aion-2-macros-guide" },
    { name: "Klassen-Builds: Kern-Skills, Stigmen, Ablauf (Metabot)", url: "https://metabot.gg/en/aion-2/guides/class-builds-guide" },
    { name: "Skill-Stufen und Stigmen der Top-Spieler je Klasse (Metabot)", url: "https://metabot.gg/en/aion-2/classes/spiritmaster/build" },
    { name: "Skillpunkte: 203 + 122 + 59 (AllThings.how)", url: "https://allthings.how/aion-2-how-to-get-more-skill-points/" },
    { name: "Skillpunkte, Spezialisierungen, Stufen über 10 (Aion2Guide)", url: "https://aion2guide.org/systems/aion-2-skill-points-guide/" },
    { name: "Skill-Namen und Symbole je Klasse, deutsch (GameWith)", url: "https://gamewith.ai/aion2/de/classes" },
    { name: "Begleiter: alle Reittiere, Typ-Boni und Seelen-Fundorte (MetaBot)", url: "https://metabot.gg/de/aion-2/mounts" },
    { name: "Begleiter: Werte je Typ und Stufe, Farm-Gebiete (Raid Relay)", url: "https://raidrelay.com/aion-2-pets-genus-guide" },
    { name: "Begleiter und Gattungs-Einsicht (Daeva Guides)", url: "https://daevaguides.com/en/guides/pets-genus-insight/" },
    { name: "Patch 1. April 2026: eigener Schadensmesser (AION2 Hub)", url: "https://aion2hub.com/updates/aion-2-update-2026-04-01" },
    { name: "Patch Notes 20./21.10.2026: Hard-Modus, Ariel-Brett (NCSOFT über PatchBot)", url: "https://patchbot.io/games/aion-2/articles/1865-notice-patch-notes-oct-20-pdt-oct-21-cest" },
    { name: "Dungeons, Raids, Eintritts-IL und Aufstiegsprüfung (AION 2 Maps, Client-Daten)", url: "https://aion2maps.com/guides/dungeons-and-raids/" },
    { name: "Krao-Höhle und Draupnir im Hard-Modus: Beute, Pity, Erfolge (AION 2 Maps)", url: "https://aion2maps.com/guides/krao-cave/" },
    { name: "Ludra ab 4. November: Eintritt, Wochenlimit, Präzision (AION 2 Maps)", url: "https://aion2maps.com/guides/ludra/" },
    { name: "Albtraum Saison 1: Bosse, Stufen und Shop (AION 2 Maps)", url: "https://aion2maps.com/guides/nightmare/" },
    { name: "Ariel-Brett: Knoten, Werte, Kosten (AION2 Vault)", url: "https://aion2vault.com/builds/ariel-daevanion/" },
    { name: "Pantheon: Teile, Quellen und Götter-Werte (AION 2 Maps)", url: "https://aion2maps.com/guides/pantheon-stats/" }
  ],

  /* ---------- Charakter-Check: Upgrade-Stufen und Klassenregeln ----------
   * Quellen: Spieldaten des Global-Clients über Metabot (Drops, Rezepte, Verstärkung),
   * Kern-Stigmen aus Nutzungsdaten koreanischer Top-Spieler (Aion2-Meta).
   */
  /* Daevanion: Prioritäten je Klasse für PvE (englische Namen wie in der Armory, Anzeige deutsch aus data-daevanion.js).
   * core: aktive Skills, deren Knoten auf jedem PvE-Brett zuerst kommen. passive: Passive in Reihenfolge (die erste kommt mit den Kern-Skills).
   * corners: 4-Punkte-Ecken in Reihenfolge. Quelle: öffentliche Bretter bekannter Spieler, zusammengefasst bei aion2vault.com,
   * und die Klassen-Analyse von Metabot. Die Route selbst (Reihenfolge der Knoten) berechnet daevanion.js: günstigster Weg vom Start. */
  /* ---------- Ariel (sechstes Daevanion-Brett, seit 21.10.2026) ----------
   * Eigene Ariel-Punkte aus Ariel-Fragmenten (Krao-Höhle und Draupnir im Hard-Modus). Raster in data-daevanion.js. */
  ariel: {
    punkteMax: 30,
    text: "Ariel ist das sechste Brett (seit dem Patch vom 21. Oktober): nur PvE- und Boss-Werte, keine Skills, eigene Ariel-Punkte. Die Punkte kommen aus Ariel-Fragmenten, die nur Krao-Höhle und Draupnir im Hard-Modus droppen (ab Gegenstandsstufe 2.600, 60–90 Fragmente vom Endboss). 100 Fragmente ergeben per Substanzwandlung (Spezial › Daevanion) einen Kristall, also einen Punkt.",
    hinweis: "Laut Patch Notes höchstens 30 Umwandlungen je Charakter, mit eigener Grenze je Dungeon – ob das 30 insgesamt oder je Dungeon sind, sagen die Quellen unterschiedlich. Übrige Fragmente lohnen als Verstärkungssteine (1 Fragment = 5 Steine, ohne Grenze).",
    quellen: [
      { name: "Patch Notes 20./21.10.2026: Hard-Modus, Ariel-Brett (NCSOFT über PatchBot)", url: "https://patchbot.io/games/aion-2/articles/1865-notice-patch-notes-oct-20-pdt-oct-21-cest" },
      { name: "Ariel-Brett: Knoten, Werte, Kosten (AION2 Vault, Client-Daten von questlog.gg)", url: "https://aion2vault.com/builds/ariel-daevanion/" }
    ]
  },

  /* ---------- Pantheon ----------
   * Sammlung aus 1 Koloss, 4 Statuen und 12 Kunstwerken; jedes Teil gibt feste Punkte auf zwei bis vier Götter-Werte.
   * Ein Punkt Götter-Wert = 0,1 % auf beide Wirkungen. Teile mit englischem Namen wie im englischen Client.
   * werte: key -> [Name im deutschen Client, englischer Name, Wirkung 1, Wirkung 2]; Namen und Wirkungen aus der Armory (de-DE).
   * teile: { typ, name, grad, werte {key: Punkte}, oder (Werte, von denen das Teil einen trägt), fraktion, quelle, stufe (1 = beste),
   *   leicht (schnell zu haben: Quest, Erfolg, Albtraum-Shop oder billig im Markt) }.
   * Quellen: AION 2 Maps (Client-Daten, abgerufen am 26.10.2026), Game8, kanonxo. Neue Erkenntnisse hier eintragen. */
  pantheon: {
    freischalten: "Das Pantheon öffnet sich mit der zweiten Aufstiegsquest (The One Who Hears the Voice, ab Stufe 22). Die Story-Quests bis Stufe 45 füllen Koloss und Statuen schon mit einfachen Teilen.",
    plaetze: { koloss: 1, statue: 4, kunstwerk: 12 },
    typen: { koloss: "Koloss", statue: "Statue", kunstwerk: "Kunstwerk" },
    punkte: { koloss: "Heroisch 55 · Einzigartig 45 · Selten 35", statue: "Einzigartig 12 · Episch 10 · Selten 8 · Gewöhnlich 6", kunstwerk: "Heroisch 5 · Einzigartig 4 · Episch 3 · Selten 2" },
    werte: {
      wisdom: ["Weisheit [Lumiel]", "Wisdom [Lumiel]", "MP-Kosten −", "Wucht (doppelter Schaden: PvE 2×, PvP 1,5×)"],
      destruction: ["Zerstörung [Zikel]", "Destruction [Zikel]", "Angriffskraft %", "Perfekter Widerstand"],
      time: ["Zeit [Siel]", "Time [Siel]", "Kampftempo", "Wucht-Widerstand"],
      death: ["Tod [Triniel]", "Death [Triniel]", "Krit.-Treffer %", "Regenerations-Penetration"],
      illusion: ["Illusion [Kaisinel]", "Illusion [Kaisinel]", "Abklingzeit −", "Eisenwall-Penetration"],
      justice: ["Gerechtigkeit [Nezekan]", "Justice [Nezekan]", "Verteidigung %", "Perfektion (Treffer am oberen Schadensrand)"],
      freedom: ["Freiheit [Vaizel]", "Freedom [Vaizel]", "Präzision %", "Ausweichen %"],
      space: ["Raum [Israphel]", "Space [Israphel]", "Bewegungstempo", "Block %"],
      destiny: ["Schicksal [Marchutan]", "Destiny [Marchutan]", "MP %", "Eisenwall (Chance auf halben Schaden)"],
      life: ["Leben [Yustiel]", "Life [Yustiel]", "LP %", "Regeneration (holt 20 % des Schadens zurück)"]
    },
    /* Für Schaden zuerst: Wucht, Angriffskraft-Multiplikator, Kampftempo (kanonxo) */
    schaden: ["wisdom", "destruction", "time"],
    teile: [
      { typ: "koloss", name: "Guardian Lord Nahma", grad: "Heroisch", werte: { destruction: 55, justice: 55, time: 55 }, fraktion: null, quelle: "Wächterfürst Nahma (Untere Reshanta), 25 % je Kill, handelbar", stufe: 1 },
      { typ: "koloss", name: "Zikel's Apparition", grad: "Einzigartig", werte: { destruction: 45, justice: 45, time: 45 }, fraktion: null, quelle: "Albtraum-Shop: 14.000 Phantasmal Fragments, nachdem du Zikel's Apparition geschafft hast (empfohlen Gegenstandsstufe 2.400)", stufe: 2, leicht: true },
      { typ: "koloss", name: "Incarnated Warding Feather", grad: "Selten", werte: { justice: 35, time: 35 }, fraktion: "elyos", quelle: "Story-Quest Zumion's Ward (Verteron, Stufe 35)", stufe: 3, leicht: true },
      { typ: "koloss", name: "Warden Santras", grad: "Selten", werte: { justice: 35, time: 35 }, fraktion: "asmo", quelle: "Story-Quest Last of the Destruction Archons (Altgard, Stufe 32)", stufe: 3, leicht: true },

      { typ: "statue", name: "Transcendent Bakarma", grad: "Einzigartig", werte: { death: 12, freedom: 12, space: 12 }, fraktion: null, quelle: "Erfolg: 10× Draupnir in der Eroberung", stufe: 1, leicht: true },
      { typ: "statue", name: "Asahr's Mirror", grad: "Episch", werte: { death: 10 }, oder: ["space", "freedom"], fraktion: null, quelle: "4. Aufstiegsquest The One Who Witnesses the Nightmare (Stufe 45)", stufe: 2, leicht: true },
      { typ: "statue", name: "Artifact of Eternity", grad: "Episch", werte: { death: 10 }, oder: ["space", "freedom"], fraktion: null, quelle: "3. Aufstiegsquest The One Who Dreams (Stufe 32)", stufe: 2, leicht: true },
      { typ: "statue", name: "Fortress Guardian Notun", grad: "Episch", werte: { death: 10 }, oder: ["space", "freedom"], fraktion: null, quelle: "Albtraum-Shop: 8.000 Phantasmal Fragments nach Stufe 10 von Fortress Guardian Notun (empfohlen Gegenstandsstufe 2.300)", stufe: 2, leicht: true },
      { typ: "statue", name: "Dream Fragment", grad: "Selten", werte: { death: 8 }, oder: ["space", "freedom"], fraktion: null, quelle: "2. Aufstiegsquest The One Who Hears the Voice (Stufe 22)", stufe: 3, leicht: true },
      { typ: "statue", name: "Teina", grad: "Selten", werte: { death: 8 }, oder: ["space", "freedom"], fraktion: "elyos", quelle: "Story-Quest Time Takes Its Toll (Verteron, Stufe 43)", stufe: 3, leicht: true },
      { typ: "statue", name: "Grisilla", grad: "Selten", werte: { death: 8 }, oder: ["space", "freedom"], fraktion: "asmo", quelle: "Story-Quest Contaminated Sacred Tree (Altgard, Stufe 30)", stufe: 3, leicht: true },
      { typ: "statue", name: "Kibelisk", grad: "Episch", werte: { freedom: 10, space: 10 }, fraktion: null, quelle: "Erfolg: alle 61 Teleportpunkte deiner Karte gebunden (ohne Tod)", stufe: 3 },
      { typ: "statue", name: "Mirror of Desire", grad: "Selten", werte: { freedom: 8, space: 8 }, fraktion: null, quelle: "Erfolg: 10× Fire Temple in der Eroberung (ohne Tod)", stufe: 3 },

      { typ: "kunstwerk", name: "Eternal Gartua", grad: "Heroisch", werte: { wisdom: 5, illusion: 5, destiny: 5, life: 5 }, fraktion: "elyos", quelle: "Feldboss Ewiger Gartua (Verteron): 25 % je Kill oder 20.000 Kunstwerk-Splitter, handelbar", stufe: 1 },
      { typ: "kunstwerk", name: "Immortal Gartua", grad: "Heroisch", werte: { wisdom: 5, illusion: 5, destiny: 5, life: 5 }, fraktion: "asmo", quelle: "Feldboss Unsterblicher Gartua (Altgard): 25 % je Kill oder 20.000 Kunstwerk-Splitter, handelbar", stufe: 1 },
      { typ: "kunstwerk", name: "Wrathful Krao", grad: "Heroisch", werte: { wisdom: 5, illusion: 5 }, oder: ["destiny", "life"], fraktion: null, quelle: "Neu: Krao-Höhle im Hard-Modus, Endboss 0,3 % je Belohnung, handelbar", stufe: 1, neu: true },
      { typ: "kunstwerk", name: "Wrathful Draupnir", grad: "Heroisch", werte: { wisdom: 5, illusion: 5 }, oder: ["destiny", "life"], fraktion: null, quelle: "Neu: Draupnir im Hard-Modus, Endboss 0,3 % je Belohnung, handelbar", stufe: 1, neu: true },
      { typ: "kunstwerk", name: "Krao", grad: "Einzigartig", werte: { wisdom: 4, illusion: 4 }, oder: ["destiny", "life"], fraktion: null, quelle: "Krao-Höhle (Eroberung, auch Hard): 0,75 % je Endboss-Belohnung; im Markt am günstigsten", stufe: 2, leicht: true },
      { typ: "kunstwerk", name: "Draupnir", grad: "Einzigartig", werte: { wisdom: 4, illusion: 4 }, oder: ["destiny", "life"], fraktion: null, quelle: "Draupnir (Eroberung, auch Hard): 0,75 % je Endboss-Belohnung; im Markt günstig", stufe: 2, leicht: true },
      { typ: "kunstwerk", name: "Vakron Sky Island", grad: "Einzigartig", werte: { wisdom: 4, illusion: 4 }, oder: ["destiny", "life"], fraktion: null, quelle: "Vakron Sky Island (Eroberung): 0,75 % je Endboss-, 0,25 % je Zwischenboss-Belohnung; im Markt günstig", stufe: 2, leicht: true },
      { typ: "kunstwerk", name: "Ferocious Horn Den", grad: "Einzigartig", werte: { wisdom: 4, illusion: 4 }, oder: ["destiny", "life"], fraktion: null, quelle: "Ferocious Horn Den (Eroberung): 0,75 % je Endboss-Belohnung; im Markt günstig", stufe: 2, leicht: true },
      { typ: "kunstwerk", name: "Watcher Kaira", grad: "Einzigartig", werte: { wisdom: 4, illusion: 4 }, oder: ["destiny", "life"], fraktion: null, quelle: "Wächter Kaira oder Executor Kaira (Untere Reshanta): 25 % je Kill, handelbar", stufe: 2 },
      { typ: "kunstwerk", name: "Sentinel K'nash", grad: "Einzigartig", werte: { wisdom: 4, illusion: 4 }, oder: ["destiny", "life"], fraktion: "elyos", quelle: "Elite gleichen Namens (Verteron): 25 % je Kill oder 5.000 Kunstwerk-Splitter", stufe: 2 },
      { typ: "kunstwerk", name: "Black Tentacle Lawa", grad: "Einzigartig", werte: { wisdom: 4, illusion: 4 }, oder: ["destiny", "life"], fraktion: "elyos", quelle: "Elite gleichen Namens (Verteron): 25 % je Kill oder 5.000 Splitter", stufe: 2 },
      { typ: "kunstwerk", name: "Centurion Demiros", grad: "Einzigartig", werte: { wisdom: 4, illusion: 4 }, oder: ["destiny", "life"], fraktion: "elyos", quelle: "Elite gleichen Namens (Verteron): 25 % je Kill oder 5.000 Splitter", stufe: 2 },
      { typ: "kunstwerk", name: "Divine Ansas", grad: "Einzigartig", werte: { wisdom: 4, illusion: 4 }, oder: ["destiny", "life"], fraktion: "elyos", quelle: "Elite gleichen Namens (Verteron): 25 % je Kill oder 5.000 Splitter", stufe: 2 },
      { typ: "kunstwerk", name: "Phantasm Kasia", grad: "Einzigartig", werte: { wisdom: 4, illusion: 4 }, oder: ["destiny", "life"], fraktion: "elyos", quelle: "Elite gleichen Namens (Verteron): 25 % je Kill oder 5.000 Splitter", stufe: 2 },
      { typ: "kunstwerk", name: "Forest Warrior Aullamu", grad: "Einzigartig", werte: { wisdom: 4, illusion: 4 }, oder: ["destiny", "life"], fraktion: "elyos", quelle: "Elite gleichen Namens (Verteron): 25 % je Kill oder 5.000 Splitter", stufe: 2 },
      { typ: "kunstwerk", name: "Drakan Battalion Weapon Guruta", grad: "Einzigartig", werte: { wisdom: 4, illusion: 4 }, oder: ["destiny", "life"], fraktion: "asmo", quelle: "Elite gleichen Namens (Altgard): 25 % je Kill oder 5.000 Splitter", stufe: 2 },
      { typ: "kunstwerk", name: "Sharp Shylak", grad: "Einzigartig", werte: { wisdom: 4, illusion: 4 }, oder: ["destiny", "life"], fraktion: "asmo", quelle: "Elite gleichen Namens (Altgard): 25 % je Kill oder 5.000 Splitter", stufe: 2 },
      { typ: "kunstwerk", name: "Desecrator Newbold", grad: "Einzigartig", werte: { wisdom: 4, illusion: 4 }, oder: ["destiny", "life"], fraktion: "asmo", quelle: "Elite gleichen Namens (Altgard): 25 % je Kill oder 5.000 Splitter", stufe: 2 },
      { typ: "kunstwerk", name: "Abyssal Ludra", grad: "Heroisch", werte: { wisdom: 5, illusion: 5, destiny: 5 }, fraktion: null, quelle: "Erfolg: 3× Ludra geschafft (Raid ab 4. November zurück)", stufe: 1 },
      { typ: "kunstwerk", name: "Chaser Taulo", grad: "Episch", werte: { wisdom: 3, illusion: 3 }, fraktion: "elyos", quelle: "Elite (Verteron): 25 % je Kill oder 1.000 Splitter", stufe: 3 },
      { typ: "kunstwerk", name: "Harvest Manager Moshav", grad: "Episch", werte: { wisdom: 3, illusion: 3 }, fraktion: "elyos", quelle: "Elite (Verteron): 25 % je Kill oder 1.000 Splitter", stufe: 3 },
      { typ: "kunstwerk", name: "Scholar Aulla", grad: "Episch", werte: { wisdom: 3, illusion: 3 }, fraktion: "elyos", quelle: "Elite (Verteron): 25 % je Kill oder 1.000 Splitter", stufe: 3 },
      { typ: "kunstwerk", name: "Cantas Valley", grad: "Episch", werte: { wisdom: 3, illusion: 3 }, fraktion: "elyos", quelle: "Shugo-Fest-Shop: 2.000 Centuryroot Tokens", stufe: 3 },
      { typ: "kunstwerk", name: "Ellun River Midstream", grad: "Episch", werte: { wisdom: 3, illusion: 3 }, fraktion: "elyos", quelle: "Shugo-Fest-Shop: 2.000 Centuryroot Tokens", stufe: 3 },
      { typ: "kunstwerk", name: "Veteran Shujakan", grad: "Episch", werte: { wisdom: 3, illusion: 3 }, fraktion: "asmo", quelle: "Elite (Altgard): 25 % je Kill oder 1.000 Splitter", stufe: 3 },
      { typ: "kunstwerk", name: "Dredgion Crash Site", grad: "Episch", werte: { wisdom: 3, illusion: 3 }, fraktion: "asmo", quelle: "Shugo-Fest-Shop: 2.000 Centuryroot Tokens", stufe: 3 },
      { typ: "kunstwerk", name: "Quai Campsite", grad: "Episch", werte: { wisdom: 3, illusion: 3 }, fraktion: "asmo", quelle: "Shugo-Fest-Shop: 2.000 Centuryroot Tokens", stufe: 3 },
      { typ: "kunstwerk", name: "Silent Dartan", grad: "Einzigartig", werte: { wisdom: 4, destiny: 4, life: 4 }, fraktion: null, quelle: "Feldboss (Verteron und Altgard): 25 % je Kill oder 5.000 Splitter – Übergang, ohne Illusion", stufe: 4 },
      { typ: "kunstwerk", name: "Soul Ruler Kashapa", grad: "Einzigartig", werte: { wisdom: 4, destiny: 4, life: 4 }, fraktion: null, quelle: "Feldboss (Verteron und Altgard): 25 % je Kill oder 5.000 Splitter – Übergang", stufe: 4 },
      { typ: "kunstwerk", name: "High Commander Lagta", grad: "Einzigartig", werte: { wisdom: 4, destiny: 4, life: 4 }, fraktion: null, quelle: "Feldboss Legat Lagta (Verteron und Altgard): 25 % je Kill oder 5.000 Splitter – Übergang", stufe: 4 },
      { typ: "kunstwerk", name: "Urugugu", grad: "Einzigartig", werte: { wisdom: 4, destiny: 4, life: 4 }, fraktion: null, quelle: "Urugugu Canyon (Eroberung) – Übergang", stufe: 4 },
      { typ: "kunstwerk", name: "Fire Temple", grad: "Einzigartig", werte: { wisdom: 4, destiny: 4, life: 4 }, fraktion: null, quelle: "Fire Temple (Eroberung) – Übergang", stufe: 4 }
    ],
    stufen: { 1: "Beste", 2: "Sehr gut", 3: "Gut", 4: "Übergang" },
    tipps: [
      ["Erst alle Plätze füllen", "Zwölf Kunstwerke mit Weisheit und Illusion bringen zusammen mehr als ein Koloss – jedes Teil zählt, auch ein episches."],
      ["Statuen immer mit Tod", "Tod gibt Krit.-Treffer. Die zweite Statuen-Werte (Raum oder Freiheit) sind Geschmackssache: Raum gibt Bewegungstempo und Block, Freiheit Präzision und Ausweichen."],
      ["Günstigste Einzigartige", "Die Kunstwerke Krao, Vakron Sky Island, Draupnir und Ferocious Horn Den gibt es im Markt dutzendweise und billig."],
      ["Splitter sammeln", "Jede benannte Elite und jeder Feldboss in Verteron und Altgard lässt Kunstwerk-Splitter fallen; die Substanzwandlung macht daraus Kunstwerke deiner Fraktion."],
      ["PvP", "Für Eisenwall-Builds tauschen Spieler die Weisheit-Kunstwerke gegen solche mit Illusion, Leben und Schicksal; Wächterfürst Nahma ist auch der PvP-Koloss."],
      ["Gleicher Pool", "Götter-Werte kommen auch von Arkana-Karten, dem Abyss-Armband und den Monolithen. Wer einen Wert gezielt stapelt, sollte alle drei Quellen prüfen."]
    ],
    quellen: [
      { name: "Pantheon: Teile, Punkte, Quellen und die zehn Götter-Werte (AION 2 Maps, Client-Daten)", url: "https://aion2maps.com/guides/pantheon-stats/" },
      { name: "Alle Statuen im Pantheon (Game8)", url: "https://game8.co/games/Aion-2/archives/614581" },
      { name: "Pantheon als Build-Schicht (AION 2 Field Guide)", url: "https://aion2.blog/pantheon/" }
    ]
  },

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

  /* ---------- Skills & Makros je Klasse ----------
   * [[English Name]] in Texten wird mit dem deutschen Namen und Symbol aus data-skills.js angezeigt.
   * leiste: Linien (gestapelte Skills auf einem Leistenplatz) von oben nach unten; der unterste hat Vorrang.
   * makro: Schritte des Makros – Zahl = Linie aus leiste, Text = einzelner Skill (muss auf einer Taste liegen).
   * tasten: komplette Belegung [Taste, Inhalt, Hinweis]; Inhalt = Linie (Zahl), Skill (englisch) oder "makro".
   *   Tasten: LMB, RMB, M4, M5 (Maus), 1–4, Q, E, R, F, Z, X, C, V. Schema in tastenSchema.
   * opener: Reihenfolge zum Kampfbeginn, "makro" = Makrotaste halten.
   * pvp: dasselbe für PvP plus stigmen (Set), stigmenName, stigmenAlt [Name, Grund], ziele [Skill, Gesamt-Stufe] (aion2builds),
   *   passive, kombos (statt ablauf).
   * Quellen: Linien, Schritte und Opener von aion2builds.org (Stand 9.10.2026); die komplette Tastenbelegung ist ein Vorschlag der Seite nach tastenSchema,
   * Kern-Skills und Ablauf von metabot.gg (Stand 6.10.2026), Skillpunkte von allthings.how.
   * Die Stufen der Top-Spieler und die Leveling-Reihenfolge stehen in data-skills.js (erzeugt).
   */
  skillPlan: {
    punkte: {
      quellen: [["Stufe 45", 203], ["61 versiegelte Dungeons (je 2 Weisheitssteine)", 122], ["59 Regionsquests (je 1 Weisheitsstein)", 59]],
      kosten: [0, 0, 1, 1, 1, 2, 2, 2, 4, 4, 4],
      hinweis: "Weisheitssteine (Wisdom Stones) aus dem Inventar benutzen, erst dann zählen die Punkte. Monolithe und Spuren-Federn geben keine Skillpunkte. Umskillen gibt alle Punkte zurück und kostet laut Guides nur etwas Kinah."
    },
    makro: {
      schritte: [
        ["Taste belegen", "Esc → Einstellungen → Tastenbelegung → Allgemein → Makro. Ab Werk ist keine Taste belegt; üblich sind rechte Maustaste oder eine Seitentaste."],
        ["Linien stapeln", "Skills-Menü (K): Die Leiste wird zum 5×12-Raster. Bis zu vier Skills übereinander in eine Spalte legen. Unten liegt der wichtigste Skill, ganz oben der eine Füller ohne Abklingzeit."],
        ["Makro bauen", "Im Makro-Editor jede Linie als Schritt eintragen (über ihren untersten Platz) und 10 ms Verzögerung setzen. Bei 80–100 ms Ping 40–50 ms."],
        ["Steuerung prüfen", "AION-2-Steuerungsmodus und Skill-Warteschlange einschalten. Im AION-1-Modus ist das Makro eingeschränkt."],
        ["Halten", "Im Kampf die Makrotaste halten, dazu den Grundangriff auf der linken Maustaste."],
        ["An der Puppe testen", "Die Guides sind sich nicht einig, ob oben oder unten Vorrang hat. Wirkt das Makro nur einen Skill, liegen zwei Skills ohne Abklingzeit in der Linie oder der Füller liegt an der falschen Stelle."]
      ],
      raus: "Nicht ins Makro: Umschalter (Mantras, Licht des Schutzes), Aufladeskills (Zielpfeil, Bestrafung, Höllenflamme), Verteidigung, Bewegung, Kontrolle und Schockaufhebung.",
      regel: "Erlaubt ist nur das Makro im Spiel. Makros aus Maus-Software und Zusatzprogramme, die Tasten drücken, können zur Sperre führen."
    },
    /* PvP allgemein. Linien und Makro im PvP sind ein Vorschlag der Seite (aus den PvP-Kombos von Metabot und den Tooltips),
     * Stigmen und Ziel-Stufen kommen aus aion2builds und Metabot. */
    pvp: {
      regeln: [
        ["Kontrolle von Hand", "Betäubung, Umwerfen, Furcht, Siegel und Schilde gehören auf eigene Tasten. Im Makro zünden sie sonst auf Gegner, die gerade immun sind."],
        ["Bedingte Skills nach unten", "Unten in die Druck-Linie gehören die Skills, die nur auf kontrollierte Ziele wirken. Sie zünden von selbst, sobald deine Kontrolle sitzt; sonst läuft der Füller."],
        ["Schockaufhebung", "60 s Abklingzeit. Wann du sie drückst, hängt von der Klasse ab – steht in der Tastenbelegung bei Maus 4."],
        ["Zwei Presets", "Eine Leiste für PvE, eine für PvP, und die Stigmen mittauschen. aion2builds spricht von PvE- und PvP-Presets."],
        ["Daevanion: Azphel", "Azphel ist das PvP-Brett mit eigenen Punkten: PvP-Schadensverstärkung und -Resistenz. Danach die Skill-Knoten deiner PvP-Skills."],
        ["Werte", "Wo die Ausrüstung die Wahl lässt: PvP-Schadensverstärkung, PvP-Schadensresistenz und Widerstand gegen Statuseffekte."]
      ],
      hinweis: "Für Global gibt es noch kein festes PvP-Meta: Saison 1 läuft, Balance-Patches kommen oft. Linien und Makro im PvP sind ein Vorschlag der Seite, abgeleitet aus den PvP-Kombos von Metabot und den Skill-Tooltips. Stigmen und Ziel-Stufen kommen aus aion2builds und Metabot."
    },
    /* Tasten-Schema für alle Klassen (Spiel-Standard für Schnellslots ist nicht festgelegt; angelehnt an das Schema von Boostroom) */
    tastenSchema: [["LMB", "Grundangriff halten"], ["RMB", "Makro halten"], ["1–4", "Linien A–D"], ["Q · E", "Kontrolle und Folge-Skill"], ["R · F", "Burst und Schutz"], ["Z · X · C · V", "Rest"], ["M4", "Schockaufhebung"], ["M5", "Sprung, Ausweich-Skill oder Aufladen"]],
    klassen: {
      gladiator: {
        kurz: "Großschwert im Nahkampf: [[Ruinous Blow]] öffnet das Schadensfenster, im Buff wird umgeworfen und zugeschlagen.",
        zuerst: "Ruinous Blow",
        ablauf: [
          "Mit [[Leaping Slam]] heran, dann [[Ruinous Blow]]: trifft bis zu 4 Gegner und gibt 20 s lang +20 % PvE-Schadensverstärkung (Abklingzeit 45 s).",
          "Im Buff: [[Mocking Blade]] wirft um, [[Overhead Slam]] trifft Gegner am Boden, danach [[Rage Burst]].",
          "Bis [[Ruinous Blow]] wieder bereit ist: [[Rending Blow]] (keine Abklingzeit, 4 Ziele) und [[Keen Strike]]."
        ],
        leiste: [
          { name: "Hauptlinie", taste: "RMB", skills: ["Rending Blow", "Overhead Slam", "Rage Burst"] },
          { name: "Verheerend-Linie", taste: "E", skills: ["Ruinous Blow"] },
          { name: "Buff-Linie", taste: "R", skills: ["Zikel's Blessing", "Lunge Stance"] }
        ],
        makro: [0, 1, 2],
        opener: ["Lunge Stance", "Zikel's Blessing", "Leaping Slam", "Ruinous Blow", "makro"],
        tipps: [
          "Nach dem Umwerfen: [[Mocking Blade]] → [[Overhead Slam]] → [[Aerial Snare]].",
          "Solo und beim Leveln: [[Lifestealing Blade]] statt [[Focused Block]] ausrüsten und oben in die Verheerend-Linie legen – der Treffer heilt dich. Top-Spieler und aion2builds nehmen in Gruppen [[Focused Block]]."
        ],
        tasten: [
          ["LMB", "Keen Strike", "Grundangriff halten"], ["RMB", "makro", "Makro halten"], ["M4", "Defiance", "aus Kontrolle befreien"], ["M5", "Leaping Slam", "heranspringen"],
          ["1", 0], ["2", 1], ["3", 2],
          ["Q", "Mocking Blade", "umwerfen"], ["E", "Aerial Snare", "nach dem Umwerfen"], ["F", "Focused Block", "erster Bossangriff"],
          ["Z", "Sword Aura Rampage", "auf taumelnde Ziele"], ["X", "Crushing Wave", "bis 4 Ziele"], ["C", "Rush Strike", "nach dem Ausweichen"], ["V", "Ankle Slice", "bis 4 Ziele"]
        ],
        pvp: {
          kurz: "Umwerf-Kette im Nahkampf: [[Mocking Blade]] wirft um, [[Overhead Slam]] trifft am Boden, [[Aerial Snare]] verlängert. Wer weniger kontrolliert wird, gewinnt.",
          stigmen: ["Lunge Stance", "Armor of Balance", "Tenaciousness", "Blade Toss"],
          stigmenName: "Abyss",
          stigmenAlt: [["Focused Block", "Arena: statt Klingenwurf, blockt einen Burst"], ["Wrath Wave", "Gruppenkampf: wirft bis zu 4 um"], ["Zikel's Blessing", "mehr Schaden statt Rüstung des Gleichgewichts"]],
          ziele: [["Overhead Slam", 20], ["Mocking Blade", 16], ["Defiance", 16], ["Aerial Snare", 16]],
          passive: ["Attack Preparation", "Survival Willpower", "Survival Stance", "Impact Hit"],
          leiste: [{ name: "Druck-Linie", skills: ["Rending Blow", "Overhead Slam"] }],
          makro: [0],
          tasten: [
            ["LMB", "Keen Strike", "Grundangriff halten"], ["RMB", "makro", "Makro halten"], ["M4", "Defiance", "für den Stun, der dich tötet"], ["M5", "Leaping Slam", "heranspringen"],
            ["1", 0],
            ["Q", "Mocking Blade", "umwerfen, heilt dich"], ["E", "Aerial Snare", "in die Luft, verlängert"], ["R", "Lunge Stance", "+20 % Kampftempo"], ["F", "Tenaciousness", "3 s immun"],
            ["Z", "Armor of Balance", "+50 % Widerstand gegen Stun und Umwerfen"], ["X", "Blade Toss", "−50 % Heilung, −30 % Verteidigung"], ["C", "Rush Strike", "nach dem Ausweichen"], ["V", "Ruinous Blow", "Burst, bis 4 Ziele"]
          ],
          opener: ["Leaping Slam", "Mocking Blade", "Overhead Slam", "Aerial Snare", "Lunge Stance", "Ruinous Blow", "makro"],
          kombos: [
            "Umwerf-Kette: [[Mocking Blade]] (3 s am Boden, heilt dich) → [[Overhead Slam]] → [[Aerial Snare]] (50 % in die Luft) → [[Overhead Slam]] beim Aufschlag.",
            "Dranbleiben: nach dem Ausweichen [[Rush Strike]] (Chance auf Umwerfen) oder [[Leaping Slam]] auf 20 m.",
            "Burst, solange er liegt: [[Lunge Stance]], dann [[Ruinous Blow]].",
            "Halten: [[Armor of Balance]] vor dem gegnerischen Burst, [[Tenaciousness]] unter Fokus, [[Defiance]] erst für den Stun, nach dem der Burst kommt."
          ],
          tipps: [
            "Arena: [[Focused Block]] statt [[Blade Toss]] – nur der vierte Slot ändert sich (aion2builds).",
            "[[Blade Toss]] halbiert die Heilung des Ziels: im Abyss gegen Kleriker und Kantor."
          ]
        }
      },
      templar: {
        kurz: "Schild-Tank: Gegner sammeln und betäuben, [[Punishment]] für den großen Buff, mit [[Warding Strike]] stehen bleiben.",
        zuerst: "Punishment",
        ablauf: [
          "Sammeln: [[Poach]] und [[Shield Smite]] (10 s Abklingzeit, 4 Ziele, Betäubung) ziehen die Gegner zu dir. Was zur Gruppe läuft, holt [[Taunt]] zurück.",
          "Schaden: [[Judgment]] und [[Annihilate]], dann [[Punishment]] aufladen: 20 s lang +200 Genauigkeit und +20 % PvE-Schadensverstärkung. [[Empyrean Lord's Punishment]] betäubt bis zu 4 Ziele.",
          "Überleben: [[Warding Strike]] heilt dich und gibt +20 % PvE-Schadensresistenz. Lücken füllt [[Vicious Strike]]."
        ],
        leiste: [
          { name: "Verderben-Linie", skills: ["Warding Strike", "Shield Smite", "Judgment", "Doom Shield"] },
          { name: "Hiebe-Linie", skills: ["Pummel", "Annihilate", "Debilitating Smash"] }
        ],
        makro: [0, 1],
        opener: ["Poach", "Shield Smite", "Judgment", "Annihilate", "Punishment", "makro"],
        tipps: [
          "Makro auf die rechte Maustaste, dazu links [[Vicious Strike]] halten.",
          "[[Shield Smite]] schaltet [[Judgment]] kurz frei, deshalb liegen beide in derselben Linie."
        ],
        tasten: [
          ["LMB", "Vicious Strike", "Grundangriff halten"], ["RMB", "makro", "Makro halten"], ["M4", "Defiance", "aus Kontrolle befreien"], ["M5", "Shield Rush", "nach dem Ausweichen"],
          ["1", 0], ["2", 1],
          ["Q", "Poach", "heranziehen"], ["E", "Taunt", "Ausreißer zurückholen"], ["R", "Punishment", "aufladen, sobald bereit"], ["F", "Battlefield Banner", "Angriff aus Verteidigung"],
          ["Z", "Empyrean Lord's Punishment", "Gruppen-Betäubung"], ["X", "Flash Rampage", "auf taumelnde Ziele"]
        ],
        pvp: {
          kurz: "Fangen, betäuben, nachsetzen: zwei Betäubungen, zwei Wege ans Ziel, und [[Annihilate]] trifft nur Betäubte oder Liegende. Du gewinnst, indem du länger stehst.",
          stigmen: ["Executing Blade", "Empyrean Lord's Punishment", "Doom Shield", "Nezekan's Shield"],
          stigmenName: "1 gegen 1",
          stigmenAlt: [["Second Skin", "gegen Magie-Schaden"], ["Comrade in Arms", "Gruppen-PvP: teilt Schaden mit Mitspielern"], ["Grapple", "Gruppe: zieht bis zu 4 heran und hält sie fest"], ["Noble Armor", "mehr maximale LP"]],
          ziele: [["Judgment", 20], ["Punishment", 20], ["Pummel", 20], ["Annihilate", 20]],
          passive: ["Enhance Health", "Ironclad Defense", "Guarding Seal"],
          leiste: [{ name: "Druck-Linie", skills: ["Pummel", "Judgment", "Annihilate"] }],
          makro: [0],
          tasten: [
            ["LMB", "Vicious Strike", "Grundangriff halten"], ["RMB", "makro", "Makro halten"], ["M4", "Defiance", "für die Kontrolle, die dich tötet"], ["M5", "Shield Rush", "nach dem Ausweichen, Betäubung möglich"],
            ["1", 0],
            ["Q", "Shield Smite", "60 % Betäubung, 4 Ziele"], ["E", "Empyrean Lord's Punishment", "zweite Betäubung auf 20 m"], ["R", "Punishment", "aufladen, Vollstrecker-Buff"], ["F", "Nezekan's Shield", "Schild 41 % LP, auch Gruppe"],
            ["Z", "Executing Blade", "−30 % Verteidigung, +20 % auf Betäubte"], ["X", "Poach", "heranziehen und festhalten"], ["C", "Doom Shield", "Ansturm 20 m, Umwerfen"]
          ],
          opener: ["Doom Shield", "Shield Smite", "Annihilate", "Executing Blade", "Judgment", "Punishment", "makro"],
          kombos: [
            "Fangen: [[Doom Shield]] (20 m, 75 % Umwerfen) oder nach dem Ausweichen [[Shield Rush]]; läuft er weg, holt ihn [[Poach]] zurück.",
            "Betäubungs-Kette: [[Shield Smite]] → [[Annihilate]] → [[Executing Blade]] (+20 % auf Betäubte) → [[Judgment]]. Läuft die Betäubung aus: [[Empyrean Lord's Punishment]].",
            "Burst: [[Punishment]] aufladen, solange er liegt oder betäubt ist.",
            "Halten: [[Nezekan's Shield]] vor dem gegnerischen Burst, [[Defiance]] für die Kontrolle, die dich sonst tötet."
          ],
          tipps: [
            "Nahkämpfer werden im PvP auf Abstand gehalten: Ansturm-Skills und [[Doom Shield]] zählen mehr als in PvE (aion2builds).",
            "Gegen Magier und Beschwörer: [[Second Skin]] statt [[Nezekan's Shield]]."
          ]
        }
      },
      assassin: {
        kurz: "Krit-Burst mit Glyphen: fünf Glyphen setzen, mit [[Insignia Explosion]] zünden, [[Heart Gore]] bei jedem Krit.",
        zuerst: "Heart Gore",
        ablauf: [
          "Glyphen setzen: [[Shadowstrike]] bringt dich hinter das Ziel, [[Savage Fang]] setzt alle 5 Glyphen auf einmal, [[Savage Roar]] eine weitere.",
          "Burst von hinten: [[Illusive Clone]], dann [[Heart Gore]] (löst bei Krit aus und gibt MP) und [[Ambush]] von hinten (+30 %).",
          "Zünden: [[Insignia Explosion]] wird mit jeder Glyphe stärker. Bis [[Savage Fang]] wieder bereit ist, füllen [[Triniel's Dagger]] und [[Quick Slice]]."
        ],
        leiste: [
          { name: "Schadenslinie", skills: ["Savage Roar", "Ambush", "Heart Gore", "Insignia Explosion"] },
          { name: "Buff-Linie", hand: true, skills: ["Triniel's Dagger", "Savage Fang", "Swift Contract", "Illusive Clone"] }
        ],
        makro: [0, "Quick Slice"],
        opener: ["Illusive Clone", "Swift Contract", "Savage Fang", "Triniel's Dagger", "makro"],
        tipps: [
          "Die Buff-Linie drückst du von Hand, sie gehört nicht ins Makro.",
          "Im 20-Sekunden-Burst hat [[Heart Gore]] laut aion2builds keine Abklingzeit."
        ],
        tasten: [
          ["LMB", "Quick Slice", "Grundangriff halten"], ["RMB", "makro", "Makro halten"], ["M4", "Defiance", "aus Kontrolle befreien"], ["M5", "Infiltrate", "nach dem Ausweichen hinter das Ziel"],
          ["1", 0], ["2", 1, "von Hand zum Burst"],
          ["Q", "Shadowstrike", "Öffner, hinter das Ziel"], ["E", "Flash Slice", "durchziehen"],
          ["Z", "Storm Rampage", "auf taumelnde Ziele"], ["X", "Whirlwind Slice", "nach dem Ausweichen eines Angriffs"], ["C", "Shadow Fall", "auf betäubte Ziele"]
        ],
        pvp: {
          kurz: "Burst aus der Tarnung: betäuben, Glyphen setzen, von hinten zuschlagen und mit [[Insignia Explosion]] erneut betäuben, bevor der Gegner reagiert.",
          stigmen: ["Illusive Clone", "Swift Contract", "Triniel's Dagger", "Shadow Walk"],
          stigmenName: "Duell",
          stigmenAlt: [["Evasion Stance", "weicht kurz allem aus"], ["Smoke Bomb", "Blenden auf 10 m"], ["Aerial Bind", "in die Luft, sicher bei 5 Glyphen"], ["Evasion Contract", "löst Verlangsamung und Festhalten"]],
          ziele: [],
          passive: ["Exploit Weakness", "Impact Hit", "Rear Smite"],
          leiste: [{ name: "Druck-Linie", skills: ["Savage Roar", "Ambush", "Heart Gore"] }, { name: "Buff-Linie", hand: true, skills: ["Triniel's Dagger", "Swift Contract", "Illusive Clone"] }],
          makro: [0, "Quick Slice"],
          tasten: [
            ["LMB", "Quick Slice", "Grundangriff halten"], ["RMB", "makro", "Makro halten"], ["M4", "Defiance", "aus Kontrolle befreien"], ["M5", "Infiltrate", "nach dem Ausweichen, blendet"],
            ["1", 0], ["2", 1, "Burst von Hand"],
            ["Q", "Shadowstrike", "Teleport, 3 s Betäubung"], ["E", "Shadow Fall", "auf Betäubte: Umwerfen"], ["R", "Insignia Explosion", "Flächen-Betäubung"], ["F", "Flash Slice", "Seite wechseln, blendet"],
            ["Z", "Whirlwind Slice", "Betäubung nach Ausweichen"], ["X", "Shadow Walk", "Tarnung vor dem Kampf"]
          ],
          opener: ["Shadow Walk", "Shadowstrike", "Illusive Clone", "Savage Roar", "Triniel's Dagger", "Ambush", "Shadow Fall", "Insignia Explosion", "makro"],
          kombos: [
            "Öffner: [[Shadow Walk]] außerhalb des Kampfes, dann [[Shadowstrike]] (hinter das Ziel, 3 s Betäubung).",
            "Kontroll-Kette: betäubt → [[Shadow Fall]] (Umwerfen) → [[Insignia Explosion]] (neue Betäubung, stärker mit Glyphen).",
            "Schaden: [[Illusive Clone]] setzt [[Heart Gore]] zurück, [[Ambush]] von hinten +30 %, [[Triniel's Dagger]] verlängert die Abklingzeiten des Gegners.",
            "Raus: [[Flash Slice]] oder nach dem Ausweichen [[Infiltrate]] – beide blenden."
          ],
          tipps: [
            "Im PvP stehst du nicht immer hinter dem Ziel: das Rückenangriff-Passiv reicht auf Stufe 5 (Metabot).",
            "[[Impact Hit]] ist das Passiv, das aion2builds für PvP dazunimmt."
          ]
        }
      },
      ranger: {
        kurz: "Bogen auf 20 m: [[Gale Arrow]] und [[Marking Shot]] oben halten, aus verlangsamten Zielen Bonusschaden holen.",
        zuerst: "Gale Arrow",
        ablauf: [
          "Buffs: [[Marking Shot]] gibt Präzision (+300 Krit), dazu [[Vaizel's Authority]] und [[Bow of Blessing]].",
          "Pack vorbereiten: [[Snare Shot]] verlangsamt, [[Gale Arrow]] (4 Ziele) hält den Orkan-Buff: +7 % Kampftempo und +7 % PvE-Schadensverstärkung.",
          "Burst: [[Burst Arrow]], voll aufgeladener [[Deadshot]] (+35 % mit Präzision), dann [[Griffon Arrow]]. [[Drill Dart]] und [[Snipe]] füllen."
        ],
        leiste: [
          { name: "Greifen-Linie", skills: ["Burst Arrow", "Snare Shot", "Griffon Arrow"] },
          { name: "Orkan-Linie", skills: ["Tempest Shot", "Drill Dart", "Gale Arrow"] }
        ],
        makro: [0, 1],
        opener: ["Bow of Blessing", "Supporting Fire", "Vaizel's Authority", "Marking Shot", "Deadshot"],
        tipps: [
          "AION-2-Steuerung nutzen und die Skill-Warteschlange einschalten, sonst greift das Makro nicht richtig.",
          "[[Deadshot]] immer voll aufladen; mit Präzision trifft er 35 % härter."
        ],
        tasten: [
          ["LMB", "Snipe", "halten"], ["RMB", "makro", "Makro halten"], ["M4", "Defiance", "aus Kontrolle befreien"], ["M5", "Deadshot", "voll aufladen"],
          ["1", 0], ["2", 1],
          ["Q", "Marking Shot", "Präzision, bewegt dich"], ["E", "Explosion Trap", "Falle legen"], ["R", "Vaizel's Authority", "+20 % Angriff"],
          ["Z", "Bow of Blessing", "+200 Krit"], ["X", "Supporting Fire", "Kugel feuert mit"], ["C", "Arrow Scattershot", "auf taumelnde Ziele"]
        ],
        pvp: {
          kurz: "Abstand ist dein Schutz: markieren, verlangsamen, mit Präzision betäuben, dann Burst – und weiter auf Abstand bleiben.",
          stigmen: ["Vaizel's Authority", "Bow of Blessing", "Arrow Storm", "Explosive Arrow"],
          stigmenName: "PvP",
          stigmenAlt: [["Sealing Arrow", "Siegel 5 s"], ["Ambush Kick", "zurückstoßen und Abstand gewinnen"], ["Mother Nature's Breath", "kurz mehr Schadensresistenz"], ["Illusory Arrow", "Blenden 3 s"]],
          ziele: [["Tempest Shot", 20]],
          passive: ["Hunter's Resolve", "Focused Eye", "Wind Vigor"],
          leiste: [{ name: "Orkan-Linie", skills: ["Tempest Shot", "Drill Dart", "Gale Arrow"] }, { name: "Verlangsamt-Linie", skills: ["Explosive Arrow", "Burst Arrow"] }],
          makro: [0, 1],
          tasten: [
            ["LMB", "Snipe", "halten"], ["RMB", "makro", "Makro halten"], ["M4", "Defiance", "aus Kontrolle befreien"], ["M5", "Marking Shot", "Präzision und Ausweichschritt"],
            ["1", 0], ["2", 1],
            ["Q", "Snare Shot", "verlangsamt, öffnet Sprengpfeil"], ["E", "Suppressing Arrow", "Betäubung mit Präzision"], ["R", "Deadshot", "voll aufladen"], ["F", "Arrow Storm", "Flächen-Betäubung"],
            ["Z", "Vaizel's Authority", "+20 % Angriff"], ["X", "Bow of Blessing", "+200 Krit"], ["C", "Explosion Trap", "Falle beim Abstandhalten"]
          ],
          opener: ["Vaizel's Authority", "Bow of Blessing", "Marking Shot", "Snare Shot", "Suppressing Arrow", "Burst Arrow", "Deadshot", "makro"],
          kombos: [
            "Öffnen: [[Marking Shot]] (Präzision) → [[Snare Shot]] (verlangsamt) → [[Suppressing Arrow]] (Betäubung, nur mit Präzision).",
            "Burst: [[Burst Arrow]] (nur auf Verlangsamte) → voll aufgeladener [[Deadshot]] (+35 % mit Präzision) → [[Explosive Arrow]] (+20 % auf Verlangsamte).",
            "Mehrere Gegner nah: [[Arrow Storm]] betäubt bis zu 4.",
            "Abstand halten: [[Gale Arrow]] und [[Snipe]] im Laufen, [[Explosion Trap]] auf deinen Weg legen."
          ],
          tipps: [
            "[[Tempest Shot]] auf Stufe 20 bringt eine Rückstoß-Spezialisierung (aion2builds).",
            "Die Verlangsamung ist im PvP dein wichtigstes Werkzeug: [[Snare Shot]] auf Punkte-Stufe 10 (Metabot)."
          ]
        }
      },
      sorcerer: {
        kurz: "Feuer-Burst mit Eis-Kontrolle. [[Grace of Enhancement]] gibt +20 % PvE-Schadensverstärkung, solange die MP über 25 % bleiben.",
        zuerst: "Hellfire",
        ablauf: [
          "Vor dem Pull: [[Wish of Concentration]] und [[Element Enhancement]], dann [[Ice Chain]], damit das Pack stehen bleibt.",
          "Feuer legen: [[Delayed Explosion]] und [[Fire Wall]] unter das Pack, dann [[Hellfire]] aufladen (bis zu 4 Ziele).",
          "Schleife: [[Firestorm]] und [[Blaze]] auf Ziele mit Feuerzeichen ([[Blaze]] gibt 100 MP), dazwischen [[Bittercold Wind]] und [[Flame Arrow]]. MP über 25 % halten."
        ],
        leiste: [
          { name: "Buff-Linie", skills: ["Delayed Explosion", "Bittercold Wind", "Element Enhancement"] },
          { name: "Konzentrations-Linie", skills: ["Fire Wall", "Cold Storm", "Wish of Concentration"] },
          { name: "Feuer-Linie", skills: ["Firestorm", "Blaze"] },
          { name: "Eis-Linie", skills: ["Ice Chain", "Winter's Shackles"] }
        ],
        makro: [0, 1, "Flame Arrow", 2, "Flame Arrow", 3, "Flame Scattershot"],
        opener: ["Delayed Explosion", "Element Enhancement", "Wish of Concentration", "Fire Wall", "Cold Storm", "Bittercold Wind", "Winter's Shackles", "Hellfire", "makro"],
        tipps: [
          "Verzögerung 10 ms unter 50 ms Ping, 40–50 ms bei 80–100 ms Ping.",
          "Unter 25 % MP fällt der Bonus von [[Grace of Enhancement]] weg. Die MP von [[Blaze]] und [[Absorb Essence]] sind mehr wert, als der Tooltip zeigt."
        ],
        tasten: [
          ["LMB", "Flame Arrow", "Grundangriff halten"], ["RMB", "makro", "Makro halten"], ["M4", "Defiance", "aus Kontrolle befreien"],
          ["1", 0], ["2", 1], ["3", 2], ["4", 3],
          ["Q", "Frost", "einfrieren"], ["E", "Frost Burst", "auf eingefrorene Ziele"], ["R", "Hellfire", "auf Stufe 3 aufladen"],
          ["Z", "Flame Scattershot", "letzter Makro-Schritt"]
        ],
        pvp: {
          kurz: "Kontrolle, dann Burst: einfrieren, [[Frost Burst]], Feuer in den Timer von [[Delayed Explosion]] legen. Ohne Abstand verliert ein Magier.",
          stigmen: ["Element Enhancement", "Steel Barrier", "Delayed Explosion", "Curse: Tree"],
          stigmenName: "PvP",
          stigmenAlt: [["Hibernation", "5 s immun"], ["Soul Freeze", "Siegel 5 s"], ["Lumiel's Space", "in die Luft, bis zu 4 Ziele"], ["Arctic Armor", "mehr Schadensresistenz, friert Angreifer ein"]],
          ziele: [],
          passive: ["Grace of Enhancement", "Fire Mark", "Robe of Cold"],
          leiste: [{ name: "Feuer-Linie", skills: ["Firestorm", "Blaze"] }, { name: "Eis-Linie", skills: ["Ice Chain", "Frost Burst"] }],
          makro: [0, "Flame Arrow", 1],
          tasten: [
            ["LMB", "Flame Arrow", "Grundangriff halten"], ["RMB", "makro", "Makro halten"], ["M4", "Defiance", "aus Kontrolle befreien"],
            ["1", 0], ["2", 1],
            ["Q", "Frost", "50 % einfrieren"], ["E", "Winter's Shackles", "verlangsamt bis zu 4"], ["R", "Hellfire", "in den Timer aufladen"], ["F", "Steel Barrier", "Schild 16 % LP"],
            ["Z", "Delayed Explosion", "+15 % Schaden im Timer"], ["X", "Curse: Tree", "einen Gegner 10 s raus"], ["C", "Element Enhancement", "+20 % Feuer und Wasser"], ["V", "Bittercold Wind", "Fläche"]
          ],
          opener: ["Element Enhancement", "Frost", "Frost Burst", "Delayed Explosion", "Winter's Shackles", "Hellfire", "makro"],
          kombos: [
            "Kill-Kombo: [[Frost]] (50 % einfrieren) → [[Frost Burst]] (nur auf Eingefrorene) → [[Delayed Explosion]] (+15 % Schaden für 4 s) → [[Hellfire]] in den Timer aufladen → [[Firestorm]] und [[Blaze]].",
            "Abstand: [[Ice Chain]] und [[Winter's Shackles]] verlangsamen, [[Robe of Cold]] verlangsamt jeden, der dich trifft.",
            "Gruppe: [[Curse: Tree]] nimmt einen Gegner 10 s aus dem Kampf (bricht bei Schaden).",
            "MP: [[Flame Arrow]] zwischen den Fenstern, damit [[Grace of Enhancement]] aktiv bleibt (+10 % PvP-Schaden ab 25 % MP)."
          ],
          tipps: [
            "Spielt sich laut aion2builds auch mit höherem Ping (ab 50 ms) gut.",
            "[[Frost]] im PvP auf Punkte-Stufe 10: die Einfrier-Chance ist die Kombo (Metabot)."
          ]
        }
      },
      spiritmaster: {
        kurz: "Du und dein Geist: Geister-Skills laden [[Elemental Fusion]] auf und schalten [[Dimensional Control]] frei, DoTs auf jedem Ziel stärken zwei Passive.",
        zuerst: "Jointstrike: Curse",
        ablauf: [
          "Beschwören: [[Summon: Ancient Spirit]] (30 s, bis zu 4 Ziele), dann [[Summon: Fire Spirit]] oder [[Summon: Water Spirit]] und [[Enhance: Spirit's Benediction]].",
          "DoTs verteilen: [[Jointstrike: Corrode]] und [[Jointstrike: Curse]] aufs Pack, dann [[Dimensional Control]] (nach jedem Geister-Skill frei).",
          "Einlösen: [[Elemental Fusion]] bei 4 Element-Stapeln. [[Combustion]] und [[Cold Shock]] füllen bis zur nächsten."
        ],
        leiste: [
          { name: "Geister-Linie", skills: ["Summon: Fire Spirit", "Summon: Earth Spirit", "Summon: Water Spirit", "Elemental Fusion"] },
          { name: "Buff-Linie", skills: ["Summon: Ancient Spirit", "Flame Blessing", "Enhance: Spirit's Benediction"] },
          { name: "Schadenslinie", skills: ["Combustion", "Dimensional Control", "Jointstrike: Curse", "Jointstrike: Corrode"] }
        ],
        makro: [1, 0, 2],
        opener: ["Flame Blessing", "Enhance: Spirit's Benediction", "Summon: Ancient Spirit", "Summon: Fire Spirit", "makro"],
        tipps: [
          "Läuft am besten unter etwa 60 ms Ping.",
          "Geister- und Schadenslinie zusätzlich auf eigene Tasten legen, um sie gezielt zu drücken.",
          "[[Summon: Ancient Spirit]] ab Stigma-Stufe 15: [[Elemental Fusion]] alle 5 statt alle 7 Angriffe."
        ],
        tasten: [
          ["LMB", "Cold Shock", "halten"], ["RMB", "makro", "Makro halten"], ["M4", "Defiance", "aus Kontrolle befreien"],
          ["1", 0], ["2", 1], ["3", 2],
          ["Q", "Soul's Cry", "Furcht für Notfälle"], ["E", "Rapid Scattershot", "auf taumelnde Ziele"], ["Z", "Summon: Wind Spirit", "dritter Geist"]
        ],
        pvp: {
          kurz: "Der Geist bindet den Gegner, du kontrollierst: [[Soul's Cry]] lässt ihn 5 s fliehen, [[Seize Magic]] nimmt seine Buffs, [[Command: Proxy]] lenkt Schaden auf den Geist.",
          stigmen: ["Summon: Ancient Spirit", "Enhance: Spirit's Benediction", "Command: Proxy", "Seize Magic"],
          stigmenName: "PvP",
          stigmenAlt: [["Jointstrike: Corrode", "statt Stellvertretung; stark gegen Kantor und Heilung"], ["Cry of Terror", "Flächen-Furcht; gegen Kleriker und Kantor"]],
          ziele: [["Defiance", 20], ["Cold Shock", 20], ["Elemental Fusion", 20], ["Jointstrike: Curse", 20], ["Combustion", 20]],
          passive: ["Spirit Protection", "Revitalization Contract", "Spirit Strike", "Mental Focus"],
          leiste: [{ name: "Geister-Linie", skills: ["Summon: Fire Spirit", "Summon: Earth Spirit", "Elemental Fusion"] }, { name: "Schadenslinie", skills: ["Combustion", "Dimensional Control", "Jointstrike: Curse"] }],
          makro: [0, 1],
          tasten: [
            ["LMB", "Cold Shock", "halten"], ["RMB", "makro", "Makro halten"], ["M4", "Defiance", "erste Kontrolle sofort brechen"],
            ["1", 0], ["2", 1],
            ["Q", "Soul's Cry", "70 % Furcht, 5 s"], ["E", "Seize Magic", "nimmt bis zu 2 Buffs"], ["R", "Enhance: Spirit's Benediction", "+10 % PvP-Schaden und -Resistenz"], ["F", "Command: Proxy", "halber Schaden auf den Geist"],
            ["Z", "Summon: Ancient Spirit", "30 s, lädt Fusion"], ["X", "Summon: Water Spirit", "zweiter Geist"], ["C", "Summon: Wind Spirit", "dritter Körper im Feld"]
          ],
          opener: ["Enhance: Spirit's Benediction", "Summon: Earth Spirit", "Jointstrike: Curse", "Summon: Ancient Spirit", "Soul's Cry", "makro"],
          kombos: [
            "Angreifen (aion2builds): [[Enhance: Spirit's Benediction]] → [[Summon: Earth Spirit]] → [[Jointstrike: Curse]] → [[Summon: Ancient Spirit]], dann [[Soul's Cry]] und Makro.",
            "Angegriffen werden: die erste Kontrolle sofort mit [[Defiance]] brechen, dann [[Command: Proxy]] (die Hälfte des Schadens geht auf den Geist).",
            "Gegen Gladiator, Kleriker und Waldläufer: [[Seize Magic]] entfernt ihre Buffs. Gegen Assassine und Magier: [[Command: Proxy]].",
            "Schaden: [[Elemental Fusion]] bei 4 Stapeln, [[Combustion]] und [[Cold Shock]] füllen, solange der Geist trifft."
          ],
          tipps: [
            "[[Defiance]] im PvP hochziehen (aion2builds: Ziel-Stufe 20) – im PvE reicht Stufe 1.",
            "Geister übernehmen deine Werte beim Beschwören: erst buffen, dann beschwören."
          ]
        }
      },
      cleric: {
        kurz: "Heiler mit starkem Debuff: [[Chain of Torment]] senkt die PvE-Schadensresistenz des Ziels für die ganze Gruppe.",
        zuerst: "Healing Light",
        ablauf: [
          "Vor dem Pull: [[Light of Protection]] (+10,5 % PvE-Schadensverstärkung und -resistenz für dich und die Gruppe), [[Divine Aura]] und [[Noble Aura]].",
          "Schwächen und treffen: [[Chain of Torment]] aufs Ziel, dazu [[Condemnation]], [[Earth Punishment]] und [[Judgment Thunder]].",
          "Heilen nach Bedarf: [[Healing Light]] geht an das Gruppenmitglied mit den wenigsten LP. [[Earth's Retribution]] füllt zwischen den Heilungen."
        ],
        leiste: [
          { name: "Gebets-Linie", taste: "Q", skills: ["Condemnation", "Chain of Torment", "Earth Punishment", "Prayer of Amplification"] },
          { name: "Aura-Linie", taste: "T", skills: ["Judgment Thunder", "Divine Aura"] },
          { name: "Debuff-Linie", taste: "1", hand: true, skills: ["Debilitating Mark", "Lightning Strike Scattershot"] },
          { name: "Heil-Linie", taste: "E", hand: true, skills: ["Healing Light", "Light of Regeneration"] }
        ],
        makro: [0, 1],
        opener: ["Light of Protection", "Divine Aura", "Noble Aura", "Chain of Torment", "makro"],
        tipps: [
          "Heil- und Debuff-Linie bleiben eigene Tasten: heilen, wenn die LP wirklich fallen.",
          "Mit Kantor in der Gruppe: [[Chain of Torment]] wirkt nicht zusammen mit dessen Gelübde der Erde, [[Light of Protection]] nicht mit der Invokation der Unbesiegbarkeit. Aufgaben aufteilen.",
          "Die Gebets-Linie nutzt [[Prayer of Amplification]]. Die Top-Spieler haben im vierten Slot öfter [[Summon Resurrection]]."
        ],
        tasten: [
          ["LMB", "Earth's Retribution", "Grundangriff halten"], ["RMB", "makro", "Makro halten"], ["M4", "Defiance", "aus Kontrolle befreien"],
          ["1", 0], ["2", 1], ["3", 2, "von Hand"], ["4", 3, "von Hand"],
          ["Q", "Radiant Recovery", "reinigt und heilt die Gruppe"], ["R", "Bolt", "aufladen"], ["F", "Light of Protection", "Umschalter, einmal an"], ["Z", "Noble Aura", "Aura"]
        ],
        pvp: {
          kurz: "Heilen, reinigen, schwächen: [[Debilitating Mark]] senkt Schaden und Heilung des Gegners, [[Radiant Recovery]] löst Kontrolle von Mitspielern.",
          stigmen: ["Prayer of Amplification", "Light of Protection", "Yustiel's Power", "Voice of Doom"],
          stigmenName: "Duell und kleine Kämpfe",
          stigmenAlt: [["Absolution", "Gruppen-PvP statt Stimme des Verderbens: löst 2 Debuffs"], ["Salvation", "3 s immun"], ["Summon Resurrection", "Abyss und offene Welt"]],
          ziele: [["Earth's Retribution", 20], ["Bolt", 16]],
          passive: ["Immortal Veil", "Healing Enhancement", "Survival Willpower"],
          leiste: [{ name: "Druck-Linie", skills: ["Judgment Thunder", "Condemnation", "Chain of Torment"] }, { name: "Heil-Linie", hand: true, skills: ["Healing Light", "Light of Regeneration"] }],
          makro: [0],
          tasten: [
            ["LMB", "Earth's Retribution", "ignoriert Block und Ausweichen"], ["RMB", "makro", "Makro halten"], ["M4", "Defiance", "aus Kontrolle befreien"],
            ["1", 0], ["2", 1, "heilen von Hand"],
            ["Q", "Radiant Recovery", "löst 1 Debuff, heilt"], ["E", "Debilitating Mark", "Fokusziel schwächen"], ["R", "Prayer of Amplification", "+20 % Angriff"], ["F", "Yustiel's Power", "Gruppe +10 % PvP-Resistenz"],
            ["Z", "Voice of Doom", "Duell: Schaden über Zeit"], ["X", "Bolt", "aufladen"], ["C", "Light of Protection", "Umschalter"]
          ],
          opener: ["Light of Protection", "Debilitating Mark", "Chain of Torment", "Condemnation", "Voice of Doom", "makro"],
          kombos: [
            "Fokusziel: [[Debilitating Mark]] → [[Chain of Torment]] → [[Condemnation]] (nur auf Ziele mit Kette) → [[Voice of Doom]].",
            "Mitspieler betäubt oder in Furcht: sofort [[Radiant Recovery]].",
            "Großer Schaden kommt: [[Yustiel's Power]] für die Gruppe, in Not [[Salvation]], wenn ausgerüstet.",
            "MP: [[Earth's Retribution]] zwischen den Heilungen."
          ],
          tipps: [
            "Bei [[Chain of Torment]] und [[Debilitating Mark]] im PvP die Kontroll-Spezialisierung nehmen (aion2builds).",
            "Abyss und offene Welt: [[Summon Resurrection]] mitnehmen."
          ]
        }
      },
      chanter: {
        kurz: "Stab-Hybrid: Alles dreht sich um [[Dark Crush]], das Betäubungen kurz freischalten. Die Mantras laufen dauerhaft.",
        zuerst: "Spinning Strike",
        ablauf: [
          "Mantras an: [[Undefeated Mantra]] und [[Sprint Mantra]], dann [[Power of the Storm]]: +20 % Kampftempo und 10 % kürzere Abklingzeiten für die Gruppe.",
          "Finsterbruch öffnen: [[Rushing Smash]], dann [[Impactful Crush]] (Betäubung) öffnet [[Dark Crush]]. [[Marchutan's Wrath]] trifft bis zu 4 Ziele und öffnet ein weiteres Fenster von 3 s.",
          "Schleife: [[Spinning Strike]] für den stapelnden Krit-Schadensbonus (+15 %), dann [[Incandescent Blow]] und [[Onslaught]]. [[Recuperation]] heilt die Gruppe."
        ],
        leiste: [
          { name: "Finsterbruch-Linie", skills: ["Impactful Crush", "Marchutan's Wrath", "Spinning Strike", "Dark Crush"] },
          { name: "Sprung-Linie", hand: true, skills: ["Tremor Crush", "Rushing Smash"] }
        ],
        makro: [0, "Incandescent Blow"],
        opener: ["Power of the Storm", "Rushing Smash", "makro"],
        tipps: [
          "Mantras sind Umschalter: einmal einschalten, nie ins Makro.",
          "Das Makro zusammen mit [[Onslaught]] auf der linken Maustaste halten.",
          "Mit Kleriker in der Gruppe: [[Earth's Promise]] und [[Undefeated Mantra]] überschneiden sich mit dessen Kette des Schmerzes und Licht des Schutzes."
        ],
        tasten: [
          ["LMB", "Onslaught", "Grundangriff halten"], ["RMB", "makro", "Makro halten"], ["M4", "Defiance", "aus Kontrolle befreien"], ["M5", 1, "zum Ziel springen"],
          ["1", 0],
          ["Q", "Recuperation", "Gruppenheilung, reinigt"], ["E", "Incandescent Blow", "Makro-Schritt"], ["R", "Power of the Storm", "Kampftempo, Abklingzeiten"], ["F", "Heat Wave Blow", "bis 4 Ziele"],
          ["Z", "Undefeated Mantra", "Umschalter"], ["X", "Sprint Mantra", "Umschalter"], ["C", "Gust Rampage", "auf taumelnde Ziele"]
        ],
        pvp: {
          kurz: "Betäuben und umwerfen im Wechsel: Betäubung → [[Wave Blow]] → neue Betäubung, dazwischen [[Dark Crush]]. Heilen und Reinigen hält die Gruppe im Kampf.",
          stigmen: ["Undefeated Mantra", "Sprint Mantra", "Power of the Storm", "Obliterate"],
          stigmenName: "PvP",
          stigmenAlt: [["Barrier Spell", "LP fallen 3 s nicht unter 10 %"], ["Healing Touch", "starke Gruppenheilung"], ["Focused Defense", "sicherer Block"], ["Ensnaring Mark", "Siegel 5 s"]],
          ziele: [],
          passive: ["Blessing of Life", "Attack Preparation", "Survival Willpower"],
          leiste: [{ name: "Finsterbruch-Linie", skills: ["Incandescent Blow", "Spinning Strike", "Wave Blow", "Dark Crush"] }],
          makro: [0],
          tasten: [
            ["LMB", "Onslaught", "Grundangriff halten"], ["RMB", "makro", "Makro halten"], ["M4", "Defiance", "gibt im PvP weniger Resistenz"], ["M5", "Tremor Crush", "nach dem Ausweichen, Betäubung"],
            ["1", 0],
            ["Q", "Impactful Crush", "60 % Betäubung, öffnet Finsterbruch"], ["E", "Obliterate", "Umwerfen, bis 4 Ziele"], ["R", "Power of the Storm", "Kampftempo, Abklingzeiten"], ["F", "Recuperation", "reinigt die Gruppe"],
            ["Z", "Undefeated Mantra", "Umschalter"], ["X", "Sprint Mantra", "Umschalter"], ["C", "Rushing Smash", "heranstürmen"]
          ],
          opener: ["Power of the Storm", "Rushing Smash", "Impactful Crush", "Wave Blow", "Dark Crush", "Spinning Strike", "makro"],
          kombos: [
            "Kontroll-Kette: nach dem Ausweichen [[Tremor Crush]] (Betäubung) → [[Wave Blow]] (umwerfen, nur Betäubte) → [[Impactful Crush]] (neue Betäubung, öffnet [[Dark Crush]]) → [[Dark Crush]].",
            "Schaden: [[Spinning Strike]] (+15 % Krit-Schaden, stapelt), dann [[Incandescent Blow]].",
            "Gruppe: [[Obliterate]] wirft bis zu 4 um. Ist ein Mitspieler kontrolliert, reinigt [[Recuperation]].",
            "Die Druck-Linie zündet [[Wave Blow]] und [[Dark Crush]] nur, wenn deine Betäubung sitzt – sonst läuft der Füller."
          ],
          tipps: [
            "[[Impactful Crush]]: die Spezialisierung ab Skill-Stufe 16 ist die PvP-Wahl (aion2builds).",
            "Die Mantras sind Umschalter und laufen dauerhaft – nie ins Makro."
          ]
        }
      }
    }
  },

  /* ---------- Begleiter (Pets, zugleich Reittiere) ----------
   * Jeder Begleiter gibt einen Besitz-Effekt nach Typ und eigener Stufe (1–3 auf Global); die Effekte aller Begleiter
   * addieren sich, auch wenn sie nicht ausgerüstet sind. werte: [Wert, Stufe 1, Stufe 2, Stufe 3, Einheit, Vorzeichen (Standard +)].
   * Die Liste aller Begleiter mit Fundorten steht in data-pets.js (erzeugt). Neue Erkenntnisse hier eintragen.
   * Quellen: MetaBot (Client-Daten), Raid Relay, Daeva Guides, Odealo, aion2-guides.info (Aragon, Fubgun). */
  begleiter: {
    typen: {
      fera: { name: "Fera", kurz: "Reittempo", werte: [["Boden-Tempo (Reittier)", 1, 2, 3], ["Zusatzpräzision", 0, 1, 2], ["Agilität", 0, 0, 1]] },
      cognia: { name: "Cognia", kurz: "Kampfwerte", werte: [["LP", 10, 20, 30], ["Kritischer Treffer", 0, 1, 2], ["Macht", 0, 0, 1]] },
      natura: { name: "Natura", kurz: "Ausdauer", werte: [["Ausdauer (SP)", 3, 6, 9], ["Krit.-Widerstand", 0, 1, 2], ["Präzision", 0, 0, 1]] },
      varia: { name: "Varia", kurz: "Sprint beim Reiten", werte: [["Sprint-Ausdauerkosten (Reittier)", 0.1, 0.2, 0.3, "%", "−"], ["Zusatzausweichen", 0, 1, 2], ["Vitalität", 0, 0, 1]] },
      specia: { name: "Specia", kurz: "nur Aussehen", werte: [] }
    },
    /* Seelen für Freischalten, Stufe 2 und Stufe 3 */
    seelen: [5, 25, 75],
    /* Reihenfolge der Typen je Ziel */
    ziele: {
      tempo: { name: "Bewegungstempo", typen: ["fera"], text: "Fera-Begleiter zuerst: Jeder gibt Boden-Tempo beim Reiten. Jeder neue Begleiter zählt außerdem für die Sammel-Titel mit dauerhaftem Bewegungstempo." },
      kampf: { name: "Kampfwerte", typen: ["cognia", "natura", "fera", "varia"], text: "Cognia zuerst (Macht und Kritischer Treffer auf Stufe 3), dann Natura (Präzision). Fera und Varia bringen im Kampf wenig." },
      sammlung: { name: "Sammlung", typen: ["fera", "cognia", "natura", "varia"], text: "Für Titel, Meilensteine und Seelenkristalle zählt jeder Begleiter gleich – am schnellsten sind die Gebiete mit den meisten fehlenden." }
    },
    /* Sammel-Titel: Besitz-Effekt Bewegungstempo in %, gilt dauerhaft, auch wenn ein anderer Titel ausgerüstet ist */
    titel: [[10, "Gezähmt", 0.3], [30, "Alles bezwingen", 0.5], [100, "Im Einklang mit allem", 0.7], [200, "Über alles herrschen", 1]],
    /* Allzweck-Titel mit Bewegungstempo beim Tragen (Wert in %); en wie in der Armory */
    tempoTitel: [
      { de: "Zikels Urquelle begegnen", en: "Encountering Zikel's Core", fraktion: "asmo", wert: 3, extra: "LP +900, LP-Regeneration (Tränke) +400", herkunft: "Verräter und Überlebender" },
      { de: "Kaisinels Urquelle begegnen", en: "Encountering Kaisinel's Core", fraktion: "elyos", wert: 3, extra: "LP +900, LP-Regeneration (Tränke) +400", herkunft: "Poeta, Insel des Todes" },
      { de: "Vollstrecker von Legat Lagta", en: "Executioner of High Commander Lagta", fraktion: null, wert: 2.5, extra: "Kampftempo +2,5 %", herkunft: "Legat Lagta besiegen" },
      { de: "Scharfsinn", en: "Keen Eye", fraktion: null, wert: 2.5, extra: "Flugtempo +2,5 %", herkunft: "Boss-Beute" }
    ],
    /* Meilensteine der Sammlung: bei 5, dann alle 10 Begleiter 100 Seelenkristalle, jeder 50. gibt 10 Bindungsbonbons */
    meilensteine: { erster: 5, schritt: 10, kristalle: 100, bonbonAlle: 50, bonbons: 10 },
    grundtempo: { lauf: 900, sprint: 1200, gleiten: 800 },
    tipps: [
      ["Erst freischalten, dann leveln", "5 Seelen geben schon den Besitz-Effekt der Stufe 1 und zählen für Titel und Meilensteine. Stufe 2 kostet 25, Stufe 3 weitere 75 Seelen – Freischalten bringt pro Seele fünfmal so viel."],
      ["Gebiete statt Einzelmonster", "Seelen droppen laut Client-Daten zu 100 % pro Kill, also rund 5 Kills je Begleiter. In guten Gebieten stehen Monster für viele Begleiter nebeneinander."],
      ["Gilt für den ganzen Server", "Sammlung und Gattungs-Einsicht teilen sich alle Charaktere eines Servers – auch Twinks farmen für dich."],
      ["Andere Fraktion über den Riss", "Manche Begleiter gibt es nur auf der Karte der anderen Fraktion. Dorthin kommst du über den Raumzeit-Riss und hast etwa eine Stunde; Wachen meiden."],
      ["Doppelte Pet-Items", "Ein Pet-Item für einen Begleiter, den du schon hast, wird zur Seele – nichts wegwerfen."],
      ["Kein schnelleres Reittier", "Alle Reittiere laufen gleich schnell (Laufen 900, Sprint 1.200). Schneller machen dich nur Fera-Besitz-Effekte und Titel."],
      ["Nicht AFK farmen", "Immer gleiche Abläufe ohne echte Eingabe lösen die Bot-Prüfung aus."]
    ],
    quellen: [
      { name: "Alle Begleiter, Typ-Boni und Seelen-Fundorte (MetaBot, Client-Daten)", url: "https://metabot.gg/de/aion-2/mounts" },
      { name: "Seelen farmen, Typ-Werte und Sammel-Titel (MetaBot)", url: "https://metabot.gg/en/aion-2/guides/mount-soul-farming-guide" },
      { name: "Titel mit Bewegungstempo (MetaBot)", url: "https://metabot.gg/de/aion-2/titles" },
      { name: "Werte je Typ und Stufe, beste Farm-Gebiete (Raid Relay)", url: "https://raidrelay.com/aion-2-pets-genus-guide" },
      { name: "Seelen je Stufe und Gattungs-Einsicht (Daeva Guides)", url: "https://daevaguides.com/en/guides/pets-genus-insight/" },
      { name: "Reihenfolge Cognia vor Natura (aion2-guides.info, Aragon/Fubgun)", url: "https://aion2-guides.info/en/pets/" }
    ]
  },

  /* ---------- Kampfanalyse (Schadensmesser im Spiel) ----------
   * Seit dem Update vom 1. April 2026 hat AION 2 einen eigenen Schadensmesser. Fremd-Messer, die den Netzverkehr
   * oder Speicher des Spiels lesen, baut die Seite bewusst nicht ein (Betriebsregeln: nicht autorisierte Programme). */
  kampfanalyse: {
    taste: "Strg+X",
    zeigt: ["Kampfzeit", "DPS", "Gesamtschaden", "Anteil jedes Skills (Detail-Modus)"],
    bedienung: "Strg+X öffnet und schließt die Kampfanalyse (Einstellungen › Tastenbelegung › Kampfanalyse, falls belegt). Umschalten zwischen einfach und detailliert, Deckkraft einstellbar, Fenster frei verschiebbar.",
    grenzen: "Nur dein eigener Charakter, keine Gruppenwerte. Einzelziele sauber zu messen ist umständlich – am besten an der Trainingspuppe allein testen.",
    fremd: "Fremd-Messer lesen den Netzwerkverkehr oder Speicher des Spiels mit. NCSOFTs Betriebsregeln sanktionieren nicht autorisierte Programme bis zur Kontosperre; ob passive Messer darunter fallen, hat NCSOFT nicht gesagt. Die Seite und die Desktop-App lesen deshalb nichts aus dem Spiel.",
    test: [
      "Zur Trainingspuppe in deiner Hauptstadt-Region gehen (Karte: Trainingspuppen).",
      "Buffs ablaufen lassen, Abklingzeiten zurücksetzen lassen und die Kampfanalyse öffnen (Strg+X).",
      "Timer starten und genau so lange nur dein Makro halten, Burst wie im Ablauf.",
      "DPS aus der Kampfanalyse eintragen. Dann eine Sache ändern (Linie, Stigma, Makro-Schritt) und wiederholen.",
      "Erst ab etwa 3 % Unterschied ist eine Variante sicher besser – Krits streuen."
    ],
    dauer: [60, 120, 180],
    quellen: [
      { name: "Patch 1. April 2026: eigener Schadensmesser (AION2 Hub, Übersetzung der koreanischen Notes)", url: "https://aion2hub.com/updates/aion-2-update-2026-04-01" },
      { name: "Kampfanalyse: Strg+X, Modi, Grenzen (games.gg)", url: "https://games.gg/aion-2/guides/aion-2-combat-analysis-guide/" },
      { name: "Schadensmesser und Fremd-Tools, Betriebsregeln (aion2guide.org)", url: "https://aion2guide.org/guides/aion-2-damage-meter/" }
    ]
  },

  audit: {
    /* Endgame-Schwellen (Patch 21.10. und Ludra-Rückkehr laut NCSOFT-Ankündigung vom 23.10.2026) */
    endgame: {
      hard: 2600, ludra: 2800, ludraHard: 3000, ludraAb: "2026-11-04", ludraPraezision: "1.450–1.500",
      aufstieg: [[2500, "Herausforderung"], [2000, "Schwer"], [1500, "Normal"], [1000, "Leicht"]]
    },
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
    /* Die vier meistgenutzten Stigmen der Top-Spieler je Klasse (Metabot, Stand 3.10.2026, siehe data-skills.js) */
    coreStigmas: {
      gladiator: ["Lunge Stance", "Zikel's Blessing", "Rage Burst", "Focused Block"],
      templar: ["Taunt", "Empyrean Lord's Punishment", "Battlefield Banner", "Doom Shield"],
      assassin: ["Illusive Clone", "Swift Contract", "Savage Fang", "Triniel's Dagger"],
      ranger: ["Vaizel's Authority", "Bow of Blessing", "Supporting Fire", "Griffon Arrow"],
      sorcerer: ["Element Enhancement", "Delayed Explosion", "Fire Wall", "Cold Storm"],
      spiritmaster: ["Summon: Ancient Spirit", "Enhance: Spirit's Benediction", "Flame Blessing", "Jointstrike: Corrode"],
      cleric: ["Light of Protection", "Noble Aura", "Earth Punishment", "Summon Resurrection"],
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
