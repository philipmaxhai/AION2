#!/usr/bin/env python3
"""
Erzeugt public/assets/js/data-daevanion.js: Daevanion-Bretter aller Klassen (Raster, Knoten, Werte, Skill-Knoten).

Quelle: die Seiten des GameWith-Daevanion-Planers (Daten aus den offiziellen AION2-Charakterseiten, Global).
Liegt armory-cache/<Name>-<Server>/charakter.json eines Beschwörers vor, werden dessen Bretter Knoten für Knoten verglichen.

    python3 -I tools/daevanion_daten.py            # lädt die Seiten und schreibt die Datei
    python3 -I tools/daevanion_daten.py --nur-pruefen
"""
import glob
import json
import os
import re
import sys
import time
import urllib.request

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
OUT = os.path.join(ROOT, "public", "assets", "js", "data-daevanion.js")
URL = "https://gamewith.ai/aion2/en/daevanion-planner/{}"
UA = "Daeva-Kompass/1.0 (+https://github.com/philipmaxhai/AION2)"
CLS = {"gladiator": "gladiator", "templar": "templar", "assassin": "assassin", "ranger": "ranger",
       "sorcerer": "sorcerer", "elementalist": "spiritmaster", "cleric": "cleric", "chanter": "chanter"}
BOARDS = [("nezekan", 12), ("zikel", 20), ("vaizel", 30), ("triniel", 40), ("azphel", 45)]
KURZ = {
    "Attack": "ANG", "Critical Hit": "KRIT", "Critical Hit Resist": "KW", "Defense": "VER", "Max HP": "LP", "Max MP": "MP",
    "Combat Speed": "KT", "Cooldown Reduction": "AZ", "Damage Boost": "SV", "Damage Tolerance": "SR",
    "Critical Damage Boost": "KSV", "Critical Damage Tolerance": "KSR", "Multi-Hit Chance": "MT", "Multi-Hit Resist": "MW",
    "PvP Attack": "A", "PvP Defense": "V", "PvP Accuracy": "P", "PvP Evasion": "AW", "PvP Critical Hit": "K", "PvP Critical Hit Resist": "KW",
    "PvP Attack, PvP Defense": "A/V", "PvP Accuracy, PvP Evasion": "P/AW", "PvP Critical Hit, PvP Critical Hit Resist": "K/KW",
    "PvP Damage Boost": "SV", "PvP Damage Tolerance": "SR", "Status Effect Chance": "ST", "Status Effect Resist": "SW",
}
G = {"Common": "c", "Rare": "r", "Legend": "l", "Unique": "u", "None": "n"}


def load(slug):
    req = urllib.request.Request(URL.format(slug), headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=30) as r:
        html = r.read().decode("utf-8", "replace")
    chunks = re.findall(r'self\.__next_f\.push\(\[1,"(.*?)"\]\)</script>', html, re.S)
    text = "".join(json.loads('"' + c + '"') for c in chunks)
    m = re.search(r'\[\{"id":\d+,"name":\{"en":"Nezekan"', text)
    if not m:
        raise SystemExit(f"{slug}: keine Brett-Daten gefunden – hat sich die Seite geändert?")
    boards, _ = json.JSONDecoder().raw_decode(text, m.start())
    return boards


def check_armory(boards):
    for path in glob.glob(os.path.join(ROOT, "armory-cache", "*", "charakter.json")):
        raw = json.load(open(path, encoding="utf-8"))
        if raw.get("pcId") not in range(21, 25) or "daevanion" not in raw:
            continue
        bad = 0
        for bi, d in enumerate(raw["daevanion"][:5]):
            ref = {(n["row"], n["col"]): n for n in boards[bi]["nodes"]}
            for n in d["nodeList"]:
                if n["type"] == "None":
                    continue
                g = ref.get((n["row"], n["col"]))
                if not g or g["type"] != n["type"] or g["grade"] != n["grade"] or g["name"]["en"] != n["name"]:
                    bad += 1
        print(f"Abgleich mit {os.path.relpath(path, ROOT)}: {bad} Abweichungen")
        if bad:
            raise SystemExit("Planer-Daten weichen von der Armory ab – nicht übernehmen.")


def build(gw):
    ref = gw["elementalist"]
    clean = lambda s: s.replace("− +", "−").replace("– +", "−")
    stats, stat_idx, boards = [], {}, []
    for bi, (key, lvl) in enumerate(BOARDS):
        b = ref[bi]
        nodes = []
        for n in sorted(b["nodes"], key=lambda n: (n["row"], n["col"])):
            t = {"Start": "S", "Stat": "T", "SkillLevel": "K"}[n["type"]]
            idx = -1
            if t == "T":
                en = n["name"]["en"]
                if en not in stat_idx:
                    stat_idx[en] = len(stats)
                    stats.append({"en": en, "de": n["name"]["de"], "eff": [clean(x) for x in n["effects"]["de"]],
                                  "effEn": n["effects"]["en"], "kurz": KURZ[en]})
                idx = stat_idx[en]
            nodes.append([n["row"], n["col"], t, G[n["grade"]], idx])
        boards.append({"key": key, "name": b["name"]["de"], "level": lvl, "punkte": b["totalCost"], "pvp": key == "azphel", "nodes": nodes})
    klassen = {}
    for slug, cid in CLS.items():
        skills, sidx, maps = [], {}, []
        for bi in range(5):
            cur = {(n["row"], n["col"]): n for n in gw[slug][bi]["nodes"]}
            m = []
            for r, c, t, g, _ in boards[bi]["nodes"]:
                n = cur[(r, c)]
                if t != "K":
                    # Werte-Knoten müssen für alle Klassen gleich sein
                    assert n["type"] != "SkillLevel" and G[n["grade"]] == g, (slug, bi, r, c)
                    continue
                assert n["type"] == "SkillLevel" and G[n["grade"]] == g, (slug, bi, r, c)
                en = n["effects"]["en"][0].rsplit(" +", 1)[0]
                de = n["effects"]["de"][0].rsplit(" +", 1)[0]
                if en not in sidx:
                    sidx[en] = len(skills)
                    skills.append([en, de, "a" if n["grade"] == "Legend" else "p"])
                m.append(sidx[en])
            maps.append(m)
        klassen[cid] = {"skills": skills, "map": maps}
    return {"kosten": {"c": 1, "r": 2, "l": 3, "u": 4}, "boards": boards, "stats": stats, "klassen": klassen}


def ser(o, ind=0):
    pad = " " * (ind + 2)
    if isinstance(o, dict):
        return "{\n" + ",\n".join(pad + json.dumps(k, ensure_ascii=False) + ": " + ser(v, ind + 2) for k, v in o.items()) + "\n" + " " * ind + "}"
    if isinstance(o, list) and o and isinstance(o[0], dict):
        return "[\n" + ",\n".join(pad + ser(v, ind + 2) for v in o) + "\n" + " " * ind + "]"
    return json.dumps(o, ensure_ascii=False, separators=(",", ":"))


HEAD = """/*
 * Daevanion-Bretter aller Klassen: Raster (15×15), Knoten, Werte und Skill-Knoten je Klasse.
 * Quelle: Brett-Daten aus dem GameWith-Daevanion-Planer (aus den offiziellen AION2-Charakterseiten, Global),
 * für den Beschwörer Knoten für Knoten gegen die NCSOFT-Armory geprüft. Stand {stand}. Neu erzeugen mit tools/daevanion_daten.py.
 * Knoten: [Zeile, Spalte, Typ (S Start, T Wert, K Skill), Seltenheit (c 1 Punkt, r 2, l 3, u 4), Index in stats oder -1].
 * Die Werte-Knoten sind für alle Klassen gleich; klassen[id].map[Brett] nennt für jeden Skill-Knoten (in Knoten-Reihenfolge) den Index in skills.
 * skills: [englischer Name, deutscher Name, a aktiv / p passiv].
 */
window.DK_DATA.daevanion = """


def main():
    gw = {}
    for slug in CLS:
        gw[slug] = load(slug)
        print(slug, [(b["name"]["en"], len(b["nodes"])) for b in gw[slug]])
        time.sleep(1)
    check_armory(gw["elementalist"])
    if "--nur-pruefen" in sys.argv:
        return
    data = build(gw)
    with open(OUT, "w", encoding="utf-8") as f:
        f.write(HEAD.format(stand=time.strftime("%d.%m.%Y")) + ser(data) + ";\n")
    print("geschrieben:", os.path.relpath(OUT, ROOT))


if __name__ == "__main__":
    main()
