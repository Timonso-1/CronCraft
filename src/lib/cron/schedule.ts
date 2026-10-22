import { CronExpressionParser } from "cron-parser";

export interface Execution {
  /** Zeitpunkt als UTC-Millisekunden */
  timestamp: number;
  /** Lokale Zeit in der gewählten Zeitzone, z. B. "2026-10-22 18:45:00" */
  local: string;
}

export type ScheduleResult =
  | { ok: true; executions: Execution[] }
  | { ok: false; error: string };

export interface ScheduleOptions {
  timezone: string;
  count?: number;
  from?: Date;
}

export function isValidTimezone(tz: string): boolean {
  try {
    new Intl.DateTimeFormat("en-US", { timeZone: tz });
    return true;
  } catch {
    return false;
  }
}

/** Formatiert einen Zeitpunkt als "YYYY-MM-DD HH:mm:ss" in der Zeitzone. */
export function formatLocal(timestamp: number, timezone: string): string {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: timezone,
    hourCycle: "h23",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).formatToParts(new Date(timestamp));
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  return `${get("year")}-${get("month")}-${get("day")} ${get("hour")}:${get("minute")}:${get("second")}`;
}

/** Berechnet die nächsten Ausführungszeitpunkte in der angegebenen Zeitzone. */
export function nextExecutions(
  expression: string,
  { timezone, count = 10, from = new Date() }: ScheduleOptions,
): ScheduleResult {
  if (!isValidTimezone(timezone)) {
    return { ok: false, error: `Unbekannte Zeitzone: ${timezone}` };
  }
  try {
    const interval = CronExpressionParser.parse(expression.trim(), {
      currentDate: from,
      tz: timezone,
    });
    const executions: Execution[] = [];
    for (let i = 0; i < count; i++) {
      if (!interval.hasNext()) break;
      const ts = interval.next().toDate().getTime();
      executions.push({ timestamp: ts, local: formatLocal(ts, timezone) });
    }
    return { ok: true, executions };
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : String(e) };
  }
}
