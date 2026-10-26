package main

import (
	"os"
	"path/filepath"
	"testing"
)

func TestParseHotkey(t *testing.T) {
	ok := map[string][2]uint32{
		"Strg+Umschalt+K":     {modControl | modShift, 'K'},
		"ctrl+alt+f9":         {modControl | modAlt, 0x78},
		"Shift+Pos1":          {modShift, 0x24},
		"Strg + Umschalt + 0": {modControl | modShift, '0'},
		"Win+F24":             {modWin, 0x87},
	}
	for in, want := range ok {
		m, vk, err := parseHotkey(in)
		if err != nil || m != want[0] || vk != want[1] {
			t.Errorf("%q: %x %x %v, erwartet %x %x", in, m, vk, err, want[0], want[1])
		}
	}
	for _, in := range []string{"", "K", "Strg+", "Strg+F25", "Hyper+K", "Strg+Umschalt+Ö", "Strg+KK"} {
		if _, _, err := parseHotkey(in); err == nil {
			t.Errorf("%q sollte ungültig sein", in)
		}
	}
}

func TestConfigRoundTripAndRepair(t *testing.T) {
	dir := t.TempDir()
	p := filepath.Join(dir, "einstellungen.json")
	c := loadConfig(p) // fehlt: Standard
	if c.Deckkraft != 1 || c.TasteZeigen != "Strg+Umschalt+K" || c.startURL() != liveURL {
		t.Fatalf("Standard falsch: %+v", c)
	}
	c.X, c.Y, c.W, c.H, c.Oben, c.Deckkraft = 10, 20, 900, 700, true, 0.8
	if err := c.save(p); err != nil {
		t.Fatal(err)
	}
	if got := loadConfig(p); got != c {
		t.Fatalf("gelesen %+v, geschrieben %+v", got, c)
	}
	// kaputte Werte werden ersetzt
	os.WriteFile(p, []byte(`{"deckkraft":0.05,"tasteZeigen":"K","w":100,"h":100,"url":"file:///c:/x"}`), 0o644)
	got := loadConfig(p)
	if got.Deckkraft != minDeckkraft || got.TasteZeigen != "Strg+Umschalt+K" || got.W != 0 || got.URL != "" {
		t.Fatalf("nicht repariert: %+v", got)
	}
	os.WriteFile(p, []byte(`kein json`), 0o644)
	if got := loadConfig(p); got != defaultConfig() {
		t.Fatalf("kaputte Datei: %+v", got)
	}
	if _, err := os.Stat(p + ".tmp"); err == nil {
		t.Fatal("Hilfsdatei liegt noch herum")
	}
}

func TestDataDir(t *testing.T) {
	base := t.TempDir()
	exe := filepath.Join(base, "app", "DaevaKompass.exe")
	os.MkdirAll(filepath.Dir(exe), 0o755)
	if d := dataDir(exe, filepath.Join(base, "local")); d != filepath.Join(base, "app", "DaevaKompass-Daten") {
		t.Fatalf("portabel erwartet, bekommen %s", d)
	}
	ro := filepath.Join(base, "ro")
	os.MkdirAll(ro, 0o555)
	if os.Getuid() == 0 {
		t.Skip("als root ist jeder Ordner beschreibbar")
	}
	if d := dataDir(filepath.Join(ro, "x.exe"), filepath.Join(base, "local")); d != filepath.Join(base, "local", "DaevaKompass") {
		t.Fatalf("Ersatzordner erwartet, bekommen %s", d)
	}
}

type fakeWin struct {
	top     bool
	opacity float64
	click   bool
	compact bool
	opened  []string
}

func (f *fakeWin) setTopmost(on bool)               { f.top = on }
func (f *fakeWin) setOpacity(v float64, click bool) { f.opacity, f.click = v, click }
func (f *fakeWin) setCompact(on bool)               { f.compact = on }
func (f *fakeWin) openExternal(u string) error      { f.opened = append(f.opened, u); return nil }

func TestBridge(t *testing.T) {
	f := &fakeWin{}
	p := filepath.Join(t.TempDir(), "e.json")
	a := &app{cfg: defaultConfig(), path: p, win: f}

	if _, err := a.call("deckkraft", 0.6); err != nil || f.opacity != 0.6 || f.click {
		t.Fatalf("deckkraft: %v %+v", err, f)
	}
	if _, err := a.call("deckkraft", 0.1); err != nil || f.opacity != minDeckkraft {
		t.Fatalf("deckkraft unter Minimum: %+v", f)
	}
	if _, err := a.call("durchklicken", true); err != nil || !f.click || !f.top {
		t.Fatalf("durchklicken muss oben halten: %+v", f)
	}
	info, _ := a.call("info", nil)
	if m := info.(map[string]interface{}); m["durchklicken"] != true || m["oben"] != true {
		t.Fatalf("info: %v", m)
	}
	if on := a.toggleClickThrough(); on || f.click || f.top {
		t.Fatalf("Taste schaltet Durchklicken aus: %+v", f)
	}
	a.call("oben", true)
	a.call("kompakt", true)
	if !f.top || !f.compact {
		t.Fatalf("oben/kompakt: %+v", f)
	}
	if saved := loadConfig(p); !saved.Oben || !saved.Kompakt || saved.Deckkraft != minDeckkraft {
		t.Fatalf("nicht gespeichert: %+v", saved)
	}
	a.reset()
	if f.top || f.click || f.opacity != 1 {
		t.Fatalf("reset: %+v", f)
	}
	for _, bad := range []interface{}{"http://example.com", "javascript:alert(1)", "file:///C:/Windows", "https://user:pw@x.de", 5} {
		if _, err := a.call("oeffnen", bad); err == nil {
			t.Errorf("oeffnen %v sollte abgelehnt werden", bad)
		}
	}
	if _, err := a.call("oeffnen", "https://metabot.gg/en/aion-2"); err != nil || len(f.opened) != 1 {
		t.Fatalf("oeffnen https: %v %v", err, f.opened)
	}
	if _, err := a.call("oben", "ja"); err == nil {
		t.Error("falscher Typ sollte Fehler geben")
	}
	if _, err := a.call("format", nil); err == nil {
		t.Error("unbekannter Befehl sollte Fehler geben")
	}
	// Durchklicken übersteht keinen Neustart
	if saved := loadConfig(p); saved != a.cfg {
		t.Fatalf("Datei und Zustand weichen ab: %+v / %+v", saved, a.cfg)
	}
}

func TestRememberRect(t *testing.T) {
	f := &fakeWin{}
	p := filepath.Join(t.TempDir(), "e.json")
	a := &app{cfg: defaultConfig(), path: p, win: f}
	a.rememberRect(5, 6, 1000, 800)
	a.rememberRect(5, 6, 100, 100) // zu klein (z. B. während Minimieren): ignorieren
	c := loadConfig(p)
	if c.X != 5 || c.W != 1000 || c.NormalW != 1000 || c.NormalH != 800 {
		t.Fatalf("%+v", c)
	}
	a.call("kompakt", true)
	a.rememberRect(5, 6, 460, 820)
	if c := loadConfig(p); c.NormalW != 1000 || c.W != 460 {
		t.Fatalf("kompakt darf die normale Größe nicht überschreiben: %+v", c)
	}
}

func TestStartURL(t *testing.T) {
	for in, want := range map[string]bool{
		"https://aion2.philipmax-hain.workers.dev/": true, "http://localhost:8787/": true, "http://127.0.0.1:8787": true,
		"http://example.com": false, "file:///x": false, "": false, "javascript:alert(1)": false,
	} {
		if got := allowedStartURL(in); got != want {
			t.Errorf("%q: %v", in, got)
		}
	}
	page := startPage(`https://x.de/"</script><script>alert(1)</script>`)
	if want := `var url = "https://x.de/\"\u003c/script\u003e\u003cscript\u003ealert(1)\u003c/script\u003e"`; !contains(page, want) {
		t.Fatalf("Adresse nicht sicher eingesetzt")
	}
}

func contains(s, sub string) bool {
	return len(s) >= len(sub) && (len(sub) == 0 || indexOf(s, sub) >= 0)
}
func indexOf(s, sub string) int {
	for i := 0; i+len(sub) <= len(s); i++ {
		if s[i:i+len(sub)] == sub {
			return i
		}
	}
	return -1
}
