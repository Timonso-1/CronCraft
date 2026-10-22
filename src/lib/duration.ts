import type { Locale } from "@/lib/cron/describe";

/** Dauer in der größten sinnvollen Einheit, z. B. "15 Minuten", "1 Tag". */
export function formatDuration(ms: number, locale: Locale): string {
  const fmt = (value: number, unit: "second" | "minute" | "hour" | "day") =>
    new Intl.NumberFormat(locale, { style: "unit", unit, unitDisplay: "long", maximumFractionDigits: 1 }).format(value);
  const s = ms / 1000;
  if (s < 60) return fmt(s, "second");
  if (s < 3600) return fmt(s / 60, "minute");
  if (s < 86400) return fmt(s / 3600, "hour");
  return fmt(s / 86400, "day");
}
