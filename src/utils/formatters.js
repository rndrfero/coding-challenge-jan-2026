import { VALIDATION } from "../constants";

export function formatTime(dateString) {
  if (!dateString) return "N/A";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "Invalid";
  return date.toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function formatPrice(priceInCents) {
  return ((priceInCents ?? 0) / 100).toFixed(2);
}

export function normalize(value) {
  return String(value ?? "")
    .trim()
    .toLowerCase();
}

export function sanitizeSearchQuery(input) {
  if (input == null) return "";

  let value = String(input).trim();
  value = value.replace(/[\x00-\x1f\x7f]/g, "");

  if (value.length > VALIDATION.MAX_SEARCH_QUERY_LENGTH) {
    value = value.slice(0, VALIDATION.MAX_SEARCH_QUERY_LENGTH);
  }

  return value;
}
