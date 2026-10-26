package main

import (
	"errors"
	"fmt"
	"net/url"
	"strings"
	"sync"
)

// window kapselt die Fensterbefehle, damit die Logik ohne Windows testbar bleibt.
type window interface {
	setTopmost(on bool)
	setOpacity(v float64, clickThrough bool)
	setCompact(on bool)
	openExternal(u string) error
}

// app hält Einstellungen und Fenster zusammen. Alle Aufrufe kommen aus dem Fenster-Thread
// (Seite, globale Taste über Dispatch); das Mutex schützt nur gegen den Positions-Speicher.
type app struct {
	mu    sync.Mutex
	cfg   Config
	path  string
	win   window
	durch bool // Durchklicken gilt nur bis zum Neustart, damit das Fenster nie unbedienbar startet
	// Tasten, die Windows nicht registrieren konnte (schon von einem anderen Programm belegt)
	tastenFehler []string
}

func (a *app) saveLocked() {
	if a.path != "" {
		_ = a.cfg.save(a.path)
	}
}

func (a *app) info() map[string]interface{} {
	a.mu.Lock()
	defer a.mu.Unlock()
	return map[string]interface{}{
		"version":            version,
		"oben":               a.cfg.Oben || a.durch,
		"deckkraft":          a.cfg.Deckkraft,
		"durchklicken":       a.durch,
		"kompakt":            a.cfg.Kompakt,
		"tasteZeigen":        a.cfg.TasteZeigen,
		"tasteDurchklicken":  a.cfg.TasteDurchklicken,
		"tasteZuruecksetzen": a.cfg.TasteZuruecksetzen,
		"tastenFehler":       append([]string{}, a.tastenFehler...),
	}
}

// call ist die Funktion window.dkDesktop(befehl, wert) der Seite.
func (a *app) call(cmd string, val interface{}) (interface{}, error) {
	switch cmd {
	case "info":
		return a.info(), nil
	case "oben":
		on, ok := val.(bool)
		if !ok {
			return nil, errors.New("oben: true oder false")
		}
		a.mu.Lock()
		a.cfg.Oben = on
		a.saveLocked()
		durch := a.durch
		a.mu.Unlock()
		a.win.setTopmost(on || durch)
	case "deckkraft":
		v, ok := val.(float64)
		if !ok {
			return nil, errors.New("deckkraft: Zahl zwischen 0,3 und 1")
		}
		a.mu.Lock()
		a.cfg.Deckkraft = clampDeckkraft(v)
		a.saveLocked()
		d, durch := a.cfg.Deckkraft, a.durch
		a.mu.Unlock()
		a.win.setOpacity(d, durch)
	case "durchklicken":
		on, ok := val.(bool)
		if !ok {
			return nil, errors.New("durchklicken: true oder false")
		}
		a.setClickThrough(on)
	case "kompakt":
		on, ok := val.(bool)
		if !ok {
			return nil, errors.New("kompakt: true oder false")
		}
		a.mu.Lock()
		a.cfg.Kompakt = on
		a.saveLocked()
		a.mu.Unlock()
		a.win.setCompact(on)
	case "oeffnen":
		u, ok := val.(string)
		if !ok || !allowedExternal(u) {
			return nil, fmt.Errorf("oeffnen: nur https-Adressen")
		}
		return nil, a.win.openExternal(u)
	default:
		return nil, fmt.Errorf("unbekannter Befehl %q", cmd)
	}
	return a.info(), nil
}

// setClickThrough schaltet Durchklicken; dabei liegt das Fenster immer oben.
func (a *app) setClickThrough(on bool) {
	a.mu.Lock()
	a.durch = on
	d, oben := a.cfg.Deckkraft, a.cfg.Oben
	a.mu.Unlock()
	a.win.setOpacity(d, on)
	a.win.setTopmost(on || oben)
}

// reset macht das Fenster wieder normal: voll deckend, nicht durchklickbar, nicht im Vordergrund.
// Notbremse über die globale Taste, falls das Overlay nicht mehr bedienbar ist.
func (a *app) reset() {
	a.mu.Lock()
	a.durch = false
	a.cfg.Oben = false
	a.cfg.Deckkraft = 1
	a.saveLocked()
	a.mu.Unlock()
	a.win.setOpacity(1, false)
	a.win.setTopmost(false)
}

func (a *app) toggleClickThrough() bool {
	a.mu.Lock()
	on := !a.durch
	a.mu.Unlock()
	a.setClickThrough(on)
	return on
}

// rememberRect speichert Position und Größe, wenn sie sich geändert haben.
func (a *app) rememberRect(x, y, w, h int) {
	a.mu.Lock()
	defer a.mu.Unlock()
	if w < 320 || h < 400 || (a.cfg.X == x && a.cfg.Y == y && a.cfg.W == w && a.cfg.H == h) {
		return
	}
	a.cfg.X, a.cfg.Y, a.cfg.W, a.cfg.H = x, y, w, h
	if !a.cfg.Kompakt {
		a.cfg.NormalW, a.cfg.NormalH = w, h
	}
	a.saveLocked()
}

func allowedExternal(raw string) bool {
	u, err := url.Parse(raw)
	return err == nil && u.Scheme == "https" && u.Host != "" && u.User == nil
}

func allowedStartURL(raw string) bool {
	u, err := url.Parse(raw)
	if err != nil || u.Host == "" {
		return false
	}
	if u.Scheme == "https" {
		return true
	}
	h := strings.ToLower(u.Hostname())
	return u.Scheme == "http" && (h == "localhost" || h == "127.0.0.1")
}
