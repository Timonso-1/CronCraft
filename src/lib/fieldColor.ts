import type { TokenField } from "@/lib/cron/tokens";
import type { CSSProperties } from "react";

const VARS: Record<TokenField, string> = {
  second: "var(--f-second)",
  minute: "var(--f-minute)",
  hour: "var(--f-hour)",
  dayOfMonth: "var(--f-dom)",
  month: "var(--f-month)",
  dayOfWeek: "var(--f-dow)",
};

/** CSS-Variable --c mit der Feldfarbe, für `text-(--c)` usw. */
export function fieldStyle(field: TokenField | null): CSSProperties {
  return { ["--c" as string]: field ? VARS[field] : "var(--ink)" };
}
