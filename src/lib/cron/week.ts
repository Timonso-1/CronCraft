import { CronExpressionParser } from "cron-parser";

export interface WeekDay {
  /** "YYYY-MM-DD" in der Zeitzone */
  date: string;
  /** 0 = Sonntag ... 6 = Samstag */
  weekday: number;
  /** Anzahl Ausführungen je Stunde (0-23), gedeckelt auf MAX_PER_HOUR; -1 = vergangen */
  hours: number[];
}

export const MAX_PER_HOUR = 60;
const HOUR = 3_600_000;
const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function localParts(ts: number, timezone: string) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    weekday: "short",
  }).formatToParts(new Date(ts));
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  return {
    date: `${get("year")}-${get("month")}-${get("day")}`,
    hour: Number(get("hour")),
    minute: Number(get("minute")),
    weekday: WEEKDAYS.indexOf(get("weekday")),
  };
}

function countRuns(expression: string, timezone: string, start: number, end: number): number {
  const it = CronExpressionParser.parse(expression, {
    currentDate: new Date(start - 1),
    endDate: new Date(end),
    tz: timezone,
  });
  let n = 0;
  while (n < MAX_PER_HOUR && it.hasNext()) {
    const ts = it.next().toDate().getTime();
    if (ts >= end) break;
    n++;
  }
  return n;
}

/**
 * Raster der kommenden 7 Kalendertage (ab heute) mit Ausführungen je Stunde
 * in der angegebenen Zeitzone. Wirft bei ungültigen Ausdrücken.
 */
export function weekGrid(expression: string, timezone: string, from: Date = new Date()): WeekDay[] {
  const expr = expression.trim();
  CronExpressionParser.parse(expr, { tz: timezone }); // validiert

  const now = from.getTime();
  const nowParts = localParts(now, timezone);
  // Auf den Beginn des heutigen lokalen Tages zurückgehen
  let t = now - nowParts.minute * 60_000 - nowParts.hour * HOUR;
  t -= t % 60_000;

  const days: WeekDay[] = [];
  const byDate = new Map<string, WeekDay>();
  // 8 Tage abtasten, Zeitumstellungen erzeugen sonst Lücken
  for (let guard = 0; guard < 24 * 8 + 2 && days.length <= 7; guard++, t += HOUR) {
    const p = localParts(t, timezone);
    // Halbstündige Offsets auf volle lokale Stunde ausrichten
    const slot = t - p.minute * 60_000;
    let day = byDate.get(p.date);
    if (!day) {
      if (days.length === 7) break;
      day = { date: p.date, weekday: p.weekday, hours: new Array(24).fill(0) };
      byDate.set(p.date, day);
      days.push(day);
    }
    const end = slot + HOUR;
    if (end <= now) {
      day.hours[p.hour] = -1;
      continue;
    }
    day.hours[p.hour] = Math.max(
      day.hours[p.hour],
      countRuns(expr, timezone, Math.max(slot, now), end),
    );
  }
  return days;
}
