import { ref } from "vue";
import { useApiRequest } from "./useApiRequest";
import { apiClient } from "../api/client";
import { API_ENDPOINTS, ERROR_MESSAGES } from "../constants";

export function useConnectionsApi() {
  const { isLoading, error, executeRequest } = useApiRequest();
  const connections = ref([]);

  async function searchConnections(params) {
    await executeRequest(async () => {
      try {
        const res = await apiClient.post(API_ENDPOINTS.CONNECTIONS, params);

        const data = await res.json();
        if (!Array.isArray(data)) {
          throw new Error(ERROR_MESSAGES.INVALID_RESPONSE_ARRAY);
        }

        connections.value = data;
      } catch (err) {
        // Convert ApiError to specific error message
        if (err.name === "ApiError") {
          throw new Error(ERROR_MESSAGES.FETCH_CONNECTIONS);
        }
        throw err;
      }
    });
  }

  return {
    isLoading,
    error,
    connections,
    searchConnections,
  };
}
