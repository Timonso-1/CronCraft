"use client";

import { FIELD_KEYS, type CronFields, type FieldKey } from "@/lib/cron/builder";
import type { Messages } from "@/lib/i18n";
import { FieldEditor } from "./FieldEditor";

interface Props {
  fields: CronFields | null;
  onChange: (fields: CronFields) => void;
  t: Messages;
}

export function Builder({ fields, onChange, t }: Props) {
  if (!fields) {
    return <p className="text-sm opacity-70">{t.builderNeedsFive}</p>;
  }
  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {FIELD_KEYS.map((key: FieldKey) => (
        <FieldEditor
          key={key}
          fieldKey={key}
          value={fields[key]}
          onChange={(v) => onChange({ ...fields, [key]: v })}
          t={t}
        />
      ))}
    </div>
  );
}
