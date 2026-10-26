# AION 2 Daeva-Kompass

Fan-Website (statisch, ohne Build) plus Charakter-Audit für AION 2 Global. Antworten an den Nutzer auf Deutsch.

## Charakter-Audit

Schreibt der Nutzer einen Charakternamen (optional mit Server), ist das der Auftrag für einen Min-Max-Audit:

1. `python3 -I tools/armory.py "<Name>"` ausführen. Der Name allein reicht: gesucht wird auf allen Global-Servern, gemerkte Namen stehen in `tools/charaktere.json`.
   - Mehrere Treffer: die Liste zeigen und nach dem Server fragen, dann mit `--server <Server> --merken` erneut abrufen und `tools/charaktere.json` committen.
   - Rohdaten (Werte, Ausrüstung mit Manasteinen, Skills, Daevanion-Bretter) liegen danach in `armory-cache/<Name>-<Server>/charakter.json`.
   - Schlägt der Abruf fehl: das sagen und um Screenshots bitten. Nie Werte erfinden.
2. Antwort in dieser Struktur:
   1. **Sofort-Urteil** (erster Satz): das Upgrade mit dem höchsten CP-/Gearscore-Gewinn pro Aufwand.
   2. **Session-Fahrplan**: Quick-Win unter 10 Minuten (Manasteine, Daevanion-Knoten, Stigmen, Re-Rolls) und Tagesziel (konkreter Dungeon, Riss, Abyss-Spot oder Boss, Zeiten in deutscher Zeit).
   3. **Stat- & Build-Tuning**: Abgleich mit Breakpoints (Krit, Genauigkeit, Angriffs-/Zaubergeschwindigkeit), nächstes BiS-Teil und Übergangsgear, Rotation passend zu Stigmen und Gear.
   4. **Farming & Anti-Waste**: schnellste Wege zu fehlenden Materialien, was nicht über welche Stufe verstärkt werden sollte.
   5. **Abschluss**: kurz nach Kinah, AP und Verzauberungssteinen fragen.
3. NCSOFT veröffentlicht keine CP-Formel. Alles, was nicht direkt aus den Daten kommt, als Schätzung kennzeichnen. Spielwissen bei Bedarf gegen aktuelle Guides prüfen (Quellenliste in `public/assets/js/data.js`).

Die Armory-Endpunkte (`api-search.plaync.com`, `aion2.plaync.com`) sind undokumentiert und können sich ändern. Sie brauchen Netzwerkzugriff auf diese Hosts.

## Charakter-Check auf der Website

- Ablauf: `public/assets/js/charakter.js` fragt `/api/charakter` (Suche oder `cid`+`sid`), danach parallel `/api/daevanion`, `/api/items` (12er-Pakete, aktuelle Stufe) und `/api/items` mit Stufe 10 (Vorschau, was +10 bringt) und setzt alles zu einem Charakter-Objekt zusammen. `public/assets/js/audit.js` (`DK_AUDIT.analyse`) erzeugt daraus Sofort-Urteil, Fahrplan in Phasen (Heute, Woche, 2–3 Wochen, ab 2100), einen Plan pro Slot (ersetzen mit Ziel-Item und Werte-Vergleich, Material, verstärken mit Kosten und Gewinn, Manasteine, Zusatzwerte), Stigmen, Skillpunkte (`skillPoints`: Punkte-Stufe = Armory-Stufe minus Daevanion-Knoten minus Skill-Stufen der Ausrüstung, Vergleich mit den Top-Spielern, Vorschlag zum Umverteilen), Daevanion, Farm- und Anti-Waste-Liste.
- Darstellung: Charakterfenster mit Item-Kacheln (Rahmen in den Seltenheitsfarben der Armory), Porträt, Skill-, Stigma-, Werte- und Daevanion-Symbole. Bilder kommen vom NCSOFT-CDN (`assets.playnccdn.com`, Porträts von `profileimg.plaync.com`); der Proxy reicht nur Adressen dieser Hosts durch. Fehlt ein Bild, zeigt die Seite ein Zeichen statt eines kaputten Bildes.
- Regeln und Zahlen (Upgrade-Stufen je Klasse und Fraktion, Drop-Chancen, Pity, Kern-Stigmen) stehen in `DK_DATA.audit` in `public/assets/js/data.js`. Ziel-Items mit Bild, Werten, Bonus bei +10, Rezept und Verstärkungskosten je IL-Stufe stehen in `public/assets/js/data-items.js` (aus den Spieldaten erzeugt, nicht von Hand pflegen). Neue Erkenntnisse dort eintragen, nicht im Code.
- Namen wie im deutschen Client: Der Proxy lädt Grunddaten zusätzlich mit `lang=de-DE` und liefert `de` neben `name`. Die Logik vergleicht die englischen Namen, angezeigt wird `de`.
- Live: https://aion2.philipmax-hain.workers.dev – Cloudflare Worker (Workers Builds), baut jeden Push auf den verbundenen Branch. `wrangler.jsonc` liefert nur `public/` aus und schickt `/api/*` an `proxy/worker.mjs`; der `name` muss `aion2` bleiben.
- Proxy: `proxy/armory-core.mjs` (Web-Standard `fetch`/`Response`), eingebunden von `proxy/worker.mjs` (Worker), `functions/api/[[route]].js` (Alternative Cloudflare Pages) und `tools/dev-server.mjs` (lokal). Jede Route muss im kostenlosen Cloudflare-Tarif bleiben: unter 10 ms CPU und 50 Unteranfragen pro Anfrage.
- Lokal testen: `NODE_USE_ENV_PROXY=1 node tools/dev-server.mjs` (die Variable nur hinter dem Sandbox-Proxy nötig), dann im Browser http://localhost:8787 öffnen. Keine fremden Charaktere zum Testen abrufen; die Engine mit abgewandelten Daten des Nutzer-Charakters prüfen.
- Alle Texte aus der Armory vor der Ausgabe escapen.

## Website

- Alles Öffentliche liegt in `public/`: `index.html`, `assets/css/style.css`, `assets/js/{config,data,data-items,data-daevanion,data-skills,data-pets,zeit,karte,audit,daevanion,skills,begleiter,pantheon,app,charakter,desktop}.js` (Reihenfolge der Script-Tags: die `data-*.js` nach `data.js`, `daevanion.js`, `skills.js`, `begleiter.js` und `pantheon.js` nach `audit.js` und vor `app.js`, `desktop.js` zuletzt), dazu `download/` mit der Desktop-App.
- Design: modern und app-artig, kein generischer Fantasy- oder KI-Look. Desktop ab 1100 px mit Seitenleiste (Navigation mit Linien-Symbolen aus dem SVG-Sprite in `index.html`), darunter Kopfzeile mit scrollbaren Reitern. Dunkel (Graphit) und hell (Grau/Weiß); Akzent Ätherblau, Gold nur für Seltenheit und die Kern-Route. Keine Verläufe auf Text, keine Leuchteffekte, keine Zierecken, flache Karten mit feinen Linien statt Karten in Karten. Schrift: Archivo mit variabler Breite – Überschriften schmal und kräftig (`font-stretch: var(--narrow)`), Text in normaler Breite, kleine Beschriftungen in Großbuchstaben. Farben nur über die CSS-Variablen in `style.css`, beide Varianten pflegen. Layouts im Inhalt über Container-Abfragen auf `main` (`@container main`), nicht über die Fensterbreite. Der Hero zeigt die offizielle Key-Art vom NCSOFT-CDN.

## Skills & Makros

- `public/assets/js/data-skills.js`: alle 35 Skills je Klasse (aktiv, passiv, Stigma) mit deutschem Namen, Lernstufe und Symbol (`https://assets.playnccdn.com/static-aion2-gamedata/resources/<Symbol>.png`), dazu je Klasse die Durchschnittsstufen und Stigmen der Top-Spieler sowie Leveling-, Endgame- und PvP-Build von MetaBot. Erzeugt von `tools/skills_daten.py` (GameWith-Klassendatenbank englisch/deutsch, über das Symbol zugeordnet und gegen `data-daevanion.js` und die Armory geprüft). Nicht von Hand pflegen, neu erzeugen.
- `DK_DATA.skillPlan` in `data.js`: kuratiert je Klasse – Kurztext, zuerst zu levelnder Skill, Ablauf, Leisten-Linien (von oben nach unten, der unterste hat Vorrang, höchstens vier), Makro-Schritte (jeder Schritt muss auf einer Taste liegen), komplette Tastenbelegung `tasten` ([Taste, Linie | Skill | "makro", Hinweis], Schema in `tastenSchema`: Maus L Grundangriff, Maus R Makro, 1–4 Linien, Q/E Kontrolle, R/F Burst und Schutz, Z–V Rest, Maus 4 Schockaufhebung, Maus 5 Sprung), Opener, Tipps. Unter `pvp` dasselbe für PvP plus Stigmen-Set, Alternativen mit Grund, Ziel-Stufen (aion2builds), Passive und Kombos; `skillPlan.pvp` hält die PvP-Grundregeln. Dazu Skillpunkte-Quellen (203 + 122 + 59 = 384) und die allgemeine Makro-Anleitung. Texte nennen Skills als `[[English Name]]`, angezeigt wird der deutsche Name. PvP-Linien, PvP-Makro und die Tastenbelegung sind Vorschläge der Seite (so kennzeichnen); Stigmen und Ziel-Stufen kommen aus den Quellen. Neue Erkenntnisse dort eintragen.
- `public/assets/js/skills.js`: Ansicht „Skills & Makros“ (`?klasse=…[&modus=pvp]#skills`) mit Umschalter PvE/PvP: Tastenbild (Maus und Tastatur, Linien als Stapel; auf schmalen Bildschirmen als Liste), „Als Bild speichern“ (Canvas-PNG, Symbole über `/api/icon`), Linien, Makro-Kette, Opener, Skillpunkte (PvE: Rangliste nach Top-Spielern; PvP: Metabot-PvP-Build, Ziel-Stufen, Unterschied zu PvE), Stigmen, Ablauf bzw. Kombos, PvP-Regeln mit Link aufs Azphel-Brett, Text zum Kopieren. Aus Klassen-Seite, Übersicht und Charakter-Check verlinkt (`data-action="open-sk"`, optional `data-mode="pvp"`).
- `DK_AUDIT.analyse` nutzt `coreStigmas` (die vier meistgenutzten Stigmen der Top-Spieler) und die Top-Spieler-Stufen für den Skillpunkte-Vorschlag; Skills, die das PvP-Build braucht, markiert der Vorschlag.
- Proxy-Route `/api/icon?n=ICON_…`: reicht ein Skill-Symbol aus dem festen Spieldaten-Ordner des NCSOFT-CDN mit CORS-Kopf durch (das CDN sendet keinen, ein Canvas-Export braucht ihn). Nur Namen der Form `ICON_[A-Za-z0-9_]`, 7 Tage Cache.

## Daevanion

- `public/assets/js/data-daevanion.js`: Raster aller sechs Bretter (15×15, Position, Typ, Seltenheit; `art`: `skill` für die vier Skill-Bretter, `pve` für Ariel, `pvp` für Azphel) und die Skill-Knoten je Klasse mit deutschen Namen. Aus dem GameWith-Planer erzeugt (Daten der offiziellen Charakterseiten), für den Beschwörer Knoten für Knoten gegen die Armory geprüft. Ariel (seit 21.10.2026, nur PvE- und Boss-Werte, eigene Ariel-Punkte) kommt aus dem Rechner von AION2 Vault; der Generator gleicht dessen fünf alte Bretter vorher mit GameWith ab und bricht bei Abweichungen ab. Werte-Knoten sind für alle Klassen gleich. Nicht von Hand pflegen, neu erzeugen.
- `DK_DATA.daevanionPlan` in `data.js`: Kern-Skills, Passive und Ecken je Klasse (englische Namen wie in der Armory) mit Quelle. `DK_DATA.ariel`: Ariel-Punkte (höchstens 30 je Charakter, 100 Fragmente je Punkt), Text und Quellen. Neue Erkenntnisse dort eintragen.
- `public/assets/js/daevanion.js`: Route (günstigster Weg vom Start, Knotenkosten 1/2/3/4: erst Kern-Skills und die wichtigste Passive, dann Ecken, dann übrige Passive, danach Ausbau nach Nutzen pro Punkt; auf Ariel erst die Ecken mit PvE- und Boss-Schadensverstärkung, beim Templer die Widerstands-Ecken), Brett als SVG, PNG-Export, Ansicht „Daevanion“ (`?klasse=…&brett=…#daevanion`). Im Charakter-Check startet die Route von den offenen Knoten des Charakters (der Proxy liefert `row`/`col` je Knoten).
- Spieldaten, Zeiten, Karte und Klassen: `public/assets/js/data.js`
- Zeiten werden in `Europe/Berlin` angezeigt; Quellzeiten stehen mit ihrer Zeitzone (`UTC` oder `Europe/Berlin`) in `events`.

## Begleiter

- `public/assets/js/data-pets.js`: alle 207 Begleiter (Pets, zugleich Reittiere) mit ID wie in der Armory, englischem und deutschem Namen, Typ (fera, cognia, natura, varia, specia), Bild vom NCSOFT-CDN (`UT_Vehicle_Portrait_…`, aus MetaBots Modellnamen abgeleitet und per HEAD geprüft) und Seelen-Monstern `[Monster, Stufe, [Gebiete], Karte, Spawns, Chance]`. Karten: Verteron/Eltnen = Elyos, Altgard/Morheim = Asmodier, Reshanta = Abyss, `Dungeon` = nur in Instanzen. Erzeugt von `tools/pets_daten.py` (MetaBot, Liste englisch, Einzelseiten deutsch), geprüft gegen `armory-cache`. Nicht von Hand pflegen.
- `DK_DATA.begleiter` in `data.js`: Besitz-Effekt je Typ und Begleiter-Stufe (1–3 auf Global; jeder Begleiter gibt ihn einzeln, die Effekte addieren sich), Seelen je Stufe (5/25/75), Ziele mit Typ-Reihenfolge, Sammel-Titel (10/30/100/200 Begleiter, Besitz-Effekt Bewegungstempo), Tempo-Titel zum Tragen, Meilensteine, Tipps, Quellen. Neue Erkenntnisse dort eintragen.
- `public/assets/js/begleiter.js`: Ansicht „Begleiter“ (`?ziel=tempo|kampf|sammlung#begleiter`). Abhaken je Begleiter mit Stufe (localStorage `dk.begleiter`), Summen der Besitz-Effekte, Farm-Route (gierig das Gebiet mit den meisten fehlenden Ziel-Begleitern auf der eigenen Karte und im Abyss, höchstens 8; Rest: andere Fraktion über den Riss, Dungeons, ohne Monster), Bewegungstempo-Quellen. `DK_BG.fromCharacter` übernimmt aus dem Charakter-Check Fraktion, aktiven Begleiter (wird abgehakt) und getragene Titel; der Proxy liefert dafür `pet.id` und `pet.level`. Die Armory zeigt nur den aktiven Begleiter, nicht die Sammlung.

## Pantheon

- `DK_DATA.pantheon` in `data.js`: Plätze (1 Koloss, 4 Statuen, 12 Kunstwerke), die zehn Götter-Werte (deutscher Name und Wirkungen wie in der Armory, Schlüssel = Armory-Typ in Kleinbuchstaben), Schadens-Reihenfolge, alle bekannten Teile mit Werten, `oder` (Teil trägt zusätzlich einen dieser Werte), Fraktion, Quelle, Stufe (1 = beste) und `leicht` (schnell zu haben), Tipps und Quellen (AION 2 Maps, Game8). Teile mit englischem Namen; deutsche Namen sind noch nicht bekannt. Neue Erkenntnisse dort eintragen.
- `public/assets/js/pantheon.js`: Ansicht „Pantheon“ (`#pantheon`). Abhaken je Teil mit gewähltem Zusatzwert (localStorage `dk.pantheon`), Belegung der Plätze (Stufe, dann Schaden), nächste Schritte je Platzart (freie Plätze zuerst, schnell erreichbare Teile vorn), Götter-Werte aus den Teilen, der Ziel-Aufstellung und dem Charakter. `DK_PT.fromCharacter` übernimmt Fraktion und Götter-Werte (Armory-Typen Justice … Space); die Armory zeigt nicht, welche Teile man hat.

## Dungeons und Endgame

- Schwellen, Stufen und Schritte des Fahrplans stehen in `gates`, `stages` und `steps` in `data.js`; `DK_DATA.audit.endgame` hält Hard-Modus (IL 2600), Ludra (2800, Hard 3000, ab 04.11.2026, Präzision) und die Stufen der Aufstiegsprüfung für den Charakter-Check. Auf Global gibt es bisher keine Unterwerfung und als Raid nur Ludra.

## Kampfanalyse und Desktop-App

- Schaden misst das Spiel selbst (Kampfanalyse, Strg+X, seit dem Patch vom 1. April 2026; nur der eigene Charakter). `DK_DATA.kampfanalyse` hält Bedienung, Grenzen und Testablauf; `skills.js` zeigt daraus den Schadenstest (`#sk-test`: Timer, DPS-Liste je Klasse und Modus in localStorage `dk.dps`). Keine Werkzeuge bauen, die Netzverkehr oder Speicher des Spiels lesen (NCSOFT sanktioniert nicht autorisierte Programme).
- `desktop/`: Windows-App in Go mit WebView2 (`github.com/jchv/go-webview2`, kein cgo). Lädt die Live-Seite (Startseite prüft zuerst die Verbindung), Fenster mit Vordergrund, Deckkraft und Durchklicken (Layered-Stil), kompakter Größe, globalen Tasten (Strg+Umschalt+K zeigen/verstecken, D Durchklicken, 0 zurücksetzen; einstellbar), einer Instanz und gemerkter Position. Daten portabel in `DaevaKompass-Daten` neben der exe. Logik ohne Windows in `config.go`, `hotkey.go`, `bridge.go` (getestet mit `go test`), Fenster in `app_windows.go`.
- Brücke zur Seite: `window.dkDesktop(befehl, wert)` mit `info`, `oben`, `deckkraft`, `durchklicken`, `kompakt`, `oeffnen` (nur https); Zustandsänderungen per globaler Taste kommen als Ereignis `dkdesktop`. `public/assets/js/desktop.js` baut daraus das Overlay-Menü und öffnet fremde Links im Browser; ohne App zeigt es nur die Download-Seite (`#desktop`).
- Bauen: `tools/build-desktop.sh` (go test, go vet für Windows, Ressourcen mit go-winres aus `desktop/winres/`, Build nach `public/download/DaevaKompass.exe` plus `DaevaKompass.json` mit Größe und SHA-256). Die exe muss unter 25 MiB bleiben (Grenze für statische Dateien des Workers).
