"use client";

import { Builder } from "@/components/Builder";
import { ExpressionHero } from "@/components/ExpressionHero";
import { NextRuns } from "@/components/NextRuns";
import { WeekGrid } from "@/components/WeekGrid";
import { expressionToFields, fieldsToExpression, type FieldKey } from "@/lib/cron/builder";
import { describeCron } from "@/lib/cron/describe";
import { PRESETS } from "@/lib/cron/presets";
import { isValidTimezone } from "@/lib/cron/schedule";
import { getMessages, type Locale } from "@/lib/i18n";
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

  return (
    <div className="mx-auto max-w-6xl px-4 pt-6 pb-20 sm:px-8">
      <header className="mb-10 flex items-center justify-between gap-4">
        <p className="text-lg">
          <span className="font-bold tracking-tight">{t.title}</span>
          <span className="hidden text-ink-soft sm:inline"> {t.subtitle}</span>
        </p>
        <div role="group" aria-label={t.language} className="inline-flex rounded-[10px] bg-sheet p-1">
          {(["de", "en"] as const).map((l) => (
            <button
              key={l}
              type="button"
              aria-pressed={locale === l}
              onClick={() => setLocale(l)}
              className={`rounded-[7px] px-3 py-1 text-sm font-medium ${
                locale === l ? "bg-ink text-paper" : "text-ink-soft hover:text-ink"
              }`}
            >
              {l === "de" ? "Deutsch" : "English"}
            </button>
          ))}
        </div>
      </header>

      <main className="space-y-14">
        <h1 className="sr-only">
          {t.title}: {t.subtitle}
        </h1>

        <ExpressionHero
          expression={expression}
          onChange={setExpression}
          description={description}
          activeField={activeField}
          t={t}
        />

        <nav aria-label={t.presets} className="-mt-8">
          <ul className="flex flex-wrap gap-2">
            {PRESETS.map((p) => {
              const active = p.expression === expression.trim();
              return (
                <li key={p.id}>
                  <button
                    type="button"
                    aria-pressed={active}
                    onClick={() => setExpression(p.expression)}
                    className={`rounded-full px-3.5 py-1.5 text-sm transition-colors ${
                      active ? "bg-ink text-paper" : "bg-sheet text-ink hover:bg-rule"
                    }`}
                  >
                    {p.label[locale]}
                  </button>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="grid gap-14 lg:grid-cols-12 lg:gap-10">
          <div className="min-w-0 space-y-14 lg:col-span-7">
            <Builder
              fields={fields}
              onChange={(f) => setExpression(fieldsToExpression(f))}
              active={activeField}
              onActiveChange={setActiveField}
              t={t}
            />
            {description.ok && <WeekGrid expression={expression} timezone={timezones[0]} now={now} t={t} />}
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
    </div>
  );
}
