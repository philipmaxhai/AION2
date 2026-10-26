package main

import (
	"fmt"
	"strconv"
	"strings"
)

// Modifikatoren für RegisterHotKey
const (
	modAlt      = 0x0001
	modControl  = 0x0002
	modShift    = 0x0004
	modWin      = 0x0008
	modNoRepeat = 0x4000
)

// parseHotkey liest Angaben wie "Strg+Umschalt+K", "Ctrl+Alt+F9" oder "Shift+Pos1".
// Mindestens ein Modifikator ist Pflicht, damit die Taste im Spiel nicht fehlt.
func parseHotkey(s string) (mods uint32, vk uint32, err error) {
	parts := strings.Split(strings.ReplaceAll(s, " ", ""), "+")
	if len(parts) < 2 {
		return 0, 0, fmt.Errorf("Taste %q: mindestens ein Modifikator und eine Taste, z. B. Strg+Umschalt+K", s)
	}
	for _, p := range parts[:len(parts)-1] {
		switch strings.ToLower(p) {
		case "strg", "ctrl", "control":
			mods |= modControl
		case "umschalt", "shift", "hochstell":
			mods |= modShift
		case "alt":
			mods |= modAlt
		case "win", "windows":
			mods |= modWin
		default:
			return 0, 0, fmt.Errorf("Taste %q: unbekannter Modifikator %q", s, p)
		}
	}
	key := strings.ToUpper(parts[len(parts)-1])
	switch {
	case len(key) == 1 && key[0] >= 'A' && key[0] <= 'Z', len(key) == 1 && key[0] >= '0' && key[0] <= '9':
		vk = uint32(key[0])
	case len(key) >= 2 && key[0] == 'F':
		n, e := strconv.Atoi(key[1:])
		if e != nil || n < 1 || n > 24 {
			return 0, 0, fmt.Errorf("Taste %q: F1 bis F24", s)
		}
		vk = 0x70 + uint32(n-1)
	default:
		named := map[string]uint32{"POS1": 0x24, "HOME": 0x24, "ENDE": 0x23, "END": 0x23, "EINFG": 0x2D, "INSERT": 0x2D,
			"ENTF": 0x2E, "DELETE": 0x2E, "BILDAUF": 0x21, "PAGEUP": 0x21, "BILDAB": 0x22, "PAGEDOWN": 0x22, "PAUSE": 0x13}
		v, ok := named[key]
		if !ok {
			return 0, 0, fmt.Errorf("Taste %q: unbekannte Taste %q", s, parts[len(parts)-1])
		}
		vk = v
	}
	if mods == 0 {
		return 0, 0, fmt.Errorf("Taste %q: Modifikator fehlt", s)
	}
	return mods, vk, nil
}
