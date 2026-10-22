import { describe, expect, it } from "vitest";
import { MAX_PER_HOUR, weekGrid } from "./week";
import { tokenizeExpression } from "./tokens";

const from = new Date("2026-10-22T16:45:00Z"); // Do, 18:45 in Berlin

describe("weekGrid", () => {
  it("liefert 7 Tage ab heute", () => {
    const g = weekGrid("0 9 * * *", "Europe/Berlin", from);
    expect(g).toHaveLength(7);
    expect(g[0].date).toBe("2026-10-22");
    expect(g[0].weekday).toBe(4);
    expect(g[6].date).toBe("2026-10-28");
  });

  it("markiert vergangene Stunden und Ausführungen", () => {
    const g = weekGrid("0 9 * * 1-5", "Europe/Berlin", from);
    expect(g[0].hours[9]).toBe(-1); // heute 09:00 vorbei
    expect(g[1].hours[9]).toBe(1); // Fr
    expect(g[2].hours[9]).toBe(0); // Sa
    expect(g[4].hours[9]).toBe(1); // Mo (nach Zeitumstellung)
  });

  it("deckelt Ausführungen pro Stunde", () => {
    const g = weekGrid("* * * * *", "UTC", from);
    expect(g[1].hours[3]).toBe(MAX_PER_HOUR);
  });

  it("wirft bei ungültigem Ausdruck", () => {
    expect(() => weekGrid("nope", "UTC", from)).toThrow();
  });
});

describe("tokenizeExpression", () => {
  it("ordnet 5 Felder zu", () => {
    const fields = tokenizeExpression("0 9 * * 1-5").filter((t) => t.field).map((t) => t.field);
    expect(fields).toEqual(["minute", "hour", "dayOfMonth", "month", "dayOfWeek"]);
  });
  it("ordnet 6 Felder mit Sekunden zu", () => {
    expect(tokenizeExpression("*/5 0 9 * * *")[0].field).toBe("second");
  });
  it("behält Leerraum und markiert Makros neutral", () => {
    expect(tokenizeExpression("0  9").map((t) => t.text)).toEqual(["0", "  ", "9"]);
    expect(tokenizeExpression("@daily")[0].field).toBeNull();
  });
});
