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
  onSelectField: (field: FieldKey) => void;
  t: Messages;
}

/** Großes Eingabefeld, in dem jedes Cron-Feld in seiner Farbe erscheint. */
export function ExpressionHero({
  expression,
  onChange,
  description,
  activeField,
  onSelectField,
  t,
}: Props) {
  const tokens = useMemo(() => tokenizeExpression(expression), [expression]);
  const backdrop = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);
  const fieldTokens = tokens.filter((tk) => tk.field);
  const editable = fieldTokens.length === 5;

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(expression.trim());
      setCopied(true);
      setTimeout(() => setCopied(false), 1400);
    } catch {
      /* Zwischenablage nicht verfügbar */
    }
  };

  const inputText =
    "px-5 py-4 font-mono text-[clamp(1.75rem,6vw,3.5rem)] leading-none tracking-tight sm:px-7 sm:py-6";

  return (
    <section aria-labelledby="expr-label" className="space-y-5">
      <div className="flex items-baseline justify-between gap-4">
        <label id="expr-label" htmlFor="expr" className="text-sm font-semibold">
          {t.expression}
        </label>
        <span className="hidden text-sm text-ink-soft sm:inline">{t.expressionHint}</span>
      </div>

      <div
        className={`relative rounded-[20px] border-2 bg-sheet transition-colors ${
          description.ok ? "border-ink/80" : "border-danger"
        }`}
      >
        <div
          ref={backdrop}
          aria-hidden
          className={`pointer-events-none absolute inset-0 overflow-hidden whitespace-pre pr-32 ${inputText}`}
        >
          {tokens.map((tk, i) => (
            <span
              key={i}
              style={fieldStyle(tk.field)}
              className={`text-(--c) ${tk.field && tk.field === activeField && editable ? "underline decoration-4 underline-offset-[10px]" : ""}`}
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
          className={`relative block w-full bg-transparent pr-32 text-transparent caret-ink outline-none ${inputText}`}
        />
        <button
          type="button"
          onClick={copy}
          className="absolute top-1/2 right-3 -translate-y-1/2 rounded-[10px] bg-ink px-4 py-2 text-sm font-semibold text-paper hover:opacity-90 sm:right-5"
        >
          {copied ? t.copied : t.copy}
        </button>
      </div>

      {fieldTokens.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {fieldTokens.map((tk, i) => {
            const field = tk.field!;
            const selectable = editable && field !== "second";
            const active = selectable && field === activeField;
            return (
              <button
                key={i}
                type="button"
                disabled={!selectable}
                aria-pressed={active}
                onClick={() => selectable && onSelectField(field as FieldKey)}
                style={fieldStyle(field)}
                className={`flex min-w-24 flex-col items-start rounded-[10px] border-l-4 border-(--c) px-3 py-1.5 text-left transition-colors ${
                  active ? "bg-(--c)/15" : "bg-sheet hover:bg-(--c)/10"
                } disabled:cursor-default`}
              >
                <span className="text-xs font-medium text-ink-soft">{t[field]}</span>
                <span className="font-mono text-sm text-(--c)">{tk.text}</span>
              </button>
            );
          })}
        </div>
      )}

      <p
        id="expr-meaning"
        aria-live="polite"
        className={`max-w-[40ch] text-[clamp(1.4rem,3vw,2.1rem)] leading-tight font-semibold tracking-tight text-balance ${
          description.ok ? "" : "text-danger"
        }`}
      >
        {description.ok ? description.text : t.invalid}
      </p>
      {!description.ok && (
        <p className="-mt-3 text-sm text-ink-soft">
          {description.text}. {t.invalidHelp}
        </p>
      )}
    </section>
  );
}
