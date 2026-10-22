"use client";

import type { Messages } from "@/lib/i18n";
import { Card } from "./Card";

interface Props {
  onTry: (expression: string) => void;
  t: Messages;
}

const DIAGRAM_FIELDS = [
  { key: "minute", color: "var(--f-minute)" },
  { key: "hour", color: "var(--f-hour)" },
  { key: "dayOfMonth", color: "var(--f-dom)" },
  { key: "month", color: "var(--f-month)" },
  { key: "dayOfWeek", color: "var(--f-dow)" },
] as const;

/** Kurze Syntax-Referenz mit Aufbau-Diagramm und Beispielen zum Ausprobieren. */
export function SyntaxHelp({ onTry, t }: Props) {
  return (
    <Card id="syntax" title={t.syntaxTitle} subtitle={t.syntaxSub} bodyClassName="">
      <div className="overflow-x-auto border-b border-rule p-5">
        <pre className="font-mono text-[14px] leading-[1.25]" aria-label="* * * * *">
          {DIAGRAM_FIELDS.map((f, i) => (
            <span key={f.key} className="block">
              {DIAGRAM_FIELDS.slice(0, i).map((p) => (
                <span key={p.key} style={{ color: p.color }}>
                  {"│ "}
                </span>
              ))}
              <span style={{ color: f.color }}>{"┌" + "─".repeat((DIAGRAM_FIELDS.length - i) * 2 - 1)}</span>
              <span className="text-ink-soft">
                {" "}
                {t[f.key]} ({t.fieldRange[f.key]})
              </span>
            </span>
          ))}
          <span className="block">
            {DIAGRAM_FIELDS.map((f) => (
              <span key={f.key} style={{ color: f.color }} className="font-semibold">
                {"* "}
              </span>
            ))}
          </span>
        </pre>
      </div>

      <ul className="divide-y divide-rule">
        {t.syntaxChars.map((c) => (
          <li key={c.char} className="flex items-center gap-4 px-5 py-3">
            <span className="grid size-9 shrink-0 place-items-center rounded-lg border border-rule bg-paper font-mono text-lg text-accent">
              {c.char}
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium">{c.name}</p>
              <p className="truncate text-xs text-ink-soft">
                <code className="font-mono text-ink">{c.example}</code> = {c.meaning}
              </p>
            </div>
            <button
              type="button"
              onClick={() => onTry(c.example)}
              className="shrink-0 rounded-md border border-rule px-2.5 py-1 text-xs text-ink-soft hover:border-accent/40 hover:text-accent"
            >
              {t.syntaxTry}
            </button>
          </li>
        ))}
      </ul>
      <p className="border-t border-rule px-5 py-3 text-xs text-ink-soft">{t.syntaxNote}</p>
    </Card>
  );
}
