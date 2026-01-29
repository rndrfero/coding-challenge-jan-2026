import { describe, it, expect } from "vitest";
import { formatTime, formatPrice } from "./formatters";

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
});
