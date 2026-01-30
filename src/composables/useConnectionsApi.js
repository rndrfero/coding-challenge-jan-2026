import { ref } from "vue";
import { useApiRequest } from "./useApiRequest";
import { apiClient } from "../api/client";
import { API_ENDPOINTS, ERROR_MESSAGES } from "../constants";
import { ConnectionsResponseSchema } from "../schemas/connections";

export function useConnectionsApi() {
  const { isLoading, error, executeRequest } = useApiRequest();
  const connections = ref([]);

  async function searchConnections(params) {
    await executeRequest(async () => {
      try {
        const res = await apiClient.post(API_ENDPOINTS.CONNECTIONS, params);

        const data = await res.json();
        connections.value = ConnectionsResponseSchema.parse(data);
      } catch (err) {
        if (err.name === "ZodError") {
          throw new Error(ERROR_MESSAGES.INVALID_RESPONSE_ARRAY);
        }
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
