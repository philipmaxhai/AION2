/*
 * Wo der Charakter-Check seine Daten holt.
 * Leer lassen, wenn die Seite auf Cloudflare Pages läuft (dort beantwortet functions/api/* die Anfragen)
 * oder lokal über `node tools/dev-server.mjs`.
 * Liegt die Seite auf GitHub Pages, hier die Adresse des Workers eintragen,
 * z. B. "https://daeva-kompass-api.<dein-name>.workers.dev".
 */
window.DK_CONFIG = {
  apiBase: ""
};
