"use client";

import { Builder } from "@/components/Builder";
import { ExpressionHero } from "@/components/ExpressionHero";
import { NextRuns } from "@/components/NextRuns";
import { Stats } from "@/components/Stats";
import { TopBar } from "@/components/TopBar";
import { WeekGrid } from "@/components/WeekGrid";
import { expressionToFields, fieldsToExpression, type FieldKey } from "@/lib/cron/builder";
import { describeCron } from "@/lib/cron/describe";
import { PRESETS } from "@/lib/cron/presets";
import { isValidTimezone, nextExecutions } from "@/lib/cron/schedule";
import { weekGrid } from "@/lib/cron/week";
import { formatDuration } from "@/lib/duration";
import { getMessages, type Locale } from "@/lib/i18n";
import { relativeTime } from "@/lib/relative";
import { useEffect, useMemo, useState } from "react";

const DEFAULT_EXPRESSION = "0 9 * * 1-5";

export function CronCraft() {
  const [locale, setLocale] = useState<Locale>("de");
  const [expression, setExpression] = useState(DEFAULT_EXPRESSION);
  const [timezones, setTimezones] = useState<string[]>(["UTC"]);
  const [count, setCount] = useState(10);
  const [activeField, setActiveField] = useState<FieldKey>("hour");
  const [now, setNow] = useState(() => Date.now());
  const [ready, setReady] = useState(false);
  const t = getMessages(locale);
  const primary = timezones[0];

  // Initialwerte aus URL bzw. Browser-Zeitzone laden
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const e = params.get("e");
    const tzs = params.get("tz")?.split(",").filter(isValidTimezone).slice(0, 4);
    const l = params.get("lang");
    const browserTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (e) setExpression(e);
    if (l === "de" || l === "en") setLocale(l);
    setTimezones(tzs?.length ? tzs : [isValidTimezone(browserTz) ? browserTz : "UTC"]);
    setNow(Date.now());
    setReady(true);
  }, []);

  // Zustand in die URL schreiben (teilbarer Link)
  useEffect(() => {
    if (!ready) return;
    const params = new URLSearchParams({ e: expression, tz: timezones.join(","), lang: locale });
    window.history.replaceState(null, "", `?${params.toString()}`);
    document.documentElement.lang = locale;
  }, [ready, expression, timezones, locale]);

  // Zeitbezug regelmäßig aktualisieren
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 30_000);
    return () => clearInterval(id);
  }, []);

  const description = useMemo(() => {
    try {
      return { ok: true, text: describeCron(expression, locale) };
    } catch (e) {
      return { ok: false, text: (e instanceof Error ? e.message : String(e)).replace(/^Error:\s*/, "") };
    }
  }, [expression, locale]);

  const fields = useMemo(() => expressionToFields(expression), [expression]);
  const minute = Math.floor(now / 60_000);

  const grid = useMemo(() => {
    try {
      return weekGrid(expression, primary, new Date(minute * 60_000));
    } catch {
      return null;
    }
  }, [expression, primary, minute]);

  const stats = useMemo(() => {
    const next = nextExecutions(expression, { timezone: primary, count: 2, from: new Date(now) });
    const runs = next.ok ? next.executions : [];
    const sum = (hours: number[]) => hours.reduce((a, h) => a + Math.max(0, h), 0);
    const fmt = (n: number) => new Intl.NumberFormat(locale).format(n);
    return [
      {
        label: t.statNext,
        value: runs[0] ? relativeTime(runs[0].timestamp, now, locale) : t.statNone,
        hint: runs[0]
          ? new Intl.DateTimeFormat(locale, {
              timeZone: primary,
              weekday: "short",
              day: "numeric",
              month: "short",
              hour: "2-digit",
              minute: "2-digit",
            }).format(new Date(runs[0].timestamp))
          : undefined,
        accent: Boolean(runs[0]),
      },
      { label: t.statToday, value: grid ? fmt(sum(grid[0].hours)) : "-" },
      { label: t.statWeek, value: grid ? fmt(grid.reduce((a, d) => a + sum(d.hours), 0)) : "-", hint: primary },
      { label: t.statGap, value: runs.length === 2 ? formatDuration(runs[1].timestamp - runs[0].timestamp, locale) : "-" },
    ];
  }, [expression, primary, now, locale, grid, t]);

  const today = new Intl.DateTimeFormat(locale, {
    timeZone: primary,
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(now));

  return (
    <>
      <TopBar locale={locale} onLocaleChange={setLocale} t={t} />

      <main className="mx-auto max-w-7xl space-y-8 px-4 pt-8 pb-20 sm:px-6">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              <span className="text-ink-soft">{t.headlineA}</span> {t.headlineB}
            </h1>
            <p className="mt-1 text-sm text-ink-soft">{t.lead}</p>
          </div>
          <p suppressHydrationWarning className="text-xs font-medium tracking-[0.12em] text-ink-soft uppercase">
            {ready ? today : ""}
          </p>
        </div>

        <ExpressionHero expression={expression} onChange={setExpression} description={description} activeField={activeField} t={t} />

        <nav aria-label={t.presets} className="-mt-2">
          <ul className="flex flex-wrap gap-2">
            {PRESETS.map((p) => {
              const active = p.expression === expression.trim();
              return (
                <li key={p.id}>
                  <button
                    type="button"
                    aria-pressed={active}
                    onClick={() => setExpression(p.expression)}
                    className={`rounded-lg border px-3 py-1.5 text-sm transition-colors ${
                      active
                        ? "border-accent/40 bg-accent/10 text-accent"
                        : "border-rule bg-sheet text-ink-soft hover:border-ink-soft/40 hover:text-ink"
                    }`}
                  >
                    {p.label[locale]}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        {description.ok && <Stats items={stats} />}

        <div className="grid gap-6 lg:grid-cols-12">
          <div className="min-w-0 space-y-6 lg:col-span-7">
            <Builder
              fields={fields}
              onChange={(f) => setExpression(fieldsToExpression(f))}
              active={activeField}
              onActiveChange={setActiveField}
              t={t}
            />
            {description.ok && grid && <WeekGrid grid={grid} timezone={primary} t={t} />}
          </div>
          <div className="min-w-0 lg:col-span-5">
            <NextRuns
              expression={expression}
              timezones={timezones}
              onTimezonesChange={setTimezones}
              count={count}
              onCountChange={setCount}
              now={now}
              locale={locale}
              t={t}
            />
          </div>
        </div>
      </main>
    </>
  );
}
