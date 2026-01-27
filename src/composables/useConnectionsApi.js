import { ref } from 'vue';

export function useConnectionsApi() {
  const isLoading = ref(false);
  const error = ref(null);
  const connections = ref([]);

  async function searchConnections(params) {
    isLoading.value = true;
    error.value = null;

    try {
      const res = await fetch('/api/connections', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(params),
      });

      if (!res.ok) {
        throw new Error('Failed to fetch connections');
      }

      connections.value = await res.json();
    } catch (err) {
      error.value = err.message || 'Unknown error';
    } finally {
      isLoading.value = false;
    }
  }

  return {
    isLoading,
    error,
    connections,
    searchConnections,
  };
}

