import { ref } from "vue";
import { useApiRequest } from "./useApiRequest";

export function useAutocompleteApi() {
  const { isLoading, error, executeRequest } = useApiRequest();
  const results = ref([]);

  const baseUrl = "/api/autocomplete";

  async function fetchStations(query) {
    if (!query) {
      results.value = [];
      return;
    }

    await executeRequest(async () => {
      const res = await fetch(`${baseUrl}?q=${encodeURIComponent(query)}`);
      if (!res.ok) {
        throw new Error("Failed to fetch stations");
      }
      const data = await res.json();
      // Expecting shape: { searchLocations: [...] }
      results.value = Array.isArray(data.searchLocations)
        ? data.searchLocations
        : [];
    });
  }

  return { isLoading, error, results, fetchStations };
}
