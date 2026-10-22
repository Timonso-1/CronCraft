import { describe, expect, it } from "vitest";
import { relativeTime } from "./relative";

describe("relativeTime", () => {
  const now = Date.parse("2026-10-22T12:00:00Z");
  it("Minuten", () => {
    expect(relativeTime(now + 5 * 60_000, now, "en")).toBe("in 5 minutes");
  });
  it("Tage (de)", () => {
    expect(relativeTime(now + 2 * 86_400_000, now, "de")).toBe("in 2 Tagen");
  });
});
