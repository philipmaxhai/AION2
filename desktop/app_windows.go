//go:build windows

package main

import (
	"encoding/json"
	"math"
	"os"
	"path/filepath"
	"runtime"
	"time"
	"unsafe"

	webview2 "github.com/jchv/go-webview2"
	"golang.org/x/sys/windows"
)

var (
	user32  = windows.NewLazySystemDLL("user32.dll")
	shell32 = windows.NewLazySystemDLL("shell32.dll")

	pSetWindowPos               = user32.NewProc("SetWindowPos")
	pGetWindowLongPtrW          = user32.NewProc("GetWindowLongPtrW")
	pSetWindowLongPtrW          = user32.NewProc("SetWindowLongPtrW")
	pSetLayeredWindowAttributes = user32.NewProc("SetLayeredWindowAttributes")
	pGetWindowRect              = user32.NewProc("GetWindowRect")
	pIsIconic                   = user32.NewProc("IsIconic")
	pIsWindowVisible            = user32.NewProc("IsWindowVisible")
	pShowWindow                 = user32.NewProc("ShowWindow")
	pSetForegroundWindow        = user32.NewProc("SetForegroundWindow")
	pRegisterHotKey             = user32.NewProc("RegisterHotKey")
	pGetMessageW                = user32.NewProc("GetMessageW")
	pMessageBoxW                = user32.NewProc("MessageBoxW")
	pMonitorFromRect            = user32.NewProc("MonitorFromRect")
	pGetDpiForWindow            = user32.NewProc("GetDpiForWindow")
	pFindWindowW                = user32.NewProc("FindWindowW")
	pSystemParametersInfoW      = user32.NewProc("SystemParametersInfoW")
	pShellExecuteW              = shell32.NewProc("ShellExecuteW")
)

const (
	gwlExStyle      = ^uintptr(19) // -20
	hwndTopmost     = ^uintptr(0)  // -1
	hwndNoTopmost   = ^uintptr(1)  // -2
	wsExLayered     = 0x00080000
	wsExTransparent = 0x00000020
	lwaAlpha        = 0x2
	swpNoSize       = 0x0001
	swpNoMove       = 0x0002
	swpNoZOrder     = 0x0004
	swpNoActivate   = 0x0010
	swpFrameChanged = 0x0020
	swHide          = 0
	swShowNormal    = 1
	swShow          = 5
	swRestore       = 9
	wmHotkey        = 0x0312
	mbYesNo         = 0x4
	mbIconWarning   = 0x30
	idYes           = 6
	spiGetWorkArea  = 0x0030
	title           = "Daeva-Kompass"
	webview2Page    = "https://developer.microsoft.com/de-de/microsoft-edge/webview2/"
)

type rect struct{ left, top, right, bottom int32 }

type winMsg struct {
	hwnd    uintptr
	message uint32
	wParam  uintptr
	lParam  uintptr
	time    uint32
	ptX     int32
	ptY     int32
	private uint32
}

func utf16(s string) uintptr {
	p, _ := windows.UTF16PtrFromString(s)
	return uintptr(unsafe.Pointer(p))
}

type winWindow struct {
	hwnd uintptr
	app  *app
}

func (x *winWindow) setTopmost(on bool) {
	after := hwndNoTopmost
	if on {
		after = hwndTopmost
	}
	_, _, _ = pSetWindowPos.Call(x.hwnd, after, 0, 0, 0, 0, swpNoMove|swpNoSize|swpNoActivate)
}

// setOpacity setzt Deckkraft und Durchklicken über einen Layered-Stil; voll deckend ohne Durchklicken
// nimmt es den Stil wieder weg, damit das Fenster normal gezeichnet wird.
func (x *winWindow) setOpacity(v float64, clickThrough bool) {
	ex, _, _ := pGetWindowLongPtrW.Call(x.hwnd, gwlExStyle)
	layered := v < 0.995 || clickThrough
	n := ex &^ (wsExLayered | wsExTransparent)
	if layered {
		n |= wsExLayered
	}
	if clickThrough {
		n |= wsExTransparent
	}
	if n != ex {
		_, _, _ = pSetWindowLongPtrW.Call(x.hwnd, gwlExStyle, n)
	}
	if layered {
		alpha := uintptr(math.Round(clampDeckkraft(v) * 255))
		_, _, _ = pSetLayeredWindowAttributes.Call(x.hwnd, 0, alpha, lwaAlpha)
	}
	_, _, _ = pSetWindowPos.Call(x.hwnd, 0, 0, 0, 0, 0, swpNoMove|swpNoSize|swpNoZOrder|swpNoActivate|swpFrameChanged)
}

func (x *winWindow) scale() float64 {
	if pGetDpiForWindow.Find() == nil {
		if d, _, _ := pGetDpiForWindow.Call(x.hwnd); d > 0 {
			return float64(d) / 96
		}
	}
	return 1
}

func workArea() rect {
	var r rect
	_, _, _ = pSystemParametersInfoW.Call(spiGetWorkArea, 0, uintptr(unsafe.Pointer(&r)), 0)
	return r
}

// setCompact schaltet zwischen schmaler Overlay-Größe und der zuletzt genutzten normalen Größe.
func (x *winWindow) setCompact(on bool) {
	var r rect
	_, _, _ = pGetWindowRect.Call(x.hwnd, uintptr(unsafe.Pointer(&r)))
	s := x.scale()
	w, h := int(460*s), int(820*s)
	if !on {
		x.app.mu.Lock()
		w, h = x.app.cfg.NormalW, x.app.cfg.NormalH
		x.app.mu.Unlock()
		if w < 320 || h < 400 {
			w, h = int(1280*s), int(860*s)
		}
	}
	wa := workArea()
	if wa.right > wa.left {
		w = min(w, int(wa.right-wa.left))
		h = min(h, int(wa.bottom-wa.top))
	}
	_, _, _ = pSetWindowPos.Call(x.hwnd, 0, uintptr(r.left), uintptr(r.top), uintptr(w), uintptr(h), swpNoZOrder|swpNoActivate)
}

func (x *winWindow) openExternal(u string) error {
	r, _, _ := pShellExecuteW.Call(0, utf16("open"), utf16(u), 0, 0, swShowNormal)
	if r <= 32 {
		return windows.ERROR_FILE_NOT_FOUND
	}
	return nil
}

// placeWindow stellt die gespeicherte Position her, wenn sie noch auf einem Bildschirm liegt.
func (x *winWindow) placeWindow(c Config) {
	r := rect{int32(c.X), int32(c.Y), int32(c.X + c.W), int32(c.Y + c.H)}
	if c.W > 0 {
		if m, _, _ := pMonitorFromRect.Call(uintptr(unsafe.Pointer(&r)), 0); m != 0 {
			_, _, _ = pSetWindowPos.Call(x.hwnd, 0, uintptr(c.X), uintptr(c.Y), uintptr(c.W), uintptr(c.H), swpNoZOrder|swpNoActivate)
			return
		}
	}
	s := x.scale()
	w, h := int(1280*s), int(860*s)
	wa := workArea()
	if wa.right <= wa.left {
		return
	}
	w = min(w, int(wa.right-wa.left))
	h = min(h, int(wa.bottom-wa.top))
	left := int(wa.left) + (int(wa.right-wa.left)-w)/2
	top := int(wa.top) + (int(wa.bottom-wa.top)-h)/2
	_, _, _ = pSetWindowPos.Call(x.hwnd, 0, uintptr(left), uintptr(top), uintptr(w), uintptr(h), swpNoZOrder|swpNoActivate)
}

func (x *winWindow) toggleVisible() {
	vis, _, _ := pIsWindowVisible.Call(x.hwnd)
	icon, _, _ := pIsIconic.Call(x.hwnd)
	if vis != 0 && icon == 0 {
		_, _, _ = pShowWindow.Call(x.hwnd, swHide)
		return
	}
	x.showFront()
}

func (x *winWindow) showFront() {
	icon, _, _ := pIsIconic.Call(x.hwnd)
	if icon != 0 {
		_, _, _ = pShowWindow.Call(x.hwnd, swRestore)
	} else {
		_, _, _ = pShowWindow.Call(x.hwnd, swShow)
	}
	_, _, _ = pSetForegroundWindow.Call(x.hwnd)
}

// hotkeys läuft in einem eigenen Thread: RegisterHotKey ohne Fenster schickt WM_HOTKEY an diesen Thread.
func hotkeys(w webview2.WebView, a *app, x *winWindow) {
	runtime.LockOSThread()
	register := func(id uintptr, spec string) bool {
		mods, vk, err := parseHotkey(spec)
		if err != nil {
			return false
		}
		r, _, _ := pRegisterHotKey.Call(0, id, uintptr(mods|modNoRepeat), uintptr(vk))
		return r != 0
	}
	a.mu.Lock()
	keys := []string{a.cfg.TasteZeigen, a.cfg.TasteDurchklicken, a.cfg.TasteZuruecksetzen}
	a.mu.Unlock()
	var failed []string
	for i, k := range keys {
		if !register(uintptr(i+1), k) {
			failed = append(failed, k)
		}
	}
	a.mu.Lock()
	a.tastenFehler = failed
	a.mu.Unlock()
	var m winMsg
	for {
		r, _, _ := pGetMessageW.Call(uintptr(unsafe.Pointer(&m)), 0, 0, 0)
		if int32(r) <= 0 {
			return
		}
		if m.message != wmHotkey {
			continue
		}
		switch m.wParam {
		case 1:
			w.Dispatch(x.toggleVisible)
		case 2:
			w.Dispatch(func() {
				a.toggleClickThrough()
				notifyPage(w, a)
			})
		case 3:
			w.Dispatch(func() {
				a.reset()
				x.showFront()
				notifyPage(w, a)
			})
		}
	}
}

// notifyPage meldet der Seite den neuen Zustand (Ereignis "dkdesktop").
func notifyPage(w webview2.WebView, a *app) {
	b, _ := json.Marshal(a.info())
	w.Eval("window.dispatchEvent(new CustomEvent('dkdesktop',{detail:" + string(b) + "}))")
}

func bringExistingToFront() {
	h, _, _ := pFindWindowW.Call(utf16("webview"), utf16(title))
	if h == 0 {
		return
	}
	_, _, _ = pShowWindow.Call(h, swShow)
	_, _, _ = pShowWindow.Call(h, swRestore)
	_, _, _ = pSetForegroundWindow.Call(h)
}

func noWebView(site string) {
	if h, _, _ := pFindWindowW.Call(utf16("webview"), utf16(title)); h != 0 {
		_, _, _ = pShowWindow.Call(h, swHide)
	}
	text := "Für die App fehlt die Microsoft Edge WebView2 Runtime (bei Windows 11 schon dabei, bei Windows 10 meist auch).\n\n" +
		"Ja: Download-Seite von Microsoft öffnen.\nNein: Den Daeva-Kompass im Browser öffnen."
	r, _, _ := pMessageBoxW.Call(0, utf16(text), utf16(title), mbYesNo|mbIconWarning)
	target := site
	if r == idYes {
		target = webview2Page
	}
	_, _, _ = pShellExecuteW.Call(0, utf16("open"), utf16(target), 0, 0, swShowNormal)
}

func main() {
	runtime.LockOSThread()

	mutex, err := windows.CreateMutex(nil, false, windows.StringToUTF16Ptr("Local\\DaevaKompassDesktop"))
	if err == windows.ERROR_ALREADY_EXISTS {
		bringExistingToFront()
		return
	}
	if mutex != 0 {
		defer windows.CloseHandle(mutex)
	}

	exe, _ := os.Executable()
	dir := dataDir(exe, os.Getenv("LOCALAPPDATA"))
	cfgPath := filepath.Join(dir, "einstellungen.json")
	cfg := loadConfig(cfgPath)

	w := webview2.NewWithOptions(webview2.WebViewOptions{
		DataPath:  filepath.Join(dir, "WebView2"),
		AutoFocus: true,
		WindowOptions: webview2.WindowOptions{
			Title:  title,
			Width:  1280,
			Height: 860,
			IconId: 1,
			Center: true,
		},
	})
	if w == nil {
		noWebView(cfg.startURL())
		return
	}
	defer w.Destroy()

	a := &app{cfg: cfg, path: cfgPath}
	x := &winWindow{hwnd: uintptr(w.Window()), app: a}
	a.win = x
	x.placeWindow(cfg)
	if cfg.Kompakt {
		x.setCompact(true)
	}
	x.setTopmost(cfg.Oben)
	x.setOpacity(cfg.Deckkraft, false)

	_ = w.Bind("dkDesktop", func(cmd string, vals ...interface{}) (interface{}, error) {
		var v interface{}
		if len(vals) > 0 {
			v = vals[0]
		}
		return a.call(cmd, v)
	})

	go hotkeys(w, a, x)

	done := make(chan struct{})
	go func() {
		t := time.NewTicker(time.Second)
		defer t.Stop()
		for {
			select {
			case <-done:
				return
			case <-t.C:
				vis, _, _ := pIsWindowVisible.Call(x.hwnd)
				icon, _, _ := pIsIconic.Call(x.hwnd)
				if vis == 0 || icon != 0 {
					continue
				}
				var r rect
				if ok, _, _ := pGetWindowRect.Call(x.hwnd, uintptr(unsafe.Pointer(&r))); ok != 0 {
					a.rememberRect(int(r.left), int(r.top), int(r.right-r.left), int(r.bottom-r.top))
				}
			}
		}
	}()

	w.SetHtml(startPage(cfg.startURL()))
	w.Run()
	close(done)
}
