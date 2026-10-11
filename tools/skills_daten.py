#!/usr/bin/env python3
"""
Erzeugt public/assets/js/data-skills.js: alle Skills je Klasse (aktiv, passiv, Stigma) mit deutschem Namen,
Lernstufe und Symbol, dazu die Skill-Stufen und Stigmen der Top-Spieler.

Quellen:
  - GameWith-Klassendatenbank, englisch und deutsch (Daten der offiziellen AION2-Seite): Namen, Lernstufe, Symbol.
    Englisch und Deutsch werden über das Symbol zugeordnet (je Klasse eindeutig) und gegen data-daevanion.js
    sowie, falls vorhanden, gegen armory-cache/*/charakter.json geprüft.
  - MetaBot.GG Build-Seiten: Skill-Stufen der Top-Spieler (Endgame), Leveling- und PvP-Build, Stigmen mit Anteil.

    python3 -I tools/skills_daten.py            # lädt die Seiten und schreibt die Datei
    python3 -I tools/skills_daten.py --nur-pruefen
"""
import datetime
import glob
import html
import json
import os
import re
import sys
import time
import urllib.request

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
OUT = os.path.join(ROOT, "public", "assets", "js", "data-skills.js")
DAEV = os.path.join(ROOT, "public", "assets", "js", "data-daevanion.js")
GW = "https://gamewith.ai/aion2/{}/classes/{}"
MB = "https://metabot.gg/en/aion-2/classes/{}/build"
UA = "Daeva-Kompass/1.0 (+https://github.com/philipmaxhai/AION2)"
# GameWith-Slug -> Klassen-ID der Seite (MetaBot nutzt dieselben Namen, nur den Beschwörer als spiritmaster)
CLS = {"gladiator": "gladiator", "templar": "templar", "assassin": "assassin", "ranger": "ranger",
       "sorcerer": "sorcerer", "elementalist": "spiritmaster", "cleric": "cleric", "chanter": "chanter"}
TYP = {"active": "a", "passive": "p", "dp": "s"}
ROW = re.compile(r'<tr><td><span class="classes-skill"><img[^>]*?src="[^"]*/icons/([A-Za-z0-9_]+)\.webp"/>([^<]+)</span></td>'
                 r'<td>[^<\d]*(\d+)</td></tr>')


def get(url):
    req = urllib.request.Request(url, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=30) as r:
        return r.read().decode("utf-8", "replace")


def text(raw):
    raw = re.sub(r"(?is)<(script|style|noscript|svg)[^>]*>.*?</\1>", " ", raw)
    raw = re.sub(r"(?i)<br\s*/?>|</(p|div|li|tr|h[1-6]|table|section)>", "\n", raw)
    raw = re.sub(r"(?i)</t[dh]>", " | ", raw)
    t = html.unescape(re.sub(r"<[^>]+>", " ", raw))
    t = re.sub(r"[ \t]+", " ", t)
    return [l.strip() for l in t.splitlines() if l.strip()]


def gw_rows(page):
    """[(Abschnitt, Symbol, Name, Lernstufe)] aus einer GameWith-Klassenseite."""
    out = []
    for sec, typ in TYP.items():
        m = re.search(r'<section[^>]*id="%s"' % sec, page)
        if not m:
            raise SystemExit(f"GameWith: Abschnitt {sec} fehlt – hat sich die Seite geändert?")
        end = page.find("</section>", m.end())
        for icon, name, lv in ROW.findall(page[m.end():end]):
            out.append((typ, icon, html.unescape(name).strip(), int(lv)))
    return out


def gamewith(slug):
    en, de = gw_rows(get(GW.format("en", slug))), gw_rows(get(GW.format("de", slug)))
    de_by_icon = {r[1]: r for r in de}
    assert len(en) == len(de) == 35 and len(de_by_icon) == 35, (slug, len(en), len(de))
    skills = []
    for typ, icon, name, lv in en:
        d = de_by_icon[icon]
        assert d[0] == typ and d[3] == lv, (slug, name, d)
        skills.append([name, d[2], typ, lv, icon])
    return skills


def num(s):
    return float(s) if "." in s else int(s)


def metabot(slug):
    lines = text(get(MB.format(slug)))
    res = {"spieler": None, "tage": None, "builds": {}, "skills": {}, "stigmen": {}}
    for l in lines:
        m = re.match(r"Based on ([\d,]+) top .* players · updated (\d+) days? ago", l)
        if m and res["spieler"] is None:
            res["spieler"], res["tage"] = int(m.group(1).replace(",", "")), int(m.group(2))
    # Empfohlene Builds: Endgame PvE (Top-Spieler), Leveling 1–45, PvP
    keys = {"Endgame PvE": "endgame", "Leveling 1–45": "leveling", "PvP": "pvp"}
    cur = part = None
    for l in lines:
        if l in keys:
            cur, part = keys[l], None
            res["builds"][cur] = {"skills": [], "stigmen": []}
            continue
        if cur is None:
            continue
        if l.startswith("MetaBot Desktop"):
            break
        if l == "Skills to train":
            part = "skills"
            continue
        if l == "Stigma slots":
            part = "stigmen"
            continue
        if l in ("Rotation", "Why this build") or l.startswith("Load in planner"):
            part = None
            continue
        name = re.sub(r"^[^A-Za-z]+", "", l)
        if part == "skills":
            m = re.match(r"^(.+?) Lv\. (\d+)(?: \+ (\d+))?(?: (\d+)%)?$", name)
            if m:
                res["builds"][cur]["skills"].append([m.group(1), int(m.group(2)), int(m.group(3) or 0)])
        elif part == "stigmen":
            m = re.match(r"^Slot \d · Lv\. \d+ (.+?) Lv\. (\d+)(?: ([\d.]+)%)?$", l)
            if m:
                res["builds"][cur]["stigmen"].append([m.group(1), int(m.group(2))])
    # Meistgenutzte Skills und Stigmen der Top-Spieler: Anteil in %, Durchschnittsstufe (inkl. Daevanion und Ausrüstung)
    sec = None
    for l in lines:
        if l == "Active skills on the bar" or l == "Passive skills":
            sec = "skills"
            continue
        if re.match(r"^Share of .* with each stigma", l):
            sec = "stigmen"
            continue
        if l.startswith("Load the most common build") or l.startswith("Daevanion picks"):
            sec = None
            continue
        if sec:
            m = re.match(r"^[^A-Za-z]*(.+?) ([\d.]+)% avg\. Lv\. ([\d.]+)$", l)
            if m and m.group(1) not in res[sec]:
                res[sec][m.group(1)] = [num(m.group(2)), num(m.group(3))]
    assert res["spieler"] and len(res["builds"]) == 3 and len(res["skills"]) >= 18 and len(res["stigmen"]) >= 4, (slug, res)
    return res


def check(slug, skills):
    daev = json.loads(open(DAEV, encoding="utf-8").read().split("window.DK_DATA.daevanion = ", 1)[1].rstrip().rstrip(";"))
    ref = {en: de for en, de, _ in daev["klassen"][CLS[slug]]["skills"]}
    n = 0
    for en, de, typ, _, _ in skills:
        if typ == "s":
            continue
        assert ref.get(en) == de, (slug, en, de, ref.get(en))
        n += 1
    assert n == 22, (slug, n)
    if slug != "elementalist":
        return
    by = {s[0]: s for s in skills}
    for path in glob.glob(os.path.join(ROOT, "armory-cache", "*", "charakter.json")):
        raw = json.load(open(path, encoding="utf-8"))
        if raw.get("pcId") not in range(21, 25):
            continue
        for s in raw["equipment"]["skill"]["skillList"]:
            icon = re.search(r"/(ICON_[A-Za-z0-9_]+)\.png", s.get("icon", ""))
            assert s["name"] in by and icon and by[s["name"]][4] == icon.group(1), (path, s["name"])
        print("  Armory-Abgleich ok:", os.path.relpath(path, ROOT))


def ser(o, ind=0):
    pad = " " * (ind + 2)
    if isinstance(o, dict):
        return "{\n" + ",\n".join(pad + json.dumps(k, ensure_ascii=False) + ": " + ser(v, ind + 2) for k, v in o.items()) + "\n" + " " * ind + "}"
    if isinstance(o, list) and o and isinstance(o[0], list):
        return "[\n" + ",\n".join(pad + ser(v, ind + 2) for v in o) + "\n" + " " * ind + "]"
    return json.dumps(o, ensure_ascii=False, separators=(",", ":"))


HEAD = """/*
 * Skills aller Klassen und was die Top-Spieler damit machen. Stand {stand}. Neu erzeugen mit tools/skills_daten.py.
 * skills: [englischer Name, deutscher Name (Client), a aktiv / p passiv / s Stigma, Lernstufe, Symbol].
 *   Symbol-Datei: https://assets.playnccdn.com/static-aion2-gamedata/resources/<Symbol>.png
 *   Quelle: GameWith-Klassendatenbank (Daten der offiziellen AION2-Seite), gegen data-daevanion.js und die Armory geprüft.
 * top: MetaBot.GG, Top-Spieler je Klasse (Stufe 45, höchste Kampfkraft je Region).
 *   spieler: ausgewertete Charaktere, stand: Datum der Auswertung.
 *   skills / stigmen: { Name: [Anteil in %, Durchschnittsstufe inkl. Daevanion und Ausrüstung] }.
 *   builds.endgame: was die Top-Spieler trainieren [Name, Stufe mit Skillpunkten, Bonus aus Daevanion/Ausrüstung];
 *   builds.leveling / builds.pvp: Empfehlung der Redaktion [Name, Stufe]. stigmen: [Name, Stufe] in Slot-Reihenfolge.
 */
window.DK_DATA.skills = """


def main():
    data = {"quellen": {
        "skills": "https://gamewith.ai/aion2/de/classes",
        "top": "https://metabot.gg/en/aion-2/guides/class-builds-guide",
    }, "klassen": {}}
    heute = datetime.date.today()
    for slug, cid in CLS.items():
        skills = gamewith(slug)
        check(slug, skills)
        time.sleep(1)
        mb = metabot("spiritmaster" if slug == "elementalist" else slug)
        names = {s[0] for s in skills}
        for b in mb["builds"].values():
            for row in b["skills"] + b["stigmen"]:
                assert row[0] in names, (slug, row)
        for k in list(mb["skills"]) + list(mb["stigmen"]):
            assert k in names, (slug, k)
        stand = (heute - datetime.timedelta(days=mb["tage"])).isoformat()
        data["klassen"][cid] = {
            "skills": skills,
            "top": {"spieler": mb["spieler"], "stand": stand, "skills": mb["skills"], "stigmen": mb["stigmen"],
                    "builds": mb["builds"]},
        }
        print(cid, len(skills), "Skills,", mb["spieler"], "Top-Spieler, Stand", stand)
        time.sleep(1)
    if "--nur-pruefen" in sys.argv:
        return
    with open(OUT, "w", encoding="utf-8") as f:
        f.write(HEAD.replace("{stand}", heute.strftime("%d.%m.%Y")) + ser(data) + ";\n")
    print("geschrieben:", os.path.relpath(OUT, ROOT))


if __name__ == "__main__":
    main()
