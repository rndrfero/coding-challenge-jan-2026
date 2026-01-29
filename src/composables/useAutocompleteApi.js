import { ref } from "vue";
import { useApiRequest } from "./useApiRequest";
import { sanitizeSearchQuery } from "../utils/formatters";

export function useAutocompleteApi() {
  const { isLoading, error, executeRequest } = useApiRequest();
  const results = ref([]);

  const baseUrl = "/api/autocomplete";
  let abortController = null;
  let currentQuery = null;

  async function fetchStations(query) {
    const sanitized = sanitizeSearchQuery(query);

    if (!sanitized) {
      results.value = [];
      currentQuery = null;
      if (abortController) {
        abortController.abort();
        abortController = null;
      }
      return;
    }

    // Cancel previous request
    if (abortController) {
      abortController.abort();
    }

    // Create new request
    abortController = new AbortController();
    const signal = abortController.signal;
    currentQuery = sanitized;

    try {
      await executeRequest(async () => {
        const res = await fetch(
          `${baseUrl}?q=${encodeURIComponent(sanitized)}`,
          { signal },
        );

        if (!res.ok) {
          throw new Error("Failed to fetch stations");
        }

        const data = await res.json();

        // Only update if this is still the current query
        if (currentQuery === sanitized) {
          if (!data || typeof data !== "object") {
            throw new Error("Invalid response format: expected object");
          }
          results.value = Array.isArray(data.searchLocations)
            ? data.searchLocations
            : [];
        }
      });
    } catch (err) {
      // Ignore abort errors (always clear - they're expected)
      if (err.name === "AbortError") {
        error.value = null;
        return;
      }
      // Only propagate error if still current
      if (currentQuery === sanitized) {
        throw err;
      }
      // Clear stale error
      error.value = null;
    } finally {
      if (currentQuery === sanitized) {
        abortController = null;
      }
    }
  }

  return { isLoading, error, results, fetchStations };
}
