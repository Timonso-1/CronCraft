export interface Preset {
  id: string;
  expression: string;
  label: { de: string; en: string };
}

export const PRESETS: Preset[] = [
  { id: "every-minute", expression: "* * * * *", label: { de: "Jede Minute", en: "Every minute" } },
  { id: "every-5-min", expression: "*/5 * * * *", label: { de: "Alle 5 Minuten", en: "Every 5 minutes" } },
  { id: "every-15-min", expression: "*/15 * * * *", label: { de: "Alle 15 Minuten", en: "Every 15 minutes" } },
  { id: "hourly", expression: "0 * * * *", label: { de: "Stündlich", en: "Hourly" } },
  { id: "daily-midnight", expression: "0 0 * * *", label: { de: "Täglich um Mitternacht", en: "Daily at midnight" } },
  { id: "daily-9", expression: "0 9 * * *", label: { de: "Täglich um 09:00", en: "Daily at 09:00" } },
  { id: "weekdays-9", expression: "0 9 * * 1-5", label: { de: "Werktags um 09:00", en: "Weekdays at 09:00" } },
  { id: "weekly-monday", expression: "0 8 * * 1", label: { de: "Montags um 08:00", en: "Mondays at 08:00" } },
  { id: "monthly-first", expression: "0 0 1 * *", label: { de: "Monatlich am 1.", en: "Monthly on the 1st" } },
  { id: "yearly", expression: "0 0 1 1 *", label: { de: "Jährlich am 1. Januar", en: "Yearly on January 1st" } },
];
