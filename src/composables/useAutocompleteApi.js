import { ref, computed } from "vue";
import { useFetch } from "@vueuse/core";
import { sanitizeSearchQuery } from "../utils/formatters";
import { API_ENDPOINTS, ERROR_MESSAGES } from "../constants";
import { AutocompleteResponseSchema } from "../schemas/autocomplete";
import { checkHttpError, createErrorComputed } from "./useApiHelpers";

export function useAutocompleteApi() {
  const query = ref("");
  const results = ref([]);

  const url = computed(() =>
    query.value
      ? `${API_ENDPOINTS.AUTOCOMPLETE}?q=${encodeURIComponent(query.value)}`
      : null,
  );

  // Helper to check if response is stale (URL changed during request)
  const isStaleResponse = (contextUrl) =>
    contextUrl && contextUrl !== url.value;

  // Helper to transform errors to user-friendly messages
  const transformError = (error, response) => {
    if (error.name === "AbortError" || error.name === "DOMException") {
      return null; // Ignore abort errors
    }
    if (error.name === "ApiError" || (response && !response.ok)) {
      return new Error(ERROR_MESSAGES.FETCH_STATIONS);
    }
    if (error.name === "ZodError") {
      return new Error(ERROR_MESSAGES.INVALID_RESPONSE_FORMAT);
    }
    return error;
  };

  const {
    isFetching,
    error: fetchError,
    abort,
    execute,
  } = useFetch(url, {
    immediate: false,
    refetch: false,
    afterFetch: ({ response, data, context }) => {
      checkHttpError(response);

      if (isStaleResponse(context?.url)) {
        return { data };
      }

      const validated = AutocompleteResponseSchema.parse(data);
      results.value = validated.searchLocations;
      return { data };
    },
    onFetchError: ({ error, context, response }) => {
      if (isStaleResponse(context?.url)) {
        return { error: null };
      }
      const transformedError = transformError(error, response);
      return { error: transformedError };
    },
  }).json();

  const error = createErrorComputed(fetchError);

  async function fetchStations(inputQuery) {
    const sanitized = sanitizeSearchQuery(inputQuery);

    if (!sanitized) {
      results.value = [];
      query.value = "";
      abort();
      return;
    }

    abort();
    query.value = sanitized;
    await execute(true);
  }

  return { isFetching, error, results, fetchStations };
}
