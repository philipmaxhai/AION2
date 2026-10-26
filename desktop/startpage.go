package main

import (
	"encoding/json"
	"strings"
)

// startPage prüft zuerst, ob die Seite erreichbar ist, und zeigt sonst einen Hinweis statt der Fehlerseite des Browsers.
func startPage(target string) string {
	u, _ := json.Marshal(target)
	return strings.Replace(startHTML, "__URL__", string(u), 1)
}

const startHTML = `<!doctype html><html lang="de"><head><meta charset="utf-8"><title>Daeva-Kompass</title>
<style>
html,body{margin:0;height:100%;background:#0e1014;color:#eceef2;font:15px/1.5 "Segoe UI",system-ui,sans-serif}
main{min-height:100%;display:grid;place-content:center;gap:12px;padding:24px;text-align:center}
.mark{width:44px;height:44px;margin:0 auto}
h1{font-size:18px;margin:0;font-weight:600}
p{margin:0;color:#8f97a3;max-width:34em}
button{justify-self:center;margin-top:6px;padding:8px 16px;border-radius:8px;border:1px solid #303641;background:#1b1f26;color:#eceef2;font:inherit;cursor:pointer}
button:hover{border-color:#4fc3f7}
[hidden]{display:none}
</style></head><body><main>
<svg class="mark" viewBox="0 0 32 32" aria-hidden="true"><rect width="32" height="32" rx="8" fill="#4fc3f7"/><path d="M16 5.5l4.2 10.5h-8.4z" fill="#03141c"/><path d="M16 26.5l-4.2-10.5h8.4z" fill="#03141c" opacity=".45"/></svg>
<h1 id="t">Daeva-Kompass wird geladen …</h1>
<p id="m">Die App zeigt die aktuelle Seite, damit Daten und Zeiten immer stimmen.</p>
<button id="b" type="button" hidden>Erneut versuchen</button>
</main><script>
var url = __URL__, timer = null;
function check() {
  clearTimeout(timer);
  document.getElementById("t").textContent = "Daeva-Kompass wird geladen …";
  document.getElementById("b").hidden = true;
  var done = false;
  var stop = setTimeout(function () { if (!done) { done = true; offline(); } }, 8000);
  fetch(url, { mode: "no-cors", cache: "no-store" }).then(function () {
    if (done) return; done = true; clearTimeout(stop); location.replace(url);
  }, function () { if (done) return; done = true; clearTimeout(stop); offline(); });
}
function offline() {
  document.getElementById("t").textContent = "Keine Verbindung zur Seite";
  document.getElementById("m").textContent = "Prüfe deine Internetverbindung. Die App versucht es alle 15 Sekunden erneut.";
  document.getElementById("b").hidden = false;
  timer = setTimeout(check, 15000);
}
document.getElementById("b").onclick = check;
check();
</script></body></html>`
