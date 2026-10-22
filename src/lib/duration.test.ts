import { describe, expect, it } from "vitest";
import { formatDuration } from "./duration";

describe("formatDuration", () => {
  it("wählt passende Einheit", () => {
    expect(formatDuration(30_000, "en")).toBe("30 seconds");
    expect(formatDuration(15 * 60_000, "de")).toBe("15 Minuten");
    expect(formatDuration(90 * 60_000, "en")).toBe("1.5 hours");
    expect(formatDuration(86_400_000, "de")).toBe("1 Tag");
  });
});
