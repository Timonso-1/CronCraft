"use client";

import { MAX_PER_HOUR, weekGrid } from "@/lib/cron/week";
import type { Messages } from "@/lib/i18n";
import { useMemo } from "react";

interface Props {
  expression: string;
  timezone: string;
  now: number;
  t: Messages;
}

/** Deckkraft je Anzahl: 1 Ausführung ist klar sichtbar, 60 sind voll. */
function intensity(n: number) {
  if (n <= 0) return 0;
  return Math.round(60 + (40 * Math.log(n)) / Math.log(MAX_PER_HOUR));
}

export function WeekGrid({ expression, timezone, now, t }: Props) {
  const grid = useMemo(() => {
    try {
      return weekGrid(expression, timezone, new Date(now));
    } catch {
      return null;
    }
    // Raster nur minütlich neu berechnen
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expression, timezone, Math.floor(now / 60_000)]);

  if (!grid) return null;
  const empty = grid.every((d) => d.hours.every((h) => h <= 0));

  return (
    <section aria-labelledby="week-title" className="space-y-4">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <h2 id="week-title" className="text-xl font-semibold tracking-tight">
          {t.week}
        </h2>
        <p className="text-sm text-ink-soft">{empty ? t.noRuns : t.weekHelp}</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[560px] table-fixed border-separate border-spacing-[3px]">
          <caption className="sr-only">
            {t.week} ({timezone})
          </caption>
          <thead>
            <tr>
              <th scope="col" className="w-14" />
              {Array.from({ length: 24 }, (_, h) => (
                <th key={h} scope="col" className="text-left font-mono text-[11px] font-normal text-ink-soft overflow-visible whitespace-nowrap">
                  {h % 3 === 0 ? String(h).padStart(2, "0") : ""}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {grid.map((day) => (
              <tr key={day.date}>
                <th scope="row" className="pr-2 text-left text-sm font-medium whitespace-nowrap">
                  {t.weekdays[day.weekday]} <span className="text-ink-soft">{Number(day.date.slice(8))}.</span>
                </th>
                {day.hours.map((n, h) => (
                  <td
                    key={h}
                    title={`${t.weekdays[day.weekday]} ${String(h).padStart(2, "0")}:00${n > 0 ? ` (${n >= MAX_PER_HOUR ? `${MAX_PER_HOUR}+` : n})` : ""}`}
                    className="h-7 rounded-[4px] p-0"
                    style={{
                      background:
                        n < 0
                          ? "repeating-linear-gradient(135deg, var(--rule) 0 1px, transparent 1px 5px)"
                          : n === 0
                            ? "color-mix(in srgb, var(--rule) 55%, transparent)"
                            : `color-mix(in srgb, var(--f-minute) ${intensity(n)}%, var(--sheet))`,
                    }}
                  >
                    <span className="sr-only">{n > 0 ? n : ""}</span>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
