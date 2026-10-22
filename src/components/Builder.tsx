"use client";

import { FIELD_KEYS, type CronFields, type FieldKey } from "@/lib/cron/builder";
import { fieldStyle } from "@/lib/fieldColor";
import type { Messages } from "@/lib/i18n";
import { Card } from "./Card";
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
    <Card id="editor" title={t.builder} subtitle={t.builderSub} bodyClassName="">
      {!fields ? (
        <p className="p-5 text-sm text-ink-soft">{t.builderNeedsFive}</p>
      ) : (
        <div style={fieldStyle(active)}>
          <div role="tablist" aria-label={t.builder} className="flex overflow-x-auto border-b border-rule px-2">
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
                  className={`-mb-px flex shrink-0 flex-col items-start gap-0.5 border-b-2 px-3 pt-3 pb-2.5 text-left transition-colors ${
                    selected ? "border-(--c)" : "border-transparent hover:border-rule"
                  }`}
                >
                  <span className={`text-sm ${selected ? "font-medium text-ink" : "text-ink-soft"}`}>{t[key]}</span>
                  <span className="rounded bg-(--c)/10 px-1.5 font-mono text-xs text-(--c)">{fields[key]}</span>
                </button>
              );
            })}
          </div>
          <div id="field-panel" role="tabpanel" aria-labelledby={`tab-${active}`} className="p-5">
            <FieldEditor fieldKey={active} value={fields[active]} onChange={(v) => onChange({ ...fields, [active]: v })} t={t} />
          </div>
        </div>
      )}
    </Card>
  );
}
