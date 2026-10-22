"use client";

import type { FieldKey } from "@/lib/cron/builder";
import { tokenizeExpression } from "@/lib/cron/tokens";
import { fieldStyle } from "@/lib/fieldColor";
import type { Messages } from "@/lib/i18n";

interface Props {
  expression: string;
  activeField: FieldKey;
  onSelectField: (field: FieldKey) => void;
  t: Messages;
}

/** Erklärt jedes Feld des aktuellen Ausdrucks: Name, Wertebereich, aktueller Wert. */
export function FieldLegend({ expression, activeField, onSelectField, t }: Props) {
  const fields = tokenizeExpression(expression).filter((tk) => tk.field);
  if (fields.length === 0) return null;
  const editable = fields.length === 5;

  return (
    <div>
      <p className="mb-2 text-xs font-medium tracking-wider text-ink-soft uppercase">{t.legendLabel}</p>
      <ol className={`grid gap-2 ${fields.length === 6 ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-6" : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-5"}`}>
        {fields.map((tk, i) => {
          const field = tk.field!;
          const selectable = editable && field !== "second";
          const active = selectable && field === activeField;
          return (
            <li key={i} style={fieldStyle(field)}>
              <button
                type="button"
                disabled={!selectable}
                aria-pressed={active}
                onClick={() => selectable && onSelectField(field as FieldKey)}
                className={`h-full w-full rounded-lg border border-t-2 px-3 py-2.5 text-left transition-colors disabled:cursor-default ${
                  active ? "border-(--c)/50 border-t-(--c) bg-(--c)/10" : "border-rule border-t-(--c) bg-sheet hover:bg-sheet-2"
                }`}
              >
                <span className="flex items-baseline justify-between gap-2">
                  <span className="text-sm font-medium">{t[field]}</span>
                  <span className="font-mono text-[11px] text-ink-soft">{t.fieldRange[field]}</span>
                </span>
                <span className="mt-1 block truncate font-mono text-base text-(--c)">{tk.text}</span>
                <span className="mt-0.5 block text-xs text-ink-soft">{t.fieldHelp[field]}</span>
              </button>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
