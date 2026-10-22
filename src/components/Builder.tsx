"use client";

import { FIELD_KEYS, type CronFields, type FieldKey } from "@/lib/cron/builder";
import { fieldStyle } from "@/lib/fieldColor";
import type { Messages } from "@/lib/i18n";
import { FieldEditor } from "./FieldEditor";

interface Props {
  fields: CronFields | null;
  onChange: (fields: CronFields) => void;
  active: FieldKey;
  onActiveChange: (field: FieldKey) => void;
  t: Messages;
}

/**
 * Feld-Editor: oben die fünf Felder als Auswahl (Name, Bereich, Wert, Erklärung),
 * darunter die Bearbeitung des gewählten Felds.
 */
export function Builder({ fields, onChange, active, onActiveChange, t }: Props) {
  if (!fields) {
    return <p className="rounded-xl border border-rule bg-sheet p-5 text-sm text-ink-soft">{t.builderNeedsFive}</p>;
  }

  return (
    <div id="editor" className="scroll-mt-20 space-y-3">
      <div role="tablist" aria-label={t.builder} className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-5">
        {FIELD_KEYS.map((key) => {
          const selected = key === active;
          return (
            <button
              key={key}
              role="tab"
              type="button"
              id={`tab-${key}`}
              aria-selected={selected}
              aria-controls="field-panel"
              onClick={() => onActiveChange(key)}
              style={fieldStyle(key)}
              className={`rounded-lg border border-t-2 px-3 py-2.5 text-left transition-colors ${
                selected ? "border-(--c)/50 border-t-(--c) bg-(--c)/10" : "border-rule border-t-(--c) bg-sheet hover:bg-sheet-2"
              }`}
            >
              <span className="flex items-baseline justify-between gap-2">
                <span className="text-sm font-medium">{t[key]}</span>
                <span className="font-mono text-[11px] text-ink-soft">{t.fieldRange[key]}</span>
              </span>
              <span className="mt-1 block truncate font-mono text-base text-(--c)">{fields[key]}</span>
              <span className="mt-0.5 block text-xs text-ink-soft">{t.fieldHelp[key]}</span>
            </button>
          );
        })}
      </div>

      <div
        id="field-panel"
        role="tabpanel"
        aria-labelledby={`tab-${active}`}
        style={fieldStyle(active)}
        className="rounded-xl border border-rule bg-sheet p-5"
      >
        <FieldEditor fieldKey={active} value={fields[active]} onChange={(v) => onChange({ ...fields, [active]: v })} t={t} />
      </div>
    </div>
  );
}
