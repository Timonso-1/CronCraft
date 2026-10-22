/** Felder eines Standard-Cron-Ausdrucks (5 Felder). */
export interface CronFields {
  minute: string;
  hour: string;
  dayOfMonth: string;
  month: string;
  dayOfWeek: string;
}

export const FIELD_KEYS = [
  "minute",
  "hour",
  "dayOfMonth",
  "month",
  "dayOfWeek",
] as const;

export type FieldKey = (typeof FIELD_KEYS)[number];

export const FIELD_RANGES: Record<FieldKey, { min: number; max: number }> = {
  minute: { min: 0, max: 59 },
  hour: { min: 0, max: 23 },
  dayOfMonth: { min: 1, max: 31 },
  month: { min: 1, max: 12 },
  dayOfWeek: { min: 0, max: 6 },
};

export const DEFAULT_FIELDS: CronFields = {
  minute: "0",
  hour: "9",
  dayOfMonth: "*",
  month: "*",
  dayOfWeek: "*",
};

export function fieldsToExpression(f: CronFields): string {
  return FIELD_KEYS.map((k) => f[k].trim() || "*").join(" ");
}

/**
 * Zerlegt einen 5-Feld-Ausdruck in seine Felder.
 * Gibt null zurück, wenn der Ausdruck nicht genau 5 Felder hat.
 */
export function expressionToFields(expression: string): CronFields | null {
  const parts = expression.trim().split(/\s+/);
  if (parts.length !== 5) return null;
  const [minute, hour, dayOfMonth, month, dayOfWeek] = parts;
  return { minute, hour, dayOfMonth, month, dayOfWeek };
}

/** Sortierte, eindeutige Zahlenliste als Cron-Feld ("1,3,5"); leer ergibt "*". */
export function listToField(values: number[]): string {
  const unique = [...new Set(values)].sort((a, b) => a - b);
  return unique.length === 0 ? "*" : unique.join(",");
}

/** Liest ein Feld mit reiner Zahlenliste ("1,3,5") zurück; sonst null. */
export function fieldToList(field: string): number[] | null {
  if (field === "*") return [];
  if (!/^\d+(,\d+)*$/.test(field)) return null;
  return field.split(",").map(Number);
}

/** Schrittfeld, z. B. every(15) -> "*\/15"; every(1) -> "*". */
export function everyStep(step: number): string {
  return step <= 1 ? "*" : `*/${step}`;
}
