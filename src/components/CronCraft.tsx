"use client";

import { Builder } from "@/components/Builder";
import { NextRuns } from "@/components/NextRuns";
import { TimezoneSelect } from "@/components/TimezoneSelect";
import { expressionToFields, fieldsToExpression } from "@/lib/cron/builder";
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
  const [now, setNow] = useState(() => Date.now());
  const [copied, setCopied] = useState(false);
  const [ready, setReady] = useState(false);
  const t = getMessages(locale);

  // Initialwerte aus URL bzw. Browser-Zeitzone laden
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const e = params.get("e");
    const tzs = params.get("tz")?.split(",").filter(isValidTimezone);
    const l = params.get("lang");
    const browserTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    if (e) setExpression(e);
    if (l === "de" || l === "en") setLocale(l);
    setTimezones(tzs?.length ? tzs : [isValidTimezone(browserTz) ? browserTz : "UTC"]);
    setReady(true);
  }, []);

  // Zustand in die URL schreiben (teilbarer Link)
  useEffect(() => {
    if (!ready) return;
    const params = new URLSearchParams({ e: expression, tz: timezones.join(","), lang: locale });
    window.history.replaceState(null, "", `?${params.toString()}`);
  }, [ready, expression, timezones, locale]);

  // Zeitbezug regelmäßig aktualisieren
  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 30_000);
    return () => clearInterval(id);
  }, []);

  const description = useMemo(() => {
    try {
      return { ok: true as const, text: describeCron(expression, locale) };
    } catch (e) {
      return { ok: false as const, text: (e instanceof Error ? e.message : String(e)).replace(/^Error:\s*/, "") };
    }
  }, [expression, locale]);

  const fields = useMemo(() => expressionToFields(expression), [expression]);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(expression);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* Zwischenablage nicht verfügbar */
    }
  };

  const setZone = (index: number, tz: string) =>
    setTimezones((zs) => zs.map((z, i) => (i === index ? tz : z)));

  return (
    <main className="mx-auto max-w-5xl space-y-8 px-4 py-10">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{t.title}</h1>
          <p className="mt-1 opacity-70">{t.subtitle}</p>
        </div>
        <div className="flex gap-1" role="group" aria-label={t.language}>
          {(["de", "en"] as const).map((l) => (
            <button
              key={l}
              type="button"
              aria-pressed={locale === l}
              onClick={() => setLocale(l)}
              className={`rounded-md px-3 py-1 text-sm uppercase ${
                locale === l
                  ? "bg-foreground text-background"
                  : "border border-black/15 dark:border-white/20"
              }`}
            >
              {l}
            </button>
          ))}
        </div>
      </header>

      <section className="space-y-3">
        <label htmlFor="expr" className="block text-sm font-medium">
          {t.expression}
        </label>
        <div className="flex gap-2">
          <input
            id="expr"
            value={expression}
            onChange={(e) => setExpression(e.target.value)}
            spellCheck={false}
            aria-invalid={!description.ok}
            className="w-full rounded-lg border border-black/15 bg-transparent px-3 py-2 font-mono text-lg dark:border-white/20"
          />
          <button
            type="button"
            onClick={copy}
            className="rounded-lg border border-black/15 px-4 text-sm dark:border-white/20"
          >
            {copied ? t.copied : t.copy}
          </button>
        </div>
        <p className="text-xs opacity-60">{t.expressionHint}</p>
        <div
          className={`rounded-lg p-3 text-sm ${
            description.ok
              ? "bg-black/5 dark:bg-white/10"
              : "bg-red-500/10 text-red-700 dark:text-red-300"
          }`}
          aria-live="polite"
        >
          <span className="font-medium">{description.ok ? t.meaning : t.invalid}: </span>
          {description.text}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">{t.presets}</h2>
        <div className="flex flex-wrap gap-2">
          {PRESETS.map((p) => (
            <button
              key={p.id}
              type="button"
              onClick={() => setExpression(p.expression)}
              className="rounded-full border border-black/15 px-3 py-1 text-sm hover:bg-black/5 dark:border-white/20 dark:hover:bg-white/10"
            >
              {p.label[locale]}
            </button>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">{t.builder}</h2>
        <Builder
          fields={fields}
          onChange={(f) => setExpression(fieldsToExpression(f))}
          t={t}
        />
      </section>

      <section className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-semibold">{t.nextRuns}</h2>
          <label className="flex items-center gap-2 text-sm">
            {t.count}
            <select
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
              className="rounded-md border border-black/15 bg-background px-2 py-1 dark:border-white/20"
            >
              {[5, 10, 20, 50].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </label>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {timezones.map((tz, i) => (
            <div key={i} className="flex items-center gap-1">
              <TimezoneSelect
                value={tz}
                onChange={(v) => setZone(i, v)}
                label={t.timezone}
              />
              {timezones.length > 1 && (
                <button
                  type="button"
                  aria-label={t.remove}
                  onClick={() => setTimezones((zs) => zs.filter((_, j) => j !== i))}
                  className="rounded-md border border-black/15 px-2 py-1 text-sm dark:border-white/20"
                >
                  x
                </button>
              )}
            </div>
          ))}
          {timezones.length < 4 && (
            <button
              type="button"
              onClick={() => setTimezones((zs) => [...zs, zs.includes("UTC") ? "Europe/Berlin" : "UTC"])}
              className="rounded-md border border-dashed border-black/25 px-3 py-1.5 text-sm dark:border-white/30"
            >
              + {t.addZone}
            </button>
          )}
        </div>

        <NextRuns
          expression={expression}
          timezones={timezones}
          count={count}
          now={now}
          locale={locale}
          t={t}
        />
      </section>
    </main>
  );
}
