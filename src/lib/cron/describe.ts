import cronstrue from "cronstrue";
import "cronstrue/locales/de";

export type Locale = "de" | "en";

/**
 * Liefert eine verständliche Beschreibung eines Cron-Ausdrucks.
 * Wirft einen Error bei ungültigen Ausdrücken.
 */
export function describeCron(expression: string, locale: Locale): string {
  return cronstrue.toString(expression.trim(), {
    locale,
    use24HourTimeFormat: true,
    throwExceptionOnParseError: true,
  });
}
