import { ref } from "vue";

export function useAutocompleteApi({ useMock = true } = {}) {
  const isLoading = ref(false);
  const error = ref(null);
  const results = ref([]);

  const baseUrl = useMock
    ? "/api/autocomplete"
    : import.meta.env.VITE_AUTOCOMPLETE_API_URL || "/api/autocomplete";

  async function fetchStations(query) {
    if (!query) {
      results.value = [];
      return;
    }

    isLoading.value = true;
    error.value = null;

    try {
      const res = await fetch(`${baseUrl}?q=${encodeURIComponent(query)}`);
      if (!res.ok) {
        throw new Error("Failed to fetch stations");
      }
      const data = await res.json();
      // Expecting shape: { searchLocations: [...] }
      results.value = Array.isArray(data.searchLocations)
        ? data.searchLocations
        : [];
    } catch (err) {
      error.value = err.message || "Unknown error";
    } finally {
      isLoading.value = false;
    }
  }

  return { isLoading, error, results, fetchStations };
}
