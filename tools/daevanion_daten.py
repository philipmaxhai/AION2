#!/usr/bin/env python3
"""
Erzeugt public/assets/js/data-daevanion.js: Daevanion-Bretter aller Klassen (Raster, Knoten, Werte, Skill-Knoten).

Quelle: die Seiten des GameWith-Daevanion-Planers (Daten aus den offiziellen AION2-Charakterseiten, Global).
Liegt armory-cache/<Name>-<Server>/charakter.json eines Beschwörers vor, werden dessen Bretter Knoten für Knoten verglichen.
Das sechste Brett Ariel (seit 21.10.2026, nur PvE- und Boss-Werte, eigene Ariel-Punkte) fehlt bei GameWith; es kommt aus dem
Daevanion-Rechner von AION2 Vault (Client-Daten von questlog.gg). Bevor es übernommen wird, müssen dort alle fünf übrigen
Bretter Knoten für Knoten (Position, Kosten, Wert) mit GameWith übereinstimmen.

    python3 -I tools/daevanion_daten.py            # lädt die Seiten und schreibt die Datei
    python3 -I tools/daevanion_daten.py --nur-pruefen
"""
import glob
import html as htmlmod
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
VAULT = "https://aion2vault.com/tools/daevanion-calculator/"
COST_G = {1: "c", 2: "r", 3: "l", 4: "u"}
# Ariel-Knoten: englischer Name wie im Rechner -> (deutscher Name, Wirkung de, Wirkung en, Kürzel).
# Werte laut Client-Daten (AION2 Vault, Ariel-Guide); deutsche Begriffe wie bei den Azphel-Knoten.
ARIEL = {
    "PvE Attack": ("Angriffskraft (PvE)", ["Angriffskraft (PvE) +3"], ["PvE Attack +3"], "A"),
    "PvE Defense": ("Verteidigung (PvE)", ["Verteidigung (PvE) +30"], ["PvE Defense +30"], "V"),
    "PvE Accuracy": ("Präzision (PvE)", ["Präzision (PvE) +5"], ["PvE Accuracy +5"], "P"),
    "PvE Evasion": ("Ausweichen (PvE)", ["Ausweichen (PvE) +5"], ["PvE Evasion +5"], "AW"),
    "Boss Attack": ("Angriffskraft (Boss)", ["Angriffskraft (Boss) +3"], ["Boss Attack +3"], "BA"),
    "Boss Defense": ("Verteidigung (Boss)", ["Verteidigung (Boss) +30"], ["Boss Defense +30"], "BV"),
    "Max HP": ("Max. LP", ["LP +100"], ["Max HP +100"], "LP"),
    "Max MP": ("Max. MP", ["MP +50"], ["Max MP +50"], "MP"),
    "PvE Attack, PvE Defense": ("Angriffskraft (PvE), Verteidigung (PvE)", ["Angriffskraft (PvE) +3", "Verteidigung (PvE) +30"], ["PvE Attack +3", "PvE Defense +30"], "A/V"),
    "PvE Accuracy, PvE Evasion": ("Präzision (PvE), Ausweichen (PvE)", ["Präzision (PvE) +5", "Ausweichen (PvE) +5"], ["PvE Accuracy +5", "PvE Evasion +5"], "P/AW"),
    "Boss Attack, Boss Defense": ("Angriffskraft (Boss), Verteidigung (Boss)", ["Angriffskraft (Boss) +3", "Verteidigung (Boss) +30"], ["Boss Attack +3", "Boss Defense +30"], "BA/BV"),
    "Critical Hit": ("Krit.-Treffer", ["Kritischer Treffer +10"], ["Critical Hit +10"], "KRIT"),
    "Critical Hit Resist": ("Krit.-Widerstand", ["Krit.-Widerstand +10"], ["Critical Hit Resist +10"], "KW"),
    "Boss Damage Boost": ("Schadensverstärkung (Boss)", ["Schadensverstärkung (Boss) +1%"], ["Boss Damage Boost +1%"], "BSV"),
    "Boss Damage Tolerance": ("Schadensresistenz (Boss)", ["Schadensresistenz (Boss) +1%"], ["Boss Damage Tolerance +1%"], "BSR"),
    "PvE Damage Boost": ("Schadensverstärkung (PvE)", ["Schadensverstärkung (PvE) +1.5%"], ["PvE Damage Boost +1.5%"], "SV"),
    "PvE Damage Tolerance": ("Schadensresistenz (PvE)", ["Schadensresistenz (PvE) +1.5%"], ["PvE Damage Tolerance +1.5%"], "SR"),
}
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


def vault_boards():
    """{Brett-Name: [(Zeile, Spalte, Name, Kosten)]} aus dem SVG des AION2-Vault-Rechners (ohne Startknoten).
    Die Raster sind dort auf die belegten Zeilen gekürzt; auf 15×15 zentriert passen sie zu GameWith."""
    req = urllib.request.Request(VAULT, headers={"User-Agent": UA})
    with urllib.request.urlopen(req, timeout=40) as r:
        page = r.read().decode("utf-8", "replace")
    out = {}
    for m in re.finditer(r'<div id="dc-board-(\d+)"[^>]*data-dc-board="\d+"', page):
        end = page.find('data-dc-clear="%s"' % m.group(1), m.end())
        seg = page[m.end():end]
        name = re.search(r'<span class="font-semibold text-foreground"[^>]*>([^<]+)</span>', seg).group(1)
        size = int(re.search(r'<svg viewBox="0 0 (\d+) \d+"', seg).group(1))
        off = (15 - ((size - 26) // 22 + 1)) // 2
        nodes = []
        for g in re.finditer(r'<g class="dc-node[^"]*" data-i="\d+"[^>]*aria-label="([^"]*)"[^>]*>(.*?)</g>', seg, re.S):
            label = htmlmod.unescape(g.group(1))
            x, y = map(float, re.search(r'<circle cx="([\d.]+)" cy="([\d.]+)" r="10"', g.group(2)).groups())
            stat, cost = label.rsplit(" · ", 1)
            stat = re.sub(r" \+1 level$", "", stat)
            nodes.append((round((y - 13) / 22) + 1 + off, round((x - 13) / 22) + 1 + off, stat, int(cost.split()[0])))
        out[name] = nodes
    if "Ariel" not in out:
        raise SystemExit("AION2 Vault: Ariel-Brett nicht gefunden – hat sich die Seite geändert?")
    return out


def check_vault(vault, gw_ref):
    """Die fünf bekannten Bretter müssen bei AION2 Vault genau wie bei GameWith aussehen."""
    for b in gw_ref:
        name = b["name"]["en"]
        ref = {(n["row"], n["col"]): n for n in b["nodes"] if n["type"] != "Start"}
        got = {(r, c): (stat, cost) for r, c, stat, cost in vault.get(name, [])}
        bad = [rc for rc, n in ref.items() if rc not in got or {"Common": 1, "Rare": 2, "Legend": 3, "Unique": 4}[n["grade"]] != got[rc][1]
               or (n["type"] == "Stat" and n["name"]["en"] != got[rc][0])]
        if bad or len(got) != len(ref):
            raise SystemExit(f"AION2 Vault weicht bei {name} von GameWith ab ({len(bad)} Knoten) – Ariel nicht übernehmen.")
    print("AION2 Vault: alle fünf Bretter stimmen mit GameWith überein")


def ariel_board(vault, stats, stat_idx):
    nodes = [[8, 8, "S", "n", -1]]
    for r, c, stat, cost in sorted(vault["Ariel"]):
        if stat not in ARIEL:
            raise SystemExit(f"Ariel: unbekannter Knoten {stat} – ARIEL ergänzen.")
        de, eff, eff_en, kurz = ARIEL[stat]
        key = "ariel:" + stat
        if key not in stat_idx:
            stat_idx[key] = len(stats)
            stats.append({"en": stat, "de": de, "eff": eff, "effEn": eff_en, "kurz": kurz})
        nodes.append([r, c, "T", COST_G[cost], stat_idx[key]])
    nodes.sort(key=lambda n: (n[0], n[1]))
    total = sum({"c": 1, "r": 2, "l": 3, "u": 4}.get(n[3], 0) for n in nodes)
    return {"key": "ariel", "name": "Ariel", "level": 45, "punkte": total, "pvp": False, "art": "pve", "nodes": nodes}


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


def build(gw, vault):
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
        boards.append({"key": key, "name": b["name"]["de"], "level": lvl, "punkte": b["totalCost"], "pvp": key == "azphel",
                       "art": "pvp" if key == "azphel" else "skill", "nodes": nodes})
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
        klassen[cid] = {"skills": skills, "map": maps[:4] + [[]] + maps[4:]}
    # Ariel wie im Spiel vor Azphel einsortieren (Armory-IDs 51–54, 55 Ariel, 56 Azphel)
    boards = boards[:4] + [ariel_board(vault, stats, stat_idx)] + boards[4:]
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
 * für den Beschwörer Knoten für Knoten gegen die NCSOFT-Armory geprüft. Ariel (seit 21.10.2026, keine Skill-Knoten, eigene
 * Ariel-Punkte) aus dem AION2-Vault-Rechner (Client-Daten von questlog.gg), dort zuerst alle übrigen Bretter gegen GameWith
 * geprüft. Stand {stand}. Neu erzeugen mit tools/daevanion_daten.py.
 * Bretter: art "skill" (Daevanion-Punkte), "pve" (Ariel-Punkte), "pvp" (Azphel-Punkte).
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
    vault = vault_boards()
    check_vault(vault, gw["elementalist"])
    if "--nur-pruefen" in sys.argv:
        return
    data = build(gw, vault)
    with open(OUT, "w", encoding="utf-8") as f:
        f.write(HEAD.format(stand=time.strftime("%d.%m.%Y")) + ser(data) + ";\n")
    print("geschrieben:", os.path.relpath(OUT, ROOT))


if __name__ == "__main__":
    main()
