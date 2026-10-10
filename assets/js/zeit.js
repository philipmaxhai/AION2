/*
 * Zeit-Engine: rechnet Spielzeiten (UTC oder Berlin) in deutsche Zeit um.
 * Sommer-/Winterzeit übernimmt Intl automatisch.
 */
(function () {
  const TZ = "Europe/Berlin";
  const dtfCache = {};

  function dtf(tz) {
    if (!dtfCache[tz]) {
      dtfCache[tz] = new Intl.DateTimeFormat("en-US", {
        timeZone: tz, hourCycle: "h23", year: "numeric", month: "2-digit", day: "2-digit",
        hour: "2-digit", minute: "2-digit", second: "2-digit", weekday: "short"
      });
    }
    return dtfCache[tz];
  }

  const WD = { Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5, Sat: 6 };

  /* Wanduhr-Teile eines Zeitpunkts in einer Zeitzone */
  function parts(tz, ts) {
    if (tz === "UTC") {
      const d = new Date(ts);
      return { y: d.getUTCFullYear(), mo: d.getUTCMonth(), d: d.getUTCDate(), h: d.getUTCHours(), mi: d.getUTCMinutes(), s: d.getUTCSeconds(), dow: d.getUTCDay() };
    }
    const o = {};
    for (const p of dtf(tz).formatToParts(new Date(ts))) o[p.type] = p.value;
    return { y: +o.year, mo: +o.month - 1, d: +o.day, h: +o.hour % 24, mi: +o.minute, s: +o.second, dow: WD[o.weekday] };
  }

  /* Offset der Zone zu UTC in Minuten */
  function offsetMin(tz, ts) {
    if (tz === "UTC") return 0;
    const p = parts(tz, ts);
    const asUtc = Date.UTC(p.y, p.mo, p.d, p.h, p.mi, p.s);
    return Math.round((asUtc - Math.floor(ts / 1000) * 1000) / 60000);
  }

  /* Wanduhrzeit in einer Zone -> UTC-Zeitstempel */
  function zoned(tz, y, mo, d, h, mi) {
    const guess = Date.UTC(y, mo, d, h, mi);
    if (tz === "UTC") return guess;
    const off1 = offsetMin(tz, guess);
    let ts = guess - off1 * 60000;
    const off2 = offsetMin(tz, ts);
    if (off2 !== off1) ts = guess - off2 * 60000;
    return ts;
  }

  function hm(str) {
    const [h, m] = str.split(":").map(Number);
    return h * 60 + m;
  }

  /* Alle Termine eines Events im Fenster [from, to] */
  function occurrences(ev, from, to, shiftMin) {
    const shift = (shiftMin || 0) * 60000;
    const out = [];
    const start = parts(ev.tz, from - 86400000 - Math.abs(shift));
    let y = start.y, mo = start.mo, d = start.d;
    for (let i = 0; i < 400; i++) {
      const dayStart = zoned(ev.tz, y, mo, d, 0, 0);
      if (dayStart > to + 86400000 + Math.abs(shift)) break;
      const dow = new Date(Date.UTC(y, mo, d)).getUTCDay();
      if (!ev.days || ev.days.includes(dow)) {
        const mins = [];
        if (ev.kind === "interval") {
          for (let m = hm(ev.start); m < 1440; m += ev.every) mins.push(m);
        } else {
          for (const t of ev.times) mins.push(hm(t));
        }
        for (const m of mins) {
          const ts = zoned(ev.tz, y, mo, d, Math.floor(m / 60), m % 60) + shift;
          const end = ts + (ev.dur || 0) * 60000;
          if (end >= from && ts <= to) out.push({ ev, ts, end });
        }
      }
      const nx = new Date(Date.UTC(y, mo, d + 1));
      y = nx.getUTCFullYear(); mo = nx.getUTCMonth(); d = nx.getUTCDate();
    }
    return out.sort((a, b) => a.ts - b.ts);
  }

  /* Nächster (oder laufender) Termin */
  function next(ev, now, shiftMin) {
    const list = occurrences(ev, now, now + 8 * 86400000, shiftMin);
    return list.find((o) => o.end >= now && (o.end > now || o.ts >= now)) || null;
  }

  /* Letzter vergangener Termin (für Resets) */
  function last(ev, now, shiftMin) {
    const list = occurrences(ev, now - 8 * 86400000, now, shiftMin).filter((o) => o.ts <= now);
    return list.length ? list[list.length - 1] : null;
  }

  /* ---------- Formatierung (immer deutsche Zeit) ---------- */
  const fTime = new Intl.DateTimeFormat("de-DE", { timeZone: TZ, hour: "2-digit", minute: "2-digit" });
  const fSec = new Intl.DateTimeFormat("de-DE", { timeZone: TZ, hour: "2-digit", minute: "2-digit", second: "2-digit" });
  const fDay = new Intl.DateTimeFormat("de-DE", { timeZone: TZ, weekday: "short", day: "2-digit", month: "2-digit" });
  const fLong = new Intl.DateTimeFormat("de-DE", { timeZone: TZ, weekday: "long", day: "numeric", month: "long" });
  const fZone = new Intl.DateTimeFormat("de-DE", { timeZone: TZ, timeZoneName: "short" });

  function zoneName(ts) {
    const p = fZone.formatToParts(new Date(ts)).find((x) => x.type === "timeZoneName");
    return p ? p.value : "";
  }

  function countdown(ms) {
    if (ms <= 0) return "jetzt";
    const s = Math.floor(ms / 1000);
    const d = Math.floor(s / 86400);
    const h = Math.floor((s % 86400) / 3600);
    const m = Math.floor((s % 3600) / 60);
    const sec = s % 60;
    if (d > 0) return d + " T " + h + " h";
    if (h > 0) return h + " h " + String(m).padStart(2, "0") + " min";
    if (m >= 10) return m + " min";
    return m + ":" + String(sec).padStart(2, "0");
  }

  /* Berliner Kalendertag als Schlüssel */
  function berlinDay(ts) {
    const p = parts(TZ, ts);
    return { y: p.y, mo: p.mo, d: p.d, dow: p.dow };
  }

  function berlinMidnight(ts) {
    const p = parts(TZ, ts);
    return zoned(TZ, p.y, p.mo, p.d, 0, 0);
  }

  /* Nächster Wechsel Sommer-/Winterzeit innerhalb von n Tagen */
  function nextDstChange(now, days) {
    let prev = offsetMin(TZ, now);
    for (let i = 1; i <= days; i++) {
      const ts = now + i * 86400000;
      const off = offsetMin(TZ, ts);
      if (off !== prev) {
        // genauer Tag: Berliner Tag des Wechsels
        let lo = ts - 86400000, hi = ts;
        while (hi - lo > 60000) {
          const mid = Math.floor((lo + hi) / 2);
          if (offsetMin(TZ, mid) === prev) lo = mid; else hi = mid;
        }
        return { ts: hi, from: prev, to: off };
      }
      prev = off;
    }
    return null;
  }

  window.DK_ZEIT = {
    TZ, parts, zoned, occurrences, next, last, offsetMin,
    time: (ts) => fTime.format(new Date(ts)),
    timeSec: (ts) => fSec.format(new Date(ts)),
    day: (ts) => fDay.format(new Date(ts)),
    long: (ts) => fLong.format(new Date(ts)),
    zoneName, countdown, berlinDay, berlinMidnight, nextDstChange
  };
})();
