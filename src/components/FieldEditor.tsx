"use client";

import { FIELD_RANGES, type FieldKey, fieldToList, listToField } from "@/lib/cron/builder";
import type { Messages } from "@/lib/i18n";

type Mode = "every" | "step" | "specific" | "custom";

function detectMode(value: string): Mode {
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

export function FieldEditor({ fieldKey, value, onChange, t }: Props) {
  const mode = detectMode(value);
  const { min, max } = FIELD_RANGES[fieldKey];
  const labelFor = (n: number): string => {
    if (fieldKey === "month") return t.months[n - 1];
    if (fieldKey === "dayOfWeek") return t.weekdays[n];
    return String(n);
  };
  const values: number[] = [];
  for (let i = min; i <= max; i++) values.push(i);
  const selected = fieldToList(value) ?? [];

  const setMode = (m: Mode) => {
    if (m === "every") onChange("*");
    else if (m === "step") onChange("*/5");
    else if (m === "specific") onChange(String(min));
    else onChange(value);
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

  return (
    <fieldset className="rounded-lg border border-black/10 p-3 dark:border-white/15">
      <legend className="px-1 text-sm font-medium">{t[fieldKey]}</legend>
      <div className="mb-2 flex flex-wrap gap-1" role="radiogroup" aria-label={t[fieldKey]}>
        {modes.map((m) => (
          <button
            key={m.id}
            type="button"
            role="radio"
            aria-checked={mode === m.id}
            onClick={() => setMode(m.id)}
            className={`rounded-md px-2 py-1 text-xs ${
              mode === m.id
                ? "bg-foreground text-background"
                : "border border-black/10 hover:bg-black/5 dark:border-white/15 dark:hover:bg-white/10"
            }`}
          >
            {m.label}
          </button>
        ))}
      </div>

      {mode === "step" && (
        <label className="flex items-center gap-2 text-sm">
          {t.step}
          <input
            type="number"
            min={1}
            max={max}
            value={Number(value.slice(2))}
            onChange={(e) => onChange(`*/${Math.max(1, Number(e.target.value) || 1)}`)}
            className="w-20 rounded-md border border-black/15 bg-transparent px-2 py-1 dark:border-white/20"
          />
        </label>
      )}

      {mode === "specific" && (
        <div className="flex flex-wrap gap-1">
          {values.map((n) => (
            <button
              key={n}
              type="button"
              aria-pressed={selected.includes(n)}
              onClick={() => toggle(n)}
              className={`min-w-8 rounded-md px-1.5 py-1 text-xs ${
                selected.includes(n)
                  ? "bg-foreground text-background"
                  : "border border-black/10 hover:bg-black/5 dark:border-white/15 dark:hover:bg-white/10"
              }`}
            >
              {labelFor(n)}
            </button>
          ))}
        </div>
      )}

      {mode === "custom" && (
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-md border border-black/15 bg-transparent px-2 py-1 font-mono text-sm dark:border-white/20"
          aria-label={t[fieldKey]}
        />
      )}

      <p className="mt-2 font-mono text-xs opacity-60">{value}</p>
    </fieldset>
  );
}
