// Eigenständiger Cloudflare Worker, falls die Website woanders liegt (z. B. GitHub Pages).
// Deploy: cd proxy && npx wrangler deploy  → URL in assets/js/config.js als apiBase eintragen.
import { handleApi } from "./armory-core.mjs";

export default {
  fetch(request, env, ctx) {
    return handleApi(request, { cache: caches.default, waitUntil: (p) => ctx.waitUntil(p) });
  },
};
