#!/usr/bin/env python3
"""
Erzeugt public/assets/js/data-pets.js: alle Begleiter (Reittiere) mit Typ, deutschem Namen, Bild und
den Monstern, die ihre Seelen droppen (Stufe, Gebiet, Karte, Spawns), dazu Quests, Kisten und Shops.

Quelle: MetaBot.GG (liest den Global-Client aus), Liste englisch für Typ und englischen Namen
(so heißt der Begleiter in der Armory), Einzelseiten deutsch für Namen, Monster und Gebiete.
Die Bilder liegen auf dem NCSOFT-CDN; der Name wird aus MetaBots Modellnamen abgeleitet und geprüft.

    python3 -I tools/pets_daten.py                 # lädt alle Seiten (etwa 210 Abrufe)
    python3 -I tools/pets_daten.py --cache DIR     # Seiten in DIR zwischenspeichern und wiederverwenden
"""
import datetime
import glob
import html
import json
import os
import re
import sys
import time
import urllib.error
import urllib.request

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), "..")
OUT = os.path.join(ROOT, "public", "assets", "js", "data-pets.js")
LIST = "https://metabot.gg/en/aion-2/mounts"
PAGE = "https://metabot.gg/de/aion-2/mounts/{}"
CDN = "https://assets.playnccdn.com/static-aion2-gamedata/resources/"
UA = "Daeva-Kompass/1.0 (+https://github.com/philipmaxhai/AION2)"
# Abschnitts-ID der Liste -> Typ-ID der Seite
GENUS = {"feral": "fera", "nature": "natura", "trans": "varia", "intellect": "cognia", "special": "specia"}
COUNTS = {"fera": 65, "natura": 48, "varia": 46, "cognia": 41, "specia": 7}
# Karten der Seelen-Gebiete -> Fraktion (Reshanta ist der Abyss, für beide Fraktionen)
MAPS = {"Verteron": "elyos", "Eltnen": "elyos", "Altgard": "asmo", "Morheim": "asmo"}


def get(url, cache=None):
    path = None
    if cache:
        path = os.path.join(cache, re.sub(r"[^a-z0-9]+", "_", url.lower())[-120:] + ".html")
        if os.path.exists(path):
            with open(path, encoding="utf-8") as f:
                return f.read()
    for attempt in range(4):
        try:
            req = urllib.request.Request(url, headers={"User-Agent": UA})
            with urllib.request.urlopen(req, timeout=40) as r:
                body = r.read().decode("utf-8", "replace")
            break
        except (urllib.error.URLError, TimeoutError) as e:
            if attempt == 3:
                raise SystemExit(f"Abruf fehlgeschlagen: {url} ({e})")
            time.sleep(2 ** (attempt + 1))
    if path:
        with open(path, "w", encoding="utf-8") as f:
            f.write(body)
    else:
        time.sleep(0.3)
    return body


def clean(s):
    return re.sub(r"\s+", " ", html.unescape(re.sub(r"<[^>]+>", " ", s))).strip()


def mount_list(page):
    """[(Typ, Slug, englischer Name)] aus der englischen Liste, je Typ-Abschnitt in Seitenreihenfolge."""
    out = []
    for m in re.finditer(r'<section id="(\w+)"[^>]*data-section="\1"', page):
        g = GENUS.get(m.group(1))
        if not g:
            continue
        end = page.find("</section>", m.end())
        seen = set()
        for slug, name in re.findall(r'href="/en/aion-2/mounts/([a-z0-9-]+)"[^>]*>(?:<[^>]+>)*([^<]+)<', page[m.end():end]):
            if slug not in seen:
                seen.add(slug)
                out.append((g, slug, html.unescape(name).strip()))
    for g, n in COUNTS.items():
        got = sum(1 for x in out if x[0] == g)
        if got != n:
            raise SystemExit(f"Liste: {g} hat {got} statt {n} Begleiter – hat sich die Seite geändert?")
    return out


def rows(page, kind):
    """Einträge eines Fundort-Reiters (drop, quest, box, other): Name, Chance bzw. Stufe, Unterzeilen, Text."""
    out = []
    for m in re.finditer(r'<li id="where-%s-[^"]*"[^>]*>' % kind, page):
        end = page.find("</li>", m.end())
        block = page[m.end():end]
        name = re.search(r'_nameText">([^<]+)<', block) or re.search(r'_head"><a[^>]*>([^<]+)</a>', block)
        pct = re.search(r'_pct">([^<]+)<', block)
        subs = [clean(s) for s in re.findall(r'_sub">(.*?)</div>', block)]
        out.append({"name": html.unescape(name.group(1)).strip() if name else clean(block)[:80],
                    "pct": pct.group(1).strip() if pct else "", "subs": subs, "text": clean(block)})
    return out


def detail(slug, cache):
    page = get(PAGE.format(slug), cache)
    h1 = re.search(r"<h1[^>]*>([^<]+)", page)
    cid = re.search(r'<link rel="preload" as="image" imageSrcSet="[^"]*creatures%2F(\d+)\.webp', page)
    poster = re.search(r'og:image" content="[^"]*/posters/mounts/(v_[a-z0-9_]+)\.webp"', page)
    if not h1 or not cid:
        raise SystemExit(f"{slug}: Name oder ID fehlt – hat sich die Seite geändert?")
    drops = []
    for r in rows(page, "drop"):
        lv = next((int(x) for s in r["subs"] for x in re.findall(r"^St\. (\d+)$", s)), 0)
        where = next((s for s in r["subs"] if " · " in s), "")
        if where:
            parts = [p.strip() for p in where.split(" · ")]
            zones = [z for z in re.split(r",\s*|\s+und\s+", parts[0]) if z]
            karte = parts[1] if len(parts) > 1 else ""
            spawns = int(re.sub(r"\D", "", parts[2]) or 0) if len(parts) > 2 else 0
        elif "nur in Dungeons" in r["text"]:
            zones, karte, spawns = [], "Dungeon", 0
        else:
            zones, karte, spawns = [], "", 0
        row = [r["name"], lv, zones, karte, spawns, r["pct"]]
        if row not in drops:
            drops.append(row)
    quests = []
    for r in rows(page, "quest"):
        lv = re.search(r"St\. (\d+)", r["pct"])
        giver = next((s.split(" · ", 1)[1] for s in r["subs"] if s.startswith("Questgeber:") and " · " in s), "")
        quests.append([r["name"], int(lv.group(1)) if lv else 0, giver])
    boxes = []
    for r in rows(page, "box"):
        src = re.search(r"Die Kiste stammt aus: (.+)$", r["text"])
        pct = re.search(r"([\d,]+%) pro Öffnung", r["text"])
        name = re.sub(r"\s*[\d,]+% pro Öffnung.*$", "", r["text"]).strip()
        boxes.append([name, pct.group(1) if pct else "", src.group(1).strip() if src else ""])
    other = [r["name"] for r in rows(page, "other")]
    return {"de": html.unescape(h1.group(1)).strip(), "id": int(cid.group(1)),
            "poster": poster.group(1) if poster else None, "drops": drops, "quests": quests,
            "boxes": boxes, "other": other}


def icon_names(poster, en):
    """Mögliche CDN-Namen zu MetaBots Modellnamen: v_cavebat_01_cv01 -> UT_Vehicle_Portrait_CaveBat_01_CV01.
    Zusammengesetzte Namen schreibt das CDN in CamelCase; die Wortgrenzen sind unbekannt, also werden
    zuerst Teilungen an Wörtern des englischen Namens, dann alle Zwei- und Dreiteilungen probiert."""
    m = re.match(r"v_([a-z]+)_(\d+)(?:_(c?v)(\d+))?$", poster or "")
    if not m:
        return []
    base, nr, kind, var = m.groups()
    suffix = f"_{nr}" + (f"_{kind.upper()}{var}" if kind else "")
    cap = lambda w: w[:1].upper() + w[1:]
    words = [w for w in re.findall(r"[a-z]+", en.lower()) if len(w) >= 2]
    out = [cap(base)]
    for w in words:
        if base.startswith(w) and len(base) > len(w):
            out.append(cap(w) + cap(base[len(w):]))
        if base.endswith(w) and len(base) > len(w):
            out.append(cap(base[:-len(w)]) + cap(w))
    n = len(base)
    out += [cap(base[:i]) + cap(base[i:]) for i in range(2, n - 1)]
    if n <= 14:
        out += [cap(base[:i]) + cap(base[i:j]) + cap(base[j:]) for i in range(2, n - 3) for j in range(i + 2, n - 1)]
    seen, names = set(), []
    for b in out:
        if b not in seen:
            seen.add(b)
            names.append(f"UT_Vehicle_Portrait_{b}{suffix}")
    return names


def cdn_has(name, probe):
    if name not in probe:
        try:
            req = urllib.request.Request(CDN + name + ".png", method="HEAD", headers={"User-Agent": UA})
            with urllib.request.urlopen(req, timeout=20) as r:
                probe[name] = r.status == 200 and r.headers.get("Content-Type", "").startswith("image/")
        except urllib.error.HTTPError:
            probe[name] = False
    return probe[name]


def icon_for(poster, en, probe):
    return next((n for n in icon_names(poster, en) if cdn_has(n, probe)), None)


def check_armory(pets):
    """Begleiter aus gespeicherten Armory-Abrufen müssen mit ID und englischem Namen in der Liste stehen."""
    by_id = {p["id"]: p for p in pets}
    for path in glob.glob(os.path.join(ROOT, "armory-cache", "*", "charakter.json")):
        with open(path, encoding="utf-8") as f:
            pet = ((json.load(f).get("equipment") or {}).get("petwing") or {}).get("pet") or {}
        if not pet.get("id"):
            continue
        p = by_id.get(pet["id"])
        if not p or p["en"] != pet.get("name"):
            raise SystemExit(f"Armory-Begleiter {pet.get('id')} {pet.get('name')} passt nicht zur Liste ({p and p['en']}).")
        icon = (pet.get("icon") or "").rsplit("/", 1)[-1].replace(".png", "")
        if icon and p["icon"] and icon != p["icon"]:
            print(f"Hinweis: Bild für {p['en']} ist {p['icon']}, die Armory nennt {icon}.", file=sys.stderr)
        print(f"Armory geprüft: {pet['name']} = {p['de']} ({p['g']})", file=sys.stderr)


HEAD = """/*
 * Begleiter (Reittiere) in AION 2 Global: Typ, deutscher Name, Bild und wo die Seelen droppen.
 * Erzeugt von tools/pets_daten.py am __DATUM__ – nicht von Hand pflegen, neu erzeugen.
 * Quelle: MetaBot.GG (Global-Client), Bilder: NCSOFT-CDN.
 *
 * pets: { id, en, de, g (Typ), icon (Dateiname ohne .png oder null), slug,
 *         drops: [[Monster, Stufe, [Gebiete], Karte, Spawns, Chance]], quests: [[Name, Stufe, Ort]],
 *         boxes: [[Kiste, Chance, Herkunft]], other: [Text] }
 * Karten: Verteron und Eltnen = Elyos, Altgard und Morheim = Asmodier, alles mit Reshanta = Abyss,
 * "Dungeon" = Monster ohne Spawn in der offenen Welt.
 */
window.DK_PETS = """


def main():
    cache = None
    if "--cache" in sys.argv:
        cache = sys.argv[sys.argv.index("--cache") + 1]
        os.makedirs(cache, exist_ok=True)
    listing = mount_list(get(LIST, cache))
    probe_path = os.path.join(cache, "cdn-bilder.json") if cache else None
    probe = {}
    if probe_path and os.path.exists(probe_path):
        with open(probe_path, encoding="utf-8") as f:
            probe = json.load(f)
    pets, maps = [], {}
    for i, (g, slug, en) in enumerate(listing, 1):
        d = detail(slug, cache)
        icon = icon_for(d["poster"], en, probe)
        for dr in d["drops"]:
            maps[dr[3]] = maps.get(dr[3], 0) + 1
        pets.append({"id": d["id"], "en": en, "de": d["de"], "g": g, "icon": icon, "slug": slug,
                     "drops": d["drops"], "quests": d["quests"], "boxes": d["boxes"], "other": d["other"]})
        if i % 25 == 0:
            print(f"{i}/{len(listing)} …", file=sys.stderr)
    if probe_path:
        with open(probe_path, "w", encoding="utf-8") as f:
            json.dump(probe, f)
    ids = [p["id"] for p in pets]
    if len(set(ids)) != len(ids):
        raise SystemExit("Doppelte Begleiter-IDs – Zuordnung prüfen.")
    unknown = [m for m in maps if m not in MAPS and "Reshanta" not in m and m != "Dungeon"]
    if unknown:
        raise SystemExit(f"Unbekannte Karten: {unknown} – MAPS ergänzen.")
    check_armory(pets)
    farm = sum(1 for p in pets if p["drops"])
    print(f"{len(pets)} Begleiter, {farm} mit Seelen-Monstern, {sum(1 for p in pets if p['icon'])} mit Bild; Karten: {maps}",
          file=sys.stderr)
    data = {"stand": datetime.date.today().strftime("%d.%m.%Y"), "cdn": CDN, "pets": pets}
    body = json.dumps(data, ensure_ascii=False, separators=(",", ":"))
    with open(OUT, "w", encoding="utf-8") as f:
        f.write(HEAD.replace("__DATUM__", data["stand"]) + body + ";\n")
    print(f"geschrieben: {os.path.relpath(OUT, ROOT)} ({len(body) // 1024} KB)", file=sys.stderr)


if __name__ == "__main__":
    main()
