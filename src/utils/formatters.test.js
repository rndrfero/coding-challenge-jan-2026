import { describe, it, expect } from "vitest";
import {
  formatTime,
  formatPrice,
  normalize,
  sanitizeSearchQuery,
} from "./formatters";
import { VALIDATION } from "../constants.js";

describe("formatters", () => {
  describe("formatTime", () => {
    it("formats ISO date string to time", () => {
      const result = formatTime("2025-12-08T08:30:00");
      expect(result).toMatch(/\d{2}:\d{2}/);
    });

    it("formats date with different times", () => {
      const morning = formatTime("2025-12-08T08:00:00");
      const afternoon = formatTime("2025-12-08T14:30:00");
      const evening = formatTime("2025-12-08T22:15:00");

      expect(morning).toMatch(/\d{2}:\d{2}/);
      expect(afternoon).toMatch(/\d{2}:\d{2}/);
      expect(evening).toMatch(/\d{2}:\d{2}/);
    });

    it("handles date with timezone", () => {
      const result = formatTime("2025-12-08T08:30:00Z");
      expect(result).toMatch(/\d{2}:\d{2}/);
    });

    it("handles invalid date strings", () => {
      expect(formatTime("invalid-date")).toBe("Invalid");
      expect(formatTime("not-a-date")).toBe("Invalid");
    });

    it("handles null and undefined", () => {
      expect(formatTime(null)).toBe("N/A");
      expect(formatTime(undefined)).toBe("N/A");
      expect(formatTime("")).toBe("N/A");
    });
  });

  describe("formatPrice", () => {
    it("converts cents to dollars with 2 decimals", () => {
      expect(formatPrice(1999)).toBe("19.99");
      expect(formatPrice(100)).toBe("1.00");
      expect(formatPrice(0)).toBe("0.00");
    });

    it("handles large amounts", () => {
      expect(formatPrice(100000)).toBe("1000.00");
      expect(formatPrice(123456)).toBe("1234.56");
    });

    it("handles null and undefined", () => {
      expect(formatPrice(null)).toBe("0.00");
      expect(formatPrice(undefined)).toBe("0.00");
    });

    it("handles single digit cents", () => {
      expect(formatPrice(1)).toBe("0.01");
      expect(formatPrice(10)).toBe("0.10");
    });
  });

  describe("normalize", () => {
    it("trims and lowercases strings", () => {
      expect(normalize("  Vienna  ")).toBe("vienna");
      expect(normalize("BERLIN")).toBe("berlin");
      expect(normalize("  Paris  ")).toBe("paris");
    });

    it("handles null and undefined", () => {
      expect(normalize(null)).toBe("");
      expect(normalize(undefined)).toBe("");
    });

    it("converts non-string to string", () => {
      expect(normalize(123)).toBe("123");
    });
  });

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

    it("limits length to MAX_SEARCH_QUERY_LENGTH", () => {
      const longString = "a".repeat(250);
      const result = sanitizeSearchQuery(longString);
      expect(result.length).toBe(VALIDATION.MAX_SEARCH_QUERY_LENGTH);
      expect(result).toBe("a".repeat(VALIDATION.MAX_SEARCH_QUERY_LENGTH));
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
});
