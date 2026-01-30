import { ref } from "vue";
import { useApiRequest } from "./useApiRequest";
import { sanitizeSearchQuery } from "../utils/formatters";
import { apiClient } from "../api/client";
import { API_ENDPOINTS, ERROR_MESSAGES } from "../constants";
import { AutocompleteResponseSchema } from "../schemas/autocomplete";

export function useAutocompleteApi() {
  const { isLoading, error, executeRequest } = useApiRequest();
  const results = ref([]);

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
        try {
          const res = await apiClient.get(
            `${API_ENDPOINTS.AUTOCOMPLETE}?q=${encodeURIComponent(sanitized)}`,
            { signal },
          );

          const data = await res.json();

          // Only update if this is still the current query
          if (currentQuery === sanitized) {
            const validated = AutocompleteResponseSchema.parse(data);
            results.value = validated.searchLocations;
          }
        } catch (err) {
          if (err.name === "ZodError") {
            throw new Error(ERROR_MESSAGES.INVALID_RESPONSE_FORMAT);
          }
          if (err.name === "ApiError") {
            throw new Error(ERROR_MESSAGES.FETCH_STATIONS);
          }
          throw err;
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
