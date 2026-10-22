"use client";

import type { Locale, Messages } from "@/lib/i18n";
import { useEffect, useState } from "react";

interface Props {
  timezone: string;
  locale: Locale;
  t: Messages;
}

const REPO = "https://github.com/Timonso-1/CronCraft";

function LiveClock({ timezone, locale }: { timezone: string; locale: Locale }) {
  const [now, setNow] = useState<number | null>(null);
  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);
  if (now === null) return <span className="font-mono">--:--:--</span>;
  return (
    <time dateTime={new Date(now).toISOString()} className="font-mono tabular-nums">
      {new Intl.DateTimeFormat(locale, {
        timeZone: timezone,
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hourCycle: "h23",
      }).format(new Date(now))}
    </time>
  );
}

export function Footer({ timezone, locale, t }: Props) {
  const [shared, setShared] = useState(false);

  const share = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setShared(true);
      setTimeout(() => setShared(false), 1600);
    } catch {
      /* Zwischenablage nicht verfügbar */
    }
  };

  const toolLinks = [
    { href: "#step-1", label: t.step1Title },
    { href: "#step-2", label: t.step2Title },
    { href: "#step-3", label: t.step3Title },
    { href: "#syntax", label: t.syntaxTitle },
  ];
  const projectLinks = [
    { href: REPO, label: t.footerSource },
    { href: `${REPO}/issues`, label: t.footerIssues },
  ];

  return (
    <footer className="relative mt-24 overflow-hidden border-t border-rule bg-sheet">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-accent/60 to-transparent"
      />
      <div className="mx-auto grid max-w-7xl gap-10 px-4 pt-12 pb-8 sm:px-6 md:grid-cols-12">
        <div className="space-y-4 md:col-span-6">
          <div className="flex items-center gap-2.5">
            <span className="grid size-8 place-items-center rounded-lg border border-rule bg-paper">
              <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <circle cx="12" cy="12" r="8.5" className="text-ink-soft" />
                <path d="M12 7.5V12l3 2" className="text-accent" />
              </svg>
            </span>
            <span className="font-semibold">{t.title}</span>
          </div>
          <p className="max-w-md text-sm text-ink-soft">{t.footerTagline}</p>
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={share}
              className="rounded-lg border border-rule bg-paper px-3 py-2 text-sm hover:border-accent/40 hover:text-accent"
            >
              {shared ? t.footerShared : t.footerShare}
            </button>
            <span className="inline-flex items-center gap-2 rounded-lg border border-rule bg-paper px-3 py-2 text-sm text-ink-soft">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-accent opacity-60 motion-reduce:hidden" />
                <span className="relative inline-flex size-2 rounded-full bg-accent" />
              </span>
              {t.footerClock} {timezone.replace(/_/g, " ")}
              <span className="text-ink">
                <LiveClock timezone={timezone} locale={locale} />
              </span>
            </span>
          </div>
        </div>

        <nav aria-label={t.footerTool} className="md:col-span-3">
          <p className="mb-3 text-xs font-medium tracking-wider text-ink-soft uppercase">{t.footerTool}</p>
          <ul className="space-y-2 text-sm">
            {toolLinks.map((l) => (
              <li key={l.href}>
                <a href={l.href} className="text-ink-soft hover:text-ink">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <nav aria-label={t.footerProject} className="md:col-span-3">
          <p className="mb-3 text-xs font-medium tracking-wider text-ink-soft uppercase">{t.footerProject}</p>
          <ul className="space-y-2 text-sm">
            {projectLinks.map((l) => (
              <li key={l.href}>
                <a href={l.href} target="_blank" rel="noreferrer" className="text-ink-soft hover:text-ink">
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <p
        aria-hidden
        className="pointer-events-none mx-auto max-w-7xl px-4 font-mono text-[clamp(2.5rem,11vw,9rem)] leading-[0.8] font-semibold tracking-tighter whitespace-nowrap text-transparent select-none sm:px-6"
        style={{ WebkitTextStroke: "1px var(--rule)" }}
      >
        */5 * * * *
      </p>

      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2 border-t border-rule px-4 py-5 text-xs text-ink-soft sm:px-6">
        <span suppressHydrationWarning>© {new Date().getFullYear()} {t.title}</span>
        <span>
          {t.footerMadeBy}{" "}
          <a href="https://github.com/Timonso-1" target="_blank" rel="noreferrer" className="text-ink hover:text-accent">
            Timonso
          </a>
        </span>
      </div>
    </footer>
  );
}
