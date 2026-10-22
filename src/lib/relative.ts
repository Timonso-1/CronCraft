import type { Locale } from "@/lib/cron/describe";

/** Relative Angabe bis zu einem Zeitpunkt, z. B. "in 5 Minuten". */
export function relativeTime(target: number, now: number, locale: Locale): string {
  const diffSec = Math.round((target - now) / 1000);
  const rtf = new Intl.RelativeTimeFormat(locale, { numeric: "always" });
  const abs = Math.abs(diffSec);
  if (abs < 60) return rtf.format(diffSec, "second");
  if (abs < 3600) return rtf.format(Math.round(diffSec / 60), "minute");
  if (abs < 86400) return rtf.format(Math.round(diffSec / 3600), "hour");
  return rtf.format(Math.round(diffSec / 86400), "day");
}
