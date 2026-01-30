import { ref, computed } from "vue";
import { useFetch } from "@vueuse/core";
import { API_ENDPOINTS, ERROR_MESSAGES } from "../constants";
import { ConnectionsResponseSchema } from "../schemas/connections";
import {
  checkHttpError,
  createErrorComputed,
  snakeToCamel,
} from "./useApiHelpers";

export function useConnectionsApi() {
  const connections = ref([]);
  const payload = ref(null);

  const url = computed(() =>
    payload.value ? API_ENDPOINTS.CONNECTIONS : null,
  );

  const transformError = (error, response) => {
    if (error.name === "ApiError" || (response && !response.ok)) {
      return new Error(ERROR_MESSAGES.FETCH_CONNECTIONS);
    }
    if (error.name === "ZodError") {
      return new Error(ERROR_MESSAGES.INVALID_RESPONSE_ARRAY);
    }
    return error;
  };

  const {
    isFetching,
    error: fetchError,
    execute,
  } = useFetch(url, {
    immediate: false,
    refetch: false,
    beforeFetch: ({ options }) => {
      options.method = "POST";
      options.headers = {
        "Content-Type": "application/json",
        ...options.headers,
      };
      options.body = JSON.stringify(payload.value);
      return { options };
    },
    afterFetch: ({ response, data }) => {
      checkHttpError(response);
      connections.value = snakeToCamel(ConnectionsResponseSchema.parse(data));
      return { data };
    },
    onFetchError: ({ error, response }) => {
      const transformedError = transformError(error, response);
      return { error: transformedError };
    },
  }).json();

  const error = createErrorComputed(fetchError);

  const hasSearched = computed(() => payload.value !== null);

  async function searchConnections(params) {
    payload.value = params;
    await execute(true);
  }

  return {
    isFetching,
    error,
    connections,
    searchConnections,
    hasSearched,
  };
}
