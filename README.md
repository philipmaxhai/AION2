# Daeva-Kompass · AION 2

Eine Fan-Website für AION 2 (Global/EU): Gearscore schnell über 1400 pushen, mit interaktiver Karte und allen Spielzeiten in deutscher Zeit. Der Fokus liegt auf dem Spiritmaster, alle acht Klassen sind dabei.

Die Seite geht davon aus, dass die Main-Story durch ist, du Level 45 bist und mindestens 1400 Gearscore hast.

## Funktionen

- **Übersicht**: Gearscore eingeben, Klasse und Fraktion wählen. Eine Leiste zeigt die Tore bei 1000, 1400, 1600, 1900, 2100, 2200 und 2500 GS und was sie freischalten. Dazu die nächsten Termine, deine nächsten fünf Schritte und der Tagesstand.
- **Gearscore-Fahrplan**: Schritte nach Aufwand und Ertrag sortiert (Gürtel/Amulett, Daevanion, Konfliktrunen, Vakron, Urugugu, Albtraum, Transzendenz, Fire Temple, Raids). Abhaken, Odyle-Rechner, Gear-Weg für deine Klasse, Liste der typischen Fehler.
- **Karte von Atreia**: Schematische Karte mit Elysea, Abyss (Reshanta) und Asmodae. Monolithe, Feldbosse, Artefakte, Raumzeit-Risse und Trainingspuppen. Zoom per Mausrad, Pinch oder Buttons. Feldboss-Timer starten („Gerade getötet“), eigene Pins setzen. Laufende Events leuchten auf der Karte.
- **Spielzeiten**: Tages-/Wochen-Reset, Raumzeit-Riss, Shugo-Fest, Dimensionsinvasion, Artefakt-Belagerung und Bosse, immer in deutscher Zeit (MEZ/MESZ, Umstellung automatisch). Tagesleiste, Wochentabelle, Versatz pro Termin zum Korrigieren und Erinnerung 5 Minuten vorher.
- **Checkliste**: Täglich und wöchentlich, setzt sich zum Reset selbst zurück.
- **Klassen**: Spiritmaster ausführlich (Geister, Stigmen, Skill-Ränge, Daevanion, Gear-Werte, Ablauf), dazu Gladiator, Templar, Assassin, Ranger, Sorcerer, Cleric und Chanter.

Alles, was du einstellst, speichert nur dein Browser (localStorage).

## Charakter-Check für alle Spieler

Name eingeben, fertig: Die Seite lädt Ausrüstung, Manasteine, Stigmen und Daevanion aus der NCSOFT-Armory und erstellt einen Upgrade-Plan – Sofort-Urteil, Quick-Wins, Tagesziel mit deutschen Zeiten, Gear-Tabelle mit nächstem Teil je Slot, Farm- und Anti-Waste-Liste, Ressourcen-Rechner. Für alle 8 Klassen und alle Global-Server.

NCSOFT blockt Abrufe, die direkt von fremden Websites kommen. Deshalb läuft ein kleiner Proxy mit, der kostenlos auf **Cloudflare Pages** läuft – auf derselben Adresse wie die Website.

### Online stellen (einmalig, ca. 5 Minuten)

1. Kostenloses Konto bei [Cloudflare](https://dash.cloudflare.com/sign-up) anlegen.
2. **Workers & Pages › Erstellen › Pages › Mit Git verbinden** und dieses Repository wählen.
3. Einstellungen: Branch `main` (oder diesen Feature-Branch), Framework **Keins**, Build-Befehl **leer**, Ausgabeverzeichnis **leer bzw. `/`**.
4. **Speichern und bereitstellen.** Nach rund einer Minute läuft alles unter `https://<projektname>.pages.dev`.
5. Diese Adresse in `assets/js/config.js` als `liveUrl` eintragen. Wer dann eine Kopie ohne Server-Teil öffnet (lokale Datei, GitHub Pages), wird beim Charakter-Check automatisch auf die Online-Version geschickt.

Wichtig: über **„Mit Git verbinden“** einrichten, nicht per Drag-and-drop-Upload. Beim Upload fehlt der Server-Teil (`functions/`), und der Charakter-Check meldet dann, dass er nur auf der veröffentlichten Seite läuft.

Jeder Push aktualisiert die Seite automatisch. Der Proxy (`functions/api/`) beantwortet nur feste NCSOFT-Abfragen mit geprüften Parametern und cacht Antworten 10 Minuten. Grunddaten, Daevanion und Items sind getrennte Anfragen, damit jede im kostenlosen Tarif bleibt.

**Website schon auf GitHub Pages?** Dann nur den Proxy als Worker starten (`cd proxy && npx wrangler deploy`) und die Worker-Adresse in `assets/js/config.js` als `apiBase` eintragen.

**Lokal testen:** `node tools/dev-server.mjs` startet Website und Proxy auf http://localhost:8787 (Node 18+).

## Charakter-Abruf im Terminal (Global)

```
python3 tools/armory.py <Name>                 # sucht auf allen Global-Servern
python3 tools/armory.py <Name> --server Siel    # bei Namensgleichheit Server angeben
python3 tools/armory.py <Name> --merken         # Server merken, danach reicht der Name
```

Zeigt Klasse, Level, Kampfkraft, Gearscore, Werte, Ausrüstung mit Verstärkung und Manasteinen, Skills und Daevanion. Nutzt die öffentliche NCSOFT-Armory (dieselben Endpunkte wie Shugo.gg). Diese Endpunkte sind nicht dokumentiert und können sich ändern.

## Öffnen

Kein Build nötig. Einfach `index.html` im Browser öffnen.

Online stellen über GitHub Pages: Repository › Settings › Pages › Branch auswählen, Ordner `/ (root)`.

## Daten anpassen

Alle Spieldaten stehen in [`assets/js/data.js`](assets/js/data.js):

- `events`: Spielzeiten. `tz` ist die Zeitzone, in der die Quelle die Zeit angibt (`UTC` oder `Europe/Berlin`); die Seite rechnet in deutsche Zeit um.
- `steps` und `gates`: Gearscore-Fahrplan und Schwellen.
- `regions` und `markers`: Karte (viewBox 800 × 1300).
- `classes`: Klassen-Daten.

Jeder Eintrag hat eine `confidence`: `ok` (mehrere Quellen einig), `community` (Konsens der Guides), `offen` (Quellen widersprechen sich).

## Datenlage

Stand 09.10.2026, vier Tage nach dem Global-Launch am 05.10.2026. NCSOFT hat für Europa noch keinen offiziellen Zeitplan veröffentlicht. Die Werte stammen aus Community-Guides (Liste unter „Quellen“ auf der Seite) und widersprechen sich teilweise. Unsichere Werte sind markiert und Zeiten lassen sich auf der Seite per Versatz korrigieren.

## Aufbau

```
index.html            Seite
assets/css/style.css  Design (dunkel und hell)
assets/js/data.js     Spieldaten
assets/js/zeit.js     Zeitzonen-Rechnung
assets/js/karte.js    Karte (SVG, Zoom, Pins)
assets/js/app.js      Oberfläche
assets/js/audit.js    Analyse-Regeln des Charakter-Checks
assets/js/charakter.js  Charakter-Check (Suche, Darstellung)
assets/js/config.js   Adresse des Proxys (leer = gleiche Website)
proxy/armory-core.mjs Proxy-Logik (NCSOFT-Abfragen, Cache, Prüfungen)
functions/api/        Cloudflare Pages Function (nutzt armory-core)
proxy/worker.mjs      Alternative: eigenständiger Cloudflare Worker
tools/dev-server.mjs  Lokaler Server für Website und Proxy
tools/armory.py       Charakter-Abruf im Terminal
```

Fanprojekt, nicht mit NCSOFT verbunden. AION ist eine Marke von NCSOFT.
