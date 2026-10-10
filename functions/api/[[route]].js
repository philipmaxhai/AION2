// Cloudflare Pages Function: beantwortet /api/* auf derselben Adresse wie die Website.
import { handleApi } from "../../proxy/armory-core.mjs";

export async function onRequest(context) {
  return handleApi(context.request, {
    cache: caches.default,
    waitUntil: (p) => context.waitUntil(p),
  });
}
