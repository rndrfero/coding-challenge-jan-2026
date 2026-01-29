const MAX_SEARCH_QUERY_LENGTH = 200;

/**
 * Sanitizes user input before sending to the autocomplete API.
 * - Trims whitespace
 * - Removes control characters and null bytes
 * - Limits length to prevent abuse
 */
export function sanitizeSearchQuery(input) {
  if (input == null) return "";

  let value = String(input).trim();

  // Remove control characters (0x00-0x1F) and DEL (0x7F)
  value = value.replace(/[\x00-\x1f\x7f]/g, "");

  // Limit length
  if (value.length > MAX_SEARCH_QUERY_LENGTH) {
    value = value.slice(0, MAX_SEARCH_QUERY_LENGTH);
  }

  return value;
}
