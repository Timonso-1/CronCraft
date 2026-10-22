"use client";

import { MAX_PER_HOUR, type WeekDay } from "@/lib/cron/week";
import type { Messages } from "@/lib/i18n";
import { Card } from "./Card";

interface Props {
  grid: WeekDay[];
  timezone: string;
  t: Messages;
}

/** Deckkraft je Anzahl: 1 Ausführung ist klar sichtbar, 60 sind voll. */
function intensity(n: number) {
  return Math.round(45 + (55 * Math.log(n)) / Math.log(MAX_PER_HOUR));
}

function cellBackground(n: number) {
  if (n < 0) return "repeating-linear-gradient(135deg, var(--rule) 0 1px, transparent 1px 5px)";
  if (n === 0) return "var(--sheet-2)";
  return `color-mix(in srgb, var(--accent) ${intensity(n)}%, var(--sheet))`;
}

export function WeekGrid({ grid, timezone, t }: Props) {
  const empty = grid.every((d) => d.hours.every((h) => h <= 0));

  return (
    <Card id="week" title={t.week} subtitle={empty ? t.noRuns : t.weekSub}>
      <div className="relative overflow-x-auto">
        <table className="w-full min-w-[560px] table-fixed border-separate border-spacing-[3px]">
          <caption className="sr-only">
            {t.week} ({timezone})
          </caption>
          <thead>
            <tr>
              <th scope="col" className="w-14" />
              {Array.from({ length: 24 }, (_, h) => (
                <th key={h} scope="col" className="overflow-visible text-left font-mono text-[10px] font-normal whitespace-nowrap text-ink-soft">
                  {h % 3 === 0 ? String(h).padStart(2, "0") : ""}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {grid.map((day) => (
              <tr key={day.date}>
                <th scope="row" className="pr-2 text-left text-xs font-medium whitespace-nowrap">
                  {t.weekdays[day.weekday]} <span className="text-ink-soft">{Number(day.date.slice(8))}.</span>
                </th>
                {day.hours.map((n, h) => (
                  <td
                    key={h}
                    title={`${t.weekdays[day.weekday]} ${String(h).padStart(2, "0")}:00${n > 0 ? ` (${n >= MAX_PER_HOUR ? `${MAX_PER_HOUR}+` : n})` : ""}`}
                    className="h-6 rounded-[3px] p-0"
                    style={{ background: cellBackground(n) }}
                  >
                    <span className="sr-only">{n > 0 ? n : ""}</span>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Card>
  );
}
