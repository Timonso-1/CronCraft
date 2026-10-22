export type TokenField = "second" | "minute" | "hour" | "dayOfMonth" | "month" | "dayOfWeek";

export interface ExpressionToken {
  text: string;
  /** Feld des Tokens, null bei Leerraum, Makros oder überzähligen Teilen */
  field: TokenField | null;
}

const FIVE: TokenField[] = ["minute", "hour", "dayOfMonth", "month", "dayOfWeek"];
const SIX: TokenField[] = ["second", ...FIVE];

/** Zerlegt einen Ausdruck in Tokens inklusive Leerraum, um ihn farbig darzustellen. */
export function tokenizeExpression(expression: string): ExpressionToken[] {
  const parts = expression.split(/(\s+)/).filter((p) => p !== "");
  const words = parts.filter((p) => !/^\s+$/.test(p));
  const order = words.length === 6 ? SIX : words.length === 5 ? FIVE : null;
  let i = 0;
  return parts.map((text) => {
    if (/^\s+$/.test(text)) return { text, field: null };
    const field = order ? (order[i] ?? null) : null;
    i++;
    return { text, field };
  });
}
