/*
 * Daeva-Kompass API – liest Charaktere aus der öffentlichen NCSOFT-Armory (AION 2 Global).
 *
 * Browser dürfen die NCSOFT-Endpunkte nicht direkt abfragen (fremde Origins bekommen 403),
 * deshalb läuft dieser Code serverseitig: als Cloudflare Pages Function, als Worker
 * oder lokal über tools/dev-server.mjs.
 *
 * Die Endpunkte sind nicht dokumentiert und können sich ändern. Der Proxy fragt nur
 * feste NCSOFT-Adressen mit geprüften Parametern ab und cacht Antworten.
 *
 * Routen:
 *   GET /api/servers                               alle Global-Server
 *   GET /api/charakter?name=WAVE                   Suche auf allen Global-Servern
 *   GET /api/charakter?name=WAVE&server=2318       Suche auf einem Server
 *   GET /api/charakter?cid=<characterId>&sid=2318  direkt laden (nach Auswahl)
 *   GET /api/daevanion?cid=..&sid=..&boards=51,52  Daevanion-Bretter im Detail
 *   GET /api/items?cid=..&sid=..&list=1:110630048:5,2:…   Item-Details (Slot:Item-ID:Verstärkung)
 * Grunddaten, Daevanion und Items sind getrennt, damit jede Anfrage im kostenlosen
 * Cloudflare-Tarif bleibt (10 ms CPU, 50 Unteranfragen).
 */

const SEARCH = "https://api-search.plaync.com/aion2global/search/v2/character";
const API = "https://aion2.plaync.com";
const GAMEINFO = "https://aion2.plaync.com/en-us";
const LANG = "en-US";
const UA = "Daeva-Kompass/1.0 (+https://github.com/philipmaxhai/AION2)";

export const REGIONS = ["eu", "nae", "naw", "la", "as"];
const REGION_BY_DIGIT = { 1: "nae", 2: "naw", 3: "eu", 4: "la", 5: "as" };

const TTL_CHARACTER = 600; // Sekunden
const TTL_SERVERS = 86400;

export function regionOf(serverId) {
  const s = String(serverId);
  return /^[12]\d{3}$/.test(s) ? REGION_BY_DIGIT[s[1]] || null : null;
}

export function factionOf(serverId) {
  return Number(serverId) < 2000 ? "elyos" : "asmo";
}

function clean(name) {
  return String(name || "")
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&").replace(/&lt;/g, "<").replace(/&gt;/g, ">").replace(/&quot;/g, '"').replace(/&#39;/g, "'")
    .trim();
}

function qs(params) {
  return Object.entries(params)
    .filter(([, v]) => v !== undefined && v !== null)
    .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
    .join("&");
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

class UpstreamError extends Error {
  constructor(message, status) {
    super(message);
    this.status = status;
  }
}

async function getJson(url, fetchImpl) {
  let last;
  for (let attempt = 0; attempt < 3; attempt++) {
    let res;
    try {
      res = await fetchImpl(url, { headers: { "User-Agent": UA, Accept: "application/json" } });
    } catch (err) {
      last = new UpstreamError(`NCSOFT nicht erreichbar (${err.message || err})`, 502);
      await sleep(400 * 2 ** attempt);
      continue;
    }
    if (res.ok) return res.json();
    last = new UpstreamError(`NCSOFT antwortet mit ${res.status}`, res.status === 404 ? 404 : 502);
    if (res.status === 429 || res.status >= 500) {
      await sleep(400 * 2 ** attempt);
      continue;
    }
    break;
  }
  throw last;
}

async function pool(items, size, fn) {
  const out = new Array(items.length);
  let next = 0;
  async function worker() {
    while (next < items.length) {
      const i = next++;
      out[i] = await fn(items[i], i);
    }
  }
  await Promise.all(Array.from({ length: Math.min(size, items.length) }, worker));
  return out;
}

/* ---------- NCSOFT-Abfragen ---------- */

export async function listServers(fetchImpl = fetch) {
  const lists = await Promise.all(
    REGIONS.map((region) =>
      getJson(`${GAMEINFO}/api/gameinfo/servers?${qs({ lang: LANG, region })}`, fetchImpl)
        .then((d) => d.serverList || [])
        .catch(() => [])
    )
  );
  return lists.flat().map((s) => ({
    id: Number(s.serverId),
    name: s.serverName,
    region: regionOf(s.serverId),
    faction: factionOf(s.serverId),
  }));
}

export async function searchCharacters(name, { serverId, region } = {}, fetchImpl = fetch) {
  const wanted = name.toLocaleLowerCase();
  const regions = serverId ? [regionOf(serverId)] : region ? [region] : REGIONS;
  const hits = [];
  await Promise.all(
    regions.map(async (reg) => {
      for (let page = 1; page <= 3; page++) {
        const data = await getJson(
          `${SEARCH}?${qs({ keyword: name, page, size: 50, localeInfo: LANG, region: reg, serverId: serverId || "" })}`,
          fetchImpl
        );
        const list = data.list || [];
        const exact = list.filter((c) => clean(c.name).toLocaleLowerCase() === wanted);
        hits.push(...exact);
        const lastExact = list.length && clean(list[list.length - 1].name).toLocaleLowerCase() === wanted;
        if (!lastExact || page >= Number((data.pagination || {}).endPage || 1)) break;
      }
    })
  );
  const seen = new Set();
  return hits
    .filter((c) => {
      const key = `${c.serverId}:${c.characterId}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    })
    .map((c) => ({
      characterId: decodeURIComponent(c.characterId),
      name: clean(c.name),
      serverId: Number(c.serverId),
      serverName: c.serverName,
      region: c.region || regionOf(c.serverId),
      faction: factionOf(c.serverId),
      level: c.level,
      pcId: c.pcId,
    }));
}

function charParams(cid, sid, extra = {}) {
  return qs({ lang: LANG, characterId: cid, serverId: sid, ...extra, region: regionOf(sid) || undefined });
}

function unwrap(d) {
  if (!d || typeof d !== "object") return d;
  return d.item || (d.data && d.data.item) || (d.result && d.result.item) || d.data || d.result || d;
}

const pickStat = (s) => ({ name: s.name, value: s.value, minValue: s.minValue, extra: s.extra, grade: s.grade });

function trimItem(d) {
  if (!d || typeof d !== "object") return null;
  return {
    name: d.name,
    grade: d.grade,
    level: d.level,
    categoryName: d.categoryName,
    maxEnchantLevel: d.maxEnchantLevel,
    mainStats: (d.mainStats || []).map(pickStat),
    subStats: (d.subStats || []).map(pickStat),
    subSkills: (d.subSkills || []).map(pickStat),
    stones: (d.magicStoneStat || []).map(pickStat),
    stoneSlots: d.magicStoneSlotCount || 0,
    godStones: (d.godStoneStat || []).map(pickStat),
    godStoneSlots: d.godStoneSlotCount || 0,
    soulBindRate: d.soulBindRate,
    tradable: d.tradable,
  };
}

/* Grunddaten: Profil, Werte, Titel, Ausrüstung (ohne Item-Details), Skills, Daevanion-Übersicht */
export async function loadCharacter(cid, sid, fetchImpl = fetch) {
  const [info, equip] = await Promise.all([
    getJson(`${API}/api/character/info?${charParams(cid, sid)}`, fetchImpl),
    getJson(`${API}/api/character/equipment?${charParams(cid, sid)}`, fetchImpl),
  ]);
  const boards = ((info.daevanion || {}).boardList || []).filter((b) => b.id !== undefined && b.id !== null);
  const items = ((equip.equipment || {}).equipmentList || []).filter((it) => it.itemId || it.id);
  const profile = info.profile || {};
  return {
    meta: {
      name: profile.characterName,
      characterId: cid,
      serverId: Number(sid),
      serverName: profile.serverName,
      region: regionOf(sid),
      faction: factionOf(sid),
      fetchedAt: new Date().toISOString(),
    },
    profile: {
      name: profile.characterName,
      className: profile.className,
      pcId: profile.pcId,
      level: profile.characterLevel,
      combatPower: profile.combatPower,
      race: profile.raceName,
      title: profile.titleName,
    },
    stats: ((info.stat || {}).statList || []).map((s) => ({
      type: s.type, name: s.name, value: s.value,
      secondary: (s.statSecondList || []).map((x) => (typeof x === "string" ? x : x.desc || x.name)).filter(Boolean),
    })),
    titles: ((info.title || {}).titleList || []).map((t) => ({
      category: t.equipCategory, name: t.name, grade: t.grade,
      effects: (t.equipStatList || []).map((e) => e.desc),
    })),
    boards: boards.map((b) => ({ id: b.id, name: b.name, open: b.openNodeCount, total: b.totalNodeCount, nodes: [], openStats: [], openSkills: [] })),
    equipment: items.map((it) => ({
      slot: Number(it.slotPos),
      slotName: it.slotPosName,
      itemId: Number(it.itemId || it.id),
      name: it.name,
      grade: it.grade,
      enchant: Number(it.enchantLevel || 0),
      exceed: Number(it.exceedLevel || 0),
      icon: it.icon,
      detail: null,
    })),
    skills: ((equip.skill || {}).skillList || []).map((s) => ({
      name: s.name, category: s.category, equipped: !!s.equip, acquired: !!s.acquired, level: s.skillLevel,
    })),
    pet: (((equip.petwing || {}).pet) || {}).name || null,
    wing: (((equip.petwing || {}).wing) || {}).name || null,
  };
}

/* Daevanion-Bretter im Detail (eigene Anfrage, damit jede Anfrage klein bleibt) */
export async function loadBoards(cid, sid, boardIds, fetchImpl = fetch) {
  const details = await pool(boardIds, 5, (id) =>
    getJson(`${API}/api/character/daevanion/detail?${charParams(cid, sid, { boardId: id })}`, fetchImpl).catch(() => null)
  );
  const out = {};
  boardIds.forEach((id, i) => {
    const d = details[i];
    if (!d) return;
    out[id] = {
      nodes: (d.nodeList || []).filter((n) => n.type && n.type !== "None").map((n) => ({
        type: n.type, grade: n.grade, open: !!n.open, name: n.name,
        effects: (n.effectList || []).map((e) => e.desc),
      })),
      openStats: (d.openStatEffectList || []).map((e) => e.desc),
      openSkills: (d.openSkillEffectList || []).map((e) => e.desc),
    };
  });
  return out;
}

/* Item-Details (Manasteine, Werte) für eine Liste von {slot, itemId, enchant} */
export async function loadItems(cid, sid, list, fetchImpl = fetch) {
  const details = await pool(list, 6, (it) => {
    const params = qs({
      id: it.itemId, enchantLevel: it.enchant, characterId: cid, serverId: sid,
      slotPos: it.slot, lang: LANG, region: regionOf(sid) || undefined,
    });
    return getJson(`${API}/api/character/equipment/item?${params}`, fetchImpl).then(unwrap).catch(() => null);
  });
  const out = {};
  list.forEach((it, i) => { out[it.slot] = trimItem(details[i]); });
  return out;
}

/* ---------- HTTP ---------- */

const CORS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

function json(body, status = 200, maxAge = 0) {
  return new Response(JSON.stringify(body), {
    status,
    headers: {
      ...CORS,
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": maxAge ? `public, max-age=${maxAge}` : "no-store",
    },
  });
}

const NAME_RE = /^[\p{L}\p{N}][\p{L}\p{N} _'-]{0,31}$/u;

/**
 * Bearbeitet /api/*-Anfragen. `cache` ist optional ({ match, put }), z. B. caches.default.
 */
export async function handleApi(request, { fetchImpl = fetch, cache = null, waitUntil = null } = {}) {
  if (request.method === "OPTIONS") return new Response(null, { status: 204, headers: CORS });
  if (request.method !== "GET") return json({ status: "fehler", message: "Nur GET erlaubt." }, 405);

  const url = new URL(request.url);
  const route = url.pathname.replace(/\/+$/, "").replace(/^.*\/api\//, "");

  if (cache) {
    const hit = await cache.match(request).catch(() => null);
    if (hit) return hit;
  }

  let res;
  try {
    if (route === "servers") {
      res = json({ status: "ok", servers: await listServers(fetchImpl) }, 200, TTL_SERVERS);
    } else if (route === "charakter") {
      res = await characterRoute(url, fetchImpl);
    } else if (route === "daevanion") {
      res = await boardsRoute(url, fetchImpl);
    } else if (route === "items") {
      res = await itemsRoute(url, fetchImpl);
    } else {
      res = json({ status: "fehler", message: "Unbekannte Route." }, 404);
    }
  } catch (err) {
    const status = err instanceof UpstreamError ? err.status : 500;
    res = json({ status: "fehler", message: err.message || "Unbekannter Fehler" }, status);
  }

  if (cache && res.status === 200 && /max-age=\d+/.test(res.headers.get("Cache-Control") || "")) {
    const put = cache.put(request, res.clone()).catch(() => {});
    if (waitUntil) waitUntil(put);
  }
  return res;
}

function idParams(p) {
  const cid = p.get("cid"), sid = p.get("sid");
  if (!cid || cid.length > 200 || !regionOf(sid)) return null;
  return { cid, sid: Number(sid) };
}

async function boardsRoute(url, fetchImpl) {
  const p = url.searchParams;
  const ids = idParams(p);
  const boards = (p.get("boards") || "").split(",").filter((x) => /^\d{1,6}$/.test(x)).slice(0, 10).map(Number);
  if (!ids || !boards.length) return json({ status: "fehler", message: "cid, sid und boards nötig." }, 400);
  return json({ status: "ok", boards: await loadBoards(ids.cid, ids.sid, boards, fetchImpl) }, 200, TTL_CHARACTER);
}

async function itemsRoute(url, fetchImpl) {
  const p = url.searchParams;
  const ids = idParams(p);
  const list = (p.get("list") || "").split(",").map((x) => x.split(":")).filter((x) => x.length === 3 && x.every((v) => /^\d{1,12}$/.test(v)))
    .slice(0, 20).map(([slot, itemId, enchant]) => ({ slot: Number(slot), itemId: Number(itemId), enchant: Number(enchant) }));
  if (!ids || !list.length) return json({ status: "fehler", message: "cid, sid und list nötig." }, 400);
  return json({ status: "ok", items: await loadItems(ids.cid, ids.sid, list, fetchImpl) }, 200, TTL_CHARACTER);
}

async function characterRoute(url, fetchImpl) {
  const p = url.searchParams;
  const cid = p.get("cid");
  const sid = p.get("sid") || p.get("server");

  if (sid && !regionOf(sid)) return json({ status: "fehler", message: "Ungültige Server-ID." }, 400);

  if (cid) {
    if (!sid || cid.length > 200) return json({ status: "fehler", message: "cid und sid nötig." }, 400);
    const character = await loadCharacter(cid, Number(sid), fetchImpl);
    return json({ status: "ok", character }, 200, TTL_CHARACTER);
  }

  const name = (p.get("name") || "").trim();
  if (!NAME_RE.test(name)) return json({ status: "fehler", message: "Bitte einen gültigen Charakternamen eingeben." }, 400);
  const region = p.get("region");
  if (region && !REGIONS.includes(region)) return json({ status: "fehler", message: "Ungültige Region." }, 400);

  const matches = await searchCharacters(name, { serverId: sid ? Number(sid) : undefined, region }, fetchImpl);
  if (!matches.length) return json({ status: "keiner", name }, 200, 120);
  if (matches.length > 1) return json({ status: "mehrere", name, matches }, 200, 300);

  const m = matches[0];
  const character = await loadCharacter(m.characterId, m.serverId, fetchImpl);
  return json({ status: "ok", character }, 200, TTL_CHARACTER);
}
