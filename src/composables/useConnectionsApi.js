import { ref } from "vue";
import { useApiRequest } from "./useApiRequest";

export function useConnectionsApi() {
  const { isLoading, error, executeRequest } = useApiRequest();
  const connections = ref([]);

  async function searchConnections(params) {
    await executeRequest(async () => {
      const res = await fetch("/api/connections", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      });

      if (!res.ok) {
        throw new Error("Failed to fetch connections");
      }

      const data = await res.json();
      if (!Array.isArray(data)) {
        throw new Error("Invalid response format: expected array");
      }

      connections.value = data;
    });
  }

  return {
    isLoading,
    error,
    connections,
    searchConnections,
  };
}
