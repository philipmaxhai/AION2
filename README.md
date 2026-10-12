# Daeva-Kompass · AION 2

Eine Fan-Website für AION 2 (Global/EU): Gearscore schnell über 1400 pushen, mit interaktiver Karte und allen Spielzeiten in deutscher Zeit. Der Fokus liegt auf dem Spiritmaster, alle acht Klassen sind dabei.

Die Seite geht davon aus, dass die Main-Story durch ist, du Level 45 bist und mindestens 1400 Gearscore hast.

## Funktionen

- **Übersicht**: Gearscore eingeben, Klasse und Fraktion wählen. Eine Leiste zeigt die Tore bei 1000, 1400, 1600, 1900, 2100, 2200 und 2500 GS und was sie freischalten. Dazu die nächsten Termine, deine nächsten fünf Schritte und der Tagesstand.
- **Gearscore-Fahrplan**: Schritte nach Aufwand und Ertrag sortiert (Gürtel/Amulett, Daevanion, Konfliktrunen, Vakron, Urugugu, Albtraum, Transzendenz, Fire Temple, Raids). Abhaken, Odyle-Rechner, Gear-Weg für deine Klasse, Liste der typischen Fehler.
- **Karte von Atreia**: Schematische Karte mit Elysea, Abyss (Reshanta) und Asmodae. Monolithe, Feldbosse, Artefakte, Raumzeit-Risse und Trainingspuppen. Zoom per Mausrad, Pinch oder Buttons. Feldboss-Timer starten („Gerade getötet“), eigene Pins setzen. Laufende Events leuchten auf der Karte.
- **Spielzeiten**: Tages-/Wochen-Reset, Raumzeit-Riss, Shugo-Fest, Dimensionsinvasion, Artefakt-Belagerung und Bosse, immer in deutscher Zeit (MEZ/MESZ, Umstellung automatisch). Tagesleiste, Wochentabelle, Versatz pro Termin zum Korrigieren und Erinnerung 5 Minuten vorher.
- **Checkliste**: Täglich und wöchentlich, setzt sich zum Reset selbst zurück.
- **Klassen**: Spiritmaster ausführlich (Geister, Stigmen, Skill-Ränge, Daevanion, Gear-Werte, Ablauf), dazu Gladiator, Templar, Assassin, Ranger, Sorcerer, Cleric und Chanter – mit den offiziellen Klassenwappen.
- **Skills & Makros**: Für jede Klasse und getrennt für PvE und PvP die komplette Tastenbelegung als Bild (Maus und Tastatur, gestapelte Linien mit Vorrang), als PNG speicherbar, dazu das genaue Makro, der Opener, die Skillpunkte (PvE: Durchschnittsstufen von rund 150 Top-Spielern je Klasse; PvP: Build und Ziel-Stufen), die Stigmen, Ablauf bzw. PvP-Kombos, PvP-Grundregeln und eine Anleitung zum Einrichten des Makros. Als Text kopierbar.
- **Daevanion**: Für jede Klasse alle fünf Bretter als Bild, mit der empfohlenen Route: welche Knoten zuerst, nummeriert, mit Punkten und Summe. Als PNG speichern oder als Link teilen. Grundlage sind die Bretter bekannter Spieler je Klasse; die Reihenfolge berechnet die Seite als günstigsten Weg vom Start.

Modernes, app-artiges Design in Dunkel und Hell (Seitenleiste auf dem Desktop, Reiter auf dem Handy, Schrift Archivo), mit der offiziellen Key-Art und Item-, Skill- und Klassenbildern vom NCSOFT-CDN.

Alles, was du einstellst, speichert nur dein Browser (localStorage).

## Charakter-Check für alle Spieler

Name eingeben, fertig: Die Seite lädt Ausrüstung, Manasteine, Stigmen und Daevanion aus der NCSOFT-Armory und erstellt einen Upgrade-Plan. Für alle 8 Klassen und alle Global-Server.

- **Sofort-Urteil** mit Bild: das Upgrade mit dem größten Gewinn pro Aufwand.
- **Fahrplan zum Abhaken**: Heute (Quick-Wins unter 10 Minuten, Tagesziel, Zeiten in deutscher Zeit), diese Woche, nächste 2–3 Wochen, ab 2100 Gearscore.
- **Charakterfenster**: alle 20 Slots mit Item-Bild, Seltenheitsrahmen und Status. Ein Klick zeigt den Plan für das Teil: Ziel-Item mit Werte-Vergleich und Material-Liste, was +10 bringt und kostet, Manasteine mit Bewertung, Zusatzwerte, was später kommt.
- **Dein Daevanion-Brett**: offene Knoten markiert, die nächsten empfohlenen Knoten nummeriert, von deinem Stand aus berechnet.
- **Skillpunkte-Check**: geschätzte Verteilung deiner 384 Punkte, Vergleich jeder Skill-Stufe mit den Top-Spielern deiner Klasse und ein konkreter Vorschlag zum Umverteilen.
- **Stigmen, Skills und Werte** mit den Symbolen aus dem Spiel, Farm- und Anti-Waste-Liste, Ressourcen-Rechner für Kinah, AP und Verstärkungssteine.

NCSOFT blockt Abrufe, die direkt von fremden Websites kommen. Deshalb läuft ein kleiner Proxy mit, kostenlos als **Cloudflare Worker** auf derselben Adresse wie die Website.

Live: **https://aion2.philipmax-hain.workers.dev**

### Online stellen (einmalig)

1. Kostenloses Konto bei [Cloudflare](https://dash.cloudflare.com/sign-up) anlegen.
2. **Workers & Pages › Erstellen › Repository importieren** und dieses Repository wählen.
3. Projektname `aion2` (muss zu `name` in `wrangler.jsonc` passen), Build-Befehl leer, Deploy-Befehl `npx wrangler deploy`.
4. **Bereitstellen.** `wrangler.jsonc` sorgt dafür, dass `/api/*` an den Proxy geht und nur der Ordner `public/` öffentlich ausgeliefert wird.

Jeder Push auf den verbundenen Branch aktualisiert die Seite automatisch. Der Proxy beantwortet nur feste NCSOFT-Abfragen mit geprüften Parametern und cacht Antworten 10 Minuten. Grunddaten, Daevanion und Items sind getrennte Anfragen, damit jede im kostenlosen Tarif bleibt (unter 10 ms CPU, unter 50 Unteranfragen).

Die Live-Adresse steht in `public/assets/js/config.js` als `liveUrl`: Wer eine Kopie ohne Server-Teil öffnet (z. B. die lokale Datei), wird beim Charakter-Check automatisch dorthin geschickt.

**Alternative Cloudflare Pages:** Mit Git verbinden, Build-Befehl leer, Ausgabeverzeichnis `public`. Den Proxy liefert dort `functions/api/`.

**Lokal testen:** `node tools/dev-server.mjs` startet Website und Proxy auf http://localhost:8787 (Node 18+).

## Charakter-Abruf im Terminal (Global)

```
python3 tools/armory.py <Name>                 # sucht auf allen Global-Servern
python3 tools/armory.py <Name> --server Siel    # bei Namensgleichheit Server angeben
python3 tools/armory.py <Name> --merken         # Server merken, danach reicht der Name
```

Zeigt Klasse, Level, Kampfkraft, Gearscore, Werte, Ausrüstung mit Verstärkung und Manasteinen, Skills und Daevanion. Nutzt die öffentliche NCSOFT-Armory (dieselben Endpunkte wie Shugo.gg). Diese Endpunkte sind nicht dokumentiert und können sich ändern.

## Öffnen

Kein Build nötig. `public/index.html` lässt sich direkt im Browser öffnen; der Charakter-Check leitet dann auf die Live-Seite weiter.

## Daten anpassen

Die Skill-Daten (`public/assets/js/data-skills.js`: deutsche Namen, Symbole, Stufen und Stigmen der Top-Spieler) erzeugt `python3 -I tools/skills_daten.py` neu. Leiste, Makro, Opener und Tipps je Klasse stehen kuratiert in `skillPlan` in `data.js`.

Die Daevanion-Bretter (`public/assets/js/data-daevanion.js`) erzeugt `python3 -I tools/daevanion_daten.py` neu (lädt die Planer-Seiten aller Klassen, prüft sie gegen gespeicherte Armory-Daten des Beschwörers, falls vorhanden). Die Prioritäten je Klasse stehen in `daevanionPlan` in `data.js`.

Alle Spieldaten stehen in [`public/assets/js/data.js`](public/assets/js/data.js):

- `events`: Spielzeiten. `tz` ist die Zeitzone, in der die Quelle die Zeit angibt (`UTC` oder `Europe/Berlin`); die Seite rechnet in deutsche Zeit um.
- `steps` und `gates`: Gearscore-Fahrplan und Schwellen.
- `regions` und `markers`: Karte (viewBox 800 × 1300).
- `classes`: Klassen-Daten.

Jeder Eintrag hat eine `confidence`: `ok` (mehrere Quellen einig), `community` (Konsens der Guides), `offen` (Quellen widersprechen sich).

## Datenlage

Stand 11.10.2026, sechs Tage nach dem Global-Launch am 05.10.2026. NCSOFT hat für Europa noch keinen offiziellen Zeitplan veröffentlicht. Die Werte stammen aus Community-Guides (Liste unter „Quellen“ auf der Seite) und widersprechen sich teilweise. Unsichere Werte sind markiert und Zeiten lassen sich auf der Seite per Versatz korrigieren.

## Aufbau

```
public/                         Website (nur dieser Ordner ist öffentlich)
public/index.html               Seite
public/assets/css/style.css     Design (dunkel und hell)
public/assets/js/data.js        Spieldaten und Regeln des Charakter-Checks
public/assets/js/data-items.js  Ziel-Items (Bilder, Werte, Rezepte, Verstärkungskosten), erzeugt
public/assets/js/zeit.js        Zeitzonen-Rechnung
public/assets/js/karte.js       Karte (SVG, Zoom, Pins)
public/assets/js/app.js         Oberfläche
public/assets/js/audit.js       Analyse-Regeln des Charakter-Checks
public/assets/js/charakter.js   Charakter-Check (Suche, Charakterfenster, Fahrplan)
public/assets/js/daevanion.js   Daevanion: Route, Brett als Bild, PNG-Export
public/assets/js/data-daevanion.js  Daevanion-Bretter aller Klassen, erzeugt
public/assets/js/skills.js      Skills & Makros je Klasse
public/assets/js/data-skills.js Skills aller Klassen mit Top-Spieler-Stufen, erzeugt
public/assets/js/config.js      Proxy- und Live-Adresse
wrangler.jsonc                  Cloudflare Worker: public/ ausliefern, /api/* an den Proxy
proxy/worker.mjs                Worker-Einstieg
proxy/armory-core.mjs           Proxy-Logik (NCSOFT-Abfragen, Cache, Prüfungen)
functions/api/                  Alternative für Cloudflare Pages
tools/dev-server.mjs            Lokaler Server für Website und Proxy
tools/armory.py                 Charakter-Abruf im Terminal
tools/daevanion_daten.py        erzeugt data-daevanion.js
tools/skills_daten.py           erzeugt data-skills.js
```

Fanprojekt, nicht mit NCSOFT verbunden. AION ist eine Marke von NCSOFT.
