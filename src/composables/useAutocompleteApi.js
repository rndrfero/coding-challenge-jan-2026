import { ref } from "vue";
import { useApiRequest } from "./useApiRequest";
import { sanitizeSearchQuery } from "../utils/formatters";

export function useAutocompleteApi() {
  const { isLoading, error, executeRequest } = useApiRequest();
  const results = ref([]);

  const baseUrl = "/api/autocomplete";

  async function fetchStations(query) {
    const sanitized = sanitizeSearchQuery(query);

    if (!sanitized) {
      results.value = [];
      return;
    }

    await executeRequest(async () => {
      const res = await fetch(`${baseUrl}?q=${encodeURIComponent(sanitized)}`);
      if (!res.ok) {
        throw new Error("Failed to fetch stations");
      }
      const data = await res.json();
      // Expecting shape: { searchLocations: [...] }
      if (!data || typeof data !== "object") {
        throw new Error("Invalid response format: expected object");
      }
      results.value = Array.isArray(data.searchLocations)
        ? data.searchLocations
        : [];
    });
  }

  return { isLoading, error, results, fetchStations };
}
