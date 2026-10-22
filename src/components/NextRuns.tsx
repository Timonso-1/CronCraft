"use client";

import { formatLocal, nextExecutions } from "@/lib/cron/schedule";
import type { Locale, Messages } from "@/lib/i18n";
import { relativeTime } from "@/lib/relative";
import { useMemo } from "react";
import { Card } from "./Card";
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
  return new Intl.DateTimeFormat(locale, { timeZone: "UTC", weekday: "long", day: "numeric", month: "long" }).format(
    new Date(Date.UTC(y, m - 1, d)),
  );
}

function shortDate(date: string, locale: Locale) {
  const [y, m, d] = date.split("-").map(Number);
  return new Intl.DateTimeFormat(locale, { timeZone: "UTC", day: "numeric", month: "numeric" }).format(
    new Date(Date.UTC(y, m - 1, d)),
  );
}

function shortZone(tz: string) {
  return tz.split("/").pop()!.replace(/_/g, " ");
}

export function NextRuns(props: Props) {
  const { expression, timezones, onTimezonesChange, count, onCountChange, now, locale, t } = props;
  const [primary, ...others] = timezones;

  // Der Ausdruck läuft in der ersten Zeitzone; weitere Zonen zeigen denselben Zeitpunkt umgerechnet.
  const main = useMemo(
    () => nextExecutions(expression, { timezone: primary, count, from: new Date(now) }),
    [expression, primary, count, now],
  );

  const today = formatLocal(now, primary).slice(0, 10);
  const tomorrow = formatLocal(now + 86_400_000, primary).slice(0, 10);
  const showSeconds = expression.trim().split(/\s+/).length === 6;
  const time = (local: string) => local.slice(11, showSeconds ? 19 : 16);

  const groups = useMemo(() => {
    if (!main.ok) return [];
    const map = new Map<string, { local: string; ts: number; first: boolean }[]>();
    main.executions.forEach((e, i) => {
      const date = e.local.slice(0, 10);
      if (!map.has(date)) map.set(date, []);
      map.get(date)!.push({ local: e.local, ts: e.timestamp, first: i === 0 });
    });
    return [...map.entries()];
  }, [main]);

  const setZone = (i: number, tz: string) => onTimezonesChange(timezones.map((z, j) => (j === i ? tz : z)));
  const addZone = () => {
    const candidates = ["UTC", "Europe/Berlin", "America/New_York", "Asia/Tokyo"];
    onTimezonesChange([...timezones, candidates.find((c) => !timezones.includes(c)) ?? "UTC"]);
  };

  return (
    <Card
      id="runs"
      title={t.nextRuns}
      subtitle={t.runsSub}
      bodyClassName=""
      action={
        <label className="flex items-center gap-2 text-sm text-ink-soft">
          {t.count}
          <select
            value={count}
            onChange={(e) => onCountChange(Number(e.target.value))}
            className="rounded-lg border border-rule bg-paper px-2 py-1 text-ink outline-none"
          >
            {[5, 10, 20, 50].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </label>
      }
    >
      <div className="space-y-2 border-b border-rule p-5">
        <p className="text-xs font-medium tracking-wider text-ink-soft uppercase">{t.timezone}</p>
        <TimezoneSelect value={primary} onChange={(v) => setZone(0, v)} label={t.timezone} className="w-full" />
        {others.length > 0 && <p className="pt-2 text-xs font-medium tracking-wider text-ink-soft uppercase">{t.compareWith}</p>}
        {others.map((tz, i) => (
          <div key={i} className="flex gap-2">
            <TimezoneSelect value={tz} onChange={(v) => setZone(i + 1, v)} label={t.timezone} className="w-full" />
            <button
              type="button"
              aria-label={`${t.remove}: ${tz}`}
              onClick={() => onTimezonesChange(timezones.filter((_, j) => j !== i + 1))}
              className="rounded-lg border border-rule px-3 text-ink-soft hover:border-danger/60 hover:text-danger"
            >
              <svg viewBox="0 0 16 16" width="14" height="14" aria-hidden>
                <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </button>
          </div>
        ))}
        {timezones.length < MAX_ZONES && (
          <button type="button" onClick={addZone} className="pt-1 text-sm font-medium text-accent hover:underline">
            + {t.addZone}
          </button>
        )}
      </div>

      {!main.ok && <p className="p-5 text-sm text-ink-soft">{t.invalidHelp}</p>}
      {main.ok && main.executions.length === 0 && <p className="p-5 text-sm text-ink-soft">{t.noRunsList}</p>}

      {groups.length > 0 && (
        <ol className="max-h-[560px] overflow-y-auto py-2">
          {groups.map(([date, runs]) => (
            <li key={date}>
              <h3 className="px-5 pt-3 pb-1 text-xs font-medium tracking-wider text-ink-soft uppercase">
                {dayLabel(date, today, tomorrow, locale, t)}
              </h3>
              <ul>
                {runs.map((r) => (
                  <li
                    key={r.ts}
                    className={`mx-2 flex flex-wrap items-center gap-x-3 gap-y-0.5 rounded-lg px-3 py-2 ${
                      r.first ? "bg-accent/10" : "hover:bg-sheet-2"
                    }`}
                  >
                    <span className={`font-mono text-[15px] tabular-nums ${r.first ? "text-accent" : ""}`}>{time(r.local)}</span>
                    {r.first && (
                      <span className="rounded-md border border-accent/30 px-1.5 py-0.5 text-[11px] font-medium text-accent">
                        {t.nextRun}
                      </span>
                    )}
                    {others.map((tz, j) => {
                      const local = formatLocal(r.ts, tz);
                      return (
                        <span key={tz + j} className="text-xs text-ink-soft">
                          {shortZone(tz)} <span className="font-mono tabular-nums text-ink">{time(local)}</span>
                          {local.slice(0, 10) !== date && <span className="ml-1">({shortDate(local.slice(0, 10), locale)})</span>}
                        </span>
                      );
                    })}
                    <span className="ml-auto text-xs text-ink-soft">{relativeTime(r.ts, now, locale)}</span>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      )}
    </Card>
  );
}
