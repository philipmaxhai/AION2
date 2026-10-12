#!/usr/bin/env node
/*
 * Lokaler Server: liefert die Website aus und beantwortet /api/* über den Armory-Proxy.
 *   node tools/dev-server.mjs            → http://localhost:8787
 *   PORT=9000 node tools/dev-server.mjs
 * Hinter einem Firmen-Proxy: NODE_USE_ENV_PROXY=1 setzen.
 */
import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { extname, join, normalize, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { handleApi } from "../proxy/armory-core.mjs";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..", "public");
const PORT = Number(process.env.PORT || 8787);
const TYPES = {
  ".html": "text/html; charset=utf-8", ".js": "text/javascript; charset=utf-8", ".mjs": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8", ".json": "application/json; charset=utf-8", ".svg": "image/svg+xml",
  ".png": "image/png", ".ico": "image/x-icon", ".md": "text/plain; charset=utf-8",
};

/* Einfacher Speicher-Cache mit derselben Schnittstelle wie caches.default */
const store = new Map();
const cache = {
  async match(req) {
    const e = store.get(req.url);
    if (!e || e.expires < Date.now()) return undefined;
    return new Response(e.body, { status: e.status, headers: e.headers });
  },
  async put(req, res) {
    const age = Number((/max-age=(\d+)/.exec(res.headers.get("Cache-Control") || "") || [])[1] || 0);
    if (!age) return;
    // Als Bytes speichern: auch Bilder (/api/icon) laufen durch den Cache
    store.set(req.url, { body: new Uint8Array(await res.arrayBuffer()), status: res.status, headers: Object.fromEntries(res.headers), expires: Date.now() + age * 1000 });
  },
};

createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  try {
    if (url.pathname.startsWith("/api/")) {
      const out = await handleApi(new Request(url, { method: req.method }), { cache });
      res.writeHead(out.status, Object.fromEntries(out.headers));
      res.end(Buffer.from(await out.arrayBuffer()));
      return;
    }
    let path = normalize(decodeURIComponent(url.pathname)).replace(/^(\.\.[/\\])+/, "");
    if (path.endsWith("/")) path += "index.html";
    const file = join(ROOT, path);
    if (!file.startsWith(ROOT) || !(await stat(file).catch(() => null))?.isFile()) {
      res.writeHead(404, { "Content-Type": "text/plain; charset=utf-8" });
      res.end("Nicht gefunden");
      return;
    }
    res.writeHead(200, { "Content-Type": TYPES[extname(file)] || "application/octet-stream" });
    res.end(await readFile(file));
  } catch (err) {
    res.writeHead(500, { "Content-Type": "text/plain; charset=utf-8" });
    res.end(String(err && err.message || err));
  }
}).listen(PORT, () => console.log(`Daeva-Kompass läuft auf http://localhost:${PORT}`));
