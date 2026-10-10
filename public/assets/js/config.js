/*
 * Wo der Charakter-Check seine Daten holt.
 * Leer lassen: Auf dem Cloudflare Worker (wrangler.jsonc) und lokal über `node tools/dev-server.mjs`
 * beantwortet dieselbe Adresse /api/*. Nur wenn der Proxy woanders läuft, hier dessen Adresse eintragen.
 */
window.DK_CONFIG = {
  apiBase: "",
  /*
   * Adresse der veröffentlichten Seite, z. B. "https://daeva-kompass.pages.dev".
   * Öffnet jemand eine Kopie ohne Server-Teil (lokale Datei, GitHub Pages ohne Worker),
   * schickt der Charakter-Check die Suche dorthin, statt nach einem Proxy zu fragen.
   */
  liveUrl: "https://aion2.philipmax-hain.workers.dev"
};
