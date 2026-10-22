"use client";

import { nextExecutions } from "@/lib/cron/schedule";
import type { Locale, Messages } from "@/lib/i18n";
import { relativeTime } from "@/lib/relative";
import { useMemo } from "react";

interface Props {
  expression: string;
  timezones: string[];
  count: number;
  now: number;
  locale: Locale;
  t: Messages;
}

/** Tabelle der nächsten Ausführungen; eine Spalte je Zeitzone. */
export function NextRuns({ expression, timezones, count, now, locale, t }: Props) {
  const results = useMemo(
    () =>
      timezones.map((tz) => ({
        tz,
        result: nextExecutions(expression, { timezone: tz, count, from: new Date(now) }),
      })),
    [expression, timezones, count, now],
  );

  const firstOk = results.find((r) => r.result.ok);
  const rows = firstOk && firstOk.result.ok ? firstOk.result.executions : [];

  if (!firstOk) {
    const err = results[0]?.result;
    return <p className="text-sm text-red-600 dark:text-red-400">{err && !err.ok ? err.error : ""}</p>;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-black/10 dark:border-white/15">
            <th className="py-2 pr-4 font-medium">#</th>
            {results.map(({ tz }) => (
              <th key={tz} className="py-2 pr-4 font-medium">
                {tz}
              </th>
            ))}
            <th className="py-2 font-medium opacity-70">{t.relative}</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={row.timestamp} className="border-b border-black/5 dark:border-white/10">
              <td className="py-1.5 pr-4 opacity-60">{i + 1}</td>
              {results.map(({ tz, result }) => (
                <td key={tz} className="py-1.5 pr-4 font-mono">
                  {result.ok ? result.executions[i]?.local : "-"}
                </td>
              ))}
              <td className="py-1.5 opacity-70">{relativeTime(row.timestamp, now, locale)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
