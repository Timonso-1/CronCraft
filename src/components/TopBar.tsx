"use client";

import type { Locale, Messages } from "@/lib/i18n";

interface Props {
  locale: Locale;
  onLocaleChange: (l: Locale) => void;
  t: Messages;
}

export function TopBar({ locale, onLocaleChange, t }: Props) {
  const links = [
    { href: "#editor", label: t.navEditor },
    { href: "#runs", label: t.navRuns },
    { href: "#week", label: t.navWeek },
  ];
  return (
    <header className="sticky top-0 z-20 border-b border-rule bg-paper/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-7xl items-center gap-6 px-4 sm:px-6">
        <a href="#" className="flex items-center gap-2.5">
          <span className="grid size-8 place-items-center rounded-lg border border-rule bg-sheet">
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <circle cx="12" cy="12" r="8.5" className="text-ink-soft" />
              <path d="M12 7.5V12l3 2" className="text-accent" />
            </svg>
          </span>
          <span className="font-semibold">{t.title}</span>
        </a>

        <nav aria-label="Navigation" className="hidden items-center gap-5 text-sm text-ink-soft md:flex">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="hover:text-ink">
              {l.label}
            </a>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-2">
          <div role="group" aria-label={t.language} className="inline-flex rounded-lg border border-rule bg-sheet p-0.5">
            {(["de", "en"] as const).map((l) => (
              <button
                key={l}
                type="button"
                aria-pressed={locale === l}
                onClick={() => onLocaleChange(l)}
                className={`rounded-md px-2.5 py-1 text-xs font-medium uppercase ${
                  locale === l ? "bg-sheet-2 text-ink shadow-[inset_0_0_0_1px_var(--rule)]" : "text-ink-soft hover:text-ink"
                }`}
              >
                {l}
              </button>
            ))}
          </div>
          <a
            href="https://github.com/Timonso-1/CronCraft"
            target="_blank"
            rel="noreferrer"
            aria-label={t.sourceCode}
            className="grid size-8 place-items-center rounded-lg border border-rule bg-sheet text-ink-soft hover:text-ink"
          >
            <svg viewBox="0 0 16 16" width="16" height="16" aria-hidden fill="currentColor">
              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
            </svg>
          </a>
        </div>
      </div>
    </header>
  );
}
