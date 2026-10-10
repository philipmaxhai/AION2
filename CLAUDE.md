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

- Ablauf: `public/assets/js/charakter.js` fragt `/api/charakter` (Suche oder `cid`+`sid`), danach parallel `/api/daevanion` und `/api/items` (12er-Pakete) und setzt alles zu einem Charakter-Objekt zusammen. `public/assets/js/audit.js` (`DK_AUDIT.analyse`) erzeugt daraus Sofort-Urteil, Quick-Wins, Tagesziel, Gear-Tabelle, Stigmen, Daevanion, Farm- und Anti-Waste-Liste.
- Regeln und Zahlen (Upgrade-Stufen je Klasse und Fraktion, Drop-Chancen, Pity, Kern-Stigmen, Verstärkungskosten) stehen in `DK_DATA.audit` in `public/assets/js/data.js`. Neue Erkenntnisse dort eintragen, nicht im Code.
- Live: https://aion2.philipmax-hain.workers.dev – Cloudflare Worker (Workers Builds), baut jeden Push auf den verbundenen Branch. `wrangler.jsonc` liefert nur `public/` aus und schickt `/api/*` an `proxy/worker.mjs`; der `name` muss `aion2` bleiben.
- Proxy: `proxy/armory-core.mjs` (Web-Standard `fetch`/`Response`), eingebunden von `proxy/worker.mjs` (Worker), `functions/api/[[route]].js` (Alternative Cloudflare Pages) und `tools/dev-server.mjs` (lokal). Jede Route muss im kostenlosen Cloudflare-Tarif bleiben: unter 10 ms CPU und 50 Unteranfragen pro Anfrage.
- Lokal testen: `NODE_USE_ENV_PROXY=1 node tools/dev-server.mjs` (die Variable nur hinter dem Sandbox-Proxy nötig), dann im Browser http://localhost:8787 öffnen. Keine fremden Charaktere zum Testen abrufen; die Engine mit abgewandelten Daten des Nutzer-Charakters prüfen.
- Alle Texte aus der Armory vor der Ausgabe escapen.

## Website

- Alles Öffentliche liegt in `public/`: `index.html`, `assets/css/style.css`, `assets/js/{config,data,zeit,karte,audit,app,charakter}.js`
- Spieldaten, Zeiten, Karte und Klassen: `public/assets/js/data.js`
- Zeiten werden in `Europe/Berlin` angezeigt; Quellzeiten stehen mit ihrer Zeitzone (`UTC` oder `Europe/Berlin`) in `events`.
