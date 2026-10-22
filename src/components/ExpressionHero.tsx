"use client";

import type { FieldKey } from "@/lib/cron/builder";
import { tokenizeExpression } from "@/lib/cron/tokens";
import { fieldStyle } from "@/lib/fieldColor";
import type { Messages } from "@/lib/i18n";
import { useMemo, useRef, useState } from "react";

interface Props {
  expression: string;
  onChange: (value: string) => void;
  description: { ok: boolean; text: string };
  activeField: FieldKey;
  t: Messages;
}

/** Großes Eingabefeld, in dem jedes Cron-Feld in seiner Farbe erscheint. */
export function ExpressionHero({ expression, onChange, description, activeField, t }: Props) {
  const tokens = useMemo(() => tokenizeExpression(expression), [expression]);
  const backdrop = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);
  const editable = tokens.filter((tk) => tk.field).length === 5;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(expression.trim());
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch {
      /* Zwischenablage nicht verfügbar */
    }
  };

  const textBox = "px-5 py-5 font-mono text-[clamp(1.6rem,5vw,2.75rem)] leading-none tracking-tight";

  return (
    <div className="space-y-3">
      <label htmlFor="expr" className="sr-only">
        {t.expression}
      </label>
      <div
        className={`relative rounded-xl border bg-sheet transition-colors focus-within:border-accent/70 ${
          description.ok ? "border-rule" : "border-danger/70"
        }`}
      >
        <div ref={backdrop} aria-hidden className={`pointer-events-none absolute inset-0 overflow-hidden whitespace-pre pr-32 ${textBox}`}>
          {tokens.map((tk, i) => (
            <span
              key={i}
              style={fieldStyle(tk.field)}
              className={`text-(--c) ${
                editable && tk.field === activeField ? "underline decoration-2 underline-offset-8" : ""
              }`}
            >
              {tk.text}
            </span>
          ))}
        </div>
        <input
          id="expr"
          value={expression}
          onChange={(e) => onChange(e.target.value)}
          onScroll={(e) => {
            if (backdrop.current) backdrop.current.scrollLeft = e.currentTarget.scrollLeft;
          }}
          spellCheck={false}
          autoComplete="off"
          aria-invalid={!description.ok}
          aria-describedby="expr-meaning"
          className={`relative block w-full bg-transparent pr-32 text-transparent caret-ink outline-none ${textBox}`}
        />
        <button
          type="button"
          onClick={copy}
          className="absolute top-1/2 right-4 -translate-y-1/2 rounded-lg bg-accent px-3.5 py-2 text-sm font-semibold text-black hover:brightness-110"
        >
          {copied ? t.copied : t.copy}
        </button>
      </div>

      <div id="expr-meaning" aria-live="polite" className="flex flex-wrap items-baseline gap-x-3 gap-y-1 px-1">
        {description.ok ? (
          <p className="text-xl font-medium tracking-tight">{description.text}</p>
        ) : (
          <>
            <p className="text-xl font-medium tracking-tight text-danger">{t.invalid}</p>
            <p className="text-sm text-ink-soft">
              {description.text}. {t.invalidHelp}
            </p>
          </>
        )}
      </div>
    </div>
  );
}
