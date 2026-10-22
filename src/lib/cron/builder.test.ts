import { describe, expect, it } from "vitest";
import {
  everyStep,
  expressionToFields,
  fieldsToExpression,
  fieldToList,
  listToField,
} from "./builder";

describe("builder", () => {
  it("wandelt Felder in einen Ausdruck um", () => {
    expect(
      fieldsToExpression({ minute: "0", hour: "9", dayOfMonth: "*", month: "*", dayOfWeek: "1-5" }),
    ).toBe("0 9 * * 1-5");
  });

  it("leere Felder werden zu *", () => {
    expect(
      fieldsToExpression({ minute: " ", hour: "", dayOfMonth: "*", month: "*", dayOfWeek: "*" }),
    ).toBe("* * * * *");
  });

  it("zerlegt 5-Feld-Ausdrücke und lehnt andere ab", () => {
    expect(expressionToFields("*/5  1 * * 0")?.minute).toBe("*/5");
    expect(expressionToFields("* * * *")).toBeNull();
    expect(expressionToFields("* * * * * *")).toBeNull();
  });

  it("Listen-Hilfsfunktionen", () => {
    expect(listToField([5, 1, 3, 3])).toBe("1,3,5");
    expect(listToField([])).toBe("*");
    expect(fieldToList("1,3")).toEqual([1, 3]);
    expect(fieldToList("*")).toEqual([]);
    expect(fieldToList("*/5")).toBeNull();
  });

  it("everyStep", () => {
    expect(everyStep(1)).toBe("*");
    expect(everyStep(15)).toBe("*/15");
  });
});
