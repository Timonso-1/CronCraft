"use client";

import { FIELD_RANGES, type FieldKey, fieldToList, listToField } from "@/lib/cron/builder";
import type { Messages } from "@/lib/i18n";

export type Mode = "every" | "step" | "specific" | "custom";

export function detectMode(value: string): Mode {
  if (value === "*") return "every";
  if (/^\*\/\d+$/.test(value)) return "step";
  if (fieldToList(value) !== null) return "specific";
  return "custom";
}

interface Props {
  fieldKey: FieldKey;
  value: string;
  onChange: (value: string) => void;
  t: Messages;
}

const control =
  "rounded-lg border border-rule bg-paper px-3 py-2 font-mono text-sm text-ink focus:border-(--c) outline-none";

export function FieldEditor({ fieldKey, value, onChange, t }: Props) {
  const mode = detectMode(value);
  const { min, max } = FIELD_RANGES[fieldKey];
  const selected = fieldToList(value) ?? [];
  const values = Array.from({ length: max - min + 1 }, (_, i) => min + i);

  const labelFor = (n: number) =>
    fieldKey === "month" ? t.months[n - 1] : fieldKey === "dayOfWeek" ? t.weekdays[n] : String(n);

  const setMode = (m: Mode) => {
    if (m === mode) return;
    if (m === "every") onChange("*");
    else if (m === "step") onChange(fieldKey === "minute" ? "*/15" : "*/2");
    else if (m === "specific") onChange(String(min));
    else onChange(value === "*" ? `${min}-${max}` : value);
  };

  const toggle = (n: number) => {
    const next = selected.includes(n) ? selected.filter((x) => x !== n) : [...selected, n];
    onChange(listToField(next));
  };

  const modes: { id: Mode; label: string }[] = [
    { id: "every", label: t.every },
    { id: "step", label: t.everyN },
    { id: "specific", label: t.specific },
    { id: "custom", label: t.custom },
  ];

  const gridCols =
    fieldKey === "minute"
      ? "grid-cols-6 sm:grid-cols-10"
      : fieldKey === "hour"
        ? "grid-cols-6 sm:grid-cols-12"
        : fieldKey === "dayOfMonth"
          ? "grid-cols-7"
          : fieldKey === "month"
            ? "grid-cols-4 sm:grid-cols-6"
            : "grid-cols-7";

  return (
    <div className="space-y-4">
      <div role="radiogroup" aria-label={t[fieldKey]} className="inline-flex rounded-lg border border-rule bg-paper p-1">
        {modes.map((m) => (
          <button
            key={m.id}
            type="button"
            role="radio"
            aria-checked={mode === m.id}
            onClick={() => setMode(m.id)}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              mode === m.id ? "bg-sheet-2 text-ink shadow-[inset_0_0_0_1px_var(--rule)]" : "text-ink-soft hover:text-ink"
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      {mode === "every" && <p className="text-ink-soft">{t.everyText[fieldKey]}</p>}

      {mode === "step" && (
        <label className="flex items-center gap-3">
          <span>{t.step}</span>
          <input
            type="number"
            min={1}
            max={max}
            value={Number(value.slice(2))}
            onChange={(e) => onChange(`*/${Math.min(max, Math.max(1, Number(e.target.value) || 1))}`)}
            className={`${control} w-24`}
          />
          <span>{t.stepUnit[fieldKey]}</span>
        </label>
      )}

      {mode === "specific" && (
        <div className="space-y-2">
          <div className={`grid gap-1.5 ${gridCols}`}>
            {values.map((n) => {
              const on = selected.includes(n);
              return (
                <button
                  key={n}
                  type="button"
                  aria-pressed={on}
                  onClick={() => toggle(n)}
                  className={`rounded-md border py-2 text-sm tabular-nums transition-colors ${
                    on
                      ? "border-(--c)/60 bg-(--c)/15 font-semibold text-(--c)"
                      : "border-rule bg-paper text-ink-soft hover:border-(--c)/40 hover:text-ink"
                  }`}
                >
                  {labelFor(n)}
                </button>
              );
            })}
          </div>
          {selected.length > 0 && (
            <button
              type="button"
              onClick={() => onChange("*")}
              className="text-sm text-ink-soft underline underline-offset-4 hover:text-ink"
            >
              {t.clear}
            </button>
          )}
        </div>
      )}

      {mode === "custom" && (
        <div className="space-y-2">
          <input
            value={value}
            onChange={(e) => onChange(e.target.value.replace(/\s/g, ""))}
            aria-label={t[fieldKey]}
            spellCheck={false}
            className={`${control} w-full max-w-xs`}
          />
          <p className="text-sm text-ink-soft">{t.customHelp}</p>
        </div>
      )}
    </div>
  );
}
