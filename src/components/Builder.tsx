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

/** Feld-Editor mit Reitern; die Reiter tragen die Farben aus dem Ausdruck. */
export function Builder({ fields, onChange, active, onActiveChange, t }: Props) {
  return (
    <section aria-labelledby="builder-title" className="space-y-4">
      <h2 id="builder-title" className="text-xl font-semibold tracking-tight">
        {t.builder}
      </h2>
      {!fields ? (
        <p className="text-ink-soft">{t.builderNeedsFive}</p>
      ) : (
        <div style={fieldStyle(active)} className="rounded-[16px] border border-rule bg-sheet">
          <div role="tablist" aria-label={t.builder} className="flex overflow-x-auto border-b border-rule">
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
                  className={`-mb-px flex shrink-0 flex-col items-start border-b-[3px] px-4 pt-3 pb-2 text-left transition-colors ${
                    selected ? "border-(--c)" : "border-transparent hover:border-(--c)/40"
                  }`}
                >
                  <span className={`text-sm ${selected ? "font-semibold text-ink" : "text-ink-soft"}`}>
                    {t[key]}
                  </span>
                  <span className="font-mono text-xs text-(--c)">{fields[key]}</span>
                </button>
              );
            })}
          </div>
          <div id="field-panel" role="tabpanel" aria-labelledby={`tab-${active}`} className="p-5">
            <FieldEditor
              fieldKey={active}
              value={fields[active]}
              onChange={(v) => onChange({ ...fields, [active]: v })}
              t={t}
            />
          </div>
        </div>
      )}
    </section>
  );
}
