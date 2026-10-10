// Cloudflare Worker: /api/* geht an den Armory-Proxy, alles andere an die statischen Dateien.
// Wird über wrangler.jsonc im Hauptordner eingebunden (Worker mit Static Assets).
import { handleApi } from "./armory-core.mjs";

export default {
  async fetch(request, env, ctx) {
    const { pathname } = new URL(request.url);
    if (pathname.startsWith("/api/")) {
      return handleApi(request, { cache: caches.default, waitUntil: (p) => ctx.waitUntil(p) });
    }
    return env.ASSETS ? env.ASSETS.fetch(request) : new Response("Nicht gefunden", { status: 404 });
  },
};
