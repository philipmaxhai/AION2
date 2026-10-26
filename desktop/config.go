// Daeva-Kompass Desktop: die Seite in einem eigenen Fenster, das über dem Spiel liegen kann.
//
// Einstellungen liegen als einstellungen.json im Datenordner neben der exe (portabel) oder,
// wenn dort nicht geschrieben werden darf, unter %LOCALAPPDATA%\DaevaKompass.
package main

import (
	"encoding/json"
	"math"
	"os"
	"path/filepath"
)

const (
	liveURL      = "https://aion2.philipmax-hain.workers.dev/"
	minDeckkraft = 0.3
)

// Version wird beim Bauen gesetzt (-ldflags "-X main.version=…").
var version = "entwicklung"

// Config ist der gespeicherte Zustand des Fensters.
type Config struct {
	X         int     `json:"x"`
	Y         int     `json:"y"`
	W         int     `json:"w"`
	H         int     `json:"h"`
	Oben      bool    `json:"oben"`
	Deckkraft float64 `json:"deckkraft"`
	Kompakt   bool    `json:"kompakt"`
	// Normale Größe, solange das Fenster kompakt ist
	NormalW int `json:"normalW,omitempty"`
	NormalH int `json:"normalH,omitempty"`
	// Globale Tasten, z. B. "Strg+Umschalt+K"
	TasteZeigen        string `json:"tasteZeigen"`
	TasteDurchklicken  string `json:"tasteDurchklicken"`
	TasteZuruecksetzen string `json:"tasteZuruecksetzen"`
	// Andere Adresse als die Live-Seite, z. B. http://localhost:8787/ zum Testen
	URL string `json:"url,omitempty"`
}

func defaultConfig() Config {
	return Config{
		Deckkraft:          1,
		TasteZeigen:        "Strg+Umschalt+K",
		TasteDurchklicken:  "Strg+Umschalt+D",
		TasteZuruecksetzen: "Strg+Umschalt+0",
	}
}

func clampDeckkraft(v float64) float64 {
	if math.IsNaN(v) || v <= 0 || v > 1 {
		return 1
	}
	return math.Max(minDeckkraft, v)
}

// loadConfig liest die Einstellungen; Fehlendes oder Kaputtes ersetzt es durch Standardwerte.
func loadConfig(path string) Config {
	c := defaultConfig()
	if b, err := os.ReadFile(path); err == nil {
		_ = json.Unmarshal(b, &c)
	}
	c.Deckkraft = clampDeckkraft(c.Deckkraft)
	if _, _, err := parseHotkey(c.TasteZeigen); err != nil {
		c.TasteZeigen = defaultConfig().TasteZeigen
	}
	if _, _, err := parseHotkey(c.TasteDurchklicken); err != nil {
		c.TasteDurchklicken = defaultConfig().TasteDurchklicken
	}
	if _, _, err := parseHotkey(c.TasteZuruecksetzen); err != nil {
		c.TasteZuruecksetzen = defaultConfig().TasteZuruecksetzen
	}
	if c.W < 320 || c.H < 400 {
		c.W, c.H = 0, 0
	}
	if c.URL != "" && !allowedStartURL(c.URL) {
		c.URL = ""
	}
	return c
}

// save schreibt erst in eine Hilfsdatei und benennt sie dann um, damit nie eine halbe Datei liegen bleibt.
func (c Config) save(path string) error {
	b, err := json.MarshalIndent(c, "", "  ")
	if err != nil {
		return err
	}
	tmp := path + ".tmp"
	if err := os.WriteFile(tmp, b, 0o644); err != nil {
		return err
	}
	return os.Rename(tmp, path)
}

func (c Config) startURL() string {
	if c.URL != "" {
		return c.URL
	}
	return liveURL
}

// dataDir wählt den Datenordner: neben der exe, sonst im Benutzerprofil.
func dataDir(exe string, localAppData string) string {
	portable := filepath.Join(filepath.Dir(exe), "DaevaKompass-Daten")
	if writable(portable) {
		return portable
	}
	if localAppData == "" {
		localAppData = os.TempDir()
	}
	fallback := filepath.Join(localAppData, "DaevaKompass")
	_ = os.MkdirAll(fallback, 0o755)
	return fallback
}

func writable(dir string) bool {
	if err := os.MkdirAll(dir, 0o755); err != nil {
		return false
	}
	f, err := os.CreateTemp(dir, ".schreibtest-*")
	if err != nil {
		return false
	}
	name := f.Name()
	f.Close()
	_ = os.Remove(name)
	return true
}
