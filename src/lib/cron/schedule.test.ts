import { describe, expect, it } from "vitest";
import { describeCron } from "./describe";
import { formatLocal, isValidTimezone, nextExecutions } from "./schedule";

const from = new Date("2026-10-22T16:45:00Z");

describe("nextExecutions", () => {
  it("berechnet tägliche Ausführungen in UTC", () => {
    const r = nextExecutions("0 9 * * *", { timezone: "UTC", count: 3, from });
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.executions.map((e) => e.local)).toEqual([
        "2026-10-23 09:00:00",
        "2026-10-24 09:00:00",
        "2026-10-25 09:00:00",
      ]);
    }
  });

  it("berücksichtigt Zeitzonen (Europe/Berlin = UTC+2 im Oktober)", () => {
    const r = nextExecutions("0 9 * * *", {
      timezone: "Europe/Berlin",
      count: 1,
      from,
    });
    expect(r.ok && r.executions[0].timestamp).toBe(
      Date.parse("2026-10-23T07:00:00Z"),
    );
  });

  it("behandelt die Zeitumstellung (25.10.2026, Berlin)", () => {
    const r = nextExecutions("0 9 * * *", {
      timezone: "Europe/Berlin",
      count: 3,
      from,
    });
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.executions.map((e) => e.local.slice(11, 16))).toEqual([
        "09:00",
        "09:00",
        "09:00",
      ]);
      // 25.10. 09:00 liegt nach der Umstellung auf UTC+1
      expect(new Date(r.executions[2].timestamp).toISOString()).toBe(
        "2026-10-25T08:00:00.000Z",
      );
    }
  });

  it("unterstützt Sekundenfeld (6 Felder)", () => {
    const r = nextExecutions("*/30 * * * * *", { timezone: "UTC", count: 2, from });
    expect(r.ok && r.executions.map((e) => e.local.slice(14))).toEqual([
      "45:30",
      "46:00",
    ]);
  });

  it("meldet ungültige Ausdrücke", () => {
    const r = nextExecutions("99 * * * *", { timezone: "UTC", from });
    expect(r.ok).toBe(false);
  });

  it("meldet ungültige Zeitzonen", () => {
    const r = nextExecutions("* * * * *", { timezone: "Foo/Bar", from });
    expect(r.ok).toBe(false);
  });
});

describe("isValidTimezone / formatLocal", () => {
  it("prüft Zeitzonen", () => {
    expect(isValidTimezone("Europe/Berlin")).toBe(true);
    expect(isValidTimezone("Nope")).toBe(false);
  });
  it("formatiert lokale Zeit", () => {
    expect(formatLocal(Date.parse("2026-01-01T00:00:00Z"), "Asia/Tokyo")).toBe(
      "2026-01-01 09:00:00",
    );
  });
});

describe("describeCron", () => {
  it("beschreibt auf Deutsch", () => {
    expect(describeCron("*/5 * * * *", "de")).toMatch(/5 Minuten/);
  });
  it("beschreibt auf Englisch", () => {
    expect(describeCron("0 9 * * 1-5", "en")).toMatch(/09:00 AM|09:00/);
  });
  it("wirft bei ungültigen Ausdrücken", () => {
    expect(() => describeCron("foo", "en")).toThrow();
  });
});
