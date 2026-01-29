import { describe, it, expect } from "vitest";
import { sanitizeSearchQuery } from "./sanitize";

describe("sanitizeSearchQuery", () => {
  it("trims whitespace", () => {
    expect(sanitizeSearchQuery("  vienna  ")).toBe("vienna");
    expect(sanitizeSearchQuery("\tvienna\n")).toBe("vienna");
  });

  it("removes control characters", () => {
    expect(sanitizeSearchQuery("vienna\x00")).toBe("vienna");
    expect(sanitizeSearchQuery("vienna\x1f")).toBe("vienna");
    expect(sanitizeSearchQuery("vienna\x7f")).toBe("vienna");
  });

  it("limits length to 200 characters", () => {
    const longString = "a".repeat(250);
    const result = sanitizeSearchQuery(longString);
    expect(result.length).toBe(200);
    expect(result).toBe("a".repeat(200));
  });

  it("handles null and undefined", () => {
    expect(sanitizeSearchQuery(null)).toBe("");
    expect(sanitizeSearchQuery(undefined)).toBe("");
  });

  it("handles empty strings", () => {
    expect(sanitizeSearchQuery("")).toBe("");
    expect(sanitizeSearchQuery("   ")).toBe("");
  });

  it("converts non-string to string", () => {
    expect(sanitizeSearchQuery(123)).toBe("123");
    expect(sanitizeSearchQuery(true)).toBe("true");
  });

  it("preserves valid input", () => {
    expect(sanitizeSearchQuery("Vienna")).toBe("Vienna");
    expect(sanitizeSearchQuery("New York")).toBe("New York");
    expect(sanitizeSearchQuery("Berlin Hauptbahnhof")).toBe(
      "Berlin Hauptbahnhof",
    );
  });

  it("handles special characters that are valid", () => {
    expect(sanitizeSearchQuery("São Paulo")).toBe("São Paulo");
    expect(sanitizeSearchQuery("München")).toBe("München");
    expect(sanitizeSearchQuery("Station-Name")).toBe("Station-Name");
  });
});
