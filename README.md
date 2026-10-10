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
```

Fanprojekt, nicht mit NCSOFT verbunden. AION ist eine Marke von NCSOFT.
