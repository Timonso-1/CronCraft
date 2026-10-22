"use client";

import { formatLocal, nextExecutions } from "@/lib/cron/schedule";
import type { Locale, Messages } from "@/lib/i18n";
import { relativeTime } from "@/lib/relative";
import { useMemo } from "react";
import { TimezoneSelect } from "./TimezoneSelect";

interface Props {
  expression: string;
  timezones: string[];
  onTimezonesChange: (tzs: string[]) => void;
  count: number;
  onCountChange: (n: number) => void;
  now: number;
  locale: Locale;
  t: Messages;
}

const MAX_ZONES = 4;

function dayLabel(date: string, today: string, tomorrow: string, locale: Locale, t: Messages) {
  if (date === today) return t.today;
  if (date === tomorrow) return t.tomorrow;
  const [y, m, d] = date.split("-").map(Number);
  return new Intl.DateTimeFormat(locale, {
    timeZone: "UTC",
    weekday: "long",
    day: "numeric",
    month: "long",
  }).format(new Date(Date.UTC(y, m - 1, d)));
}

function shortZone(tz: string) {
  return tz.split("/").pop()!.replace(/_/g, " ");
}

export function NextRuns(props: Props) {
  const { expression, timezones, onTimezonesChange, count, onCountChange, now, locale, t } = props;
  const [primary, ...others] = timezones;

  const results = useMemo(
    () => timezones.map((tz) => nextExecutions(expression, { timezone: tz, count, from: new Date(now) })),
    [expression, timezones, count, now],
  );

  const main = results[0];
  const today = formatLocal(now, primary).slice(0, 10);
  const tomorrow = formatLocal(now + 86_400_000, primary).slice(0, 10);

  const groups = useMemo(() => {
    if (!main?.ok) return [];
    const map = new Map<string, { index: number; time: string; ts: number }[]>();
    main.executions.forEach((e, index) => {
      const date = e.local.slice(0, 10);
      if (!map.has(date)) map.set(date, []);
      map.get(date)!.push({ index, time: e.local.slice(11, 16), ts: e.timestamp });
    });
    return [...map.entries()];
  }, [main]);

  const showSeconds = expression.trim().split(/\s+/).length === 6;
  const time = (local: string) => local.slice(11, showSeconds ? 19 : 16);

  const setZone = (i: number, tz: string) => onTimezonesChange(timezones.map((z, j) => (j === i ? tz : z)));
  const addZone = () => {
    const candidates = ["UTC", "Europe/Berlin", "America/New_York", "Asia/Tokyo"];
    onTimezonesChange([...timezones, candidates.find((c) => !timezones.includes(c)) ?? "UTC"]);
  };

  const first = main?.ok ? main.executions[0] : undefined;

  return (
    <section aria-labelledby="runs-title" className="space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h2 id="runs-title" className="text-xl font-semibold tracking-tight">
          {t.nextRuns}
        </h2>
        <label className="flex items-center gap-2 text-sm text-ink-soft">
          {t.count}
          <select
            value={count}
            onChange={(e) => onCountChange(Number(e.target.value))}
            className="rounded-[10px] border border-rule bg-paper px-2 py-1.5 text-ink"
          >
            {[5, 10, 20, 50].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="space-y-2">
        <TimezoneSelect value={primary} onChange={(v) => setZone(0, v)} label={t.timezone} className="w-full" />
        {others.map((tz, i) => (
          <div key={i} className="flex gap-2">
            <TimezoneSelect value={tz} onChange={(v) => setZone(i + 1, v)} label={t.timezone} className="w-full" />
            <button
              type="button"
              aria-label={`${t.remove}: ${tz}`}
              onClick={() => onTimezonesChange(timezones.filter((_, j) => j !== i + 1))}
              className="rounded-[10px] border border-rule px-3 text-ink-soft hover:border-danger hover:text-danger"
            >
              <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden>
                <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        ))}
        {timezones.length < MAX_ZONES && (
          <button type="button" onClick={addZone} className="text-sm font-medium text-ink-soft underline underline-offset-4 hover:text-ink">
            {t.addZone}
          </button>
        )}
      </div>

      {main && !main.ok && <p className="text-ink-soft">{t.invalidHelp}</p>}
      {main?.ok && main.executions.length === 0 && <p className="text-ink-soft">{t.noRunsList}</p>}

      {first && (
        <div className="rounded-[16px] bg-ink p-5 text-paper">
          <p className="text-sm opacity-75">{t.nextRun}</p>
          <p className="mt-1 font-mono text-3xl tracking-tight tabular-nums">{time(first.local)}</p>
          <p className="mt-1 text-sm opacity-75">
            {dayLabel(first.local.slice(0, 10), today, tomorrow, locale, t)}, {relativeTime(first.timestamp, now, locale)}
          </p>
        </div>
      )}

      {groups.length > 0 && (
        <ol className="space-y-4">
          {groups.map(([date, runs]) => (
            <li key={date}>
              <h3 className="mb-1 text-sm font-semibold text-ink-soft">{dayLabel(date, today, tomorrow, locale, t)}</h3>
              <ul className="divide-y divide-rule border-y border-rule">
                {runs.map((r) => (
                  <li key={r.ts} className="flex flex-wrap items-baseline gap-x-4 gap-y-0.5 py-2">
                    <span className="font-mono text-base tabular-nums">{time(main!.ok ? main.executions[r.index].local : "")}</span>
                    {others.map((tz, j) => {
                      const res = results[j + 1];
                      const local = res?.ok ? res.executions[r.index]?.local : undefined;
                      return (
                        <span key={tz + j} className="text-sm text-ink-soft">
                          {shortZone(tz)} <span className="font-mono tabular-nums text-ink">{local ? time(local) : "-"}</span>
                          {local && local.slice(0, 10) !== date && (
                            <span className="ml-1 text-xs">({local.slice(8, 10)}.{local.slice(5, 7)}.)</span>
                          )}
                        </span>
                      );
                    })}
                    <span className="ml-auto text-sm text-ink-soft">{relativeTime(r.ts, now, locale)}</span>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      )}
    </section>
  );
}
