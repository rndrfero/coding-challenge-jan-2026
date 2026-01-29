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

      connections.value = await res.json();
    });
  }

  return {
    isLoading,
    error,
    connections,
    searchConnections,
  };
}
