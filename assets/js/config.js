/*
 * Wo der Charakter-Check seine Daten holt.
 * Leer lassen, wenn die Seite auf Cloudflare Pages läuft (dort beantwortet functions/api/* die Anfragen)
 * oder lokal über `node tools/dev-server.mjs`.
 * Liegt die Seite auf GitHub Pages, hier die Adresse des Workers eintragen,
 * z. B. "https://daeva-kompass-api.<dein-name>.workers.dev".
 */
window.DK_CONFIG = {
  apiBase: "",
  /*
   * Adresse der veröffentlichten Seite, z. B. "https://daeva-kompass.pages.dev".
   * Öffnet jemand eine Kopie ohne Server-Teil (lokale Datei, GitHub Pages ohne Worker),
   * schickt der Charakter-Check die Suche dorthin, statt nach einem Proxy zu fragen.
   */
  liveUrl: ""
};
