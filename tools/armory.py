#!/usr/bin/env python3
"""AION 2 Global – Charakter-Abruf aus der öffentlichen NCSOFT-Armory.

Nutzt dieselben Endpunkte wie Shugo.gg. Sie sind nicht offiziell dokumentiert
und können sich ohne Ankündigung ändern.

Nutzung:
  python3 tools/armory.py NAME                  sucht auf allen Global-Servern
  python3 tools/armory.py NAME --server Siel    nur auf diesem Server
  python3 tools/armory.py NAME --pick 2         bei mehreren Treffern Nr. 2 nehmen
  python3 tools/armory.py NAME --merken         Server für diesen Namen merken
  python3 tools/armory.py NAME --json           Rohdaten als JSON ausgeben

Gemerkte Charaktere stehen in tools/charaktere.json, damit der Name allein reicht.
Rohdaten landen in ./armory-cache/<Name>-<Server>/.
"""

import argparse
import html
import json
import os
import re
import sys
import time
import urllib.error
import urllib.parse
import urllib.request
from concurrent.futures import ThreadPoolExecutor

SEARCH = "https://api-search.plaync.com/aion2global/search/v2/character"
API = "https://aion2.plaync.com"
GAMEINFO = "https://aion2.plaync.com/en-us"
LANG = "en-US"
UA = "Daeva-Kompass/1.0 (+https://github.com/philipmaxhai/AION2)"

REGIONS = {"eu": "Europa", "nae": "NA Ost", "naw": "NA West", "la": "Südamerika", "as": "Asien"}
REGION_BY_DIGIT = {"1": "nae", "2": "naw", "3": "eu", "4": "la", "5": "as"}

CLASS_BY_PCID = {}
for ids, cls in (
    ((2, 5, 6, 7, 8), "Gladiator"), ((3, 9, 10, 11, 12), "Templar"), ((4, 13, 14, 15, 16), "Ranger"),
    ((17, 18, 19, 20), "Assassin"), ((21, 22, 23, 24), "Spiritmaster"), ((25, 26, 27, 28), "Sorcerer"),
    ((29, 30, 31, 32), "Cleric"), ((33, 34, 35, 36), "Chanter"),
):
    for i in ids:
        CLASS_BY_PCID[i] = cls

SLOT_GROUPS = {
    "Waffen": [1, 2],
    "Rüstung": [3, 4, 5, 6, 7, 8, 19],
    "Schmuck": [9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 20, 22, 25, 26],
    "Runen": [23, 24],
    "Arkana": [41, 42, 43, 44, 45, 46, 47, 48, 49, 50],
}

HERE = os.path.dirname(os.path.abspath(__file__))
KNOWN_FILE = os.path.join(HERE, "charaktere.json")


class ArmoryError(Exception):
    pass


def get(url, attempts=4):
    """GET mit JSON-Antwort, Backoff bei 429/5xx."""
    req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept": "application/json"})
    for n in range(attempts):
        try:
            with urllib.request.urlopen(req, timeout=25) as r:
                return json.load(r)
        except urllib.error.HTTPError as e:
            if e.code in (429, 500, 502, 503, 504) and n < attempts - 1:
                time.sleep(0.4 * 2 ** n)
                continue
            raise ArmoryError(f"HTTP {e.code} bei {url.split('?')[0]}") from e
        except (urllib.error.URLError, TimeoutError) as e:
            if n < attempts - 1:
                time.sleep(0.4 * 2 ** n)
                continue
            raise ArmoryError(f"Keine Verbindung zu {urllib.parse.urlparse(url).netloc}: {e}") from e
    raise ArmoryError("Abruf fehlgeschlagen")


def q(params):
    return urllib.parse.urlencode(params, quote_via=urllib.parse.quote)


def region_of(server_id):
    s = str(server_id)
    return REGION_BY_DIGIT.get(s[1]) if re.fullmatch(r"[12]\d{3}", s) else None


def clean(name):
    return html.unescape(re.sub(r"<[^>]+>", "", str(name or ""))).strip()


def load_servers():
    out = {}
    for reg in REGIONS:
        try:
            data = get(f"{GAMEINFO}/api/gameinfo/servers?{q({'lang': LANG, 'region': reg})}")
        except ArmoryError:
            continue
        for s in data.get("serverList", []):
            out[int(s["serverId"])] = s["serverName"]
    return out


def search(name, regions, server_id=None):
    """Exakte Namenstreffer in den angegebenen Regionen."""
    hits = []
    for reg in regions:
        page = 1
        while page <= 6:
            params = {"keyword": name, "page": page, "size": 50, "localeInfo": LANG, "region": reg,
                      "serverId": server_id or ""}
            data = get(f"{SEARCH}?{q(params)}")
            items = data.get("list") or []
            exact = [c for c in items if clean(c.get("name")).casefold() == name.casefold()]
            hits.extend(exact)
            pag = data.get("pagination") or {}
            last_exact = items and clean(items[-1].get("name")).casefold() == name.casefold()
            if not last_exact or page >= int(pag.get("endPage") or 1):
                break
            page += 1
    seen, unique = set(), []
    for c in hits:
        key = (c.get("serverId"), c.get("characterId"))
        if key not in seen:
            seen.add(key)
            unique.append(c)
    return unique


def char_params(cid, sid, **extra):
    p = {"lang": LANG, "characterId": urllib.parse.unquote(cid), "serverId": sid}
    p.update(extra)
    reg = region_of(sid)
    if reg:
        p["region"] = reg
    return q(p)


def unwrap(d):
    if not isinstance(d, dict):
        return d
    for path in (("item",), ("data", "item"), ("result", "item"), ("data",), ("result",)):
        cur = d
        for k in path:
            cur = cur.get(k) if isinstance(cur, dict) else None
        if isinstance(cur, dict):
            return cur
    return d


def fetch_character(cid, sid):
    info = get(f"{API}/api/character/info?{char_params(cid, sid)}")
    equip = get(f"{API}/api/character/equipment?{char_params(cid, sid)}")

    boards = ((info.get("daevanion") or {}).get("boardList")) or []
    items = ((equip.get("equipment") or {}).get("equipmentList")) or []

    def board_detail(b):
        try:
            return get(f"{API}/api/character/daevanion/detail?{char_params(cid, sid, boardId=b.get('id'))}")
        except ArmoryError as e:
            return {"error": str(e), "boardId": b.get("id")}

    def item_id(it):
        return it.get("itemId") or it.get("id")

    def item_detail(it):
        lvl = int(it.get("enchantLevel") or 0) + int(it.get("exceedLevel") or 0)
        params = {"id": item_id(it), "enchantLevel": lvl, "characterId": urllib.parse.unquote(cid),
                  "serverId": sid, "slotPos": it.get("slotPos"), "lang": LANG}
        reg = region_of(sid)
        if reg:
            params["region"] = reg
        try:
            return unwrap(get(f"{API}/api/character/equipment/item?{q(params)}"))
        except ArmoryError as e:
            return {"error": str(e)}

    with ThreadPoolExecutor(max_workers=3) as pool:
        board_details = list(pool.map(board_detail, [b for b in boards if b.get("id") is not None]))
        with_id = [it for it in items if item_id(it)]
        details = list(pool.map(item_detail, with_id))
    detail_by_slot = {}
    for it, d in zip(with_id, details):
        detail_by_slot[str(it.get("slotPos"))] = d
    return {"info": info, "equipment": equip, "daevanion": board_details, "itemDetails": detail_by_slot}


# ---------- Ausgabe ----------

def first(d, *keys, default=None):
    for k in keys:
        if isinstance(d, dict) and d.get(k) not in (None, ""):
            return d[k]
    return default


def stat_line(s):
    name = first(s, "name", "statName", "type", default="?")
    val = first(s, "value", "statValue", "minValue", default="")
    low = s.get("minValue")
    if low not in (None, "") and str(low) != str(val) and s.get("extra") is not None:
        val = f"{low}–{val}"  # Waffenangriff als Spanne
    text = f"{name} {val}"
    extra = s.get("extra")
    if extra not in (None, "", "0", 0):
        text += f" (+{extra} Verst.)"
    if s.get("grade") and s.get("slotPos") is not None:
        text += f" [{s['grade']}]"  # Manastein-Qualität
    return text


def stats_text(lst):
    return ", ".join(stat_line(s) for s in (lst or []) if isinstance(s, dict))


def slot_group(pos):
    for g, ids in SLOT_GROUPS.items():
        if pos in ids:
            return g
    return "Sonstiges"


def summary(ch, servers):
    info, equip = ch["info"], ch["equipment"]
    prof = info.get("profile") or {}
    stats = ((info.get("stat") or {}).get("statList")) or []
    out = []
    sid = int(first(prof, "serverId", default=ch["serverId"]))
    reg = region_of(sid)
    cls = first(prof, "className", default=CLASS_BY_PCID.get(int(first(prof, "pcId", default=ch.get("pcId") or 0)), "?"))
    item_level = next((s.get("value") for s in stats if s.get("type") == "ItemLevel"), "?")
    out.append(f"# {first(prof, 'characterName', 'name', default=ch['name'])}")
    out.append(f"{cls} · Level {first(prof, 'characterLevel', 'level', default=ch.get('level'))} · "
               f"{servers.get(sid, sid)} ({REGIONS.get(reg, reg)}, {'Elyos' if sid < 2000 else 'Asmodier'})")
    out.append(f"Kampfkraft (CP): {first(prof, 'combatPower', default='?')} · Item-Level/Gearscore: {item_level}")
    legion = first(prof, "legionName", "guildName")
    if legion:
        out.append(f"Legion: {legion}")

    out.append("\n## Werte")
    for s in stats:
        if s.get("type") == "ItemLevel":
            continue
        line = f"- {stat_line(s)}"
        for k, v in s.items():
            if isinstance(v, list) and v:
                line += f"  [{k}: " + "; ".join(
                    stat_line(x) if isinstance(x, dict) else str(x) for x in v) + "]"
        out.append(line)

    out.append("\n## Ausrüstung")
    items = ((equip.get("equipment") or {}).get("equipmentList")) or []
    for g in list(SLOT_GROUPS) + ["Sonstiges"]:
        group = [it for it in items if slot_group(int(it.get("slotPos") or 0)) == g]
        if not group:
            continue
        out.append(f"### {g}")
        for it in sorted(group, key=lambda x: int(x.get("slotPos") or 0)):
            d = ch["itemDetails"].get(str(it.get("slotPos"))) or {}
            enc = int(it.get("enchantLevel") or 0)
            exc = int(it.get("exceedLevel") or 0)
            lvl = f" +{enc}" + (f" (+{exc} Überschreitung)" if exc else "") if enc or exc else ""
            ilvl = first(d, "itemLevel", "level")
            line = (f"- {first(it, 'slotPosName', default='Slot ' + str(it.get('slotPos')))}: "
                    f"{clean(first(it, 'name', 'itemName', default=first(d, 'name', default='?')))}"
                    f"{lvl} · {first(it, 'grade', default=first(d, 'grade', default='?'))}"
                    + (f" · IL {ilvl}" if ilvl else ""))
            out.append(line)
            if d.get("error"):
                out.append(f"  ! Details nicht abrufbar: {d['error']}")
                continue
            if d.get("mainStats"):
                out.append(f"  Haupt: {stats_text(d['mainStats'])}")
            if d.get("subStats"):
                cap = d.get("subStatCount") or 0
                out.append(f"  Zusatz" + (f" ({len(d['subStats'])}/{cap})" if cap else "") + f": {stats_text(d['subStats'])}")
            if d.get("subSkills"):
                out.append(f"  Skills: {stats_text(d['subSkills'])}")
            stones = d.get("magicStoneStat") or []
            slots = d.get("magicStoneSlotCount")
            if stones or slots:
                out.append(f"  Manasteine ({len(stones)}/{slots or len(stones)}): {stats_text(stones) or '–'}")
            god = d.get("godStoneStat") or []
            if god:
                out.append(f"  Götterstein: {stats_text(god)}")
            sb = first(d, "soulBindRate", "soulBindingRate")
            if sb not in (None, ""):
                out.append(f"  Seelenbindung: {sb}")

    pw = equip.get("petwing") or {}
    pet, wing = pw.get("pet") or {}, pw.get("wing") or {}
    if pet or wing:
        out.append(f"\nPet: {first(pet, 'name', default='–')} · Flügel: {first(wing, 'name', default='–')}")

    skills = ((equip.get("skill") or {}).get("skillList")) or []
    if skills:
        out.append("\n## Skills & Stigmen")
        for s in skills:
            extra = {k: v for k, v in s.items() if k not in ("name", "icon", "description", "desc") and not isinstance(v, (list, dict))}
            out.append(f"- {first(s, 'name', default='?')} " + " ".join(f"{k}={v}" for k, v in extra.items()))

    boards = ((info.get("daevanion") or {}).get("boardList")) or []
    if boards:
        out.append("\n## Daevanion")
        for b in boards:
            out.append(f"- {first(b, 'name', default=b.get('id'))}: {b.get('openNodeCount', '?')}/{b.get('totalNodeCount', '?')} Knoten offen")
        effects = {}
        for d in ch.get("daevanion") or []:
            for e in (d.get("openStatEffectList") or []) + (d.get("openSkillEffectList") or []):
                label = first(e, "desc", "name", "description", default=None) if isinstance(e, dict) else str(e)
                if label:
                    effects[clean(label)] = effects.get(clean(label), 0) + 1
        if effects:
            out.append("  Aktive Effekte: " + "; ".join(f"{k}" + (f" ×{v}" if v > 1 else "") for k, v in effects.items()))

    return "\n".join(out)


def load_known():
    try:
        with open(KNOWN_FILE, encoding="utf-8") as f:
            return json.load(f)
    except (OSError, ValueError):
        return {}


def save_known(known):
    with open(KNOWN_FILE, "w", encoding="utf-8") as f:
        json.dump(known, f, ensure_ascii=False, indent=2, sort_keys=True)
        f.write("\n")


def main():
    ap = argparse.ArgumentParser(description="AION 2 Global Charakter-Abruf")
    ap.add_argument("name")
    ap.add_argument("--server", help="Servername oder Server-ID")
    ap.add_argument("--region", choices=list(REGIONS), help="nur diese Region durchsuchen")
    ap.add_argument("--pick", type=int, help="bei mehreren Treffern diese Nummer nehmen")
    ap.add_argument("--merken", action="store_true", help="Server für diesen Namen merken")
    ap.add_argument("--json", action="store_true", help="Rohdaten als JSON ausgeben")
    ap.add_argument("--out", default="armory-cache", help="Ordner für Rohdaten")
    a = ap.parse_args()

    try:
        servers = load_servers()
        known = load_known()
        server = a.server or known.get(a.name.casefold())
        sids = []
        if server:
            wanted = str(server).strip()
            # Servernamen gibt es in mehreren Regionen (z. B. Baba in Europa und Asien)
            sids = [int(wanted)] if wanted.isdigit() else [k for k, v in servers.items() if v.casefold() == wanted.casefold()]
            if a.region:
                sids = [k for k in sids if region_of(k) == a.region]
            if not sids:
                print(f"Server „{server}“ unbekannt. EU-Server z. B.: "
                      + ", ".join(v for k, v in sorted(servers.items()) if region_of(k) == "eu"), file=sys.stderr)
                return 1
            hits = []
            for sid in sids:
                hits.extend(search(a.name, [region_of(sid)], sid))
        else:
            hits = search(a.name, [a.region] if a.region else list(REGIONS))
    except ArmoryError as e:
        print(f"Abruf fehlgeschlagen: {e}", file=sys.stderr)
        return 1

    if not hits:
        if sids:
            where = "auf " + ", ".join(f"{servers.get(k, k)} ({REGIONS.get(region_of(k), '?')})" for k in sids)
        else:
            where = f"in {REGIONS[a.region]}" if a.region else "auf den Global-Servern"
        print(f"Kein Charakter „{a.name}“ {where} gefunden.")
        return 3

    def row(i, c):
        s = int(c["serverId"])
        return (f"{i}. {clean(c['name'])} · {servers.get(s, s)} ({REGIONS.get(region_of(s), '?')}, "
                f"{'Elyos' if s < 2000 else 'Asmodier'}) · {CLASS_BY_PCID.get(int(c.get('pcId') or 0), '?')} · Lv {c.get('level')}")

    chosen = None
    if len(hits) == 1:
        chosen = hits[0]
    elif a.pick:
        if not 1 <= a.pick <= len(hits):
            print(f"--pick muss zwischen 1 und {len(hits)} liegen.", file=sys.stderr)
            return 1
        chosen = hits[a.pick - 1]
    else:
        top = max(int(c.get("level") or 0) for c in hits)
        best = [c for c in hits if int(c.get("level") or 0) == top]
        if len(best) == 1 and top >= 45:
            chosen = best[0]
            print(f"Mehrere Treffer, gewählt: einziger auf Level {top}. Andere:", file=sys.stderr)
            for i, c in enumerate(hits, 1):
                if c is not chosen:
                    print("  " + row(i, c), file=sys.stderr)
        else:
            print(f"{len(hits)} Charaktere heißen „{a.name}“. Mit --server <Server> oder --pick <Nr> eindeutig machen:")
            for i, c in enumerate(hits, 1):
                print(row(i, c))
            return 2

    sid = int(chosen["serverId"])
    try:
        ch = fetch_character(chosen["characterId"], sid)
    except ArmoryError as e:
        print(f"Charakterdaten nicht abrufbar: {e}", file=sys.stderr)
        return 1
    ch.update({"name": clean(chosen["name"]), "serverId": sid, "pcId": chosen.get("pcId"),
               "level": chosen.get("level"), "server": servers.get(sid, sid),
               "abgerufen": time.strftime("%Y-%m-%d %H:%M:%S %Z")})

    if a.merken:
        known[a.name.casefold()] = sid
        save_known(known)

    folder = os.path.join(a.out, re.sub(r"[^\w.-]+", "_", f"{ch['name']}-{ch['server']}"))
    os.makedirs(folder, exist_ok=True)
    with open(os.path.join(folder, "charakter.json"), "w", encoding="utf-8") as f:
        json.dump(ch, f, ensure_ascii=False, indent=1)

    if a.json:
        json.dump(ch, sys.stdout, ensure_ascii=False, indent=1)
        print()
    else:
        print(summary(ch, servers))
        print(f"\nRohdaten: {os.path.join(folder, 'charakter.json')}")
    return 0


if __name__ == "__main__":
    sys.exit(main())
